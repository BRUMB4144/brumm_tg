const { Bot, Api } = require('node-telegram-bot-api');
const config = require('../config');
const logger = require('../utils/logger');
const { runBroadcast } = require('./broadcastRunner');
const { startPollingSafely } = require('./polling');
const appSettingsService = require('../services/appSettingsService');
const { APP_PLATFORMS, PRO_MODE, TELEGRAM_API_ROOT } = require('../constants');

const STATE = {
  IDLE: null,
  WAITING_FOR_TEXT: 'waiting_for_text',
  WAITING_FOR_VIDEO: 'waiting_for_video',
  WAITING_FOR_BUTTON: 'waiting_for_button',
  PREVIEW: 'preview',
  BROADCASTING: 'broadcasting'
};

const CALLBACK = {
  SEND: 'broadcast_send',
  EDIT: 'broadcast_edit',
  NOOP: 'noop',
  // + платформа: pro_toggle:ios
  PRO_TOGGLE: 'pro_toggle:'
};

const CREATE_BROADCAST_BUTTON = 'Создать рассылку';
const PRO_MODE_BUTTON = 'Режим PRO';
const SKIP_ANSWERS = ['пропустить'];
const YES_ANSWERS = ['да', 'yes'];
const NO_ANSWERS = ['нет', 'no'];

const MAIN_KEYBOARD = {
  keyboard: [[{ text: CREATE_BROADCAST_BUTTON }, { text: PRO_MODE_BUTTON }]],
  resize_keyboard: true,
  one_time_keyboard: false
};

const PLATFORM_LABEL = { ios: 'iOS', android: 'Android' };
const MODE_LABEL = { [PRO_MODE.PAID]: 'платно', [PRO_MODE.FREE]: 'бесплатно' };
const oppositeMode = (mode) => (mode === PRO_MODE.FREE ? PRO_MODE.PAID : PRO_MODE.FREE);

/** Текст и кнопки режима PRO: у каждой платформы кнопка переключает на противоположный режим. */
const proModeMessage = (proMode) => ({
  text: [
    'Режим PRO в мобильном приложении:',
    ...APP_PLATFORMS.map((platform) => `${PLATFORM_LABEL[platform]}: ${MODE_LABEL[proMode[platform]]}`),
    '',
    'Бесплатно — PRO нет, весь контент открыт всем, оплаты и надписей PRO нет.',
    'Приложение подхватит режим при следующем открытии.'
  ].join('\n'),
  reply_markup: {
    inline_keyboard: APP_PLATFORMS.map((platform) => [
      {
        text: `${PLATFORM_LABEL[platform]} → ${MODE_LABEL[oppositeMode(proMode[platform])]}`,
        callback_data: `${CALLBACK.PRO_TOGGLE}${platform}`
      }
    ])
  }
});

/**
 * Черновики рассылок по чатам администраторов.
 * Хранятся в памяти процесса: незавершённый черновик теряется при рестарте.
 */
class BroadcastDraftStore {
  #drafts = new Map();

  get(chatId) {
    if (!this.#drafts.has(chatId)) {
      this.#drafts.set(chatId, { state: STATE.IDLE, text: null, video: null, withButton: false });
    }
    return this.#drafts.get(chatId);
  }

  reset(chatId) {
    this.#drafts.delete(chatId);
    return this.get(chatId);
  }
}

/**
 * Пускает только админов из TELEGRAM_ADMIN_CHAT_IDS и только в личном чате:
 * в группе черновик общий на чат, и кнопку «Отправить» мог бы нажать любой участник.
 */
const isAdmin = (adminIds, from, chat) =>
  Boolean(from) && chat?.type === 'private' && adminIds.includes(String(from.id));

/**
 * Админский бот: пошагово собирает рассылку (текст → видео → кнопка → предпросмотр)
 * и запускает её через бот-отправитель.
 */
const createAdminBot = ({ adminIds = config.telegram.adminChatIds } = {}) => {
  const adminBot = new Bot(config.telegram.adminBotToken, { apiRoot: TELEGRAM_API_ROOT });
  // Бот-отправитель только рассылает, апдейты он не получает.
  const broadcastBot = new Api(config.telegram.broadcastBotToken, { apiRoot: TELEGRAM_API_ROOT });
  const drafts = new BroadcastDraftStore();

  if (adminIds.length === 0) {
    logger.warn('TELEGRAM_ADMIN_CHAT_IDS не задан: админский бот никому не отвечает');
  }

  const sendMessage = (chatId, text, extra = {}) =>
    adminBot.api.sendMessage({ chat_id: chatId, text, ...extra });

  const denyAccess = (msg) => {
    logger.warn(`Админский бот: отказ в доступе from.id=${msg.from?.id}, chat.id=${msg.chat?.id}`);
    // ID отдаём, чтобы админ мог вписать его в TELEGRAM_ADMIN_CHAT_IDS.
    return sendMessage(msg.chat.id, `Нет доступа. Ваш Telegram ID: ${msg.from?.id}`)
      .catch((error) => logger.warn('Админский бот: не удалось ответить на /start:', error.message));
  };

  const askForText = (chatId) => {
    const draft = drafts.reset(chatId);
    draft.state = STATE.WAITING_FOR_TEXT;
    return sendMessage(
      chatId,
      'Пожалуйста, введите текст сообщения для рассылки.\n\nВы также сможете прикрепить видео после ввода текста.'
    );
  };

  const sendProMode = async (chatId) => {
    const { text, reply_markup } = proModeMessage(await appSettingsService.getProMode());
    return sendMessage(chatId, text, { reply_markup });
  };

  const toggleProMode = async (ctx, chatId, platform) => {
    const current = await appSettingsService.getProMode();
    const next = oppositeMode(current[platform]);
    await appSettingsService.setProMode(platform, next);
    logger.info(`Админский бот: режим PRO ${platform} → ${next}, from.id=${ctx.callbackQuery.from.id}`);
    await ctx.answerCallbackQuery({ text: `${PLATFORM_LABEL[platform]}: ${MODE_LABEL[next]}` });
    await sendProMode(chatId);
  };

  const sendPreview = (chatId, draft) => {
    const inlineKeyboard = [
      [
        { text: 'Отправить', callback_data: CALLBACK.SEND },
        { text: 'Изменить', callback_data: CALLBACK.EDIT }
      ]
    ];

    if (draft.withButton) {
      inlineKeyboard.push([{ text: 'WebApp-кнопка будет добавлена', callback_data: CALLBACK.NOOP }]);
    }

    const options = { parse_mode: 'Markdown', reply_markup: { inline_keyboard: inlineKeyboard } };

    return draft.video
      ? adminBot.api.sendVideo({ chat_id: chatId, video: draft.video.fileId, ...options, caption: draft.text })
      : sendMessage(chatId, draft.text, options);
  };

  const handleVideoStep = (chatId, draft, msg) => {
    if (msg.video) {
      // message_id нужен, чтобы разослать видео копией, не загружая его заново.
      draft.video = { fileId: msg.video.file_id, messageId: msg.message_id };
      draft.state = STATE.WAITING_FOR_BUTTON;
      return sendMessage(chatId, 'Прикрепить кнопку с ссылкой на WebApp? (да/нет)');
    }

    if (msg.text && SKIP_ANSWERS.includes(msg.text.trim().toLowerCase())) {
      draft.video = null;
      draft.state = STATE.WAITING_FOR_BUTTON;
      return sendMessage(chatId, 'Прикрепить кнопку с ссылкой на WebApp? (да/нет)');
    }

    return sendMessage(chatId, 'Пожалуйста, отправьте видео или напишите "Пропустить".');
  };

  const handleButtonStep = (chatId, draft, text) => {
    const answer = text.trim().toLowerCase();

    if (!YES_ANSWERS.includes(answer) && !NO_ANSWERS.includes(answer)) {
      return sendMessage(chatId, 'Пожалуйста, ответьте "да" или "нет".');
    }

    draft.withButton = YES_ANSWERS.includes(answer);
    draft.state = STATE.PREVIEW;
    return sendPreview(chatId, draft);
  };

  const startBroadcast = async (chatId, draft) => {
    try {
      const { successCount, failureCount } = await runBroadcast({
        text: draft.text,
        withButton: draft.withButton,
        // Видео рассылается копией исходного сообщения из чата администратора.
        source: draft.video ? { chatId, messageId: draft.video.messageId } : null,
        bot: broadcastBot
      });

      await sendMessage(
        chatId,
        `Рассылка завершена! Успешно: ${successCount}, Ошибок: ${failureCount}`
      );
    } catch (error) {
      logger.error('Ошибка рассылки:', error.message);
      await sendMessage(chatId, `Ошибка рассылки: ${error.message}`);
    } finally {
      drafts.reset(chatId);
    }
  };

  adminBot.command('start', (ctx) => {
    const msg = ctx.message;
    if (!isAdmin(adminIds, msg.from, msg.chat)) {
      denyAccess(msg);
      return;
    }

    drafts.reset(msg.chat.id);
    sendMessage(
      msg.chat.id,
      'Добро пожаловать в панель управления рассылкой!\n\nНажмите кнопку ниже, чтобы создать новую рассылку.',
      { reply_markup: MAIN_KEYBOARD }
    );
  });

  adminBot.command('pro', async (ctx) => {
    const msg = ctx.message;
    if (!isAdmin(adminIds, msg.from, msg.chat)) {
      denyAccess(msg);
      return;
    }
    try {
      await sendProMode(msg.chat.id);
    } catch (error) {
      logger.error('Админский бот: не удалось показать режим PRO:', error.message);
    }
  });

  adminBot.on('message', async (ctx) => {
    const msg = ctx.message;
    const chatId = msg.chat.id;

    // Чужим молча ничего не делаем: на /start отказ уже отправлен выше.
    if (!isAdmin(adminIds, msg.from, msg.chat)) {
      return;
    }

    try {
      if (msg.text === CREATE_BROADCAST_BUTTON) {
        await askForText(chatId);
        return;
      }

      if (msg.text === PRO_MODE_BUTTON) {
        await sendProMode(chatId);
        return;
      }

      const draft = drafts.get(chatId);

      if (draft.state === STATE.WAITING_FOR_TEXT && msg.text) {
        draft.text = msg.text;
        draft.state = STATE.WAITING_FOR_VIDEO;
        await sendMessage(
          chatId,
          'Теперь отправьте видео для рассылки или напишите "Пропустить", если видео не требуется.'
        );
        return;
      }

      if (draft.state === STATE.WAITING_FOR_VIDEO) {
        await handleVideoStep(chatId, draft, msg);
        return;
      }

      if (draft.state === STATE.WAITING_FOR_BUTTON && msg.text) {
        await handleButtonStep(chatId, draft, msg.text);
      }
    } catch (error) {
      logger.error('Ошибка обработки сообщения админского бота:', error.message);
    }
  });

  adminBot.on('callback_query', async (ctx) => {
    const query = ctx.callbackQuery;
    if (!query.message || !isAdmin(adminIds, query.from, query.message.chat)) {
      ctx.answerCallbackQuery({ text: 'Нет доступа' }).catch(() => {});
      return;
    }

    const chatId = query.message.chat.id;

    // Режим PRO не зависит от черновика рассылки — до проверки его состояния.
    const platform = query.data?.startsWith(CALLBACK.PRO_TOGGLE)
      ? query.data.slice(CALLBACK.PRO_TOGGLE.length)
      : null;
    if (platform) {
      try {
        if (!APP_PLATFORMS.includes(platform)) {
          await ctx.answerCallbackQuery({ text: 'Неизвестная платформа' });
          return;
        }
        await toggleProMode(ctx, chatId, platform);
      } catch (error) {
        logger.error('Админский бот: не удалось сменить режим PRO:', error.message);
        await ctx.answerCallbackQuery({ text: 'Не удалось сменить режим' }).catch(() => {});
      }
      return;
    }

    const draft = drafts.get(chatId);

    if (draft.state !== STATE.PREVIEW) {
      return;
    }

    try {
      if (query.data === CALLBACK.SEND) {
        draft.state = STATE.BROADCASTING;
        await ctx.answerCallbackQuery({ text: 'Рассылка запущена' });
        await sendMessage(chatId, 'Начинаю рассылку...');
        await startBroadcast(chatId, draft);
        return;
      }

      if (query.data === CALLBACK.EDIT) {
        await ctx.answerCallbackQuery({ text: 'Измените сообщение' });
        const refreshed = drafts.reset(chatId);
        refreshed.state = STATE.WAITING_FOR_TEXT;
        await sendMessage(chatId, 'Введите новый текст сообщения для рассылки.');
      }
    } catch (error) {
      logger.error('Ошибка обработки нажатия в админском боте:', error.message);
    }
  });

  adminBot.catch((error) => logger.error('Ошибка обработки обновления админского бота:', error.message));
  startPollingSafely(adminBot, 'админского бота');

  return { adminBot, broadcastBot };
};

module.exports = { createAdminBot, isAdmin };

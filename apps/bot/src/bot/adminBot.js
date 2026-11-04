const { Bot, Api } = require('node-telegram-bot-api');
const config = require('../config');
const logger = require('../utils/logger');
const { createBroadcastDialog } = require('./broadcastDialog');
const { startPollingSafely } = require('./polling');
const { createProControls } = require('./proControls');
const { APP_PLATFORMS, TELEGRAM_API_ROOT } = require('../constants');

const { STATE, BroadcastDraftStore } = require('./broadcastDrafts');

const CALLBACK = {
  SEND: 'broadcast_send',
  EDIT: 'broadcast_edit',
  NOOP: 'noop',
  // + платформа: pro_toggle:ios
  PRO_TOGGLE: 'pro_toggle:'
};

const CREATE_BROADCAST_BUTTON = 'Создать рассылку';
const PRO_MODE_BUTTON = 'Режим PRO';

const MAIN_KEYBOARD = {
  keyboard: [[{ text: CREATE_BROADCAST_BUTTON }, { text: PRO_MODE_BUTTON }]],
  resize_keyboard: true,
  one_time_keyboard: false
};

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

  const { sendProMode, toggleProMode } = createProControls(sendMessage);

  const { askForText, handleVideoStep, handleButtonStep, startBroadcast, drain } =
    createBroadcastDialog({ adminBot, broadcastBot, drafts, sendMessage });
  adminBot.drain = drain;

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

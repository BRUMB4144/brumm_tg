const { runBroadcast } = require('./broadcastRunner');
const { STATE } = require('./broadcastDrafts');
const logger = require('../utils/logger');
const CALLBACK = { SEND: 'broadcast_send', EDIT: 'broadcast_edit', NOOP: 'noop' };
const SKIP_ANSWERS = ['пропустить'];
const YES_ANSWERS = ['да', 'yes'];
const NO_ANSWERS = ['нет', 'no'];

const createBroadcastDialog = ({ adminBot, broadcastBot, drafts, sendMessage }) => {
  const active = new Set();
  const askForText = (chatId) => {
    const draft = drafts.reset(chatId);
    draft.state = STATE.WAITING_FOR_TEXT;
    return sendMessage(
      chatId,
      'Пожалуйста, введите текст сообщения для рассылки.\n\nВы также сможете прикрепить видео после ввода текста.'
    );
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

  const deliverBroadcast = async (chatId, draft) => {
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

  const startBroadcast = (chatId, draft) => {
    const work = deliverBroadcast(chatId, draft);
    active.add(work);
    return work.finally(() => active.delete(work));
  };
  const drain = () => Promise.allSettled([...active]);
  return { askForText, handleVideoStep, handleButtonStep, startBroadcast, drain };
};
module.exports = { createBroadcastDialog };

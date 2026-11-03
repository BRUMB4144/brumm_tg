const logger = require('../utils/logger');
const { delay } = require('../utils/time');
const { buildWebAppKeyboard } = require('../utils/telegram');
const { getBroadcastRecipients } = require('../services/gusevApi');
const { BROADCAST } = require('../constants');

const RATE_LIMIT_CODE = 429;

/**
 * Сколько ждать после 429. Библиотека уже сама ждёт retry_after до 60 с;
 * сюда доходит то, что дольше, поэтому ждём ровно столько, сколько просит Telegram.
 */
const retryAfterMs = (error) =>
  (error.retryAfter ?? BROADCAST.DEFAULT_RETRY_AFTER_SECONDS) * 1000;

const isRateLimitError = (error) => error.errorCode === RATE_LIMIT_CODE;

/**
 * Доставляет одно сообщение: копией исходного (если задан `source`) либо новым текстом.
 * Копия нужна, чтобы разослать видео, не загружая его повторно для каждого получателя.
 */
const deliverMessage = async (api, telegramId, { text, source, withButton }) => {
  const replyMarkup = withButton ? buildWebAppKeyboard() : undefined;
  const options = { parse_mode: 'Markdown', ...(replyMarkup ? { reply_markup: replyMarkup } : {}) };

  if (source) {
    return api.copyMessage({
      chat_id: telegramId,
      from_chat_id: source.chatId,
      message_id: source.messageId,
      ...options,
      caption: text
    });
  }
  return api.sendMessage({ chat_id: telegramId, text, ...options });
};

/**
 * Отправляет сообщение одному пользователю с повторами при превышении лимита Telegram.
 * Возвращает true, если сообщение доставлено.
 */
const deliverWithRetries = async (api, telegramId, payload, sleep = delay) => {
  for (let attempt = 1; attempt <= BROADCAST.MAX_ATTEMPTS_PER_USER; attempt += 1) {
    try {
      await deliverMessage(api, telegramId, payload);
      return true;
    } catch (error) {
      if (!isRateLimitError(error)) {
        logger.warn(`Рассылка: ошибка отправки пользователю ${telegramId}: ${error.message}`);
        return false;
      }
      await sleep(retryAfterMs(error));
    }
  }

  logger.warn(`Рассылка: не удалось отправить пользователю ${telegramId} за ${BROADCAST.MAX_ATTEMPTS_PER_USER} попыток`);
  return false;
};

/**
 * Рассылает сообщение всем пользователям с telegramId, пакетами и с паузами,
 * чтобы не превысить лимиты Telegram Bot API.
 *
 * @param {object}   payload
 * @param {string}   payload.text          Текст сообщения или подпись к копии.
 * @param {boolean} [payload.withButton]   Добавить кнопку запуска WebApp.
 * @param {object}  [payload.source]       `{ chatId, messageId }` для copyMessage.
 * @param {object}   payload.bot           Клиент Api бота-отправителя.
 * @returns {Promise<{successCount: number, failureCount: number, totalUsers: number}>}
 */
const runBroadcast = async ({
  text,
  withButton = true,
  source,
  bot,
  getRecipients = getBroadcastRecipients,
  sleep = delay
} = {}) => {
  if (!bot) throw new Error('Не задан Telegram API клиент для рассылки');
  if (!text) throw new Error('Не задан текст рассылки');

  let successCount = 0;
  let failureCount = 0;
  let totalUsers = 0;
  let after;

  do {
    const page = await getRecipients({ after, limit: BROADCAST.BATCH_SIZE });
    const users = page.items;
    totalUsers += users.length;

    for (const user of users) {
      const delivered = await deliverWithRetries(
        bot,
        user.telegramId,
        { text, withButton, source },
        sleep
      );

      if (delivered) {
        successCount += 1;
      } else {
        failureCount += 1;
      }

      await sleep(BROADCAST.DELAY_BETWEEN_MESSAGES_MS);
    }

    after = page.nextCursor || undefined;
    if (after) {
      await sleep(BROADCAST.DELAY_BETWEEN_BATCHES_MS);
    }
  } while (after);

  logger.info(`Рассылка завершена. Успешно: ${successCount}, ошибок: ${failureCount}`);
  return { successCount, failureCount, totalUsers };
};

module.exports = { deliverMessage, deliverWithRetries, runBroadcast };

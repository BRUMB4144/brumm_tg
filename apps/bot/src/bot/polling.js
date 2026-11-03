const logger = require('../utils/logger');

/**
 * Запускает long polling в фоне. Библиотека сама повторяет запросы при сетевых сбоях,
 * 429 и 409 (второй экземпляр бота), поэтому сюда попадает только то, что не удалось пережить.
 * `startPolling` завершается при `bot.stop()`, ждать его не нужно.
 */
const startPollingSafely = (bot, label) => {
  bot
    .startPolling(undefined, {
      onError: (error) => logger.error(`Ошибка polling ${label}:`, error.message)
    })
    .catch((error) => logger.error(`Polling ${label} остановлен:`, error.message));
};

module.exports = { startPollingSafely };

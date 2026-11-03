const { createMainBot } = require('./mainBot');
const { createAdminBot } = require('./adminBot');
const config = require('../config');
const logger = require('../utils/logger');

let bots = [];

/** Поднимает Telegram-ботов. Вызывается после успешного подключения к базе. */
const startBots = () => {
  const mainBot = createMainBot();
  bots = [mainBot];

  // Токены админского бота и бота рассылок задаются только через env.
  if (!config.telegram.adminBotToken || !config.telegram.broadcastBotToken) {
    logger.warn('TELEGRAM_ADMIN_BOT_TOKEN / TELEGRAM_BROADCAST_BOT_TOKEN не заданы, админский бот не запущен');
    logger.info('Telegram-боты запущены');
    return { mainBot };
  }

  const { adminBot, broadcastBot } = createAdminBot();
  bots.push(adminBot, broadcastBot);
  logger.info('Telegram-боты запущены');

  return { mainBot, adminBot, broadcastBot };
};

/** Останавливает polling, чтобы процесс мог завершиться штатно. */
const stopBots = () => {
  bots.forEach((bot) => {
    try {
      bot.stop?.();
    } catch (error) {
      logger.warn('Ошибка остановки бота:', error.message);
    }
  });
  bots = [];
};

module.exports = { startBots, stopBots };

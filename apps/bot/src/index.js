require('dotenv').config();

const fs = require('fs');
const config = require('./config');
const logger = require('./utils/logger');
const { startBots, stopBots } = require('./bot');

const SHUTDOWN_SIGNALS = ['SIGINT', 'SIGTERM'];

const assertWelcomeVideo = () => {
  fs.accessSync(config.welcomeVideoPath, fs.constants.R_OK);
};

const registerShutdownHandlers = () => {
  let shuttingDown = false;
  const shutdown = (signal) => {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.info(`Получен ${signal}, останавливаю ботов...`);
    stopBots();
    process.exit(0);
  };
  SHUTDOWN_SIGNALS.forEach((signal) => process.once(signal, () => shutdown(signal)));
  process.on('unhandledRejection', (reason) => logger.error('Необработанное отклонение промиса:', reason));
};

const start = () => {
  config.assertRequired();
  assertWelcomeVideo();
  startBots();
  registerShutdownHandlers();
};

if (require.main === module) {
  try {
    start();
  } catch (error) {
    logger.error('Не удалось запустить Telegram-боты:', error);
    process.exit(1);
  }
}

module.exports = { assertWelcomeVideo, start };

const config = require('../config');

const format = (level, args) => [`[${new Date().toISOString()}] [${level}]`, ...args];

const logger = {
  info: (...args) => console.log(...format('INFO', args)),
  warn: (...args) => console.warn(...format('WARN', args)),
  error: (...args) => console.error(...format('ERROR', args)),
  // Отладочные сообщения молчат в продакшене, чтобы не засорять логи.
  debug: (...args) => {
    if (!config.isProduction) {
      console.log(...format('DEBUG', args));
    }
  }
};

module.exports = logger;

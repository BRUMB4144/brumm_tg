const config = require('../config');

const buildWebAppKeyboard = (text = 'Запустить приложение') => ({
  inline_keyboard: [[{ text, web_app: { url: config.webAppUrl } }]]
});

module.exports = { buildWebAppKeyboard };

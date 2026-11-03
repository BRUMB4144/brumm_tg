const path = require('path');

const toInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const config = {
  isProduction: process.env.NODE_ENV === 'production',
  gusevApi: {
    baseUrl: (process.env.GUSEV_API_URL || 'https://gusefwebapp.pro/api').replace(/\/$/, ''),
    serviceToken: process.env.TELEGRAM_SERVICE_TOKEN,
    timeoutMs: toInt(process.env.GUSEV_API_TIMEOUT_MS, 10_000)
  },
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    adminBotToken: process.env.TELEGRAM_ADMIN_BOT_TOKEN,
    broadcastBotToken: process.env.TELEGRAM_BROADCAST_BOT_TOKEN,
    adminChatIds: (process.env.TELEGRAM_ADMIN_CHAT_IDS || '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean),
    supportUsername: process.env.TELEGRAM_SUPPORT_USERNAME || '@GuseffGo'
  },
  webAppUrl: process.env.WEBAPP_URL || 'https://front.gusefwebapp.pro/',
  welcomeVideoPath: path.resolve(
    process.env.WELCOME_VIDEO_PATH || path.join(process.cwd(), 'shared', 'video.mp4')
  )
};

config.assertRequired = () => {
  const missing = [
    ['TELEGRAM_BOT_TOKEN', config.telegram.botToken],
    ['TELEGRAM_SERVICE_TOKEN', config.gusevApi.serviceToken],
    ['WELCOME_VIDEO_PATH', process.env.WELCOME_VIDEO_PATH]
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missing.length > 0) {
    throw new Error(`Не заданы обязательные переменные окружения: ${missing.join(', ')}`);
  }
};

module.exports = config;

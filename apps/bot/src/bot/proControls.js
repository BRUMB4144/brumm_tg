const appSettingsService = require('../services/gusevApi');
const logger = require('../utils/logger');
const { APP_PLATFORMS, PRO_MODE } = require('../constants');
const CALLBACK = { PRO_TOGGLE: 'pro_toggle:' };

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

const createProControls = (sendMessage) => {
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

  return { sendProMode, toggleProMode };
};
module.exports = { createProControls };

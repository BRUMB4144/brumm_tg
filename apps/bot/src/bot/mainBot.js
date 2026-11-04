const { Bot } = require('node-telegram-bot-api');
const { fromPath } = require('node-telegram-bot-api/node');
const config = require('../config');
const { TELEGRAM_API_ROOT } = require('../constants');
const logger = require('../utils/logger');
const { buildWebAppKeyboard } = require('../utils/telegram');
const { trackStartParam } = require('../services/gusevApi');

const { startPollingSafely } = require('./polling');

const buildWelcomeCaption = (firstName) =>
  `${firstName}, привет 👋\n\n` +
  '📲 Это приложение Guseff Go. Здесь собраны онлайн-курсы, решение билетов, симулятор экзамена ' +
  'и парковки, видеоразборы — всё для быстрой и уверенной сдачи на права\n\n' +
  '👆Выше краткая видео-инструкция по основным разделам приложения\n\n' +
  `По всем вопросам — ${config.telegram.supportUsername}\n\n` +
  'Запускай приложение по кнопке ниже 👇';

/**
 * Пользовательский бот: обрабатывает /start, учитывает deep-link переходы
 * и отправляет приветственное видео с кнопкой запуска WebApp.
 */
const createMainBot = () => {
  const bot = new Bot(config.telegram.botToken, { apiRoot: TELEGRAM_API_ROOT });

  // ctx.match — аргументы после /start (deep-link), пустая строка, если их нет.
  bot.command('start', async (ctx) => {
    const { from, chat } = ctx;
    const startParam = ctx.match || undefined;

    try {
      await trackStartParam(startParam, from.id, from.username ?? null);
    } catch (error) {
      // Учёт перехода не должен оставлять пользователя без приветствия.
      logger.error(`Не удалось учесть /start от ${from.id}:`, error.message);
    }

    try {
      await ctx.api.sendVideo({
        chat_id: chat.id,
        video: await fromPath(config.welcomeVideoPath),
        caption: buildWelcomeCaption(from.first_name || 'Пользователь'),
        parse_mode: 'Markdown',
        reply_markup: buildWebAppKeyboard()
      });
    } catch (error) {
      logger.error(`Ошибка обработки /start от ${from.id}:`, error.message);
    }
  });

  bot.catch((error) => logger.error('Ошибка обработки обновления основного бота:', error.message));
  startPollingSafely(bot, 'основного бота');

  return bot;
};

module.exports = { buildWelcomeCaption, createMainBot };

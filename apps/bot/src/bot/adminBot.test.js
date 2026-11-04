const test = require('node:test');
const assert = require('node:assert');
const { Bot, Api } = require('node-telegram-bot-api');

const config = require('../config');
const { createAdminBot, isAdmin } = require('./adminBot');

const ADMIN_ID = 111;
const STRANGER_ID = 222;

const privateMessage = (fromId, text) => ({
  message_id: 1,
  date: 0,
  from: { id: fromId, is_bot: false, first_name: 'x' },
  chat: { id: fromId, type: 'private' },
  text,
  ...(text.startsWith('/') ? { entities: [{ type: 'bot_command', offset: 0, length: text.length }] } : {})
});

/** Поднимает админ-бота без сети: polling и отправка заглушены, ответы копятся в sent. */
const setupBot = (t, adminIds) => {
  config.telegram.adminBotToken = 'test-admin-token';
  config.telegram.broadcastBotToken = 'test-broadcast-token';
  t.mock.method(Bot.prototype, 'startPolling', async () => {});
  const sent = [];
  t.mock.method(Api.prototype, 'sendMessage', async ({ chat_id, text }) => {
    sent.push({ chatId: chat_id, text });
  });
  const answered = [];
  t.mock.method(Api.prototype, 'answerCallbackQuery', async ({ text }) => {
    answered.push(text);
  });
  const { adminBot } = createAdminBot({ adminIds });
  // handleUpdate возвращает промис: ждём обработку обновления целиком.
  const send = (update) => adminBot.handleUpdate(update);
  return { send, sent, answered };
};

test('isAdmin: только ID из списка и только личный чат', () => {
  const ids = [String(ADMIN_ID)];
  assert.strictEqual(isAdmin(ids, { id: ADMIN_ID }, { type: 'private' }), true);
  assert.strictEqual(isAdmin(ids, { id: STRANGER_ID }, { type: 'private' }), false);
  assert.strictEqual(isAdmin(ids, { id: ADMIN_ID }, { type: 'group' }), false);
  assert.strictEqual(isAdmin(ids, undefined, { type: 'private' }), false);
  assert.strictEqual(isAdmin([], { id: ADMIN_ID }, { type: 'private' }), false);
});

test('админ-бот: чужому на /start — отказ с его ID, рассылку начать нельзя', async (t) => {
  const { send, sent } = setupBot(t, [String(ADMIN_ID)]);

  await send({ update_id: 1, message: privateMessage(STRANGER_ID, '/start') });
  await send({ update_id: 2, message: privateMessage(STRANGER_ID, 'Создать рассылку') });
  await send({ update_id: 3, message: privateMessage(STRANGER_ID, 'текст рассылки') });

  assert.deepStrictEqual(sent, [{ chatId: STRANGER_ID, text: `Нет доступа. Ваш Telegram ID: ${STRANGER_ID}` }]);
});

test('админ-бот: чужое нажатие «Отправить» не запускает рассылку', async (t) => {
  const { send, sent, answered } = setupBot(t, [String(ADMIN_ID)]);

  await send({
    update_id: 1,
    callback_query: {
      id: 'q1',
      from: { id: STRANGER_ID },
      message: { message_id: 5, chat: { id: STRANGER_ID, type: 'private' } },
      data: 'broadcast_send'
    }
  });

  assert.deepStrictEqual(answered, ['Нет доступа']);
  assert.deepStrictEqual(sent, []);
});

test('админ-бот: админ из списка проходит сценарий', async (t) => {
  const { send, sent } = setupBot(t, [String(ADMIN_ID)]);

  await send({ update_id: 1, message: privateMessage(ADMIN_ID, '/start') });
  await send({ update_id: 2, message: privateMessage(ADMIN_ID, 'Создать рассылку') });

  assert.match(sent[0].text, /Добро пожаловать/);
  assert.ok(sent.some(({ text }) => /введите текст сообщения/.test(text)));
});

test('админ-бот: без TELEGRAM_ADMIN_CHAT_IDS не отвечает никому', async (t) => {
  const { send, sent } = setupBot(t, []);

  await send({ update_id: 1, message: privateMessage(ADMIN_ID, 'Создать рассылку') });

  assert.deepStrictEqual(sent, []);
});

const appSettingsService = require('../services/gusevApi');

/** Режим PRO в памяти вместо базы. */
const mockProMode = (t, initial) => {
  const proMode = { ...initial };
  t.mock.method(appSettingsService, 'getProMode', async () => ({ ...proMode }));
  const setProMode = t.mock.method(appSettingsService, 'setProMode', async (platform, mode) => {
    proMode[platform] = mode;
    return { ...proMode };
  });
  return { proMode, setProMode };
};

const proToggle = (fromId, platform) => ({
  update_id: 10,
  callback_query: {
    id: 'q-pro',
    from: { id: fromId },
    message: { message_id: 7, chat: { id: fromId, type: 'private' } },
    data: `pro_toggle:${platform}`
  }
});

test('админ-бот: /pro показывает режим PRO по платформам', async (t) => {
  const { send, sent } = setupBot(t, [String(ADMIN_ID)]);
  mockProMode(t, { ios: 'free', android: 'paid' });

  await send({ update_id: 1, message: privateMessage(ADMIN_ID, '/pro') });

  assert.strictEqual(sent.length, 1);
  assert.match(sent[0].text, /iOS: бесплатно/);
  assert.match(sent[0].text, /Android: платно/);
});

test('админ-бот: кнопка переключает режим PRO платформы без черновика рассылки', async (t) => {
  const { send, sent, answered } = setupBot(t, [String(ADMIN_ID)]);
  const { proMode, setProMode } = mockProMode(t, { ios: 'paid', android: 'paid' });

  await send(proToggle(ADMIN_ID, 'ios'));

  assert.deepStrictEqual(setProMode.mock.calls[0].arguments, ['ios', 'free']);
  assert.deepStrictEqual(proMode, { ios: 'free', android: 'paid' });
  assert.deepStrictEqual(answered, ['iOS: бесплатно']);
  assert.match(sent[0].text, /iOS: бесплатно/);
});

test('админ-бот: чужому режим PRO не показывается и не меняется', async (t) => {
  const { send, sent, answered } = setupBot(t, [String(ADMIN_ID)]);
  const { setProMode } = mockProMode(t, { ios: 'paid', android: 'paid' });

  await send({ update_id: 1, message: privateMessage(STRANGER_ID, '/pro') });
  await send(proToggle(STRANGER_ID, 'ios'));

  assert.strictEqual(setProMode.mock.callCount(), 0);
  assert.deepStrictEqual(answered, ['Нет доступа']);
  assert.deepStrictEqual(sent, [{ chatId: STRANGER_ID, text: `Нет доступа. Ваш Telegram ID: ${STRANGER_ID}` }]);
});

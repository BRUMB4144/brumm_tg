const test = require('node:test');
const assert = require('node:assert/strict');
const { deliverWithRetries, runBroadcast } = require('./broadcastRunner');

test('broadcast walks cursor pages and reports delivery totals', async () => {
  const pages = [
    { items: [{ telegramId: '1' }, { telegramId: '2' }], nextCursor: 'cursor-2' },
    { items: [{ telegramId: '3' }], nextCursor: null }
  ];
  const requested = [];
  const sent = [];
  const result = await runBroadcast({
    text: 'hello',
    bot: { sendMessage: async ({ chat_id }) => sent.push(chat_id) },
    getRecipients: async (query) => {
      requested.push(query);
      return pages.shift();
    },
    sleep: async () => {}
  });

  assert.deepEqual(requested.map(({ after }) => after), [undefined, 'cursor-2']);
  assert.deepEqual(sent, ['1', '2', '3']);
  assert.deepEqual(result, { successCount: 3, failureCount: 0, totalUsers: 3 });
});

test('delivery retries Telegram 429 using retryAfter', async () => {
  let attempts = 0;
  const waits = [];
  const delivered = await deliverWithRetries(
    {
      sendMessage: async () => {
        attempts += 1;
        if (attempts === 1) throw Object.assign(new Error('rate limited'), { errorCode: 429, retryAfter: 2 });
      }
    },
    '1',
    { text: 'hello', withButton: false },
    async (ms) => waits.push(ms)
  );

  assert.equal(delivered, true);
  assert.equal(attempts, 2);
  assert.deepEqual(waits, [2000]);
});

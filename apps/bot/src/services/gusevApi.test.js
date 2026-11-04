const test = require('node:test');
const assert = require('node:assert/strict');
const config = require('../config');
const api = require('./gusevApi');

test('service client sends Bearer token and start event payload', async (t) => {
  config.gusevApi.baseUrl = 'https://backend.example/api';
  config.gusevApi.serviceToken = 'service-secret';
  const calls = [];
  t.mock.method(global, 'fetch', async (url, options) => {
    calls.push({ url, options });
    return new Response(null, { status: 204 });
  });

  await api.trackStartParam('ref_123', 456);

  assert.equal(calls[0].url, 'https://backend.example/api/internal/telegram/start-events');
  assert.equal(calls[0].options.headers.authorization, 'Bearer service-secret');
  assert.deepEqual(JSON.parse(calls[0].options.body), {
    startParam: 'ref_123',
    telegramId: '456'
  });
});

test('service client encodes recipient cursor', async (t) => {
  config.gusevApi.baseUrl = 'https://backend.example/api';
  const calls = [];
  t.mock.method(global, 'fetch', async (url) => {
    calls.push(url);
    return Response.json({ items: [], nextCursor: null });
  });

  await api.getBroadcastRecipients({ after: 'abc', limit: 25 });
  assert.equal(
    calls[0],
    'https://backend.example/api/internal/telegram/broadcast-recipients?limit=25&after=abc'
  );
});

test('service client exposes backend status on error', async (t) => {
  t.mock.method(global, 'fetch', async () => new Response('denied', { status: 401 }));
  await assert.rejects(() => api.getProMode(), { name: 'GusevApiError', status: 401 });
});

test('start without deep link still synchronizes an explicit username removal', async (t) => {
  let body;
  t.mock.method(global, 'fetch', async (_, options) => {
    body = JSON.parse(options.body); return new Response(null, { status: 204 });
  });
  await api.trackStartParam(undefined, 456, null);
  assert.deepEqual(body, { telegramId: '456', telegramUsername: null });
});

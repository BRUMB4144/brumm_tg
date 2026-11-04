const config = require('../config');

class GusevApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'GusevApiError';
    this.status = status;
  }
}

const request = async (path, { method = 'GET', body, signal } = {}) => {
  const timeout = AbortSignal.timeout(config.gusevApi.timeoutMs);
  const combinedSignal = signal ? AbortSignal.any([signal, timeout]) : timeout;
  const response = await fetch(`${config.gusevApi.baseUrl}/internal/telegram${path}`, {
    method,
    signal: combinedSignal,
    headers: {
      authorization: `Bearer ${config.gusevApi.serviceToken}`,
      ...(body === undefined ? {} : { 'content-type': 'application/json' })
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) })
  });

  if (!response.ok) {
    const details = await response.text();
    throw new GusevApiError(
      `gusev_new ${method} ${path}: HTTP ${response.status}${details ? ` — ${details}` : ''}`,
      response.status
    );
  }
  return response.status === 204 ? undefined : response.json();
};

const trackStartParam = (startParam, telegramId, telegramUsername) => {
  return request('/start-events', {
    method: 'POST',
    body: { startParam, telegramId: String(telegramId), telegramUsername }
  });
};

const getProMode = async () => (await request('/pro-mode')).proMode;

const setProMode = async (platform, mode) =>
  (await request('/pro-mode', { method: 'PUT', body: { platform, mode } })).proMode;

const getBroadcastRecipients = ({ after, limit = 100 } = {}) => {
  const query = new URLSearchParams({ limit: String(limit) });
  if (after) query.set('after', after);
  return request(`/broadcast-recipients?${query}`);
};

module.exports = {
  GusevApiError,
  getBroadcastRecipients,
  getProMode,
  request,
  setProMode,
  trackStartParam
};

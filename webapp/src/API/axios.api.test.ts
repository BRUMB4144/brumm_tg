import { beforeEach, expect, test, vi } from 'vitest';
import { AxiosError, AxiosHeaders, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
const values = new Map<string, string>();
const storage: Storage = {
  get length() { return values.size; }, clear: () => values.clear(),
  getItem: key => values.get(key) ?? null, setItem: (key, value) => { values.set(key, value); },
  removeItem: key => { values.delete(key); }, key: index => [...values.keys()][index] ?? null,
};
vi.stubGlobal('localStorage', storage);
const { createApiClient } = await import('./axios.api');
const response = (config: InternalAxiosRequestConfig, data: unknown, status = 200): AxiosResponse => ({ config, data, status, statusText: '', headers: new AxiosHeaders() });
const unauthorized = (config: InternalAxiosRequestConfig) => new AxiosError('expired', 'ERR_BAD_REQUEST', config, undefined, response(config, {}, 401));
beforeEach(() => { values.clear(); storage.setItem('accessToken', 'old'); storage.setItem('refreshToken', 'refresh-0'); });

test('parallel 401s share one refresh and subsequent refresh uses the rotated token', async () => {
  const { client, auth } = createApiClient(storage, vi.fn());
  let access = 'new-1'; let refreshCalls = 0;
  const used: string[] = [];
  client.defaults.adapter = async config => {
    if (config.headers.get('Authorization') !== `Bearer ${access}`) throw unauthorized(config);
    return response(config, { ok: true });
  };
  auth.defaults.adapter = async config => {
    refreshCalls++; used.push(JSON.parse(config.data).refreshToken);
    await Promise.resolve();
    return response(config, { accessToken: access, refreshToken: `refresh-${refreshCalls}` });
  };
  await Promise.all([client.get('a'), client.get('b'), client.get('c')]);
  expect(refreshCalls).toBe(1); expect(storage.getItem('refreshToken')).toBe('refresh-1');
  access = 'new-2'; await client.get('d');
  expect(used).toEqual(['refresh-0', 'refresh-1']);
  expect(storage.getItem('accessToken')).toBe('new-2');
});

test('late old-token 401 retries with the already refreshed token', async () => {
  const { client, auth } = createApiClient(storage, vi.fn());
  let release!: () => void;
  const delayed = new Promise<void>(resolve => { release = resolve; });
  const refresh = vi.fn(async (config: InternalAxiosRequestConfig) => response(config, { accessToken: 'new', refreshToken: 'rotated' }));
  auth.defaults.adapter = refresh;
  client.defaults.adapter = async config => {
    if (config.headers.get('Authorization') === 'Bearer new') return response(config, {});
    if (config.url === 'late') await delayed;
    throw unauthorized(config);
  };
  const late = client.get('late'); await client.get('first'); release(); await late;
  expect(refresh).toHaveBeenCalledTimes(1);
});

test('network failure preserves session; rejected refresh clears it', async () => {
  for (const rejected of [false, true]) {
    const lost = vi.fn(); const { client, auth } = createApiClient(storage, lost);
    client.defaults.adapter = async config => { throw unauthorized(config); };
    auth.defaults.adapter = async config => { throw rejected ? unauthorized(config) : new AxiosError('network'); };
    await expect(client.get('profile')).rejects.toThrow();
    expect(storage.getItem('refreshToken')).toBe(rejected ? null : 'refresh-0');
    expect(lost).toHaveBeenCalledTimes(rejected ? 1 : 0);
  }
});

test('login 401 does not attempt refresh', async () => {
  const { client, auth } = createApiClient(storage, vi.fn());
  const refresh = vi.fn(); auth.defaults.adapter = refresh;
  client.defaults.adapter = async config => { throw unauthorized(config); };
  await expect(client.post('users/login')).rejects.toThrow(); expect(refresh).not.toHaveBeenCalled();
});

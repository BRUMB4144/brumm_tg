import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_URL } from '../config';
import { AuthTokens, clearSession, persistTokens } from '../lib/session';

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };
export const createApiClient = (
  storage: Storage = localStorage,
  onSessionLost: () => void = () => { window.location.href = '/'; },
) => {
  const client = axios.create({ baseURL: `${API_URL}/`, timeout: 15_000 });
  // Separate client prevents recursion if the refresh request itself returns 401.
  const auth = axios.create({ baseURL: `${API_URL}/`, timeout: 15_000 });
  let refreshing: Promise<AuthTokens> | null = null;
  client.interceptors.request.use(config => {
    const token = storage.getItem('accessToken');
    if (token) config.headers.set('Authorization', `Bearer ${token}`);
    return config;
  });
  const refresh = () => {
    if (!refreshing) {
      refreshing = (async () => {
        try {
          const refreshToken = storage.getItem('refreshToken');
          if (!refreshToken) {
            clearSession(storage);
            onSessionLost();
            throw new Error('Сессия завершена');
          }
          const { data } = await auth.post<AuthTokens>('users/refresh', { refreshToken });
          if (!data.accessToken || !data.refreshToken) throw new Error('Некорректный ответ обновления сессии');
          persistTokens(data, storage);
          return data;
        } catch (error) {
          if (axios.isAxiosError(error) && [401, 403].includes(error.response?.status || 0)) {
            clearSession(storage);
            onSessionLost();
          }
          throw error;
        }
      })().finally(() => { refreshing = null; });
    }
    return refreshing;
  };
  client.interceptors.response.use(response => response, async (error: AxiosError) => {
    const original = error.config as RetryConfig | undefined;
    if (!original || error.response?.status !== 401 || original._retry ||
        /users\/(login|refresh)(?:\?|$)/.test(original.url || '')) throw error;
    original._retry = true;
    // A late 401 for the old token can arrive after another request refreshed it.
    const current = storage.getItem('accessToken');
    const sent = original.headers.get('Authorization');
    const token = current && sent !== `Bearer ${current}` ? current : (await refresh()).accessToken;
    original.headers.set('Authorization', `Bearer ${token}`);
    return client(original);
  });
  return { client, auth };
};
export const axiosInstance = createApiClient().client;

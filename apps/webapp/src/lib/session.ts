export interface AuthTokens { accessToken: string; refreshToken: string }
export const persistTokens = (tokens: AuthTokens, storage: Pick<Storage, 'setItem'> = localStorage) => {
  storage.setItem('accessToken', tokens.accessToken);
  storage.setItem('refreshToken', tokens.refreshToken);
};
export const clearSession = (storage: Pick<Storage, 'removeItem'> = localStorage) => {
  ['accessToken', 'refreshToken', 'id', 'telegramId'].forEach(key => storage.removeItem(key));
};

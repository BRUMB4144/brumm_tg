export interface TelegramLoginPayload {
  initData: string;
  telegramId: number;
  avatar?: string;
  username: string;
}

export interface TelegramLoginResponse {
  userId: string;
  accessToken: string;
  refreshToken: string;
  telegramId: string;
}

export const buildTelegramLoginPayload = (
  webApp: TelegramWebApp,
  user: TelegramWebAppUser,
): TelegramLoginPayload => ({
  initData: webApp.initData,
  telegramId: user.id,
  avatar: user.photo_url,
  username: user.first_name,
});

export const persistTelegramSession = (
  response: TelegramLoginResponse,
  storage: Pick<Storage, "setItem"> = localStorage,
): void => {
  storage.setItem("id", String(response.userId));
  storage.setItem("accessToken", response.accessToken);
  storage.setItem("refreshToken", response.refreshToken);
  storage.setItem("telegramId", String(response.telegramId));
};

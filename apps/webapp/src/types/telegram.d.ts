interface TelegramWebAppUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  is_premium?: boolean;
}

interface TelegramBackButton {
  show(): void;
  hide(): void;
  onClick(callback: () => void): void;
  offClick(callback?: () => void): void;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe?: { user?: TelegramWebAppUser };
  BackButton?: TelegramBackButton;
  isVersionAtLeast?(version: string): boolean;
  requestFullscreen?(): void;
  openTelegramLink(url: string): void;
  shareToStory(
    mediaUrl: string,
    options?: { text?: string; widget_link?: { url: string; name?: string } },
  ): void;
}

interface Window {
  Telegram?: { WebApp: TelegramWebApp };
}

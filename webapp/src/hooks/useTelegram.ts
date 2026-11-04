// Безопасно получаем объект Telegram WebApp, чтобы не падать при его отсутствии
const tg = typeof window !== "undefined" ? window.Telegram?.WebApp ?? null : null;

export function useTelegram() {
  return {
    tg,
    user: tg?.initDataUnsafe?.user,
  };
}

// Адреса бэкенда gusev_new. Задаются при сборке через .env (VITE_API_URL, VITE_MEDIA_URL),
// по умолчанию — прод. Старый домен pbypass.ru отключён 09.09.2026.
export const API_URL: string =
  import.meta.env.VITE_API_URL ?? "https://gusefwebapp.pro/api";

// Видео и картинки отдаются с корня домена (/uploads/...), без /api.
export const MEDIA_URL: string =
  import.meta.env.VITE_MEDIA_URL ?? "https://gusefwebapp.pro";

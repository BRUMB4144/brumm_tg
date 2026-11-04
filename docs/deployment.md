# Развёртывание WebApp

Node.js ≥ 20, npm, nginx с TLS. Репозиторий — /var/www/brumm-tg.
Перед production-работой загрузить навык guseff-prod-servers.

1. Выполнить npm ci.
2. Создать webapp/.env.production по webapp/.env.example.
   VITE_API_URL=https://gusefwebapp.pro/api,
   VITE_MEDIA_URL=https://gusefwebapp.pro.
3. Выполнить npm run lint, npm run typecheck, npm test и npm run build.
4. Проверить webapp/dist/index.html. Nginx должен использовать новый
   root /var/www/brumm-tg/webapp/dist из deploy/nginx-front.gusefwebapp.pro.conf.
   При переходе с apps/webapp обновить root в действующем конфиге, проверить nginx -t
   и выполнить reload nginx после успешной сборки. До reload сохранить прежний dist для отката.
5. Проверить авторизацию Mini App, профиль, курсы, оплату и загрузку медиа.
   HTTP-тесты backend требуют среды, разрешающей открытие порта.

В этом репозитории worker и PM2-конфигурации больше нет.
Перенос worker и порядок его переключения описаны в
[инструкции backend](../../brumm_backend/docs/telegram.md).
Не удалять старый shared/video.mp4: новый worker может использовать его по абсолютному пути.

Для отката WebApp восстановить сохранённый commit и dist либо выполнить сборку.
Домен сохраняется. При откате на версию с apps/webapp восстановить прежний nginx root.
Перезапуск worker при обновлении фронтенда не требуется.

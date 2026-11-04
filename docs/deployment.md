# Развёртывание Telegram

Node.js ≥ 20, npm, PM2 и nginx с настроенным TLS. Код — `/var/www/brumm-tg`,
backend — `/var/www/gusev`, Mini App — `https://front.gusefwebapp.pro`.
Перед production-работой загрузить навык `guseff-prod-servers`.

## Первичная настройка

1. Установить репозиторий в `/var/www/brumm-tg`, выполнить `npm ci`.
2. Скопировать `.env.example` в `.env`, `apps/webapp/.env.example` в
   `apps/webapp/.env.production`; заполнить значения по примерам.
3. В worker указать `NODE_ENV=production`, `GUSEV_API_URL=https://gusefwebapp.pro/api`,
   `WEBAPP_URL=https://front.gusefwebapp.pro/`, токены и `TELEGRAM_ADMIN_CHAT_IDS`.
   `TELEGRAM_SERVICE_TOKEN` и основной `TELEGRAM_BOT_TOKEN` должны совпадать с backend.
4. Положить видео в `shared/video.mp4`, задать абсолютный `WELCOME_VIDEO_PATH`.
   При переносе старой установки видео можно взять из `/var/www/gusev/public/uploads/video.mp4`.
5. В Mini App задать `VITE_API_URL=https://gusefwebapp.pro/api`,
   `VITE_MEDIA_URL=https://gusefwebapp.pro`.
6. Настроить nginx по `deploy/nginx-front.gusefwebapp.pro.conf`:
   `root /var/www/brumm-tg/apps/webapp/dist;`. Сохранить действующие TLS-директивы,
   проверить `sudo nginx -t` и применить `sudo systemctl reload nginx`.

Приглашения и удаление из приватного канала выполняет backend;
права бота и переменные — в [telegram-channel-access.md](telegram-channel-access.md).
`TELEGRAM_INITDATA_REQUIRED`, `TELEGRAM_INITDATA_MAX_AGE_SECONDS`, `TELEGRAM_API_BASE_URL`
устарели: проверка `initData` всегда строгая, срок действия — 24 часа.

## Обновление

Сначала проверить совместимость и выкатить backend, если менялся контракт закрытого API.
Сохранить текущий commit, рабочую сборку Mini App и nginx-конфиг для отката.

```bash
cd /var/www/brumm-tg
git rev-parse HEAD
git pull --ff-only
npm ci
npm run lint
npm run typecheck
npm test
npm run build
test -r shared/video.mp4
test -f apps/webapp/dist/index.html
pm2 restart brumm-tg-bot --update-env
```

При первом запуске вместо restart использовать `pm2 start ecosystem.config.js` и `pm2 save`.
С теми же токенами должен работать **один** polling-процесс. Если остался старый `gusev-bot`,
остановить и удалить его перед запуском нового worker; иначе Telegram вернёт `409 Conflict`.
Миграция MongoDB и смена URL в BotFather при сохранении домена не нужны.

## Проверка

- `/start`: видео и кнопка Mini App; тестовые deep links продолжают работать.
- Mini App: вход с `initData`, профиль, билеты, марафон, экзамен, курсы и медиа.
- Сессия: два обновления подряд, параллельные 401, сохранение сессии при сетевом сбое.
- Курсы: крайние уроки; упражнения: прежний пост канала, выдача и отзыв доступа.
- Админ-бот: `/start`, `/pro`, отказ для ID вне allowlist, preview черновика рассылки.
- Оплату и промокоды проверять согласованным тестом; рассылку при smoke-проверке не отправлять.

```bash
curl --fail --silent https://front.gusefwebapp.pro/ >/dev/null
curl --fail --silent https://gusefwebapp.pro/health
pm2 logs brumm-tg-bot --lines 100 --nostream
pm2 logs gusev --lines 100 --nostream
```

JS/CSS должны загружаться без 404; в логах не должно быть ошибок окружения, видео и polling.
Повторные 401 на `/api/users/login` сопоставить с access-логом nginx: IP, User-Agent, Origin,
версия Mini App. Не логировать `initData`, токены и тело запроса; не повторять отказ авторизации бесконечно.

## Откат

Вернуть сохранённый commit, выполнить `npm ci` и `npm run build`, перезапустить worker.
Для быстрого отката Mini App восстановить сохранённый `dist` или прежний nginx root,
проверить nginx и сделать reload. Проверить `/start` и загрузку Mini App.
Если возвращается прежний worker, сначала остановить новый: два polling-процесса недопустимы.
Откат backend — по его [инструкции](../../brumm_backend/docs/deployment.md);
MongoDB автоматически не откатывать.

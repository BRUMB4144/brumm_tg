# Развёртывание и переход на `brumm_tg`

Документ описывает первый production-переход с Mini App и Telegram-ботов внутри
`guseff_mobile`/`gusev_new` на отдельный репозиторий `brumm_tg`.

## Что меняется

- `gusev_new` остаётся владельцем пользователей, подписок, платежей и проверки Telegram `initData`.
- `brumm_tg/apps/webapp` собирается в статический Mini App и отдаётся на
  `https://front.gusefwebapp.pro`.
- `brumm_tg/apps/bot` запускает основной, административный и рассылочный боты.
- Bot worker обращается к закрытому API `gusev_new` с общим `TELEGRAM_SERVICE_TOKEN`.
- Старый процесс PM2 `gusev-bot` удаляется только непосредственно перед запуском
  `brumm-tg-bot`. Одновременно polling одного токена двумя процессами запускать нельзя.

Переход не требует миграции MongoDB и не меняет Telegram BotFather URL, потому что production-домен
Mini App сохраняется.

## Порядок PR и выкладки

1. Смержить и выкатить backend-PR `gusev_new`. Он добавляет совместимый внутренний API, пока старый
   bot worker может продолжать работать.
2. Смержить основной PR `brumm_tg`, установить зависимости и собрать Mini App.
3. Переключить nginx на новый `dist`.
4. Остановить `gusev-bot` и сразу запустить `brumm-tg-bot`.
5. Выполнить smoke-проверки ниже.
6. Только после успешной production-проверки смержить cleanup-PR `guseff_mobile`, удаляющий старую
   копию `tlg/`.

## Требования

- Linux-сервер с Node.js 20+, npm, nginx и PM2.
- Рабочий `gusev_new` в `/var/www/gusev`.
- Репозиторий `brumm_tg` в `/var/www/brumm-tg`.
- Доступ к DNS/TLS для `front.gusefwebapp.pro` уже настроен.
- Бот добавлен администратором приватного premium-канала с правами создавать приглашения и удалять
  участников.

Перед началом сохраните текущие версии и конфиги:

```bash
export OLD_GUSEV_SHA="$(git -C /var/www/gusev rev-parse HEAD)"
sudo cp /etc/nginx/sites-available/front.gusefwebapp.pro \
  /etc/nginx/sites-available/front.gusefwebapp.pro.before-brumm-tg
pm2 save
```

Не записывайте секреты в Git или shell history. Создайте общий service token безопасным способом и
поместите одно и то же значение в оба `.env`:

```bash
openssl rand -hex 32
```

## 1. Backend `gusev_new`

Обновите код и зависимости:

```bash
cd /var/www/gusev
git pull --ff-only
npm ci --omit=dev
```

В `/var/www/gusev/.env` должны остаться backend-переменные Telegram:

```env
NODE_ENV=production

TELEGRAM_BOT_TOKEN=<токен основного бота>
TELEGRAM_SERVICE_TOKEN=<общий случайный секрет>
TELEGRAM_BOT_USERNAME=GuseffGoBot
TELEGRAM_SUPPORT_USERNAME=@GuseffGo
TELEGRAM_PRIVATE_CHANNEL_ID=<id приватного premium-канала>
```

`TELEGRAM_INITDATA_REQUIRED`, `TELEGRAM_INITDATA_MAX_AGE_SECONDS` и `TELEGRAM_API_BASE_URL` больше
не используются. Проверка `initData` всегда строгая, а срок действия зафиксирован в коде на 24 часа.

Перезапустите только HTTP API. Старый `gusev-bot` пока не останавливайте:

```bash
pm2 restart gusev --update-env
curl --fail --silent https://gusefwebapp.pro/health
```

Проверьте внутренний API с token из `.env` без вывода token в лог:

```bash
cd /var/www/gusev
set -a
. ./.env
set +a
curl --fail --silent \
  -H "Authorization: Bearer ${TELEGRAM_SERVICE_TOKEN}" \
  https://gusefwebapp.pro/api/internal/telegram/pro-mode
unset TELEGRAM_SERVICE_TOKEN
```

Ожидается JSON с полем `proMode`. Запрос без заголовка должен получить `401`.

## 2. Установка `brumm_tg`

```bash
cd /var/www
git clone git@github.com:BRUMB4144/brumm_tg.git brumm-tg
cd /var/www/brumm-tg
npm ci
cp .env.example .env
cp apps/webapp/.env.example apps/webapp/.env.production
install -d -m 0755 shared
```

Заполните `/var/www/brumm-tg/.env`:

```env
NODE_ENV=production

GUSEV_API_URL=https://gusefwebapp.pro/api
GUSEV_API_TIMEOUT_MS=10000
TELEGRAM_SERVICE_TOKEN=<тот же общий секрет, что в gusev_new>

TELEGRAM_BOT_TOKEN=<тот же токен основного бота, что в gusev_new>
TELEGRAM_SUPPORT_USERNAME=@GuseffGo
WEBAPP_URL=https://front.gusefwebapp.pro/
WELCOME_VIDEO_PATH=/var/www/brumm-tg/shared/video.mp4

TELEGRAM_ADMIN_BOT_TOKEN=<токен административного бота>
TELEGRAM_BROADCAST_BOT_TOKEN=<токен бота рассылок>
TELEGRAM_ADMIN_CHAT_IDS=<Telegram ID администраторов через запятую>
```

В `/var/www/brumm-tg/apps/webapp/.env.production`:

```env
VITE_API_URL=https://gusefwebapp.pro/api
VITE_MEDIA_URL=https://gusefwebapp.pro
```

Приветственное видео раньше читалось из uploads backend. Скопируйте его в каталог нового worker:

```bash
install -m 0644 /var/www/gusev/public/uploads/video.mp4 \
  /var/www/brumm-tg/shared/video.mp4
```

Проверьте и соберите проект:

```bash
cd /var/www/brumm-tg
npm run typecheck
npm test
npm run build
test -r shared/video.mp4
test -f apps/webapp/dist/index.html
```

## 3. Переключение Mini App в nginx

Шаблон нового server block находится в
`deploy/nginx-front.gusefwebapp.pro.conf`. Если TLS уже настроен, не заменяйте существующие
директивы сертификата: измените только `root` и SPA/static locations по шаблону.

Ключевое значение:

```nginx
root /var/www/brumm-tg/apps/webapp/dist;
```

После изменения:

```bash
sudo nginx -t
sudo systemctl reload nginx
curl --fail --silent https://front.gusefwebapp.pro/ >/dev/null
```

Проверьте в браузере, что JS/CSS загружаются без `404`. Старый Mini App пока остаётся в Git и может
быть возвращён простым откатом nginx.

## 4. Переключение bot worker

Это единственный короткий разрыв в polling. Выполните команды подряд:

```bash
pm2 stop gusev-bot
pm2 delete gusev-bot

cd /var/www/brumm-tg
pm2 start ecosystem.config.js --update-env
pm2 save
pm2 status
pm2 logs brumm-tg-bot --lines 100 --nostream
```

В логах не должно быть `409 Conflict`, ошибок обязательных переменных или отсутствующего видео.

## 5. Smoke-проверки

1. Открыть основного бота и выполнить `/start`: приходит видео и кнопка Mini App.
2. Открыть Mini App из кнопки: авторизация проходит с подписанным `initData`.
3. Проверить профиль, билеты, марафон, экзамен, курсы и загрузку медиа.
4. Перейти в бота по тестовой deep-link и убедиться, что `/start` продолжает отвечать.
5. В админ-боте выполнить `/start` и `/pro`; пользователь вне `TELEGRAM_ADMIN_CHAT_IDS` не должен
   получить доступ.
6. Создать черновик рассылки и проверить preview. Не нажимать «Отправить» без согласованного
   production-теста.
7. Проверить логи:

```bash
pm2 logs gusev --lines 100 --nostream
pm2 logs brumm-tg-bot --lines 100 --nostream
```

После успешной проверки удалите из production `.env` больше не используемые bot-переменные
`TELEGRAM_ADMIN_BOT_TOKEN`, `TELEGRAM_BROADCAST_BOT_TOKEN` и `TELEGRAM_ADMIN_CHAT_IDS` в
`gusev_new`: теперь они принадлежат только `brumm_tg`.

## Откат

### Только Mini App

Верните сохранённый nginx-конфиг и перезагрузите nginx:

```bash
sudo cp /etc/nginx/sites-available/front.gusefwebapp.pro.before-brumm-tg \
  /etc/nginx/sites-available/front.gusefwebapp.pro
sudo nginx -t
sudo systemctl reload nginx
```

### Только bot worker

Нельзя оставлять два polling-процесса одновременно:

```bash
pm2 stop brumm-tg-bot
pm2 delete brumm-tg-bot

cd /var/www/gusev
git switch --detach "${OLD_GUSEV_SHA}"
npm ci --omit=dev
pm2 start bot.js --name gusev-bot --cwd /var/www/gusev
pm2 save
```

После восстановления старого worker проверьте `/start`. Backend можно оставить новой версии: его
внутренние endpoints обратно совместимы и не мешают старому боту.

### Полный откат backend

Если проблема именно в backend, после остановки нового worker переключите `/var/www/gusev` на
сохранённый `OLD_GUSEV_SHA`, установите зависимости и перезапустите оба старых процесса. Не
откатывайте MongoDB: схема данных в этом переходе не мигрируется.

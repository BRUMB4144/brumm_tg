# Brumm Telegram

Mini App (React + Vite) и worker основного, административного и рассылочного ботов.
Данные, платежи, проверка `initData`, партнёрка и доступ в закрытый канал принадлежат
`brumm_backend` (серверный каталог `/var/www/gusev`). Worker ходит в закрытый API и не подключается к MongoDB.

## Запуск

Нужен Node.js ≥ 20. Все команды выполняются из корня репозитория:

```bash
npm install
cp .env.example .env
cp apps/webapp/.env.example apps/webapp/.env
npm run dev:webapp              # Mini App
npm run start:bot               # worker, отдельный терминал
```

Заполнить `TELEGRAM_BOT_TOKEN`, общий с backend `TELEGRAM_SERVICE_TOKEN` и путь к читаемому
приветственному видео `WELCOME_VIDEO_PATH`. Admin/broadcast bots требуют обоих токенов;
доступ администраторов задаёт `TELEGRAM_ADMIN_CHAT_IDS`.
Mini App использует `VITE_API_URL` и `VITE_MEDIA_URL`.
Секреты и видео в Git не хранятся.

Проверки: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`.
Сборка создаёт `apps/webapp/dist`; production-домен — `https://front.gusefwebapp.pro`.

## Взаимодействие с backend

Mini App передаёт подписанный `initData` в `/api/users/login`, хранит access/refresh и
объединяет параллельные 401 в один refresh. Сетевой сбой не удаляет сессию;
подтверждённый отказ авторизации очищает её. Ошибки запросов передаются в UI.

Worker использует `/api/internal/telegram` с `Authorization: Bearer <TELEGRAM_SERVICE_TOKEN>`:

| Метод и путь | Назначение |
|---|---|
| `POST /start-events` | При каждом `/start`: обновить username существующего пользователя, учесть `ref_`, `c_`, `ac_` |
| `GET /broadcast-recipients?after=&limit=` | Страница числовых Telegram ID для рассылки |
| `GET /pro-mode` | Режим PRO по платформам |
| `PUT /pro-mode` | Изменить режим одной платформы |

В `start-events`: `telegramId` — числовая строка, необязательный `startParam` — непустая строка
до 64 символов, `telegramUsername` — 1–32 латинских букв, цифр или `_`.
Отсутствующий username сохраняет прежнее значение, `null` очищает; ответ — 204.
Учебный аккаунт здесь не создаётся. Ошибка учёта перехода не мешает приветствию бота.

## Эксплуатация

- [Развёртывание и откат](docs/deployment.md): nginx, окружение, единственный polling-процесс.
- [Доступ к упражнениям](docs/telegram-channel-access.md): приглашения и исключение из канала.
- [Партнёрка backend](../brumm_backend/docs/partners.md): синхронизация AppMetrica.

Открытые задачи: фоновое закрытие канала по истечении PRO, восстановление рассылок после
рестарта и защита от гонок платёжных callbacks. Production-проверку выполнять после выкладки;
локальные HTTP-тесты требуют среды, разрешающей открытие порта (`listen EPERM` означает ограничение среды).

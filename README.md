# brumm_tg

Telegram-контур GuseffGO: Mini App и отдельный worker пользовательского, административного и
рассылочного ботов. Данные остаются в `gusev_new`; worker получает их через закрытый
`/api/internal/telegram` с service token.

## Локальный запуск

Требуется Node.js 20 или новее.

```bash
npm install
cp .env.example .env
cp apps/webapp/.env.example apps/webapp/.env
npm run dev:webapp
npm run start:bot
```

Для bot worker обязательны `TELEGRAM_BOT_TOKEN`, `TELEGRAM_SERVICE_TOKEN` и читаемый файл по
`WELCOME_VIDEO_PATH`. Admin/broadcast bots запускаются только когда заданы оба их токена.

## Проверки

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Production

- `npm run build` создаёт `apps/webapp/dist`, который отдаётся nginx на текущем WebApp-домене.
- `pm2 start ecosystem.config.js` запускает один `brumm-tg-bot`. Второй экземпляр с теми же
  токенами запускать нельзя: Telegram long polling ответит `409 Conflict`.
- Перед первым запуском нового worker остановить прежний `gusev-bot`.

Шаблон nginx находится в `deploy/nginx-front.gusefwebapp.pro.conf`. Секреты и приветственное видео
в git не хранятся.

Полный порядок первого развёртывания, переключения со старого worker и отката описан в
[`docs/deployment-migration.md`](docs/deployment-migration.md).

План дальнейшего разделения ответственности бота и backend с учётом изменений партнёрской
синхронизации: [`docs/backend-interaction-plan.md`](docs/backend-interaction-plan.md).

Прежняя схема доступа к упражнениям через приватный канал, настройки backend и проверка:
[`docs/telegram-channel-access.md`](docs/telegram-channel-access.md).

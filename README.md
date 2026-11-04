# Brumm WebApp

Telegram Mini App (React + Vite). Боты находятся в brumm_backend/src/telegram
и запускаются отдельным worker-процессом вместе с репозиторием backend.

## Запуск

Node.js ≥ 20. Из корня репозитория:

```bash
npm install
cp webapp/.env.example webapp/.env
npm run dev:webapp
```

Mini App использует VITE_API_URL и VITE_MEDIA_URL.
Секреты ботов здесь не требуются. Авторизацию initData, платежи,
контент и общие данные обслуживает backend.

Проверки: npm run lint, npm run typecheck, npm test, npm run build.
Сборка создаёт webapp/dist; production: https://front.gusefwebapp.pro.

## Документация

- [Выкладка WebApp](docs/deployment.md).
- [Telegram worker и доступ в канал](../brumm_backend/docs/telegram.md).

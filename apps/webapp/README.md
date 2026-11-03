# tlg — Telegram Mini App «ГусеффGO»

Веб-приложение (React + Vite), которое открывает кнопка бота `@GuseffGoBot`. Ходит в контентный
бэкенд gusev_new (`/api/users/login` по Telegram-данным, билеты, курсы, марафон). Отдельный проект со
своими зависимостями: в RN-приложение не входит, Metro, Jest, ESLint и TS его игнорируют.

```bash
cd tlg
yarn install
cp .env.example .env   # VITE_API_URL, VITE_MEDIA_URL; без .env — прод gusefwebapp.pro
yarn dev
npx vite build         # dist/ (`yarn build` сначала гоняет tsc -b — сейчас он падает на старых ошибках типов)
```

Адрес Mini App задаёт `WEBAPP_URL` в gusev_new и настройки бота в BotFather.

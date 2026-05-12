# Cloud Telemetry Project

A starter full-stack telemetry analytics app built with Next.js, Prisma, and Tailwind CSS.

## Features

- User registration and login
- Profile page with editable name, bio, and avatar link
- Cloud service URL telemetry analysis
- Usage charts with line and pie visuals
- Forecast-style daily/monthly/yearly metrics
- Data stored in SQLite via Prisma

## Getting started

1. Copy `.env.example` to `.env` and set a secure `JWT_SECRET`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate Prisma client and create the database:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000` in your browser.

## Useful commands

- `npm run dev` — start the development server
- `npm run build` — build the production app
- `npm start` — run the production build
- `npx prisma studio` — open Prisma Studio for database inspection

## Notes

- The backend is implemented in Next.js API routes.
- User session state is managed with HTTP-only cookies.
- Telemetry predictions are currently generated using a simple analysis function and can be replaced with real model logic.

# WebIntel AI

Know Any Website Before Anyone Else.

WebIntel AI is a production-ready SaaS starter for AI-powered website intelligence. A user submits a public URL and gets a durable report with screenshots, SEO analysis, tech stack detection, security observations, content intelligence, media extraction, scorecards, and AI-generated business insights.

## Stack

- Next.js 16 App Router
- TypeScript + Tailwind CSS
- Framer Motion + shadcn-style UI primitives
- PostgreSQL + Prisma ORM
- Cookie-based email/password authentication
- FastAPI + Playwright + BeautifulSoup scraper service
- OpenAI responses integration for business insights
- Local export storage and scraper-served screenshot assets

## Project tree

```text
.
├── .env.example
├── components.json
├── docker-compose.yml
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── prisma
│   └── schema.prisma
├── prisma.config.ts
├── public
│   ├── brand
│   │   └── logo.svg
│   ├── favicon.ico
│   └── illustrations
│       └── mesh.svg
├── scraper_service
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app
│       ├── __init__.py
│       ├── analyzer.py
│       ├── main.py
│       ├── models.py
│       └── security.py
├── src
│   ├── app
│   │   ├── (app)
│   │   │   ├── compare/page.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── history/page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── reports
│   │   │   │   ├── [reportId]/page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── saved/page.tsx
│   │   │   ├── scan/page.tsx
│   │   │   ├── settings/page.tsx
│   │   │   └── team/page.tsx
│   │   ├── (auth)
│   │   │   ├── layout.tsx
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── (marketing)/page.tsx
│   │   ├── api
│   │   │   ├── auth
│   │   │   │   ├── login/route.ts
│   │   │   │   ├── logout/route.ts
│   │   │   │   ├── session/route.ts
│   │   │   │   └── signup/route.ts
│   │   │   ├── reports
│   │   │   │   ├── [reportId]
│   │   │   │   │   ├── export/route.ts
│   │   │   │   │   ├── rerun/route.ts
│   │   │   │   │   ├── save/route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   ├── compare/route.ts
│   │   │   │   └── route.ts
│   │   │   ├── scans/route.ts
│   │   │   ├── settings/route.ts
│   │   │   ├── subscription/route.ts
│   │   │   └── teams/route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── pricing/page.tsx
│   ├── components
│   │   ├── dashboard/stat-card.tsx
│   │   ├── layout
│   │   │   ├── app-shell.tsx
│   │   │   ├── marketing-header.tsx
│   │   │   └── theme-toggle.tsx
│   │   ├── marketing/landing-page.tsx
│   │   ├── providers
│   │   │   ├── app-providers.tsx
│   │   │   └── theme-provider.tsx
│   │   ├── report
│   │   │   ├── report-export-button.tsx
│   │   │   ├── report-shell.tsx
│   │   │   ├── save-report-button.tsx
│   │   │   └── score-ring.tsx
│   │   ├── scan/scan-workbench.tsx
│   │   ├── settings/settings-form.tsx
│   │   └── ui
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── separator.tsx
│   │       └── textarea.tsx
│   ├── lib
│   │   ├── auth.ts
│   │   ├── constants.ts
│   │   ├── env.ts
│   │   ├── prisma.ts
│   │   ├── security.ts
│   │   └── utils.ts
│   ├── services
│   │   ├── auth/password.ts
│   │   ├── openai/report-insights.ts
│   │   ├── reports
│   │   │   ├── pdf.tsx
│   │   │   ├── pipeline.ts
│   │   │   └── scoring.ts
│   │   ├── storage/local-storage.ts
│   │   └── usage.ts
│   └── types
│       ├── auth.ts
│       └── report.ts
└── storage
    ├── exports
    └── screenshots
```

## Environment variables

Copy `.env.example` to `.env` and set:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/webintel_ai?schema=public"
SESSION_SECRET="replace-with-a-long-random-string"
OPENAI_API_KEY=""
OPENAI_REPORT_MODEL="gpt-5.4-mini"
SCRAPER_SERVICE_URL="http://127.0.0.1:8001"
APP_URL="http://127.0.0.1:3000"
RATE_LIMIT_WINDOW_MS="60000"
RATE_LIMIT_MAX_REQUESTS="30"
FREE_PLAN_MONTHLY_SCANS="3"
STORAGE_ROOT="./storage"
```

## Local setup

1. Start Postgres:

```bash
docker compose up -d postgres
```

2. Install web dependencies:

```bash
npm install
```

3. Generate Prisma client and run the first migration:

```bash
npm run prisma:generate
npx prisma migrate dev --name init
```

4. Set up the scraper service:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r scraper_service/requirements.txt
playwright install chromium
```

5. Run both services:

```bash
npm run dev:all
```

Or run them separately:

```bash
npm run dev
npm run scraper:dev
```

## API routes

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/session`
- `POST /api/scans`
- `GET /api/reports`
- `GET /api/reports/:reportId`
- `POST /api/reports/:reportId/save`
- `POST /api/reports/:reportId/rerun`
- `GET /api/reports/:reportId/export`
- `POST /api/reports/compare`
- `POST /api/settings`
- `GET /api/subscription`
- `GET /api/teams`

## Report coverage

Each saved report includes:

- Website overview
- Design intelligence
- SEO audit
- Tech stack detection
- Performance signals
- Security review
- Content intelligence
- Media extraction
- AI business insights
- Scorecards and screenshots

## Database models

Defined in [prisma/schema.prisma](/Users/surajsingh/Documents/WebIntel%20AI/prisma/schema.prisma):

- `User`
- `Report`
- `SavedReport`
- `Subscription`
- `UsageLog`

## Production deployment

### Frontend

- Deploy the Next.js app to Vercel.
- Add all variables from `.env.example`.
- Use the verified build command:

```bash
npm run build
```

### Scraper backend

- Deploy `scraper_service` to Railway, Render, or a VPS using `scraper_service/Dockerfile`.
- Mount persistent storage if you want screenshots to survive container restarts.
- Expose port `8001`.
- Set:

```bash
STORAGE_ROOT=/app/storage
```

### Postgres

- Use a managed Postgres database for `DATABASE_URL`.
- Run Prisma migrations during deployment:

```bash
npx prisma migrate deploy
```

## Notes

- Auth uses secure HTTP-only session cookies.
- Free users are limited to 3 monthly scans by default.
- Screenshot assets are served directly from the scraper service at `/assets/...`.
- The web build uses `next build --webpack` because that path was verified successfully in this environment.

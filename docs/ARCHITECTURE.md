# DineAround Architecture — Cloudflare D1 + R2

## Overview

```
┌─────────────┐     HTTPS REST      ┌──────────────────────┐
│  Web (Next) │ ──────────────────► │  dinearound-api      │
│  iOS Swift  │   Bearer JWT        │  Cloudflare Worker   │
└─────────────┘                     └──────────┬───────────┘
       │                                       │
       │ local cache                           ├── D1 (SQLite)
       ▼                                       │   users, visits,
  IndexedDB / SwiftData                        │   wishlist, menu_items, media
  (offline fallback)                           │
                                               └── R2 dinearound-media
                                                   photos + PDFs
```

**One API, one database.** Web and iOS never connect to D1 or R2 directly.

## Repository layout

```
dinearound-app/
├── cloudflare/           # Worker + D1 schema
│   ├── wrangler.toml
│   ├── schema.sql
│   ├── seed.sql
│   └── src/
│       ├── index.js      # REST routes
│       └── auth.js       # JWT + PBKDF2 passwords
├── web/
│   └── lib/
│       ├── api-client.ts # fetch wrapper
│       └── sync-service.ts
├── ios/.../Services/
│   ├── APIClient.swift
│   └── SyncService.swift
└── docs/
    ├── API.md
    └── ARCHITECTURE.md
```

## Data model (D1)

| Table | Purpose |
|-------|---------|
| `users` | Email auth, PBKDF2 password hash |
| `restaurants` | Seed catalog + auto-created custom entries |
| `visits` | Per-user visit log |
| `wishlist` | Composite PK (user_id, restaurant_id) |
| `menu_items` | OCR/seed menu lines per restaurant |
| `media` | R2 key metadata (food/menu photos, PDFs) |

See `cloudflare/schema.sql`.

## Auth flow

1. Client POST `/api/auth/login` or `/register` with email + password
2. Worker verifies hash (PBKDF2-SHA256, 100k iterations) or creates user
3. Worker returns JWT (`sub`, `email`, `exp` = 30 days)
4. Client stores token (web: `localStorage`; iOS: `UserDefaults`)
5. All mutating requests send `Authorization: Bearer <token>`

Pattern adapted from DeshiSaj Worker (HS256 HMAC JWT).

## Sync strategy

| Layer | Online | Offline |
|-------|--------|---------|
| Web | Zustand + API sync on write | Zustand persist (IndexedDB) |
| iOS | SwiftData + background upload | SwiftData local-first |
| Media | Upload to R2 after local save | Queue upload when API available |

Guest mode: local-only on both platforms (no API calls).

## Setup (first deploy)

```bash
cd cloudflare
npm install

# 1. Create D1
npx wrangler d1 create dinearound
# Paste database_id into wrangler.toml

# 2. Create R2 bucket
npx wrangler r2 bucket create dinearound-media

# 3. Apply schema + seed
npm run db:migrate
npm run db:seed

# 4. Secrets
npx wrangler secret put AUTH_SECRET      # openssl rand -base64 32
npx wrangler secret put ALLOWED_ORIGINS  # optional CORS

# 5. Deploy
npm run deploy
```

Attach custom route: `api.dinearound.salehinlabs.com/*`

## Client configuration

**Web** (`web/.env.local`):

```bash
NEXT_PUBLIC_API_URL=https://api.dinearound.salehinlabs.com
```

**iOS** — set `API_BASE_URL` in Xcode build settings or Info.plist (Debug: `http://localhost:8787` for `wrangler dev`).

## Deprecated stack

| Previous | Status |
|----------|--------|
| Supabase PostgreSQL | Deprecated — replaced by D1 |
| Supabase Auth | Deprecated — Worker JWT auth |
| Vercel serverless API | Deprecated — Cloudflare Worker |
| Direct R2 from Next.js | Deprecated — Worker media routes |

Web still deploys to **Vercel** for static/SSR hosting; data layer is Cloudflare.

## Local development

```bash
# Terminal 1 — API
cd cloudflare && npm run dev

# Terminal 2 — Web
cd web && NEXT_PUBLIC_API_URL=http://localhost:8787 npm run dev
```

## Verification

```bash
cd cloudflare && npm run deploy:dry-run
cd web && npm run build
cd ios/Dinearound-app && xcodebuild -scheme Dinearound-app -destination 'platform=iOS Simulator,name=iPhone 16' build
```

# DineAround Cloudflare API — Deploy Guide

Shared backend for **web** and **iOS**. Both clients talk to this Worker REST API; D1 is never accessed directly from clients.

## Prerequisites

- Cloudflare account with `salehinlabs.com` zone
- Node.js 18+
- Wrangler CLI (`npm i -g wrangler` or use local `npm install` in this folder)

## 1. Create resources

```bash
cd cloudflare
npm install

# D1 database
npx wrangler d1 create dinearound
# Copy database_id into wrangler.toml → [[d1_databases]].database_id

# R2 bucket
npx wrangler r2 bucket create dinearound-media
```

## 2. Apply schema & seed

```bash
# Remote (production)
npm run db:migrate
npm run db:seed

# Local dev
npm run db:migrate:local
npm run db:seed:local
```

## 3. Set secrets

```bash
# Required — JWT signing (use: openssl rand -base64 32)
npx wrangler secret put AUTH_SECRET

# Optional — CORS for web (comma-separated)
npx wrangler secret put ALLOWED_ORIGINS
# Example: https://dinearound-app.vercel.app,http://localhost:3000
```

## 4. Deploy

```bash
npm run deploy:dry-run   # validate bundle
npm run deploy           # live
```

## 5. Custom domain (recommended)

In Cloudflare dashboard → Workers → `dinearound-api` → Triggers → Add route:

- `api.dinearound.salehinlabs.com/*`

Or uncomment `routes` in `wrangler.toml` and redeploy.

## Client configuration

| Client | Env var | Example |
|--------|---------|---------|
| Web (Next.js) | `NEXT_PUBLIC_API_URL` | `https://api.dinearound.salehinlabs.com` |
| iOS | `API_BASE_URL` in Info.plist / build setting | same URL |

## Local development

```bash
npm run dev
# Worker at http://localhost:8787
# Set NEXT_PUBLIC_API_URL=http://localhost:8787 for web
```

## Architecture note

**iOS does not connect to D1 directly.** Swift `URLSession` → Worker REST → D1/R2. Same for web `fetch()`. One database, one API, multi-device sync when authenticated.

## Rollback

```bash
npx wrangler rollback
```

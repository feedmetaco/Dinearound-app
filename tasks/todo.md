# DineAround — Task Checklist

**Canonical repo:** `~/Documents/claude-projects/dinearound-app/`  
**Tracks:** Web (Next.js on Cloudflare Workers) + iOS SwiftUI — **shared Cloudflare D1 + R2 backend**  
**Design:** iOS = Midnight Gourmet (`design-system/dinearound/MASTER.md`) · Web = Marketplace Light (`design-system/dinearound/pages/web-light.md`)

Plan before 3+ step tasks. Verify before marking done.

---

## Track A — Web

- [x] Next.js 16 app in `web/` (Cloudflare Workers via OpenNext)
- [x] **Marketplace Light v2** — light-only (`web-light.md`), 4-tab nav, simplified Nearby (`b37cec9`)
- [x] Log + Wishlist + restaurant detail + media attachments (IndexedDB offline)
- [x] Menu photo → PDF (client-side jsPDF)
- [x] Worker API client + sync (`web/lib/api-client.ts`, `sync-service.ts`)
- [x] Auth via Worker JWT (Supabase bypassed for sync)
- [x] **Deploy Cloudflare Worker** — `https://dinearound-api.samisalehin.workers.dev`
- [x] **Deploy web to Cloudflare** — `https://dinearound-web.samisalehin.workers.dev` (`docs/PAGES_DEPLOY.md`)
- [x] Set `web/.env.local` → `NEXT_PUBLIC_API_URL` (`https://dinearound-api.samisalehin.workers.dev`)
- [ ] Remove dead Supabase deps when confirmed unused
- [ ] Real map embed on Nearby (Google Maps when lat/lng + API key wired)

## Track B — iOS SwiftUI

**Spec:** `design-system/dinearound/MASTER.md` · **Device install:** `docs/SETUP_IOS.md`

- [x] Midnight Gourmet theme + floating pill nav
- [x] Auth (login / signup / guest) + Worker register/login + pull sync
- [x] Nearby, Detail, Log, Wishlist, Menu capture
- [x] Food photos + menu PDF (local + R2 upload when signed in)
- [x] `APIClient.swift` + `SyncService.swift` (SwiftData offline cache)
- [x] **xcodebuild** passes (iPhone 17 Pro Max sim)
- [ ] **Set Xcode Team** + install on physical iPhone (`docs/SETUP_IOS.md`) — only blocker for sideload
- [ ] Simulator/device test pass (user)
- [ ] Menu Vision OCR (replace seed digitize stub)
- [ ] Google Places integration (web has it; iOS deferred)

## Track C — Cloudflare Backend (`cloudflare/`)

- [x] D1 schema + seed (`schema.sql`, `seed.sql`)
- [x] R2 binding (`dinearound-media`)
- [x] REST API — auth, visits, wishlist, restaurants, menu-items, media
- [x] `docs/API.md`, `docs/ARCHITECTURE.md`
- [x] `wrangler d1 create` → paste `database_id` in `wrangler.toml` (`1dcbdb8e-7fa9-4646-8552-63b544b63251`)
- [x] `wrangler secret put AUTH_SECRET` + deploy
- [ ] Route `api.dinearound.salehinlabs.com`
- [ ] Route `dinearound.salehinlabs.com` (web custom domain)

## Consolidation & Git

- [x] Canonical repo at `~/Documents/claude-projects/dinearound-app/`
- [x] **Commit** Midnight Gourmet + Cloudflare backend (`2610ba9`)
- [x] Push + Cloudflare web deploy after Worker deploy succeeds
- [ ] Retire Vercel project (`dinearound-app.vercel.app`)

## Deprecated

| Item | Status |
|------|--------|
| Supabase auth/DB for sync | Replaced by Cloudflare D1 |
| Vercel hosting | Replaced by Cloudflare Workers (OpenNext) |
| Vercel serverless API | Replaced by Worker |
| iCloud/Desktop stale clones | Do not use — see README |

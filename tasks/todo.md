# DineAround — Task Checklist

**Canonical repo:** `~/Documents/claude-projects/dinearound-app/`  
**Tracks:** Web (Next.js on Vercel) + iOS SwiftUI — **shared Cloudflare D1 + R2 backend**  
**Design:** Midnight Gourmet — `design-system/dinearound/MASTER.md`

Plan before 3+ step tasks. Verify before marking done.

---

## Track A — Web

- [x] Next.js 14 app in `web/` (Vercel host)
- [x] Midnight Gourmet UI (dark default + warm peach light mode)
- [x] Log + Wishlist + restaurant detail + media attachments (IndexedDB offline)
- [x] Menu photo → PDF (client-side jsPDF)
- [x] Worker API client + sync (`web/lib/api-client.ts`, `sync-service.ts`)
- [x] Auth via Worker JWT (Supabase bypassed for sync)
- [ ] **Deploy Cloudflare Worker** — blocked: run `wrangler login` or set `CLOUDFLARE_API_TOKEN` (see handoff)
- [x] Set `web/.env.local` → `NEXT_PUBLIC_API_URL` (`https://api.dinearound.salehinlabs.com`; update to workers.dev if no custom route yet)
- [ ] Remove dead Supabase deps when confirmed unused
- [ ] Google Places on web (existing) — keep; iOS still on seed data

## Track B — iOS SwiftUI

**Spec:** `design-handoff/README.md` · **Tokens:** `design-system/dinearound/MASTER.md` (supersedes green-only handoff)

- [x] Midnight Gourmet theme + floating pill nav
- [x] Auth (login / signup / guest) + Worker register/login + pull sync
- [x] Nearby, Detail, Log, Wishlist, Menu capture
- [x] Food photos + menu PDF (local + R2 upload when signed in)
- [x] `APIClient.swift` + `SyncService.swift` (SwiftData offline cache)
- [x] **xcodebuild** passes (iPhone 17 Pro Max sim)
- [ ] Simulator/device test pass (user)
- [ ] Menu Vision OCR (replace seed digitize stub)
- [ ] Google Places integration (web has it; iOS deferred)

## Track C — Cloudflare Backend (`cloudflare/`)

- [x] D1 schema + seed (`schema.sql`, `seed.sql`)
- [x] R2 binding (`dinearound-media`)
- [x] REST API — auth, visits, wishlist, restaurants, menu-items, media
- [x] `docs/API.md`, `docs/ARCHITECTURE.md`
- [ ] `wrangler d1 create` → paste `database_id` in `wrangler.toml`
- [ ] `wrangler secret put AUTH_SECRET` + deploy
- [ ] Route `api.dinearound.salehinlabs.com`

## Consolidation & Git

- [x] Canonical repo at `~/Documents/claude-projects/dinearound-app/`
- [x] **Commit** Midnight Gourmet + Cloudflare backend (`2610ba9`)
- [ ] Push + Vercel redeploy after Worker deploy succeeds

## Deprecated

| Item | Status |
|------|--------|
| Supabase auth/DB for sync | Replaced by Cloudflare D1 |
| Vercel serverless API | Replaced by Worker |
| iCloud/Desktop stale clones | Do not use — see README |

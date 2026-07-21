# DineAround REST API

Base URL: `https://api.dinearound.salehinlabs.com` (or `NEXT_PUBLIC_API_URL` / iOS `API_BASE_URL`)

All authenticated endpoints require `Authorization: Bearer <JWT>` (or `da_session` cookie for same-origin web).

## Auth

| Method | Path | Body | Response |
|--------|------|------|----------|
| POST | `/api/auth/register` | `{ email, password, displayName? }` | `{ success, token, user }` |
| POST | `/api/auth/login` | `{ email, password }` | `{ success, token, user }` |
| POST | `/api/auth/logout` | — | `{ success }` + clears cookie |

Password minimum 6 characters. JWT expires in 30 days.

## Visits

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/visits` | List current user's visits |
| POST | `/api/visits` | Create `{ id?, restaurantId?, restaurantName, visitDate, rating, notes }` |
| PATCH | `/api/visits/:id` | Update fields |
| DELETE | `/api/visits/:id` | Delete visit |

## Wishlist

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/wishlist` | Returns `{ ids: string[], data: [...] }` |
| POST | `/api/wishlist` | `{ restaurantId }` |
| DELETE | `/api/wishlist/:restaurantId` | Remove |

## Restaurants

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/restaurants/nearby` | Query: `lat`, `lng`, `q`, `cuisine`, `price` — seed data + distance sort |
| GET | `/api/restaurants/:id` | Single restaurant |

## Menu items

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/restaurants/:id/menu-items` | List items |
| POST | `/api/restaurants/:id/menu-items` | Replace all `{ items: [{ category, name, price }] }` |

## Media (R2)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/media/upload` | `multipart/form-data`: `file`, `restaurantId`, `visitId?`, `kind` (`food_photo` \| `menu_photo` \| `menu_pdf`) |
| GET | `/api/media/:id` | Stream file from R2 (auth required, owner only) |
| GET | `/api/restaurants/:id/media` | Query: `visitId`, `kind` |

R2 keys: `{restaurant_id}/{uuid}.{ext}`

## Health

| GET | `/api/health` | `{ success, version }` — no auth |

## Architecture

```
┌─────────────┐     HTTPS REST      ┌──────────────────┐
│  Web (Next) │ ──────────────────► │ Cloudflare Worker │
│  iOS Swift  │   Bearer JWT        │  src/index.js     │
└─────────────┘                     └────────┬─────────┘
                                           │
                              ┌────────────┴────────────┐
                              ▼                         ▼
                         D1 (SQLite)              R2 (media)
                    visits, wishlist,           JPEG, PDF
                    restaurants, users
```

**iOS never talks to D1 directly.** Same for web. Both use this Worker as the single API gateway.

## Client env vars

| Platform | Variable | Example |
|----------|----------|---------|
| Web | `NEXT_PUBLIC_API_URL` | `https://api.dinearound.salehinlabs.com` |
| iOS | `API_BASE_URL` (Info.plist) | same |
| Worker | `AUTH_SECRET` (secret) | `openssl rand -base64 32` |
| Worker | `ALLOWED_ORIGINS` (optional) | Vercel + localhost origins |

## Feature parity (web ↔ iOS)

| Feature | Web | iOS | Synced via API |
|---------|-----|-----|----------------|
| Auth (email/password) | ✅ | ✅ | ✅ |
| Guest mode (local only) | ✅ | ✅ | — |
| Nearby / seed restaurants | ✅ local seed | ✅ local seed | API `/nearby` ready |
| Visit log CRUD | ✅ | ✅ | ✅ when signed in |
| Wishlist | ✅ | ✅ | ✅ when signed in |
| Food photos | ✅ IndexedDB + R2 | ✅ local + R2 | ✅ upload |
| Menu PDF/photo | ✅ | ✅ | ✅ upload |
| Menu OCR | backlog | handoff spec | — |
| Google Places | web route stub | — | future |

## Errors

JSON error shape: `{ success: false, error: "message" }` with HTTP 4xx/5xx.

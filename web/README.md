# DineAround Web

Next.js 16 app — Midnight Gourmet UI, Worker API sync, client-side offline storage.

## Local dev

```bash
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL
npm install
npm run dev                  # http://localhost:3000
```

## Cloudflare deploy

Hosted on **Cloudflare Workers** via `@opennextjs/cloudflare` (see `../docs/PAGES_DEPLOY.md`).

```bash
npm run pages:build    # validate OpenNext bundle
npm run pages:preview  # test in Workers runtime
npm run pages:deploy   # deploy to dinearound-web Worker
```

**Live:** https://dinearound-web.samisalehin.workers.dev

## Env vars

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | Cloudflare Worker API (required for sync) |
| `GOOGLE_PLACES_API_KEY` | Server route `/api/restaurants/search` |
| `NEXT_PUBLIC_SUPABASE_*` | Optional legacy auth callback |

Set production build vars in Cloudflare dashboard (**Workers & Pages → dinearound-web → Settings → Variables**) or in `.env.local` before `pages:deploy`.

## Deprecated

Vercel hosting (`dinearound-app.vercel.app`) — retire after custom domain is wired.

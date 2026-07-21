# DineAround Web — Cloudflare Deployment

Next.js 16 web app deploys to **Cloudflare Workers** via [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare) (Cloudflare's recommended adapter for Next 15+). This replaces the legacy Vercel host.

> **Note:** Cloudflare's current Next.js path uses Workers + static assets (`*.workers.dev`), not the older `@cloudflare/next-on-pages` / Pages Functions model. The Workers & Pages dashboard treats both under one platform.

## Architecture

| Component | Name | URL |
|-----------|------|-----|
| Web (Next.js) | `dinearound-web` Worker | `https://dinearound-web.samisalehin.workers.dev` |
| API (REST) | `dinearound-api` Worker | `https://dinearound-api.samisalehin.workers.dev` |
| Database | D1 `dinearound` | bound to API Worker |
| Media | R2 `dinearound-media` | bound to API Worker |

## Prerequisites

- Node.js 18+
- Wrangler authenticated (`npx wrangler login`)
- Cloudflare account with `salehinlabs.com` zone

## Environment variables

Set in **Workers & Pages → dinearound-web → Settings → Variables and Secrets** (and in `web/.env.local` for local dev):

| Variable | Required | Example |
|----------|----------|---------|
| `NEXT_PUBLIC_API_URL` | Yes | `https://dinearound-api.samisalehin.workers.dev` |
| `NEXTJS_ENV` | Dev only | `development` (in `web/.dev.vars`) |

Optional legacy Supabase vars (auth callback only; sync uses Worker JWT):

| Variable | Example |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` |

For Google Places search (`/api/restaurants/search`):

| Variable | Example |
|----------|---------|
| `GOOGLE_PLACES_API_KEY` | server secret |

## Build & deploy

```bash
cd web
npm install
npm run pages:build    # validate build locally
npm run pages:deploy   # deploy to Cloudflare
```

Preview in Workers runtime (closer to production than `next dev`):

```bash
npm run pages:preview
```

## Custom domains

### Web — `dinearound.salehinlabs.com` (recommended)

1. Cloudflare dashboard → **Workers & Pages** → `dinearound-web` → **Settings** → **Domains & Routes**
2. Add custom domain: `dinearound.salehinlabs.com`
3. Cloudflare creates the DNS record automatically if the zone is on Cloudflare

Alternative subdomain: `app.dinearound.salehinlabs.com`

### API — `api.dinearound.salehinlabs.com`

1. **Workers & Pages** → `dinearound-api` → **Settings** → **Domains & Routes**
2. Add route: `api.dinearound.salehinlabs.com/*`
3. Update client env vars:
   - Web: `NEXT_PUBLIC_API_URL=https://api.dinearound.salehinlabs.com`
   - iOS: `INFOPLIST_KEY_API_BASE_URL` in Xcode
4. Update Worker CORS secret:
   ```bash
   cd cloudflare
   npx wrangler secret put ALLOWED_ORIGINS
   # e.g. https://dinearound.salehinlabs.com,http://localhost:3000
   ```

Or uncomment `routes` in `cloudflare/wrangler.toml` and redeploy the API Worker.

## Git integration (optional CI)

Connect `feedmetaco/Dinearound-app` in **Workers & Pages → Create → Workers**:

- **Root directory:** `web`
- **Build command:** `npm run pages:build`
- **Deploy command:** `npx opennextjs-cloudflare deploy`
- Configure build env vars in **Build variables and secrets**

## Retire Vercel

After Cloudflare web deploy is verified:

1. Confirm `https://dinearound-web.samisalehin.workers.dev` (or custom domain) loads
2. Update any bookmarks / OAuth redirect URLs from `dinearound-app.vercel.app`
3. Cloudflare dashboard → Vercel project → **Settings** → disable auto-deploy or delete project
4. Remove Vercel env vars (secrets live in Cloudflare now)

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails on Node APIs | Ensure `nodejs_compat` flag in `web/wrangler.toml` |
| API CORS errors | Set `ALLOWED_ORIGINS` on API Worker to include web URL |
| 404 on routes | Use `pages:preview` to test in Workers runtime |
| Env vars missing in browser | Prefix public vars with `NEXT_PUBLIC_`; redeploy after dashboard changes |

## Rollback

```bash
cd web
npx wrangler rollback
```

Or redeploy a previous git commit and run `npm run pages:deploy`.

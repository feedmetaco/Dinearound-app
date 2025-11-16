# DineAround Web Deployment Plan

## Overview

This document outlines the complete deployment infrastructure for the DineAround web application, including hosting platforms, database setup, CDN configuration, CI/CD pipelines, and cost estimates.

## Hosting Platform: Vercel

### Why Vercel

- **Zero-config deployment**: Connect GitHub repo, push to `main` branch, site deploys in 30 seconds
- **Built-in CI/CD**: Automatic builds on PR, preview URLs for each commit (`dinearound-pr-42.vercel.app`)
- **Edge network**: 100+ global CDN locations for <50ms latency worldwide
- **Free SSL certificates**: Let's Encrypt with automatic renewal
- **Serverless functions**: For Next.js API routes (no separate backend server)

### Cost Breakdown

| Tier | Price | Bandwidth | Serverless Hours | Use Case |
|------|-------|-----------|------------------|----------|
| **Hobby (Free)** | $0/month | 100GB/month | 100 hours/month | 0-1k users, MVP phase |
| **Pro** | $20/month | 1TB/month | 1,000 hours/month | 50k+ monthly visitors |

**Estimate**: Remain on free tier for first 6-12 months until bandwidth exceeds 100GB.

### Setup Steps

1. Create Vercel account and connect GitHub repository
2. Configure build settings:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GOOGLE_MAPS_API_KEY`
   - `GOOGLE_PLACES_API_KEY`
   - `CLOUDFLARE_R2_ACCESS_KEY_ID`
   - `CLOUDFLARE_R2_SECRET_ACCESS_KEY`

## Database: Supabase

### Why Supabase

- **Managed PostgreSQL**: Automatic backups, point-in-time recovery, connection pooling
- **Auto-generated APIs**: REST and GraphQL APIs with TypeScript types
- **Row-Level Security**: Authorization enforced at database level
- **Built-in Auth**: Email, OAuth, magic links with JWTs
- **Realtime**: Websocket subscriptions for live updates

### Cost Breakdown

| Tier | Price | Database | Storage | Bandwidth | MAU |
|------|-------|----------|---------|-----------|-----|
| **Free** | $0/month | 500MB | 1GB | 2GB | 50k |
| **Pro** | $25/month | 8GB | 100GB | 250GB | Unlimited |

**Estimate**:
- Free tier: 0-1k users
- Pro tier: Upgrade at ~2k users when storage exceeds 1GB

### Database Schema

```sql
-- Users (handled by Supabase Auth)
create table users (
  id uuid references auth.users primary key,
  email text unique not null,
  subscription_tier text default 'free',
  created_at timestamp default now()
);

-- Restaurants (cached Google Places data)
create table restaurants (
  id uuid primary key default uuid_generate_v4(),
  google_place_id text unique,
  name text not null,
  address text,
  lat numeric,
  lng numeric,
  cuisine_type text,
  price_level int,
  cached_at timestamp default now()
);

-- Visits (user logs)
create table visits (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  restaurant_id uuid references restaurants(id),
  visit_date date not null,
  rating_overall int check (rating_overall between 1 and 5),
  rating_food int check (rating_food between 1 and 5),
  rating_service int check (rating_service between 1 and 5),
  rating_ambiance int check (rating_ambiance between 1 and 5),
  notes text,
  photos text[], -- array of R2 URLs
  created_at timestamp default now()
);

-- Wishlist
create table wishlists (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  restaurant_id uuid references restaurants(id),
  tags text[],
  added_at timestamp default now(),
  unique(user_id, restaurant_id)
);

-- OCR Jobs
create table ocr_jobs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  visit_id uuid references visits(id) on delete cascade,
  image_url text not null,
  extracted_text text,
  status text default 'pending', -- pending, processing, completed, failed
  created_at timestamp default now()
);

-- Row-Level Security Policies
alter table visits enable row level security;
create policy "Users see own visits" on visits for select using (auth.uid() = user_id);
create policy "Users insert own visits" on visits for insert with check (auth.uid() = user_id);
create policy "Users update own visits" on visits for update using (auth.uid() = user_id);
create policy "Users delete own visits" on visits for delete using (auth.uid() = user_id);

alter table wishlists enable row level security;
create policy "Users see own wishlist" on wishlists for select using (auth.uid() = user_id);
create policy "Users insert own wishlist" on wishlists for insert with check (auth.uid() = user_id);
create policy "Users delete own wishlist" on wishlists for delete using (auth.uid() = user_id);

alter table ocr_jobs enable row level security;
create policy "Users see own OCR jobs" on ocr_jobs for select using (auth.uid() = user_id);
create policy "Users insert own OCR jobs" on ocr_jobs for insert with check (auth.uid() = user_id);

-- Indexes for performance
create index visits_user_id_idx on visits(user_id);
create index visits_visit_date_idx on visits(visit_date);
create index restaurants_google_place_id_idx on restaurants(google_place_id);
create index wishlists_user_id_idx on wishlists(user_id);
```

### Setup Steps

1. Create Supabase project at [supabase.com](https://supabase.com)
2. Run schema SQL in SQL Editor
3. Configure authentication providers (Google OAuth, Email)
4. Set up storage bucket for images:
   ```sql
   insert into storage.buckets (id, name, public)
   values ('restaurant-photos', 'restaurant-photos', true);

   create policy "Users upload own photos"
   on storage.objects for insert
   with check (bucket_id = 'restaurant-photos' and auth.uid()::text = (storage.foldername(name))[1]);
   ```

## Image Storage: Cloudflare R2

### Why Cloudflare R2

- **S3-compatible API**: Works with existing libraries and tools
- **Zero egress fees**: $0 for downloads (vs S3's $0.09/GB)
- **Cost-effective storage**: $0.015/GB/month (1/3 of S3)
- **Global CDN**: Cloudflare's network for fast delivery

### Cost Breakdown

| Item | Price | Example (5k users) |
|------|-------|-------------------|
| Storage | $0.015/GB/month | 500GB = $7.50/month |
| Class A Ops (write) | $4.50/million | 10k uploads = $0.045 |
| Class B Ops (read) | $0.36/million | 100k views = $0.036 |
| **Total** | | **~$7.58/month** |

### Setup Steps

1. Create R2 bucket in Cloudflare dashboard
2. Generate API token with R2 read/write permissions
3. Configure bucket CORS:
   ```json
   [
     {
       "AllowedOrigins": ["https://dinearound.app"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
       "AllowedHeaders": ["*"]
     }
   ]
   ```
4. Integrate with Supabase Storage or use directly via AWS SDK

## Authentication: Supabase Auth

### Providers

- **Email/Password**: Built-in with email verification
- **Google OAuth**: Primary social login
- **Magic Links**: Passwordless authentication option
- **GitHub OAuth**: For developer community

### Configuration

```javascript
// supabase/auth config
{
  providers: ['google', 'github'],
  email: {
    confirmations: true,
    invites: false
  },
  jwt: {
    expiry: 3600, // 1 hour access token
    refreshToken: {
      rotationEnabled: true,
      reuseInterval: 10 // seconds
    }
  }
}
```

### Google OAuth Setup

1. Create project in Google Cloud Console
2. Configure OAuth consent screen
3. Create OAuth 2.0 credentials
4. Add authorized redirect URI: `https://<project-ref>.supabase.co/auth/v1/callback`
5. Add credentials to Supabase Auth settings

## CI/CD Pipeline: GitHub Actions + Vercel

### Pipeline Configuration

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline
on:
  pull_request:
  push:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
      - run: npm ci
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v3

  migrate-db:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - run: npx supabase db push --db-url ${{ secrets.SUPABASE_DB_URL }}
```

### Vercel Integration

- **Preview Deployments**: Automatic for every PR
- **Production Deployments**: Automatic on merge to `main`
- **Environment Variables**: Separate for preview vs production

## Domain and SSL

### Domain Setup

1. **Register domain**: `dinearound.app` via Cloudflare Registrar (~$10/year)
2. **Configure DNS**: Add Vercel's A/CNAME records
3. **SSL Certificate**: Automatic via Vercel + Let's Encrypt

### DNS Records

```
A     dinearound.app      76.76.21.21 (Vercel IP)
CNAME www                 cname.vercel-dns.com
CNAME api                 cname.vercel-dns.com
```

## Monitoring and Analytics

### Error Tracking: Sentry

- **Free Tier**: 5k errors/month, 7-day retention
- **Setup**: Add `@sentry/nextjs` package
- **Configuration**:
  ```javascript
  // sentry.config.js
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 0.1,
    environment: process.env.NODE_ENV
  });
  ```

### Performance: Vercel Analytics

- **Web Vitals**: LCP, FID, CLS tracking
- **Real User Monitoring**: Per-route performance
- **Cost**: Free on Hobby tier, $10/month Pro addon

### User Analytics: PostHog

- **Event Tracking**: Custom events for user actions
- **Funnels**: Signup → First Visit → Premium conversion
- **Free Tier**: 1 million events/month (cloud) or unlimited (self-hosted)
- **Privacy**: GDPR-compliant, no cookies required

## API Integrations

### Google Places API

- **Endpoints**: Text Search, Place Details, Nearby Search
- **Cost**: $17/1,000 requests after $200 monthly credit
- **Estimate**: 500 searches/day = $0 (within free credit)

### Google Maps JavaScript API

- **Features**: Map rendering, markers, info windows
- **Cost**: $7/1,000 map loads after $200 monthly credit
- **Estimate**: 5k loads/month = $0 (within free credit)

### Google Cloud Vision API

- **Feature**: Text Detection (OCR)
- **Cost**: $1.50/1,000 requests after 1,000 free/month
- **Estimate**: 2k scans/month = $1.50/month

## Cost Summary

### Monthly Infrastructure Costs

| Service | 0-1k Users | 1k-5k Users | 5k-20k Users |
|---------|-----------|-------------|--------------|
| Vercel | $0 | $0-20 | $20 |
| Supabase | $0 | $25 | $25-50 |
| Cloudflare R2 | $5 | $7-25 | $50-100 |
| Google APIs | $0 | $0-10 | $20-50 |
| Domain | $0.83 | $0.83 | $0.83 |
| Sentry | $0 | $0-26 | $26 |
| **Total** | **$5.83** | **$32-86** | **$141-246** |

### Scaling Thresholds

- **0-1k users**: Free tier sufficient for everything except R2
- **1k-5k users**: Upgrade Supabase to Pro, possibly Vercel to Pro
- **5k-20k users**: All services on paid tiers, optimize costs via caching

## Deployment Checklist

### Pre-Launch

- [ ] Set up Vercel project and connect GitHub repo
- [ ] Create Supabase project and run schema migrations
- [ ] Configure Cloudflare R2 bucket and CORS
- [ ] Set up Google Cloud project and enable APIs
- [ ] Add all environment variables to Vercel
- [ ] Configure Supabase Auth providers
- [ ] Set up custom domain and SSL
- [ ] Configure Sentry error tracking
- [ ] Test preview deployment

### Launch Day

- [ ] Merge to `main` and deploy production
- [ ] Verify all API integrations working
- [ ] Test authentication flows (email, Google OAuth)
- [ ] Test image upload to R2
- [ ] Verify database connections and RLS policies
- [ ] Set up monitoring dashboards
- [ ] Enable Vercel Analytics

### Post-Launch

- [ ] Monitor error rates in Sentry
- [ ] Track Web Vitals in Vercel Analytics
- [ ] Set up PostHog event tracking
- [ ] Configure database backups
- [ ] Set up uptime monitoring (UptimeRobot)
- [ ] Create incident response runbook

## Backup and Disaster Recovery

### Database Backups

- **Supabase**: Automatic daily backups (7-day retention on Free, 30-day on Pro)
- **Manual Exports**: Weekly `pg_dump` to S3 for critical data

### Image Backups

- **R2**: Enable versioning for accidental deletion protection
- **Alternative**: Sync to S3 Glacier for long-term archival ($0.004/GB/month)

### Disaster Recovery Plan

1. **Database Failure**: Restore from Supabase backup (RPO: 24 hours)
2. **Vercel Outage**: Deploy to Netlify as fallback (manual process)
3. **R2 Outage**: Serve cached images from Vercel Edge Network
4. **Complete Failure**: Restore from weekly exports (RTO: 4 hours)

## Security Considerations

### Environment Variables

- Store secrets in Vercel environment variables (encrypted at rest)
- Use different API keys for preview vs production
- Rotate API keys quarterly

### Database Security

- Row-Level Security (RLS) policies enforce user isolation
- Prepared statements prevent SQL injection
- Rate limiting on Supabase API (1000 req/min default)

### API Security

- CORS configured to allow only `dinearound.app` origin
- API routes verify Supabase JWT before processing
- Rate limiting on API routes via Vercel Edge Middleware

### Content Security

- Content Security Policy (CSP) headers to prevent XSS
- Sanitize user input before storing in database
- Image uploads scanned for malware (Cloudflare Image Scanning)

## Monitoring Alerts

### Set Up Alerts For

- **Error Rate**: >50 errors/hour (Sentry)
- **API Latency**: >2 second p95 response time (Vercel)
- **Database Connections**: >80% of connection pool (Supabase)
- **Storage Usage**: >80% of quota (R2, Supabase)
- **Downtime**: >1 minute outage (UptimeRobot)

### Alert Channels

- Email: Primary notification method
- Slack: #alerts channel for team notifications
- SMS: Critical alerts only (via Twilio)

---

**Last Updated**: 2025-01-14
**Document Owner**: Sami Salehin
**Review Cadence**: Monthly or after major infrastructure changes

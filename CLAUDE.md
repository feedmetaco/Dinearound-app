# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DineAround is a restaurant tracking and discovery app. The project is transitioning from an iOS-first approach to a **web-first strategy** with eventual iOS development. The web application will be built with Next.js 14 and deployed to production first, with the iOS app reusing the web backend and database schema later.

### Current State
- **iOS**: Basic SwiftUI skeleton with 3 tabs (Nearby, Log, Wishlist) exists in `ios/Dinearound-app/`
- **Web**: Not yet implemented, but comprehensive planning documents exist in `docs/`
- **Production Target**: Web application (Next.js 14 + Supabase + Vercel)

## Architecture

### Web Application (Primary Focus)

**Tech Stack**:
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Hosting**: Vercel (auto-deploy from `main` branch)
- **Image Storage**: Cloudflare R2 (S3-compatible, zero egress fees)
- **APIs**: Google Places API, Google Maps JavaScript API, Google Cloud Vision API (OCR)
- **State**: Zustand (client state) + React Query (server state)
- **Forms**: React Hook Form + Zod validation

**Database Schema** (see `docs/WEB_DEPLOYMENT_PLAN.md:65-143`):
- `users` - User accounts (managed by Supabase Auth)
- `restaurants` - Cached Google Places data with geospatial indexing
- `visits` - User visit logs with ratings, notes, photos
- `wishlists` - User wishlist items
- `ocr_jobs` - OCR processing jobs for menu photos
- All tables use Row-Level Security (RLS) for user data isolation

**Folder Structure** (planned for web):
```
app/                    # Next.js App Router pages
  (auth)/              # Auth-protected routes
    nearby/            # Restaurant discovery tab
    log/               # Visit logging tab
    wishlist/          # Wishlist management tab
  api/                 # API routes (serverless functions)
components/            # React components
  ui/                  # shadcn/ui components
lib/                   # Utilities, API clients
  supabase/           # Supabase client setup
  google/             # Google Maps/Places/Vision clients
stores/               # Zustand state stores
hooks/                # React Query hooks
types/                # TypeScript types
```

### iOS Application (Future)

**Current Structure**:
- Location: `ios/Dinearound-app/`
- Xcode Project: `Dinearound-app.xcodeproj`
- Entry Point: `Dinearound_appApp.swift`
- Main UI: `ContentView.swift` (TabView with 3 tabs)

**Planned Structure** (from `docs/PLAN.md:24-30`):
```
Models/         # Data models
Views/          # SwiftUI views
ViewModels/     # View models
Services/       # API clients, location services
```

**iOS Notes**:
- Requires Xcode on macOS (cannot build from Docker/Linux)
- Target: iOS 16+
- Bundle ID: `com.yourname.dinearound`
- Local storage: Start with `@AppStorage` or JSON file

## Development Commands

### iOS (Xcode)

**Build and Run**:
- Open `ios/Dinearound-app/Dinearound-app.xcodeproj` in Xcode
- Select iPhone simulator or connected device
- Press Cmd+R to build and run

**Deploy to Physical iPhone**:
1. Connect iPhone via USB
2. Enable Developer Mode on iPhone (Settings → Privacy & Security)
3. Sign into Xcode with Apple ID (Signing & Capabilities tab)
4. Select iPhone as run destination
5. Build and run (Cmd+R)

### Web (Not Yet Implemented)

**Setup** (future):
```bash
# Initialize Next.js project
npx create-next-app@latest dinearound-web \
  --typescript --tailwind --app --no-src-dir --import-alias "@/*"

# Install dependencies
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs \
  @tanstack/react-query zustand react-hook-form zod \
  @googlemaps/js-api-loader @aws-sdk/client-s3

# Install dev dependencies
npm install -D vitest @playwright/test eslint prettier husky lint-staged
```

**Development**:
```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
npm test             # Run unit tests (Vitest)
npm run test:e2e     # Run E2E tests (Playwright)
```

**Database Migrations**:
```bash
# Run schema migrations on Supabase
npx supabase db push --db-url $SUPABASE_DB_URL
```

## Git Workflow

**Multi-Computer Setup** (Mac mini + MacBook):
```bash
# First-time setup on each Mac
git clone git@github.com:feedmetaco/Dinearound-app.git
cd Dinearound-app
git config pull.rebase true

# Daily workflow
git pull --rebase        # Before starting work
# ... make changes ...
git add -A
git commit -m "message"
git push                 # After finishing work
```

**Branch Strategy**:
- `main`: Production branch (auto-deploys to Vercel for web)
- `feature/*`: Feature branches (create PRs to `main`)
- `hotfix/*`: Urgent production fixes

**CI/CD**:
- GitHub Actions workflow: `.github/workflows/ci.yml`
- Current: Placeholder for Xcode builds
- Future: Lint → Test → Migrate DB → Deploy to Vercel

## Key Design Decisions

### 1. Web-First Strategy
- Launch Next.js web app first (3-4 weeks to MVP)
- Achieve product-market fit on web (6-12 months)
- Resume iOS development only after validating web metrics
- iOS will reuse Supabase backend (same database, APIs)

**Rationale**: Avoid 7-14 day App Store review cycle, enable instant deployment, reach Android/desktop users, iterate faster.

### 2. Freemium Monetization
- **Free Tier**: 100 visit logs, 3 photos/visit, basic export (CSV)
- **Premium Tier**: $4.99/month or $39/year - unlimited visits, 10 photos/visit, OCR menu scanning (20/month), PDF export, advanced analytics

**Target Metrics** (from `docs/WEB_STRATEGY.md:22-42`):
- Month 6: 2,000+ MAU, 70% activation rate, $500+ MRR
- Month 12: 10,000+ MAU, 3% premium conversion, $3,000+ MRR
- Month 24: 50,000+ MAU, $15,000+ MRR, launch iOS app

### 3. Row-Level Security (RLS)
All user data is isolated at the database level using Supabase RLS policies. API routes verify JWT tokens, but authorization is enforced by PostgreSQL policies.

### 4. Cost Optimization
- Cache Google Places API responses (24-hour TTL) to stay within free tier
- Compress images to WebP (<500KB) before uploading to R2
- Limit OCR to premium users (20 scans/month) to control Cloud Vision costs
- Free tier infrastructure budget: $5.83/month (scales to $32-86/month at 1k-5k users)

## Important Guidelines

### When Working on Web Features

1. **Always use TypeScript** - Enable strict mode, avoid `any`
2. **Server vs Client Components** - Default to Server Components, only use `'use client'` when needed (forms, state, browser APIs)
3. **API Routes** - All API routes must verify Supabase JWT before processing requests
4. **Database Queries** - Prefer Supabase client over raw SQL for RLS enforcement
5. **Image Uploads** - Always compress to WebP and validate file size (<5MB) before uploading to R2
6. **Error Handling** - Use Sentry for error tracking, wrap async operations in try-catch
7. **Performance** - Keep Lighthouse score >90, LCP <2s, CLS <0.1

### When Working on iOS Features

1. **Folder Organization** - Follow `Models/`, `Views/`, `ViewModels/`, `Services/` structure
2. **SwiftUI** - Use declarative syntax, avoid UIKit unless absolutely necessary
3. **Data Persistence** - Start with `@AppStorage` for simple data, migrate to local JSON or SQLite for complex data
4. **API Integration** - When web backend is ready, use URLSession to call Supabase REST API
5. **Location Services** - Request "When In Use" authorization (not "Always") for GPS features
6. **Testing** - Must build and test on physical iPhone before committing (simulator is insufficient for geofencing)

### Feature Prioritization

Use this formula (from `docs/WEB_STRATEGY.md:471-494`):
```
Priority Score = (User Value + Business Impact) / Engineering Effort
```

Build features with score >2.0 for MVP, >1.5 for post-launch.

**Example**:
- Photo upload: (9 + 8) / 6 = 2.83 ✅ Build now
- OCR menu parsing: (7 + 6) / 8 = 1.63 → Build in Phase 3
- Voice notes: (6 + 3) / 7 = 1.29 → Skip for now

## Documentation

- `docs/PLAN.md` - V0.001 plan and feature list for iOS
- `docs/FEATURES.md` - Complete feature backlog (Basic/Intermediate/Premium tiers)
- `docs/WEB_STRATEGY.md` - Web-first strategy, market analysis, monetization, GTM plan
- `docs/WEB_TECH_STACK.md` - Detailed tech stack decisions with alternatives considered
- `docs/WEB_DEPLOYMENT_PLAN.md` - Infrastructure setup, database schema, cost breakdown
- `docs/WEB_IMPLEMENTATION_PLAN.md` - Phase-by-phase implementation plan (if exists)
- `docs/SETUP_IOS.md` - iOS build and deployment instructions
- `docs/MULTI_COMPUTER_GIT.md` - Multi-Mac git workflow
- `docs/DOCKER_MCP_NOTES.md` - Docker and MCP notes (if relevant)

## Environment Variables (Web)

**Required for Vercel Deployment**:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx
SUPABASE_DB_URL=postgresql://postgres:xxx@db.xxx.supabase.co:5432/postgres

# Google APIs
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaxxx
GOOGLE_PLACES_API_KEY=AIzaxxx
GOOGLE_CLOUD_VISION_KEY_JSON={"type":"service_account",...}

# Cloudflare R2
CLOUDFLARE_ACCOUNT_ID=xxx
CLOUDFLARE_R2_ACCESS_KEY_ID=xxx
CLOUDFLARE_R2_SECRET_ACCESS_KEY=xxx

# Monitoring
SENTRY_DSN=https://xxx@sentry.io/xxx
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx

# Payments (Phase 4)
STRIPE_SECRET_KEY=sk_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_xxx
```

## Common Pitfalls

1. **Don't use `'use client'` everywhere** - Server Components reduce bundle size by 30-40%
2. **Don't skip RLS policies** - Direct SQL queries bypass RLS, use Supabase client
3. **Don't commit sensitive keys** - Use `.env.local` for local dev, Vercel env vars for production
4. **Don't forget to compress images** - Uncompressed photos will blow through R2 budget
5. **Don't cache Google Places data forever** - 24-hour TTL is a good balance (fresh data, stay in free tier)
6. **Don't build iOS from Docker/WSL** - Xcode on macOS is required for iPhone builds

## Support

- GitHub Issues: https://github.com/feedmetaco/Dinearound-app/issues
- Project Owner: Sami Salehin

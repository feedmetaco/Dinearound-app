# DineAround Web Implementation Plan

## Overview

This document provides a detailed, phased implementation roadmap for building the DineAround web application from MVP to full-featured product. Each phase includes specific features, time estimates, technical requirements, and success criteria.

## Development Philosophy

- **Ship early, iterate fast**: Launch MVP in 3-4 weeks, gather user feedback
- **Mobile-first**: 70% of restaurant searches happen on mobile
- **Progressive enhancement**: Start simple, add complexity only when validated by user behavior
- **Measure everything**: Track activation, retention, and engagement metrics from day 1

## Phase 1: Core MVP (Weeks 1-3)

### Timeline: 80-100 hours over 3 weeks

### Goals

- Launch functional web app with three main features: Nearby, Log, Wishlist
- Enable user authentication and basic data persistence
- Deploy to production with custom domain
- Achieve <2 second page load time

### Features

#### 1.1 Project Setup (6-8 hours)

- [ ] Initialize Next.js 14 project with App Router
- [ ] Configure TypeScript, ESLint, Prettier
- [ ] Set up Tailwind CSS and shadcn/ui components
- [ ] Configure Vercel deployment
- [ ] Set up GitHub Actions for CI (lint, type-check)

**Tech Stack**:
```bash
npx create-next-app@latest dinearound-web --typescript --tailwind --app
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install zustand @tanstack/react-query
npm install date-fns zod react-hook-form
```

#### 1.2 Authentication (12-15 hours)

- [ ] Implement Supabase Auth integration
- [ ] Create login/signup pages with email/password
- [ ] Add Google OAuth provider
- [ ] Build protected route middleware
- [ ] Create user profile page (basic)
- [ ] Add session persistence and refresh logic

**Key Files**:
- `app/auth/login/page.tsx`
- `app/auth/signup/page.tsx`
- `app/auth/callback/route.ts`
- `middleware.ts` (route protection)

**Success Criteria**:
- User can sign up with email and receive verification email
- User can log in with Google OAuth in <3 clicks
- Session persists across browser tabs
- Protected routes redirect to login if unauthenticated

#### 1.3 Database Schema & Setup (8-10 hours)

- [ ] Create Supabase project
- [ ] Run schema migrations (users, restaurants, visits, wishlists)
- [ ] Configure Row-Level Security policies
- [ ] Set up database indexes for performance
- [ ] Create TypeScript types from schema (auto-generated)

**Schema** (see WEB_DEPLOYMENT_PLAN.md for full SQL)

**Success Criteria**:
- All tables created with proper relationships
- RLS policies prevent cross-user data access
- TypeScript types auto-generated via Supabase CLI

#### 1.4 Nearby Tab - Restaurant Search (18-22 hours)

- [ ] Integrate Google Places API (Text Search)
- [ ] Build restaurant search input with debouncing
- [ ] Display restaurant list with name, address, rating
- [ ] Add filter UI (cuisine type, distance, price range)
- [ ] Implement geolocation permission request
- [ ] Cache restaurant data in local database
- [ ] Add loading states and error handling

**Key Components**:
- `app/(app)/nearby/page.tsx`
- `components/restaurant-search.tsx`
- `components/restaurant-card.tsx`
- `components/filters.tsx`

**API Route**:
```typescript
// app/api/restaurants/search/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  // Call Google Places API
  // Cache results in Supabase
  // Return to frontend
}
```

**Success Criteria**:
- Search returns results in <1 second
- Geolocation permission requested on first visit
- Filters persist in URL query params
- Results cached for 24 hours

#### 1.5 Log Tab - Visit Form (16-20 hours)

- [ ] Build visit log form (restaurant, date, rating, notes)
- [ ] Integrate with restaurant search (typeahead)
- [ ] Add date picker (defaults to today)
- [ ] Implement 5-star rating input
- [ ] Add notes textarea with markdown support
- [ ] Create "Save Visit" mutation to Supabase
- [ ] Show success toast on save
- [ ] Redirect to visit detail page after save

**Key Components**:
- `app/(app)/log/page.tsx`
- `components/visit-form.tsx`
- `components/rating-input.tsx`
- `components/restaurant-autocomplete.tsx`

**Success Criteria**:
- Form validates all required fields
- Restaurant autocomplete shows Google Places results
- Visit saves to database with correct user_id
- Success state shows within 500ms of save

#### 1.6 Wishlist Tab - CRUD Operations (12-15 hours)

- [ ] Display wishlist items in card grid
- [ ] Implement "Add to Wishlist" from Nearby tab
- [ ] Add manual restaurant entry option
- [ ] Build swipe-to-delete on mobile (or delete button)
- [ ] Add tag input for categorization
- [ ] Implement sort by distance (requires geolocation)
- [ ] Show empty state with CTA

**Key Components**:
- `app/(app)/wishlist/page.tsx`
- `components/wishlist-card.tsx`
- `components/add-to-wishlist-modal.tsx`

**Success Criteria**:
- Add/remove from wishlist updates in <300ms
- Tags save and display correctly
- Swipe gesture works on mobile Safari
- Empty state encourages first addition

#### 1.7 Layout & Navigation (8-10 hours)

- [ ] Create app layout with header and navigation
- [ ] Build responsive tab navigation (top on desktop, bottom on mobile)
- [ ] Add global search bar (Cmd+K shortcut)
- [ ] Implement user menu with logout
- [ ] Add loading skeletons for all views
- [ ] Configure favicon and metadata

**Key Components**:
- `app/(app)/layout.tsx`
- `components/header.tsx`
- `components/nav-tabs.tsx`
- `components/bottom-nav.tsx` (mobile)

**Success Criteria**:
- Navigation works without page refreshes (SPA behavior)
- Active tab highlights correctly
- Mobile navigation sticks to bottom
- Cmd+K opens search modal

### Testing & QA (6-8 hours)

- [ ] Manual testing on Chrome, Safari, Firefox
- [ ] Mobile testing on iOS Safari, Chrome Android
- [ ] Test authentication flows (signup, login, logout)
- [ ] Test all CRUD operations
- [ ] Fix any critical bugs

### Deployment (2-3 hours)

- [ ] Configure environment variables in Vercel
- [ ] Set up custom domain (dinearound.app)
- [ ] Configure SSL certificate
- [ ] Run production build and deploy
- [ ] Verify all features work in production

### Phase 1 Success Metrics

- **Activation**: 70% of signups log at least 1 visit within 7 days
- **Performance**: LCP <2.5 seconds, FID <100ms
- **Uptime**: 99.5% availability (allow for deployment windows)

---

## Phase 2: Enhanced Discovery (Weeks 4-6)

### Timeline: 60-80 hours over 3 weeks

### Goals

- Add map visualization for restaurant discovery
- Implement photo upload for visit logs
- Build visit detail pages with image galleries
- Add tag system for organization

### Features

#### 2.1 Google Maps Integration (18-22 hours)

- [ ] Add Google Maps JavaScript API
- [ ] Render map on Nearby tab (50% viewport height)
- [ ] Display restaurant pins with info windows
- [ ] Show user location marker (blue dot)
- [ ] Implement map/list toggle view
- [ ] Add cluster markers for dense areas
- [ ] Sync map bounds with list filters

**Key Components**:
- `components/restaurant-map.tsx`
- `hooks/use-google-maps.ts`

**Success Criteria**:
- Map loads in <1 second
- Pins clickable with restaurant details
- Map updates when filters change
- Mobile performance stays smooth (60fps)

#### 2.2 Photo Upload (16-20 hours)

- [ ] Set up Cloudflare R2 bucket
- [ ] Build upload component (drag-drop + click)
- [ ] Implement client-side image compression (WebP)
- [ ] Add upload progress indicator
- [ ] Store image URLs in visits.photos array
- [ ] Display image gallery on visit cards
- [ ] Add delete photo functionality

**Key Components**:
- `components/photo-upload.tsx`
- `components/image-gallery.tsx`
- `app/api/upload/route.ts`

**Tech**:
```typescript
// Client-side compression
import imageCompression from 'browser-image-compression';

const compressedFile = await imageCompression(file, {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true
});
```

**Success Criteria**:
- Upload 5 images in <10 seconds on 4G
- Images compressed to <500KB each
- Progress bar updates during upload
- Photos display in visit detail page

#### 2.3 Visit Detail Pages (12-15 hours)

- [ ] Create dynamic route `/visits/[id]`
- [ ] Display full visit details (photos, notes, rating)
- [ ] Add edit visit functionality
- [ ] Implement delete visit with confirmation
- [ ] Show restaurant location on mini-map
- [ ] Add "Get Directions" button (Google Maps link)

**Key Files**:
- `app/(app)/visits/[id]/page.tsx`
- `app/(app)/visits/[id]/edit/page.tsx`

**Success Criteria**:
- Page loads in <1 second
- Photos display in lightbox gallery
- Edit form pre-filled with existing data
- Delete confirms before executing

#### 2.4 Tag System (8-10 hours)

- [ ] Add tags field to visit and wishlist forms
- [ ] Build tag input component (auto-complete)
- [ ] Create tag filter on list views
- [ ] Show tag suggestions based on user history
- [ ] Add tag management page (rename, delete)

**Key Components**:
- `components/tag-input.tsx`
- `components/tag-filter.tsx`
- `app/(app)/tags/page.tsx`

**Success Criteria**:
- Tags save and display correctly
- Autocomplete suggests existing tags
- Filter by tag shows correct results

#### 2.5 PWA Configuration (6-8 hours)

- [ ] Add manifest.json for installability
- [ ] Configure service worker for offline caching
- [ ] Cache map tiles and restaurant photos
- [ ] Add "Add to Home Screen" prompt
- [ ] Test offline functionality

**Files**:
- `public/manifest.json`
- `public/sw.js`
- `app/layout.tsx` (manifest link)

**Success Criteria**:
- App installable on iOS/Android
- Cached pages load offline
- "Add to Home Screen" banner appears after 2 visits

### Phase 2 Success Metrics

- **Engagement**: Users upload average 2+ photos per visit
- **Retention**: Day 7 retention >40%
- **Performance**: Map loads in <1s, photo upload <10s for 5 images

---

## Phase 3: Advanced Features (Weeks 7-10)

### Timeline: 80-100 hours over 4 weeks

### Goals

- Implement OCR menu parsing
- Build timeline/history view
- Add visit map overlay
- Create basic analytics dashboard
- Enable visit sharing

### Features

#### 3.1 OCR Menu Parsing (22-26 hours)

- [ ] Integrate Google Cloud Vision API
- [ ] Add "Scan Menu" button to visit form
- [ ] Upload menu photo to R2
- [ ] Call Vision API for text extraction
- [ ] Display extracted text for manual correction
- [ ] Save corrected menu to visit notes
- [ ] Add OCR job status tracking (pending, processing, completed)
- [ ] Implement rate limiting (premium feature)

**Key Components**:
- `components/menu-scanner.tsx`
- `app/api/ocr/route.ts`
- `components/ocr-result-editor.tsx`

**API Flow**:
```typescript
// app/api/ocr/route.ts
export async function POST(request: Request) {
  // 1. Upload image to R2
  // 2. Create ocr_jobs record
  // 3. Call Google Cloud Vision API
  // 4. Update ocr_jobs with extracted_text
  // 5. Return result
}
```

**Success Criteria**:
- OCR accuracy >90% for printed menus
- Results returned in <5 seconds
- User can edit extracted text before saving
- Rate limit enforced (10 scans/month free, unlimited premium)

#### 3.2 Timeline View (14-18 hours)

- [ ] Create timeline page showing all visits chronologically
- [ ] Group visits by month/year
- [ ] Display visit cards with photos and summary
- [ ] Add infinite scroll for pagination
- [ ] Implement filters (date range, tags, cuisine)
- [ ] Add search within timeline

**Key Files**:
- `app/(app)/timeline/page.tsx`
- `components/timeline-card.tsx`
- `components/timeline-filters.tsx`

**Success Criteria**:
- Timeline loads first 20 visits in <1 second
- Infinite scroll works smoothly
- Filters update URL query params
- Search highlights matching text

#### 3.3 Visit Map Overlay (12-15 hours)

- [ ] Create map view showing all visited restaurants
- [ ] Color-code pins by rating or recency
- [ ] Add info windows with visit count and last visit date
- [ ] Implement heatmap mode for density visualization
- [ ] Add date range filter for map
- [ ] Enable pan/zoom with URL state persistence

**Key Files**:
- `app/(app)/map/page.tsx`
- `components/visit-map.tsx`

**Success Criteria**:
- Map renders 100+ pins without lag
- Heatmap updates when filters change
- Info windows show correct visit data
- Map state persists in URL (shareable)

#### 3.4 Analytics Dashboard (16-20 hours)

- [ ] Build dashboard page with key metrics
- [ ] Show total visits, unique restaurants, favorite cuisines
- [ ] Add spending trends chart (monthly)
- [ ] Display most visited restaurants
- [ ] Show cuisine type breakdown (pie chart)
- [ ] Add distance traveled metric (sum of all visit locations)
- [ ] Implement date range selector

**Key Components**:
- `app/(app)/analytics/page.tsx`
- `components/metric-card.tsx`
- `components/cuisine-chart.tsx` (Chart.js or Recharts)
- `components/spending-chart.tsx`

**Success Criteria**:
- Dashboard loads in <2 seconds
- Charts render correctly on mobile
- Metrics update when date range changes
- Data exports to CSV via button

#### 3.5 Visit Sharing (10-12 hours)

- [ ] Add "Share Visit" button to visit detail page
- [ ] Generate public shareable link (`/share/[token]`)
- [ ] Create public visit view (no auth required)
- [ ] Add Open Graph meta tags for social previews
- [ ] Implement share via link, Twitter, Facebook
- [ ] Add privacy toggle (public/private per visit)

**Key Files**:
- `app/share/[token]/page.tsx`
- `app/api/visits/share/route.ts`

**Success Criteria**:
- Share link works without login
- Social preview shows photo and restaurant name
- Privacy toggle prevents access to private visits
- Share link expires after 30 days (optional)

### Phase 3 Success Metrics

- **Feature Adoption**: 30% of users try OCR within first week
- **Engagement**: Timeline viewed 2+ times per week
- **Sharing**: 10% of visits shared publicly

---

## Phase 4: Premium & Scale (Weeks 11-16)

### Timeline: 100-120 hours over 6 weeks

### Goals

- Launch premium subscription tier
- Add data export functionality
- Build recommendation engine
- Optimize performance for scale
- Implement monitoring and alerts

### Features

#### 4.1 Premium Subscription (20-24 hours)

- [ ] Integrate Stripe Checkout
- [ ] Create pricing page ($4.99/month, $39/year)
- [ ] Build subscription management page
- [ ] Implement feature gating (OCR, advanced analytics)
- [ ] Add webhook handler for subscription events
- [ ] Create billing portal (Stripe Customer Portal)
- [ ] Send email confirmations via Supabase Email

**Key Files**:
- `app/(app)/pricing/page.tsx`
- `app/(app)/account/billing/page.tsx`
- `app/api/stripe/checkout/route.ts`
- `app/api/stripe/webhook/route.ts`

**Database**:
```sql
alter table users add column stripe_customer_id text;
alter table users add column stripe_subscription_id text;
alter table users add column subscription_status text;
```

**Success Criteria**:
- Checkout flow completes in <2 minutes
- Subscription status updates within 5 seconds of payment
- Premium features unlock immediately
- Webhook handles all subscription events (created, updated, canceled)

#### 4.2 Data Export (12-15 hours)

- [ ] Build export page with format options (CSV, JSON, PDF)
- [ ] Generate CSV with all visit data
- [ ] Create PDF report with photos and maps
- [ ] Add email delivery for large exports
- [ ] Implement GDPR-compliant data export (all user data)
- [ ] Add delete account functionality

**Key Components**:
- `app/(app)/export/page.tsx`
- `app/api/export/[format]/route.ts`
- `lib/pdf-generator.ts` (PDFKit or Puppeteer)

**Success Criteria**:
- CSV export completes in <10 seconds for 500 visits
- PDF includes photos and maps
- GDPR export includes all user data
- Delete account removes all user data within 24 hours

#### 4.3 Recommendation Engine (18-22 hours)

- [ ] Implement collaborative filtering algorithm
- [ ] Suggest restaurants based on user tags and ratings
- [ ] Show "Users who visited X also liked Y"
- [ ] Add "Recommended for You" section on Nearby tab
- [ ] Implement preference learning (implicit feedback)
- [ ] Add "Not Interested" button to refine recommendations

**Key Files**:
- `app/api/recommendations/route.ts`
- `lib/recommendation-engine.ts`
- `components/recommended-restaurants.tsx`

**Algorithm** (simplified):
1. Find users with similar taste (cosine similarity on ratings)
2. Recommend restaurants they liked but current user hasn't visited
3. Boost recommendations matching user's tags
4. Filter out restaurants user marked "Not Interested"

**Success Criteria**:
- Recommendations appear after 5+ visits logged
- Click-through rate >15% on recommended items
- "Not Interested" removes item permanently

#### 4.4 Performance Optimization (16-20 hours)

- [ ] Implement React Query caching strategy
- [ ] Add Next.js Image optimization for photos
- [ ] Enable Vercel Edge Functions for API routes
- [ ] Implement virtual scrolling for long lists
- [ ] Add database query optimization (indexes, materialized views)
- [ ] Enable Vercel Analytics for performance monitoring
- [ ] Implement code splitting for route-based chunks

**Optimizations**:
```typescript
// Image optimization
import Image from 'next/image';
<Image
  src={photo.url}
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
/>

// Virtual scrolling
import { useVirtualizer } from '@tanstack/react-virtual';
```

**Success Criteria**:
- LCP improves to <1.5 seconds
- FID stays <50ms
- Bundle size <200KB gzipped
- API response times <500ms p95

#### 4.5 Monitoring & Alerts (12-15 hours)

- [ ] Set up Sentry for error tracking
- [ ] Configure Vercel Analytics for Web Vitals
- [ ] Add PostHog for user analytics
- [ ] Create monitoring dashboard (Grafana or similar)
- [ ] Set up alerts for error rates, latency, downtime
- [ ] Implement health check endpoint (`/api/health`)
- [ ] Add logging for critical operations

**Key Files**:
- `sentry.config.js`
- `app/api/health/route.ts`
- `lib/analytics.ts`

**Success Criteria**:
- Errors tracked and grouped in Sentry
- Web Vitals monitored per route
- User events tracked in PostHog
- Alerts fire within 5 minutes of incidents

#### 4.6 Monthly Summary Reports (14-18 hours)

- [ ] Build monthly digest email
- [ ] Show stats (visits, new restaurants, top cuisines)
- [ ] Include map of visited restaurants
- [ ] Add "Memory Lane" section with random past visit
- [ ] Implement email schedule (1st of each month)
- [ ] Add unsubscribe functionality
- [ ] Create web version of report

**Key Components**:
- `app/api/cron/monthly-digest/route.ts` (Vercel Cron)
- `emails/monthly-digest.tsx` (React Email)
- `app/(app)/reports/[month]/page.tsx`

**Success Criteria**:
- Email sends by 9am on 1st of month (user's timezone)
- Open rate >30%
- Click-through to web report >15%
- Unsubscribe rate <2%

### Phase 4 Success Metrics

- **Revenue**: 3% conversion to premium ($5/month)
- **Engagement**: Monthly report viewed by 50% of active users
- **Performance**: p95 API latency <500ms
- **Reliability**: 99.9% uptime

---

## Post-Launch: Continuous Improvement

### Ongoing Tasks

- [ ] Weekly user feedback review (support tickets, feature requests)
- [ ] Monthly performance audit (Web Vitals, error rates)
- [ ] Quarterly security review (dependency updates, penetration testing)
- [ ] A/B testing for conversion optimization
- [ ] SEO optimization for public pages
- [ ] Community building (Discord, subreddit)

### Future Features (Backlog)

- [ ] Social features (friend network, shared wishlists)
- [ ] Restaurant reservations via OpenTable/Resy integration
- [ ] AI-powered trip planning ("Plan a food tour in Paris")
- [ ] Dietary restrictions and allergen tracking
- [ ] Wine/drink pairing recommendations
- [ ] Chef/sommelier profiles for fine dining
- [ ] AR menu translation (camera overlay)
- [ ] Voice notes for visit logs
- [ ] Apple Watch complications
- [ ] Android app (React Native or Flutter)
- [ ] Desktop app (Electron or Tauri)

---

## Development Best Practices

### Code Quality

- **TypeScript Strict Mode**: Catch errors at compile time
- **ESLint + Prettier**: Consistent code formatting
- **Husky Pre-commit Hooks**: Run lint/tests before commit
- **Code Reviews**: All PRs reviewed before merge
- **Test Coverage**: Aim for >70% on critical paths

### Git Workflow

```bash
# Feature branches
git checkout -b feature/visit-sharing
git commit -m "feat: add visit sharing functionality"
git push origin feature/visit-sharing
# Create PR → Review → Merge to main → Auto-deploy
```

### Commit Messages

Follow Conventional Commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructure
- `test:` Add tests
- `chore:` Maintenance

### Testing Strategy

- **Unit Tests**: Utility functions, hooks
- **Integration Tests**: API routes, database queries
- **E2E Tests**: Critical user flows (Playwright)
- **Manual QA**: Every PR on preview deployment

### Documentation

- **Code Comments**: Explain "why", not "what"
- **README**: Setup instructions, architecture overview
- **API Docs**: OpenAPI/Swagger for all endpoints
- **Changelog**: Track all releases and changes

---

## Risk Management

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Google Places API rate limits | Medium | High | Cache aggressively, implement fallback search |
| Database connection pool exhaustion | Low | High | Use connection pooling, monitor metrics |
| Image storage costs exceed budget | Medium | Medium | Implement compression, set upload limits |
| OCR accuracy too low | Medium | High | Add manual correction flow, set expectations |
| Third-party service downtime | Medium | Medium | Implement retry logic, graceful degradation |

### Product Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Low user activation (<50%) | High | Critical | User onboarding flow, empty state CTAs |
| Poor retention (D7 <30%) | Medium | Critical | Push notifications, email engagement campaigns |
| Low premium conversion (<1%) | Medium | High | A/B test pricing, improve feature value prop |
| Privacy concerns (data sharing) | Low | High | Transparent privacy policy, GDPR compliance |
| Competition from Google Maps | High | Medium | Differentiate on privacy, customization |

---

## Success Criteria Summary

### Phase 1 (MVP)

- [ ] 100+ signups in first week
- [ ] 70% activation rate (1+ visit logged)
- [ ] <2 second page load time
- [ ] Zero critical bugs in production

### Phase 2 (Enhanced)

- [ ] 500+ total users
- [ ] 40% Day 7 retention
- [ ] 2+ photos per visit average
- [ ] <1 second map load time

### Phase 3 (Advanced)

- [ ] 1,000+ total users
- [ ] 30% OCR feature adoption
- [ ] 10% visit sharing rate
- [ ] Analytics viewed 2x/week

### Phase 4 (Premium)

- [ ] 3% conversion to premium
- [ ] $500+ MRR (monthly recurring revenue)
- [ ] 99.9% uptime
- [ ] <500ms API latency p95

---

**Last Updated**: 2025-01-14
**Document Owner**: Sami Salehin
**Review Cadence**: End of each phase, adjust timeline as needed

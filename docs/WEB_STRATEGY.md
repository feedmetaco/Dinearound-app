# DineAround Web Strategy

## Executive Summary

### Core Recommendation: Web-First with Progressive iOS Enhancement

**Primary Direction**: Launch a Next.js 14 (App Router) web application with Supabase backend, deployed on Vercel. Build PWA capabilities for mobile home screen installation. Resume iOS development only after achieving product-market fit on web (6-12 months post-launch).

**Timeline**: 3-4 weeks to production-ready MVP, 8-12 weeks to feature parity with planned iOS roadmap.

**Initial Cost**: $0-25/month for first 6 months (leveraging free tiers), scaling to $50-150/month at 1,000+ active users.

**Revenue Strategy**: Launch free with optional "Buy Me a Coffee" donation link. Introduce freemium tier ($4.99/month) after validating engagement metrics, gating premium features like OCR, advanced analytics, and PDF export.

### Why Web-First Wins

You avoid the 7-14 day App Store review cycle, enable instant deployment and A/B testing, reach Android/desktop users immediately, and eliminate the need for Xcode/macOS during rapid iteration. The iOS app can later reuse your API and database schema with minimal rework.

---

## Strategic Goals

### 6-Month Goals (MVP → Growth)

1. **Activation**: 70% of signups log at least 1 visit within 7 days
2. **Retention**: Day 30 retention >25%
3. **Scale**: 2,000+ monthly active users
4. **Revenue**: $500+ MRR from premium tier (launch in Month 6)

### 12-Month Goals (Product-Market Fit)

1. **Scale**: 10,000+ monthly active users
2. **Revenue**: $3,000+ MRR (3% conversion to $5/month premium)
3. **Engagement**: Users log 4+ visits per month on average
4. **Social Proof**: 50+ testimonials, featured on Product Hunt, TechCrunch

### 24-Month Goals (Multi-Platform)

1. **Scale**: 50,000+ monthly active users
2. **Revenue**: $15,000+ MRR
3. **Platform Expansion**: Launch iOS app reusing web backend
4. **Partnerships**: OpenTable/Resy integration for reservations

---

## Market Analysis

### Target Audience

**Primary Persona: "Travel Sarah"**
- Age: 28-35
- Occupation: Digital nomad, product designer, marketing manager
- Behavior: Travels 4-6 months/year, eats out 3-5x/week
- Pain Points:
  - Google Maps timeline doesn't allow notes or photos
  - Notion/Apple Notes don't sync locations or show on maps
  - Instagram is public; wants private food diary
  - Forgets restaurant names after returning from trips

**Secondary Persona: "Foodie Alex"**
- Age: 25-32
- Occupation: Food influencer, chef, hospitality worker
- Behavior: Posts food daily on Instagram (5k-50k followers)
- Pain Points:
  - Instagram doesn't organize by location or cuisine
  - No private archive of meals (before posting publicly)
  - Can't remember which dish was at which restaurant
  - Needs portfolio for food photography

**Tertiary Persona: "Local Liam"**
- Age: 35-50
- Occupation: Business professional, family-oriented
- Behavior: Eats out locally 2-3x/week, values routine
- Pain Points:
  - Wants to track favorite dishes at regular spots
  - Forgets which restaurants kids liked
  - Needs recommendations for date nights
  - Wants to support local businesses

### Market Size

- **TAM (Total Addressable Market)**: 2 billion smartphone users who eat out regularly
- **SAM (Serviceable Addressable Market)**: 200 million "food enthusiasts" who actively track dining experiences (via Google Maps, Yelp, Instagram, Notion)
- **SOM (Serviceable Obtainable Market)**: 500,000 users in first 3 years (0.25% of SAM)

**Comparable Apps**:
- Google Maps (2B users, free) - General-purpose, not food-specific
- Yelp (178M users, freemium) - Discovery-focused, weak on personal logging
- Notion (30M users, freemium) - Flexible but requires manual setup
- Foursquare Swarm (10M users, freemium) - Check-in focused, gamified
- BonAppetour (100k users, travel-focused) - Niche, food tours only

**Differentiation**: DineAround is the **only** app purpose-built for private food memory journaling with maps, photos, and smart search.

### Competitive Advantage

1. **Privacy-First**: No ads, no data selling, optional cloud sync
2. **Purpose-Built**: Designed specifically for food logging (not general note-taking)
3. **Smart Features**: OCR menu parsing, timeline view, map overlay, analytics
4. **Cross-Platform**: Web (desktop + mobile) + PWA + iOS (future) + Android (future)
5. **Affordable**: Free tier generous, premium at $4.99/month (vs Yelp's $9.99/month)

---

## Monetization Strategy

### Revenue Model: Freemium SaaS

**Free Tier (Perpetual)**:
- Unlimited restaurant search and wishlist
- 100 visit logs (covers 1 year of weekly dining out)
- 3 photos per visit
- Basic export (CSV only)
- Manual restaurant entry
- Standard analytics (total visits, top cuisines)

**Premium Tier ($4.99/month or $39/year)**:
- Unlimited visits
- 10 photos per visit
- OCR menu scanning (20 scans/month)
- PDF export with photos (shareable trip reports)
- Advanced analytics (spending trends, heatmaps, recommendations)
- Priority support (48-hour response time)
- Early access to new features

**Why This Works**:
1. **100 free visits is generous** - Most users won't hit this limit for 1-2 years
2. **OCR is premium-only** - Costs $1.50 per 1,000 Cloud Vision API calls, can't give away free at scale
3. **Annual discount (34%)** - Encourages long-term commitment, reduces monthly churn
4. **PDF export** - High-value feature for travel bloggers and food influencers

### Revenue Projections (Conservative)

| Month | MAU | Premium Users (3%) | MRR | Costs | Profit |
|-------|-----|-------------------|-----|-------|--------|
| 1-3   | 100 | 3 | $15 | $5 | +$10 |
| 4-6   | 500 | 15 | $75 | $25 | +$50 |
| 7-9   | 2,000 | 60 | $300 | $120 | +$180 |
| 10-12 | 5,000 | 150 | $750 | $280 | +$470 |
| **Year 1 Total** | | | **$2,820** | **$1,110** | **+$1,710** |

**Assumptions**:
- 3% conversion to premium (industry average for productivity apps)
- 50% choose annual plan (weighted average price = $4.71/month)
- Zero marketing spend (organic growth only)
- Infrastructure costs scale linearly with users

**Sensitivity Analysis**:
- **If 1% Conversion**: Year 1 profit = -$450 (need external funding or reduce free tier)
- **If 5% Conversion**: Year 1 profit = +$4,290 (sustainable growth, profitable from Month 4)
- **If 10% Conversion**: Year 1 profit = +$8,730 (exceptional, indicates strong PMF)

### Alternative Revenue Streams (Considered but Rejected for MVP)

**1. Restaurant Affiliate Partnerships (OpenTable, Resy)**
- **Mechanics**: Earn $1-3 per booking made through app links
- **Rejected Because**:
  - Requires 10,000+ MAU before partners consider integration
  - Only works for reservation-based restaurants (excludes street food, casual dining)
  - Geographic limitations (OpenTable mostly US/UK)
- **Reconsider When**: 10,000+ MAU and 70%+ users in US/UK/Canada

**2. Ad-Supported Free Tier**
- **Mechanics**: Display banner ads in Nearby tab, native sponsored restaurant recommendations
- **Rejected Because**:
  - Ad revenue is $5 RPM (need 100,000 MAU to earn $500/month)
  - Degrades UX in a personal journaling app (ads in your memories feel intrusive)
  - Conflicts with "privacy-first" positioning
- **Reconsider Never**: Ads fundamentally misaligned with product vision

**3. One-Time Purchase (Lifetime Premium)**
- **Mechanics**: $29.99 one-time unlocks all features forever
- **Rejected Because**:
  - Limits long-term revenue (1,000 users × $30 = $30k max)
  - Unsustainable for infrastructure costs (users uploading 50GB photos lifetime)
  - Can't cover ongoing API costs (OCR, Maps)
- **Reconsider When**: Building native iOS app (App Store allows lifetime IAP, web can't do this easily)

---

## Go-To-Market Strategy

### Launch Timeline

**Week 1-3: Build MVP in Public**
- Post weekly progress updates on Twitter/X with screenshots
- Share technical deep-dives on Dev.to ("How I built OCR menu parsing with Google Cloud Vision")
- Collect 100-200 email signups via landing page with "Get Early Access" CTA
- Expected outcome: 50-100 initial users from followers

**Week 4: Product Hunt Launch**
- Post on Tuesday/Wednesday (highest traffic days)
- Headline: "DineAround - A private food diary that doesn't sell your data"
- Prepare 5-minute demo video showing all three tabs
- Target: #1-3 ranking for the day (drives 500-1,000 signups)
- Expected outcome: 500-1,000 signups, 200-300 activate (log 1+ visit)

**Week 5-8: Reddit Community Seeding**
- Post in r/solotravel: "I built a travel food journal after losing all my restaurant notes in Apple Notes"
- Post in r/digitalnomad: "Tired of forgetting great restaurants across 20 cities? I built a solution"
- Post in r/Cooking: "Show your food journey on a map (I built a tool for this)"
- Post in r/FoodNYC, r/FoodLA (city-specific subreddits)
- Expected outcome: 2-3 posts gain traction (50-100 signups each)

**Month 3-6: Content Marketing (SEO Long Game)**
- Publish 10-15 guides targeting long-tail keywords:
  - "Best ramen in Tokyo: A local's guide" (embed your visited restaurants map)
  - "How to remember every restaurant you visit while traveling"
  - "Google Maps timeline alternative for food lovers"
  - "Private food diary apps compared"
- Expected outcome: 500-1,000 organic visits/month by Month 12

**Month 6-12: Food Influencer Partnerships**
- DM 50 micro-influencers (5k-50k followers) on Instagram
- Pitch: "I built a free tool to organize your food content. Want early access?"
- Offer: Free lifetime premium in exchange for Instagram story mention
- Expected outcome: 10 influencers respond, each drives 20-50 signups (200-500 total)

### Distribution Channels (Ranked by ROI)

| Channel | Cost | Effort | Expected CAC | Expected Signups | Retention (D30) |
|---------|------|--------|-------------|-----------------|----------------|
| **Product Hunt** | $0 | High (1 week prep) | $0 | 500-1,000 | 10-20% |
| **Reddit** | $0 | Medium (2-3 hours per post) | $0 | 50-100 per post | 30-40% |
| **Content/SEO** | $0 | High (4-6 hours per article) | $0 | 10-50/week by M6 | 50-60% |
| **Influencers** | $0 | Medium (2-3 hours outreach) | $0 | 20-50 per collab | 40% |
| **Twitter/X** | $0 | Low (30 min per thread) | $0 | 5-10 per thread | 25% |
| **Paid Ads** | $500/month | Low (1 hour setup) | $5-15 | 30-100 | 15-20% |

**Avoid Paid Ads Until**: You've exhausted organic channels and have proven 3%+ conversion to premium (otherwise CAC > LTV).

### Marketing Messaging

**Core Value Proposition**:
"Your personal food memory journal. Never forget a great meal again."

**Key Messages**:
1. **Privacy**: "Your food diary stays private. No ads, no data selling."
2. **Simplicity**: "Log a visit in 60 seconds: restaurant, photo, notes. Done."
3. **Discovery**: "Rediscover restaurants from years ago with smart search and maps."
4. **Nostalgia**: "Relive your travel memories through food."

**Taglines (A/B Test)**:
- "Remember every great meal"
- "Your food journey, mapped"
- "Private food diary for travelers"
- "Never lose a restaurant recommendation again"

---

## Product Roadmap

### Phase 1: MVP (Weeks 1-3)

**Features**:
- User authentication (email + Google OAuth)
- Nearby tab (Google Places search + list view)
- Log tab (visit form with restaurant, date, rating, notes)
- Wishlist tab (add/remove with swipe-to-delete)
- Responsive design (mobile-first)

**Success Metrics**:
- 70% activation rate (signup → first visit logged)
- <2 second page load time (LCP)
- Zero critical bugs in production

### Phase 2: Enhanced Discovery (Weeks 4-6)

**Features**:
- Google Maps integration with pins and info windows
- Photo upload (up to 5 photos per visit, Cloudflare R2)
- Visit detail pages with image galleries
- Tag system (halal, romantic, casual, etc.)
- PWA manifest (installable on mobile home screens)

**Success Metrics**:
- 40% Day 7 retention
- Users upload average 2+ photos per visit
- Map loads in <1 second

### Phase 3: Advanced Features (Weeks 7-10)

**Features**:
- OCR menu parsing (Google Cloud Vision API)
- Timeline view (chronological list of visits)
- Visit map overlay (all visited restaurants with color-coded pins)
- Basic analytics dashboard (total visits, favorite cuisines)
- Visit sharing (public links with social previews)

**Success Metrics**:
- 30% OCR feature adoption within first week
- Timeline viewed 2+ times per week
- 10% visit sharing rate

### Phase 4: Premium Launch (Weeks 11-16)

**Features**:
- Stripe integration (checkout + billing portal)
- Premium feature gating (OCR, advanced analytics, PDF export)
- Data export (CSV, JSON, PDF with photos)
- Recommendation engine (collaborative filtering)
- Monthly digest emails (automated reports)

**Success Metrics**:
- 3% conversion to premium
- $500+ MRR
- 99.9% uptime
- <500ms API latency (p95)

### Post-Launch: Continuous Improvement (Months 4-12)

**Features** (prioritized by user feedback):
- Social features (friend network, shared wishlists)
- OpenTable/Resy integration (book reservations from app)
- AI trip planning ("Plan a food tour in Paris")
- Dietary restrictions tracking (vegan, gluten-free, halal, kosher)
- Wine pairing recommendations
- Voice notes for visit logs
- Apple Watch complications (show nearby wishlist items)

**Success Metrics**:
- 25% Day 30 retention
- 4+ visits logged per user per month
- 5% conversion to premium
- $3,000+ MRR by Month 12

---

## Key Performance Indicators (KPIs)

### North Star Metric

**Visits Logged Per Month** (total across all users)

**Why This Metric**:
- Directly measures core product usage (not vanity metric like signups)
- Correlates with retention and premium conversion
- Easy to understand and communicate to stakeholders

**Target Growth**:
- Month 1: 100 visits
- Month 3: 1,000 visits
- Month 6: 10,000 visits
- Month 12: 50,000 visits

### Activation Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Signup to First Visit** | <10 minutes | Time from account creation to first saved visit |
| **First Visit to 3rd Visit** | <7 days | Time from first to third visit (indicates habitual usage) |
| **Activation Rate** | >70% | % of signups who log at least 1 visit within 7 days |

### Engagement Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **DAU/MAU Ratio** | >20% | Daily active users ÷ monthly active users |
| **Avg Visits Per User** | >4/month | Total visits ÷ monthly active users |
| **Photo Upload Rate** | >80% | % of visits with at least 1 photo |
| **Search Usage** | >30% | % of sessions with at least 1 search query |

### Retention Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Day 1 Retention** | >60% | % of users who return 1 day after signup |
| **Day 7 Retention** | >40% | % of users who return 7 days after signup |
| **Day 30 Retention** | >25% | % of users who return 30 days after signup |
| **Day 90 Retention** | >15% | % of users who return 90 days after signup (activated cohort) |

### Conversion Metrics (Premium)

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Free to Premium** | 3% | % of users who upgrade to premium |
| **Time to Convert** | <30 days | Median days from signup to premium upgrade |
| **Annual vs Monthly** | >60% annual | % of premium users who choose annual plan |
| **Churn Rate** | <5%/month | % of premium users who cancel each month |

### Revenue Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **MRR** | $750 by M12 | Monthly recurring revenue from subscriptions |
| **ARPU** | $0.15 by M12 | Average revenue per user (including free users) |
| **LTV** | $120 by M12 | Lifetime value of premium user (avg subscription length × price) |
| **CAC** | <$10 | Customer acquisition cost (total marketing spend ÷ new users) |

---

## Risk Analysis & Mitigation

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **Google Places API rate limits** | Medium | High | Cache aggressively (24-hour TTL), implement fallback manual entry |
| **Database connection pool exhaustion** | Low | High | Use Supabase connection pooling (default 15 connections), monitor metrics |
| **Image storage costs exceed budget** | Medium | Medium | Compress to WebP (<500KB per photo), enforce 5 photo limit per visit |
| **OCR accuracy too low (<90%)** | Medium | High | Add manual correction flow, set user expectations ("Beta feature") |
| **Third-party API downtime (Google, Supabase)** | Low | Medium | Implement retry logic with exponential backoff, graceful degradation |
| **Security breach (user data leak)** | Low | Critical | RLS policies enforce isolation, regular penetration testing, bug bounty program |

### Product Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **Low activation rate (<50%)** | High | Critical | User onboarding flow with empty state CTAs, email drip campaign |
| **Poor retention (D30 <20%)** | Medium | Critical | Push notifications for nearby wishlist items, weekly digest emails |
| **Low premium conversion (<1%)** | Medium | High | A/B test pricing ($3.99 vs $4.99 vs $5.99), improve feature value prop |
| **Privacy concerns (data sharing fears)** | Low | High | Transparent privacy policy, GDPR compliance, "Private by default" messaging |
| **Competition from Google Maps** | High | Medium | Differentiate on privacy, customization, food-specific features |
| **User generates copyrighted content (menu photos)** | Medium | Medium | Terms of service clarifies personal use only, DMCA takedown process |

### Business Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **Solo developer burnout** | High | Critical | Set realistic timelines, launch MVP in 3-4 weeks (not 3 months), prioritize ruthlessly |
| **No product-market fit (users don't return)** | Medium | Critical | Launch MVP fast, iterate based on user feedback, pivot if D30 retention <20% |
| **Unsustainable costs at scale** | Low | High | Monitor unit economics monthly, increase prices before burning runway |
| **Legal issues (GDPR, App Store rejection)** | Low | Medium | Consult lawyer for privacy policy, don't launch iOS until web proven |
| **Competitor launches similar product** | Medium | Medium | Speed is advantage (ship fast), open-source some features for goodwill |

---

## Success Criteria Summary

### Phase 1 (MVP) - 3 Weeks

- [ ] 100+ signups in first week after Product Hunt launch
- [ ] 70% activation rate (1+ visit logged within 7 days)
- [ ] <2 second page load time (Lighthouse score >90)
- [ ] Zero critical bugs in production

### Phase 2 (Enhanced) - 6 Weeks

- [ ] 500+ total users
- [ ] 40% Day 7 retention
- [ ] 2+ photos per visit average
- [ ] Map loads in <1 second

### Phase 3 (Advanced) - 10 Weeks

- [ ] 1,000+ total users
- [ ] 30% OCR feature adoption
- [ ] 10% visit sharing rate
- [ ] Analytics viewed 2+ times per week

### Phase 4 (Premium) - 16 Weeks

- [ ] 2,000+ total users
- [ ] 3% conversion to premium
- [ ] $500+ MRR
- [ ] 99.9% uptime
- [ ] <500ms API latency (p95)

### Post-Launch (12 Months)

- [ ] 10,000+ MAU
- [ ] 25% Day 30 retention
- [ ] 5% conversion to premium
- [ ] $3,000+ MRR
- [ ] Featured in TechCrunch, The Verge, or similar press

---

## Decision Framework

When deciding on features, use this prioritization framework:

### Feature Prioritization Matrix

**Score each feature on:**
1. **User Value** (1-10): How much does this improve user experience?
2. **Business Impact** (1-10): How much does this drive activation, retention, or revenue?
3. **Engineering Effort** (1-10): How many hours to build? (1 = easy, 10 = very hard)

**Formula**: Priority Score = (User Value + Business Impact) / Engineering Effort

**Examples**:

| Feature | User Value | Business Impact | Effort | Score | Decision |
|---------|-----------|----------------|--------|-------|----------|
| Photo upload | 9 | 8 | 6 | 2.83 | **Build** |
| OCR menu parsing | 7 | 6 | 8 | 1.63 | Build (Phase 3) |
| Social sharing | 5 | 7 | 5 | 2.40 | **Build** |
| Dark mode | 4 | 2 | 3 | 2.00 | Maybe |
| Voice notes | 6 | 3 | 7 | 1.29 | Skip for now |
| AR menu translation | 8 | 4 | 10 | 1.20 | Skip (too complex) |

**Threshold**: Build features with score >2.0 for MVP, >1.5 for post-launch.

---

## Next Steps (Action Items)

### Immediate (This Week)

- [ ] Save WEB_MOCKUP.html and test in browser on desktop and mobile
- [ ] Share mockup with 5 potential users for feedback (friends, Twitter followers)
- [ ] Set up Vercel account and connect GitHub repository
- [ ] Create Supabase project and configure authentication providers
- [ ] Register dinearound.app domain on Cloudflare Registrar

### Short-Term (Next 2 Weeks)

- [ ] Initialize Next.js project with TypeScript and Tailwind CSS
- [ ] Implement authentication (email + Google OAuth)
- [ ] Build database schema and run migrations
- [ ] Create Nearby tab with Google Places API integration
- [ ] Deploy preview version to Vercel

### Medium-Term (Next 4-6 Weeks)

- [ ] Complete Phase 1 MVP (all three tabs functional)
- [ ] Launch on Product Hunt and Hacker News
- [ ] Gather feedback from first 100 users
- [ ] Iterate on onboarding flow based on activation metrics
- [ ] Start Phase 2 (maps + photo upload)

### Long-Term (Next 3-6 Months)

- [ ] Complete Phases 2-3 (advanced features)
- [ ] Monitor retention and engagement metrics weekly
- [ ] Launch premium tier if D30 retention >20%
- [ ] Reach 2,000 MAU and $500 MRR
- [ ] Decide whether to build iOS app or double down on web

---

**Last Updated**: 2025-01-14
**Document Owner**: Sami Salehin
**Review Cadence**: End of each phase, adjust strategy based on metrics

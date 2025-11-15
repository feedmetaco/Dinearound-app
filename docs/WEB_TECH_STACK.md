# DineAround Web Tech Stack

## Overview

This document details all technology choices for the DineAround web application, including frameworks, libraries, services, and tooling. Each choice includes justification, alternatives considered, and trade-offs.

## Frontend Stack

### Framework: Next.js 14 (App Router)

**Version**: 14.x (latest stable)

**Why Next.js**:
- **Server Components**: Reduce client bundle size by 30-40%
- **File-based Routing**: Intuitive folder structure matches URL structure
- **Built-in API Routes**: Serverless functions without separate backend
- **Image Optimization**: Automatic WebP conversion, lazy loading, responsive sizes
- **Zero-config Deployment**: Vercel integration is seamless
- **SEO-friendly**: Server-side rendering for public pages (shared visits)
- **Developer Experience**: Fast Refresh, TypeScript support, excellent documentation

**Alternatives Considered**:
- **Vite + React SPA**: Faster dev server (50ms HMR) but no SSR, requires separate backend, worse SEO
- **Remix**: Better data loading patterns but smaller ecosystem, steeper learning curve
- **Astro**: Excellent for content sites but less suitable for complex app state

**Trade-offs**:
- ✅ Best-in-class DX, production-ready, huge community
- ❌ App Router learning curve, occasional edge case bugs
- ❌ Vendor lock-in to Vercel (but can deploy elsewhere with effort)

**Installation**:
```bash
npx create-next-app@latest dinearound-web \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*"
```

---

### UI Library: React 18

**Version**: 18.2+

**Why React**:
- **Concurrent Rendering**: Better performance for complex UIs
- **Server Components**: Native support via Next.js
- **Ecosystem**: Largest library ecosystem for any frontend framework
- **Streaming SSR**: Faster time-to-interactive
- **Suspense**: Declarative loading states

**Alternatives Considered**:
- **Vue 3**: Easier learning curve but smaller ecosystem
- **Svelte**: Less boilerplate but smaller community, fewer libraries
- **Solid.js**: Better performance but niche, risky for production

**Trade-offs**:
- ✅ Battle-tested, massive community, best tooling
- ❌ More boilerplate than Vue/Svelte
- ❌ Requires understanding of React lifecycle and hooks

---

### Styling: Tailwind CSS

**Version**: 3.4+

**Why Tailwind**:
- **Utility-first**: Rapid prototyping without naming classes
- **Constraint System**: Standardized spacing (4px scale) prevents pixel-pushing
- **Tree-shaking**: Purges unused CSS for tiny production bundles (10-20KB)
- **Mobile-first**: Responsive design baked into class names (`md:`, `lg:`)
- **Dark Mode**: Built-in support with `dark:` prefix
- **Performance**: No runtime cost (static CSS)

**Configuration**:
```javascript
// tailwind.config.js
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#10b981', // emerald-500
        secondary: '#6b7280', // gray-500
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```

**Alternatives Considered**:
- **CSS-in-JS (styled-components, Emotion)**: Dynamic theming but 15-30KB runtime cost, server component issues
- **CSS Modules**: Scoped styles but requires naming conventions, no constraint system
- **Vanilla CSS**: Full control but no design system, hard to maintain

**Trade-offs**:
- ✅ Fast development, small bundle, great DX
- ❌ Verbose JSX (`className` with 10+ utilities)
- ❌ Requires learning class names (mitigated by IntelliSense)

---

### Component Library: shadcn/ui

**Version**: Latest (copy-paste components, not npm package)

**Why shadcn/ui**:
- **Radix Primitives**: Accessible, unstyled components (keyboard nav, ARIA labels)
- **Tailwind Styled**: Pre-styled with Tailwind, easy to customize
- **Copy-paste**: Own the code, no npm dependency bloat
- **TypeScript**: Fully typed out of the box
- **40+ Components**: Button, Dialog, Dropdown, Command, Tabs, etc.

**Key Components Used**:
- `Button` - Primary/secondary variants
- `Dialog` - Modals for forms
- `Command` - Cmd+K search palette
- `Dropdown Menu` - User menu, filters
- `Tabs` - Main navigation (Nearby/Log/Wishlist)
- `Toast` - Success/error notifications
- `Form` - React Hook Form integration

**Alternatives Considered**:
- **Material UI**: Feature-rich but opinionated design (looks like Google), 200KB+ bundle
- **Chakra UI**: Excellent DX but heavier than shadcn/ui (~80KB)
- **Headless UI**: Similar to Radix but requires more styling work

**Trade-offs**:
- ✅ Lightweight, accessible, fully customizable
- ❌ Manual updates (no `npm update`)
- ❌ Requires copy-pasting components into project

**Setup**:
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button dialog command tabs toast
```

---

### State Management: Zustand + React Query

**Zustand Version**: 4.x
**React Query Version**: 5.x (@tanstack/react-query)

**Why This Combo**:
- **Zustand**: Minimal boilerplate for client state (UI toggles, filters, modals)
- **React Query**: Best-in-class server state management (caching, refetching, optimistic updates)
- **Small Bundle**: Zustand (3KB) + React Query (12KB) = 15KB total
- **Simple API**: No actions/reducers/thunks like Redux

**Zustand Usage** (client state):
```typescript
// stores/filter-store.ts
import { create } from 'zustand';

interface FilterStore {
  cuisine: string | null;
  priceLevel: number | null;
  setCuisine: (cuisine: string | null) => void;
  setPriceLevel: (level: number | null) => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  cuisine: null,
  priceLevel: null,
  setCuisine: (cuisine) => set({ cuisine }),
  setPriceLevel: (priceLevel) => set({ priceLevel }),
}));
```

**React Query Usage** (server state):
```typescript
// hooks/use-visits.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useVisits() {
  return useQuery({
    queryKey: ['visits'],
    queryFn: async () => {
      const res = await fetch('/api/visits');
      return res.json();
    },
  });
}

export function useCreateVisit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (visit) => {
      const res = await fetch('/api/visits', {
        method: 'POST',
        body: JSON.stringify(visit),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] });
    },
  });
}
```

**Alternatives Considered**:
- **Redux Toolkit**: Powerful but overkill for this app size (15KB, steep learning curve)
- **Jotai**: Atomic state management, elegant API but smaller ecosystem
- **Context API**: Built-in but causes re-render issues at scale

**Trade-offs**:
- ✅ Simple API, small bundle, excellent caching
- ❌ No Redux DevTools time-travel debugging
- ❌ Zustand doesn't persist state across page reloads (use localStorage manually)

---

### Forms: React Hook Form + Zod

**React Hook Form Version**: 7.x
**Zod Version**: 3.x

**Why This Combo**:
- **React Hook Form**: Uncontrolled forms = less re-renders, better performance
- **Zod**: TypeScript-first schema validation, generate types from schemas
- **Integration**: `@hookform/resolvers/zod` for seamless integration
- **Bundle Size**: React Hook Form (9KB) + Zod (8KB) = 17KB

**Example**:
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const visitSchema = z.object({
  restaurantId: z.string().uuid(),
  visitDate: z.date(),
  rating: z.number().min(1).max(5),
  notes: z.string().optional(),
});

type VisitFormData = z.infer<typeof visitSchema>;

export function VisitForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<VisitFormData>({
    resolver: zodResolver(visitSchema),
  });

  const onSubmit = (data: VisitFormData) => {
    // data is fully typed and validated
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('rating')} type="number" />
      {errors.rating && <span>{errors.rating.message}</span>}
    </form>
  );
}
```

**Alternatives Considered**:
- **Formik**: Older, more verbose API, controlled inputs (more re-renders)
- **Yup**: Similar to Zod but not TypeScript-first

**Trade-offs**:
- ✅ Excellent performance, type-safe validation
- ❌ Learning curve for `register()` and `Controller` patterns

---

### Date/Time: date-fns

**Version**: 3.x

**Why date-fns**:
- **Modular**: Tree-shakeable (import only what you need)
- **Immutable**: Pure functions, no mutation
- **TypeScript**: Fully typed
- **Lightweight**: ~2KB for common functions vs 70KB for moment.js

**Usage**:
```typescript
import { format, formatDistance, parseISO } from 'date-fns';

format(new Date(), 'MMMM dd, yyyy'); // "January 14, 2025"
formatDistance(new Date(2024, 0, 1), new Date()); // "1 year ago"
```

**Alternatives Considered**:
- **Day.js**: Similar size but smaller ecosystem
- **Luxon**: Powerful but 60KB bundle

**Trade-offs**:
- ✅ Small bundle, functional API
- ❌ No timezone support out of the box (use `date-fns-tz`)

---

## Backend Stack

### Backend-as-a-Service: Supabase

**Why Supabase**:
- **PostgreSQL**: Battle-tested relational database
- **Auto-generated APIs**: REST + GraphQL + Realtime
- **Row-Level Security**: Authorization at database level
- **Built-in Auth**: Email, OAuth, magic links
- **Storage**: S3-compatible file storage
- **Realtime**: Websocket subscriptions via Postgres logical replication

**Client SDKs**:
```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

**Authentication**:
```typescript
// Server-side (Server Components)
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function getUser() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Client-side (Client Components)
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

export function Profile() {
  const supabase = useSupabaseClient();
  const user = useUser();
  // ...
}
```

**Alternatives Considered**:
- **Firebase**: Easier for beginners but Firestore query limitations (no compound inequality filters)
- **PlanetScale (MySQL)**: Great for scale but lacks geospatial queries (no PostGIS)
- **Custom Node.js + Express**: Full control but 80-120 hours of boilerplate

**Trade-offs**:
- ✅ Rapid development, free tier generous, great DX
- ❌ Vendor lock-in, migration requires rewriting auth logic
- ❌ Complex queries require custom SQL (can't do everything via generated API)

---

### Image Storage: Cloudflare R2

**Why R2**:
- **S3-compatible**: Drop-in replacement for AWS SDK
- **Zero egress**: $0 for downloads (vs S3's $0.09/GB)
- **Cost-effective**: $0.015/GB storage (1/3 of S3)
- **Global CDN**: Cloudflare's network

**SDK Setup**:
```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
});

export async function uploadPhoto(file: File) {
  const buffer = await file.arrayBuffer();
  await r2.send(new PutObjectCommand({
    Bucket: 'dinearound-photos',
    Key: `${userId}/${visitId}/${file.name}`,
    Body: Buffer.from(buffer),
    ContentType: file.type,
  }));
}
```

**Alternatives Considered**:
- **Supabase Storage**: Easier integration but 3x more expensive for bandwidth
- **Cloudinary**: Best-in-class transformations but $0.80/GB egress

**Trade-offs**:
- ✅ Cheapest option for image-heavy apps
- ❌ No built-in transformations (use Cloudflare Images add-on for $5/month)

---

## API Integrations

### Maps & Places: Google Maps Platform

**APIs Used**:
1. **Places API (New)**: Text Search, Place Details, Nearby Search
2. **Maps JavaScript API**: Map rendering, markers, info windows
3. **Geocoding API**: Address → lat/lng conversion

**Cost** (after $200 monthly credit):
- Text Search: $17 per 1,000 requests
- Place Details: $17 per 1,000 requests
- Map loads: $7 per 1,000 loads

**Setup**:
```typescript
// Load Maps API
import { Loader } from '@googlemaps/js-api-loader';

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  version: 'weekly',
  libraries: ['places'],
});

const google = await loader.load();
const map = new google.maps.Map(element, { center, zoom });
```

**Alternatives Considered**:
- **Mapbox**: Better cartography but separate Places API (Foursquare) costs more
- **Yelp Fusion API**: Good restaurant data but worse global coverage than Google

**Trade-offs**:
- ✅ Best global coverage, consistent data, generous free tier
- ❌ Costs scale linearly with usage (cache aggressively)

---

### OCR: Google Cloud Vision API

**Feature**: Text Detection (document_text_detection)

**Cost**:
- First 1,000 requests/month: Free
- After: $1.50 per 1,000 requests

**Setup**:
```typescript
import vision from '@google-cloud/vision';

const client = new vision.ImageAnnotatorClient({
  keyFilename: './google-cloud-key.json',
});

export async function extractMenuText(imageUrl: string) {
  const [result] = await client.documentTextDetection(imageUrl);
  const text = result.fullTextAnnotation?.text || '';
  return text;
}
```

**Alternatives Considered**:
- **AWS Textract**: Similar accuracy but more complex pricing
- **Tesseract.js**: Free but ~70% accuracy vs 95% for Cloud Vision

**Trade-offs**:
- ✅ Best accuracy for printed text
- ❌ Costs money (mitigate with rate limiting)

---

## Development Tooling

### Language: TypeScript

**Version**: 5.x

**tsconfig.json**:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM"],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

**Why TypeScript**:
- **Type Safety**: Catch bugs at compile time
- **IntelliSense**: Auto-complete for APIs
- **Refactoring**: Confident renames across codebase
- **Self-documenting**: Types serve as inline docs

---

### Linting: ESLint

**Config**:
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'error',
  },
};
```

---

### Formatting: Prettier

**Config**:
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

---

### Testing: Vitest + Playwright

**Unit Tests**: Vitest (faster than Jest for Vite/Next.js)
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

**E2E Tests**: Playwright
```bash
npm install -D @playwright/test
```

**Example E2E Test**:
```typescript
import { test, expect } from '@playwright/test';

test('user can log a visit', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Log Visit');
  await page.fill('input[name="restaurant"]', 'Test Restaurant');
  await page.click('button:has-text("Save")');
  await expect(page.locator('text=Visit saved')).toBeVisible();
});
```

---

### Version Control: Git + GitHub

**Branch Strategy**:
- `main`: Production branch (auto-deploys to Vercel)
- `feature/*`: Feature branches (create PRs to `main`)
- `hotfix/*`: Urgent production fixes

**Pre-commit Hooks** (Husky):
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}
```

---

## Monitoring & Analytics

### Error Tracking: Sentry

**Installation**:
```bash
npx @sentry/wizard@latest -i nextjs
```

**Config**:
```javascript
// sentry.config.js
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

---

### Analytics: PostHog

**Why PostHog**:
- **Open-source**: Self-host or use cloud
- **Privacy-friendly**: GDPR-compliant, no cookies required
- **Feature Flags**: A/B testing built-in
- **Session Replay**: See what users do

**Setup**:
```typescript
import posthog from 'posthog-js';

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: 'https://app.posthog.com',
  capture_pageview: false, // Next.js handles this
});

// Track events
posthog.capture('visit_logged', { restaurant_id: '...' });
```

---

### Performance: Vercel Analytics

**Setup**: Enable in Vercel dashboard (one click)

**Features**:
- Web Vitals (LCP, FID, CLS)
- Per-route performance
- Real user monitoring

---

## Full Package.json

```json
{
  "name": "dinearound-web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@supabase/supabase-js": "^2.38.0",
    "@supabase/auth-helpers-nextjs": "^0.8.0",
    "@tanstack/react-query": "^5.12.0",
    "zustand": "^4.4.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    "date-fns": "^3.0.0",
    "@googlemaps/js-api-loader": "^1.16.0",
    "@google-cloud/vision": "^4.0.0",
    "@aws-sdk/client-s3": "^3.450.0",
    "@sentry/nextjs": "^7.80.0",
    "posthog-js": "^1.90.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.9.0",
    "@types/react": "^18.2.0",
    "eslint": "^8.54.0",
    "eslint-config-next": "^14.0.0",
    "prettier": "^3.1.0",
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.1.0",
    "@playwright/test": "^1.40.0",
    "husky": "^8.0.0",
    "lint-staged": "^15.0.0"
  }
}
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Next.js App (React 18 + Tailwind CSS)              │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐   │   │
│  │  │  Nearby    │  │    Log     │  │  Wishlist  │   │   │
│  │  │   Tab      │  │    Tab     │  │    Tab     │   │   │
│  │  └────────────┘  └────────────┘  └────────────┘   │   │
│  │          │               │               │          │   │
│  │          └───────────────┴───────────────┘          │   │
│  │                      │                              │   │
│  │           ┌──────────┴──────────┐                  │   │
│  │           │   State Management   │                  │   │
│  │           │  Zustand + React     │                  │   │
│  │           │      Query           │                  │   │
│  │           └──────────────────────┘                  │   │
│  └────────────────────┬─────────────────────────────────┘   │
└────────────────────────┼──────────────────────────────────┘
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Vercel Edge Network                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Next.js API Routes (Serverless)            │   │
│  │  /api/restaurants  /api/visits  /api/upload         │   │
│  └────────┬──────────────────┬─────────────────┬────────┘   │
└───────────┼──────────────────┼─────────────────┼────────────┘
            │                  │                 │
            ▼                  ▼                 ▼
    ┌──────────────┐   ┌──────────────┐  ┌──────────────┐
    │   Google     │   │   Supabase   │  │ Cloudflare   │
    │   Places     │   │  PostgreSQL  │  │      R2      │
    │     API      │   │   + Auth     │  │   (Images)   │
    └──────────────┘   └──────────────┘  └──────────────┘
```

---

**Last Updated**: 2025-01-14
**Document Owner**: Sami Salehin
**Review Cadence**: Quarterly or when major dependencies update

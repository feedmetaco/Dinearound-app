# DineAround App

Restaurant tracking and discovery app with **parallel tracks**: web (Next.js) + native iOS SwiftUI (Jul 2026 design handoff).

**Canonical local path:** `~/Documents/claude-projects/dinearound-app/`

## Backend — Cloudflare D1 + R2 (primary)

Shared REST API in `cloudflare/` — **D1** for relational data, **R2** (`dinearound-media`) for photos/PDFs. Web and iOS sync via Worker JWT auth.

| Doc | Purpose |
|-----|---------|
| `docs/API.md` | REST endpoint reference |
| `docs/ARCHITECTURE.md` | System diagram + deploy steps |
| `cloudflare/DEPLOY.md` | Wrangler quick start |

**Deprecated:** Supabase PostgreSQL, Supabase Auth, Vercel serverless API routes. Web still hosts on Vercel; data layer is Cloudflare.

### Deploy API

```bash
cd cloudflare
npm install
npx wrangler d1 create dinearound          # paste database_id into wrangler.toml
npx wrangler r2 bucket create dinearound-media
npm run db:migrate && npm run db:seed
npx wrangler secret put AUTH_SECRET
npm run deploy
```

### Client env

```bash
# web/.env.local
NEXT_PUBLIC_API_URL=https://api.dinearound.salehinlabs.com

# iOS — INFOPLIST_KEY_API_BASE_URL in Xcode (already set for production URL)
```

## 🎨 Design System — "Midnight Gourmet"

Both platforms share one blended design system: **`design-system/dinearound/MASTER.md`**. It merges a
dark-premium "logistics" shell with warm coral food-delivery accents — dark charcoal cards + coral CTAs
in dark mode, warm peach canvas + the same coral CTAs in light mode, floating pill nav, and DineAround
green retained as the secondary/trust accent. This **supersedes** the older green-only palette referenced
in `design-handoff/README.md`. iOS tokens live in `DATheme` (`ios/.../Design/Theme.swift`); web tokens live
in CSS variables (`web/app/globals.css`).

## 🌐 Web Application (Next.js 14)

**Status:** Production UI — **Cloudflare D1+R2** backend (Supabase deprecated)
**Tech Stack:** Next.js 14 + Cloudflare Worker API + Vercel + Tailwind CSS
**Live URL:** https://dinearound-app.vercel.app

### Cloud Development (Recommended)

Work from any device using GitHub Codespaces:

```bash
# 1. Open in Codespaces
# Go to: https://github.com/feedmetaco/Dinearound-app
# Click: Code → Codespaces → Create codespace on main

# 2. Start development server (auto-runs on Codespace creation)
cd web
npm run dev

# 3. Preview: Click "Open in Browser" notification (port 3000)

# 4. Make changes, commit, push
git add .
git commit -m "your changes"
git push

# 5. Vercel auto-deploys to production
```

**Free Tier:** 60 hours/month GitHub Codespaces + unlimited Vercel deployments

### Local Development (Optional)

```bash
# Clone and setup
git clone git@github.com:feedmetaco/Dinearound-app.git
cd Dinearound-app/web

# Install dependencies
npm install

# Run dev server
npm run dev

# Open http://localhost:3000
```

### Web Commands

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

## 📱 iOS Application (SwiftUI)

**Status:** Rebuild from Jul 2026 design handoff (skeleton exists; full UI spec in `design-handoff/`)
**Location:** `ios/Dinearound-app/`
**Design tokens:** `#2F9E52` green palette (see `design-handoff/README.md` — distinct from web palette)

### Setup
- Xcode on macOS (full Xcode, not CLT only)
- Apple ID signed into Xcode

### Build to iPhone
See `docs/SETUP_IOS.md` for detailed instructions. Open `ios/Dinearound-app/Dinearound-app.xcodeproj`.

## 📚 Documentation

| File | Purpose |
|------|---------|
| **`design-handoff/README.md`** | iOS UI spec, tokens, prototype (primary iOS reference) |
| **`tasks/todo.md`** | Open work — web + iOS checklists |
| **`CLAUDE.md`** | Agent instructions |
| **`developer.md`** | Developer onboarding |
| **`docs/PLAN.md`** | Plan overview (V0.001 superseded; points to handoff) |
| **`docs/WEB_STRATEGY.md`** | Web strategy, monetization |
| **`docs/FEATURES.md`** | Feature backlog |
| **`docs/archive/`** | Legacy V0.001 plans (historical) |

## Workflow
- git pull --rebase before starting
- commit small, push often
- Vercel auto-deploys on push to main


## Work from multiple computers (Mac mini, MacBook)

### One-time on each Mac
```bash
# 1) Test SSH to GitHub (after adding your SSH key in GitHub Settings)
ssh -T git@github.com

# 2) First-time clone on that Mac
git clone git@github.com:feedmetaco/Dinearound-app.git
cd Dinearound-app

# 3) Safer pulls (avoid messy merges)
git config pull.rebase true
```

### Daily workflow
```bash
# Before you start work on a Mac
git pull --rebase

# After you finish work
git add -A
git commit -m "describe what you changed"
git push
```

### Switching between Macs
- Finish on Mac A: commit and `git push`.
- Start on Mac B: `git pull --rebase`, then continue.

### Troubleshooting
- Permission denied (publickey): add your SSH key in GitHub → Settings → SSH and GPG keys, then `ssh -T git@github.com`.
- Merge conflicts on pull: run `git status`, open conflicting files, fix them, then:
```bash
git add -A
git rebase --continue   # if you were rebasing
# or if a merge happened
# git commit
```

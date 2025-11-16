# DineAround App

Restaurant tracking and discovery app with web-first strategy.

## 🌐 Web Application (Next.js 14)

**Status:** Production-ready web app
**Tech Stack:** Next.js 14 + Supabase + Vercel + Tailwind CSS
**Live URL:** https://dinearound-feedmetaco.vercel.app

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

**Status:** Basic skeleton (3 tabs)
**Location:** `ios/Dinearound-app/`

### Setup
- Xcode on macOS
- Apple ID signed into Xcode

### Build to iPhone
See `docs/SETUP_IOS.md` for detailed instructions

Open the Xcode project in `ios/` when ready.

## 📚 Documentation
- **`CLAUDE.md`** - Instructions for Claude Code (AI assistant)
- **`docs/WEB_STRATEGY.md`** - Web-first strategy, monetization, GTM plan
- **`docs/WEB_TECH_STACK.md`** - Detailed tech stack decisions
- **`docs/WEB_DEPLOYMENT_PLAN.md`** - Infrastructure, database schema, costs
- **`docs/PLAN.md`** - V0.001 iOS plan
- **`docs/FEATURES.md`** - Feature backlog
- **`docs/SETUP_IOS.md`** - iOS build instructions
- **`docs/MULTI_COMPUTER_GIT.md`** - Multi-Mac git workflow

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

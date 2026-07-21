# DineAround — Task Checklist

**Canonical repo:** `~/Documents/claude-projects/dinearound-app/`  
**Tracks:** Parallel — live web (Vercel/Supabase) + iOS SwiftUI (Jul 2026 design handoff)

Plan before 3+ step tasks. Verify before marking done.

---

## Track A — Web (Production)

- [x] Next.js 14 app in `web/` deployed to Vercel
- [x] Supabase auth + database
- [x] Google Places integration (Nearby)
- [x] Log + Wishlist tabs
- [ ] Review Vercel deploy after doc/consolidation push
- [ ] Menu OCR/PDF — backlog (iOS has full spec in `design-handoff/`)

## Track B — iOS SwiftUI (Design Handoff)

**Spec:** `design-handoff/README.md` · **Tokens:** `#2F9E52` green palette (not web SOFT_SOOTHING)

- [x] Consolidate design handoff into `design-handoff/`
- [x] Archive legacy V0.001 plans in `docs/archive/`
- [x] Cherry-pick AppIcon from Desktop clone (`Icon-1024.png`)
- [x] Implement design tokens from handoff in SwiftUI theme
- [x] Auth screens (login / signup / guest) per handoff screenshots
- [x] Nearby tab — filters, restaurant cards, location sort
- [x] Restaurant detail screen
- [x] Log tab — empty state, visit form, share sheet
- [x] Wishlist tab
- [x] Menu capture + seed OCR + PDF export (Vision OCR → future)
- [x] Dark mode per handoff token set
- [x] Seed data from `design-handoff/dinearound-data.js` for dev/testing
- [ ] **Build in Xcode** — requires full Xcode.app (Gate 0); open `ios/Dinearound-app/Dinearound-app.xcodeproj`
- [ ] Simulator/device test pass
- [ ] Menu Vision OCR (replace seed digitize stub)

## Consolidation (Done)

- [x] Fresh clone from GitHub @ `b04d183+`
- [x] Merge `design-handoff/`, `docs/archive/v0.001/`, `docs/archive/planning/`
- [x] Update README, PLAN, CLAUDE.md

## Deprecated Local Copies (do not use)

| Location | Status |
|----------|--------|
| iCloud `GIT/Dinearound-app` | Stale — no `web/` |
| Desktop `Sami_Cursor_MacMini/iOS_App/Dinearound-app` | Stale — AppIcon merged |
| Desktop `Sami_Cursor_MacMini/Dinearound-app` | Very stale |

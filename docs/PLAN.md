# DineAround — Plan Overview

> **V0.001 iOS plan is superseded.** Current direction: **parallel tracks** — maintain live web app AND rebuild iOS native from Jul 2026 design handoff.

## Active Specs

| Track | Spec Location | Status |
|-------|---------------|--------|
| **Web** | `web/` + `docs/WEB_*.md` | Production @ [dinearound-feedmetaco.vercel.app](https://dinearound-feedmetaco.vercel.app) |
| **iOS** | `design-handoff/README.md` | Native SwiftUI rebuild from handoff |

## iOS Design Handoff (Jul 2026)

- Full UI spec: auth, nearby, detail, menu capture/OCR, log, wishlist, dark mode
- Design tokens: green `#2F9E52` palette (see `design-handoff/README.md`)
- Prototype: `design-handoff/DineAround.dc.html`
- Seed restaurants: `design-handoff/dinearound-data.js` (9 mock entries)
- Screenshots: `design-handoff/screenshots/`

## Legacy V0.001 (Archived)

Original skeleton plan preserved in:

- `docs/archive/v0.001/` — Downloads copies
- `docs/archive/planning/` — Mac Mini PlanningFiles

### Original V0.001 Scope (historical)

- Skeleton SwiftUI app with 3 tabs (Nearby, Log, Wishlist)
- GPS coordinates display (Nearby)
- Manual log entry (name, rating, notes, photo)
- Local storage (AppStorage or JSON)
- Wishlist list

### Original Day 2–3 (historical)

- Google Places or Yelp Fusion API + MapKit
- Wishlist geofencing alerts
- OCR menu parsing with VisionKit

## Color Systems (intentional split)

| Platform | Palette | File |
|----------|---------|------|
| Web | Soft & Soothing | `web/SOFT_SOOTHING_COLOR_SYSTEM.md` |
| iOS | Handoff green `#2F9E52` | `design-handoff/README.md` |

Unification is a future decision — do not mix palettes across tracks without explicit approval.

## Task Checklist

See `tasks/todo.md` for open work on both tracks.

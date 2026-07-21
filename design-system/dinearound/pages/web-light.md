# DineAround Web — "Marketplace Light" v2 (true DONESKI fidelity)

> **Scope:** `web/` app ONLY. Overrides `../MASTER.md` ("Midnight Gourmet") for the web target.
> The iOS app keeps Midnight Gourmet untouched — this file governs `web/app/globals.css` CSS
> variables and web components only.
>
> **v2 (2026-07-21):** v1 shipped a light-first design but kept an opt-in dark toggle. Stale
> `localStorage` from the pre-v1 "Midnight Gourmet" era caused returning users to load dark mode
> by default, stacked with v1's dark-mode coral glow — producing exactly the "dark, pink-overload"
> screenshot the user flagged as "even uglier." v2 **removes dark mode entirely** (no toggle) and
> strips remaining anti-patterns: emoji map pins, green-tinted map, two-row filters, a boxed demo
> banner, a 5-item floating pill nav, and the marketing hero on the Nearby page. Regenerated via
> `ui-ux-pro-max` search (`restaurant discovery app clean minimal white light marketplace` +
> `restaurant food` color domain) blended with the user's DONESKI reference brief.

---

## 0. Design Brief

Light-only, no exceptions. White/off-white canvas, exactly one accent (`#FF4B5C`) reserved for
CTAs + active nav + ratings-adjacent badges, neutral warm-grey chips/thumbnails (not accent-tinted),
a flat light-grey map (no green tint, no emoji pins — Lucide `MapPin` only), one row of filters,
a plain-text demo-data notice instead of an alert box, and a standard 4-item nav (mobile: flat
bottom tab bar; desktop: plain top text links) with no center FAB and no floating pill chrome.

## 1. Color Tokens (Light — the only mode)

| Role | Token | Hex | Notes |
|---|---|---|---|
| App background | `background` | `#FFFFFF` | Pure white |
| Subtle background (unused by default) | `background-subtle` | `#F8F8F6` | Reserve for future section banding |
| Elevated surface / card | `card` | `#FFFFFF` | |
| Chip / pill / thumbnail fill | `chip-fill` | `#F4F3F1` | Neutral warm-grey — used for ALL decorative tiles/thumbnails, never accent-tinted |
| Hairline border | `border-soft` | `#E8E8E4` | |
| Input border | `input-border` | `#E4E2DE` | |
| **Primary accent (DONESKI red)** | `accent-coral` | `#FF4B5C` | CTAs + active nav/filter state ONLY |
| Primary accent dark | `accent-coral-dark` | `#E8384A` | Hover/pressed state |
| Secondary brand (DineAround green) | `brand-green` | `#2F9E52` | "Use my location" / distance / success only |
| Rating gold | `accent-gold` | `#F5A623` | Star ratings, wishlist star ONLY |
| Destructive | `destructive` | `#E1584A` | |
| Text primary | `foreground` | `#1A1A1A` | |
| Text secondary | `text-secondary` | `#6B6B6B` | Meets 4.5:1 on white |
| Map surface | `map-bg` | `#F0F0EC` | Flat light grey — never green |
| Map pin (unselected) | `map-pin` | `#9C9A95` | Lucide `MapPin` outline only, no emoji |
| Nav shell | `nav-shell` | `#FFFFFF` | Flat bar, not a floating pill |

**Dark mode: removed.** `html { color-scheme: light only }` is unconditional. No toggle, no
`.dark` class, no `localStorage` theme key — this eliminates the stale-preference bug that caused
the regression.

## 2. Typography

- **Display/Headings:** Plus Jakarta Sans, weight 700 (not 800) — page titles are `text-2xl
  font-bold`, not `text-3xl font-extrabold`. No hero/marketing headlines on app screens.
- **Body/UI:** DM Sans, weights 400/500/700.
- Small-caps category labels: DM Sans 600, uppercase, `letter-spacing: 0.06em`, 11px, `text-secondary`.
- Scale: page title 22–24px (was 30–34px), card title 15–16px, body 14–15px, caption 11–12px.

## 3. Shape & Elevation

| Token | Value | Usage |
|---|---|---|
| `radius-card` | 20px | Restaurant cards, form cards |
| `radius-button` | 14px | Buttons |
| `radius-pill` | 999px | Filter pills, price dropdown |
| `radius-thumb` | 12–16px | Square thumbnails |

Shadows are flat and minimal: `0 1px 2px rgba(23,20,18,.04), 0 8px 20px rgba(23,20,18,.05)`
resting. No colored glow, no gradients, ever.

## 4. Navigation

- **Mobile:** flat bottom tab bar, 4 items (`Nearby · Log · Wishlist · Account`), no center FAB,
  no floating pill container. Standard full-width bar with a 1px top border.
- **Desktop:** plain top text links (same 4 items), 2px bottom-border active indicator, no pill
  background, no 5th "Log Visit" action item.
- "Log Visit" is reached via the Log tab or a button on the restaurant detail page — not a nav
  shortcut.

## 5. Iconography

`lucide-react` exclusively for structural/functional icons (map pins, nav, buttons). Emoji are
permitted ONLY as small decorative thumbnails inside list rows / cards (e.g. a 🍝 square tile next
to a restaurant name) — never as map markers, never as functional icons.

## 6. Nearby — Map-First Layout

- Compact top row: small-caps "Nearby" label + inline search. No hero headline, no marketing copy.
- Map: `~38vh` (max 288px, min 200px) flat `map-bg` surface. All pins are Lucide `MapPin`
  (grey outline unselected, solid coral + larger when selected) with a small floating white
  preview card for the selected restaurant. No green tint, no SVG "road" decorations, no emoji pins.
- Filters: ONE row — scrollable cuisine pills + a compact price `<select>` styled as a pill,
  replacing the old two-row cuisine+price layout.
- Demo-data notice: a single line of muted caption text below the filters, no colored/bordered box.

## 7. Pre-Delivery Checklist

- [x] Light-only, no dark mode/toggle, no stale-theme regression risk
- [x] Single accent `#FF4B5C` drives CTAs + active nav/filter state only; thumbnails/chips use
      neutral `chip-fill`, not accent-tinted backgrounds
- [x] Map is flat light grey, Lucide `MapPin` pins only, no emoji, no green tint
- [x] ONE filter row (cuisine pills + price dropdown), not two pill rows
- [x] Demo banner is inline text, not a colored alert box
- [x] No hero/marketing headline on Nearby (or other app) pages
- [x] Bottom nav = flat 4-item tab bar, no FAB; desktop = plain top links, no pill
- [x] Card radius ≥20px, soft neutral shadow, no purple gradients, no glow
- [x] Responsive 375/768/1024px; iOS Midnight Gourmet untouched (web-only CSS variable change)

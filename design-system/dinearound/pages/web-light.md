# DineAround Web — "Marketplace Light" (DONESKI-inspired override)

> **Scope:** `web/` app ONLY. Overrides `../MASTER.md` ("Midnight Gourmet") for the web target.
> The iOS app keeps Midnight Gourmet untouched — this file governs `web/app/globals.css` CSS
> variables and web components only. Generated via `ui-ux-pro-max` design-system search
> (`restaurant discovery map marketplace clean white red accent mobile`) blended with the
> user-supplied DONESKI reference brief (2026-07-21).

---

## 0. Design Brief

User explicitly rejected the dark "Midnight Gourmet" look for web and requested a **DONESKI-style
light marketplace aesthetic**: white/off-white canvas, one vibrant red/coral CTA color, bold
sans-serif type hierarchy, big-radius cards with soft shadows, a map-first Nearby screen with a
floating restaurant preview card, horizontal pill filters, and a 5-item bottom nav with a center
FAB. Dark mode becomes optional/secondary, not the default.

## 1. Color Tokens (Light — default)

| Role | Token | Hex | Notes |
|---|---|---|---|
| App background | `background` | `#FAFAF8` | Off-white, not stark #FFF |
| Elevated surface / card | `card` | `#FFFFFF` | Pure white card on off-white canvas |
| Raised surface (modals, inputs) | `surface-raised` | `#FFFFFF` | |
| Chip / pill fill | `chip-fill` | `#F4F3F1` | Neutral warm-grey chip, not tinted red |
| Hairline border | `border-soft` | `#ECEAE7` | Neutral, visible but quiet |
| Input border | `input-border` | `#E4E2DE` | |
| **Primary accent (DONESKI red)** | `accent-coral` | `#FF4B5C` | CTAs, active nav, badges, price/rating pop |
| Primary accent dark | `accent-coral-dark` | `#E8384A` | Gradient end, pressed state |
| Accent glow (light mode = none) | `accent-coral-glow` | transparent | No glow in light mode (flat, not glossy) |
| Secondary brand (DineAround green) | `brand-green` | `#2F9E52` | "Use my location" / distance / success only |
| Secondary brand dark | `brand-green-dark` | `#1F7A3D` | |
| Green tint | `green-tint` | `#E6F6EA` | |
| Rating gold | `accent-gold` | `#F5A623` | Star ratings, wishlist star ONLY |
| Rating gold dark | `accent-gold-dark` | `#C97F0F` | |
| Destructive | `destructive` | `#E1584A` | |
| Text primary | `foreground` | `#171412` | Near-black, warm undertone |
| Text secondary | `text-secondary` | `#78716A` | Warm grey, meets 4.5:1 on white |
| Header surface | `header-bg` | `#FAFAF8` @ 92% | Blur backdrop |
| Nav pill shell | `nav-shell` | `#FFFFFF` | White pill bar (not dark capsule — DONESKI is light-on-light with red active state) |
| Nav active highlight | `nav-active` | `#FF4B5C` | Solid red fill/icon behind active tab |
| FAB background | `fab-bg` | `#FF4B5C` | Center bottom-nav FAB, always red |

### Dark mode (optional, secondary — kept for users who toggle it)

Dark mode is preserved as an opt-in alternate (button in Account page), recolored to the same
red accent so brand stays consistent, but is **no longer the default**:

| Role | Token | Hex |
|---|---|---|
| Background | `background` | `#15130F` |
| Card | `card` | `#1F1C18` |
| Chip fill | `chip-fill` | `#262220` |
| Border | `border-soft` | `rgba(255,255,255,0.08)` |
| Accent | `accent-coral` | `#FF5C6C` |
| Text primary | `foreground` | `#F5F1EC` |
| Text secondary | `text-secondary` | `#9C948C` |
| Nav shell | `nav-shell` | `#1F1C18` |

## 2. Typography

Distinctive bold-sans pairing (not Inter-only), per DONESKI's "large bold titles, medium body,
small-caps labels" hierarchy:

- **Display/Headings:** Plus Jakarta Sans, weights 700/800 — `next/font/google` var `--font-display`
- **Body/UI:** DM Sans, weights 400/500/700 — `next/font/google` var `--font-sans`
- Small-caps category labels (e.g. "RESTAURANT", "ITALIAN"): DM Sans 600, `uppercase`,
  `letter-spacing: 0.06em`, 11px, `text-secondary`.
- Scale: hero/display 30–34px, section h2 22–24px, card title 15–16px, body 14–15px, caption 11–12px.

## 3. Shape & Elevation

| Token | Value | Usage |
|---|---|---|
| `radius-card` | 20px | Restaurant cards, form cards |
| `radius-hero` | 24px | Detail hero image, map card |
| `radius-button` | 16px | Buttons |
| `radius-pill` | 999px | Filter pills, nav bar, chips, FAB |
| `radius-thumb` | 16px | Square thumbnails |

**Shadows (light, DONESKI-flat-with-lift):** `0 8px 20px rgba(23,20,18,0.06)` resting,
`0 12px 28px rgba(23,20,18,0.10)` hover/press. No colored glow — depth comes from soft neutral
shadow + white-on-off-white contrast, not gradients.

## 4. Navigation

Bottom nav = **white pill bar**, 5 items max, red active state, center **FAB** (raised red circle,
Camera/Plus icon) for "Log Visit": `Nearby · Wishlist · [FAB: Log Visit] · Log (history) · Account`.
Desktop mirrors as a top pill nav (same component family, no FAB duplication — FAB collapses to a
regular nav item on desktop since there's no thumb-reach constraint).

## 5. Iconography

`lucide-react` exclusively, 1.5–2px stroke, no emoji as structural icons (emoji-tile restaurant
placeholders from Midnight Gourmet are replaced with solid-color initial/icon tiles to match
DONESKI's clean photographic-square-thumbnail language until real restaurant photos exist).

## 6. Nearby — Map-First Layout

Full-width map area (stylized pin field — deterministic pin placement from restaurant id since the
current seed dataset has no lat/lng; swap for live Google Maps `AdvancedMarkerElement` once
lat/lng + API key are wired) with a floating bottom preview card (thumbnail, name, rating, price,
"View" CTA) for the selected pin, search bar overlaid top, horizontal pill filter row below the map,
then the existing list as a scrollable sheet beneath.

## 7. Pre-Delivery Checklist

- [x] Light-first: off-white canvas + white cards is default; dark is opt-in via Account page
- [x] Single accent `#FF4B5C` drives all CTAs/active states/badges; green + gold kept for their
      narrow semantic roles only (location/success, ratings)
- [x] Bold sans display/body pairing (Plus Jakarta Sans + DM Sans), no Inter-only
- [x] Card radius ≥20px, soft neutral shadow, no purple gradients
- [x] No emoji as structural icons; lucide-react only
- [x] Bottom nav ≤5 items, center FAB, ≥44px touch targets
- [x] Horizontal pill filters replace `<select>` dropdowns on Nearby
- [x] Responsive 375/768/1024px; iOS Midnight Gourmet untouched (web-only CSS variable change)

# DineAround Design System — "Midnight Gourmet"

> **LOGIC:** When building a specific page, first check `design-system/dinearound/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file. Otherwise, follow the rules below.
> This file is the single source of truth for BOTH the iOS SwiftUI app (`ios/Dinearound-app/`) and the
> Next.js web app (`web/`). Token names below map 1:1 to `DATheme.Palette` (iOS) and CSS variables (web).

**Project:** DineAround
**Generated:** 2026-07-20 (blended redesign)
**Category:** Restaurant discovery / visit journal / food delivery-adjacent utility

---

## 0. Design Brief — the blend

Two reference aesthetics were merged:

- **Reference A — "Truck Mart" (dark logistics premium):** deep charcoal/black shell, elevated dark
  cards, bold single accent, large rounded corners with soft glow shadows, floating pill bottom nav,
  strong type hierarchy, tracking/status cards with glow accents.
- **Reference B — food delivery (warm light):** warm peach/beige canvas, white elevated cards,
  coral/orange CTAs, very high corner radius (24–30px), 2-column grid, category pills, star ratings,
  floating black pill nav with a white active highlight.

**Resolution — "Midnight Gourmet":**

- **Dark mode (primary/default)** = Reference A's charcoal shell and depth language, but the single
  bold accent is swapped from construction yellow to a **coral/peach food accent** (`#FF7A50`) pulled
  from Reference B, so photography and CTAs pop against near-black cards. DineAround's signature green
  (`#2F9E52`) survives as the **secondary** brand accent — used for location/distance, verified/active
  states, and primary "positive" actions (Log Visit success, sign-in).
- **Light mode** = Reference B's literal warm peach/beige canvas (`#FDF5F0`-family) with white cards and
  the same coral accent — this *is* the light expression of the same brand, not a separate theme.
- **Card language and radius** (24–28px, soft multi-layer shadow) and the **floating pill bottom nav**
  (dark capsule, active tab gets a solid pill highlight) come from Reference B and are used in both modes.
- Result: one accent (coral) carries CTAs/ratings/highlights across both modes; green is the secondary
  "trust" color; gold is reserved for wishlist/star-rating only; radius and floating-nav language are
  shared; the *shell* (dark vs. light-peach) is what actually swaps with the theme toggle.

---

## 1. Color Tokens

### Dark mode (default / primary)

| Role | Token | Hex | Notes |
|---|---|---|---|
| App background | `background` | `#14110E` | Near-black, warm undertone (not pure #000) |
| Elevated surface / card | `cardBackground` | `#1F1A16` | Elevated dark card |
| Raised surface (modals, inputs) | `surfaceRaised` | `#28211B` | One step up from card |
| Chip / pill fill | `chipFill` | `#241E19` | Filter chips, input fill |
| Hairline border | `borderSoft` | `#FFD6BA` @ 10% | Warm hairline, not grey |
| Input border | `inputBorder` | `#3A2F27` | |
| Primary accent (coral) | `accentCoral` | `#FF7A50` | CTAs, active nav pill, ratings glow |
| Primary accent dark | `accentCoralDark` | `#E4572E` | Gradient end, pressed state |
| Coral glow (for shadows) | `accentCoralGlow` | `#FF7A50` @ 28% | Used only in `shadow`, never fill |
| Secondary brand (DineAround green) | `primaryGreen` | `#2F9E52` | Distance chips, verified state, guest/sign-in |
| Secondary brand dark | `primaryGreenDark` | `#1F7A3D` | |
| Green tint | `greenTint` | `#274233` | Dark-safe tint background |
| Wishlist gold | `accentGold` | `#F0B429` | Star ratings, wishlist heart/star ONLY |
| Wishlist gold dark | `accentGoldDark` | `#C9860F` | |
| Destructive | `destructive` | `#FF5D5D` | Delete, remove |
| Text primary | `textPrimary` | `#F7EEE7` | Warm off-white |
| Text secondary | `textSecondary` | `#9C8F84` | Warm grey |
| Header / nav surface | `headerBackground` | `#14110E` @ 94% | Blur backdrop |
| Toast background | `toastBackground` | `#241E19` | |
| Nav pill (floating shell) | `navShell` | `#0D0B09` @ 92% | Almost-black capsule, blurred |
| Nav active highlight | `navActive` | `#FF7A50` | Solid pill behind active icon |

### Light mode (warm peach — Reference B literal)

| Role | Token | Hex | Notes |
|---|---|---|---|
| App background | `background` | `#FDF5F0` | Warm peach/beige canvas |
| Elevated surface / card | `cardBackground` | `#FFFFFF` | White elevated card |
| Raised surface | `surfaceRaised` | `#FFFFFF` | |
| Chip / pill fill | `chipFill` | `#FBE9DF` | |
| Hairline border | `borderSoft` | `#FF7A50` @ 14% | |
| Input border | `inputBorder` | `#F0DCCF` | |
| Primary accent (coral) | `accentCoral` | `#FF6B3D` | Slightly deeper for light-bg contrast |
| Primary accent dark | `accentCoralDark` | `#D6491E` | |
| Secondary brand (green) | `primaryGreen` | `#2F9E52` | Same across modes (brand-locked) |
| Secondary brand dark | `primaryGreenDark` | `#1F7A3D` | |
| Green tint | `greenTint` | `#DCF2E3` | |
| Wishlist gold | `accentGold` | `#E8A33D` | |
| Wishlist gold dark | `accentGoldDark` | `#C97F0F` | |
| Destructive | `destructive` | `#E1584A` | |
| Text primary | `textPrimary` | `#241A14` | Warm near-black |
| Text secondary | `textSecondary` | `#8A776B` | |
| Header / nav surface | `headerBackground` | `#FDF5F0` @ 96% | |
| Toast background | `toastBackground` | `#241A14` | Stays dark for contrast in both modes |
| Nav pill (floating shell) | `navShell` | `#241A14` @ 92% | Dark capsule even on light bg (Ref B) |
| Nav active highlight | `navActive` | `#FF6B3D` | |

**Rule:** the floating bottom nav is **always a dark/near-black capsule** in both color modes (this is
what makes it feel premium and consistent with Ref B) — only the page canvas + cards swap with theme.

---

## 2. Typography

- **iOS:** SF Pro (system). Headings `weight: .black`, size 22–28. Section titles use two-tone text
  (neutral + accent word) — keep this pattern, just recolor the accent span to `accentCoral` instead of
  green for primary section titles (Nearby, Log); Wishlist keeps gold; keep green reserved for chips.
- **Web:** pair a geometric display face for headings with a clean grotesk for body to create real
  hierarchy (avoid "one font does everything" AI-slop look):
  - Headings: **Sora** (700/800) via `next/font/google`
  - Body/UI: **Inter** (400/500/600/700) via `next/font/google`
- Scale: `display` 32/40px, `h1` 26px, `h2` 20px, `body` 15px, `caption` 12–13px. Weight does the work;
  avoid more than 3 sizes per screen.

## 3. Shape & Elevation

| Token | Value | Usage |
|---|---|---|
| `radiusCard` | 26px | Restaurant cards, form cards, hero |
| `radiusButton` | 18px | Buttons, filter chips (large), inputs |
| `radiusInput` | 16px | Text fields |
| `radiusThumb` | 18px | Thumbnails / photo tiles |
| `radiusPillNav` | 28px (full capsule) | Bottom nav shell |

**Shadows (dark mode):** `0 12px 28px rgba(0,0,0,0.55)` on cards; active/CTA elements add a coral glow
`0 0 24px rgba(255,122,80,0.35)`. **Shadows (light mode):** soft warm shadow `0 10px 24px rgba(210,150,120,0.18)`,
no glow (glow is a dark-mode-only premium cue).

## 4. Navigation

Floating pill bottom nav, inset from screen edges (16–20px margin, not edge-to-edge), dark capsule
(`navShell`) with backdrop blur, 3 tabs (Nearby / Log / Wishlist). Active tab gets a solid rounded-rect
"pill" behind the icon+label in `navActive` (coral) with white icon/text; inactive tabs are muted white/grey
icon-only or icon+label at reduced opacity. This directly follows Ref B's "black pill, white active highlight"
but recolors the active highlight to brand coral instead of plain white for more personality.

## 5. Iconography

- **No emoji for structural UI** (nav icons, action buttons, search, location, star ratings, edit/delete,
  share). Emoji are acceptable only as *content* (restaurant "avatar" glyph in seed data / thumbnails
  placeholders) since there is no photo library — this is a deliberate, contained exception.
- iOS: SF Symbols exclusively for structural icons (`magnifyingglass`, `location.fill`, `star.fill`,
  `pencil`, `trash`, `square.and.arrow.up`, `camera.fill`, `doc.richtext`, `moon.fill`/`sun.max.fill`).
- Web: `lucide-react` exclusively for structural icons (Search, MapPin, Star, Pencil, Trash2, Share2,
  Camera, FileText, Moon, Sun, Plus, X, ChevronLeft, UtensilsCrossed for the brand mark).

## 6. Motion

150–250ms ease-out for hover/press; spring (`response 0.35, damping 0.8`) for SwiftUI tab/like toggles.
Respect `prefers-reduced-motion` on web.

## 7. Component Specs (web CSS variables — see `web/app/globals.css`)

```css
.card         { border-radius: 26px; box-shadow: var(--shadow-card); }
.btn-primary  { background: linear-gradient(90deg, var(--accent-coral), var(--accent-coral-dark)); border-radius: 18px; }
.btn-secondary{ background: var(--chip-fill); border: 2px solid color-mix(in srgb, var(--accent-coral) 40%, transparent); border-radius: 18px; }
.pill-nav     { background: var(--nav-shell); border-radius: 28px; backdrop-filter: blur(20px); }
```

## 8. Page Notes

- **Auth:** dark gradient hero (charcoal → coral-tinted glow) in dark mode; warm peach → coral gradient
  in light mode. Card stays white/near-white in both (per Ref B) for max legibility of the form.
- **Nearby:** 1-column list on mobile (data-dense: address, distance, rating, 2 CTAs) — matches current
  iOS layout; card imagery is emoji-tile gradient placeholder (no photo backend yet) with coral/green
  gradient swapped in for the former all-green tile.
- **Log:** visit cards keep photo strip + PDF section; rating pill recolors to coral gradient.
- **Wishlist:** gold stays reserved here — this is the one screen where gold, not coral, is the hero accent.
- **Detail:** hero band uses coral→green diagonal gradient (brand blend made literal), sticky action row.

## 9. Pre-Delivery Checklist

- [x] No emoji as *structural* icons — SF Symbols / lucide-react only
- [x] Single accent (coral) drives CTAs/active states; green + gold reserved for specific semantic roles
- [x] Dark mode is the premium default; light mode is a first-class, fully designed alternate, not an afterthought
- [x] Card radius ≥24px, floating pill nav, soft/glow shadow depth
- [x] Focus states visible; contrast checked against both dark and light backgrounds
- [x] Responsive: 375px, 768px, 1024px+ (web)

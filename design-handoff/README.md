# Handoff: DineAround — Restaurant Discovery & Visit Log App

## Overview
DineAround is a mobile app for discovering restaurants, logging visited restaurants with ratings/notes/photos, keeping a wishlist, and digitizing/exporting restaurant menus. This package documents an interactive HTML prototype of the full experience so it can be rebuilt as a real native (or cross-platform) mobile app suitable for App Store submission.

## About the Design Files
The files in this bundle (`DineAround.dc.html`, `dinearound-data.js`, `ios-frame.jsx`, `image-slot.js`) are **design references built in HTML/React for prototyping only** — they are not production code and must not be shipped as-is or wrapped in a WebView for release. `ios-frame.jsx` is purely a visual device-bezel mockup used to preview the design at iPhone scale; ignore it entirely when building — it has no bearing on the real app's native chrome (status bar, home indicator, keyboard are provided by the OS).

**Task**: recreate this design and its interaction logic natively — Swift/SwiftUI for iOS, or React Native/Flutter if a cross-platform codebase is preferred — following each platform's conventions (navigation, safe areas, native share sheet, native photo picker, native PDF generation) rather than replicating the HTML/CSS mechanics literally. If a codebase already exists, match its existing architecture and component patterns instead of introducing new ones.

## Fidelity
**High-fidelity.** Colors, spacing, typography, copy, and interaction states in this document are final and should be recreated precisely. Treat every hex value, spacing number, and label text below as exact.

## Global Design Tokens

**Colors (light mode)**
- Primary green: `#2F9E52` (buttons, links, active states)
- Primary green dark: `#1F7A3D` (gradient end, hover)
- Green tint bg: `#DCF2E3`, `#3FAE68` (avatar gradients)
- Accent gold (wishlist/ratings): `#E8A33D`, dark `#C97F0F`
- Destructive red: `#E1584A`
- Background: `#F5FAF6`
- Card background: `#FFFFFF`
- Chip/input fill: `#EFF7F1`
- Input border: `#DCE8DF`
- Text primary: `#15241B`
- Text secondary: `#5C7268`
- Border soft: `rgba(47,158,82,0.16)` / soft2 `rgba(47,158,82,0.22)`
- Toast background: `#15241B` (white text)

**Colors (dark mode)** — toggled via a 🌙/☀️ header button, applies app-wide:
- Background: `#122019`
- Card background: `#1B2B22`
- Chip/input fill: `#16241C`
- Input border: `#2E4536`
- Text primary: `#EAF5EE`
- Text secondary: `#8FAE9B`
- Border soft: `rgba(63,110,80,0.4)` / soft2 `rgba(63,110,80,0.5)`
- Header/bottom-nav bg: `rgba(18,32,25,0.92–0.96)`

**Typography**: system font stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto…`). Screen titles 22–26px/weight 900; card titles 15–16px/weight 800; body/secondary text 12–14px/weight 500–600; small caps labels (menu category) 10–11px/weight 800/uppercase/letter-spacing 0.04em.

**Shape**: large rounded corners throughout — cards 20–24px radius, buttons/pills 12–16px radius, avatar/thumbnail tiles 16px, photo slots 14–20px. Buttons are solid-fill gradient (`linear-gradient(to right, #2F9E52, #1F7A3D)`) or 2px-bordered outline style, never flat single-color with drop shadow only.

**Elevation**: cards use soft, large-radius shadows, e.g. `0 2px 10px rgba(21,36,27,0.05)` (list rows) up to `0 6px 20px rgba(61,57,53,0.08)` (forms/modals). No hard drop shadows.

## Screens / Views

### 1. Auth (Login / Sign up / Guest)
**Purpose**: entry screen before any app content is accessible.
**Layout**: full-screen, vertically centered content over a diagonal gradient background (`linear-gradient(to bottom right, #DCF2E3, #3FAE68, #1F7A3D)`), padding 32px/28px/44px.
**Components**:
- Logo row: 44px circular avatar (translucent white, 🍽️ emoji) + "DineAround" wordmark, 26px/weight 900.
- Segmented control: "Log in" / "Sign up" tabs inside a pill-shaped translucent white track (padding 4px, radius 16px); active tab is solid white pill, inactive is transparent at 70% opacity.
- Form card: white rounded card (radius 24px, shadow `0 10px 30px rgba(61,57,53,0.15)`), containing:
  - Email field: label "Email" (13px/700) + text input, placeholder "you@example.com", radius 14px, 2px border.
  - Password field: label "Password" + password input, placeholder "••••••••".
  - Submit button: full-width gradient button, label "Log in" or "Create account" depending on active tab, radius 16px, scales to 1.02 on hover.
- "Continue as guest" text-link button below the card, underlined, centered.
**Behavior**: submitting the form or tapping guest logs the user in immediately with no real validation/backend in the prototype — a real build needs actual auth (email/password, OAuth, or guest session) and persistence.

### 2. App Header (persistent, once logged in)
**Layout**: fixed top bar, 14px/18px padding, 2px bottom border, background `headerBg`.
**Components**: left — 32px circular gradient avatar + "DineAround" wordmark (18px/900, green). Right — dark-mode toggle button (🌙/☀️, 18px icon) and "Sign out" pill button (gradient fill, white text, 12px/800).

### 3. Nearby (Discover) tab
**Purpose**: search and browse restaurants; primary entry point.
**Layout**: scrollable column, 20px/18px/32px padding.
**Components**:
- Heading: "Discover **Restaurants**" (24px/900, second word in green `#2F9E52`) + subtext "Find and explore amazing dining experiences near you" (13px/600, secondary text color).
- Search input: full-width, 🔍 icon absolutely positioned at left (12px from edge), placeholder "Search for restaurants...", radius 16px, 2px border, white bg, subtle shadow.
- **Location button** ("📍 Use my location"): full-width button below search, radius 16px. Toggles between two states:
  - Inactive: outline style (`border:2px solid rgba(47,158,82,0.4)`, tinted bg `rgba(47,158,82,0.08)`, green text).
  - Locating: label becomes "📍 Locating…" while `navigator.geolocation.getCurrentPosition` resolves (or immediately if unsupported).
  - Active: solid green fill, white text, label "📍 Showing nearby · sorted by distance". When active, restaurant list re-sorts by distance ascending and each card appends "· X km away" after the cuisine/price line.
- Filter row: "🍴 All Cuisines" select (populated from a 9-item cuisine list), "💰 All Prices" select (Budget $ / Moderate $$ / Pricey $$$ / Luxury $$$$), and a "✕ Clear" button that only appears once a filter is active.
- Empty state (no results): centered block, 🔍 emoji 44px, "No restaurants found" (16px/900) + "Try a different search or filter" (13px/600), inside a 2px-bordered 24px-radius box.
- Restaurant list: vertical stack, 12px gap. Each card is a horizontal row: 76×76px rounded (16px) gradient thumbnail with cuisine emoji (tap → Detail), and a right column with restaurant name (15px/800, truncated with ellipsis), "{cuisine} · {price symbols}[ · {distance}]" (11px/600, truncated), star rating badge ("⭐ {rating}", 11px/800, gold), and a bottom action row: "Log Visit" button (flex-1, solid green, white text) + a ⭐ wishlist toggle button (outline gold when not saved, solid gold fill with white star when saved).

### 4. Log (Visit Log) tab
**Purpose**: record and review past visits.
**Layout**: 20px/18px/32px padding.
**Components**:
- Header row: "Visit **Log**" title (22px/900, green second word) + toggle button (gradient green, "+ Log Visit" / "Cancel" depending on form state).
- **Log/Edit form** (shown when active): rounded card (22px radius, 2px border, shadow), fields:
  - "Restaurant Name *" text input (required)
  - "Visit Date *" native date input (defaults to today)
  - "Rating" — 5 tappable ★ icons (26px), gold `#E8A33D` when selected/filled, `#DCE8DF` when empty
  - "Notes" — 3-row textarea, placeholder "What did you think?"
  - Actions: "Save Visit" / "Update Visit" submit button (gradient fill) + "Cancel" outline button.
- Empty state: 📝 emoji, "You haven't logged any visits yet." (15px/800).
- Visit list: vertical stack, 12px gap, each entry a rounded card (22px radius, 2px border) showing restaurant name (16px/900), formatted date ("Jan 5, 2026" style, 12px/600), a rating pill (e.g. "★★★★☆ 4/5", gradient green bg, white text) shown only if a rating exists, and notes text (13px/500). Top-right of each card: three icon-only buttons, no border/bg, 15px font: 📤 (share), ✏️ (edit — populates the form with this visit's data), 🗑️ (delete — removes immediately, no confirm dialog in the prototype; add one for the real app if desired).
  - Visits sort newest-date-first.
- **Share action (📤)**: builds a plain-text summary — `"{restaurant} — visited {date}[, {rating}/5 ⭐][\n"{notes}"]\nShared from DineAround"` — and invokes the OS share sheet (`navigator.share`) if available, else copies to clipboard and shows a toast "Copied to clipboard!", else shows toast "Sharing not supported on this device". **Native equivalent**: use `UIActivityViewController` (iOS) / `Share` API (React Native) with the same text composition; no native share-sheet screenshot exists in this prototype since it's a browser API stub — implement platform-native share.

### 5. Wishlist tab
**Purpose**: save restaurants to visit later.
**Layout**: 20px/18px/32px padding.
**Components**:
- Header row: "Wish**list**" title (22px/900, second word gold `#E8A33D`) + toggle button (gradient gold, "+ Add Restaurant" / "Cancel").
- **Add panel** (shown when active): rounded card listing all restaurants NOT already on the wishlist as compact rows (emoji + name + cuisine, truncated) with a circular "+" button (gradient gold) to add. Shows "All restaurants are already on your wishlist." when none remain.
- Empty state: ⭐ emoji, "Your wishlist is empty. Add restaurants you want to visit!"
- Wishlist rows: same card style as Nearby list rows but simplified — thumbnail + name/cuisine/price (tap → Detail) + a circular red "×" remove button on the right (no separate Log Visit button here).

### 6. Restaurant Detail (pushed screen, not a tab)
**Purpose**: full restaurant info, wishlist toggle, visit logging entry point, food photo gallery, menu.
**Layout**: "← Back" text button (14px/800, green) at top; 200px-tall gradient hero band (`linear-gradient(135deg,#DCF2E3,#2F9E52)`) with a large 72px emoji centered; content padding 20px/20px/40px below.
**Components**:
- Restaurant name (24px/900), address + cuisine line ("📍 {address} · {cuisine}", 14px/600, secondary color).
- Badge row: rating pill ("⭐ {rating}", gradient green, white text) + price-level pill (tinted green bg, dark green text, e.g. "$$$").
- Action row: "Log Visit" button (flex-1, gradient fill) + wishlist toggle button ("☆ Add to Wishlist" / "★ In Wishlist", outline vs. solid gold).
- **Food Photos** section: "Food Photos" heading (16px/900) + a 3-column grid of square (1:1) rounded photo drop-slots (radius 14px), each an empty placeholder reading "Add a photo" until the user attaches an image. **Native equivalent**: native photo picker / camera capture into a 3-slot gallery, persisted per restaurant.
- **Menu** section: heading + a button that reads "Capture Menu" (no menu yet) or "Edit Menu" (menu exists) — outline gold-bordered button, opens Menu Capture screen. If a menu exists, list menu items as rows (chip background, radius 14px): small-caps category label (10px/800, uppercase) above dish name (14px/700), price right-aligned in green (14px/800, "$" prefix). If no menu: "No menu captured yet." (13px/600, secondary color).

### 7. Menu Capture screen (pushed screen)
**Purpose**: attach a menu photo, "digitize" it into editable line items, export as PDF.
**Layout**: "← Back" button, "Capture Menu" heading (20px/900) + restaurant name subtitle (13px/600).
**Components**:
- Photo drop-slot: 150px-tall rounded (radius 20px) placeholder, "Drop a photo of the menu".
- "✨ Digitize Menu" button: full-width, gradient (`linear-gradient(to right,#3FAE68,#2E8A4F)`), white text — in the prototype this seeds a deterministic mock item list per restaurant (stand-in for real OCR). **Native equivalent**: call a real OCR/vision service (e.g. on-device Vision framework or a cloud OCR/LLM API) on the captured photo and populate structured menu items from the result.
- Editable item rows: each a chip-background row (radius 14px) with three inline inputs — Category (70px wide), Dish name (flex), Price ($, 44px wide) — plus a "×" remove button (red, 18px).
- "+ Add dish" button: full-width, dashed 2px border, no fill, secondary text color.
- "🖨️ Export Menu as PDF" button: appears only once the menu has items; outline green button. In the prototype this calls the browser print dialog against a hidden print-only sheet (restaurant name + full item list, laid out cleanly for print). **Native equivalent**: generate a real PDF document (e.g. `PDFKit` on iOS, or a PDF library on the target platform) with the same layout — title, "Menu" subtitle, category/name/price rows separated by thin rules — and present the native share/print sheet for it.

### Bottom Tab Bar (persistent, 3 tabs)
Fixed at the bottom, 2px top border, extra 22px bottom padding (safe-area equivalent — use the native safe-area inset on a real device). Three equal-width tab buttons, icon (20px) over label (11px/800): 📍 Nearby, 📝 Log, ⭐ Wishlist. Active tab's icon+label tint to green `#2F9E52`; inactive tabs use secondary text color.

### Toast
A small pill notification (`#15241B` bg, white text, 13px/700, radius 20px) appears fixed near the bottom-center for ~2.2s to confirm actions (e.g. "Copied to clipboard!"). Native equivalent: a lightweight in-app toast/snackbar component.

## Interactions & Behavior Summary
- **Navigation**: single-stack push/pop model — Nearby/Log/Wishlist are tabs; tapping a restaurant pushes Detail; tapping Capture/Edit Menu from Detail pushes Menu Capture; "← Back" pops one level. Switching tabs while a detail/menu screen is open resets the stack.
- **Auth**: trivial in-memory login; no persistence, no real validation.
- **Search/filter**: live client-side filtering by name/cuisine substring, cuisine dropdown, and price-level dropdown; combinable; "✕ Clear" resets cuisine+price only (not the search text).
- **Location sort**: toggled by a single button; when on, list re-sorts ascending by a `distanceKm` field on each restaurant and shows "X km away". In the prototype `distanceKm` is static seed data — a real build should compute this from live device location vs. each restaurant's coordinates.
- **Log Visit**: from any restaurant card ("Log Visit" button) jumps straight to the Log tab with the form pre-filled with that restaurant's name and today's date; from the Log tab itself the "+ Log Visit" toggle opens a blank form. Editing a visit reuses the same form, pre-filled, with the submit button relabeled "Update Visit".
- **Wishlist toggle**: single boolean per restaurant id, toggled from Nearby cards, Detail screen, or removed via the Wishlist tab's "×" button.
- **Dark mode**: single boolean flips all theme tokens app-wide instantly (header toggle icon 🌙/☀️); no system-preference detection in the prototype — consider defaulting to the OS's light/dark setting on first launch in the real app.
- **Share**: see Log tab section above — text composition and share-sheet fallback logic should be preserved.
- **Menu digitize → export PDF**: see Menu Capture section above.

## State Management (for reference — re-derive natively, don't port 1:1)
Key state needed: current user/session, active tab, navigation stack (array of `{type: 'detail'|'menuCapture', id}`), search query + cuisine + price filters, wishlist (array of restaurant ids), visits (array of `{id, restaurantName, date, rating, notes}`), per-restaurant captured menus (map of restaurant id → array of `{category, name, price}`), visit-log form state (open/closed, editing id, field values), wishlist-add panel open/closed, location toggle + loading flag, dark mode flag, transient toast message.

All of this is in-memory only in the prototype (lost on reload). A real app needs persistence — local storage/database at minimum, ideally synced to a backend so visits/wishlist/menus survive reinstall and work across devices.

## Assets
No external image assets — all iconography is emoji (🍽️ 📍 📝 ⭐ 🔍 🍴 💰 ✨ 🖨️ 📤 ✏️ 🗑️ ☀️ 🌙 ✕ ×). Restaurant "photos" are gradient tiles with a cuisine emoji (placeholder for real photography — the real app should use actual restaurant photos, e.g. from a places API or user uploads). Food photo and menu photo slots are empty drop-targets in the prototype (no placeholder images) awaiting user-uploaded photos.

## Screenshots
See `screenshots/` for reference captures: 01-auth, 02-nearby, 03-detail, 04-menu-capture (empty), 05-menu-capture-digitized, 06-log-empty, 07-log-form, 08-wishlist (empty), 09-dark-mode.

## Files in This Bundle
- `DineAround.dc.html` — the full prototype: all screens, styles (inline), and interaction logic (bottom `<script>` block, plain JS class with state/handlers). This is the primary reference — read top to bottom for exact markup/styles per screen, and the script block for exact interaction logic.
- `dinearound-data.js` — static seed data: the 9-restaurant catalog (name, cuisine, emoji, address, rating, price level, distance), the cuisine filter list, and mock "digitized" menu data per restaurant (stand-in for real OCR output).
- `ios-frame.jsx` — **presentation-only** device bezel used to preview the design at iPhone scale in this tool. Not used by the real app; ignore for implementation (do not build a fake status bar/home indicator — use the OS's).
- `image-slot.js` — a drag-and-drop placeholder web component standing in for a real native image picker (Food Photos grid, menu photo slot). Reference only for placement/sizing, not for implementation.

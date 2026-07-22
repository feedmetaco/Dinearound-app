# iOS — Build to Your iPhone (Local Sideload)

**Project:** `ios/Dinearound-app/Dinearound-app.xcodeproj`  
**API (production):** `https://dinearound-api.samisalehin.workers.dev`  
**Minimum iOS:** 18.5 (set in Xcode project)

## Prerequisites

- **Full Xcode** from the App Store (not Command Line Tools only) — see `_shared/SETUP.md` Gate 0
- **Apple ID** added in Xcode → Settings → Accounts
- **Physical iPhone** on iOS 18.5+, USB cable (or wireless debugging after first USB pair)
- **Developer Mode** on iPhone: Settings → Privacy & Security → Developer Mode → On → restart

## One-time: Signing

1. Open `Dinearound-app.xcodeproj` in Xcode.
2. Select target **Dinearound-app** → **Signing & Capabilities**.
3. Check **Automatically manage signing**.
4. Choose your **Team** (Personal Team is fine for local install).

If signing fails with “identifier already in use,” change **Bundle Identifier** to something unique (e.g. `com.samisalehin.dinearound`).

> **Note:** `DEVELOPMENT_TEAM` is intentionally not committed — each Mac/user picks their own team in Xcode.

## Install on phone

1. Connect and unlock iPhone; tap **Trust This Computer** if prompted.
2. In the Xcode toolbar, select **your iPhone** as the run destination (not a simulator).
3. Press **⌘R** (Run).
4. First launch blocked? **Settings → General → VPN & Device Management** → trust your developer certificate.
5. Open **DineAround** on the phone.

## Smoke test

| Mode | What to try |
|------|-------------|
| **Guest** | Nearby → log visit → food photo → wishlist (local only) |
| **Signed in** | Sign up → log visit → force-quit → reopen → data should sync via Cloudflare API (cellular/Wi‑Fi) |

## Simulator (optional first)

```bash
cd ios/Dinearound-app
xcodebuild -scheme Dinearound-app \
  -destination 'platform=iOS Simulator,name=iPhone 17 Pro Max' build
```

Or pick any simulator in Xcode and press **⌘R**.

## Free Apple ID limits

- App installs expire after ~**7 days** — run **⌘R** again from Xcode to refresh.
- **TestFlight / App Store** requires paid Apple Developer Program ($99/yr).

## Not required for sideload

- Paid developer account
- App Store Connect listing
- Same Wi‑Fi as your Mac (API is on Cloudflare)

## Feature gaps (app runs without these)

- Nearby uses **9 demo restaurants** (Google Places on iOS not wired yet)
- Menu “Digitize” uses **seed data**, not Vision OCR
- See `tasks/todo.md` Track B for full backlog

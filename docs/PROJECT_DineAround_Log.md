## 2026-07-20 — iOS Track B handoff implementation (Cursor agent)

**Phase:** Build  
**Screen:** Full MVP shell (auth → tabs → detail → menu)

### Done
- SwiftUI design tokens (`Design/Theme.swift`, `#2F9E52` palette, light/dark)
- Auth flow (login/signup/guest)
- Main tab bar + app header with dark mode toggle
- Nearby (search, filters, location sort, cards)
- Log (SwiftData visits, star rating, share, edit/delete)
- Wishlist (add panel, remove)
- Restaurant detail + food photo pickers
- Menu capture (seed digitize, editable rows, PDF export + share sheet)
- Seed data from handoff catalog
- Info.plist keys for location + photo library

### Verified
- [ ] Xcode build — **blocked**: full Xcode.app not installed (CLT only)

### Next
- User installs Xcode → open `ios/Dinearound-app/Dinearound-app.xcodeproj` → build & run Simulator
- Replace menu seed digitize with Vision OCR
- MapKit integration (optional enhancement)


# 🗂️ Step-by-Step Plan for V0.001 – DineAround

> Goal: Build a minimal, functional version of the app for personal use while traveling — installable directly on iPhone without App Store.

---

## ✅ Day 1 – Core Structure + GPS + Manual Entry

### 🎯 Objective — Day 1

Get a skeleton app running with manual restaurant entry, working on your iPhone.

### Tasks — Day 1

- [ ] Create new SwiftUI app in Xcode (or via Cursor)
  - Bundle ID: `com.yourname.dinearound`
  - Set Team = your Apple ID
  - iOS Deployment Target = iOS 16+
- [ ] Build folder structure:

```text
/Models
/Views
/ViewModels
/Services
```

- [ ] Build `ContentView` with 3-tab layout:
  - Nearby (dummy list)
  - Log (form to save a restaurant)
  - Wishlist (manual text input list)
- [ ] Implement `LocationManager.swift` to fetch coordinates
- [ ] Display current GPS coordinates in Nearby tab
- [x] Integrate new app icon (`/PlanningFiles/icons/...`) into the Xcode project's asset catalog.
- [ ] Log form: name, rating, notes, and ability to add multiple photos (for the place, menu pages, food, etc.)
- [ ] Save data locally using SwiftData to create a robust on-device database for your restaurant logs.

---

## ✅ Day 2 – API Integration + Simple Map

### 🎯 Objective — Day 2

Add real restaurant data via API and visualize nearby options.

### Tasks — Day 2

- [ ] Sign up for Google Places API or Yelp Fusion API
- [ ] Hardcode coordinates for initial test
- [ ] Fetch and display:
  - Restaurant name
  - Rating
  - Address
  - Thumbnail
- [ ] Add MapKit view:
  - Show user location
  - Drop pins for restaurants
- [ ] Style Nearby tab with better list UI (optional)

- [ ] Set up secure API access via backend proxy
  - Lightweight proxy (Node/Express or similar) holds API keys
  - Endpoints: `/places/nearby`, `/places/details`, `/yelp/nearby`, `/yelp/details`
  - Load secrets from environment; support local `APISecret.key` for dev [[memory:7629411]]
  - Configure CORS, simple caching, and basic rate limiting
- [ ] Wire iOS app to call the proxy (not Google/Yelp directly)

- [ ] Ratings UI: show Google and Yelp ratings side by side
  - Display rating value and review count from both sources
  - Fallback to Google if Yelp coverage is limited in a region
  - Apple Maps ratings are not available via public API; add “Open in Apple Maps” action

- [ ] Internationalization for searches
  - Always send `latitude`, `longitude`, and device `language/locale` to both services
  - Allow manual locale override in app settings

- [ ] Cost guardrails and monitoring
  - Google: enable billing; $200 monthly credit; Place Details Essentials ~ $5 per 1,000
  - Yelp: free within daily limits; contact Yelp for higher usage tiers
  - Add simple usage logging in proxy and set alert thresholds

---

## ✅ Day 3 – Wishlist Alerts + OCR Planning

### 🎯 Objective — Day 3

Enable wishlist proximity alerts and start working on OCR menu capture.

### Tasks — Day 3

- [ ] Add ability to save a “Want to Visit” item with name + address
- [ ] Geofence logic: alert if within 300–500m of wishlisted spot
- [ ] Local push notification when nearby
- [ ] Add camera access + permission
- [ ] Start OCR service using VisionKit (or Tesseract if preferred)
- [ ] Parse dummy menu image and show raw text output

---

## 🏁 Summary

By the end of V0.001, you will be able to:

- See nearby places (dummy or real)
- Manually log meals and notes
- Track wishlist restaurants
- Receive alerts when near a saved spot
- Start parsing restaurant menus using OCR

This version will be locally installed on your iPhone and function offline with optional API data.

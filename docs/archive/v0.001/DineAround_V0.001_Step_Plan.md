
# 🗂️ Step-by-Step Plan for V0.001 – DineAround

> Goal: Build a minimal, functional version of the app for personal use while traveling — installable directly on iPhone without App Store.

---

## ✅ Day 1: Core Structure + GPS + Manual Entry

### 🎯 Objective:
Get a skeleton app running with manual restaurant entry, working on your iPhone.

### Tasks:
- [ ] Create new SwiftUI app in Xcode (or via Cursor)
    - Bundle ID: `com.yourname.dinearound`
    - Set Team = your Apple ID
    - iOS Deployment Target = iOS 16+
- [ ] Build folder structure:
    ```
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
- [ ] Log form: name, rating, notes, photo upload (camera or gallery)
- [ ] Save data locally using `@AppStorage` or JSON

---

## ✅ Day 2: API Integration + Simple Map

### 🎯 Objective:
Add real restaurant data via API and visualize nearby options.

### Tasks:
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

---

## ✅ Day 3: Wishlist Alerts + OCR Planning

### 🎯 Objective:
Enable wishlist proximity alerts and start working on OCR menu capture.

### Tasks:
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

# iOS Setup and Build to iPhone

## Requirements
- Xcode (latest) on macOS
- Apple ID signed into Xcode (Signing & Capabilities)

## Steps (new project)
1. Create a new SwiftUI app in Xcode
   - Bundle ID: `com.yourname.dinearound`
   - Team: your Apple ID
   - iOS target: 16+
2. Create folders: `Models/`, `Views/`, `ViewModels/`, `Services/`
3. Build and run on a connected iPhone (enable Developer Mode)

## Local data
- Start with `@AppStorage` or a simple JSON file in app sandbox.

## Notes
- Docker/Linux containers cannot build to iPhone. Use Xcode on macOS.

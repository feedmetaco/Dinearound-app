//
//  Dinearound_appApp.swift
//  Dinearound-app
//

import SwiftData
import SwiftUI

@main
struct Dinearound_appApp: App {
    @State private var appState = AppState()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environment(appState)
        }
        .modelContainer(for: [VisitRecord.self, StoredMenuItem.self, RestaurantMedia.self])
    }
}

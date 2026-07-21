//
//  ContentView.swift
//  Dinearound-app
//
//  Legacy entry — use RootView via Dinearound_appApp.
//

import SwiftUI

struct ContentView: View {
    var body: some View {
        RootView()
    }
}

#Preview {
    ContentView()
        .environment(AppState())
        .modelContainer(for: [VisitRecord.self, StoredMenuItem.self], inMemory: true)
}

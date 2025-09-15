//
//  ContentView.swift
//  Dinearound-app
//
//  Created by sami salehin on 9/14/25.
//

import SwiftUI

struct ContentView: View {
    @State private var restaurantName: String = ""
    @State private var visitNotes: String = ""
    @State private var wishlist: [String] = []

    var body: some View {
        TabView {
            NearbyTab()
                .tabItem {
                    Label("Nearby", systemImage: "location.circle")
                }

            LogTab(restaurantName: $restaurantName, visitNotes: $visitNotes)
                .tabItem {
                    Label("Log", systemImage: "book")
                }

            WishlistTab(wishlist: $wishlist)
                .tabItem {
                    Label("Wishlist", systemImage: "list.star")
                }
        }
    }
}

private struct NearbyTab: View {
    var body: some View {
        VStack(spacing: 12) {
            Image(systemName: "mappin.and.ellipse")
                .font(.system(size: 48))
                .foregroundStyle(.tint)
            Text("Nearby restaurants coming soon")
                .font(.headline)
            Text("GPS and real API data added in the next step.")
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
        .padding()
    }
}

private struct LogTab: View {
    @Binding var restaurantName: String
    @Binding var visitNotes: String

    var body: some View {
        Form {
            Section("New Visit") {
                TextField("Restaurant name", text: $restaurantName)
                TextField("Notes", text: $visitNotes, axis: .vertical)
                    .lineLimit(3...6)
                Button("Save locally") {
                    restaurantName = ""
                    visitNotes = ""
                }
            }
        }
    }
}

private struct WishlistTab: View {
    @Binding var wishlist: [String]
    @State private var newItem: String = ""

    var body: some View {
        NavigationStack {
            List {
                ForEach(wishlist, id: \.
self) { item in
                    Text(item)
                }
                .onDelete { indices in
                    wishlist.remove(atOffsets: indices)
                }

                HStack {
                    TextField("Add place", text: $newItem)
                    Button("Add") {
                        let trimmed = newItem.trimmingCharacters(in: .whitespacesAndNewlines)
                        if !trimmed.isEmpty {
                            wishlist.append(trimmed)
                            newItem = ""
                        }
                    }
                    .buttonStyle(.borderedProminent)
                }
            }
            .navigationTitle("Wishlist")
            .toolbar { EditButton() }
        }
    }
}

#Preview {
    ContentView()
}

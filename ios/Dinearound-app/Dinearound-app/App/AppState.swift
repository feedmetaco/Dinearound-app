import Foundation
import Observation
import SwiftUI

enum AppTab: String, CaseIterable {
    case nearby
    case log
    case wishlist

    var icon: String {
        switch self {
        case .nearby: return "mappin.and.ellipse"
        case .log: return "book"
        case .wishlist: return "star"
        }
    }

    var label: String {
        switch self {
        case .nearby: return "Nearby"
        case .log: return "Log"
        case .wishlist: return "Wishlist"
        }
    }
}

enum NavigationDestination: Hashable {
    case detail(String)
    case menuCapture(String)
}

struct VisitDraft {
    var restaurantName: String = ""
    var restaurantId: String?
    var visitDate: Date = .now
    var rating: Int = 0
    var notes: String = ""
    var editingVisitId: UUID?
}

@Observable
@MainActor
final class AppState {
    var isAuthenticated = false
    var isGuest = false
    var userEmail = ""

    var prefersDarkMode: Bool?
    var systemColorScheme: ColorScheme = .light

    var selectedTab: AppTab = .nearby
    var navigationPath = NavigationPath()

    var searchQuery = ""
    var cuisineFilter = "All Cuisines"
    var priceFilter: PriceFilter = .all

    var wishlistIds: Set<String> = []
    var showLogForm = false
    var showWishlistAdd = false
    var visitDraft = VisitDraft()

    var toastMessage: String?
    private var toastTask: Task<Void, Never>?

    let locationManager = LocationManager()
    let restaurants = SeedData.restaurants

    var isDark: Bool {
        prefersDarkMode ?? (systemColorScheme == .dark)
    }

    var palette: DATheme.Palette {
        DATheme.palette(isDark: isDark)
    }

    func signIn(email: String, password: String, isSignUp: Bool) {
        _ = password
        _ = isSignUp
        userEmail = email.isEmpty ? "guest@dinearound.app" : email
        isGuest = false
        isAuthenticated = true
    }

    func continueAsGuest() {
        isGuest = true
        userEmail = "Guest"
        isAuthenticated = true
    }

    func signOut() {
        isAuthenticated = false
        isGuest = false
        userEmail = ""
        navigationPath = NavigationPath()
        selectedTab = .nearby
    }

    func toggleDarkMode() {
        let currentlyDark = isDark
        prefersDarkMode = !currentlyDark
    }

    func showToast(_ message: String) {
        toastTask?.cancel()
        toastMessage = message
        toastTask = Task {
            try? await Task.sleep(for: .seconds(2.2))
            if !Task.isCancelled {
                toastMessage = nil
            }
        }
    }

    func filteredRestaurants() -> [Restaurant] {
        var list = restaurants.filter { restaurant in
            let q = searchQuery.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
            let matchesSearch = q.isEmpty
                || restaurant.name.lowercased().contains(q)
                || restaurant.cuisine.lowercased().contains(q)
            let matchesCuisine = cuisineFilter == "All Cuisines" || restaurant.cuisine == cuisineFilter
            let matchesPrice = priceFilter.matches(restaurant.priceLevel)
            return matchesSearch && matchesCuisine && matchesPrice
        }
        if locationManager.sortByDistance {
            list.sort { $0.distanceKm < $1.distanceKm }
        }
        return list
    }

    func isWishlisted(_ id: String) -> Bool {
        wishlistIds.contains(id)
    }

    func toggleWishlist(_ id: String) {
        if wishlistIds.contains(id) {
            wishlistIds.remove(id)
        } else {
            wishlistIds.insert(id)
        }
    }

    func restaurant(by id: String) -> Restaurant? {
        restaurants.first { $0.id == id }
    }

    func openLogVisit(for restaurant: Restaurant) {
        visitDraft = VisitDraft(
            restaurantName: restaurant.name,
            restaurantId: restaurant.id,
            visitDate: .now,
            rating: 0,
            notes: ""
        )
        showLogForm = true
        selectedTab = .log
        navigationPath = NavigationPath()
    }

    func clearFilters() {
        cuisineFilter = "All Cuisines"
        priceFilter = .all
    }

    func resetNavigationOnTabChange() {
        navigationPath = NavigationPath()
    }

    func shareText(for visit: VisitRecord) -> String {
        var lines = ["\(visit.restaurantName) — visited \(visit.visitDate.formatted(date: .abbreviated, time: .omitted))"]
        if visit.rating > 0 {
            lines[0] += ", \(visit.rating)/5 ⭐"
        }
        if !visit.notes.isEmpty {
            lines.append("\"\(visit.notes)\"")
        }
        lines.append("Shared from DineAround")
        return lines.joined(separator: "\n")
    }
}

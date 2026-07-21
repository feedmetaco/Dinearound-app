import SwiftUI

struct NearbyView: View {
    @Environment(AppState.self) private var appState
    @Environment(\.daPalette) private var palette

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                VStack(alignment: .leading, spacing: 6) {
                    (
                        Text("Discover ")
                            .foregroundStyle(palette.textPrimary)
                        + Text("Restaurants")
                            .foregroundStyle(palette.primaryGreen)
                    )
                    .font(.system(size: 24, weight: .black))

                    Text("Find and explore amazing dining experiences near you")
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundStyle(palette.textSecondary)
                }

                HStack {
                    Image(systemName: "magnifyingglass")
                        .foregroundStyle(palette.textSecondary)
                    TextField("Search for restaurants...", text: Bindable(appState).searchQuery)
                }
                .padding(14)
                .background(palette.cardBackground)
                .clipShape(RoundedRectangle(cornerRadius: DATheme.radiusButton))
                .overlay(
                    RoundedRectangle(cornerRadius: DATheme.radiusButton)
                        .stroke(palette.inputBorder, lineWidth: 2)
                )

                locationButton

                filterRow

                let restaurants = appState.filteredRestaurants()
                if restaurants.isEmpty {
                    emptyState
                } else {
                    ForEach(restaurants) { restaurant in
                        restaurantCard(restaurant)
                    }
                }
            }
            .padding(.horizontal, 18)
            .padding(.vertical, 20)
            .padding(.bottom, 80)
        }
        .background(palette.background)
    }

    private var locationButton: some View {
        Button {
            appState.locationManager.toggleLocationSort()
        } label: {
            Text(locationLabel)
                .font(.system(size: 14, weight: .bold))
                .frame(maxWidth: .infinity)
                .padding(.vertical, 12)
                .foregroundStyle(appState.locationManager.sortByDistance ? .white : palette.primaryGreen)
                .background(
                    appState.locationManager.sortByDistance
                        ? AnyShapeStyle(DATheme.primaryGradient)
                        : AnyShapeStyle(palette.chipFill)
                )
                .overlay(
                    RoundedRectangle(cornerRadius: DATheme.radiusButton)
                        .stroke(palette.primaryGreen.opacity(0.4), lineWidth: appState.locationManager.sortByDistance ? 0 : 2)
                )
                .clipShape(RoundedRectangle(cornerRadius: DATheme.radiusButton))
        }
        .buttonStyle(.plain)
    }

    private var locationLabel: String {
        if appState.locationManager.isLocating {
            return "📍 Locating…"
        }
        if appState.locationManager.sortByDistance {
            return "📍 Showing nearby · sorted by distance"
        }
        return "📍 Use my location"
    }

    private var filterRow: some View {
        HStack(spacing: 8) {
            Menu {
                Button("All Cuisines") { appState.cuisineFilter = "All Cuisines" }
                ForEach(SeedData.cuisines, id: \.self) { cuisine in
                    Button(cuisine) { appState.cuisineFilter = cuisine }
                }
            } label: {
                filterChip("🍴 \(appState.cuisineFilter)")
            }

            Menu {
                ForEach(PriceFilter.allCases) { filter in
                    Button(filter.rawValue) { appState.priceFilter = filter }
                }
            } label: {
                filterChip("💰 \(appState.priceFilter.rawValue)")
            }

            if appState.cuisineFilter != "All Cuisines" || appState.priceFilter != .all {
                Button("✕ Clear") {
                    appState.clearFilters()
                }
                .font(.system(size: 12, weight: .bold))
                .foregroundStyle(palette.primaryGreen)
            }
        }
    }

    private func filterChip(_ title: String) -> some View {
        Text(title)
            .font(.system(size: 12, weight: .bold))
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(palette.chipFill)
            .clipShape(Capsule())
            .overlay(Capsule().stroke(palette.inputBorder, lineWidth: 1))
    }

    private var emptyState: some View {
        VStack(spacing: 8) {
            Text("🔍").font(.system(size: 44))
            Text("No restaurants found")
                .font(.system(size: 16, weight: .black))
            Text("Try a different search or filter")
                .font(.system(size: 13, weight: .semibold))
                .foregroundStyle(palette.textSecondary)
        }
        .frame(maxWidth: .infinity)
        .padding(24)
        .overlay(
            RoundedRectangle(cornerRadius: DATheme.radiusCard)
                .stroke(palette.borderSoft, lineWidth: 2)
        )
    }

    private func restaurantCard(_ restaurant: Restaurant) -> some View {
        HStack(spacing: 12) {
            Button {
                appState.navigationPath.append(NavigationDestination.detail(restaurant.id))
            } label: {
                RoundedRectangle(cornerRadius: DATheme.radiusThumb)
                    .fill(
                        LinearGradient(
                            colors: [palette.greenTint, palette.primaryGreen.opacity(0.5)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 76, height: 76)
                    .overlay(Text(restaurant.emoji).font(.largeTitle))
            }
            .buttonStyle(.plain)

            VStack(alignment: .leading, spacing: 6) {
                Text(restaurant.name)
                    .font(.system(size: 15, weight: .heavy))
                    .foregroundStyle(palette.textPrimary)
                    .lineLimit(1)

                Text(subtitle(for: restaurant))
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundStyle(palette.textSecondary)
                    .lineLimit(1)

                HStack {
                    Text("⭐ \(restaurant.rating, specifier: "%.1f")")
                        .font(.system(size: 11, weight: .heavy))
                        .foregroundStyle(palette.accentGoldDark)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(palette.accentGold.opacity(0.2))
                        .clipShape(Capsule())

                    Spacer()

                    Button("Log Visit") {
                        appState.openLogVisit(for: restaurant)
                    }
                    .font(.system(size: 12, weight: .bold))
                    .foregroundStyle(.white)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 8)
                    .background(DATheme.primaryGradient)
                    .clipShape(RoundedRectangle(cornerRadius: 12))

                    Button {
                        appState.toggleWishlist(restaurant.id)
                    } label: {
                        Image(systemName: appState.isWishlisted(restaurant.id) ? "star.fill" : "star")
                            .foregroundStyle(appState.isWishlisted(restaurant.id) ? .white : palette.accentGold)
                            .frame(width: 36, height: 36)
                            .background(
                                appState.isWishlisted(restaurant.id)
                                    ? AnyShapeStyle(palette.accentGold)
                                    : AnyShapeStyle(palette.chipFill)
                            )
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                            .overlay(
                                RoundedRectangle(cornerRadius: 12)
                                    .stroke(palette.accentGold, lineWidth: appState.isWishlisted(restaurant.id) ? 0 : 2)
                            )
                    }
                    .buttonStyle(.plain)
                }
            }
        }
        .padding(12)
        .background(palette.cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: DATheme.radiusCard))
        .overlay(RoundedRectangle(cornerRadius: DATheme.radiusCard).stroke(palette.borderSoft, lineWidth: 2))
    }

    private func subtitle(for restaurant: Restaurant) -> String {
        var line = restaurant.cuisineLine
        if appState.locationManager.sortByDistance {
            line += String(format: " · %.1f km away", restaurant.distanceKm)
        }
        return line
    }
}

#Preview {
    NearbyView()
        .environment(AppState())
}

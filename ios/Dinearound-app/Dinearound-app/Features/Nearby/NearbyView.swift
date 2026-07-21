import SwiftUI

struct NearbyView: View {
    @Environment(AppState.self) private var appState
    @Environment(\.daPalette) private var palette

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                VStack(alignment: .leading, spacing: 6) {
                    SectionTitle(prefix: "Discover ", accent: "Restaurants", accentStyle: .coral)

                    Text("Find and explore amazing dining experiences near you")
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundStyle(palette.textSecondary)
                }

                HStack {
                    Image(systemName: "magnifyingglass")
                        .foregroundStyle(palette.textSecondary)
                    TextField("Search for restaurants...", text: Bindable(appState).searchQuery)
                        .foregroundStyle(palette.textPrimary)
                    if appState.hasActiveSearch {
                        Button {
                            appState.clearSearch()
                        } label: {
                            Image(systemName: "xmark.circle.fill")
                                .foregroundStyle(palette.textSecondary)
                        }
                        .buttonStyle(.plain)
                    }
                }
                .padding(14)
                .background(palette.cardBackground)
                .clipShape(RoundedRectangle(cornerRadius: DATheme.radiusButton))
                .overlay(
                    RoundedRectangle(cornerRadius: DATheme.radiusButton)
                        .stroke(palette.inputBorder, lineWidth: 2)
                )

                locationButton

                demoDataBanner

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
            .padding(.bottom, 110)
        }
        .background(palette.background)
    }

    private var locationButton: some View {
        Button {
            appState.locationManager.toggleLocationSort()
        } label: {
            HStack(spacing: 8) {
                if appState.locationManager.isLocating {
                    ProgressView().controlSize(.small).tint(.white)
                } else {
                    Image(systemName: "location.fill")
                        .font(.system(size: 13, weight: .semibold))
                }
                Text(locationLabel)
                    .font(.system(size: 14, weight: .bold))
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 12)
            .foregroundStyle(appState.locationManager.sortByDistance ? .white : palette.primaryGreen)
            .background(
                appState.locationManager.sortByDistance
                    ? AnyShapeStyle(DATheme.greenGradient)
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
            return "Locating…"
        }
        if appState.locationManager.sortByDistance {
            return "Showing nearby · sorted by distance"
        }
        return "Use my location"
    }

    private var filterRow: some View {
        HStack(spacing: 8) {
            Menu {
                Button("All Cuisines") { appState.cuisineFilter = "All Cuisines" }
                ForEach(SeedData.cuisines, id: \.self) { cuisine in
                    Button(cuisine) { appState.cuisineFilter = cuisine }
                }
            } label: {
                filterChip(appState.cuisineFilter, icon: "fork.knife")
            }

            Menu {
                ForEach(PriceFilter.allCases) { filter in
                    Button(filter.rawValue) { appState.priceFilter = filter }
                }
            } label: {
                filterChip(appState.priceFilter.rawValue, icon: "dollarsign.circle")
            }

            if appState.cuisineFilter != "All Cuisines" || appState.priceFilter != .all {
                Button {
                    appState.clearFilters()
                } label: {
                    HStack(spacing: 4) {
                        Image(systemName: "xmark").font(.system(size: 10, weight: .bold))
                        Text("Clear")
                    }
                    .font(.system(size: 12, weight: .bold))
                    .foregroundStyle(palette.accentCoral)
                }
                .buttonStyle(.plain)
            }
        }
    }

    private func filterChip(_ title: String, icon: String) -> some View {
        HStack(spacing: 5) {
            Image(systemName: icon).font(.system(size: 10, weight: .bold))
            Text(title)
        }
        .font(.system(size: 12, weight: .bold))
        .foregroundStyle(palette.textPrimary)
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
        .background(palette.chipFill)
        .clipShape(Capsule())
        .overlay(Capsule().stroke(palette.inputBorder, lineWidth: 1))
    }

    private var demoDataBanner: some View {
        HStack(alignment: .top, spacing: 8) {
            Image(systemName: "info.circle.fill")
                .font(.system(size: 13))
                .foregroundStyle(palette.accentCoral)
            Text("Demo catalog (9 sample spots). Real Lynnwood restaurants need Google Places — coming next. Clear search to see samples.")
                .font(.system(size: 12, weight: .semibold))
                .foregroundStyle(palette.textSecondary)
        }
        .padding(12)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(palette.chipFill)
        .clipShape(RoundedRectangle(cornerRadius: 14))
        .overlay(
            RoundedRectangle(cornerRadius: 14)
                .stroke(palette.borderSoft, lineWidth: 1)
        )
    }

    private var emptyState: some View {
        VStack(spacing: 12) {
            Image(systemName: "magnifyingglass")
                .font(.system(size: 40))
                .foregroundStyle(palette.textSecondary)
            if appState.hasActiveSearch {
                Text("No match for \"\(appState.searchQuery.trimmingCharacters(in: .whitespacesAndNewlines))\"")
                    .font(.system(size: 16, weight: .black))
                    .foregroundStyle(palette.textPrimary)
                    .multilineTextAlignment(.center)
                Text("This build uses sample restaurants only — not live maps data yet.")
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundStyle(palette.textSecondary)
                    .multilineTextAlignment(.center)
                Button("Clear search") {
                    appState.clearSearch()
                }
                .font(.system(size: 14, weight: .bold))
                .foregroundStyle(palette.accentCoral)
            } else {
                Text("No restaurants found")
                    .font(.system(size: 16, weight: .black))
                    .foregroundStyle(palette.textPrimary)
                Text("Try a different filter, or clear search")
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundStyle(palette.textSecondary)
            }
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
                    .fill(DATheme.heroGradient)
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
                    DATag(text: String(format: "%.1f", restaurant.rating), icon: "star.fill", style: .gold, filled: false)

                    Spacer()

                    Button {
                        appState.openLogVisit(for: restaurant)
                    } label: {
                        Text("Log Visit")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundStyle(.white)
                            .padding(.horizontal, 12)
                            .padding(.vertical, 8)
                            .background(DATheme.primaryGradient)
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                    }
                    .buttonStyle(.plain)

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
        .overlay(RoundedRectangle(cornerRadius: DATheme.radiusCard).stroke(palette.borderSoft, lineWidth: 1.5))
        .shadow(color: .black.opacity(0.18), radius: 14, y: 6)
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

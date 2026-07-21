import SwiftUI

struct WishlistView: View {
    @Environment(AppState.self) private var appState
    @Environment(\.daPalette) private var palette

    private var wishlistRestaurants: [Restaurant] {
        appState.restaurants.filter { appState.wishlistIds.contains($0.id) }
    }

    private var addCandidates: [Restaurant] {
        appState.restaurants.filter { !appState.wishlistIds.contains($0.id) }
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                HStack {
                    SectionTitle(prefix: "Wish", accent: "list", accentColor: palette.accentGold)
                    Spacer()
                    Button(appState.showWishlistAdd ? "Cancel" : "+ Add Restaurant") {
                        appState.showWishlistAdd.toggle()
                    }
                    .font(.system(size: 13, weight: .heavy))
                    .foregroundStyle(.white)
                    .padding(.horizontal, 14)
                    .padding(.vertical, 10)
                    .background(
                        LinearGradient(
                            colors: [palette.accentGold, palette.accentGoldDark],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )
                    .clipShape(RoundedRectangle(cornerRadius: DATheme.radiusButton))
                    .buttonStyle(.plain)
                }

                if appState.showWishlistAdd {
                    addPanel
                }

                if wishlistRestaurants.isEmpty {
                    VStack(spacing: 8) {
                        Text("⭐").font(.system(size: 44))
                        Text("Your wishlist is empty. Add restaurants you want to visit!")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundStyle(palette.textSecondary)
                            .multilineTextAlignment(.center)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 40)
                } else {
                    ForEach(wishlistRestaurants) { restaurant in
                        wishlistRow(restaurant)
                    }
                }
            }
            .padding(.horizontal, 18)
            .padding(.vertical, 20)
            .padding(.bottom, 80)
        }
        .background(palette.background)
    }

    private var addPanel: some View {
        DACard {
            VStack(spacing: 10) {
                if addCandidates.isEmpty {
                    Text("All restaurants are already on your wishlist.")
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundStyle(palette.textSecondary)
                } else {
                    ForEach(addCandidates) { restaurant in
                        HStack {
                            Text("\(restaurant.emoji) \(restaurant.name)")
                                .font(.system(size: 14, weight: .semibold))
                                .lineLimit(1)
                            Spacer()
                            Button {
                                appState.toggleWishlist(restaurant.id)
                            } label: {
                                Text("+")
                                    .font(.system(size: 18, weight: .black))
                                    .foregroundStyle(.white)
                                    .frame(width: 32, height: 32)
                                    .background(
                                        LinearGradient(
                                            colors: [palette.accentGold, palette.accentGoldDark],
                                            startPoint: .leading,
                                            endPoint: .trailing
                                        )
                                    )
                                    .clipShape(Circle())
                            }
                            .buttonStyle(.plain)
                        }
                    }
                }
            }
        }
    }

    private func wishlistRow(_ restaurant: Restaurant) -> some View {
        HStack(spacing: 12) {
            Button {
                appState.navigationPath.append(NavigationDestination.detail(restaurant.id))
            } label: {
                HStack(spacing: 12) {
                    RoundedRectangle(cornerRadius: DATheme.radiusThumb)
                        .fill(palette.chipFill)
                        .frame(width: 76, height: 76)
                        .overlay(Text(restaurant.emoji).font(.largeTitle))

                    VStack(alignment: .leading, spacing: 4) {
                        Text(restaurant.name)
                            .font(.system(size: 15, weight: .heavy))
                            .foregroundStyle(palette.textPrimary)
                        Text(restaurant.cuisineLine)
                            .font(.system(size: 11, weight: .semibold))
                            .foregroundStyle(palette.textSecondary)
                    }
                }
            }
            .buttonStyle(.plain)

            Spacer()

            Button {
                appState.toggleWishlist(restaurant.id)
            } label: {
                Text("×")
                    .font(.system(size: 20, weight: .bold))
                    .foregroundStyle(.white)
                    .frame(width: 32, height: 32)
                    .background(palette.destructive)
                    .clipShape(Circle())
            }
            .buttonStyle(.plain)
        }
        .padding(12)
        .background(palette.cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: DATheme.radiusCard))
        .overlay(RoundedRectangle(cornerRadius: DATheme.radiusCard).stroke(palette.borderSoft, lineWidth: 2))
    }
}

#Preview {
    WishlistView()
        .environment(AppState())
}

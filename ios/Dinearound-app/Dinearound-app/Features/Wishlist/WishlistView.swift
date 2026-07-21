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
                    SectionTitle(prefix: "Wish", accent: "list", accentStyle: .gold)
                    Spacer()
                    Button {
                        appState.showWishlistAdd.toggle()
                    } label: {
                        HStack(spacing: 6) {
                            Image(systemName: appState.showWishlistAdd ? "xmark" : "plus")
                                .font(.system(size: 11, weight: .bold))
                            Text(appState.showWishlistAdd ? "Cancel" : "Add Restaurant")
                        }
                        .font(.system(size: 13, weight: .heavy))
                        .foregroundStyle(.white)
                        .padding(.horizontal, 14)
                        .padding(.vertical, 10)
                        .background(DATheme.goldGradient)
                        .clipShape(RoundedRectangle(cornerRadius: DATheme.radiusButton))
                    }
                    .buttonStyle(.plain)
                }

                if appState.showWishlistAdd {
                    addPanel
                }

                if wishlistRestaurants.isEmpty {
                    VStack(spacing: 8) {
                        Image(systemName: "star")
                            .font(.system(size: 40))
                            .foregroundStyle(palette.accentGold)
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
            .padding(.bottom, 110)
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
                                .foregroundStyle(palette.textPrimary)
                                .lineLimit(1)
                            Spacer()
                            Button {
                                appState.toggleWishlist(restaurant.id)
                            } label: {
                                Image(systemName: "plus")
                                    .font(.system(size: 14, weight: .black))
                                    .foregroundStyle(.white)
                                    .frame(width: 32, height: 32)
                                    .background(DATheme.goldGradient)
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
                Image(systemName: "xmark")
                    .font(.system(size: 14, weight: .bold))
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
        .overlay(RoundedRectangle(cornerRadius: DATheme.radiusCard).stroke(palette.borderSoft, lineWidth: 1.5))
        .shadow(color: .black.opacity(0.18), radius: 14, y: 6)
    }
}

#Preview {
    WishlistView()
        .environment(AppState())
}

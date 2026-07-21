import PhotosUI
import SwiftData
import SwiftUI

struct RestaurantDetailView: View {
    @Environment(AppState.self) private var appState
    @Environment(\.daPalette) private var palette
    @Environment(\.dismiss) private var dismiss
    @Query private var menuItems: [StoredMenuItem]

    let restaurantId: String

    @State private var photoItems: [PhotosPickerItem] = []

    init(restaurantId: String) {
        self.restaurantId = restaurantId
        let rid = restaurantId
        _menuItems = Query(filter: #Predicate<StoredMenuItem> { $0.restaurantId == rid })
    }

    private var restaurant: Restaurant? {
        appState.restaurant(by: restaurantId)
    }

    var body: some View {
        ScrollView {
            if let restaurant {
                VStack(alignment: .leading, spacing: 16) {
                    Button("← Back") { dismiss() }
                        .font(.system(size: 14, weight: .heavy))
                        .foregroundStyle(palette.primaryGreen)
                        .buttonStyle(.plain)

                    ZStack {
                        RoundedRectangle(cornerRadius: 0)
                            .fill(
                                LinearGradient(
                                    colors: [palette.greenTint, palette.primaryGreen],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                )
                            )
                            .frame(height: 200)
                        Text(restaurant.emoji)
                            .font(.system(size: 72))
                    }
                    .clipShape(RoundedRectangle(cornerRadius: DATheme.radiusCard))

                    Text(restaurant.name)
                        .font(.system(size: 24, weight: .black))
                    Text("📍 \(restaurant.address) · \(restaurant.cuisine)")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundStyle(palette.textSecondary)

                    HStack(spacing: 8) {
                        Text("⭐ \(restaurant.rating, specifier: "%.1f")")
                            .font(.system(size: 12, weight: .heavy))
                            .foregroundStyle(.white)
                            .padding(.horizontal, 10)
                            .padding(.vertical, 6)
                            .background(DATheme.primaryGradient)
                            .clipShape(Capsule())
                        Text(restaurant.priceSymbols)
                            .font(.system(size: 12, weight: .heavy))
                            .foregroundStyle(palette.primaryGreenDark)
                            .padding(.horizontal, 10)
                            .padding(.vertical, 6)
                            .background(palette.greenTint.opacity(0.5))
                            .clipShape(Capsule())
                    }

                    HStack(spacing: 10) {
                        DAGradientButton(title: "Log Visit") {
                            appState.openLogVisit(for: restaurant)
                            dismiss()
                        }
                        DAOutlineButton(
                            title: appState.isWishlisted(restaurant.id) ? "★ In Wishlist" : "☆ Add to Wishlist",
                            gold: true
                        ) {
                            appState.toggleWishlist(restaurant.id)
                        }
                    }

                    Text("Food Photos")
                        .font(.system(size: 16, weight: .black))

                    LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 8), count: 3), spacing: 8) {
                        ForEach(0..<3, id: \.self) { index in
                            PhotosPicker(selection: $photoItems, maxSelectionCount: 3, matching: .images) {
                                RoundedRectangle(cornerRadius: 14)
                                    .fill(palette.chipFill)
                                    .aspectRatio(1, contentMode: .fit)
                                    .overlay(
                                        Text("Add a photo")
                                            .font(.system(size: 11, weight: .semibold))
                                            .foregroundStyle(palette.textSecondary)
                                    )
                            }
                            .buttonStyle(.plain)
                            .id(index)
                        }
                    }

                    Text("Menu")
                        .font(.system(size: 16, weight: .black))

                    Button {
                        appState.navigationPath.append(NavigationDestination.menuCapture(restaurantId))
                    } label: {
                        Text(menuItems.isEmpty ? "Capture Menu" : "Edit Menu")
                    }
                    .buttonStyle(.plain)
                    .font(.system(size: 14, weight: .bold))
                    .foregroundStyle(palette.accentGoldDark)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                    .overlay(
                        RoundedRectangle(cornerRadius: DATheme.radiusButton)
                            .stroke(palette.accentGold, lineWidth: 2)
                    )

                    if menuItems.isEmpty {
                        Text("No menu captured yet.")
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundStyle(palette.textSecondary)
                    } else {
                        ForEach(menuItems) { item in
                            HStack {
                                VStack(alignment: .leading, spacing: 2) {
                                    Text(item.category.uppercased())
                                        .font(.system(size: 10, weight: .heavy))
                                        .foregroundStyle(palette.textSecondary)
                                    Text(item.name)
                                        .font(.system(size: 14, weight: .bold))
                                }
                                Spacer()
                                Text("$\(item.price)")
                                    .font(.system(size: 14, weight: .heavy))
                                    .foregroundStyle(palette.primaryGreen)
                            }
                            .padding(12)
                            .background(palette.chipFill)
                            .clipShape(RoundedRectangle(cornerRadius: 14))
                        }
                    }
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 80)
            }
        }
        .background(palette.background)
        .navigationBarHidden(true)
    }
}

import PhotosUI
import SwiftData
import SwiftUI

struct RestaurantDetailView: View {
    @Environment(AppState.self) private var appState
    @Environment(\.daPalette) private var palette
    @Environment(\.modelContext) private var modelContext
    @Environment(\.dismiss) private var dismiss
    @Query private var menuItems: [StoredMenuItem]
    @Query private var foodPhotos: [RestaurantMedia]
    @Query private var menuPDFs: [RestaurantMedia]

    let restaurantId: String

    @State private var foodPickerItems: [PhotosPickerItem] = []
    @State private var showPDFPreview = false
    @State private var previewPDFURL: URL?

    init(restaurantId: String) {
        self.restaurantId = restaurantId
        let rid = restaurantId
        _menuItems = Query(filter: #Predicate<StoredMenuItem> { $0.restaurantId == rid })
        _foodPhotos = Query(filter: #Predicate<RestaurantMedia> {
            $0.restaurantId == rid && $0.kind == "foodPhoto"
        })
        _menuPDFs = Query(filter: #Predicate<RestaurantMedia> {
            $0.restaurantId == rid && $0.kind == "menuPDF"
        })
    }

    private var restaurant: Restaurant? {
        appState.restaurant(by: restaurantId)
    }

    private var savedFoodImages: [UIImage] {
        foodPhotos
            .sorted { $0.createdAt > $1.createdAt }
            .compactMap { MediaStorage.loadImage(restaurantId: restaurantId, fileName: $0.fileName) }
    }

    var body: some View {
        ScrollView {
            if let restaurant {
                VStack(alignment: .leading, spacing: 16) {
                    Button {
                        dismiss()
                    } label: {
                        HStack(spacing: 6) {
                            Image(systemName: "chevron.left").font(.system(size: 13, weight: .bold))
                            Text("Back")
                        }
                        .font(.system(size: 14, weight: .heavy))
                        .foregroundStyle(palette.accentCoral)
                    }
                    .buttonStyle(.plain)

                    hero(for: restaurant)
                    headerInfo(for: restaurant)
                    actionRow(for: restaurant)

                    FoodPhotoAttachmentSection(
                        pickerItems: $foodPickerItems,
                        existingImages: savedFoodImages,
                        onRemoveExisting: removeFoodPhoto
                    )
                    .onChange(of: foodPickerItems) { _, items in
                        Task { await importFoodPhotos(items) }
                    }

                    menuSection
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 110)
            }
        }
        .background(palette.background)
        .navigationBarHidden(true)
        .sheet(isPresented: $showPDFPreview) {
            if let previewPDFURL {
                PDFPreviewSheet(url: previewPDFURL)
            }
        }
    }

    @ViewBuilder
    private func hero(for restaurant: Restaurant) -> some View {
        ZStack {
            RoundedRectangle(cornerRadius: 0)
                .fill(DATheme.heroGradient)
                .frame(height: 200)
            Text(restaurant.emoji)
                .font(.system(size: 72))
        }
        .clipShape(RoundedRectangle(cornerRadius: DATheme.radiusCard))
        .shadow(color: .black.opacity(0.25), radius: 20, y: 10)
    }

    @ViewBuilder
    private func headerInfo(for restaurant: Restaurant) -> some View {
        Text(restaurant.name)
            .font(.system(size: 24, weight: .black))
            .foregroundStyle(palette.textPrimary)
        HStack(spacing: 5) {
            Image(systemName: "mappin.and.ellipse").font(.system(size: 12))
            Text("\(restaurant.address) · \(restaurant.cuisine)")
        }
        .font(.system(size: 14, weight: .semibold))
        .foregroundStyle(palette.textSecondary)

        HStack(spacing: 8) {
            DATag(text: String(format: "%.1f", restaurant.rating), icon: "star.fill", style: .gold, filled: true)
            DATag(text: restaurant.priceSymbols, style: .green, filled: false)
        }
    }

    @ViewBuilder
    private func actionRow(for restaurant: Restaurant) -> some View {
        HStack(spacing: 10) {
            DAGradientButton(title: "Log Visit", style: .coral, icon: "square.and.pencil") {
                appState.openLogVisit(for: restaurant)
                dismiss()
            }
            DAOutlineButton(
                title: appState.isWishlisted(restaurant.id) ? "In Wishlist" : "Add to Wishlist",
                style: .gold,
                icon: appState.isWishlisted(restaurant.id) ? "star.fill" : "star"
            ) {
                appState.toggleWishlist(restaurant.id)
            }
        }
    }

    @ViewBuilder
    private var menuSection: some View {
        Text("Menu")
            .font(.system(size: 16, weight: .black))
            .foregroundStyle(palette.textPrimary)

        Button {
            appState.navigationPath.append(NavigationDestination.menuCapture(restaurantId))
        } label: {
            HStack(spacing: 6) {
                Image(systemName: "doc.viewfinder").font(.system(size: 13, weight: .bold))
                Text(menuItems.isEmpty && menuPDFs.isEmpty ? "Capture Menu" : "Edit Menu")
            }
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

        if let latestPDF = menuPDFs.sorted(by: { $0.createdAt > $1.createdAt }).first {
            Button {
                previewPDFURL = MediaStorage.fileURL(restaurantId: restaurantId, fileName: latestPDF.fileName)
                showPDFPreview = true
            } label: {
                HStack(spacing: 6) {
                    Image(systemName: "doc.richtext").font(.system(size: 12, weight: .bold))
                    Text("View menu PDF")
                }
            }
            .font(.system(size: 13, weight: .bold))
            .foregroundStyle(palette.accentCoral)
        }

        if menuItems.isEmpty {
            Text("No menu items captured yet.")
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
                            .foregroundStyle(palette.textPrimary)
                    }
                    Spacer()
                    Text("$\(item.price)")
                        .font(.system(size: 14, weight: .heavy))
                        .foregroundStyle(palette.accentCoral)
                }
                .padding(12)
                .background(palette.chipFill)
                .clipShape(RoundedRectangle(cornerRadius: 14))
            }
        }
    }

    private func importFoodPhotos(_ items: [PhotosPickerItem]) async {
        for item in items {
            guard let data = try? await item.loadTransferable(type: Data.self),
                  let image = UIImage(data: data),
                  let fileName = try? MediaStorage.saveImage(image, restaurantId: restaurantId, prefix: "food") else { continue }
            modelContext.insert(
                RestaurantMedia(restaurantId: restaurantId, kind: .foodPhoto, fileName: fileName)
            )
        }
        foodPickerItems = []
        appState.showToast("Food photos saved")
    }

    private func removeFoodPhoto(at index: Int) {
        let sorted = foodPhotos.sorted { $0.createdAt > $1.createdAt }
        guard sorted.indices.contains(index) else { return }
        let media = sorted[index]
        MediaStorage.deleteFile(restaurantId: restaurantId, fileName: media.fileName)
        modelContext.delete(media)
    }
}

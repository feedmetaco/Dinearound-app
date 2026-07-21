import PhotosUI
import SwiftData
import SwiftUI

struct MenuCaptureView: View {
    @Environment(AppState.self) private var appState
    @Environment(\.daPalette) private var palette
    @Environment(\.modelContext) private var modelContext
    @Environment(\.dismiss) private var dismiss
    @Query private var menuItems: [StoredMenuItem]
    @Query private var menuPDFs: [RestaurantMedia]

    let restaurantId: String

    @State private var draftItems: [EditableMenuItem] = []
    @State private var selectedPhoto: PhotosPickerItem?
    @State private var menuPreview: UIImage?
    @State private var showShareSheet = false
    @State private var showPDFPreview = false
    @State private var pdfURL: URL?

    struct EditableMenuItem: Identifiable {
        let id = UUID()
        var category: String
        var name: String
        var price: String
    }

    init(restaurantId: String) {
        self.restaurantId = restaurantId
        let rid = restaurantId
        _menuItems = Query(filter: #Predicate<StoredMenuItem> { $0.restaurantId == rid })
        _menuPDFs = Query(filter: #Predicate<RestaurantMedia> {
            $0.restaurantId == rid && $0.kind == "menuPDF"
        })
    }

    private var restaurant: Restaurant? {
        appState.restaurant(by: restaurantId)
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                Button {
                    dismiss()
                } label: {
                    HStack(spacing: 6) {
                        Image(systemName: "chevron.left").font(.system(size: 13, weight: .bold))
                        Text("Back")
                    }
                }
                .font(.system(size: 14, weight: .heavy))
                .foregroundStyle(palette.accentCoral)
                .buttonStyle(.plain)

                Text("Capture Menu")
                    .font(.system(size: 20, weight: .black))
                    .foregroundStyle(palette.textPrimary)
                if let restaurant {
                    Text(restaurant.name)
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundStyle(palette.textSecondary)
                }

                PhotosPicker(selection: $selectedPhoto, matching: .images) {
                    Group {
                        if let menuPreview {
                            Image(uiImage: menuPreview)
                                .resizable()
                                .scaledToFill()
                        } else {
                            Text("Drop a photo of the menu")
                                .font(.system(size: 14, weight: .semibold))
                                .foregroundStyle(palette.textSecondary)
                        }
                    }
                    .frame(maxWidth: .infinity)
                    .frame(height: 150)
                    .background(palette.chipFill)
                    .clipShape(RoundedRectangle(cornerRadius: 20))
                }
                .buttonStyle(.plain)
                .onChange(of: selectedPhoto) { _, newItem in
                    Task {
                        guard let newItem,
                              let data = try? await newItem.loadTransferable(type: Data.self),
                              let image = UIImage(data: data) else { return }
                        menuPreview = image
                    }
                }

                DAGradientButton(title: "Digitize Menu", style: .green, icon: "sparkles") {
                    digitizeMenu()
                }

                ForEach($draftItems) { $item in
                    HStack(spacing: 8) {
                        TextField("Cat", text: $item.category)
                            .foregroundStyle(palette.textPrimary)
                            .frame(width: 70)
                        TextField("Dish", text: $item.name)
                            .foregroundStyle(palette.textPrimary)
                        TextField("$", text: $item.price)
                            .foregroundStyle(palette.textPrimary)
                            .frame(width: 44)
                        Button {
                            draftItems.removeAll { $0.id == item.id }
                        } label: {
                            Image(systemName: "xmark.circle.fill")
                                .foregroundStyle(palette.destructive)
                                .font(.system(size: 16, weight: .bold))
                        }
                        .buttonStyle(.plain)
                    }
                    .padding(10)
                    .background(palette.chipFill)
                    .clipShape(RoundedRectangle(cornerRadius: 14))
                }

                Button {
                    draftItems.append(EditableMenuItem(category: "Mains", name: "", price: ""))
                } label: {
                    HStack(spacing: 6) {
                        Image(systemName: "plus").font(.system(size: 12, weight: .bold))
                        Text("Add dish")
                    }
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundStyle(palette.textSecondary)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                    .overlay(
                        RoundedRectangle(cornerRadius: DATheme.radiusButton)
                            .stroke(style: StrokeStyle(lineWidth: 2, dash: [6]))
                            .foregroundStyle(palette.inputBorder)
                    )
                }
                .buttonStyle(.plain)

                if !draftItems.isEmpty || menuPreview != nil {
                    DAGradientButton(title: "Save PDF to restaurant", style: .coral, icon: "printer") {
                        saveAndAttachPDF(shareAfterSave: false)
                    }
                    if !menuPDFs.isEmpty {
                        Button {
                            openSavedPDF()
                        } label: {
                            HStack(spacing: 6) {
                                Image(systemName: "doc.richtext").font(.system(size: 12, weight: .bold))
                                Text("View saved menu PDF")
                            }
                        }
                        .font(.system(size: 14, weight: .bold))
                        .foregroundStyle(palette.accentCoral)
                    }
                }
            }
            .padding(.horizontal, 20)
            .padding(.bottom, 110)
        }
        .background(palette.background)
        .navigationBarHidden(true)
        .onAppear { loadExistingItems() }
        .sheet(isPresented: $showShareSheet) {
            if let pdfURL { ShareSheet(items: [pdfURL]) }
        }
        .sheet(isPresented: $showPDFPreview) {
            if let pdfURL { PDFPreviewSheet(url: pdfURL) }
        }
    }

    private func loadExistingItems() {
        if draftItems.isEmpty {
            draftItems = menuItems.map {
                EditableMenuItem(category: $0.category, name: $0.name, price: $0.price)
            }
        }
    }

    private func digitizeMenu() {
        let seed = SeedData.menuSeed(for: restaurantId)
        draftItems = seed.map {
            EditableMenuItem(category: $0.category, name: $0.name, price: $0.price)
        }
        appState.showToast("Menu digitized")
    }

    private func saveAndAttachPDF(shareAfterSave: Bool) {
        for existing in menuItems { modelContext.delete(existing) }
        for item in draftItems where !item.name.trimmingCharacters(in: .whitespaces).isEmpty {
            modelContext.insert(
                StoredMenuItem(
                    restaurantId: restaurantId,
                    category: item.category,
                    name: item.name,
                    price: item.price
                )
            )
        }

        let lines = draftItems.map {
            MenuPDFExporter.MenuLine(category: $0.category, name: $0.name, price: $0.price)
        }
        guard let restaurant,
              let pdfData = MenuPDFExporter.makePDF(
                restaurantName: restaurant.name,
                items: lines,
                menuImage: menuPreview
              ) else { return }

        for old in menuPDFs {
            MediaStorage.deleteFile(restaurantId: restaurantId, fileName: old.fileName)
            modelContext.delete(old)
        }

        if let menuPreview,
           let photoName = try? MediaStorage.saveImage(menuPreview, restaurantId: restaurantId, prefix: "menu-photo") {
            modelContext.insert(
                RestaurantMedia(restaurantId: restaurantId, kind: .menuPhoto, fileName: photoName)
            )
        }

        if let pdfName = try? MediaStorage.savePDF(pdfData, restaurantId: restaurantId) {
            modelContext.insert(
                RestaurantMedia(restaurantId: restaurantId, kind: .menuPDF, fileName: pdfName)
            )
            pdfURL = MediaStorage.fileURL(restaurantId: restaurantId, fileName: pdfName)
        }

        appState.showToast("Menu PDF saved to restaurant")
        if shareAfterSave { showShareSheet = true }
    }

    private func openSavedPDF() {
        guard let latest = menuPDFs.sorted(by: { $0.createdAt > $1.createdAt }).first else { return }
        pdfURL = MediaStorage.fileURL(restaurantId: restaurantId, fileName: latest.fileName)
        showPDFPreview = true
    }
}

struct ShareSheet: UIViewControllerRepresentable {
    let items: [Any]

    func makeUIViewController(context: Context) -> UIActivityViewController {
        UIActivityViewController(activityItems: items, applicationActivities: nil)
    }

    func updateUIViewController(_ uiViewController: UIActivityViewController, context: Context) {}
}

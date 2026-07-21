import PDFKit
import PhotosUI
import SwiftData
import SwiftUI

struct MenuCaptureView: View {
    @Environment(AppState.self) private var appState
    @Environment(\.daPalette) private var palette
    @Environment(\.modelContext) private var modelContext
    @Environment(\.dismiss) private var dismiss
    @Query private var menuItems: [StoredMenuItem]

    let restaurantId: String

    @State private var draftItems: [EditableMenuItem] = []
    @State private var selectedPhoto: PhotosPickerItem?
    @State private var showShareSheet = false
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
    }

    private var restaurant: Restaurant? {
        appState.restaurant(by: restaurantId)
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                Button("← Back") { dismiss() }
                    .font(.system(size: 14, weight: .heavy))
                    .foregroundStyle(palette.primaryGreen)
                    .buttonStyle(.plain)

                Text("Capture Menu")
                    .font(.system(size: 20, weight: .black))
                if let restaurant {
                    Text(restaurant.name)
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundStyle(palette.textSecondary)
                }

                PhotosPicker(selection: $selectedPhoto, matching: .images) {
                    RoundedRectangle(cornerRadius: 20)
                        .fill(palette.chipFill)
                        .frame(height: 150)
                        .overlay(
                            Text("Drop a photo of the menu")
                                .font(.system(size: 14, weight: .semibold))
                                .foregroundStyle(palette.textSecondary)
                        )
                }
                .buttonStyle(.plain)

                Button {
                    digitizeMenu()
                } label: {
                    Text("✨ Digitize Menu")
                        .font(.system(size: 15, weight: .bold))
                        .foregroundStyle(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                        .background(
                            LinearGradient(
                                colors: [Color(hex: 0x3FAE68), Color(hex: 0x2E8A4F)],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .clipShape(RoundedRectangle(cornerRadius: DATheme.radiusButton))
                }
                .buttonStyle(.plain)

                ForEach($draftItems) { $item in
                    HStack(spacing: 8) {
                        TextField("Cat", text: $item.category)
                            .frame(width: 70)
                        TextField("Dish", text: $item.name)
                        TextField("$", text: $item.price)
                            .frame(width: 44)
                        Button {
                            draftItems.removeAll { $0.id == item.id }
                        } label: {
                            Text("×")
                                .foregroundStyle(palette.destructive)
                                .font(.system(size: 18, weight: .bold))
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
                    Text("+ Add dish")
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

                if !draftItems.isEmpty {
                    DAGradientButton(title: "🖨️ Export Menu as PDF") {
                        saveAndExportPDF()
                    }
                }
            }
            .padding(.horizontal, 20)
            .padding(.bottom, 80)
        }
        .background(palette.background)
        .navigationBarHidden(true)
        .onAppear {
            loadExistingItems()
        }
        .sheet(isPresented: $showShareSheet) {
            if let pdfURL {
                ShareSheet(items: [pdfURL])
            }
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

    private func saveAndExportPDF() {
        for existing in menuItems {
            modelContext.delete(existing)
        }
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

        guard let restaurant else { return }
        pdfURL = MenuPDFExporter.makePDF(restaurantName: restaurant.name, items: draftItems)
        showShareSheet = true
    }
}

enum MenuPDFExporter {
    static func makePDF(restaurantName: String, items: [MenuCaptureView.EditableMenuItem]) -> URL? {
        let pdfMeta = [kCGPDFContextCreator: "DineAround"]
        let format = UIGraphicsPDFRendererFormat()
        format.documentInfo = pdfMeta as [String: Any]

        let pageRect = CGRect(x: 0, y: 0, width: 612, height: 792)
        let renderer = UIGraphicsPDFRenderer(bounds: pageRect, format: format)
        let data = renderer.pdfData { context in
            context.beginPage()
            let title = "\(restaurantName)\nMenu"
            title.draw(at: CGPoint(x: 40, y: 40), withAttributes: [
                .font: UIFont.boldSystemFont(ofSize: 22)
            ])
            var y: CGFloat = 100
            for item in items {
                let line = "\(item.category) — \(item.name)  $\(item.price)"
                line.draw(at: CGPoint(x: 40, y: y), withAttributes: [
                    .font: UIFont.systemFont(ofSize: 14)
                ])
                y += 24
            }
        }

        let url = FileManager.default.temporaryDirectory.appendingPathComponent("menu-\(UUID().uuidString).pdf")
        try? data.write(to: url)
        return url
    }
}

struct ShareSheet: UIViewControllerRepresentable {
    let items: [Any]

    func makeUIViewController(context: Context) -> UIActivityViewController {
        UIActivityViewController(activityItems: items, applicationActivities: nil)
    }

    func updateUIViewController(_ uiViewController: UIActivityViewController, context: Context) {}
}

import PhotosUI
import SwiftData
import SwiftUI

struct LogView: View {
    @Environment(AppState.self) private var appState
    @Environment(\.daPalette) private var palette
    @Environment(\.modelContext) private var modelContext
    @Query(sort: \VisitRecord.visitDate, order: .reverse) private var visits: [VisitRecord]

    @State private var foodPickerItems: [PhotosPickerItem] = []
    @State private var menuPhotoItem: PhotosPickerItem?
    @State private var showPDFPreview = false
    @State private var previewPDFURL: URL?

    private var draftRestaurantId: String {
        MediaStorage.resolveRestaurantId(
            name: appState.visitDraft.restaurantName,
            explicitId: appState.visitDraft.restaurantId
        )
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                HStack {
                    SectionTitle(prefix: "Visit ", accent: "Log", accentStyle: .coral)
                    Spacer()
                    Button {
                        if appState.showLogForm {
                            appState.showLogForm = false
                            appState.visitDraft = VisitDraft()
                        } else {
                            appState.visitDraft = VisitDraft()
                            appState.showLogForm = true
                        }
                    } label: {
                        HStack(spacing: 6) {
                            Image(systemName: appState.showLogForm ? "xmark" : "plus")
                                .font(.system(size: 11, weight: .bold))
                            Text(appState.showLogForm ? "Cancel" : "Log Visit")
                        }
                        .font(.system(size: 13, weight: .heavy))
                        .foregroundStyle(.white)
                        .padding(.horizontal, 14)
                        .padding(.vertical, 10)
                        .background(DATheme.primaryGradient)
                        .clipShape(RoundedRectangle(cornerRadius: DATheme.radiusButton))
                    }
                    .buttonStyle(.plain)
                }

                if appState.showLogForm {
                    logForm
                }

                if visits.isEmpty && !appState.showLogForm {
                    VStack(spacing: 8) {
                        Image(systemName: "book.closed")
                            .font(.system(size: 40))
                            .foregroundStyle(palette.textSecondary)
                        Text("You haven't logged any visits yet.")
                            .font(.system(size: 15, weight: .heavy))
                            .foregroundStyle(palette.textSecondary)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 40)
                } else {
                    ForEach(visits) { visit in
                        visitCard(visit)
                    }
                }
            }
            .padding(.horizontal, 18)
            .padding(.vertical, 20)
            .padding(.bottom, 110)
        }
        .background(palette.background)
        .sheet(isPresented: $showPDFPreview) {
            if let previewPDFURL {
                PDFPreviewSheet(url: previewPDFURL)
            }
        }
    }

    private var logForm: some View {
        DACard {
            VStack(alignment: .leading, spacing: 14) {
                labeledField("Restaurant Name *") {
                    TextField("Restaurant", text: Bindable(appState).visitDraft.restaurantName)
                        .foregroundStyle(palette.textPrimary)
                        .padding(12)
                        .background(palette.chipFill)
                        .clipShape(RoundedRectangle(cornerRadius: DATheme.radiusInput))
                        .overlay(RoundedRectangle(cornerRadius: DATheme.radiusInput).stroke(palette.inputBorder, lineWidth: 2))
                }

                labeledField("Visit Date *") {
                    DatePicker("", selection: Bindable(appState).visitDraft.visitDate, displayedComponents: .date)
                        .labelsHidden()
                }

                labeledField("Rating") {
                    StarRatingPicker(rating: Bindable(appState).visitDraft.rating)
                }

                labeledField("Notes") {
                    TextField("What did you think?", text: Bindable(appState).visitDraft.notes, axis: .vertical)
                        .foregroundStyle(palette.textPrimary)
                        .lineLimit(3...6)
                        .padding(12)
                        .background(palette.chipFill)
                        .clipShape(RoundedRectangle(cornerRadius: DATheme.radiusInput))
                        .overlay(RoundedRectangle(cornerRadius: DATheme.radiusInput).stroke(palette.inputBorder, lineWidth: 2))
                }

                FoodPhotoAttachmentSection(
                    pickerItems: $foodPickerItems,
                    existingImages: []
                )

                MenuPDFAttachmentSection(
                    menuPhotoItem: $menuPhotoItem,
                    hasSavedPDF: hasMenuPDF(for: draftRestaurantId),
                    onSavePDF: { image in
                        saveMenuPDF(image: image, restaurantId: draftRestaurantId)
                    },
                    onViewPDF: {
                        openMenuPDF(restaurantId: draftRestaurantId)
                    }
                )

                HStack(spacing: 10) {
                    DAGradientButton(title: appState.visitDraft.editingVisitId == nil ? "Save Visit" : "Update Visit", style: .coral) {
                        saveVisit()
                    }
                    DAOutlineButton(title: "Cancel", style: .coral) {
                        appState.showLogForm = false
                        appState.visitDraft = VisitDraft()
                        foodPickerItems = []
                        menuPhotoItem = nil
                    }
                }
            }
        }
    }

    private func labeledField<Content: View>(_ title: String, @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(title)
                .font(.system(size: 13, weight: .bold))
                .foregroundStyle(palette.textPrimary)
            content()
        }
    }

    private func visitCard(_ visit: VisitRecord) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(visit.restaurantName)
                        .font(.system(size: 16, weight: .black))
                        .foregroundStyle(palette.textPrimary)
                    Text(visit.visitDate.formatted(date: .abbreviated, time: .omitted))
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundStyle(palette.textSecondary)
                }
                Spacer()
                HStack(spacing: 10) {
                    ShareLink(item: appState.shareText(for: visit)) {
                        Image(systemName: "square.and.arrow.up")
                    }
                    Button {
                        appState.visitDraft = VisitDraft(
                            restaurantName: visit.restaurantName,
                            restaurantId: visit.restaurantId,
                            visitDate: visit.visitDate,
                            rating: visit.rating,
                            notes: visit.notes,
                            editingVisitId: visit.id
                        )
                        appState.showLogForm = true
                    } label: {
                        Image(systemName: "pencil")
                    }
                    Button {
                        Task { await SyncService.deleteVisitRemote(visit) }
                        modelContext.delete(visit)
                    } label: {
                        Image(systemName: "trash")
                    }
                }
                .font(.system(size: 14, weight: .semibold))
                .foregroundStyle(palette.textSecondary)
                .buttonStyle(.plain)
            }

            if visit.rating > 0 {
                HStack(spacing: 3) {
                    ForEach(0..<visit.rating, id: \.self) { _ in
                        Image(systemName: "star.fill").font(.system(size: 10))
                    }
                    Text("\(visit.rating)/5")
                        .font(.system(size: 12, weight: .bold))
                }
                .foregroundStyle(.white)
                .padding(.horizontal, 10)
                .padding(.vertical, 6)
                .background(DATheme.primaryGradient)
                .clipShape(Capsule())
            }

            if !visit.notes.isEmpty {
                Text(visit.notes)
                    .font(.system(size: 13, weight: .medium))
                    .foregroundStyle(palette.textPrimary)
            }

            visitPhotoStrip(for: visit)
        }
        .padding(16)
        .background(palette.cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: DATheme.radiusCard))
        .overlay(RoundedRectangle(cornerRadius: DATheme.radiusCard).stroke(palette.borderSoft, lineWidth: 1.5))
        .shadow(color: .black.opacity(0.18), radius: 14, y: 6)
    }

    private func saveVisit() {
        let name = appState.visitDraft.restaurantName.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !name.isEmpty else { return }

        let restaurantId = draftRestaurantId
        var visitId: UUID

        if let editId = appState.visitDraft.editingVisitId,
           let existing = visits.first(where: { $0.id == editId }) {
            existing.restaurantName = name
            existing.restaurantId = restaurantId
            existing.visitDate = appState.visitDraft.visitDate
            existing.rating = appState.visitDraft.rating
            existing.notes = appState.visitDraft.notes
            visitId = existing.id
            Task {
                await SyncService.pushVisit(existing, isNew: false)
                await attachFoodPhotos(to: restaurantId, visitId: visitId)
            }
        } else {
            let record = VisitRecord(
                restaurantName: name,
                restaurantId: restaurantId,
                visitDate: appState.visitDraft.visitDate,
                rating: appState.visitDraft.rating,
                notes: appState.visitDraft.notes
            )
            modelContext.insert(record)
            visitId = record.id
            Task {
                await SyncService.pushVisit(record, isNew: true)
                await attachFoodPhotos(to: restaurantId, visitId: visitId)
            }
        }

        appState.showLogForm = false
        appState.visitDraft = VisitDraft()
        foodPickerItems = []
        menuPhotoItem = nil
        appState.showToast("Visit saved")
    }

    private func attachFoodPhotos(to restaurantId: String, visitId: UUID) async {
        for item in foodPickerItems {
            guard let data = try? await item.loadTransferable(type: Data.self),
                  let image = UIImage(data: data),
                  let fileName = try? MediaStorage.saveImage(image, restaurantId: restaurantId, prefix: "food") else { continue }
            modelContext.insert(
                RestaurantMedia(restaurantId: restaurantId, visitId: visitId, kind: .foodPhoto, fileName: fileName)
            )
            await SyncService.uploadMediaFile(
                data: data,
                fileName: fileName,
                mimeType: "image/jpeg",
                restaurantId: restaurantId,
                visitId: visitId,
                kind: .foodPhoto
            )
        }
    }

    private func saveMenuPDF(image: UIImage?, restaurantId: String) {
        guard let image else { return }
        let seed = SeedData.menuSeed(for: restaurantId)
        let lines = seed.map {
            MenuPDFExporter.MenuLine(category: $0.category, name: $0.name, price: $0.price)
        }
        guard let pdfData = MenuPDFExporter.makePDF(
            restaurantName: appState.visitDraft.restaurantName,
            items: lines,
            menuImage: image
        ) else { return }

        let descriptor = FetchDescriptor<RestaurantMedia>()
        let existing = (try? modelContext.fetch(descriptor))?.filter {
            $0.restaurantId == restaurantId && $0.kind == RestaurantMediaKind.menuPDF.rawValue
        } ?? []
        for old in existing {
            MediaStorage.deleteFile(restaurantId: restaurantId, fileName: old.fileName)
            modelContext.delete(old)
        }

        for oldItem in (try? modelContext.fetch(FetchDescriptor<StoredMenuItem>()))?.filter({ $0.restaurantId == restaurantId }) ?? [] {
            modelContext.delete(oldItem)
        }
        for item in seed {
            modelContext.insert(
                StoredMenuItem(
                    restaurantId: restaurantId,
                    category: item.category,
                    name: item.name,
                    price: item.price
                )
            )
        }

        if let photoName = try? MediaStorage.saveImage(image, restaurantId: restaurantId, prefix: "menu-photo"),
           let photoData = image.jpegData(compressionQuality: 0.85) {
            modelContext.insert(RestaurantMedia(restaurantId: restaurantId, kind: .menuPhoto, fileName: photoName))
            Task {
                await SyncService.uploadMediaFile(
                    data: photoData,
                    fileName: photoName,
                    mimeType: "image/jpeg",
                    restaurantId: restaurantId,
                    visitId: nil,
                    kind: .menuPhoto
                )
            }
        }
        if let pdfName = try? MediaStorage.savePDF(pdfData, restaurantId: restaurantId) {
            modelContext.insert(RestaurantMedia(restaurantId: restaurantId, kind: .menuPDF, fileName: pdfName))
            Task {
                await SyncService.uploadMediaFile(
                    data: pdfData,
                    fileName: pdfName,
                    mimeType: "application/pdf",
                    restaurantId: restaurantId,
                    visitId: nil,
                    kind: .menuPDF
                )
                await SyncService.syncMenuItems(
                    restaurantId: restaurantId,
                    items: seed.map { ($0.category, $0.name, $0.price) }
                )
            }
        }
        appState.showToast("Menu PDF attached to restaurant")
    }

    private func hasMenuPDF(for restaurantId: String) -> Bool {
        let descriptor = FetchDescriptor<RestaurantMedia>()
        return (try? modelContext.fetch(descriptor))?.contains {
            $0.restaurantId == restaurantId && $0.kind == RestaurantMediaKind.menuPDF.rawValue
        } ?? false
    }

    private func openMenuPDF(restaurantId: String) {
        let descriptor = FetchDescriptor<RestaurantMedia>()
        guard let latest = (try? modelContext.fetch(descriptor))?
            .filter({ $0.restaurantId == restaurantId && $0.kind == RestaurantMediaKind.menuPDF.rawValue })
            .sorted(by: { $0.createdAt > $1.createdAt })
            .first else { return }
        previewPDFURL = MediaStorage.fileURL(restaurantId: restaurantId, fileName: latest.fileName)
        showPDFPreview = true
    }

    @ViewBuilder
    private func visitPhotoStrip(for visit: VisitRecord) -> some View {
        let rid = visit.restaurantId ?? MediaStorage.resolveRestaurantId(name: visit.restaurantName, explicitId: nil)
        let descriptor = FetchDescriptor<RestaurantMedia>()
        let photos = (try? modelContext.fetch(descriptor))?.filter {
            $0.restaurantId == rid && $0.visitId == visit.id && $0.kind == RestaurantMediaKind.foodPhoto.rawValue
        } ?? []

        if !photos.isEmpty {
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    ForEach(photos, id: \.id) { media in
                        if let image = MediaStorage.loadImage(restaurantId: rid, fileName: media.fileName) {
                            Image(uiImage: image)
                                .resizable()
                                .scaledToFill()
                                .frame(width: 64, height: 64)
                                .clipShape(RoundedRectangle(cornerRadius: 10))
                        }
                    }
                }
            }
        }
    }
}

#Preview {
    LogView()
        .environment(AppState())
        .modelContainer(for: [VisitRecord.self, StoredMenuItem.self, RestaurantMedia.self], inMemory: true)
}

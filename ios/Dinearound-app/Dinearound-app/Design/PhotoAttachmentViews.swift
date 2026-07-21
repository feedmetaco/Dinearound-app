import PDFKit
import PhotosUI
import SwiftData
import SwiftUI

struct FoodPhotoAttachmentSection: View {
    @Environment(\.daPalette) private var palette
    @Binding var pickerItems: [PhotosPickerItem]
    let existingImages: [UIImage]
    var onRemoveExisting: ((Int) -> Void)?

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Food Photos")
                .font(.system(size: 13, weight: .bold))
                .foregroundStyle(palette.textPrimary)

            LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 8), count: 3), spacing: 8) {
                ForEach(Array(existingImages.enumerated()), id: \.offset) { index, image in
                    ZStack(alignment: .topTrailing) {
                        Image(uiImage: image)
                            .resizable()
                            .scaledToFill()
                            .frame(height: 88)
                            .clipShape(RoundedRectangle(cornerRadius: 14))
                        if let onRemoveExisting {
                            Button {
                                onRemoveExisting(index)
                            } label: {
                                Image(systemName: "xmark.circle.fill")
                                    .foregroundStyle(.white, palette.destructive)
                            }
                            .offset(x: 4, y: -4)
                        }
                    }
                }

                if existingImages.count + pickerItems.count < 6 {
                    PhotosPicker(selection: $pickerItems, maxSelectionCount: 6, matching: .images) {
                        RoundedRectangle(cornerRadius: 14)
                            .fill(palette.chipFill)
                            .frame(height: 88)
                            .overlay(
                                VStack(spacing: 4) {
                                    Image(systemName: "camera.fill")
                                    Text("Add food photo")
                                        .font(.system(size: 10, weight: .semibold))
                                }
                                .foregroundStyle(palette.textSecondary)
                            )
                    }
                    .buttonStyle(.plain)
                }
            }
        }
    }
}

struct MenuPDFAttachmentSection: View {
    @Environment(\.daPalette) private var palette
    @Binding var menuPhotoItem: PhotosPickerItem?
    @State private var menuPreview: UIImage?
    let hasSavedPDF: Bool
    let onSavePDF: (UIImage?) -> Void
    let onViewPDF: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Menu (photo → PDF)")
                .font(.system(size: 13, weight: .bold))
                .foregroundStyle(palette.textPrimary)

            PhotosPicker(selection: $menuPhotoItem, matching: .images) {
                Group {
                    if let menuPreview {
                        Image(uiImage: menuPreview)
                            .resizable()
                            .scaledToFill()
                    } else {
                        VStack(spacing: 6) {
                            Image(systemName: "doc.viewfinder")
                            Text("Add menu photo")
                                .font(.system(size: 12, weight: .semibold))
                        }
                        .foregroundStyle(palette.textSecondary)
                    }
                }
                .frame(maxWidth: .infinity)
                .frame(height: 120)
                .background(palette.chipFill)
                .clipShape(RoundedRectangle(cornerRadius: 16))
                .overlay(
                    RoundedRectangle(cornerRadius: 16)
                        .stroke(palette.inputBorder, lineWidth: 2)
                )
            }
            .buttonStyle(.plain)
            .onChange(of: menuPhotoItem) { _, newItem in
                Task {
                    guard let newItem,
                          let data = try? await newItem.loadTransferable(type: Data.self),
                          let image = UIImage(data: data) else {
                        menuPreview = nil
                        return
                    }
                    menuPreview = image
                }
            }

            HStack(spacing: 10) {
                Button {
                    onSavePDF(menuPreview)
                } label: {
                    HStack(spacing: 6) {
                        Image(systemName: "sparkles").font(.system(size: 12, weight: .bold))
                        Text("Scan & save PDF to restaurant")
                    }
                    .font(.system(size: 13, weight: .bold))
                    .foregroundStyle(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                    .background(DATheme.greenGradient)
                    .clipShape(RoundedRectangle(cornerRadius: DATheme.radiusButton))
                }
                .buttonStyle(.plain)
                .disabled(menuPreview == nil)
                .opacity(menuPreview == nil ? 0.5 : 1)

                if hasSavedPDF {
                    Button {
                        onViewPDF()
                    } label: {
                        HStack(spacing: 6) {
                            Image(systemName: "doc.richtext").font(.system(size: 12, weight: .bold))
                            Text("View PDF")
                        }
                        .font(.system(size: 13, weight: .bold))
                        .foregroundStyle(palette.primaryGreen)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 12)
                        .overlay(
                            RoundedRectangle(cornerRadius: DATheme.radiusButton)
                                .stroke(palette.primaryGreen, lineWidth: 2)
                        )
                    }
                    .buttonStyle(.plain)
                }
            }
        }
    }
}

struct PDFPreviewSheet: View {
    let url: URL
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            PDFKitView(url: url)
                .navigationTitle("Menu PDF")
                .navigationBarTitleDisplayMode(.inline)
                .toolbar {
                    ToolbarItem(placement: .topBarTrailing) {
                        ShareLink(item: url) {
                            Image(systemName: "square.and.arrow.up")
                        }
                    }
                    ToolbarItem(placement: .topBarLeading) {
                        Button("Done") { dismiss() }
                    }
                }
        }
    }
}

struct PDFKitView: UIViewRepresentable {
    let url: URL

    func makeUIView(context: Context) -> PDFView {
        let view = PDFView()
        view.autoScales = true
        view.document = PDFDocument(url: url)
        return view
    }

    func updateUIView(_ uiView: PDFView, context: Context) {}
}

import Foundation
import UIKit

enum MediaStorage {
    private static var baseURL: URL {
        let root = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
            .appendingPathComponent("DineAroundMedia", isDirectory: true)
        try? FileManager.default.createDirectory(at: root, withIntermediateDirectories: true)
        return root
    }

    static func folder(for restaurantId: String) -> URL {
        let url = baseURL.appendingPathComponent(restaurantId, isDirectory: true)
        try? FileManager.default.createDirectory(at: url, withIntermediateDirectories: true)
        return url
    }

    static func fileURL(restaurantId: String, fileName: String) -> URL {
        folder(for: restaurantId).appendingPathComponent(fileName)
    }

    @discardableResult
    static func saveImage(_ image: UIImage, restaurantId: String, prefix: String) throws -> String {
        let fileName = "\(prefix)-\(UUID().uuidString).jpg"
        let url = fileURL(restaurantId: restaurantId, fileName: fileName)
        guard let data = image.jpegData(compressionQuality: 0.85) else {
            throw MediaStorageError.encodingFailed
        }
        try data.write(to: url, options: .atomic)
        return fileName
    }

    @discardableResult
    static func savePDF(_ data: Data, restaurantId: String) throws -> String {
        let fileName = "menu-\(UUID().uuidString).pdf"
        let url = fileURL(restaurantId: restaurantId, fileName: fileName)
        try data.write(to: url, options: .atomic)
        return fileName
    }

    static func loadImage(restaurantId: String, fileName: String) -> UIImage? {
        let url = fileURL(restaurantId: restaurantId, fileName: fileName)
        guard let data = try? Data(contentsOf: url) else { return nil }
        return UIImage(data: data)
    }

    static func deleteFile(restaurantId: String, fileName: String) {
        let url = fileURL(restaurantId: restaurantId, fileName: fileName)
        try? FileManager.default.removeItem(at: url)
    }

    static func resolveRestaurantId(name: String, explicitId: String?) -> String {
        if let explicitId, !explicitId.isEmpty { return explicitId }
        if let match = SeedData.restaurants.first(where: { $0.name.caseInsensitiveCompare(name) == .orderedSame }) {
            return match.id
        }
        let slug = name.lowercased()
            .components(separatedBy: CharacterSet.alphanumerics.inverted)
            .filter { !$0.isEmpty }
            .joined(separator: "-")
        return slug.isEmpty ? "custom-unknown" : "custom-\(slug)"
    }
}

enum MediaStorageError: Error {
    case encodingFailed
}

enum MenuPDFExporter {
    struct MenuLine {
        var category: String
        var name: String
        var price: String
    }

    static func makePDF(restaurantName: String, items: [MenuLine], menuImage: UIImage? = nil) -> Data? {
        let pageRect = CGRect(x: 0, y: 0, width: 612, height: 792)
        let format = UIGraphicsPDFRendererFormat()
        format.documentInfo = [kCGPDFContextCreator as String: "DineAround"]
        let renderer = UIGraphicsPDFRenderer(bounds: pageRect, format: format)

        return renderer.pdfData { context in
            context.beginPage()
            var y: CGFloat = 40
            let title = "\(restaurantName) — Menu"
            title.draw(at: CGPoint(x: 40, y: y), withAttributes: [
                .font: UIFont.boldSystemFont(ofSize: 22)
            ])
            y += 36

            if let menuImage {
                let maxWidth = pageRect.width - 80
                let aspect = menuImage.size.height / max(menuImage.size.width, 1)
                let drawWidth = min(maxWidth, menuImage.size.width)
                let drawHeight = drawWidth * aspect
                let imageRect = CGRect(x: 40, y: y, width: drawWidth, height: min(drawHeight, 320))
                menuImage.draw(in: imageRect)
                y = imageRect.maxY + 24
            }

            for item in items where !item.name.trimmingCharacters(in: .whitespaces).isEmpty {
                let line = "\(item.category) — \(item.name)  $\(item.price)"
                line.draw(at: CGPoint(x: 40, y: y), withAttributes: [
                    .font: UIFont.systemFont(ofSize: 14)
                ])
                y += 22
                if y > pageRect.height - 40 {
                    context.beginPage()
                    y = 40
                }
            }
        }
    }
}

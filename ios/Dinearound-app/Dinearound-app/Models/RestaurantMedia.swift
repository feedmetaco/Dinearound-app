import Foundation
import SwiftData

enum RestaurantMediaKind: String, Codable {
    case foodPhoto
    case menuPhoto
    case menuPDF
}

@Model
final class RestaurantMedia {
    var id: UUID
    var restaurantId: String
    var visitId: UUID?
    var kind: String
    var fileName: String
    var createdAt: Date

    init(
        id: UUID = UUID(),
        restaurantId: String,
        visitId: UUID? = nil,
        kind: RestaurantMediaKind,
        fileName: String,
        createdAt: Date = .now
    ) {
        self.id = id
        self.restaurantId = restaurantId
        self.visitId = visitId
        self.kind = kind.rawValue
        self.fileName = fileName
        self.createdAt = createdAt
    }

    var mediaKind: RestaurantMediaKind {
        RestaurantMediaKind(rawValue: kind) ?? .foodPhoto
    }
}

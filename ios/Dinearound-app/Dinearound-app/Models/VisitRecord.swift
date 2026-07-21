import Foundation
import SwiftData

@Model
final class VisitRecord {
    var id: UUID
    var restaurantName: String
    var restaurantId: String?
    var visitDate: Date
    var rating: Int
    var notes: String

    init(
        id: UUID = UUID(),
        restaurantName: String,
        restaurantId: String? = nil,
        visitDate: Date = .now,
        rating: Int = 0,
        notes: String = ""
    ) {
        self.id = id
        self.restaurantName = restaurantName
        self.restaurantId = restaurantId
        self.visitDate = visitDate
        self.rating = rating
        self.notes = notes
    }
}

@Model
final class StoredMenuItem {
    var id: UUID
    var restaurantId: String
    var category: String
    var name: String
    var price: String

    init(id: UUID = UUID(), restaurantId: String, category: String, name: String, price: String) {
        self.id = id
        self.restaurantId = restaurantId
        self.category = category
        self.name = name
        self.price = price
    }
}

import Foundation

struct Restaurant: Identifiable, Hashable, Codable {
    let id: String
    let name: String
    let cuisine: String
    let emoji: String
    let address: String
    let rating: Double
    let priceLevel: Int
    let distanceKm: Double

    var priceSymbols: String {
        String(repeating: "$", count: min(max(priceLevel, 1), 4))
    }

    var cuisineLine: String {
        "\(cuisine) · \(priceSymbols)"
    }
}

enum PriceFilter: String, CaseIterable, Identifiable {
    case all = "All Prices"
    case budget = "Budget $"
    case moderate = "Moderate $$"
    case pricey = "Pricey $$$"
    case luxury = "Luxury $$$$"

    var id: String { rawValue }

    func matches(_ level: Int) -> Bool {
        switch self {
        case .all: return true
        case .budget: return level == 1
        case .moderate: return level == 2
        case .pricey: return level == 3
        case .luxury: return level == 4
        }
    }
}

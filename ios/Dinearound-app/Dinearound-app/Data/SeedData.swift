import Foundation

enum SeedData {
    static let cuisines = [
        "Italian", "Mexican", "Japanese", "Indian", "Thai",
        "French", "American", "Mediterranean", "Korean"
    ]

    static let restaurants: [Restaurant] = [
        Restaurant(id: "r1", name: "Nonna Rosa", cuisine: "Italian", emoji: "🍝", address: "214 Mulberry St", rating: 4.7, priceLevel: 3, distanceKm: 0.6),
        Restaurant(id: "r2", name: "Casa Verde", cuisine: "Mexican", emoji: "🌮", address: "88 Alvarado Ave", rating: 4.4, priceLevel: 2, distanceKm: 1.4),
        Restaurant(id: "r3", name: "Sakura Table", cuisine: "Japanese", emoji: "🍣", address: "19 Cherry Ln", rating: 4.8, priceLevel: 4, distanceKm: 2.1),
        Restaurant(id: "r4", name: "Saffron & Clove", cuisine: "Indian", emoji: "🍛", address: "502 Spice Market Rd", rating: 4.5, priceLevel: 2, distanceKm: 0.9),
        Restaurant(id: "r5", name: "Bangkok Basil", cuisine: "Thai", emoji: "🍜", address: "77 Riverside Dr", rating: 4.3, priceLevel: 2, distanceKm: 3.2),
        Restaurant(id: "r6", name: "Le Petit Four", cuisine: "French", emoji: "🥐", address: "10 Rue Fictive", rating: 4.6, priceLevel: 4, distanceKm: 1.8),
        Restaurant(id: "r7", name: "The Griddle House", cuisine: "American", emoji: "🍔", address: "345 Main St", rating: 4.2, priceLevel: 1, distanceKm: 0.3),
        Restaurant(id: "r8", name: "Olive & Sea", cuisine: "Mediterranean", emoji: "🥙", address: "61 Harbor Walk", rating: 4.6, priceLevel: 3, distanceKm: 2.7),
        Restaurant(id: "r9", name: "Seoul Garden", cuisine: "Korean", emoji: "🍢", address: "129 Baekdu Ave", rating: 4.5, priceLevel: 2, distanceKm: 1.1),
    ]

    static func menuSeed(for restaurantId: String) -> [(category: String, name: String, price: String)] {
        switch restaurantId {
        case "r1":
            return [
                ("Appetizers", "Burrata al Pomodoro", "14"),
                ("Mains", "Tagliatelle al Tartufo", "26"),
                ("Mains", "Osso Buco", "32"),
                ("Dolci", "Tiramisù", "9"),
            ]
        case "r2":
            return [
                ("Starters", "Guacamole & Chips", "8"),
                ("Tacos", "Al Pastor (3)", "12"),
                ("Tacos", "Barbacoa (3)", "13"),
                ("Postres", "Churros", "6"),
            ]
        case "r3":
            return [
                ("Nigiri", "Otoro", "9"),
                ("Rolls", "Rainbow Roll", "18"),
                ("Rolls", "Spicy Tuna Roll", "14"),
                ("Soup", "Miso Soup", "5"),
            ]
        default:
            return [
                ("Chef's picks", "House Special", "18"),
                ("Mains", "Seasonal Plate", "24"),
            ]
        }
    }
}

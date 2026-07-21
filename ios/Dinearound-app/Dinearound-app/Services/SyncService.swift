import Foundation
import SwiftData
import UIKit

@MainActor
enum SyncService {
    /// Pull visits + wishlist from Worker into local state after login.
    static func syncFromServer(appState: AppState, modelContext: ModelContext) async {
        await pullFromServer(modelContext: modelContext, appState: appState)
    }

    static func pullFromServer(modelContext: ModelContext, appState: AppState) async {
        guard AppConfig.isAPIEnabled, APIClient.shared.authToken != nil, !appState.isGuest else { return }

        do {
            let api = APIClient.shared
            let apiVisits = try await api.fetchVisits()
            let wishlistIds = try await api.fetchWishlistIds()

            appState.wishlistIds = wishlistIds

            let existing = (try? modelContext.fetch(FetchDescriptor<VisitRecord>())) ?? []
            let existingById = Dictionary(uniqueKeysWithValues: existing.map { ($0.id.uuidString.lowercased(), $0) })
            let serverIds = Set(apiVisits.map { $0.id.lowercased() })

            for apiVisit in apiVisits {
                let visitDate = DateFormatter.apiDate.date(from: apiVisit.visitDate) ?? .now

                if let local = existingById[apiVisit.id.lowercased()] {
                    local.restaurantName = apiVisit.restaurantName
                    local.restaurantId = apiVisit.restaurantId
                    local.visitDate = visitDate
                    local.rating = apiVisit.rating
                    local.notes = apiVisit.notes
                } else if let uuid = UUID(uuidString: apiVisit.id) {
                    modelContext.insert(
                        VisitRecord(
                            id: uuid,
                            restaurantName: apiVisit.restaurantName,
                            restaurantId: apiVisit.restaurantId,
                            visitDate: visitDate,
                            rating: apiVisit.rating,
                            notes: apiVisit.notes
                        )
                    )
                }
            }

            for local in existing where !serverIds.contains(local.id.uuidString.lowercased()) {
                modelContext.delete(local)
            }
        } catch {
            appState.showToast("Sync failed — using local data")
        }
    }

    static func pushVisit(_ visit: VisitRecord, isNew: Bool) async {
        guard AppConfig.isAPIEnabled, APIClient.shared.authToken != nil else { return }

        let dateString = DateFormatter.apiDate.string(from: visit.visitDate)
        let api = APIClient.shared
        do {
            if isNew {
                _ = try await api.createVisit(
                    id: visit.id.uuidString,
                    restaurantId: visit.restaurantId,
                    restaurantName: visit.restaurantName,
                    visitDate: dateString,
                    rating: visit.rating,
                    notes: visit.notes
                )
            } else {
                try await api.updateVisit(
                    id: visit.id.uuidString,
                    restaurantId: visit.restaurantId,
                    restaurantName: visit.restaurantName,
                    visitDate: dateString,
                    rating: visit.rating,
                    notes: visit.notes
                )
            }
        } catch {
            // Local-first — retry on next sync
        }
    }

    static func deleteVisitRemote(_ visit: VisitRecord) async {
        guard AppConfig.isAPIEnabled, APIClient.shared.authToken != nil else { return }
        try? await APIClient.shared.deleteVisit(id: visit.id.uuidString)
    }

    static func syncWishlist(restaurantId: String, adding: Bool) async {
        guard AppConfig.isAPIEnabled, APIClient.shared.authToken != nil else { return }
        let api = APIClient.shared
        try? await adding ? api.addWishlist(restaurantId: restaurantId) : api.removeWishlist(restaurantId: restaurantId)
    }

    static func uploadMediaFile(
        data: Data,
        fileName: String,
        mimeType: String,
        restaurantId: String,
        visitId: UUID?,
        kind: RestaurantMediaKind
    ) async {
        guard AppConfig.isAPIEnabled, APIClient.shared.authToken != nil else { return }

        let apiKind: String = switch kind {
        case .foodPhoto: "food_photo"
        case .menuPhoto: "menu_photo"
        case .menuPDF: "menu_pdf"
        }

        _ = try? await APIClient.shared.uploadMedia(
            data: data,
            fileName: fileName,
            mimeType: mimeType,
            restaurantId: restaurantId,
            visitId: visitId?.uuidString,
            kind: apiKind
        )
    }

    static func syncMenuItems(restaurantId: String, items: [(category: String, name: String, price: String)]) async {
        guard AppConfig.isAPIEnabled, APIClient.shared.authToken != nil else { return }
        try? await APIClient.shared.saveMenuItems(restaurantId: restaurantId, items: items)
    }
}

private extension DateFormatter {
    static let apiDate: DateFormatter = {
        let f = DateFormatter()
        f.calendar = Calendar(identifier: .gregorian)
        f.locale = Locale(identifier: "en_US_POSIX")
        f.timeZone = TimeZone(secondsFromGMT: 0)
        f.dateFormat = "yyyy-MM-dd"
        return f
    }()
}

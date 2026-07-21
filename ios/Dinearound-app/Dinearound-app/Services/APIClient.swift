import Foundation

enum APIClientError: LocalizedError {
    case notConfigured
    case invalidResponse
    case server(String)
    case unauthorized

    var errorDescription: String? {
        switch self {
        case .notConfigured: return "API URL not configured"
        case .invalidResponse: return "Invalid server response"
        case .server(let message): return message
        case .unauthorized: return "Unauthorized"
        }
    }
}

struct APIUser: Codable {
    let id: String
    let email: String
    let displayName: String?
}

struct APIVisit: Codable {
    let id: String
    let userId: String
    let restaurantId: String?
    let restaurantName: String
    let visitDate: String
    let rating: Int
    let notes: String
    let createdAt: String?
    let updatedAt: String?

    enum CodingKeys: String, CodingKey {
        case id
        case userId = "user_id"
        case restaurantId = "restaurant_id"
        case restaurantName = "restaurant_name"
        case visitDate = "visit_date"
        case rating, notes
        case createdAt = "created_at"
        case updatedAt = "updated_at"
    }
}

struct APIMedia: Codable {
    let id: String
    let restaurantId: String
    let visitId: String?
    let kind: String
    let url: String
    let contentType: String?

    enum CodingKeys: String, CodingKey {
        case id, kind, url
        case restaurantId = "restaurant_id"
        case visitId = "visit_id"
        case contentType = "content_type"
    }
}

private struct EmptyResponse: Decodable { let success: Bool }

private struct ErrorPayload: Decodable { let success: Bool; let error: String? }

final class APIClient {
    static let shared = APIClient()

    private static let tokenKey = "dinearound-auth-token"

    private init() {}

    var baseURL: URL? { AppConfig.apiBaseURL }

    var isEnabled: Bool { AppConfig.isAPIEnabled }

    var authToken: String? {
        get { UserDefaults.standard.string(forKey: Self.tokenKey) }
        set {
            if let newValue {
                UserDefaults.standard.set(newValue, forKey: Self.tokenKey)
            } else {
                UserDefaults.standard.removeObject(forKey: Self.tokenKey)
            }
        }
    }

    func register(email: String, password: String, displayName: String? = nil) async throws -> APIUser {
        struct Body: Encodable {
            let email: String
            let password: String
            let displayName: String?
        }
        struct Response: Decodable {
            let success: Bool
            let token: String
            let user: APIUser
            let error: String?
        }
        let result: Response = try await request(
            path: "/api/auth/register",
            method: "POST",
            body: Body(email: email, password: password, displayName: displayName),
            auth: false
        )
        authToken = result.token
        return result.user
    }

    func login(email: String, password: String) async throws -> APIUser {
        struct Body: Encodable { let email: String; let password: String }
        struct Response: Decodable {
            let success: Bool
            let token: String
            let user: APIUser
            let error: String?
        }
        let result: Response = try await request(
            path: "/api/auth/login",
            method: "POST",
            body: Body(email: email, password: password),
            auth: false
        )
        authToken = result.token
        return result.user
    }

    func logout() {
        authToken = nil
    }

    func fetchVisits() async throws -> [APIVisit] {
        struct Response: Decodable { let success: Bool; let data: [APIVisit] }
        let result: Response = try await request(path: "/api/visits")
        return result.data
    }

    func createVisit(
        id: String,
        restaurantId: String?,
        restaurantName: String,
        visitDate: String,
        rating: Int,
        notes: String
    ) async throws -> APIVisit {
        struct Body: Encodable {
            let id: String
            let restaurantId: String?
            let restaurantName: String
            let visitDate: String
            let rating: Int
            let notes: String
        }
        struct Response: Decodable { let success: Bool; let data: APIVisit }
        let result: Response = try await request(
            path: "/api/visits",
            method: "POST",
            body: Body(
                id: id,
                restaurantId: restaurantId,
                restaurantName: restaurantName,
                visitDate: visitDate,
                rating: rating,
                notes: notes
            )
        )
        return result.data
    }

    func updateVisit(
        id: String,
        restaurantId: String?,
        restaurantName: String,
        visitDate: String,
        rating: Int,
        notes: String
    ) async throws {
        struct Body: Encodable {
            let restaurantId: String?
            let restaurantName: String
            let visitDate: String
            let rating: Int
            let notes: String
        }
        let _: EmptyResponse = try await request(
            path: "/api/visits/\(id)",
            method: "PATCH",
            body: Body(
                restaurantId: restaurantId,
                restaurantName: restaurantName,
                visitDate: visitDate,
                rating: rating,
                notes: notes
            )
        )
    }

    func deleteVisit(id: String) async throws {
        let _: EmptyResponse = try await request(path: "/api/visits/\(id)", method: "DELETE")
    }

    func fetchWishlistIds() async throws -> Set<String> {
        struct Response: Decodable { let success: Bool; let ids: [String] }
        let result: Response = try await request(path: "/api/wishlist")
        return Set(result.ids)
    }

    func addWishlist(restaurantId: String) async throws {
        struct Body: Encodable { let restaurantId: String }
        let _: EmptyResponse = try await request(
            path: "/api/wishlist",
            method: "POST",
            body: Body(restaurantId: restaurantId)
        )
    }

    func removeWishlist(restaurantId: String) async throws {
        let _: EmptyResponse = try await request(path: "/api/wishlist/\(restaurantId)", method: "DELETE")
    }

    func saveMenuItems(
        restaurantId: String,
        items: [(category: String, name: String, price: String)]
    ) async throws {
        struct Item: Encodable { let category: String; let name: String; let price: String }
        struct Body: Encodable { let items: [Item] }
        let _: EmptyResponse = try await request(
            path: "/api/restaurants/\(restaurantId)/menu-items",
            method: "POST",
            body: Body(items: items.map { Item(category: $0.category, name: $0.name, price: $0.price) })
        )
    }

    func uploadMedia(
        data: Data,
        fileName: String,
        mimeType: String,
        restaurantId: String,
        visitId: String?,
        kind: String
    ) async throws -> APIMedia {
        var urlRequest = URLRequest(url: try apiURL(path: "/api/media/upload"))
        urlRequest.httpMethod = "POST"
        if let token = authToken {
            urlRequest.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        let boundary = UUID().uuidString
        urlRequest.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")

        var body = Data()
        func appendField(_ name: String, _ value: String) {
            body.append("--\(boundary)\r\n".data(using: .utf8)!)
            body.append("Content-Disposition: form-data; name=\"\(name)\"\r\n\r\n".data(using: .utf8)!)
            body.append("\(value)\r\n".data(using: .utf8)!)
        }
        appendField("restaurantId", restaurantId)
        if let visitId { appendField("visitId", visitId) }
        appendField("kind", kind)

        body.append("--\(boundary)\r\n".data(using: .utf8)!)
        body.append("Content-Disposition: form-data; name=\"file\"; filename=\"\(fileName)\"\r\n".data(using: .utf8)!)
        body.append("Content-Type: \(mimeType)\r\n\r\n".data(using: .utf8)!)
        body.append(data)
        body.append("\r\n".data(using: .utf8)!)
        body.append("--\(boundary)--\r\n".data(using: .utf8)!)
        urlRequest.httpBody = body

        let (responseData, response) = try await URLSession.shared.data(for: urlRequest)
        guard let http = response as? HTTPURLResponse else { throw APIClientError.invalidResponse }

        struct UploadResponse: Decodable { let success: Bool; let data: APIMedia; let error: String? }
        let decoded = try JSONDecoder().decode(UploadResponse.self, from: responseData)
        if http.statusCode == 401 { throw APIClientError.unauthorized }
        if http.statusCode >= 400 {
            throw APIClientError.server(decoded.error ?? "Upload failed")
        }
        return decoded.data
    }

    private func apiURL(path: String) throws -> URL {
        guard let base = baseURL else { throw APIClientError.notConfigured }
        let normalized = path.hasPrefix("/") ? String(path.dropFirst()) : path
        return base.appendingPathComponent(normalized)
    }

    private func request<T: Decodable>(
        path: String,
        method: String = "GET",
        body: (any Encodable)? = nil,
        auth: Bool = true
    ) async throws -> T {
        var urlRequest = URLRequest(url: try apiURL(path: path))
        urlRequest.httpMethod = method
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")

        if auth, let token = authToken {
            urlRequest.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        if let body {
            urlRequest.httpBody = try JSONEncoder().encode(AnyEncodable(body))
        }

        let (data, response) = try await URLSession.shared.data(for: urlRequest)
        guard let http = response as? HTTPURLResponse else { throw APIClientError.invalidResponse }

        if http.statusCode == 401 { throw APIClientError.unauthorized }
        if http.statusCode >= 400 {
            let err = (try? JSONDecoder().decode(ErrorPayload.self, from: data))?.error
            throw APIClientError.server(err ?? "Request failed (\(http.statusCode))")
        }

        return try JSONDecoder().decode(T.self, from: data)
    }
}

private struct AnyEncodable: Encodable {
    private let encode: (Encoder) throws -> Void
    init(_ wrapped: any Encodable) {
        encode = wrapped.encode
    }
    func encode(to encoder: Encoder) throws { try encode(encoder) }
}

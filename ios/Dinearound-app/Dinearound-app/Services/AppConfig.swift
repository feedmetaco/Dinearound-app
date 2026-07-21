import Foundation

enum AppConfig {
    /// Worker REST base URL — set via Xcode build setting `INFOPLIST_KEY_API_BASE_URL`
    /// or `API_BASE_URL` in Info.plist. Empty = offline/local-only mode.
    static var apiBaseURL: URL? {
        if let env = ProcessInfo.processInfo.environment["DINEAROUND_API_URL"],
           !env.isEmpty,
           let url = URL(string: env) {
            return url
        }
        if let raw = Bundle.main.object(forInfoDictionaryKey: "API_BASE_URL") as? String,
           !raw.isEmpty,
           let url = URL(string: raw) {
            return url
        }
        return nil
    }

    static var isAPIEnabled: Bool { apiBaseURL != nil }
}

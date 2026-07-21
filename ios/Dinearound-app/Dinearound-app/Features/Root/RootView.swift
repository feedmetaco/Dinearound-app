import SwiftUI

struct RootView: View {
    @Environment(AppState.self) private var appState
    @Environment(\.colorScheme) private var colorScheme

    var body: some View {
        Group {
            if appState.isAuthenticated {
                MainTabView()
            } else {
                AuthView()
            }
        }
        .environment(\.daPalette, appState.palette)
        .preferredColorScheme(appState.prefersDarkMode)
        .onAppear {
            appState.systemColorScheme = colorScheme
        }
        .onChange(of: colorScheme) { _, newValue in
            appState.systemColorScheme = newValue
        }
    }
}

#Preview {
    RootView()
        .environment(AppState())
}

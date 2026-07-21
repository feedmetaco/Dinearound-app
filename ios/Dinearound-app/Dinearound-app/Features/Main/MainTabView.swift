import SwiftData
import SwiftUI

struct MainTabView: View {
    @Environment(AppState.self) private var appState
    @Environment(\.daPalette) private var palette
    @Environment(\.modelContext) private var modelContext

    var body: some View {
        ZStack(alignment: .bottom) {
            VStack(spacing: 0) {
                AppHeaderView()

                NavigationStack(path: Bindable(appState).navigationPath) {
                    tabContent
                        .navigationDestination(for: NavigationDestination.self) { destination in
                            switch destination {
                            case .detail(let id):
                                RestaurantDetailView(restaurantId: id)
                            case .menuCapture(let id):
                                MenuCaptureView(restaurantId: id)
                            }
                        }
                }
            }
            .background(palette.background)

            if let toast = appState.toastMessage {
                DAToast(message: toast)
                    .padding(.bottom, 108)
                    .transition(.opacity.combined(with: .move(edge: .bottom)))
                    .zIndex(1)
            }

            floatingPillNav
        }
        .background(palette.background)
        .animation(.easeInOut(duration: 0.2), value: appState.toastMessage)
        .task {
            await SyncService.syncFromServer(appState: appState, modelContext: modelContext)
        }
    }

    @ViewBuilder
    private var tabContent: some View {
        switch appState.selectedTab {
        case .nearby:
            NearbyView()
        case .log:
            LogView()
        case .wishlist:
            WishlistView()
        }
    }

    /// Floating pill bottom nav — dark capsule shell in BOTH light and dark mode (Ref B),
    /// active tab gets a solid coral pill highlight.
    private var floatingPillNav: some View {
        HStack(spacing: 4) {
            ForEach(AppTab.allCases, id: \.self) { tab in
                let isActive = appState.selectedTab == tab
                Button {
                    if appState.selectedTab != tab {
                        appState.resetNavigationOnTabChange()
                    }
                    appState.selectedTab = tab
                } label: {
                    HStack(spacing: 6) {
                        Image(systemName: tab.icon)
                            .font(.system(size: 16, weight: .semibold))
                        if isActive {
                            Text(tab.label)
                                .font(.system(size: 13, weight: .heavy))
                                .lineLimit(1)
                        }
                    }
                    .foregroundStyle(isActive ? .white : .white.opacity(0.55))
                    .padding(.horizontal, isActive ? 18 : 14)
                    .padding(.vertical, 12)
                    .background(
                        Capsule()
                            .fill(isActive ? palette.navActive : .clear)
                    )
                }
                .buttonStyle(.plain)
                .animation(.spring(response: 0.35, dampingFraction: 0.8), value: isActive)
            }
        }
        .padding(6)
        .background(
            Capsule()
                .fill(palette.navShell)
                .background(.ultraThinMaterial.opacity(0.4), in: Capsule())
        )
        .shadow(color: .black.opacity(0.35), radius: 20, y: 10)
        .padding(.horizontal, 20)
        .padding(.bottom, 18)
    }
}

#Preview {
    MainTabView()
        .environment(AppState())
        .modelContainer(for: [VisitRecord.self, StoredMenuItem.self, RestaurantMedia.self], inMemory: true)
}

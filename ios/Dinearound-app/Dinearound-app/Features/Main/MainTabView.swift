import SwiftUI

struct MainTabView: View {
    @Environment(AppState.self) private var appState
    @Environment(\.daPalette) private var palette

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

            if let toast = appState.toastMessage {
                DAToast(message: toast)
                    .padding(.bottom, 90)
                    .transition(.opacity)
            }

            tabBar
        }
        .background(palette.background)
        .animation(.easeInOut(duration: 0.2), value: appState.toastMessage)
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

    private var tabBar: some View {
        HStack {
            ForEach(AppTab.allCases, id: \.self) { tab in
                Button {
                    if appState.selectedTab != tab {
                        appState.resetNavigationOnTabChange()
                    }
                    appState.selectedTab = tab
                } label: {
                    VStack(spacing: 4) {
                        Image(systemName: tab.icon)
                            .font(.system(size: 20))
                        Text(tab.label)
                            .font(.system(size: 11, weight: .heavy))
                    }
                    .frame(maxWidth: .infinity)
                    .foregroundStyle(appState.selectedTab == tab ? palette.primaryGreen : palette.textSecondary)
                }
                .buttonStyle(.plain)
            }
        }
        .padding(.top, 10)
        .padding(.bottom, 22)
        .background(palette.headerBackground)
        .overlay(alignment: .top) {
            Rectangle()
                .fill(palette.borderSoft)
                .frame(height: 2)
        }
    }
}

#Preview {
    MainTabView()
        .environment(AppState())
        .modelContainer(for: [VisitRecord.self, StoredMenuItem.self], inMemory: true)
}

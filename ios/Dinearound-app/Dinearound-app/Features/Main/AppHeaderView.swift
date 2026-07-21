import SwiftUI

struct AppHeaderView: View {
    @Environment(AppState.self) private var appState
    @Environment(\.daPalette) private var palette

    var body: some View {
        HStack {
            HStack(spacing: 10) {
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [palette.greenTint, palette.primaryGreen],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 32, height: 32)
                    .overlay(Text("🍽️").font(.caption))
                Text("DineAround")
                    .font(.system(size: 18, weight: .black))
                    .foregroundStyle(palette.primaryGreen)
            }

            Spacer()

            Button {
                appState.toggleDarkMode()
            } label: {
                Text(appState.isDark ? "☀️" : "🌙")
                    .font(.system(size: 18))
            }
            .buttonStyle(.plain)

            Button("Sign out") {
                appState.signOut()
            }
            .font(.system(size: 12, weight: .heavy))
            .foregroundStyle(.white)
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(DATheme.primaryGradient)
            .clipShape(Capsule())
            .buttonStyle(.plain)
        }
        .padding(.horizontal, 18)
        .padding(.vertical, 14)
        .background(palette.headerBackground)
        .overlay(alignment: .bottom) {
            Rectangle()
                .fill(palette.borderSoft)
                .frame(height: 2)
        }
    }
}

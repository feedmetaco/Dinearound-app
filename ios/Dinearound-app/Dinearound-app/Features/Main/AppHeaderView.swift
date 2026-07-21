import SwiftUI

struct AppHeaderView: View {
    @Environment(AppState.self) private var appState
    @Environment(\.daPalette) private var palette

    var body: some View {
        HStack {
            HStack(spacing: 10) {
                Circle()
                    .fill(DATheme.heroGradient)
                    .frame(width: 32, height: 32)
                    .overlay(
                        Image(systemName: "fork.knife")
                            .font(.system(size: 13, weight: .bold))
                            .foregroundStyle(.white)
                    )
                Text("DineAround")
                    .font(.system(size: 18, weight: .black))
                    .foregroundStyle(palette.textPrimary)
            }

            Spacer()

            Button {
                appState.toggleDarkMode()
            } label: {
                Image(systemName: appState.isDark ? "sun.max.fill" : "moon.fill")
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundStyle(palette.textSecondary)
                    .frame(width: 34, height: 34)
                    .background(palette.chipFill)
                    .clipShape(Circle())
            }
            .buttonStyle(.plain)
            .padding(.trailing, 8)

            Button {
                appState.signOut()
            } label: {
                Text("Sign out")
                    .font(.system(size: 12, weight: .heavy))
                    .foregroundStyle(.white)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 8)
                    .background(DATheme.primaryGradient)
                    .clipShape(Capsule())
            }
            .buttonStyle(.plain)
        }
        .padding(.horizontal, 18)
        .padding(.vertical, 14)
        .background(palette.headerBackground)
        .overlay(alignment: .bottom) {
            Rectangle()
                .fill(palette.borderSoft)
                .frame(height: 1)
        }
    }
}

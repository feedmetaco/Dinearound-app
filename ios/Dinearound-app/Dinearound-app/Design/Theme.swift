import SwiftUI

enum DATheme {
    static let radiusCard: CGFloat = 22
    static let radiusButton: CGFloat = 16
    static let radiusInput: CGFloat = 14
    static let radiusThumb: CGFloat = 16

    struct Palette {
        let primaryGreen: Color
        let primaryGreenDark: Color
        let greenTint: Color
        let accentGold: Color
        let accentGoldDark: Color
        let destructive: Color
        let background: Color
        let cardBackground: Color
        let chipFill: Color
        let inputBorder: Color
        let textPrimary: Color
        let textSecondary: Color
        let borderSoft: Color
        let headerBackground: Color
        let toastBackground: Color
    }

    static func palette(isDark: Bool) -> Palette {
        if isDark {
            return Palette(
                primaryGreen: Color(hex: 0x2F9E52),
                primaryGreenDark: Color(hex: 0x1F7A3D),
                greenTint: Color(hex: 0x3FAE68),
                accentGold: Color(hex: 0xE8A33D),
                accentGoldDark: Color(hex: 0xC97F0F),
                destructive: Color(hex: 0xE1584A),
                background: Color(hex: 0x122019),
                cardBackground: Color(hex: 0x1B2B22),
                chipFill: Color(hex: 0x16241C),
                inputBorder: Color(hex: 0x2E4536),
                textPrimary: Color(hex: 0xEAF5EE),
                textSecondary: Color(hex: 0x8FAE9B),
                borderSoft: Color(hex: 0x3F6E50, alpha: 0.4),
                headerBackground: Color(hex: 0x122019, alpha: 0.94),
                toastBackground: Color(hex: 0x15241B)
            )
        }
        return Palette(
            primaryGreen: Color(hex: 0x2F9E52),
            primaryGreenDark: Color(hex: 0x1F7A3D),
            greenTint: Color(hex: 0xDCF2E3),
            accentGold: Color(hex: 0xE8A33D),
            accentGoldDark: Color(hex: 0xC97F0F),
            destructive: Color(hex: 0xE1584A),
            background: Color(hex: 0xF5FAF6),
            cardBackground: .white,
            chipFill: Color(hex: 0xEFF7F1),
            inputBorder: Color(hex: 0xDCE8DF),
            textPrimary: Color(hex: 0x15241B),
            textSecondary: Color(hex: 0x5C7268),
            borderSoft: Color(hex: 0x2F9E52, alpha: 0.16),
            headerBackground: Color.white.opacity(0.96),
            toastBackground: Color(hex: 0x15241B)
        )
    }

    static var primaryGradient: LinearGradient {
        LinearGradient(
            colors: [Color(hex: 0x2F9E52), Color(hex: 0x1F7A3D)],
            startPoint: .leading,
            endPoint: .trailing
        )
    }

    static var authBackgroundGradient: LinearGradient {
        LinearGradient(
            colors: [Color(hex: 0xDCF2E3), Color(hex: 0x3FAE68), Color(hex: 0x1F7A3D)],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
    }
}

extension Color {
    init(hex: UInt32, alpha: Double = 1) {
        let r = Double((hex >> 16) & 0xFF) / 255
        let g = Double((hex >> 8) & 0xFF) / 255
        let b = Double(hex & 0xFF) / 255
        self.init(.sRGB, red: r, green: g, blue: b, opacity: alpha)
    }
}

struct ThemeEnvironmentKey: EnvironmentKey {
    static let defaultValue = DATheme.palette(isDark: false)
}

extension EnvironmentValues {
    var daPalette: DATheme.Palette {
        get { self[ThemeEnvironmentKey.self] }
        set { self[ThemeEnvironmentKey.self] = newValue }
    }
}

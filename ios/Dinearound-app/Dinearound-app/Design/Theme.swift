import SwiftUI

/// "Midnight Gourmet" — blended design system.
/// See design-system/dinearound/MASTER.md for the full rationale.
/// Dark mode = charcoal shell (Ref A) + coral food accent (Ref B).
/// Light mode = warm peach shell (Ref B) with the same coral accent.
/// DineAround green survives as the secondary "trust" accent; gold is reserved for wishlist/ratings.
enum DATheme {
    static let radiusCard: CGFloat = 26
    static let radiusButton: CGFloat = 18
    static let radiusInput: CGFloat = 16
    static let radiusThumb: CGFloat = 18
    static let radiusNav: CGFloat = 28

    struct Palette {
        let primaryGreen: Color
        let primaryGreenDark: Color
        let greenTint: Color
        let accentCoral: Color
        let accentCoralDark: Color
        let accentCoralGlow: Color
        let accentGold: Color
        let accentGoldDark: Color
        let destructive: Color
        let background: Color
        let cardBackground: Color
        let surfaceRaised: Color
        let chipFill: Color
        let inputBorder: Color
        let textPrimary: Color
        let textSecondary: Color
        let borderSoft: Color
        let headerBackground: Color
        let toastBackground: Color
        let navShell: Color
        let navActive: Color
    }

    static func palette(isDark: Bool) -> Palette {
        if isDark {
            return Palette(
                primaryGreen: Color(hex: 0x2F9E52),
                primaryGreenDark: Color(hex: 0x1F7A3D),
                greenTint: Color(hex: 0x274233),
                accentCoral: Color(hex: 0xFF7A50),
                accentCoralDark: Color(hex: 0xE4572E),
                accentCoralGlow: Color(hex: 0xFF7A50, alpha: 0.35),
                accentGold: Color(hex: 0xF0B429),
                accentGoldDark: Color(hex: 0xC9860F),
                destructive: Color(hex: 0xFF5D5D),
                background: Color(hex: 0x14110E),
                cardBackground: Color(hex: 0x1F1A16),
                surfaceRaised: Color(hex: 0x28211B),
                chipFill: Color(hex: 0x241E19),
                inputBorder: Color(hex: 0x3A2F27),
                textPrimary: Color(hex: 0xF7EEE7),
                textSecondary: Color(hex: 0x9C8F84),
                borderSoft: Color(hex: 0xFFD6BA, alpha: 0.10),
                headerBackground: Color(hex: 0x14110E, alpha: 0.94),
                toastBackground: Color(hex: 0x241E19),
                navShell: Color(hex: 0x0D0B09, alpha: 0.92),
                navActive: Color(hex: 0xFF7A50)
            )
        }
        return Palette(
            primaryGreen: Color(hex: 0x2F9E52),
            primaryGreenDark: Color(hex: 0x1F7A3D),
            greenTint: Color(hex: 0xDCF2E3),
            accentCoral: Color(hex: 0xFF6B3D),
            accentCoralDark: Color(hex: 0xD6491E),
            accentCoralGlow: Color(hex: 0xFF6B3D, alpha: 0.0),
            accentGold: Color(hex: 0xE8A33D),
            accentGoldDark: Color(hex: 0xC97F0F),
            destructive: Color(hex: 0xE1584A),
            background: Color(hex: 0xFDF5F0),
            cardBackground: .white,
            surfaceRaised: .white,
            chipFill: Color(hex: 0xFBE9DF),
            inputBorder: Color(hex: 0xF0DCCF),
            textPrimary: Color(hex: 0x241A14),
            textSecondary: Color(hex: 0x8A776B),
            borderSoft: Color(hex: 0xFF7A50, alpha: 0.14),
            headerBackground: Color(hex: 0xFDF5F0, alpha: 0.96),
            toastBackground: Color(hex: 0x241A14),
            navShell: Color(hex: 0x241A14, alpha: 0.92),
            navActive: Color(hex: 0xFF6B3D)
        )
    }

    static func coralGradient(isDark: Bool) -> LinearGradient {
        let p = palette(isDark: isDark)
        return LinearGradient(colors: [p.accentCoral, p.accentCoralDark], startPoint: .leading, endPoint: .trailing)
    }

    static var primaryGradient: LinearGradient {
        LinearGradient(
            colors: [Color(hex: 0xFF7A50), Color(hex: 0xE4572E)],
            startPoint: .leading,
            endPoint: .trailing
        )
    }

    static var greenGradient: LinearGradient {
        LinearGradient(
            colors: [Color(hex: 0x3FAE68), Color(hex: 0x1F7A3D)],
            startPoint: .leading,
            endPoint: .trailing
        )
    }

    static var goldGradient: LinearGradient {
        LinearGradient(
            colors: [Color(hex: 0xF0B429), Color(hex: 0xC9860F)],
            startPoint: .leading,
            endPoint: .trailing
        )
    }

    /// Hero / detail-band gradient — the brand blend made literal (coral → green diagonal).
    static var heroGradient: LinearGradient {
        LinearGradient(
            colors: [Color(hex: 0xFF7A50), Color(hex: 0x2F9E52)],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
    }

    static func authBackgroundGradient(isDark: Bool) -> LinearGradient {
        if isDark {
            return LinearGradient(
                colors: [Color(hex: 0x14110E), Color(hex: 0x3A2416), Color(hex: 0xE4572E)],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        }
        return LinearGradient(
            colors: [Color(hex: 0xFDF5F0), Color(hex: 0xFFCBA8), Color(hex: 0xFF7A50)],
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

import SwiftUI

enum DAButtonStyleKind {
    case coral
    case green
    case gold
}

struct DAGradientButton: View {
    let title: String
    var style: DAButtonStyleKind = .coral
    var icon: String?
    let action: () -> Void

    @Environment(\.daPalette) private var palette
    @Environment(\.colorScheme) private var colorScheme

    private var gradient: LinearGradient {
        switch style {
        case .coral: return DATheme.coralGradient(isDark: colorScheme == .dark)
        case .green: return DATheme.greenGradient
        case .gold: return DATheme.goldGradient
        }
    }

    var body: some View {
        Button(action: action) {
            HStack(spacing: 8) {
                if let icon {
                    Image(systemName: icon)
                        .font(.system(size: 14, weight: .bold))
                }
                Text(title)
                    .font(.system(size: 15, weight: .bold))
            }
            .foregroundStyle(.white)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 14)
            .background(gradient)
            .clipShape(RoundedRectangle(cornerRadius: DATheme.radiusButton))
            .shadow(color: style == .coral ? palette.accentCoralGlow : .clear, radius: 16, y: 6)
        }
        .buttonStyle(.plain)
    }
}

struct DAOutlineButton: View {
    let title: String
    var style: DAButtonStyleKind = .coral
    var icon: String?
    let action: () -> Void

    @Environment(\.daPalette) private var palette

    private var tint: Color {
        switch style {
        case .coral: return palette.accentCoral
        case .green: return palette.primaryGreen
        case .gold: return palette.accentGoldDark
        }
    }

    var body: some View {
        Button(action: action) {
            HStack(spacing: 8) {
                if let icon {
                    Image(systemName: icon)
                        .font(.system(size: 13, weight: .bold))
                }
                Text(title)
                    .font(.system(size: 14, weight: .bold))
            }
            .foregroundStyle(tint)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 12)
            .background(palette.chipFill)
            .overlay(
                RoundedRectangle(cornerRadius: DATheme.radiusButton)
                    .stroke(tint.opacity(0.45), lineWidth: 2)
            )
            .clipShape(RoundedRectangle(cornerRadius: DATheme.radiusButton))
        }
        .buttonStyle(.plain)
    }
}

struct DAIconButton: View {
    let systemName: String
    var tint: Color? = nil
    let action: () -> Void

    @Environment(\.daPalette) private var palette

    var body: some View {
        Button(action: action) {
            Image(systemName: systemName)
                .font(.system(size: 14, weight: .semibold))
                .foregroundStyle(tint ?? palette.textSecondary)
                .frame(width: 34, height: 34)
                .background(palette.chipFill)
                .clipShape(Circle())
        }
        .buttonStyle(.plain)
    }
}

struct DACard<Content: View>: View {
    @Environment(\.daPalette) private var palette
    @ViewBuilder let content: Content

    var body: some View {
        content
            .padding(16)
            .background(palette.cardBackground)
            .clipShape(RoundedRectangle(cornerRadius: DATheme.radiusCard))
            .overlay(
                RoundedRectangle(cornerRadius: DATheme.radiusCard)
                    .stroke(palette.borderSoft, lineWidth: 1.5)
            )
            .shadow(color: .black.opacity(0.28), radius: 18, y: 8)
    }
}

struct DAToast: View {
    let message: String
    @Environment(\.daPalette) private var palette

    var body: some View {
        Text(message)
            .font(.system(size: 13, weight: .bold))
            .foregroundStyle(.white)
            .padding(.horizontal, 18)
            .padding(.vertical, 10)
            .background(palette.toastBackground)
            .clipShape(Capsule())
            .shadow(color: .black.opacity(0.3), radius: 12, y: 4)
    }
}

struct StarRatingPicker: View {
    @Binding var rating: Int
    @Environment(\.daPalette) private var palette

    var body: some View {
        HStack(spacing: 6) {
            ForEach(1...5, id: \.self) { star in
                Button {
                    rating = star
                } label: {
                    Image(systemName: star <= rating ? "star.fill" : "star")
                        .font(.system(size: 26))
                        .foregroundStyle(star <= rating ? palette.accentGold : palette.inputBorder)
                }
                .buttonStyle(.plain)
            }
        }
    }
}

struct SectionTitle: View {
    let prefix: String
    let accent: String
    var accentStyle: DAButtonStyleKind = .coral

    @Environment(\.daPalette) private var palette

    private var accentColor: Color {
        switch accentStyle {
        case .coral: return palette.accentCoral
        case .green: return palette.primaryGreen
        case .gold: return palette.accentGold
        }
    }

    var body: some View {
        (
            Text(prefix)
                .foregroundStyle(palette.textPrimary)
            + Text(accent)
                .foregroundStyle(accentColor)
        )
        .font(.system(size: 22, weight: .black))
    }
}

/// Small pill used for cuisine/price/distance tags.
struct DATag: View {
    let text: String
    var icon: String?
    var style: DAButtonStyleKind = .coral
    var filled: Bool = false

    @Environment(\.daPalette) private var palette

    private var tint: Color {
        switch style {
        case .coral: return palette.accentCoral
        case .green: return palette.primaryGreen
        case .gold: return palette.accentGold
        }
    }

    var body: some View {
        HStack(spacing: 4) {
            if let icon {
                Image(systemName: icon).font(.system(size: 10, weight: .bold))
            }
            Text(text).font(.system(size: 11, weight: .heavy))
        }
        .foregroundStyle(filled ? .white : tint)
        .padding(.horizontal, 10)
        .padding(.vertical, 6)
        .background(filled ? tint : tint.opacity(0.16))
        .clipShape(Capsule())
    }
}

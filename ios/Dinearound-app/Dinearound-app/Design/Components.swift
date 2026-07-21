import SwiftUI

struct DAGradientButton: View {
    let title: String
    var isGold: Bool = false
    let action: () -> Void

    @Environment(\.daPalette) private var palette

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.system(size: 15, weight: .bold))
                .foregroundStyle(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
                .background(
                    Group {
                        if isGold {
                            LinearGradient(
                                colors: [palette.accentGold, palette.accentGoldDark],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        } else {
                            DATheme.primaryGradient
                        }
                    }
                )
                .clipShape(RoundedRectangle(cornerRadius: DATheme.radiusButton))
        }
        .buttonStyle(.plain)
    }
}

struct DAOutlineButton: View {
    let title: String
    var gold: Bool = false
    let action: () -> Void

    @Environment(\.daPalette) private var palette

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.system(size: 14, weight: .bold))
                .foregroundStyle(gold ? palette.accentGoldDark : palette.primaryGreen)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 12)
                .background(palette.chipFill)
                .overlay(
                    RoundedRectangle(cornerRadius: DATheme.radiusButton)
                        .stroke(gold ? palette.accentGold : palette.primaryGreen.opacity(0.4), lineWidth: 2)
                )
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
                    .stroke(palette.borderSoft, lineWidth: 2)
            )
            .shadow(color: .black.opacity(0.05), radius: 10, y: 2)
    }
}

struct DAToast: View {
    let message: String

    var body: some View {
        Text(message)
            .font(.system(size: 13, weight: .bold))
            .foregroundStyle(.white)
            .padding(.horizontal, 18)
            .padding(.vertical, 10)
            .background(Color(hex: 0x15241B))
            .clipShape(Capsule())
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
    var accentColor: Color = Color(hex: 0x2F9E52)

    @Environment(\.daPalette) private var palette

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

import SwiftData
import SwiftUI

struct LogView: View {
    @Environment(AppState.self) private var appState
    @Environment(\.daPalette) private var palette
    @Environment(\.modelContext) private var modelContext
    @Query(sort: \VisitRecord.visitDate, order: .reverse) private var visits: [VisitRecord]

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                HStack {
                    SectionTitle(prefix: "Visit ", accent: "Log")
                    Spacer()
                    Button(appState.showLogForm ? "Cancel" : "+ Log Visit") {
                        if appState.showLogForm {
                            appState.showLogForm = false
                            appState.visitDraft = VisitDraft()
                        } else {
                            appState.visitDraft = VisitDraft()
                            appState.showLogForm = true
                        }
                    }
                    .font(.system(size: 13, weight: .heavy))
                    .foregroundStyle(.white)
                    .padding(.horizontal, 14)
                    .padding(.vertical, 10)
                    .background(DATheme.primaryGradient)
                    .clipShape(RoundedRectangle(cornerRadius: DATheme.radiusButton))
                    .buttonStyle(.plain)
                }

                if appState.showLogForm {
                    logForm
                }

                if visits.isEmpty && !appState.showLogForm {
                    VStack(spacing: 8) {
                        Text("📝").font(.system(size: 44))
                        Text("You haven't logged any visits yet.")
                            .font(.system(size: 15, weight: .heavy))
                            .foregroundStyle(palette.textSecondary)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 40)
                } else {
                    ForEach(visits) { visit in
                        visitCard(visit)
                    }
                }
            }
            .padding(.horizontal, 18)
            .padding(.vertical, 20)
            .padding(.bottom, 80)
        }
        .background(palette.background)
    }

    private var logForm: some View {
        DACard {
            VStack(alignment: .leading, spacing: 14) {
                labeledField("Restaurant Name *") {
                    TextField("Restaurant", text: Bindable(appState).visitDraft.restaurantName)
                        .padding(12)
                        .background(palette.chipFill)
                        .clipShape(RoundedRectangle(cornerRadius: DATheme.radiusInput))
                        .overlay(RoundedRectangle(cornerRadius: DATheme.radiusInput).stroke(palette.inputBorder, lineWidth: 2))
                }

                labeledField("Visit Date *") {
                    DatePicker("", selection: Bindable(appState).visitDraft.visitDate, displayedComponents: .date)
                        .labelsHidden()
                }

                labeledField("Rating") {
                    StarRatingPicker(rating: Bindable(appState).visitDraft.rating)
                }

                labeledField("Notes") {
                    TextField("What did you think?", text: Bindable(appState).visitDraft.notes, axis: .vertical)
                        .lineLimit(3...6)
                        .padding(12)
                        .background(palette.chipFill)
                        .clipShape(RoundedRectangle(cornerRadius: DATheme.radiusInput))
                        .overlay(RoundedRectangle(cornerRadius: DATheme.radiusInput).stroke(palette.inputBorder, lineWidth: 2))
                }

                HStack(spacing: 10) {
                    DAGradientButton(title: appState.visitDraft.editingVisitId == nil ? "Save Visit" : "Update Visit") {
                        saveVisit()
                    }
                    DAOutlineButton(title: "Cancel") {
                        appState.showLogForm = false
                        appState.visitDraft = VisitDraft()
                    }
                }
            }
        }
    }

    private func labeledField<Content: View>(_ title: String, @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(title)
                .font(.system(size: 13, weight: .bold))
                .foregroundStyle(palette.textPrimary)
            content()
        }
    }

    private func visitCard(_ visit: VisitRecord) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(visit.restaurantName)
                        .font(.system(size: 16, weight: .black))
                    Text(visit.visitDate.formatted(date: .abbreviated, time: .omitted))
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundStyle(palette.textSecondary)
                }
                Spacer()
                HStack(spacing: 12) {
                    ShareLink(item: appState.shareText(for: visit)) {
                        Text("📤").font(.system(size: 15))
                    }
                    Button {
                        appState.visitDraft = VisitDraft(
                            restaurantName: visit.restaurantName,
                            restaurantId: visit.restaurantId,
                            visitDate: visit.visitDate,
                            rating: visit.rating,
                            notes: visit.notes,
                            editingVisitId: visit.id
                        )
                        appState.showLogForm = true
                    } label: {
                        Text("✏️").font(.system(size: 15))
                    }
                    Button {
                        modelContext.delete(visit)
                    } label: {
                        Text("🗑️").font(.system(size: 15))
                    }
                }
                .buttonStyle(.plain)
            }

            if visit.rating > 0 {
                Text(String(repeating: "★", count: visit.rating) + " \(visit.rating)/5")
                    .font(.system(size: 12, weight: .bold))
                    .foregroundStyle(.white)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 6)
                    .background(DATheme.primaryGradient)
                    .clipShape(Capsule())
            }

            if !visit.notes.isEmpty {
                Text(visit.notes)
                    .font(.system(size: 13, weight: .medium))
                    .foregroundStyle(palette.textPrimary)
            }
        }
        .padding(16)
        .background(palette.cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: DATheme.radiusCard))
        .overlay(RoundedRectangle(cornerRadius: DATheme.radiusCard).stroke(palette.borderSoft, lineWidth: 2))
    }

    private func saveVisit() {
        let name = appState.visitDraft.restaurantName.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !name.isEmpty else { return }

        if let editId = appState.visitDraft.editingVisitId,
           let existing = visits.first(where: { $0.id == editId }) {
            existing.restaurantName = name
            existing.restaurantId = appState.visitDraft.restaurantId
            existing.visitDate = appState.visitDraft.visitDate
            existing.rating = appState.visitDraft.rating
            existing.notes = appState.visitDraft.notes
        } else {
            let record = VisitRecord(
                restaurantName: name,
                restaurantId: appState.visitDraft.restaurantId,
                visitDate: appState.visitDraft.visitDate,
                rating: appState.visitDraft.rating,
                notes: appState.visitDraft.notes
            )
            modelContext.insert(record)
        }

        appState.showLogForm = false
        appState.visitDraft = VisitDraft()
        appState.showToast("Visit saved")
    }
}

#Preview {
    LogView()
        .environment(AppState())
        .modelContainer(for: VisitRecord.self, inMemory: true)
}

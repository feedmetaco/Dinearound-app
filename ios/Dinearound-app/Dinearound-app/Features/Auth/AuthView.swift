import SwiftUI
import SwiftData

struct AuthView: View {
    @Environment(AppState.self) private var appState
    @Environment(\.colorScheme) private var colorScheme
    @Environment(\.modelContext) private var modelContext
    @State private var isSignUp = false
    @State private var email = ""
    @State private var password = ""
    @State private var loading = false
    @State private var errorMessage: String?

    private var palette: DATheme.Palette {
        DATheme.palette(isDark: colorScheme == .dark)
    }

    var body: some View {
        ZStack {
            DATheme.authBackgroundGradient(isDark: colorScheme == .dark)
                .ignoresSafeArea()

            ScrollView {
                VStack(spacing: 24) {
                    HStack(spacing: 12) {
                        Circle()
                            .fill(.white.opacity(0.22))
                            .frame(width: 48, height: 48)
                            .overlay(
                                Image(systemName: "fork.knife")
                                    .font(.system(size: 20, weight: .bold))
                                    .foregroundStyle(.white)
                            )
                        Text("DineAround")
                            .font(.system(size: 28, weight: .black))
                            .foregroundStyle(.white)
                    }
                    .padding(.top, 40)

                    Picker("Mode", selection: $isSignUp) {
                        Text("Log in").tag(false)
                        Text("Sign up").tag(true)
                    }
                    .pickerStyle(.segmented)
                    .padding(4)
                    .background(.white.opacity(0.22))
                    .clipShape(RoundedRectangle(cornerRadius: 18))

                    VStack(alignment: .leading, spacing: 16) {
                        if let errorMessage {
                            Text(errorMessage)
                                .font(.system(size: 13, weight: .semibold))
                                .foregroundStyle(.red)
                        }

                        VStack(alignment: .leading, spacing: 6) {
                            Text("Email")
                                .font(.system(size: 13, weight: .bold))
                                .foregroundStyle(palette.textPrimary)
                            TextField("you@example.com", text: $email)
                                .textInputAutocapitalization(.never)
                                .keyboardType(.emailAddress)
                                .padding(12)
                                .background(palette.chipFill)
                                .clipShape(RoundedRectangle(cornerRadius: DATheme.radiusInput))
                                .overlay(
                                    RoundedRectangle(cornerRadius: DATheme.radiusInput)
                                        .stroke(palette.inputBorder, lineWidth: 2)
                                )
                        }

                        VStack(alignment: .leading, spacing: 6) {
                            Text("Password")
                                .font(.system(size: 13, weight: .bold))
                                .foregroundStyle(palette.textPrimary)
                            SecureField("••••••••", text: $password)
                                .padding(12)
                                .background(palette.chipFill)
                                .clipShape(RoundedRectangle(cornerRadius: DATheme.radiusInput))
                                .overlay(
                                    RoundedRectangle(cornerRadius: DATheme.radiusInput)
                                        .stroke(palette.inputBorder, lineWidth: 2)
                                )
                        }

                        DAGradientButton(
                            title: loading ? "Please wait…" : (isSignUp ? "Create account" : "Log in"),
                            style: .coral
                        ) {
                            submitAuth()
                        }
                        .disabled(loading || email.isEmpty || password.count < 6)
                    }
                    .padding(24)
                    .background(palette.cardBackground)
                    .clipShape(RoundedRectangle(cornerRadius: 28))
                    .shadow(color: .black.opacity(0.25), radius: 30, y: 10)

                    Button {
                        appState.continueAsGuest()
                    } label: {
                        HStack(spacing: 6) {
                            Image(systemName: "person.fill")
                                .font(.system(size: 12, weight: .semibold))
                            Text("Continue as guest (local only)")
                                .font(.system(size: 14, weight: .semibold))
                                .underline()
                        }
                        .foregroundStyle(.white)
                    }
                    .buttonStyle(.plain)
                }
                .padding(.horizontal, 28)
                .padding(.bottom, 44)
            }
        }
    }

    private func submitAuth() {
        loading = true
        errorMessage = nil
        Task {
            do {
                if AppConfig.isAPIEnabled {
                    if isSignUp {
                        _ = try await APIClient.shared.register(email: email, password: password)
                    } else {
                        _ = try await APIClient.shared.login(email: email, password: password)
                    }
                }
                appState.signIn(email: email, password: password, isSignUp: isSignUp)
                await SyncService.pullFromServer(modelContext: modelContext, appState: appState)
            } catch {
                errorMessage = error.localizedDescription
            }
            loading = false
        }
    }
}

#Preview {
    AuthView()
        .environment(AppState())
}

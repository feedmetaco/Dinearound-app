import SwiftUI

struct AuthView: View {
    @Environment(AppState.self) private var appState
    @State private var isSignUp = false
    @State private var email = ""
    @State private var password = ""

    var body: some View {
        ZStack {
            DATheme.authBackgroundGradient
                .ignoresSafeArea()

            ScrollView {
                VStack(spacing: 24) {
                    HStack(spacing: 12) {
                        Circle()
                            .fill(.white.opacity(0.25))
                            .frame(width: 44, height: 44)
                            .overlay(Text("🍽️").font(.title2))
                        Text("DineAround")
                            .font(.system(size: 26, weight: .black))
                            .foregroundStyle(.white)
                    }
                    .padding(.top, 40)

                    Picker("Mode", selection: $isSignUp) {
                        Text("Log in").tag(false)
                        Text("Sign up").tag(true)
                    }
                    .pickerStyle(.segmented)
                    .padding(4)
                    .background(.white.opacity(0.25))
                    .clipShape(RoundedRectangle(cornerRadius: 16))

                    VStack(alignment: .leading, spacing: 16) {
                        VStack(alignment: .leading, spacing: 6) {
                            Text("Email")
                                .font(.system(size: 13, weight: .bold))
                            TextField("you@example.com", text: $email)
                                .textInputAutocapitalization(.never)
                                .keyboardType(.emailAddress)
                                .padding(12)
                                .background(Color.white)
                                .clipShape(RoundedRectangle(cornerRadius: DATheme.radiusInput))
                                .overlay(
                                    RoundedRectangle(cornerRadius: DATheme.radiusInput)
                                        .stroke(Color(hex: 0xDCE8DF), lineWidth: 2)
                                )
                        }

                        VStack(alignment: .leading, spacing: 6) {
                            Text("Password")
                                .font(.system(size: 13, weight: .bold))
                            SecureField("••••••••", text: $password)
                                .padding(12)
                                .background(Color.white)
                                .clipShape(RoundedRectangle(cornerRadius: DATheme.radiusInput))
                                .overlay(
                                    RoundedRectangle(cornerRadius: DATheme.radiusInput)
                                        .stroke(Color(hex: 0xDCE8DF), lineWidth: 2)
                                )
                        }

                        DAGradientButton(title: isSignUp ? "Create account" : "Log in") {
                            appState.signIn(email: email, password: password, isSignUp: isSignUp)
                        }
                    }
                    .padding(24)
                    .background(Color.white)
                    .clipShape(RoundedRectangle(cornerRadius: 24))
                    .shadow(color: .black.opacity(0.15), radius: 30, y: 10)

                    Button("Continue as guest") {
                        appState.continueAsGuest()
                    }
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundStyle(.white)
                    .underline()
                }
                .padding(.horizontal, 28)
                .padding(.bottom, 44)
            }
        }
    }
}

#Preview {
    AuthView()
        .environment(AppState())
}

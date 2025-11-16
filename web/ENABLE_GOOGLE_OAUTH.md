# Enable Google OAuth in Supabase - Quick Fix 🔧

You're getting this error because Google OAuth isn't enabled in your Supabase project yet.

## Quick Fix (5 minutes)

### Step 1: Get Google OAuth Credentials

1. **Go to**: https://console.cloud.google.com
2. **Select your project** (the one you created for Places API)
3. **Go to**: "APIs & Services" → "Credentials" (left sidebar)
4. **Find your OAuth 2.0 Client ID** (or create one if you don't have it):
   - If you don't have one: Click "Create Credentials" → "OAuth client ID"
   - Application type: **"Web application"**
   - Name: `DineAround Web`
   - **Authorized redirect URIs**: Add this (replace `zkusmstloeohzedpvruw` with your Supabase project ref):
     ```
     https://zkusmstloeohzedpvruw.supabase.co/auth/v1/callback
     ```
   - Click "Create"
   - **Copy** the "Client ID" and "Client secret"

### Step 2: Enable Google in Supabase

1. **Go to**: https://supabase.com/dashboard
2. **Select your project**: DineAround
3. **Go to**: "Authentication" → "Providers" (left sidebar)
4. **Find**: "Google" in the list
5. **Toggle**: Enable Google provider (switch it ON)
6. **Paste**:
   - **Client ID (for OAuth)**: Your Google OAuth Client ID
   - **Client Secret (for OAuth)**: Your Google OAuth Client Secret
7. **Click**: "Save"

### Step 3: Test Again

1. **Go back to**: http://localhost:3000
2. **Click**: "Sign in" or "Sign up"
3. **Click**: "Google" button
4. **It should work now!**

---

## Alternative: Use Email/Password for Now

If you want to test without Google OAuth:

1. **On the login page**, use the email/password form instead
2. **Sign up** with your email
3. **Check your email** for verification link (if email confirmation is enabled)
4. **Or** disable email confirmation in Supabase:
   - Go to: Authentication → Settings
   - Find: "Enable email confirmations"
   - Toggle it OFF (for testing)
   - Click "Save"

---

## Troubleshooting

### "Invalid redirect URI" error
- ✅ Make sure the redirect URI in Google Console matches exactly:
  ```
  https://zkusmstloeohzedpvruw.supabase.co/auth/v1/callback
  ```
- ✅ No trailing slash, no extra spaces

### "Client ID not found" error
- ✅ Make sure you're using the OAuth Client ID (not the Places API key)
- ✅ They're different! OAuth Client ID starts with numbers, API key starts with `AIza...`

### Still not working?
- ✅ Wait 5 minutes after saving (takes time to propagate)
- ✅ Clear browser cache and try again
- ✅ Check Supabase logs: Authentication → Logs (left sidebar)

---

**Once Google OAuth works, you can test the restaurant search!**


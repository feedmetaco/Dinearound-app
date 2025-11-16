# Environment Variables - Quick Setup ✅

## Your API Key

Add this line to your `web/.env.local` file:

```env
GOOGLE_PLACES_API_KEY=AIzaSyChYmTs4odIWSxZYR4CKtjYQASz_UCBZ_A
```

## Complete .env.local File

Your `web/.env.local` should contain:

```env
NEXT_PUBLIC_SUPABASE_URL=https://zkusmstloeohzedpvruw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprdXNtc3Rsb2VvaHplZHB2cnV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyNjY4ODUsImV4cCI6MjA3ODg0Mjg4NX0.9n0ZMg9DN_FcGwNaY4c2vfJy7onQR9rQjqclykNPLmA
GOOGLE_PLACES_API_KEY=AIzaSyChYmTs4odIWSxZYR4CKtjYQASz_UCBZ_A
```

## Important Security Note

I noticed your API key has 31 APIs enabled. For better security, you should:

1. Go back to Google Cloud Console → APIs & Services → Credentials
2. Click on your API key
3. Under "API restrictions", select only:
   - ✅ **Places API (New)** (this is the only one you need)
4. Click "Save"

This prevents the key from being used for other Google services if it's ever exposed.

## Test It

1. **Restart your dev server** (important!):
   ```bash
   # Stop with Ctrl+C, then:
   cd web
   npm run dev
   ```

2. **Open**: http://localhost:3000
3. **Sign in** to your app
4. **Go to**: "Nearby" tab
5. **Search for**: "pizza" or "restaurant"
6. **You should see**: Real restaurants from Google Places!

## Troubleshooting

### "API key not configured" error
- ✅ Make sure `.env.local` is in the `web` folder (not root)
- ✅ Restart dev server after adding the key
- ✅ Check for typos in the key

### "This API project is not authorized"
- ✅ Make sure "Places API (New)" is enabled in Google Cloud Console
- ✅ Wait 5 minutes after enabling (takes time to propagate)

### No results appear
- ✅ Check browser console (F12) for errors
- ✅ Make sure you're signed in
- ✅ Try searching for "restaurant" (generic term works best)

---

**Next**: Once this works, we'll move to Step 3 - Database CRUD operations!


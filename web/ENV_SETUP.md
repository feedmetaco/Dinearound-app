# Environment Variables Setup - Quick Guide 🚀

Your database is ready! Now let's connect your app to it.

## Step 1: Create `.env.local` File

1. **Go to your `web` folder** in your code editor
2. **Create a new file** called `.env.local` (the dot at the start is important!)
3. **Copy and paste this** (replace with YOUR values):

```env
NEXT_PUBLIC_SUPABASE_URL=https://zkusmstloeohzedpvruw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprdXNtc3Rsb2VvaHplZHB2cnV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyNjY4ODUsImV4cCI6MjA3ODg0Mjg4NX0.9n0ZMg9DN_FcGwNaY4c2vfJy7onQR9rQjqclykNPLmA
```

4. **Save the file**

## Step 2: Test It Works

1. **Open terminal** in your `web` folder
2. **Run**:
   ```bash
   npm run dev
   ```
3. **Open**: http://localhost:3000
4. **Try to sign up** - it should work now!

## ✅ Done!

Your app is now connected to Supabase! 

**Next**: We'll set up Google Places API so you can search for real restaurants.


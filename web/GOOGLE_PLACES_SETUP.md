# Google Places API Setup - ELI5 Edition 🗺️

This guide will help you set up Google Places API so your app can search for real restaurants.

## What is Google Places API?
It's Google's service that knows about millions of restaurants worldwide. Your app will ask Google "find restaurants near me" and Google will respond with real data.

---

## Step 1: Create Google Cloud Project (5 minutes)

### What you're doing:
Creating a "workspace" in Google Cloud where you'll enable the Places API.

### Steps:
1. **Go to**: https://console.cloud.google.com
2. **Sign in** with your Google account
3. **Click**: "Select a project" (top bar) → "New Project"
4. **Fill in**:
   - **Project name**: `DineAround` (or whatever you want)
   - **Organization**: Leave as default
5. **Click**: "Create"
6. **Wait**: 10-20 seconds for project to be created
7. **Select** your new project from the dropdown (top bar)

**✅ Done when**: You see your project name in the top bar

---

## Step 2: Enable Places API (New) (2 minutes)

### What you're doing:
Turning on the restaurant search feature.

### Steps:
1. **In Google Cloud Console**, go to **"APIs & Services"** → **"Library"** (left sidebar)
2. **Search for**: "Places API (New)"
3. **Click** on "Places API (New)" (the one that says "New" in the name)
4. **Click**: "Enable" (blue button)
5. **Wait**: 10-20 seconds

**✅ Done when**: You see "API enabled" message

---

## Step 3: Create API Key (3 minutes)

### What you're doing:
Getting a "password" that lets your app talk to Google.

### Steps:
1. **Go to**: "APIs & Services" → "Credentials" (left sidebar)
2. **Click**: "+ CREATE CREDENTIALS" (top bar)
3. **Select**: "API key"
4. **Copy the key** that appears (it starts with `AIza...`)
5. **Click**: "Restrict key" (to make it more secure)

### Restrict the API Key (Important for Security):
1. **Under "API restrictions"**:
   - Select "Restrict key"
   - Check only: **"Places API (New)"**
2. **Under "Application restrictions"**:
   - Select "HTTP referrers (web sites)"
   - Click "Add an item"
   - Add these (one per line):
     ```
     http://localhost:3000/*
     https://*.vercel.app/*
     https://dinearound.app/*
     ```
3. **Click**: "Save"

**✅ Done when**: You have your API key copied and restricted

---

## Step 4: Add API Key to Your App (1 minute)

### What you're doing:
Telling your app where to find the Google API key.

### Steps:
1. **Open** your `.env.local` file in the `web` folder
2. **Add this line** (replace `YOUR_API_KEY` with the key you copied):
   ```env
   GOOGLE_PLACES_API_KEY=YOUR_API_KEY_HERE
   ```
3. **Or if you want it public** (for client-side use):
   ```env
   NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=YOUR_API_KEY_HERE
   ```
4. **Save the file**

**Example** (your file should look like this):
```env
NEXT_PUBLIC_SUPABASE_URL=https://zkusmstloeohzedpvruw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
GOOGLE_PLACES_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## Step 5: Test It Works (2 minutes)

### What you're doing:
Making sure everything is connected.

### Steps:
1. **Restart your dev server** (important!):
   ```bash
   # Stop the server (Ctrl+C)
   # Then start again:
   cd web
   npm run dev
   ```
2. **Open**: http://localhost:3000
3. **Sign in** to your app
4. **Go to**: "Nearby" tab
5. **Search for**: "pizza" or "restaurant"
6. **You should see**: Real restaurants appear!

**✅ Done when**: You see real restaurant results (not mock data)

---

## Troubleshooting

### "API key not configured" error
- ✅ Check your `.env.local` file has `GOOGLE_PLACES_API_KEY=...`
- ✅ Make sure there are no extra spaces
- ✅ Restart your dev server after adding the key

### "This API project is not authorized" error
- ✅ Go back to Step 2 and make sure "Places API (New)" is enabled
- ✅ Wait 5 minutes after enabling (sometimes takes time to propagate)

### "API key not valid" error
- ✅ Check you copied the full key (starts with `AIza...`)
- ✅ Make sure the key is not restricted to wrong domains
- ✅ Check the key restrictions allow "Places API (New)"

### No results appear
- ✅ Check browser console for errors (F12 → Console tab)
- ✅ Make sure you're signed in
- ✅ Try a different search term (e.g., "restaurant" instead of "pizza")

---

## Cost Information

**Free Tier**: $200 credit per month (covers ~11,000 searches)

**After Free Tier**:
- Text Search: $17 per 1,000 requests
- Place Details: $17 per 1,000 requests

**For MVP**: You'll likely stay in free tier for months!

---

## What's Next?

Once this works, your app can:
- ✅ Search for real restaurants
- ✅ Show ratings, prices, photos
- ✅ Cache results in your database (saves API calls)

**Next step**: We'll connect the database so visits and wishlists actually save!

---

## Quick Reference

**Google Cloud Console**: https://console.cloud.google.com  
**Places API Docs**: https://developers.google.com/maps/documentation/places/web-service  
**API Key Location**: APIs & Services → Credentials

---

**Need help?** Check Google's docs: https://developers.google.com/maps/documentation/places/web-service/get-api-key


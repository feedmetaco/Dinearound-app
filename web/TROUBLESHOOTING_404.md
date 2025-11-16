# Fixing 404 Error - Quick Guide 🔧

## The server is running, but you're getting 404. Here's how to fix it:

### Step 1: Check the Exact URL

Make sure you're accessing:
- ✅ **http://localhost:3000** (not https, not a different port)
- ❌ NOT http://localhost:3000/some-page-that-doesnt-exist

### Step 2: Try These URLs in Order

1. **http://localhost:3000** 
   - Should redirect to `/auth/login` (if not logged in)
   - Or redirect to `/app/nearby` (if logged in)

2. **http://localhost:3000/auth/login**
   - Should show the login page directly

3. **http://localhost:3000/auth/signup**
   - Should show the signup page

### Step 3: Restart the Dev Server

Sometimes Next.js needs a fresh start:

1. **Stop the server**: Press `Ctrl+C` in the terminal where it's running
2. **Clear the cache**:
   ```bash
   cd web
   Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
   ```
3. **Start again**:
   ```bash
   npm run dev
   ```
4. **Wait** for "Ready on http://localhost:3000"
5. **Try again**: http://localhost:3000

### Step 4: Check Browser Console

1. **Open browser**: http://localhost:3000
2. **Press F12** to open Developer Tools
3. **Go to Console tab**
4. **Look for red errors** - share them with me if you see any

### Step 5: Check Terminal for Errors

Look at the terminal where `npm run dev` is running:
- ✅ Should see: "Ready on http://localhost:3000"
- ❌ If you see red errors, share them with me

---

## Common Issues

### "Cannot GET /some-page"
- ✅ This means the route doesn't exist
- ✅ Try: http://localhost:3000/auth/login instead

### Blank page / nothing loads
- ✅ Check browser console (F12)
- ✅ Check terminal for errors
- ✅ Make sure `.env.local` file exists with Supabase keys

### Redirect loop
- ✅ Clear browser cache
- ✅ Try incognito/private window
- ✅ Check `.env.local` has correct Supabase URL and key

---

## Quick Test

Try this exact URL:
```
http://localhost:3000/auth/login
```

If this works, the app is fine - you just need to use the correct URL!

---

**What URL are you trying to access?** Share it and I'll help debug further!


# Supabase Setup Guide - ELI5 Edition 🎯

This guide will help you set up your Supabase database in simple steps.

## What is Supabase?
Think of Supabase as your app's brain - it stores all your restaurant data, user accounts, and handles login. It's like a smart filing cabinet in the cloud.

---

## Step 1: Create Your Supabase Account (5 minutes)

### What you're doing:
Creating a free account to get your database.

### Steps:
1. **Go to**: https://supabase.com
2. **Click**: "Start your project" (big green button)
3. **Sign up** with:
   - GitHub account (easiest), OR
   - Email address
4. **Verify your email** if you used email signup

**✅ Done when**: You see the Supabase dashboard

---

## Step 2: Create a New Project (2 minutes)

### What you're doing:
Creating a new "workspace" for your DineAround app.

### Steps:
1. **Click**: "New Project" (top right)
2. **Fill in**:
   - **Name**: `DineAround` (or whatever you want)
   - **Database Password**: 
     - Click "Generate a password" (save this somewhere safe!)
     - Or create your own strong password
   - **Region**: Choose closest to you (e.g., "US East" if you're in USA)
3. **Click**: "Create new project"
4. **Wait**: 2-3 minutes while Supabase sets up your database

**✅ Done when**: You see "Setting up your project..." then it finishes

---

## Step 3: Get Your API Keys (2 minutes)

### What you're doing:
Getting the "passwords" your app needs to talk to Supabase.

### Steps:
1. **In your project**, click **"Settings"** (gear icon, bottom left)
2. **Click**: "API" (in the left sidebar)
3. **Find these two things**:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public key** (long string starting with `eyJ...`)

4. **Copy both** and save them somewhere safe (we'll use them next)

**✅ Done when**: You have both the URL and the key copied

---

## Step 4: Run the Database Schema (5 minutes)

### What you're doing:
Creating all the "folders" (tables) where your app will store data.

### Steps:
1. **In Supabase**, click **"SQL Editor"** (left sidebar, looks like `</>`)
2. **Click**: "New query" (top right)
3. **Open the file**: `web/supabase/migrations/001_initial_schema.sql` in your code editor
4. **Copy ALL the text** from that file (Ctrl+A, Ctrl+C)
5. **Paste it** into the Supabase SQL Editor
6. **Click**: "Run" (or press Ctrl+Enter)
7. **Wait**: Should finish in 2-3 seconds
8. **Check**: You should see "Success. No rows returned"

**✅ Done when**: You see "Success" message

---

## Step 5: Verify Tables Were Created (1 minute)

### What you're doing:
Making sure everything was created correctly.

### Steps:
1. **Click**: "Table Editor" (left sidebar, looks like a table icon)
2. **You should see 5 tables**:
   - ✅ `users`
   - ✅ `restaurants`
   - ✅ `visits`
   - ✅ `wishlists`
   - ✅ `ocr_jobs`

**✅ Done when**: You see all 5 tables listed

---

## Step 6: Set Up Authentication (Google Login) - Optional but Recommended (10 minutes)

### What you're doing:
Allowing users to sign in with their Google account (easier than email/password).

### Steps:

#### Part A: Get Google OAuth Credentials
1. **Go to**: https://console.cloud.google.com
2. **Create a project** (or use existing):
   - Click "Select a project" → "New Project"
   - Name: `DineAround`
   - Click "Create"
3. **Enable Google+ API**:
   - Go to "APIs & Services" → "Library"
   - Search "Google+ API"
   - Click "Enable"
4. **Create OAuth credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Name: `DineAround Web`
   - **Authorized redirect URIs**: Add this (replace `YOUR_PROJECT_REF` with your Supabase project ref):
     ```
     https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
     ```
     (Find YOUR_PROJECT_REF in your Supabase URL: `https://YOUR_PROJECT_REF.supabase.co`)
   - Click "Create"
   - **Copy** the "Client ID" and "Client secret"

#### Part B: Add to Supabase
1. **In Supabase**, go to **"Authentication"** → **"Providers"** (left sidebar)
2. **Find**: "Google" in the list
3. **Toggle**: Enable Google provider
4. **Paste**:
   - Client ID (from Google)
   - Client secret (from Google)
5. **Click**: "Save"

**✅ Done when**: Google provider shows as "Enabled"

---

## Step 7: Add Environment Variables to Your Code (2 minutes)

### What you're doing:
Telling your app where to find Supabase.

### Steps:
1. **In your project**, create a file: `web/.env.local`
2. **Add these lines** (replace with YOUR values from Step 3):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```
3. **Save the file**

**⚠️ Important**: 
- Never commit `.env.local` to Git (it's already in `.gitignore`)
- These are safe to share (they're public keys)
- The `SUPABASE_SERVICE_ROLE_KEY` is secret - only use it in server-side code

**✅ Done when**: File is saved with your values

---

## Step 8: Test It Works (1 minute)

### What you're doing:
Making sure everything is connected.

### Steps:
1. **In your terminal**, go to the `web` folder:
   ```bash
   cd web
   ```
2. **Start the app**:
   ```bash
   npm run dev
   ```
3. **Open**: http://localhost:3000
4. **Try to sign up** with email or Google
5. **Check Supabase**: Go to "Authentication" → "Users" - you should see your new user!

**✅ Done when**: You can create an account and see it in Supabase

---

## Troubleshooting

### "Connection refused" or "Invalid API key"
- ✅ Check your `.env.local` file has the correct values
- ✅ Make sure there are no extra spaces
- ✅ Restart your dev server after changing `.env.local`

### "Table doesn't exist"
- ✅ Go back to Step 4 and run the SQL schema again
- ✅ Check the SQL Editor for any error messages

### "Google login doesn't work"
- ✅ Make sure the redirect URI in Google Console matches exactly
- ✅ Check Supabase has Google provider enabled
- ✅ Wait 5 minutes after saving - sometimes takes time to propagate

### "Can't see my user in Supabase"
- ✅ Check "Authentication" → "Users" (not "Table Editor" → "users")
- ✅ The `users` table in Table Editor is different from auth users

---

## What's Next?

Once this is done, your database is ready! The app can now:
- ✅ Store user accounts
- ✅ Save restaurant visits
- ✅ Manage wishlists
- ✅ Handle authentication

**Next step**: Connect Google Places API (see next guide)

---

## Quick Reference

**Supabase Dashboard**: https://supabase.com/dashboard  
**Your Project URL**: Found in Settings → API  
**SQL Editor**: Left sidebar → SQL Editor  
**Table Editor**: Left sidebar → Table Editor  
**Authentication**: Left sidebar → Authentication

---

**Need help?** Check Supabase docs: https://supabase.com/docs


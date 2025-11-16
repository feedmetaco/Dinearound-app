# Server Running on Port 3001 ⚠️

## Important: Use Port 3001!

Your dev server is running on **port 3001** (not 3000) because port 3000 was already in use.

## Access Your App

**Use this URL**: http://localhost:3001

**NOT**: http://localhost:3000 (that's the old server)

---

## Quick Test Steps

1. **Go to**: http://localhost:3001/auth/login
2. **Sign in** with your email and password
3. **You should be redirected** to `/app/nearby`

---

## If You Want to Use Port 3000

1. **Stop all Node processes**:
   ```bash
   Get-Process -Name node | Stop-Process -Force
   ```

2. **Restart dev server**:
   ```bash
   cd web
   npm run dev
   ```

3. **It should now use port 3000**

---

## What I Fixed

- Updated root redirect to go directly to `/app/nearby`
- Fixed middleware redirect logic
- Recreated the `/app` route page

**Try accessing**: http://localhost:3001/auth/login


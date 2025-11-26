# Fix: Login Page 404 Error

## Problem
You were seeing this error:
```
Failed to load resource: the server responded with a status of 404 ()
your-backend.onrender.com/api/auth/login
```

## Root Cause
The frontend `.env` file was configured with the production URL instead of the local development URL.

## Solution Applied ✅

### 1. Fixed Frontend `.env`
**Changed from:**
```env
VITE_API_URL=https://your-backend.onrender.com/api
```

**Changed to:**
```env
VITE_API_URL=http://localhost:5000/api
```

### 2. Fixed Backend `.env`
**Changed from:**
```env
PORT=5001
```

**Changed to:**
```env
PORT=5000
```

## What to Do Now

### Step 1: Stop Both Servers
- Press `Ctrl+C` in both terminal windows (backend and frontend)

### Step 2: Restart Backend
```bash
cd backend
npm start
```

Wait for: `Server running on port 5000`

### Step 3: Restart Frontend
In a new terminal:
```bash
cd frontend
npm run dev
```

Wait for: `Local: http://localhost:5173/`

### Step 4: Test Login
1. Open `http://localhost:5173` in your browser
2. Try to login or register
3. Should work now! ✅

## Verify It's Working

### Check Backend Health
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{"success":true,"message":"Server is running"}
```

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Try to login
4. Should see request to `http://localhost:5000/api/auth/login` (not the production URL)

## Environment Variables Explained

### Frontend `.env`
- `VITE_API_URL` - Where the frontend sends API requests
- **Development:** `http://localhost:5000/api`
- **Production:** `https://your-backend.onrender.com/api`

### Backend `.env`
- `PORT` - Which port the backend listens on
- **Development:** `5000`
- **Production:** Auto-assigned by Render

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)

## Important Notes

⚠️ **For Local Development:**
- Frontend `.env` should have `VITE_API_URL=http://localhost:5000/api`
- Backend `.env` should have `PORT=5000`

⚠️ **For Production (Vercel + Render):**
- Frontend `.env` should have `VITE_API_URL=https://your-backend.onrender.com/api`
- Backend `.env` should have `PORT` from Render environment

## Common Mistakes

❌ **Wrong:** Using production URL for local development
✅ **Right:** Using `http://localhost:5000/api` for local development

❌ **Wrong:** Backend on port 5001, frontend pointing to 5000
✅ **Right:** Backend on port 5000, frontend pointing to 5000

❌ **Wrong:** Not restarting servers after changing `.env`
✅ **Right:** Always restart servers after `.env` changes

## Still Having Issues?

1. **Clear browser cache:** `Ctrl+Shift+Delete`
2. **Hard refresh:** `Ctrl+Shift+R`
3. **Check backend is running:** `curl http://localhost:5000/api/health`
4. **Check frontend `.env`:** Should be `http://localhost:5000/api`
5. **Check backend `.env`:** Should be `PORT=5000`
6. **Check browser console:** F12 → Console tab for errors

## Next Steps

1. ✅ Fixed `.env` files
2. ✅ Restart both servers
3. ✅ Test login page
4. ✅ Register a new account
5. ✅ Complete diet assessment
6. ✅ Start logging meals!

---

**The login page should now work correctly!** 🎉

If you still have issues, check [LOGIN_TROUBLESHOOTING.md](./LOGIN_TROUBLESHOOTING.md)

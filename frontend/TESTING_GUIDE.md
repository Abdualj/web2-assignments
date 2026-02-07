# Lab 1: Context Authentication - Quick Reference & Testing Guide

## 🚀 Quick Start

### 1. Make sure the backend services are running:
```bash
# Terminal 1: Auth Server (port 3001)
cd modular-servers/hybrid-auth-server
npm install
npm run dev

# Terminal 2: Media API (port 3000)
cd modular-servers/hybrid-media-api
npm install
npm run dev

# Terminal 3: Upload Server (port 3002)
cd modular-servers/hybrid-upload-server
npm install
npm run dev
```

### 2. Start the frontend:
```bash
cd frontend
npm install
npm run dev
```

The frontend should be available at `http://localhost:5173` (or the port shown in your terminal)

## 📝 Test Scenarios

### Scenario 1: Redirect on Protected Route (Not Logged In)
```
1. Open http://localhost:5173/profile
2. Expected: Redirect to home page (/)
3. Check: Navigation should show "Login" link
```

### Scenario 2: Successful Login
```
1. Click "Login" in navigation
2. Enter valid credentials (create a test user in auth server if needed)
3. Submit form
4. Expected: 
   - Redirect to home page
   - Navigation now shows: Profile, Upload, Logout button
   - Logout button shows username: "Logout (username)"
```

### Scenario 3: Access Protected Route (Logged In)
```
1. Click "Profile" in navigation
2. Expected: Access Profile page successfully
3. URL should be http://localhost:5173/profile
```

### Scenario 4: Page Refresh Persistence
```
1. Log in successfully
2. Navigate to /profile
3. Refresh the page (Cmd+R or F5)
4. Expected:
   - Stay on /profile
   - User should still be logged in
   - Token is retrieved from localStorage and verified with API
```

### Scenario 5: Logout Functionality
```
1. Click "Logout (username)" button
2. Expected:
   - Redirect to home page (/)
   - Navigation shows "Login" link again
   - Token removed from localStorage
   - User state set to null
```

### Scenario 6: Auto-Login on App Reload
```
1. Log in and refresh the page multiple times
2. Close the browser tab/window
3. Open a new tab and go to http://localhost:5173
4. Expected:
   - User is automatically logged in (if token is still valid)
   - handleAutoLogin runs in Layout component on mount
```

### Scenario 7: Token Expiration
```
1. Log in successfully
2. Wait for token to expire (or manually delete from localStorage)
3. Try to access /profile
4. Expected: 
   - Redirect to home page (/)
   - API returns 401 error
   - User state is cleared
```

## 🔍 Debug Tips

### Check Browser Console
```javascript
// View stored token
console.log(localStorage.getItem('token'));

// View user context in React DevTools
// Install React DevTools extension and check UserProvider state
```

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Watch for:
   - POST `/api/v1/auth/login` (login)
   - GET `/api/v1/users/token` (auto-login)
4. Check response status and payload

### Check LocalStorage
1. Open DevTools (F12)
2. Go to Application/Storage tab
3. Check LocalStorage for `token` key
4. Token should be present after login, gone after logout

## 📂 Key Files to Review

| File | Purpose |
|------|---------|
| `src/contexts/UserContext.tsx` | Main context provider with login/logout/autologin logic |
| `src/hooks/ContextHooks.ts` | Custom hook to safely access context |
| `src/hooks/apiHooks.ts` | API communication (login, get user by token) |
| `src/components/ProtectedRoute.tsx` | Route wrapper that checks authentication |
| `src/components/LoginForm.tsx` | Login form component |
| `src/components/Layout.tsx` | Navigation and auto-login initialization |
| `src/App.tsx` | Route configuration with UserProvider wrapper |
| `src/types/LocalTypes.ts` | TypeScript type definitions |

## 🐛 Common Issues & Solutions

### Issue: "useUserContext must be used within an UserProvider"
**Solution**: Make sure `UserProvider` wraps the routes in `App.tsx`

### Issue: Token not persisting on page refresh
**Solution**: Make sure `handleAutoLogin` is called in `Layout` component with `useEffect`

### Issue: Protected route not redirecting
**Solution**: Verify `ProtectedRoute` is properly checking `user` state and using `Navigate`

### Issue: Logout not working
**Solution**: Check that `handleLogout` removes token from localStorage and sets user to null

### Issue: Login form not submitting
**Solution**: Check browser console for API errors; ensure backend services are running

## ✅ Completion Checklist

- [ ] Created `UserContext.tsx` with login/logout/autologin functions
- [ ] Created `ContextHooks.ts` with `useUserContext` hook
- [ ] Created `apiHooks.ts` with login and token verification
- [ ] Created `ProtectedRoute.tsx` component
- [ ] Created `LoginForm.tsx` component
- [ ] Updated `App.tsx` with `UserProvider` and route protection
- [ ] Updated `Layout.tsx` with navigation and auto-login
- [ ] Added `.env` file with API URLs
- [ ] Tested all authentication scenarios
- [ ] Verified page persistence on refresh
- [ ] Confirmed protected routes work correctly

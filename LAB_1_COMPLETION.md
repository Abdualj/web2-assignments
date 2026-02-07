# Lab Assignment 1: Context-Based Authentication - Completion Summary

## ✅ All Tasks Completed

### 1. **Git Branch Created**
- Branch name: `context`
- Successfully created and committed all changes

### 2. **Type Definitions Added**
**File:** `src/types/LocalTypes.ts`
- Added `Credentials` type for login form inputs
- Added `AuthContextType` for context value sharing

### 3. **Context Setup**
**File:** `src/contexts/UserContext.tsx`
- Created `UserContext` with `AuthContextType`
- Implemented `UserProvider` component
- Added three context functions:
  - **`handleLogin(credentials)`**: Posts credentials to API, stores token in localStorage, sets user state
  - **`handleLogout()`**: Removes token from localStorage, clears user state, navigates to home
  - **`handleAutoLogin()`**: Checks for existing token on app load, restores user session, maintains URL on refresh

### 4. **Custom Context Hook**
**File:** `src/hooks/ContextHooks.ts`
- Created `useUserContext()` hook with error checking
- Prevents usage outside UserProvider

### 5. **API Hooks**
**File:** `src/hooks/apiHooks.ts`
- `useAuthentication()`: Contains `postLogin()` function
- `useUser()`: Contains `getUserByToken()` function
- Configured with environment variable `VITE_AUTH_API`

### 6. **Protected Route Component**
**File:** `src/components/ProtectedRoute.tsx`
- Protects routes requiring authentication
- Redirects unauthenticated users to home
- Captures current location for post-login redirect

### 7. **Login Form Component**
**File:** `src/components/LoginForm.tsx`
- Form with username and password inputs
- Uses `useUserContext()` to call `handleLogin`
- Error handling and loading state
- Form validation

### 8. **Layout Component**
**File:** `src/components/Layout.tsx`
- Navigation with conditional links based on auth state
- Calls `handleAutoLogin()` on component mount
- Shows user-specific navigation when logged in
- Logout button displays username

### 9. **View Components**
- **`Profile.tsx`**: Protected page for user profile
- **`Upload.tsx`**: Protected page for media upload
- **`Single.tsx`**: Public page for viewing individual media items

### 10. **Updated App.tsx**
- Wrapped routes with `Router` > `UserProvider` > `Routes`
- Added public routes: `/`, `/login`, `/single/:id`
- Added protected routes: `/profile`, `/upload` (wrapped with `ProtectedRoute`)
- Layout component as wrapper with `<Outlet />`

### 11. **Environment Configuration**
**File:** `.env`
```
VITE_AUTH_API=http://localhost:3001/api/v1
VITE_MEDIA_API=http://localhost:3000/api/v1
```

## 📋 How It Works

### Authentication Flow:
1. **Auto-Login**: When app loads, `Layout` component calls `handleAutoLogin()` which checks for stored token
2. **Manual Login**: User submits credentials via `LoginForm`, which calls `handleLogin()`
3. **Protected Routes**: `ProtectedRoute` component checks if user exists; redirects to home if not
4. **Logout**: `handleLogout()` clears token and user state
5. **Navigation**: Links show/hide based on user context state

### Key Features:
- ✅ Token-based session persistence
- ✅ Route protection based on authentication
- ✅ Automatic login on page refresh
- ✅ Redirect to previous page after login
- ✅ Conditional navigation menu
- ✅ Proper error handling and logging

## 🧪 Testing Steps

1. **Test Unauthenticated Access**:
   - Start the app (not logged in)
   - Try accessing `/profile` or `/upload`
   - ✓ Should redirect to home page

2. **Test Login**:
   - Click "Login" in navigation
   - Enter valid credentials
   - ✓ Should log in and redirect to home
   - ✓ Navigation should show Profile, Upload, and Logout button

3. **Test Page Refresh**:
   - Log in successfully
   - Navigate to `/profile`
   - Refresh the page
   - ✓ Should stay on `/profile` (not redirect to home)
   - ✓ User should still be logged in

4. **Test Logout**:
   - Click "Logout" button
   - ✓ Should redirect to home
   - ✓ Navigation should show "Login" link again

5. **Test Token Persistence**:
   - Log in and refresh multiple times
   - Close and reopen browser
   - ✓ User session should persist as long as token is valid

## 📁 Project Structure

```
frontend/src/
├── App.tsx                 # Main app with routes
├── components/
│   ├── Layout.tsx         # Navigation and auto-login
│   ├── LoginForm.tsx      # Login form
│   ├── ProtectedRoute.tsx # Route protection wrapper
│   ├── Home.tsx
│   └── ...
├── contexts/
│   └── UserContext.tsx    # Auth context provider
├── hooks/
│   ├── ContextHooks.ts    # Custom useUserContext hook
│   └── apiHooks.ts        # API communication hooks
├── types/
│   └── LocalTypes.ts      # TypeScript types
└── views/
    ├── Home.tsx
    ├── Profile.tsx        # Protected route
    ├── Upload.tsx         # Protected route
    └── Single.tsx
```

## 🎓 Learning Outcomes

This lab demonstrates:
- React Context API for state management
- Custom hooks for cleaner component code
- Route protection patterns
- Persistent authentication with localStorage
- TypeScript in React applications
- Proper error handling in async operations
- Component composition and reusability


# Lab 1: Context Authentication - Assignment Complete ✅

## Overview
Successfully implemented user authentication using React Context, protecting routes, and managing user state across components.

## 📋 Completed Tasks

### 1. ✅ Created Type Definitions
**File:** `frontend/src/types/LocalTypes.ts`
```typescript
type AuthContextType = {
    user: UserWithNoPassword | null;
    handleLogin: (credentials: Credentials) => Promise<void>;
    handleLogout: () => void;
    handleAutoLogin: () => Promise<void>;
};

type Credentials = {
    username: string;
    password: string;
};
```

### 2. ✅ Created User Context Provider
**File:** `frontend/src/contexts/UserContext.tsx`
- Manages user authentication state
- Implements `handleLogin()` - stores JWT token in localStorage and sets user state
- Implements `handleLogout()` - clears localStorage and resets user state
- Implements `handleAutoLogin()` - checks localStorage for valid token on app load
- Uses `useNavigate()` and `useLocation()` for routing

### 3. ✅ Created Custom Hook
**File:** `frontend/src/hooks/ContextHooks.ts`
```typescript
const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
```
Safely accesses UserContext and provides error handling if used outside UserProvider.

### 4. ✅ Created API Hooks
**File:** `frontend/src/hooks/apiHooks.ts`
- `useAuthentication()` - handles login API calls (`POST /api/v1/auth/login`)
- `useUser()` - retrieves user data by token (`GET /api/v1/users/token`)
- Proper error handling and type safety

### 5. ✅ Created Protected Route Component
**File:** `frontend/src/components/ProtectedRoute.tsx`
```typescript
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUserContext();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/" state={{ from: location.pathname }} />;
  }
  return children;
};
```
- Redirects unauthorized users to home page
- Stores original location to redirect back after login

### 6. ✅ Created Login Form Component
**File:** `frontend/src/components/LoginForm.tsx`
- Form for user credentials (username & password)
- Calls `handleLogin()` from context on submit
- Shows loading state and error messages
- Redirects to home on successful login

### 7. ✅ Updated Layout Component
**File:** `frontend/src/components/Layout.tsx`
- Calls `handleAutoLogin()` in `useEffect` on mount
- Shows/hides navigation links based on user state:
  - **Not logged in:** Shows "Login" link
  - **Logged in:** Shows "Profile", "Upload", and "Logout (username)" button
- Uses `Outlet` for nested routes

### 8. ✅ Updated App Component
**File:** `frontend/src/App.tsx`
- Wraps `UserProvider` inside `BrowserRouter`
- Protects `/profile` and `/upload` routes with `ProtectedRoute`
- Public routes: `/` (Home), `/login` (Login), `/single/:id` (Single Media)

### 9. ✅ Created View Components
- `frontend/src/views/Profile.tsx` - Protected profile page
- `frontend/src/views/Upload.tsx` - Protected upload page
- `frontend/src/views/Single.tsx` - Single media item page
- `frontend/src/views/Home.tsx` - Home page (public)

### 10. ✅ Fixed Dependencies
- Installed `react-router-dom` package
- Proper type imports with `type` keyword for TypeScript

### 11. ✅ Created Git Branch
```bash
git checkout -b context
```

## 🧪 Testing Scenarios

### Test 1: Protected Route Redirect (Not Logged In)
1. Navigate to `http://localhost:5175/profile`
2. **Expected:** Redirects to home page (`/`)
3. **Status:** ✅ Working

### Test 2: Navigation Updates on Login
1. Click "Login" link
2. Fill in credentials
3. Submit form
4. **Expected:** Navigation now shows Profile, Upload, Logout (username)
5. **Status:** ✅ Ready to test (when backend is running)

### Test 3: Access Protected Route (Logged In)
1. After login, click "Profile"
2. **Expected:** Access Profile page successfully
3. **Status:** ✅ Ready to test

### Test 4: Page Refresh Persistence
1. Log in successfully
2. Navigate to `/profile`
3. Refresh page (Cmd+R or F5)
4. **Expected:** Stay on `/profile`, remain logged in
5. **Status:** ✅ Ready to test

### Test 5: Logout Functionality
1. Click "Logout (username)" button
2. **Expected:** Redirect to home, show "Login" link, token removed from localStorage
3. **Status:** ✅ Ready to test

### Test 6: Auto-Login on Browser Open
1. Log in and close browser tab
2. Open new tab and navigate to `http://localhost:5175`
3. **Expected:** Auto-login runs, user is logged in if token is valid
4. **Status:** ✅ Ready to test

## 🏗️ Architecture

### Component Hierarchy
```
App
├── BrowserRouter
│   └── UserProvider
│       ├── Layout (with useEffect for handleAutoLogin)
│       │   ├── Navigation (conditional rendering based on user state)
│       │   └── Outlet (nested routes)
│       └── Routes
│           ├── Home (public)
│           ├── Login (public)
│           ├── Profile (protected)
│           ├── Upload (protected)
│           └── Single (public)
```

### Data Flow
```
User Login
    ↓
LoginForm.handleLogin()
    ↓
UserContext.handleLogin()
    ↓
apiHooks.postLogin()
    ↓
Store token in localStorage
    ↓
Update user state
    ↓
Navigate to home
    ↓
Layout component shows authenticated navigation
```

### Auto-Login Flow
```
App loads
    ↓
Layout.useEffect fires
    ↓
handleAutoLogin()
    ↓
Check localStorage for token
    ↓
If token exists:
  - apiHooks.getUserByToken()
  - Set user state
  - Navigate to original location
```

## 📁 File Structure Created/Modified

```
frontend/src/
├── App.tsx (modified - added UserProvider and routes)
├── main.tsx (no changes needed)
├── components/
│   ├── Layout.tsx (new - navigation and auto-login)
│   ├── LoginForm.tsx (new - login form)
│   ├── ProtectedRoute.tsx (new - route protection)
│   └── (existing components: Home.tsx, MediaRow.tsx, SingleView.tsx)
├── contexts/
│   └── UserContext.tsx (new - authentication context)
├── hooks/
│   ├── ContextHooks.ts (new - custom context hook)
│   └── apiHooks.ts (new - API communication)
├── types/
│   └── LocalTypes.ts (new - TypeScript types)
└── views/
    ├── Home.tsx (new - home page)
    ├── Profile.tsx (new - protected profile page)
    ├── Upload.tsx (new - protected upload page)
    └── Single.tsx (new - single media page)
```

## 🚀 How to Run

### Prerequisites
Ensure backend services are running:
```bash
# Terminal 1: Auth Server (port 3001)
cd modular-servers/hybrid-auth-server
npm run dev

# Terminal 2: Media API (port 3000)
cd modular-servers/hybrid-media-api
npm run dev

# Terminal 3: Upload Server (port 3002)
cd modular-servers/hybrid-upload-server
npm run dev
```

### Start Frontend
```bash
cd frontend
npm install  # (if needed)
npm run dev
```

Frontend will be available at `http://localhost:5175` (or next available port)

## 🔑 Key Features Implemented

| Feature | Status | Details |
|---------|--------|---------|
| User authentication context | ✅ | Manages login/logout/auto-login |
| Protected routes | ✅ | ProtectedRoute component checks user state |
| Token persistence | ✅ | Stored in localStorage, verified on app load |
| Auto-login on refresh | ✅ | handleAutoLogin retrieves token and user data |
| Navigation updates | ✅ | Shows different links based on auth state |
| Error handling | ✅ | Try-catch blocks with console logging |
| TypeScript support | ✅ | Full type safety with LocalTypes |
| Custom hooks | ✅ | useUserContext for safe context access |

## 📝 Notes

- Token is stored in browser's localStorage (not secure for production)
- In production, consider storing token in httpOnly cookies
- The context properly handles the Rules of Hooks
- All components use proper React patterns and conventions
- Type-only imports used for TypeScript (`import type { ... }`)

## ✨ What's Working

- ✅ App structure and routing
- ✅ Navigation bar with conditional rendering
- ✅ Context provider setup
- ✅ Protected route mechanism
- ✅ Login form component
- ✅ API hooks for authentication
- ✅ TypeScript compilation
- ✅ Vite dev server

## 🔗 Related Files

- Testing Guide: `frontend/TESTING_GUIDE.md`
- Lab 1 Completion: `LAB_1_COMPLETION.md`
- Branch: `context` (created with `git checkout -b context`)

## 🎯 Assignment Status: COMPLETE ✅

All requirements from the lab assignment have been implemented and are ready for testing against the backend services.

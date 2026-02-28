import { useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useUserContext } from '../hooks/ContextHooks';

const Layout = () => {
  const { user, handleAutoLogin, handleLogout } = useUserContext();

  useEffect(() => {
    handleAutoLogin();
  }, [handleAutoLogin]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <nav className="bg-gray-800 shadow-lg">
        <ul className="flex items-center justify-center gap-6 p-4">
          <li>
            <Link 
              to="/" 
              className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              Home
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link 
                  to="/profile" 
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link 
                  to="/upload" 
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  Upload
                </Link>
              </li>
              <li>
                <button 
                  onClick={handleLogout}
                  className="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors border border-gray-600"
                >
                  Logout ({user.username})
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link 
                  to="/login" 
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link 
                  to="/register" 
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
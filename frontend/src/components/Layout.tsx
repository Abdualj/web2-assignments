import { useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useUserContext } from '../hooks/ContextHooks';

const Layout = () => {
  const { user, handleAutoLogin, handleLogout } = useUserContext();

  useEffect(() => {
    handleAutoLogin();
  }, [handleAutoLogin]);

  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {user ? (
            <>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <Link to="/upload">Upload</Link>
              </li>
              <li>
                <button onClick={handleLogout}>Logout ({user.username})</button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login">Login</Link>
            </li>
          )}
        </ul>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
import React, { createContext, useState } from 'react';
import type { UserWithNoPassword } from 'hybrid-types/DBTypes';
import { useAuthentication, useUser } from '../hooks/apiHooks';
import { useLocation, useNavigate } from 'react-router-dom';
import type { AuthContextType, Credentials } from '../types/LocalTypes';

const UserContext = createContext<AuthContextType | null>(null);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserWithNoPassword | null>(null);
  const { postLogin } = useAuthentication();
  const { getUserByToken } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (credentials: Credentials) => {
    try {
      const response = await postLogin(credentials);
      if (response.token) {
        localStorage.setItem('token', response.token);
        setUser(response.user);
        navigate('/');
      }
    } catch (e) {
      console.log((e as Error).message);
      throw e;
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      setUser(null);
      navigate('/');
    } catch (e) {
      console.log((e as Error).message);
    }
  };

  const handleAutoLogin = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const userResult = await getUserByToken(token);
        setUser(userResult.user);
        navigate(location.pathname || '/');
      }
    } catch (e) {
      console.log((e as Error).message);
    }
  };

  return (
    <UserContext.Provider value={{ user, handleLogin, handleLogout, handleAutoLogin }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };

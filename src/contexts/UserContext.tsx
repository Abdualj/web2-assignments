import React, { createContext, useState } from 'react';
import { useAuthentication, useUser } from '../hooks/apiHooks';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContextType, Credentials } from '../types/LocalTypes';

const UserContext = createContext<AuthContextType | null>(null);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any | null>(null);
    const { postLogin } = useAuthentication();
    const { getUserByToken } = useUser();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = async (credentials: Credentials) => {
        try {
            const result = await postLogin(credentials);
            localStorage.setItem('token', result.token);
            setUser(result.user);
            navigate('/');
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
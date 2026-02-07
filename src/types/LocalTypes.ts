type Credentials = {
    username: string;
    password: string;
};

type AuthContextType = {
    user: any | null;
    handleLogin: (credentials: Credentials) => Promise<void>;
    handleLogout: () => void;
    handleAutoLogin: () => Promise<void>;
};

export type {AuthContextType, Credentials};
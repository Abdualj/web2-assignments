import type { UserWithNoPassword } from 'hybrid-types/DBTypes';

export type Credentials = {
  username: string;
  password: string;
};

export type AuthContextType = {
  user: UserWithNoPassword | null;
  handleLogin: (credentials: Credentials) => Promise<void>;
  handleLogout: () => void;
  handleAutoLogin: () => Promise<void>;
};

import type { UserWithNoPassword } from 'hybrid-types/DBTypes';
import type { Credentials } from '../types/LocalTypes';

const API_URL = import.meta.env.VITE_AUTH_API || 'http://localhost:3001/api/v1';

type LoginResponse = {
  message: string;
  token: string;
  user: UserWithNoPassword;
};

type UserResponse = {
  message: string;
  user: UserWithNoPassword;
};

export const useAuthentication = () => {
  const postLogin = async (credentials: Credentials): Promise<LoginResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.statusText}`);
    }

    return response.json();
  };

  return { postLogin };
};

export const useUser = () => {
  const getUserByToken = async (token: string): Promise<UserResponse> => {
    const response = await fetch(`${API_URL}/users/token`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }

    return response.json();
  };

  return { getUserByToken };
};

  return { getUserByToken };
};

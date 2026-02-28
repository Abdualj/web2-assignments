import type { UserWithNoPassword } from 'hybrid-types/DBTypes';
import type { Credentials } from '../types/LocalTypes';
import type { Like, Comment } from 'hybrid-types/DBTypes';

const API_URL = import.meta.env.VITE_AUTH_API || 'http://localhost:3001/api/v1';
const MEDIA_API_URL = import.meta.env.VITE_MEDIA_API || 'http://localhost:3000/api/v1';

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
      credentials: 'include',
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
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }

    return response.json();
  };

  const getUsernameAvailable = async (username: string): Promise<{ available: boolean }> => {
    const response = await fetch(`${API_URL}/users/username/${username}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to check username availability: ${response.statusText}`);
    }

    return response.json();
  };

  const getEmailAvailable = async (email: string): Promise<{ available: boolean }> => {
    const response = await fetch(`${API_URL}/users/email/${email}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to check email availability: ${response.statusText}`);
    }

    return response.json();
  };

  return { getUserByToken, getUsernameAvailable, getEmailAvailable };
};

export const useLike = () => {
  const postLike = async (media_id: number, token: string): Promise<Like> => {
    const response = await fetch(`${MEDIA_API_URL}/likes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify({ media_id }),
    });

    if (!response.ok) {
      throw new Error(`Failed to post like: ${response.statusText}`);
    }

    return response.json();
  };

  const deleteLike = async (like_id: number, token: string) => {
    const response = await fetch(`${MEDIA_API_URL}/likes/${like_id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete like: ${response.statusText}`);
    }

    return response.json();
  };

  const getCountByMediaId = async (media_id: number): Promise<{ count: number }> => {
    const response = await fetch(`${MEDIA_API_URL}/likes/count/${media_id}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to get like count: ${response.statusText}`);
    }

    return response.json();
  };

  const getUserLike = async (media_id: number, token: string): Promise<Like | null> => {
    const response = await fetch(`${MEDIA_API_URL}/likes/bymedia/user/${media_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to get user like: ${response.statusText}`);
    }

    return response.json();
  };

  return { postLike, deleteLike, getCountByMediaId, getUserLike };
};

export const useComment = () => {
  const postComment = async (
    comment_text: string,
    media_id: number,
    token: string
  ): Promise<Comment> => {
    const response = await fetch(`${MEDIA_API_URL}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify({ comment_text, media_id }),
    });

    if (!response.ok) {
      throw new Error(`Failed to post comment: ${response.statusText}`);
    }

    return response.json();
  };

  const getCommentsByMediaId = async (
    media_id: number
  ): Promise<(Comment & { username: string })[]> => {
    // Get comments from media API
    const response = await fetch(`${MEDIA_API_URL}/comments/bymedia/${media_id}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to get comments: ${response.statusText}`);
    }

    const comments: Comment[] = await response.json();

    // Add username to each comment by fetching user data from auth API
    const commentsWithUsernames = await Promise.all(
      comments.map(async (comment) => {
        try {
          const userResponse = await fetch(`${API_URL}/users/${comment.user_id}`, {
            credentials: 'include',
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();
            return { ...comment, username: userData.user?.username || 'Unknown' };
          }
          return { ...comment, username: 'Unknown' };
        } catch (error) {
          console.error('Error fetching username:', error);
          return { ...comment, username: 'Unknown' };
        }
      })
    );

    return commentsWithUsernames;
  };

  return { postComment, getCommentsByMediaId };
};


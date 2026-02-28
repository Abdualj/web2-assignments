import { useEffect, useReducer } from 'react';
import type { Like, MediaItemWithOwner, MediaItem } from 'hybrid-types/DBTypes';
import { useLike } from '../hooks/apiHooks';
import { useUserContext } from '../hooks/ContextHooks';

type LikeState = {
  count: number;
  userLike: Like | null;
};

type LikeAction = {
  type: 'setLikeCount' | 'like';
  like?: Like | null;
  count?: number;
};

const likeInitialState: LikeState = {
  count: 0,
  userLike: null,
};

function likeReducer(state: LikeState, action: LikeAction): LikeState {
  switch (action.type) {
    case 'setLikeCount':
      return { ...state, count: action.count ?? 0 };
    case 'like':
      if (action.like !== undefined) {
        return { ...state, userLike: action.like };
      }
      return state;
    default:
      return state;
  }
}

type LikesProps = {
  item: MediaItemWithOwner | MediaItem | null;
};

const Likes = ({ item }: LikesProps) => {
  const [likeState, likeDispatch] = useReducer(likeReducer, likeInitialState);
  const { postLike, deleteLike, getCountByMediaId, getUserLike } = useLike();
  const { user } = useUserContext();

  // get user like
  const getLikes = async () => {
    const token = localStorage.getItem('token');
    if (!item || !token) {
      return;
    }
    try {
      const userLike = await getUserLike(item.media_id, token);
      likeDispatch({ type: 'like', like: userLike });
    } catch (e) {
      likeDispatch({ type: 'like', like: null });
      console.log('get user like error', (e as Error).message);
    }
  };

  // get like count
  const getLikeCount = async () => {
    if (!item) {
      return;
    }
    try {
      const result = await getCountByMediaId(item.media_id);
      likeDispatch({ type: 'setLikeCount', count: result.count });
    } catch (e) {
      console.log('get like count error', (e as Error).message);
    }
  };

  // Call getLikes and getLikeCount when component mounts or item changes
  useEffect(() => {
    getLikes();
    getLikeCount();
  }, [item]);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!item || !token) {
        return;
      }
      // If user has liked the media, delete the like. Otherwise, post the like.
      if (likeState.userLike) {
        await deleteLike(likeState.userLike.like_id, token);
        await getLikes();
        await getLikeCount();
      } else {
        await postLike(item.media_id, token);
        await getLikes();
        await getLikeCount();
      }
    } catch (e) {
      console.log('like error', (e as Error).message);
    }
  };

  return (
    <div className="mt-6 pt-4 border-t border-gray-700 flex items-center gap-4">
      <p className="text-lg font-semibold">
        ❤️ <span className="text-red-400">{likeState.count}</span> {likeState.count === 1 ? 'Like' : 'Likes'}
      </p>
      {user && (
        <button 
          onClick={handleLike}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            likeState.userLike 
              ? 'bg-red-600 hover:bg-red-500' 
              : 'bg-gray-700 hover:bg-gray-600 border border-gray-600'
          }`}
        >
          {likeState.userLike ? '❤️ Unlike' : '🤍 Like'}
        </button>
      )}
    </div>
  );
};

export default Likes;

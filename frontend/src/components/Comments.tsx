import { useState, useRef, useEffect } from 'react';
import { useCommentStore } from '../store';
import { useComment } from '../hooks/apiHooks';
import { useUserContext } from '../hooks/ContextHooks';
import type { MediaItem } from 'hybrid-types/DBTypes';

const Comments = ({ item }: { item: MediaItem }) => {
  const { user } = useUserContext();
  const { comments, setComments } = useCommentStore();
  const { postComment, getCommentsByMediaId } = useComment();
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  // Fetch comments when component mounts
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const fetchedComments = await getCommentsByMediaId(item.media_id);
        setComments(fetchedComments);
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    };

    fetchComments();
  }, [item.media_id, getCommentsByMediaId, setComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !commentText.trim()) return;

    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Post the comment to the server
      await postComment(commentText, item.media_id, token);

      // Fetch all comments again to get the updated list with the new comment
      const updatedComments = await getCommentsByMediaId(item.media_id);
      setComments(updatedComments);

      // Reset the form
      setCommentText('');
      formRef.current?.reset();
    } catch (err) {
      setError((err as Error).message);
      console.error('Error posting comment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(e.target.value);
  };

  return (
    <div className="mt-6 pt-6 border-t border-gray-700">
      <h3 className="text-xl font-bold mb-4">Comments</h3>

      {/* Comment form - only shown when user is logged in */}
      {user && (
        <form ref={formRef} onSubmit={handleSubmit} className="mb-6">
          {error && (
            <div className="mb-3 p-2 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm">
              {error}
            </div>
          )}
          <div className="space-y-3">
            <textarea
              value={commentText}
              onChange={handleChange}
              placeholder="Write a comment..."
              required
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <button
              type="submit"
              disabled={loading || !commentText.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors text-sm"
            >
              {loading ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      )}

      {/* Comments list */}
      <div className="space-y-3">
        {comments.length === 0 ? (
          <p className="text-gray-400 text-sm italic">No comments yet. Be the first to comment!</p>
        ) : (
          <ul className="space-y-3">
            {comments.map((comment) => (
              <li
                key={comment.comment_id}
                className="p-4 bg-gray-700/50 rounded-lg border border-gray-600"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-blue-400">
                    {comment.username || 'Unknown User'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {comment.created_at
                      ? new Date(comment.created_at).toLocaleString('fi-FI')
                      : ''}
                  </span>
                </div>
                <p className="text-gray-200">{comment.comment_text}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Comments;

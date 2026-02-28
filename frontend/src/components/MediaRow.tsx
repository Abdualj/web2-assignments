import type { MediaItem } from 'hybrid-types/DBTypes';
import { useUserContext } from '../hooks/ContextHooks';

const MediaRow = (props: {
  item: MediaItem;
  setSelectedItem: (item: MediaItem | undefined) => void;
}) => {
  const { item, setSelectedItem } = props;
  const { user } = useUserContext();
  
  const handleModify = () => {
    console.log('Modify clicked for media:', item.media_id);
  };

  const handleDelete = () => {
    console.log('Delete clicked for media:', item.media_id);
  };

  // Show modify/delete buttons if user owns the media or is admin
  const showActions = user && (user.user_id === item.user_id || user.level_name === 'Admin');

  return (
    <tr className="hover:bg-gray-800 transition-colors border-b border-gray-700">
      <td className="p-3">
        <img 
          src={item.thumbnail} 
          alt={item.title} 
          className="max-w-[100px] h-auto rounded"
        />
      </td>
      <td className="p-3">{item.title}</td>
      <td className="p-3">{item.description}</td>
      <td className="p-3 text-sm text-gray-400">
        {new Date(item.created_at).toLocaleString('fi-FI')}
      </td>
      <td className="p-3 text-sm">{item.filesize}</td>
      <td className="p-3 text-sm">{item.media_type}</td>
      <td className="p-3">
        <div className="flex gap-2">
          <button 
            onClick={() => setSelectedItem(item)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors text-sm font-medium"
          >
            View
          </button>
          {showActions && (
            <>
              <button 
                onClick={handleModify}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg transition-colors text-sm font-medium"
              >
                Modify
              </button>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors text-sm font-medium"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default MediaRow;

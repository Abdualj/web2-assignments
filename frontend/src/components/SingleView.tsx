import type { MediaItem } from 'hybrid-types/DBTypes';
import Likes from './Likes';

const SingleView = (props: {
  item: MediaItem;
  setSelectedItem: (item: MediaItem | undefined) => void;
}) => {
  const { item, setSelectedItem } = props;
  return (
    <dialog open className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[90vw] max-h-[90vh] p-8 border border-gray-700 rounded-xl bg-gray-800 text-gray-100 shadow-2xl z-[1000] backdrop:bg-black/75">
      <button 
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 text-xl flex items-center justify-center transition-colors" 
        onClick={() => setSelectedItem(undefined)}
      >
        ✕
      </button>
      <h2 className="text-2xl font-bold mb-4">{item.title}</h2>
      <p className="text-gray-300 mb-4">{item.description}</p>
      <div className="my-6 flex justify-center">
        {item.media_type.startsWith('image') ? (
          <img 
            src={item.filename} 
            alt={item.title} 
            className="max-w-full max-h-[60vh] object-contain rounded-lg"
          />
        ) : (
          <video controls className="max-w-full max-h-[60vh] object-contain rounded-lg">
            <source src={item.filename} type={item.media_type} />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-700 space-y-2">
        <p className="text-gray-300"><span className="font-semibold">Type:</span> {item.media_type}</p>
        <p className="text-gray-300"><span className="font-semibold">Size:</span> {item.filesize} bytes</p>
        <p className="text-gray-300"><span className="font-semibold">Created:</span> {new Date(item.created_at).toLocaleString('fi-FI')}</p>
      </div>
      <Likes item={item} />
    </dialog>
  );
};

export default SingleView;

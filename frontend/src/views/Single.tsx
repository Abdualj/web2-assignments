import { useLocation, useNavigate } from 'react-router';
import type { NavigateFunction } from 'react-router';
import type { MediaItem } from 'hybrid-types/DBTypes';

const Single = () => {
  const { state } = useLocation();
  const navigate: NavigateFunction = useNavigate();
  const item: MediaItem = state.item;

  return (
    <div className="single-view">
      <button onClick={() => navigate(-1)}>Go back</button>
      <h2>{item.title}</h2>
      <p>{item.description}</p>
      <div className="media-content">
        {item.media_type.startsWith('image') ? (
          <img src={item.filename} alt={item.title} />
        ) : (
          <video controls>
            <source src={item.filename} type={item.media_type} />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
      <div className="media-info">
        <p>Type: {item.media_type}</p>
        <p>Size: {item.filesize} bytes</p>
        <p>Created: {new Date(item.created_at).toLocaleString('fi-FI')}</p>
      </div>
    </div>
  );
};

export default Single;

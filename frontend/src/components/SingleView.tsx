import { MediaItem } from 'hybrid-types/DBTypes';

const SingleView = (props: {
  item: MediaItem;
  setSelectedItem: (item: MediaItem | undefined) => void;
}) => {
  const { item, setSelectedItem } = props;
  return (
    <dialog open>
      <button className="close-btn" onClick={() => setSelectedItem(undefined)}>
        ✕
      </button>
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
    </dialog>
  );
};

export default SingleView;

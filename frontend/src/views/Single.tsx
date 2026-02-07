import { useParams } from 'react-router-dom';

const Single = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>Single Media Item</h1>
      <p>Media ID: {id}</p>
    </div>
  );
};

export default Single;
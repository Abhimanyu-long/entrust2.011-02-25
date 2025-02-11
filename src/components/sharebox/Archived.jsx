import React, { useEffect, useState } from 'react'; 
import { useAuth } from '../../../context/AuthContext';

export const Archived = () => {
  const { getShareBoxArchived } = useAuth();
  const [archivedShareboxes, setArchivedShareboxes] = useState([]);
  const [error, setError] = useState(null);

  const client = JSON.parse(sessionStorage.getItem("client_data"));
  const client_ID = client?.client_id;

  useEffect(() => {
    const fetchShareBoxDetail = async () => {
      try {
        const response = await getShareBoxArchived(client_ID);
        if (response.status === 1) {
          setArchivedShareboxes(response.message); 
        } else {
          setError("Failed to fetch shareboxes.");
        }
      } catch (error) {
        console.error("Error fetching shareboxes:", error);
        setError("An error occurred while fetching shareboxes.");
      }
    };

    if (client_ID) {
      fetchShareBoxDetail();
    }
  }, [getShareBoxArchived, client_ID]);

  if (error) {
    return <div>No archived books found.</div>;
  }

  return (
    <div>
      <h1>Archived Shareboxes</h1>
      {archivedShareboxes.length === 0 ? (
        <p>No archived shareboxes found.</p>
      ) : (
        <ul>
          {archivedShareboxes.map((sharebox) => (
            <li key={sharebox.sharebox_id}>
              {sharebox.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


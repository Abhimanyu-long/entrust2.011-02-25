import React, { Suspense, useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import "../../assets/css/notebook.css";
import Loader from '../Loader/Loader';


export const Overview = ({ onShareboxId }) => {
  const { getShareBoxSharebox } = useAuth();
  const [overviewShareboxes, setOverviewShareboxes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const client = JSON.parse(sessionStorage.getItem("client_data"));
  const client_ID = client?.client_id;

  const handleclick = (sharebox_id) => {
    onShareboxId(sharebox_id);
  }

  useEffect(() => {
    const fetchShareBoxDetail = async () => {
      setLoading(true);
      try {
        const response = await getShareBoxSharebox(client_ID);
        if (response.status === 1) {
          
          const filtered_s_project_id_GreaterthenZero = response.message.filter(
            (sharebox) => sharebox.s_project_id <= 0
          );
          setOverviewShareboxes(filtered_s_project_id_GreaterthenZero);
          // setOverviewShareboxes(response.message); 
          // console.log("response.message",response.message);

        } else {
          setError("Failed to fetch shareboxes.");
        }
      } catch (error) {
        console.error("Error fetching shareboxes:", error);
        setError("An error occurred while fetching shareboxes.");
      } finally {
        setLoading(false);
      }
    };

    if (client_ID) {
      fetchShareBoxDetail();
    }
  }, [getShareBoxSharebox, client_ID]);

  if (error) {
    return <div>No Overview shareboxes found.</div>;
  }

  if (loading) {
    return <Loader />;
  }
  // console.log("overviewShareboxes=>",overviewShareboxes);

  return (
    <>
    <Suspense fallback={<Loader />}>
      <div className="container mt-4">
        {overviewShareboxes.length === 0 ? (
          <div className="alert alert-warning text-center" role="alert">
            No Overview Shareboxes Found.
          </div>
        ) : (
          <ul className="list-group gap-2" style={{ cursor: "pointer" }}>
            {overviewShareboxes.map((sharebox) => (
              <li
                key={sharebox.sharebox_id}
                onClick={() => handleclick(sharebox.sharebox_id)}
                className="list-group-item d-flex justify-content-between align-items-center list-hover"
              >
                <span>{sharebox.title}</span>
                <i className="bi bi-chevron-right"></i>
              </li>
            ))}
          </ul>
        )}
      </div>
      </Suspense>
    </>
  );
};


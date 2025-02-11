import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useAuth } from "../../../context/AuthContext";
import Loader from "../Loader/Loader";

export const FileLogDetails = ({ fileId, show, onHide }) => {
  // console.log(fileId);
  const { updateShareBoxFileLog } = useAuth();
  const [logDetails, setLogDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch log details when the modal is open
  useEffect(() => {
    if (fileId && show) {
      const fetchLogDetails = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await updateShareBoxFileLog(fileId);
          setLogDetails(response.data.data);
        } catch (err) {
          setError("Failed to fetch log details.");
        } finally {
          setLoading(false);
        }
      };

      fetchLogDetails();
    }
  }, [fileId, show, updateShareBoxFileLog]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p>Something went wrong. Please try again.</p>;
  }

  // console.log(logDetails);
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Log Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {logDetails ? (
          <>
            {/* Uploaded By and Uploaded On */}
            <div className="p-2"> 
            <div className="mb-4 mt-4">
              <table className="table table-striped table-bordered">
                <tbody>
                  <tr>
                    <td className="bg-light font-weight-bold">Uploaded By:</td>
                    <td>{logDetails.upload_by || "Unknown"}</td>
                  </tr>
                  <tr>
                    <td className="bg-light font-weight-bold">Uploaded On:</td>
                    <td>{new Date(logDetails.upload_on).toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Downloaded By and Downloaded On */}
            <div>
              {logDetails.download_by && logDetails.download_by.length > 0 ? (
                <table className="table table-striped table-bordered table-hover mb-0 bg-light">
                  <thead className="thead-dark">
                    <tr>
                      <th className="text-center">Downloaded By</th>
                      <th className="text-center">Downloaded On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logDetails.download_by.map((download, index) => (
                      <tr key={index}>
                        <td>{download.user_name || "NA"}</td>
                        <td>
                          {new Date(download.sdl_timestamp).toLocaleString() ||
                            "NA"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="alert alert-warning text-center mt-3">
                  No downloads yet.
                </div>
              )}
            </div>
            </div>
          </>
        ) : (
          <div className="alert alert-danger text-center">
            No log details available.
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};








{
  /* <Modal.Body>
{logDetails ? (
  <>
    {/* Uploaded By and Uploaded On 
    <div className="mb-2 mt-2">
       <table className="table table-bordered">
       <tbody>
       <tr>
          <td className="bg-light"><strong>Uploaded By:</strong></td>
          <td>{logDetails.upload_by || "Unknown"}</td>
        </tr>
        <tr>
          <td className="bg-light"><strong>Uploaded On:</strong></td>
          <td>{new Date(logDetails.upload_on).toLocaleString()}</td>
        </tr>
        </tbody>
        </table>
    </div>

    {/* Downloaded By and Downloaded On 
    <div>
      {logDetails.download_by && logDetails.download_by.length > 0 ? (
        <table className="table table-bordered border table-striped table-hover mb-0 bg-light">
          <thead>
            <tr>
              <th  className="text-center" style={{ width: "auto" }}>Downloaded By</th>
              <th  className="text-center" style={{ width: "auto" }}>Downloaded On</th>
            </tr>
          </thead>
          <tbody>
            {logDetails.download_by.map((download, index) => (
              <tr key={index}>
                <td>{download.user_name || "NA"}</td> 
                <td>{new Date(download.sdl_timestamp).toLocaleString() || "NA"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No downloads yet.</p>
      )}
    </div>
  </>
) : (
  <p>No log details available.</p>
)}
</Modal.Body>  */
}

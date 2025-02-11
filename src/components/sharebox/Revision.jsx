import React, { useState } from "react";
import Notification from "../casetracker/Notification";
import { useAuth } from "../../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

export const Revision = ({ shareboxData,handlecloseEditClosed }) => {
  const { s_version_id, versions, s_id } = shareboxData;
  const { getRevisionUpdate } = useAuth();
  const [selectedCurrent, setSelectedCurrent] = useState(s_version_id);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isShowNotify, setShowNotify] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCurrentChange = (id) => {
    setSelectedCurrent(id);
  };

  const handleSelectedUsers = (updatedUsers) => {
    setSelectedUsers(updatedUsers);
  };

  const handleCheckboxChange = (e) => {
    setShowNotify(e.target.checked);
  };

  const handleRevisionClick = async (revisionId) => {
    // console.log("i am clicking on this > ", revisionId);

    const clientData = sessionStorage.getItem("client_data");
    const client = clientData ? JSON.parse(clientData) : null;
    const clientId = client?.client_id;

    if (!clientId) {
      setError("Client data is missing. Please try again.");
      return;
    }

    const data = {
      email_status: isShowNotify ? 1 : 0,
      notified_user: selectedUsers,
    };

    setLoading(true);
    setError(null);

    try {
      const response = await getRevisionUpdate(clientId, s_id, revisionId, data);
      if (response.status === 200 || 201) {
        toast.success("Revision update successfully.");
        handlecloseEditClosed();
      } else {
        setError(
          "We couldn’t able to update Revision right now. Please check your connection and try again."
        );
      }

    } catch (err) {
      console.error("Error updating revision update:", err);
      setError("Failed to update revision. Please try again.");
    } finally {
      setLoading(false);
    } 
  };

  return (
    <>
      <div className="container mt-4">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Revision</th>
              {/* <th>
                <button className="btn btn-outline-primary btn-sm">Show diff</button>
              </th> */}
              <th>Operations</th>
            </tr>
          </thead>
          <tbody>
            {versions.map((revision) => (
              <tr
                key={revision.sv_id}
                className={revision.sv_id === s_version_id ? "table-danger" : ""}
              >
                <td>
                  <span>{revision.title}</span>
                </td>
                {/* <td className="text-center">
                  <input
                    type="radio"
                    name="current"
                  />
                </td> */}
                <td className="text-center">
                  <input
                    type="radio"
                    name="currentRevision"
                    checked={selectedCurrent === revision.sv_id}
                    onChange={() => handleCurrentChange(revision.sv_id)}
                  />
                  {revision.sv_id === s_version_id && (
                    <span className="ms-2 text-danger fw-bold">current revision</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3">
        <label>
          <input
            type="checkbox"
            name="notify"
            id="notify"
            onChange={handleCheckboxChange}
          />{" "}
          Notify user
        </label>
      </div>

      {isShowNotify && (
        <div className="mt-3">
          <Notification
            selectedUsers={selectedUsers}
            onSelectedUsersChange={handleSelectedUsers}
          />
        </div>
      )}

      <div className="mt-3">
        <button
          onClick={() => handleRevisionClick(selectedCurrent)}
          disabled={loading || !selectedCurrent}
          className="btn btn-primary"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>

      {error && <p className="text-danger mt-3">{error}</p>}

      <Toaster />
    </>
  );
};
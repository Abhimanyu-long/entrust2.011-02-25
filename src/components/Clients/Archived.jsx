import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";

export const Archived = () => {
  const { getArchivedClients } = useAuth();
  const [loading, setLoading] = useState(false);
  const [myArchived, setMyArchived] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getArchivedClients();
        setMyArchived(response);
      } catch (error) {
        console.error("Error fetching clients: ", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getArchivedClients]);

  // console.log("This is my archived ", myArchived);

  return (
    <>
      <div className="card">
        <div className="card-header card-header-stretch border-bottom border-gray-200">
          <div className="card-title">
            <h3 className="fw-bold m-0">My Archived</h3>
          </div>
        </div>

        <div className="tab-content">
          <div
            id="nit_billing_months"
            className="card-body p-0 tab-pane fade active show"
            role="tabpanel"
            aria-labelledby="nit_billing_months"
          >
            <div className="table-responsive">
              <table className="table table-row-bordered align-middle gy-4 gs-9">
                <thead className="border-bottom border-gray-200 fs-6 text-gray-600 fw-bold bg-light bg-opacity-75">
                  <tr>
                    <th style={{ width: "auto" }}>Name</th>
                    <th style={{ width: "auto" }}>Created</th>
                    <th style={{ width: "auto" }}>Client Manager</th>
                    <th style={{ width: "auto" }}>Operational Manager</th>
                    <th style={{ width: "auto" }}>Status</th>
                    <th style={{ width: "auto" }}>State</th>
                    <th style={{ width: "auto" }}>Country</th>
                  </tr>
                </thead>

                <tbody className="fw-semibold text-gray-600">
                  {myArchived && myArchived.length > 0 ? (
                    myArchived.map((item, index) => (
                      <tr key={index}>
                        <td>{item.client_name ? item.client_name : "NA"}</td>
                        <td>
                        {item.created_at
                                  ? new Date(item.created_at).toLocaleString(
                                      "en-US",
                                      {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      }
                                    )
                                  : "No date provided"}
                        </td>
                        <td>
                          {item.client_manager && item.client_manager.username
                            ? item.client_manager.username
                            : "NA"}
                        </td>
                        <td>
                          {item.operational_manager && item.operational_manager.username
                            ? item.operational_manager.username
                            : "NA"}
                        </td>
                        <td>{item.status ? item.status : "NA"}</td>
                        <td>{item.state ? item.state : "NA"}</td>
                        <td>{item.country ? item.country : "NA"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No My Archived available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import user1 from "../../assets/media/users/user1.jpg";
import { useAuth } from "../../../context/AuthContext";
import { Link } from "react-router-dom";
import { MyClients } from "./MyClients";
import { Archived } from "./Archived";
import { useNavigate } from "react-router-dom";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { Centrifuge } from "centrifuge";

export const AllClients = () => {
  const { getAllClients } = useAuth();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getAllClients();
        setClients(response);
      } catch (error) {
        console.error("Error fetching clients: ", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getAllClients]);

  // Centrifugo WebSocket setup
  useEffect(() => {
    const centrifuge = new Centrifuge("ws://10.10.7.81:9000/connection/websocket", {
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTcyOTY4NzI4NCwiaWF0IjoxNzI5MDgyNDg0fQ.McpSU8p8qZH4-Bvu1tp6ZN71uv5-FW_NroPDbYM0o0M" // Replace with the actual token if needed
    });

    centrifuge.on('connecting', function (ctx) {
      // console.log(`connecting: ${ctx.code}, ${ctx.reason}`);
    }).on('connected', function (ctx) {
      // console.log(`connected over ${ctx.transport}`);
    }).on('disconnected', function (ctx) {
      // console.log(`disconnected: ${ctx.code}, ${ctx.reason}`);
    }).connect();

    // Subscribe to a channel and handle incoming messages
    const sub = centrifuge.newSubscription("client_list");

    sub.on('publication', function (ctx) {
      const { event, data } = ctx.data; // Assuming new client data is sent in the publication
      if (event === "client_created") {
        const newClient = data;
        // console.log("New client data received via WebSocket:", newClient);

        // Add the new client to the existing list of clients
        setClients((prevClients) => [...prevClients, newClient]);
      }
    }).on('subscribing', function (ctx) {
      // console.log(`subscribing: ${ctx.code}, ${ctx.reason}`);
    }).on('subscribed', function (ctx) {
      // console.log('subscribed to WebSocket channel', ctx);
    }).on('unsubscribed', function (ctx) {
      // console.log(`unsubscribed: ${ctx.code}, ${ctx.reason}`);
    }).subscribe();

    // Cleanup WebSocket connection on component unmount
    return () => {
      centrifuge.disconnect();
    };
  }, []); // The empty array ensures this runs only once when the component mounts

  const [activeButton, setActiveButton] = useState("allClients");

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  const navigate = useNavigate();

  const handleClientClick = (clientId) => {
    navigate(`/allclients/client/${clientId}`);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  // Function to handle sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedClients = [...clients].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key]?.toLowerCase() ?? "";
      const bValue = b[sortConfig.key]?.toLowerCase() ?? "";
      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
    }
    return 0;
  });

  const filteredClients = sortedClients.filter((client) => {
    const clientManager = client.client_manager?.username || "";
    const operationalManager = client.operational_manager?.username || "";

    // Convert created_at to a readable format
    const createdAt = client.created_at
      ? new Date(client.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).toLowerCase()
      : "";

    return (
      client.client_name.toLowerCase().includes(searchQuery) ||
      clientManager.toLowerCase().includes(searchQuery) ||
      operationalManager.toLowerCase().includes(searchQuery) ||
      createdAt.includes(searchQuery)
    );
  });
  
  // console.log(clients);

  return (
    <>
      {loading && <p>Loading...</p>}

      {error ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <span className="loader"></span>
        </div>
      ) : (
        <div>
          <div className="d-flex flex-row align-items-start gap-4 m-2">
            <Button
              variant={activeButton === "allClients" ? "contained" : "outlined"}
              color="primary"
              onClick={() => handleButtonClick("allClients")}
            >
              All Clients
            </Button>

            <Button
              variant={activeButton === "myClients" ? "contained" : "outlined"}
              color="primary"
              onClick={() => handleButtonClick("myClients")}
            >
              My Clients
            </Button>

            <Button
              variant={activeButton === "archived" ? "contained" : "outlined"}
              color="primary"
              onClick={() => handleButtonClick("archived")}
            >
              Archived
            </Button>
          </div>
          <br />

          {activeButton === "allClients" && (
            <div className="card">
              {/* <div
                className="card-header "
                style={{
                  backgroundColor: "#0098CA",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="card-title">
                  <h3
                    className="fw-bold m-0"
                    style={{ color: "#ffffff", fontSize: "1.5rem" }}
                  >
                    All Clients
                  </h3>
                </div>

                <div className="d-flex align-items-center position-relative my-1 p-5">
                  <i
                    className="nit-dt nit-magnifier fs-3 position-absolute ms-3"
                    style={{
                      left: "15px",
                      color: "#333",
                      zIndex: "1",
                    }}
                  >
                    <span className="path1"></span>
                    <span className="path2"></span>
                  </i>

                  <input
                    type="text"
                    id="nit_filter_search"
                    className="form-control form-control-sm form-control-solid w-200px ps-10 h-35"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={handleSearch}
                    style={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #ccc",
                      borderRadius: "20px",
                      paddingLeft: "40px",
                      color: "#333",
                      fontSize: "1rem",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      transition: "all 0.3s ease",
                    }}
                    onFocus={(e) => {
                      e.target.style.boxShadow =
                        "0 4px 12px rgba(0, 0, 0, 0.2)";
                      e.target.style.borderColor = "#0098CA";
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
                      e.target.style.borderColor = "#ccc";
                    }}
                  />
                </div>
              </div> */}
              <div
                className="card-header"
                style={{
                  backgroundColor: "#0098CA",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#007B9E"; // Darker shade on hover
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#0098CA"; // Original color
                }}
              >
                <div className="card-title">
                  <h3
                    className="fw-bold m-0"
                    style={{
                      color: "#ffffff",
                      fontSize: "1.2rem",
                      textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
                    }}
                  >
                    All Clients
                  </h3>
                </div>

                <div className="d-flex align-items-center position-relative my-1 mx-2">
                  <i
                    className="nit-dt nit-magnifier fs-3 position-absolute ms-3 "
                    style={{
                      left: "15px",
                      color: "#333",
                      zIndex: "1",
                    }}
                  >
                    <span className="path1"></span>
                    <span className="path2"></span>
                  </i>

                  <input
                    type="text"
                    id="nit_filter_search"
                    className="form-control form-control-sm form-control-solid w-200px ps-10 h-20"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={handleSearch}
                    style={{
                      backgroundColor: "#f9f9f9", // Softer background color
                      border: "1px solid #ccc",
                      borderRadius: "25px", // More rounded corners for a modern look
                      paddingLeft: "45px", // Increased padding for better spacing
                      height: "40px", // Slightly taller for better UX
                      color: "#333",
                      fontSize: "1rem",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
                      transition: "all 0.3s ease",
                      position: "relative",
                      outline: "none",
                    }}
                    onFocus={(e) => {
                      e.target.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.2)"; // Increased shadow on focus
                      e.target.style.borderColor = "#0098CA"; // Highlighted border color
                      e.target.style.backgroundColor = "#ffffff"; // White background on focus
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)"; // Return to original shadow on blur
                      e.target.style.borderColor = "#ccc"; // Return to default border color
                      e.target.style.backgroundColor = "#f9f9f9"; // Softer background color when not focused
                    }}
                    onMouseOver={(e) => {
                      e.target.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.15)"; // Slightly stronger shadow on hover
                    }}
                    onMouseOut={(e) => {
                      e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)"; // Return to original shadow when not hovered
                    }}
                  />

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
                          <td
                            style={{ width: "auto", cursor: "pointer" }}
                            onClick={() => handleSort("client_name")}
                          >
                            Name
                            {sortConfig.key === "client_name" &&
                              (sortConfig.direction === "asc" ? (
                                <ArrowDropUpIcon />
                              ) : (
                                <ArrowDropDownIcon />
                              ))}
                          </td>
                          <th
                            style={{ width: "auto", cursor: "pointer" }}
                            onClick={() => handleSort("client_manager")}
                          >
                            Client Manager
                            {sortConfig.key === "client_manager" &&
                              (sortConfig.direction === "asc" ? (
                                <ArrowDropUpIcon />
                              ) : (
                                <ArrowDropDownIcon />
                              ))}
                          </th>
                          <th
                            style={{ width: "auto", cursor: "pointer" }}
                            onClick={() => handleSort("operational_manager")}
                          >
                            Operational Manager
                            {sortConfig.key === "operational_manager" &&
                              (sortConfig.direction === "asc" ? (
                                <ArrowDropUpIcon />
                              ) : (
                                <ArrowDropDownIcon />
                              ))}
                          </th>
                          <th
                            style={{ width: "auto", cursor: "pointer" }}
                            onClick={() => handleSort("created_at")}
                          >
                            Created
                            {sortConfig.key === "created_at" &&
                              (sortConfig.direction === "asc" ? (
                                <ArrowDropUpIcon />
                              ) : (
                                <ArrowDropDownIcon />
                              ))}
                          </th>
                          <td style={{ width: "auto" }}>View</td>
                        </tr>
                      </thead>
                      <tbody className="fw-semibold text-gray-600">
                        {!loading &&
                          !error &&
                          (filteredClients.length > 0 ? (
                            filteredClients.map((client) => {
                              return (
                                <tr key={client.client_id}>
                                  <td>
                                    <div
                                      className="d-flex align-items-center"
                                      onClick={() =>
                                        handleClientClick(client.client_id)
                                      }
                                      style={{ cursor: "pointer" }}
                                    >
                                      <div className="me-2 position-relative">
                                        <div className="symbol symbol-25px symbol-circle">
                                          <img
                                            alt="Pic"
                                            src={user1}
                                            width={20}
                                            height={20}
                                          />
                                        </div>
                                      </div>
                                      <div className="d-flex flex-column justify-content-center">
                                        <a className="mb-1 text-gray-800 text-hover-primary">
                                          {client.client_name}
                                        </a>
                                      </div>
                                    </div>
                                  </td>

                                  <td>{client.client_manager?.username || "N/A"}</td>
                                  <td>{client.operational_manager?.username || "N/A"}</td>

                                  <td>
                                    {client.created_at
                                      ? new Date(client.created_at).toLocaleString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      })
                                      : "No date provided"}
                                  </td>

                                  <td>
                                    <Link
                                      to={`client/${client.client_id}`}
                                      className="btn btn-sm btn-light btn-active-light-primary"
                                    >
                                      View
                                    </Link>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan="5" className="text-center">
                                No clients found.
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeButton === "myClients" && <MyClients />}
          {activeButton === "archived" && <Archived />}
        </div>
      )}
    </>
  );
};

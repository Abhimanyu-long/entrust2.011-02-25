import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import law_firm from "/src/assets/media/users/law_firm.png";
import { useAuth } from "../../../context/AuthContext";
import { ClientMembers } from "./ClientMembers";
import { ProjectTrackerRecord } from "../projecttracker/ProjectTrackerRecord";
import { Modal, Button, Form } from "react-bootstrap";
import { CaseTrackerRecord } from "../casetracker/CaseTrackerRecord";
import { PendingApproval } from "./PendingApproval";
import { Financial } from "./Financial";
import "../../assets/css/group.css";


export const ClientsDetails = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const clientIdNumber = parseInt(clientId, 10);
  const { getAllClients, updateClientInformation } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const [showClientDetails, setShowClientDetails] = useState(false);
  const handleShowClientDetails = () => setShowClientDetails(true);
  const handleCloseClient = () => setShowClientDetails(false);

  const [clientDetails, setClientDetails] = useState({
    client_name: "",
    contact_no: "",
    website: "",
    email: "",
    address_line_1: "",
    address_line_2: "",
    country: "",
    operational_manager: { id: "", username: "" },
  });

  // Effect to set activeTab based on the URL
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("projects")) {
      setActiveTab("clientProjects");
    } else if (path.includes("members")) {
      setActiveTab("clientMembers");
    } else if (path.includes("cases")) {
      setActiveTab("caseTracker");
    } else if (path.includes("case_estimate_status")) {
      setActiveTab("pendingApproval");
    } else if (path.includes("financial")) {
      setActiveTab("financial");
    } else {
      setActiveTab("basicInfo");
    }
  }, [location.pathname]);

  const [activeTab, setActiveTab] = useState("basicInfo");
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "clientProjects") {
      navigate(`/allclients/client/${clientId}/projects`);
    } else if (tab === "clientMembers") {
      navigate(`/allclients/client/${clientId}/members`);
    } else if (tab === "caseTracker") {
      navigate(`/allclients/client/${clientId}/cases`);
    } else if (tab === "pendingApproval") {
      navigate(`/allclients/client/${clientId}/case_estimate_status`)
    } else if (tab === "financial") {
      navigate(`/allclients/client/${clientId}/financial`)
    } else {
      navigate(`/allclients/client/${clientId}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getAllClients();
        const foundClient = response.find(
          (client) => client.client_id === clientIdNumber
        );
        setSelectedClient(foundClient);

        setClientDetails({
          client_name: foundClient?.client_name || "",
          contact_no: foundClient?.contact_no || "",
          website: foundClient?.website || "",
          email: foundClient?.email || "",
          address_line_1: foundClient?.address_line_1 || "",
          address_line_2: foundClient?.address_line_2 || "",
          country: foundClient?.country || "",
          operational_manager: {
            id: foundClient?.operational_manager?.id || "",
            username: foundClient?.operational_manager?.username || "",
          },
        });
      } catch (error) {
        console.error("Error fetching clients:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getAllClients, clientIdNumber]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "operational_manager.username") {
      setClientDetails((prevDetails) => ({
        ...prevDetails,
        operational_manager: {
          ...prevDetails.operational_manager,
          username: value,
        },
      }));
    } else {
      setClientDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    try {
      await updateClientInformation(clientIdNumber, clientDetails);
      setShowModal(false);
    } catch (error) {
      console.error("Error updating client details:", error.message);
    }
  };

  const handleaddProjectClick = () => {
    navigate(`/allclients/client/${clientId}/addProject`);
  };

  const handleaddCase = () => {
    navigate(`/allclients/client/${clientId}/addCase`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!selectedClient)
    return <div>No client found with ID {clientIdNumber}</div>;

  // console.log(selectedClient);

  return (
    <>
      <div className="container-fluid my-4 pt-4">
        <div className=" p-4 shadow-lg rounded" style={{ margin: 'auto', borderWidth: '2px' }}>
          <div className="d-flex  bg-light flex-column flex-md-row align-items-center justify-content-between mb-4 p-3  shadow-sm rounded">
            <div className="d-flex align-items-center mb-3 mb-md-0">
              <div className="me-3">
                <img
                  src={law_firm}
                  alt="Firm Logo"
                  className="img-fluid rounded-circle border border-2"
                  style={{ width: '60px', height: '60px', objectFit: 'cover', borderColor: '#0098CA' }}
                />
              </div>
              <div>
                <h4 className="text-primary mb-0" style={{ color: '#0098CA', fontWeight: '600' }}>
                  {selectedClient.client_name}
                </h4>
                <small className="text-muted">
                  {selectedClient.address_line_1 || 'Address not provided'}
                </small>
              </div>
            </div>

            <div className="d-flex flex-column flex-sm-row">
              <button
                className="btn btn-primary btn-sm me-0 me-sm-2 mb-2 mb-sm-0 add-project-btn"
                style={{ backgroundColor: "#0098CA", color: "#FFF" }}
                onClick={handleaddProjectClick}
              >
                <b>Add Project</b>
              </button>
              <button className="btn btn-primary btn-sm add-case-btn" onClick={handleaddCase}>
                <b>Add Case</b>
              </button>
            </div>
          </div>

        
          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-6 col-md-4">
              <div className="card shadow-sm p-3 text-center border-0 position-relative" style={{ borderColor: '#0098CA', background: 'linear-gradient(135deg, #e0f7fa, #b2ebf2)' }}>
                <i className="fas fa-credit-card text-success position-absolute" style={{ top: '10px', left: '10px' }}></i>
                <h5 className="text-success">${selectedClient.total_credit}</h5>
                <p className="text-muted mb-0"><b>Total Credit</b></p>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-4">
              <div className="card shadow-sm p-3 text-center border-0 position-relative" style={{ borderColor: '#FF6B6B', background: 'linear-gradient(135deg, #ffe6e6, #ffcccc)' }}>
                <i className="fas fa-wallet text-danger position-absolute" style={{ top: '10px', left: '10px' }}></i>
                <h5 className="text-danger">${selectedClient.utilized}</h5>
                <p className="text-muted mb-0"><b>Utilized</b></p>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-4">
              <div className="card shadow-sm p-3 text-center border-0 position-relative" style={{ borderColor: '#0098CA', background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)' }}>
                <i className="fas fa-wallet text-info position-absolute" style={{ top: '10px', left: '10px' }}></i>
                <h5 className="text-info">${selectedClient.balance}</h5>
                <p className="text-muted mb-0"><b>Balance</b></p>
              </div>
            </div>
          </div>

     
          <div className="nav-wrapper cursor-pointer" >
            <ul className="nav nav-tabs mb-3 flex-nowrap flex-sm-wrap overflow-auto">
              <li className="nav-item">
                <a className={`nav-link ${activeTab === "basicInfo" ? "active" : ""}`} onClick={() => setActiveTab("basicInfo")}><b>Basic Info</b></a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${activeTab === "clientMembers" ? "active" : ""}`} onClick={() => setActiveTab("clientMembers")}><b>Client Members</b></a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${activeTab === "clientProjects" ? "active" : ""}`} onClick={() => setActiveTab("clientProjects")}><b>Projects</b></a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${activeTab === "caseTracker" ? "active" : ""}`} onClick={() => setActiveTab("caseTracker")}><b>Case Tracker</b></a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${activeTab === "pendingApproval" ? "active" : ""}`} onClick={() => setActiveTab("pendingApproval")}><b>Pending Approval</b></a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${activeTab === "financial" ? "active" : ""}`} onClick={() => setActiveTab("financial")}><b>Financial</b></a>
              </li>
            </ul>
          </div>


          <div className="tab-content">
            {activeTab === "basicInfo" && (
          
              <div className="row pt-3 bg-light ">
                <div className="col-md-6 mb-4">
                  <div className="card shadow-sm bg-light p-4 " style={{  backgroundColor: '#f9f9f9' }}>
                    <div className="d-flex justify-content-between align-items-center  mb-3">
                      <h6 className="text-primary" style={{ color: '#0098CA', fontSize: '18px', fontWeight: '600' }}>
                        <i className="fas fa-building me-2"></i> Organisation Details
                      </h6>
                      <button className="btn btn-outline-primary btn-sm" onClick={handleShow}
                        style={{
                          color: '#fff',
                          backgroundColor: '#0098CA',
                          borderColor: '#0098CA',
                          borderRadius: '30px',
                          padding: '5px 15px'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#007bbd'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#0098CA'}
                      >
                        <i className="fas fa-edit me-1"></i> Edit Profile
                      </button>
                    </div>
                    <p><strong>Firm Name:</strong>  {selectedClient.client_name}</p>
                    <p><strong>Contact Number:</strong>
                      <span className="fw-bold fs-6 text-gray-800 me-2">
                          &nbsp;{selectedClient.contact_no ? selectedClient.contact_no : "No contact number provided"}
                      </span>
                      <span className="badge badge-success rounded-pill">Verified</span>
                    </p>
                    <p><strong>Email:</strong> &nbsp; {selectedClient.email || 'N/A'}</p>
                    <p><strong>Company Site:</strong>
                      <a href="#" className="fw-semibold fs-6 text-primary text-hover-primary">
                      &nbsp; {selectedClient.website ? selectedClient.website : "No company site provided"}
                      </a>
                    </p>
                    <p><strong>Company Email:</strong>
                      <a href="#" className="fw-semibold fs-6 text-primary text-hover-primary">
                      &nbsp;  {selectedClient.email ? selectedClient.email : "No company email provided"}
                      </a>
                    </p>
                    <p><strong>Company Address:</strong>
                      <a href="#" className="fw-semibold fs-6 text-primary text-hover-primary">
                      &nbsp; {selectedClient.address_line_1 || selectedClient.address_line_2
                          ? `${selectedClient.address_line_1 || ""} ${selectedClient.address_line_2 || ""}`.trim()
                          : "No address provided"}
                      </a>
                    </p>
                    <p><strong>Company Country:</strong>
                      <a href="#" className="fw-semibold fs-6 text-primary text-hover-primary">
                      &nbsp; {selectedClient.country ? selectedClient.country : "No company country provided"}
                      </a>
                    </p>
                    <p><strong>Communication:</strong>
                    &nbsp; <span className="fw-bold fs-6 text-gray-800">Email, Phone</span>
                    </p>
                    <p><strong>Operational Manager:</strong>
                      <span className="fw-semibold fs-6 text-gray-800">
                      &nbsp;  {selectedClient.operational_manager_id ? selectedClient.operational_manager_id : "No operational manager provided"}
                      </span>
                    </p>
                    <div className="row mb-4">
                      <label className="col-lg-4 fw-semibold text-primary">
                        <span style={{ cursor: "pointer" }}
                          onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
                          onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
                          onClick={handleShowClientDetails}
                        >
                          ...more details
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 mb-4">
                  <div className="card shadow-sm p-4 bg-light" style={{ backgroundColor: '#f9f9f9' }}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="text-primary" style={{ color: '#0098CA', fontSize: '18px', fontWeight: '600' }}>
                        <i className="fas fa-concierge-bell me-2"></i> Service Details
                      </h6>
                      <button className="btn btn-outline-primary btn-sm"
                        style={{
                          color: '#fff',
                          backgroundColor: '#0098CA',
                          borderColor: '#0098CA',
                          borderRadius: '30px',
                          padding: '5px 15px'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#007bbd'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#0098CA'}
                      >
                        <i className="fas fa-edit me-1"></i> Edit Details
                      </button>
                    </div>
                    <p><strong>Service Name:</strong> Demand Letter, Medical Records Review</p>
                    <p><strong>Rate:</strong> $15/hour</p>
                    <p><strong>Samples Offered:</strong> 5 Samples</p>
                  </div>
                </div>
              </div>

            )}

            {activeTab === "clientMembers" && (
              <div className="row">
                <div className="col-md-12">
                  <div className="card shadow-sm p-3 bg-light" style={{ borderColor: '#0098CA' }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="text-primary" style={{ color: '#0098CA' }}>Client Members</h6>
                      <button className="btn btn-primary btn-sm add-case-btn" onClick={handleaddCase}>
                        <b>Edit Members</b>
                      </button>
                      {/* <button className="btn btn-outline-primary btn-sm" style={{ color: '#0098CA', borderColor: '#0098CA' }}>Edit Members</button> */}
                    </div>
                    {/* Client members list will go here */}
                    <ClientMembers />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "clientProjects" && (
             
              <div className="row">
                <div className="col-md-12">
                  <div className="card shadow-sm p-3 border-0" style={{ borderLeft: '4px solid #0098CA' }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="mb-0 text-primary" style={{ color: '#0098CA' }}>Projects</h6>
                      {/* <button className="btn btn-outline-primary btn-sm" style={{ color: '#0098CA', borderColor: '#0098CA' }}>
                        Edit Projects
                      </button> */}
                    </div>

                    <div className="mt-3">
                      <ProjectTrackerRecord clientId={clientId} />
                    </div>
                  </div>
                </div>
              </div>

            )}

            {activeTab === "caseTracker" && (
            
              <div className="row">
                <div className="col-md-12">
                  <div
                    className="card shadow-sm p-3 border-0"
                    style={{
                      borderColor: '#0098CA',
                      borderRadius: '8px',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6
                        className="text-primary m-0"
                        style={{
                          color: '#0098CA',
                          fontWeight: 'bold',
                          fontSize: '16px',
                          marginBottom: '0',
                        }}
                      >
                        Case Tracker
                      </h6>
                      <button className="btn btn-primary btn-sm add-case-btn" onClick={handleaddCase}>
                        <b>Edit Cases</b>
                      </button>

                    </div>
                    {/* Case tracker content */}
                    <div className="mt-2">
                      <CaseTrackerRecord clientId={clientId} />
                    </div>
                  </div>
                </div>
              </div>

            )}

            {activeTab === "pendingApproval" && (

              <div className="row">
                <div className="col-md-12">
                  <div
                    className="p-4 rounded-lg"
                    style={{
                      borderColor: 'grey',
                      borderWidth: '1px',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',

                    }}

                  >
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6
                        className="text-primary d-flex align-items-center"
                        style={{
                          color: '#0098CA',

                          fontWeight: '700',
                          margin: '0',
                          letterSpacing: '0.5px',
                        }}
                      >
                        <i
                          className="fas fa-clock fs-8"
                          style={{ marginRight: '8px' }}
                        ></i>
                        Pending Approval
                      </h6>
                      {/* <button
                        className="btn btn-outline-primary btn-sm rounded me-2"
                        style={{
                          color: '#fff',
                          backgroundColor: '#0098CA',
                          borderColor: 'grey',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 12px rgba(0, 152, 202, 0.3)',
                        }}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = '#007DAA')}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = '#0098CA')}
                      >
                        <b>Edit Pending</b>
                      </button> */}
                    </div>
                    {/* Pending approval content */}
                    <div
                      // className="approval-content"
                      style={{
                        padding: '12px',
                        border: '1px solid #e4e6ef',
                        borderRadius: '10px',
                        backgroundColor: '#fff',
                        boxShadow: 'inset 0 0 6px rgba(0,0,0,0.05)',
                      }}
                    >
                      <PendingApproval clientId={clientId} />
                    </div>
                  </div>
                </div>
              </div>

            )}

            {activeTab === "financial" && (
              <div className="row">
                <div className="col-md-12">
                  <div className="card shadow-sm p-3" style={{ borderColor: '#0098CA' }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="text-primary" style={{ color: '#0098CA' }}>Financial Settings</h6>
                      {/* <button className="btn btn-outline-primary btn-sm" style={{ color: '#0098CA', borderColor: '#0098CA' }}>Edit Financials</button> */}
                    </div>
                    {/* Financial settings content */}
                    <Financial clientId={clientId} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>



      <Modal show={showModal} onHide={handleClose} size="md" centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title className="text-white" >Edit Organisation Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row">
              {/* Column 1 */}
              <div className="col-lg-6 col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className="fs-7 fw-bold">Firm Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="client_name"
                    className="p-2 fs-8 rounded"
                    value={clientDetails.client_name}
                    onChange={handleInputChange}
                    placeholder="Enter firm name"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fs-7 fw-bold">Company Site</Form.Label>
                  <Form.Control
                    type="text"
                    name="website"
                    className="p-2 fs-8 rounded"
                    value={clientDetails.website}
                    onChange={handleInputChange}
                    placeholder="Enter website"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fs-6 fw-bold">Address Line 1</Form.Label>
                  <Form.Control
                    type="text"
                    name="address_line_1"
                    className="p-2 fs-8 rounded"
                    value={clientDetails.address_line_1}
                    onChange={handleInputChange}
                    placeholder="Enter address line 1"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fs-6 fw-bold">Country</Form.Label>
                  <Form.Control
                    type="text"
                    name="country"
                    className="p-2 fs-8 rounded"
                    value={clientDetails.country}
                    onChange={handleInputChange}
                    placeholder="Enter country"
                  />
                </Form.Group>
              </div>

              {/* Column 2 */}
              <div className="col-lg-6 col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className="fs-7 fw-bold">Contact Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="contact_no"
                    className="p-2 fs-8 rounded"
                    value={clientDetails.contact_no}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fs-7 fw-bold">Company Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    className="p-2 fs-8 rounded"
                    value={clientDetails.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fs-7 fw-bold">Address Line 2</Form.Label>
                  <Form.Control
                    type="text"
                    name="address_line_2"
                    className="p-2 fs-8 rounded"
                    value={clientDetails.address_line_2}
                    onChange={handleInputChange}
                    placeholder="Enter address line 2"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fs-7 fw-bold">Operational Manager</Form.Label>
                  <Form.Control
                    type="text"
                    name="operational_manager.username"
                    className="p-2 fs-8 rounded"
                    value={clientDetails.operational_manager.username}
                    onChange={handleInputChange}
                    placeholder="Enter operational manager"
                  />
                </Form.Group>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-end">
          <Button variant="secondary" className="p-2 fs-7 btn-sm me-2" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" className="p-2 fs-7 btn-sm" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>


      {/* <Modal
        show={showClientDetails}
        onHide={handleCloseClient}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Organisation Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="card-body p-1">
           
            <div className="row mb-2">
              <label className="col-lg-4 fw-semibold text-muted">
                Firm Name
              </label>
              <div className="col-lg-8">
                <span className="fw-bold fs-6 text-gray-800">
                  {selectedClient.client_name}
                </span>
              </div>
            </div>

            <div className="row mb-2">
              <label className="col-lg-4 fw-semibold text-muted">
                Contact Phone
              </label>
              <div className="col-lg-8 d-flex align-items-center">
                <span className="fw-bold fs-6 text-gray-800 me-2">
                  {selectedClient.contact_no
                    ? selectedClient.contact_no
                    : "No contact number provided"}
                </span>
                <span className="badge badge-success">Verified</span>
              </div>
            </div>

            <div className="row mb-2">
              <label className="col-lg-4 fw-semibold text-muted">
                Client Manager
              </label>
              <div className="col-lg-8">
                <span className="fw-semibold fs-6 text-gray-800">
                  {selectedClient.client_manager?.username ||
                    "No client manager provided"}
                </span>
              </div>
            </div>

            <div className="row mb-2">
              <label className="col-lg-4 fw-semibold text-muted">
                Operational Manager
              </label>
              <div className="col-lg-8">
                <span className="fw-semibold fs-6 text-gray-800">
                  {selectedClient.operational_manager?.username ||
                    "No operational manager provided"}
                </span>
              </div>
            </div>

            <div className="row mb-2">
              <label className="col-lg-4 fw-semibold text-muted">
                Start Date
              </label>
              <div className="col-lg-8">
                <span className="fw-semibold fs-6 text-gray-800">
                  {selectedClient.start_date || "No start date provided"}
                </span>
              </div>
            </div>

            <div className="row mb-2">
              <label className="col-lg-4 fw-semibold text-muted">
                End Date
              </label>
              <div className="col-lg-8">
                <span className="fw-semibold fs-6 text-gray-800">
                  {selectedClient.end_date || "No end date provided"}
                </span>
              </div>
            </div>

            <div className="row mb-2">
              <label className="col-lg-4 fw-semibold text-muted">
                Company Address
              </label>
              <div className="col-lg-8">
                <span className="fw-semibold fs-6 text-gray-800">
                  {`${selectedClient.address_line_1 || ""} ${selectedClient.address_line_2 || ""
                    }`.trim() || "No address provided"}
                </span>
              </div>
            </div>

            <div className="row mb-2">
              <label className="col-lg-4 fw-semibold text-muted">City</label>
              <div className="col-lg-8">
                <span className="fw-semibold fs-6 text-gray-800">
                  {selectedClient.city || "No city provided"}
                </span>
              </div>
            </div>

            <div className="row mb-2">
              <label className="col-lg-4 fw-semibold text-muted">State</label>
              <div className="col-lg-8">
                <span className="fw-semibold fs-6 text-gray-800">
                  {selectedClient.state || "No state provided"}
                </span>
              </div>
            </div>

            <div className="row mb-2">
              <label className="col-lg-4 fw-semibold text-muted">Country</label>
              <div className="col-lg-8">
                <span className="fw-semibold fs-6 text-gray-800">
                  {selectedClient.country || "No country provided"}
                </span>
              </div>
            </div>

            <div className="row mb-2">
              <label className="col-lg-4 fw-semibold text-muted">
                Postal Code
              </label>
              <div className="col-lg-8">
                <span className="fw-semibold fs-6 text-gray-800">
                  {selectedClient.postal_code || "No postal code provided"}
                </span>
              </div>
            </div>

            <div className="row mb-2">
              <label className="col-lg-4 fw-semibold text-muted">
                Contact Phone
              </label>
              <div className="col-lg-8">
                <span className="fw-semibold fs-6 text-gray-800">
                  {selectedClient.contact_no || "No contact number provided"}
                </span>
              </div>
            </div>

            <div className="row mb-2">
              <label className="col-lg-4 fw-semibold text-muted">Website</label>
              <div className="col-lg-8">
                <span className="fw-semibold fs-6 text-gray-800">
                  {selectedClient.website || "No website provided"}
                </span>
              </div>
            </div>

            <div className="row mb-2">
              <label className="col-lg-4 fw-semibold text-muted">
                SMS Notifications
              </label>
              <div className="col-lg-8">
                <span className="fw-semibold fs-6 text-gray-800">
                  {selectedClient.sms_notifications ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>

            <div className="row mb-2">
              <label className="col-lg-4 fw-semibold text-muted">
                Carrier Code
              </label>
              <div className="col-lg-8">
                <span className="fw-semibold fs-6 text-gray-800">
                  {selectedClient.carrier_code || "No carrier code provided"}
                </span>
              </div>
            </div>

            <div className="row mb-2">
              <label className="col-lg-4 fw-semibold text-muted">
                Source Code
              </label>
              <div className="col-lg-8">
                <span className="fw-semibold fs-6 text-gray-800">
                  {selectedClient.source_code || "No source code provided"}
                </span>
              </div>
            </div>

            <div className="row mb-2">
              <label className="col-lg-4 fw-semibold text-muted">
                Expected Billing
              </label>
              <div className="col-lg-8">
                <span className="fw-semibold fs-6 text-gray-800">
                  {selectedClient.expected_billing || 0}
                </span>
              </div>
            </div>

            <div className="row mb-2">
              <label className="col-lg-4 fw-semibold text-muted">
                Group Type
              </label>
              <div className="col-lg-8">
                <span className="fw-semibold fs-6 text-gray-800">
                  {selectedClient.group_type || "No group type provided"}
                </span>
              </div>
            </div>

            <div className="row mb-2">
              <label className="col-lg-4 fw-semibold text-muted">
                Attach Supporting Documents
              </label>
              <div className="col-lg-8">
                <span className="fw-semibold fs-6 text-gray-800">
                  {selectedClient.attach_supporting_documents ? "Yes" : "No"}
                </span>
              </div>
            </div>

            <div className="row mb-2">
              <label className="col-lg-4 fw-semibold text-muted">
                Archived
              </label>
              <div className="col-lg-8">
                <span className="fw-semibold fs-6 text-gray-800">
                  {selectedClient.is_archived ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal> */}


      <Modal
        show={showClientDetails}
        onHide={handleCloseClient}
        size="lg"
        centered
        className="rounded-3 shadow-sm modal-custom"
      >
        <Modal.Header closeButton className="bg-primary text-white rounded-top">
          <Modal.Title className="fw-bold text-white text-center w-100">
            Organisation Details
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="bg-light p-4">
          <div className="border-0  rounded-3 ">
            <div className="p-4 bg-light">

              <div className="row mb-4 align-items-center">
                <label className="col-lg-4 fw-bold text-muted d-flex align-items-center">
                  <i className="bi bi-building me-2"></i> Firm Name:
                </label>
                <div className="col-lg-8">
                  <span className="fw-bold fs-5 text-dark">
                    {selectedClient.client_name}
                  </span>
                </div>
              </div>


              <div className="row mb-4 align-items-center">
                <label className="col-lg-4 fw-bold text-muted d-flex align-items-center">
                  <i className="bi bi-telephone me-2"></i> Contact Phone:
                </label>
                <div className="col-lg-8 d-flex align-items-center">
                  <span className="fw-bold fs-5 text-dark me-2">
                    {selectedClient.contact_no || "No contact number provided"}
                  </span>
                  {selectedClient.contact_no && (
                    <span className="badge bg-success">Verified</span>
                  )}
                </div>
              </div>


              <div className="row mb-4 align-items-center">
                <label className="col-lg-4 fw-bold text-muted d-flex align-items-center">
                  <i className="bi bi-person-badge me-2"></i> Client Manager:
                </label>
                <div className="col-lg-8">
                  <span className="fw-semibold fs-5 text-dark">
                    {selectedClient.client_manager?.username || "No client manager provided"}
                  </span>
                </div>
              </div>


              <div className="row mb-4 align-items-center">
                <label className="col-lg-4 fw-bold text-muted d-flex align-items-center">
                  <i className="bi bi-person-gear me-2"></i> Operational Manager:
                </label>
                <div className="col-lg-8">
                  <span className="fw-semibold fs-5 text-dark">
                    {selectedClient.operational_manager?.username || "No operational manager provided"}
                  </span>
                </div>
              </div>


              <div className="row mb-4 align-items-center">
                <label className="col-lg-4 fw-bold text-muted d-flex align-items-center">
                  <i className="bi bi-calendar me-2"></i> Start Date:
                </label>
                <div className="col-lg-8">
                  <span className="fw-semibold fs-5 text-dark">
                    {selectedClient.start_date || "No start date provided"}
                  </span>
                </div>
              </div>


              <div className="row mb-4 align-items-center">
                <label className="col-lg-4 fw-bold text-muted d-flex align-items-center">
                  <i className="bi bi-calendar-check me-2"></i> End Date:
                </label>
                <div className="col-lg-8">
                  <span className="fw-semibold fs-5 text-dark">
                    {selectedClient.end_date || "No end date provided"}
                  </span>
                </div>
              </div>


              <div className="row mb-4 align-items-center">
                <label className="col-lg-4 fw-bold text-muted d-flex align-items-center">
                  <i className="bi bi-geo-alt me-2"></i> Company Address:
                </label>
                <div className="col-lg-8">
                  <span className="fw-semibold fs-5 text-dark">
                    {`${selectedClient.address_line_1 || ""} ${selectedClient.address_line_2 || ""}`.trim() || "No address provided"}
                  </span>
                </div>
              </div>


              <div className="row mb-4 align-items-center">
                <label className="col-lg-4 fw-bold text-muted d-flex align-items-center">
                  <i className="bi bi-building me-2"></i> City:
                </label>
                <div className="col-lg-8">
                  <span className="fw-semibold fs-5 text-dark">
                    {selectedClient.city || "No city provided"}
                  </span>
                </div>
              </div>


              <div className="row mb-4 align-items-center">
                <label className="col-lg-4 fw-bold text-muted d-flex align-items-center">
                  <i className="bi bi-geo me-2"></i> State:
                </label>
                <div className="col-lg-8">
                  <span className="fw-semibold fs-5 text-dark">
                    {selectedClient.state || "No state provided"}
                  </span>
                </div>
              </div>


              <div className="row mb-4 align-items-center">
                <label className="col-lg-4 fw-bold text-muted d-flex align-items-center">
                  <i className="bi bi-globe me-2"></i> Country:
                </label>
                <div className="col-lg-8">
                  <span className="fw-semibold fs-5 text-dark">
                    {selectedClient.country || "No country provided"}
                  </span>
                </div>
              </div>


              <div className="row mb-4 align-items-center">
                <label className="col-lg-4 fw-bold text-muted d-flex align-items-center">
                  <i className="bi bi-mailbox me-2"></i> Postal Code:
                </label>
                <div className="col-lg-8">
                  <span className="fw-semibold fs-5 text-dark">
                    {selectedClient.postal_code || "No postal code provided"}
                  </span>
                </div>
              </div>


              <div className="row mb-4 align-items-center">
                <label className="col-lg-4 fw-bold text-muted d-flex align-items-center">
                  <i className="bi bi-link me-2"></i> Website:
                </label>
                <div className="col-lg-8">
                  <span className="fw-semibold fs-5 text-dark">
                    {selectedClient.website || "No website provided"}
                  </span>
                </div>
              </div>


              <div className="row mb-4 align-items-center">
                <label className="col-lg-4 fw-bold text-muted d-flex align-items-center">
                  <i className="bi bi-chat-dots me-2"></i> SMS Notifications:
                </label>
                <div className="col-lg-8">
                  <span className="fw-semibold fs-5 text-dark">
                    {selectedClient.sms_notifications ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>


              <div className="row mb-4 align-items-center">
                <label className="col-lg-4 fw-bold text-muted d-flex align-items-center">
                  <i className="bi bi-truck me-2"></i> Carrier Code:
                </label>
                <div className="col-lg-8">
                  <span className="fw-semibold fs-5 text-dark">
                    {selectedClient.carrier_code || "No carrier code provided"}
                  </span>
                </div>
              </div>


              <div className="row mb-4 align-items-center">
                <label className="col-lg-4 fw-bold text-muted d-flex align-items-center">
                  <i className="bi bi-currency-dollar me-2"></i> Expected Billing;
                </label>
                <div className="col-lg-8">
                  <span className="fw-semibold fs-5 text-dark">
                    {selectedClient.expected_billing || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>


    </>
  );
};

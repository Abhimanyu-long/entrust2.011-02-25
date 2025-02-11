import React, { useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import { Modal, Button } from "react-bootstrap";
import { SelectProviderSearch } from "./SelectProviderSearch";
import { MedicalUserDetail } from "./MedicalUserDetail";
import healthcare from "../../assets/media/users/healthcare.png";
import { MedicalRecords } from "./MedicalRecords";
import { CaseManagementReports } from "./CaseManagementReports";
import { SearchIndividualRequest } from "./SearchIndividualRequest";
import { RecordsAvailable } from "./RecordsAvailable";
import { useNavigate } from 'react-router-dom';

export const Medical = () => {
    const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    requestDate: "",
    hearingDate: "",
    policyClaimPID: "",
    rushOrder: false,
    guardianFirstName: "",
    guardianMiddleName: "",
    guardianLastName: "",
    relations: "",
    minor: false,
    death: false,
    lastName: "",
    firstName: "",
    initials: "",
    mi: "",
    dob: "",
    ssn: "",
    address: "",
    state: "",
    city: "",
    zip: "",
    daytimePhone: "",
    phone: "",
    email: "",
    fax: "",

    authType: "HITECH",
    signature: null,

    identifier1: "",
    identifier2: "",
    identifier3: "",
    requestType: "Internal",
    sendMethod: "None",
    chargeAmount: "",
  });

  const [existingSignature, setExistingSignature] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      signature: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the form submission
    // console.log(formData);
  };

  // this is for model
  const handleSave = async () => {
    alert("you are working");
  };

  const [activeTab, setActiveTab] = useState("CreateMedicalOrder");

  const handleTabClick = (tab) => {
    setActiveTab(tab);

    if (tab === "medicalRecords") {
      navigate(`/medical/medicalrecords`);
    } else if (tab === "CaseManagementReports") {
      navigate(`/medical/casemanagementreports`);
    } else if (tab === "SearchIndividualRequest") {
      navigate(`/medical/searchindividualrequest`);
    } else if (tab === "RecordsAvailable") {
      navigate(`/medical/recordsavailable`);
    } else {
      navigate(`/medical/createmedicalorder`);
    }
  };

  return (
    <>
      <div className="card mb-5 mb-xl-10">
        <div className="card-body pt-9 pb-0">
          <div className="d-flex flex-wrap flex-sm-nowrap mb-2">
            <div className="me-7 mb-4">
              <div className="symbol symbol-70px symbol-lg-70px symbol-fixed position-relative">
                <img src={healthcare} alt="image" />
                <div className="position-absolute translate-middle bottom-0 start-100 mb-6 bg-success rounded-circle border border-4 border-body h-20px w-20px"></div>
              </div>
            </div>
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-start flex-wrap mb-2">
                <div className="d-flex flex-column">
                  <div className="d-flex align-items-center mb-2">
                    <a
                      href="#"
                      className="text-gray-900 text-hover-primary fs-2 fw-bold me-1"
                    >
                      Clients Name
                    </a>
                    <a href="#">
                      <i className="nit-dt nit-verify fs-1 text-primary">
                        <span className="path1"></span>
                        <span className="path2"></span>
                      </i>
                    </a>
                    <a
                      href="#"
                      className="btn btn-sm btn-light-success fw-bold ms-2 fs-8 py-1 px-3"
                      data-bs-toggle="modal"
                      data-bs-target="#nit_modal_upgrade_plan"
                    >
                      Verified
                    </a>
                  </div>
                  <div className="d-flex flex-wrap fw-semibold fs-6 mb-4 pe-2">
                    <a
                      href="#"
                      className="d-flex align-items-center text-gray-500 text-hover-primary me-5 mb-2"
                    >
                      <i className="nit-dt nit-geolocation fs-4 me-1">
                        <span className="path1"></span>
                        <span className="path2"></span>
                      </i>
                      Clients ( address provided )
                    </a>
                    <a
                      href="#"
                      className="d-flex align-items-center text-gray-500 text-hover-primary mb-2"
                    >
                      <i className="nit-dt nit-sms fs-4 me-1">
                        <span className="path1"></span>
                        <span className="path2"></span>
                      </i>
                      Clients ( valid Gmail )
                    </a>
                  </div>
                </div>
                <div className="d-flex my-4">
                  <div className="me-0">
                    <button
                      className="btn btn-sm btn-icon btn-bg-light btn-active-color-primary"
                      data-nit-menu-trigger="click"
                      data-nit-menu-placement="bottom-end"
                    >
                      <i className="bi bi-three-dots text-primary fs-3"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div className="d-flex flex-wrap flex-stack">
                {/* <div className="d-flex flex-column flex-grow-1 pe-8">
                  <div className="d-flex flex-wrap">
                    <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                      <div className="d-flex align-items-center">
                        <i className="nit-dt nit-arrow-up fs-2 text-success me-2">
                          <span className="path1"></span>
                          <span className="path2"></span>
                        </i>
                        <div
                          className="fs-2 fw-bold counted"
                          data-nit-countup="true"
                          data-nit-countup-value="4500"
                          data-nit-countup-prefix="$"
                          data-nit-initialized="1"
                        >
                          $5,400
                        </div>
                      </div>
                      <div className="fw-semibold fs-6 text-gray-500">
                        Total Credit
                      </div>
                    </div>
                    <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3 flex-center">
                      <div className="d-flex align-items-center">
                        <i className="nit-dt nit-arrow-down fs-2 text-danger me-2">
                          <span className="path1"></span>
                          <span className="path2"></span>
                        </i>
                        <div
                          className="fs-2 fw-bold counted"
                          data-nit-countup="true"
                          data-nit-countup-value="75"
                          data-nit-initialized="1"
                        >
                          $2,075
                        </div>
                      </div>
                      <div className="fw-semibold flex-center fs-6 text-gray-500">
                        Utilized
                      </div>
                    </div>
                    <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3 align-items-center">
                      <div className="d-flex align-items-center">
                        <i className="nit-dt nit-arrow-up fs-2 text-success me-2">
                          <span className="path1"></span>
                          <span className="path2"></span>
                        </i>
                        <div
                          className="fs-2 fw-bold counted"
                          data-nit-countup="true"
                          data-nit-countup-value="60"
                          data-nit-countup-prefix="%"
                          data-nit-initialized="1"
                        >
                          $3,325
                        </div>
                      </div>
                      <div className="fw-semibold fs-6 text-gray-500 align-middle">
                        Balance
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
          <ul className="nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bold">
            <li className="nav-item mt-2" style={{ cursor: "pointer" }}>
              <a
                className={`nav-link text-active-primary ms-0 me-10 py-5 ${
                  activeTab === "CreateMedicalOrder" ? "active" : ""
                }`}
                onClick={() => handleTabClick("CreateMedicalOrder")}
              >
                Create Medical Order
              </a>
            </li>
            <li className="nav-item mt-2" style={{ cursor: "pointer" }}>
              <a
                className={`nav-link text-active-primary ms-0 me-10 py-5 ${
                  activeTab === "medicalRecords" ? "active" : ""
                }`}
                onClick={() => handleTabClick("medicalRecords")}
              >
                Medical Records
              </a>
            </li>
            <li className="nav-item mt-2" style={{ cursor: "pointer" }}>
              <a
                className={`nav-link text-active-primary ms-0 me-10 py-5 ${
                  activeTab === "CaseManagementReports" ? "active" : ""
                }`}
                onClick={() => handleTabClick("CaseManagementReports")}
              >
                Case Management Reports
              </a>
            </li>
            <li className="nav-item mt-2" style={{ cursor: "pointer" }}>
              <a
                className={`nav-link text-active-primary ms-0 me-10 py-5 ${
                  activeTab === "SearchIndividualRequest" ? "active" : ""
                }`}
                onClick={() => handleTabClick("SearchIndividualRequest")}
              >
                Search For Individual Request
              </a>
            </li>
            <li className="nav-item mt-2" style={{ cursor: "pointer" }}>
              <a
                className={`nav-link text-active-primary ms-0 me-10 py-5 ${
                  activeTab === "RecordsAvailable" ? "active" : ""
                }`}
                onClick={() => handleTabClick("RecordsAvailable")}
              >
                Records now available
              </a>
            </li>
          </ul>
        </div>
      </div>

      {activeTab === "CreateMedicalOrder" && (
        <>
          <div className="d-flex flex-column flex-column-fluid">
            <div id="nit_app_content" className="app-content flex-column-fluid">
              <div
                id="nit_ecommerce_add_project_form"
                className="form d-flex flex-column flex-lg-row fv-plugins-bootstrap5 fv-plugins-framework"
                data-nit-redirect="#"
              >
                <div
                  className="d-flex flex-column flex-row-fluid gap-5 gap-lg-2"
                  data-select2-id="select2-data-202-umlr"
                >
                  <Accordion
                    defaultActiveKey="0"
                    className="card card-flush accordionCard mx-2"
                  >
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>
                        <label className="required form-label">
                          General Information
                        </label>
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="form-group row">
                          <div className="col-md-3">
                            <label htmlFor="requestDate">Request Date</label>
                            <input
                              type="date"
                              className="form-control"
                              id="requestDate"
                              name="requestDate"
                              value={formData.requestDate}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-3">
                            <label htmlFor="hearingDate">Hearing Date</label>
                            <input
                              type="date"
                              className="form-control"
                              id="hearingDate"
                              name="hearingDate"
                              value={formData.hearingDate}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-3">
                            <label htmlFor="policyClaimPID">
                              Policy/Claim/PID
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              id="policyClaimPID"
                              name="policyClaimPID"
                              value={formData.policyClaimPID}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-3 mt-6">
                            <label htmlFor="rushOrder">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="rushOrder"
                                name="rushOrder"
                                checked={formData.rushOrder}
                                onChange={handleChange}
                              />
                              Rush Order
                            </label>
                          </div>
                        </div>

                        {/* Guardian Information Section */}
                        <div className="form-group row">
                          <div className="col-md-3">
                            <label htmlFor="guardianFirstName">
                              Guardian First Name
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="guardianFirstName"
                              name="guardianFirstName"
                              value={formData.guardianFirstName}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-3">
                            <label htmlFor="guardianMiddleName">
                              Guardian Middle Name
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="guardianMiddleName"
                              name="guardianMiddleName"
                              value={formData.guardianMiddleName}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-3">
                            <label htmlFor="guardianLastName">
                              Guardian Last Name
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="guardianLastName"
                              name="guardianLastName"
                              value={formData.guardianLastName}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-3">
                            <label htmlFor="relations">Relations</label>
                            <input
                              type="text"
                              className="form-control"
                              id="relations"
                              name="relations"
                              value={formData.relations}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        {/* Relations Section */}
                        <div className="form-group row">
                          <div className="col-md-3">
                            <label className="mb-2">Minor:</label>
                            <div>
                              <div className="mb-4">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  id="minorYes"
                                  name="minor"
                                  value={true}
                                  checked={formData.minor === true}
                                  onChange={() =>
                                    setFormData({ ...formData, minor: true })
                                  }
                                />
                                <label htmlFor="minorYes">Yes</label>
                              </div>
                              <div className="mb-4">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  id="minorNo"
                                  name="minor"
                                  value={false}
                                  checked={formData.minor === false}
                                  onChange={() =>
                                    setFormData({ ...formData, minor: false })
                                  }
                                />
                                <label htmlFor="minorNo">No</label>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <label className="mb-2">Death:</label>
                            <div>
                              <div className="mb-4">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  id="deathYes"
                                  name="death"
                                  value={true}
                                  checked={formData.death === true}
                                  onChange={() =>
                                    setFormData({ ...formData, death: true })
                                  }
                                />
                                <label htmlFor="deathYes">Yes</label>
                              </div>
                              <div className="mb-4">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  id="deathNo"
                                  name="death"
                                  value={false}
                                  checked={formData.death === false}
                                  onChange={() =>
                                    setFormData({ ...formData, death: false })
                                  }
                                />
                                <label htmlFor="deathNo">No</label>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Personal Information Section */}
                        <div className="form-group row">
                          <div className="col-md-3">
                            <label htmlFor="lastName">Last Name</label>
                            <input
                              type="text"
                              className="form-control"
                              id="lastName"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-3">
                            <label htmlFor="firstName">First Name</label>
                            <input
                              type="text"
                              className="form-control"
                              id="firstName"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-3">
                            <label htmlFor="initials">Initials</label>
                            <input
                              type="text"
                              className="form-control"
                              id="initials"
                              name="initials"
                              value={formData.initials}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-3">
                            <label htmlFor="mi">M.I.</label>
                            <input
                              type="text"
                              className="form-control"
                              id="mi"
                              name="mi"
                              value={formData.mi}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        {/* Contact Information Section */}
                        <div className="form-group row">
                          <div className="col-md-3">
                            <label htmlFor="dob">DOB</label>
                            <input
                              type="date"
                              className="form-control"
                              id="dob"
                              name="dob"
                              value={formData.dob}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-3">
                            <label htmlFor="ssn">SSN</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Format: xxx-xx-xxxx"
                              id="ssn"
                              name="ssn"
                              value={formData.ssn}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-3">
                            <label htmlFor="address">Address</label>
                            <input
                              type="text"
                              className="form-control"
                              id="address"
                              name="address"
                              value={formData.address}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-3">
                            <label htmlFor="city">City</label>
                            <input
                              type="text"
                              className="form-control"
                              id="city"
                              name="city"
                              value={formData.city}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        {/* Address Section */}
                        <div className="form-group row">
                          <div className="col-md-3">
                            <label htmlFor="state">State</label>
                            <input
                              type="text"
                              className="form-control"
                              id="state"
                              name="state"
                              value={formData.state}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-3">
                            <label htmlFor="zip">ZIP Code</label>
                            <input
                              type="text"
                              className="form-control"
                              id="zip"
                              name="zip"
                              value={formData.zip}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        {/* Email and Fax Section */}
                        <div className="form-group row">
                          <div className="col-md-3">
                            <label htmlFor="daytimePhone">Daytime Phone</label>
                            <input
                              type="text"
                              className="form-control"
                              id="daytimePhone"
                              name="daytimePhone"
                              placeholder="Format: xxx-xx-xxxx "
                              value={formData.daytimePhone}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-3">
                            <label htmlFor="phone">Phone</label>
                            <input
                              type="text"
                              className="form-control"
                              id="phone"
                              name="phone"
                              placeholder="Format: xxx-xx-xxxx "
                              value={formData.phone}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-3">
                            <label htmlFor="email">Email</label>
                            <input
                              type="email"
                              className="form-control"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-3">
                            <label htmlFor="fax">Fax</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Format: xxx-xx-xxxx "
                              id="fax"
                              name="fax"
                              value={formData.fax}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>

                  <Accordion
                    defaultActiveKey="0"
                    className="card card-flush accordionCard  mx-2"
                  >
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>
                        <label className="required form-label">
                          Auto Creation of Authorizations-MRR
                        </label>
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="form-group">
                          <label className="mb-2">AUTH TYPE:</label>
                          <div>
                            <div className="form-check mb-4">
                              <input
                                className="form-check-input"
                                type="radio"
                                id="authHitech"
                                name="authType"
                                value="HITECH"
                                checked={formData.authType === "HITECH"}
                                onChange={handleChange}
                              />
                              <label htmlFor="authHitech">HITECH</label>
                            </div>
                            <div className="form-check mb-4">
                              <input
                                className="form-check-input"
                                type="radio"
                                id="authHippa"
                                name="authType"
                                value="HIPPA"
                                checked={formData.authType === "HIPPA"}
                                onChange={handleChange}
                              />
                              <label htmlFor="authHippa">HIPPA</label>
                            </div>
                          </div>
                        </div>

                        <div className="form-group">
                          <label>Signature Image:</label>
                          <div>
                            <input
                              type="file"
                              className="form-control"
                              onChange={handleFileChange}
                              accept="image/jpeg, image/png"
                            />
                            <small className="form-text text-muted">
                              Upload a file, allowed file types: jpg, png
                            </small>
                          </div>
                        </div>

                        {existingSignature && (
                          <div className="form-group">
                            <small className="form-text text-muted">
                              Signature already exists...
                              <a href="/path-to-existing-signature" download>
                                click here to Download it.
                              </a>
                            </small>
                          </div>
                        )}

                        <div className="form-group">
                          <button type="submit" className="btn btn-primary">
                            Preview AUTH
                          </button>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>

                  <Accordion
                    defaultActiveKey="0"
                    className="card card-flush accordionCard  mx-2"
                  >
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>
                        <label className="required form-label">
                          Notifications and Reference Data
                        </label>
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="form-group row">
                          <div className="col-md-4">
                            <label htmlFor="email">Email:</label>
                            <input
                              type="email"
                              className="form-control"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        {/* Identifiers Section */}
                        <div className="form-group row">
                          <div className="col-md-4">
                            <label htmlFor="identifier1">Identifier 1:</label>
                            <input
                              type="text"
                              className="form-control"
                              id="identifier1"
                              name="identifier1"
                              value={formData.identifier1}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-4">
                            <label htmlFor="identifier2">Identifier 2:</label>
                            <input
                              type="text"
                              className="form-control"
                              id="identifier2"
                              name="identifier2"
                              value={formData.identifier2}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-4">
                            <label htmlFor="identifier3">Identifier 3:</label>
                            <input
                              type="text"
                              className="form-control"
                              id="identifier3"
                              name="identifier3"
                              value={formData.identifier3}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        {/* Request Type Section */}
                        <div className="form-group">
                          <label className="mb-2">Request Type:</label>
                          <div>
                            <div className="form-check mb-4">
                              <input
                                className="form-check-input"
                                type="radio"
                                id="internalRequest"
                                name="requestType"
                                value="Internal"
                                checked={formData.requestType === "Internal"}
                                onChange={handleChange}
                              />
                              <label htmlFor="internalRequest">Internal</label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                id="externalRequest"
                                name="requestType"
                                value="External"
                                checked={formData.requestType === "External"}
                                onChange={handleChange}
                              />
                              <label htmlFor="externalRequest">External</label>
                            </div>
                          </div>
                        </div>

                        {/* Request Send Method Section */}
                        <div className="form-group">
                          <label className="mb-2">Request Send Method:</label>
                          <div>
                            <div className="form-check mb-4">
                              <input
                                className="form-check-input"
                                type="radio"
                                id="sendNone"
                                name="sendMethod"
                                value="None"
                                checked={formData.sendMethod === "None"}
                                onChange={handleChange}
                              />
                              <label htmlFor="sendNone">None</label>
                            </div>
                            <div className="form-check mb-4">
                              <input
                                className="form-check-input"
                                type="radio"
                                id="sendFax"
                                name="sendMethod"
                                value="Fax"
                                checked={formData.sendMethod === "Fax"}
                                onChange={handleChange}
                              />
                              <label htmlFor="sendFax">Fax</label>
                            </div>
                            <div className="form-check mb-4">
                              <input
                                className="form-check-input"
                                type="radio"
                                id="sendPost"
                                name="sendMethod"
                                value="Post"
                                checked={formData.sendMethod === "Post"}
                                onChange={handleChange}
                              />
                              <label htmlFor="sendPost">Post</label>
                            </div>
                            <div className="form-check mb-4">
                              <input
                                className="form-check-input"
                                type="radio"
                                id="sendEmail"
                                name="sendMethod"
                                value="Email"
                                checked={formData.sendMethod === "Email"}
                                onChange={handleChange}
                              />
                              <label htmlFor="sendEmail">Email</label>
                            </div>
                          </div>
                        </div>

                        {/* Request Charge Amount */}
                        <div className="form-group col-md-4">
                          <label htmlFor="chargeAmount">
                            Request Charge Amount:
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            id="chargeAmount"
                            name="chargeAmount"
                            value={formData.chargeAmount}
                            onChange={handleChange}
                          />
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>

                  {/* Submit Button */}
                  <div className="form-group">
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                  </div>
                </div>

                <div className="d-flex flex-column w-100 w-lg-500px">
                  <div className="form-group mx-2">
                    <button className="btn btn-primary" onClick={handleShow}>
                      Add Provider
                    </button>
                  </div>

                  <Accordion
                    defaultActiveKey="0"
                    className="card card-flush accordionCard  mx-2"
                  >
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>
                        <label className="required form-label">
                          Auto Creation of Authorizations-MRR
                        </label>
                      </Accordion.Header>
                      <Accordion.Body>
                        <MedicalUserDetail />
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>
              </div>
            </div>
          </div>

          <Modal show={showModal} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
              <Modal.Title>Select Providers</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <SelectProviderSearch />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}

      {activeTab === "medicalRecords" && (
        <>
          <MedicalRecords />
        </>
      )}

      {activeTab === "CaseManagementReports" && (
        <>
          <CaseManagementReports />
        </>
      )}

      {activeTab === "SearchIndividualRequest" && (
        <>
          <SearchIndividualRequest />
        </>
      )}

      {activeTab === "RecordsAvailable" && (
        <>
          <RecordsAvailable />
        </>
      )}
    </>
  );
};

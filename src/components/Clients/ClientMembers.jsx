import React, { Suspense, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";
import user1 from "../../assets/media/users/user3.jpg";
import axios from "axios";
import ConfirmationModal from "../popupmodal/ConfirmationMessage";
import "../../assets/css/main.css"
import Loader from "../Loader/Loader";

const API_URL =
  import.meta.env.VITE_BASE_URL + ":" + import.meta.env.VITE_BASE_PORT;

export const ClientMembers = () => {
  const {
    getClientMember,
    suspendClientMember,
    activateClientMember,
    addClientMember,
    getClientRelatedRoles,
    checkUsernameAvailability,
  } = useAuth();
  const clientData = sessionStorage.getItem("client_data");
  const clientId = clientData ? JSON.parse(clientData).client_id : null;
  const [loading, setLoading] = useState(false);
  const [isActiveMember, setActiveMember] = useState([]);
  const [isSuspendedMember, setSuspendedMember] = useState([]);
  const [activeTab, setActiveTab] = useState("active");

  const [showModal, setShowModal] = useState(false);
  const handleAddMember = () => setShowModal(true);
  const [roles, setRoles] = useState([]);
  const [errors, setErrors] = useState({});
  const [newMember, setNewMember] = useState({
    username: "",
    full_name: "",
    email: "",
    job_title: "",
    contact_no: "",
    is_authorized_signatory: "0",
    landline_no: "",
    extension_no: "",
    role: "",
  });

  const [actionType, setActionType] = useState(null);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [showModalAlert, setShowModalAlert] = useState(false);

  const usernameRef = useRef();
  const emailRef = useRef();
  const fullNameRef = useRef();
  const jobTitleRef = useRef();
  const contactNoRef = useRef();
  const landlineNoRef = useRef(null);
  const extnNoRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" })); // Clear errors on change
  };

  const checkUsername = async (username) => {
    try {
      // Assume checkUsernameAvailability is an API call that returns { available: 1 | 0 }
      const response = await checkUsernameAvailability(username);

      if (response.available === 0) {
        // Username is not available
        setErrors((prevErrors) => ({
          ...prevErrors,
          username: "Username already exists.",
        }));
        return false;
      } else {
        // Username is available
        setErrors((prevErrors) => ({
          ...prevErrors,
          username: "",
        }));
        return true;
      }
    } catch (error) {
      console.error("Error checking username:", error.message);

      // Handle API failure gracefully
      setErrors((prevErrors) => ({
        ...prevErrors,
        username: "Unable to validate username. Please try again later.",
      }));
      return false; // Default to username not available
    } 
  };

  const checkEmail = async (email) => {
    try {
      const response = await axios.get(
        `${API_URL}/check-email?email=${encodeURIComponent(email)}`
      );
      if (response.data.available === 0) {
        return false; // Email already exists
      }
      return true; // Email is available
    } catch (error) {
      console.error("Error checking email:", error);
      return false; // Assume email exists if there's an error
    }
  };

  const validate = async () => {
    let newErrors = {};
    let firstErrorField = null;

    // Username validation
    if (!newMember.username.trim()) {
      newErrors.username = "Username is required.";
      firstErrorField = firstErrorField || usernameRef;
    } else if (newMember.username.trim().length < 5) {
      newErrors.username = "Username must be at least 5 characters long.";
      firstErrorField = firstErrorField || usernameRef;
    } else if (newMember.username.trim().length > 30) {
      newErrors.username = "Username cannot exceed 30 characters.";
      firstErrorField = firstErrorField || usernameRef;
    } else if (!/^[a-zA-Z0-9!@#$%^&*.?]+$/.test(newMember.username.trim())) {
      newErrors.username =
        "Username must only contain alphanumeric characters and special characters";
      firstErrorField = firstErrorField || usernameRef;
    } else if (newMember.username !== newMember.username.trim()) {
      newErrors.username = "Username cannot have leading or trailing spaces.";
      firstErrorField = firstErrorField || usernameRef;
    } else if (/^\d+$/.test(newMember.username.trim())) {
      newErrors.username = "Username cannot be all digits.";
      firstErrorField = firstErrorField || usernameRef;
    }
    const usernameAvailable = await checkUsername(newMember.username);
    if (!usernameAvailable) {
      newErrors.username =
        "Username already exists. Please choose a different username.";
      firstErrorField = firstErrorField || usernameRef;
    }

    // Full Name validation
    if (!newMember.full_name.trim()) {
      newErrors.full_name = "Full Name is required";
      if (!firstErrorField) firstErrorField = fullNameRef;
    } else if (!/^[a-zA-Z\s]+$/.test(newMember.full_name.trim())) {
      newErrors.full_name = "Full Name must only contain letters and spaces";
      if (!firstErrorField) firstErrorField = fullNameRef;
    } else if (newMember.full_name.trim().split(/\s+/).length < 2) {
      newErrors.full_name = "Full Name must include first and last name";
      if (!firstErrorField) firstErrorField = fullNameRef;
    }

    // Email validation
    if (!newMember.email) {
      newErrors.email = "Email is required.";
      firstErrorField = emailRef;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newMember.email)) {
      newErrors.email = "Please enter a valid email address.";
      firstErrorField = emailRef;
    } else {
      const emailAvailable = await checkEmail(newMember.email);
      if (!emailAvailable) {
        newErrors.email = "Email already exists.";
        firstErrorField = emailRef;
      }
    }

    if (
      newMember.job_title.trim() &&
      !/^[a-zA-Z\s]+$/.test(newMember.job_title.trim())
    ) {
      newErrors.job_title = "Job Title must contain only letters and spaces.";
      firstErrorField = firstErrorField || jobTitleRef;
    }

    const usContactRegex =
      /^(?:\+1[-.\s]?|\+91[-.\s]?|1[-.\s]?|91[-.\s]?)?(?:\(\d{3}\)[-.\s]?|\d{3}[-.\s]?)?\d{3}[-.\s]?\d{4}$/;

    if (newMember.contact_no.trim()) {
      if (!/^[\d+().-\s]+$/.test(newMember.contact_no.trim())) {
        newErrors.contact_no =
          "Contact number must contain only valid numbers.";
        firstErrorField = firstErrorField || contactNoRef;
      } else if (!usContactRegex.test(newMember.contact_no.trim())) {
        newErrors.contact_no = "Contact number must be valid.";
        firstErrorField = firstErrorField || contactNoRef;
      }
    }

    const landlineRegex = /^(?:\+?\d{1,3}[-.\s]?)?(?:\(\d{2,5}\)|\d{2,5})[-.\s]?\d{3,8}(?:[-.\s]?\d{3,8})?$/;
    if (newMember.landline_no?.trim()) {
      const landlineNumber = newMember.landline_no.trim();
      if (landlineNumber.length < 7) {
        newErrors.landline_no = "Landline number must have at least 7 digits";
        if (!firstErrorField) firstErrorField = landlineNoRef;
      } else if (landlineNumber.length > 15) {
        newErrors.landline_no = "Landline number must not exceed 15 digits";
        if (!firstErrorField) firstErrorField = landlineNoRef;
      } else if (!landlineRegex.test(landlineNumber)) {
        newErrors.landline_no = "Landline number must be valid";
        if (!firstErrorField) firstErrorField = landlineNoRef;
      }
    }

    if (newMember.extension_no?.trim()) {
      const extnRegex = /^\d{1,5}$/;
      const extnNumber = newMember.extension_no.trim();
      if (!extnRegex.test(extnNumber)) {
        newErrors.extension_no = "Extension must be a valid number (1 to 5 digits)";
        if (!firstErrorField) firstErrorField = extnNoRef;
      }
    }



    setErrors(newErrors);
    return newErrors;
  };

  const handleAddMemberSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = await validate();
    if (Object.keys(validationErrors).length > 0) return;

    const formattedMemberData = {
      client_id: clientId,
      member_data: [
        {
          fullname: newMember.full_name,
          username: newMember.username,
          email: newMember.email,
          job_title: newMember.job_title || null,
          contact_no: newMember.contact_no || null,
          is_authorized_signatory: newMember.is_authorized_signatory,
          landline_no: newMember.landline_no || null,
          extension_no: newMember.extension_no || null,
          role: newMember.role,
        },
      ],
    };

    // console.log("formattedMemberData==>", formattedMemberData);

    try {
      await addClientMember(clientId, formattedMemberData);
      handleCloseModal();
      toast.success("Member added successfully.");
      setTimeout(() => {
        fetchClientMembers();
      }, 1000); // Delay of 1 second (adjust as needed)
    } catch (error) {
      console.error("Error adding member:", error.message);
      toast.error("Failed to add member. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewMember({
      username: "",
      full_name: "",
      email: "",
      job_title: "",
      contact_no: "",
      is_authorized_signatory: "0",
      landline_no: "",
      extension_no: "",
      role: "",
    });
    setErrors({});
  };

  const fetchRoles = async () => {
    const rolesData = JSON.parse(sessionStorage.getItem("roles")) || [];
    try {
      const response = await getClientRelatedRoles(rolesData[0].role_id);
      setRoles(response);
    } catch (error) {
      console.error("Error fetching roles:", error.message);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [showModal]);

  // Fetch client members based on activeTab
  const fetchClientMembers = async () => {
    setLoading(true);
    try {
      const response = await getClientMember(clientId, {
        get_active: activeTab === "active",
        get_suspended: activeTab === "suspend",
      });
      // console.log(response); // Debugging response
      if (activeTab === "active") {
        setActiveMember(response);
      } else {
        setSuspendedMember(response);
      }
    } catch (error) {
      console.error("Error fetching client members:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Activate a member
  const handleActivateMember = async (memberId) => {
    try {
      await activateClientMember(clientId, memberId);
      fetchClientMembers();
      toast.success("Member Activated Successfully");
    } catch (error) {
      console.error("Error activating member:", error.message);
    }
  };

  // Suspend a member
  const handleSuspendMember = async (memberId) => {
    try {
      await suspendClientMember(clientId, memberId);
      fetchClientMembers();
      toast.success("Member Suspended Successfully");
    } catch (error) {
      console.error("Error suspending member:", error.message);
    }
  };

  // Handle modal confirm action based on the actionType
  const handleConfirmAction = () => {
    if (actionType === 'activate') {
      handleActivateMember(selectedMemberId);
    } else if (actionType === 'suspend') {
      handleSuspendMember(selectedMemberId);
    }
    setShowModalAlert(false); // Close the modal after confirming
  };

  // Handle modal cancellation
  const handleCancelAction = () => {
    setShowModalAlert(false); // Close the modal without doing anything
  };

  // Show modal for suspending a member
  const handleSuspendClick = (memberId) => {
    setSelectedMemberId(memberId);
    setActionType('suspend'); // Set action type to 'suspend'
    setShowModalAlert(true); // Show the modal
  };

  // Show modal for activating a member
  const handleActivateClick = (memberId) => {
    setSelectedMemberId(memberId);
    setActionType('activate'); // Set action type to 'activate'
    setShowModalAlert(true); // Show the modal
  };


  // Fetch members whenever `activeTab` changes
  useEffect(() => {
    fetchClientMembers();
  }, [activeTab]);

    // If loading, show loader
    if (loading) {
      return <Loader />;
    }
  

  return (
    <>
     <Suspense fallback={<Loader />}>
      <div className="card m-4 p-4">
        <div
          className="form-item d-flex flex-column flex-md-row align-items-center justify-content-between border rounded p-2"
          style={{ backgroundColor: "#4fc9da" }}
        >
          {/* Buttons Section */}
          <div className="btn-container d-flex flex-row flex-wrap gap-2 mb-2 mb-md-0">
            <button
              className="btn btn-sm"
              onClick={() => setActiveTab("active")}
              style={{
                background:
                  activeTab === "active"
                    ? "#ffffff"
                    : "linear-gradient(135deg, #e3f2fd, #bbdefb)",
                fontSize: "12px"
              }}
            >
              <b>Active{"\u00A0"}Members</b>
            </button>
            <button
              className="btn btn-sm mx-1"
              onClick={() => setActiveTab("suspend")}
              style={{
                background:
                  activeTab === "suspend"
                    ? "#ffffff"
                    : "linear-gradient(135deg, #e3f2fd, #bbdefb)",
                fontSize: "12px"
              }}
            >
              <b>Suspended{"\u00A0"}Members</b>
            </button>
          
          </div>

          {/* Title Section */}
          <div
            className="d-flex justify-content-center flex-grow-1 mb-2 mb-md-0"
            style={{ textAlign: "center" }}
          >
            <h5 className="modal-title font-weight-bold text-black">My{"\u00A0"}Members</h5>
          </div>

          {/* Add Member Button */}
          <div className="w-100 w-md-auto">
            <button
              className="btn btn-sm add-member-btn w-100"
              onClick={handleAddMember}
              style={{
                background: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
                fontSize: "12px",
                padding: "6px 12px",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                color: "#003F73",
              }}
            >
              <b>Add{"\u00A0"}Member</b>
            </button>
          </div>

        </div>


        {/* Conditional Rendering for Members */}
    
        {/* Member Listing */}
        <div className="row mt-3">
          {activeTab === "active" ? (
            isActiveMember.length > 0 ? (
              isActiveMember.map((member) => (
                <div key={member.user_id} className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 mb-3">
                  <div className="card h-100 shadow-sm rounded"
                    style={{
                      borderRadius: "10px",
                      background: "rgba(177, 220, 228, 0.57)",
                    }}>
                    <div className="card-body text-center p-3">
                      <img
                        src={user1}
                        alt={`${member.username}'s avatar`}
                        className="img-fluid rounded-circle border"
                        style={{ width: "50px", height: "50px", objectFit: "cover", borderColor: "#f1f1f1" }}
                      />
                      <h6 className="card-title mt-2 text-truncate" style={{ fontSize: "12px", fontWeight: "600" }}>
                        {member.username}
                      </h6>
                      <p className="card-text text-truncate" style={{ fontSize: "10px", color: "#003F73" }}>
                        Designation: {member.job_title || "Not Provided"}
                      </p>
                      <button
                        className="btn btn-warning btn-sm rounded-pill mt-2"
                        style={{ fontSize: "10px", padding: "4px 12px", color: "#393030" }}
                        onClick={() => handleSuspendClick(member.user_id)}
                      >
                        Suspend
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">No active members found.</p>
            )
          ) : (
            isSuspendedMember.length > 0 ? (
              isSuspendedMember.map((member) => (
                <div key={member.user_id} className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 mb-3">
                  {/* <div className="card h-100 shadow-sm rounded"> */}
                  <div className="card h-100 shadow-sm rounded"
                    style={{
                      borderRadius: "10px",
                      background: "rgba(177, 220, 228, 0.57)",
                    }}>
                    <div className="card-body text-center p-3">
                      <img
                        src={user1}
                        alt={`${member.username}'s avatar`}
                        className="img-fluid rounded-circle border"
                        style={{ width: "50px", height: "50px", objectFit: "cover", borderColor: "#f1f1f1" }}
                      />
                      <h6 className="card-title mt-2 text-truncate" style={{ fontSize: "12px", fontWeight: "600" }}>
                        {member.username}
                      </h6>
                      <p className="card-text text-truncate" style={{ fontSize: "10px", color: "#003F73" }}>
                        Designation: {member.job_title || "Not Provided"}
                      </p>
                      <button
                        className="btn btn-success btn-sm rounded-pill mt-2"
                        style={{ fontSize: "10px", padding: "4px 12px", color: "#393030" }}
                        onClick={() => handleActivateClick(member.user_id)}
                      >
                        Activate
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">No suspended members found.</p>
            )
          )}
        </div>

        {/* Popup for Adding a Member */}
        {showModal && (
          <div>
            <div
              className="modal-backdrop show"
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1040,
              }}
            ></div>

            <div
              className="modal show"
              style={{
                display: "block",

                zIndex: 1050,
              }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-1 shadow">
                  <div
                    className="modal-header  text-black py-3"
                    style={{
                      borderTopLeftRadius: "10px",
                      borderTopRightRadius: "10px",
                      background:
                        "#4fc9da"
                    }}
                  >
                    <h5 className="modal-title text-center w-100 font-weight-bold text-black">
                      Add New Member
                    </h5>
                    <button
                      type="button"
                      // className="btn-close"
                      style={{
                        position: "absolute",
                        // top: "1rem",
                        right: "0rem",
                        fontSize: "2.5rem",
                        color: "#5e6278",
                        backgroundColor: "transparent",
                        border: "none",
                        appearance: "none",
                      }}
                      onClick={handleCloseModal}
                    >
                      <span aria-hidden="true" style={{ color: "#5e6278" }}>
                        &times;
                      </span>
                    </button>
                  </div>

                  <div className="modal-body p-4">
                    <form onSubmit={handleAddMemberSubmit}>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label
                            className="form-label fs-7 small fw-bold"
                            style={{ color: "#0098ca" }}
                          >
                            Username:{""} <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control p-2 fs-8 border-1 bg-light"
                            name="username"
                            placeholder="Enter username"
                            value={newMember.username}
                            onChange={handleInputChange}
                            required
                          />
                          {errors.username && (
                            <div className="text-danger small">
                              {errors.username}
                            </div>
                          )}
                        </div>

                        <div className="col-md-6">
                          <label
                            className="form-label fs-7 small fw-bold"
                            style={{ color: "#0098ca" }}
                          >
                            Full Name:{""} <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control p-2 fs-8 border-1 bg-light"
                            name="full_name"
                            placeholder="Enter full name"
                            value={newMember.full_name}
                            onChange={handleInputChange}
                            required
                          />
                          {errors.full_name && (
                            <div className="text-danger small">
                              {errors.full_name}
                            </div>
                          )}
                        </div>

                        <div className="col-md-6">
                          <label
                            className="form-label fs-7 small fw-bold"
                            style={{ color: "#0098ca" }}
                          >
                            Email:{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="email"
                            className="form-control p-2 fs-8 border-1 bg-light"
                            name="email"
                            placeholder="Enter email"
                            value={newMember.email}
                            onChange={handleInputChange}
                            required
                          />
                          {errors.email && (
                            <div className="text-danger small">
                              {errors.email}
                            </div>
                          )}
                        </div>

                        <div className="col-md-6">
                          <label
                            className="form-label fs-7 small fw-bold"
                            style={{ color: "#0098ca" }}
                          >
                            Job Title:
                          </label>
                          <input
                            type="text"
                            className="form-control p-2 fs-8 border-1 bg-light"
                            name="job_title"
                            placeholder="Enter job title"
                            value={newMember.job_title}
                            onChange={handleInputChange}
                          />
                          {errors.job_title && (
                            <div className="text-danger small">
                              {errors.job_title}
                            </div>
                          )}
                        </div>

                        <div className="col-md-6">
                          <label
                            className="form-label fs-7 small fw-bold"
                            style={{ color: "#0098ca" }}
                          >
                            Contact No:{" "}<span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control p-2 fs-8 border-1 bg-light"
                            name="contact_no"
                            placeholder="Enter contact number"
                            value={newMember.contact_no}
                            onChange={handleInputChange}
                            required
                          />
                          {errors.contact_no && (
                            <div className="text-danger small">
                              {errors.contact_no}
                            </div>
                          )}
                        </div>

                        <div className="col-md-6">
                          <label
                            className="form-label fs-7 small fw-bold"
                            style={{ color: "#0098ca" }}
                          >
                            Authorized Signatory:
                          </label>
                          <select
                            className="form-select form-control p-2 fs-8"
                            name="is_authorized_signatory"
                            value={newMember.is_authorized_signatory}
                            onChange={handleInputChange}
                            style={{
                              borderRadius: "5px",
                              border: "1px solid #ccc",
                              backgroundColor: "#f8f9fa",
                            }}
                          >
                            <option value="0">No</option>
                            <option value="1">Yes</option>
                          </select>
                        </div>

                        <div className="col-md-6">
                          <label
                            className="form-label fs-7 small fw-bold"
                            style={{ color: "#0098ca" }}
                          >
                            Landline No:
                          </label>
                          <input
                            type="text"
                            className="form-control p-2 fs-8 border-1 bg-light"
                            name="landline_no"
                            placeholder="Enter Landline No"
                            value={newMember.landline_no}
                            onChange={handleInputChange}
                          />
                          {errors.landline_no && (
                            <div className="text-danger small">
                              {errors.landline_no}
                            </div>
                          )}
                        </div>

                        <div className="col-md-6">
                          <label
                            className="form-label fs-7 small fw-bold"
                            style={{ color: "#0098ca" }}
                          >
                            Extn.:
                          </label>
                          <input
                            type="text"
                            className="form-control p-2 fs-8 border-1 bg-light"
                            name="extension_no"
                            placeholder="Extn."
                            value={newMember.extension_no}
                            onChange={handleInputChange}
                          />
                          {errors.extension_no && (
                            <div className="text-danger small">
                              {errors.extension_no}
                            </div>
                          )}
                        </div>

                        <div className="col-md-12">
                          <label
                            className="form-label fs-7 small fw-bold"
                            style={{ color: "#0098ca" }}
                          >
                            Role:<span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-select fs-8 p-2 border-1 bg-light"
                            type="text"
                            name="role"
                            value={newMember.role}
                            onChange={handleInputChange}
                            required
                            style={{
                              borderRadius: "5px",
                              border: "1px solid #ccc",
                              backgroundColor: "#f8f9fa",
                            }}
                          >
                            <option value="">Select a Role</option>
                            {roles.map((role) => (
                              <option key={role.role_id} value={role.role_name}>
                                {role.role_name}
                              </option>
                            ))}
                          </select>
                          {errors.role && (
                            <div className="text-danger small">
                              {errors.role}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-center mt-4">
                        <button
                          type="submit"
                          className="btn text-black btn-sm px-4"
                          style={{
                            background:
                              "#4fc9da"
                          }}
                        >
                          <b> Submit</b>
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm ms-2 px-4 border"
                          onClick={handleCloseModal}
                        >
                          <b> Cancel</b>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}



        {/* Confirmation Modal */}
        <ConfirmationModal
          show={showModalAlert}
          onConfirm={handleConfirmAction}
          onCancel={handleCancelAction}
          message={
            actionType === 'activate'
              ? 'Are you sure you want to activate this member?'
              : 'Are you sure you want to suspend this member?'
          }
        />
      </div>
      </Suspense>
    </>
  );
};

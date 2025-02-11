// ClientMembers2.jsx
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import user1 from "../../assets/media/users/user3.jpg";
import { FaBan, FaEye, FaEyeSlash, FaUserCheck } from "react-icons/fa";
import toast from "react-hot-toast";
import "./../../assets/css/main.css";
import { Button } from "react-bootstrap";
import GenericPage from "../genericpage/GenericPage";
import axios from "axios";

const API_URL =
  import.meta.env.VITE_BASE_URL + ":" + import.meta.env.VITE_BASE_PORT;

export const ClientMembers2 = () => {
  const {
    removeClientMember,
    addClientMember,
    suspendClientMember,
    activateClientMember,
    getClientRelatedRoles,
  } = useAuth();
  const clientId = JSON.parse(sessionStorage.getItem("client_data")).client_id;

  const [tabData, setTabData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newMember, setNewMember] = useState(initialNewMemberState(clientId));

  useEffect(() => {
    fetchClientMembers();
    fetchRoles();
  }, [clientId]);

  function initialNewMemberState(clientId) {
    return {
      username: "",
      email: "",
      password: "",
      full_name: "",
      job_title: "",
      is_authorized_signatory: 0,
      contact_no: "",
      client_id: clientId,
    };
  }

  const fetchClientMembers = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const baseURL = `${API_URL}/clients/${clientId}/members`;
      const [activeMembersResponse, suspendedMembersResponse] =
        await Promise.all([
          axios.get(`${baseURL}?status=active`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${baseURL}?status=suspended`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

      const activeMembers = activeMembersResponse.data || [];
      const suspendedMembers = suspendedMembersResponse.data || [];

      setTabData([
        {
          label: "Active Members",
          data: activeMembers,
          columns: getColumns("Active Members"),
          gridCardTemplate: (item) => renderGridCard(item, "Active Members"),
        },
        {
          label: "Suspended Members",
          data: suspendedMembers,
          columns: getColumns("Suspended Members"),
          gridCardTemplate: (item) => renderGridCard(item, "Suspended Members"),
        },
      ]);
    } catch (error) {
      console.error("Error fetching members:", error.message);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await getClientRelatedRoles(7); // Adjust parent role ID if necessary
      setRoles(response);
    } catch (error) {
      console.error("Error fetching roles:", error.message);
    }
  };

  const renderGridCard = (user, tabLabel) => (
    <div
      key={user.user_id}
      className="grid-card h-100 shadow-sm"
      style={cardStyle}
    >
      <div
        className="card-body text-center p-3"
        style={cardBodyStyle}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <div className="mb-2">
          <img
            src={user1}
            alt={`${user.username}'s avatar`}
            className="img-fluid rounded-circle border"
            style={avatarStyle}
          />
        </div>
        <h6 className="card-title mb-1 text-truncate" style={usernameStyle}>
          {user.username}
        </h6>
        <div
          className="mb-2 text-truncate"
          style={jobTitleStyle}
          title={user.job_title}
        >
          <p className="card-text text-muted" style={{ fontSize: "12px" }}>
            Designation: {user.job_title}
          </p>
        </div>
        <div className="d-flex flex-wrap justify-content-center gap-2">
          {userActionButton(user, tabLabel)}
        </div>
      </div>
    </div>
  );

  const getColumns = (tabLabel) => [
    { field: "username", header: "Username", sortable: true },
    { field: "job_title", header: "Job Title", sortable: true },
    {
      field: "actions",
      header: "Actions",
      body: (rowData) => userActionButton(rowData, tabLabel),
    },
  ];

  const updateMemberData = async () => {
    try {
      await fetchClientMembers();
    } catch (error) {
      console.error("Error updating member data:", error.message);
      toast.error("Failed to update member data");
    }
  };

  const handleSuspendMember = async (memberId) => {
    try {
      await suspendClientMember(clientId, memberId);
      await updateMemberData();
      toast.success("Member Suspended Successfully");
    } catch (error) {
      console.error("Error suspending member:", error.message);
      toast.error("Failed to suspend member");
    }
  };

  const handleActivateMember = async (memberId) => {
    try {
      await activateClientMember(clientId, memberId);
      await updateMemberData();
      toast.success("Member Activated Successfully");
    } catch (error) {
      console.error("Error activating member:", error.message);
      toast.error("Failed to activate member");
    }
  };

  const userActionButton = (user, tabLabel) =>
    tabLabel === "Active Members" ? (
      <button
        className="btn btn-warning btn-sm rounded-pill d-flex align-items-center justify-content-center"
        style={buttonStyle("warning")}
        onClick={() => handleSuspendMember(user.user_id)}
        aria-label={`Suspend ${user.username}`}
      >
        <FaBan size={12} className="me-1" />
        <span>
          <b>Suspend</b>
        </span>
      </button>
    ) : (
      <button
        className="btn btn-sm rounded-pill d-flex align-items-center justify-content-center"
        style={buttonStyle("success")}
        onClick={() => handleActivateMember(user.user_id)}
        aria-label={`Activate ${user.username}`}
      >
        <FaUserCheck size={12} className="me-1" />
        <span>
          <b>Activate</b>
        </span>
      </button>
    );

  const [errors, setErrors] = useState({});
  const handleAddMember = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewMember(initialNewMemberState(clientId));
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setNewMember((prevMember) => ({ ...prevMember, [name]: value }));
  // };

  const handleAddMemberSubmit = async (e) => {
    e.preventDefault();
    const formattedMemberData = {
      client_id: clientId,
      member_data: [
        {
          fullname: newMember.full_name,
          username: newMember.username,
          email: newMember.email,
          password: newMember.password,
          personal_welcome_message: newMember.personal_welcome_message,
          role: newMember.role,
          recommended_by: newMember.recommended_by,
          job_title: newMember.job_title,
          contact_no: newMember.contact_no || null,
          website: newMember.website,
          is_authorized_signatory: newMember.is_authorized_signatory,
        },
      ],
    };

    try {
      await addClientMember(clientId, formattedMemberData);
      handleCloseModal();
      await updateMemberData();
      toast.success("Member added successfully");
    } catch (error) {
      if (error.response?.data?.detail) {
        const backendError = error.response.data.detail;

        // Handle duplicate email error
        if (backendError.startsWith("Duplicate emails found:")) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: backendError, // Display backend error in the email field
          }));
        }
      } else {
        console.error("Error adding member:", error.message || error);
        toast.error("Failed to add member. Please try again.");
      }
      console.error("Error adding member:", error.message);
      toast.error("Failed to add member");
    }
  };
  const { username, checkUsernameAvailability } = useAuth();

  const checkUsername = async (username) => {
    try {
      const data = await checkUsernameAvailability(username);
      // console.log("API Response:", data); // Debugging line
      if (data.available === 0) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          username: "Username already exists",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          username: "",
        }));
      }
    } catch (error) {
      console.error("Error checking username:", error.message || error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        username: "Failed to validate username. Please try again later.",
      }));
    }
  };

  // Debounce timeout reference
  const usernameDebounceTimeout = useRef(null);

  // Effect for validating username
  useEffect(() => {
    if (newMember.username && newMember.username.trim().length >= 3) {
      if (usernameDebounceTimeout.current) {
        clearTimeout(usernameDebounceTimeout.current);
      }

      usernameDebounceTimeout.current = setTimeout(() => {
        checkUsername(newMember.username.trim());
      }, 500);
    } else if (newMember.username && newMember.username.trim().length > 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        username: "Username must be at least 3 characters long.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        username: "",
      }));
    }

    return () => {
      if (usernameDebounceTimeout.current) {
        clearTimeout(usernameDebounceTimeout.current);
      }
    };
  }, [newMember.username]);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const cardStyle = {
    borderRadius: "10px",
    background: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
    margin: "0.5rem",
  };

  const cardBodyStyle = {
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    transition: "transform 0.3s ease",
  };

  const avatarStyle = {
    width: "50px",
    height: "50px",
    objectFit: "cover",
    borderColor: "#f1f1f1",
  };

  const usernameStyle = {
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
  };

  const jobTitleStyle = {
    maxHeight: "40px",
    overflow: "hidden",
    cursor: "pointer",
  };

  const buttonStyle = (type) => {
    if (type === "warning") {
      return {
        fontSize: "10px",
        padding: "4px 12px",
        color: "#393030",
      };
    }
    if (type === "success") {
      return {
        fontSize: "10px",
        padding: "4px 12px",
        backgroundColor: "rgb(59, 155, 59)",
        color: "white",
      };
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const validations = {
      username: {
        test: (v) => /^[a-zA-Z0-9@#$._]{3,50}$/.test(v),
        message:
          "Username must be between 3 to 50 characters and can include @, #, $, ., and alphanumeric characters.",
      },
      full_name: {
        test: (v) => v.length <= 100,
        message: "Full Name must be up to 100 characters.",
      },
      email: {
        test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: "Please enter a valid email address.",
      },
      job_title: {
        test: (v) => v.length <= 100,
        message: "Job Title must be up to 100 characters.",
      },
      contact_no: {
        test: (v) => !v || /^\+?[\d\s-]*\d{10}[\d\s-]*$/.test(v),
        message:
          "Contact No must be a valid phone number with at least 10 digits.",
      },
      website: {
        test: (v) =>
          !v ||
          /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]{1,63}\.[a-zA-Z]{2,6}(\/.*)?$/.test(
            v
          ),
        message: "Please enter a valid website (e.g., example.com).",
      },
      personal_welcome_message: {
        test: (v) => v.length <= 250,
        message: "Personal Welcome Message must be up to 250 characters.",
      },
      role: {
        test: (v) => !!v,
        message: "Role is required.",
      },
      password: {
        test: (v) =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,}$/.test(v),
        message:
          "Password must be at least 8 characters, include an uppercase letter, a lowercase letter, a number, and a special character.",
      },
      recommended_by: {
        test: (v) => v.length <= 100,
        message: "Recommended By must be up to 100 characters.",
      },
    };

    const validation = validations[name];
    let errorMessage = "";

    if (validation && !validation.test(value)) {
      errorMessage = validation.message;
    }
    if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
      errorMessage = "Please enter a valid email address.";
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));

    setNewMember((prevMember) => {
      const updatedMember = { ...prevMember };

      if (value.trim() === "") {
        // Remove the key if the value is empty
        delete updatedMember[name];
      } else {
        // Otherwise, update the value
        updatedMember[name] = value;
      }

      // Special handling for `contact_no` to ensure it's only included if valid
      if (name === "contact_no" && !validation.test(value)) {
        delete updatedMember[name];
      }

      return updatedMember;
    });
  };

  return (
    <>
      <div className="card m-4 p-4">
        <div
          className="d-flex justify-content-end mb-3"
          style={{ paddingRight: "15px" }}
        >
          <button className="btn btn-primary btn-sm" onClick={handleAddMember}>
            <b>Add Member</b>
          </button>
        </div>

        <GenericPage
          tabs={tabData}
          showPagination={true}
          enableColumnFilters={false}
          globalSearchFields={["username", "job_title"]}
          defaultView="grid"
        />
      </div>

      {/* {showModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog">
            <div
              className="modal show"
              style={{
                display: "block",
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 1050,
                // maxWidth: "500px",
                // width: "90%",
              }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-1 shadow">
                  <div className="modal-body p-4">
                    <form onSubmit={handleAddMemberSubmit}>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label
                            className="form-label fs-7 small"
                            style={{ color: "#0098ca" }}
                          >
                            Username:<span className="text-danger">*</span>
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
                            className="form-label fs-7 small"
                            style={{ color: "#0098ca" }}
                          >
                            Full Name: <span className="text-danger">*</span>
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
                            className="form-label fs-7 small"
                            style={{ color: "#0098ca" }}
                          >
                            Email: <span className="text-danger">*</span>
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
                            className="form-label fs-7 small"
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
                            className="form-label fs-7 small"
                            style={{ color: "#0098ca" }}
                          >
                            Contact No:
                          </label>
                          <input
                            type="text"
                            className="form-control p-2 fs-8 border-1 bg-light"
                            name="contact_no"
                            placeholder="Enter contact number"
                            value={newMember.contact_no}
                            onChange={handleInputChange}
                          />
                          {errors.contact_no && (
                            <div className="text-danger small">
                              {errors.contact_no}
                            </div>
                          )}
                        </div>

                        <div className="col-md-6">
                          <label
                            className="form-label fs-7 small"
                            style={{ color: "#0098ca" }}
                          >
                            Website:
                          </label>
                          <input
                            type="text"
                            className="form-control p-2 fs-8 border-1 bg-light"
                            name="website"
                            placeholder="Enter website"
                            value={newMember.website}
                            onChange={handleInputChange}
                          />
                          {errors.website && (
                            <div className="text-danger small">
                              {errors.website}
                            </div>
                          )}
                        </div>

                        <div className="col-md-12">
                          <label
                            className="form-label fs-7 small"
                            style={{ color: "#0098ca" }}
                          >
                            Role <span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-select fs-8 p-2 border-1 bg-light"
                            name="role"
                            value={newMember.role}
                            onChange={handleInputChange}
                            required
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

                        <div className="form-group mb-2">
                          <label
                            className="small font-weight-bold fs-7"
                            style={{ color: "#0098ca" }}
                          >
                            Authorized Signatory{" "}
                            <span style={{ color: "red" }}>*</span>
                          </label>
                          <select
                            className="form-select  p-2 fs-8 border-1 bg-light"
                            name="is_authorized_signatory"
                            value={newMember.is_authorized_signatory}
                            onChange={handleInputChange}
                          >
                            <option value="0">No</option>
                            <option value="1">Yes</option>
                          </select>
                        </div>
                      </div>

                      <div className="text-center mt-4">
                        <button
                          type="submit"
                          className="btn btn-primary btn-sm px-4"
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
        </div>
      )} */}
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
                  className="modal-header bg-primary text-white py-3"
                  style={{
                    borderTopLeftRadius: "10px",
                    borderTopRightRadius: "10px",
                  }}
                >
                  <h5 className="modal-title text-center w-100 font-weight-bold text-white">
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
                      color: "#ffffff",
                      backgroundColor: "transparent",
                      border: "none",
                      appearance: "none",
                    }}
                    onClick={handleCloseModal}
                  >
                    <span aria-hidden="true" style={{ color: "#ffffff" }}>
                      &times;
                    </span>
                  </button>
                </div>

                <div className="modal-body p-4">
                  <form onSubmit={handleAddMemberSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label
                          className="form-label fs-7 small"
                          style={{ color: "#0098ca" }}
                        >
                          Username:<span className="text-danger">*</span>
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
                          className="form-label fs-7 small"
                          style={{ color: "#0098ca" }}
                        >
                          Full Name: <span className="text-danger">*</span>
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

                      {/* <div className="col-md-6">
                        <label className="form-label fs-7 small" style={{ color: "#0098ca" }}>
                          Email: <span className="text-danger">*</span>
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
                        {errors.email && <div className="text-danger small">{errors.email}</div>}
                      </div> */}
                      <div className="col-md-6">
                        <label
                          className="form-label fs-7 small"
                          style={{ color: "#0098ca" }}
                        >
                          Email: <span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          className="form-control p-2 fs-8 border-1 bg-light"
                          name="email"
                          placeholder="Enter email"
                          value={newMember.email}
                          onChange={handleInputChange}
                          onBlur={() => {
                            // Validate the email on blur
                            if (
                              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                                newMember.email.trim()
                              )
                            ) {
                              setErrors((prevErrors) => ({
                                ...prevErrors,
                                email: "Please enter a valid email address.",
                              }));
                            } else {
                              setErrors((prevErrors) => ({
                                ...prevErrors,
                                email: "",
                              }));
                            }
                          }}
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
                          className="form-label fs-7 small"
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
                          className="form-label fs-7 small"
                          style={{ color: "#0098ca" }}
                        >
                          Contact No:
                        </label>
                        <input
                          type="text"
                          className="form-control p-2 fs-8 border-1 bg-light"
                          name="contact_no"
                          placeholder="Enter contact number"
                          value={newMember.contact_no}
                          onChange={handleInputChange}
                        />
                        {errors.contact_no && (
                          <div className="text-danger small">
                            {errors.contact_no}
                          </div>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label
                          className="form-label fs-7 small"
                          style={{ color: "#0098ca" }}
                        >
                          Website:
                        </label>
                        <input
                          type="text"
                          className="form-control p-2 fs-8 border-1 bg-light"
                          name="website"
                          placeholder="Enter website"
                          value={newMember.website}
                          onChange={handleInputChange}
                        />
                        {errors.website && (
                          <div className="text-danger small">
                            {errors.website}
                          </div>
                        )}
                      </div>

                      <div className="col-md-12">
                        <label
                          className="form-label fs-7 small"
                          style={{ color: "#0098ca" }}
                        >
                          Role <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select fs-8 p-2 border-1 bg-light"
                          name="role"
                          value={newMember.role}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select a Role</option>
                          {roles.map((role) => (
                            <option key={role.role_id} value={role.role_name}>
                              {role.role_name}
                            </option>
                          ))}
                        </select>
                        {errors.role && (
                          <div className="text-danger small">{errors.role}</div>
                        )}
                      </div>

                      <div className="form-group mb-2">
                        <label
                          className="small font-weight-bold fs-7"
                          style={{ color: "#0098ca" }}
                        >
                          Authorized Signatory{" "}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <select
                          className="form-select  p-2 fs-8 border-1 bg-light"
                          name="is_authorized_signatory"
                          value={newMember.is_authorized_signatory}
                          onChange={handleInputChange}
                        >
                          <option value="0">No</option>
                          <option value="1">Yes</option>
                        </select>
                      </div>
                    </div>

                    <div className="text-center mt-4">
                      <button
                        type="submit"
                        className="btn btn-primary btn-sm px-4"
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
    </>
  );
};

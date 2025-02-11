import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Modal } from "react-bootstrap";
import Select from "react-select";
import RoleBasedElement from "../rolebaseaccess/RoleBasedElement";

export const UserApprovals = () => {
  const [users, setUsers] = useState([]);
  const {
    getAllUsers,
    getManagers,
    rejectUser,
    resendVerificationEmail,
    approveUserProfile,
    getAllClients,
    fetchUserGroups,
    getClientRelatedRoles,
  } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  // const entrust_url = `${import.meta.env.VITE_BASE_URL}:${import.meta.env.VITE_USER_BASE_PORT}/auth`;
  const entrust_url = `${import.meta.env.VITE_BASE_URL}:${
    import.meta.env.VITE_BASE_PORT
  }`;

  const [clientCode, setClientCode] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isValidFrom, setIsValidFrom] = useState(null);
  const [isValidTill, setIsValidTill] = useState(null);
  const [isPromocode, setIsPromocode] = useState("");
  const [isReferralAccount, setIsReferralAccount] = useState("");

  const [isEditMode, setIsEditMode] = useState(false);
  const [editedDetails, setEditedDetails] = useState({});
  const [viewDetails, setviewDetails] = useState({});

  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showRole, setShowRole] = useState(false);

  const [skipDateSettings, setSkipDateSettings] = useState(false);
  const [percentage, setPercentage] = useState();
  const [initialFunds, setInitialFunds] = useState(null);
  const [cashbackType, setCashbackType] = useState(null);

  // Handle checkbox change
  const handleCheckboxChange = () => {
    setSkipDateSettings(!skipDateSettings);
  };

  // Handle radio button change
  const handleRadioChange = (e) => {
    setCashbackType(e.target.value);
  };

  const API_URL =
    import.meta.env.VITE_BASE_URL + ":" + import.meta.env.VITE_BASE_PORT;

  const fetchUsers = async () => {
    try {
      const userData = await getAllUsers();

      if (Array.isArray(userData.data)) {
        setUsers(userData.data);
      } else {
        console.error("API returned data that is not an array:", userData);
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error.message);
      setUsers([]);
    }
  };

  const fetchRoles = async () => {
    const rolesData = JSON.parse(sessionStorage.getItem("roles")) || [];
    try {
      const response = await getClientRelatedRoles(rolesData[0]?.role_id);
      console.log("Roles Response:", response);

      // Transform response to match the Select component's format
      const formattedRoles = response.map((role) => ({
        value: role.role_id,
        label: role.role_name,
      }));

      setRoles(formattedRoles);
    } catch (error) {
      console.error("Error fetching roles:", error.message);
    }
  };

  // console.log("roles", roles);
  // console.log("selectedRole", selectedRole.value);

  // Date formate
  const formatTimestamp = (timestamp) => {
    if (!timestamp || isNaN(new Date(timestamp))) {
      // Handle null, undefined, or invalid date
      return "NA";
    }
    return new Date(timestamp)
      .toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      .replace(",", "");
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  // Update editedDetails when userDetails change
  useEffect(() => {
    if (userDetails) {
      setEditedDetails(userDetails);
      setviewDetails(userDetails);
    }
  }, [userDetails]);

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleCloseModalMessage = () => {
    setShowMessage(false);
  };

  const handleResendVerification = async (approvalId) => {
    try {
      const response = await resendVerificationEmail(approvalId);
      toast.success("Verification email resent", response.message);
      await fetchUsers();
    } catch (error) {
      // console.log(error);
    }
  };

  const handleRejectUser = async (approvalId) => {
    // console.log(approvalId);
    try {
      const response = await rejectUser(approvalId);
      // console.log(response);
      await fetchUsers();
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  const togglePopup = (userId) => {
    if (!showPopup) {
      const selectedUserData = users.find((u) => u.approval_id === userId);
      if (selectedUserData) {
        setSelectedUser(selectedUserData.approval_id);
        setEditedDetails({ ...selectedUserData }); // Copy user's data for editing
        setviewDetails({ ...selectedUserData }); // Set the non-editable view
        setShowPopup(true);
      }
    } else {
      setShowPopup(false);
      setSelectedUser(null);
      setEditedDetails(null);
      setviewDetails(null);
      setIsEditMode(false);
    }
  };

  const handleUserApproval = (
    approval_id,
    email_verified,
    activation_code,
    referred_by,
    is_authorised_signatory
  ) => {
    // console.log("User Approval------", approval_id);
    if (email_verified === 0) {
      setShowMessage(true);
    } else {
      setSelectedUser(approval_id);
      setShowModal(true);
    }
    setIsPromocode(activation_code);
    setIsReferralAccount(referred_by);
    setShowRole(is_authorised_signatory !== 1);
  };

  const handleInputChange = (field, value) => {
    setEditedDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleSave = async () => {
    try {
      console.log("Edited Details:", editedDetails);
      console.log("API URL:", `${entrust_url}/users/profile/edit`);
      const payload = { ...editedDetails };

      console.log("Payload:", payload);

      const response = await axios.put(
        `${entrust_url}/users/profile/edit`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      console.log("Full API URL:", `${entrust_url}/users/profile/edit`);

      console.log("API Response:", response.data);
      if (response.status === 200 || response.status === 201) {
        toast.success("User details updated successfully");
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.approval_id === selectedUser
              ? { ...user, ...editedDetails }
              : user
          )
        );
        setIsEditMode(false);
        setviewDetails(editedDetails);
      } else {
        toast.error("Failed to update user details.");
      }
    } catch (error) {
      console.error("Error while updating user:", error.response || error);
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  useEffect(() => {
    if (showModal) {
      setClientManager(null);
      setOperationalManager(null);
      setGroupSelector([]);
      setErrors({});
    }
  }, [showModal]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log("111");

    if (!selectedUser) {
      alert("Please select a user to approve.");
      return;
    }
    console.log("222");
    // console.log("Selected User Data:", selectedUser);
    const fieldErrors = validateFields();
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    console.log("333");

    const requestData = {
      approval_id: selectedUser,
      client_manager_id: clientManager?.value,
      operational_manager_id: operationalManager?.value,
      entrust_project_type_based_groups: groupSelector?.map(
        (group) => group.value
      ),
      restrict_domain_for_users: 1,
      referral_account_type: 1,
      is_referral_account: isCheckedReferralAccount ? 1 : 0,
      invoice_code: isPromocode,
      referred_by: selectedClient?.value,
      referral_start_date: isValidFrom,
      referral_end_date: isValidTill,

      approved_client_role_id: selectedRole?.value,

      skip_date: skipDateSettings ? 1 : 0,
      referral_percentage: parseFloat(percentage),
      initial_fund: Number(initialFunds),
      referral_cashback_type: cashbackType,
    };

    console.log("Approval Request Data:", requestData);

    try {
      if (!entrust_url) {
        console.error("Error: `entrust_url` is undefined or invalid.");
        alert("Base URL for API is missing.");
        return;
      }

      const response = await approveUserProfile(requestData);
      console.log("Approval Response:", response);
      if (response?.message) {
        toast.success(response.message);
      } else {
        toast.success("User approved successfully!");
      }

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.approval_id !== selectedUser)
      );
      // setUsers((prevUsers) => prevUsers.filter((user) => user.approval_id !== selectedUser));
      handleCloseModal();

      fetchUsers();
    } catch (error) {
      console.log("Error approving user profile:", error);
      console.error("Error approving user profile:", error);
      toast.error(
        error.message ||
          "An error occurred while approving the user profile."
      );
    }
  };

  const tableCellStyle = {
    padding: "0.2rem 2rem",
    color:
      "var(--bs-table-color-state, var(--bs-table-color-type, var(--bs-table-color)))",
    backgroundColor: "var(--bs-table-bg)",
    borderBottomWidth: "1px",
    boxShadow:
      "inset 0 0 0 9999px var(--bs-table-bg-state, var(--bs-table-bg-type, var(--bs-table-accent-bg)))",
  };

  // console.log("users", users);

  const [clientManager, setClientManager] = useState([]);
  const [clientManagerOptions, setClientManagerOptions] = useState([]);
  const [operationalManager, setOperationalManager] = useState([]);
  const [operationalManagerOptions, setOperationalManagerOptions] = useState([]);
  const [groupSelector, setGroupSelector] = useState([]);
  const [groupSelect, setGroupSelect] = useState([]);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const managers = await getManagers();

        const groupdata = await fetchUserGroups();
        // console.log("groupdata",groupdata);

        const options = managers.map((manager) => ({
          value: manager.user_id,
          label: manager.username,
        }));

        setClientManagerOptions(options);
        setOperationalManagerOptions(options);

        const groupoption = groupdata.map((group) => ({
          value: group.id,
          label: group.name,
        }));
        setGroupSelect(groupoption);
      } catch (error) {
        console.error("Error fetching managers:", error.message);
      }
    };

    fetchManagers();
  }, [getManagers]);

  // const handleSelectChange = (selectedOptions) => {
  //   setClientManager(selectedOptions);
  // };

  // const handleOperationalSelectChange = (selectedOption) => {
  //   setOperationalManager(selectedOption);
  // };

  // const handleGroupSelectChange = (selectedGroupOption) => {
  //   setGroupSelector(selectedGroupOption);
  // };

  const [isCheckedReferralAccount, setIsCheckedReferralAccount] =
    useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientOptions, setClientOptions] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clients = await getAllClients();
        // console.log("Clients:", clients);
        const options = clients.map((client) => ({
          value: client.client_id,
          label: client.client_name,
        }));
        setClientOptions(options);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

  const handleClientChange = (selectedOption) => {
    setSelectedClient(selectedOption);
  };

  const toggleReferralAccount = () => {
    setIsCheckedReferralAccount((prevState) => !prevState);
  };

  const getStatus = (user) => {
    if (user.is_approved === 1 && user.is_rejected === 0) return "Approved";
    if (user.is_rejected === 1 && user.is_approved === 0) return "Rejected";
    if (user.is_authorized === 1)
      return user.is_approved ? "Approved" : "Rejected";
    return "Pending";
  };

  const validateFields = () => {
    const newErrors = {};
    if (!clientManager) newErrors.clientManager = "Client Manager is required.";
    if (!operationalManager)
      newErrors.operationalManager = "Operational Manager is required.";
    if (!groupSelector || groupSelector.length === 0)
      newErrors.groupSelector = "At least one group must be selected.";
    return newErrors;
  };

  // console.log("user.email_verified => ",user.email_verified);

  // console.log("viewDetails.is_authorised_signatory => ", viewDetails.is_authorised_signatory);

  return (
    <>
      <RoleBasedElement
        allowedRoles={["administrator"]}
        rolePriority={["administrator"]}
      >
        <div className="card mx-4">
          <div
            className="border-1  text-white d-flex justify-content-center align-items-center py-3"
            style={{ background: "#4fc9da", borderRadius: "10px 10px 0 0" }}
          >
            <h5 className="mb-0 fw-bold text-black">View Users Approvals</h5>
          </div>

          <div className="tab-content">
            <div
              id="nit_billing_months"
              className="card-body p-0 tab-pane fade active show"
              role="tabpanel"
              aria-labelledby="nit_billing_months"
            >
              <div className="table-responsive">
                <table className="table table-bordered align-middle">
                  <thead className="bg-grey text-dark text-center">
                    <tr>
                      <th style={{ width: "auto" }}>Date</th>
                      <th style={{ width: "auto" }}>Client Group</th>
                      <th style={{ width: "auto" }}>Client Name</th>
                      <th style={{ width: "auto" }}>Client Mail</th>
                      <th style={{ width: "auto" }}>Status</th>
                      <th style={{ width: "auto" }}>Actions</th>
                      <th style={{ width: "auto" }}>View</th>
                    </tr>
                  </thead>

                  <tbody className="bg-light">
                    {users.length > 0 ? (
                      users.map((user) => (
                        <tr key={user.user_id}>
                          <td className="text-center">
                            {formatTimestamp(user.timestamp)}
                          </td>
                          <td className="text-center">
                            {user.organization_name}
                          </td>
                          <td className="text-center">
                            {user.client_full_name}
                          </td>
                          <td className="text-center">{user.client_email}</td>
                          <td className="text-center">{getStatus(user)}</td>
                          <td className="text-center">
                            {user.is_approved === 0 &&
                            user.is_rejected === 0 ? (
                              <>
                                <span
                                  className="badge badge-light-success fw-bold px-4 py-3"
                                  onClick={() =>
                                    handleUserApproval(
                                      user.approval_id,
                                      user.email_verified,
                                      user.activation_code,
                                      user.referred_by,
                                      user.is_authorised_signatory
                                    )
                                  }
                                >
                                  Approve
                                </span>
                                <span
                                  className="badge badge-light-danger fw-bold px-4 py-3 ms-3"
                                  onClick={() =>
                                    handleRejectUser(user.approval_id)
                                  }
                                >
                                  Reject
                                </span>
                                {user.email_verified === 0 ||
                                user.email_verified === null ? (
                                  <span
                                    className="badge badge-light-blue fw-bold px-4 py-3 ms-3"
                                    onClick={() =>
                                      handleResendVerification(user.approval_id)
                                    }
                                  >
                                    Resend Email
                                  </span>
                                ) : null}
                              </>
                            ) : (
                              <span className="text-muted">
                                No Action needed
                              </span>
                            )}
                          </td>

                          <td className="text-center">
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => togglePopup(user.approval_id)}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No users available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Popup Modal */}
        {showPopup && selectedUser && (
          <div className="popup-modal">
            <div className="popup-content">
              <span className="close-btn" onClick={() => togglePopup(null)}>
                &times;
              </span>

              <div className="card-header">
                <div className="card-title text-center">
                  <h3>User Details</h3>
                </div>
              </div>

              <div className="card mb-5 mb-xl-10">
                <div
                  className="card-body p-0"
                  style={{
                    backgroundColor: "#fff",
                    border: "1px dashed #000000",
                  }}
                >
                  <div
                    className="table-responsive"
                    style={{ maxHeight: "500px" }}
                  >
                    <table className="table align-middle table-row-bordered table-bordered gs-9">
                      <thead className="bg-secondary text-white">
                        <tr>
                          <th className="text-center">Request Fields</th>
                          <th className="text-center">Provided Details</th>
                          <th className="text-center">Approved Details</th>
                        </tr>
                      </thead>
                      <tbody style={{ overflowY: "auto" }}>
                        <tr>
                          <td style={tableCellStyle}>User Name</td>
                          <td style={tableCellStyle}>
                            {viewDetails.client_username || "N/A"}
                          </td>
                          <td style={tableCellStyle}>
                            {isEditMode ? (
                              <input
                                className="full-width w-100"
                                type="text"
                                value={editedDetails.client_username || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    "client_username",
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              editedDetails.client_username || "N/A"
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td style={tableCellStyle}>E-Mail</td>
                          <td style={tableCellStyle}>
                            {viewDetails.client_email || "N/A"}
                          </td>

                          <td style={tableCellStyle}>
                            {isEditMode ? (
                              <input
                                className="full-width"
                                type="text"
                                value={editedDetails.client_email || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    "client_email",
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              editedDetails.client_email || "N/A"
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td style={tableCellStyle}>Full Name</td>
                          <td style={tableCellStyle}>
                            {viewDetails.client_full_name || "N/A"}
                          </td>
                          <td style={tableCellStyle}>
                            {isEditMode ? (
                              <input
                                className="full-width"
                                type="text"
                                value={editedDetails.client_full_name || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    "client_full_name",
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              editedDetails.client_full_name || "N/A"
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td style={tableCellStyle}>Job Title</td>
                          <td style={tableCellStyle}>
                            {viewDetails.client_designation || "N/A"}
                          </td>
                          <td style={tableCellStyle}>
                            {isEditMode ? (
                              <input
                                className="full-width"
                                type="text"
                                value={editedDetails.client_designation || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    "client_designation",
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              editedDetails.client_designation || "N/A"
                            )}
                          </td>
                        </tr>

                        <tr>
                          <td style={tableCellStyle}>D.O.B</td>
                          <td style={tableCellStyle}>
                            {viewDetails.dob || "N/A"}
                          </td>
                          <td style={tableCellStyle}>
                            {isEditMode ? (
                              <input
                                className="full-width"
                                type="date"
                                value={editedDetails.dob || ""}
                                onChange={(e) =>
                                  handleInputChange("dob", e.target.value)
                                }
                              />
                            ) : (
                              editedDetails.dob || "N/A"
                            )}
                          </td>
                        </tr>

                        <tr>
                          <td style={tableCellStyle}>
                            Is Authorised Signatory
                          </td>

                          {/* Display non-editable value */}
                          <td style={tableCellStyle}>
                            {viewDetails.is_authorised_signatory === 1
                              ? "Yes"
                              : "No"}
                          </td>

                          {/* Edit mode handling */}
                          <td style={tableCellStyle}>
                            {
                              isEditMode ? (
                                <input
                                  type="checkbox"
                                  checked={
                                    editedDetails.is_authorised_signatory === 1
                                  }
                                  onChange={(e) =>
                                    handleInputChange(
                                      "is_authorised_signatory",
                                      e.target.checked ? 1 : 0 // Convert checkbox state to 1 or 0
                                    )
                                  }
                                />
                              ) : editedDetails.is_authorised_signatory ===
                                1 ? (
                                "Yes"
                              ) : (
                                "No"
                              ) // Display Yes/No
                            }
                          </td>
                        </tr>

                        <tr>
                          <td style={tableCellStyle}>
                            Authorised Signatory Full Name
                          </td>
                          <td style={tableCellStyle}>
                            {viewDetails.authorised_signatory_full_name ||
                              "N/A"}
                          </td>
                          <td style={tableCellStyle}>
                            {isEditMode ? (
                              <input
                                className="full-width"
                                type="text"
                                value={
                                  editedDetails.authorised_signatory_full_name ||
                                  ""
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    "authorised_signatory_full_name",
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              editedDetails.authorised_signatory_full_name ||
                              "N/A"
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td style={tableCellStyle}>
                            Authorised Signatory Job Title
                          </td>
                          <td style={tableCellStyle}>
                            {viewDetails.authorised_signatory_designation ||
                              "N/A"}
                          </td>
                          <td style={tableCellStyle}>
                            {isEditMode ? (
                              <input
                                type="text"
                                className="full-width"
                                value={
                                  editedDetails.authorised_signatory_designation ||
                                  ""
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    "authorised_signatory_designation",
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              editedDetails.authorised_signatory_designation ||
                              "N/A"
                            )}
                          </td>
                        </tr>

                        <tr>
                          <td style={tableCellStyle}>
                            Authorised Signatory E-Mail Address
                          </td>
                          <td style={tableCellStyle}>
                            {viewDetails.authorised_signatory_email || "N/A"}
                          </td>
                          <td style={tableCellStyle}>
                            {isEditMode ? (
                              <input
                                type="text"
                                className="full-width"
                                value={
                                  editedDetails.authorised_signatory_email || ""
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    "authorised_signatory_email",
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              editedDetails.authorised_signatory_email || "N/A"
                            )}
                          </td>
                        </tr>

                        <tr>
                          <td style={tableCellStyle}>Authorised D.O.B</td>
                          <td style={tableCellStyle}>
                            {viewDetails.authorised_signatory_dob || "N/A"}
                          </td>
                          <td style={tableCellStyle}>
                            {isEditMode ? (
                              <input
                                className="full-width"
                                type="date"
                                value={
                                  editedDetails.authorised_signatory_dob || ""
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    "authorised_signatory_dob",
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              editedDetails.authorised_signatory_dob || "N/A"
                            )}
                          </td>
                        </tr>

                        <tr>
                          <td style={tableCellStyle}>Organization/Firm</td>
                          <td style={tableCellStyle}>
                            {viewDetails.organization_name || "N/A"}
                          </td>
                          <td style={tableCellStyle}>
                            {isEditMode ? (
                              <input
                                type="text"
                                className="full-width"
                                value={editedDetails.organization_name || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    "organization_name",
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              editedDetails.organization_name || "N/A"
                            )}
                          </td>
                        </tr>

                        <tr>
                          <td style={tableCellStyle}>Organization Email</td>
                          <td style={tableCellStyle}>
                            {viewDetails.organization_email || "N/A"}
                          </td>
                          <td style={tableCellStyle}>
                            {isEditMode ? (
                              <input
                                type="text"
                                className="full-width"
                                value={editedDetails.organization_email || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    "organization_email",
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              editedDetails.organization_email || "N/A"
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td style={tableCellStyle}>Address Line1</td>
                          <td style={tableCellStyle}>
                            {viewDetails.address_line1 || "N/A"}
                          </td>
                          <td style={tableCellStyle}>
                            {isEditMode ? (
                              <input
                                className="full-width"
                                type="text"
                                value={editedDetails.address_line1 || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    "address_line1",
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              editedDetails.address_line1 || "N/A"
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td style={tableCellStyle}>Address Line2</td>
                          <td style={tableCellStyle}>
                            {viewDetails.address_line2 || "N/A"}
                          </td>
                          <td style={tableCellStyle}>
                            {isEditMode ? (
                              <input
                                className="full-width"
                                type="text"
                                value={editedDetails.address_line2 || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    "address_line2",
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              editedDetails.address_line2 || "N/A"
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td style={tableCellStyle}>Postal Code</td>
                          <td style={tableCellStyle}>
                            {viewDetails.postal_code || "N/A"}
                          </td>
                          <td style={tableCellStyle}>
                            {isEditMode ? (
                              <input
                                className="full-width"
                                type="text"
                                value={editedDetails.postal_code || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    "postal_code",
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              editedDetails.postal_code || "N/A"
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td style={tableCellStyle}>Country</td>
                          <td style={tableCellStyle}>
                            {viewDetails.country || "N/A"}
                          </td>
                          <td style={tableCellStyle}>
                            {isEditMode ? (
                              <input
                                className="full-width"
                                type="text"
                                value={editedDetails.country || ""}
                                onChange={(e) =>
                                  handleInputChange("country", e.target.value)
                                }
                              />
                            ) : (
                              editedDetails.country || "N/A"
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td style={tableCellStyle}>State</td>
                          <td style={tableCellStyle}>
                            {viewDetails.state || "N/A"}
                          </td>
                          <td style={tableCellStyle}>
                            {isEditMode ? (
                              <input
                                className="full-width"
                                type="text"
                                value={editedDetails.state || ""}
                                onChange={(e) =>
                                  handleInputChange("state", e.target.value)
                                }
                              />
                            ) : (
                              editedDetails.state || "N/A"
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td style={tableCellStyle}>City</td>
                          <td style={tableCellStyle}>
                            {viewDetails.city || "N/A"}
                          </td>
                          <td style={tableCellStyle}>
                            {isEditMode ? (
                              <input
                                className="full-width"
                                type="text"
                                value={editedDetails.city || ""}
                                onChange={(e) =>
                                  handleInputChange("city", e.target.value)
                                }
                              />
                            ) : (
                              editedDetails.city || "N/A"
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td style={tableCellStyle}>Contact No</td>
                          <td style={tableCellStyle}>
                            {viewDetails.contact_number || "N/A"}
                          </td>
                          <td style={tableCellStyle}>
                            {isEditMode ? (
                              <input
                                className="full-width"
                                type="text"
                                value={editedDetails.contact_number || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    "contact_number",
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              editedDetails.contact_number || "N/A"
                            )}
                          </td>
                        </tr>

                        <tr>
                          <td style={tableCellStyle}>Landline No</td>
                          <td style={tableCellStyle}>
                            {viewDetails.landline_no || "N/A"}
                          </td>
                          <td style={tableCellStyle}>
                            {isEditMode ? (
                              <input
                                className="full-width"
                                type="text"
                                value={editedDetails.landline_no || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    "landline_no",
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              editedDetails.landline_no || "N/A"
                            )}
                          </td>
                        </tr>

                        <tr>
                          <td style={tableCellStyle}>Extn.</td>
                          <td style={tableCellStyle}>
                            {viewDetails.extension_no || "N/A"}
                          </td>
                          <td style={tableCellStyle}>
                            {isEditMode ? (
                              <input
                                className="full-width"
                                type="text"
                                value={editedDetails.extension_no || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    "extension_no",
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              editedDetails.extension_no || "N/A"
                            )}
                          </td>
                        </tr>

                        <tr>
                          <td style={tableCellStyle}>Website</td>
                          <td style={tableCellStyle}>
                            {viewDetails.website || "N/A"}
                          </td>
                          <td style={tableCellStyle}>
                            {isEditMode ? (
                              <input
                                className="full-width"
                                type="text"
                                value={editedDetails.website || ""}
                                onChange={(e) =>
                                  handleInputChange("website", e.target.value)
                                }
                              />
                            ) : (
                              editedDetails.website || "N/A"
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td style={tableCellStyle}>Activation Code</td>
                          <td style={tableCellStyle}>
                            {viewDetails.activation_code || "N/A"}
                          </td>
                          <td style={tableCellStyle}>
                            {isEditMode ? (
                              <input
                                className="full-width"
                                type="text"
                                value={editedDetails.activation_code || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    "activation_code",
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              editedDetails.activation_code || "N/A"
                            )}
                          </td>
                        </tr>

                        <tr>
                          <td style={tableCellStyle}>Referred By</td>
                          <td style={tableCellStyle}>
                            {viewDetails.referred_by || "N/A"}
                          </td>
                          <td style={tableCellStyle}>
                            {isEditMode ? (
                              <input
                                className="full-width"
                                type="text"
                                value={editedDetails.referred_by || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    "referred_by",
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              editedDetails.referred_by || "N/A"
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {isEditMode ? (
                  <button
                    className="btn btn-primary text-end btn-sm"
                    onClick={handleSave}
                    style={{
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    Update
                  </button>
                ) : (
                  editedDetails &&
                  editedDetails.is_approved === 0 &&
                  editedDetails.is_rejected === 0 && (
                    <button
                      className="btn btn-primary"
                      onClick={handleEdit}
                      style={{
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        <Toaster />

        <Modal
          show={showModal}
          onHide={handleCloseModal}
          backdrop="static"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>CLIENT SETUP</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleFormSubmit}>
              <div className="container mb-4">
                {/* First Row - Client & Operational Manager */}
                <div className="row">
                  <div className="col-md-6">
                    <label>
                      CLIENT MANAGER<span style={{ color: "red" }}>*</span>
                    </label>
                    <Select
                      value={clientManager}
                      onChange={setClientManager}
                      options={clientManagerOptions}
                      className="custom-select fs-7"
                      placeholder="Choose managers..."
                    />
                    {errors.clientManager && (
                      <div className="text-danger mt-1">
                        {errors.clientManager}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label>
                      OPERATIONAL MANAGER<span style={{ color: "red" }}>*</span>
                    </label>
                    <Select
                      value={operationalManager}
                      onChange={setOperationalManager}
                      options={operationalManagerOptions}
                      className="custom-select fs-7"
                      placeholder="Choose an Operational..."
                    />
                    {errors.operationalManager && (
                      <div className="text-danger mt-1">
                        {errors.operationalManager}
                      </div>
                    )}
                  </div>
                </div>

                {/* Group Select */}
                <div className="row">
                  <div className="col">
                    <label>
                      GROUP SELECT<span style={{ color: "red" }}>*</span>
                    </label>
                    <Select
                      value={groupSelector}
                      onChange={setGroupSelector}
                      options={groupSelect}
                      isMulti
                      className="custom-select fs-8"
                      placeholder="Choose a group"
                    />
                    {errors.groupSelector && (
                      <div className="text-danger mt-1">
                        {errors.groupSelector}
                      </div>
                    )}
                  </div>
                </div>

                {/* Promo Code & Role (conditionally rendered) */}
                <div className="row">
                  <div className="col-md-6">
                    <label>PROMO CODE</label>
                    <input
                      type="text"
                      className="custom-select fs-8"
                      value={isPromocode}
                      onChange={(e) => setIsPromocode(e.target.value)}
                      placeholder="Enter promo code"
                    />
                  </div>

                  {showRole && (
                    <div className="col-md-6">
                      <label>ROLE</label>
                      <Select
                        value={selectedRole}
                        onChange={setSelectedRole}
                        options={roles}
                        className="custom-select fs-8"
                        placeholder="Choose a role"
                      />
                    </div>
                  )}
                </div>

                {/* Referred By & Client Select */}
                <div className="row">
                  <div className="col-md-6">
                    <label>REFERRED BY</label>
                    <input
                      type="text"
                      className="custom-select fs-8"
                      placeholder="Referred by"
                      value={isReferralAccount}
                      onChange={(e) => setIsReferralAccount(e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label>REFERRAL CLIENT</label>
                    <Select
                      className="basic-single"
                      classNamePrefix="select p-3"
                      value={selectedClient}
                      isClearable
                      isSearchable
                      name="client"
                      placeholder="Choose an existing client"
                      onChange={handleClientChange}
                      options={clientOptions}
                    />
                  </div>
                </div>

                {/* Valid From & Valid Till */}
                {selectedClient && (
                  <>
                    <div className="row">
                      <div className="col-md-6">
                        <label>VALID FROM</label>
                        <br />
                        <input
                          type="date"
                          className="form-control-date p-2 fs-8 w-100"
                          value={isValidFrom}
                          onChange={(e) => setIsValidFrom(e.target.value)}
                        />
                      </div>
                      <div className="col-md-6">
                        <label>VALID TILL</label> <br />
                        <input
                          type="date"
                          className="form-control-date p-2 fs-8 w-100"
                          value={isValidTill}
                          onChange={(e) => setIsValidTill(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-6 mt-2">
                      <div className="form-check d-flex align-items-center">
                        <input
                          className="form-check-input custom-checkbox"
                          type="checkbox"
                          id="skipDateSettings"
                          name="toc"
                          checked={skipDateSettings}
                          onChange={handleCheckboxChange}
                          style={{
                            width: "20px",
                            height: "20px",
                            borderColor: "#9dc7e3",
                            cursor: "pointer",
                          }}
                        />
                        <label htmlFor="skipDateSettings">
                          SKIP DATE SETTINGS
                        </label>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <label>PERCENTAGE</label>
                        <input
                          type="text"
                          className="custom-select fs-8"
                          placeholder="Enter percentage"
                          value={percentage}
                          onChange={(e) => setPercentage(e.target.value)}
                        />
                      </div>
                      <div className="col-md-6">
                        <label>INITIAL FUNDS</label>
                        <input
                          type="text" // Corrected 'type' to 'text'
                          className="custom-select fs-8"
                          placeholder="Enter initial funds"
                          value={initialFunds}
                          onChange={(e) => setInitialFunds(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mt-2">
                        <label className="form-label">
                          REFERRAL CASHBACK TYPE
                        </label>
                        <div className="mb-4 d-flex align-items-center">
                          {/* Balance Option */}
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              id="balance"
                              name="invoiceConfig"
                              value="Balance"
                              checked={cashbackType === "Balance"}
                              onChange={handleRadioChange}
                              style={{
                                borderColor: "#9dc7e3",
                                color: "#1F1F1F",
                                fontSize: "12px",
                              }}
                            />
                            <label
                              htmlFor="balance"
                              className="form-check-label fs-8 mx-2"
                            >
                              Balance
                            </label>
                          </div>

                          {/* Cheque Option */}
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              id="cheque"
                              name="invoiceConfig"
                              value="Cheque"
                              checked={cashbackType === "Cheque"}
                              onChange={handleRadioChange}
                              style={{
                                borderColor: "#9dc7e3",
                                color: "#1F1F1F",
                                fontSize: "12px",
                              }}
                            />
                            <label
                              htmlFor="cheque"
                              className="form-check-label fs-8 mx-2"
                            >
                              Cheque
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Submit Button */}
                <div className="mt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-100"
                  >
                    <b>
                      {loading ? "Processing..." : "Confirm Setup And Approve"}
                    </b>
                  </button>
                </div>
              </div>
            </form>
          </Modal.Body>
        </Modal>

        <Modal show={showMessage} onHide={handleCloseModalMessage} centered>
          <Modal.Body className="p-4">
            <div className="d-flex flex-column align-items-center">
              <div className="text-danger mb-3">
                <i
                  className="bi bi-exclamation-triangle-fill"
                  style={{ fontSize: "2rem" }}
                ></i>
              </div>
              <h5 className="text-center mb-3">Action Denied</h5>
              <p className="text-center">
                Cannot approve. The user has not verified their email yet.
              </p>
              <button
                className="btn btn-danger mt-3 px-4"
                onClick={handleCloseModalMessage}
              >
                Close
              </button>
            </div>
          </Modal.Body>
        </Modal>
      </RoleBasedElement>
    </>
  );
};
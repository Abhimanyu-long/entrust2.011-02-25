import React, { useEffect, useState, useCallback } from "react";
import userprofile from "../../assets/media/users/user-profile.jpg";
import { useAuth } from "../../../context/AuthContext";

export const ProfileTippy = ({ Logout }) => {

  const API_URL =
  import.meta.env.VITE_BASE_URL + ":" + import.meta.env.VITE_BASE_PORT;
  
  const { getUserDetails } = useAuth();

  const UserID = JSON.parse(sessionStorage.getItem("user_id")) || {};

  // console.log(UserID.custom_id);
  const profileImageUrl = `${API_URL}/user/profile-image/${UserID.custom_id}`;
  // console.log(profileImageUrl);
  // Fetch data from sessionStorage with fallback defaults
  const username = sessionStorage.getItem("username") || "User";
  const clientData = JSON.parse(sessionStorage.getItem("client_data")) || {};
  const roles = JSON.parse(sessionStorage.getItem("roles")) || [];

  // States for user details, loading, and errors
  const [userData, setUserData] = useState({
    details: null,
    error: null,
    loading: true,
  });

  const fetchUserDetails = useCallback(async () => {
    try {
      setUserData((prev) => ({ ...prev, loading: true, error: null }));
      const details = await getUserDetails();
      setUserData({ details, loading: false, error: null });
    } catch (err) {
      setUserData({ details: null, loading: false, error: "Failed to fetch user details" });
    }
  }, [getUserDetails]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  const { details, loading, error } = userData;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg menu-state-color fw-semibold py-4 fs-6 w-275px show">
      {/* User Profile Section */}
      {/* <div className="menu-item px-3">
        <div className="menu-content d-flex align-items-center px-3">
          <div className="symbol symbol-50px me-5">
            <img alt="User" 
            src={profileImageUrl?  profileImageUrl : userprofile} 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = userprofile;
            }}
            />
          </div>
          <div className="d-flex flex-column">
            <div
              className="fw-bold d-flex align-items-center fs-5"
              style={{
                whiteSpace: "normal",
                wordBreak: "break-word",
                maxWidth: "200px",
              }}
            >
              {username}
              <span className="badge badge-light-success fw-bold fs-8 px-2 py-1 ms-2">
                {roles[0]?.role_name || "Role"}
              </span>
            </div>
            <a href="#" className="fw-semibold text-muted text-hover-primary fs-7">
              {details?.email || "NeuralIT@neuralit.com"}
            </a>
            <a href="#" className="fw-semibold text-muted text-hover-primary fs-7">
              {clientData.client_name || "Group name not available"}
            </a>
          </div>
        </div>
      </div> */}

<div className="menu-item px-3">
  <div className="menu-content d-flex align-items-center px-3">
    {/* Profile Image */}
    <div className="symbol me-3">
      <img
        alt="User"
        src={profileImageUrl ? profileImageUrl : userprofile}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = userprofile;
        }}
        className="img-fluid rounded-circle"
        style={{
          width: "50px",
          height: "50px",
          objectFit: "cover",
        }}
      />
    </div>

    {/* Text Content */}
    <div className="d-flex flex-column overflow-hidden flex-grow-1">
      {/* Username and Role */}
      <div className="d-flex align-items-center">
        <span className="fw-bold fs-5 text-truncate">{username}</span>
        <span className="badge bg-success text-light fw-bold fs-8 px-2 py-1 ms-2 flex-shrink-0">
          {roles[0]?.role_name || "Role"}
        </span>
      </div>

      {/* Email */}
      <a
        href="#"
        className="fw-semibold text-muted text-hover-primary fs-7 text-truncate"
      >
        {details?.email || "NeuralIT@neuralit.com"}
      </a>

      {/* Group Name */}
      <a
        href="#"
        className="fw-semibold text-muted text-hover-primary fs-7 text-truncate"
      >
        {clientData.client_name || "Group name not available"}
      </a>
    </div>
  </div>
</div>


      <div className="separator my-2"></div>

      {/* Menu Options */}
      <div className="menu-item px-5">
        <a href="/profile" className="menu-link px-5">
          My Profile
        </a>
      </div>
      <div className="menu-item px-5">
        <a href="/activity" className="menu-link px-5">
          My Activity Log
        </a>
      </div>

      <div className="separator my-2"></div>

      {/* Logout Option */}
      <div className="menu-item px-5" onClick={Logout}>
        <a href="#" className="menu-link px-5">
          Sign Out
        </a>
      </div>
    </div>
  );
};

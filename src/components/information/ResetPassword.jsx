import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LockIcon from "@mui/icons-material/Lock";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import "./../../assets/css/profile.css";
export const ResetPassword = () => {
  // const location = useLocation();
  const { restPassword } = useAuth();
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // const getTokenFromUrl = () => {
  //   const params = new URLSearchParams(location.search);
  //   return params.get("token");
  // };
  // const token = getTokenFromUrl();

  const validatePassword = (password) => ({
    length: password.length >= 8,
    noSpaces: !/\s/.test(password),
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[@$!%*?&]/.test(password),
  });

  // const validatePassword = (password) => {
  //   const isValidLength = password.length >= 8;
  //   const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  //   return { isValidLength, hasSpecialChar };
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

     // Validate the new password
  const {
    length,
    noSpaces,
    hasUpperCase,
    hasLowerCase,
    hasNumber,
    hasSpecialChar,
  } = validatePassword(newPassword);

    // const { isValidLength, hasSpecialChar } = validatePassword(newPassword);

    // Check if new password and confirm new password match
    if (newPassword !== confirmNewPassword) {
      setError("New and Confirm New Passwords do not match.");
      return;
    }

    if (newPassword === oldPassword) {
      setError("New password cannot be the same as the current password.");
      return;
    }    

    // Check if new password meets the validation criteria
    // if (!isValidLength || !hasSpecialChar) {
    //   setError(
    //     "New password must be at least 8 characters long and contain at least one special character."
    //   );
    //   return;
    // }
     // Check if new password meets the validation criteria
  if (!length || !noSpaces || !hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
    setError(
      "New password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, one special character, and no spaces."
    );
    return;
  }

    setError(""); // Reset any previous error
    const data = {
      current_password: oldPassword,
      new_password: newPassword,
    };

    try {
      const response = await restPassword(data);
      // console.log("response", response);
    
      // Check if the response is OK (status 200)
      if (response.ok || response.status === 200 ) {
        toast.success("Password has been reset successfully!");

        sessionStorage.clear();
        // Delay the navigation to login page by 1.5 seconds
        setTimeout(() => {
          navigate(`/login`);
        }, 1500);
      } 
      // Handle case where the status is 403 (Forbidden)
      else if (response.status === 403) {
        toast.error("Failed to reset password. Incorrect data.");
      } 

       // Handle any other unexpected response statuses
      else if (response.status === 500) {
        toast.error("An unexpected error occurred on the server. Please try again later.");
      } 
      // Handle any other unexpected response statuses
      else {
        throw new Error("Failed to reset password. Please try again.");
      }
    } catch (err) {
      // Log and display error messages in case of failure
      console.error("Error occurred while resetting password:", err);
      setError(err.message);
      toast.error(err.message || "An error occurred while resetting the password.");
    }
  };

  const { isValidLength, hasSpecialChar } = validatePassword(newPassword);

  const handleClose = () => {
    setIsModalOpen(false);
  };
  const [isModalOpen, setIsModalOpen] = useState(true);
  if (!isModalOpen) return null;
  return (
    <>
      <div
        className="modal"
        style={{
          position: "fixed",
          top: "0",
          left: "0",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: "9999",
          animation: "fadeIn 0.3s ease-in-out",
        }}
      >
        <div
          className="p-2 rounded"
          style={{
            width: "400px",
            borderRadius: "12px",
            transform: "scale(1)",
          }}
        >
          <div className="container">
            <button
              onClick={handleClose}
              className="close-button"
              aria-label="Close Modal"
              style={{
                position: "absolute",
                top: "10px",
                right: "5px",
                background: "none",
                color:"red",
                zIndex:"10",
                cursor: "pointer",
              }}
            >
              <CloseIcon />
            </button>
            <div
              className="card shadow-sm bg-light p-4 "
              style={{ backgroundColor: "#f9f9f9" }}
            >
              <div className="p-0" style={{ width: "100%", maxWidth: "400px" }}>
                <div className="text-center mb-4">
                  <div style={{ fontSize: "45px", color: "#0098ca" }}>
                    <LockIcon fontSize="large" />
                  </div>
                  <h2
                    style={{
                      color: "#0098ca",
                      fontWeight: "700",
                      background: "linear-gradient(45deg, #0078D4, #0098ca)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                    className="fs-5"
                  >
                    Reset Password
                  </h2>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#6B7280",
                      padding: "0rem 2rem",
                      lineHeight: "1.5",
                    }}
                  >
                    Please enter your current password and set a new one.
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="p-4"
                  style={{ maxWidth: "400px", margin: "auto" }}
                >
                  {error && <div className="alert alert-danger">{error}</div>}

                  <div className="mb-3">
                    <label
                      htmlFor="oldPassword"
                      className="form-label fs-7"
                      style={{ color: "#0098ca", fontWeight: "600" }}
                    >
                      Current Password
                    </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        className="form-control shadow-sm p-3 fs-8"
                        id="oldPassword"
                        placeholder="Enter old password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                        style={{
                          borderRadius: "8px",
                          paddingRight: "40px",
                          border: "1px solid #E2E8F0",
                        }}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="newPassword"
                      className="form-label fs-7"
                      style={{ color: "#0098ca", fontWeight: "600" }}
                    >
                      New Password
                    </label>
                    <div className="position-relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        className="form-control shadow-sm fs-8 p-3"
                        id="newPassword"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        style={{
                          borderRadius: "8px",
                          paddingRight: "40px",
                          border: "1px solid #E2E8F0",
                        }}
                      />
                      <span
                        className="position-absolute end-0 top-50 translate-middle-y me-3"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        style={{ cursor: "pointer" }}
                      >
                        {showNewPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="confirmNewPassword"
                      className="form-label fs-7"
                      style={{ color: "#0098ca", fontWeight: "600" }}
                    >
                      Confirm New Password
                    </label>
                    <div className="position-relative">
                      <input
                        type={showConfirmNewPassword ? "text" : "password"}
                        className="form-control shadow-sm fs-8 p-3"
                        id="confirmNewPassword"
                        placeholder="Confirm new password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        required
                        style={{
                          borderRadius: "8px",
                          paddingRight: "40px",
                          border: "1px solid #E2E8F0",
                        }}
                      />
                      <span
                        className="position-absolute end-0 top-50 translate-middle-y me-3"
                        onClick={() =>
                          setShowConfirmNewPassword(!showConfirmNewPassword)
                        }
                        style={{ cursor: "pointer" }}
                      >
                        {showConfirmNewPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="mb-8 text-muted" style={{ fontSize: "12px" }}>
                        <p style={{ color: "#0098ca", fontSize: "12px" }}>
                Your password must be at least 8 characters long and include a
                mix of uppercase and lowercase letters, numbers, and special
                symbols.
                    </p>
                  </div>

                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn btn-primary w-100 py-2"
                      style={{
                        borderRadius: "30px",
                        backgroundColor: "#0078D4",
                        fontWeight: "bold",
                        transition: "background-color 0.3s",
                        ":hover": {
                          backgroundColor: "#005f9e",
                        },
                      }}
                    >
                      Set Password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

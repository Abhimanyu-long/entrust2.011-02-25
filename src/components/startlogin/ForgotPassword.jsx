import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LockIcon from "@mui/icons-material/Lock";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Loader from "../Loader/Loader";

const ForgotPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { createPassword } = useAuth();

  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Extract token from the URL
  const getTokenFromUrl = () => {
    const params = new URLSearchParams(location.search);
    return params.get("token");
  };
  const token = getTokenFromUrl();

  // Validation rules
  const validatePassword = (password) => ({
    length: password.length >= 8,
    noSpaces: !/\s/.test(password),
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[@$!%*?&]/.test(password),
  });

  const passwordValidations = validatePassword(password);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("New and Confirm Passwords do not match.");
      return;
    }

    const isValid = Object.values(passwordValidations).every((valid) => valid);
    if (!isValid) {
      setError("Password does not meet the required criteria.");
      return;
    }

    setLoading(true); // Show loader
    setError(null); // Reset error

    try {
      await createPassword(token, password);
      toast.success("Password has been reset successfully!");
      navigate(`/login`);
    } catch (err) {
      setError("Failed to reset password.");
    } finally {
      setLoading(false); // Hide loader
    }
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-center vh-100">
        <div
          className="card p-8 shadow-lg"
          style={{ width: "100%", maxWidth: "400px", borderRadius: "12px" }}
        >
          {/* Icon and Heading */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "50px",
                height: "50px",
                backgroundColor: "#e0f7fc",
                borderRadius: "50%",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                marginBottom: "20px",
              }}
            >
              <LockIcon fontSize="medium" style={{ color: "#0097ca" }} />
            </div>
            <h3
              style={{
                color: "#0097ca",
                fontWeight: "bold",
                fontSize: "14px",
                marginBottom: "10px",
                textAlign: "center",
              }}
            >
              Set New Password
            </h3>
            <p
              style={{
                fontSize: "12px",
                color: "#6B7280",
                textAlign: "center",
                maxWidth: "300px",
                margin: "0 auto",
                lineHeight: "1.6",
              }}
            >
             Please create a new, secure password that you haven’t used before with your account.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="pt-2">
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Password Input */}
            <div className="mb-3">
              <label
                htmlFor="new-password"
                className="form-label fs-7"
                style={{
                  fontWeight: "bold",
                  color: "#0097ca",
                }}
              >
                New Password &nbsp;
                <span
                  style={{
                    color: "red",
                    fontSize: "10px",
                    position: "absolute",
                  }}
                >
                  *
                </span>
              </label>
              <div className="position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control fs-7 p-2"
                  id="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    borderRadius: "8px",
                    padding: "10px",
                    paddingRight: "40px",
                  }}
                />
                <span
                  className="position-absolute end-0 top-50 translate-middle-y me-3"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    cursor: "pointer",
                    backgroundColor: "transparent",
                    border: "none",
                  }}
                >
                  {showPassword ? (
                    <VisibilityIcon style={{ color: "#0097ca" }} />
                  ) : (
                    <VisibilityOffIcon style={{ color: "#0097ca" }} />
                  )}
                </span>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="mb-6">
              <label
                htmlFor="confirm-password"
                className="form-label fs-7"
                style={{
                  fontWeight: "bold",
                  color: "#0097ca",
                }}
              >
                Confirm Password &nbsp;
                <span
                  style={{
                    color: "red",
                    fontSize: "10px",
                    position: "absolute",
                  }}
                >
                  *
                </span>
              </label>
              <div className="position-relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-control fs-7 p-2"
                  id="confirmPassword"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{
                    borderRadius: "8px",
                    padding: "10px",
                    paddingRight: "40px",
                  }}
                />
                <span
                  className="position-absolute end-0 top-50 translate-middle-y me-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    cursor: "pointer",
                    backgroundColor: "transparent",
                    border: "none",
                  }}
                >
                  {showConfirmPassword ? (
                    <VisibilityIcon style={{ color: "#0097ca" }} />
                  ) : (
                    <VisibilityOffIcon style={{ color: "#0097ca" }} />
                  )}
                </span>
              </div>
            </div>

            {/* Password Validation */}
            <div className="mb-8" style={{ fontSize: "12px" }}>
              <p style={{ color: "#0098ca", fontSize: "12px" }}>
                Your password must be at least 8 characters long and include a
                mix of uppercase and lowercase letters, numbers, and special
                symbols.
              </p>
            </div>

            {/* <div className="mb-1" style={{ fontSize: "12px" }}>
              <p style={{ color: passwordValidations.noSpaces ? "#10b981" : "#f43f5e" ,fontSize:"12px"}}>
                {passwordValidations.noSpaces ? <DoneIcon /> : <CloseIcon />}{" "}
                Must not contain spaces
              </p>
              <p style={{ color: passwordValidations.length ? "#10b981" : "#f43f5e" ,fontSize:"12px"}}>
                {passwordValidations.length ? <DoneIcon /> : <CloseIcon />}{" "}
                At least 8 characters
              </p>
              <p style={{ color: passwordValidations.hasSpecialChar ? "#10b981" : "#f43f5e" ,fontSize:"12px"}}>
                {passwordValidations.hasSpecialChar ? <DoneIcon /> : <CloseIcon />}{" "}
                At least one special character
              </p>
              <p style={{ color: passwordValidations.hasNumber ? "#10b981" : "#f43f5e" ,fontSize:"12px"}}>
                {passwordValidations.hasNumber ? <DoneIcon /> : <CloseIcon />}{" "}
                At least one number
              </p>
              <p style={{ color: passwordValidations.hasUpperCase ? "#10b981" : "#f43f5e" ,fontSize:"12px"}}>
                {passwordValidations.hasUpperCase ? <DoneIcon /> : <CloseIcon />}{" "}
                At least one uppercase letter
              </p>
              <p style={{ color: passwordValidations.hasLowerCase ? "#10b981" : "#f43f5e",fontSize:"12px" }}>
                {passwordValidations.hasLowerCase ? <DoneIcon /> : <CloseIcon />}{" "}
                At least one lowercase letter
              </p>
            </div> */}

            {/* Submit Button */}
            <div className="text-center">
              <button type="submit" className="w-100 submitbtn">
                <b>Submit</b>
              </button>
            </div>
          </form>

          {/* Back to Login */}
          <div className="text-center mt-4">
            <a
              href="/"
              className="custom-link d-flex align-items-center justify-content-center"
              style={{
                textDecoration: "none",
                fontWeight: "bold",
                fontSize: "1rem",
                color: "#0097ca",
                padding: "10px 20px",
                border: "1px solid #0097ca",
                borderRadius: "25px",
                transition: "all 0.3s ease",
                display: "inline-flex",
                alignItems: "center",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#0097ca";
                e.target.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = "#0097ca";
              }}
            >
              <ArrowBackIcon style={{ marginRight: "8px", color: "inherit" }} />
              Back to Log In
            </a>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default ForgotPassword;

////hiiiii this is me

// import React, { useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { useAuth } from '../../../context/AuthContext';
// import toast, { Toaster } from "react-hot-toast";
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

// const ForgotPassword = () => {
//   const location = useLocation();
//   const {createPassword} = useAuth();
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const getTokenFromUrl = () => {
//     const params = new URLSearchParams(location.search);
//     return params.get('token');
//   };
//   const token = getTokenFromUrl();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (password !== confirmPassword) {
//       setError('Passwords do not match.');
//       return;
//     }
//     try {
//       await createPassword(token, password);
//       toast.success('Password has been reset successfully!');
//       setError('');
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <>
//     <div className="VerifyEmail d-flex align-items-center justify-content-center vh-100">
//       <div className="card p-4 shadow-lg" style={{ width: '100%', maxWidth: '400px' }}>
//       <h2 className="text-center mb-4" style={{ color: '#0098ca' }}>Create Your Password</h2>
//         <form onSubmit={handleSubmit}>

//         {error && <div className="alert alert-danger">{error}</div>}
//         {success && <div className="alert alert-success">{success}</div>}

//           <div className="mb-3">
//             <label htmlFor="password" className="form-label">
//               Create Password
//             </label>
//             <div className="input-group">
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 className="form-control pe-5"
//                 id="password"
//                 placeholder="Enter new password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//               <span
//                 className="input-group-text"
//                 onClick={() => setShowPassword(!showPassword)}
//                 style={{ cursor: 'pointer' }}
//               >
//                 {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
//               </span>
//             </div>
//           </div>

//           <div className="mb-3">
//             <label htmlFor="confirmPassword" className="form-label">
//               Confirm Password
//             </label>
//             <div className="input-group">
//               <input
//                 type={showConfirmPassword ? 'text' : 'password'}
//                 className="form-control"
//                 id="confirmPassword"
//                 placeholder="Confirm new password"
//                 value={confirmPassword}
//                 onChange={(e) => (e.target.value)}
//                 required
//               />
//               <span
//                 className="input-group-text"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 style={{ cursor: 'pointer' }}
//               >
//                    {showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
//               </span>
//             </div>
//           </div>

//           <div className="text-center">
//             <button type="submit" className="btn btn-primary w-100">
//               Save
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//     <Toaster />
//     </>
//   );
// };

// export default ForgotPassword;

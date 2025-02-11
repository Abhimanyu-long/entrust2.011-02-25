import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form as BootstrapForm } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { useAuth } from "../../../context/AuthContext";

import logo from "../../assets/Images/NeuralLogo.svg";
import accreditationImg from "../../assets/Accreditation.png";
import sideImg from "../../assets/Images/bg-images/bgsideimg.svg";

import "../../assets/css/login.css";

const Login = () => {
  const navigate = useNavigate();
  const { loginWithEmail, forgotPassword, checkLdapUser } = useAuth();

  const [credentials, setCredentials] = useState({
    identifier: "",
    password: "",
  });
  const [forgot, setForgot] = useState(true);
  const [forgotIdentifier, setForgotIdentifier] = useState({ identifier: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const [showtext, setShowtext] = useState(true);

  const [errorsText, setErrorsText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create a reference for the password input field
  const passwordInputRef = useRef(null);
  const emailInputRef = useRef(null);

  // Single useEffect to handle focusing the correct input field
  useEffect(() => {
    if (show && passwordInputRef.current) {
      passwordInputRef.current.focus(); // Focus the password input when 'show' is true
    } else if (!show && emailInputRef.current) {
      emailInputRef.current.focus(); // Focus the email/username input on initial load or when 'show' is false
    }
  }, [show]);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (forgot) {
      setCredentials((prev) => ({ ...prev, [name]: value }));
    } else {
      setForgotIdentifier((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateIdentifier = (identifier) => {
    const errors = {};

    if (!identifier) {
      errors.identifier = "Username or email is required";
    } else if (identifier.includes(" ")) {
      errors.identifier = "Username or email must not contain spaces";
    } else {
      const isEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (isEmailRegex.test(identifier)) {
        // Valid email format
      } else {
        if (identifier.length < 3) {
          errors.identifier = "Username must be at least 3 characters long";
        }
      }
    }

    return errors;
  };

  const validatePassword = (password) => {
    const errors = {};
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Invalid username or password";
    }
    return errors;
  };

  const handleInputCheck = async (e) => {
    e.preventDefault();
    const validationErrors = validateIdentifier(credentials.identifier);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setShowErrors(true);
      setTimeout(() => {
        setShowErrors(false);
      }, 5000);
      return;
    }

    try {
      const response = await checkLdapUser({
        username_or_email: credentials.identifier,
      });

      // console.log("lndp response", response);

      if (response && response.data) {
        if (response.data.user_exists === 1) {
          setShow(true);
          setShowtext(false);
          return true; // Return true if user exists
        } else if (response.data.user_exists === 2) {
          setShow(false);
          toast.error("Pending Approval");

          setTimeout(() => {
            setErrorsText("");
          }, 5000);

          // Clear input field if an error occurs
          setCredentials({ ...credentials, identifier: "" });

          return false;
        } else if (response.data.user_exists === 0) {
          setShow(false);
          toast.error(
            response.data.message ||
              "Enter a valid username or email. Please register first."
          );

          setErrorsText("Enter a valid username or email");
          setTimeout(() => {
            setErrorsText("");
          }, 5000);

          // Clear input field if an error occurs
          setCredentials({ ...credentials, identifier: "" });

          return false;
        }
      } else {
        toast.error("Invalid response from server.");

        // Clear input field if an error occurs
        setCredentials({ ...credentials, identifier: "" });

        return false; // Return false
      } 
    } catch (error) {
      setShow(false);
      toast.error(error.message || "An unexpected error occurred.");

      // Clear input field if an error occurs
      setCredentials({ ...credentials, identifier: "" });

      return false; // Return false
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      return; // Prevent multiple submissions
    }

    setIsSubmitting(true); // Set the flag to true

    const identifierErrors = validateIdentifier(credentials.identifier);
    const passwordErrors = validatePassword(credentials.password);
    const validationErrors = { ...identifierErrors, ...passwordErrors };
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setShowErrors(true);
      setTimeout(() => {
        setShowErrors(false);
      }, 5000);
      setIsSubmitting(false); // Reset the flag
      return;
    }

    const isEmail = credentials.identifier.includes("@");
    const loginData = isEmail
      ? { email: credentials.identifier, password: credentials.password }
      : { username: credentials.identifier, password: credentials.password };

    try {
      const response = await loginWithEmail(loginData);
      // console.log("loginWithEmail => ", response);
      if (response.status === 200) {
        let isAuthorizedSignatory = 0;
        const userDetails = sessionStorage.getItem("user_details");
        // const userDetails = Cookies.get("user_details");
        console.log("userDetails", userDetails);
        if (userDetails) {
          const userDetailsJson = JSON.parse(userDetails);
          isAuthorizedSignatory = userDetailsJson.is_authorized_signatory;
        }

        if (response.data.terms_and_conditions_accepted === 0) {
          setTimeout(() => navigate("/termsandcondition"), 500);
        } else if (response.data.agreement_accepted === 0) {
          if (isAuthorizedSignatory === 1) {
            setTimeout(() => navigate("/useragreement"), 500);
          } else {
            setTimeout(() => navigate("/"), 500);
          }
        } else if(response.data.referral_agreement_accepted === 0){
          setTimeout(() => navigate("/referralagreement"), 500);
        } else {
          navigate("/");
          setTimeout(() => {
            toast.success(response.data.message || "Login successful!");
          }, 200);
        }
      } else {
        const errorMessage =
          response?.data?.message || "Invalid login credentials";
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid username or password"
      );
      setCredentials({ ...credentials, password: "" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();

    const validationErrors = validateIdentifier(forgotIdentifier.identifier);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setShowErrors(true);
      setTimeout(() => {
        setShowErrors(false);
      }, 5000);
      return;
    }

    const identifierValue = forgotIdentifier.identifier;
    const isEmail = identifierValue.includes("@");
    const forgotData = isEmail
      ? { email: identifierValue }
      : { username: identifierValue };

    try {
      const response = await forgotPassword(forgotData);

      console.log("forgotPassword => ", response);

      if (response.status === 400) {
        toast.error(response.response.data.detail);
      }

      if (response.status === 200) {
        toast.success("Reset instructions sent to email");
        setForgotIdentifier({ identifier: "" });
        setTimeout(() => {
          window.location.reload();
        }, 2500);
      }
      if (response.status === 500) {
        toast.error("Server error. Please try again later.");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred. Please try again.");
    }
  };

  const toggleForgotPassword = () => {
    setForgot((prev) => !prev);
    setErrors({});
    setCredentials({ identifier: "", password: "" });
    setForgotIdentifier({ identifier: "" });
  };

  return (
    <>
      <div className="loginpage">
        <img src={sideImg} alt="Neural IT Logo" className="logo" />

        <div className="login-box">
          <img
            src={logo}
            alt="Neural IT Logo"
            className="logo-box"
            style={{ width: "50%", height: "50%" }}
          />

          {showErrors && errors.identifier && (
            <p style={{ color: "red" }}>{errors.identifier}</p>
          )}
          {showErrors && errors.password && (
            <p style={{ color: "red" }}>{errors.password}</p>
          )}

          {errorsText && <p style={{ color: "red" }}>{errorsText}</p>}

          <BootstrapForm
            className="login-form"
            onSubmit={forgot ? handleSubmit : handleForgot}
          >
            <div className="fv-row mb-4">
              <label
                className="form-label fw-bold"
                style={{ fontSize: "12px", color: "#0098CA" }}
              >
                Email/Username <span style={{ color: "red" }}>*</span>
              </label>
              <input
                ref={emailInputRef}
                className="form-control form-control-lg form-control-solid"
                style={{ fontSize: "12px", borderColor: "#9dc7e3" }}
                type="text"
                name="identifier"
                placeholder="Email/Username"
                value={
                  forgot ? credentials.identifier : forgotIdentifier.identifier
                }
                onChange={handleChange}
                required
              />
            </div>

            {showtext && (
              <div className="text-gray-500 fw-semibold fs-7 mb-5">
                New Here?
                <Link to="/register" className="link-primary fw-bold ms-1">
                  Create an Account
                </Link>
              </div>
            )}

            {show ? (
              <>
                {forgot && (
                  <div className="fv-row mb-10">
                    <div className="d-flex flex-stack mb-2">
                      <label
                        className="form-label mb-0 fw-bold"
                        style={{ fontSize: "12px", color: "#0098CA" }}
                      >
                        Password <span style={{ color: "red" }}>*</span>
                      </label>
                      <Link
                        onClick={toggleForgotPassword}
                        className="form-label mb-0 fw-bold"
                        style={{ fontSize: "12px", color: "#0098CA" }}
                      >
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="position-relative">
                      <input
                        ref={passwordInputRef}
                        className="form-control form-control-lg form-control-solid"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        value={credentials.password}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                        style={{
                          fontSize: "12px",
                          borderColor: "#9dc7e3",
                          padding: "1px 0.8rem",
                          // paddingRight: "40px",
                        }}
                      />
                      <span
                        className="position-absolute end-0 top-50 translate-middle-y me-3"
                        onClick={toggleShowPassword}
                        style={{
                          cursor: "pointer",
                          backgroundColor: "transparent",
                          border: "none",
                        }}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </span>
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <button type="submit" className="form-group col-12 submitbtn">
                    <span className="indicator-label">
                      {forgot ? "Login" : "Submit"}
                    </span>
                  </button>
                  {!forgot && (
                    <button
                      type="button"
                      className="submitbtn"
                      onClick={toggleForgotPassword}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="form-group col-12">
                <button onClick={handleInputCheck} className="submitbtn">
                  <b>Continue</b>
                </button>
              </div>
            )}

            <div className="accreditation">
              <img
                src={accreditationImg}
                alt="Accreditation"
                width={500}
                height={100}
                className="accreditationimg"
              />
            </div>

            <div className="d-flex flex-center flex-wrap fs-6 p-5 pb-0 footer-mobile">
              <div
                className="d-flex flex-center fw-semibold fs-6"
                 style={{ fontSize: "12px", borderColor: "#9dc7e3" }}
              >
                <a
                  href="https://www.neuralit.com/about-us"
                  style={{
                    color: "#0098CA",
                    textDecoration: "none",
                    padding: "0 8px",
                    fontSize: "11px",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.color = "grey")}
                  onMouseOut={(e) => (e.currentTarget.style.color = "#0098CA")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  About
                </a>
                <a
                  href="https://www.neuralit.com/terms-of-use"
                  style={{
                    color: "#0098CA",
                    textDecoration: "none",
                    padding: "0 8px",
                    fontSize: "11px",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.color = "grey")}
                  onMouseOut={(e) => (e.currentTarget.style.color = "#0098CA")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                Terms&nbsp;of&nbsp;Use
                </a>
                <a
                  href="https://www.neuralit.com/privacy-statement"
                  style={{
                    color: "#0098CA",
                    textDecoration: "none",
                    padding: "0 8px",
                    fontSize: "11px",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.color = "grey")}
                  onMouseOut={(e) => (e.currentTarget.style.color = "#0098CA")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy&nbsp;Statement
                </a>
              </div>
            </div>
          </BootstrapForm>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default Login;

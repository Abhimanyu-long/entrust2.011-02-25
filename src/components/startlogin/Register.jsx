import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";
import ReCAPTCHA from "react-google-recaptcha";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "./../../assets/css/register.css";
import Loader from "../Loader/Loader";
import axios from "axios";

const API_URL =
  import.meta.env.VITE_BASE_URL + ":" + import.meta.env.VITE_BASE_PORT;
const VITE_RECAPTCHA_KEY = import.meta.env.VITE_RECAPTCHA_KEY;

const Register = () => {
  const navigate = useNavigate();
  const { register, checkUsernameAvailability, checkOrganizationAvailability } =
    useAuth();
  const [isPrivacyChecked, setIsPrivacyChecked] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    jobTitle: "",
    authorizedFullName: "",
    authorizedJobTitle: "",
    authorizedDateofBirth: "",
    authorizedEmail: "",
    organization: "",
    organizationEmail: "",
    addressLine1: "",
    addressLine2: "",
    postalCode: "",
    country: "",
    state: "",
    city: "",
    contactNo: "",
    website: "",
    activationCode: "",
    RefBy: "",
    dob: "",
    landlineNo: "",
    extnNo: "",
  });

  const handleCaptcha = (token) => {
    setCaptchaToken(token);
  };

  const [errors, setErrors] = useState({});

  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const fullNameRef = useRef(null);
  const jobTitleRef = useRef(null);
  const authorizedFullNameRef = useRef(null);
  const authorizedJobTitleRef = useRef(null);
  const authorizedEmailRef = useRef(null);
  const authorizedDobRef = useRef(null);
  const organizationRef = useRef(null);
  const organizationEmailRef = useRef(null);
  const addressLine1Ref = useRef(null);
  const addressLine2Ref = useRef(null);
  const postalCodeRef = useRef(null);
  const countryRef = useRef(null);
  const stateRef = useRef(null);
  const cityRef = useRef(null);
  const contactNoRef = useRef(null);
  const landlineNoRef = useRef(null);
  const extnNoRef = useRef(null);
  const websiteRef = useRef(null);
  const activationCodeRef = useRef(null);
  const refByRef = useRef(null);
  const dobRef = useRef(null);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const contactRegex =
    /^(\+?(1|91))?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
  const websiteRegex =
    /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]{1,63}\.[a-zA-Z]{2,6}(\/.*)?$/;

  const usernameDebounceTimeout = useRef(null);
  const organizationNameDebounceTimeout = useRef(null);
  const emailDebounceTimeout = useRef(null);

  useEffect(() => {
    if (credentials.username.trim().length >= 2) {
      if (usernameDebounceTimeout.current) {
        clearTimeout(usernameDebounceTimeout.current);
      }

      usernameDebounceTimeout.current = setTimeout(() => {
        checkUsername(credentials.username.trim());
      }, 500);
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        username: "",
      }));
    }

    if (credentials.organization.trim().length >= 2) {
      if (organizationNameDebounceTimeout.current) {
        clearTimeout(organizationNameDebounceTimeout.current);
      }

      organizationNameDebounceTimeout.current = setTimeout(() => {
        checkOrganizationName(credentials.organization.trim());
      }, 500);
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        organization: "",
      }));
    }

    // Cleanup function
    return () => {};
  }, [credentials.username, credentials.organization]);

  const checkUsername = async (username) => {
    try {
      const data = await checkUsernameAvailability(username); // Assume this is your API call
      if (data.available === 0) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          username: "Username already exists",
        }));
        return false; // Username exists
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          username: "",
        }));
        return true; // Username is available
      }
    } catch (error) {
      console.error("Error checking username:", error.message);
      setErrors((prevErrors) => ({
        ...prevErrors,
        username: "Error validating username. Please try again.",
      }));
      return false; // Default to unavailable on error
    }
  };

  const checkOrganizationName = async (name) => {
    try {
      const data = await checkOrganizationAvailability(name); // Assume this is your API call
      if (data.available === 0) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          organization: "organization name already exists",
        }));
        return false; // Organization exists
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          organization: "",
        }));
        return true; // Organization is available
      }
    } catch (error) {
      console.error("Error checking organization name:", error.message);
      setErrors((prevErrors) => ({
        ...prevErrors,
        organization: "Error validating organization name. Please try again.",
      }));
      return false; // Default to unavailable on error
    }
  };

  useEffect(() => {
    if (
      credentials.email.trim().length > 0 &&
      emailRegex.test(credentials.email.trim())
    ) {
      if (emailDebounceTimeout.current) {
        clearTimeout(emailDebounceTimeout.current);
      }

      emailDebounceTimeout.current = setTimeout(() => {
        checkEmail(credentials.email.trim());
      }, 500);
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "",
      }));
    }

    // Cleanup function
    return () => {};
  }, [credentials.email]);

  const checkEmail = async (email) => {
    try {
      const response = await axios.get(
        `${API_URL}/check-email?email=${encodeURIComponent(email)}`
      );
      if (response.data.available === 0) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "Email already exists",
        }));
        return false; // Email exists
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "",
        }));
        return true; // Email is available
      }
    } catch (error) {
      console.error("Error checking email:", error);
      return false; // Assume email exists if there's an error
    }
  };

  const validate = async () => {
    let newErrors = {}; // Start with an empty object
    let firstErrorField = null;

    if (!credentials.username.trim()) {
      newErrors.username = "Username is required.";
      firstErrorField = firstErrorField || usernameRef;
    } else if (credentials.username.trim().length < 5) {
      newErrors.username = "Username must be at least 5 characters long.";
      firstErrorField = firstErrorField || usernameRef;
    } else if (credentials.username.trim().length > 30) {
      newErrors.username = "Username cannot exceed 30 characters.";
      firstErrorField = firstErrorField || usernameRef;
    } else if (!/^[a-zA-Z0-9!@#$%^&*.?]+$/.test(credentials.username.trim())) {
      newErrors.username =
        "Username must only contain alphanumeric characters and special characters";
      firstErrorField = firstErrorField || usernameRef;
    } else if (credentials.username !== credentials.username.trim()) {
      newErrors.username = "Username cannot have leading or trailing spaces.";
      firstErrorField = firstErrorField || usernameRef;
    } else if (/^\d+$/.test(credentials.username.trim())) {
      newErrors.username = "Username cannot be all digits.";
      firstErrorField = firstErrorField || usernameRef;
    }

    // Check username availability after format validation
    const usernameAvailable = await checkUsername(credentials.username); // Check availability
    if (!usernameAvailable) {
      newErrors.username =
        "Username already exists. Please choose a different username.";
      firstErrorField = firstErrorField || usernameRef;
    }

    if (!credentials.email.trim()) {
      newErrors.email = "Email is required";
      if (!firstErrorField) firstErrorField = emailRef;
    } else if (!emailRegex.test(credentials.email)) {
      newErrors.email = "Email is not valid";
      if (!firstErrorField) firstErrorField = emailRef;
    }

    // Check email availability after format validation
    const emailAvailable = await checkEmail(credentials.email); // Check availability
    if (!emailAvailable) {
      newErrors.email =
        "Email already exists. Please choose a different email.";
      firstErrorField = firstErrorField || emailRef;
    }

    if (!credentials.password) {
      newErrors.password = "Password is required";
      if (!firstErrorField) firstErrorField = passwordRef;
    } else if (credentials.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
      if (!firstErrorField) firstErrorField = passwordRef;
    } else if (/\s/.test(credentials.password)) {
      newErrors.password = "Password must not contain spaces";
      if (!firstErrorField) firstErrorField = passwordRef;
    } else if (!/[A-Z]/.test(credentials.password)) {
      newErrors.password =
        "Password must include at least one uppercase letter.";
      if (!firstErrorField) firstErrorField = passwordRef;
    } else if (!/[a-z]/.test(credentials.password)) {
      newErrors.password =
        "Password must include at least one lowercase letter.";
      if (!firstErrorField) firstErrorField = passwordRef;
    } else if (!/\d/.test(credentials.password)) {
      newErrors.password = "Password must include at least one number.";
      if (!firstErrorField) firstErrorField = passwordRef;
    } else if (!/[@$#!%*?&]/.test(credentials.password)) {
      newErrors.password =
        "Password must include at least one special character.";
      if (!firstErrorField) firstErrorField = passwordRef;
    }

    if (!credentials.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
      if (!firstErrorField) firstErrorField = fullNameRef;
    } else if (!/^[a-zA-Z\s]+$/.test(credentials.fullName.trim())) {
      newErrors.fullName = "Full Name must only contain letters and spaces";
      if (!firstErrorField) firstErrorField = fullNameRef;
    } else if (credentials.fullName.trim().split(/\s+/).length < 2) {
      newErrors.fullName = "Full Name must include first and last name";
      if (!firstErrorField) firstErrorField = fullNameRef;
    }

    if (!credentials.jobTitle.trim()) {
      newErrors.jobTitle = "Job Title is required.";
      if (!firstErrorField) firstErrorField = jobTitleRef;
    } else if (!/^[a-zA-Z\s]+$/.test(credentials.jobTitle.trim())) {
      newErrors.jobTitle = "Job Title must only contain letters and spaces.";
      if (!firstErrorField) firstErrorField = jobTitleRef;
    }

    if (!credentials.organization.trim()) {
      newErrors.organization = "Organization is required";
      if (!firstErrorField) firstErrorField = organizationRef;
    }
    const organizationAvailable = await checkOrganizationName(
      credentials.organization
    );
    if (!organizationAvailable) {
      newErrors.organization =
        "organization name already exists. Please choose a different name.";
      firstErrorField = firstErrorField || organizationRef;
    }

    if (!credentials.organizationEmail.trim()) {
      newErrors.organizationEmail = "Organization Email is required";
      if (!firstErrorField) firstErrorField = organizationEmailRef;
    } else if (!emailRegex.test(credentials.organizationEmail.trim())) {
      newErrors.organizationEmail = "Organization Email is not valid";
      if (!firstErrorField) firstErrorField = organizationEmailRef;
    }

    if (!credentials.addressLine1.trim()) {
      newErrors.addressLine1 = "Address Line 1 is required";
      if (!firstErrorField) firstErrorField = addressLine1Ref;
    }

    if (!credentials.city.trim()) {
      newErrors.city = "City is required";
      if (!firstErrorField) firstErrorField = cityRef;
    } else if (!/^[A-Za-z\s]+$/.test(credentials.city.trim())) {
      newErrors.city = "City name is invalid";
      if (!firstErrorField) firstErrorField = cityRef;
    }

    if (!credentials.state.trim()) {
      newErrors.state = "State is required";
      if (!firstErrorField) firstErrorField = stateRef;
    } else if (!/^[A-Za-z\s]+$/.test(credentials.state.trim())) {
      newErrors.state = "State name is invalid";
      if (!firstErrorField) firstErrorField = stateRef;
    }

    if (!credentials.country.trim()) {
      newErrors.country = "Country is required";
      if (!firstErrorField) firstErrorField = countryRef;
    } else if (!/^[A-Za-z\s]+$/.test(credentials.country.trim())) {
      newErrors.country = "Country name is invalid";
      if (!firstErrorField) firstErrorField = countryRef;
    }

    const postalCodeRegex = /^\d{5,6}$/;
    if (
      !credentials.postalCode ||
      !postalCodeRegex.test(credentials.postalCode.trim())
    ) {
      newErrors.postalCode = "Postal Code must be a valid 5 or 6-digit number.";
      if (!firstErrorField) firstErrorField = postalCodeRef;
    }

    // const usContactRegex =/^(\d{10}|(\(\d{3}\)\s?\d{3}-\d{4})|\d{3}-\d{3}-\d{4})$/;
    const usContactRegex =
      /^(?:\+1[-.\s]?|\+91[-.\s]?|1[-.\s]?|91[-.\s]?)?(?:\(\d{3}\)[-.\s]?|\d{3}[-.\s]?)?\d{3}[-.\s]?\d{4}$/;
    if (!credentials.contactNo.trim()) {
      newErrors.contactNo = "Contact number is required";
      if (!firstErrorField) firstErrorField = contactNoRef;
    } else if (!/^[\d+().-\s]+$/.test(credentials.contactNo.trim())) {
      // Ensures the number contains only valid characters (digits, +, (), -, ., space)
      newErrors.contactNo = "Contact number must contain only valid number";
      if (!firstErrorField) firstErrorField = contactNoRef;
    } else if (credentials.contactNo !== credentials.contactNo.trim()) {
      newErrors.contactNo =
        "Contact number should not have leading or trailing spaces";
      if (!firstErrorField) firstErrorField = contactNoRef;
    } else if (!usContactRegex.test(credentials.contactNo.trim())) {
      newErrors.contactNo = "Contact number must be valid";
      if (!firstErrorField) firstErrorField = contactNoRef;
    }

    if (!isPrivacyChecked) {
      newErrors.privacyAgreement =
        "You must agree to the privacy policy to continue.";
    }

    if (credentials.website && !websiteRegex.test(credentials.website)) {
      newErrors.website = "Website must be valid";
      if (!firstErrorField) firstErrorField = websiteRef;
    }

    if (!isChecked) {
      if (!credentials.authorizedFullName.trim()) {
        newErrors.authorizedFullName = "Authorized Full Name is required.";
        if (!firstErrorField) firstErrorField = authorizedFullNameRef;
      } else if (!/^[a-zA-Z\s]+$/.test(credentials.authorizedFullName.trim())) {
        newErrors.authorizedFullName =
          "Authorized Full Name must only contain letters and spaces.";
        if (!firstErrorField) firstErrorField = authorizedFullNameRef;
      } else if (
        credentials.authorizedFullName.trim().split(/\s+/).length < 2
      ) {
        newErrors.authorizedFullName =
          "Authorized Full Name must include at least a first and last name.";
        if (!firstErrorField) firstErrorField = authorizedFullNameRef;
      }

      if (!credentials.authorizedEmail.trim()) {
        newErrors.authorizedEmail = "Authorized Email is required";
        if (!firstErrorField) firstErrorField = authorizedEmailRef;
      } else if (!emailRegex.test(credentials.authorizedEmail.trim())) {
        newErrors.authorizedEmail = "Authorized Email is not valid";
        if (!firstErrorField) firstErrorField = authorizedEmailRef;
      }

      if (!credentials.authorizedJobTitle.trim()) {
        newErrors.authorizedJobTitle = "Authorized Job Title is required";
        if (!firstErrorField) firstErrorField = authorizedJobTitleRef;
      } else if (!/^[a-zA-Z\s]+$/.test(credentials.authorizedJobTitle.trim())) {
        newErrors.authorizedJobTitle =
          "Authorized Job Title must only contain letters and spaces.";
        if (!firstErrorField) firstErrorField = authorizedJobTitleRef;
      }
    }

    const landlineRegex =
      /^(?:\+?\d{1,3}[-.]?)?(?:\(\d{2,5}\)|\d{2,5})[-.]?\d{3,8}(?:[-.]?\d{3,8})?$/;
    if (credentials.landlineNo?.trim()) {
      const landlineNumber = credentials.landlineNo.trim();
      if (/\s/.test(landlineNumber)) {
        newErrors.landlineNo = "Landline number should not contain spaces";
        if (!firstErrorField) firstErrorField = landlineNoRef;
      } else if (landlineNumber.replace(/\D/g, "").length < 7) {
        newErrors.landlineNo = "Landline number must have at least 7 digits";
        if (!firstErrorField) firstErrorField = landlineNoRef;
      } else if (landlineNumber.replace(/\D/g, "").length > 15) {
        newErrors.landlineNo = "Landline number must not exceed 15 digits";
        if (!firstErrorField) firstErrorField = landlineNoRef;
      } else if (!landlineRegex.test(landlineNumber)) {
        newErrors.landlineNo = "Landline number must be valid";
        if (!firstErrorField) firstErrorField = landlineNoRef;
      }
    }

    if (credentials.extnNo?.trim()) {
      const extnRegex = /^\d{1,5}$/; // 1 to 5 digits allowed
      const extnNumber = credentials.extnNo.trim();
      if (!extnRegex.test(extnNumber)) {
        newErrors.extnNo = "Extension must be a valid number (1 to 5 digits)";
        if (!firstErrorField) firstErrorField = extnNoRef;
      }
    }

    if (firstErrorField && firstErrorField.current) {
      firstErrorField.current.scrollIntoView({ behavior: "smooth" });
    }

    setErrors(newErrors); // Update errors state with current validation results
    return newErrors;
  };

  const onHandleChange = (event) => {
    const { name, value } = event.target;

    if (name === "dob" || name === "authorizedDateofBirth") {
      setCredentials((prevState) => ({
        ...prevState,
        dob: value,
        authorizedDateofBirth: value,
      }));
    } else {
      setCredentials({ ...credentials, [name]: value });
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const handlePrivacyCheckboxChange = (e) => {
    setIsPrivacyChecked(e.target.checked);
  };

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;

    setIsChecked(checked);

    if (checked) {
      setCredentials((prevState) => ({
        ...prevState,
        authorizedFullName: prevState.fullName,
        authorizedEmail: prevState.email,
        authorizedJobTitle: prevState.jobTitle,
      }));
    } else {
      setCredentials((prevState) => ({
        ...prevState,
        authorizedFullName: "",
        authorizedEmail: "",
        authorizedJobTitle: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      toast.error("Please complete the CAPTCHA.");
      return;
    }

    // Validate form data, including asynchronous checks for username and email
    const validationErrors = await validate();
    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please enter proper data to proceed.");
      return;
    }

    const dataToSend = {
      client_username: credentials.username,
      client_email: credentials.email,
      client_full_name: credentials.fullName,
      client_designation: credentials.jobTitle,
      is_authorised_signatory: isChecked,
      client_dob: credentials.dob || null,
      authorised_signatory_full_name: isChecked
        ? credentials.fullName
        : credentials.authorizedFullName,
      authorised_signatory_client_designation: isChecked
        ? credentials.jobTitle
        : credentials.authorizedJobTitle,
      authorised_signatory_email: isChecked
        ? credentials.email
        : credentials.authorizedEmail,
      authorised_signatory_dob: isChecked
        ? credentials.dob || null
        : credentials.authorizedDateofBirth || null,

      organization_name: credentials.organization,
      organization_email: credentials.organizationEmail,
      address_line1: credentials.addressLine1,
      address_line2: credentials.addressLine2 || null,
      postal_code: credentials.postalCode,
      country: credentials.country,
      state: credentials.state,
      city: credentials.city,
      contact_number: credentials.contactNo,
      website: credentials.website || null,
      landline_no: credentials.landlineNo || null,
      extension_no: credentials.extnNo || null,

      activation_code: credentials.activationCode || null,
      referred_by: credentials.RefBy || null,

      privacyChecked: isPrivacyChecked,

      client_password: credentials.password,
      captcha_token: captchaToken || null,
    };

    // console.log("register page detail=>", dataToSend);
    try {
      setIsLoading(true);
      // Make the registration API call
      const response = await register(dataToSend);

      // Stop loading indicator
      setIsLoading(false);
      // Handle response based on status code
      if (response.status === 200) {
        // Registration successful, navigate to verification page
        navigate("/verifyemail");
      } else if (response.status === 400) {
        // Bad Request - Display user-friendly error message
        toast.error(`Invalid input. Please check your details and try again. ${response.data.message || ""}`);
      } else if (response.status === 500) {
        // Internal Server Error
        toast.error("Server error. Please try again later.");
      } else {
        // Handle other unexpected status codes
        toast.error("Unexpected error. Please try again.");
      }
    } catch (error) {
      // General error or unexpected issue
      toast.error("An error occurred. Please try again.");
      // }
    }
  };

  return (
    <React.Fragment>
      <>
        <div className="container-fluid height">
          <div className="row">
            <div className="registration scroll-container">
              <div className="pt-12 d-flex flex-center flex-column flex-column-fluid scroll-container-scroller">
                <div className="registration-box" data-spy="scroll">
                  <div className="p-2 p-lg-5 mx-auto">
                    <form
                      className="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
                      onSubmit={handleSubmit}
                    >
                      <div className="mb-5 text-center">
                        <h2 className="text-gray-900 mb-2">
                          Create an Account
                        </h2>
                        <div className="text-gray-500 fw-semibold fs-7">
                          Already have an account?
                          <Link
                            to="/login"
                            className="link-primary fw-bold ms-1"
                          >
                            Sign in here
                          </Link>
                        </div>
                      </div>

                      <div
                        className="alert alert-dark"
                        style={{ width: "100%" }}
                      >
                        <div className="fv-row mb-5 fv-plugins-icon-container">
                          <p
                            className="alert alert-dark bg-primary"
                            style={{
                              background: "#30a6b6",
                              color: "white",
                              padding: "6px",
                              height: "36px",
                              fontSize: "13px",
                            }}
                          >
                            Account Information
                          </p>
                        </div>

                        <div className="row g-3 fv-row mb-5">
                          <div className="col-md-6 col-12">
                            <label
                              className="form-label fw-bold"
                              style={{ color: "#0098CA", fontSize: "12px" }}
                            >
                              User Name{" "}
                              <span style={{ color: "red", fontSize: "12px" }}>
                                *
                              </span>
                            </label>
                            <input
                              placeholder="Enter User Name"
                              className="form-control"
                              type="text"
                              name="username"
                              required
                              value={credentials.username}
                              onChange={onHandleChange}
                              autoComplete="off"
                              ref={usernameRef}
                              style={{
                                backgroundColor: "#d0ebfd",
                                borderColor: "#9dc7e3",
                                color: "#1F1F1F",
                                fontSize: "10px",
                                height: "30px",
                              }}
                            />
                            {errors.username && (
                              <p
                                style={{
                                  color: "red",
                                  fontSize: "10px",
                                  marginTop: "1px",
                                }}
                              >
                                {errors.username}
                              </p>
                            )}
                          </div>
                          <div className="col-md-6 col-12">
                            <label
                              className="form-label fw-bold"
                              style={{ color: "#0098CA", fontSize: "12px" }}
                            >
                              E-mail Address{" "}
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              placeholder="Enter Email"
                              className="form-control"
                              type="email"
                              name="email"
                              title="A valid e-mail address. All e-mails from the system will be sent to this address."
                              value={credentials.email}
                              onChange={onHandleChange}
                              required
                              autoComplete="off"
                              ref={emailRef}
                              style={{
                                backgroundColor: "#d0ebfd",
                                borderColor: "#9dc7e3",
                                color: "#1F1F1F",
                                fontSize: "10px",
                                height: "30px",
                                borderRadius: "5px",
                              }}
                            />
                            {errors.email && (
                              <p
                                style={{
                                  color: "red",
                                  fontSize: "10px",
                                  marginTop: "1px",
                                }}
                              >
                                {errors.email}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="row g-3 fv-row mb-5">
                          <div className="col-md-6 col-12">
                            <label
                              className="form-label fw-bold"
                              style={{ color: "#0098CA", fontSize: "12px" }}
                            >
                              Full Name <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              placeholder="Enter Full Name"
                              type="text"
                              name="fullName"
                              className="form-control"
                              value={credentials.fullName}
                              onChange={onHandleChange}
                              ref={fullNameRef}
                              required
                              autoComplete="off"
                              style={{
                                backgroundColor: "#d0ebfd",
                                borderColor: "#9dc7e3",
                                color: "#1F1F1F",
                                fontSize: "10px",
                                height: "30px",
                              }}
                            />
                            {errors.fullName && (
                              <p
                                style={{
                                  color: "red",
                                  fontSize: "10px",
                                  marginTop: "1px",
                                }}
                              >
                                {errors.fullName}
                              </p>
                            )}
                          </div>
                          <div className="col-md-6 col-12">
                            <label
                              className="form-label fw-bold"
                              style={{ color: "#0098CA", fontSize: "12px" }}
                            >
                              Job Title <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              placeholder="Enter Job Title"
                              className="form-control"
                              type="text"
                              name="jobTitle"
                              required
                              value={credentials.jobTitle}
                              onChange={onHandleChange}
                              ref={jobTitleRef}
                              autoComplete="off"
                              style={{
                                backgroundColor: "#d0ebfd",
                                borderColor: "#9dc7e3",
                                color: "#1F1F1F",
                                fontSize: "10px",
                                height: "30px",
                              }}
                            />
                            {errors.jobTitle && (
                              <p
                                style={{
                                  color: "red",
                                  fontSize: "10px",
                                  marginTop: "1px",
                                }}
                              >
                                {errors.jobTitle}
                              </p>
                            )}
                          </div>
                        </div>

                        {isChecked && (
                          <>
                            <div className="row g-3 fv-row mb-5">
                              <div className="col-md-6 col-12">
                                <label
                                  className="form-label fw-bold"
                                  style={{
                                    color: "#0098CA",
                                    fontSize: "12px",
                                  }}
                                >
                                  Date of Birth
                                </label>
                                <input
                                  placeholder="DD-MM-YYYY"
                                  type="date"
                                  name="dob"
                                  ref={dobRef}
                                  className="form-control"
                                  value={credentials.dob}
                                  onChange={onHandleChange}
                                  style={{
                                    backgroundColor: "#d0ebfd",
                                    borderColor: "#9dc7e3",
                                    fontSize: "10px",
                                    height: "30px",
                                    borderRadius: "5px",
                                  }}
                                />
                                {errors.dob && (
                                  <p
                                    style={{
                                      color: "red",
                                      fontSize: "10px",
                                      marginTop: "1px",
                                    }}
                                  >
                                    {errors.dob}
                                  </p>
                                )}
                              </div>
                            </div>
                          </>
                        )}

                        <div className="fv-row mb-5 fv-plugins-icon-container">
                          <label className="form-check form-check-custom form-check-inline">
                            <input
                              className="form-check-input custom-checkbox inputbox"
                              type="checkbox"
                              name="toc"
                              style={{
                                borderColor: "#9dc7e3",
                                color: "#1F1F1F",
                                fontSize: "12px",
                              }}
                              onChange={handleCheckboxChange}
                              checked={isChecked}
                            />
                            <span className="form-check-label fw-semibold text-gray-700 fs-7">
                              I am an Authorized Signatory{" "}
                            </span>
                          </label>
                        </div>

                        {!isChecked && (
                          <>
                            <div className="row g-3 fv-row mb-5">
                              <div className="col-md-6 col-12">
                                <label
                                  className="form-label fw-bold"
                                  style={{
                                    color: "#0098CA",
                                    fontSize: "12px",
                                  }}
                                >
                                  Authorized Signatory Full Name{" "}
                                  <span style={{ color: "red" }}>*</span>
                                </label>
                                <input
                                  placeholder="Enter Authorized Full Name"
                                  className="form-control"
                                  required
                                  name="authorizedFullName"
                                  value={credentials.authorizedFullName}
                                  onChange={onHandleChange}
                                  ref={authorizedFullNameRef}
                                  style={{
                                    backgroundColor: "#d0ebfd",
                                    borderColor: "#9dc7e3",
                                    fontSize: "10px",
                                    height: "30px",
                                    borderRadius: "5px",
                                  }}
                                />
                                {errors.authorizedFullName && (
                                  <p
                                    style={{
                                      color: "red",
                                      fontSize: "10px",
                                      marginTop: "1px",
                                    }}
                                  >
                                    {errors.authorizedFullName}
                                  </p>
                                )}
                              </div>
                              <div className="col-md-6 col-12">
                                <label
                                  className="form-label fw-bold"
                                  style={{
                                    color: "#0098CA",
                                    fontSize: "12px",
                                  }}
                                >
                                  Authorized Signatory Email{" "}
                                  <span
                                    style={{ color: "red", fontSize: "10px" }}
                                  >
                                    *
                                  </span>
                                </label>
                                <input
                                  placeholder="Enter Authorized Email"
                                  className="form-control"
                                  required
                                  name="authorizedEmail"
                                  value={credentials.authorizedEmail}
                                  onChange={onHandleChange}
                                  ref={authorizedEmailRef}
                                  style={{
                                    backgroundColor: "#d0ebfd",
                                    borderColor: "#9dc7e3",
                                    fontSize: "10px",
                                    height: "30px",
                                    borderRadius: "5px",
                                  }}
                                />
                                {errors.authorizedEmail && (
                                  <p style={{ color: "red", fontSize: "10px" }}>
                                    {errors.authorizedEmail}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="row g-3 fv-row mb-5">
                              <div className="col-md-6 col-12">
                                <label
                                  className="form-label fw-bold"
                                  style={{
                                    color: "#0098CA",
                                    fontSize: "12px",
                                  }}
                                >
                                  Authorized Signatory Job Title{" "}
                                  <span style={{ color: "red" }}>*</span>
                                </label>
                                <input
                                  placeholder="Enter Authorized Job Title"
                                  className="form-control"
                                  name="authorizedJobTitle"
                                  required
                                  value={credentials.authorizedJobTitle}
                                  onChange={onHandleChange}
                                  ref={authorizedJobTitleRef}
                                  style={{
                                    backgroundColor: "#d0ebfd",
                                    borderColor: "#9dc7e3",
                                    fontSize: "10px",
                                    height: "30px",
                                    borderRadius: "5px",
                                  }}
                                />
                                {errors.authorizedJobTitle && (
                                  <p
                                    style={{
                                      color: "red",
                                      fontSize: "10px",
                                      marginTop: "1px",
                                    }}
                                  >
                                    {errors.authorizedJobTitle}
                                  </p>
                                )}
                              </div>

                              <div className="col-md-6 col-12">
                                <label
                                  className="form-label fw-bold"
                                  style={{
                                    color: "#0098CA",
                                    fontSize: "12px",
                                  }}
                                >
                                  Authorized Signatory Date of Birth
                                </label>
                                <input
                                  placeholder="DD-MM-YYYY"
                                  type="date"
                                  name="authorizedDateofBirth"
                                  ref={authorizedDobRef}
                                  className="form-control"
                                  value={credentials.authorizedDateofBirth}
                                  onChange={onHandleChange}
                                  style={{
                                    backgroundColor: "#d0ebfd",
                                    borderColor: "#9dc7e3",
                                    fontSize: "10px",
                                    height: "30px",
                                    borderRadius: "5px",
                                  }}
                                />
                                {errors.authorizedDateofBirth && (
                                  <p
                                    style={{
                                      color: "red",
                                      fontSize: "10px",
                                      marginTop: "1px",
                                    }}
                                  >
                                    {errors.authorizedDateofBirth}
                                  </p>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="alert alert-dark fv-row mb-10">
                        <div className="fv-row mb-5 fv-plugins-icon-container">
                          <p
                            className="alert alert-dark bg-primary heading"
                            style={{
                              background: "#30a6b6",
                              color: "white",
                              padding: "6px",
                              height: "36px",
                              fontSize: "13px",
                            }}
                          >
                            Organization Details
                          </p>
                        </div>
                        <div className="row fv-row mb-5 fv-plugins-icon-container">
                          <div className="col-xl-12">
                            <label
                              className="form-label fw-bold"
                              style={{ color: "#0098CA", fontSize: "12px" }}
                            >
                              Organization/Firm{" "}
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              placeholder="Enter Organization/Firm"
                              className="form-control"
                              type="text"
                              name="organization"
                              required
                              value={credentials.organization}
                              ref={organizationRef}
                              onChange={onHandleChange}
                              autoComplete="off"
                              style={{
                                backgroundColor: "#d0ebfd",
                                borderColor: "#9dc7e3",
                                color: "#1F1F1F",
                                fontSize: "10px",
                                height: "30px",
                                borderRadius: "5px",
                              }}
                            />
                            {errors.organization && (
                              <p
                                style={{
                                  color: "red",
                                  fontSize: "10px",
                                  marginTop: "1px",
                                }}
                              >
                                {errors.organization}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="row fv-row mb-5 fv-plugins-icon-container">
                          <div className="col-xl-12">
                            <label
                              className="form-label fw-bold"
                              style={{ color: "#0098CA", fontSize: "12px" }}
                            >
                              Organization Email{" "}
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              placeholder="Enter Organization Email"
                              className="form-control"
                              type="email"
                              name="organizationEmail"
                              required
                              value={credentials.organizationEmail}
                              onChange={onHandleChange}
                              ref={organizationEmailRef}
                              autoComplete="off"
                              style={{
                                backgroundColor: "#d0ebfd",
                                borderColor: "#9dc7e3",
                                color: "#1F1F1F",
                                fontSize: "10px",
                                height: "30px",
                                borderRadius: "5px",
                              }}
                            />
                            {errors.organizationEmail && (
                              <p
                                style={{
                                  color: "red",
                                  fontSize: "10px",
                                  marginTop: "1px",
                                }}
                              >
                                {errors.organizationEmail}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="row g-3 fv-row mb-5">
                          <div className="col-xl-6">
                            <label
                              className="form-label fw-bold"
                              style={{ color: "#0098CA", fontSize: "12px" }}
                            >
                              Address Line 1{" "}
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              placeholder="Enter Address Line 1"
                              className="form-control"
                              type="text"
                              name="addressLine1"
                              value={credentials.addressLine1}
                              onChange={onHandleChange}
                              autoComplete="off"
                              ref={addressLine1Ref}
                              required
                              style={{
                                backgroundColor: "#d0ebfd",
                                borderColor: "#9dc7e3",
                                color: "#1F1F1F",
                                fontSize: "10px",
                                height: "30px",
                              }}
                            />
                            {errors.addressLine1 && (
                              <p
                                style={{
                                  color: "red",
                                  fontSize: "10px",
                                  marginTop: "1px",
                                }}
                              >
                                {errors.addressLine1}
                              </p>
                            )}
                          </div>
                          <div className="col-xl-6">
                            <label
                              className="form-label fw-bold"
                              style={{ color: "#0098CA", fontSize: "12px" }}
                            >
                              Address Line 2{" "}
                            </label>
                            <input
                              placeholder="Enter Address Line 2"
                              className="form-control"
                              type="text"
                              name="addressLine2"
                              value={credentials.addressLine2}
                              onChange={onHandleChange}
                              autoComplete="off"
                              ref={addressLine2Ref}
                              style={{
                                backgroundColor: "#d0ebfd",
                                borderColor: "#9dc7e3",
                                color: "#1F1F1F",
                                fontSize: "10px",
                                height: "30px",
                              }}
                            />
                          </div>
                        </div>

                        <div className="row g-3 fv-row mb-5">
                          <div className="col-md-6 col-12">
                            <label
                              className="form-label fw-bold"
                              style={{ color: "#0098CA", fontSize: "12px" }}
                            >
                              Postal Code{" "}
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              placeholder="Enter Postal Code"
                              className="form-control"
                              type="text"
                              name="postalCode"
                              required
                              value={credentials.postalCode}
                              onChange={onHandleChange}
                              ref={postalCodeRef}
                              autoComplete="off"
                              style={{
                                backgroundColor: "#d0ebfd",
                                borderColor: "#9dc7e3",
                                color: "#1F1F1F",
                                fontSize: "10px",
                                height: "30px",
                              }}
                            />
                            {errors.postalCode && (
                              <p
                                style={{
                                  color: "red",
                                  fontSize: "10px",
                                  marginTop: "1px",
                                }}
                              >
                                {errors.postalCode}
                              </p>
                            )}
                          </div>

                          <div className="col-md-6 col-12">
                            <label
                              className="form-label fw-bold"
                              style={{ color: "#0098CA", fontSize: "12px" }}
                            >
                              Country <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              placeholder="Enter Country"
                              className="form-control"
                              type="text"
                              name="country"
                              required
                              value={credentials.country}
                              onChange={onHandleChange}
                              ref={countryRef}
                              autoComplete="off"
                              style={{
                                backgroundColor: "#d0ebfd",
                                borderColor: "#9dc7e3",
                                color: "#1F1F1F",
                                fontSize: "10px",
                                height: "30px",
                              }}
                            />
                            {errors.country && (
                              <p style={{ color: "red", fontSize: "10px" }}>
                                {errors.country}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="row g-3 fv-row mb-5">
                          <div className="col-md-6 col-12">
                            <label
                              className="form-label fw-bold"
                              style={{ color: "#0098CA", fontSize: "12px" }}
                            >
                              State <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              placeholder="Enter State"
                              className="form-control"
                              type="text"
                              name="state"
                              required
                              value={credentials.state}
                              onChange={onHandleChange}
                              ref={stateRef}
                              autoComplete="off"
                              style={{
                                backgroundColor: "#d0ebfd",
                                borderColor: "#9dc7e3",
                                color: "#1F1F1F",
                                fontSize: "10px",
                                height: "30px",
                              }}
                            />
                            {errors.state && (
                              <p style={{ color: "red", fontSize: "10px" }}>
                                {errors.state}
                              </p>
                            )}
                          </div>

                          <div className="col-md-6 col-12">
                            <label
                              className="form-label fw-bold"
                              style={{ color: "#0098CA", fontSize: "12px" }}
                            >
                              City <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              placeholder="Enter City"
                              className="form-control"
                              type="text"
                              name="city"
                              required
                              value={credentials.city}
                              onChange={onHandleChange}
                              autoComplete="off"
                              ref={cityRef}
                              style={{
                                backgroundColor: "#d0ebfd",
                                borderColor: "#9dc7e3",
                                color: "#1F1F1F",
                                fontSize: "10px",
                                height: "30px",
                              }}
                            />
                            {errors.city && (
                              <p style={{ color: "red", fontSize: "10px" }}>
                                {errors.city}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="row g-3 fv-row mb-5">
                          <div className="col-md-6 col-12">
                            <label
                              className="form-label fw-bold"
                              style={{ color: "#0098CA", fontSize: "12px" }}
                            >
                              Contact No <span style={{ color: "red" }}>*</span>
                            </label>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                              }}
                            >
                              <input
                                placeholder="Enter Contact No."
                                className="form-control"
                                type="text"
                                name="contactNo"
                                required
                                value={credentials.contactNo}
                                onChange={onHandleChange}
                                ref={contactNoRef}
                                autoComplete="off"
                                style={{
                                  flex: "1",
                                  backgroundColor: "#d0ebfd",
                                  borderColor: "#9dc7e3",
                                  color: "#1F1F1F",
                                  fontSize: "12px",
                                  height: "30px",
                                }}
                              />
                            </div>
                            {errors.contactNo && (
                              <p style={{ color: "red", fontSize: "10px" }}>
                                {errors.contactNo}
                              </p>
                            )}
                          </div>

                          <div className="col-md-6 col-12">
                            <label
                              className="form-label fw-bold"
                              style={{ color: "#0098CA", fontSize: "12px" }}
                            >
                              Website
                            </label>
                            <input
                              placeholder="Enter Website"
                              className="form-control"
                              type="text"
                              name="website"
                              value={credentials.website}
                              onChange={onHandleChange}
                              autoComplete="off"
                              ref={websiteRef}
                              style={{
                                backgroundColor: "#d0ebfd",
                                borderColor: "#9dc7e3",
                                color: "#1F1F1F",
                                fontSize: "10px",
                                height: "30px",
                              }}
                            />
                            {errors.website && (
                              <p style={{ color: "red", fontSize: "10px" }}>
                                {errors.website}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="row g-3 fv-row mb-5">
                          <div className="col-md-6 col-12">
                            <label
                              htmlFor="landlineNo"
                              className="form-label fw-bold"
                              style={{ color: "#0098CA", fontSize: "12px" }}
                            >
                              Landline No
                            </label>
                            <div className="d-flex align-items-center gap-2">
                              <input
                                id="landlineNo"
                                placeholder="Enter Landline No."
                                className="form-control"
                                type="text"
                                name="landlineNo"
                                value={credentials.landlineNo}
                                onChange={onHandleChange}
                                ref={landlineNoRef}
                                autoComplete="off"
                                style={{
                                  backgroundColor: "#d0ebfd",
                                  borderColor: "#9dc7e3",
                                  color: "#1F1F1F",
                                  fontSize: "12px",
                                  height: "35px",
                                }}
                              />
                            </div>
                            {errors.landlineNo && (
                              <p style={{ color: "red", fontSize: "10px" }}>
                                {errors.landlineNo}
                              </p>
                            )}
                          </div>

                          <div className="col-md-6 col-12">
                            <label
                              htmlFor="extnNo"
                              className="form-label fw-bold"
                              style={{ color: "#0098CA", fontSize: "12px" }}
                            >
                              Extn.
                            </label>
                            <div className="d-flex align-items-center gap-2">
                              <input
                                id="extnNo"
                                placeholder="Extn."
                                className="form-control"
                                type="text"
                                name="extnNo"
                                value={credentials.extnNo}
                                onChange={onHandleChange}
                                ref={extnNoRef}
                                autoComplete="off"
                                style={{
                                  backgroundColor: "#d0ebfd",
                                  borderColor: "#9dc7e3",
                                  color: "#1F1F1F",
                                  fontSize: "12px",
                                  height: "35px",
                                }}
                              />
                            </div>
                            {errors.extnNo && (
                              <p style={{ color: "red", fontSize: "10px" }}>
                                {errors.extnNo}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="alert alert-dark">
                        {/* <div className="fv-row mb-5 fv-plugins-icon-container">
                          <p
                            className="alert alert-dark bg-primary"
                            style={{
                              background: "#30a6b6",
                              color: "white",
                              padding: "6px",
                              height: "36px",
                              fontSize: "13px",
                            }}
                          >
                            Activation Code&nbsp;/ Promo Code /&nbsp;Referred By
                          </p>
                        </div> */}
                        <div className="fv-row mb-5 fv-plugins-icon-container activation-code-section">
                          <p className="alert alert-dark bg-primary">
                            Activation Code&nbsp;/ Promo Code /&nbsp;Referred By
                          </p>
                        </div>

                        <div className="row g-3 fv-row mb-5">
                          <div className="col-xl-6">
                            <label
                              className="form-label fw-bold"
                              style={{ color: "#0098CA", fontSize: "12px" }}
                            >
                              Activation Code / Promo Code
                            </label>
                            <input
                              placeholder="Enter Code"
                              className="form-control "
                              type="text"
                              name="activationCode"
                              value={credentials.activationCode}
                              onChange={onHandleChange}
                              autoComplete="off"
                              ref={activationCodeRef}
                              style={{
                                backgroundColor: "#d0ebfd",
                                borderColor: "#9dc7e3",
                                color: "#1F1F1F",
                                fontSize: "10px",
                                height: "30px",
                              }}
                            />
                          </div>
                          <div className="col-xl-6">
                            <label
                              className="form-label fw-bold"
                              style={{ color: "#0098CA", fontSize: "12px" }}
                            >
                              Referred By
                            </label>
                            <input
                              placeholder="Referred By"
                              className="form-control "
                              type="text"
                              name="RefBy"
                              value={credentials.RefBy}
                              onChange={onHandleChange}
                              autoComplete="off"
                              ref={refByRef}
                              style={{
                                backgroundColor: "#d0ebfd",
                                borderColor: "#9dc7e3",
                                color: "#1F1F1F",
                                fontSize: "10px",
                                height: "30px",
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div
                        className="alert alert-dark"
                        title="By agreeing, you consent to Neural IT's collection, storage, and processing of the personal information you have submitted. This information will be used solely to provide the content you have requested."
                      >
                        <div className="fv-row mb-5 fv-plugins-icon-container">
                          <p
                            className="alert alert-dark bg-primary"
                            style={{
                              background: "#30a6b6",
                              color: "white",
                              padding: "6px",
                              height: "36px",
                              fontSize: "13px",
                            }}
                          >
                            Privacy
                          </p>
                        </div>
                        <div className="fv-row mb-4 fv-plugins-icon-container">
                          <label className="form-check form-check-custom form-check-solid form-check-inline form-check-sm">
                            <input
                              className="form-check-input custom-checkbox inputbox form-check-sm"
                              type="checkbox"
                              name="privacyAgreement"
                              required
                              onChange={handlePrivacyCheckboxChange}
                              checked={isPrivacyChecked}
                              style={{
                                border: "1px solid black",
                              }}
                            />

                            <span className="form-check-label fw-semibold text-gray-700 privacy-section">
                              I agree to receive communications from Neural IT{" "}
                              <span style={{ color: "red" }}>*</span>
                              <br />
                              By agreeing, you consent to allow Neural IT to
                              store and process the personal information
                              submitted above to provide you with the content
                              requested.
                            </span>
                          </label>
                          {errors.privacyAgreement && (
                            <p
                              style={{
                                color: "red",
                                fontSize: "10px",
                                marginTop: "1px",
                              }}
                            >
                              {errors.privacyAgreement}
                            </p>
                          )}
                        </div>
                      </div>

                      <div
                        className="mb-8 fv-row fv-plugins-icon-container"
                        data-nit-password-meter="true"
                      >
                        <div className="mb-1">
                          <label
                            className="form-label fw-bold"
                            style={{ color: "#0098CA", fontSize: "12px" }}
                          >
                            Create Password{" "}
                            <span style={{ color: "red" }}>*</span>
                          </label>
                          <div
                            className="position-relative mb-1"
                            style={{
                              height: "40px",
                            }}
                          >
                            <input
                              placeholder="Create Password"
                              className="form-control"
                              type={showPassword ? "text" : "password"}
                              name="password"
                              value={credentials.password}
                              onChange={onHandleChange}
                              required="required"
                              autoComplete="off"
                              ref={passwordRef}
                              style={{
                                backgroundColor: "#d0ebfd",
                                borderColor: "#9dc7e3",
                                color: "#1F1F1F",
                                fontSize: "12px",
                                height: "100%",
                                paddingRight: "45px",
                              }}
                            />
                            <span
                              className="position-absolute"
                              onClick={toggleShowPassword}
                              style={{
                                cursor: "pointer",
                                backgroundColor: "transparent",
                                border: "none",
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                zIndex: 1,
                                padding: "5px",
                              }}
                            >
                              {showPassword ? (
                                <Visibility
                                  style={{
                                    fontSize: "20px",
                                    color: "#0098CA",
                                  }}
                                />
                              ) : (
                                <VisibilityOff
                                  style={{
                                    fontSize: "20px",
                                    color: "#0098CA",
                                  }}
                                />
                              )}
                            </span>
                          </div>
                          <div
                            className="pt-1 passwordtext"
                            style={{
                              color: "#0098CA",
                              // marginBottom: "5px",
                            }}
                          >
                            <b>
                              Use 8 or more characters with a mix of letters,
                              numbers & symbols.
                            </b>
                          </div>
                          {errors.password && (
                            <p
                              style={{
                                color: "red",
                                fontSize: "10px",
                                marginTop: "5px",
                              }}
                            >
                              {errors.password}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mb-3">
                        <ReCAPTCHA
                          sitekey={VITE_RECAPTCHA_KEY}
                          onChange={handleCaptcha}
                        />
                      </div>

                      <div className="text-center pt-5">
                        <button
                          type="submit"
                          id="nit_sign_up_submit"
                          className="sign_up_submit"
                          style={{
                            display: "inline-block",
                            margin: "0 auto",
                          }}
                          disabled={isLoading}
                        >
                          <span
                            className="indicator-label"
                            style={{ color: "#FFFFFF" }}
                          >
                            <b>
                              {isLoading
                                ? "Submitting..."
                                : "Create new account"}
                            </b>
                          </span>
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="d-flex flex-center flex-wrap fs-6 p-5 ">
                    <div className="d-flex flex-center fw-semibold fs-6">
                      <a
                        href="https://www.neuralit.com/about-us"
                        className="text-hover-primary px-2 linkclr"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        About
                      </a>
                      <a
                        href="https://www.neuralit.com/terms-of-use"
                        className="linkclr text-hover-primary px-2"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Terms of Use
                      </a>
                      <a
                        href="https://www.neuralit.com/privacy-statement"
                        className="linkclr text-hover-primary px-2"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Privacy Statement
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Toaster />
      </>
    </React.Fragment>
  );
};

export default Register;

import React, { useState, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";
import Loader from "../Loader/Loader";
import { GlobalError } from "../global_error/GlobalError";
import { ResetPassword } from "./ResetPassword";
import userProfile from "../../assets/media/users/user-profile.jpg";
import axios from "axios";

const Profile = () => {
  const API_URL =
    import.meta.env.VITE_BASE_URL + ":" + import.meta.env.VITE_BASE_PORT;
  const { getUserDetails, updateUserDetails } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isProfileImageUpdated, setIsProfileImageUpdated] = useState(false);

  const [userDetails, setUserDetails] = useState({
    username: "",
    full_name: "",
    email: "",
    contact_no: "",
    address_line1: "",
    country: "",
    state: "",
    city: "",
    postal_code: "",
  });

  const [profileImage, setProfileImage] = useState(userProfile);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialUserDetails, setInitialUserDetails] = useState({});
  const [errors, setErrors] = useState({});
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // const emailDebounceTimeout = useRef(null);

  const UserID = JSON.parse(sessionStorage.getItem("user_id")) || {};
  const profileImageUrl = `${API_URL}/user/profile-image/${UserID.custom_id}`;

  const checkEmail = async (email) => {
    try {
      const response = await axios.get(
        `${API_URL}/check-email?email=${encodeURIComponent(email)}`
      );
      if (response.data.available === 0) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "Email already exists.",
        }));
        return false;
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
        return true;
      }
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  };

  const validate = async () => {
    const validationErrors = {};
    const postalCodeRegex = /^\d{5,6}$/;
    const usContactRegex =
      /^(?:\+1[-.\s]?|\+91[-.\s]?|1[-.\s]?|91[-.\s]?)?(?:\(\d{3}\)[-.\s]?|\d{3}[-.\s]?)?\d{3}[-.\s]?\d{4}$/;

    if (!userDetails.full_name.trim()) {
      validationErrors.full_name = "Full name is required.";
    } else if (!/^[a-zA-Z\s]+$/.test(userDetails.full_name.trim())) {
      validationErrors.full_name =
        "Full name must only contain letters and spaces.";
    } else if (userDetails.full_name.trim().split(/\s+/).length < 2) {
      validationErrors.full_name =
        "Full name must include first and last name.";
    }

    // if (!userDetails.email.trim()) {
    //   validationErrors.email = "Email is required.";
    // } else if (!emailRegex.test(userDetails.email.trim())) {
    //   validationErrors.email = "Invalid email format.";
    // } else {
    //   const emailAvailable = await checkEmail(userDetails.email.trim());
    //   if (!emailAvailable) {
    //     validationErrors.email =
    //       "Email already exists. Please choose a different email.";
    //   }
    // }

    // Validate email only if it has been changed
    if (
      userDetails.email.trim() !== initialUserDetails.email?.trim() // Compare with the original email
    ) {
      if (!userDetails.email.trim()) {
        validationErrors.email = "Email is required.";
      } else if (!emailRegex.test(userDetails.email.trim())) {
        validationErrors.email = "Invalid email format.";
      } else {
        const emailAvailable = await checkEmail(userDetails.email.trim());
        if (!emailAvailable) {
          validationErrors.email =
            "Email already exists. Please choose a different email.";
        }
      }
    }

    if (!userDetails.contact_no.trim()) {
      validationErrors.contact_no = "Contact number is required.";
    } else if (!/^[\d+().-\s]+$/.test(userDetails.contact_no.trim())) {
      validationErrors.contact_no =
        "Contact number must contain only valid number.";
    } else if (!usContactRegex.test(userDetails.contact_no.trim())) {
      validationErrors.contact_no = "Contact number must be valid.";
    }

    if (!userDetails.address_line1.trim()) {
      validationErrors.address_line1 = "Address Line 1 is required.";
    }

    if (!userDetails.city.trim()) {
      validationErrors.city = "City is required.";
    } else if (!/^[A-Za-z\s]+$/.test(userDetails.city.trim())) {
      validationErrors.city = "City name is invalid.";
    }

    if (!userDetails.state.trim()) {
      validationErrors.state = "State is required.";
    } else if (!/^[A-Za-z\s]+$/.test(userDetails.state.trim())) {
      validationErrors.state = "State name is invalid.";
    }

    if (!userDetails.country.trim()) {
      validationErrors.country = "Country is required.";
    } else if (!/^[A-Za-z\s]+$/.test(userDetails.country.trim())) {
      validationErrors.country = "Country name is invalid.";
    }

    if (!userDetails.postal_code.trim()) {
      validationErrors.postal_code = "Postal code is required.";
    } else if (!postalCodeRegex.test(userDetails.postal_code.trim())) {
      validationErrors.postal_code =
        "Postal code must be a valid 5 or 6-digit number.";
    }

    setErrors(validationErrors);
    return validationErrors;
  };

  // const toggleEdit = async () => {
  //   if (isEditing) {
  //     const validationErrors = await validate();

  //     if (Object.keys(validationErrors).length > 0) {
  //       toast.error("Please correct the errors.");
  //       return;
  //     }

  //     const updatedData = {};
  //     for (const key in userDetails) {
  //       if (userDetails[key]?.toString() !== initialUserDetails[key]?.toString()) {
  //         updatedData[key] = userDetails[key];
  //       }
  //     }

  //     console.log("hii");
  //     if (isProfileImageUpdated) {
  //       updatedData.profile_image = profileImage;
  //     }

  //     // Check if there are any changes to save
  //     if (Object.keys(updatedData).length === 0) {
  //       // toast("Oops! Nothing has been changed.");
  //       setIsEditing(false);
  //       return;
  //     }

  //     try {
  //       const formData = new FormData();
  //       for (const key in updatedData) {
  //         formData.append(key, updatedData[key]);
  //       }

  //       const response = await updateUserDetails(formData);
  //       toast.success(response.message || "Profile updated successfully.");
  //       setInitialUserDetails(userDetails); // Update the reference data
  //       setIsProfileImageUpdated(false);
  //     } catch (err) {
  //       console.error("Error saving profile:", err);
  //       toast.error(err.response?.data?.message || "Failed to update profile.");
  //     }
  //   }
  //   setIsEditing(!isEditing);
  // };


  const toggleEdit = async () => {
    if (isEditing) {
      const validationErrors = await validate();

      if (Object.keys(validationErrors).length > 0) {
        // toast.error("Please correct the errors.");
        return;
      }

      const updatedData = {};
      for (const key in userDetails) {
        if (userDetails[key]?.toString() !== initialUserDetails[key]?.toString()) {
          updatedData[key] = userDetails[key];
        }
      }

      if (isProfileImageUpdated) {
        updatedData.profile_image = profileImage;
      }

      if (Object.keys(updatedData).length === 0) {
        setIsEditing(false);
        return;
      }

      try {
        const formData = new FormData();
        for (const key in updatedData) {
          formData.append(key, updatedData[key]);
        }

        const response = await updateUserDetails(formData);
        toast.success(response.message || "Profile updated successfully.");
        setInitialUserDetails(userDetails);
        setIsProfileImageUpdated(false);
      } catch (err) {
        console.error("Error saving profile:", err);
        toast.error(err.response?.data?.message || "Failed to update profile.");
      }
    }
    setIsEditing(!isEditing);
  };




  const togglePasswordModal = () => setShowPasswordModal(!showPasswordModal);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setIsProfileImageUpdated(true);
      const previewUrl = URL.createObjectURL(file);
      document.getElementById("profile-img").src = previewUrl;
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const details = await getUserDetails();
        setUserDetails(details);
        setInitialUserDetails(details);
        if (details?.profile_image) {
          setProfileImage(details.profile_image);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [getUserDetails]);

  if (loading) return <Loader />;
  if (error) return <GlobalError />;

  return (
    <>
      {/* <div className="profile-container">
        <div className="profile-card">
          <div
            className="mb-4 p-2 d-flex align-items-center gap-10"
            style={{ backgroundColor: "#0097ca1a", borderRadius: "10px" }}
          >
            <div className="profile-image position-relative me-3">
              <img
                id="profile-img"
                src={profileImageUrl || userProfile} // Use default image if `profileImage` is missing
                onError={(e) => {
                  e.target.onerror = null; // Prevent infinite loop
                  e.target.src = userProfile; // Fallback to default image
                }}
                alt="Profile"
                className="rounded-circle img-fluid border border-3 border-light"
                style={{ width: "80px", height: "80px", objectFit: "cover" }}
              />
              {isEditing && (
                <label
                  htmlFor="upload-image"
                  className="edit-image-label position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-1"
                >
                  <i className="fa fa-camera"></i>
                </label>
              )}
              <input
                type="file"
                id="upload-image"
                style={{ display: "none" }}
                onChange={handleImageChange}
                accept="image/*"
              />
            </div>
            <div className="mb-4 d-flex flex-column gap-5">
              <h2 className="profile-name mb-0 fw-bold text-dark">
                {userDetails.username || "Dummy Name"}
              </h2>
              <p className="profile-job mb-0 text-muted">
                {userDetails.job_title || ""}
              </p>
            </div>
          </div>

          <div className="profile-details">
            {!isEditing ? (
              <div className="row">
                {[
                  { label: "Full Name", value: userDetails.full_name },
                  { label: "Email", value: userDetails.email },
                  { label: "Phone", value: userDetails.contact_no },
                  { label: "Address", value: userDetails.address_line1 },
                  { label: "Country", value: userDetails.country },
                  { label: "State", value: userDetails.state },
                  { label: "City", value: userDetails.city },
                  { label: "Pincode", value: userDetails.postal_code },
                ].map((item, index) => (
                  <div className="col-md-6" key={index}>
                    <div className="info-box">
                      <p className="info-label">{item.label}:</p>
                      <p className="info-value">
                        {item.value || "Not Provided"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <form>
                <div className="row">
                  {[
                    {
                      label: "Full Name",
                      key: "full_name",
                      placeholder: "Full Name",
                    },
                    { label: "Email", key: "email", placeholder: "Email" },
                    { label: "Phone", key: "contact_no", placeholder: "Phone" },
                    {
                      label: "Address",
                      key: "address_line1",
                      placeholder: "Address",
                    },
                    {
                      label: "Country",
                      key: "country",
                      placeholder: "Country",
                    },
                    { label: "State", key: "state", placeholder: "State" },
                    { label: "City", key: "city", placeholder: "City" },
                    {
                      label: "Pincode",
                      key: "postal_code",
                      placeholder: "Pincode",
                    },
                  ].map((item, index) => (
                    <div className="col-md-6 mb-3" key={index}>
                      <label htmlFor={item.key} className="form-label">
                        {item.label}
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors[item.key] ? "is-invalid" : ""
                        }`}
                        id={item.key}
                        placeholder={item.placeholder}
                        value={userDetails[item.key] || ""}
                        onChange={(e) =>
                          setUserDetails({
                            ...userDetails,
                            [item.key]: e.target.value,
                          })
                        }
                      />
                      {errors[item.key] && (
                        <div className="invalid-feedback">
                          {errors[item.key]}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </form>
            )}
          </div>

          <div className="text-center mt-4">
            {isEditing ? (
              <>
                <button
                  className="btn btn-primary me-2"
                  onClick={() => {
                    setUserDetails(initialUserDetails);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </button>
                <button className="btn btn-primary me-2" onClick={toggleEdit}>
                  Save Profile
                </button>
              </>
            ) : (
              <button className="btn btn-primary me-2" onClick={toggleEdit}>
                Edit Profile
              </button>
            )}
            {!isEditing && (
              <button
                className="btn btn-primary me-2"
                onClick={togglePasswordModal}
              >
                Reset Password
              </button>
            )}
          </div>
        </div>
        {showPasswordModal && <ResetPassword />}
      </div> */}
      <div className="profile-container container py-4">
        <div className="profile-card card shadow-sm p-3">
          <div
            className="mb-4 p-3 d-flex align-items-center gap-3 flex-column flex-md-row"
            style={{ backgroundColor: "#0097ca1a", borderRadius: "10px" }}
          >
            <div className="profile-image position-relative">
              <img
                id="profile-img"
                src={profileImageUrl || userProfile}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = userProfile;
                }}
                alt="Profile"
                className="rounded-circle img-fluid border border-3 border-light"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
              {isEditing && (
                <label
                  htmlFor="upload-image"
                  className="edit-image-label position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-1"
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa fa-camera"></i>
                </label>
              )}
              <input
                type="file"
                id="upload-image"
                style={{ display: "none" }}
                onChange={handleImageChange}
                accept="image/*"
              />
            </div>
            <div className="text-center text-md-start">
              <h2 className="profile-name mb-1 fw-bold text-dark">
                {userDetails.username || "Dummy Name"}
              </h2>
              <p className="profile-job mb-0 text-muted">
                {userDetails.job_title || "Not Provided"}
              </p>
            </div>
          </div>

          <div className="profile-details">
            {!isEditing ? (
              <div className="row">
                {[
                  { label: "Full Name", value: userDetails.full_name },
                  { label: "Email", value: userDetails.email },
                  { label: "Phone", value: userDetails.contact_no },
                  { label: "Address", value: userDetails.address_line1 },
                  { label: "Country", value: userDetails.country },
                  { label: "State", value: userDetails.state },
                  { label: "City", value: userDetails.city },
                  { label: "Pincode", value: userDetails.postal_code },
                ].map((item, index) => (
                  <div className="col-12 col-md-6 mb-3" key={index}>
                    <div className="info-box">
                      <p className="info-label mb-1 fw-bold">{item.label}:</p>
                      <p className="info-value mb-0">{item.value || "Not Provided"}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <form>
                <div className="row">
                  {[
                    {
                      label: "Full Name",
                      key: "full_name",
                      placeholder: "Full Name",
                    },
                    { label: "Email", key: "email", placeholder: "Email" },
                    { label: "Phone", key: "contact_no", placeholder: "Phone" },
                    {
                      label: "Address",
                      key: "address_line1",
                      placeholder: "Address",
                    },
                    {
                      label: "Country",
                      key: "country",
                      placeholder: "Country",
                    },
                    { label: "State", key: "state", placeholder: "State" },
                    { label: "City", key: "city", placeholder: "City" },
                    {
                      label: "Pincode",
                      key: "postal_code",
                      placeholder: "Pincode",
                    },
                  ].map((item, index) => (
                    <div className="col-12 col-md-6 mb-3" key={index}>
                      <label htmlFor={item.key} className="form-label">
                        {item.label}
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors[item.key] ? "is-invalid" : ""
                          }`}
                        id={item.key}
                        placeholder={item.placeholder}
                        value={userDetails[item.key] || ""}
                        onChange={(e) =>
                          setUserDetails({
                            ...userDetails,
                            [item.key]: e.target.value,
                          })
                        }
                      />
                      {errors[item.key] && (
                        <div className="invalid-feedback">{errors[item.key]}</div>
                      )}
                    </div>
                  ))}
                </div>
              </form>
            )}
          </div>

          {/* <div className="text-center mt-4">
      {isEditing ? (
        <>
          <button
            className="btn btn-secondary me-2"
            onClick={() => {
              setUserDetails(initialUserDetails);
              setIsEditing(false);
            }}
          >
            Cancel
          </button>
          <button className="btn btn-primary" onClick={toggleEdit}>
            Save Profile
          </button>
        </>
      ) : (
        <>
          <button className="btn btn-primary me-2" onClick={toggleEdit}>
            Edit Profile
          </button>
          <button className="btn btn-danger mx-2" onClick={togglePasswordModal}>
            Reset Password
          </button>
        </>
      )}
    </div> */}
          <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-2 mt-4 m-2">
            {isEditing ? (
              <>
                <button
                  className="btn btn-outline-secondary px-4 py-2"
                  onClick={() => {
                    setUserDetails(initialUserDetails);
                    setIsEditing(false);
                  }}
                  style={{
                    borderRadius: "5px",
                    fontWeight: "500",
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary px-4 py-2"
                  onClick={toggleEdit}
                  style={{
                    backgroundColor: "#007bff",
                    border: "none",
                    borderRadius: "5px",
                    fontWeight: "500",
                  }}
                >
                  Save Profile
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-primary px-4 py-2"
                  onClick={toggleEdit}
                  style={{
                    backgroundColor: "#007bff",
                    border: "none",
                    borderRadius: "5px",
                    fontWeight: "500",
                  }}
                >
                  Edit Profile
                </button>
                <button
                  className="btn btn-danger px-4 py-2 mx-2"
                  onClick={togglePasswordModal}
                  style={{
                    backgroundColor: "#dc3545",
                    border: "none",
                    borderRadius: "5px",
                    fontWeight: "500",
                  }}
                >
                  Reset Password
                </button>
              </>
            )}
          </div>


        </div>
        {showPasswordModal && <ResetPassword />}
      </div>

      <Toaster />
    </>
  );
};

export default Profile;




// useEffect(() => {
//   const fetchUserDetails = async () => {
//     try {
//       const details = await getUserDetails();
//       setUserDetails(details);
//       setInitialUserDetails(details);
//       if (details?.profile_image) {
//         setProfileImage(details.profile_image);
//       } else {
//         setProfileImage(userProfile);
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchUserDetails();
// }, [getUserDetails]);

// const toggleEdit = async () => {
//   if (isEditing) {
//     const validationErrors = await validate();
//     if (Object.keys(validationErrors).length > 0) {
//       toast.error("Please correct the errors.");
//       return;
//     }

//     try {
//       const updatedData = {};
//       for (const key in userDetails) {
//         if (userDetails[key] !== initialUserDetails[key]) {
//           updatedData[key] = userDetails[key];
//         }
//       }

//       if (isProfileImageUpdated) {
//         updatedData.profile_image = profileImage;
//       }

//       if (Object.keys(updatedData).length === 0) {
//         toast.info("No changes detected.");
//         setIsEditing(false);
//         return;
//       }

//       const formData = new FormData();
//       for (const key in updatedData) {
//         formData.append(key, updatedData[key]);
//       }

//       const response = await updateUserDetails(formData);
//       toast.success(response.message || "Profile updated successfully.");
//       setInitialUserDetails(userDetails);
//       setIsProfileImageUpdated(false);
//     } catch (err) {
//       console.error("Error saving profile:", err);
//       toast.error(err.response?.data?.message || "Failed to update profile.");
//     }
//   }
//   setIsEditing(!isEditing);
// };


// import React, { useState, useEffect, useRef } from "react";
// import toast, { Toaster } from "react-hot-toast";
// import { useAuth } from "../../../context/AuthContext";
// import Loader from "../Loader/Loader";
// import { GlobalError } from "../global_error/GlobalError";
// import { ResetPassword } from "./ResetPassword";
// import userProfile from "../../assets/media/users/user-profile.jpg";
// import axios from "axios";

// const Profile = () => {
//   const API_URL =
//     import.meta.env.VITE_BASE_URL + ":" + import.meta.env.VITE_BASE_PORT;
//   const { getUserDetails, updateUserDetails } = useAuth();
//   const [isEditing, setIsEditing] = useState(false);
//   const [showPasswordModal, setShowPasswordModal] = useState(false);
//   const [isProfileImageUpdated, setIsProfileImageUpdated] = useState(false);

//   const [userDetails, setUserDetails] = useState({
//     username: "",
//     full_name: "",
//     email: "",
//     contact_no: "",
//     address_line1: "",
//     country: "",
//     state: "",
//     city: "",
//     postal_code: "",
//   });

//   const [profileImage, setProfileImage] = useState(userProfile);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [initialUserDetails, setInitialUserDetails] = useState({});
//   const [errors, setErrors] = useState({});
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   // const emailDebounceTimeout = useRef(null);

//   const UserID = JSON.parse(sessionStorage.getItem("user_id")) || {};
//   const profileImageUrl = `${API_URL}/user/profile-image/${UserID.custom_id}`;

//   const checkEmail = async (email) => {
//     try {
//       const response = await axios.get(
//         `${API_URL}/check-email?email=${encodeURIComponent(email)}`
//       );
//       if (response.data.available === 0) {
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           email: "Email already exists.",
//         }));
//         return false;
//       } else {
//         setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
//         return true;
//       }
//     } catch (error) {
//       console.error("Error checking email:", error);
//       return false;
//     }
//   };

//   // useEffect(() => {
//   //   if (
//   //     userDetails.email.trim().length > 0 &&
//   //     emailRegex.test(userDetails.email.trim())
//   //   ) {
//   //     if (emailDebounceTimeout.current) {
//   //       clearTimeout(emailDebounceTimeout.current);
//   //     }
//   //     emailDebounceTimeout.current = setTimeout(() => {
//   //       checkEmail(userDetails.email.trim());
//   //     }, 500);
//   //   } else {
//   //     setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
//   //   }
//   //   return () => {};
//   // }, [userDetails.email]);

//   const validate = async () => {
//     const validationErrors = {};
//     const postalCodeRegex = /^\d{5,6}$/;
//     const usContactRegex =
//       /^(?:\+1[-.\s]?|\+91[-.\s]?|1[-.\s]?|91[-.\s]?)?(?:\(\d{3}\)[-.\s]?|\d{3}[-.\s]?)?\d{3}[-.\s]?\d{4}$/;

//     if (!userDetails.full_name.trim()) {
//       validationErrors.full_name = "Full name is required.";
//     } else if (!/^[a-zA-Z\s]+$/.test(userDetails.full_name.trim())) {
//       validationErrors.full_name =
//         "Full name must only contain letters and spaces.";
//     } else if (userDetails.full_name.trim().split(/\s+/).length < 2) {
//       validationErrors.full_name =
//         "Full name must include first and last name.";
//     }

//     if (!userDetails.email.trim()) {
//       validationErrors.email = "Email is required.";
//     } else if (!emailRegex.test(userDetails.email.trim())) {
//       validationErrors.email = "Invalid email format.";
//     } else {
//       const emailAvailable = await checkEmail(userDetails.email.trim());
//       if (!emailAvailable) {
//         validationErrors.email =
//           "Email already exists. Please choose a different email.";
//       }
//     }

//     if (!userDetails.contact_no.trim()) {
//       validationErrors.contact_no = "Contact number is required.";
//     } else if (!/^[\d+().-\s]+$/.test(userDetails.contact_no.trim())) {
//       validationErrors.contact_no =
//         "Contact number must contain only valid characters.";
//     } else if (!usContactRegex.test(userDetails.contact_no.trim())) {
//       validationErrors.contact_no = "Contact number must be valid.";
//     }

//     if (!userDetails.address_line1.trim()) {
//       validationErrors.address_line1 = "Address Line 1 is required.";
//     }

//     if (!userDetails.city.trim()) {
//       validationErrors.city = "City is required.";
//     } else if (!/^[A-Za-z\s]+$/.test(userDetails.city.trim())) {
//       validationErrors.city = "City name is invalid.";
//     }

//     if (!userDetails.state.trim()) {
//       validationErrors.state = "State is required.";
//     } else if (!/^[A-Za-z\s]+$/.test(userDetails.state.trim())) {
//       validationErrors.state = "State name is invalid.";
//     }

//     if (!userDetails.country.trim()) {
//       validationErrors.country = "Country is required.";
//     } else if (!/^[A-Za-z\s]+$/.test(userDetails.country.trim())) {
//       validationErrors.country = "Country name is invalid.";
//     }

//     if (!userDetails.postal_code.trim()) {
//       validationErrors.postal_code = "Postal code is required.";
//     } else if (!postalCodeRegex.test(userDetails.postal_code.trim())) {
//       validationErrors.postal_code =
//         "Postal code must be a valid 5 or 6-digit number.";
//     }

//     setErrors(validationErrors);
//     return validationErrors;
//   };

//   // const toggleEdit = async () => {
//   //   if (isEditing) {
//   //     const validationErrors = await validate();
//   //     if (Object.keys(validationErrors).length > 0) {
//   //       toast.error("Please correct the errors.");
//   //       return;
//   //     }

//   //     try {
//   //       const updatedData = {};
//   //       for (const key in userDetails) {
//   //         if (userDetails[key] !== initialUserDetails[key]) {
//   //           updatedData[key] = userDetails[key];
//   //         }
//   //       }

//   //       if (isProfileImageUpdated) {
//   //         updatedData.profile_image = profileImage;
//   //       }

//   //       if (Object.keys(updatedData).length === 0) {
//   //         toast.info("No changes detected.");
//   //         setIsEditing(false);
//   //         return;
//   //       }

//   //       const formData = new FormData();
//   //       for (const key in updatedData) {
//   //         formData.append(key, updatedData[key]);
//   //       }

//   //       const response = await updateUserDetails(formData);
//   //       toast.success(response.message || "Profile updated successfully.");
//   //       setInitialUserDetails(userDetails);
//   //       setIsProfileImageUpdated(false);
//   //     } catch (err) {
//   //       console.error("Error saving profile:", err);
//   //       toast.error(err.response?.data?.message || "Failed to update profile.");
//   //     }
//   //   }
//   //   setIsEditing(!isEditing);
//   // };


//   const toggleEdit = async () => {
//     if (isEditing) {
//       const validationErrors = await validate();

//       if (Object.keys(validationErrors).length > 0) {
//         toast.error("Please correct the errors.");
//         return;
//       }

//       const updatedData = {};
//       for (const key in userDetails) {
//         if (userDetails[key]?.toString() !== initialUserDetails[key]?.toString()) {
//           updatedData[key] = userDetails[key];
//         }
//       }

//       console.log("hii");
//       if (isProfileImageUpdated) {
//         updatedData.profile_image = profileImage;
//       }

//       // Check if there are any changes to save
//       if (Object.keys(updatedData).length === 0) {
//         // toast("Oops! Nothing has been changed.");
//         setIsEditing(false);
//         return;
//       }

//       try {
//         const formData = new FormData();
//         for (const key in updatedData) {
//           formData.append(key, updatedData[key]);
//         }

//         const response = await updateUserDetails(formData);
//         toast.success(response.message || "Profile updated successfully.");
//         setInitialUserDetails(userDetails); // Update the reference data
//         setIsProfileImageUpdated(false);
//       } catch (err) {
//         console.error("Error saving profile:", err);
//         toast.error(err.response?.data?.message || "Failed to update profile.");
//       }
//     }
//     setIsEditing(!isEditing);
//   };


//   const togglePasswordModal = () => setShowPasswordModal(!showPasswordModal);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setProfileImage(file);
//       setIsProfileImageUpdated(true);
//       const previewUrl = URL.createObjectURL(file);
//       document.getElementById("profile-img").src = previewUrl;
//     }
//   };
//   // useEffect(() => {
//   //   const fetchUserDetails = async () => {
//   //     try {
//   //       const details = await getUserDetails();
//   //       setUserDetails(details);
//   //       setInitialUserDetails(details);
//   //       if (details?.profile_image) {
//   //         setProfileImage(details.profile_image);
//   //       } else {
//   //         setProfileImage(userProfile);
//   //       }
//   //     } catch (err) {
//   //       setError(err.message);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   fetchUserDetails();
//   // }, [getUserDetails]);

//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       try {
//         const details = await getUserDetails();
//         setUserDetails(details);
//         setInitialUserDetails(details);
//         if (details?.profile_image) {
//           setProfileImage(details.profile_image);
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserDetails();
//   }, [getUserDetails]);

//   if (loading) return <Loader />;
//   if (error) return <GlobalError />;

//   return (
//     <>
//       <div className="profile-container">
//         <div className="profile-card">
//           <div
//             className="mb-4 p-2 d-flex align-items-center gap-10"
//             style={{ backgroundColor: "#0097ca1a", borderRadius: "10px" }}
//           >
//             <div className="profile-image position-relative me-3">
//               <img
//                 id="profile-img"
//                 src={profileImageUrl || userProfile} // Use default image if `profileImage` is missing
//                 onError={(e) => {
//                   e.target.onerror = null; // Prevent infinite loop
//                   e.target.src = userProfile; // Fallback to default image
//                 }}
//                 alt="Profile"
//                 className="rounded-circle img-fluid border border-3 border-light"
//                 style={{ width: "80px", height: "80px", objectFit: "cover" }}
//               />
//               {isEditing && (
//                 <label
//                   htmlFor="upload-image"
//                   className="edit-image-label position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-1"
//                 >
//                   <i className="fa fa-camera"></i>
//                 </label>
//               )}
//               <input
//                 type="file"
//                 id="upload-image"
//                 style={{ display: "none" }}
//                 onChange={handleImageChange}
//                 accept="image/*"
//               />
//             </div>
//             <div className="mb-4 d-flex flex-column gap-5">
//               <h2 className="profile-name mb-0 fw-bold text-dark">
//                 {userDetails.username || "Dummy Name"}
//               </h2>
//               <p className="profile-job mb-0 text-muted">
//                 {userDetails.job_title || ""}
//               </p>
//             </div>
//           </div>

//           <div className="profile-details">
//             {!isEditing ? (
//               <div className="row">
//                 {[
//                   { label: "Full Name", value: userDetails.full_name },
//                   { label: "Email", value: userDetails.email },
//                   { label: "Phone", value: userDetails.contact_no },
//                   { label: "Address", value: userDetails.address_line1 },
//                   { label: "Country", value: userDetails.country },
//                   { label: "State", value: userDetails.state },
//                   { label: "City", value: userDetails.city },
//                   { label: "Pincode", value: userDetails.postal_code },
//                 ].map((item, index) => (
//                   <div className="col-md-6" key={index}>
//                     <div className="info-box">
//                       <p className="info-label">{item.label}:</p>
//                       <p className="info-value">
//                         {item.value || "Not Provided"}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <form>
//                 <div className="row">
//                   {[
//                     {
//                       label: "Full Name",
//                       key: "full_name",
//                       placeholder: "Full Name",
//                     },
//                     { label: "Email", key: "email", placeholder: "Email" },
//                     { label: "Phone", key: "contact_no", placeholder: "Phone" },
//                     {
//                       label: "Address",
//                       key: "address_line1",
//                       placeholder: "Address",
//                     },
//                     {
//                       label: "Country",
//                       key: "country",
//                       placeholder: "Country",
//                     },
//                     { label: "State", key: "state", placeholder: "State" },
//                     { label: "City", key: "city", placeholder: "City" },
//                     {
//                       label: "Pincode",
//                       key: "postal_code",
//                       placeholder: "Pincode",
//                     },
//                   ].map((item, index) => (
//                     <div className="col-md-6 mb-3" key={index}>
//                       <label htmlFor={item.key} className="form-label">
//                         {item.label}
//                       </label>
//                       <input
//                         type="text"
//                         className={`form-control ${
//                           errors[item.key] ? "is-invalid" : ""
//                         }`}
//                         id={item.key}
//                         placeholder={item.placeholder}
//                         value={userDetails[item.key] || ""}
//                         onChange={(e) =>
//                           setUserDetails({
//                             ...userDetails,
//                             [item.key]: e.target.value,
//                           })
//                         }
//                       />
//                       {errors[item.key] && (
//                         <div className="invalid-feedback">
//                           {errors[item.key]}
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </form>
//             )}
//           </div>

//           <div className="text-center mt-4">
//             {isEditing ? (
//               <>
//                 <button
//                   className="btn btn-primary me-2"
//                   onClick={() => {
//                     setUserDetails(initialUserDetails);
//                     setIsEditing(false);
//                   }}
//                 >
//                   Cancel
//                 </button>
//                 <button className="btn btn-primary me-2" onClick={toggleEdit}>
//                   Save Profile
//                 </button>
//               </>
//             ) : (
//               <button className="btn btn-primary me-2" onClick={toggleEdit}>
//                 Edit Profile
//               </button>
//             )}
//             {!isEditing && (
//               <button
//                 className="btn btn-primary me-2"
//                 onClick={togglePasswordModal}
//               >
//                 Reset Password
//               </button>
//             )}
//           </div>
//         </div>
//         {showPasswordModal && <ResetPassword />}
//       </div>
//       <Toaster />
//     </>
//   );
// };

// export default Profile;











// import React, { useState, useEffect, useRef } from "react";
// import toast, { Toaster } from "react-hot-toast";
// import { useAuth } from "../../../context/AuthContext";
// import Loader from "../Loader/Loader";
// import { GlobalError } from "../global_error/GlobalError";
// import { ResetPassword } from "./ResetPassword";
// import userProfile from "../../assets/media/users/user-profile.jpg";
// import axios from "axios";

// const Profile = () => {
//   const API_URL =
//     import.meta.env.VITE_BASE_URL + ":" + import.meta.env.VITE_BASE_PORT;
//   const { getUserDetails, updateUserDetails } = useAuth();
//   const [isEditing, setIsEditing] = useState(false);
//   const [showPasswordModal, setShowPasswordModal] = useState(false);
//   const [isProfileImageUpdated, setIsProfileImageUpdated] = useState(false);

//   const [userDetails, setUserDetails] = useState({
//     username: "",
//     full_name: "",
//     email: "",
//     contact_no: "",
//     address_line1: "",
//     country: "",
//     state: "",
//     city: "",
//     postal_code: "",
//   });

//   const [profileImage, setProfileImage] = useState(userProfile);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [initialUserDetails, setInitialUserDetails] = useState({});
//     const [errors, setErrors] = useState({});

//   const UserID = JSON.parse(sessionStorage.getItem("user_id")) || {};

//   // console.log(UserID.custom_id);
//   const profileImageUrl = `${API_URL}/user/profile-image/${UserID.custom_id}`;
//   // console.log(profileImageUrl);
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   const emailDebounceTimeout = useRef(null);

//   const checkEmail = async (email) => {
//     try {
//       const response = await axios.get(
//         `${API_URL}/check-email?email=${encodeURIComponent(email)}`
//       );
//       if (response.data.available === 0) {
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           email: "Email already exists",
//         }));
//         return false;
//       } else {
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           email: "",
//         }));
//         return true;
//       }
//     } catch (error) {
//       console.error("Error checking email:", error);
//       return false;
//     }
//   };

//     useEffect(() => {
//       if (
//         userDetails.email.trim().length > 0 &&
//         emailRegex.test(userDetails.email.trim())
//       ) {
//         if (emailDebounceTimeout.current) {
//           clearTimeout(emailDebounceTimeout.current);
//         }

//         emailDebounceTimeout.current = setTimeout(() => {
//           checkEmail(userDetails.email.trim());
//         }, 500);
//       } else {
//         setErrors((prevErrors) => ({
//           ...prevErrors,
//           email: "",
//         }));
//       }

//       return () => { };
//     }, [userDetails.email]);

//   // Validation function

//   const validate = async () => {
//     const errors = {};
//     const postalCodeRegex = /^\d{5,6}$/;
//     const usContactRegex =
//       /^(?:\+1[-.\s]?|\+91[-.\s]?|1[-.\s]?|91[-.\s]?)?(?:\(\d{3}\)[-.\s]?|\d{3}[-.\s]?)?\d{3}[-.\s]?\d{4}$/;

//     // Full Name validation
//     if (!userDetails.full_name.trim()) {
//       errors.full_name = "Full name is required.";
//     } else if (!/^[a-zA-Z\s]+$/.test(userDetails.full_name.trim())) {
//       errors.full_name = "Full name must only contain letters and spaces.";
//     } else if (userDetails.full_name.trim().split(/\s+/).length < 2) {
//       errors.full_name = "Full name must include first and last name.";
//     }

//     // Email validation
//     if (!userDetails.email.trim()) {
//       errors.email = "Email is required.";
//     } else if (!emailRegex.test(userDetails.email.trim())) {
//       errors.email = "Invalid email format.";
//     }
//      else {
//       const emailAvailable = await checkEmail(userDetails.email.trim());
//       if (!emailAvailable) {
//         errors.email = "Email already exists. Please choose a different email.";
//       }
//     }

//     // Contact number validation
//     if (!userDetails.contact_no.trim()) {
//       errors.contact_no = "Contact number is required.";
//     } else if (!/^[\d+().-\s]+$/.test(userDetails.contact_no.trim())) {
//       errors.contact_no = "Contact number must contain only valid characters.";
//     } else if (!usContactRegex.test(userDetails.contact_no.trim())) {
//       errors.contact_no = "Contact number must be valid.";
//     }

//     // Address Line 1 validation
//     if (!userDetails.address_line1.trim()) {
//       errors.address_line1 = "Address Line 1 is required.";
//     }

//     // City validation
//     if (!userDetails.city.trim()) {
//       errors.city = "City is required.";
//     } else if (!/^[A-Za-z\s]+$/.test(userDetails.city.trim())) {
//       errors.city = "City name is invalid.";
//     }

//     // State validation
//     if (!userDetails.state.trim()) {
//       errors.state = "State is required.";
//     } else if (!/^[A-Za-z\s]+$/.test(userDetails.state.trim())) {
//       errors.state = "State name is invalid.";
//     }

//     // Country validation
//     if (!userDetails.country.trim()) {
//       errors.country = "Country is required.";
//     } else if (!/^[A-Za-z\s]+$/.test(userDetails.country.trim())) {
//       errors.country = "Country name is invalid.";
//     }

//     // Postal Code validation
//     if (!userDetails.postal_code.trim()) {
//       errors.postal_code = "Postal code is required.";
//     } else if (!postalCodeRegex.test(userDetails.postal_code.trim())) {
//       errors.postal_code = "Postal code must be a valid 5 or 6-digit number.";
//     }

//     return errors;
//   };

//   const toggleEdit = async () => {
//     if (isEditing) {
//     // Validate form data, including asynchronous checks for username and email
//       const validationErrors = await validate();
//       if (Object.keys(validationErrors).length > 0) {
//         toast.error("Please enter proper data to proceed.");
//         return;
//       }

//       try {
//         const updatedData = {};
//         for (const key in userDetails) {
//           if (userDetails[key] !== initialUserDetails[key]) {
//             updatedData[key] = userDetails[key];
//           }
//         }

//         if (isProfileImageUpdated) {
//           updatedData.profile_image = profileImage;
//         }

//         if (Object.keys(updatedData).length === 0) {
//           toast.info("No changes detected.");
//           setIsEditing(false);
//           return;
//         }

//         const formData = new FormData();
//         for (const key in updatedData) {
//           formData.append(key, updatedData[key]);
//         }

//         const response = await updateUserDetails(formData);
//         console.log(response);
//         toast.success(response.message || "Profile updated successfully.");
//         setInitialUserDetails(userDetails);
//         setIsProfileImageUpdated(false);
//       } catch (err) {
//         console.error("Error saving profile:", err);
//         toast.error(err.response?.data?.message || "Failed to update profile.");
//       }
//     }
//     setIsEditing(!isEditing);
//   };

//   const togglePasswordModal = () => {
//     setShowPasswordModal(!showPasswordModal);
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setProfileImage(file);
//       setIsProfileImageUpdated(true);
//       const previewUrl = URL.createObjectURL(file);
//       document.getElementById("profile-img").src = previewUrl;
//     }
//   };

// useEffect(() => {
//   const fetchUserDetails = async () => {
//     try {
//       const details = await getUserDetails();
//       setUserDetails(details);
//       setInitialUserDetails(details);
//       if (details?.profile_image) {
//         setProfileImage(details.profile_image);
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchUserDetails();
// }, [getUserDetails]);

//   if (loading) return <Loader />;
//   if (error) return <GlobalError />;

//   // console.log("userDetails",userDetails);

//   return (
//     <>
// <div className="profile-container">
//   <div className="profile-card">
//     <div
//       className="mb-4 p-2 d-flex align-items-center gap-10"
//       style={{ backgroundColor: "#0097ca1a", borderRadius: "10px" }}
//     >
//       <div className="profile-image position-relative me-3">
//         <img
//           id="profile-img"
//           src={profileImageUrl || userProfile}
//           onError={(e) => {
//             e.target.onerror = null;
//             e.target.src = userProfile;
//           }}
//           alt="Profile"
//           className="rounded-circle img-fluid border border-3 border-light"
//           style={{ width: "80px", height: "80px", objectFit: "cover" }}
//         />
//         {isEditing && (
//           <label
//             htmlFor="upload-image"
//             className="edit-image-label position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-1"
//           >
//             <i className="fa fa-camera"></i>
//           </label>
//         )}
//         <input
//           type="file"
//           id="upload-image"
//           style={{ display: "none" }}
//           onChange={handleImageChange}
//           accept="image/*"
//         />
//       </div>
//       <div className="mb-4 d-flex flex-column gap-5">
//         <h2 className="profile-name mb-0 fw-bold text-dark">
//           {userDetails.username || "Dummy Name"}
//         </h2>
//         <p className="profile-job mb-0 text-muted">
//           {userDetails.job_title || ""}
//         </p>
//       </div>
//     </div>

//           <div className="profile-details">
//             {!isEditing ? (
//               <div className="row">
//                 {[
//                   { label: "Full Name", value: userDetails.full_name },
//                   { label: "Email", value: userDetails.email },
//                   { label: "Phone", value: userDetails.contact_no },
//                   { label: "Address", value: userDetails.address_line1 },
//                   { label: "Country", value: userDetails.country },
//                   { label: "State", value: userDetails.state },
//                   { label: "City", value: userDetails.city },
//                   { label: "Pincode", value: userDetails.postal_code },
//                 ].map((item, index) => (
//                   <div className="col-md-6" key={index}>
//                     <div className="info-box">
//                       <p className="info-label">{item.label}:</p>
//                       <p className="info-value">
//                         {item.value || "Not Provided"}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <form>
//                 <div className="row">
//                   {[
//                     {
//                       label: "Full Name",
//                       key: "full_name",
//                       placeholder: "Full Name",
//                     },
//                     { label: "Email", key: "email", placeholder: "Email" },
//                     { label: "Phone", key: "contact_no", placeholder: "Phone" },
//                     {
//                       label: "Address",
//                       key: "address_line1",
//                       placeholder: "Address",
//                     },
//                     {
//                       label: "Country",
//                       key: "country",
//                       placeholder: "Country",
//                     },
//                     { label: "State", key: "state", placeholder: "State" },
//                     { label: "City", key: "city", placeholder: "City" },
//                     {
//                       label: "Pincode",
//                       key: "postal_code",
//                       placeholder: "Pincode",
//                     },
//                   ].map((item, index) => (
//                     <div className="col-md-6 mb-3" key={index}>
//                       <label htmlFor={item.key} className="form-label">
//                         {item.label}
//                       </label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         id={item.key}
//                         placeholder={item.placeholder}
//                         value={userDetails[item.key] || ""}
//                         onChange={(e) =>
//                           setUserDetails({
//                             ...userDetails,
//                             [item.key]: e.target.value,
//                           })
//                         }
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </form>
//             )}
//           </div>

//           <div className="text-center mt-4">
//             {isEditing ? (
//               <>
//                 <button
//                   className="btn btn-primary me-2"
//                   onClick={() => {
//                     setUserDetails(initialUserDetails);
//                     setIsEditing(false);
//                   }}
//                 >
//                   Cancel
//                 </button>
//                 <button className="btn btn-primary me-2" onClick={toggleEdit}>
//                   Save Profile
//                 </button>
//               </>
//             ) : (
//               <button className="btn btn-primary me-2" onClick={toggleEdit}>
//                 Edit Profile
//               </button>
//             )}

//             {isEditing === false && (
//               <button
//                 className="btn btn-primary me-2"
//                 onClick={togglePasswordModal}
//               >
//                 Reset Password
//               </button>
//             )}
//           </div>
//         </div>
//         {showPasswordModal && <ResetPassword />}
//       </div>
//       <Toaster />
//     </>
//   );
// };

// export default Profile;

{
  /* <div className="text-center mt-4">
            <button className="btn btn-primary me-2" onClick={toggleEdit}>
              {isEditing ? "Save Profile" : "Edit Profile"}
            </button>
            <button className="btn btn-primary me-2" onClick={togglePasswordModal}>
              Reset Password
            </button>
          </div> */
}

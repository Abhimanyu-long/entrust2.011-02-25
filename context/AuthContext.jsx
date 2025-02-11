import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { encryptData } from "../src/components/common/crypto";

const API_URL =
  import.meta.env.VITE_BASE_URL + ":" + import.meta.env.VITE_BASE_PORT;

const FROENTEND_URL = import.meta.env.VITE_BASE_FRONTEND_URL;
// import.meta.env.VITE_BASE_URL + ":" + import.meta.env.VITE_BASE_FRONTEND_PORT;

const VITE_STRIPE_SECRET_KEY = import.meta.env.VITE_STRIPE_SECRET_KEY;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [userdetails, setUserDetails] = useState("");

  const isTokenExpired = (token) => {
    if (!token) return true;
    const decodedToken = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    const timeLeftInSeconds = decodedToken.exp - currentTime;
    return timeLeftInSeconds <= 0;
  };

  const checkTokenExpiration = () => {
    const token = sessionStorage.getItem("token");
    // console.log("Is token expired? ", isTokenExpired(token));
    if (!token || isTokenExpired(token)) {
      setIsAuthenticated(false);
      sessionStorage.removeItem("token");
      return true;
    }
    return false;
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const storedRoles = sessionStorage.getItem("roles");

    if (token && storedRoles && !isTokenExpired(token)) {
      setIsAuthenticated(true);
      const parsedRoles = JSON.parse(storedRoles);
      setUserDetails({ roles: parsedRoles });
    } else {
      setIsAuthenticated(false);
      setUserDetails(null);
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("roles");
    }
  }, []);

  // this will check session storage
  const syncSessionStorage = () => {
    localStorage.setItem(
      "sessionSync",
      JSON.stringify({
        token: sessionStorage.getItem("token"),
        userData: sessionStorage.getItem("user_data"),
      })
    );
    setTimeout(() => {
      localStorage.removeItem("sessionSync"); // Clean up after syncing
    }, 0);
  };

  const loginWithEmail = async (data) => {
    try {
      const loginResponse = await axios.post(`${API_URL}/login`, data, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("loginWithEmail => ", loginResponse);

      if (loginResponse && loginResponse.data) {
        const {
          token,
          user_details,
          agreement_accepted,
          message,
          is_first_login,
          roles,
          client_data,
          refresh_token,
          referral_agreement_accepted,
        } = loginResponse.data;

        const decoded = jwtDecode(token);
        // console.log("Decoded token:", decoded);

        const isExpired = isTokenExpired(token);
        if (isExpired) {
          console.log("Token is expired");
          return;
        }

        if (refresh_token) {
          sessionStorage.setItem("refresh_token", refresh_token);
        }

        sessionStorage.setItem("referral_agreement_accepted", referral_agreement_accepted);
      
        // Store data in sessionStorage
        sessionStorage.setItem("token", token);

        sessionStorage.setItem("user_id", JSON.stringify(decoded));

        if (user_details) {
          sessionStorage.setItem("user_details", JSON.stringify(user_details));
        }

        if (Array.isArray(roles)) {
          // console.log("Roles being stored:", roles);
          sessionStorage.setItem("roles", JSON.stringify(roles));
        } else {
          console.error("Roles is not a valid array");
        }

        if (!client_data || Object.keys(client_data).length === 0) {
          sessionStorage.setItem("client_data", JSON.stringify({}));
        } else {
          sessionStorage.setItem("client_data", JSON.stringify(client_data));
        }

        sessionStorage.setItem("username", decoded.sub);

        if (message) {
          sessionStorage.setItem("message", message);
        }
        if (agreement_accepted) {
          sessionStorage.setItem("agreement_accepted", agreement_accepted);
        }
        if (is_first_login) {
          sessionStorage.setItem(
            "is_first_login",
            JSON.stringify(is_first_login)
          );
        }

        syncSessionStorage();
        setIsAuthenticated(true);
        setUserDetails({ roles });

        // console.log("Authentication successful for non-LDAP user");
        return loginResponse;
      } else {
        console.error(
          "Invalid response format or no data found in regular login."
        );
      }
    } catch (error) {
      console.error(
        error.response?.data?.message || "Connection error during login"
      );
    }
  };

  const forgotPassword = async (data) => {
    try {
      const response = await axios.post(`${API_URL}/forgot_password`, data, {
        headers: { "Content-Type": "application/json" },
      });
      return response;
    } catch (error) {
      return error;
    }
  };

  const register = async (data) => {
    try {
      const response = await axios.post(`${API_URL}/register`, data, {
        headers: { "Content-Type": "application/json" },
      });
      return response;
    } catch (error) {
      return error;
    }
  };

  const logout = async (data) => {
    const localStorageToken = sessionStorage.getItem("token");
    try {
      const response = await axios.post(`${API_URL}/logout`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorageToken}`,
        },
      });
      syncSessionStorage();
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Logout error");
    }
  };

  // const logout = async () => {
  //   const localStorageToken = sessionStorage.getItem("token");  // This seems to be your access token
  //   const refreshToken = sessionStorage.getItem("refresh_token");  // Assuming this stores your refresh token
  //   const data = {
  //     token: localStorageToken,  // Access token
  //     refresh_token: refreshToken // Add refresh_token to the request payload
  //   };

  //   try {
  //     const response = await axios.post(`${API_URL}/logout`, data, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorageToken}`,
  //       },
  //     });
  //     return response;
  //   } catch (error) {
  //     throw new Error(error.response?.data?.message || "Logout error");
  //   }
  // };

  const getSingleCase = async (client_id, case_id) => {
    try {
      const token = sessionStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/clients/${client_id}/cases/${case_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  // const getComments = async (clientId, projectId, caseId, commentData) => {
  //   try {
  //     const token = localStorage.getItem("token"); // Retrieve the token from local storage

  //     const response = await axios.post(
  //       `${API_URL}/clients/${clientId}/projects/${projectId}/cases/${caseId}/comments`,
  //       commentData, // Pass the comment data in the request body
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     return response.data; // Return the response data
  //   } catch (error) {
  //     throw new Error(error.response?.data?.message || "Connection error");
  //   }
  // };

  const getAllClients = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${API_URL}/clients`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  const getAllCasesByClientID = async (clientId) => {
    try {
      const token = sessionStorage.getItem("token");
      // `${API_URL}/clients/${encryptData(clientId)}/get_case_count`,
      const response = await axios.get(
        `${API_URL}/clients/${encryptData(clientId)}/cases`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  const getClientRelatedRoles = async (parent_role_id) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/client_related_roles?parent_role_id=${parent_role_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  const getAllCases = async (clientId, projectId) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/clients/${clientId}/projects/${projectId}/cases`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  const createCase = async (clientId, projectId, data) => {
    try {
      const token = sessionStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token is missing. Please log in.");
      }

      const response = await axios.post(
        `${API_URL}/clients/${clientId}/projects/${projectId}/cases`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response; // Return the response to the caller
    } catch (error) {
      console.error("Error creating case:", error);

      const errorMessage =
        error.response?.data?.detail || // FastAPI 'detail' field
        error.response?.data?.message || // Generic API 'message' field
        "An error occurred while creating the case. Please try again.";

      console.error("Error details:", errorMessage);

      throw new Error(errorMessage); // Rethrow the error with the relevant message
    }
  };

  const updateCase = async (data) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.patch(`${API_URL}/cases/update`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  const createProject = async (clientId, data) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/clients/${clientId}/projects`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Error in createProject:", error.response || error.message);
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  const getAllProjects = async (clientId) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/clients/${clientId}/projects`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  const getSingleProject = async (clientId, projectId) => {
    try {
      // console.log("Client ID, Project Id: ", clientId, projectId);
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/clients/${clientId}/projects/${projectId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data[0];
    } catch (error) {
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  const updateProject = async (clientId, projectId, updatedData) => {
    try {
      const token = sessionStorage.getItem("token");

      const response = await axios.put(
        `${API_URL}/clients/${clientId}/projects/${projectId}`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  const uploadFile = async (data, case_id) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/case/${case_id}/upload`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  // const getInactiveUsers = async () => {
  //   try {
  //     const response = await axios.get(`${API_URL}/users/inactive`, {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     return response;
  //   } catch (error) {
  //     throw new Error(error.response?.data?.message || "Connection error");
  //   }
  // };

  const getAllUsers = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${API_URL}/users/profile/approvals`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  const getManageableRoles = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/auth/users/manageable_roles`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching manageable roles:",
        error.response?.data?.message || error.message
      );
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  const getMasterScreen = async (data) => {
    try {
      const token = sessionStorage.getItem("token");
      // console.log("Hellooooo");
      // const response = await axios.get(`${API_URL}/masters/form/data/${data}`, {
      const response = await axios.get(
        `${API_URL}/master/masters/form/data/contract`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  const updateMasterScreen = async (dynamic, data) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/masters/form/data/${dynamic}/bulk_update`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  const getClientMember = async (dynamicClientNumber, options = {}) => {
    try {
      const token = sessionStorage.getItem("token");

      const params = new URLSearchParams();

      if (options.get_suspended) {
        params.append("status", "suspended");
      } else if (options.get_active) {
        params.append("status", "active");
      } else {
        // Default to fetching active members
        params.append("status", "active");
      }

      const response = await axios.get(
        `${API_URL}/clients/${dynamicClientNumber}/members?${params.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching client member:", error.message);
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  const getMyClients = async (dynamicMyClientNumber) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/client/clients/members/${dynamicMyClientNumber}/clients`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching client members by dynamic client:",
        error.message
      );
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  const getUserManageableRoles = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await axios.get(`${API_URL}/manageable_roles`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching manageable roles:",
        error.response?.data?.message || error.message
      );
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  const getAllRoles = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await axios.get(`${API_URL}/roles`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching all roles:",
        error.response?.data?.message || error.message
      );
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  const getArchivedClients = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/client/clients/non_archived`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching non-archived clients:", error.message);
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  const userDetailsById = async (userId, data) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/user/details/${userId}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  const updateClientInformation = async (clientId, updatedData) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/clients/${clientId}`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  const chartInformationDetails = async (clientId, projectId) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/clients/statistics/${clientId}/project/${projectId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  const createPassword = async (token, newPassword) => {
    try {
      const response = await axios.post(
        `${API_URL}/forgot_password_reset`,
        {
          token,
          new_password: newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  const restPassword = async (data) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(`${API_URL}/reset_password`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      return error;
    }
  };

  // const getAllRoles = async () =>{
  //   try{

  //     return response.data;
  //   }catch (error) {
  //     throw new Error(error.response?.data?.message || "Connection error");
  //   }
  // }

  const getAllPermissions = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await axios.get(`${API_URL}/permissions`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching all permissions:",
        error.response?.data?.message || error.message
      );
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  const getRoleAndPermission = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await axios.get(`${API_URL}/roles/permissions`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching roles and permissions:",
        error.response?.data?.message || error.message
      );
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  const updateRoleAndPermission = async (data) => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await axios.put(
        `${API_URL}/roles/permissions/update`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching roles and permissions:",
        error.response?.data?.message || error.message
      );
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  const getAllUser = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await axios.get(`${API_URL}/users/roles`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching user role:",
        error.response?.data?.message || error.message
      );
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  const updateUserRoleAndPermission = async (data) => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await axios.post(`${API_URL}/users/roles/update`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching user roles and permissions update:",
        error.response?.data?.message || error.message
      );
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  const checkLdapUser = async (data) => {
    try {
      const response = await axios.post(`${API_URL}/check_user_exists`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response;
    } catch (error) {
      console.error(
        "Error checking user",
        error.response?.data?.message || error.message
      );
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  const createCaseForLatestProject = async (clientId, data) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/clients/${clientId}/create_case_for_latest_project`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  const removeClientMember = async (clientId, memberId, data) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.delete(
        `${API_URL}/clients/${clientId}/members/${memberId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: data,
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  const suspendClientMember = async (clientId, memberId, data) => {
    try {
      // console.log("client id for suspending: ", clientId);
      const token = sessionStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/clients/${clientId}/members/${memberId}/suspend`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  const activateClientMember = async (clientId, memberId, data) => {
    try {
      // console.log("client id for activating: ", clientId);
      const token = sessionStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/clients/${clientId}/members/${memberId}/activate`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  const addClientMember = async (clientId, data) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/clients/${clientId}/add-members`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error adding client member",
        error.response?.data?.message || error.message
      );
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  // const create_order = async (data) => {
  //   try {
  //     const token = sessionStorage.getItem("token");
  //     const response = await axios.get(
  //       // `${API_URL}/`,
  //       `10.10.0.89:50041/`,
  //       data,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     return response.data;
  //   } catch (error) {
  //     throw new Error(error.response?.data?.message || "Connection error");
  //   }
  // };

  const searchEntities = async (query) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/search`,
        { query },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  const updateClientSettings = async (clientId, data) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/clients/update_client_settings/${clientId}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  const updateClientSetup = async (clientId, data) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/clients/update_client_setup/${clientId}/`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  const getProjects = async () => {
    try {
      const token = sessionStorage.getItem("token"); // Retrieving the token from local storage
      const response = await axios.get(`${API_URL}/projects`, {
        headers: {
          Authorization: `Bearer ${token}`, // Adding the Bearer token for authorization
          "Content-Type": "application/json", // Setting the content type
        },
      });

      return response.data; // Returning the response data, which contains the list of projects
    } catch (error) {
      // Handling different error scenarios and throwing meaningful messages
      if (error.response) {
        if (error.response.status === 400) {
          throw new Error("Bad Request. Please check your request.");
        } else if (error.response.status === 401) {
          throw new Error(
            "Unauthorized. Please check your authentication credentials."
          );
        } else if (error.response.status === 500) {
          throw new Error("Internal Server Error. Please try again later.");
        }
      }
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  const getClientSettings = async (clientId) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/clients/get_client_settings/${clientId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log(response);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  const getClients = async (clientId) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/clients/get_client_settings/${clientId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log(response);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  const approvalUser = async (user_id) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/users/profile/approve`,
        { user_id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  const getManagers = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${API_URL}/managers`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  const rejectUser = async (approval_id) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/users/profile/reject`,
        { approval_id }, // request body
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  const resendVerificationEmail = async (approval_id) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/users/resend-verification-email`,
        { approval_id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  const approveUserProfile = async (Data) => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await axios.put(
        `${API_URL}/users/profile/approve`,
        Data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Connection error");
    }
  };

  const checkUsernameAvailability = async (username) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/check-username?username=${username}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error checking username"
      );
    }
  };

  const checkOrganizationAvailability = async (clientname) => {
    try {
      const token = sessionStorage.getItem("token"); // Retrieve the token
      const response = await axios.get(
        `${API_URL}/check-client-exist?clientname=${clientname}`, 
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Attach the authorization token
          },
        }
      );
      
      return response.data;
    } catch (error) {
      return error;
    }
  };
  

  const getUserDetails = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${API_URL}/user_details`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error fetching user details"
      );
    }
  };

  const checkCaseNameAvailability = async (clientId, caseName) => {
    // console.log("caseName",caseName);

    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/clients/${encryptData(clientId)}/check-case-name`,
        {
          params: {
            encrypted_client_id: encryptData(clientId), // Pass encrypted clientId as a query parameter
            case_name: caseName,          // Pass encrypted caseName as a query parameter
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error checking case name availability"
      );
    }
  };

  const updateUserDetails = async (updatedData) => {
    try {
      const token = sessionStorage.getItem("token"); // Retrieve the token

      const response = await axios.patch(
        `${API_URL}/user_details`,
        updatedData, // FormData is sent here
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important for file uploads
            Authorization: `Bearer ${token}`, // Include the token for authentication
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error updating user details:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  // Dashboard realted api
  const getCaseCount = async (clientId) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/clients/${encryptData(clientId)}/get_case_count`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; // Return the data from the response
    } catch (error) {
      return error;
    }
  };

  const getProjectOverview = async (clientId) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/${clientId}/project_overview`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response; // Return the data from the response
    } catch (error) {
      return error;
    }
  };

  const getAutopayDetails = async (clientId) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/${clientId}/get_autopay_details`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; // Return the data from the response
    } catch (error) {
      return error;
    }
  };

  const getToBePaidInvoices = async (clientId) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/clients/${encryptData(
          clientId
        )}/invoices/to-be-paid/entrust1`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      return error;
    }
  };

  const getBankTransactions = async (clientId, dateRange, transactionType) => {
    try {
      const token = sessionStorage.getItem("token");

      // Prepare the data to send with the request
      const params = new URLSearchParams();
      if (dateRange) params.append("date_range", dateRange);
      if (transactionType) params.append("transaction_type", transactionType);

      const response = await axios.get(
        `${API_URL}/bank/transactions/${encryptData(clientId)}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
          params, // Add parameters to the URL
        }
      );

      return response.data; // return the response data
    } catch (error) {
      return error;
    }
  };

  const getStripePaymentMethods = async (stripeCustomerId) => {
    try {
      const token = sessionStorage.getItem("token");

      const response = await axios.get(
        `https://api.stripe.com/v1/customers/${stripeCustomerId}/payment_methods?type=card`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${VITE_STRIPE_SECRET_KEY}`,
          },
        }
      );
      // console.log("Stripe payment Methods", response);
      return response.data; // Return the data directly to use in our state
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      return error;
    }
  };

  const getStripePaymentMethodsLink = async (clientId, sessionData) => {
    try {
      const token = sessionStorage.getItem("token");

      // Call the Stripe API to create a session
      const response = await axios.post(
        `https://api.stripe.com/v1/checkout/sessions`,
        sessionData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${VITE_STRIPE_SECRET_KEY}`,
          },
        }
      );

      return response;
    } catch (error) {
      console.error("Error creating Stripe session:", error);
      return error;
    }
  };

  const getStripePaymentMethodsTest = async (sessionData) => {
    try {
      const response = await axios.post(
        "https://api.stripe.com/v1/checkout/sessions",
        new URLSearchParams({
          success_url: `${FROENTEND_URL}/managefunds`,
          cancel_url: `${FROENTEND_URL}/managefunds`,
          customer: "cus_RLeMvIAmoEpZWP",
          "line_items[0][price_data][currency]": "usd",
          "line_items[0][price_data][product_data][name]":
            "prod_RLG46nPWKIzYG6",
          "line_items[0][price_data][unit_amount]": "100",
          "line_items[0][quantity]": "1",
          mode: "payment",
          "payment_method_options[card][setup_future_usage]": "off_session",
          "payment_method_types[0]": "card",
          "payment_method_types[1]": "us_bank_account",
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${VITE_STRIPE_SECRET_KEY}`, // Replace with your actual secret key
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating Stripe session:", error);
      return error.response?.data || error.message;
    }
  };

  const getPaymentApprovalEstimates = async (clientId) => {
    try {
      const token = sessionStorage.getItem("token"); // Fetch the token from sessionStorage
      const response = await axios.get(
        `${API_URL}/${encryptData(clientId)}/get_approval_estimate_data`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; // Return the relevant data from the response
    } catch (error) {
      // Log and return the error in case of failure
      console.error("Error fetching payment approval estimates:", error);
      return { status: "error", message: error.message };
    }
  };

  const sendApprovalEstimateData = async (clientId, approvalData) => {
    try {
      const token = sessionStorage.getItem("token"); // Fetch the token from sessionStorage

      const response = await axios.post(
        `${API_URL}/${clientId}/send_approval_estimate`,
        approvalData, // Directly sending the list of approval data
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle response here
      // console.log(response.data);
    } catch (error) {
      console.error("Error sending approval estimate data:", error);
    }
  };

  const getBankBalanceDashboard = async (bankId) => {
    try {
      const token = sessionStorage.getItem("token");

      // Make a GET request to the endpoint
      const response = await axios.get(`${API_URL}/bank/balance/${encryptData(bankId)}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return response;
    } catch (error) {
      return error;
    }
  };

  const getClientMinimumFund = async (clientId) => {
    try {
      const token = sessionStorage.getItem("token");

      // Make a GET request to the new endpoint
      const response = await axios.get(
        `${API_URL}/clients/minimum_fund/${encryptData(clientId)}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response;
    } catch (error) {
      return error;
    }
  };

  const enableAutoPay = async (data) => {
    try {
      const clientData =
        JSON.parse(sessionStorage.getItem("client_data")) || {};
      const token = sessionStorage.getItem("token");
      // console.log("data", data);
      const response = await axios.post(
        `${API_URL}/${encryptData(clientData.client_id)}/enable_auto_pay`,
        data.data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response;
    } catch (error) {
      return error;
    }
  };

  const disableAutoPay = async (client_id) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/${client_id}/disable_auto_pay`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      return error;
    }
  };

  const getNotifications = async (limit, offset) => {
    try {
      const token = sessionStorage.getItem("token");

      const response = await axios.get(`${API_URL}/notifications`, {
        params: {
          limit: limit,
          offset: offset,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return error;
    }
  };

  const deleteNotification = async (notification_id) => {
    try {
      const token = sessionStorage.getItem("token");

      const response = await axios.delete(`${API_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { notification_ids: [notification_id] },
      });

      return response.data;
    } catch (error) {
      return error.response?.data || error;
    }
  };

  const clearAllNotifications = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.patch(
        `${API_URL}/notifications/clear-all`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return error.response?.data || error;
    }
  };

  const getActionNeeded = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${API_URL}/notifications/actions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error.response?.data || error;
    }
  };

  const getUtilizedCases = async (clientId) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${API_URL}/utilized_cases`, {
        params: {
          encrypted_client_id: encryptData(clientId),
          // client_id: clientId,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // Return the response data
    } catch (error) {
      return error; // Return error details
    }
  };

  const getUtilizedBalance = async (clientId) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${API_URL}/utilized`, {
        params: {
          encrypted_client_id: encryptData(clientId),
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch utilized balance:", error.message);
      return error; // Default value on error
    }
  };

  const getAllocatedBalance = async (clientId) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${API_URL}/allocated`, {
        params: {
          encrypted_client_id: encryptData(clientId),
          // client_id: clientId,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // Return the allocated amount or default to 0.0
    } catch (error) {
      console.error("Failed to fetch allocated balance:", error.message);
      return error; // Default value on error
    }
  };

  const getEstimatedBilling = async (clientId) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${API_URL}/estimate_current_billing`, {
        params: {
          encrypted_client_id: encryptData(clientId),
          // client_id: clientId,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch estimated billing:", error.message);
      return error;
    }
  };

  const getAllocatedCases = async (clientId) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${API_URL}/allocated_cases`, {
        params: {
          // client_id: encryptData(clientId),
          client_id: clientId,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const convertTrialToPrepaid = async (clientId) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/clients/${clientId}/convert_trial_to_prepaid`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error converting trial to prepaid:", error);
      return error;
    }
  };

  const fetchClientMembers = async (clientId) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/clients/${clientId}/members`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const fetchUserGroups = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${API_URL}/users/all_groups`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const getShareNoteBook = async (clientId) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/sharebox/clients/${(clientId)}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching archived clients:", error);
      return error;
    }
  };

  const getShareBoxSharebox = async (clientId, status = "sharebox") => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/sharebox/clients/${(clientId)}`,
        {
          params: { status },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching archived clients:", error);
      return error;
    }
  };

  const getShareBoxArchived = async (clientId, status = "archived") => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/sharebox/clients/${(clientId)}`,
        {
          params: { status },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching archived clients:", error);
      return error;
    }
  };

  const getShareBoxDetail = async (clientId, sharebox_id) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/sharebox/clients/${(clientId)}/sharebox/${(sharebox_id)}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching archived clients:", error);
      return error;
    }
  };

  const createShareBox = async (clientId, data) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/sharebox/clients/${(clientId)}`,
        data,
        {
          headers: {
            "Content-Type": " multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Error fetching archived clients:", error);
      return error;
    }
  };

  const updateShareBox = async (clientId, shareboxId, data) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.patch(
        `${API_URL}/sharebox/clients/${(clientId)}/shareboxid/${(shareboxId)}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Error updating the sharebox:", error);
      return error;
    }
  };

  const updateShareBoxKeyword = async (keywords) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/sharebox/keyword/${encryptData(keywords)}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Error updating the sharebox keyword:", error);
      return error;
    }
  };

  const getRevisionUpdate = async (clientId, shareboxId, revisionId, data) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(`${API_URL}/sharebox/clients/${clientId}/sharebox/${shareboxId}/revision/${revisionId}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return response;
    } catch (error) {
      console.error("Error updating the sharebox keyword:", error);
      return error;
    }
  };

  const updateShareBoxFileLog = async (fileId) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${API_URL}/sharebox/file/log/${fileId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return response;
    } catch (error) {
      console.error("Error updating the sharebox file log:", error);
      return error;
    }
  };


  const downloadShareBoxFile = async (filepath, file_id) => {
    let url = `${API_URL}/sharebox/download?file_path=${encodeURIComponent(filepath[0])}&file_id=${encodeURIComponent(file_id[0])}`;

    if (file_id) {
      url += `&file_id=${encodeURIComponent(file_id)}`;
    }

    const token = sessionStorage.getItem("token");
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      })
      .then((response) => {
        const contentDisposition = response.headers["content-disposition"];
        let fileName;
        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
          if (fileNameMatch && fileNameMatch[1]) {
            fileName = fileNameMatch[1];
          }
        }
        if (!fileName) {
          fileName = filepath.split("/").pop();
        }
        const blobUrl = window.URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success(`File Downloaded Successfully`);
        window.URL.revokeObjectURL(blobUrl);
      })
      .catch((error) => {
        if (error.response) {
          toast.error(
            `Error: ${error.response.data.detail || "Failed to download file."}`
          );
        } else if (error.request) {
          toast.error(
            `Error: No response from server. Please try again later.'}`
          );
        } else {
          toast.error(`Unexpected error: ${error.message}`);
        }
      });
  };


  const client_data = sessionStorage.getItem("client_data");
  let client_id = null;

  // Parse client_id from sessionStorage if available
  if (client_data && client_data !== "null") {
    client_id = JSON.parse(client_data).client_id;
  }
  const userinformation = {
    clientId: client_id,
  };

  const getInvoice = async (clientId) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/clients/${clientId}/invoice/entrust1`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getPreviousInvoice = async (clientId) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/clients/${clientId}/previous/invoices/entrust1`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      return error;
    }
  };

  const handleDownloadFile = (filepath, file_id = null, route = "download") => {
    // let url = `${API_URL}/download?file_path=${encryptData(encodeURIComponent(filepath))}`;
    let url = `${API_URL}/${route}?file_path=${encryptData(filepath)}`;
    console.log("url for downloading is: "+ url);
    if (file_id) {
      url += `&file_id=${file_id}`;
    }

    const token = sessionStorage.getItem("token");
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      })
      .then((response) => {
        const contentDisposition = response.headers["content-disposition"];
        let fileName;
        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(/filename="?(.+)""?/);
          if (fileNameMatch && fileNameMatch[1]) {
            fileName = fileNameMatch[1];
          }
        }
        if (!fileName) {
          fileName = filepath.split("/").pop();
        }
        const blobUrl = window.URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success(`File Downloaded Successfully`);
        window.URL.revokeObjectURL(blobUrl);
      })
      .catch((error) => {
        if (error.response) {
          toast.error(
            `Error: ${error.response.data.detail || "Failed to download file."}`
          );
        } else if (error.request) {
          toast.error(
            `Error: No response from server. Please try again later.'}`
          );
        } else {
          toast.error(`Unexpected error: ${error.message}`);
        }
      });
  };

  // For demonstration, using fetch; you can use axios as well

async function getDefaultPaymentMethod(clientId) {
  try {
    const response = await fetch(`/fund/${clientId}/default_payment_method`, {
      method: 'GET',
      credentials: 'include', // if cookies or tokens are required
    });
    if (!response.ok) throw new Error('Failed to fetch default payment method');
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function setDefaultPaymentMethod(clientId, paymentMethodId) {
  try {
    const response = await fetch(`/fund/${clientId}/default_payment_method?payment_method_id=${paymentMethodId}`, {
      method: 'POST',
      credentials: 'include', // if cookies or tokens are required
    });
    if (!response.ok) throw new Error('Failed to set default payment method');
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}


  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userdetails,
        checkTokenExpiration,
        loginWithEmail,
        forgotPassword,
        register,
        logout,
        getAllProjects,
        createProject,
        getSingleProject,
        updateProject,
        getAllClients,
        getAllCases,
        createCase,
        getSingleCase,
        updateCase,
        uploadFile,
        getAllUsers,
        getManageableRoles,
        getMasterScreen,
        updateMasterScreen,
        getClientMember,
        getClientRelatedRoles,
        getMyClients,
        getUserManageableRoles,
        getAllRoles,
        getArchivedClients,
        userDetailsById,
        updateClientInformation,
        chartInformationDetails,
        createPassword,
        getAllPermissions,
        getRoleAndPermission,
        updateRoleAndPermission,
        getAllUser,
        updateUserRoleAndPermission,
        checkLdapUser,
        createCaseForLatestProject,
        getAllCasesByClientID,
        removeClientMember,
        suspendClientMember,
        activateClientMember,
        addClientMember,
        searchEntities,
        updateClientSettings,
        updateClientSetup,
        getProjects,
        getClientSettings,
        getClients,
        approvalUser,
        getManagers,
        rejectUser,
        resendVerificationEmail,
        approveUserProfile,
        restPassword,
        checkUsernameAvailability,
        checkOrganizationAvailability,
        getUserDetails,
        checkCaseNameAvailability,
        updateUserDetails,
        getCaseCount,
        getAutopayDetails,
        getToBePaidInvoices,
        getBankTransactions,
        getStripePaymentMethods,
        getStripePaymentMethodsLink,
        getStripePaymentMethodsTest,
        getPaymentApprovalEstimates,
        sendApprovalEstimateData,
        getBankBalanceDashboard,
        getClientMinimumFund,
        enableAutoPay,
        getNotifications,
        deleteNotification,
        clearAllNotifications,
        getActionNeeded,
        getUtilizedCases,
        getUtilizedBalance,
        getAllocatedBalance,
        getEstimatedBilling,
        getAllocatedCases,
        disableAutoPay,
        convertTrialToPrepaid,
        syncSessionStorage,
        fetchClientMembers,
        fetchUserGroups,
        getShareNoteBook,
        getShareBoxSharebox,
        getShareBoxArchived,
        getShareBoxDetail,
        createShareBox,
        updateShareBox,
        updateShareBoxKeyword,
        getRevisionUpdate,
        updateShareBoxFileLog,
        downloadShareBoxFile,
        userinformation,
        getInvoice,
        getPreviousInvoice,
        getProjectOverview,
        handleDownloadFile,
        setDefaultPaymentMethod,
        getDefaultPaymentMethod,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

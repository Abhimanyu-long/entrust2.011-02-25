import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { roleConfig } from '../config/roleConfig'
import { jwtDecode } from 'jwt-decode';

const Protected = ({ component: Component, componentName }) => {
  const { isAuthenticated, userdetails } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      const timeLeftInSeconds = decodedToken.exp - currentTime;

      if (timeLeftInSeconds <= 0) {
        // Token is expired
        navigate("/login");
        return;
      }

      // Fetch allowed roles for the component from the config
      const allowedRoles = roleConfig[componentName] || [];
      
      // Retrieve roles either from userdetails or sessionStorage
      const userRoles = userdetails?.roles?.map((role) => role.role_name) || JSON.parse(sessionStorage.getItem("roles"))?.map((role) => role.role_name) || [];
      
      // Check if the user has access
      const hasAccess = allowedRoles.some((role) => userRoles.includes(role));

      if (!hasAccess) {
        // Redirect to a not authorized page if the user does not have the required role
        navigate("/not-authorized");
      }
    } else {
      // No token found
      navigate("/login");
    }
  }, [navigate, componentName, userdetails]);

  if (isAuthenticated) {
    return <Component />;
  }

  return null;
};

export default Protected;

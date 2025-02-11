// src/components/RoleBasedElement.jsx

import React from 'react';
import { useAuth } from '../../../context/AuthContext';

const RoleBasedElement = ({ allowedRoles, exclusiveRoles = false, rolePriority = ['admin69', 'admin', 'client', 'user'], children }) => {
  const { userdetails } = useAuth();

  // Get user roles from context
  const userRoles = userdetails?.roles?.map((role) => role.role_name) || [];

  // Function to determine if user has access based on exclusive role logic
  const hasAccess = () => {
    if (exclusiveRoles) {
      // If exclusiveRoles is true, allow access only if the user has exactly one of the allowed roles
      return allowedRoles.filter((role) => userRoles.includes(role)).length === 1;
    }
    // Otherwise, allow access if the user has any of the allowed roles
    return allowedRoles.some((role) => userRoles.includes(role));
  };

  // Function to get the highest priority role the user has
  const getHighestPriorityRole = () => {
    for (let role of rolePriority) {
      if (userRoles.includes(role)) {
        return role;
      }
    }
    return null;
  };

  // Determine access based on role priority if not using exclusive logic
  const userHighestRole = getHighestPriorityRole();
  if (!exclusiveRoles && userHighestRole && allowedRoles.includes(userHighestRole)) {
    return children;
  }

  // Determine access based on exclusive logic
  return hasAccess() ? children : null;
};

export default RoleBasedElement;

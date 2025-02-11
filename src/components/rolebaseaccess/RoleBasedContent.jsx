// src/components/RoleBasedContent.jsx

import React from 'react';
import { useAuth } from '../../../context/AuthContext';

const RoleBasedContent = ({
  roleContentMap = {},
  defaultContent = null,
  exclusiveRoles = false, // Control exclusive role-based access
  rolePriority = ['admin69', 'admin', 'client', 'user'], // Define role hierarchy
  ...props
}) => {
  const { userdetails } = useAuth();
  
  // Get user roles from the userdetails
  const userRoles = userdetails?.roles?.map((role) => role.role_name) || [];

  // Function to determine if any of the allowed roles match the user's roles
  const hasRole = (allowedRoles) => {
    if (exclusiveRoles) {
      // If exclusiveRoles is true, return true only if the user has exactly one of the allowed roles
      return allowedRoles.filter(role => userRoles.includes(role)).length === 1;
    }
    // Otherwise, return true if the user has any of the allowed roles
    return allowedRoles.some(role => userRoles.includes(role));
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

  // Handle the role priority feature
  const userHighestRole = getHighestPriorityRole();
  if (userHighestRole) {
    const priorityContent = roleContentMap[userHighestRole];
    if (priorityContent) {
      return priorityContent;
    }
  }

  // Handle the mapping feature (roleContentMap)
  for (let [roles, content] of Object.entries(roleContentMap)) {
    const allowedRoles = roles.split(',').map(role => role.trim());
    if (hasRole(allowedRoles)) {
      return content;
    }
  }

  // Handle the declarative props-based feature
  for (let prop in props) {
    if (prop.includes('role')) {
      const roleKey = prop.replace('role', '').toLowerCase();
      const allowedRoles = roleKey.split(',').map(role => role.trim());

      // Check if any of the user's roles match
      if (hasRole(allowedRoles)) {
        return props[prop];
      }
    }
  }

  // Default return if no matching roles found (optional)
  return defaultContent;
};

export default RoleBasedContent;

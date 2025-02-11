import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

export const RolePermission = () => {
  const { getAllRoles, getAllPermissions, getRoleAndPermission, updateRoleAndPermission } = useAuth();
  const [permissions, setPermissions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [rolePermission, setRolePermission] = useState({});
  const [initialRolePermission, setInitialRolePermission] = useState({});
  const [error, setError] = useState(null);
  
  const fetchRoles = async () => {
    try {
      const data = await getAllRoles();
      const response = await getAllPermissions();
      const res = await getRoleAndPermission();
  
      // console.log("getRoleAndPermission ==> ", res);
  
      const formattedRolePermission = res.reduce((acc, rolePerm) => {
        acc[rolePerm.role_id] = rolePerm.permissions.reduce((permAcc, perm) => {
          const permission = response.permissions.find(
            (p) => p.permission_name === perm
          );
          if (permission) {
            permAcc[permission.permission_id] = true;
          }
          return permAcc;
        }, {});
        return acc;
      }, {});
  
      // Store a copy of the initial permissions
      setInitialRolePermission(JSON.parse(JSON.stringify(formattedRolePermission)));
  
      setRolePermission(formattedRolePermission);
      setPermissions(response.permissions || []);
      setRoles(data.roles || []);
    } catch (err) {
      setError(err.message);
    }
  };
  
  useEffect(() => {
    fetchRoles();
  }, [updateRoleAndPermission,getAllRoles]);
  
  const handleRoleChanges = async () => {
    try {
      const updatedRoles = roles.map((role) => {
        const roleId = role.role_id;
        const initialPermissions = initialRolePermission[roleId] || {};
        const currentPermissions = rolePermission[roleId] || {};
  
        const initialPermissionIds = Object.keys(initialPermissions).filter(
          (permissionId) => initialPermissions[permissionId]
        );
        const currentPermissionIds = Object.keys(currentPermissions).filter(
          (permissionId) => currentPermissions[permissionId]
        );
  
        const getPermissionNames = (permissionIds) =>
          permissionIds
            .map((id) => {
              const perm = permissions.find(
                (permission) => permission.permission_id === parseInt(id)
              );
              return perm ? perm.permission_name : null;
            })
            .filter(Boolean);
  
        const initialPermissionNames = getPermissionNames(initialPermissionIds);
        const currentPermissionNames = getPermissionNames(currentPermissionIds);
  
        const add_permissions = currentPermissionNames.filter(
          (perm) => !initialPermissionNames.includes(perm)
        );
        const remove_permissions = initialPermissionNames.filter(
          (perm) => !currentPermissionNames.includes(perm)
        );
  
        return {
          role_id: roleId,
          add_permissions,
          remove_permissions,
        };
      });
  
      // return only which have add and remove roleid 
      const changedRoles = updatedRoles.filter(
        (role) => role.add_permissions.length > 0 || role.remove_permissions.length > 0
      );
  
      if (changedRoles.length === 0) {
        toast("No changes to update.");   
        return;
      }
  
      const dataToSend = { roles: changedRoles };
  
      // console.log("This is the data being sent to the server:", dataToSend);
  
      const updateRoleAndResponse = await updateRoleAndPermission(dataToSend);
  
      // console.log("Updated role permissions:", dataToSend);
      toast.success("Role permissions updated successfully!");
    } catch (error) {
      console.error("Error updating role permissions:", error);
      toast.error("Failed to update role permissions. Please try again.");
    }
  };

  const handleCheckboxChange = (roleId, permissionId) => {
    setRolePermission((prev) => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [permissionId]: !prev[roleId]?.[permissionId],
      },
    }));
  };
  
  if (error) {
    return <div>Error: {error}</div>;
  }
  
  if (!roles.length || !permissions.length) {
    return  <div className="d-flex justify-content-center align-items-center vh-100">
    <span className="loader"></span>
  </div>;
  }
  
  // console.log("this is permissions  ==>", permissions);
  // console.log("this is roles  ==>", roles);
  // console.log("this is rolePermission ==>", rolePermission);


  return (
    <>
   <div className="card">
  <div
    className="card-header card-header-stretch border-bottom border-gray-200"
    style={{
      backgroundColor: "#0098CA",
      borderRadius: "8px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      padding: "16px",
    }}
  >
    <h3 className="fw-bold m-0" style={{ color: "#ffffff", fontSize: "1.5rem" }}>
      Role Permission Manager
    </h3>
    <button
      className="btn btn-sm btn-primary"
      onClick={handleRoleChanges}
      style={{
        padding: "8px 16px",
        borderRadius: "4px",
      }}
    >
      Save
    </button>
  </div>
  
  <div className="tab-content">
    <div
      id="nit_billing_months"
      className="card-body p-0 tab-pane fade active show"
      role="tabpanel"
      aria-labelledby="nit_billing_months"
    >
      <div className="table-responsive">
      <div style={{ overflowX: "auto" }}>
  <table className="table table-row-bordered align-middle gy-4 gs-9">
    <thead className="border-bottom border-gray-200 fs-6 text-gray-600 fw-bold bg-light bg-opacity-75">
      <tr>
        <th
          className="min-w-150px text-start"
          style={{
            position: "sticky",
            left: 0,
            zIndex: 2,
            background: "#f8f9fa", // Match header background
          }}
        >
          Role
        </th>
        {permissions.map((permission) => (
          <th
            key={permission.permission_id}
            className="min-w-150px text-center"
            style={{ width: "auto" }}
          >
            {permission.permission_name
              .replace(/_/g, " ")
              .replace(/\b\w/g, (char) => char.toUpperCase())}
          </th>
        ))}
      </tr>
    </thead>
    <tbody className="fw-semibold text-gray-600">
      {roles.map((role) => (
        <tr key={role.role_id}>
          <td
            className="text-start"
            style={{
              position: "sticky",
              left: 0,
              background: "#fff", // Match body row background
              zIndex: 1,
            }}
          >
            {role.role_name
              .replace(/_/g, " ")
              .replace(/\b\w/g, (char) => char.toUpperCase())}
          </td>
          {permissions.map((permission) => (
            <td key={permission.permission_id} className="text-center">
              <input
                className="h-20px w-20px"
                type="checkbox"
                checked={
                  rolePermission[role.role_id]?.[permission.permission_id] ||
                  false
                }
                onChange={() =>
                  handleCheckboxChange(role.role_id, permission.permission_id)
                }
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
</div>

      </div>
    </div>
  </div>

  <div className="d-flex justify-content-end m-2">
    <button
      className="btn btn-sm btn-primary"
      onClick={handleRoleChanges}
      style={{
        padding: "8px 16px",
        borderRadius: "4px",
      }}
    >
      Save
    </button>
  </div>
</div>


      <Toaster />
    </>
  );
};





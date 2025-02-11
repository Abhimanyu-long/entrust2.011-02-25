import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";

export const UserManager = () => {
  const { getAllRoles, getAllUser, updateUserRoleAndPermission } = useAuth();

  const [roles, setRoles] = useState([]);
  const [user, setUser] = useState([]);
  const [error, setError] = useState(null);
  const [originalUserRoles, setOriginalUserRoles] = useState({});
  const [updatedUserRoles, setUpdatedUserRoles] = useState({});
  const [roleIdNameMap, setRoleIdNameMap] = useState({});

  const fetchRoles = async () => {
    try {
      const data = await getAllRoles();
      const response = await getAllUser();
      setUser(response || []);
      setRoles(data.roles || []);

      setRoleIdNameMap(
        data.roles.reduce((acc, role) => {
          acc[role.role_id] = role.role_name;
          return acc;
        }, {})
      );

      const initialUserRoles = {};
      response.forEach((user) => {
        initialUserRoles[user.user_id] = user.user_roles
          .filter((role) => role.role_id !== null)
          .map((role) => role.role_id);
      });
      setOriginalUserRoles(initialUserRoles);
      setUpdatedUserRoles(initialUserRoles);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleCheckboxChange = (e, userId, roleId) => {
    const isChecked = e.target.checked;

    setUpdatedUserRoles((prev) => {
      const userRoles = prev[userId] || [];

      if (isChecked) {
        // Add role if checked
        return {
          ...prev,
          [userId]: [...userRoles, roleId],
        };
      } else {
        // Remove role if unchecked
        return {
          ...prev,
          [userId]: userRoles.filter((id) => id !== roleId),
        };
      }
    });
  };

  const handleRoleChanges = async () => {
    try {
      const updates = Object.keys(updatedUserRoles).map((userId) => {
        const originalRoles = originalUserRoles[userId] || [];
        const updatedRoles = updatedUserRoles[userId] || [];

        const addedRoleIds = updatedRoles.filter((roleId) => !originalRoles.includes(roleId));
        const removedRoleIds = originalRoles.filter((roleId) => !updatedRoles.includes(roleId));

        const add_roles = addedRoleIds.map((id) => roleIdNameMap[id]);
        const remove_roles = removedRoleIds.map((id) => roleIdNameMap[id]);

        return {
          user_id: parseInt(userId),
          add_roles,
          remove_roles,
        };
      });

      // Filter out users who don't have any changes (no added or removed roles)
      const changedUsers = updates.filter(
        (update) => update.add_roles.length > 0 || update.remove_roles.length > 0
      );

      if (changedUsers.length === 0) {
        toast("No changes to update.");
        return;
      }

      const requestBody = { updates: changedUsers };

      // console.log("This is the data being sent to the server:", requestBody);

      // Call the function to update the roles
      await updateUserRoleAndPermission(requestBody);

      // console.log("Updated user roles:", requestBody);
      toast.success("User roles updated successfully!");

      // Optionally update local state
      setOriginalUserRoles({ ...updatedUserRoles });
    } catch (error) {
      console.error("Error updating user roles:", error);
      toast.error("Failed to update user roles. Please try again.");
    }
  };


  // console.log("===this is for user ===> ", user);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!roles.length || !user.length) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="card">
        <div
          className="card-header cursor-pointer"
          style={{
            backgroundColor: "#0098CA",
            borderRadius: "8px",
            // padding: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="card-title m-0">
            <h3 className="fw-bold m-0" style={{ color: "#ffffff", fontSize: "1.5rem" }}>
              User Role Manager
            </h3>
          </div>
          {/* <a
      onClick={() => setIsEditing(true)}
      className="btn btn-sm"
      style={{
        backgroundColor: "#ffffff",
        color: "#0098CA",
        border: "2px solid #0098CA",
        borderRadius: "10px",
        padding: "8px 16px",
        transition: "background-color 0.3s ease, color 0.3s ease",
        fontWeight: "bold",
        textDecoration: "none",
        display: "inline-block",
      }}
      aria-label="Edit Project"
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#0098CA";
        e.currentTarget.style.color = "#ffffff";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#ffffff";
        e.currentTarget.style.color = "#0098CA";
      }}
    >
      Edit
    </a> */}
          <div className="d-flex justify-content-end">
            <a
              className="btn btn-primary align-self-center m-2"
              style={{
                backgroundColor: "#ffffff",
                border: "2px solid #0098CA", // Added border for better visibility
                color: "#0098CA",
                fontWeight: "bold",
                padding: "10px 20px",
                borderRadius: "12px",
                transition: "background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease", // Added transition for border color
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#b5e4f3"; // Darker background on hover
                e.currentTarget.style.color = "#ffffff"; // Change text color on hover
                e.currentTarget.style.borderColor = "#ffffff"; // Change border color on hover
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#b5e4f3"; // Reset background on mouse leave
                e.currentTarget.style.color = "#0098CA"; // Reset text color on mouse leave
                e.currentTarget.style.borderColor = "#0098CA"; // Reset border color on mouse leave
              }}
              onClick={handleRoleChanges}
            >
              Save
            </a>

          </div>

        </div>

        <div className="tab-content pt-3 bg-light">
          <div
            id="nit_billing_months"
            className="card-body p-0 tab-pane fade active show"
            role="tabpanel"
            aria-labelledby="nit_billing_months"
          >
            <div className="table-responsive bg-light">
              <div style={{ overflowX: "auto" }}>
                <table className="table table-row-bordered table-bordered align-middle gy-4 gs-9 bg-light">
                  <thead className="border-bottom fs-6 text-gray-600 fw-bold bg-light">
                    <tr>
                      <td
                        className="min-w-150px bg-light"
                        style={{
                          position: "sticky",
                          left: 0,
                          zIndex: 2,
                          background: "#f8f9fa",
                        }}
                      >
                        User
                      </td>
                      {roles.map((role) => (
                        <td
                          key={role.role_id}
                          className="min-w-150px"
                          style={{ width: "auto" }}
                        >
                          {role.role_name
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (char) => char.toUpperCase())}
                        </td>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="fw-semibold text-gray-600 bg-light">
                    {user.map((user) => {
                      const userRoleIds = updatedUserRoles[user.user_id] || [];
                      return (
                        <tr key={user.user_id}>
                          <td
                            style={{
                              position: "sticky",
                              left: 0,
                              background: "#fff", // Ensure the background color matches your body row color
                              zIndex: 1,
                            }}
                            className="bg-light"
                          >
                            {user.user_name
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (char) => char.toUpperCase())}
                          </td>
                          {roles.map((role) => {
                            const hasRole = userRoleIds.includes(role.role_id);
                            return (
                              <td key={role.role_id} className="text-center align-middle">
                                <input
                                  className="h-20px w-20px "
                                  type="checkbox"
                                  checked={hasRole}
                                  onChange={(e) =>
                                    handleCheckboxChange(e, user.user_id, role.role_id)
                                  }
                                />
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end">
          <a
            className="btn btn-primary align-self-center m-2"
            style={{
              backgroundColor: "#0098CA",
              border: "none",
              color: "#fff",
              fontWeight: "bold",
              padding: "10px 20px",
              borderRadius: "10px",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#007BAA";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#0098CA";
            }}
            onClick={handleRoleChanges}
          >
            <b>Save</b>
          </a>
        </div>
      </div>


      <Toaster />

    </>
  );
};









{/* <table className="table table-row-bordered align-middle gy-4 gs-9">
          <thead className="border-bottom border-gray-200 fs-6 text-gray-600 fw-bold bg-light bg-opacity-75">
            <tr>
              <td className="min-w-150px">User</td>
              {roles.map((role) => (
                <td key={role.role_id} className="min-w-150px" style={{ width: "auto" }}>
                  {role.role_name
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (char) => char.toUpperCase())}
                </td>
              ))}
            </tr>
          </thead>
          <tbody className="fw-semibold text-gray-600">
            {user.map((user) => {
              const userRoleIds = updatedUserRoles[user.user_id] || [];
              return (
                <tr key={user.user_id}>
                  <td>
                    {user.user_name
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (char) => char.toUpperCase())}
                  </td>
                  {roles.map((role) => {
                    const hasRole = userRoleIds.includes(role.role_id);
                    return (
                      <td key={role.role_id}>
                        <input
                          className="h-20px w-20px"
                          type="checkbox"
                          checked={hasRole}
                          onChange={(e) => handleCheckboxChange(e, user.user_id, role.role_id)}
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table> */}
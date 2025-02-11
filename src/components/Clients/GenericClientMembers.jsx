import React, { useState, useEffect } from "react";
import GenericPage from "../genericpage/GenericPage";
import { Button } from "primereact/button";
import axios from "axios";

const API_URL =
  import.meta.env.VITE_BASE_URL + ":" + import.meta.env.VITE_BASE_PORT;

const GenericClientMembers = () => {
  const [tabData, setTabData] = useState([]);
  const clientId = JSON.parse(sessionStorage.getItem("client_data")).client_id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const baseURL = `${API_URL}/clients/${clientId}/members`;

        const [activeMembersResponse, suspendedMembersResponse] =
          await Promise.all([
            axios.get(`${baseURL}?status=active`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${baseURL}?status=suspended`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        const activeMembers = activeMembersResponse.data || [];
        const suspendedMembers = suspendedMembersResponse.data || [];

        setTabData([
          {
            label: "Active Members",
            data: activeMembers,
            columns: getColumns(),
          },
          {
            label: "Suspended Members",
            data: suspendedMembers,
            columns: getColumns(),
          },
        ]);
      } catch (error) {
        console.error("Error fetching members:", error.message);
      }
    };

    fetchData();
  }, []);

  const handleSuspendMember = async (memberId) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        `${API_URL}/clients/${clientId}/members/${memberId}/suspend`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTabData((prevTabData) => {
        const updatedActive = prevTabData[0].data.filter(
          (member) => member.user_id !== memberId
        );
        const suspendedMember = prevTabData[0].data.find(
          (member) => member.user_id === memberId
        );
        return [
          { ...prevTabData[0], data: updatedActive },
          {
            ...prevTabData[1],
            data: [...prevTabData[1].data, suspendedMember],
          },
        ];
      });
    } catch (error) {
      console.error("Error suspending member:", error.message);
    }
  };

  const handleActivateMember = async (memberId) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        `${API_URL}/clients/${clientId}/members/${memberId}/activate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTabData((prevTabData) => {
        const updatedSuspended = prevTabData[1].data.filter(
          (member) => member.user_id !== memberId
        );
        const activatedMember = prevTabData[1].data.find(
          (member) => member.user_id === memberId
        );
        return [
          {
            ...prevTabData[0],
            data: [...prevTabData[0].data, activatedMember],
          },
          { ...prevTabData[1], data: updatedSuspended },
        ];
      });
    } catch (error) {
      console.error("Error activating member:", error.message);
    }
  };

  const getColumns = () => [
    {
      field: "username",
      header: "Username",
      sortable: true,
      filter: true,
    },
    {
      field: "roles",
      header: "Roles",
      sortable: false,
      filter: false,
      body: (rowData) => rowData.roles.join(", "),
    },
    {
      field: "job_title",
      header: "Job Title",
      sortable: true,
      filter: true,
    },
    {
      header: "Actions",
      body: (rowData) => (
        <div>
          {rowData.is_suspended ? (
            <Button
              label="Activate"
              icon="pi pi-user-check "
              className="p-button-success"
              onClick={() => handleActivateMember(rowData.user_id)}
            />
          ) : (
            <Button
              label="Suspend"
              icon="pi pi-ban"
              className="p-button-warning"
              onClick={() => handleSuspendMember(rowData.user_id)}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="bg-light">
      <GenericPage
        tabs={tabData}
        showPagination={true}
        globalSearchFields={["username", "job_title"]}
        tableName="Client Members"
        className="bg-light"
      />
    </div>
  );
};

export { GenericClientMembers };

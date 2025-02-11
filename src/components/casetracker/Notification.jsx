import React, { useEffect, useRef, useState } from "react";
import { Accordion, Button, Form } from "react-bootstrap";
import "../../assets/css/notification.css"; 
import { useAuth } from "../../../context/AuthContext";

const Notification = ({ selectedUsers = [], onSelectedUsersChange }) => {
  const { getClientMember } = useAuth();
  const bodyRef = useRef(null);

  const [users, setUsers] = useState([]); 


  const handleSelectUser = (user_id) => {
    const updatedSelectedUsers = selectedUsers.includes(user_id)
      ? selectedUsers.filter((user) => user !== user_id)
      : [...selectedUsers, user_id];

    onSelectedUsersChange(updatedSelectedUsers);
  };


  const handleSelectAll = () => {
    const allUserIds = users.map((user) => user.user_id);
    onSelectedUsersChange(allUserIds); 
  };


  const handleDeselectAll = () => {
    onSelectedUsersChange([]); 
  };

  useEffect(() => {
    const fetchMembers = async () => {
      const clientDataString = sessionStorage.getItem("client_data");
      const clientData = JSON.parse(clientDataString);
      const clientIdFromStorage = clientData?.client_id;

      if (!clientIdFromStorage) {
        console.error("Client ID is missing from session storage");
        return;
      }

      try {
        const result = await getClientMember(clientIdFromStorage , {
          get_active:"active"
        });
        // console.log("result== notification ",result);
        if (Array.isArray(result)) {
          setUsers(result);
        } else {
          console.error("Fetched data is not in expected array format:", result);
        }
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    fetchMembers(); 
  }, [getClientMember]);

  return (
    <div className="notifications-container mb-5">
      <Accordion defaultActiveKey="0" className="notification-accordion" ref={bodyRef}>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <b className="fs-6 text-black">Notifications</b>
          </Accordion.Header>
          <Accordion.Body>
            <div className="user-list">
              {Array.isArray(users) && users.length > 0 ? (
                users.map((user, index) => (
                  <Form.Check
                    key={index}
                    type="checkbox"
                    label={user.username} 
                    checked={selectedUsers.includes(user.user_id)}
                    onChange={() => handleSelectUser(user.user_id)} 
                    className="user-checkbox border-1 text-black"
                    style={{ color: "#000" }}
                  />
                ))
              ) : (
                <p>No users found.</p> 
              )}
            </div>
            <div className="action-buttons">
              <Button 
                className="custom-button btn-sm btn text-black" 
                onClick={handleSelectAll} 
                style={{ background: "rgb(79, 201, 218)" }}
              >
                Notify all users
              </Button>
              <Button 
                variant="secondary" 
                className="custom-button ms-2 btn-sm text-black border-1" 
                onClick={handleDeselectAll}
              >
                De-Select All
              </Button>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default Notification;

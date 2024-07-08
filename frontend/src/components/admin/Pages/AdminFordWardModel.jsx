import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../../constants";
import Swal from "sweetalert2"; // Import SweetAlert2 for notifications

const AdminFordWardModel = ({ onCancel, forwardMessage }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const selectedRole = localStorage.getItem("selectRole");
  const sender = localStorage.getItem("CurrentUserId");

  const roleEndpointMap = {
    Admin: "admin/getAllAdmin",
    Employee: "employee/",
    Manager: "manager/getAllManagers",
    "Billing Team": "billingTeam/getAllUsers",
    Accounts: "allUser/getAllAccountantTeam",
    Software: "allUser/getAllSoftwareTeam",
    HR: "allUser/getAllHRTeam",
    "Call Center": "allUser/getAllCallCenterTeam",
    "Virtual Team": "allUser/getAllVirtualTeam",
    "Monitoring Team": "allUser/getAllMonitoringTeam",
    Bouncers: "allUser/getAllBouncersTeam",
    Security: "allUser/getAllSecurityTeam",
    "Digital Marketing": "allUser/getAllDigitalMarketingTeam",
    TE: "allUser/getAllTE",
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const endpoint = roleEndpointMap[selectedRole];
        if (endpoint) {
          const response = await axios.get(`${BASE_URL}/api/${endpoint}`);
          setUsers(response.data);
        }
      } catch (error) {
        console.error(`Error fetching ${selectedRole} data: `, error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [selectedRole]);

  const handleUserSelection = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const getUserDisplayField = (user) => {
    switch (selectedRole) {
      case "Admin":
        return user.email;
      case "Manager":
        return user.manager_name;
      default:
        return user.name;
    }
  };

  const handleForward = () => {
    const endpoint =
      selectedRole === "Admin"
        ? "/api/empadminsender/forward"
        : "/api/empadminsender/forward";
    axios
      .post(`${BASE_URL}${endpoint}`, {
        messageId: forwardMessage._id,
        newRecipients: selectedUsers,
        sender: sender,
      })
      .then((response) => {
        // Handle success response if needed
        console.log("Message forwarded successfully!", response.data);
        Swal.fire({
          icon: "success",
          title: "Message Forwarded",
          text: "The message has been forwarded successfully.",
        });
        onCancel();
      })
      .catch((error) => {
        // Handle error if any
        console.error("Error forwarding message:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to forward the message.",
        });
      });
  };

  const filteredUsers = users?.filter((user) => {
    const query = searchQuery.toLowerCase();
    const roleSpecificField =
      selectedRole === "Admin"
        ? user?.email
        : selectedRole === "Manager"
        ? user?.manager_name
        : user?.name;
    return roleSpecificField?.toLowerCase().includes(query);
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl mb-4">Forward Message To:</h2>
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4 p-2 w-full border border-gray-300 rounded"
        />
        <div className="mb-4 max-h-60 overflow-y-auto">
          {filteredUsers.map((user) => (
            <div key={user._id} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={selectedUsers.includes(user._id)}
                onChange={() => handleUserSelection(user._id)}
              />
              <span className="ml-2">{getUserDisplayField(user)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded mr-2"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleForward}
          >
            Forward
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminFordWardModel;

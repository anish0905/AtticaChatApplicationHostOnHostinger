import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { BASE_URL } from "../../constants";

const ShowAllEmpChat = () => {
  const [selectedRole, setSelectedRole] = useState("Admin");
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

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

  const endpoint = roleEndpointMap[selectedRole];

  localStorage.setItem("selectedRole", selectedRole);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
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
  }, [selectedRole, endpoint]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSelect = (userId, name) => {
    localStorage.setItem("user1", userId);
    localStorage.setItem("user1Name", name);
    setSelectedUserId((prevSelectedUserId) => {
      if (prevSelectedUserId === userId) {
        Swal.fire({
          title: "Deselected",
          text: `User with ID ${userId} has been deselected`,
          icon: "info",
          confirmButtonText: "OK",
        });
        return null;
      } else {
        Swal.fire({
          title: "Selected",
          text: `User with ID ${userId} (${name}) has been selected`,
          icon: "success",
          confirmButtonText: "OK",
        });
        return userId;
      }
    });
  };

  const getRoleSpecificField = (user) => {
    switch (selectedRole) {
      case "Admin":
        return user.email;
      case "Manager":
        return user.manager_name;
      default:
        return user.name;
    }
  };

  const filteredUsers = users?.filter((user) => {
    const query = searchQuery.toLowerCase();
    const roleSpecificField = getRoleSpecificField(user);
    return roleSpecificField?.toLowerCase().includes(query);
  });

  return (
    <div className="flex-grow p-4 w-auto">
      <label
        htmlFor="userRoles"
        className="block font-medium bg-[#5443C3] px-4 py-4 rounded text-white text-xl"
      >
        Select 1st User:
      </label>
      <select
        id="userRoles"
        name="userRoles"
        value={selectedRole}
        onChange={(event) => setSelectedRole(event.target.value)}
        className="mt-1 block lg:text-2xl text-lg font-extrabold pl-3 pr-10 py-2 border-gray-300 focus:outline-none rounded focus:ring-indigo-600 focus:border-indigo-500 sm:text-sm w-full"
      >
        {Object.keys(roleEndpointMap).map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Search users..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="mt-2 block text-xl font-medium pl-3 w-full py-3 bg-slate-200 border-gray-400 focus:outline-none rounded focus:ring-indigo-600 focus:border-indigo-500 sm:text-sm"
      />

      <div className="mt-4 overflow-y-auto" style={{ maxHeight: "750px" }}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="block font-medium px-3 py-1 rounded text-base lg:w-full w-full">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <li
                  key={user._id}
                  className="flex items-center justify-between gap-5 my-4"
                >
                  <p className="text-xl">{getRoleSpecificField(user)}</p>
                  <button
                    className={`px-2 py-1 rounded-md shadow-md text-white ${
                      selectedUserId === user._id
                        ? "bg-blue-700"
                        : "bg-green-700"
                    }`}
                    onClick={() =>
                      handleSelect(user._id, getRoleSpecificField(user))
                    }
                  >
                    {selectedUserId === user._id ? "Selected" : "Select"}
                  </button>
                </li>
              ))
            ) : (
              <p>No users found</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ShowAllEmpChat;

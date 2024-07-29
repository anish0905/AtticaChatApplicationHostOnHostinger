import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../../constants";
import { AiOutlineSearch } from "react-icons/ai";

const FetchAllEmpDeteails = ({ handleClick }) => {
  const [selectedRole, setSelectedRole] = useState("Admin");
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  localStorage.setItem("selectRole", selectedRole);


  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  const [newAdminCountMessage, setNewAdminCountMessage] = useState(() => JSON.parse(localStorage.getItem("newAdminCountMessage") || "[]"));
  const [lastAdminMessageCounts, setLastAdminMessageCounts] = useState(() => JSON.parse(localStorage.getItem("lastAdminMessageCounts") || "[]"));
  const [currentAdminCountMessage, setCurrentAdminCountMessage] = useState(() => JSON.parse(localStorage.getItem("currentAdminCountMessage") || "[]"));


  useEffect(() => {
    const intervalId = setInterval(() => {
      setLastAdminMessageCounts(JSON.parse(localStorage.getItem("lastAdminMessageCounts") || "[]"));
      setNewAdminCountMessage(JSON.parse(localStorage.getItem("newAdminCountMessage") || "[]"));
      setCurrentAdminCountMessage(JSON.parse(localStorage.getItem("currentAdminCountMessage") || "[]"));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);


  const getUnreadCountForUser = (userId) => {
    
    const currentCountMessage = JSON.parse(localStorage.getItem("currentAdminCountMessage") || "[]");
   
    const lastUserMessageCounts = JSON.parse(localStorage.getItem("lastAdminMessageCounts") || "[]");
   
    const currentCount = currentCountMessage.find((user) => user.userId === userId)?.count || 0;
    const lastCount = lastUserMessageCounts.find((user) => user.userId === userId)?.count || 0;
   
    return currentCount - lastCount;
  };

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
    Logistic: "allUser/getAllLogistic"
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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSelect = (userId, name) => {
    localStorage.setItem("user1", userId);
    localStorage.setItem("user1Name", name);
    setSelectedUserId(userId);
    handleClick(userId, name);
    const currentAdminCountMessage = JSON.parse(localStorage.getItem("currentAdminCountMessage") || "[]");
    const lastAdminMessageCounts = JSON.parse(localStorage.getItem("lastAdminMessageCounts") || "[]");

    const updatedLastAdminMessageCounts = lastAdminMessageCounts.map((admin) => {
      if (admin.userId === userId) {
        return { userId: admin.userId, count: currentAdminCountMessage.find((u) => u.userId === userId)?.count || 0 };
      }
      return admin;
    });

    if (!updatedLastAdminMessageCounts.some((admin) => admin.userId === userId)) {
      const currentCount = currentAdminCountMessage.find((u) => u.userId === userId)?.count || 0;
      updatedLastAdminMessageCounts.push({ userId: userId, count: currentCount });
    }

    localStorage.setItem("lastAdminMessageCounts", JSON.stringify(updatedLastAdminMessageCounts));
    setLastAdminMessageCounts(updatedLastAdminMessageCounts);
    setRecipient(userId);
    setRecipientName(name);
    setIsChatSelected(true);
    setSelectedUserId(userId);
    fetchMessages(loggedInUserId, userId);
  };




  const renderUserDetails = () => {
    return (
<ul className="block font-medium px-3 py-1 rounded text-base lg:w-full w-full">
    {sortedFilteredUsers.length > 0 ? (
      sortedFilteredUsers.map((user) => (
        <li
          key={user._id}
          className="w-full flex justify-between h-auto font-medium rounded-md bg-[#eef2fa] text-[#5443c3] mb-4 text-lg  items-center p-4 cursor-pointer"
          onClick={() => handleSelect(user._id, getUserDisplayField(user))}
        >
          <p className="text-xl">{getUserDisplayField(user)}</p>
          <p>
            {user.unreadCount > 0 && (
              <span className="text-red-500 font-bold">
                {user.unreadCount}
              </span>
            )}
          </p>
        </li>
      ))
    ) : (
      <p className="text-red-500">No users found</p>
    )}
  </ul>
    );
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
// Function to sort users based on unread message count
const sortedFilteredUsers = filteredUsers
  .map((user) => ({
    ...user,
    unreadCount: getUnreadCountForUser(user._id),
  }))
  .sort((a, b) => b.unreadCount - a.unreadCount);

  return (
    <div className="flex-grow w-full">
      <select
        id="userRoles"
        name="userRoles"
        value={selectedRole}
        onChange={(event) => setSelectedRole(event.target.value)}
        className="lg:mb-5 mb-3 block lg:text-xl font-bold text-base placeholder:font-extrabold pl-3 pr-10 h-10 border-purple-300 focus:outline-none rounded focus:ring-indigo-600 focus:border-indigo-500 sm:text-sm w-full"
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
        className="w-full h-10 p-2 text-base text-gray-700 rounded-xl pl-10 bg-white border-2 border-[#5443c3] shadow-lg"
      />

      <div className="mt-4 overflow-y-auto" style={{ maxHeight: "700px" }}>
        {loading ? <p>Loading...</p> : renderUserDetails()}
      </div>
    </div>
  );
};

export default FetchAllEmpDeteails;

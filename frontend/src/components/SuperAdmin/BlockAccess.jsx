import React, { useEffect, useState } from "react";
import SuperAdminSidebar from "./SuperAdminSidebar";
import axios from "axios";
import { BASE_URL } from "../../constants";
import Swal from "sweetalert2";

import ShowAllEmpChat from "./ShowAllEmpChat";
import ShowAllEmpChat2 from "./ShowAllEmpChat2";
import ChatModel from "./ChatModel";

const BlockAccess = () => {
  const [selectedRole, setSelectedRole] = useState("Admin");
  const [users, setUsers] = useState([]);
  const [userSend, setUserSend] = useState();
  const [searchQuery, setSearchQuery] = useState("");

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

  const roleEndpointMapBlock = {
    Admin: "admin/accessBlock/",
    Employee: "employeeRegistration/accessBlock/",
    Manager: "manager/accessBlock/",
    "Billing Team": "billingTeam/accessBlock/",
    Accounts: "allUser/accessBlock/",
    Software: "allUser/accessBlock/",
    HR: "allUser/accessBlock/",
    "Call Center": "allUser/accessBlock/",
    "Virtual Team": "allUser/accessBlock/",
    "Monitoring Team": "allUser/accessBlock/",
    Bouncers: "allUser/accessBlock/",
    Security: "allUser/accessBlock/",
    "Digital Marketing": "allUser/accessBlock/",
    TE: "allUser/getAllTE",
  };

  const roleEndpointMapUnblock = {
    Admin: "admin/access/unblock/",
    Employee: "employeeRegistration/access/unblock/",
    Manager: "manager/access/unblock/",
    "Billing Team": "billingTeam/access/unblock/",
    Accounts: "allUser/access/unblock/",
    Software: "allUser/access/unblock/",
    HR: "allUser/access/unblock/",
    "Call Center": "allUser/access/unblock/",
    "Virtual Team": "allUser/access/unblock/",
    "Monitoring Team": "allUser/access/unblock/",
    Bouncers: "allUser/access/unblock/",
    Security: "allUser/access/unblock/",
    "Digital Marketing": "allUser/access/unblock/",
    TE: "allUser/access/unblock/",
  };

  const BlockBranchWise = {
    Admin: "admin/access/blockall",
    Employee: "employeeRegistration/access/blockall",
    Manager: "manager/access/blockall",
    "Billing Team": "billingTeam/access/blockall",
    Accounts: "allUser/access/blockall",
    Software: "allUser/access/blockall",
    HR: "allUser/access/blockall",
    "Call Center": "allUser/access/blockall",
    "Virtual Team": "allUser/access/blockall",
    "Monitoring Team": "allUser/access/blockall",
    Bouncers: "allUser/access/blockall",
    Security: "allUser/access/blockall",
    "Digital Marketing": "allUser/access/blockall",
    TE: "allUser/access/blockall",
  };

  const UnblockBranchWise = {
    Admin: "admin/access/unblock/all",
    Employee: "employeeRegistration/unblock",
    Manager: "manager/access/unblock/all",
    "Billing Team": "billingTeam/access/unblock/all",
    Accounts: "allUser/access/unblock/all",
    Software: "allUser/access/unblock/all",
    HR: "allUser/access/unblock/all",
    "Call Center": "allUser/access/unblock/all",
    "Virtual Team": "allUser/access/unblock/all",
    "Monitoring Team": "allUser/access/unblock/all",
    Bouncers: "allUser/access/unblock/all",
    Security: "allUser/access/unblock/all",
    "Digital Marketing": "allUser/access/unblock/all",
    TE: "allUser/access/unblock/all",
  };

  const endpoint = roleEndpointMap[selectedRole];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (endpoint) {
          const response = await axios.get(`${BASE_URL}/api/${endpoint}`);
          setUsers(response.data);
          setUserSend(response);
        }
      } catch (error) {
        console.error(`Error fetching ${selectedRole} data: `, error);
      }
    };
    fetchUsers();
  }, [selectedRole]);

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = users?.filter((user) => {
    if (selectedRole === "Admin") {
      return user?.email.toLowerCase()?.includes(searchQuery?.toLowerCase());
    } else if (selectedRole === "Manager") {
      return user?.manager_name
        ?.toLowerCase()
        ?.includes(searchQuery?.toLowerCase());
    } else if (selectedRole === "Employee") {
      return user?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    } else if (selectedRole === "Billing Team") {
      return user?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    } else {
      return user?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    }
  });

  const handleBlock = async (userId) => {
    try {
      const endpoint = roleEndpointMapBlock[selectedRole];
      await axios.put(`${BASE_URL}/api/${endpoint}${userId}`);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, access: false } : user
        )
      );
      Swal.fire({
        title: "Blocked!",
        text: "The user has been blocked successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error(`Error blocking user: ${error}`);
      Swal.fire({
        title: "Error!",
        text: "There was an error blocking the user.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleUnblock = async (userId) => {
    try {
      const endpoint = roleEndpointMapUnblock[selectedRole];
      await axios.put(`${BASE_URL}/api/${endpoint}${userId}`);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, access: true } : user
        )
      );
      Swal.fire({
        title: "Unblocked!",
        text: "The user has been unblocked successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error(`Error unblocking user: ${error}`);
      Swal.fire({
        title: "Error!",
        text: "There was an error unblocking the user.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const BlockBranchWisefun = async () => {
    try {
      const endpoint = BlockBranchWise[selectedRole];
      await axios.put(`${BASE_URL}/api/${endpoint}`);
      setUsers((prevUsers) =>
        prevUsers.map((user) => ({ ...user, access: false }))
      );
      Swal.fire({
        title: "All Users Blocked!",
        text: "All users have been blocked successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error(`Error blocking users: ${error}`);
      Swal.fire({
        title: "Error!",
        text: "There was an error blocking all users.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const UnblockBranchWisefun = async () => {
    try {
      const endpoint = UnblockBranchWise[selectedRole];
      await axios.put(`${BASE_URL}/api/${endpoint}`);
      setUsers((prevUsers) =>
        prevUsers.map((user) => ({ ...user, access: true }))
      );
      Swal.fire({
        title: "All Users Unblocked!",
        text: "All users have been unblocked successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error(`Error unblocking users: ${error}`);
      Swal.fire({
        title: "Error!",
        text: "There was an error unblocking all users.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="lg:flex block">
      <SuperAdminSidebar />
      <div className="flex-grow p-4 lg:w-1/4 w-full">
        <label
          htmlFor="userRoles"
          className="block font-medium bg-[#5443C3] px-4 py-4 rounded text-white text-xl "
        >
          Select Role:
        </label>
        <select
          id="userRoles"
          name="userRoles"
          value={selectedRole}
          onChange={handleRoleChange}
          className="mt-1 block lg:text-2xl text-lg font-extrabold pl-3 w-full py-2 border-gray-300 focus:outline-none rounded focus:ring-indigo-600 focus:border-indigo-500 sm:text-sm "
        >
          <option value="Admin">Admin</option>
          <option value="Employee">Employee</option>
          <option value="Manager">Manager</option>
          <option value="Billing Team">Billing Team</option>
          <option value="Accounts">Accounts</option>
          <option value="Software">Software</option>
          <option value="HR">HR</option>
          <option value="Call Center">Call Center</option>
          <option value="Virtual Team">Virtual Team</option>
          <option value="Monitoring Team">Monitoring Team</option>
          <option value="Bouncers">Bouncers/Divers</option>
          <option value="Security">Security/CCTV</option>
          <option value="Digital Marketing">Digital Marketing</option>
          <option value="TE">TE</option>
        </select>
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="mt-2 block text-xl font-medium pl-3 w-full py-3 bg-slate-200 border-gray-400 focus:outline-none rounded focus:ring-indigo-600 focus:border-indigo-500 sm:text-sm "
        />
        <div className="flex gap-4 mt-4">
          <button
            className="bg-red-700 px-4 py-2 rounded-md shadow-md text-white"
            onClick={BlockBranchWisefun}
          >
            Block All
          </button>
          {/* <button
                        className='bg-green-700 px-4 py-2 rounded-md shadow-md text-white'
                        onClick={UnblockBranchWisefun}>
                        Unblock All
                    </button> */}
        </div>
        <div className="mt-4 overflow-y-auto " style={{ maxHeight: "750px" }}>
          <ul className="block font-medium px-3 py-1 rounded text-base lg:w-full w-full">
            {filteredUsers.map((user) => (
              <li
                key={user._id}
                className="flex items-center justify-between gap-5 my-4"
              >
                {selectedRole === "Admin" ? (
                  <p className="text-xl">{user.email}</p>
                ) : selectedRole === "Manager" ? (
                  <p className="text-xl">{user.manager_name}</p>
                ) : (
                  <p className="text-xl">{user.name}</p>
                )}
                <div className="flex items-center justify-between gap-2 text-white text-sm">
                  {user.access ? (
                    <button
                      className="bg-red-700 px-2 py-1 rounded-md shadow-md"
                      onClick={() => handleBlock(user._id)}
                    >
                      Block
                    </button>
                  ) : (
                    <button
                      className="bg-green-700 px-2 py-1 rounded-md shadow-md"
                      onClick={() => handleUnblock(user._id)}
                    >
                      Unblock
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="lg:w-9/12 w-full flex flex-col lg:flex-row mb-24">
        <ShowAllEmpChat />
        <ShowAllEmpChat2 />
      </div>

      <div className="bg-green-700 text-white rounded-md shadow-md fixed px-4 py-2 font-extrabold text-xl lg:mr-0 mr-10 bottom-5 right-5">
        <ChatModel />
      </div>
    </div>
  );
};

export default BlockAccess;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../constants";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { AiOutlineSearch } from "react-icons/ai";
import {Modal} from "./Modal"


const ManagerDetails = () => {
  const [managers, setManagers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/manager/getAllManagers`);
        setManagers(res.data);
      } catch (error) {
        console.error("Error fetching managers", error);
      }
    };

    fetchManagers();
  }, []);

  const handleEdit = (manager) => {
    setSelectedManager(manager);
    setShowModal(true);
  };

  const handleDelete = async (managerId) => {
    try {
      if (window.confirm("Are you sure? The data will be deleted permanently.")) {
        await axios.delete(`${BASE_URL}/api/manager/deleteManagerById/${managerId}`);
        setManagers(managers.filter((manager) => manager._id !== managerId));
        toast.success('Manager deleted successfully');
      }
    } catch (error) {
      console.error("Error deleting manager", error);
      toast.error('Failed to delete manager');
    }
  };

  const handleUpdate = async (updatedManager) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/api/manager/updateManagerById/${updatedManager._id}`,
        updatedManager
      );
      setManagers(
        managers.map((manager) =>
          manager._id === updatedManager._id ? res.data.updatedManager : manager
        )
      );
      toast.success('Manager details updated successfully');
    } catch (error) {
      console.error("Error updating manager", error);
      toast.error('Failed to update manager');
    }
  };

  const filteredManagers = managers.filter(manager =>
    manager.manager_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[820px] overflow-y-auto w-full p-4 sm:p-6 bg-[#e8effe] rounded-lg shadow-md">
      <ToastContainer />
      <div className="relative mb-4 w-full flex items-center space-x-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search by Manager Name"
            className="w-full lg:h-10 h-8 p-2 text-base text-gray-700 rounded-xl pl-10 bg-white border border-[#5443c3] shadow-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <AiOutlineSearch
            size={15}
            className="absolute top-3 left-3 text-gray-500 text-2xl"
          />
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="h-[850px] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
            <thead className="bg-[#5443c3] sticky top-0">
              <tr>
                <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider relative break-words whitespace-pre-wrap">
                  Manager ID
                </th>
                <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider relative break-words whitespace-pre-wrap">
                  Manager Name
                </th>
                <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider relative break-words whitespace-pre-wrap">
                  Manager Email
                </th>
                <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider relative break-words whitespace-pre-wrap">
                  Manager Phone
                </th>
                <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider relative break-words whitespace-pre-wrap">
                  Manager Address
                </th>
                <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider relative break-words whitespace-pre-wrap">
                  Branch City
                </th>
                <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider relative break-words whitespace-pre-wrap">
                  Branch State
                </th>
                <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider relative break-words whitespace-pre-wrap">
                  Branch Pincode
                </th>
                <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider relative break-words whitespace-pre-wrap">
                  Branch Name
                </th>
                <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider relative break-words whitespace-pre-wrap">
                  Branch Address
                </th>
                <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider relative break-words whitespace-pre-wrap">
                  Group
                </th>
                <th className="py-3 px-2 sm:px-4 text-center text-xs sm:text-sm font-medium text-white uppercase tracking-wider relative break-words whitespace-pre-wrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredManagers.map((manager) => (
                <tr key={manager._id}>
                  <td className="py-3 px-2 sm:px-4 whitespace-nowrap text-xs sm:text-sm text-gray-700 break-words">
                    {manager.manager_Id}
                  </td>
                  <td className="py-3 px-2 sm:px-4 whitespace-nowrap text-xs sm:text-sm text-gray-700 break-words">
                    {manager.manager_name}
                  </td>
                  <td className="py-3 px-2 sm:px-4 whitespace-nowrap text-xs sm:text-sm text-gray-700 break-words">
                    {manager.manager_email}
                  </td>
                  <td className="py-3 px-2 sm:px-4 whitespace-nowrap text-xs sm:text-sm text-gray-700 break-words">
                    {manager.manager_phone}
                  </td>
                  <td className="py-3 px-2 sm:px-4 whitespace-nowrap text-xs sm:text-sm text-gray-700 break-words">
                    {manager.manager_address}
                  </td>
                  <td className="py-3 px-2 sm:px-4 whitespace-nowrap text-xs sm:text-sm text-gray-700 break-words">
                    {manager.branch_city}
                  </td>
                  <td className="py-3 px-2 sm:px-4 whitespace-nowrap text-xs sm:text-sm text-gray-700 break-words">
                    {manager.branch_state}
                  </td>
                  <td className="py-3 px-2 sm:px-4 whitespace-nowrap text-xs sm:text-sm text-gray-700 break-words">
                    {manager.branch_pincode}
                  </td>
                  <td className="py-3 px-2 sm:px-4 whitespace-nowrap text-xs sm:text-sm text-gray-700 break-words">
                    {manager.branch_name}
                  </td>
                  <td className="py-3 px-2 sm:px-4 whitespace-nowrap text-xs sm:text-sm text-gray-700 break-words">
                    {manager.branch_address}
                  </td>
                  <td className="py-3 px-2 sm:px-4 whitespace-nowrap text-xs sm:text-sm text-gray-700 break-words">
                  {manager?.group.map((grp, idx) => (
                      <div key={idx}>
                        <p>{grp.name}-{grp.grade}</p>
                       
                      </div>
                    ))}
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-center whitespace-nowrap text-xs sm:text-sm font-medium">
                    <button
                      onClick={() => handleEdit(manager)}
                      className="text-[#5443c3] hover:text-blue-500 mr-2"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(manager._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <RiDeleteBin5Line />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        manager={selectedManager}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default ManagerDetails;

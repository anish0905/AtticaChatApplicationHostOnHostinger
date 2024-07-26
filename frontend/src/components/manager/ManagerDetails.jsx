import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../constants";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { AiOutlineSearch } from "react-icons/ai";

const Modal = ({ show, onClose, manager, onUpdate }) => {
  const [formData, setFormData] = useState({ ...manager });

  useEffect(() => {
    setFormData({ ...manager });
  }, [manager]);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdate = () => {
    onUpdate(formData);
    onClose();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-[#5443c3]">Edit Manager Details</h2>
        <form>
          {[
            { label: "Manager ID", name: "manager_Id", type: "text" },
            { label: "Manager Name", name: "manager_name", type: "text" },
            { label: "Manager Email", name: "manager_email", type: "email" },
            {
              label: "Manager Password",
              name: "manager_password",
              type: "password",
            },
            { label: "Manager Phone", name: "manager_phone", type: "text" },
            { label: "Manager Address", name: "manager_address", type: "text" },
            { label: "Branch City", name: "branch_city", type: "text" },
            { label: "Branch State", name: "branch_state", type: "text" },
            { label: "Branch Pincode", name: "branch_pincode", type: "text" },
            { label: "Branch Name", name: "branch_name", type: "text" },
            { label: "Branch Address", name: "branch_address", type: "text" },
          ].map((field, index) => (
            <div className="mb-4" key={index}>
              <label
                className="block text-[#5443c3] text-sm font-bold mb-2"
                htmlFor={field.name}
              >
                {field.label}
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                id={field.name}
                name={field.name}
                type={field.type}
                value={formData[field.name]}
                onChange={handleChange}
              />
            </div>
          ))}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleUpdate}
              className="mr-2 bg-[#5443c3] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Update
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

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
    <div  className="flex flex-col h-[950px] overflow-y-auto w-full p-4 sm:p-6 bg-[#e8effe] rounded-lg shadow-md">
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
      <button
             className="bg-[#fc3b3b] hover:bg-red-700 text-white font-bold lg:text-xl text-xs rounded-xl h-12 px-3 "
            onClick={handleDelete}>
              Delete All  
            </button>
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-[#5443c3]">
              {filteredManagers.map((manager) => (
                <tr key={manager._id}>
                  <td className="py-4 px-2 sm:px-4  text-xs lg:text-sm relative break-words whitespace-pre-wrap">
                    {manager.manager_Id}
                  </td>
                  <td className="py-4 px-2 sm:px-4  text-xs lg:text-sm relative break-words whitespace-pre-wrap">
                    {manager.manager_name}
                  </td>
                  <td className="py-4 px-2 sm:px-4  text-xs lg:text-sm relative break-words whitespace-pre-wrap">
                    {manager.manager_email}
                  </td>
                  <td className="py-4 px-2 sm:px-4  text-xs lg:text-sm relative break-words whitespace-pre-wrap">
                    {manager.manager_phone}
                  </td>
                  <td className="py-4 px-2 sm:px-4  text-xs lg:text-sm relative break-words whitespace-pre-wrap">
                    {manager.branch_city}
                  </td>
                  <td className="py-4 px-2 sm:px-4  text-xs lg:text-sm relative break-words whitespace-pre-wrap">
                    {manager.branch_state}
                  </td>
                  <td className="py-4 px-2 sm:px-4  text-xs lg:text-sm relative break-words whitespace-pre-wrap">
                    {manager.branch_pincode}
                  </td>
                  <td className="py-4 px-2 sm:px-4  text-xs lg:text-sm relative break-words whitespace-pre-wrap">
                    {manager.branch_name}
                  </td>
                  <td className="py-4 px-2 sm:px-4  text-xs lg:text-sm relative break-words whitespace-pre-wrap">
                    {manager.branch_address}
                  </td>
                  <td className="py-4 px-2 whitespace-nowrap sm:px-4 lex text-xs lg:text-sm ">
                    <button
                      onClick={() => handleEdit(manager)}
                      className="mr-2 bg-[#5443c3] hover:bg-blue-700 text-white font-bold py-2 px-2 sm:px-4 rounded mx-2"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(manager._id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 sm:px-4 rounded mx-2"
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
      {selectedManager && (
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          manager={selectedManager}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default ManagerDetails;

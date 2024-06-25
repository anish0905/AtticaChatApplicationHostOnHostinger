import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";

const BASE_URL = "http://localhost:5003";

const Modal = ({ show, onClose, accountant, onUpdate }) => {
  const [formData, setFormData] = useState({ ...accountant });

  useEffect(() => {
    setFormData({ ...accountant });
  }, [accountant]);

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
        <h2 className="text-2xl font-bold mb-4 text-[#5443c3]">Edit Accountant Details</h2>
        <form>
          {[
            { label: "Name", name: "name", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Role", name: "role", type: "text" },
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

const AccountsDetails = () => {
  const [accountants, setAccountants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAccountant, setSelectedAccountant] = useState(null);

  useEffect(() => {
    const fetchAccountants = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/allUser/getAllAccountantTeam`);
        setAccountants(res.data);
      } catch (error) {
        console.error("Error fetching accountants", error);
      }
    };

    fetchAccountants();
  }, []);

  const handleEdit = (accountant) => {
    setSelectedAccountant(accountant);
    setShowModal(true);
  };

  const handleDelete = async (accountantId) => {
    try {
      if (window.confirm("Are you sure? The data will be deleted permanently.")) {
        await axios.delete(`${BASE_URL}/api/allUser/deleteAccountantById/${accountantId}`);
        setAccountants(accountants.filter((accountant) => accountant._id !== accountantId));
        toast.success('Accountant deleted successfully');
      }
    } catch (error) {
      console.error("Error deleting accountant", error);
      toast.error('Failed to delete accountant');
    }
  };

  const handleUpdate = async (updatedAccountant) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/api/allUser/updateAccountantById/${updatedAccountant._id}`,
        updatedAccountant
      );
      setAccountants(
        accountants.map((accountant) =>
          accountant._id === updatedAccountant._id ? res.data.updatedAccountant : accountant
        )
      );
      toast.success('Accountant details updated successfully');
    } catch (error) {
      console.error("Error updating accountant", error);
      toast.error('Failed to update accountant');
    }
  };

  return (
    <div className="flex flex-col h-screen w-full p-4 sm:p-6 bg-[#e8effe] rounded-lg shadow-md">
      <ToastContainer />
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="h-full overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#5443c3] sticky top-0">
              <tr>
                
                <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider">
                  Name
                </th>
                <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider">
                  Email
                </th>
                <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider">
                  Role
                </th>
                <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-[#5443c3]">
              {accountants.map((accountant) => (
                <tr key={accountant._id}>
                 
                  <td className="py-4 px-2 sm:px-4 whitespace-nowrap">
                    {accountant.name}
                  </td>
                  <td className="py-4 px-2 sm:px-4 whitespace-nowrap">
                    {accountant.email}
                  </td>
                  <td className="py-4 px-2 sm:px-4 whitespace-nowrap">
                    {accountant.role}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap flex">
                    <button
                      onClick={() => handleEdit(accountant)}
                      className="mr-2 bg-[#5443c3] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(accountant._id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
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
      {selectedAccountant && (
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          accountant={selectedAccountant}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default AccountsDetails;

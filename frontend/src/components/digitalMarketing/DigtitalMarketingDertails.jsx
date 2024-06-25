

import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../constants";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";

const Modal = ({ show, onClose, DigitalMarketingTeam, onUpdate }) => {
  const [formData, setFormData] = useState({ ...DigitalMarketingTeam });

  useEffect(() => {
    setFormData({ ...DigitalMarketingTeam });
  }, [DigitalMarketingTeam]);

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
        <h2 className="text-2xl font-bold mb-4 text-[#5443c3]">Edit Digital Marketing Team Details</h2>
        <form>
          {[
            { label: "Digital Marketing Team ID", name: "Digital Marketing Team_Id", type: "text" },
            { label: "Digital Marketing Team Name", name: "Digital Marketing Team_name", type: "text" },
            { label: "Digital Marketing Team Email", name: "Digital Marketing Team_email", type: "email" },
            {
              label: "Digital Marketing Team Password",
              name: "Digital Marketing Team_password",
              type: "password",
            },
            { label: "Digital Marketing Team Phone", name: "Digital Marketing Team_phone", type: "text" },
            { label: "Digital Marketing Team Address", name: "Digital Marketing Team_address", type: "text" },
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

const DigtitalMarketingDertails = () => {
  const [DigitalMarketingTeams, setDigitalMarketingTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDigitalMarketingTeam, setSelectedDigitalMarketingTeam] = useState(null);

  useEffect(() => {
    const fetchDigitalMarketingTeams = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/allUser/getAllDigitalMarketingTeam`);
        setDigitalMarketingTeams(res.data);
      } catch (error) {
        console.error("Error fetching Digital Marketing Teams", error);
      }
    };

    fetchDigitalMarketingTeams();
  }, []);

  const handleEdit = (DigitalMarketingTeam) => {
    setSelectedDigitalMarketingTeam(DigitalMarketingTeam);
    setShowModal(true);
  };

  const handleDelete = async (DigitalMarketingTeamId) => {
    try {
      if (window.confirm("Are you sure? The data will be deleted permanently.")) {
        await axios.delete(`${BASE_URL}/api/Digital Marketing Team/deleteDigital Marketing TeamById/${DigitalMarketingTeamId}`);
        setDigitalMarketingTeams(DigitalMarketingTeams.filter((DigitalMarketingTeam) => DigitalMarketingTeam._id !== DigitalMarketingTeamId));
        toast.success('Digital Marketing Team deleted successfully');
      }
    } catch (error) {
      console.error("Error deleting Digital Marketing Team", error);
      toast.error('Failed to delete Digital Marketing Team');
    }
  };

  const handleUpdate = async (updatedDigitalMarketingTeam) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/api/DigitalMarketingTeam/updateDigitalMarketingeamById/${updatedDigitalMarketingTeam._id}`,
        updatedDigitalMarketingTeam
      );
      setDigitalMarketingTeams(
        DigitalMarketingTeams.map((DigitalMarketingTeam) =>
          DigitalMarketingTeam._id === updatedDigitalMarketingTeam._id ? res.data.updatedDigitalMarketingTeam : DigitalMarketingTeam
        )
      );
      toast.success('Digital Marketing Team details updated successfully');
    } catch (error) {
      console.error("Error updating Digital Marketing Team", error);
      toast.error('Failed to update Digital Marketing Team');
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
                ID
              </th> 
              <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider">
                Name
              </th>
              <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider">
                Email
              </th>
              {/* <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider">
                 Phone NO
              </th> */}
              {/* <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider">
                Branch City
              </th>
              <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider">
                Branch State
              </th>
              <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider">
                Branch Pincode
              </th>
              <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider">
                Branch Name
              </th>
              <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider">
                Branch Address
              </th> */}
              <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-[#5443c3]">
            {DigitalMarketingTeams.map((DigitalMarketingTeam) => (
              <tr key={DigitalMarketingTeam._id}>
                <td className="py-4 px-2 sm:px-4 whitespace-nowrap">
                  {DigitalMarketingTeam.DigitalMarketingTeam_Id}
                </td>
                <td className="py-4 px-2 sm:px-4 whitespace-nowrap">
                  {DigitalMarketingTeam.DigitalMarketingTeam_name}
                </td>
                <td className="py-4 px-2 sm:px-4 whitespace-nowrap">
                  {DigitalMarketingTeam.DigitalMarketingTeam_email}
                </td>
                {/* <td className="py-4 px-2 sm:px-4 whitespace-nowrap">
                  {DigitalMarketingTeam.DigitalMarketingTeam_phone}
                </td>
                <td className="py-4 px-2 sm:px-4 whitespace-nowrap">
                  {DigitalMarketingTeam.branch_city}
                </td>
                <td className="py-4 px-2 sm:px-4 whitespace-nowrap">
                  {DigitalMarketingTeam.branch_state}
                </td>
                <td className="py-4 px-2 sm:px-4 whitespace-nowrap">
                  {DigitalMarketingTeam.branch_pincode}
                </td>
                <td className="py-4 px-2 sm:px-4 whitespace-nowrap">
                  {DigitalMarketingTeam.branch_name}
                </td>
                <td className="py-4 px-2 sm:px-4 whitespace-nowrap">
                  {DigitalMarketingTeam.branch_address}
                </td> */}
                <td className="py-4 px-4 whitespace-nowrap flex">
                  <button
                    onClick={() => handleEdit(DigitalMarketingTeam)}
                    className="mr-2 bg-[#5443c3] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(DigitalMarketingTeam._id)}
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
      {selectedDigitalMarketingTeam && (
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          Digital Marketing Team={selectedDigitalMarketingTeam}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default DigtitalMarketingDertails;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../constants";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { AiOutlineSearch } from "react-icons/ai";

const Modal = ({ show, onClose, bouncer, onUpdate }) => {
  const [formData, setFormData] = useState({ ...bouncer });

  useEffect(() => {
    setFormData({ ...bouncer });
  }, [bouncer]);

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
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-[#5443c3]">Edit Bouncer Details</h2>
        <form>
          {[
            { label: "Bouncer Name", name: "name", type: "text" },
            { label: "Bouncer Email", name: "email", type: "email" },
            { label: "Bouncer Password", name: "password", type: "password" }
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

const BouncerDetails = () => {
  const [bouncers, setBouncers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBouncer, setSelectedBouncer] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchBouncers = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/allUser/getAllBouncersTeam`);
        setBouncers(res.data);
      } catch (error) {
        console.error("Error fetching Bouncers", error);
      }
    };

    fetchBouncers();
  }, []);

  const handleEdit = (bouncer) => {
    setSelectedBouncer(bouncer);
    setShowModal(true);
  };

  const handleDelete = async (bouncerId) => {
    try {
      if (window.confirm("Are you sure? The data will be deleted permanently.")) {
        await axios.delete(`${BASE_URL}/api/allUser/delete/${bouncerId}`);
        setBouncers(bouncers.filter((bouncer) => bouncer._id !== bouncerId));
        toast.success('Bouncer deleted successfully');
      }
    } catch (error) {
      console.error("Error deleting Bouncer", error);
      toast.error('Failed to delete Bouncer');
    }
  };

  const handleUpdate = async (updatedBouncer) => {
    try {
      const res = await axios.patch(
        `${BASE_URL}/api/allUser/update/${updatedBouncer._id}`,
        updatedBouncer
      );
      setBouncers(
        bouncers.map((bouncer) =>
          bouncer._id === updatedBouncer._id ? res.data.updatedBouncer : bouncer
        )
      );
      toast.success('Bouncer details updated successfully');
    } catch (error) {
      console.error("Error updating Bouncer", error);
      toast.error('Failed to update Bouncer');
    }
    setShowModal(false);
  };

  const filteredBouncers = bouncers.filter((bouncer) =>
    bouncer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen w-full p-4 sm:p-6 bg-[#e8effe] rounded-lg shadow-md">
      <ToastContainer />
      <div className="flex items-center justify-between mb-4">
        {/* <h1 className="text-xl sm:text-2xl font-bold text-[#5443c3]">Bouncer Details</h1> */}
        <div className="relative mb-4 w-full">
          <input
            type="text"
            placeholder="Search by name..."
            className="w-full h-10 p-2 text-base text-gray-700 rounded-xl pl-10 bg-white border border-[#5443c3] shadow-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <AiOutlineSearch
            size={20}
            className="absolute top-3 left-3 text-gray-500 text-2xl"
          />
        </div>
      </div>
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
                <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-[#5443c3]">
              {filteredBouncers.map((bouncer) => (
                <tr key={bouncer._id}>
                  <td className="py-4 px-2 sm:px-4 whitespace-nowrap">
                    {bouncer?._id}
                  </td>
                  <td className="py-4 px-2 sm:px-4 whitespace-nowrap">
                    {bouncer?.name}
                  </td>
                  <td className="py-4 px-2 sm:px-4 whitespace-nowrap">
                    {bouncer?.email}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap flex">
                    <button
                      onClick={() => handleEdit(bouncer)}
                      className="mr-2 bg-[#5443c3] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(bouncer._id)}
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
      {selectedBouncer && (
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          bouncer={selectedBouncer}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default BouncerDetails;

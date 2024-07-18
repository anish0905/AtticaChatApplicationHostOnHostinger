import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../constants";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { AiOutlineSearch } from "react-icons/ai";

const Modal = ({ show, onClose, accountTeam, onUpdate }) => {
  const [formData, setFormData] = useState({ ...accountTeam });

  useEffect(() => {
    setFormData({ ...accountTeam });
  }, [accountTeam]);

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
        <h2 className="text-2xl font-bold mb-4 text-[#5443c3]">Edit Account Team Details</h2>
        <form>
          {[
            { label: "Account Team Name", name: "name", type: "text" },
            { label: "Account Team Email", name: "email", type: "email" },
            { label: "Account Team Password", name: "password", type: "password" }
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

const AccountTeamDetails = ({value}) => {
  const [accountTeams, setAccountTeams] = useState([]);
  const [filteredAccountTeams, setFilteredAccountTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAccountTeam, setSelectedAccountTeam] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  console.log("value",value)

  useEffect(() => {
    const fetchAccountTeams = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/allUser/${value}`);
        setAccountTeams(res.data);
        setFilteredAccountTeams(res.data);
      } catch (error) {
        console.error("Error fetching Account Teams", error);
      }
    };

    fetchAccountTeams();
  }, []);

  useEffect(() => {
    setFilteredAccountTeams(
      accountTeams.filter((team) =>
        team.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, accountTeams]);

  const handleEdit = (accountTeam) => {
    setSelectedAccountTeam(accountTeam);
    setShowModal(true);
  };

  const handleDelete = async (accountTeamId) => {
    try {
      if (window.confirm("Are you sure? The data will be deleted permanently.")) {
        await axios.delete(`${BASE_URL}/api/allUser/delete/${accountTeamId}`);
        setAccountTeams(accountTeams.filter((team) => team._id !== accountTeamId));
        toast.success('Account Team deleted successfully');
      }
    } catch (error) {
      console.error("Error deleting Account Team", error);
      toast.error('Failed to delete Account Team');
    }
  };

  const handleUpdate = async (updatedAccountTeam) => {
    try {
      const res = await axios.patch(
        `${BASE_URL}/api/allUser/update/${updatedAccountTeam._id}`,
        updatedAccountTeam
      );
      setAccountTeams(
        accountTeams.map((team) =>
          team._id === updatedAccountTeam._id ? res.data.updatedAccountTeam : team
        )
      );
      window.location.reload(); // Fixed reload method
      toast.success('Account Team details updated successfully');
    } catch (error) {
      console.error("Error updating Account Team", error);
      toast.error('Failed to update Account Team');
    }
  };

  return (
    <div className="flex flex-col h-screen w-full p-4 sm:p-6 bg-[#e8effe] rounded-lg shadow-md">
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        {/* <h1 className="text-xl sm:text-2xl font-bold text-[#5443c3]">Account Team Details</h1> */}
        <div className="relative w-full ">
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
              {filteredAccountTeams.map((team) => (
                <tr key={team._id}>
                  <td className="py-4 px-2 sm:px-4 whitespace-nowrap">
                    {team?._id}
                  </td>
                  <td className="py-4 px-2 sm:px-4 whitespace-nowrap">
                    {team?.name}
                  </td>
                  <td className="py-4 px-2 sm:px-4 whitespace-nowrap">
                    {team?.email}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap flex">
                    <button
                      onClick={() => handleEdit(team)}
                      className="mr-2 bg-[#5443c3] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(team._id)}
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
      {selectedAccountTeam && (
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          accountTeam={selectedAccountTeam}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default AccountTeamDetails;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../constants";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { AiOutlineSearch } from "react-icons/ai";

import UpdateModel from "../AllUsers/UpdateModel";

const AccountTeamDetails = ({ value }) => {
  const [accountTeams, setAccountTeams] = useState([]);
  const [filteredAccountTeams, setFilteredAccountTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAccountTeam, setSelectedAccountTeam] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  console.log("value", value)

  const roleEndpointMap = {
    Accountant: "allUser/getAllAccountantTeam",
    Software: "allUser/getAllSoftwareTeam",
    HR: "allUser/getAllHRTeam",
    "CallCenter": "allUser/getAllCallCenterTeam",
    "VirtualTeam": "allUser/getAllVirtualTeam",
    "MonitoringTeam": "allUser/getAllMonitoringTeam",
    "Bouncers": "allUser/getAllBouncersTeam",
    "Security": "allUser/getAllSecurityTeam",
    "Digital Marketing": "allUser/getAllDigitalMarketingTeam",
    TE: "allUser/getAllTE",
    Logistic : "allUser/getAllLogistic",
    Cashier: "allUser/getAllCashierTeam"
  };

  const endpoint = roleEndpointMap[value];


  useEffect(() => {
    const fetchAccountTeams = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/${endpoint}`);
        setAccountTeams(res.data);
        setFilteredAccountTeams(res.data);
      } catch (error) {
        console.error("Error fetching Account Teams", error);
      }
    };

    fetchAccountTeams();
  }, [value]);

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
    <div className="flex flex-col h-[950px] overflow-y-auto w-full p-4 sm:p-6 bg-[#e8effe] rounded-lg shadow-md">
      <div className="relative mb-4 w-full flex items-center space-x-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search by name..."
            className="w-full h-10 p-2 text-base text-gray-700 rounded-xl pl-10 bg-white border border-[#5443c3] shadow-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <AiOutlineSearch
            size={15}
            className="absolute top-3 left-3 text-gray-500 text-xl"
          />
        </div>
        <button
          className="bg-[#fc3b3b] hover:bg-red-700 text-white font-bold lg:text-xl text-xs rounded-xl h-12 px-3 "
          onClick={handleDelete}>
          Delete All
        </button>
      </div>

      <ToastContainer />
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="h-[850px] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
            <thead className="bg-[#5443c3] sticky top-0">
              <tr>
                <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider relative break-words whitespace-pre-wrap">
                  ID
                </th>
                <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider relative break-words whitespace-pre-wrap">
                  Name
                </th>
                <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider relative break-words whitespace-pre-wrap">
                  Email
                </th>
                <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider relative break-words whitespace-pre-wrap">
                  Group
                </th>
                
                <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider relative break-words whitespace-pre-wrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-[#5443c3]">
              {filteredAccountTeams.map((team) => (
                <tr key={team._id}>
                  <td className="py-4 px-2 sm:px-4 text-xs lg:text-sm relative break-words whitespace-pre-wrap">
                    {team?._id}
                  </td>
                  <td className="py-4 px-2 sm:px-4 text-xs lg:text-sm relative break-words whitespace-pre-wrap">
                    {team?.name}
                  </td>
                  <td className="py-4 px-2 sm:px-4 text-xs lg:text-sm relative break-words whitespace-pre-wrap">
                    {team?.email}
                  </td>
                  <td className="py-4 px-2 sm:px-4 text-xs lg:text-sm relative break-words whitespace-pre-wrap">
                    {team?.group.map((grp, idx) => (
                      <div key={idx}>
                        <p>{grp.name}-{grp.grade}</p>
                       
                      </div>
                    ))}
                  </td>
                  
                  <td className="py-4 px-2 whitespace-nowrap sm:px-4 lex text-xs lg:text-sm ">
                    <button
                      onClick={() => handleEdit(team)}
                      className="mr-2 bg-[#5443c3] hover:bg-blue-700 text-white font-bold py-2 px-2 sm:px-4 rounded mx-2"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(team._id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 sm:px-4 rounded"
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
        <UpdateModel
          show={showModal}
          onClose={() => setShowModal(false)}
          accountTeam={selectedAccountTeam}
          onUpdate={handleUpdate}
          value={value}
        />
      )}
    </div>
  );
};

export default AccountTeamDetails;

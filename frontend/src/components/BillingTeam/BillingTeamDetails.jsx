import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../constants";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineSearch } from "react-icons/ai";
import Modal from "./Modal";

const BillingTeamDetails = () => {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/billingTeam/getAllUsers`);
        setEmployees(res.data);
      } catch (error) {
        console.error("Error fetching employees", error);
      }
    };

    fetchEmployees();
  }, []);

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const handleDelete = async (employeeId) => {
    try {
      if (window.confirm("Are you sure? The data will be deleted permanently.")) {
        await axios.delete(`${BASE_URL}/api/billingTeam/delUserbyId/${employeeId}`);
        setEmployees(employees.filter((employee) => employee._id !== employeeId));
        toast.success('Employee deleted successfully');
      }
    } catch (error) {
      console.error("Error deleting employee", error);
      toast.error('Failed to delete employee');
    }
  };

  const handleUpdate = async (updatedEmployee) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/api/billingTeam/updateUserById/${updatedEmployee._id}`,
        updatedEmployee
      );
      setEmployees(
        employees.map((employee) =>
          employee._id === updatedEmployee._id
            ? res.data.updatedEmployee
            : employee
        )
      );
      toast.success('Employee details updated successfully');
    } catch (error) {
      console.error("Error updating employee", error);
      toast.error('Failed to update employee');
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[820px] overflow-y-auto w-full p-4 sm:p-6 bg-[#e8effe] rounded-lg shadow-md">
      <ToastContainer />
      <div className="relative mb-4 w-full flex items-center space-x-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search by name..."
            className="w-full lg:h-10 h-8 p-2 text-base text-gray-700 rounded-xl pl-10 bg-white border border-[#5443c3] shadow-lg"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <AiOutlineSearch
            size={15}
            className="absolute top-3 left-3 text-gray-500 text-xl"
          />
        </div>
        <button
          className="bg-[#fc3b3b] hover:bg-red-700 text-white font-bold lg:text-xl text-xs rounded-xl h-12 px-3"
          onClick={() => handleDelete()}
        >
          Delete All
        </button>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="h-[850px] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
            <thead className="bg-[#5443c3] sticky top-0">
              <tr>
                {['Name', 'Email', 'Phone', 'Address', 'Branch Name', 'Branch State', 'Branch City', 'Branch Pincode','Group', 'Actions'].map((header) => (
                  <th
                    key={header}
                    className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-white uppercase tracking-wider relative break-words whitespace-pre-wrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-[#5443c3]">
              {filteredEmployees.map((employee) => (
                <tr key={employee._id}>
                  <td className="py-4 px-2 sm:px-4 text-xs lg:text-sm relative break-words whitespace-pre-wrap">{employee.name}</td>
                  <td className="py-4 px-2 sm:px-4 text-xs lg:text-sm relative break-words whitespace-pre-wrap">{employee.email}</td>
                  <td className="py-4 px-2 sm:px-4 text-xs lg:text-sm relative break-words whitespace-pre-wrap">{employee.phone}</td>
                  <td className="py-4 px-2 sm:px-4 text-xs lg:text-sm relative break-words whitespace-pre-wrap">{employee.address}</td>
                  <td className="py-4 px-2 sm:px-4 text-xs lg:text-sm relative break-words whitespace-pre-wrap">{employee.branch_name}</td>
                  <td className="py-4 px-2 sm:px-4 text-xs lg:text-sm relative break-words whitespace-pre-wrap">{employee.branch_state}</td>
                  <td className="py-4 px-2 sm:px-4 text-xs lg:text-sm relative break-words whitespace-pre-wrap">{employee.branch_city}</td>
                  <td className="py-4 px-2 sm:px-4 text-xs lg:text-sm relative break-words whitespace-pre-wrap">{employee.branch_pincode}</td>
                  <td className="py-4 px-2 sm:px-4 text-xs lg:text-sm relative break-words whitespace-pre-wrap">
                  {employee?.group.map((grp, idx) => (
                      <div key={idx}>
                        <p>{grp.name}-{grp.grade}</p>
                       
                      </div>
                    ))}
                  </td>
                  <td className="py-4 px-2 sm:px-4 text-xs lg:text-sm relative flex space-x-2">
                    <FaEdit
                      size={20}
                      className="text-blue-600 cursor-pointer"
                      onClick={() => handleEdit(employee)}
                    />
                    <RiDeleteBin5Line
                      size={20}
                      className="text-red-600 cursor-pointer"
                      onClick={() => handleDelete(employee._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          employee={selectedEmployee}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default BillingTeamDetails;

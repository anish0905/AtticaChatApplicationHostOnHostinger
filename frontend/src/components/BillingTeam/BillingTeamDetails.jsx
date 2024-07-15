import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../constants";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineSearch } from "react-icons/ai";


const Modal = ({ show, onClose, employee, onUpdate }) => {
  const [formData, setFormData] = useState({ ...employee });

  useEffect(() => {
    setFormData({ ...employee });
  }, [employee]);

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
      <div className="bg-white p-6 rounded-lg shadow-lg lg:w-full lg:h-auto w-[80%] h-[650px] max-w-md">
        <h2 className="lg:text-2xl text-xl font-bold mb-4 text-[#5443c3]">Edit Employee Details</h2>
        <form>
          {['name', 'email', 'phone', 'address', 'branch_name', 'branch_state', 'branch_city', 'branch_pincode'].map((field) => (
           
           <div className="lg:mb-4 mb-2" key={field}>
              <label className="block text-[#5443c3] text-sm font-bold mb-2">
                {field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 lg:h-auto h-[8vw]"
                name={field}
                value={formData[field]}
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
    <div className="flex flex-col h-[950px] overflow-y-auto w-full p-4 sm:p-6 bg-[#e8effe] rounded-lg shadow-md">
      <ToastContainer />
      <div className="relative mb-4 w-full">
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


      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="h-[850px] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
            <thead className="bg-[#5443c3] sticky top-0">
              <tr>
                {['Name', 'Email', 'Phone', 'Address', 'Branch Name', 'Branch State', 'Branch City', 'Branch Pincode', 'Actions'].map((header) => (
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
                  <td className="py-4 px-2 whitespace-nowrap sm:px-4 lex text-xs lg:text-sm  ">
                    <button
                      onClick={() => handleEdit(employee)}
                      className="bg-[#5334c3] hover:bg-blue-700 text-white font-bold py-2 px-2 sm:px-4 rounded mx-2"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(employee._id)}
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


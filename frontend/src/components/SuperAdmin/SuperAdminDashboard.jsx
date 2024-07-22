import axios from "axios";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "../admin/Sidebar";
import EmployeeDetails from "../admin/EmployeeDetails";
import AdminDetails from "./AdminDetails";
import { BASE_URL } from "../../constants";
import SuperAdminSidebar from "./SuperAdminSidebar";

const SuperAdminDashboard = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const user = { email, password };

  const handlePanic = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/serverControl/crash`);
      console.log("updateotp   ", res.data);
    } catch (error) {
      console.error("Error fetching OTP", error);
    }
  };

  const handleNameChange = (e) => setEmail(e.target.value);
  const handleEmpIdChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    try {
      const response = await fetch(`${BASE_URL}/api/admin/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        toast.success("Successfully registered!");
      } else {
        const errorData = await response.json();
        setError(errorData.message);
        toast.error(errorData.message);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError("An error occurred while registering. Please try again.");
      toast.error("An error occurred while registering. Please try again.");
    }
  };

  return (
    <div className="lg:flex block bg-[#f6f5fb]">
      <SuperAdminSidebar />
      <div className="flex-1 p-6">
        <div className="flex justify-between mb-4 flex-col lg:flex-row">
          <h1 className="text-xl sm:text-2xl font-bold text-[#5443c3]">Admin Details</h1>
          <div className='flex justify-center items-center content-center '>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#5443c3] hover:bg-blue-700 text-white font-bold lg:px-4 py-1 px-2 lg:text-xl text-xs rounded-full w-full lg:w-[30vw] h-12 mr-2 mt-4 lg:mt-0"
            >
              Open Registration Form
            </button>
            <button
              className="bg-red-500 text-white font-bold lg:px-4 py-1 px-2 lg:text-xl text-xs rounded-full w-full h-12 mr-2 mt-4 lg:mt-0"
              onClick={handlePanic}
            >
              Panic
            </button>
          </div>
        </div>
        <AdminDetails />
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 lg:w-full lg:h-auto w-[300px] h-auto max-w-lg mx-2 sm:mx-4 md:mx-6 lg:mx-auto xl:mx-auto">
              <h2 className="lg:text-2xl text-xl font-bold mb-4 text-[#5443c3]">Register</h2>
              {error && <div className="text-red-500 mb-4">{error}</div>}
              <form onSubmit={handleSubmit} className="w-full">
                <div className="mb-4">
                  <label htmlFor="email" className="block text-[#5443c3] text-sm font-bold mb-2">
                    Email
                  </label>
                  <input
                    type="text"
                    id="email"
                    className="shadow appearance-none border rounded w-full lg:py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Email"
                    value={email}
                    onChange={handleNameChange}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-[#5443c3] text-sm font-bold mb-2">
                    Password
                  </label>
                  <input
                    type="text"
                    id="password"
                    className="shadow appearance-none border rounded w-full lg:py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Password"
                    value={password}
                    onChange={handleEmpIdChange}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button
                    className="bg-[#5443c3] hover:bg-blue-700 text-white font-bold lg:py-2 lg:px-4 rounded focus:outline-none focus:shadow-outline text-sm py-2 px-2"
                    type="submit"
                  >
                    Register
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="ml-4 bg-gray-500 hover:bg-gray-700 text-white font-bold lg:py-2 lg:px-4 rounded focus:outline-none focus:shadow-outline text-sm py-2 px-2"
                    type="button"
                  >
                    Cancel
                  </button>
                </div>
              </form>
              {message && <p className="text-green-500 mt-4">{message}</p>}
              {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default SuperAdminDashboard;

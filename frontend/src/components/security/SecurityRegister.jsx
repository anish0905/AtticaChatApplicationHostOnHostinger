import React, { useState } from "react";
import { BASE_URL } from "../../constants";
import Sidebar from "../../components/admin/Sidebar";
import SecurityDetails from "./SecurityDetails";
import CSVFileUpload from "../utility/CsvFileUpload";
import Swal from 'sweetalert2';
import axios from "axios";

const SecurityRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Security/CCTV", // Assuming this is the role for security personnel
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/api/allUser/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        console.log("Registration Successful");
        setIsModalOpen(false);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Registration failed");
      }
      window.location.reload();
    } catch (error) {
      setError("An error occurred: " + error.message);
    }
  };

  const handleDelete = async () => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to delete users with the Logistic role?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
      });
  
      if (result.isConfirmed) {
        const response = await axios.delete(`${BASE_URL}/api/allUser/users`, 
         { data:{   role: "Security/CCTV", }} // Ensure to send role in the request body if required
        );
  
        if (response) {
          Swal.fire('Deleted!', 'Users have been deleted.', 'success');
          window.location.reload();
        } else {
          const errorData = response.data;
          Swal.fire('Failed!', errorData.message || 'Deletion failed', 'error');
        }
      }
    } catch (error) {
      Swal.fire('Error!', 'An error occurred: ' + error.message, 'error');
    }
  };

  return (
    <div className="lg:flex block bg-[#f6f5fb] ">
      <Sidebar />
      <div className="flex-1 p-6">
      <div className="flex justify-between mb-4 flex-col lg:flex-row">
          <h1 className="text-xl sm:text-2xl font-bold text-[#5443c3]">Security Team Details</h1>
          <div className='flex justify-center items-center content-center '>
          <button
              className="bg-[#fc3b3b] hover:bg-red-700 px-4 font-semibold py-2 rounded-full text-white "
            onClick={handleDelete}>
              Delete All  
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#5443c3] hover:bg-blue-700 text-white font-bold lg:px-4 py-1 px-2 lg:text-xl text-xs lg:rounded-full w-full h-12 mr-2 mt-4 lg:mt-0"
            >
              Open Registration Form
            </button>
        
            <CSVFileUpload endpoint="/api/allUser/register" />
          </div>
        </div>
     
        <SecurityDetails/>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 lg:w-full lg:h-auto w-[300px] h-auto max-w-lg mx-2 sm:mx-4 md:mx-6 lg:mx-auto xl:mx-auto">
              <h2 className="lg:text-2xl text-xl font-bold mb-4 text-[#5443c3]">
                Register for Security Team
              </h2>
              {error && <div className="text-red-500 mb-4">{error}</div>}
              <form onSubmit={handleSubmit} className="w-full">
                    {[
                      { label: "Name", name: "name", type: "text" },
                      { label: "Email", name: "email", type: "email" },
                      { label: "Password", name: "password", type: "password" },
                    ].map((field, index) => (
                      <div className="mb-4" key={index}>
                        <label
                          className="block text-[#5443c3] text-sm font-bold lg:mb-2"
                          htmlFor={field.name}
                        >
                          {field.label}
                        </label>
                        <input
                          className="shadow appearance-none border rounded w-full lg:py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id={field.name}
                          type={field.type}
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    ))}
                 
              
                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    className="bg-[#5443c3] hover:bg-blue-700 text-white font-bold lg:py-2 lg:px-4 rounded focus:outline-none focus:shadow-outline text-sm py-2 px-2"
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityRegister;

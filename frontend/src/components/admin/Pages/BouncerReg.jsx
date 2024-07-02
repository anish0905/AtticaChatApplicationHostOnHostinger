import React, { useState } from "react";
import Sidebar from "./../Sidebar";
import { BASE_URL } from "../../../constants";
import BouncerDetails from "../../Bouncer/BouncerDetails";
import CSVFileUpload from "../../utility/CsvFileUpload";


const BouncerReg = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Bouncers/Driver",

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
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "Bouncers/Driver",
        });
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Registration failed");
      }
      window.location.reload();
    } catch (error) {
      setError("An error occurred: " + error.message);
    }
  };

  return (
    <div className="lg:flex block bg-[#f6f5fb]">
         <Sidebar />
      <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-4 flex-col lg:flex-row">
          <h1 className="text-xl sm:text-2xl font-bold text-[#5443c3]">Bouncer Team Details</h1>
          <div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#5443c3] hover:bg-blue-700 text-white font-bold py-1 px-4 rounded-full h-10 mr-2 mt-4 lg:mt-0"
            >
              Open Registration Form
            </button>
            {/* <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="bg-[#5443c3] hover:bg-blue-700 text-white font-bold py-1 px-4 rounded-full h-10 ml-2 mt-4 lg:mt-0"
            /> */}
            <CSVFileUpload endpoint="/api/allUser/register" />
          </div>
        </div>
        <BouncerDetails />
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-4xl mx-2 sm:mx-4 md:mx-6 lg:mx-auto xl:mx-auto">
              <h2 className="text-2xl font-bold mb-4 text-[#5443c3]">
                Register for Bouncer Team
              </h2>
              {error && <div className="text-red-500 mb-4">{error}</div>}
              <form onSubmit={handleSubmit} className="w-full">
                <div className="flex flex-col md:flex-row md:space-x-4">
                  <div className="md:w-full">
                    {[
                      { label: "Name", name: "name", type: "text" },
                      { label: "Email", name: "email", type: "email" },
                      { label: "Password", name: "password", type: "password" },
                    ].map((field, index) => (
                      <div className="mb-4" key={index}>
                        <label
                          className="block text-[#5443c3] text-sm font-bold mb-2"
                          htmlFor={field.name}
                        >
                          {field.label}
                        </label>
                        <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id={field.name}
                          type={field.type}
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4 mt-4">
                  <button
                    type="submit"
                    className="bg-[#5443c3] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Register
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="ml-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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

export default BouncerReg;

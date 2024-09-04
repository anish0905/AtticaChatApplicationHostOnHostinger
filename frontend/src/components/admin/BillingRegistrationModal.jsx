import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import BillingTeamDetails from "../BillingTeam/BillingTeamDetails";
// import { BASE_URL } from "../../constants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CsvFileUpload from "../utility/CsvFileUpload";
import axios from "axios";
import Swal from "sweetalert2";

const BillingRegistrationModal = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    branch_name: "",
    branch_state: "",
    branch_city: "",
    branch_pincode: "",
  });
  const [group, setGroup] = useState([{ name: "", grade: "" }]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null); // For displaying errors

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGroupChange = (index, e) => {
    const newGroup = [...group];
    newGroup[index][e.target.name] = e.target.value;
    setGroup(newGroup);
  };

  const handleAddGroup = () => {
    setGroup([...group, { name: "", grade: "" }]);
  };

  const handleRemoveGroup = (index) => {
    const newGroup = group.filter((_, i) => i !== index);
    setGroup(newGroup);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/api/billingTeam/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, group }),
      });

      if (response.ok) {
        console.log("Registration successful");
        toast.success("Registration successful");
        setIsModalOpen(false); // Close the modal on successful registration
        navigate("/billingTeamRegister");
        window.location.reload();
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Registration failed");
        toast.error(errorData.message || "Registration failed");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setError("An error occurred, please try again.");
      toast.error("An error occurred, please try again.");
    }
  };

  const handleDelete = async () => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to delete users with the Logistic role?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
      });

      if (result.isConfirmed) {
        const response = await axios.delete(
          `${BASE_URL}/api/billingTeam/deleteAllBillingTeam`
        );

        if (response) {
          Swal.fire("Deleted!", "Users have been deleted.", "success");
          window.location.reload();
        } else {
          const errorData = response.data;
          Swal.fire("Failed!", errorData.message || "Deletion failed", "error");
        }
      }
    } catch (error) {
      Swal.fire("Error!", "An error occurred: " + error.message, "error");
    }
  };

  return (
    <div className="lg:flex block bg-[#f6f5fb]">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="flex justify-between mb-4 flex-col lg:flex-row">
          <h1 className="text-xl sm:text-2xl font-bold text-[#5443c3]">
            Billing Team Details
          </h1>
          <div className="flex justify-center items-center content-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#5443c3] hover:bg-blue-700 text-white font-bold lg:px-4 py-1 px-2 lg:text-xl text-xs lg:rounded-full w-full h-12 mr-2 mt-4 lg:mt-0"
            >
              Open Registration Form
            </button>
            <CsvFileUpload endpoint="/api/billingTeam/register" />
          </div>
        </div>
        <BillingTeamDetails />
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50  overflow-y-auto">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 lg:w-full lg:h-auto w-[300px] h-[600px] max-w-lg mx-2 sm:mx-4 md:mx-6 lg:mx-auto xl:mx-auto">
              <h2 className="lg:text-2xl text-xl font-bold mb-4 text-[#5443c3]">
                Register for Billing Team
              </h2>
              {error && <div className="text-red-500 mb-4">{error}</div>}
              <form onSubmit={handleSubmit} className="w-full">
                {[
                  { label: "Name", name: "name", type: "text" },
                  { label: "Email", name: "email", type: "email" },
                  { label: "Password", name: "password", type: "password" },
                  { label: "Phone", name: "phone", type: "text" },
                  { label: "Address", name: "address", type: "text" },
                  { label: "Branch Name", name: "branch_name", type: "text" },
                  { label: "Branch State", name: "branch_state", type: "text" },
                  { label: "Branch City", name: "branch_city", type: "text" },
                  {
                    label: "Branch Pincode",
                    name: "branch_pincode",
                    type: "text",
                  },
                ].map((field, index) => (
                  <div className="lg:mb-4 mb-2" key={index}>
                    <label
                      className=" text-[#5443c3] text-sm font-bold grid grid-flow-col-2 gap-4  lg:mb-2"
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
                    />
                  </div>
                ))}
                <h3 className="text-[#5443c3] text-lg font-bold mt-4">
                  Group Information
                </h3>
                {group.map((item, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex mb-2">
                      <div className="w-1/2 pr-2">
                        <label
                          className="block text-[#5443c3] text-sm font-bold mb-2"
                          htmlFor={`group-name-${index}`}
                        >
                          Group Name
                        </label>
                        <input
                          id={`group-name-${index}`}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          type="text"
                          name="name"
                          value={item.name}
                          onChange={(e) => handleGroupChange(index, e)}
                        />
                      </div>
                      <div className="w-1/2 pl-2">
                        <label
                          className="block text-[#5443c3] text-sm font-bold mb-2"
                          htmlFor={`group-grade-${index}`}
                        >
                          Group Grade
                        </label>
                        <input
                          id={`group-grade-${index}`}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          type="text"
                          name="grade"
                          value={item.grade}
                          onChange={(e) => handleGroupChange(index, e)}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveGroup(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove Group
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddGroup}
                  className="bg-[#5443c3] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm"
                >
                  Add Another Group
                </button>
                <div className="flex items-center justify-between mt-4">
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
            </div>
          </div>
        )}
      </div>
      <ToastContainer
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default BillingRegistrationModal;

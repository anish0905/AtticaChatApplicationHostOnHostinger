import React, { useState, useEffect } from "react";
import Sidebar from "../admin/Sidebar";
import back19 from "../../assests/back19.png";
// import back15 from '../../assests/back15.png';
import shade2 from "../../assests/shade2.png";
import back13 from "../../assests/back15.png";
import shade1 from "../../assests/shade1.png";
import { BASE_URL } from "../../constants";
import Table from "./Table";

const data = {
  labels: ["Desktop", "Mobile", "Tablet"],
  datasets: [
    {
      data: [56, 30, 14],
      backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
      hoverBackgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
    },
  ],
};

const AdminDashboard = () => {
  const [manager, setManager] = useState([]);
  const [employee, setEmployee] = useState([]);

  useEffect(() => {
    const fetchAllManagers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/manager/getAllManagers`);
        if (response.ok) {
          const data = await response.json();
          setManager(data);
        } else {
          console.error("Failed to fetch AllManagers");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchAllManagers();
  }, []);

  useEffect(() => {
    const fetchAllEmployees = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/employeeRegistration`);
        if (response.ok) {
          const data = await response.json();
          setEmployee(data);
        } else {
          console.error("Failed to fetch AllEmployees");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchAllEmployees();
  }, []);

  const uniqueBranches = new Set(manager.map((item) => item.branch_name));
  const totalBranches = uniqueBranches.size;

  return (
    <div className="lg:flex block bg-cover bg-center min-h-screen bg-[#f6f5fb]">
      <div className="w-full lg:w-auto">
        <Sidebar />
      </div>
      <div className="flex-1 px-2 mt-4  bg-opacity-75 bg-white relative">
        <div
          className="lg:text-4xl md:text-2xl rounded text-2xl font-bold  h-auto text-white w-full lg:h-24 mb-5 py-5 pl-5 flex flex-col items-center justify-start"
          style={{ backgroundImage: `url(${shade1})` }}
        >
          Attic's Chat-up Dashboard
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div
            className="p-4 rounded-lg shadow-lg bg-cover"
            style={{ backgroundImage: `url(${shade2})`, opacity: 0.5 }}
          >
            <div className="lg:text-xl md:text-xl text-sm font-bold text-white">
              No of Registered Employees
            </div>
            <div className="text-2xl text-white">{employee.length}</div>
          </div>
          <div
            className="p-4 rounded-lg shadow-lg bg-cover"
            style={{ backgroundImage: `url(${back19})` }}
          >
            <div className="lg:text-xl md:text-xl text-sm font-bold text-white">
              No of Registered Branch Managers
            </div>
            <div className="text-2xl text-white">{manager.length}</div>
          </div>
          <div
            className="p-4 rounded-lg shadow-lg bg-cover"
            style={{ backgroundImage: `url(${back13})` }}
          >
            <div className="lg:text-xl md:text-xl text-sm font-bold text-white">
              No of Branches
            </div>
            <div className="text-2xl text-white">{totalBranches}</div>
          </div>
        </div>
        <div className="w-full">
          <Table />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

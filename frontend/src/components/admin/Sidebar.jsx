import React, { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { BsChatSquareDots } from "react-icons/bs";
import { MdGroups } from "react-icons/md";
import { RiContactsLine } from "react-icons/ri";
import { BiLogOut } from "react-icons/bi";
import logo from "../../assests/logo.png";
import { SiLivechat } from "react-icons/si";
import { Link, useNavigate } from "react-router-dom";
import { GrChatOption } from "react-icons/gr";
import { MdDashboard } from "react-icons/md";
import { FcManager } from "react-icons/fc";
import { RiBillLine } from "react-icons/ri";
import { GiPerson } from "react-icons/gi";
import { FcBusinessman } from "react-icons/fc";
import { FcSurvey } from "react-icons/fc";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { TbMessageForward } from "react-icons/tb";
import { BiSolidMessageCheck } from "react-icons/bi";
const Sidebar = () => {
  const navigate = useNavigate();
  const [showEmployeeOptions, setShowEmployeeOptions] = useState(false);
  const [activeRoute, setActiveRoute] = useState("/atticDashboard"); // Default active route

  const handleNavigation = (route) => {
    setActiveRoute(route);
    navigate(route);
  };

  const handleLogout = () => {
    navigate("/");
    localStorage.clear();
  };

  const employeeRoutes = [
    "/register",
    "/billingTeamRegister",
    "/managerRegister",
  ];

  return (
    <div className="flex flex-row lg:flex-col h-[80px] lg:h-screen w-full lg:w-[100px] left-0 bg-[#5443c3] border-b lg:border-r shadow-md justify-between items-center py-[10px] lg:py-[20px] text-gray-500">
      <div className="w-16 md:w-20 lg:w-24 h-12 md:h-16 lg:h-20 mx-3 bg-[#fffefd] rounded-2xl flex items-center justify-center">
        <img className="m-2 md:m-4 lg:m-6" src={logo} alt="Logo" />
      </div>

      <div className="flex flex-row lg:flex-col gap-2 md:gap-3 lg:gap-5 relative">
        <div
          onClick={() => handleNavigation("/admindashboard")}
          className={`group relative flex items-center rounded-full p-2 md:p-4 lg:p-5 cursor-pointer ${
            activeRoute === "/atticDashboard"
              ? "bg-blue-500 text-white"
              : "bg-[#fffefd]"
          }`}
        >
          <MdDashboard className="text-lg md:text-2xl lg:text-3xl" />
          <span className="absolute lg:bottom-auto lg:left-full mt-16 lg:ml-0 lg:mt-2 z-50 whitespace-nowrap bg-black text-white text-xs md:text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Dashboard
          </span>
        </div>

        <div
          onClick={() => handleNavigation("/Groups")}
          className={`group relative flex items-center rounded-full p-2 md:p-4 lg:p-5 z-50 cursor-pointer ${
            activeRoute === "/Groups"
              ? "bg-blue-500 text-white"
              : "bg-[#fffefd]"
          }`}
        >
          <GrChatOption className="text-lg md:text-2xl lg:text-3xl" />
          <span className="absolute lg:bottom-auto lg:left-full mt-16 lg:ml-0 lg:mt-2 whitespace-nowrap z-50 bg-black text-white text-xs md:text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Group Chat
          </span>
        </div>

        <div
          onMouseEnter={() => setShowEmployeeOptions(true)}
          onMouseLeave={() => setShowEmployeeOptions(false)}
          className={`group relative flex items-center rounded-full p-2 md:p-4 lg:p-5 cursor-pointer z-50 ${
            employeeRoutes.includes(activeRoute)
              ? "bg-blue-500 text-white"
              : "bg-[#fffefd]"
          }`}
        >
          <PersonAddIcon className="text-lg md:text-2xl lg:text-3xl" />
          <span
            className="absolute lg:bottom-auto lg:left-full mt-48 lg:ml-0 lg:mt-2 whitespace-nowrap bg-black text-white text-xs md:text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ display: showEmployeeOptions ? "block" : "none" }}
          >
            <div
              onClick={() => handleNavigation("/register")}
              className="flex items-center gap-2 cursor-pointer hover:text-red-500 lg:hover:text-xl hover:text-sm"
            >
              <FcManager className="bg-white rounded-full  mr-2 my-2 text-2xl" />
              <span className="my-2">Employee Registration</span>
            </div>
            <div
              onClick={() => handleNavigation("/billingTeamRegister")}
              className="flex items-center gap-2 cursor-pointer hover:text-red-500 lg:hover:text-xl hover:text-sm"
            >
              <FcSurvey className="bg-white rounded-full mr-2 my-2 text-2xl" />
              <span className="my-2">Billing Team Registration</span>
            </div>
            <div
              onClick={() => handleNavigation("/managerRegister")}
              className="flex items-center gap-2 cursor-pointer hover:text-red-500 lg:hover:text-xl hover:text-sm"
            >
              <FcBusinessman className="bg-white rounded-full mr-2 my-2 text-2xl" />
              <span className="my-2">Manager Registration</span>
            </div>

            <div
              onClick={() => handleNavigation("/DigitalMarketingReg")}
              className="flex items-center gap-2 cursor-pointer hover:text-red-500 lg:hover:text-xl hover:text-sm"
            >
              <FcBusinessman className="bg-white rounded-full mr-2 my-2 text-2xl" />
              <span className="my-2">Digital Marketing Team Registration</span>
            </div>

            <div
              onClick={() => handleNavigation("/VirtualTeamReg")}
              className="flex items-center gap-2 cursor-pointer hover:text-red-500 lg:hover:text-xl hover:text-sm"
            >
              <FcBusinessman className="bg-white rounded-full mr-2 my-2 text-2xl" />
              <span className="my-2">Virtual Team Registration</span>
            </div>

            <div
              onClick={() => handleNavigation("/CallCenterReg")}
              className="flex items-center gap-2 cursor-pointer hover:text-red-500 lg:hover:text-xl hover:text-sm"
            >
              <FcBusinessman className="bg-white rounded-full mr-2 my-2 text-2xl" />
              <span className="my-2">Call Center Team Registration</span>
            </div>

            <div
              onClick={() => handleNavigation("/AccountsReg")}
              className="flex items-center gap-2 cursor-pointer hover:text-red-500 lg:hover:text-xl hover:text-sm"
            >
              <FcBusinessman className="bg-white rounded-full mr-2 my-2 text-2xl" />
              <span className="my-2">Accounts Team Registration</span>
            </div>
            <div
              onClick={() => handleNavigation("/MonitoringReg")}
              className="flex items-center gap-2 cursor-pointer hover:text-red-500 lg:hover:text-xl hover:text-sm"
            >
              <FcBusinessman className="bg-white rounded-full mr-2 my-2 text-2xl" />
              <span className="my-2">Monitoring Team Registration</span>
            </div>
            <div
              onClick={() => handleNavigation("/BouncerReg")}
              className="flex items-center gap-2 cursor-pointer hover:text-red-500 lg:hover:text-xl hover:text-sm"
            >
              <FcBusinessman className="bg-white rounded-full mr-2 my-2 text-2xl" />
              <span className="my-2">Bouncer Registration</span>
            </div>
          </span>
        </div>

       
        <div
          onClick={() => handleNavigation("/livemesages")}
          className={`group relative flex items-center rounded-full z-50 p-2 md:p-4 lg:p-5 cursor-pointer ${
            activeRoute === "/livemesages"
              ? "bg-blue-500 text-white"
              : "bg-[#fffefd]"
          }`}
        >
          <TbMessageForward  className="text-lg md:text-2xl lg:text-3xl" />
          <span className="absolute lg:bottom-auto lg:left-full mt-16 z-50 lg:ml-0 lg:mt-2 whitespace-nowrap bg-black text-white text-xs md:text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Live Chat
          </span>
        </div>

        <Link
          to="/adminToemp"
          className={`group relative flex items-center rounded-full p-2 md:p-4 lg:p-5 cursor-pointer ${
            activeRoute === "/adminToemp"
              ? "bg-blue-500 text-white"
              : "bg-[#fffefd]"
          }`}
        >
          <BsChatSquareDots className="text-lg md:text-2xl lg:text-3xl" />
          <span className="absolute lg:bottom-auto lg:left-full mt-16 lg:ml-0 lg:mt-2 z-50 whitespace-nowrap bg-black text-white text-xs md:text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Employee
          </span>
        </Link>

        <Link
          to="/adminToadmin"
          className={`group relative flex items-center rounded-full p-2 md:p-4 z-50 lg:p-5 cursor-pointer ${
            activeRoute === "/adminToadmin"
              ? "bg-blue-500 text-white"
              : "bg-[#fffefd]"
          }`}
        >
          <BiSolidMessageCheck  className="text-lg md:text-2xl lg:text-3xl" />
          <span className="absolute lg:bottom-auto lg:left-full mt-16 lg:ml-0 lg:mt-2 z-50 whitespace-nowrap bg-black text-white text-xs md:text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Admin
          </span>
        </Link>
      </div>

      <div
        onClick={handleLogout}
        className="group relative flex items-center bg-[#fffefd] rounded-full p-2 md:p-4 lg:p-5 cursor-pointer"
      >
        <BiLogOut className="text-lg md:text-2xl lg:text-3xl" />
        <span className="absolute lg:bottom-auto lg:left-full mt-16 lg:ml-0 lg:mt-2 whitespace-nowrap bg-black text-white text-xs md:text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Logout
        </span>
      </div>
    </div>
  );
};

export default Sidebar;
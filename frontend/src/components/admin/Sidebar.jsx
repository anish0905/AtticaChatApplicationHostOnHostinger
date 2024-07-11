import React, { useState } from "react";
import { BsChatSquareDots } from "react-icons/bs";
import { BiLogOut } from "react-icons/bi";
import logo from "../../assests/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { GrChatOption } from "react-icons/gr";
import { MdDashboard } from "react-icons/md";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { TbMessageForward } from "react-icons/tb";
import { BiSolidMessageCheck } from "react-icons/bi";
import { FaLaptop } from "react-icons/fa";
import { GrVirtualMachine } from "react-icons/gr";
import { MdAddCall } from "react-icons/md";
import { MdAccountTree } from "react-icons/md";
import { FaHourglassHalf } from "react-icons/fa";
import { TbBounceLeft } from "react-icons/tb";
import { GrCloudSoftware } from "react-icons/gr";
import { GiHumanTarget } from "react-icons/gi";
import { MdSecurity } from "react-icons/md";
import { IoPersonSharp } from "react-icons/io5";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { GrUserManager } from "react-icons/gr";

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
    <div className="flex justify-evenly flex-row lg:flex-col h-[80px] lg:h-screen w-screen lg:w-[100px]  left-0 bg-[#5443c3] border-b lg:border-r shadow-md lg:justify-between items-center py-[10px] lg:py-[20px] text-gray-500">
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
          className={`group relative flex items-center rounded-full p-2 md:p-4 lg:p-5 cursor-pointer z-50  ${
            employeeRoutes.includes(activeRoute)
              ? "bg-blue-500 text-white"
              : "bg-[#fffefd]"
          }`}
        >
          <PersonAddIcon className="text-lg md:text-2xl lg:text-3xl" />
          <span
            className="absolute lg:bottom-auto lg:w-96 lg:left-full lg:-top-60 top-12 -right-20 lg:ml-0 lg:mt-2 whitespace-nowrap bg-[#f6f5fb] text-[#5443c3] border border-[#5443c3] text-xs lg:text-lg md:text-sm rounded py-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 "
            style={{ display: showEmployeeOptions ? "block" : "none" }}
          >
            <div
              onClick={() => handleNavigation("/register")}
              className="flex items-center gap-2 cursor-pointer hover:text-red-500 lg:hover:text-2xl hover:text-sm"
            >
              <IoPersonSharp className="bg-white rounded-full  mr-2 my-2 text-2xl" />
              <span className="my-2">Employee Registration</span>
            </div>
            <div
              onClick={() => handleNavigation("/billingTeamRegister")}
              className="flex items-center gap-2 cursor-pointer hover:text-red-500 lg:hover:text-2xl hover:text-sm"
            >
              <FaMoneyBillTrendUp className="bg-white rounded-full mr-2 my-2 text-2xl" />
              <span className="my-2">Billing Team Registration</span>
            </div>
            <div
              onClick={() => handleNavigation("/managerRegister")}
              className="flex items-center gap-2 cursor-pointer hover:text-red-500 lg:hover:text-2xl hover:text-sm"
            >
              <GrUserManager className="bg-white rounded-full mr-2 my-2 text-2xl" />
              <span className="my-2">Manager Registration</span>
            </div>

            <div
              onClick={() => handleNavigation("/DigitalMarketingReg")}
              className="flex items-center gap-2 cursor-pointer hover:text-red-500 lg:hover:text-xl hover:text-sm"
            >
              <FaLaptop className="bg-white rounded-full mr-2 my-2 text-2xl" />
              <span className="my-2">Digital Marketing Team Registration</span>
            </div>

            <div
              onClick={() => handleNavigation("/VirtualTeamReg")}
              className="flex items-center gap-2 cursor-pointer hover:text-red-500 lg:hover:text-2xl hover:text-sm"
            >
              <GrVirtualMachine className="bg-white rounded-full mr-2 my-2 text-2xl" />
              <span className="my-2">Virtual Team Registration</span>
            </div>

            <div
              onClick={() => handleNavigation("/CallCenterReg")}
              className="flex items-center gap-2 cursor-pointer hover:text-red-500 lg:hover:text-2xl hover:text-sm"
            >
              <MdAddCall className="bg-white rounded-full mr-2 my-2 text-2xl" />
              <span className="my-2">Call Center Team Registration</span>
            </div>

            <div
              onClick={() => handleNavigation("/AccountsReg")}
              className="flex items-center gap-2 cursor-pointer hover:text-red-500 lg:hover:text-2xl hover:text-sm"
            >
              <MdAccountTree className="bg-white rounded-full mr-2 my-2 text-2xl" />
              <span className="my-2">Accounts Team Registration</span>
            </div>
            <div
              onClick={() => handleNavigation("/MonitoringReg")}
              className="flex items-center gap-2 cursor-pointer hover:text-red-500 lg:hover:text-2xl hover:text-sm"
            >
              <FaHourglassHalf className="bg-white rounded-full mr-2 my-2 text-2xl" />
              <span className="my-2">Monitoring Team Registration</span>
            </div>
            <div
              onClick={() => handleNavigation("/BouncerReg")}
              className="flex items-center gap-2 cursor-pointer hover:text-red-500 lg:hover:text-2xl hover:text-sm"
            >
              <TbBounceLeft className="bg-white rounded-full mr-2 my-2 text-2xl" />
              <span className="my-2">Bouncer Registration</span>
            </div>

            <div
              onClick={() => handleNavigation("/SoftwareReg")}
              className="flex items-center gap-2 cursor-pointer hover:text-red-500 lg:hover:text-2xl hover:text-sm"
            >
              <GrCloudSoftware className="bg-white rounded-full mr-2 my-2 text-2xl" />
              <span className="my-2">Software Registration</span>
            </div>

            <div
              onClick={() => handleNavigation("/HrReg")}
              className="flex items-center gap-2 cursor-pointer hover:text-red-500 lg:hover:text-2xl hover:text-sm"
            >
              <GiHumanTarget className="bg-white rounded-full mr-2 my-2 text-2xl" />
              <span className="my-2">Hr Registration</span>
            </div>

            <div
              onClick={() => handleNavigation("/SecurityReg")}
              className="flex items-center gap-2 cursor-pointer hover:text-red-500 lg:hover:text-2xl hover:text-sm"
            >
              <MdSecurity className="bg-white rounded-full mr-2 my-2 text-2xl" />
              <span className="my-2">Security Registration</span>
            </div>
            <div
              onClick={() => handleNavigation("/LogisticReg")}
              className="flex items-center gap-2 cursor-pointer hover:text-red-500 lg:hover:text-2xl hover:text-sm"
            >
              <MdSecurity className="bg-white rounded-full mr-2 my-2 text-2xl" />
              <span className="my-2">Logistic Registration</span>
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
          <TbMessageForward className="text-lg md:text-2xl lg:text-3xl" />
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
            Employee Chat
          </span>
        </Link>

        {/* <Link
          to="/adminToadmin"
          className={`group relative flex items-center rounded-full p-2 md:p-4 z-50 lg:p-5 cursor-pointer ${
            activeRoute === "/adminToadmin"
              ? "bg-blue-500 text-white"
              : "bg-[#fffefd]"
          }`}
        >
          <BiSolidMessageCheck  className="text-lg md:text-2xl lg:text-3xl" />
          <span className="absolute lg:bottom-auto lg:left-full mt-16 lg:ml-0 lg:mt-2 z-50 whitespace-nowrap bg-black text-white text-xs md:text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Admin Chat
          </span>
        </Link> */}
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

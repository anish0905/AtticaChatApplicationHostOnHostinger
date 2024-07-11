import React, { useState } from 'react';
import { BiLogOut } from "react-icons/bi";
import { BsChatSquareDots } from "react-icons/bs";
import { GrChatOption } from "react-icons/gr";
import { RiContactsLine } from "react-icons/ri";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import logo from "../../assests/logo.png";
import { BiSolidMessageCheck } from "react-icons/bi";

const EmployeeSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  const [showTooltip, setShowTooltip] = useState(false);

  const handleGroup = () => {
    navigate("/empgroupchat");
  };

  const handleChat = () => {
    navigate("/chat");
  };

  const handleLogout = () => {
    navigate("/");
    localStorage.clear();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div className="flex relative z-40 lg:static flex-row lg:flex-col h-[80px] lg:h-screen w-full lg:w-[100px] left-0 bg-[#5443c3] border-b lg:border-r shadow-md justify-between items-center py-[10px] lg:py-[20px] text-gray-500">
        <div className="w-16 md:w-20 lg:w-24 h-12 md:h-16 lg:h-20 mx-3 bg-[#fffefd] rounded-2xl flex items-center justify-center">
          <img className="m-2 md:m-4 lg:m-6" src={logo} alt="Logo" />
        </div>

        <div className="flex flex-row lg:flex-col gap-2 md:gap-3 lg:gap-5 relative">
          <div
            onClick={handleGroup}
            className={`group relative flex items-center rounded-full p-3 md:p-5 ${isActive("/empgroupchat") ? "bg-blue-500 text-white" : "bg-[#fffefd]"}`}
          >
            <GrChatOption className="text-lg md:text-2xl lg:text-3xl" />
            <span className="absolute lg:bottom-auto lg:left-full mt-16 lg:ml-0 lg:mt-2 whitespace-nowrap z-50 bg-black text-white text-xs md:text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Group Chat
            </span>
          </div>

          <div
            onClick={handleChat}
            className={`group relative flex items-center rounded-full p-3 md:p-5 ${isActive("/chat") ? "bg-blue-500 text-white" : "bg-[#fffefd]"}`}
          >
            <BsChatSquareDots className="text-lg md:text-2xl lg:text-3xl" />
            <span className="absolute lg:bottom-auto lg:left-full mt-16 lg:ml-0 lg:mt-2 whitespace-nowrap z-50 bg-black text-white text-xs md:text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Employee Chat
            </span>
          </div>

          <Link
            to="/empToadmin"
            className={`group relative flex items-center rounded-full p-3 md:p-5 ${isActive("/empToadmin") ? "bg-blue-500 text-white" : "bg-[#fffefd]"}`}
          >
            <BiSolidMessageCheck className="text-lg md:text-2xl lg:text-3xl" />
            <span className="absolute lg:bottom-auto lg:left-full mt-16 lg:ml-0 lg:mt-2 whitespace-nowrap z-50 bg-black text-white text-xs md:text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Admin Chat
            </span>
          </Link>
        </div>

        <div className="flex flex-row lg:flex-col items-center gap-2 md:gap-3 lg:gap-5 cursor-pointer">
          <div className="group relative flex items-center bg-[#fffefd] rounded-full p-3 md:p-5">
            <div
              className="group relative"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <CgProfile className="text-lg md:text-2xl lg:text-3xl" />

              {showTooltip && (
                <div className="absolute top-full left-0 mt-2 p-4 bg-black text-white text-sm md:text-md rounded shadow-md z-10 items-start">
                  <p>Name: {userDetails.name}</p>
                </div>
              )}
            </div>
          </div>

          <div onClick={handleLogout} className="group relative flex items-center bg-[#fffefd] rounded-full p-3 md:p-5">
            <BiLogOut className="text-lg md:text-2xl lg:text-3xl" />
            <span className="absolute lg:bottom-auto lg:left-full mt-16 lg:ml-0 lg:mt-2 whitespace-nowrap bg-black text-white text-xs md:text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Logout
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeSidebar;
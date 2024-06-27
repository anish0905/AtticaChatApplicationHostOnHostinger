

import React from 'react';
import { BiLogOut } from "react-icons/bi";
import { BsChatSquareDots } from "react-icons/bs";
import { GrChatOption } from "react-icons/gr";
import { RiContactsLine } from "react-icons/ri";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from "../../assests/logo.png";

const Sidebar = ({value}) => {
  console.log("value    ",value,"   ")
  const navigate = useNavigate();
  const location = useLocation();

console.log("value",value)
  
  
  const handleChat = () => {
    if (value === "HR") {
      navigate("/HrToHrChat");
    } else if (value === "ACCOUNT") {
      navigate("/AccountToAccountChat");
    }else if (value === "SOFTWARE") {
      navigate("/SoftwareToSoftwareChat");
    } else if (value === "SECURITY") {
      navigate("/SecurityChat");
    }  else {
      navigate("/");
    }
  };

  const handleAdminChat = () => {
    if (value === "HR") {
      navigate("/HrToAdminChat");
    } else if (value === "ACCOUNT") {
      navigate("/AccountToAdminChat");
    }
    else if (value === "SOFTWARE") {
      navigate("/SoftwareToAdminChat");
    } else if(value === "SECURITY"){
      navigate("/SecurityToAdminChat");
    }else {
      navigate("/");
    }
  }

  const handleLogout = () => {
    navigate("/");
    localStorage.clear();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className='flex flex-row lg:flex-col h-[80px] lg:h-screen w-full lg:w-[140px] left-0 bg-[#5443c3] border-b lg:border-r shadow-md justify-between items-center py-[10px] lg:py-[20px] text-gray-500 text-2xl md:text-3xl'>
      <div className="w-16 md:w-24 lg:w-32 h-16 md:h-16  lg:h-24 mx-3 bg-[#fffefd] rounded-2xl flex items-center justify-center">
        <img className="m-2 md:m-4 lg:m-10" src={logo} alt="Logo" />
      </div>
      
      <div className="flex flex-row lg:flex-col gap-[10px] sm:gap-[10px] md:gap-[10px] lg:gap-[40px] relative">
          <div 
          onClick={handleChat} 
          className={`group relative flex items-center rounded-full p-3 md:p-5 ${isActive("/chat") ? "bg-blue-500 text-white" : "bg-[#fffefd]"}`}
        >
          <BsChatSquareDots />
          <span className="absolute top-full lg:top-auto lg:left-full ml-2 lg:ml-0 lg:mt-2 lg:mb-0 whitespace-nowrap bg-white text-black text-xs md:text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Chat
          </span>
        </div>

        <div 
          onClick={handleAdminChat } 
          className={`group relative flex items-center rounded-full p-3 md:p-5 ${isActive("/chat") ? "bg-blue-500 text-white" : "bg-[#fffefd]"}`}
        >
          <RiContactsLine/>
          <span className="absolute top-full lg:top-auto lg:left-full ml-2 lg:ml-0 lg:mt-2 lg:mb-0 whitespace-nowrap bg-white text-black text-xs md:text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Admin
          </span>
        </div>
             
      </div>
      
      <div onClick={handleLogout} className="group relative flex items-center bg-[#fffefd] rounded-full p-3 md:p-5 ">
        <BiLogOut />
        <span className="absolute top-full lg:top-auto lg:left-full ml-2 lg:ml-0 lg:mt-2 lg:mb-0 whitespace-nowrap bg-white text-black text-xs md:text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Logout
        </span>
      </div>
    </div>
  );
};

export default Sidebar;

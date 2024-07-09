import { BiLogOut } from "react-icons/bi";
import { BsChatSquareDots } from "react-icons/bs";
import { RiContactsLine } from "react-icons/ri";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assests/logo.png";
import { CgProfile } from "react-icons/cg";
import { useState } from "react";

const UserSidebar = ({ value }) => {
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  const navigate = useNavigate();
  const location = useLocation();
  const [showTooltip, setShowTooltip] = useState(false);
   console.log("value    ",value)
  const handleChat = () => {   //LOGISTIC
    switch (value) {
      case "HR":
        navigate("/HrToHrChat");
        break;
      case "ACCOUNT":
        navigate("/AccountToAccountChat");
        break;
      case "SOFTWARE":
        navigate("/SoftwareToSoftwareChat");
        break;
      case "BOUNCER":
        navigate("/bouncerChat");
        break;
      case "DIGITALMARKETING":
        navigate("/DigitalMarketingChatToDigitalMarketing");
        break;
      case "MONITORING":
        navigate("/monitoringTeamChat");
        break;
      case "VIRTUAL":
        navigate("/VirtualTeamToVirtualTeam");
        break;
      case "SECURITY":
        navigate("/SecurityChat");
        break;
      case "TE":
        navigate("/TEChat");
        break;
      case "LOGISTIC": 
          navigate("/LogisticChat");
          break;
      default:
        navigate("/");
    }
  };

  const handleAdminChat = () => {
    switch (value) {
      case "HR":
        navigate("/HrToAdminChat");
        break;
      case "ACCOUNT":
        navigate("/AccountToAdminChat");
        break;
      case "SOFTWARE":
        navigate("/SoftwareToAdminChat");
        break;
      case "BOUNCER":
        navigate("/BouncerToAdminChat");
        break;
      case "DIGITALMARKETING":
        navigate("/DigitalMarketingToAdminChat");
        break;
      case "MONITORING":
        navigate("/MonitoringTeamToAdminChat");
        break;
      case "VIRTUAL":
        navigate("/VirtualTeamToAdminChat");
        break;
      case "SECURITY":
        navigate("/SecurityToAdminChat");
        break;
      case "TE":
        navigate("/techattoadmin");
        break;
        case "LOGISTIC":
          navigate("/LogisticToAdminChat");
          break;
      default:
        navigate("/");
    }
  };

  const handleLogout = () => {
    navigate("/");
    localStorage.clear();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex flex-row lg:flex-col h-[80px] lg:h-screen w-full lg:w-[100px] left-0 bg-[#5443c3] border-b lg:border-r shadow-md justify-between items-center py-[10px] lg:py-[20px] text-gray-500 text-2xl md:text-3xl">
      <div className="w-16 md:w-20 lg:w-24 h-12 md:h-16 lg:h-20 mx-3 bg-[#fffefd] rounded-2xl flex items-center justify-center">
        <img className="m-2 md:m-4 lg:m-6" src={logo} alt="Logo" />
      </div>
      {/* <p className='text-white text-base lg:text-xl'>{userDetails?.name}</p> */}

      <div className="flex flex-row lg:flex-col gap-[10px] sm:gap-[10px] md:gap-[10px] lg:gap-[40px] relative">
        <div
          onClick={handleChat}
          className={`group relative flex items-center rounded-full p-3 md:p-5 ${
            isActive("/HrToHrChat") ||
            isActive("/AccountToAccountChat") ||
            isActive("/SoftwareToSoftwareChat") ||
            isActive("/bouncerChat") ||
            isActive("/DigitalMarketingChatToDigitalMarketing") ||
            isActive("/monitoringTeamChat") ||
            isActive("/VirtualTeamToVirtualTeam") ||
            isActive("/SecurityChat") ||
            isActive("/TEChat")
              ? "bg-blue-500 text-white"
              : "bg-[#fffefd]"
          }`}
        >
          <BsChatSquareDots />
          <span className="absolute top-full lg:top-auto lg:left-full ml-2 lg:ml-0 lg:mt-2 lg:mb-0 whitespace-nowrap bg-black text-white text-xs md:text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Chat
          </span>
        </div>

        <div
          onClick={handleAdminChat}
          className={`group relative flex items-center rounded-full p-3 md:p-5 ${
            isActive("/HrToAdminChat") ||
            isActive("/AccountToAdminChat") ||
            isActive("/SoftwareToAdminChat") ||
            isActive("/BouncerToAdminChat") ||
            isActive("/DigitalMarketingToAdminChat") ||
            isActive("/MonitoringTeamToAdminChat") ||
            isActive("/VirtualTeamToAdminChat") ||
            isActive("/SecurityToAdminChat") ||
            isActive("/techattoadmin")
              ? "bg-blue-500 text-white"
              : "bg-[#fffefd]"
          }`}
        >
          <RiContactsLine />
          <span className="absolute top-full lg:top-auto lg:left-full ml-2 lg:ml-0 lg:mt-2 lg:mb-0 whitespace-nowrap bg-black text-white text-xs md:text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Admin
          </span>
        </div>
      </div>

      <div className="flex flex-row lg:flex-col gap-[10px] sm:gap-[10px] md:gap-[10px] lg:gap-[40px] relative">
        <div className="flex items-center flex-col">
          <div className="group relative flex items-center bg-[#fffefd] hover:bg-blue-500 rounded-full p-3 md:p-5 ">
            <div
              className="group relative"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <CgProfile />
              <span className="absolute top-full lg:top-auto lg:left-full ml-2 lg:ml-0 lg:mt-2 lg:mb-0 whitespace-nowrap bg-white text-black text-xs md:text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Profile
              </span>
              {showTooltip && (
                <div className="absolute top-full left-0 mt-2 p-4 bg-black text-white text-sm md:text-md rounded shadow-md z-10 items-start">
                  <p>Email: {userDetails.email}</p>
                  <p>Name: {userDetails.name}</p>
                  <p>Role: {userDetails.role}</p>
                </div>
              )}
            </div>
          </div>
          <p className="text-white text-base lg:text-xl items-center hidden lg:flex">
            {userDetails?.name}
          </p>
        </div>

        <div
          onClick={handleLogout}
          className="group relative flex items-center bg-[#fffefd] hover:bg-blue-500 rounded-full p-3 md:p-5 "
        >
          <BiLogOut />
          <span className="absolute top-full lg:top-auto lg:left-full ml-2 lg:ml-0 lg:mt-2 lg:mb-0 whitespace-nowrap bg-black text-white text-xs md:text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Logout
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;

import { BiLogOut } from "react-icons/bi";
import { BsChatSquareDots } from "react-icons/bs";
import { RiContactsLine } from "react-icons/ri";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assests/logo.png"
import { CgProfile } from "react-icons/cg";
import { useEffect, useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import fetchAnnounce from '../utility/fetchAnnounce';

const CashierSidebar = ({ value, newNotificationCount }) => {
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  const navigate = useNavigate();
  const location = useLocation();
  const [showTooltip, setShowTooltip] = useState(false);
  const [announcements, setAnnouncements] = useState([]);

  const paths = {
    chat: {
      HR: "/HrToHrChat",
      CALLCENTER: "/CallCenterToCallCenter",
      ACCOUNT: "/AccountToAccountChat",
      SOFTWARE: "/SoftwareToSoftwareChat",
      BOUNCER: "/bouncerChat",
      DIGITALMARKETING: "/DigitalMarketingChatToDigitalMarketing",
      MONITORING: "/monitoringTeamChat",
      VIRTUAL: "/VirtualTeamToVirtualTeam",
      SECURITY: "/SecurityChat",
      TE: "/TEChat",
      LOGISTIC: "/LogisticChat",
      CASHIER: "/CashierManagerChat",
    },
    adminChat: {
      HR: "/HrToAdminChat",
      CALLCENTER: "/CallCenterToAdminChat",
      ACCOUNT: "/AccountToAdminChat",
      SOFTWARE: "/SoftwareToAdminChat",
      BOUNCER: "/BouncerToAdminChat",
      DIGITALMARKETING: "/DigitalMarketingToAdminChat",
      MONITORING: "/MonitoringTeamToAdminChat",
      VIRTUAL: "/VirtualTeamToAdminChat",
      SECURITY: "/SecurityToAdminChat",
      TE: "/techattoadmin",
      LOGISTIC: "/LogisticToAdminChat",
    },
    groupChat: {
      HR: "/groupChat/getAllHRTeam",
      CALLCENTER: "/groupChat/getAllCallCenterTeam",
      ACCOUNT: "/groupChat/getAllAccountantTeam",
      SOFTWARE: "/groupChat/getAllSoftwareTeam",
      BOUNCER: "/groupChat/getAllSoftwareTeam",
      DIGITALMARKETING: "/groupChat/getAllDigitalMarketingTeam",
      MONITORING: "/groupChat/AllMonitoringTeam",
      VIRTUAL: "/groupChat/getAllVirtualTeam",
      SECURITY: "/groupChat/getAllSoftwareTeam",
      TE: "/groupChat/getAllSoftwareTeam",
      LOGISTIC: "/groupChat/getAllSoftwareTeam",
    },
    announcements: {
      HR: "/fetchAllAnnouncement/HrToHrChat",
      CALLCENTER: "/fetchAllAnnouncement/CallCenterToCallCenter",
      ACCOUNT: "/fetchAllAnnouncement/AccountToAccountChat",
      SOFTWARE: "/fetchAllAnnouncement/SoftwareToSoftwareChat",
      BOUNCER: "/fetchAllAnnouncement/getAllBouncersTeam",
      DIGITALMARKETING: "/fetchAllAnnouncement/DigitalMarketingChatToDigitalMarketing",
      MONITORING: "/fetchAllAnnouncement/monitoringTeamChat",
      VIRTUAL: "/fetchAllAnnouncement/VirtualTeamToVirtualTeam",
      SECURITY: "/fetchAllAnnouncement/getAllSecurityTeam",
      TE: "/fetchAllAnnouncement/getAllTE",
      LOGISTIC: "/fetchAllAnnouncement/getAllLogistic",
      Cashier: "/fetchAllAnnouncement/CashierManagerChat",
    },
  };

  const handleNavigation = (type) => {
    navigate(paths[type][value] || "/");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAnnounce();
        setAnnouncements(data);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 10000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-row lg:flex-col h-[80px] lg:h-screen w-full lg:w-[100px] left-0 bg-[#5443c3] border-b lg:border-r shadow-md justify-around items-center py-[10px] lg:py-[20px] text-gray-500 text-2xl md:text-3xl">
      <div className="w-16 md:w-20 lg:w-24 h-12 md:h-16 lg:h-20 mx-3 bg-[#fffefd] rounded-2xl flex items-center justify-center">
        <img className="m-2 md:m-4 lg:m-6" src={logo} alt="Logo" />
      </div>
      
      <div
        onClick={() => handleNavigation('announcements')}
        className={`group relative flex items-center rounded-full p-3 md:p-5 ${isActive("/fetchAllAnnouncement") ? "bg-blue-500 text-white" : "bg-[#fffefd]"}`}
      >
        <IoMdNotificationsOutline className="text-lg md:text-2xl lg:text-3xl" />
        {announcements.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
            {announcements.length}
          </span>
        )}
        <span className="absolute lg:bottom-auto lg:left-full mt-16 lg:ml-0 lg:mt-2 whitespace-nowrap z-50 bg-black text-white text-xs md:text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Announcement
        </span>
      </div>

      <div className="flex flex-row lg:flex-col gap-[10px] sm:gap-[10px] md:gap-[10px] lg:gap-[40px] relative">
        <div
          onClick={() => handleNavigation('/CashierManagerChat')}
          className={`group relative flex items-center rounded-full p-3 md:p-5 ${
            Object.values(paths.chat).includes(location.pathname) ? "bg-blue-500 text-white" : "bg-[#fffefd]"
          }`}
        >
          <BsChatSquareDots />
          <span className="absolute top-full lg:top-auto lg:left-full ml-2 lg:ml-0 lg:mt-2 lg:mb-0 whitespace-nowrap bg-black text-white text-xs md:text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Chat
          </span>
        </div>

        {/* <div
          onClick={() => handleNavigation('adminChat')}
          className={`group relative flex items-center rounded-full p-3 md:p-5 ${
            Object.values(paths.adminChat).includes(location.pathname) ? "bg-blue-500 text-white" : "bg-[#fffefd]"
          }`}
        >
          <RiContactsLine />
          <span className="absolute top-full lg:top-auto lg:left-full ml-2 lg:ml-0 lg:mt-2 lg:mb-0 whitespace-nowrap bg-black text-white text-xs md:text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Admin
          </span>
        </div> */}
{/* 
        <div
          onClick={() => handleNavigation('groupChat')}
          className={`group relative flex items-center rounded-full p-3 md:p-5 ${
            Object.values(paths.groupChat).includes(location.pathname) ? "bg-blue-500 text-white" : "bg-[#fffefd]"
          }`}
        >
          <RiContactsLine />
          <span className="absolute top-full lg:top-auto lg:left-full ml-2 lg:ml-0 lg:mt-2 lg:mb-0 whitespace-nowrap bg-black text-white text-xs md:text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Group
          </span>
        </div> */}
      </div>

      <div className="flex flex-row lg:flex-col gap-[10px] sm:gap-[10px] md:gap-[10px] lg:gap-[40px] relative">
        <div className="flex items-center flex-col">
          <div className="group relative flex items-center bg-green-300 hover:bg-green-500 rounded-full p-3 md:p-5">
            <div
              className="group relative"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <CgProfile />
              {showTooltip && (
                <div className="absolute top-full left-0 mt-5 p-4 bg-black text-white text-sm md:text-md rounded shadow-md z-10">
                  <p>Email: {userDetails.email}</p>
                  <p>Name: {userDetails.name}</p>
                  <p>Role: {userDetails.role}</p>
                </div>
              )}
            </div>
          </div>
          <p className="text-white text-base lg:text-xl hidden lg:flex">
            {userDetails?.name}
          </p>
        </div>

        <div
          onClick={handleLogout}
          className="group relative flex items-center bg-red-500 hover:bg-red-700 text-white rounded-full p-3 md:p-5"
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

export default CashierSidebar;

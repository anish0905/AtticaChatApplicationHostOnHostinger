import React, { useEffect, useState } from "react";
import { BsChatSquareDots } from "react-icons/bs";
import { BiLogOut } from "react-icons/bi";
import logo from "../../assests/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { GrAnnounce, GrChatOption } from "react-icons/gr";
import { MdDashboard } from "react-icons/md";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { TbMessageForward } from "react-icons/tb";
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
import { CgProfile } from "react-icons/cg";
import { GiLogicGateAnd } from "react-icons/gi";
import { BASE_URL } from '../../constants';
import axios from "axios";


const Sidebar = () => {
  const navigate = useNavigate();
  const [showEmployeeOptions, setShowEmployeeOptions] = useState(false);
  const [activeRoute, setActiveRoute] = useState("/atticDashboard");
  const userAdmin = JSON.parse(localStorage.getItem('userAdmin'));
  const [userDetails, setUserDetails] = useState(null);

  const userId = localStorage.getItem('CurrentUserId');

  const fetchUserDetails = async () => {
    try {
      const resp = await axios.get(`${BASE_URL}/api/admin/admin/${userId}`);
      setUserDetails(resp.data);
      console.log(resp.data.department);
    } catch (error) {
      console.error("Fetch User Details Error:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleNavigation = (route) => {
    setActiveRoute(route);
    navigate(route);
  };

  const handleLogout = () => {
    navigate("/");
    localStorage.clear();
  };


  const getRegistrationOptions = () => {
    if (!userDetails) return null;

    switch (userDetails.department) {
      case 'Employee':
        return [
          { route: "/register", icon: IoPersonSharp, label: "Employee Registration" },

        ];
      case 'Digital Marketing':
        return [
          { route: "/DigitalMarketingReg", icon: FaLaptop, label: "Digital Marketing Team Registration" }
        ];
      case 'VirtualTeam':
        return [
          { route: "/VirtualTeamReg", icon: GrVirtualMachine, label: "Virtual Team Registration" }
        ];
      case 'CallCenter':
        return [
          { route: "/CallCenterReg", icon: MdAddCall, label: "Call Center Team Registration" }
        ];
      case 'Accountant':
        return [
          { route: "/AccountsReg", icon: MdAccountTree, label: "Accounts Team Registration" }
        ];
      case 'MonitoringTeam':
        return [
          { route: "/MonitoringReg", icon: FaHourglassHalf, label: "Monitoring Team Registration" }
        ];
      case 'Bouncers/Driver':
        return [
          { route: "/BouncerReg", icon: TbBounceLeft, label: "Bouncer Registration" }
        ];
      case 'Software':
        return [
          { route: "/SoftwareReg", icon: GrCloudSoftware, label: "Software Registration" }
        ];
      case 'HR':
        return [
          { route: "/HrReg", icon: GiHumanTarget, label: "Hr Registration" }
        ];
      case 'TE':
        return [
          { route: "/TeReg", icon: GiHumanTarget, label: "TE Registration" }
        ];
      case 'Security':
        return [
          { route: "/SecurityReg", icon: MdSecurity, label: "Security Registration" }
        ];
      case 'Logistic':
        return [
          { route: "/LogisticReg", icon: GiLogicGateAnd, label: "Logistic Registration" }
        ];
      case 'Cashier':
        return [
          { route: "/CashierReg", icon: GiLogicGateAnd, label: "Cashier Registration" }
        ];
      case 'Manager':
        return [
          { route: "/managerRegister", icon: GrUserManager, label: "Manager Registration" },
        ];
      case 'Billing_Team':
        return [
          { route: "/billingTeamRegister", icon: FaMoneyBillTrendUp, label: "Billing Team Registration" },
        ]
      case 'Admin':
        return [
          { route: "/register", icon: IoPersonSharp, label: "Employee Registration" },
          { route: "/billingTeamRegister", icon: FaMoneyBillTrendUp, label: "Billing Team Registration" },
          { route: "/managerRegister", icon: GrUserManager, label: "Manager Registration" },
          { route: "/DigitalMarketingReg", icon: FaLaptop, label: "Digital Marketing Team Registration" },
          { route: "/VirtualTeamReg", icon: GrVirtualMachine, label: "Virtual Team Registration" },
          { route: "/CallCenterReg", icon: MdAddCall, label: "Call Center Team Registration" },
          { route: "/AccountsReg", icon: MdAccountTree, label: "Accounts Team Registration" },
          { route: "/MonitoringReg", icon: FaHourglassHalf, label: "Monitoring Team Registration" },
          { route: "/BouncerReg", icon: TbBounceLeft, label: "Bouncer Registration" },
          { route: "/SoftwareReg", icon: GrCloudSoftware, label: "Software Registration" },
          { route: "/HrReg", icon: GiHumanTarget, label: "Hr Registration" },
          { route: "/TeReg", icon: GiHumanTarget, label: "TE Registration" },
          { route: "/SecurityReg", icon: MdSecurity, label: "Security Registration" },
          { route: "/LogisticReg", icon: GiLogicGateAnd, label: "Logistic Registration" },
          { route: "/CashierReg", icon: GiLogicGateAnd, label: "Cashier Registration" }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="flex justify-evenly flex-row lg:flex-col h-[80px] lg:h-screen w-screen lg:w-[100px] left-0 bg-[#5443c3] border-b lg:border-r shadow-md lg:justify-between items-center py-[10px] lg:py-[20px] text-gray-500">
      <div className="w-16 md:w-20 lg:w-24 h-12 md:h-16 lg:h-20 mx-3 bg-[#fffefd] rounded-2xl flex items-center justify-center">
        <img className="m-2 md:m-4 lg:m-6" src={logo} alt="Logo" />
      </div>

      <div className="flex flex-row lg:flex-col gap-2 md:gap-3 lg:gap-5 relative">
        <div
          onClick={() => handleNavigation("/announcement")}
          className={`group relative flex items-center lg:rounded-full rounded-lg p-2 md:p-4 lg:p-5 z-50 cursor-pointer ${activeRoute === "/announcement"
            ? "bg-blue-500 text-white"
            : "bg-[#fffefd]"
            }`}
        >
          <GrAnnounce className="text-lg md:text-2xl lg:text-3xl" />
          <span className="absolute lg:bottom-auto lg:left-full mt-16 lg:ml-0 lg:mt-2 whitespace-nowrap z-50 bg-black text-white text-xs md:text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            announce
          </span>
        </div>

        <div
          onClick={() => handleNavigation("/admindashboard")}
          className={`group relative flex items-center lg:rounded-full rounded-lg p-2 md:p-4 lg:p-5 cursor-pointer ${activeRoute === "/atticDashboard"
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
          className={`group relative flex items-center lg:rounded-full rounded-lg p-2 md:p-4 lg:p-5 z-50 cursor-pointer ${activeRoute === "/Groups"
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
          className={`group relative flex items-center lg:rounded-full rounded-lg p-2 md:p-4 lg:p-5 cursor-pointer z-50 ${getRegistrationOptions()?.some(option => option.route === activeRoute)
            ? "bg-blue-500 text-white"
            : "bg-[#fffefd]"
            }`}
        >
          <PersonAddIcon className="text-lg md:text-2xl lg:text-3xl" />
          <span
            className={`absolute lg:bottom-auto lg:w-96 lg:left-full top-12 -right-20 lg:ml-0 lg:mt-2 whitespace-nowrap bg-[#f6f5fb] text-[#5443c3] border border-[#5443c3] text-xs lg:text-lg md:text-sm rounded py-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${userDetails?.department === 'Admin' ? 'lg:-top-60' : 'lg:top-0'}`}
            style={{ display: showEmployeeOptions ? "block" : "none" }}
          >
            {getRegistrationOptions()?.map((option, index) => (
              <div
                key={index}
                onClick={() => handleNavigation(option.route)}
                className="flex items-center gap-2 cursor-pointer hover:text-red-500 lg:hover:text-2xl hover:text-sm"
              >
                <option.icon className="bg-white rounded-full mr-2 my-2 text-2xl" />
                <span className="my-2">{option.label}</span>
              </div>
            ))}
          </span>
        </div>


        <div
          onClick={() => handleNavigation("/adminToemp")}
          className={`group relative flex items-center lg:rounded-full rounded-lg p-2 md:p-4 lg:p-5 z-50 cursor-pointer ${activeRoute === "/ChatPage"
            ? "bg-blue-500 text-white"
            : "bg-[#fffefd]"
            }`}
        >
          <BsChatSquareDots className="text-lg md:text-2xl lg:text-3xl" />
          <span className="absolute lg:bottom-auto lg:left-full mt-16 lg:ml-0 lg:mt-2 whitespace-nowrap z-50 bg-black text-white text-xs md:text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Chat Page
          </span>
        </div>

        <div
          onClick={() => handleNavigation("/EmpMessage")}
          className={`group relative flex items-center lg:rounded-full rounded-lg p-2 md:p-4 lg:p-5 z-50 cursor-pointer ${activeRoute === "/EmpMessage"
            ? "bg-blue-500 text-white"
            : "bg-[#fffefd]"
            }`}
        >
          <TbMessageForward className="text-lg md:text-2xl lg:text-3xl" />
          <span className="absolute lg:bottom-auto lg:left-full mt-16 lg:ml-0 lg:mt-2 whitespace-nowrap z-50 bg-black text-white text-xs md:text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Message Forward
          </span>
        </div>
      </div>

      <div className="relative flex flex-row lg:flex-col gap-3 lg:gap-5 lg:pb-5 items-center">
        <div
          onClick={handleLogout}
          className="group relative flex items-center lg:rounded-full rounded-lg p-2 md:p-4 lg:p-5 bg-[#fffefd] cursor-pointer z-50"
        >
          <BiLogOut className="text-lg md:text-2xl lg:text-3xl text-red-600" />
          <span className="absolute lg:bottom-auto lg:left-full mt-16 lg:ml-0 lg:mt-2 whitespace-nowrap bg-black text-white text-xs md:text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            logout
          </span>
        </div>

        <div
         
          className={`group relative flex items-center lg:rounded-full rounded-lg p-2 md:p-4 lg:p-5 z-50 cursor-pointer ${activeRoute === "/profile"
            ? "bg-blue-500 text-white"
            : "bg-[#fffefd]"
            }`}
        >
          <CgProfile className="text-lg md:text-2xl lg:text-3xl" />
          <span className="absolute lg:bottom-auto lg:left-full mt-16 lg:ml-0 lg:mt-2 whitespace-nowrap bg-black text-white text-xs md:text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div>Name: {userDetails?.name}</div>
            <div>Email: {userDetails?.email}</div>
            <div>Department: {userDetails?.department}</div>

          </span>
        </div>

      </div>
    </div>
  );
};

export default Sidebar;

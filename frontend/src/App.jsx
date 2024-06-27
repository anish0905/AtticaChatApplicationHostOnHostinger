import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthRequired from "./components/authentication/AuthRequired";
import Dashboard from "./components/admin/Dashboard";
import Login from "./components/employee/Login";
import ChatPage from "./components/employee/ChatPage";
import AdminRoutes from "./components/admin/AdminRoutes";
import AdminLogin from "./components/admin/AdminLogin";
import { Register } from "./components/admin/Register";
import FirstPage from "./components/FirstPage";
import Groups from "./components/admin/Pages/Groups";
import LiveChatMessages from "./components/admin/Pages/LiveChatMessages";
import Message from "./components/admin/Message";
import SuperAdminLogin from './components/SuperAdmin/SuperAdminLogin'

import AdminEmpChat from "./components/admin/AdminEmpChat";
import EmpAdminChat from "./components/employee/EmpAdminChat";
import { Empdashbord } from "./components/employee/Empdashbord";
import ManagerLogin from "./components/manager/ManagerLogin";
import ManagerChat from "./components/manager/ManagerChat";
import ManagerRegister from "./components/admin/ManagerRegister";
import BillingTeamManagerLogin from "./components/admin/BillingTeamManagerLogin";
import BillingTeamChat from "./components/BillingTeam/BillingTeamChat";
import BillingRegistrationModal from "./components/admin/BillingRegistrationModal";
import AtticDashboard from "./components/DashboardComponents/AtticDashboard"
import EmpGroupChat from "./components/employee/EmpGroupChat";
import AdmintoAdmin from "./components/admin/Pages/AdmintoAdmin";
import SuperAdmin from "./components/SuperAdmin/SuperAdmin";
import SuperAdminGroupList from "./components/SuperAdmin/SuperAdminGroupList";
import SuperAdminLiveChat from "./components/SuperAdmin/SuperAdminLiveChat";
import AdminDashboard from "./components/DashboardComponents/AdminDashboard";
import DigitalMarketingTeamLogin from "./components/digitalMarketing/DigitalMarketingTeamLogin";
import DigitalMarketingSideBar from "./components/digitalMarketing/DigitalMarketingSideBar";
import DigitalToDigitalTamChat from "./components/digitalMarketing/DigitalToDigitalTamChat";
import DigitalMarketingToAdminChat from "./components/digitalMarketing/DigitalMarketingToAdminChat";
import MonitoringTeamLogin from "./components/monitoringTeam/MonitoringTeamLogin"
import MonitoringReg from '../src/components/admin/Pages/MonitoringReg'
 
// import AdminRegistration from "./components/admin/AdminRegistration";
import AccountsLogin from "./components/accounts/AccountsLogin";
import SoftwareLogin from './components/software/SoftwareLogin'
import HrLogin from "./components/Hr/HrLogin";
import DigitalMarketingReg from "./components/admin/Pages/DigitalMarketingReg";
import AccountsReg from "./components/admin/Pages/AcountsReg";
import BouncerLogin from "./components/Bouncer/BouncerLogin";
import MonitoringTeamSideBar from "./components/monitoringTeam/MonitoringSidebar";
import MonitoringTeamChat from "./components/monitoringTeam/MonitoringTeamChat";
import MonitoringToAdminChat from "./components/monitoringTeam/MonitoringToAdminChat";
import BouncerTeamChat from "./components/Bouncer/BouncerTeamChat";
import BouncerToAdminChat from "./components/Bouncer/BouncerToAdminChat";
import BouncerSideBar from "./components/Bouncer/BouncerSidebar";
import BouncerReg from './components/admin/Pages/BouncerReg'
import CallCenterLogin from "./components/CallCenter/CallCenterLogin";
import VirtualTeamRegistration from "./components/VirtualTeam/VirtualTeamRegistration";
import VirtualTeamSidebar from "./components/VirtualTeam/VirtualTeamSidebar";
import VirtualToVirtualTeamChat from "./components/VirtualTeam/VirtualToVirtualTeamChat";
import VirtualTeamToAdminChat from "./components/VirtualTeam/ForwardMsgVirtualTeamToAdmin";
import CallCenterRegister from "./components/CallCenter/CallCenterRegister";
import CallCenterSidebar from "./components/CallCenter/CallCenterSidebar";
import CallCenterToCallCenterChat from "./components/CallCenter/CallCenterToCallCenterChat";
import VirtualTeamLogin from "./components/VirtualTeam/VirtualTeamLogin";
import CallCenterToAdminChat from "./components/CallCenter/CallCenterToAdminChat";
import HrRegister from "./components/Hr/HrRegister";
import HrToHrChat from "./components/Hr/HrToHrChat";
import HrToAdmin from "./components/Hr/HrToAdmin";
import AccountToAccountChat from "./components/accounts/AccountToAccountChat";
import AccountToAdminChat from "./components/accounts/AccountToAdminChat";

const App = () => {
  const isSuperAdminLoggedIn = localStorage.getItem('login');
  return (
    <BrowserRouter>
          <Routes>
          <Route path="/" element={<FirstPage/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/adminlogin" element={<AdminLogin/>} />
            <Route path="/kitkat" element={<SuperAdminLogin/>} />
            <Route path="/empgroupchat" element={<EmpGroupChat/>}/>

            <Route path="/DigitalTeamLogin" element={<DigitalMarketingTeamLogin/>} />
            <Route path="/DigitalSideBar" element={<DigitalMarketingSideBar/>} />
            <Route path="/DigitalMarketingChatToDigitalMarketing" element={<DigitalToDigitalTamChat />} />
            <Route path="/DigitalMarketingToAdminChat" element={<DigitalMarketingToAdminChat/>} />
            <Route path="/DigitalMarketingReg" element={<DigitalMarketingReg />} />
            <Route path="/AccountsReg" element={<AccountsReg />} />
            <Route path="/MonitoringReg" element={<MonitoringReg />} />
            <Route path="/BouncerReg" element={<BouncerReg />} />

            {/* <Route path="/adminRegistration" element={<AdminRegistration/>}/> */}
            <Route element={<AuthRequired/>}>
              <Route path="/chat" element={<ChatPage/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/adminToemp" element={<AdminEmpChat/>} />
            <Route path="/empToadmin" element={<EmpAdminChat/>} />
            <Route path="/empDashbord" element={<Empdashbord/>} />
            <Route path="/managerLogin" element={<ManagerLogin/>} />
            <Route path="/managerChat" element={<ManagerChat/>} />
            <Route path="/billingTeamRegister" element={<BillingRegistrationModal/>} />
            <Route path="/managerRegister" element={<ManagerRegister/>} />
            <Route path="/BillingTeamManagerLogin" element={<BillingTeamManagerLogin/>} />
            <Route path="/BillingTeamChat" element={<BillingTeamChat/>} />
            <Route path="/adminToadmin" element={<AdmintoAdmin/>} />
            <Route path="/admindashboard" element={<AdminDashboard />} />
              <Route path="/atticDashboard" element={<AtticDashboard/>} />
           
            <Route path='/software' element={<SoftwareLogin/>}/>
            <Route path="/hr" element={<HrLogin/>}/>
            <Route path="/security" element={<SecurityLogin/>}/>
            <Route path="/monitoringTeam" element={<MonitoringTeamLogin/>}/>
            <Route path="/MonitoringSideBar" element={<MonitoringTeamSideBar/>}/>
            <Route path="/monitoringTeamChat" element={<MonitoringTeamChat/>}/>
            <Route path="/MonitoringTeamToAdminChat" element={<MonitoringToAdminChat/>}/>
            <Route path="/monitoringTeam" element={<MonitoringReg/>}/>
            <Route path="/bouncerLogin" element={<BouncerLogin/>}/>
            <Route path="/bouncerChat" element={<BouncerTeamChat/>}/>
            <Route path="/BouncerToAdminChat" element={<BouncerToAdminChat/>}/>
            <Route path="/BouncerTeamSidebar" element={<BouncerSideBar/>}/>
             

            <Route path="/VirtualTeamSidebar" element={<VirtualTeamSidebar/>} />
            <Route path="/VirtualTeamToVirtualTeam" element={<VirtualToVirtualTeamChat/>} />
            <Route path="/VirtualTeamToAdminChat" element={<VirtualTeamToAdminChat/>} />
            <Route path="/VirtualTeamReg" element={<VirtualTeamRegistration />} />
            <Route path="/virtualTeam" element={<VirtualTeamLogin/>}/>

            <Route path="/CallCenterSidebar" element={<CallCenterSidebar/>} />
            <Route path="/CallCenterToCallCenter" element={<CallCenterToCallCenterChat/>} />
            <Route path="/CallCenterToAdminChat" element={<CallCenterToAdminChat/>} />
            <Route path="/CallCenterReg" element={<CallCenterRegister />} />
            <Route path="/callCenter" element={<CallCenterLogin/>}/>


          
            <Route path="/HrReg" element={<HrRegister />} />
            <Route path="/HrLogin" element={<HrLogin/>}/>
            <Route path="/HrToHrChat" element={<HrToHrChat/>}/>
            <Route path="/HrToAdminChat" element={<HrToAdmin/>}/>

            <Route path="/accounts" element={<AccountsLogin/>}/>
            <Route path="/AccountToAccountChat" element={<AccountToAccountChat/>}/>
            <Route path="/AccountToAdminChat" element={<AccountToAdminChat/>}/>  


              {isSuperAdminLoggedIn ? (
            <>
              <Route path="/superAdminDashboard" element={<SuperAdmin />} />
              <Route path="/superAdminGroups" element={<SuperAdminGroupList />} />
              <Route path="/superAdminLiveMesages" element={<SuperAdminLiveChat />} />
            </>
          ) : (
            <Route path="/kitkat" element={<SuperAdminLogin />} />
          )}

              <Route element={<AdminRoutes/>}>
                <Route path="/admin/dashboard" element={<Dashboard/>} />
                <Route path="/chat" element={<ChatPage/>}/>
                <Route path="/Groups" element={<Groups/>}/>
                <Route path="/livemesages" element={<LiveChatMessages/>}/>
                <Route path="/message/:selectedGroupName/:selectedGrade" element={<Message />} />
              </Route>
            </Route>
          </Routes>
    </BrowserRouter>
  )
} 
export default App  


import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { BASE_URL } from '../../constants';
import EmployeeSidebar from '../employee/EmployeeSidebar';
import UserSidebar from '../AllUsers/UserSidebar';
import ScrollingNavbar from './ScrollingNavbar';
import ManagerSidebar from '../manager/ManagerSidebar';
import BillingSidebar from '../BillingTeam/BillingSidebar';
import CashierSidebar from '../Cashier/CashierSidebar';

function FetchAllAnnouncement() {
  const [messages, setMessages] = useState([]);
  const [departmentMessages, setDepartmentMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const loggedInUserId = localStorage.getItem('CurrentUserId');
  const [newNotificationCount, setNewNotificationCount] = useState(0);

  const { route, department } = useParams(); // Assuming department is passed as a route param
  console.log("department   ",department)

  useEffect(() => {
    if (!loggedInUserId) {
      console.error('No logged in user ID found');
      return;
    }

    // Fetch initial messages
    axios
      .get(`${BASE_URL}/api/announce/getAllAnnounce/`)
      .then((response) => {
        setMessages(response.data);
        setNewNotificationCount(response.data.length); // Set initial notification count
        scrollToBottom();
      })
      .catch((error) => {
        console.error('Error fetching messages:', error);
      });

    // Fetch department-specific messages
    axios
      .get(`${BASE_URL}/api/announcements/${department}`)
      .then((response) => {
        setDepartmentMessages(response.data);
        console.log("response   ",response.data)
      })
      .catch((error) => {
        console.error('Error fetching department messages:', error);
      });
  }, [loggedInUserId, department]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const renderSidebar = () => {
    if (route === 'empDashbord') {
      return <EmployeeSidebar newNotificationCount={newNotificationCount} />;
    } else if (
      route === 'AccountToAccountChat' ||
      route === 'monitoringTeamChat' ||
      route === 'DigitalMarketingChatToDigitalMarketing' ||
      route === 'bouncerChat' ||
      route === 'CallCenterToCallCenter' ||
      route === 'HrToHrChat' ||
      route === 'SoftwareToSoftwareChat' ||
      route === 'SecurityChat' ||
      route === 'VirtualTeamToVirtualTeam' ||
      route === 'LogisticChat' ||
      route === 'TEChat' || 
      route === 'getAllTE' || 
      route === 'getAllLogistic' || 
      route === 'getAllDigitalCashier' || 
      route === 'getAllSecurityTeam' || 
      route === 'getAllBouncersTeam' 
    ) {
      return <UserSidebar newNotificationCount={newNotificationCount} />;
    } else if (route === 'managerChat') {
      return <ManagerSidebar newNotificationCount={newNotificationCount} />;
    } else if (route === 'BillingTeamChat') {
      return <BillingSidebar newNotificationCount={newNotificationCount} />;  
    } else if (route === 'CashierManagerChat') {
      return <CashierSidebar newNotificationCount={newNotificationCount} />;
    } else {
      return null; // Or some default sidebar
    }
  };
 console.log("departmentMessages  ",departmentMessages)
  const renderMessages = (messagesToRender) => (
    <div className="h-screen overflow-y-auto">
      {messagesToRender.length > 0 ? (
        messagesToRender.map((message, index) => (
          <div
            key={index}
            className={`flex relative break-words whitespace-pre-wrap ${message.sender} justify-end mb-2`}
          >
            <div
              className={`relative lg:text-3xl md:text-xl text-sm font-bold ${
                message.sender === loggedInUserId
                  ? 'self-end bg-[#e1dff3] text-[#5443c3] border border-[#5443c3] rounded-tr-3xl rounded-bl-3xl'
                  : 'self-start bg-[#ffffff] text-[#5443c3] border border-[#5443c3] rounded-tl-3xl rounded-br-3xl'
              } py-2 px-4 rounded-lg lg:max-w-2xl max-w-[50%]`}
            >
              {message.content && message.content.originalMessage && (
                <div className="mb-2">
                  <span className="bg-green-300 px-2 py-1 text-xs text-black rounded">
                    {message.content.originalMessage}
                  </span>
                </div>
              )}
              {message.content && message.content.text && <p className="text-sm">{message.content.text}</p>}
              {message.content && message.content.image && (
                <img src={message.content.image} alt="Image" className="rounded-lg lg:h-96 lg:w-72 md:h-96 md:w-64 h-40 w-32" />
              )}
              {message.content && message.content.document && (
                <a
                  href={message.content.document}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:underline"
                >
                  <IoIosDocument className="text-9xl" />
                </a>
              )}
              {message.content && message.content.video && (
                <video controls className="max-w-xs text-orange-600 rounded-lg lg:h-96 lg:w-72 md:h-96 md:w-64 h-40 w-32">
                  <source src={message.content.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              <span className="text-xs font-base text-gray-500">{new Date(message.createdAt).toLocaleString()}</span>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center mt-4 text-gray-500">No announcement</div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row h-screen relative">
      <span className="mt-20"><ScrollingNavbar messages={messages} /></span>
      {renderSidebar()}
      <div className="flex flex-col lg:flex-row w-full lg:mt-20">
        <div className="bg-[#eef2fa] text-black p-4 shadow w-full lg:w-1/2 flex flex-col">
          {renderMessages(messages)}
        </div>
        <div className="bg-[#eef2fa] text-black p-4 shadow w-full lg:w-1/2 flex flex-col">
          <h2 className="text-xl font-bold mb-4">Department-wise Announcements</h2>
          {renderMessages(departmentMessages)}
        </div>
      </div>
    </div>
  );
}

export default FetchAllAnnouncement;

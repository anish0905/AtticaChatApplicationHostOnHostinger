import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../constants';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Message from '../admin/Message';

const EmpMessage = ({department}) => {
  const [groups, setGroups] = useState([]);
  const [selectedGroupName, setSelectedGroupName] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const userId = localStorage.getItem("CurrentUserId");
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/employee/groups/${userId}`);
        setGroups(response.data); // Set the fetched groups
        console.log("Groups:", response.data);  // For debugging
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, [userId]);

  const handleGroupClick = (name, grade) => {
    setSelectedGroupName(name);
    setSelectedGrade(grade);

    if (window.innerWidth < 1024) {
      navigate(`/message/${encodeURIComponent(name)}/${encodeURIComponent(grade)}/${encodeURIComponent(department) }`);
    }
  };

  return (
<<<<<<< HEAD
    <div className="flex flex-col lg:flex-row h-full">
      <ToastContainer />
      <div className="flex flex-col w-full lg:w-[24vw] bg-[#ffffff] text-[#5443c3] lg:border shadow lg:shadow-blue-500/65">
        <div className="p-4 flex justify-between items-center">
          <h1 className="lg:text-3xl md:text-2xl text-xl font-bold">Groups</h1>
        </div>
        <div className="overflow-y-auto mt-8">
          {groups.map((group) => (
            <div
              key={group._id} // Use _id for a unique key
              className="p-4 cursor-pointer text-[#5443c3] hover:bg-[#eef2fa] flex justify-between items-center"
              onClick={() => handleGroupClick(group.name, group.grade)}
=======
    <div className="flex lg:h-[92%] h-[80%] w-[95%] fixed">
      {/* Chat Section */}
      {/* <ScrollingNavbar messages={messages} />  */}
      <div className="flex-1 flex flex-col w-full bg-[#f6f5fb]">
        <div className="lg:text-[#ffffff] lg:bg-[#5443c3] bg-[#ffffff] text-[#5443c3] border border-[#5443c3] lg:text-2xl text-sm p-4 flex gap-2 items-center justify-between  relative">
          <IoArrowBack
            className="mr-2 cursor-pointer lg:text-[#ffffff] text-[#5443c3]"
            onClick={() => setMessages([])}
          />
          {employees.length > 0 && (
            <>
              <h2 className="lg:text-2xl text-sm font-bold">Group: {employees[0].group}</h2>
              <h2 className="lg:text-2xl text-sm font-bold">Grade: {userGrade}</h2>
            </>
          )}
        </div>


<div className="flex flex-col flex-1 px-4 pt-4 overflow-y-auto lg:mb-0 lg:pr-10 pr-4">
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex relative break-words whitespace-pre-wrap ${msg.employeeId === currentUserName ? "justify-end" : "justify-start"} mb-2`}
              >
                <div
                  className={`relative lg:text-3xl md:text-xl text-sm font-bold ${
                    msg.employeeId === currentUserName
                      ? " self-end  bg-[#e1dff3] text-[#5443c3] rounded-tr-3xl rounded-bl-3xl border border-[#5443c3]"
                      : "self-start bg-white text-[#5443c3] border border-[#5443c3] rounded-br-3xl rounded-tl-3xl"
                  } py-2 px-4 rounded-lg lg:max-w-4xl max-w-[50%]`}
                >
                  {msg.message && (
                    <p className="text-sm mb-1">
                      <span className="lg:text-base md:text-lg text-sm font-normal my-5">{msg.employeeId}:<br></br></span> {msg.message}
                    </p>
                  )}
                  {msg.Document && (
                    <div className="lg:text-8xl md:text-6xl text-4xl my-2">
                      <button className="focus:outline-none" onClick={() => handleFileDownload(msg.Document)}>
                        <IoMdDocument />
                      </button>
                    </div>
                  )}
                  {msg.Image && (
                    <div className="my-2">
                      <img src={msg.Image} alt="" className="rounded-lg lg:h-96 lg:w-72 md:h-96 md:w-64 h-40 w-32 my-2" />
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No messages yet.</p>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className=" bg-[#f6f5fb] shadow-md">
          <div className="flex items-center p-2 lg:p-4 bg-[#eef2fa] border-t border-gray-200 bottom-0 w-full lg:static">
            <input
              type="text"
              className="flex-grow p-2 border rounded-lg mr-2 border-[#5443c3]"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              className="bg-[#5443c3] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
              onClick={sendMessage}
              disabled={!newMessage.trim()}
>>>>>>> 59d284568f2a8658dad3f7b4ebf16f48941c42ec
            >
              <div>
                <h1 className="lg:text-xl md:text-xl text-sm font-bold text-[#5443c3]">
                  {group.name}
                </h1>
                <p className="text-[#8b7ed5]">Grade: {group.grade}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Render Message component conditionally */}
      {selectedGroupName && selectedGrade && (
        <div className="lg:flex-1 hidden lg:block">
          <Message
            selectedGroupName={selectedGroupName}
            selectedGrade={selectedGrade}
            department={department}

          />
        </div>
      )}
    </div>
  );
};

export default EmpMessage;

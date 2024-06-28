import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { AiOutlineSearch, AiOutlineDown } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { Link } from "react-router-dom";
import { IoIosDocument } from "react-icons/io";
import { FaVideo, FaImage } from "react-icons/fa";
import { useSound } from "use-sound";
import notificationSound from '../../assests/sound.wav';
import { BASE_URL } from "../../constants";
import Sidebar from "./Sidebar";
import { FaArrowLeft } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import ForwardModalAllUsers from "../AllUsers/ForwardModalAllUsers";
import AllUsersFileModel from "../AllUsers/AllUsersFileModel";
import ReplyModel from "../ReplyModel";

function AdminEmpChat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState([]);
  const loggedInUserId = localStorage.getItem("CurrentUserId");
  const [recipient, setRecipient] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const messagesEndRef = useRef(null);
  const [unreadUsers, setUnreadUsers] = useState([]);
  const [showMessages, setShowMessages] = useState({});
  const [showPopSms, setShowPopSms] = useState(false);
  const [popSms, setPopSms] = useState([]);
  const [selectedSender, setSelectedSender] = useState("");
  const [selectedSenderName, setSelectedSenderName] = useState("");
  const [selectedSenderEmail, setSelectedSenderEmail] = useState("");
  const [playNotificationSound] = useSound(notificationSound);
  const [showDropdown, setShowDropdown] = useState(null);
  const [forwardMessage, setForwardMessage] = useState(null);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [hoveredMessage, setHoveredMessage] = useState(null);
  const [isChatSelected, setIsChatSelected] = useState(false);
  const [selectedChatUserId, setSelectedChatUserId] = useState("");
  const [replyMessage, setReplyMessage] = useState(null); //--------------->
  const [showReplyModal, setShowReplyModal] = useState(false);  //--------------->
  

  // Function to handle click on employee to initiate chat
  const handleClick = (id, name) => {
    setRecipient(id);
    setRecipientName(name);
    setIsChatSelected(true);
    setSelectedChatUserId(id);
    fetchMessages(loggedInUserId, id);
  };

  // Function to fetch messages between two users
  const fetchMessages = async (sender, recipient) => {
  
    
  
    try {
      const response = await axios.get(
        `${BASE_URL}/api/empadminsender/getadminmessages/${recipient}/${sender}`
      );
  
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Fetch all employees except the logged-in user
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/employeeRegistration/`)
      .then((response) => {
        const filteredUsers = response.data.filter(
          (user) => user._id !== loggedInUserId
        );
        setUsers(filteredUsers);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [loggedInUserId]);

  // Fetch initial messages between logged-in user and selected recipient
  useEffect(() => {
    const intervalId = setInterval(() => fetchMessages(loggedInUserId, recipient), 2000);
    return () => clearInterval(intervalId);
  }, [recipient]);


  // Automatically scroll to bottom when new messages are received
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to send a new message
  const handleSendMessage = () => {
    if (!newMessage.trim() && !attachment) return;

    const messageData = {
      sender: loggedInUserId,
      recipient: recipient,
      text: newMessage,
      image: attachment?.type.startsWith("image/") ? attachment.url : null,
      document: attachment?.type.startsWith("application/")
        ? attachment.url
        : null,
      video: attachment?.type.startsWith("video/") ? attachment.url : null,
    };

    axios
      .post(`${BASE_URL}/api/empadminsender/createMessage`, messageData)
      .then((response) => {
        setMessages([...messages, response.data.data]);
        setNewMessage("");
        setAttachment(null);
        console.log("Sent message", response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Filtered list of users based on search query
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  // Fetch unread messages for all users at regular intervals
  useEffect(() => {
    if (users.length > 0) {
      const fetchUnreadMessages = async () => {
        try {
          const unreadUsersData = await Promise.all(
            users.map(async (user) => {
              const response = await axios.get(
                `${BASE_URL}/api/empadminsender/mark-messages-read/${user._id}`
              );
              return { userId: user._id, data: response.data };
            })
          );
          setUnreadUsers(unreadUsersData);
        } catch (error) {
          console.error(error);
        }
      };

      // Initial fetch and set interval to fetch every 3 seconds
      // fetchUnreadMessages();
      // const intervalId = setInterval(fetchUnreadMessages, 5000);

      // // Clear interval on component unmount
      // return () => clearInterval(intervalId);
    }
  }, [users]);

  // Fetch pop-up SMS notifications for logged-in user
  const fetchPopSms = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/getNotification/${loggedInUserId}`
      );
      const data = response.data;
      setPopSms(data);
      if (data.length > 0) {
        const senderId = data[0].sender;
        setSelectedSender(senderId);
        setShowPopSms(true);
        const empDetails = await axios.get(
          `${BASE_URL}/api/employee/a/${senderId}`
        );
        setSelectedSenderName(empDetails.data.name);
        playNotificationSound();
      }
    } catch (error) {
      console.error("Error fetching pop SMS:", error);
    }
  };

  // Fetch pop-up SMS notifications at regular intervals
  useEffect(() => {
    const interval = setInterval(fetchPopSms, 2000);
    return () => clearInterval(interval);
  }, [loggedInUserId, playNotificationSound]);

  // Function to handle closure of pop-up SMS modal
  const handleModalClose = (senderId) => {
    const startTime = Date.now();
    
    axios
      .delete(`${BASE_URL}/api/deleteNotification/${senderId}`)
      .then(() => {
        const endTime = Date.now();
        setShowPopSms(false);
        
      })
      .catch((error) => {
        console.error("Error deleting notification:", error);
      });
  };

  const handleHover = (index) => {
    setHoveredMessage(index);
  };

  const handleLeave = () => {
    setHoveredMessage(null);
  };

  const handleDropdownClick = (index) => {
    setShowDropdown(showDropdown === index ? null : index);
  };

  const handleReply = (message) => {
    setReplyMessage(message);  //--------------->
    setShowReplyModal(true);   //--------------->
  };

  const handleForward = (message) => {
    setForwardMessage(message);
    setShowForwardModal(true);
    setShowDropdown(null)
  };

  const handleCancelForward = () => {
    setShowForwardModal(false);
    setForwardMessage(null);
  };

  const handleConfirmForward = () => {
    // Perform forward action here, then close modal
    setShowForwardModal(false);
    setForwardMessage(null);
  };

  const handleBackToUserList = () => {
    setIsChatSelected(false);
    setSelectedChatUserId("");
    setRecipient("");
    setRecipientName("");
    setMessages([]);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <Sidebar />
      {/* Header */}
      <div className="flex-1 flex flex-col lg:flex-row">
        <div className={`flex flex-col bg-white text-black p-4 shadow w-full lg:w-1/4 ${isChatSelected ? 'hidden lg:flex' : 'flex'}`}>
          <div className="flex items-center justify-between mb-4">
            {/* <Link to="/AdminDashboard" className="text-lg font-bold">
              <IoIosDocument size={25} />
            </Link> */}
            <span className="text-2xl font-bold mb-4 text-[#5443c3]">Employee Chat</span>
            {/* <Link to="/login" className="text-lg font-bold ml-2">
              <BiLogOut size={25} />
            </Link> */}
          </div>

          {/* ------------------------------------------------- */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search by name..."
              className="w-full h-10 p-2 text-base text-gray-700 rounded-xl pl-10 bg-white border border-[#5443c3] shadow-lg"
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
            />
            <AiOutlineSearch
              size={20}
              className="absolute top-3 left-3 text-gray-500 text-2xl"
            />
          </div>




          <div className="flex-1 overflow-y-auto">
            <ul>
              {filteredUsers.map((user, index) => (
                <li key={user._id} className="border-b">
                  <div
                    className="w-full h-auto font-medium rounded-md bg-[#eef2fa] text-[#5443c3] mb-4 text-lg block items-center p-4 cursor-pointer"
                    onClick={() => handleClick(user._id, user.name)}
                  >
                    <div className="flex justify-between">
                      <span className="font-md">{user.name}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>




        {/* Chat Area */}
        {isChatSelected && (
          <div className="flex-1 flex flex-col justify-between bg-[#f6f5fb]">
            {/* Selected Recipient */}
            <div className="text-[#5443c3] sm:text-white sm:bg-[#5443c3] md:text-white md:bg-[#5443c3] bg-white p-2 flex flex-row items-center justify-between">
              
            {isChatSelected && (
        <div className="text-2xl p-4 flex gap-2 items-center justify-between">
          <button
            className="w-20  text-[#5443c3] sm:text-white md:text-white text-2xl  mt-2 "
            onClick={handleBackToUserList}
          >
            <FaArrowLeft />
          </button>
        </div>
      )}

              <h2 className="text-2xl font-semibold">{recipientName}</h2>
            </div>


            {/* Messages */}
            <div className="overflow-y-auto flex-1 p-4">
              {messages.map((message, index) => (
                <div key={index} className="mb-2">
                  <div
                    className={`flex ${
                      message.sender === loggedInUserId
                        ? "justify-end"
                        : "justify-start"
                    }`}
                    onMouseEnter={() => handleHover(index)}
                    onMouseLeave={() => handleLeave()}
                  >
                    
                    <div
                    className={`w-1/3 p-2 rounded-md relative ${message.sender === loggedInUserId ? "bg-[#5443c3] text-white self-end rounded-tr-3xl rounded-bl-3xl" : "bg-white text-[#5443c3] self-start rounded-tl-3xl rounded-br-3xl relative"
                    }`}
                    >  
                     {/* //---------------> */}
                 {message.content && message.content.originalMessage && (
                  <div className="mb-2">
                    <span className="bg-green-900 px-2 py-1 text-xs text-white rounded">
                      {message.content.originalMessage}
                    </span>
                  </div>
                )} 
                {/* //---------------> */}
                      <p className="text-sm">{message.content.text}</p>
                      {message.image && (
                        <img
                          src={message.image}
                          alt="attachment"
                          className="max-w-xs mt-2"
                        />
                      )}
                      {message.document && (
                        <a
                          href={message.content.document}
                          target="_blank"
                          rel="noopener noreferrer"
                     className="text-orange-600 hover:underline"
                        >
                          View Document
                        </a>
                      )}
                      {message.content.video && (
                        <video controls className="max-w-xs text-orange-600 hover:underline">
                          <source src={message.video} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      )}
                      <span className="text-xs text-orange-600">
                        {new Date(message.createdAt).toLocaleString()}
                      </span>
                      {hoveredMessage === index &&
                        <AiOutlineDown
                          className="absolute top-2 right-2 cursor-pointer"
                          onClick={() => handleDropdownClick(index)}
                        />
                      }
                      {showDropdown === index &&  (
                        <div className="absolute top-2 right-2 bg-white border rounded shadow-lg z-10">
                          <button
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => handleReply(message)}
                          >
                            Reply
                          </button>
                          <button
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => handleForward(message)}
                          >
                            Forward
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            {/* Input */}
            <div className="p-4 border-t flex justify-center items-center">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-grow p-2 border rounded-lg mr-2 border-[#5443c3]"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <div className="flex items-center">
                <button
                  className="bg-[#5443c3] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={handleSendMessage}
                >
                  <IoMdSend />
                </button>
                <AllUsersFileModel sender={loggedInUserId} recipient={recipient} />
              </div>
            </div>
          </div>
        )}
      </div>

      
      {showPopSms && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative">
          <i className="fas fa-bell text-yellow-500 text-sm mr-2"></i>
            <h2 className="text-xl font-bold text-green-600 text-center">
              New Message from {selectedSenderName}
            </h2>
            <ul>
            {popSms.map((sms, index) => (
          <li key={index} className="mb-2 relative">
            <p>{sms.content.text}</p>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => handleModalClose(sms.sender)}
            >
              Close
            </button>
            {sms.content.image && (
              <img
                src={sms.content.image}
                alt="attachment"
                className="w-32 mt-2 cursor-pointer"
                onClick={() => handleImageClick(sms.content.image)}
              />
            )}
            {sms.content.document && (
              <a
                href={sms.content.document}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                View Document
              </a>
            )}
            {sms.content.video && (
              <video controls className="max-w-xs mt-2">
                <source src={sms.content.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
                </li>
                
              ))}
            </ul>
  
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => handleModalClose(selectedSender)}
            >
              Close
            </button>
          </div>
        </div>
      )}
     
      {showForwardModal && (
        <ForwardModalAllUsers
          users={users}
          forwardMessage={forwardMessage}
          onForward={handleConfirmForward}
          onCancel={handleCancelForward}
        />
      )}
      {replyMessage && ( ////--------------------->
        <ReplyModel
          message={replyMessage}
          sender={loggedInUserId}
          recipient={recipient}
          isVisible={showReplyModal}
          onClose={() => setShowReplyModal(false)}
          value={"Admin"}

        />
      )}
    </div>
  );
}

export default AdminEmpChat;

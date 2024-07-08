import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { AiOutlineSearch, AiOutlineDown } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { Link } from "react-router-dom";
import { IoIosDocument } from "react-icons/io";
import { FaArrowLeft, FaVideo, FaImage } from "react-icons/fa";
import { useSound } from "use-sound";
import notificationSound from "../../assests/sound.wav";
import { BASE_URL } from '../../constants';
import { IoMdSend } from "react-icons/io";
import AllUsersFileModel from "../AllUsers/AllUsersFileModel";
import ForwardMsgAllUsersToAdmin from "../AllUsers/ForwardMsgAllUsersToAdmin";
import ReplyModel from "../ReplyModel";
import EmployeeSidebar from './EmployeeSidebar';

function EmpAdminChat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState([]);
  const loggedInUserId = localStorage.getItem("CurrentUserId");
  const [recipient, setRecipient] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [sender, setSender] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [adminSearchQuery, setAdminSearchQuery] = useState("");
  const messagesEndRef = useRef(null);
  const [admins, setAdmins] = useState([]);
  const [unreadUsers, setUnreadUsers] = useState([]);
  const [showMessages, setShowMessages] = useState({});
  const [showPopSms, setShowPopSms] = useState(false);
  const [popSms, setPopSms] = useState([]);
  const [selectedSender, setSelectedSender] = useState("");
  const [selectedSenderName, setSelectedSenderName] = useState("");
  const [playNotificationSound] = useSound(notificationSound);
  const [hoveredMessage, setHoveredMessage] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);
  const [forwardMessage, setForwardMessage] = useState(null);
  const [showForwardModal, setShowForwardModal] = useState(false);

  const [replyMessage, setReplyMessage] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);

  const [isChatSelected, setIsChatSelected] = useState(false);

  const userDetails = JSON.parse(localStorage.getItem("userDetails"));

  const handleClick = (id, name) => {
    setSender(loggedInUserId);
    setRecipient(id);
    setRecipientName(name);
    setIsChatSelected(true);
    fetchMessages(loggedInUserId, id);
  };

  const fetchMessages = (sender, recipient) => {
    axios
      .get(`${BASE_URL}/api/empadminsender/getmessages/${recipient}/${sender}`)
      .then((response) => {
        setMessages(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

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

  useEffect(() => {
    const intervalId = setInterval(() => fetchMessages(loggedInUserId, recipient), 2000);
    return () => clearInterval(intervalId);
  }, [recipient]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/admin/getAllAdmin`)
      .then((response) => {
        const filteredAdmins = response.data.filter(
          (admin) => admin._id !== loggedInUserId
        );
        setAdmins(filteredAdmins);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [loggedInUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() && !attachment) return;

    const messageData = {
      sender: loggedInUserId,
      recipient: recipient,
      senderName: userDetails.name,
      text: newMessage,
      image: attachment?.type.startsWith("image/") ? attachment.url : null,
      document: attachment?.type.startsWith("application/") ? attachment.url : null,
      video: attachment?.type.startsWith("video/") ? attachment.url : null,
    };

    axios
      .post(`${BASE_URL}/api/empadminsender/createMessage`, messageData)
      .then((response) => {
        setMessages([...messages, response.data.data]);
        setNewMessage("");
        setAttachment(null);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleAttachmentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachment({
          url: reader.result,
          type: file.type,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  const filteredAdmins = admins.filter((admin) =>
    admin.email.toLowerCase().includes(adminSearchQuery.toLowerCase())
  );

  useEffect(() => {
    if (admins.length > 0) {
      const fetchUnreadMessages = async () => {
        try {
          const unreadUsersData = await Promise.all(
            admins.map(async (admin) => {
              const response = await axios.get(
                `${BASE_URL}/api/empadminsender/mark-messages-read-emp/${admin._id}`
              );
              return { userId: admin._id, data: response.data };
            })
          );
          setUnreadUsers(unreadUsersData);
        } catch (error) {
          console.error(error);
        }
      };
      fetchUnreadMessages();
    }
  }, [admins]);

  const handleShowMessage = (userId) => {
    setShowMessages((prevShowMessages) => ({
      ...prevShowMessages,
      [userId]: !prevShowMessages[userId],
    }));
  };

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
          `${BASE_URL}/api/admin/admin/${senderId}`
        );
        setSelectedSenderName(empDetails.data.email);
        playNotificationSound();
      }
    } catch (error) {
      console.error("Error fetching pop SMS:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchPopSms, 2000);
    return () => clearInterval(interval);
  }, [loggedInUserId, playNotificationSound]);

  const handleModalClose = (senderId) => {
    axios
      .delete(`${BASE_URL}/api/deleteNotification/${senderId}`)
      .then(() => {
        setShowPopSms(false);
      })
      .catch((error) => {
        console.error("Error deleting notification:", error);
      });
  };

  const handleHover = (index) => {
    setHoveredMessage(index);
  };

  const handleDropdownClick = (index) => {
    setShowDropdown(showDropdown === index ? null : index);
  };

  const handleReply = (message) => {
    setReplyMessage(message);
    setShowReplyModal(true);
  };

  const handleForward = (message) => {
    setForwardMessage(message);
    setShowForwardModal(true);
    setShowDropdown(null);
  };

  const handleForwardMessage = () => {
    setShowForwardModal(false);
    setShowDropdown(null);
  };

  const handleCancelForward = () => {
    setShowForwardModal(false);
  };

  const handleBackToUserList = () => {
    setIsChatSelected(false);
    setRecipient("");
    setRecipientName("");
    setMessages([]);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen relative">
      <EmployeeSidebar />
      <div className={`flex flex-col bg-white text-black p-4 shadow w-full lg:w-1/4 border border-[#5443c3] ${isChatSelected ? 'hidden lg:flex' : 'flex'}`}>
        <h1 className="lg:text-2xl md:text-2xl text-xl font-bold mb-4 text-[#5443c3] text-left ">All Admins</h1>
        <div className="relative mb-4 my-2 ">
          <input
            type="text"
            value={adminSearchQuery}
            onChange={(e) => setAdminSearchQuery(e.target.value)}
            className="w-full h-10 p-2 text-base text-gray-700 rounded-xl pl-10 bg-white border-2 border-[#5443c3] shadow-lg "
            placeholder="Search by email..."
          />
          <AiOutlineSearch className="absolute top-3 left-3 text-gray-500 text-2xl " />
        </div>
        
        <div className="h-screen overflow-y-auto ">
          {filteredAdmins.map((admin) => (
            <div key={admin._id}>
              <div
                className="w-full lg:text-xl md:text-2xl text-sm h-auto font-medium rounded-md bg-[#eef2fa] text-[#5443c3] mb-4 block items-center p-4 cursor-pointer"
                onClick={() => handleClick(admin._id, admin.email)}
              >
                <h1>{admin.email}</h1>
                {unreadUsers
                  .filter((unreadUser) => unreadUser.userId === admin._id)
                  .flatMap((unreadUser) =>
                    unreadUser.data.map((message) => (
                      <div
                        key={message._id}
                        className="text-orange-600 relative break-words whitespace-pre-wrap my-2"
                        onClick={() => handleShowMessage(admin._id)}
                      >
                        {!showMessages[admin._id] ? (
                          <>
                            {message.content.text && (
                              <p className="pe-2 text-base">{message.content.text}</p>
                            )}
                            {message.content.image && <FaImage />}
                            {message.content.video && <FaVideo />}
                            {message.content.document && (
                              <IoIosDocument className="text-xl" />
                            )}
                            <p className="text-xs text-black">
                              {new Date(message.createdAt).toLocaleDateString()}{" "}
                              {new Date(message.createdAt).toLocaleTimeString()}
                            </p>
                          </>
                        ) : (
                          <p></p>
                        )}
                      </div>
                    ))
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`flex flex-col bg-white text-black p-4 shadow w-full lg:w-3/4 border border-[#5443c3] ${!isChatSelected ? 'hidden lg:flex' : 'flex'}`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackToUserList}
              className="text-[#5443c3] hover:text-black focus:outline-none"
            >
              <FaArrowLeft className="text-xl" />
            </button>
            <h1 className="text-lg font-bold text-[#5443c3]">
              {recipientName}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              id="file"
              onChange={handleAttachmentChange}
              className="hidden"
            />
            <label
              htmlFor="file"
              className="cursor-pointer text-[#5443c3] hover:text-black"
            >
              Attach
            </label>
            <button
              onClick={handleSendMessage}
              className="bg-[#5443c3] text-white px-4 py-2 rounded-md hover:bg-black focus:outline-none"
            >
              <IoMdSend className="text-lg" />
            </button>
          </div>
        </div>

        <div className="h-screen overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={message._id}
              className={`flex flex-col mb-4 ${
                message.sender === loggedInUserId
                  ? "items-end text-right"
                  : "items-start text-left"
              }`}
              onMouseEnter={() => handleHover(index)}
              onMouseLeave={() => setHoveredMessage(null)}
            >
              <div
                className={`max-w-[70%] rounded-lg py-2 px-4 shadow ${
                  message.sender === loggedInUserId
                    ? "bg-[#5443c3] text-white self-end"
                    : "bg-[#eef2fa] text-[#5443c3] self-start"
                }`}
              >
                {message.content.text && (
                  <p className="break-words whitespace-pre-wrap">{message.content.text}</p>
                )}
                {message.content.image && <img src={message.content.image} alt="Attachment" className="max-w-[200px] my-2" />}
                {message.content.document && (
                  <a href={message.content.document} className="text-[#5443c3] hover:underline break-words whitespace-pre-wrap">
                    Document
                  </a>
                )}
                {message.content.video && (
                  <video controls className="max-w-[200px]">
                    <source src={message.content.video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
                <p className="text-xs text-[#5443c3] mt-2">
                  {new Date(message.createdAt).toLocaleDateString()}{" "}
                  {new Date(message.createdAt).toLocaleTimeString()}
                </p>
              </div>
              {(hoveredMessage === index && message.sender !== loggedInUserId) && (
                <div className="flex items-center space-x-4 mt-2">
                  <button
                    onClick={() => handleReply(message)}
                    className="text-[#5443c3] hover:text-black focus:outline-none"
                  >
                    Reply
                  </button>
                  <button
                    onClick={() => handleDropdownClick(index)}
                    className="text-[#5443c3] hover:text-black focus:outline-none"
                  >
                    <AiOutlineDown className="text-xl" />
                  </button>
                </div>
              )}
              {showDropdown === index && (
                <div className="absolute right-4 top-4 bg-white shadow-md rounded-md py-2 px-4 flex flex-col space-y-2">
                  <button
                    onClick={() => handleForward(message)}
                    className="text-[#5443c3] hover:text-black focus:outline-none"
                  >
                    Forward
                  </button>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>
      </div>
    </div>
  );
}

export default EmpAdminChat;

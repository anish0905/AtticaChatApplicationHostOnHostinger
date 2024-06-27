

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { AiOutlineSearch ,AiOutlineDown} from "react-icons/ai";
import { IoIosDocument } from "react-icons/io";
import { FaPaperclip } from "react-icons/fa";
import { BASE_URL } from "../../constants";
import { useSound } from "use-sound";
import notificationSound from "../../assests/sound.wav";
import { MdNotificationsActive } from "react-icons/md";
import BouncerSidebar from './BouncerSidebar'
import ForwardModalBouncerTeam from './ForwardModalBouncerTeam'
import BouncerModel from './BouncerModel'



function BouncerTeamChat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState([]);
  const loggedInUserId = localStorage.getItem("CurrentUserId");
  const [recipient, setRecipient] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [sender, setSender] = useState(loggedInUserId);
  const [attachment, setAttachment] = useState(null);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const messagesEndRef = useRef(null);
  const [unreadUsers, setUnreadUsers] = useState([]);
  const [showPopSms, setShowPopSms] = useState(false);
  const [popSms, setPopSms] = useState([]);
  const [selectedSender, setSelectedSender] = useState("");
  const [selectedSenderName, setSelectedSenderName] = useState("");
  const [isMobileView, setIsMobileView] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [playNotificationSound] = useSound(notificationSound);
  const [hoveredMessage, setHoveredMessage] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);
  const [forwardMessage, setForwardMessage] = useState(null);
  const [showForwardModal, setShowForwardModal] = useState(false);

  const handleClick = (id, name) => {
    setSender(loggedInUserId);
    setRecipient(id);
    setRecipientName(name);
    fetchMessages(loggedInUserId, id);
    setShowChat(true);
  };

  const fetchMessages = (sender, recipient) => {
    axios
      .get(`${BASE_URL}/api/getmessages/${recipient}/${sender}`)
      .then((response) => {
        setMessages(response.data);
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/allUser/getAllMonitoringTeam`)
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
    if (sender && recipient) {
      fetchMessages(sender, recipient);
    }
  }, [sender, recipient]);

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
      .post(`${BASE_URL}/api/postmessages`, messageData)
      .then((response) => {
        setMessages([...messages, response.data.data]);
        setNewMessage("");
        setAttachment(null);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setAttachment({
        url: reader.result,
        type: file.type,
      });
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (users.length > 0) {
      const fetchUnreadMessages = async () => {
        try {
          const unreadUsersData = await Promise.all(
            users.map(async (user) => {
              const response = await axios.get(
                `${BASE_URL}/api/mark-messages-read/${user._id}`
              );
              return { userId: user._id, data: response.data };
            })
          );
          setUnreadUsers(unreadUsersData.filter((u) => u.data.length > 0));
        } catch (error) {
          console.error(error);
        }
      };
      fetchUnreadMessages();
      const intervalId = setInterval(fetchUnreadMessages, 3 * 1000);
      return () => clearInterval(intervalId);
    }
  }, [users]);

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
          `${BASE_URL}/api/allUser/getbyId/${senderId}`
        );
        setSelectedSenderName(empDetails.data.name);

        // Play notification sound
        playNotificationSound();
      }
    } catch (error) {
      console.error("Error fetching pop SMS:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchPopSms, 5000);
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

  const handleBackToEmployees = () => {
    setShowChat(false);
    setRecipient("");
    setRecipientName("");
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleHover = (index) => {
    setHoveredMessage(index);
  };

  const handleDropdownClick = (index) => {
    setShowDropdown(showDropdown === index ? null : index);
  };

  const handleReply = (message) => {
    setNewMessage(`Replying to: ${message.content.text}`);
  };

  const handleForward = (message) => {
    console.log(message);
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


  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
      <BouncerSidebar />
      {showChat ? (
        <div className="w-full  flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between p-4 bg-blue-200 sticky top-0 z-10">
            <div>
              <h1 className="text-2xl font-bold">{recipientName}</h1>
            </div>
            <button
              onClick={handleBackToEmployees}
              className="bg-red-500 text-white p-2 rounded-md"
            >
              Back
            </button>
          </div>
          <div className="flex-grow overflow-y-auto p-4 flex flex-col">
            {messages.map((message,index) => (
              <div
                key={message._id}
                className={`mb-4 p-4 rounded-lg max-w-[70%] relative ${
                  message.sender === loggedInUserId
                    ? "bg-blue-200 self-end"
                    : "bg-gray-200 self-start"
                }`}

                onMouseEnter={() => handleHover(index)}
                onMouseLeave={() => setHoveredMessage(null)}
              >
                {message.content && message.content.text && (
                  <p className="font-bold">{message.content.text}</p>
                )}
                {message.content && message.content.image && (
                  <img
                    src={message.content.image}
                    alt="Image"
                    className="max-w-xs"
                  />
                )}
                {message.content && message.content.document && (
                  <a
                    href={message.content.document}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    <IoIosDocument className="text-9xl" />
                  </a>
                )}
                {message.content && message.content.video && (
                  <video controls className="max-w-xs">
                    <source src={message.content.video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
                <span className="text-xs text-gray-500">
                  {new Date(message.createdAt).toLocaleString()}
                </span>
              
                {hoveredMessage === index && (
                    <AiOutlineDown
                      className="absolute top-2 right-2 cursor-pointer"
                      onClick={() => handleDropdownClick(index)}
                    />
                  )}
            
                  {showDropdown === index && (
                    <div className="absolute top-8 right-2 bg-white border rounded shadow-lg z-10">
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
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex items-center p-4 bg-white border-t border-gray-200 fixed bottom-0 w-full lg:static">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow p-2 border rounded-lg mr-2"
            />
            <input
              type="file"
              onChange={(e) => handleFileUpload(e.target.files[0])}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <FaPaperclip className="text-gray-500 hover:text-gray-700 cursor-pointer mr-2" />
            </label>
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white p-2 rounded-lg"
            >
              Send
            </button>
            <BouncerModel sender={loggedInUserId} recipient={recipient} />
          </div>
        </div>
      ) : (
        <div className="w-full lg:w-1/4 bg-gray-100 p-4 overflow-y-auto">
          <div className="flex items-center mb-4">
            <AiOutlineSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
              placeholder="Search..."
              className="flex-grow p-2 border rounded-lg"
            />
          </div>
          <ul>
            {users
              .filter((user) =>
                user.name.toLowerCase().includes(userSearchQuery.toLowerCase())
              )
              .map((user) => (
                <li
                  key={user._id}
                  className={`p-4 mb-2 rounded-lg cursor-pointer flex justify-between ${
                    unreadUsers.some(
                      (unreadUser) => unreadUser.userId === user._id
                    )
                      ? "bg-blue-200"
                      : "bg-gray-200"
                  } ${recipient === user._id ? "bg-green-200" : ""}`}
                  onClick={() => handleClick(user._id, user.name)}
                >
                  <span>{user.name}</span>
                  <span>
                    {unreadUsers.some(
                      (unreadUser) => unreadUser.userId === user._id
                    ) && <span className="text-red-500 font-bold">New</span>}
                  </span>
                </li>
              ))}
          </ul>
        </div>
      )}

{showPopSms && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-4 rounded-lg shadow-lg border border-blue-500">
      <div className="flex items-center mb-4">
        <MdNotificationsActive className="text-blue-500 w-6 h-6 mr-2" />
        <h3 className="text-lg font-semibold">New Message</h3>
      </div>
      <p className="mb-2">From: {selectedSenderName}</p>
      <p className="mb-4">Message: {popSms[0]?.content?.text}</p>
      <button
        onClick={() => handleModalClose(popSms[0]?.sender)}
        className="bg-blue-500 text-white p-2 rounded-lg"
      >
        Close
      </button>
    </div>
  </div>
)}
{showForwardModal && (
        <ForwardModalBouncerTeam
          users={users}
          forwardMessage={forwardMessage}
          onForward={handleForwardMessage}
          onCancel={handleCancelForward}
        />
      )}
    </div>
  );
}

export default BouncerTeamChat;

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { AiOutlineSearch, AiOutlineDown } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { Link } from "react-router-dom";
import { IoIosDocument } from "react-icons/io";
import FileUploadModel from "../employee/FileUploadModel";
import { FaVideo, FaImage } from "react-icons/fa";
import GPSTracker from "./Gps.jsx"; // Adjust the import path as necessary
import { BASE_URL } from '../../constants';
import ForwardMessageModal from './ForwardMessageModal';
import useSound from "use-sound";
import notificationSound from "../../assests/sound.wav";


function ManagerChat() {
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
  const [currentLocation, setCurrentLocation] = useState(null);
  const [prevLocation, setPrevLocation] = useState(null);
  const [hoveredMessage, setHoveredMessage] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);
  const [forwardMessage, setForwardMessage] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [showPopSms, setShowPopSms] = useState(false);
  const [popSms, setPopSms] = useState([]);
  const [selectedSender, setSelectedSender] = useState("");
  const [selectedSenderName, setSelectedSenderName] = useState("");
  const [playNotificationSound] = useSound(notificationSound);// State for controlling modal visibility

  const handleClick = (id, name) => {
    setRecipient(id);
    setRecipientName(name);
    fetchMessages(loggedInUserId, id);
  };

  const fetchMessages = (sender, recipient) => {
    axios
      .get(`${BASE_URL}/api/getmessages/${recipient}/${sender}`)
      .then((response) => {
        setMessages(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/billingTeam/getAllUsers`)
      .then((response) => {
        const filteredUsers = response.data.users.filter(
          (user) => user._id !== loggedInUserId
        );
        setUsers(filteredUsers);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [loggedInUserId]);

  useEffect(() => {
    if (loggedInUserId && recipient) {
      fetchMessages(loggedInUserId, recipient);
    }
  }, [loggedInUserId, recipient]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (currentLocation && JSON.stringify(currentLocation) !== JSON.stringify(prevLocation)) {
      console.log("Sending location:", currentLocation);
      axios
        .post(`${BASE_URL}/api/location`, {
          managerId: loggedInUserId,
          longitude: currentLocation.longitude,
          latitude: currentLocation.latitude
        })
        .then((response) => {
          console.log("Location saved:", response.data);
        })
        .catch((error) => {
          console.error("Error saving location:", error);
        });
    }
  }, [currentLocation, prevLocation, loggedInUserId]);

  const handleSendMessage = () => {
    if (!newMessage.trim() && !attachment) return;

    const messageData = {
      sender: loggedInUserId,
      recipient: recipient,
      text: newMessage,
      image: attachment?.type.startsWith("image/") ? attachment.url : null,
      document: attachment?.type.startsWith("application/") ? attachment.url : null,
      video: attachment?.type.startsWith("video/") ? attachment.url : null,
    };

    axios
      .post(`${BASE_URL}/api/postmessages`, messageData)
      .then((response) => {
        setMessages((prevMessages) => [...prevMessages, response.data.data]);
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
          setUnreadUsers(unreadUsersData);
        } catch (error) {
          console.error(error);
        }
      };
      fetchUnreadMessages();
      const intervalId = setInterval(fetchUnreadMessages, 3 * 1000);
      return () => clearInterval(intervalId);
    }
  }, [users]);

  const handleShowMessage = (userId) => {
    setShowMessages((prevShowMessages) => ({
      ...prevShowMessages,
      [userId]: !prevShowMessages[userId],
    }));
  };

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
    console.log(message)
    setForwardMessage(message);
    setShowForwardModal(true);
    setShowDropdown(null);

  };


  const handleForwardMessage = (selectedUsers) => {
    selectedUsers.forEach((userId) => {
      // Your forwarding logic here
    });
    setShowForwardModal(false);
    setShowDropdown(null);
  };
  const handleCancelForward = () => {
    setShowForwardModal(false);
  };

  const fetchPopSms = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/getNotification/${loggedInUserId}`);
      const data = response.data;
      console.log(data);
      setPopSms(data);
      if (data.length > 0) {
        const senderId = data[0].sender;
        setSelectedSender(senderId);
        setShowPopSms(true);
        const empDetails = await axios.get(`${BASE_URL}/api/billingTeam/getUserById/${senderId}`);
        // console.log(empDetails.data.user.name)
         setSelectedSenderName(empDetails.data.user.name);
         console.log(selectedSenderName)
        console.log("Playing notification sound");
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

  return (
    <div>
      <GPSTracker managerId={loggedInUserId} />

      <div className="flex flex-col lg:flex-row h-screen">
        <div className="w-full lg:w-1/5 bg-white border-2 border-gray-100 shadow-lg p-4">
          <h1 className="text-2xl font-bold mb-4 text-[#5443c3]">All Billing Team</h1>
          <div className="relative mb-4">
            <input
              type="text"
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
              className="w-full h-10 p-2 text-base text-gray-700 rounded-xl pl-10 bg-white border border-[#5443c3] shadow-lg"
              placeholder="Search by name..."
            />
            <AiOutlineSearch className="absolute top-3 left-3 text-gray-500 text-2xl" />
          </div>
          <div className="h-5/6 overflow-y-auto">
            {filteredUsers.map((user) => (
              <div key={user._id}>
                <div
                 className="w-full h-auto font-medium rounded-md bg-[#eef2fa] text-[#5443c3] mb-4 text-2xl block items-center p-4 cursor-pointer"
                  onClick={() => handleClick(user._id, user.name)}
                >
                  <h1>{user.name}</h1>
                  {unreadUsers
                    .filter((unreadUser) => unreadUser.userId === user._id)
                    .flatMap((unreadUser) =>
                      unreadUser.data.map((message) => (
                        <div
                          key={message._id}
                           className="text-orange-600 flex justify-between items-center content-center gap-5 mt-2"
                          onClick={() => handleShowMessage(user._id)}
                        >
                          {!showMessages[user._id] ? (
                            <>
                              <>
                                {message.content.text && (
                                  <p className="pe-2 text-base">
                                    {message.content.text}
                                  </p>
                                )}
                                {message.content.image && <FaImage />}
                                {message.content.video && <FaVideo />}
                                {message.content.document && (
                                  <IoIosDocument className="text-xl" />
                                )}
                                <p className="text-xs text-black">
                                  {new Date(
                                    message.createdAt
                                  ).toLocaleDateString()}{" "}
                                  {new Date(
                                    message.createdAt
                                  ).toLocaleTimeString()}
                                </p>
                              </>
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

        <div className="w-full lg:w-4/5 flex flex-col justify-between bg-[#f6f5fb]">
          <div className="flex justify-between items-center content-center p-4 bg-white text-[#5443c3]">
            <h1 className="text-2xl font-bold">Chat with {recipientName}</h1>
            <Link
              to="/"
              className="group relative flex items-center justify-end font-extrabold text-2xl rounded-full p-3 md:p-5"
            >
              <BiLogOut />
            </Link>
          </div>
          <div className="flex-grow overflow-y-auto p-4 flex flex-col">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === loggedInUserId ? 'justify-end' : 'justify-start'} mb-2 `}
                onMouseEnter={() => handleHover(index)}
                onMouseLeave={() => setHoveredMessage(null)}
              >
                <div
                className={`w-1/3 p-2 rounded-md ${message.sender === loggedInUserId ?  "bg-[#5443c3] text-white self-end rounded-tr-3xl rounded-bl-3xl" : "bg-white text-[#5443c3] self-start rounded-tl-3xl rounded-br-3xl"
                  }`}
              >
                {message.content && message.content.text && (
                  <p className="text-sm">{message.content.text}</p>
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
                     className="text-orange-600 hover:underline"
                  >
                    <IoIosDocument className="text-9xl" />
                  </a>
                )}
                {message.content && message.content.video && (
                  <video controls className="max-w-xs text-orange-600 hover:underline">
                    <source src={message.content.video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
                <span className="text-xs text-orange-600">
                  {new Date(message.createdAt).toLocaleString()}
                </span>
                {hoveredMessage === index && (
                  <AiOutlineDown
                    className="absolute top-2 right-2 cursor-pointer"
                    onClick={() => handleDropdownClick(index)}
                  />
                )}
                {showDropdown === index && (
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
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex items-center p-4 bg-[#f6f5fb] w-full">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-grow p-2 border rounded-lg mr-2 border-[#5443c3]"
              placeholder="Type a message..."
            />
            <input
              type="file"
              onChange={handleAttachmentChange}
              className="hidden"
              id="file-upload"
            />
            {/* <label htmlFor="file-upload" className="cursor-pointer p-2">
              <span className="bg-gray-200 hover:bg-gray-300 p-2 rounded">
                Attach
              </span>
            </label> */}
            <button
              onClick={handleSendMessage}
              className="bg-[#5443c3] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Send
            </button>
            <FileUploadModel sender={loggedInUserId} recipient={recipient} />
          </div>
        </div>
      </div>
      {showPopSms && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`bg-white relative p-6 rounded-lg shadow-lg w-[80vw] md:w-[50vw] lg:w-[30vw]`}>
              {showPopSms && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className={`bg-white relative p-4 rounded-lg shadow-lg w-[80vw] md:w-[50vw] lg:w-[30vw] animate-pop-up`}>
                    {popSms.length > 0 &&
                      popSms
                        .filter((sms) => sms.sender === selectedSender)
                        .map((sms) => (
                          <div key={sms.id} className="relative border border-gray-200 rounded-lg p-2 mb-2 shadow-sm">
                            <div className="flex items-center gap-5 mb-1">
                              <i className="fas fa-bell text-yellow-500 text-sm mr-2"></i>
                              <h1 className="text-xl font-bold text-green-600 text-center">
                                {selectedSenderName}
                              </h1>
                            </div>
                            <p className="text-base font-bold mb-1">{sms.content.text}</p>
                            <p className="text-sm text-gray-500 mb-2">
                              {new Date(sms.createdAt).toLocaleDateString()}{" "}
                              {new Date(sms.createdAt).toLocaleTimeString()}
                            </p>
                            <button
                              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                              onClick={() => handleModalClose(sms.sender)}
                            >
                              Close
                            </button>
                          </div>
                        ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      {showForwardModal && (
        <ForwardMessageModal
          users={users}
          forwardMessage={forwardMessage}
          onForward={handleForwardMessage}
          onCancel={handleCancelForward}
        />
      )}
    </div>
  );
}

export default ManagerChat;

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { AiOutlineSearch, AiOutlineDown } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { IoIosDocument } from "react-icons/io";
import { FaVideo, FaImage, FaCamera } from "react-icons/fa";
import GPSTracker from "./Gps.jsx"; // Adjust the import path as necessary
import { BASE_URL } from '../../constants';
import ForwardMessageModal from './ForwardMessageModal';
import AllUsersFileModel from "../AllUsers/AllUsersFileModel.jsx";
import ReplyModel from "../../components/ReplyModel";
import { MdNotificationsActive } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa";
import Camera from "../Camera/Camera.jsx";
import { IoMdNotificationsOutline } from "react-icons/io";
import fetchAnnounce from '../utility/fetchAnnounce';

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
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [selectedSenderName, setSelectedSenderName] = useState("");
  const [replyMessage, setReplyMessage] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [isChatSelected, setIsChatSelected] = useState(false);
  const [selectedChatUserId, setSelectedChatUserId] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [announcements, setAnnouncements] = useState([])
  const navigate = useNavigate();
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));

  const handleClick = (id, name) => {
    setRecipient(id);
    setRecipientName(name);
    setIsChatSelected(true);
    setSelectedChatUserId(id);
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
        const filteredUsers = response.data.filter(
          (user) => user._id !== loggedInUserId
        );
        setUsers(filteredUsers);
        setUnreadUsers(filteredUsers);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [loggedInUserId]);

  useEffect(() => {
    if (loggedInUserId && recipient) {
      const intervalId = setInterval(() => fetchMessages(loggedInUserId, recipient), 2000);
      return () => clearInterval(intervalId);
    }
  }, [loggedInUserId, recipient]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (currentLocation && JSON.stringify(currentLocation) !== JSON.stringify(prevLocation)) {
      console.log("Sending location:", currentLocation);
      axios
        .post(`${BASE_URL}/api/location/managerlocation`, {
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
      senderName: userDetails.manager_name,
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

  const filteredUsers = users.filter((users) =>
    users.name.toLowerCase().includes(userSearchQuery.toLowerCase())
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
    setReplyMessage(message);
    setShowReplyModal(true);
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



  const handleBackToUserList = () => {
    setIsChatSelected(false);
    setSelectedChatUserId("");
    setRecipient("");
    setRecipientName("");
    setMessages([]);
  };

  const handleCapture = (imageSrc) => {
    setAttachment({ url: imageSrc, type: "image/jpeg" });
    setShowCamera(false);
  };

  const handleCloseCamera = () => {
    setShowCamera(false);
  };

  const isActive = (path) => location.pathname === path;
  const handleAnnouncement = () => {
    navigate(`/fetchAllAnnouncement/${'managerChat'}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAnnounce();
        setAnnouncements(data); 
  
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };

    fetchData(); // Fetch immediately on component mount

    const intervalId = setInterval(fetchData, 10000); // Fetch every 5 seconds

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);

 
  const handleLogout = () => {
    navigate("/");
    localStorage.clear();
  };


  return (
    <div>
      <GPSTracker managerId={loggedInUserId} />
      <div className="flex flex-col lg:flex-row h-screen relative">
        <div className={`flex flex-col bg-white text-black p-4 shadow w-full lg:w-1/4 ${isChatSelected ? 'hidden lg:flex' : 'flex'}`}>
          <div className="flex items-center">
            <h1 className="lg:text-2xl text-xl font-bold mb-4 text-[#5443c3] flex-shrink-0">All Billing Team</h1>

            <div className="relative ml-4">
              <div className="flex">
                <div>
                  <div
                    onClick={handleAnnouncement}
                    className={`group relative flex items-center rounded-full p-3 md:p-5 ${isActive("/fetchAllAnnouncement") ? "bg-blue-500 text-white" : "bg-[#fffefd]"}`}
                  >
                    <IoMdNotificationsOutline className="text-lg md:text-2xl lg:text-3xl" />
                  </div>

                  {announcements.length > 0 && (
                    <span className="relative -top-11 -right-5 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                      {announcements?.length}
                    </span>
                  )}

                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 ml-1 whitespace-nowrap z-50 bg-black text-white text-xs md:text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Announcement
                  </span>
                </div>



                <div
                  onClick={handleLogout}
                  className=" flex items-center bg-yellow-200 hover:bg-yellow-500 rounded-full h-auto "
                >
                 <div className="relative flex items-center justify-center">
  <span className="absolute bottom-full mb-2 whitespace-nowrap bg-black text-white text-xs md:text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
    Logout
  </span>
  <BiLogOut className="mx-10 text-lg md:text-2xl lg:text-3xl" />
</div>
                 
                 
                </div>
              </div>



            </div>
          </div>
          <div className="relative mb-4">
            <input
              type="text"
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
              className="w-full h-10 p-2 text-base text-gray-700 rounded-xl pl-10 bg-white border-2 border-[#5443c3] shadow-lg"
              placeholder="Search by name..."
            />
            <AiOutlineSearch className="absolute top-3 left-3 text-gray-500 text-2xl" />
          </div>





          <div className="h-screen overflow-y-auto">
            {filteredUsers.map((user) => (
              <div key={user._id}>
                <div
                  className="w-full h-auto lg:font-medium font-base rounded-md bg-[#eef2fa] text-[#5443c3] mb-2 lg:text-2xl text-xl block items-center p-2 cursor-pointer"
                  onClick={() => handleClick(user._id, user.name)}
                >
                  <h1>{user.name}</h1>
                  {unreadUsers
                    .filter((unreadUser) => unreadUser.userId === user._id)
                    .flatMap((unreadUser) =>
                      unreadUser.data.map((message) => (
                        <div
                          key={message._id}
                          className="text-orange-600 relative break-words whitespace-pre-wrap gap-5my-2"
                          onClick={() => handleShowMessage(user._id)}
                        >
                          {!showMessages[user._id] ? (
                            <>
                              <>
                                {message.content.text && (
                                  <p className="pe-2 text-base mb-2">
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



        {isChatSelected && (
          <div className="w-full h-screen lg:w-min-[30%] flex flex-col justify-between bg-[#f6f5fb]">
            {isChatSelected && (
              <div className=" text-[#5443c3] sm:text-white sm:bg-[#5443c3] md:text-white md:bg-[#5443c3] bg-white p-2 flex flex-row items-center justify-between">
                <button className="w-20  text-[#5443c3] sm:text-white md:text-white text-2xl  mt-2 "
                  onClick={handleBackToUserList}
                >
                  <FaArrowLeft className="text-xl lg:text-2xl" />
                </button>
                <h1 className="text-xl lg:text-2xl font-bold">Chat with {recipientName}</h1>
                <Link
                  to="/"
                  className=" text-xl lg:text-2xl group relative flex items-center justify-end font-extrabold rounded-full p-3 md:p-5"
                >
                  <BiLogOut />
                </Link>
              </div>
            )}

            <div className="flex flex-col flex-1 px-4 pt-4 relative overflow-y-auto" >
              {messages.map((message, index) => (
                <div
                  key={message._id}
                  className={`mb-4 p-4 rounded-lg max-w-[50%] relative break-words whitespace-pre-wrap ${message.sender === loggedInUserId
                    ? "self-end bg-[#9184e9] text-white border-2 border-[#5443c3] rounded-tr-3xl rounded-bl-3xl"
                    : "self-start bg-[#ffffff] text-[#5443c3] border-2 border-[#5443c3] rounded-tl-3xl rounded-br-3xl"
                    }`}

                  onMouseEnter={() => handleHover(index)}
                  onMouseLeave={() => setHoveredMessage(null)}
                >
                  {message.content && message.content.originalMessage && (
                    <div className="mb-2">
                      <span className="bg-green-900 px-2 py-1 text-xs text-white rounded">
                        {message.content.originalMessage}
                      </span>
                    </div>
                  )}
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
                  {message.content && message.content.camera && (
                    <img
                      src={message.content.camera}
                      alt="Image"
                      className="rounded-lg lg:h-96 lg:w-72 md:h-96 md:w-64 h-40 w-32"
                    />
                  )}
                  {message.content && message.content.video && (
                    <video controls className="max-w-xs">
                      <source src={message.content.video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                  <span className="text-xs text-black">
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
              {showCamera && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
                  <Camera onCapture={handleCapture} onClose={handleCloseCamera} loggedInUserId={loggedInUserId} recipient={recipient} />
                </div>
              )}
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
              <button
                onClick={() => setShowCamera(true)}
                className="mr-2 text-xl"
              >
                <FaCamera />
              </button>
              <button
                onClick={handleSendMessage}
                className="bg-[#5443c3] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                <IoMdSend />
              </button>
              <AllUsersFileModel sender={loggedInUserId} recipient={recipient} senderName={userDetails.manager_name} />
            </div>
          </div>
        )}
      </div>

      {showForwardModal && (
        <ForwardMessageModal
          users={users}
          forwardMessage={forwardMessage}
          onForward={handleForwardMessage}
          onCancel={handleCancelForward}
          senderName={userDetails.manager_name}
        />
      )}
      {replyMessage && (
        <ReplyModel
          message={replyMessage}
          sender={loggedInUserId}
          recipient={recipient}
          isVisible={showReplyModal}
          onClose={() => setShowReplyModal(false)}
          senderName={userDetails.manager_name}

        />
      )}
    </div>
  );
}

export default ManagerChat;

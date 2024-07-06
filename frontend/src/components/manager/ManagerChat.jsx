import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { AiOutlineSearch, AiOutlineDown } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { Link } from "react-router-dom";
import { IoIosDocument } from "react-icons/io";
import { FaVideo, FaImage } from "react-icons/fa";
import GPSTracker from "./Gps.jsx"; // Adjust the import path as necessary
import { BASE_URL } from '../../constants';
import ForwardMessageModal from './ForwardMessageModal';
import useSound from "use-sound";
import notificationSound from "../../assests/sound.wav";
import AllUsersFileModel from "../AllUsers/AllUsersFileModel.jsx";
import ReplyModel from "../../components/ReplyModel";
import { MdNotificationsActive } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa";

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
  const [replyMessage, setReplyMessage] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [isChatSelected, setIsChatSelected] = useState(false);
  const [selectedChatUserId, setSelectedChatUserId] = useState("");


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


  const handleBackToUserList = () => {
    setIsChatSelected(false);
    setSelectedChatUserId("");
    setRecipient("");
    setRecipientName("");
    setMessages([]);
  };


  return (
    <div>
      <GPSTracker managerId={loggedInUserId} />
      <div className="flex flex-col lg:flex-row h-screen relative">
        <div className={`flex flex-col bg-white text-black p-4 shadow w-full lg:w-1/4 ${isChatSelected ? 'hidden lg:flex' : 'flex'}`}>
          <h1 className="lg:text-2xl text-xl font-bold mb-4 text-[#5443c3]">All Billing Team</h1>
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
     <button  className="w-20  text-[#5443c3] sm:text-white md:text-white text-2xl  mt-2 "
                onClick={handleBackToUserList}
                >
                <FaArrowLeft className="text-xl lg:text-2xl"/>
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
   <IoMdSend />
  </button>
  <AllUsersFileModel sender={loggedInUserId} recipient={recipient} />
</div>
</div>
)}
      </div>
      {showPopSms && (
  <div className="fixed inset-0bg-opacity-50  items-center justify-center w-1/2 z-50 top-56 lg:left-96 mx-24">
    <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-[#5443c3]">
      <div className="flex items-center mb-4">
        <MdNotificationsActive className="text-blue-500 w-6 h-6 mr-2" />
        <h3 className="text-lg font-semibold text-[#5443c3]">New Message</h3>
      </div>
      <p className="mb-2 text-[#5443c3] font-bold">From: {selectedSenderName}</p>
      <p className="mb-4 relative break-words whitespace-pre-wrap ">Message: {popSms[0]?.content?.text}</p>
      <button
        onClick={() => handleModalClose(popSms[0]?.sender)}
        className="hover:bg-blue-500 bg-[#5443c3] text-white p-2 rounded-lg"
      >
        Close
      </button>
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
          {replyMessage && (
        <ReplyModel
          message={replyMessage}
          sender={loggedInUserId}
          recipient={recipient}
          isVisible={showReplyModal}
          onClose={() => setShowReplyModal(false)}

        />
      )}
    </div>
  );
}

export default ManagerChat;

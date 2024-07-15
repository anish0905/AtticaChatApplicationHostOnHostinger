
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { AiOutlineSearch, AiOutlineDown } from "react-icons/ai";
import { IoIosDocument } from "react-icons/io";
import { FaPaperclip } from "react-icons/fa";
import { BASE_URL } from "../../constants";
import { useSound } from "use-sound";
import notificationSound from "../../assests/sound.wav";
import { MdNotificationsActive } from "react-icons/md";
import ReplyModel from "../ReplyModel";
import AllUsersFileModel from "../AllUsers/AllUsersFileModel";
import ForwardMessageModalBillingTeam from "./ForwardMessageModalBillingTeam";
import { FaArrowLeft } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { BiLogOut } from "react-icons/bi";
import { Link } from "react-router-dom";

function BillingTeamChat() {
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
  const [isMobileView, setIsMobileView] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [playNotificationSound] = useSound(notificationSound);
  const [hoveredMessage, setHoveredMessage] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);
  const [forwardMessage, setForwardMessage] = useState(null);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);

  const userDetails = JSON.parse(localStorage.getItem("userDetails"));

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
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/manager/getAllManagers`)
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
    const intervalId = setInterval(() => fetchMessages(sender, recipient), 2000);
    return () => clearInterval(intervalId);
  }, [sender, recipient]);


  const handleSendMessage = async () => {
    if (!newMessage.trim() && !attachment) return;

    const messageData = {
      sender: loggedInUserId,
      senderName: userDetails.name,
      recipient: recipient,
      text: newMessage,
      image: attachment?.type.startsWith("image/") ? attachment.url : null,
      document: attachment?.type.startsWith("application/")
        ? attachment.url
        : null,
      video: attachment?.type.startsWith("video/") ? attachment.url : null,
    };

    try {
      const resp = await axios.post(`${BASE_URL}/api/postmessages`, messageData)
      setMessages([...messages, resp.data.data]);

    } catch (error) {
      console.error(error);

    }

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
                `${BASE_URL}/api/mark-messages-read/${user._id}
              `);
              return { userId: user._id, data: response.data };
            })
          );
          setUnreadUsers(unreadUsersData.filter((u) => u.data.length > 0));
        } catch (error) {
          console.error(error);
        }
      };
      fetchUnreadMessages();
      // const intervalId = setInterval(fetchUnreadMessages, 3 * 1000);
      // return () => clearInterval(intervalId);
    }
  }, [users]);

  

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


  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">

      {showChat ? (
        <div className="w-full  flex flex-col justify-between overflow-hidden">
          <div className=" text-[#5443c3] sm:text-white sm:bg-[#5443c3] md:text-white md:bg-[#5443c3] bg-white p-2 flex flex-row items-center justify-between">
            <button
              onClick={handleBackToEmployees}
              className=" text-[#5443c3] sm:text-white md:text-white text-2xl  mt-2 "
            >
              <FaArrowLeft className="lg:text-2xl text-xl" />
            </button>

      
              <h1 className="lg:text-2xl text-xl font-bold">{recipientName}</h1>
              <Link
                to="/"
                className=" text-xl lg:text-2xl group relative flex items-center justify-end font-extrabold rounded-full p-3 md:p-5"
              >
                <BiLogOut />
              </Link>
       

          </div>

          <div className="flex-grow overflow-y-auto p-4 flex flex-col h-screen bg-[#eef2fa] mb-20 lg:mb-0">
            {messages.map((message, index) => (
              <div
                key={message._id}
                className={`mb-4 p-4 rounded-lg max-w-[50%] relative break-words whitespace-pre-wrap ${message.sender === loggedInUserId
                  ? "self-end bg-[#e1dff3] text-[#5443c3] border border-[#5443c3] rounded-tr-3xl rounded-bl-3xl"
                  : "self-start bg-[#ffffff] text-[#5443c3] border border-[#5443c3] rounded-tl-3xl rounded-br-3xl"
                  }`}

                onMouseEnter={() => handleHover(index)}
                onMouseLeave={() => setHoveredMessage(null)}
              >
                {message.content && message.content.originalMessage && (
                  <div className="mb-2">
                    <span className="bg-green-300 px-2 py-1 text-xs text-white rounded">
                      {message.content.originalMessage}
                    </span>
                  </div>
                )}
                {message.content && message.content.text && (
                  <p className="font-bold lg:text-xl text-sm">{message.content.text}</p>
                )}
                {message.content && message.content.image && (
                  <img
                    src={message.content.image}
                    alt="Image"
                    className="rounded-lg lg:h-96 lg:w-72 md:h-96 md:w-64 h-40 w-32"
                  />
                )}
                {message.content && message.content.document && (
                  <a
                    href={message.content.document}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-500 hover:underline lg:text-8xl md:text-6xl text-4xl"
                  >
                    <IoIosDocument className="text-9xl" />
                  </a>
                )}
                {message.content && message.content.video && (
                  <video controls className="max-w-xs lg:h-96 lg:w-72 md:h-96 md:w-64 h-40 w-32 text-4xl">
                    <source src={message.content.video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
                <span className="text-xs font-base  text-gray-500">
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
          <div className="flex items-center p-4 bg-[#eef2fa] border-t border-gray-200  fixed bottom-0 w-full lg:static">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow p-2 border-2 rounded-lg mr-2 border-[#5443c3]"
            />

            <button

              onClick={handleSendMessage}
              className="bg-[#5443c3] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              <IoMdSend />
            </button>
            <AllUsersFileModel sender={loggedInUserId} recipient={recipient} />
          </div>
        </div>
      ) : (
        <div className="w-full lg:w-1/4 h-screen bg-white p-4 overflow-y-auto border-[#5443c3] shadow-lg">
          <h1 className="lg:text-2xl text-xl font-bold mb-4 text-[#5443c3]">All Manager</h1>
          <div className=" relative flex items-center mb-4 ">
            <input
              type="text"
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
              placeholder="Search by names"
              className="w-full h-10 p-2 text-base text-gray-700 rounded-xl pl-10 bg-white border-2 border-[#5443c3] shadow-lg"
            />
            <AiOutlineSearch className="absolute top-3 left-3 text-gray-500 text-2xl" />
          </div>
          <ul>

            {users
              .filter((user) =>
                user.
                  manager_name.toLowerCase().includes(userSearchQuery.toLowerCase())
              )
              .map((user) => (
                <li
                  key={user._id}
                  className={`p-4 mb-2 rounded-lg cursor-pointer flex justify-between text-[#5443c3] font-bold ${unreadUsers.some(
                    (unreadUser) => unreadUser.userId === user._id
                  )
                    ? "bg-blue-200"
                    : "bg-gray-200"
                    } ${recipient === user._id ? "bg-green-200" : ""}`}
                  onClick={() => handleClick(user._id, user.
                    manager_name)}
                >
                  <span>{user.
                    manager_name}</span>
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
      {showForwardModal && (
        <ForwardMessageModalBillingTeam
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


export default BillingTeamChat;

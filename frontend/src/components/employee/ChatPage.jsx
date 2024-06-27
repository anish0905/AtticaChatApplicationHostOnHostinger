import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { AiOutlineSearch, AiOutlineDown } from "react-icons/ai";
import { IoIosDocument } from "react-icons/io";
import { FaPaperclip, FaArrowLeft } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import EmployeeSidebar from "./EmployeeSidebar";
import { BASE_URL } from "../../constants"; // Ensure BASE_URL is correctly imported
import { useSound } from "use-sound";
// import notificationSound from "../../assets/sound.wav";
import notificationSound from "../../assests/sound.wav";
import { MdNotificationsActive } from "react-icons/md";
import ForwardMessageModalEmp from "./ForwardMessageModalEmp"; // Make sure ForwardMessageModalEmp component is correctly imported

function ChatPage() {
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
  const [selectedSenderName, setSelectedSenderName] = useState("");
  const [isMobileView, setIsMobileView] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [playNotificationSound] = useSound(notificationSound);
  const [hoveredMessage, setHoveredMessage] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);
  const [forwardMessage, setForwardMessage] = useState(null);
  const [showForwardModal, setShowForwardModal] = useState(false);

  // Fetch users on component mount
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/employee/`)
      .then((response) => {
        const filteredUsers = response.data.filter(
          (user) => user._id !== loggedInUserId
        );
        setUsers(filteredUsers);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, [loggedInUserId]);

  // Fetch messages between sender and recipient
  useEffect(() => {
    if (sender && recipient) {
      axios
        .get(`${BASE_URL}/api/getmessages/${recipient}/${sender}`)
        .then((response) => {
          setMessages(response.data);
        })
        .catch((error) => {
          console.error("Error fetching messages:", error);
        });
    }
  }, [sender, recipient]);

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!newMessage.trim() && !attachment) return;

    const messageData = {
      sender: loggedInUserId,
      recipient: recipient,
      content: {
        text: newMessage,
        image: attachment?.type.startsWith("image/") ? attachment.url : null,
        document: attachment?.type.startsWith("application/") ? attachment.url : null,
        video: attachment?.type.startsWith("video/") ? attachment.url : null,
      },
    };

    axios
      .post(`${BASE_URL}/api/postmessages`, messageData)
      .then((response) => {
        setMessages([...messages, response.data]);
        setNewMessage("");
        setAttachment(null);
        scrollToBottom();
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };

  // Handle file upload for attachments
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

  // Fetch unread messages for each user every 3 seconds
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
          console.error("Error fetching unread messages:", error);
        }
      };

      fetchUnreadMessages();
      const intervalId = setInterval(fetchUnreadMessages, 3 * 1000);
      return () => clearInterval(intervalId);
    }
  }, [users]);

  // Fetch pop-up notifications for new messages
  useEffect(() => {
    const fetchPopSms = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/getNotification/${loggedInUserId}`
        );
        const data = response.data;
        setPopSms(data);
        if (data.length > 0) {
          const senderId = data[0].sender;
          setSelectedSenderName(data[0].name); // Update sender's name directly from data
          setShowPopSms(true);
          playNotificationSound(); // Play notification sound

          // Remove the notification after displaying
          setTimeout(() => {
            setShowPopSms(false);
          }, 5000); // Close after 5 seconds
        }
      } catch (error) {
        console.error("Error fetching pop-up notifications:", error);
      }
    };

    const interval = setInterval(fetchPopSms, 5000); // Fetch every 5 seconds
    return () => clearInterval(interval);
  }, [loggedInUserId, playNotificationSound]);

  // Close pop-up notification modal
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

  // Handle clicking on a user to open chat
  const handleClick = (id, name) => {
    setRecipient(id);
    setRecipientName(name);
    setShowChat(true);
    setMessages([]); // Clear existing messages when opening chat with a new recipient
  };

  // Handle going back to employee list
  const handleBackToEmployees = () => {
    setShowChat(false);
    setRecipient("");
    setRecipientName("");
  };

  // Handle hover over a message for showing dropdown
  const handleHover = (index) => {
    setHoveredMessage(index);
  };

  // Handle clicking on dropdown for reply or forward options
  const handleDropdownClick = (index) => {
    setShowDropdown(showDropdown === index ? null : index);
  };

  // Handle replying to a message
  const handleReply = (message) => {
    setNewMessage(`Replying to: ${message.content.text}`);
    setShowDropdown(null);
  };

  // Handle forwarding a message
  const handleForward = (message) => {
    setForwardMessage(message);
    setShowForwardModal(true);
    setShowDropdown(null);
  };

  // Handle closing forward message modal
  const handleCancelForward = () => {
    setShowForwardModal(false);
  };

  // Scroll to the bottom of messages when new message arrives
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle resizing for mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <EmployeeSidebar />
      {/* Header */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Employee list and search */}
        <div className={`flex flex-col bg-white text-black p-4 shadow w-full lg:w-1/4 ${showChat ? 'hidden lg:flex' : 'flex'}`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold mb-4 text-[#5443c3]">Employee Chat</span>
          </div>

          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search by name..."
              className="w-full h-10 p-2 text-base text-gray-700 rounded-xl pl-10 bg-white border border-[#5443c3] shadow-lg"
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
            />
            <AiOutlineSearch size={20} className="absolute top-3 left-3 text-gray-500 text-2xl" />
          </div>

          <div className="flex-1 overflow-y-auto">
            <ul>
              {users
                .filter((user) =>
                  user.name.toLowerCase().includes(userSearchQuery.toLowerCase())
                )
                .map((user) => (
                  <li key={user._id} className="border-b">
                    <div
                      className={`w-full h-auto font-medium rounded-md bg-[#eef2fa] text-[#5443c3] mb-4 text-lg block items-center p-4 cursor-pointer flex`}
                      onClick={() => handleClick(user._id, user.name)}
                    >
                      <div className="flex justify-between">
                        <span className="font-md">{user.name}</span>
                        {unreadUsers.some((u) => u.userId === user._id) && (
                          <span className="text-red-500 font-bold flex flex-row ml-28">New</span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 ${showChat ? 'flex flex-col justify-between' : 'hidden'}`}>
          {showChat && (
            <>
              {/* Selected Recipient */}
              <div className="text-[#5443c3] sm:text-white sm:bg-[#5443c3] md:text-white md:bg-[#5443c3] bg-white p-2 flex flex-row items-center justify-between">
                <div className="text-2xl p-4 flex gap-2 items-center justify-between">
                  <button
                    className="w-20 text-[#5443c3] sm:text-white md:text-white text-2xl mt-2"
                    onClick={handleBackToEmployees}
                  >
                    <FaArrowLeft />
                  </button>
                  <h2 className="text-2xl font-semibold">{recipientName}</h2>
                </div>
              </div>

              {/* Messages */}
              <div className="overflow-y-auto flex-1 p-4">
                {messages.map((message, index) => (
                  <div
                    key={message._id}
                    className={`flex ${message.sender === loggedInUserId ? "justify-end" : "justify-start"
                      }`}
                    onMouseEnter={() => handleHover(index)}
                    onMouseLeave={() => setHoveredMessage(null)}
                  >
                    <div className="max-w-[80%]">
                      {message.content && message.content.text && (
                        <p className="text-sm">{message.content.text}</p>
                      )}
                      {message.content && message.content.image && (
                        <img
                          src={message.content.image}
                          alt="Image"
                          className="max-w-xs mt-2"
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
                    </div>
                    <span className="text-xs text-orange-600 ml-2">
                      {new Date(message.createdAt).toLocaleString()}
                    </span>
                    {hoveredMessage === index && (
                      <AiOutlineDown
                        className="cursor-pointer ml-2"
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

              {/* Input */}
              <div className="p-4 border-t flex justify-center items-center">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-grow p-2 border rounded-lg mr-2 border-[#5443c3]"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
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
                  className="bg-[#5443c3] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  <IoMdSend />
                </button>
              </div>

              {/* Notification Modal */}
              {showPopSms && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg relative">
                    <MdNotificationsActive className="text-blue-500 w-6 h-6 mr-2" />
                    <h2 className="text-xl font-bold text-green-600 text-center">New Message</h2>
                    <p className="mb-2">From: {selectedSenderName}</p>
                    <p className="mb-4">Message: {popSms[0]?.content?.text}</p>
                    <button
                      onClick={() => handleModalClose(popSms[0]?.sender)}
                      className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              {/* Forward Modal */}
              {showForwardModal && (
                <ForwardMessageModalEmp
                  users={users}
                  forwardMessage={forwardMessage}
                  onCancel={handleCancelForward}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatPage;

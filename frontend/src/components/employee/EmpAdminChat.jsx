import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { AiOutlineSearch, AiOutlineDown } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { Link } from "react-router-dom";
import { IoIosDocument } from "react-icons/io";
import { FaArrowLeft, FaVideo } from "react-icons/fa";
import { FaImage } from "react-icons/fa";
import { useSound } from "use-sound";
import notificationSound from "../../assests/sound.wav";
import { BASE_URL } from '../../constants';
import { IoMdSend } from "react-icons/io";
import AllUsersFileModel from "../AllUsers/AllUsersFileModel";
import ForwardMsgAllUsersToAdmin from "../AllUsers/ForwardMsgAllUsersToAdmin";
import ReplyModel from "../ReplyModel";
import EmployeeSidebar from './EmployeeSidebar'


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

  const [replyMessage, setReplyMessage] = useState(null); //--------------->
  const [showReplyModal, setShowReplyModal] = useState(false);  //-----

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
      senderName:userDetails.name,
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

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  // Filter admins based on search query
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
      // const intervalId = setInterval(fetchUnreadMessages, 30 * 1000);
      // return () => clearInterval(intervalId);
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
        console.log(empDetails.data);
        setSelectedSenderName(empDetails.data.email);
        playNotificationSound()
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
    setReplyMessage(message);  //--------------->
    setShowReplyModal(true);   //--------------->
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
                className="w-full lg:text-xl md:text-2xl text-sm h-auto font-medium rounded-md bg-[#eef2fa] text-[#5443c3] mb-4  block items-center p-4 cursor-pointer"
                onClick={() => handleClick(admin._id, admin.email)}
              >
                <h1>{admin.email}</h1>
                {unreadUsers
                  .filter((unreadUser) => unreadUser.userId === admin._id)
                  .flatMap((unreadUser) =>
                    unreadUser.data.map((message) => (
                      <div
                        key={message._id}
                        className="text-orange-600 relative break-words whitespace-pre-wrap my-2 "
                        onClick={() => handleShowMessage(admin._id)}
                      >
                        {!showMessages[admin._id] ? (
                          <>
                            {
                              message.content.text && (
                                <p className="pe-2 text-base">{message.content.text}</p>
                              )
                            }
                            {
                              message.content.image && (<FaImage />)
                            }
                            {
                              message.content.video && (
                                <FaVideo />
                              )
                            }
                            {
                              message.content.document && (
                                <IoIosDocument className="text-xl" />
                              )
                            }
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


      {isChatSelected && (
        <div className="w-full h-screen lg:w-4/5 flex flex-col justify-between bg-[#f6f5fb] ">

          {isChatSelected && (
            <div className="text-[#5443c3] sm:text-white sm:bg-[#5443c3] md:text-white md:bg-[#5443c3] h-12 bg-white p-2 flex flex-row justify-between">
            <button
              className="text-[#5443c3] sm:text-white md:text-white lg:text-2xl text-lg mt-2"
              onClick={handleBackToUserList}
            >
              <FaArrowLeft />
            </button>
            <h1 className="lg:text-2xl text-base font-bold ml-auto">Chat with {recipientName}</h1>
            <Link
              to={"/"}
              className="group relative flex items-center justify-end font-extrabold rounded-full p-3 md:p-5"
            >
              {/* <BiLogOut /> */}
            </Link>
          </div>
          )}



          <div className="flex flex-col flex-1 px-4 pt-4 relative overflow-y-auto" style={{ maxHeight: "80vh" }}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex relative break-words whitespace-pre-wrap ${message.sender === loggedInUserId ? 'justify-end' : 'justify-start'} mb-2  `}
                onMouseEnter={() => handleHover(index)}
                onMouseLeave={() => handleLeave()}
              >
                <div
                  className={`relative lg:text-2xl md:text-xl text-sm  ${message.sender === loggedInUserId ? " bg-[#9184e9] text-white self-end rounded-tr-3xl rounded-bl-3xl border-2 border-[#5443c3] " : "bg-white text-[#5443c3] border-2 border-[#5443c3]  self-start rounded-tl-3xl rounded-br-3xl relative"
                    } py-2 px-4 rounded-lg lg:max-w-2xl max-w-[50%]`}
                >
                 {message.content && message.content.originalMessage && (
                  <div className="mb-2">
                    <span className="bg-green-900 px-2 py-1 text-xs text-white rounded">
                      {message.content.originalMessage}
                    </span>
                  </div>
                )}

                  {message.content && message.content.text && (
                    <p className="text-sm">{message.content.text}</p>
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
                  <span className="text-xs text-black">
                    {message.sender === loggedInUserId && new Date(message.createdAt).toLocaleString()}
                  </span>

                  <AiOutlineDown
                    className="absolute top-2 right-2 cursor-pointer"
                    onClick={() => handleDropdownClick(index)}
                  />

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
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex items-center p-4 bg-[#f6f5fb]  bottom-0 lg:static w-full relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-grow p-2 rounded-lg mr-2 border-2 border-[#5443c3]"
              placeholder="Type a message..."
            />
            <input
              type="file"
              onChange={handleAttachmentChange}
              className="hidden"
              id="file-upload"
            />
            <button
              onClick={handleSendMessage}
              className="bg-[#5443c3] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              <IoMdSend />
            </button>
            <AllUsersFileModel sender={loggedInUserId} recipient={recipient} admin={"admin"} senderName={userDetails.name} />
          </div>
        </div>)}



      {showPopSms && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`bg-blue-100 relative p-6 rounded-lg shadow-lg w-[80vw] md:w-[50vw] lg:w-[30vw]`}
          >
            {showPopSms && (
              <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
                <div
                  className={`bg-blue-100 relative p-4 rounded-lg shadow-lg w-[80vw] md:w-[50vw] lg:w-[30vw] animate-pop-up`}
                >
                  {popSms.length > 0 &&
                    popSms
                      .filter((sms) => sms.sender === selectedSender)
                      .map((sms) => (
                        <div
                          key={sms.id}
                          className="relative border border-[#5443c3] rounded-lg p-2 mb-2 shadow-sm"
                        >
                          <div className="flex items-center gap-5 mb-1">
                            <i className="fas fa-bell text-yellow-500 text-sm mr-2"></i>
                            <h1 className="text-2xl font-bold text-green-600 text-center">
                              {selectedSenderName}
                            </h1>
                          </div>
                          <p className="text-base font-bold mb-1 relative break-words whitespace-pre-wrap ">
                            {sms.content.text}
                          </p>
                          <p className="text-sm text-gray-500 my-4">
                            {new Date(sms.createdAt).toLocaleDateString()}{" "}
                            {new Date(sms.createdAt).toLocaleTimeString()}
                          </p>
                          <button
                            className="absolute top-2 right-2 text-red-500 hover:text-gray-700"
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
        <ForwardMsgAllUsersToAdmin
          users={admins}
          forwardMessage={forwardMessage}
          onForward={handleForwardMessage}
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

export default EmpAdminChat;

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import Sidebar from "./Sidebar";
// import { BASE_URL } from "../../constants";
import Swal from "sweetalert2";

function AnnouncementByAdmin() {
  const BASE_URL = import.meta.env.VITE_API_URL;

  const [messages, setMessages] = useState([]);
  const [messagesAdmin, setAdminMessages] = useState([]);
  const [typedMessage, setTypedMessage] = useState("");
  const messagesEndRef = useRef(null);
  const loggedInUserId = localStorage.getItem("CurrentUserId");
  const [hoveredMessage, setHoveredMessage] = useState(null);

  // State for editing functionality
  const [editMode, setEditMode] = useState(false);
  const [editedMessage, setEditedMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const { department } = useParams();
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));

  console.log("messagesAdmin", messagesAdmin);

  let NewDepartment;

  if (department === "Bouncers") {
    NewDepartment = "Bouncers/Driver";
  } else if (department === "Security") {
    NewDepartment = "Security/CCTV";
  } else {
    NewDepartment = department;
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(fetchAdminMessages, 5000); // Fetch every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  const fetchData = () => {
    axios
      .get(`${BASE_URL}/api/announcements/${department}`)
      .then((response) => {
        setMessages(response.data);
        scrollToBottom();
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  };

  const fetchAdminMessages = async () => {
    try {
      const resp = await axios.get(`${BASE_URL}/api/announce/getAllAnnounce`);
      setAdminMessages(resp.data);
    } catch (error) {
      console.error("Error fetching admin messages:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (typedMessage.trim() === "") return;

    const messageData = {
      sender: loggedInUserId,
      text: typedMessage,
      department: NewDepartment,
      name: userDetails.name,
    };
    axios
      .post(`${BASE_URL}/api/announcements/announcements`, messageData)
      .then((response) => {
        setMessages([...messages, response.data]);
        setTypedMessage("");
        fetchData(); // Refresh messages after sending
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };

  const handleDelete = (message) => {
    axios
      .delete(`${BASE_URL}/api/announcements/announcements/${message._id}`)
      .then((response) => {
        const updatedMessages = messages.filter((m) => m._id !== message._id);
        setMessages(updatedMessages);
      })
      .catch((error) => {
        console.error("Error deleting message:", error);
      });
  };

  const handleMouseEnter = (index) => {
    setHoveredMessage(index);
  };

  const handleMouseLeave = () => {
    setHoveredMessage(null);
  };

  const toggleEditMode = (message) => {
    setEditMode(true);
    setEditedMessage(message.text); // Assuming message has a text property
    setEditingMessageId(message._id); // Store the message ID being edited
  };

  const handleEditMessage = () => {
    if (!editingMessageId) {
      console.error("Invalid message data:", editingMessageId);
      return;
    }

    setIsUpdating(true);

    const updatedMessage = {
      text: editedMessage,
    };

    axios
      .put(
        `${BASE_URL}/api/announcements/announcements/${editingMessageId}`,
        updatedMessage
      )
      .then((response) => {
        const updatedMessages = messages.map((m) =>
          m._id === editingMessageId ? { ...m, text: response.data.text } : m
        );
        setMessages(updatedMessages);
        setEditMode(false);
        setIsUpdating(false);
        fetchData();
      })
      .catch((error) => {
        console.error("Error editing message:", error);
        setIsUpdating(false);
      });
  };

  const handleDeleteAllAnnouncements = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action will delete all announcements. This cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete all!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            `${BASE_URL}/api/announcements/announcements/${loggedInUserId}`
          )
          .then((response) => {
            setMessages([]);
            Swal.fire(
              "Deleted!",
              "All announcements have been deleted.",
              "success"
            );
          })
          .catch((error) => {
            console.error("Error deleting all announcements:", error);
            Swal.fire("Error", "Failed to delete announcements.", "error");
          });
      }
    });
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen relative">
      <Sidebar />

      <div className="flex-1 flex flex-col w-full lg:w-auto">
        <div className="flex flex-col flex-1 lg:bg-[#f6f5fb] lg:border-l lg:border-gray-200 lg:overflow-y-auto">
          <div className="flex items-center space-x-2">
            <div className="lg:text-2xl font-bold p-4 flex justify-between items-center lg:text-[#ffffff] lg:bg-[#5443c3] text-[#5443c3] border border-[#5443c3] bg-[#ffffff] w-full ">
              <Link to="/admindashboard">
                <FaArrowLeft className="lg:text-white text-[#5443c3] hover:text-[#5443c3]" />
              </Link>
              <h1>Announcement-({NewDepartment})</h1>
              <h1>Announcement</h1>
              <button
                className="bg-[#ff3434] hover:bg-[#f06856] px-2 py-2 rounded-md shadow-md lg:text-xl"
                onClick={handleDeleteAllAnnouncements}
              >
                Delete All
              </button>
            </div>
          </div>

          <div className="flex flex-wrap flex-1  overflow-y-auto">
            <div className="h-[82vh] w-1/2 p-10">
              {messages?.map((message, index) => (
                <div
                  key={index}
                  className={`flex relative break-words whitespace-pre-wrap ${
                    message.sender === loggedInUserId
                      ? "justify-end"
                      : "justify-start"
                  } mb-2`}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div
                    className={`relative lg:text-3xl md:text-xl text-sm font-bold ${
                      message.sender === loggedInUserId
                        ? "self-end bg-[#e1dff3] border border-[#5443c3] text-[#5443c3] rounded-tr-3xl rounded-bl-3xl"
                        : "self-start bg-[#ffffff] text-[#5443c3] border border-[#5443c3] rounded-tl-3xl rounded-br-3xl"
                    } py-2 px-4 rounded-lg lg:max-w-2xl max-w-[50%]`}
                  >
                    {/* Render message content */}
                    {message.content && message.content.text && (
                      <p className="text-sm">{message.content.text}</p>
                    )}

                    {/* Show options when message is hovered */}
                    {hoveredMessage === index && (
                      <div className="absolute top-2 right-2 bg-white border rounded shadow-lg z-10">
                        {/* Show edit button only if sender is logged in user */}
                        {message.sender === loggedInUserId && (
                          <button
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => toggleEditMode(message)}
                          >
                            Edit
                          </button>
                        )}
                        {/* Show delete button only if sender is logged in user */}
                        {message.sender === loggedInUserId && (
                          <button
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => handleDelete(message)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="h-[82vh] w-1/2 p-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              {messagesAdmin?.map((message, index) => (
                <div
                  key={index}
                  className={`flex relative break-words whitespace-pre-wrap ${
                    message.sender === loggedInUserId
                      ? "justify-end"
                      : "justify-start"
                  } mb-2`}
                >
                  <div
                    className={`relative lg:text-3xl md:text-xl text-sm font-bold ${
                      message.sender === loggedInUserId
                        ? "self-end bg-[#e1dff3] border border-[#5443c3] text-[#5443c3] rounded-tr-3xl rounded-bl-3xl"
                        : "self-start bg-[#ffffff] text-[#5443c3] border border-[#5443c3] rounded-tl-3xl rounded-br-3xl"
                    } py-2 px-4 rounded-lg lg:max-w-2xl max-w-[50%]`}
                  >
                    {message.content && message.content.text && (
                      <p className="text-sm">{message.content.text}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div ref={messagesEndRef} />
          </div>

          {/* Edit message modal */}
          {editMode && (
            <div className="fixed top-0 left-0 z-50 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-4 rounded-lg shadow-lg w-80">
                <input
                  type="text"
                  className="w-full h-10 rounded-lg border-2 border-[#5443c3] bg-white pl-4 mb-4"
                  placeholder="Edit your message..."
                  value={editedMessage}
                  onChange={(e) => setEditedMessage(e.target.value)}
                />
                <div className="flex justify-end">
                  {isUpdating ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">Updating...</span>
                      <div
                        className="spinner-border text-gray-600"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="px-4 py-2 bg-[#5443c3] text-white rounded-md hover:bg-opacity-80"
                      onClick={handleEditMessage}
                    >
                      Update
                    </button>
                  )}
                  <button
                    className="px-4 py-2 ml-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    onClick={() => setEditMode(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Send message input */}
          {!editMode && (
            <div className="flex items-center space-x-2 mt-4 bg-slate-300 p-4">
              <input
                type="text"
                className="w-full h-10 rounded-lg border-2 border-[#5443c3] bg-white pl-4"
                placeholder="Type a message..."
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
              />
              <IoMdSend
                className="text-[#5443c3] text-4xl hover:text-[#5443c3] rounded-full cursor-pointer"
                onClick={handleSendMessage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnnouncementByAdmin;

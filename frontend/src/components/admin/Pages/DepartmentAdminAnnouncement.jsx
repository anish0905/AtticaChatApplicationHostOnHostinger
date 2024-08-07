import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { BASE_URL } from "../../../constants";
import Swal from 'sweetalert2';
import Sidebar from "../Sidebar";

function DepartmentAdminAnnouncement() {
  const [messages, setMessages] = useState([]);
  const [adminMessages, setAdminMessages] = useState([]);
  const [typedMessage, setTypedMessage] = useState("");
  const messagesEndRef = useRef(null);
  const loggedInUserId = localStorage.getItem("CurrentUserId");
  const [hoveredMessage, setHoveredMessage] = useState(null);

  // State for editing functionality
  const [editMode, setEditMode] = useState(false);
  const [editedMessage, setEditedMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Admin"); 

  const navigate = useNavigate();


  const roleEndpointMap = {
    Employee: "Employee",
    Manager: "Manager",
    "Billing Team": "Billing_Team",
    Accounts: "Accountant",
    Software: "Software",
    HR: "HR",
    "Call Center": "CallCente",
    "Virtual Team": "VirtualTeam",
    "Monitoring Team": "MonitoringTeam",
    Bouncers: "Bouncers",
    Security: "Security/CCTV",
    "Digital Marketing": "Digital Marketing",
    TE: "TE",
    Logistic: "Logistic",
    Cashier: "Cashier",
  };

  const endpoint = roleEndpointMap[selectedRole];

  useEffect(() => {
    fetchDataByDepartment("Admin");
    fetchData();
  }, [selectedRole]);


  useEffect(() => {
    fetchDataByDepartment(loggedInUserId);
    fetchDataByDepartment("Admin");
    fetchData()
  }, []);

  const fetchDataByDepartment = (department) => {
    axios
      .get(`${BASE_URL}/api/announcement/${endpoint}`)
      .then((response) => {
        if (department === "Admin") {
          setAdminMessages(response.data);
        }
        scrollToBottom();
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  };


  const fetchData = () => {
    axios
      .get(`${BASE_URL}/api/announce/getAnnounceById/${loggedInUserId}`)
      .then((response) => {
        setMessages(response.data);
        scrollToBottom();
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
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
    };

    axios
      .post(`${BASE_URL}/api/announce/postmessages/`, messageData)
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
      .delete(`${BASE_URL}/api/announce/deleteAnnouncebyId/${message._id}`)
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
        `${BASE_URL}/api/announce/updateAnnouncement/${editingMessageId}`,
        updatedMessage
      )
      .then((response) => {
        const updatedMessages = messages.map((m) =>
          m._id === editingMessageId ? { ...m, text: response.data.text } : m
        );
        setMessages(updatedMessages);
        setEditMode(false);
        setIsUpdating(false);
        fetchDataByDepartment(loggedInUserId);
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
          .delete(`${BASE_URL}/api/announce/deleteAnnounce/${loggedInUserId}`)
          .then((response) => {
            setMessages([]);
            Swal.fire("Deleted!", "All announcements have been deleted.", "success");
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
              <h1>Announcement-(Admin)</h1>
              <h1>
                <label
                  htmlFor="userRoles"
                  className="block font-medium bg-[#5443C3] px-4 py-4 rounded text-white text-xl"
                >
                 Announcement
                </label>
                <select
                  id="userRoles"
                  name="userRoles"
                  value={selectedRole}
                  onChange={(event) => setSelectedRole(event.target.value)}
                  className="ml-4 bg-[#5443C3] text-white px-4 py-2 rounded-md"
                >
                  {Object.keys(roleEndpointMap).map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </h1>
              <button
                className="bg-[#ff3434] hover:bg-[#f06856] px-2 py-2 rounded-md shadow-md lg:text-xl"
                onClick={handleDeleteAllAnnouncements}
              >
                Delete All
              </button>
            </div>
          </div>

          <div className="flex flex-wrap flex-1 overflow-y-auto">
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
                    {message.content && message.content.text && (
                      <p className="text-sm">{message.content.text}</p>
                    )}

                    {hoveredMessage === index && (
                      <div className="absolute top-2 right-2 bg-white border rounded shadow-lg z-10">
                        {message.sender === loggedInUserId && (
                          <button
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => toggleEditMode(message)}
                          >
                            Edit
                          </button>
                        )}
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
              {adminMessages?.map((message, index) => (
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

          {editMode && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded shadow-md">
                <textarea
                  className="w-full h-24 p-2 border border-gray-300 rounded"
                  value={editedMessage}
                  onChange={(e) => setEditedMessage(e.target.value)}
                />
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={handleEditMessage}
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Updating..." : "Update"}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="lg:bg-[#f6f5fb] lg:border-t lg:border-gray-200 p-4 flex items-center relative">
            <form
              className="flex items-center w-full"
              onSubmit={handleSendMessage}
            >
              <textarea
                className="flex-1 p-2 border rounded resize-none mr-2"
                rows="1"
                placeholder="Type your message..."
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
              />
              <button
                type="submit"
                className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white hover:bg-blue-600"
              >
                <IoMdSend size={24} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DepartmentAdminAnnouncement;

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { IoMdSend } from "react-icons/io";
import { IoMdDocument } from "react-icons/io";
import UploadImageModal from "./Pages/UploadImageModal";
import { useParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { BASE_URL } from "../../constants";
import { useNavigate } from "react-router-dom";
import notificationTone from "../../assests/notification_ding.mp3";

const Message = ({ selectedGroupName: propsGroupName, selectedGrade: propsGrade }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showPrompt, setShowPrompt] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showPopSms, setShowPopSms] = useState(false);
  const [popSmsContent, setPopSmsContent] = useState({});
  const [lastMessageCount, setLastMessageCount] = useState(0);
  const messagesEndRef = useRef(null);
  const notificationSoundRef = useRef(null);
  const adminId = localStorage.getItem("AdminId");

  const navigate = useNavigate();
  const { selectedGroupName: paramsGroupName, selectedGrade: paramsGrade } = useParams();

  const selectedGroupName = propsGroupName || paramsGroupName;
  const selectedGrade = propsGrade || paramsGrade;

  useEffect(() => {
    fetchMessages();
  }, [selectedGroupName, selectedGrade]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(checkForNewMessages, 1000); // Check for new messages every 1 second
    return () => clearInterval(interval);
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(fetchPopSms, 3000); // Fetch pop sms every 3 seconds
    return () => clearInterval(interval);
  }, []);

  // Request Notification permission on component mount
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const fetchMessages = async () => {
    if (selectedGroupName && selectedGrade) {
      try {
        const response = await axios.get(`${BASE_URL}/api/messages`, {
          params: {
            group: selectedGroupName,
            grade: selectedGrade,
          },
        });

        const data = response.data;

        if (data && data.messages) {
          setMessages(data.messages);
        } else {
          setMessages([]);
        }
        setShowPrompt(false); // Hide the prompt when a group is selected
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    } else {
      setShowPrompt(true); // Show the prompt when no group is selected
    }
  };

  const sendMessage = async () => {
    if (message.trim() === "") return; // Don't send empty messages

    try {
      const newMessage = {
        employeeId: adminId,
        message: message,
        group: selectedGroupName,
        grade: selectedGrade,
      };

      const response = await axios.post(`${BASE_URL}/api/messages`, newMessage);

      if (response.status === 201) {
        // Update messages state with the new message
        setMessages([...messages, newMessage]);

        // Clear the input field after sending the message
        setMessage("");
      } else {
        console.error("Error sending message:", response.statusText);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const checkForNewMessages = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/messages`, {
        params: {
          group: selectedGroupName,
          grade: selectedGrade,
        },
      });

      const data = response.data;
      if (data && data.messages && data.messages.length > messages.length) {
        const newMessages = data.messages.slice(messages.length);
        const foreignMessage = newMessages.find((msg) => msg.employeeId !== adminId);

        if (foreignMessage) {
          setNotification({
            employeeId: foreignMessage.employeeId,
            message: foreignMessage.message,
          });
          showNotifications(newMessages);
        }
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Error checking for new messages:", error);
    }
  };

  const fetchPopSms = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/getNotificationId`);
      const data = response.data;

      if (data && data.employeeId && data.message) {
        setPopSmsContent({
          employeeId: data.employeeId,
          message: data.message,
        });
        setShowPopSms(true); // Show the popup message
      }
    } catch (error) {
      console.error("Error fetching pop sms:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const showNotifications = (newMessages) => {
    if (Notification.permission === "granted") {
      newMessages.forEach((message) => {
        if (message.employeeId !== adminId) {
          const notification = new Notification("New Message", {
            body: `${message.employeeId}: ${message.message}`,
          });
          notification.onclick = () => {
            window.focus();
          };

          // Play notification sound
          playNotificationSound();
        }
      });
    }
  };

  const playNotificationSound = () => {
    if (notificationSoundRef.current) {
      notificationSoundRef.current.play().catch((error) => {
        console.error("Error playing notification sound:", error);
      });
    }
  };

  return (
    <div className="flex flex-row h-screen lg:w-[70vw] w-[100vw]">
      <div className="flex-1 flex flex-col w-full">
        <div className="flex flex-col flex-1 overflow-y-auto">
          {showPrompt && (
            <div className="bg-yellow-200 p-4 mb-4 text-yellow-800 rounded lg:text-2xl md:text-xl sm:text-sm">
              Please select a group and grade to message.
            </div>
          )}

          {selectedGroupName && selectedGrade && (
            <div className="flex flex-col flex-1 bg-[#f6f5fb]">
              <div className="text-[#ffffff] bg-[#5443c3] lg:text-2xl md:text-xl text-xl p-4 flex gap-2 items-center justify-between">
                <span onClick={() => navigate(-1)} className="cursor-pointer">
                  <IoArrowBack />
                </span>
                <div className="flex flex-row">
                  <h1>{selectedGroupName}</h1>
                  <p>(Grade: {selectedGrade})</p>
                </div>
              </div>

              <div
                className="flex flex-col flex-1 px-4 pt-4 overflow-y-auto lg:mb-0 mb-10"
                style={{ maxHeight: "80vh" }}
              >
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={` flex relative break-words whitespace-pre-wrap ${
                      msg.employeeId === adminId ? "justify-end" : "justify-start"
                    } mb-2`}
                  >
                    <div
                      className={` lg:text-2xl md:text-xl text-sm  ${
                        msg.employeeId === adminId
                          ? " self-end bg-[#5443c3] text-white rounded-tr-3xl rounded-bl-3xl "
                          : "self-start bg-[#ffffff] text-[#5443c3] border-2 border-[#5443c3] rounded-tl-3xl rounded-br-3xl"
                      } py-2 px-4 rounded-lg lg:max-w-2xl max-w-[50%]`}
                    >
                      <p
                        className={` lg:text-lg md:text-lg text-sm font-bold ${
                          msg.employeeId === adminId ? "text-green" : "text-[#5443c3]"
                        }`}
                      >
                        {msg.employeeId}
                        <span> : </span>
                      </p>
                      <p className="lg:text-lg md:text-sm text-sm">{msg.message}</p>
                      {msg.Document && (
                        <div className="lg:text-8xl md:text-6xl text-4xl my-2">
                          <a href={msg.Document} download target="_blank" rel="noopener noreferrer">
                            <IoMdDocument />
                          </a>
                        </div>
                      )}
                      {msg.video && (
                        <div className="lg:text-8xl md:text-6xl text-4xl my-2">
                          <video src={msg.video} controls></video>
                        </div>
                      )}
                      {msg && msg.Image && (
                        <div>
                          <img src={msg.Image} alt="" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
        </div>

        <div className="mx-auto flex items-center p-4 sticky bottom-0 z-10 bg-[#f6f5fb] w-full">
          <input
            type="text"
            className="border border-gray-300 rounded px-4 py-2 mr-2 flex-1"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button
            className="bg-[#5443c3] text-white rounded px-4 py-2 flex items-center justify-center"
            onClick={sendMessage}
          >
            <IoMdSend />
          </button>
          <button
            className="bg-[#5443c3] text-white rounded px-4 py-2 flex items-center justify-center"
            onClick={() => setShowPopSms(true)}
          >
            <IoMdDocument />
          </button>
        </div>
      </div>
      <UploadImageModal showModal={showPopSms} setShowModal={setShowPopSms} />

      <audio ref={notificationSoundRef} src={notificationTone} preload="auto" />

      {showPopSms && (
        <div className="fixed bottom-0 right-0 mb-4 mr-4 bg-white p-4 rounded shadow-lg z-50">
          <p className="font-bold">Employee ID: {popSmsContent.employeeId}</p>
          <p>Message: {popSmsContent.message}</p>
          <button
            className="mt-2 px-4 py-2 bg-[#5443c3] text-white rounded"
            onClick={() => setShowPopSms(false)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default Message;

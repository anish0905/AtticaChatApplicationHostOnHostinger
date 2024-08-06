import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { IoMdSend, IoMdDocument } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";
import { BASE_URL } from "../../constants";
import { useNavigate, useParams } from "react-router-dom";
import ScrollToBottomButton from "../utility/ScrollToBottomButton";
import UploadImageModal from "./Pages/UploadImageModal";

const Message = ({ selectedGroupName: propsGroupName, selectedGrade: propsGrade, department: propsDepartment }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showPopSms, setShowPopSms] = useState(false);
  const [popSmsContent, setPopSmsContent] = useState({});
  const notificationSoundRef = useRef(null);
  const messagesEndRef = useRef(null);

  const navigate = useNavigate();
  const { selectedGroupName: paramGroupName, selectedGrade: paramGrade, selectedDepartment: paramDepartment } = useParams();

  // Prefer prop values, fallback to params
  const selectedGroupName = propsGroupName || paramGroupName;
  const selectedGrade = propsGrade || paramGrade;
  const departmentNew = propsDepartment || paramDepartment;

  let department;

  if(departmentNew==="Bouncers"){
    department = "Bouncers/Driver";
  }
  else if(departmentNew==="Security"){
    department = "Security/CCTV";
  }
  else{
    department = departmentNew;
  }


  

 

  const adminId = localStorage.getItem("AdminId") || localStorage.getItem("CurrentUserId");

  useEffect(() => {
    fetchMessages();
  }, [selectedGroupName, selectedGrade, department]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(checkForNewMessages, 1000);
    return () => clearInterval(interval);
  }, [messages, selectedGroupName, selectedGrade, department]);

  useEffect(() => {
    const interval = setInterval(fetchPopSms, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const fetchMessages = async () => {
    if (selectedGroupName && selectedGrade) {
      try {
        const response = await axios.get(`${BASE_URL}/api/messages`, {
          params: { group: selectedGroupName, grade: selectedGrade, department },
        });
        setMessages(response.data.messages || []);
        setShowPrompt(false);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    } else {
      setShowPrompt(true);
    }
  };

  const sendMessage = async () => {
    if (message.trim() === "") return;

    try {
      const newMessage = {
        employeeId: adminId,
        message,
        group: selectedGroupName,
        grade: selectedGrade,
        department,
      };
      const response = await axios.post(`${BASE_URL}/api/messages`, newMessage);
      if (response.status === 201) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
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
        params: { group: selectedGroupName, grade: selectedGrade, department },
      });
      const newMessages = response.data.messages || [];
      if (newMessages.length > messages.length) {
        const foreignMessages = newMessages.slice(messages.length).filter(msg => msg.employeeId !== adminId);
        if (foreignMessages.length > 0) {
          setPopSmsContent(foreignMessages[0]);
          setShowPopSms(true);
          showNotifications(foreignMessages);
        }
        setMessages(newMessages);
      }
    } catch (error) {
      console.error("Error checking for new messages:", error);
    }
  };

  const fetchPopSms = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/getNotificationId`);
      const data = response.data;
      if (data?.employeeId && data?.message) {
        setPopSmsContent(data);
        setShowPopSms(true);
      }
    } catch (error) {
      console.error("Error fetching pop sms:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const showNotifications = (newMessages) => {
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
      newMessages.forEach(message => {
        const notification = new Notification("New Message", {
          body: `${message.employeeId}: ${message.message}`,
        });
        notification.onclick = () => window.focus();
      });
    }
  };

  return (
    <div className="flex flex-row h-screen lg:h-full lg:w-[100%] w-[100vw]">
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
                <span onClick={() => navigate(-1)} className="cursor-pointer text-[#ffffff]">
                  <IoArrowBack />
                </span>
                <div className="flex flex-row justify-between gap-5">
                  <h1>{selectedGroupName}</h1>
                  <p>(Grade: {selectedGrade})</p>
                </div>
              </div>
              <div className="flex flex-col flex-1 px-4 pt-4 overflow-y-auto lg:mb-0 mb-10" style={{ maxHeight: "80vh" }}>
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex relative break-words whitespace-pre-wrap ${msg.employeeId === adminId ? "justify-end" : "justify-start"
                      } mb-2`}
                  >
                    <div
                      className={`lg:text-2xl md:text-xl text-sm font-bold ${msg.employeeId === adminId
                          ? "self-end bg-[#9184e9] border border-[#5443c3] text-white rounded-tr-3xl rounded-bl-3xl"
                          : "self-start bg-[#ffffff] text-[#5443c3] border border-[#5443c3] rounded-tl-3xl rounded-br-3xl"
                        } py-2 px-4 rounded-lg lg:max-w-2xl max-w-[50%]`}
                    >
                      <p className={`lg:text-sm md:text-lg text-sm font-normal mb-2 ${msg.employeeId === adminId ? "text-green" : "text-[#5443c3]"
                        }`}>
                        {msg.employeeId}
                        <span> : </span>
                      </p>
                      <p className="lg:text-xl md:text-sm text-sm">{msg.message}</p>
                      {msg.Document && (
                        <div className="lg:text-8xl md:text-6xl text-4xl my-2">
                          <a href={msg.Document} download target="_blank" rel="noopener noreferrer">
                            <IoMdDocument />
                          </a>
                        </div>
                      )}
                      {msg.video && (
                        <div className="rounded-lg h-auto w-auto my-2">
                          <video src={msg.video} controls></video>
                        </div>
                      )}
                      {msg.Image && (
                        <div>
                          <img src={msg.Image} alt="" className="rounded-lg lg:h-96 lg:w-72 md:h-96 md:w-64 h-40 w-32" />
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
        <div className="mx-auto flex items-center p-4 sticky bottom-0 bg-[#f6f5fb] w-full">
          <input
            type="text"
            className="border border-[#5443c3] rounded px-4 py-2 mr-2 flex-1"
            placeholder="Type your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="bg-[#5443c3] text-white px-4 py-2 rounded-lg"
            onClick={sendMessage}
          >
            <IoMdSend />
          </button>
          <UploadImageModal isOpen={showPopSms} onClose={() => setShowPopSms(false)} content={popSmsContent} selectedGroupName={selectedGroupName} selectedGrade={selectedGrade} department={department} />
          <ScrollToBottomButton onClick={scrollToBottom} />
        </div>
      </div>
    </div>
  );
};

export default Message;

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaArrowLeft} from "react-icons/fa";
import { IoIosDocument, IoMdSend } from "react-icons/io";
import Sidebar from "./Sidebar";
import { BASE_URL } from "../../constants";

function AnnouncementByAdmin() {
  const [messages, setMessages] = useState([]);
  const [typedMessage, setTypedMessage] = useState("");
  const [hoveredMessage, setHoveredMessage] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const messagesEndRef = useRef(null);
  const loggedInUserId = localStorage.getItem("CurrentUserId");


  const fetchdata = ()=>{
    axios.get(`${BASE_URL}/api/announce/getAnnounceById/${loggedInUserId}`)
        .then(response => {
            setMessages(response.data);
            console.log("response.data", response.data);
            scrollToBottom();
        })
        
        .catch(error => {
            console.error("Error fetching messages:", error);
        });
  }

  useEffect(() => {
    fetchdata()
    
     
}, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (typedMessage.trim() === "") return;

    const messageData = {
      sender: loggedInUserId,
      senderName: userDetails.name,
      text: typedMessage,
      // Add logic for attachments as per your implementation
    };

    axios.post(`${BASE_URL}/api/announce/postmessages/`, messageData)
      .then(response => {
        setMessages([...messages, response.data]);
        setTypedMessage("");
        fetchdata() // Clear input after sending message
      })
      
      .catch(error => {
        console.error("Error sending message:", error);
      });
    
  };

  
console.log("message.....",messages)
 
 
  

  return (
    <div className="flex flex-col lg:flex-row h-screen relative">
      <Sidebar />
     
      <div className="flex-1 flex flex-col w-full lg:w-auto">
        <div className="flex flex-col flex-1 lg:bg-[#f6f5fb] lg:border-l lg:border-gray-200 lg:overflow-y-auto">
          <div className="flex items-center space-x-2  ">
            <Link to="/">
              <FaArrowLeft className="text-[#5443c3] hover:text-[#5443c3]" />
            </Link>
            <h1 className="text-lg font-bold p-4 lg:text-[#ffffff] lg:bg-[#5443c3] text-[#5443c3] border border-[#5443c3] bg-[#ffffff] w-full ">Announcemet</h1>
          </div>
       
        <div className="flex flex-col flex-1 px-4 pt-4 overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex relative break-words whitespace-pre-wrap ${message.sender === loggedInUserId ? 'justify-end' : 'justify-start '} mb-2`}
             
            >
              <div
                className={`relative lg:text-3xl md:text-xl text-sm font-bold  ${message.sender === loggedInUserId ? " self-end bg-[#e1dff3] border border-[#5443c3] text-[#5443c3] rounded-tr-3xl rounded-bl-3xl" : " self-start bg-[#ffffff] text-[#5443c3] border border-[#5443c3] rounded-tl-3xl rounded-br-3xl"
                  } py-2 px-4 rounded-lg lg:max-w-2xl max-w-[50%]`}
              >
                {message.content && message.content.originalMessage && (
                  <div className="mb-2">
                    <span className="bg-green-300 px-2 py-1 text-xs text-black rounded">
                      {message.content.originalMessage}
                    </span>
                  </div>
                )}
                {message.content && message.content.text && (
                  <p className="text-sm">{message.content.text}</p>
                )}
                {message.content && message.content.image && (
                  <img src={message.content.image} alt="Image" className="rounded-lg lg:h-96 lg:w-72 md:h-96 md:w-64 h-40 w-32" />
                )}
                
                {message.content && message.content.document && (
                  <a
                    href={message.content.document}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lg:text-8xl md:text-6xl text-4xl my-3"
                  >
                    <IoIosDocument />
                  </a>
                )}
                {message.content && message.content.video && (
                  <video controls className="max-w-xs text-orange-600 rounded-lg lg:h-96 lg:w-72 md:h-96 md:w-64 h-40 w-32">
                    <source src={message.content.video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
                <span className="text-xs font-base  text-gray-500 mt-5">
                  {new Date(message.createdAt).toLocaleString()}
                </span>
             
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex space-x-2 mt-4">
          <input
            type="text"
            className="w-full h-10 rounded-lg border-2 border-[#5443c3] bg-white pl-4"
            placeholder="Type a message..."
            value={typedMessage}
            onChange={(e) => setTypedMessage(e.target.value)}
          />
          <IoMdSend
            className="text-[#5443c3] text-4xl hover:text-[#5443c3] cursor-pointer"
            onClick={handleSendMessage}
          />
        </div>
        </div>
      </div>
    </div>
  );
}

export default AnnouncementByAdmin;



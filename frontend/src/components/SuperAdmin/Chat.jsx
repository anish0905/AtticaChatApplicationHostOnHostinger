import React, { useEffect, useState, useRef } from 'react';
import { BASE_URL } from '../../constants';
import axios from 'axios';
import { AiOutlineDown } from 'react-icons/ai';
import { IoIosDocument } from 'react-icons/io';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [hoveredMessage, setHoveredMessage] = useState(null);
    const messagesEndRef = useRef(null);

    const sender = localStorage.getItem('user1');
    const recipient = localStorage.getItem('user2');
     const selectedRole =localStorage.getItem("selectedRole");
     const user2Name = localStorage.getItem("user2Name");
     const user1Name = localStorage.getItem("user1Name");
    const loggedInUserId = sender; 

    const fetchMessages = (sender, recipient) => {
      try {
         if(selectedRole==="Admin"){
          axios
          .get(`${BASE_URL}/api/empadminsender/getmessages/${recipient}/${sender}`)
          .then((response) => {``
            setMessages(response.data);
          })
         
         }
         else{
          axios
          .get(`${BASE_URL}/api/getmessages/${recipient}/${sender}`)
          .then((response) => {``
            setMessages(response.data);
          })
  
         }
      } catch (error) {
        console.error(error);
        
      }
    };

    useEffect(() => {
        fetchMessages(sender, recipient);
        const interval = setInterval(() => fetchMessages(sender, recipient), 5000);
        return () => clearInterval(interval);
    }, [sender, recipient]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleHover = (index) => {
        setHoveredMessage(index);
    };

    return (
        <div className="flex-grow overflow-y-auto p-4 flex flex-col bg-[#f6f5fb] h-screen overflow-hidden">
             <h1  className=" flex justify-between font-medium content-center items-center  bg-[#5443C3] px-4 py-4 rounded text-white text-xl mb-5  ">
               <p>Chat</p>
               <p className='text-sm'> {user1Name} </p>
               <p className='text-xs'>With</p>
               <p className='text-sm'>{user2Name}</p>
             </h1>
            {messages.map((message, index) => (
                <div
                    key={message._id}
                    className={`mb-4 p-4 rounded-lg max-w-[70%] relative ${message.sender === loggedInUserId
                        ? 'bg-[#5443C3] text-white rounded-tr-3xl rounded-bl-3xl self-end'
                        : 'bg-white text-[#5443C3] rounded-tl-3xl rounded-br-3xl self-start'
                    }`}
                    onMouseEnter={() => handleHover(index)}
                    onMouseLeave={() => setHoveredMessage(null)}
                >
                    {message.content && message.content.originalMessage && (
                        <div className="mb-2  text-wrap">
                            <span className="bg-green-900 px-2 py-1 text-xs text-white rounded">
                                {message.content.originalMessage}
                            </span>
                        </div>
                    )}
                    {message.content && message.content.text && (
                        <p className="font-bold text-wrap">{message.content.text}</p>
                    )}
                    {message.content && message.content.image && (
                        <img
                            src={message.content.image}
                            alt="Image"
                            className="min-w-xs"
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
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default Chat;



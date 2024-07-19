import React, { useEffect, useState, useRef } from 'react';
import { BASE_URL } from '../../constants';
import axios from 'axios';
import { IoIosDocument } from 'react-icons/io';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [hoveredMessage, setHoveredMessage] = useState(null);
    const messagesEndRef = useRef(null);

    const sender = localStorage.getItem('user1');
    const recipient = localStorage.getItem('user2');
    const selectedRole = localStorage.getItem("selectedRole");
    const user2Name = localStorage.getItem("user2Name");
    const user1Name = localStorage.getItem("user1Name");
    const loggedInUserId = sender;

    const fetchMessages = (sender, recipient) => {
        try {
            const url = selectedRole === "Admin" 
                ? `${BASE_URL}/api/empadminsender/getadminmessages/${recipient}/${sender}`
                : `${BASE_URL}/api/getmessages/${recipient}/${sender}`;

            axios.get(url).then((response) => {
                setMessages(response.data);
            });
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
        <div className="flex-grow overflow-y-auto p-1 flex flex-col bg-[#f6f5fb] h-screen overflow-hidden w-full">
           <h1 className="flex flex-col font-medium bg-[#5443C3] px-4 py-4 rounded text-white text-lg md:text-xl lg:text-2xl mb-5">
    <div className="flex justify-between items-center">
        <p>Chat</p>
    </div>
    <div className="flex items-center space-x-2 mt-2">
        <p className='text-sm text-yellow-300'>{user1Name}</p>
        <p className='text-sm'>With</p>
        <p className='text-sm text-green-300'>{user2Name}</p>
    </div>
</h1>

            {messages.map((message, index) => (
                <div
                    key={message._id}
                    className={`mb-4 p-4 rounded-lg max-w-[80%] md:max-w-[70%] lg:max-w-[60%] relative break-words whitespace-pre-wrap ${
                        message.sender === loggedInUserId
                            ? 'self-end bg-[#9184e9] border border-[#5443c3] text-white rounded-tr-3xl rounded-bl-3xl'
                            : 'self-start bg-[#ffffff] text-[#5443c3] border border-[#5443c3] rounded-tl-3xl rounded-br-3xl'
                        }`}
                    onMouseEnter={() => handleHover(index)}
                    onMouseLeave={() => setHoveredMessage(null)}
                >
                    {message.content && message.content.originalMessage && (
                        <div className="mb-2 text-wrap">
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
                            className="w-full h-auto md:h-64 lg:h-80 object-cover rounded-lg"
                        />
                    )}
                    {message.content && message.content.camera && (
                        <img
                            src={message.content.camera}
                            alt="Image"
                            className="w-full h-auto md:h-64 lg:h-80 object-cover rounded-lg"
                        />
                    )}
                    {message.content && message.content.document && (
                        <a
                            href={message.content.document}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline flex items-center space-x-2"
                        >
                            <IoIosDocument className="text-3xl md:text-5xl lg:text-6xl" />
                        </a>
                    )}
                    {message.content && message.content.video && (
                        <video controls className="w-full h-auto md:h-64 lg:h-80 rounded-lg">
                            <source src={message.content.video} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    )}
                    <span className="text-xs text-gray-400">
                        {new Date(message.createdAt).toLocaleString()}
                    </span>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default Chat;

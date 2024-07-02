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
    const loggedInUserId = sender; // Assuming the sender is the logged-in user

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
        <div className="flex-grow overflow-y-auto p-4 flex flex-col">
             <h1  className="block font-medium bg-[#5443C3] px-4 py-4 rounded text-white text-xl mb-5 ">chat</h1>
            {messages.map((message, index) => (
                <div
                    key={message._id}
                    className={`mb-4 p-4 rounded-lg max-w-[70%] relative ${message.sender === loggedInUserId
                        ? 'bg-blue-200 self-end'
                        : 'bg-gray-200 self-start'
                    }`}
                    onMouseEnter={() => handleHover(index)}
                    onMouseLeave={() => setHoveredMessage(null)}
                >
                    {message.content && message.content.originalMessage && (
                        <div className="mb-2">
                            <span className="bg-green-900 px-2 py-1 text-xs text-white rounded">
                                {message.content.originalMessage}
                            </span>
                        </div>
                    )}
                    {message.content && message.content.text && (
                        <p className="font-bold">{message.content.text}</p>
                    )}
                    {message.content && message.content.image && (
                        <img
                            src={message.content.image}
                            alt="Image"
                            className="max-w-xs"
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
                    <span className="text-xs text-gray-500">
                        {new Date(message.createdAt).toLocaleString()}
                    </span>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default Chat;



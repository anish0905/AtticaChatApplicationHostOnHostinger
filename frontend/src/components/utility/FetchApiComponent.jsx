import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../constants';
import NotificationsComponent from './NotificationsComponent';

const FetchApiComponent = () => {
    const [messages, setMessages] = useState([]);
    const userId = localStorage.getItem('CurrentUserId');

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/getNotification/${userId}`);
                setMessages(response.data);
                console.log("Notfication Api" + response.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
        const interval = setInterval(fetchMessages, 2000);

        return () => clearInterval(interval);
    }, [userId]);

    return (
        <div>
            {messages.map((message, index) => (
                <NotificationsComponent 
                    key={index}
                    name={message.senderName}
                    text={message.content.text} 
                />
            ))}
        </div>
    );
};

export default FetchApiComponent;

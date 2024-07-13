import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants';
import NotificationsComponent from './NotificationsComponent';

const GlobalNotification = () => {
  const [messages, setMessages] = useState([]);
  const [messageCount, setMessageCount] = useState(0);
  const [newMessages, setNewMessages] = useState([]); // Add a state for new messages

  // Separate state variables for each API
  const [adminMessages, setAdminMessages] = useState([]);
  const [adminMessageCount, setAdminMessageCount] = useState(0);
  const [newAdminMessages, setNewAdminMessages] = useState([]);

 // Get user ID from localStorage

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/messages/user/${localStorage.getItem('CurrentUserId')}`); // Send user ID to the backend
        const fetchedMessages = response.data;

        // Check if this is the initial fetch
        if (messageCount === 0) {
          // Set the initial message count and messages without triggering notifications
          setMessages(fetchedMessages);
          setMessageCount(fetchedMessages.length);
        } else {
          // Compare the new messages with the current ones
          if (fetchedMessages.length > messageCount) {
            const newMessageCount = fetchedMessages.length - messageCount;
            const newMessageBatch = fetchedMessages.slice(-newMessageCount);

            // Update message count
            setMessageCount(fetchedMessages.length);

            // Update state with new messages
            setNewMessages(newMessageBatch);
          }

          // Update all messages
          setMessages(fetchedMessages);
        }

        console.log(fetchedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    const fetchAdminMessages = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/empadminsender/messages/user/${localStorage.getItem('CurrentUserId')}`);
        const fetchedAdminMessages = response.data;

        // Check if this is the initial fetch
        if (adminMessageCount === 0) {
          setAdminMessages(fetchedAdminMessages);
          setAdminMessageCount(fetchedAdminMessages.length);
        } else {
          if (fetchedAdminMessages.length > adminMessageCount) {
            const newAdminMessageCount = fetchedAdminMessages.length - adminMessageCount;
            const newAdminMessageBatch = fetchedAdminMessages.slice(-newAdminMessageCount);

            setAdminMessageCount(fetchedAdminMessages.length);
            setNewAdminMessages(newAdminMessageBatch);
          }

          setAdminMessages(fetchedAdminMessages);
        }

        console.log(fetchedAdminMessages);
      } catch (error) {
        console.error('Error fetching admin messages:', error);
      }
    };

    fetchMessages();
    fetchAdminMessages();
    const interval = setInterval(() => {
      fetchMessages();
      fetchAdminMessages();
    }, 2000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [ messageCount, adminMessageCount]);

  return (
    <div>
      {/* <h1>Global Notifications</h1>
      {messages.length > 0 ? (
        <ul>
          {messages.map((message, index) => (
            <li key={index}>
              <strong>Sender:</strong> {message.senderName}, <strong>Text:</strong> {message.content.text}
            </li>
          ))}
        </ul>
      ) : (
        <p>No messages available.</p>
      )} */}

      {/* Render NotificationsComponent and pass newMessages as props */}
      {newMessages.map((message, index) => (
        <NotificationsComponent
          key={index}
          name={message.senderName}
          text={message.content.text}
        />
      ))}

      {/* Render NotificationsComponent for admin messages and pass newAdminMessages as props */}
      {newAdminMessages.map((message, index) => (
        <NotificationsComponent
          key={index}
          name={message.senderName}
          text={message.content.text}
        />
      ))}
    </div>
  );
};

export default GlobalNotification;

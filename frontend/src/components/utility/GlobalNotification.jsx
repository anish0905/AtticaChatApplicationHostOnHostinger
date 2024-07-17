import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants';
import Notification_tone from "../../assests/notification_ding.mp3";

const GlobalNotification = () => {
  const [messages, setMessages] = useState([]);
  const [messageCount, setMessageCount] = useState(0);
  const [adminMessages, setAdminMessages] = useState([]);
  const [adminMessageCount, setAdminMessageCount] = useState(0);
  
  const prevMessageCount = useRef(parseInt(localStorage.getItem('prevMessageCount')) || 0);
  const prevAdminMessageCount = useRef(parseInt(localStorage.getItem('prevAdminMessageCount')) || 0);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/messages/user/${localStorage.getItem('CurrentUserId')}`);
        const fetchedMessages = response.data;
        setMessages(fetchedMessages);
        setMessageCount(fetchedMessages.length);

        // Initialize localStorage value if it's not set
        if (!localStorage.getItem('prevMessageCount')) {
          localStorage.setItem('prevMessageCount', fetchedMessages.length.toString());
          prevMessageCount.current = fetchedMessages.length;
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    const fetchAdminMessages = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/empadminsender/messages/user/${localStorage.getItem('CurrentUserId')}`);
        const fetchedAdminMessages = response.data;
        setAdminMessages(fetchedAdminMessages);
        setAdminMessageCount(fetchedAdminMessages.length);

        // Initialize localStorage value if it's not set
        if (!localStorage.getItem('prevAdminMessageCount')) {
          localStorage.setItem('prevAdminMessageCount', fetchedAdminMessages.length.toString());
          prevAdminMessageCount.current = fetchedAdminMessages.length;
        }
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

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted");
        }
      }).catch((error) => {
        console.error("Error requesting notification permission:", error);
      });
    }
  }, []);

  useEffect(() => {
    if (messageCount > prevMessageCount.current) {
      const newMessages = messages.slice(prevMessageCount.current);
      newMessages.forEach(message => showNotification(message));
      prevMessageCount.current = messageCount;
      localStorage.setItem('prevMessageCount', messageCount.toString());
    }
  }, [messageCount, messages]);

  useEffect(() => {
    if (adminMessageCount > prevAdminMessageCount.current) {
      const newAdminMessages = adminMessages.slice(prevAdminMessageCount.current);
      newAdminMessages.forEach(message => showNotification(message));
      prevAdminMessageCount.current = adminMessageCount;
      localStorage.setItem('prevAdminMessageCount', adminMessageCount.toString());
    }
  }, [adminMessageCount, adminMessages]);

  const showNotification = (message) => {
    if (Notification.permission === "granted") {
      const notification = new Notification("New Message", {
        body: `${message.senderName}: ${message.content.text}`,
      });
      notification.onclick = () => {
        window.focus();
      };

      playNotificationSound();
    }
  };

  const playNotificationSound = () => {
    const notificationSound = new Audio(Notification_tone);
    notificationSound.play();
  };

  return (
    <div>
      {/* {messages.map((message, index) => (
        <div key={index}>
          <strong>Sender:</strong> {message.senderName}, <strong>Text:</strong> {message.content.text}
        </div>
      ))}
      {adminMessages.map((message, index) => (
        <div key={index}>
          <strong>Sender:</strong> {message.senderName}, <strong>Text:</strong> {message.content.text}
        </div>
      ))} */}
    </div>
  );
};

export default GlobalNotification;

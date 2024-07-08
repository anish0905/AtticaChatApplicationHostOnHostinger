import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Notification_tone from '../../assests/notification_ding.mp3';
import { BASE_URL } from '../../constants';

const Notification = () => {
  const [messageCount, setMessageCount] = useState(0);
  const userId = localStorage.getItem('CurrentUserId');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/notifications/${userId}`);
        const newCount = response.data.length;

        // Check if new message count is greater than current count
        if (newCount > messageCount) {
          // Update message count state
          setMessageCount(newCount);

          // Show notifications and play sound for new messages
          response.data.forEach(message => {
            showNotification(message.content.text, message.recipient);
          });
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    const interval = setInterval(fetchMessages, 2000);

    return () => clearInterval(interval);
  }, [userId, messageCount]);

  const showNotification = (content, recipient) => {
    // Check if notifications are supported by the browser
    if (!('Notification' in window)) {
      console.log('This browser does not support desktop notification.');
      return;
    }

    // Check notification permission
    if (Notification.permission === 'granted') {
      // Create notification
      const notification = new Notification('New Message Received', {
        body: `Message for ${recipient}: ${content.text}`,
      });
      notification.onclick = () => {
        window.focus(); // Focus on the window when notification is clicked
      };

      // Play notification sound
      const audio = new Audio(Notification_tone);
      audio.play();
    } else if (Notification.permission !== 'denied' && Notification.requestPermission) {
      // Request permission if it's not explicitly denied and method exists
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          showNotification(content.text, recipient); // Show notification if permission granted
        }
      }).catch(error => {
        console.error('Error requesting notification permission:', error);
      });
    } else {
      console.log('Notification permission denied or not available.');
    }
  };

  useEffect(() => {
    // Check and request permission to show notifications on mount
    if (Notification.permission === 'default' && Notification.requestPermission) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
        } else if (permission === 'denied') {
          console.log('Notification permission denied.');
        }
      }).catch(error => {
        console.error('Error requesting notification permission:', error);
      });
    }
  }, []);

  return (
    <div>
      <p>Messages API Count: {messageCount}</p>
    </div>
  );
};

export default Notification;

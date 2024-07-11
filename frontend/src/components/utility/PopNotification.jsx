import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NotificationTone from '../../assests/notification_ding.mp3';
import Swal from 'sweetalert2';
import { BASE_URL } from '../../constants';

const PopNotification = () => {
  const [messageCount, setMessageCount] = useState(0);
  const [showPopSms, setShowPopSms] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);
  const userId = localStorage.getItem('CurrentUserId');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/getNotification/${userId}`);
        const newCount = response.data.length;
        console.log('New message count:', response.data);

        // Check if new message count is greater than current count
        if (newCount > messageCount) {
          setMessageCount(newCount);

          response.data.slice(0, 5).forEach(message => {
            showNotification(message);
          });
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    const interval = setInterval(fetchMessages, 2000);

    return () => clearInterval(interval);
  }, [userId, messageCount]);

  const showNotification = (message) => {
    const audio = new Audio(NotificationTone);
    audio.play();

    // Set current message and show the modal
    setCurrentMessage(message);
    setShowPopSms(true);

    // Show SweetAlert2 pop-up
    Swal.fire({
      title: 'New Message Received',
      text: `Message for ${message.
        senderName}: ${message.content}`,
      icon: 'info',
      confirmButtonText: 'OK',
      willClose: () => handleModalClose(message.senderId)
    });
  };

  const handleModalClose = () => {
    axios
      .delete(`${BASE_URL}/api/getNotification/${userId}`)
      .then(() => {
        setShowPopSms(false);
        setCurrentMessage(null);
      })
      .catch((error) => {
        console.error("Error deleting notification:", error);
      });
  };

  return (
    <div>
     
    </div>
  );
};

export default PopNotification;

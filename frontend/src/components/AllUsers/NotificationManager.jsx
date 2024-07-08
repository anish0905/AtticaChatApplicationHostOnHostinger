// NotificationManager.js
import React, { useEffect, useRef } from "react";
import axios from "axios";
import notificationTone from "../../assests/notification_ding.mp3";
import { BASE_URL } from "../../constants";

const NotificationManager = ({ loggedInUserId }) => {
  const notificationSoundRef = useRef(null);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      checkForNewMessages();
    }, 2000);
    return () => clearInterval(intervalId);
  }, []);

  const checkForNewMessages = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/getunreadmessages/${loggedInUserId}`);
      const newMessages = response.data;
      if (newMessages.length > 0) {
        showNotifications(newMessages);
      }
    } catch (error) {
      console.error("Error checking for new messages:", error);
    }
  };

  const showNotifications = (messages) => {
    if (Notification.permission === "granted") {
      messages.forEach((message) => {
        if (message.sender !== loggedInUserId) {
          const notification = new Notification("New Message", {
            body: `${message.sender}: ${message.text}`,
          });
          notification.onclick = () => {
            window.focus();
          };

          // Play notification sound
          playNotificationSound();
        }
      });
    }
  };

  const playNotificationSound = () => {
    if (notificationSoundRef.current) {
      notificationSoundRef.current.play().catch((error) => {
        console.error("Error playing notification sound:", error);
      });
    }
  };

  return <audio ref={notificationSoundRef} src={notificationTone} />;
};

export default NotificationManager;

import React, { useEffect } from 'react';
import Notification_tone from "../../assests/notification_ding.mp3";

const NotificationsComponent = ({ name, text }) => {
  useEffect(() => {
    // Request Notification permission on component mount
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
    if (name && text) {
      showNotification({ name, text });
    }
  }, [name, text]);

  const showNotification = (message) => {
    if (Notification.permission === "granted") {
      const notification = new Notification("New Message", {
        body: `${message.name}: ${message.text}`,
      });
      notification.onclick = () => {
        window.focus();
      };

      // Play notification sound
      playNotificationSound();
    }
  };

  const playNotificationSound = () => {
    const notificationSound = new Audio(Notification_tone);
    notificationSound.play();
  };

  return null;
};

export default NotificationsComponent;

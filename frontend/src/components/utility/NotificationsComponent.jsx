import React, { useEffect } from 'react';
import Notification_tone from "../../assests/notification_ding.mp3";

const NotificationsComponent = ({name,text}) => {
  console.log(name, text);
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

  const showNotifications = (newMessages) => {
    if (Notification.permission === "granted") {
      newMessages.forEach((message) => {
        const notification = new Notification("New Message", {
          body: `${message.employeeId}: ${message.message}`,
        });
        notification.onclick = () => {
          window.focus();
        };
        notifications.push(notification); 

        // Play notification sound
        playNotificationSound();
      });
    }
  };

  const playNotificationSound = () => {
    const notificationSound = new Audio(Notification_tone);
    notificationSound.play();
  };

  // Array to store references to notifications
  let notifications = [];

  const newMessages = [
    { employeeId: name, message: text },
    
  ];

  useEffect(()=>{
    showNotifications(newMessages);
  },[name,text])

  return (
    <div>
      
    </div>
  );
};

export default NotificationsComponent;

import React, { useState, useEffect } from "react";
import axios from "axios";
import Notification_tone from "../../assests/sound.wav";
import { BASE_URL } from "../../constants";

const Notification = () => {
  const [messageCount, setMessageCount] = useState(0);
  const userId = localStorage.getItem("CurrentUserId");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/notifications/${userId}`
        );
        const newCount = response.data.length;

        if (newCount > messageCount) {
          setMessageCount(newCount);

          response.data.forEach((message) => {
            showNotification(message.content, message.recipient);
          });
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [userId, messageCount]);

  const showNotification = (content, recipient) => {
    console.log("Attempting to show notification...");
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification.");
      return;
    }

    if (Notification.permission === "granted") {
      console.log("Showing notification...");
      const notification = new Notification("New Message Received", {
        body: `Message for ${recipient}: ${content.text}`,
      });

      notification.onclick = () => {
        window.focus();
      };

      console.log("Playing notification sound...");
      const audio = new Audio(Notification_tone);
      audio
        .play()
        .then(() => {
          console.log("Sound played successfully.");
        })
        .catch((error) => {
          console.error("Error playing sound:", error);
        });
    } else if (Notification.permission === "default") {
      Notification.requestPermission()
        .then((permission) => {
          if (permission === "granted") {
            showNotification(content, recipient);
          } else {
            console.log("Notification permission denied.");
          }
        })
        .catch((error) => {
          console.error("Error requesting notification permission:", error);
        });
    } else {
      console.log("Notification permission denied or not available.");
    }
  };

  useEffect(() => {
    if (
      Notification.permission === "default" &&
      Notification.requestPermission
    ) {
      Notification.requestPermission()
        .then((permission) => {
          if (permission === "granted") {
            console.log("Notification permission granted.");
          } else if (permission === "denied") {
            console.log("Notification permission denied.");
          }
        })
        .catch((error) => {
          console.error("Error requesting notification permission:", error);
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

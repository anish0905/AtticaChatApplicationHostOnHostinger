import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BASE_URL } from "../../constants";
import Notification_tone from "../../assests/notification_ding.mp3";

const GlobalNotification = () => {
  const [messages, setMessages] = useState([]);
  const [messageCount, setMessageCount] = useState(0);
  const [adminMessages, setAdminMessages] = useState([]);
  const [adminMessageCount, setAdminMessageCount] = useState(0);
  const [lastUserMessageCounts, setLastUserMessageCounts] = useState([]);
  const [currentCountMessage, setCurrentCountMessage] = useState([]);
  const [lastAdminMessageCounts, setLastAdminMessageCounts] = useState([]);
  const [currentAdminCountMessage, setCurrentAdminCountMessage] = useState([]);

  const prevMessageCount = useRef(
    parseInt(localStorage.getItem("prevMessageCount")) || 0
  );
  const prevAdminMessageCount = useRef(
    parseInt(localStorage.getItem("prevAdminMessageCount")) || 0
  );

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/messages/user/${localStorage.getItem(
            "CurrentUserId"
          )}`
        );
        const fetchedMessages = response.data;
        setMessages(fetchedMessages);
        setMessageCount(fetchedMessages.length);

        // Update current message counts
        const updatedCounts = updateMessageCounts(fetchedMessages);
        setCurrentCountMessage(updatedCounts);
        localStorage.setItem(
          "currentCountMessage",
          JSON.stringify(updatedCounts)
        );

        // Initialize last user message counts if not set
        if (!localStorage.getItem("lastUserMessageCounts")) {
          const initialCounts = updatedCounts;
          setLastUserMessageCounts(initialCounts);
          localStorage.setItem(
            "lastUserMessageCounts",
            JSON.stringify(initialCounts)
          );
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    const fetchAdminMessages = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/empadminsender/messages/user/${localStorage.getItem(
            "CurrentUserId"
          )}`
        );
        const fetchedAdminMessages = response.data;
        setAdminMessages(fetchedAdminMessages);
        setAdminMessageCount(fetchedAdminMessages.length);

        // Update current admin message counts
        const adminUpdatedCounts = updateMessageCounts(fetchedAdminMessages);
        setCurrentAdminCountMessage(adminUpdatedCounts);
        localStorage.setItem(
          "currentAdminCountMessage",
          JSON.stringify(adminUpdatedCounts)
        );

        // Initialize last admin message counts if not set
        if (!localStorage.getItem("lastAdminMessageCounts")) {
          const initialAdminCounts = adminUpdatedCounts;
          setLastAdminMessageCounts(initialAdminCounts);
          localStorage.setItem(
            "lastAdminMessageCounts",
            JSON.stringify(initialAdminCounts)
          );
        }
      } catch (error) {
        console.error("Error fetching admin messages:", error);
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
      Notification.requestPermission()
        .then((permission) => {
          if (permission === "granted") {
            console.log("Notification permission granted");
          }
        })
        .catch((error) => {
          console.error("Error requesting notification permission:", error);
        });
    }
  }, []);

  useEffect(() => {
    if (messageCount > prevMessageCount.current) {
      const newMessages = messages.slice(prevMessageCount.current);
      newMessages.forEach((message) => showNotification(message));
      prevMessageCount.current = messageCount;
      localStorage.setItem("prevMessageCount", messageCount.toString());

      // Calculate and store new message counts
      updateAndStoreNewMessageCounts();
    }
  }, [messageCount, messages]);

  useEffect(() => {
    if (adminMessageCount > prevAdminMessageCount.current) {
      const newAdminMessages = adminMessages.slice(
        prevAdminMessageCount.current
      );
      newAdminMessages.forEach((message) => showNotification(message));
      prevAdminMessageCount.current = adminMessageCount;
      localStorage.setItem(
        "prevAdminMessageCount",
        adminMessageCount.toString()
      );

      // Calculate and store new admin message counts
      updateAndStoreNewAdminMessageCounts();
    }
  }, [adminMessageCount, adminMessages]);

  const showNotification = (message) => {
    if (Notification.permission === "granted") {
      const notification = new Notification("New Message", {
        body: `${message.senderName}: ${message.content?.text || ""}`,
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

  const updateMessageCounts = (messages) => {
    const counts = {};
    messages.forEach((message) => {
      counts[message.sender] = (counts[message.sender] || 0) + 1;
    });
    return Object.entries(counts).map(([userId, count]) => ({ userId, count }));
  };

  const updateAndStoreNewMessageCounts = () => {
    const lastCounts =
      JSON.parse(localStorage.getItem("lastUserMessageCounts")) || [];
    const currentCounts =
      JSON.parse(localStorage.getItem("currentCountMessage")) || [];

    const lastCountsMap = new Map(
      lastCounts.map(({ userId, count }) => [userId, count])
    );
    const currentCountsMap = new Map(
      currentCounts.map(({ userId, count }) => [userId, count])
    );

    const newCounts = [];

    currentCountsMap.forEach((count, userId) => {
      const lastCount = lastCountsMap.get(userId) || 0;
      const newCount = count - lastCount;
      newCounts.push({ userId, count: newCount });
    });

    // Ensure all users in lastCounts are included even if they have 0 new messages
    lastCountsMap.forEach((lastCount, userId) => {
      if (!currentCountsMap.has(userId)) {
        newCounts.push({ userId, count: 0 });
      }
    });

    localStorage.setItem("newCountMessage", JSON.stringify(newCounts));
  };

  const updateAndStoreNewAdminMessageCounts = () => {
    const lastAdminCounts =
      JSON.parse(localStorage.getItem("lastAdminMessageCounts")) || [];
    const currentAdminCounts =
      JSON.parse(localStorage.getItem("currentAdminCountMessage")) || [];

    const lastAdminCountsMap = new Map(
      lastAdminCounts.map(({ userId, count }) => [userId, count])
    );
    const currentAdminCountsMap = new Map(
      currentAdminCounts.map(({ userId, count }) => [userId, count])
    );

    const newAdminCounts = [];

    currentAdminCountsMap.forEach((count, userId) => {
      const lastCount = lastAdminCountsMap.get(userId) || 0;
      const newCount = count - lastCount;
      newAdminCounts.push({ userId, count: newCount });
    });

    // Ensure all users in lastAdminCounts are included even if they have 0 new messages
    lastAdminCountsMap.forEach((lastCount, userId) => {
      if (!currentAdminCountsMap.has(userId)) {
        newAdminCounts.push({ userId, count: 0 });
      }
    });

    localStorage.setItem(
      "newAdminCountMessage",
      JSON.stringify(newAdminCounts)
    );
  };

  return (
    <div>
      {/* Example of displaying the message counts
      {lastUserMessageCounts.map(({ userId, count }) => (
        <div key={userId}>
          User {userId} had {count} messages
        </div>
      ))}
      {currentCountMessage.map(({ userId, count }) => (
        <div key={userId}>
          User {userId} has {count} new messages
        </div>
      ))} */}
      {/* {lastAdminMessageCounts.map(({ userId, count }) => (
        <div key={userId}>
          Admin User {userId} had {count} messages
        </div>
      ))}
      {currentAdminCountMessage.map(({ userId, count }) => (
        <div key={userId}>
          Admin User {userId} has {count} new messages
        </div>
      ))} */}
    </div>
  );
};

export default GlobalNotification;

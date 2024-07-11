import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { IoMdDocument, IoMdSend } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";
import notificationTone from "../../assests/notification_ding.mp3";
import { BASE_URL } from "../../constants";

const GroupNotification = () => {
  const [employees, setEmployees] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentUserName, setCurrentUserName] = useState(""); // Assuming the current user is "AMMU BABU"
  const [newMessage, setNewMessage] = useState("");
  const [userGrade, setUserGrade] = useState("");
  const [lastMessageCount, setLastMessageCount] = useState(0); // Track the last count of messages
  const [initialLoad, setInitialLoad] = useState(true); // Track if it's the initial load
  const messagesEndRef = useRef(null);
  const notificationSoundRef = useRef(null);

  // Fetch user details from local storage and set the grade
  useEffect(() => {
    const userDetails = localStorage.getItem("userDetails");
    if (userDetails) {
      const userDetailsObj = JSON.parse(userDetails);
      setUserGrade(userDetailsObj.grade);
      setCurrentUserName(userDetailsObj.name);
    }
  }, []);

  // Fetch employees from the API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/employee/`);
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  // Fetch messages from the API based on the selected employee
  useEffect(() => {
    const currentUserId = localStorage.getItem("CurrentUserId");
    if (employees.length > 0 && currentUserId) {
      const selectedEmployee = employees.find((emp) => emp._id === currentUserId);
      if (selectedEmployee) {
        const fetchMessages = async () => {
          try {
            const response = await axios.get(`${BASE_URL}/api/messages`, {
              params: {
                group: selectedEmployee.group,
                grade: selectedEmployee.grade,
              },
            });
            const newMessages = response.data.messages;

            if (initialLoad) {
              setLastMessageCount(newMessages.length);
              setInitialLoad(false);
            } else {
              const newMessagesCount = newMessages.length - lastMessageCount;
              if (newMessagesCount > 0) {
                const newMessagesToShow = newMessages.slice(-newMessagesCount);
                showNotifications(newMessagesToShow);
                setLastMessageCount(newMessages.length);
              }
            }

            setMessages(newMessages);
          } catch (error) {
            console.error("Error fetching messages:", error);
          }
        };

        fetchMessages();

        // Set up polling for new messages
        const interval = setInterval(fetchMessages, 5000); // Poll every 5 seconds

        return () => clearInterval(interval); // Clean up the interval
      }
    }
  }, [employees, lastMessageCount, initialLoad]);

  // Scroll to the bottom of the messages list
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Request Notification permission on component mount
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const showNotifications = (newMessages) => {
    if (Notification.permission === "granted") {
      newMessages.forEach((message) => {
        if (message.employeeId !== currentUserName) {
          const notification = new Notification("Group", {
            body: `${message.employeeId}: ${message.message}`,
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

  const handleFileDownload = (url) => {
    window.open(url, "_blank");
  };

  const sendMessage = async () => {
    try {
      const currentUserId = localStorage.getItem("CurrentUserId");
      if (!currentUserId) {
        console.error("CurrentUserId not found in localStorage.");
        return;
      }

      const selectedEmployee = employees.find((emp) => emp._id === currentUserId);
      if (!selectedEmployee) {
        console.error("No employee found for current user.");
        return;
      }

      await axios.post(`${BASE_URL}/api/messages`, {
        employeeId: selectedEmployee.name, // Use _id of the employee
        message: newMessage,
        group: selectedEmployee.group,
        grade: selectedEmployee.grade,
      });

      setNewMessage(""); // Clear the input field
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div >
    
      <audio ref={notificationSoundRef} src={notificationTone} />
    </div>
  );
};

export default GroupNotification;

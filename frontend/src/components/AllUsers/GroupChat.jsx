import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { IoMdDocument, IoMdSend } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";
import notificationTone from "../../assests/notification_ding.mp3";
import { BASE_URL } from "../../constants";
import ScrollingNavbar from '../admin/ScrollingNavbar'
import EditModel from "../utility/EditModel";
import ScrollToBottomButton from "../utility/ScrollToBottomButton";

const GroupChat = () => {
    const [employees, setEmployees] = useState([]);
    const [messages, setMessages] = useState([]);
    const [currentUserName, setCurrentUserName] = useState(""); // Assuming the current user is "AMMU BABU"
    const [newMessage, setNewMessage] = useState("");
    const [userGrade, setUserGrade] = useState("");
    const [lastMessageCount, setLastMessageCount] = useState(0); // Track the last count of messages
    const [initialLoad, setInitialLoad] = useState(true); // Track if it's the initial load
    const messagesEndRef = useRef(null);
    const notificationSoundRef = useRef(null);
    const [showImageEditor, setShowImageEditor] = useState(false);
    const [imageForEditing, setImageForEditing] = useState('');


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
                const response = await axios.get(`${BASE_URL}/api/allUser/getAllSoftwareTeam`);
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
                    const notification = new Notification("New Message", {
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
        <div className="flex h-screen lg:w-[95vw] w-full absolute">
            {/* Chat Section */}
            {/* <ScrollingNavbar messages={messages} />  */}
            <div className="flex-1 flex flex-col w-full bg-[#f6f5fb]">
                <div className="lg:text-[#ffffff] lg:bg-[#5443c3] bg-[#ffffff] text-[#5443c3] border border-[#5443c3] lg:text-2xl text-sm p-4 flex gap-2 items-center justify-between lg:mx-2 relative">
                    <IoArrowBack
                        className="mr-2 cursor-pointer lg:text-[#ffffff] text-[#5443c3]"
                        onClick={() => setMessages([])}
                    />
                    {employees.length > 0 && (
                        <>
                            <h2 className="lg:text-2xl text-sm font-bold">Group: {employees[0].group}</h2>
                            <h2 className="lg:text-2xl text-sm font-bold">Grade: {userGrade}</h2>
                        </>
                    )}
                </div>


                <div className="flex flex-col flex-1 px-4 pt-4 overflow-y-auto lg:mb-0">
                    {messages.length > 0 ? (
                        messages.map((msg) => (
                            <div
                                key={msg._id}
                                className={`flex relative break-words whitespace-pre-wrap ${msg.employeeId === currentUserName ? "justify-end" : "justify-start"} mb-2`}
                            >
                                <div
                                    className={`relative lg:text-3xl md:text-xl text-sm font-bold ${msg.employeeId === currentUserName
                                            ? " self-end  bg-[#e1dff3] text-[#5443c3] rounded-tr-3xl rounded-bl-3xl border border-[#5443c3]"
                                            : "self-start bg-white text-[#5443c3] border border-[#5443c3] rounded-br-3xl rounded-tl-3xl"
                                        } py-2 px-4 rounded-lg lg:max-w-4xl max-w-[50%]`}
                                >
                                    {msg.message && (
                                        <p className="text-sm mb-1">
                                            <span className="lg:text-base md:text-lg text-sm font-normal my-5">{msg.employeeId}:<br></br></span> {msg.message}
                                        </p>
                                    )}
                                    {msg.Document && (
                                        <div className="lg:text-8xl md:text-6xl text-4xl my-2">
                                            <button className="focus:outline-none" onClick={() => handleFileDownload(msg.Document)}>
                                                <IoMdDocument />
                                            </button>
                                        </div>
                                    )}
                                    {msg.Image && (
                                        <div className="my-2">
                                            <img src={msg.Image} alt="" className="rounded-lg lg:h-96 lg:w-72 md:h-96 md:w-64 h-40 w-32 my-2" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No messages yet.</p>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className=" bg-[#f6f5fb] shadow-md">
                    <div className="flex items-center p-2 lg:p-4 bg-[#eef2fa] border-t border-gray-200 bottom-0 w-full lg:static">
                        <input
                            type="text"
                            className="flex-grow p-2 border rounded-lg mr-2 border-[#5443c3]"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button
                            className="bg-[#5443c3] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                            onClick={sendMessage}
                            disabled={!newMessage.trim()}
                        >
                            <IoMdSend />
                        </button>
                        <ScrollToBottomButton />
                    </div>
                </div>
            </div>
            <audio ref={notificationSoundRef} src={notificationTone} />
        </div>
    );
};

export default GroupChat;



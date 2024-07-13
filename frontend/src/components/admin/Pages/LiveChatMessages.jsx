import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import { IoMdDocument } from "react-icons/io";
import { BASE_URL } from '../../../constants';

const LiveChatMessages = () => {
  const [liveChatMessages, setLiveChatMessages] = useState([]);
  const adminId = localStorage.getItem("AdminId");
  const bottomRef = useRef(null);

  useEffect(() => {
    const fetchLiveChatMessages = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/messages/last-24-hours`
        );
        console.log("live......",response.data)
        setLiveChatMessages(response.data);
      } catch (error) {
        console.error("Error fetching live chat messages:", error);
      }
    };

    fetchLiveChatMessages();

    // Fetch new messages every 10 seconds
    const interval = setInterval(() => {
      fetchLiveChatMessages();
    }, 10000);

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  useEffect(() => {
    // Scroll to the bottom when messages are updated
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [liveChatMessages]);

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col w-full lg:w-auto">
        <div className="flex flex-col flex-1 lg:bg-[#f6f5fb] lg:border-l lg:border-gray-200 lg:overflow-y-auto">
  
          <h2 className="text-lg font-bold p-4 lg:text-[#ffffff] lg:bg-[#5443c3] text-[#5443c3] bg-[#ffffff] ">
            Live Chat (Last 24 Hours)
          </h2>

          <div className="flex flex-col flex-1 px-4 pt-4 overflow-y-auto">
            {liveChatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex relative break-words whitespace-pre-wrap ${
                  msg.employeeId === adminId ? "justify-end" : "justify-start"
                } mb-2`}
              >
                <div
                  className={`relative lg:text-3xl md:text-xl text-sm font-bold ${
                    msg.employeeId === adminId
                      ? "self-end bg-[#e1dff3] border border-[#5443c3] text-[#5443c3] rounded-tr-3xl rounded-bl-3xl"
                      : "self-start bg-[#ffffff] text-[#5443c3] border border-[#5443c3] rounded-tl-3xl rounded-br-3xl"
                  } py-2 px-4 rounded-lg lg:max-w-2xl max-w-[50%]`}
                >
                  <p className="text-sm font-medium text-red-600 mb-5">Group: {msg.group} -(Grade: {msg.grade})</p>
                  {/* <p className="text-sm font-medium text-red-600 "></p> */}
                  <p className="text-xl font-semibold text-[#5443c3]">
                    {msg.employeeId}
                    <span> : </span>
                  </p>
                  {msg.document && (
                    <div className="lg:text-8xl md:text-6xl text-4xl my-3">
                      <a
                        href={msg.document}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <IoMdDocument />
                      </a>
                    </div>
                  )}
                  {msg.video && (
                    <div className="lg:h-96 lg:w-72 md:h-96 md:w-64 h-40 w-32 text-4xl my-3">
                      <video src={msg.video} controls></video>
                    </div>
                  )}

                  {msg.image && (
                    <div>
                      <img src={msg.image} alt="" className="rounded-lg lg:h-96 lg:w-72 md:h-96 md:w-64 h-40 w-32 my-3" />
                    </div>
                  )}
                  <p className="text-lg ">{msg.messages}</p>
                  <p className="text-xs font-base  text-gray-500 mt-5">
                    {new Date(msg.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} /> {/* Dummy div to help with scrolling */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveChatMessages;

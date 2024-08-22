import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { APP_ID, SERVER_SECRET, BASE_URL } from "../constants";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa"; // Import the icon
import "./style.css";

const AudioCallIng = () => {
  const { id } = useParams();
  const roomID = id;
  const receiverId = id;
  const navigate = useNavigate();

  const name = localStorage.getItem("AdminId");
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  const setName = userDetails?.name || name;
  const userId = localStorage.getItem("CurrentUserId");

  const containerRef = useRef(null);
  const zpRef = useRef(null);
  let link;

  const sendAudioCallRequest = async (senderId, receiverId, roomId, senderName, link) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/audioCall/audio-call/request`, {
        senderId,
        receiverId,
        roomId,
        senderName,
        link,
      });
      return response.data;
    } catch (error) {
      console.error("Error sending audio call request:", error);
      throw error;
    }
  };

  const myMeeting = async (element) => {
    const appID = APP_ID;
    const serverSecret = SERVER_SECRET;
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      Date.now().toString(),
      setName
    );

    link = `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomID=${roomID}`;

    try {
      await sendAudioCallRequest(userId, receiverId, roomID, setName, link);
    } catch (error) {
      console.error("Failed to send audio call request:", error);
    }

    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zpRef.current = zp;

    // Set the ringtone configuration with audio-specific ringtone URLs
    zp.setCallInvitationConfig({
      ringtoneConfig: {
        incomingCallUrl: 'https://example.com/normal-incoming.mp3', // Replace with your incoming ringtone URL
        outgoingCallUrl: 'https://example.com/normal-outgoing.mp3'  // Replace with your outgoing ringtone URL
      }
    });

    zp.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: "copy link",
          url: link,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.AudioCall,  // Use the AudioCall mode for audio-only calls
      },
    });
  };

  const handleBackButtonClick = () => {
    console.log("Back button clicked");
    if (zpRef.current) {
      if (typeof zpRef.current.leaveRoom === "function") {
        zpRef.current.leaveRoom();
      } else if (typeof zpRef.current.destroy === "function") {
        zpRef.current.destroy();
      } else {
        console.warn("No suitable method to leave or destroy the room.");
      }
    }
    navigate(-1);  // Navigate back to the previous page
  };

  useEffect(() => {
    if (containerRef.current) {
      myMeeting(containerRef.current);
    }
  }, [containerRef]);

  return (
    <div>
      <button 
        onClick={handleBackButtonClick}
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: 'blueviolet', // Change color as needed
        }}
      >
        <FaArrowLeft size={24} /> {/* Adjust size as needed */}
      </button>
      <div ref={containerRef}></div>
    </div>
  );
};

export default AudioCallIng;

import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { APP_ID, SERVER_SECRET, BASE_URL } from "../constants";
import axios from "axios";
import "./style.css";

const VideoCallIng = () => {
  const { id } = useParams();
  const roomID = id;
  const receiverId = id; // Assuming the receiverId is the same as the roomID, adjust as needed

  const name = localStorage.getItem("AdminId");
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  const setName = userDetails?.name || name;
  const userId = localStorage.getItem("CurrentUserId");

  const containerRef = useRef(null);

  const sendVideoCallRequest = async (senderId, receiverId, roomId, senderName, link) => {
    console.log("Sending video call");
    try {
      const response = await axios.post(`${BASE_URL}/api/videoCall/video-call/request`, {
        senderId,
        receiverId,
        roomId,
        senderName,
        link,
      });
      return response.data;
    } catch (error) {
      console.error("Error sending video call request:", error);
      throw error;
    }
  };

  const myMeeting = async (element) => {
    // Generate Kit Token
    const appID = APP_ID;
    const serverSecret = SERVER_SECRET;
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      Date.now().toString(),
      setName
    );

    // Create meeting link
    const link =
      `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomID=${roomID}`;

    // Call API to send video call request
    try {
      await sendVideoCallRequest(userId, receiverId, roomID, setName, link);
    } catch (error) {
      console.error("Failed to send video call request:", error);
    }

    // Create instance object from Kit Token
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    // Start the call
    zp.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: "copy link",
          url: link,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
    });
  };

  useEffect(() => {
    if (containerRef.current) {
      myMeeting(containerRef.current);
    }
  }, [containerRef]);

  return <div ref={containerRef}
  className="pt-20"></div>;
};

export default VideoCallIng;

import axios from "axios";
// import { BASE_URL } from "../constants";

// Update with your API BASE_URL URL

// Function to fetch video call requests
export const getVideoCallRequests = async (receiverId) => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  try {
    const response = await axios.get(
      `${BASE_URL}/api/videoCall/video-call/requests/${receiverId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching video call requests:", error);
    throw error;
  }
};

// Function to accept a video call request
export const acceptVideoCall = async (videoCallRequestId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/videoCall/video-call/accept/${videoCallRequestId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error accepting video call:", error);
    throw error;
  }
};

// Function to reject a video call request
export const rejectVideoCall = async (videoCallRequestId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/videoCall/video-call/reject/${videoCallRequestId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error rejecting video call:", error);
    throw error;
  }
};

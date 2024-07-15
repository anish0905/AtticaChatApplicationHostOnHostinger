// src/components/Camera.jsx
import React, { useRef, useEffect, useState } from 'react';
import axios from "axios";
import { BASE_URL } from "../../constants";

const Camera = ({ onCapture, onClose, recipient, loggedInUserId, admin }) => {
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setLoading(false);
      } catch (error) {
        setError('Error accessing camera. Please check your device settings.');
        setLoading(false);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);
  
  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      
      // Draw the current video frame onto the canvas
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to base64 image URL
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      
      // Construct messageData and send immediately
      const messageData = {
        sender: loggedInUserId,
        recipient: recipient,
        camera: imageDataUrl,
      };

      const url = admin === "admin" ? `${BASE_URL}/api/empadminsender/createMessage` : `${BASE_URL}/api/postmessages/`;
      console.log('Sending to URL:', url); // Debugging line to check the URL

      axios
        .post(url, messageData)
        .then((response) => {
          console.log("Message sent successfully:", response.data);
          onClose(); // Close any UI after sending
        })
        .catch((error) => {
          console.error("Error sending message:", error);
        });
    }
  };

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-75">
        <p className="text-white">{error}</p>
        <button onClick={onClose} className="px-4 py-2 mt-4 bg-red-500 text-white rounded-lg">
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-75">
      {loading ? (
        <p className="text-white">Loading camera...</p>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          className="w-full max-w-md rounded-lg"
          aria-label="Camera feed"
        />
      )}
      <div className="mt-4 flex space-x-4">
        <button
          onClick={handleCapture}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          aria-label="Capture image"
        >
          Capture
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
          aria-label="Close camera"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Camera;

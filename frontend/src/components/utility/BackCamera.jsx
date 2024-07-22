import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants';

const BackCamera = ({ onCapture, onClose, recipient, loggedInUserId, admin }) => {
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const stopCurrentStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const startCamera = async () => {
    try {
      setLoading(true);
      stopCurrentStream(); // Cleanup before starting a new stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // Back camera
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setLoading(false);
    } catch (error) {
      console.error('Camera access error:', error);
      setError('Error accessing camera. Please check your device settings.');
      setLoading(false);
    }
  };

  useEffect(() => {
    startCamera();

    return () => {
      stopCurrentStream(); // Cleanup on component unmount
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      
      const messageData = {
        sender: loggedInUserId,
        recipient: recipient,
        camera: imageDataUrl,
      };

      const url = admin === "admin" ? `${BASE_URL}/api/empadminsender/createMessage` : `${BASE_URL}/api/postmessages/`;
      console.log('Sending to URL:', url);

      axios
        .post(url, messageData)
        .then((response) => {
          console.log("Message sent successfully:", response.data);
          stopCurrentStream(); // Ensure the stream is stopped after capture
          onClose();
        })
        .catch((error) => {
          console.error("Error sending message:", error);
        });
    }
  };

  const handleClose = () => {
    stopCurrentStream(); // Ensure the stream is stopped when closing
    onClose();
  };

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-75">
        <p className="text-white lg:text-xl text-xs">{error}</p>
        <button onClick={handleClose} className="px-4 py-2 mt-4 bg-red-500 text-white rounded-lg">
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-75">
      {loading ? (
        <p className="text-white lg:text-xl text-xs">Loading camera...</p>
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
          className="px-4 py-2 bg-blue-500 text-white rounded-lg lg:text-xl text-xs"
          aria-label="Capture image"
        >
          Capture
        </button>
        <button
          onClick={handleClose}
          className="px-4 py-2 bg-red-500 text-white rounded-lg lg:text-xl text-xs"
          aria-label="Close camera"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default BackCamera;

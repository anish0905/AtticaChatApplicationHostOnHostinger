// EditImageModal.js

import React, { useState } from 'react';
import Modal from 'react-modal';
import * as fabric from 'fabric'; // Import fabric.js for drawing capabilities
import axios from 'axios'; // Import axios for file upload
import { BASE_URL } from '../../constants';

Modal.setAppElement('#root'); // Ensure modal is accessible

const EditImageModal = ({ imageFile, onClose, admin,senderName,recipient,sender }) => {
  const [canvas, setCanvas] = useState(null); // State for Fabric.js canvas instance
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to initialize Fabric.js canvas for drawing
  const initFabricCanvas = () => {
    const newCanvas = new fabric.Canvas('canvas', {
      backgroundColor: 'transparent', // Set background color to transparent
    });

    // Load image onto canvas
    fabric.Image.fromURL(URL.createObjectURL(imageFile), (img) => {
      newCanvas.setHeight(img.height);
      newCanvas.setWidth(img.width);
      newCanvas.setBackgroundImage(img, newCanvas.renderAll.bind(newCanvas), {
        scaleX: newCanvas.width / img.width,
        scaleY: newCanvas.height / img.height,
      });
    });

    // Enable free drawing mode
    newCanvas.isDrawingMode = true;

    setCanvas(newCanvas); // Save canvas instance to state
  };

  // Function to save the drawn image and submit to parent component
  const handleSave = async () => {
    if (canvas) {
      const dataURL = canvas.toDataURL();
      const formData = new FormData();
      formData.append('camera', dataURL);
      formData.append('sender', sender);
      formData.append('recipient', recipient);
      formData.append('senderName', senderName);


      setLoading(true);
      setError(null);

      try {
        const url = admin === 'admin' ? `${BASE_URL}/api/empadminsender/createMessage` : `${BASE_URL}/api/postmessages`;
        const response = await axios.post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('File uploaded successfully:', response.data);
      } catch (error) {
        console.error('Error uploading file:', error);
        setError('Error uploading file. Please try again.');
      } finally {
        setLoading(false);
        handleClose(); // Close modal after saving
      }
    }
  };

  // Function to close the modal
  const handleClose = () => {
    onClose();
    if (canvas) {
      canvas.dispose(); // Clean up canvas instance
      setCanvas(null);
    }
  };

  return (
    <Modal isOpen={true} onRequestClose={handleClose} contentLabel="Edit Image Modal">
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          {imageFile && (
            <>
              <canvas id="canvas" className="border-gray-400 border-2 w-full h-96"></canvas>
              <div className="mt-4 flex justify-end">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={initFabricCanvas}
                >
                  Start Drawing
                </button>
                <button
                  className="ml-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  className="ml-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                  onClick={handleClose}
                >
                  Cancel
                </button>
              </div>
              {loading && <p>Loading...</p>}
              {error && <p className="text-red-500">{error}</p>}
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default EditImageModal;

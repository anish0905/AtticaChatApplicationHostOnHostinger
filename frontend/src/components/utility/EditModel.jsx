import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants';

const EditModel = ({ imageUrl, handleModalClose, recipient, admin }) => {
  console.log("imageUrl",imageUrl)
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDone, setIsDone] = useState(false); // New state for tracking if drawing is done
  const [drawnImage, setDrawnImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState('black'); // New state for selected color
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const loggedInUserId = localStorage.getItem("CurrentUserId");
  let name;

 if(!admin){
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    name= userDetails.name
 }
 else{
   name = localStorage.getItem("userAdmin")
 }




  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const img = new Image();
    img.crossOrigin = "anonymous"; // This is the important part
    img.src = imageUrl;
    img.onload = () => {
      const { width, height } = resizeImage(img.width, img.height, window.innerWidth * 0.8, window.innerHeight * 0.6);
      canvas.width = width;
      canvas.height = height;
      context.lineWidth = 2; // Set the line width
      context.strokeStyle = selectedColor; // Set the stroke color
      context.drawImage(img, 0, 0, width, height);
      contextRef.current = context;
    };
  }, [imageUrl, selectedColor]);

  const resizeImage = (srcWidth, srcHeight, maxWidth, maxHeight) => {
    const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    return {
      width: srcWidth * ratio,
      height: srcHeight * ratio
    };
  };

  const startDrawing = (x, y) => {
    if (isDone) return; // Prevent drawing if done
    setIsDrawing(true);
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
  };

  const draw = (x, y) => {
    if (!isDrawing || isDone) return; // Prevent drawing if not in drawing mode or done
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (!isDone) {
      const dataURL = canvasRef.current.toDataURL('image/jpeg', 0.5); // Adjust the quality (0.5 = 50% quality)
      console.log('Drawing stopped, dataURL:', dataURL); // Log the dataURL
      setDrawnImage(dataURL);
    }
  };

  const handleDone = () => {
    setIsDone(true);
    stopDrawing();
  };

  useEffect(() => {
    console.log('drawnImage updated:', drawnImage); // Log updates to drawnImage
  }, [drawnImage]);

  const handleSend = async () => {
    console.log('hi...............');
    console.log(drawnImage);

    if (drawnImage) {
      const messageData = {
        sender: loggedInUserId,
        senderName: name,
        recipient: recipient,
        text: '',
        camera: drawnImage,
        document: null,
        video: null,
      };

      try {
        let response;
        if (admin === 'admin') {
          response = await axios.post(`${BASE_URL}/api/empadminsender/createMessage`, messageData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          handleModalClose();
        } else {
          response = await axios.post(`${BASE_URL}/api/postmessages`, messageData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          handleModalClose();
        }
        console.log('File with location uploaded successfully:', response.data);
      } catch (error) {
        console.error('Error uploading file ', error);
        setError('Error uploading  Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const onClose = () => {
    handleModalClose();
  };

  const handleMouseDown = (e) => {
    startDrawing(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const handleMouseMove = (e) => {
    draw(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    startDrawing(x, y);
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    draw(x, y);
  };

  return (
    <div className="absolute z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-200 shadow-md p-5">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing} // Stop drawing when mouse leaves canvas
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={stopDrawing}
        className="w-full"
      />
      <div className="flex justify-start items-center my-5 gap-5">
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
          className="border border-gray-300 p-1"
        />
        {!isDone && (
          <button onClick={handleDone} className="bg-blue-500 px-2 py-2 font-semibold rounded-md shadow-md text-white">
            Done
          </button>
        )}
        <button onClick={handleSend} className="bg-green-500 px-2 py-2 font-semibold rounded-md shadow-md text-white">
          Send
        </button>
        <button onClick={onClose} className="bg-red-500 px-2 py-2 font-semibold rounded-md shadow-md text-white">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditModel;

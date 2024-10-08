import React, { useState } from "react";
import FrontendCamera from "../utility/FrontendCamera";
import BackCamera from "../utility/BackCamera";
import { FaCamera } from "react-icons/fa";
import { FaCameraRotate } from "react-icons/fa6";
import { useParams } from "react-router-dom";

const Camera = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState("");
  const [onCapture, setOnCapture] = useState(false);
  const [onClose, setOnClose] = useState(false);
  const { recipient } = useParams();

  const admin = "admin"; 
  const loggedInUserId = localStorage.getItem("CurrentUserId");

  const toggleOptions = () => {
    setShowOptions((prevState) => !prevState);
  };

  const handleOptionClick = (camera) => {
    setSelectedCamera(camera);
    setShowOptions(false);
  };

  return (
    <div className="font-semibold text-xl text-black w-50">
      <div className="flex justify-center content-center items-center gap-10 my-5">
        <button onClick={toggleOptions}>
          {showOptions ? "Choose Camera" : "Choose Camera"}
        </button>
      </div>
      {showOptions && (
        <div className="flex justify-center content-center items-center gap-10">
          <FaCamera
            onClick={() => handleOptionClick("frontend")}
            className="text-3xl"
          />
          <FaCameraRotate
            onClick={() => handleOptionClick("back")}
            className="text-4xl"
          />
        </div>
      )}
      {selectedCamera === "frontend" && (
        <FrontendCamera
          onCapture={onCapture}
          onClose={onClose}
          recipient={recipient}
          loggedInUserId={loggedInUserId}
          admin={admin}
        />
      )}
      {selectedCamera === "back" && (
        <BackCamera
          onCapture={onCapture}
          onClose={onClose}
          recipient={recipient}
          loggedInUserId={loggedInUserId}
          admin={admin}
        />
      )}
    </div>
  );
};

export default Camera;

import React from 'react';
import { GoArrowDown } from "react-icons/go";

const ScrollToBottomButton = ({messagesEndRef}) => {
  console.log("messageEndRef",messagesEndRef)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };


  return (
    <div className="fixed bottom-20 right-4 p-4 items-center">
      <button
        onClick={scrollToBottom}
        className=" relative bg-gradient-to-r from-[#5443c3] to-[#3a2d91] hover:from-[#3a2d91] hover:to-[#5443c3] text-white font-bold py-2 px-2 rounded-full inline-flex items-center shadow-lg transform transition-transform hover:scale-105 bottom-10 right-8 lg:bottom-0 lg:right-0"
      >
        <GoArrowDown className="text-2xl" />
      </button>
    </div>
  );
};

export default ScrollToBottomButton;

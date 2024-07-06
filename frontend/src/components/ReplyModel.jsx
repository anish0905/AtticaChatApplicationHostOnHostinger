import axios from 'axios';
import React, { useState } from 'react';
import { BASE_URL } from '../constants';

const ReplyModel = ({ message, sender, recipient, isVisible, onClose,value }) => {
    const [replyMessage, setReplyMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const postReplyMessage = async () => {
        console.log({
            message: replyMessage,
            sender,
            recipient
        });

        setLoading(true);
        try {
           if(value != "Admin"){
            await axios.post(`${BASE_URL}/api/reply`, {
                parentMessageId: message._id,
                sender,
                recipient,
                message: replyMessage,
                text: replyMessage
            });
           }
           else{
            await axios.post(`${BASE_URL}/api/empadminsender/reply`, {
                parentMessageId: message._id,
                sender,
                recipient,
                message: replyMessage,
                text: replyMessage
            });
           }

            setLoading(false);
            onClose();
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    if (!isVisible) return null;

    if(loading ){
        
           return<div className="flex justify-center mt-4 absolute left-1/2 top-1/2">
               <span className="loader"></span>
            </div>
    
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            
            <div className="bg-white border-2 border-[#5443c3] p-6 rounded-lg shadow-lg w-full max-w-xs">
                <h2 className="text-xl font-bold mb-4 text-[#5443c3]">Reply to {message.content.text}</h2>
                <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your reply here..."
                    className="w-full p-2 rounded mb-4 border-2 border-[#5443c3]"
                    disabled={loading}
                />

                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-gray-500 text-white p-2 rounded mr-2"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={postReplyMessage}
                        className="bg-[#5443c3] text-white p-2 rounded"
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send Reply'}
                    </button>
                </div>
                
            </div>
        </div>
    );
};

export default ReplyModel;

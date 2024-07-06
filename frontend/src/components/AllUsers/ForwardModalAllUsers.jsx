import axios from 'axios';
import React, { useState } from 'react';
import { BASE_URL } from '../../constants';

const ForwardModalAllUsers = ({ users, onForward, onCancel, forwardMessage, value }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const sender = localStorage.getItem("CurrentUserId")

  const handleUserSelection = (userId) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(userId)
        ? prevSelectedUsers.filter((id) => id !== userId)
        : [...prevSelectedUsers, userId]
    );
  };

  const handleForward = () => {
    onForward(selectedUsers);
    if (value != "admin") {
      axios
        .post(`${BASE_URL}/api/forward`, {
          messageId: forwardMessage._id,
          newRecipients: selectedUsers,
          sender:sender
        })
        .then((response) => {
          // Handle success response if needed
          console.log('Message forwarded successfully!', response.data);
        })
        .catch((error) => {
          // Handle error if any
          console.error('Error forwarding message:', error);
        });
    } else {
      axios
        .post(`${BASE_URL}/api/empadminsender/forward`, {
          messageId: forwardMessage._id,
          newRecipients: selectedUsers,
        })
        .then((response) => {
          // Handle success response if needed
          console.log('Message forwarded successfully!', response.data);
        })
        .catch((error) => {
          // Handle error if any
          console.error('Error forwarding message:', error);
        });
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg w-full border-2 border-[#5443c3] max-w-xs">
        <h2 className="text-xl mb-4 text-[#5443c3] ">Forward Message To:</h2>
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4 p-2 w-full  rounded border-2 border-[#5443c3]"
        />
        <div className="mb-4 max-h-60 overflow-y-auto">
          {filteredUsers.map((user) => (
            <div key={user._id} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={selectedUsers.includes(user._id)}
                onChange={() => handleUserSelection(user._id)}
              />
              <span className="ml-2 ">{user.name}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded mr-2"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="hover:bg-blue-500 bg-[#5443c3] text-white px-4 py-2 rounded"
            onClick={handleForward}
          >
            Forward
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForwardModalAllUsers;

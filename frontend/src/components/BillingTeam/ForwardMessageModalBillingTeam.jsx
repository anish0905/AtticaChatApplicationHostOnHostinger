import axios from 'axios';
import React, { useState } from 'react';
import { BASE_URL } from '../../constants';

const ForwardMessageModalBillingTeam = ({ users, onForward, onCancel, forwardMessage }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleUserSelection = (userId) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(userId)
        ? prevSelectedUsers.filter((id) => id !== userId)
        : [...prevSelectedUsers, userId]
    );
  };

  const handleForward = () => {
    onForward(selectedUsers);
    axios.post(`${BASE_URL}/api/forward`, {
      messageId: forwardMessage._id,
      newRecipients: selectedUsers
    })
    .then(response => {
      console.log('Message forwarded successfully!', response.data);
      // Optionally close the modal or handle success state
    })
    .catch(error => {
      console.error('Error forwarding message:', error);
      // Handle error state or display error to user
    });
  };

  const filteredUsers = users.filter(user =>
    user.manager_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 ">
      <div className="bg-white p-4 rounded shadow-lg w-full max-w-xs border-2 border-[#5443c3]">
        <h2 className="text-xl mb-4 text-[#5443c3]">Forward Message To:</h2>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4 p-2  rounded w-full border-2 border-[#5443c3]"
        />
        <div className="mb-4 max-h-48 overflow-y-auto">
          {filteredUsers.map((user) => (
            <div key={user._id} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={selectedUsers.includes(user._id)}
                onChange={() => handleUserSelection(user._id)}
              />
              <span className="ml-2">{user.manager_name}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded mr-2"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className={`hover:bg-blue-500 bg-[#5443c3] text-white px-4 py-2 rounded ${selectedUsers.length === 0 ? 'cursor-not-allowed' : ''}`}
            onClick={handleForward}
            disabled={selectedUsers.length === 0} // Disable button if no users selected
          >
            Forward
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForwardMessageModalBillingTeam;

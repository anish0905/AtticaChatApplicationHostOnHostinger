import React, { useState, useEffect } from "react";

const UpdateModel = ({ show, onClose, accountTeam, onUpdate,value }) => {
  const [formData, setFormData] = useState({ ...accountTeam });
  const [groupFields, setGroupFields] = useState(accountTeam.group || []);

  useEffect(() => {
    setFormData({ ...accountTeam });
    setGroupFields(accountTeam.group || []);
  }, [accountTeam]);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleGroupChange = (index, e) => {
    const { name, value } = e.target;
    const updatedGroups = groupFields.map((group, idx) =>
      idx === index ? { ...group, [name]: value } : group
    );
    setGroupFields(updatedGroups);
  };

  const handleAddGroup = () => {
    setGroupFields([...groupFields, { name: "", grade: "" }]);
  };

  const handleRemoveGroup = (index) => {
    const updatedGroups = groupFields.filter((_, idx) => idx !== index);
    setGroupFields(updatedGroups);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ ...formData, group: groupFields });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit {value}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Group</label>
            {groupFields.map((group, index) => (
              <div key={index} className="mb-2">
                <input
                  type="text"
                  name="name"
                  placeholder="Group Name"
                  value={group.name}
                  onChange={(e) => handleGroupChange(index, e)}
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  name="grade"
                  placeholder="Group Grade"
                  value={group.grade}
                  onChange={(e) => handleGroupChange(index, e)}
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveGroup(index)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddGroup}
              className="text-blue-500 text-sm"
            >
              Add Group
            </button>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateModel;

import React, { useEffect, useState } from "react";

import 'react-toastify/dist/ReactToastify.css';



export const Modal = ({ show, onClose, manager, onUpdate }) => {
    const [formData, setFormData] = useState({ ...manager });
  
    useEffect(() => {
      setFormData({ ...manager });
    }, [manager]);
  
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
      const newGroups = formData.group.map((group, idx) => 
        idx === index ? { ...group, [name]: value } : group
      );
      setFormData({
        ...formData,
        group: newGroups,
      });
    };
  
    const handleAddGroup = () => {
      setFormData({
        ...formData,
        group: [...formData.group, { name: "", grade: "" }],
      });
    };
  
    const handleUpdate = () => {
      onUpdate(formData);
      onClose();
      
    };
  
    return (
      <div className="fixed inset-0 z-50 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-full overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4 text-[#5443c3]">Edit Manager Details</h2>
          <form>
            {[
              { label: "Manager ID", name: "manager_Id", type: "text" },
              { label: "Manager Name", name: "manager_name", type: "text" },
              { label: "Manager Email", name: "manager_email", type: "email" },
              { label: "Manager Password", name: "manager_password", type: "password" },
              { label: "Manager Phone", name: "manager_phone", type: "text" },
              { label: "Manager Address", name: "manager_address", type: "text" },
              { label: "Branch City", name: "branch_city", type: "text" },
              { label: "Branch State", name: "branch_state", type: "text" },
              { label: "Branch Pincode", name: "branch_pincode", type: "text" },
              { label: "Branch Name", name: "branch_name", type: "text" },
              { label: "Branch Address", name: "branch_address", type: "text" },
            ].map((field, index) => (
              <div className="mb-4" key={index}>
                <label
                  className="block text-[#5443c3] text-sm font-bold mb-2"
                  htmlFor={field.name}
                >
                  {field.label}
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={formData[field.name]}
                  onChange={handleChange}
                />
              </div>
            ))}
            {formData?.group?.map((group, index) => (
              <div key={index} className="mb-4">
                <label className="block text-[#5443c3] text-sm font-bold mb-2">
                  Group {index + 1}
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2"
                  name="name"
                  placeholder="Group Name"
                  value={group.name}
                  onChange={(e) => handleGroupChange(index, e)}
                />
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  name="grade"
                  placeholder="Group Grade"
                  value={group.grade}
                  onChange={(e) => handleGroupChange(index, e)}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddGroup}
              className="bg-[#5443c3] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
            >
              Add Group
            </button>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleUpdate}
                className="mr-2 bg-[#5443c3] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Update
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
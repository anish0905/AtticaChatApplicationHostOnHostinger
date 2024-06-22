import React, { useEffect, useState } from "react";

const Modal = ({ show, onClose, manager, onUpdate }) => {
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

  const handleUpdate = () => {
    onUpdate(formData);
    onClose();
    window.location.reload(); // Refresh page after update (if needed)
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className=" text-2xl font-bold mb-4 text-[#5443c3] py-6 text-center">Edit Manager Details</h2>
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
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

export default Modal;





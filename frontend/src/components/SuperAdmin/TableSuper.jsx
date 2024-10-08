import React, { useState, useEffect } from 'react';
import GoogleMapsuper from "./GoogleMapsuper";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BASE_URL } from '../../constants';

const TableSuper = () => {
  const [manager, setManager] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [location, setLocation] = useState([]);
  const [showMap, setShowMap] = useState(false); 
  const [selectedDate, setSelectedDate] = useState(new Date()); // State for selected date

  useEffect(() => {
    const fetchAllManagers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/manager/getAllManagers`);
        if (response.ok) {
          const data = await response.json();
          setManager(data);
        } else {
          console.error('Failed to fetch AllManagers');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchAllManagers();
  }, []);
  
  const openModal = async (id, date) => {
    try {
      const formattedDate = date.toISOString().split('T')[0]; // Format the date to YYYY-MM-DD
      const response = await fetch(`${BASE_URL}/api/location/get-managerlocation/${id}/${formattedDate}`);
      if (response.ok) {
        const data = await response.json();
        if (data.locations.length > 0) {
          setLocation(data.locations);
          setSelectedManager(id);
          setShowMap(true);
        } else {
          console.error('No locations found for the selected date');
          setLocation([]);
        }
      } else {
        console.error('Failed to fetch location');
        setLocation([]);
      }
    } catch (error) {
      console.error('Error:', error);
      setLocation([]);
    }
  };

  return (
    <div className='flex flex-wrap w-full'>
      <div className="p-4 rounded-lg shadow-lg overflow-auto border border-purple-900 w-full ">
        <div className="lg:text-xl md:text-xl text-sm font-bold mb-4 text-[#5443c3]">Branch Manager Details</div>
        <table className="min-w-full bg-white border lg:text-xl md:text-xl text-sm">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b bg-[#5443c3] text-white">Manager Id</th>
              <th className="py-2 px-4 border-b bg-[#5443c3] text-white">Name</th>
              <th className="py-2 px-4 border-b bg-[#5443c3] text-white">Emp Mail ID</th>
              <th className="py-2 px-4 border-b bg-[#5443c3] text-white">Mobile No</th>
              <th className="py-2 px-4 border-b bg-[#5443c3] text-white">Branch</th>
              <th className="py-2 px-4 border-b bg-[#5443c3] text-white">Branch Address</th>
              <th className="py-2 px-4 border-b bg-[#5443c3] text-white">Manager Address</th>
              <th className="py-2 px-4 border-b bg-[#5443c3] text-white">State</th>
              <th className="py-2 px-4 border-b bg-[#5443c3] text-white">City</th>
              <th className="py-2 px-4 border-b bg-[#5443c3] text-white">Pincode</th>
              <th className="py-2 px-4 border-b bg-[#5443c3] text-white">Location</th>
              <th className="py-2 px-4 border-b bg-[#5443c3] text-white">Select Date</th>
            </tr>
          </thead>
          <tbody className="min-w-full bg-white border lg:text-lg md:text-lg text-sm">
            {manager.map((item, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b text-[#5443c3]">{item._id}</td>
                <td className="py-2 px-4 border-b text-[#5443c3]">{item.manager_name}</td>
                <td className="py-2 px-4 border-b text-[#5443c3]">{item.manager_email}</td>
                <td className="py-2 px-4 border-b text-[#5443c3]">{item.manager_phone}</td>
                <td className="py-2 px-4 border-b text-[#5443c3]">{item.branch_name}</td>
                <td className="py-2 px-4 border-b text-[#5443c3]">{item.branch_address}</td>
                <td className="py-2 px-4 border-b text-[#5443c3]">{item.manager_address}</td>
                <td className="py-2 px-4 border-b text-[#5443c3]">{item.branch_state}</td>
                <td className="py-2 px-4 border-b text-[#5443c3]">{item.branch_city}</td>
                <td className="py-2 px-4 border-b text-[#5443c3]">{item.branch_pincode}</td>
                <td
                  className="py-2 px-4 border-b text-decoration-line: underline"
                  style={{ color: 'blue', cursor: 'pointer' }}
                  onClick={() => openModal(item._id, selectedDate)}
                >
                  Click here
                </td>
                <td className="py-2 px-4 border-b">
                  <DatePicker 
                    selected={selectedDate} 
                    onChange={(date) => setSelectedDate(date)} 
                    dateFormat="yyyy-MM-dd"
                     className="border rounded px-2 py-1"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showMap && location.length > 0 && (
        <div className="w-full p-4">
          <GoogleMapsuper locations={location} onClose={() => setShowMap(false)} className="w-full"/>
        </div>
      )}
    </div>
  );
};

export default TableSuper;

import React, { useState, useEffect } from 'react';
import GoogleMapsuper from './GoogleMapsuper';
import { BASE_URL } from '../../constants';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './TETable.css'; // Assuming you have a CSS file for custom styles

const TETable = () => {
  const [TE, setTE] = useState([]);
  const [selectedTE, setSelectedTE] = useState(null);
  const [location, setLocation] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [locationNotFound, setLocationNotFound] = useState(false);

  useEffect(() => {
    const fetchAllTE = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/allUser/getAllTE`);
        if (response.ok) {
          const data = await response.json();
          setTE(data);
        } else {
          console.error('Failed to fetch All TE');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchAllTE();
  }, []);

  const openModal = async (id) => {
    await fetchLocations(id, selectedDate);
  };

  const fetchLocations = async (id, date) => {
    try {
      const response = await fetch(`${BASE_URL}/api/location/get-location/${id || selectedTE}/${date}`);
      if (response.ok) {
        const data = await response.json();
        if (data.dateLocation.locations.length > 0) {
          setLocation(data.dateLocation.locations);
          setShowMap(true);
          setLocationNotFound(false);
        } else {
          setLocation([]);
          setShowMap(false);
          setLocationNotFound(true);
        }
      } else {
        console.error('Failed to fetch location');
        setLocation([]);
        setLocationNotFound(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setLocation([]);
      setLocationNotFound(true);
    }
  };

  return (
    <div className="flex flex-wrap w-full">
      <div className="p-4 rounded-lg shadow-lg overflow-auto border border-purple-900 w-full ">
        <div className="lg:text-xl md:text-xl text-sm font-bold mb-4 text-[#5443c3]">Branch TE Details</div>
        <table className="min-w-full bg-white border lg:text-xl md:text-xl text-sm">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b bg-[#5443c3] text-white">TE Id</th>
              <th className="py-2 px-4 border-b bg-[#5443c3] text-white">Name</th>
              <th className="py-2 px-4 border-b bg-[#5443c3] text-white">Emp Mail ID</th>
              <th className="py-2 px-4 border-b bg-[#5443c3] text-white">Location</th>
              <th className="py-2 px-4 border-b bg-[#5443c3] text-white">Select Date</th>
            </tr>
          </thead>
          <tbody className="min-w-full bg-white border lg:text-lg md:text-lg text-sm">
            {TE.map((item, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b text-[#5443c3]">{item._id}</td>
                <td className="py-2 px-4 border-b text-[#5443c3]">{item.name}</td>
                <td className="py-2 px-4 border-b text-[#5443c3]">{item.email}</td>
                <td
                 className="py-2 px-4 border-b text-decoration-line: underline"
                 style={{ color: 'blue', cursor: 'pointer' }}
                  onClick={() => openModal(item._id)}
                >
                  Click here
                </td>
                <td className="py-2 px-4 border-b">
                  <DatePicker 
                    selected={new Date(selectedDate)} 
                    onChange={(date) => setSelectedDate(date.toISOString().split('T')[0])} 
                    dateFormat="yyyy-MM-dd"
                    className="border rounded px-2 py-1"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showMap && (
        <div className="w-full  p-4">
          {location.length > 0 ? (
            <GoogleMapsuper locations={location} onClose={() => setShowMap(false)} className="w-full" />
          ) : (
            <div className="text-red-600 font-semibold">No locations found for the selected date.</div>
          )}
        </div>
      )}
      
    </div>
  );
};

export default TETable;

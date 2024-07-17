import React, { useState, useEffect } from 'react';
import GoogleMapsuper from "./GoogleMapsuper";
import { BASE_URL } from '../../constants';

const TETable = () => {
  const [TE, setTE] = useState([]);
  const [selectedTE, setSelectedTE] = useState(null);
  const [location, setLocation] = useState([]);
  const [showMap, setShowMap] = useState(false); // State to control the visibility of the map
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Default to today's date
  const [locationNotFound, setLocationNotFound] = useState(false); // State to manage location not found message

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
    try {
      const response = await fetch(`${BASE_URL}/api/location/get-location/${id}/${selectedDate}`);
      if (response.ok) {
        const data = await response.json();
        if (data.dateLocation.locations.length > 0) {
          setLocation(data.dateLocation.locations);
          setSelectedTE(id);
          setShowMap(true);
          setLocationNotFound(false); // Reset location not found state
        } else {
          setLocation([]); // Clear any previous location data
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

  const fetchLocations = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/location/get-location/${selectedTE}/${selectedDate}`);
      if (response.ok) {
        const data = await response.json();
        if (data.dateLocation.locations.length > 0) {
          setLocation(data.dateLocation.locations);
          setShowMap(true);
          setLocationNotFound(false); // Reset location not found state
        } else {
          setLocation([]); // Clear any previous location data
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
    <div className='flex flex-wrap w-full'>
      <div className="p-4 rounded-lg shadow-lg overflow-auto border border-purple-900 w-full lg:w-1/2">
        <div className="text-xl font-bold mb-4 text-[#5443c3]">Branch TE Details</div>
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b bg-[#5443c3] text-white">TE Id</th>
              <th className="py-2 px-4 border-b bg-[#5443c3] text-white">Name</th>
              <th className="py-2 px-4 border-b bg-[#5443c3] text-white">Emp Mail ID</th>
              <th className="py-2 px-4 border-b bg-[#5443c3] text-white">Location</th>
            </tr>
          </thead>
          <tbody>
            {TE.map((item, index) => (
              <tr key={index}>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showMap && (
        <div className="w-full lg:w-1/2 p-4">
          <div className="mb-4">
            <label htmlFor="datePicker" className="text-lg font-semibold text-[#5443c3]">Select Date:</label>
            <input
              type="date"
              id="datePicker"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="ml-2 p-1 border border-gray-300 rounded-md"
            />
            <button
              onClick={fetchLocations}
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              Fetch Locations
            </button>
          </div>
          {location.length > 0 ? (
            <GoogleMapsuper locations={location} onClose={() => setShowMap(false)} className="w-full"/>
          ) : (
            <div className="text-red-600 font-semibold">No locations found for the selected date.</div>
          )}
        </div>
      )}
      {/* {locationNotFound && (
        <div className="w-full lg:w-1/2 p-4">
          <div className="text-red-600 font-semibold">No locations found for the selected date.</div>
        </div>
      )} */}
    </div>
  );
};

export default TETable;

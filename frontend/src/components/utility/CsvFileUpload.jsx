import React, { useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../../constants';

const BATCH_SIZE = 1;

const CSVFileUpload = ({ endpoint }) => {
  const [error, setError] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const data = results.data;
        await processBatches(data);
      },
      error: (error) => {
        console.error("Error parsing CSV file:", error);
        setError("Error parsing CSV file");
      }
    });
  };

  const processBatches = async (data) => {
    const token = localStorage.getItem('AdminId');
    const totalBatches = Math.ceil(data.length / BATCH_SIZE);
    
    for (let i = 0; i < totalBatches; i++) {
      const batch = data.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE);
      console.log("batch:", batch);
      
      try {
        await Promise.all(
          batch.map(async (row) => {
            try {
              await axios.post(`${BASE_URL}${endpoint}`, row, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
            } catch (error) {
              console.log(`An error occurred with row:`, row, error);
              toast.error(`Error registering user with email: ${row.email || 'unknown'}`);
            }
          })
        );
        toast.success(`Batch ${i + 1} of ${totalBatches} registered successfully!`);
      } catch (error) {
        console.log(`An error occurred during registering batch ${i + 1}`, error);
        setError(`An error occurred during registering batch ${i + 1}`);
        break;
      }
    }
  };

  return (
    <>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="bg-[#5443c3] hover:bg-blue-700 text-white font-bold py-1  rounded-full h-10 ml-2 mt-4 lg:mt-0"
      />
      <ToastContainer />
    </>
  );
};

export default CSVFileUpload;

import React, { useEffect, useRef, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import './ScrollingNavbar.css';
import fetchAnnounce from '../utility/fetchAnnounce'; // Import the CSS file

function ScrollingNavbar() {
  const { route } = useParams();
  const recentMessageRef = useRef(null);
  const [announcements,setAnnouncements] = useState([])

  useEffect(() => {
    recentMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [announcements]);

  const lastMessage = announcements.length > 0 ? announcements[announcements.length - 1] : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAnnounce();
        setAnnouncements(data); 
  
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };

    fetchData(); // Fetch immediately on component mount

    const intervalId = setInterval(fetchData, 10000); // Fetch every 5 seconds

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0   z-10">
      
       

        <div className="flex-1 flex justify-center items-center">
          <div className="scrolling-container overflow-hidden h-10 flex items-center lg:rounded-2xl lg:w-[80vw] w-[80%]">
            <div className="scrolling-content flex items-center">
              {lastMessage && (
                <span
                  ref={recentMessageRef}
                  className="inline-block bg-yellow-300 text-[#5443c3] rounded-full px-4 py-2 lg:mx-2 font-bold"
                >
                  {lastMessage.content && lastMessage.content.text}
                </span>
              )}
            </div>
      
        </div>

       
      </div>
    </div>
  );
}

export default ScrollingNavbar;














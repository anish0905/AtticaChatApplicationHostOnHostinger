import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ScrollingNavbar.css';
import fetchAnnounce from '../utility/fetchAnnounce';

function ScrollingNavbar() {
  const { route } = useParams();
  const recentMessageRef = useRef(null);
  const [announcements, setAnnouncements] = useState([]);
  const [contentWidth, setContentWidth] = useState(0);
  const containerRef = useRef(null);

  const colors = ['bg-orange-300', 'bg-yellow-300', 'bg-green-300', 'bg-blue-300', 'bg-red-300'];

  useEffect(() => {
    recentMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [announcements]);

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

    const intervalId = setInterval(fetchData, 1000); // Fetch every 5 seconds

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      setContentWidth(containerRef.current.offsetWidth);
    }
  }, [containerRef, announcements]);

  return (
    <div className="fixed top-0 left-0 right-0 bg-[#5443c3] z-10">
      <div className="flex-1 flex justify-center items-center">
        <h1 className="text-white items-center text-lg lg:text-2xl font-bold">Announcement</h1>
        <div ref={containerRef} className="scrolling-container overflow-hidden h-10 flex items-center lg:rounded-2xl lg:w-[80vw] w-[80%]">
          <div
            className="scrolling-content flex items-center"
            style={{
              width: `${contentWidth}px`,
              animation: `scroll ${Math.max(contentWidth / 100, 20)}s linear infinite`,
            }}
          >
            {announcements.map((announcement, index) => {
              const colorClass = colors[index % colors.length];
              return (
                <span
                  key={index}
                  ref={index === announcements.length - 1 ? recentMessageRef : null}
                  className={`inline-block ${colorClass} text-[#5443c3] rounded-full px-4 py-2 lg:mx-2 font-bold`}
                >
                  {announcement.content && announcement.content.text}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScrollingNavbar;

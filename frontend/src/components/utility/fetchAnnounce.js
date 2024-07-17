import axios from 'axios';
import { BASE_URL } from '../../constants';

const fetchAnnounce = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/announce/getAllAnnounce/`);
    
    // Filter announcements for today's date
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    const todaysAnnouncements = response.data.filter(announce => {
      return announce.createdAt.startsWith(currentDate);
    });
    
    return todaysAnnouncements;
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};

export default fetchAnnounce;

import { useState, useEffect } from 'react';
import axios from 'axios';
import Main from './main';
import Sidebar from './sidebar';
import Header from './header';
import {Link, useNavigate} from 'react-router-dom';

function App() {
  
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState({});

  async function getStatistics() {
    const storedUserToken = sessionStorage.getItem('userToken');

    if (!storedUserToken) {
      // Token does not exist, navigate to login page or perform any desired action
      // window.location.href = '/login'; // Redirect to login page
      // return;
      navigate()
    }

    try {
      const res = await axios.get('http://127.0.0.1:5000/get_sentiment', {
        headers: {
          Authorization: `Bearer ${storedUserToken}`,
        },
      });

      setStatistics(res.data);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    getStatistics();
  }, []);

  return (
    <div className="min-h-screen flex">
      <div className="w-1/4">
        <Sidebar totalData={statistics.total_data} keywords={statistics.queries} />
      </div>
      <div className="w-3/4">
        <Header />
        <Main />
      </div>
    </div>
  );
}

export default App;

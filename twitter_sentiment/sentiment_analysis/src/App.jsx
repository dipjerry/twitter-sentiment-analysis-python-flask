import { useState , useEffect } from 'react'
import './App.css'
import axios from 'axios'
import Main from './component/main'
import Sidebar from './component/sidebar'
import Header from './component/header'

function App() {
const [statistics, setStatistics] = useState({});
async function getStatistics()
{
  const res = await axios.get(`http://127.0.0.1:5000/get_sentiment`);
  // console.log("res");
  // console.log(res);

  setStatistics(res.data) 
}

useEffect(() => {
    getStatistics(); 
}, [])

  const [count, setCount] = useState(0)
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
  )
}

export default App

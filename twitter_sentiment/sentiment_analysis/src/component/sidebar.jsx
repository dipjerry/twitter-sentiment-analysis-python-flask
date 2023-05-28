import React from 'react';

const Sidebar = ({ totalData, keywords }) => {
  
  // console.log(keywords)
  console.log("🚀 ~ file: sidebar.jsx:6 ~ Sidebar ~ keywords:", keywords)
  return (
    <div className="sidebar bg-gray-800 text-gray-100 w-64">
      <div className="p-4">
        <h2 className="text-xl font-bold">Sentiment Analysis</h2>
      </div>
      <nav className="mt-6">
        <ul className="space-y-2">
          <li className="px-4 py-2 hover:bg-gray-700 rounded">
            <label className="block cursor-pointer">Total Data</label>
            <a href="#" className="block">{totalData}</a>
          </li>
          <li className="px-4 py-2 hover:bg-gray-700 rounded">
          <label className="block cursor-pointer">Recent Data</label>
            {keywords?
          Object.keys(keywords).map((query, index) => (
        <a href='#' key={index}>
        <div key={index}>
          <p>{query}: {keywords[query]}</p>
        </div>
        </a>
      )):null}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

import React from 'react';
import {Link, useNavigate} from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Clear the token from client-side storage
    sessionStorage.removeItem('userToken');
    navigate('/');
  };
  return (
    <header className="bg-gray-800 p-8">
    <div className="container mx-auto flex items-center justify-between">
      <h1 className="text-xl font-bold text-white"></h1>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <a href="#" className="text-white hover:text-gray-400">Home</a>
          </li>
          <li>
            <a href="#" className="text-white hover:text-gray-400">About</a>
          </li>
          <li>
            <a href="#" className="text-white hover:text-gray-400">Services</a>
          </li>
          <li>
            <a href="#" className="text-white hover:text-gray-400">Contact</a>
          </li>
          <li onClick={handleLogout}>
            <span className="text-white hover:text-gray-400">logout</span>
          </li>
        </ul>
      </nav>
    </div>
  </header>
  
  );
};

export default Header;

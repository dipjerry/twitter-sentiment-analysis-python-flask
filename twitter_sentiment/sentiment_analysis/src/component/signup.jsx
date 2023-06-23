// import React from 'react';
import { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
const Signup = () => {
  const navigate = useNavigate();
  // console.log(keywords)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Create an object with the form data
    const formData = {
      email: email,
      password: password
    };

    // Make the API request using Axios
    axios.post('http://localhost:5000/signup', formData)
      .then(response => {
        // Handle the response here
        console.log(response.data);
        // Reset the form fields
        setEmail('');
        setPassword('');
        if(response.data.code===200)
        {
            navigate('/signin')
        }
      })
      .catch(error => {
        // Handle any error that occurred during the request
        console.error(error);
      });
  };
  return (
<section className="min-h-screen flex flex-col">
        
            <div className="flex flex-1 items-center justify-center">
                <div className="rounded-lg sm:border-2 px-4 lg:px-24 py-16 lg:max-w-xl sm:max-w-md w-full text-center">
                <form className="text-center" onSubmit={handleSubmit}>
      <h1 className="font-bold tracking-wider text-3xl mb-8 w-full text-gray-600">
        Sign Up
      </h1>
      <div className="py-2 text-left">
        <input
          type="email"
          className="bg-gray-200 border-2 text-black border-gray-100 focus:outline-none bg-gray-100 block w-full py-2 px-4 rounded-lg focus:border-gray-700"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="py-2 text-left">
        <input
          type="password"
          className="bg-gray-200 border-2 border-gray-100 text-black focus:outline-none bg-gray-100 block w-full py-2 px-4 rounded-lg focus:border-gray-700"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="py-2">
        <button
          type="submit"
          className="border-2 border-gray-100 focus:outline-none bg-purple-600 text-white font-bold tracking-wider block w-full p-2 rounded-lg focus:border-gray-700 hover:bg-purple-700"
        >
          Sign Up
        </button>
      </div>
    </form>
                    {/* <div className="text-center">
                        <a href="#" className="hover:underline">Forgot password?</a>
                    </div> */}
                    <div className="text-center mt-12">
                        <span>
                            Already a user ?
                        </span>
                        <span onClick={()=>navigate('/')} className="font-light text-md text-indigo-600 underline font-semibold hover:text-indigo-800">Login</span>
                    </div>
                </div>
            </div>
        </section>

);
};

export default Signup;

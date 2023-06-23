// import React from 'react';
import { useState } from 'react';
    import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
const Signin = () => {
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
    axios.post('http://localhost:5000/login', formData)
      .then(response => {
        // Handle the response here
        console.log(response.data);
        // Reset the form fields
        setEmail('');
        setPassword('');
        if(response.data.code===200)
        { 
          sessionStorage.setItem("userToken", response.data.token);
            navigate('/dashboard')
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
        Sign in
      </h1>
      <div className="py-2 text-left">
        <input
          type="email"
          className="bg-gray-200 border-2 border-gray-100 focus:outline-none text-black bg-gray-100 block w-full py-2 px-4 rounded-lg focus:border-gray-700"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="py-2 text-left">
        <input
          type="password"
          className="bg-gray-200 border-2 border-gray-100 focus:outline-none text-black bg-gray-100 block w-full py-2 px-4 rounded-lg focus:border-gray-700"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="py-2">
        <button
          type="submit"
          className="border-2 border-gray-100 focus:outline-none bg-purple-600 text-white font-bold tracking-wider block w-full p-2 rounded-lg focus:border-gray-700 hover:bg-purple-700"
        >
          Sign In
        </button>
      </div>
    </form>
                    {/* <div className="text-center">
                        <a href="#" className="hover:underline">Forgot password?</a>
                    </div> */}
                    <div className="text-center mt-12"  >
                        <span>
                            Dont have an account?
                        </span>
                        <span onClick={()=>navigate('./signup')} className="font-light text-md text-indigo-600 underline font-semibold hover:text-indigo-800">Create One</span>
                    </div>
                </div>
            </div>
        </section>

);
};

export default Signin;

// Login.js (React component)

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { BASE_URL } from '../../constants';
import img21 from "../../assests/img21.png";
import logo from "../../assests/logo.png";
import back1 from  "../../assests/back1.png";

const ManagerLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate()
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${BASE_URL}/api/manager/login`, { manager_email:email, manager_password:password });
            console.log(response.data);
            localStorage.setItem("CurrentUserId",response.data.id)
            localStorage.setItem("token",response.data.accessToken)
            localStorage.setItem("email",email)
            navigate("/managerChat")
            // Handle successful login (e.g., redirect to dashboard)
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    return (

        <div className="flex items-center justify-center min-h-screen bg-cover bg-center p-4 sm:p-6 lg:p-8 " 
        style={{ backgroundImage: `url(${back1})` }}
        >
            <div className="flex flex-col lg:flex-row items-center justify-center w-full max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8">
                <img
            src={img21}
            alt="Babusir"
            className="object-cover w-full max-w-md h-auto rounded-full"
          />
           </div>





               <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
               <div className="text-center mb-6">
               <img
              src={logo}
              alt="Chatvia Logo"
              className="mx-auto mb-4 w-48 h-16 sm:w-72 sm:h-32"
            />
            <h2 className="text-2xl font-semibold">Manager Login</h2>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
               </div>



<div className="w-full max-w-md">
 <form  onSubmit={handleLogin}>
                    <input type="hidden" name="remember" defaultValue="true" />
                    <div>
                        <div className="mb-4">
                            <label htmlFor="email-address"  className="block w-full mt-2 p-2 ">Email address</label>
                            <input id="email-address" name="email" type="email" autoComplete="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block w-full mt-2 p-2 ">Password</label>
                            <input id="password" name="password" type="password" autoComplete="current-password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                    </div>

                    <div>
                        <button type="submit" className="w-full bg-purple-500 text-white p-2 rounded hover:bg-[#7269ef]">
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                {/* Heroicon name: lock-closed */}
                                {/* <svg className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    <path fillRule="evenodd" d="M4 8V7a5 5 0 0110 0v1h2a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1v-8a1 1 0 011-1h2zm3-1v1h4V7a3 3 0 00-6 0z" clipRule="evenodd" />
                                </svg> */}
                            </span>
                            Sign in
                        </button>
                    </div>
                </form>
                </div>
                   <div className="text-center mt-6 text-gray-600 text-sm">
            <p>
              © 2024 attic's ChatApp Crafted with{" "}
              <span className="text-red-500">❤</span> by attica gold
            </p>
          </div>
                
               </div>
            </div>
        </div>
    );
};

export default ManagerLogin;

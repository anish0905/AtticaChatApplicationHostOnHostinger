

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../../assests/logo.png";
import babusirr from "../../assests/babusirr.png";
import back4 from "../../assests/back4.png";
import { BASE_URL } from "../../constants";

const HrLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState()

  const handleemailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${BASE_URL}/api/allUser/Hr/login`,
        { email, password }
      );
      setLoading(false);
      localStorage.setItem("token", response.data.accessToken);
      console.log("response.data   ", response.data);
      //localStorage.setItem('EmployeeId', response.data._id);
      localStorage.setItem("CurrentUserId", response.data._id);

      fetchUserDetails(response.data._id);
      navigate("/HrToHrChat");
    } catch (err) {
      setLoading(false);
      console.error("Error:", err);
      setError(err.response?.data?.message || "Login failed");
    }
  };


  const fetchUserDetails = async (userId) => {
    try {
      const resp = await axios.get(`${BASE_URL}/api/allUser/getbyId/${userId}`);
      setUserDetails(resp.data);
      
      localStorage.setItem("userDetails",JSON.stringify(resp.data))
    } catch (error) {
      console.error("Fetch User Details Error:", error);
      // Handle error gracefully, set userDetails to null or {}
    }
  };

  

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-[#f7f7ff]"
      style={{ backgroundImage: `url(${back4})` }}
    >
      <div className="flex flex-col lg:flex-row items-center justify-center lg:space-x-6 space-y-6 lg:space-y-0 w-full max-w-5xl p-4">
        <div className="hidden lg:block lg:w-1/2">
          <img
            src={babusirr}
            alt="Babusir"
            className="object-cover h-full w-full rounded-full shadow-lg "
          />
        </div>
        <div className="flex flex-col items-center justify-center lg:w-1/2 p-8 bg-white rounded-lg shadow-lg">
          <div className="text-center mb-6">
            <img
              src={logo}
              alt="Chatvia Logo"
              className="mx-auto mb-4 w-72 h-32"
            />
            <h2 className="text-2xl font-semibold">Hr Sign in</h2>
            <p className="text-gray-600">
              Sign in to continue with Attica Chat Portal.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="block w-full mt-2 p-2 border border-gray-300 rounded"
                placeholder="Enter your Employee Code"
                value={email}
                onChange={handleemailChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="block w-full mt-2 p-2 border border-gray-300 rounded"
                placeholder="********"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-purple-500 text-white p-2 rounded hover:bg-[#7269ef]"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <div className="text-center mt-6 text-gray-600 text-sm">
            <p>
              © 2024 attica. Crafted with{" "}
              <span className="text-red-500">❤</span> by attica gold
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default  HrLogin;

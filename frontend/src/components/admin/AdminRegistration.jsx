import React, { useState } from 'react';
import logo from '../../assests/logo.png';

const departments = [
  "Admin",
  "Employee",       
  "Manager",
  "Billing_Team",
  "Accountant",
  "Software",
  "HR",
  "CallCenter",
  "VirtualTeam",
  "MonitoringTeam",
  "Bouncers/Driver",
  "Security/CCTV",
  "Digital Marketing",
  "TE",
  "Logistic",
  "Cashier"
];

const AdminRegistration = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [department, setDepartment] = useState('');

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);
  const handleDepartmentChange = (e) => setDepartment(e.target.value);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f6f6f4]">
      <div className="text-center mb-6">
        <img src={logo} alt="Chatvia Logo" className="mx-auto mb-4" />
        <h2 className="text-2xl font-semibold">Sign in</h2>
        <p className="text-gray-600 mt-5">Sign in to continue with Attica Chat Portal.</p>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-4">
        <form>
          <div className="mb-4"> 
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className="block w-full mt-2 p-2 border border-gray-300 rounded"
              placeholder="Enter your Email"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div className="mb-4"> 
            <label htmlFor="department" className="block text-gray-700">Department</label>
            <select
              id="department"
              className="block w-full mt-2 p-2 border border-gray-300 rounded"
              value={department}
              onChange={handleDepartmentChange}
            >
              <option value="" disabled>Select your department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              className="block w-full mt-2 p-2 border border-gray-300 rounded"
              placeholder="********"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-700">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="block w-full mt-2 p-2 border border-gray-300 rounded"
              placeholder="********"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-[#93c5fd]">Register</button>
        </form>
        <div className="text-center mt-6 text-gray-600 text-sm">
          <p>© 2024 attica. Crafted with <span className="text-red-500">❤</span> by attica gold</p>
        </div>
      </div>
    </div>
  );
};

export default AdminRegistration;

import React, { useState } from "react";
import logo from "../../assets/CHEESEBALL 1.png";
import { Link } from "react-router-dom";
export default function CheeseBallLogin() {
  const [email, setEmail] = useState("creativeomtayo@gmail.co");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login attempted with:", email);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Status Bar */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center px-6 pt-12">
        {/* Logo */}
        <img
          src={logo}
          alt="CheeseBall Logo"
          // className="w-24 h-24 mb-6"
        />

        {/* Form */}
        <form onSubmit={handleLogin} className="w-full max-w-sm mt-30">
          {/* Email Field */}
          <div className="mb-6">
            <label className="block op text-blue-600 text-sm font-bold mb-2">
              Email/Username
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 op border-blue-600 rounded-lg focus:outline-none focus:border-blue-700 text-gray-700"
              placeholder="creativeomtayo@gmail.co"
            />
          </div>

          {/* Password Field */}
          <div className="mb-8">
            <label className="block op text-gray-400 text-sm font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 op bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-blue-600 text-gray-700"
              placeholder="Enter your password"
            />
          </div>
          <Link to="/admin-dashboard">
            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-md"
            >
              Login
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}

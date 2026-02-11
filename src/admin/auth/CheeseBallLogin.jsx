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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-blue-100 p-8 sm:p-12">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <img
            src={logo}
            alt="CheeseBall Logo"
            className="w-full max-w-[240px]"
          />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center op">
          Admin Access
        </h2>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block op text-gray-700 text-sm font-bold mb-2 ml-1">
              Email/Username
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl focus:outline-none transition-all text-gray-700 op"
              placeholder="admin@cheeseball.com"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block op text-gray-700 text-sm font-bold mb-2 ml-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl focus:outline-none transition-all text-gray-700 op"
              placeholder="••••••••"
            />
          </div>

          <Link to="/admin-dashboard" className="block pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl shadow-lg shadow-blue-200 transition-all hover:scale-[1.02] active:scale-[0.98] op"
            >
              Login to Dashboard
            </button>
          </Link>
        </form>

        <div className="mt-12 text-center text-gray-400 text-sm">
          <p>Protected by industrial grade encryption</p>
        </div>
      </div>
    </div>
  );
}

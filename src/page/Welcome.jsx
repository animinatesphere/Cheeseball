import React from "react";
import logo from "../assets/CHEESEBALL 1.png";
import { Link } from "react-router-dom";
const Welcome = () => {
  return (
    <>
      {/* container */}
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-blue-50 page-container slide-in justify-center items-center py-12">
        <div className="max-w-2xl w-full bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-2xl shadow-blue-100 flex flex-col items-center">
          <img src={logo} alt="Cheeseball Logo" className="w-full max-w-[300px] mb-12" />

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-12 op">
            Log in as
          </h2>

          <div className="w-full space-y-4">
            <Link to="/auth" className="block w-full">
              <button className="w-full bg-[#0063BF] hover:bg-blue-700 text-white py-5 rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer op">
                User
              </button>
            </Link>
            
            <Link to="/admin-login" className="block w-full">
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-[#0063BF] py-5 rounded-2xl font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer op border-2 border-transparent hover:border-blue-100">
                Admin
              </button>
            </Link>
          </div>

          <p className="mt-12 text-gray-400 text-sm font-medium">
            Secure • Fast • Reliable
          </p>
        </div>
      </div>
      {/* end of container */}
    </>
  );
};

export default Welcome;

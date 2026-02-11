import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const linkClass = ({ isActive }) =>
    `font-black text-sm uppercase tracking-widest transition-all ${
      isActive ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
    }`;

  return (
    <div className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex justify-between items-center">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
             <div className="w-4 h-4 sm:w-5 sm:h-5 border-[3px] sm:border-4 border-white rounded-full"></div>
          </div>
          <h2 className="font-black text-xl sm:text-2xl tracking-tighter text-gray-900">Cheeseball</h2>
        </div>
        <div className="hidden sm:flex items-center space-x-10">
          <NavLink to="/currency-change" className={linkClass}>
            Rates
          </NavLink>
          <NavLink to="/buy-crypto" className={linkClass}>
            Trade
          </NavLink>
          <NavLink to="/seamless-crypto" className={linkClass}>
            Swap
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

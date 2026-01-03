import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const linkClass = ({ isActive }) =>
    isActive ? "text-blue-600 font-bold" : "text-gray-600 hover:text-blue-600";

  return (
    <div className="bg-white shadow-sm p-4">
      <div className="max-w-4xl mx-auto flex justify-between items-center page-container">
        <h2 className="font-bold text-xl">Cheeseball</h2>
        <div className="flex items-center space-x-4">
          <NavLink to="/currency-change" className={linkClass}>
            Rates
          </NavLink>
          <NavLink to="/buy-crypto" className={linkClass}>
            Buy
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

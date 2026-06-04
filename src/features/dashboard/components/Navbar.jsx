import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, Bell } from "lucide-react";
import { useNotifications } from "@/services/useNotifications";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { unreadCount } = useNotifications();
  const linkClass = ({ isActive }) =>
    `font-black text-sm uppercase tracking-widest transition-all ${
      isActive ? "text-blue-600" : "text-slate-500 hover:text-gray-600"
    }`;

  return (
    <div className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex justify-between items-center">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center text-slate-900 shadow-lg shadow-blue-200">
            <div className="w-4 h-4 sm:w-5 sm:h-5 border-[3px] sm:border-4 border-white rounded-full"></div>
          </div>
          <h2 className="font-black text-xl sm:text-2xl tracking-tighter text-gray-900">
            Cheeseball
          </h2>
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
          <NavLink to="/dashboard/notifications" className="relative">
            <button className="p-2 rounded-md hover:bg-gray-100 relative">
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          </NavLink>
        </div>
        <div className="sm:hidden flex items-center gap-2">
          <NavLink to="/dashboard/notifications" className="relative">
            <button className="p-2 rounded-md hover:bg-gray-100 relative">
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          </NavLink>
          <button
            onClick={() => setOpen((v) => !v)}
            className="p-2 rounded-md bg-white/0 hover:bg-gray-100"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="sm:hidden bg-white border-t border-gray-100">
          <div className="px-4 pb-4 pt-2 flex flex-col gap-2">
            <NavLink
              to="/currency-change"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              Rates
            </NavLink>
            <NavLink
              to="/buy-crypto"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              Trade
            </NavLink>
            <NavLink
              to="/seamless-crypto"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              Swap
            </NavLink>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;

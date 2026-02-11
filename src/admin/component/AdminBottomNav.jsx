import React from "react";
import { TrendingUp, RefreshCw, FileText, User, LayoutGrid } from "lucide-react";

const AdminBottomNav = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "dashboard", label: "Home", icon: LayoutGrid },
    { id: "rate", label: "Rates", icon: TrendingUp },
    { id: "orders", label: "Orders", icon: RefreshCw },
    { id: "history", label: "History", icon: FileText },
    { id: "account", label: "Account", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
      <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-[2rem] flex justify-around items-end h-20 px-2 sm:px-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all relative pb-2 group ${
                isActive ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {isActive && (
                <div className="absolute top-0 w-12 h-1 bg-blue-600 rounded-full animate-fade-in" />
              )}
              <div className={`p-2 rounded-xl transition-all ${isActive ? "bg-blue-50" : "group-hover:bg-gray-50"}`}>
                <Icon className={`w-6 h-6 ${isActive ? "stroke-[2.5px]" : "stroke-[2px]"}`} />
              </div>
              <span className={`text-[10px] sm:text-xs font-black uppercase tracking-widest mt-1 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-all`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AdminBottomNav;

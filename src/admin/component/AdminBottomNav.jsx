import React from "react";
import { TrendingUp, RefreshCw, FileText, User, LayoutGrid, Ticket } from "lucide-react";
import { useTheme } from "../../context/ThemeProvider";

const AdminBottomNav = ({ activeTab, onTabChange }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const tabs = [
    { id: "dashboard", label: "Master", icon: LayoutGrid },
    { id: "rate", label: "Market", icon: TrendingUp },
    { id: "orders", label: "Trades", icon: RefreshCw },
    { id: "history", label: "Audit", icon: FileText },
    { id: "promos", label: "Nodes", icon: Ticket },
    { id: "account", label: "Root", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] px-4 pb-6 sm:px-8 sm:pb-8 flex justify-center pointer-events-none">
      <div
        className="max-w-3xl w-full rounded-[2.5rem] flex items-center h-20 sm:h-24 px-4 sm:px-10 pointer-events-auto relative overflow-hidden ring-1"
        style={{
          background: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(30px) saturate(180%)',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          boxShadow: isDark 
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 1px 0 rgba(255,255,255,0.05)' 
            : '0 25px 50px -12px rgba(0, 0, 0, 0.1), inset 0 1px 1px 0 rgba(255,255,255,1)',
          ringColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all relative group ${
                isActive
                  ? "text-blue-500"
                  : isDark ? "text-slate-500" : "text-slate-400"
              }`}
            >
              {isActive && (
                <div className="absolute top-0 w-10 h-1 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
              )}
              
              <div className={`p-3 rounded-2xl transition-all duration-300 ${
                isActive
                  ? "bg-blue-500/10 scale-110"
                  : "group-hover:bg-slate-500/5 group-hover:scale-105"
              }`}>
                <Icon className={`w-6 h-6 transition-all ${isActive ? "stroke-[2.5px]" : "stroke-[1.5px] group-hover:stroke-[2px]"}`} />
              </div>
              
              <span className={`text-[9px] font-black uppercase tracking-[0.2em] mt-1 transition-all duration-300 ${
                isActive 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-2 group-hover:opacity-60 group-hover:translate-y-0 text-[8px]"
              }`}>
                {tab.label}
              </span>

              {isActive && (
                 <div className="absolute -bottom-1 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AdminBottomNav;

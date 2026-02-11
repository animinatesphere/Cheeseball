import React from "react";
import { Wallet, Users, Bell, MessageCircle, ChevronRight } from "lucide-react";

const AccountHome = ({ onNavigate }) => {
  const menuItems = [
    { id: "income", label: "Income Stream", icon: Wallet, color: "text-blue-600", bg: "bg-blue-50" },
    { id: "admins", label: "Admin Hierarchy", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { id: "notification", label: "Global Alerts", icon: Bell, color: "text-blue-600", bg: "bg-blue-50" },
    { id: "support", label: "Concierge Support", icon: MessageCircle, color: "text-blue-600", bg: "bg-blue-50" },
  ];

  return (
    <div className="flex-1 overflow-y-auto pb-32 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="py-8 sm:py-12">
          <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight mb-8">Account</h1>

          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-100 mb-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 transform group-hover:scale-110 transition-transform duration-700"></div>
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Creative Omotayo</h2>
                <p className="text-blue-100 font-bold mt-1">creativeomotayo@gmail.com</p>
              </div>
              <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-full border border-white/20">
                System Administrator
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className="bg-white border-2 border-gray-50 rounded-3xl p-6 sm:p-8 flex items-center justify-between hover:border-blue-100 hover:shadow-2xl transition-all group active:scale-[0.98]"
                >
                  <div className="flex items-center gap-5">
                    <div className={`${item.bg} ${item.color} p-4 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-lg shadow-blue-50/50`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-black text-gray-900 text-lg">{item.label}</span>
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountHome;

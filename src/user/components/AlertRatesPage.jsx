import React, { useState } from "react";
import { ChevronLeft, Bell, Search, ArrowRight } from "lucide-react";

const AlertRatesPage = ({ onNavigate, onBack }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const alerts = [
    { id: 1, from: { amount: "0.5", currency: "BTC", icon: "₿", color: "bg-orange-500" }, to: { amount: "44000", currency: "USDT", icon: "T", color: "bg-teal-500" } },
    { id: 2, from: { amount: "0.5", currency: "BTC", icon: "₿", color: "bg-orange-500" }, to: { amount: "44000", currency: "USDT", icon: "T", color: "bg-teal-500" } },
    { id: 3, from: { amount: "0.5", currency: "BTC", icon: "₿", color: "bg-orange-500" }, to: { amount: "44000", currency: "USDT", icon: "T", color: "bg-teal-500" } },
    { id: 4, from: { amount: "0.5", currency: "BTC", icon: "₿", color: "bg-orange-500" }, to: { amount: "44000", currency: "USDT", icon: "T", color: "bg-teal-500" } },
  ];

  return (
    <div className="min-h-screen bg-white pb-32">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex justify-between items-center mb-8">
            <button onClick={onBack} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10">
              <ChevronLeft size={24} />
            </button>
            <button className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10 relative">
              <Bell size={24} />
              <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-blue-700"></span>
            </button>
          </div>
          <h1 className="text-4xl font-black mb-2 tracking-tight">Price Alerts</h1>
          <p className="text-blue-200 font-medium">Get notified when rates hit your target</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8">
        <div className="bg-white rounded-[2rem] shadow-xl p-8 lg:p-12 border border-gray-100 flex flex-col gap-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="bg-gray-100 rounded-[1.5rem] p-1.5 flex w-full md:w-96">
              <button
                onClick={() => setActiveTab("all")}
                className={`flex-1 py-3 rounded-[1.2rem] font-black tracking-tight transition-all ${
                  activeTab === "all" ? "bg-white text-blue-600 shadow-lg shadow-blue-50" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                All Currencies
              </button>
              <button
                onClick={() => setActiveTab("favorites")}
                className={`flex-1 py-3 rounded-[1.2rem] font-black tracking-tight transition-all ${
                  activeTab === "favorites" ? "bg-white text-blue-600 shadow-lg shadow-blue-50" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Favorites
              </button>
            </div>

            <div className="relative flex-1 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={24} />
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-8 py-5 bg-gray-50 border-2 border-transparent focus:border-blue-100 rounded-[1.5rem] font-bold text-gray-900 placeholder-gray-300 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="group bg-white rounded-[2rem] p-8 border border-gray-100 hover:border-blue-200 hover:shadow-2xl transition-all flex items-center justify-between gap-6"
              >
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 ${alert.from.color} rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg`}>
                    {alert.from.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Alert threshold</p>
                    <p className="text-xl font-black text-gray-900">{alert.from.amount} <span className="text-gray-400">{alert.from.currency}</span></p>
                  </div>
                </div>

                <div className="flex-1 flex justify-center">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:translate-x-1 transition-transform">
                    <ArrowRight size={24} strokeWidth={3} />
                  </div>
                </div>

                <div className="flex items-center gap-6 text-right">
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Target Price</p>
                    <p className="text-xl font-black text-gray-900">{alert.to.amount} <span className="text-gray-400">{alert.to.currency}</span></p>
                  </div>
                  <div className={`w-14 h-14 ${alert.to.color} rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg`}>
                    {alert.to.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertRatesPage;

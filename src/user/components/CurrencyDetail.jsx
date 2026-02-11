import React from "react";
import { ArrowLeft, Bell, Star } from "lucide-react";

const CurrencyDetail = ({ currency, onBack, onExchange }) => {
  return (
    <div className="min-h-screen bg-white animate-fade-in pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center py-8">
          <button
            onClick={onBack}
            className="p-4 hover:bg-gray-50 rounded-2xl transition-all border border-gray-100 shadow-sm"
          >
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <div className="flex space-x-3">
            <button className="p-4 hover:bg-gray-50 rounded-2xl transition-all border border-gray-100 shadow-sm">
              <Bell className="w-6 h-6 text-gray-900" />
            </button>
            <button className="p-4 hover:bg-gray-50 rounded-2xl transition-all border border-gray-100 shadow-sm">
              <Star className="w-6 h-6 text-[#0063BF]" fill="currentColor" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-12">
          <div className="text-center lg:text-left">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl mb-8 flex items-center justify-center text-5xl shadow-2xl shadow-orange-100 animate-bounce-in mx-auto lg:mx-0">
              {currency?.icon || "₿"}
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-2 uppercase tracking-tighter">
              {currency?.fullName || "BITCOIN"}
              <span className="ml-4 text-gray-300 tracking-tight">{currency?.name || "BTC"}</span>
            </h1>
            <div className="flex flex-col lg:flex-row lg:items-end gap-2 lg:gap-6 mb-12">
              <h2 className="text-6xl sm:text-7xl font-black text-gray-900 tracking-tighter">
                {currency?.price || "$86,244.91"}
              </h2>
              <p className={`text-2xl font-black mb-2 ${currency?.positive !== false ? 'text-green-500' : 'text-red-500'}`}>
                {currency?.change || "-2.95%"}
              </p>
            </div>
            
            <button
              onClick={onExchange}
              className="w-full sm:w-auto px-12 bg-[#0063BF] hover:bg-blue-700 text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl shadow-blue-200 transform hover:-translate-y-1 transition-all flex items-center justify-center space-x-4"
            >
              <span>Instant Swap</span>
              <svg
                className="w-7 h-7"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </button>
          </div>

          <div className="bg-gray-50 rounded-[3rem] p-8 lg:p-12 border border-gray-100">
            <h3 className="text-xl font-black text-gray-900 mb-8 uppercase tracking-wider text-sm">Market Performance</h3>
            <div className="space-y-6">
              {[
                { label: "Market Cap", value: "$1.7T", color: "text-blue-600" },
                { label: "24h Volume", value: "$35.2B", color: "text-green-600" },
                { label: "Circulating Supply", value: "19.6M BTC", color: "text-orange-600" },
                { label: "All Time High", value: "$93,450.12", color: "text-gray-900" },
              ].map((stat, i) => (
                <div key={i} className="flex justify-between items-center py-4 border-b border-gray-200 last:border-0">
                  <span className="text-gray-500 font-bold">{stat.label}</span>
                  <span className={`font-black text-lg ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyDetail;

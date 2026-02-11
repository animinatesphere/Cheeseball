import React, { useState } from "react";
import {
  Bell,
  TrendingUp,
  TrendingDown,
  Search,
  ShoppingCart,
  Clock,
  User,
} from "lucide-react";

const CurrencyRates = ({ onSelectCurrency, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const currencies = [
    { id: 1, name: "AAVE", fullName: "Aave", price: "$69.7100", change: "+2.24%", positive: true, icon: "🔷" },
    { id: 2, name: "AAVE", fullName: "Aave", price: "$69.7100", change: "+2.24%", positive: true, icon: "🔴" },
    { id: 3, name: "BTC", fullName: "Bitcoin", price: "$86,244.91", change: "-2.95%", positive: false, icon: "₿" },
    { id: 4, name: "BNB", fullName: "Binance", price: "$69.7100", change: "+2.24%", positive: true, icon: "🟡" },
    { id: 5, name: "DOGE", fullName: "Dogecoin", price: "$69.7100", change: "-2.24%", positive: false, icon: "🐕" },
    { id: 6, name: "ETH", fullName: "Ethereum", price: "$69.7100", change: "+2.24%", positive: true, icon: "◆" },
    { id: 7, name: "LTC", fullName: "Litecoin", price: "$69.7100", change: "+2.24%", positive: true, icon: "Ł" },
    { id: 8, name: "SOL", fullName: "Solana", price: "$69.7100", change: "-2.24%", positive: false, icon: "◎" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-4xl font-black tracking-tight">Market Rates</h1>
              <p className="text-blue-200 font-medium">Real-time cryptocurrency insights</p>
            </div>
            <button
              onClick={() => onNavigate("alert-rates")}
              className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10"
            >
              <Bell className="w-6 h-6" />
            </button>
          </div>
          <div className="relative max-w-2xl">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-blue-300 w-6 h-6" />
            <input
              type="text"
              placeholder="Search for currency..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-5 rounded-[2rem] bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all text-lg"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8">
        <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-xl p-1.5 flex border border-gray-100 mb-8 sm:mb-12 max-w-md">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 py-3 sm:py-4 rounded-[1.2rem] sm:rounded-[1.5rem] font-bold transition-all text-sm sm:text-base ${
              activeTab === "all"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            All Market
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`flex-1 py-3 sm:py-4 rounded-[1.2rem] sm:rounded-[1.5rem] font-bold transition-all text-sm sm:text-base ${
              activeTab === "favorites"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            Favorites
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 pb-24">
          {currencies.map((currency) => (
            <div
              key={currency.id}
              onClick={() => onSelectCurrency(currency)}
              className="bg-white rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-6 border border-gray-100 shadow-sm hover:shadow-2xl hover:border-blue-100 transition-all cursor-pointer group"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl group-hover:scale-110 transition-transform">
                    {currency.icon}
                  </div>
                  <div className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider ${
                    currency.positive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                  }`}>
                    {currency.change}
                  </div>
                </div>
                
                <div className="mb-6 sm:mb-8">
                  <h3 className="font-black text-xl sm:text-2xl text-gray-900 group-hover:text-blue-600 transition-colors">
                    {currency.name}
                  </h3>
                  <p className="text-gray-400 font-bold text-xs sm:text-sm tracking-wide">{currency.fullName}</p>
                </div>

                <div className="mt-auto flex items-end justify-between">
                  <div>
                    <p className="text-gray-400 text-[10px] font-black uppercase mb-1">Price</p>
                    <p className="font-black text-lg sm:text-xl text-gray-900 leading-none">
                      {currency.price}
                    </p>
                  </div>
                  <div className="w-16 h-8 sm:w-20 sm:h-10 opacity-30 group-hover:opacity-100 transition-opacity">
                    {currency.positive ? (
                      <TrendingUp className="w-full h-full text-green-500" />
                    ) : (
                      <TrendingDown className="w-full h-full text-red-500" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CurrencyRates;

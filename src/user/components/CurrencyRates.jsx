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
    {
      id: 1,
      name: "AAVE",
      fullName: "Aave",
      price: "$69.7100",
      change: "+2.24%",
      positive: true,
      icon: "🔷",
    },
    {
      id: 2,
      name: "AAVE",
      fullName: "Aave",
      price: "$69.7100",
      change: "+2.24%",
      positive: true,
      icon: "🔴",
    },
    {
      id: 3,
      name: "BTC",
      fullName: "Bitcoin",
      price: "$86,244.91",
      change: "-2.95%",
      positive: false,
      icon: "₿",
    },
    {
      id: 4,
      name: "BNB",
      fullName: "Binance",
      price: "$69.7100",
      change: "+2.24%",
      positive: true,
      icon: "🟡",
    },
    {
      id: 5,
      name: "DOGE",
      fullName: "Dogecoin",
      price: "$69.7100",
      change: "-2.24%",
      positive: false,
      icon: "🐕",
    },
    {
      id: 6,
      name: "ETH",
      fullName: "Ethereum",
      price: "$69.7100",
      change: "+2.24%",
      positive: true,
      icon: "◆",
    },
    {
      id: 7,
      name: "LTC",
      fullName: "Litecoin",
      price: "$69.7100",
      change: "+2.24%",
      positive: true,
      icon: "Ł",
    },
    {
      id: 8,
      name: "SOL",
      fullName: "Solana",
      price: "$69.7100",
      change: "-2.24%",
      positive: false,
      icon: "◎",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Currency rates</h1>
            <button
              onClick={() => onNavigate("alert-rates")}
              className="p-2 hover:bg-white/20 rounded-full transition-all"
            >
              <Bell className="w-6 h-6" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for currency"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/95 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-6">
        <div className="bg-white rounded-xl shadow-sm p-1 flex">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "all"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            All Currencies
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "favorites"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Favorite Currencies
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-6 pb-24">
        <div className="space-y-3">
          {currencies.map((currency) => (
            <div
              key={currency.id}
              onClick={() => onSelectCurrency(currency)}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-2xl">
                    {currency.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">
                      {currency.name}
                    </h3>
                    <p className="text-gray-500 text-sm">{currency.fullName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-12">
                    {currency.positive ? (
                      <TrendingUp className="w-full h-full text-green-500" />
                    ) : (
                      <TrendingDown className="w-full h-full text-red-500" />
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-gray-800">
                      {currency.price}
                    </p>
                    <p
                      className={`text-sm font-semibold ${
                        currency.positive ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {currency.change}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="max-w-4xl mx-auto px-6 py-3">
          <div className="flex justify-around">
            <button
              onClick={() => onNavigate("rates")}
              className="flex flex-col items-center space-y-1 text-blue-600"
            >
              <TrendingUp className="w-6 h-6" />
              <span className="text-xs font-semibold">Rate</span>
            </button>
            <button
              onClick={() => onNavigate("buy")}
              className="flex flex-col items-center space-y-1 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="text-xs font-semibold">Buy</span>
            </button>
            <button
              onClick={() => onNavigate("history")}
              className="flex flex-col items-center space-y-1 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <Clock className="w-6 h-6" />
              <span className="text-xs font-semibold">History</span>
            </button>
            <button
              onClick={() => onNavigate("support")}
              className="flex flex-col items-center space-y-1 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <User className="w-6 h-6" />
              <span className="text-xs font-semibold">Support</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyRates;

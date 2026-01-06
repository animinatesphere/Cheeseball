import React, { useState } from "react";
import { ChevronLeft, Bell, Search, ArrowRight } from "lucide-react";

const AlertRatesPage = ({ onNavigate, onBack }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const alerts = [
    {
      id: 1,
      from: {
        amount: "0.5",
        currency: "BTC",
        icon: "₿",
        color: "bg-orange-500",
      },
      to: {
        amount: "44000",
        currency: "USDT",
        icon: "T",
        color: "bg-teal-500",
      },
    },
    {
      id: 2,
      from: {
        amount: "0.5",
        currency: "BTC",
        icon: "₿",
        color: "bg-orange-500",
      },
      to: {
        amount: "44000",
        currency: "USDT",
        icon: "T",
        color: "bg-teal-500",
      },
    },
    {
      id: 3,
      from: {
        amount: "0.5",
        currency: "BTC",
        icon: "₿",
        color: "bg-orange-500",
      },
      to: {
        amount: "44000",
        currency: "USDT",
        icon: "T",
        color: "bg-teal-500",
      },
    },
    {
      id: 4,
      from: {
        amount: "0.5",
        currency: "BTC",
        icon: "₿",
        color: "bg-orange-500",
      },
      to: {
        amount: "44000",
        currency: "USDT",
        icon: "T",
        color: "bg-teal-500",
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={onBack} className="mr-4">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-semibold">Alert rates</h1>
        </div>
        <button className="p-2 bg-white/20 rounded-lg">
          <Bell size={20} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-4 pt-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Type a currency or ticker"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-4">
        <div className="bg-white rounded-lg p-1 flex shadow-sm">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "all"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600"
            }`}
          >
            All Currencies
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "favorites"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600"
            }`}
          >
            Favorite Currencies
          </button>
        </div>
      </div>

      {/* Alert List */}
      <div className="px-4 pt-4 space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between"
          >
            {/* From Currency */}
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 ${alert.from.color} rounded-full flex items-center justify-center text-white font-bold text-lg`}
              >
                {alert.from.icon}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {alert.from.amount} {alert.from.currency}
                </p>
              </div>
            </div>

            {/* Arrow */}
            <div className="px-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <ArrowRight className="text-blue-600" size={20} />
              </div>
            </div>

            {/* To Currency */}
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 ${alert.to.color} rounded-full flex items-center justify-center text-white font-bold text-lg`}
              >
                {alert.to.icon}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {alert.to.amount} {alert.to.currency}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="max-w-4xl mx-auto px-6 py-3">
          <div className="flex justify-around">
            <button
              onClick={() => onNavigate("rates")}
              className="flex flex-col items-center space-y-1 text-blue-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
              <span className="text-xs font-semibold">Rate</span>
            </button>

            <button
              onClick={() => onNavigate("buy")}
              className="flex flex-col items-center space-y-1 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="text-xs font-semibold">Buy</span>
            </button>

            <button
              onClick={() => onNavigate("history")}
              className="flex flex-col items-center space-y-1 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="text-xs font-semibold">History</span>
            </button>

            <button
              onClick={() => onNavigate("support")}
              className="flex flex-col items-center space-y-1 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="text-xs font-semibold">Support</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertRatesPage;

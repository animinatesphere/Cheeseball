import React from "react";
import { ArrowLeft, Bell, Star } from "lucide-react";

const CurrencyDetail = ({ currency, onBack, onExchange }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 shadow-sm flex justify-between items-center">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <Bell className="w-6 h-6" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <Star className="w-6 h-6 text-blue-600" fill="currentColor" />
            </button>
          </div>
        </div>

        <div className="text-center py-12 px-6">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl shadow-lg animate-bounce-in">
            ₿
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">BITCOIN</h1>
          <p className="text-gray-500 mb-6">BTC</p>
          <h2 className="text-5xl font-bold text-gray-900 mb-2">
            {currency?.price || "$86,244.91"}
          </h2>
          <p className="text-red-500 text-xl font-semibold">
            {currency?.change || "-2.95%"}
          </p>
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={onExchange}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all flex items-center justify-center space-x-2"
          >
            <span>Exchange</span>
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurrencyDetail;

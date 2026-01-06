import React, { useState } from "react";
import { ArrowLeft, TrendingUp, ShoppingCart, Clock, User } from "lucide-react";

const BuyCryptocurrency = ({ onBack, onExchange, onNavigate }) => {
  const [sendAmount, setSendAmount] = useState("5,000,000.00");
  const [receiveAmount, setReceiveAmount] = useState("0.010000056");

  return (
    <div className="min-h-screen bg-white animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 shadow-lg">
          <button onClick={onBack} className="mb-4">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold mb-2">Buy Cryptocurrency</h1>
          <p className="text-blue-100">Buy Crypto currencies</p>
        </div>

        <div className="px-6 mt-6">
          <div className="bg-gray-100 rounded-xl p-1 flex">
            <button className="flex-1 py-3 rounded-lg bg-white text-gray-800 font-semibold shadow-sm">
              Buy/Sell/Crypto
            </button>
            <button className="flex-1 py-3 rounded-lg text-gray-600 font-semibold hover:bg-gray-50 transition-all">
              Swap Crypto
            </button>
          </div>
        </div>

        <div className="px-6 mt-8">
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <label className="text-gray-600 font-semibold">You send</label>
              <label className="text-gray-600 font-semibold">Network</label>
            </div>
            <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-4">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                T
              </div>
              <select className="bg-transparent font-bold text-lg outline-none">
                <option>NGN</option>
              </select>
              <input
                type="text"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                className="flex-1 bg-transparent text-right text-xl font-bold outline-none"
              />
              <span className="text-gray-400 text-sm">NGN</span>
            </div>
          </div>

          <div className="flex justify-end -my-3 relative z-10 pr-4">
            <button className="w-12 h-12 bg-white border-4 border-blue-100 rounded-full flex items-center justify-center hover:bg-blue-50 transition-all shadow-md">
              <svg
                className="w-6 h-6 text-blue-600"
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

          <div className="mt-6">
            <div className="flex justify-between mb-2">
              <label className="text-gray-600 font-semibold">You get</label>
              <label className="text-gray-600 font-semibold">Network</label>
            </div>
            <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-4">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl">
                ₿
              </div>
              <select className="bg-transparent font-bold text-lg outline-none">
                <option>BTC</option>
              </select>
              <input
                type="text"
                value={receiveAmount}
                onChange={(e) => setReceiveAmount(e.target.value)}
                className="flex-1 bg-transparent text-right text-xl font-bold outline-none"
              />
              <span className="text-gray-400 text-sm">BTC</span>
            </div>
          </div>

          <button
            onClick={onExchange}
            className="w-full mt-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
          >
            Exchange
          </button>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-3">
          <div className="flex justify-around">
            <button
              onClick={() => onNavigate("rates")}
              className="flex flex-col items-center space-y-1 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <TrendingUp className="w-6 h-6" />
              <span className="text-xs font-semibold">Rate</span>
            </button>
            <button className="flex flex-col items-center space-y-1 text-blue-600">
              <ShoppingCart className="w-6 h-6" />
              <span className="text-xs font-semibold">Buy</span>
            </button>
            <button className="flex flex-col items-center space-y-1 text-gray-400 hover:text-blue-600 transition-colors">
              <Clock className="w-6 h-6" />
              <span className="text-xs font-semibold">History</span>
            </button>
            <button className="flex flex-col items-center space-y-1 text-gray-400 hover:text-blue-600 transition-colors">
              <User className="w-6 h-6" />
              <span className="text-xs font-semibold">Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyCryptocurrency;

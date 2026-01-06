import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";

const SwapCrypto = ({ onBack, onSwap }) => {
  const [fromAmount, setFromAmount] = useState("5000");
  const [toAmount, setToAmount] = useState("0.010000056");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 shadow-lg">
          <button onClick={onBack} className="mb-4">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold mb-2">Swap Cryptocurrency</h1>
          <p className="text-blue-100">
            Swap Crypto currencies from one asset to another
          </p>
        </div>

        <div className="px-6 mt-6">
          <div className="bg-white rounded-xl shadow-sm p-1 flex">
            <button className="flex-1 py-3 rounded-lg text-gray-600 font-semibold hover:bg-gray-100 transition-all">
              Buy/Sell/Crypto
            </button>
            <button className="flex-1 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow-md">
              Swap Crypto
            </button>
          </div>
        </div>

        <div className="px-6 mt-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label className="text-gray-600 font-semibold">From</label>
                <label className="text-gray-600 font-semibold">Network</label>
              </div>
              <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-4">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  T
                </div>
                <select className="bg-transparent font-bold text-lg outline-none">
                  <option>USDT</option>
                </select>
                <input
                  type="text"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  className="flex-1 bg-transparent text-right text-xl font-bold outline-none"
                />
                <span className="text-gray-400 text-sm">TRC-20</span>
              </div>
            </div>

            <div className="flex justify-center -my-3 relative z-10">
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
              <label className="text-gray-600 font-semibold mb-2 block">
                To
              </label>
              <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-4">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl">
                  ₿
                </div>
                <select className="bg-transparent font-bold text-lg outline-none">
                  <option>BTC</option>
                </select>
                <input
                  type="text"
                  value={toAmount}
                  onChange={(e) => setToAmount(e.target.value)}
                  className="flex-1 bg-transparent text-right text-xl font-bold outline-none"
                />
                <span className="text-gray-400 text-sm">BTC</span>
              </div>
            </div>

            <button className="w-full mt-6 border-2 border-blue-600 text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all flex items-center justify-between px-4">
              <span>Add the refund details</span>
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </button>

            <button
              onClick={onSwap}
              className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
            >
              Swap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapCrypto;

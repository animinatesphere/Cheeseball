import React, { useState } from "react";
import { ArrowLeft, TrendingUp, ShoppingCart, Clock, User } from "lucide-react";

const BuyCryptocurrency = ({ onBack, onExchange, onNavigate }) => {
  const [sendAmount, setSendAmount] = useState("5,000,000.00");
  const [receiveAmount, setReceiveAmount] = useState("0.010000056");

  return (
    <div className="min-h-screen bg-white animate-fade-in pb-24">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <button onClick={onBack} className="mb-8 p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-4xl font-black mb-2 tracking-tight">Trade Crypto</h1>
          <p className="text-blue-200 font-medium">Fast, secure cryptocurrency exchange</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8">
        <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-xl p-1.5 flex border border-gray-100 mb-8 sm:mb-12 max-w-md mx-auto">
          <button className="flex-1 py-3 sm:py-4 rounded-[1.2rem] sm:rounded-[1.5rem] bg-blue-600 text-white font-black shadow-lg shadow-blue-100 text-sm sm:text-base">
            Buy/Sell
          </button>
          <button onClick={() => onNavigate("swap")} className="flex-1 py-3 sm:py-4 rounded-[1.2rem] sm:rounded-[1.5rem] text-gray-500 font-bold hover:bg-gray-50 transition-all text-sm sm:text-base">
            Swap
          </button>
        </div>

        <div className="max-w-3xl mx-auto bg-gray-50 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 lg:p-12 border border-gray-100 shadow-sm text-sm sm:text-base">
          <div className="mb-8 sm:mb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4 px-2">
              <label className="text-gray-400 font-black uppercase text-[10px] sm:text-xs tracking-widest">You Pay</label>
              <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] sm:text-sm bg-blue-50 px-3 py-1 rounded-full whitespace-nowrap">
                Balance: 12,450,000 NGN
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 bg-white rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 shadow-sm border border-gray-100 focus-within:border-blue-300 transition-all">
              <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100 w-full sm:w-auto">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-black text-xs shrink-0">
                  ₦
                </div>
                <select className="bg-transparent font-black text-lg outline-none cursor-pointer flex-1 sm:flex-none">
                  <option>NGN</option>
                  <option>USD</option>
                </select>
              </div>
              <input
                type="text"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                className="flex-1 bg-transparent text-left sm:text-right text-2xl sm:text-3xl font-black outline-none text-gray-900 placeholder-gray-200 min-w-0"
              />
            </div>
          </div>

          <div className="flex justify-center -my-10 sm:-my-14 relative z-10">
            <button className="w-12 h-12 sm:w-16 sm:h-16 bg-white border-4 sm:border-8 border-gray-50 rounded-[1rem] sm:rounded-[1.5rem] flex items-center justify-center hover:scale-110 transition-all shadow-xl group">
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 group-hover:rotate-180 transition-transform duration-500"
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

          <div className="mt-10 sm:mt-14 mb-8 sm:mb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4 px-2">
              <label className="text-gray-400 font-black uppercase text-[10px] sm:text-xs tracking-widest">You Receive</label>
              <div className="text-gray-400 font-bold text-[10px] sm:text-xs bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
                1 BTC = 92,450,000 NGN
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 bg-white rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 shadow-sm border border-gray-100 focus-within:border-blue-300 transition-all">
              <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100 w-full sm:w-auto">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white text-xl shrink-0">
                  ₿
                </div>
                <select className="bg-transparent font-black text-lg outline-none cursor-pointer flex-1 sm:flex-none">
                  <option>BTC</option>
                  <option>ETH</option>
                </select>
              </div>
              <input
                type="text"
                value={receiveAmount}
                onChange={(e) => setReceiveAmount(e.target.value)}
                className="flex-1 bg-transparent text-left sm:text-right text-2xl sm:text-3xl font-black outline-none text-gray-900 placeholder-gray-200 min-w-0"
              />
            </div>
          </div>

          <button
            onClick={onExchange}
            className="w-full bg-[#0063BF] hover:bg-blue-700 text-white py-5 sm:py-6 rounded-[1.5rem] sm:rounded-[2rem] font-black text-lg sm:text-xl shadow-2xl shadow-blue-200 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-4 group"
          >
            <span>Preview Order</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-2 transition-transform">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};


export default BuyCryptocurrency;

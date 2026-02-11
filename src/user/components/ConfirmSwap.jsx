import React, { useState } from "react";
import { ArrowLeft, Copy } from "lucide-react";

const ConfirmSwap = ({ onBack, onConfirm }) => {
  const [address, setAddress] = useState("");

  return (
    <div className="min-h-screen bg-white animate-fade-in pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-4 sm:py-8">
          <button onClick={onBack} className="p-3 sm:p-4 hover:bg-gray-50 rounded-xl sm:rounded-2xl transition-all border border-gray-100 shadow-sm">
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" />
          </button>
        </div>

        <div className="max-w-3xl mx-auto mt-6 sm:mt-8">
          <div className="mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">Confirm Swap</h1>
            <p className="text-gray-500 text-sm sm:text-base font-medium">Verify your transaction details</p>
          </div>

          <div className="bg-gray-50 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-8 lg:p-12 border border-gray-100 shadow-sm mb-8 sm:mb-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
              <div className="flex items-center gap-4 sm:gap-6 w-full md:w-auto">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-lg shadow-green-100 shrink-0">
                  T
                </div>
                <div>
                  <p className="text-gray-400 font-black uppercase text-[10px] sm:text-xs tracking-widest mb-1">Send</p>
                  <p className="font-black text-xl sm:text-2xl text-gray-900 leading-none">5000 USDT</p>
                  <p className="text-green-600 font-bold text-xs sm:text-sm mt-1">TRC-20</p>
                </div>
              </div>
              
              <div className="bg-white p-3 sm:p-4 rounded-full shadow-sm border border-gray-100 rotate-90 md:rotate-0">
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 rotate-180" />
              </div>

              <div className="flex items-center gap-4 sm:gap-6 w-full md:w-auto">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-500 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-2xl sm:text-3xl shadow-lg shadow-orange-100 shrink-0">
                  ₿
                </div>
                <div className="text-left md:text-left flex-1 md:flex-none">
                  <p className="text-gray-400 font-black uppercase text-[10px] sm:text-xs tracking-widest mb-1">Receive</p>
                  <p className="font-black text-xl sm:text-2xl text-gray-900 leading-none">0.002445 BTC</p>
                  <p className="text-orange-600 font-bold text-xs sm:text-sm mt-1">BTC Network</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 sm:mb-12 text-sm sm:text-base">
            <label className="text-gray-900 font-black uppercase text-[10px] sm:text-xs tracking-widest mb-3 sm:mb-4 block px-2">
              Recipient Bitcoin Address
            </label>
            <div className="relative group flex flex-col gap-4 sm:block">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter BTC address..."
                className="w-full px-6 sm:px-8 py-5 sm:py-6 bg-gray-50 rounded-[1.5rem] sm:rounded-[2rem] border-2 border-transparent focus:border-blue-300 outline-none transition-all text-base sm:text-lg font-bold text-gray-900 placeholder-gray-300 shadow-inner"
              />
              <button className="sm:absolute sm:right-3 sm:top-1/2 sm:transform sm:-translate-y-1/2 flex items-center justify-center gap-2 bg-[#0063BF] text-white font-black px-6 py-4 rounded-xl sm:rounded-[1.5rem] hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                <span>Paste</span>
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-400 font-medium mt-4 px-4 leading-relaxed">
              Carefully check the address. Transactions on the blockchain are irreversible.
            </p>
          </div>

          <button
            onClick={onConfirm}
            className="w-full bg-[#0063BF] hover:bg-blue-700 text-white py-5 sm:py-6 rounded-[1.5rem] sm:rounded-[2rem] font-black text-lg sm:text-xl shadow-2xl shadow-blue-200 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-4 group"
          >
            <span>Confirm & Swap</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-2 transition-transform">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmSwap;

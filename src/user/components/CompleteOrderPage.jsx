import React from "react";
import { Clock } from "lucide-react";

const CompleteOrderPage = ({ onBack, onBuyWithBankTransfer }) => {
  return (
    <div className="min-h-screen bg-white animate-fade-in pb-24">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <button onClick={onBack} className="p-2.5 sm:p-3 bg-white/10 hover:bg-white/20 rounded-xl sm:rounded-2xl transition-all border border-white/10 font-black uppercase text-[10px] sm:text-xs tracking-widest leading-none">
              Close Order
            </button>
            <div className="flex items-center gap-2 sm:gap-3 bg-white/10 rounded-xl sm:rounded-2xl px-3 sm:px-5 py-2 sm:py-3 border border-white/10 backdrop-blur-md">
              <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full border-2 border-white/50 flex items-center justify-center">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
              </div>
              <span className="font-black text-[10px] sm:text-sm uppercase tracking-widest whitespace-nowrap">NGN • Nigeria</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black mb-1 sm:mb-2 tracking-tight">Order Confirmation</h1>
          <p className="text-blue-200 text-sm sm:text-base font-medium">Verify your selection before proceeding</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6 sm:-mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          <div className="space-y-6 sm:space-y-8">
            <div className="bg-gray-50 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 border border-gray-100">
               <label className="text-gray-400 font-black uppercase text-[10px] sm:text-xs tracking-widest mb-4 sm:mb-6 block px-1">Payment Method</label>
               <div className="grid grid-cols-1 gap-4">
                  <label className="flex items-center justify-between bg-white px-6 sm:px-8 py-4 sm:py-6 rounded-[1.5rem] sm:rounded-[2rem] cursor-pointer border-2 border-blue-600 shadow-xl shadow-blue-50 transition-all">
                    <div className="flex items-center gap-4 sm:gap-6">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-4 border-blue-600 flex items-center justify-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      </div>
                      <span className="font-black text-lg sm:text-xl text-blue-600">Bank Transfer</span>
                    </div>
                    <div className="text-2xl sm:text-3xl">🏦</div>
                  </label>

                  <label className="flex items-center justify-between bg-gray-50 px-6 sm:px-8 py-4 sm:py-6 rounded-[1.5rem] sm:rounded-[2rem] cursor-not-allowed border-2 border-transparent opacity-50 transition-all">
                    <div className="flex items-center gap-4 sm:gap-6">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-gray-300"></div>
                      <span className="font-black text-lg sm:text-xl text-gray-400">Debit Card</span>
                    </div>
                    <div className="flex gap-2 sm:gap-4 scale-75 sm:scale-100">
                       <img className="h-3 sm:h-4 grayscale" src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" />
                       <img className="h-4 sm:h-6 grayscale" src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" />
                    </div>
                  </label>
               </div>
            </div>
            
            <div className="p-6 sm:p-8 bg-blue-50 rounded-[2rem] sm:rounded-[2.5rem] border border-blue-100 flex items-center gap-4 sm:gap-6">
               <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 text-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                  <Clock className="w-6 h-6 sm:w-8 sm:h-8" />
               </div>
               <div>
                  <p className="text-blue-900 font-black text-base sm:text-lg leading-tight">Rate matches current market</p>
                  <p className="text-blue-600 font-bold text-xs sm:text-sm">Update in <span className="text-red-600 tabular-nums">5 seconds</span></p>
               </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 lg:p-14 border border-gray-100 shadow-2xl flex flex-col">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-6 sm:mb-8">Purchase Summary</h2>
            
            <div className="space-y-6 flex-1">
               <div className="bg-gray-50 p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] text-center mb-6 sm:mb-8 border border-gray-100">
                  <p className="text-[9px] sm:text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-3 sm:mb-4">You are buying</p>
                  <p className="text-2xl sm:text-4xl font-black text-gray-900 mb-1 sm:mb-2 tabular-nums">0.00217609 <span className="text-lg sm:text-xl text-gray-400">BTC</span></p>
                  <p className="text-blue-600 font-black text-base sm:text-lg">₦4,980,000.00</p>
               </div>

               <div className="space-y-3 sm:space-y-4 px-2 sm:px-4 text-sm sm:text-base">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-bold">Exchange Rate</span>
                    <span className="font-black text-gray-900 tabular-nums text-xs sm:text-base">1 BTC = ₦8,962,026.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-bold">Service Fee</span>
                    <span className="font-black text-green-600 tabular-nums">₦20,000.00</span>
                  </div>
                  <div className="pt-4 sm:pt-6 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-gray-900 font-black text-lg sm:text-xl">Total To Pay</span>
                    <span className="font-black text-2xl sm:text-3xl text-blue-600 tabular-nums">₦5,000,000.00</span>
                  </div>
               </div>
            </div>

            <button
              onClick={onBuyWithBankTransfer}
              className="w-full mt-8 sm:mt-12 bg-[#0063BF] hover:bg-blue-700 text-white py-5 sm:py-6 rounded-[1.5rem] sm:rounded-[2rem] font-black text-lg sm:text-xl shadow-2xl shadow-blue-200 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-4 group"
            >
              <span>Confirm & Pay Now</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-2 transition-transform">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteOrderPage;

import React, { useState } from "react";
import { ArrowLeft, Clock } from "lucide-react";
const CompleteOrderEmail = ({ onBack, onContinue }) => {
  const [email, setEmail] = useState("");
  const [receiveUpdates, setReceiveUpdates] = useState(false);

  return (
    <div className="min-h-screen bg-white animate-fade-in pb-24">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex justify-between items-center mb-8">
            <button onClick={onBack} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3 bg-white/10 rounded-2xl px-5 py-3 border border-white/10 backdrop-blur-md">
              <div className="w-6 h-6 rounded-full border-2 border-white/50 flex items-center justify-center">
                <div className="w-3 h-3 bg-green-400 rounded-full shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
              </div>
              <span className="font-black text-sm uppercase tracking-widest">NGN • Nigeria</span>
            </div>
          </div>
          <h1 className="text-4xl font-black mb-2 tracking-tight">Email Information</h1>
          <p className="text-blue-200 font-medium">Safe delivery for your receipt</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="bg-gray-50 rounded-[3rem] p-10 border border-gray-100 flex flex-col gap-8">
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full pl-8 pr-8 py-6 bg-white border-2 border-transparent focus:border-blue-100 rounded-[2rem] font-bold text-gray-900 placeholder-gray-300 outline-none transition-all shadow-xl shadow-gray-100/50"
                />
              </div>

              <label className="flex items-center gap-4 cursor-pointer group px-4">
                <div className="relative flex items-center justify-center w-7 h-7">
                  <input
                    type="checkbox"
                    checked={receiveUpdates}
                    onChange={(e) => setReceiveUpdates(e.target.checked)}
                    className="appearance-none w-full h-full bg-white border-2 border-gray-200 rounded-lg checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
                  />
                  {receiveUpdates && (
                    <svg className="absolute w-4 h-4 text-white pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span className="text-gray-500 font-bold group-hover:text-blue-600 transition-colors">
                  Stay updated with our latest offers & news
                </span>
              </label>
            </div>

            <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100 flex items-center gap-6">
               <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                  <Clock className="w-8 h-8" />
               </div>
               <div>
                  <p className="text-blue-900 font-black text-lg leading-tight">Order quote valid</p>
                  <p className="text-blue-600 font-bold text-sm">Update in <span className="text-red-600 tabular-nums">5 seconds</span></p>
               </div>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] p-10 lg:p-14 border border-gray-100 shadow-2xl flex flex-col">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-8">Order Overview</h2>
            
            <div className="space-y-6 flex-1">
               <div className="bg-gray-50 p-8 rounded-[2.5rem] text-center mb-8 border border-gray-100">
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-4">You will receive</p>
                  <p className="text-4xl font-black text-gray-900 mb-2 tabular-nums">0.00217609 <span className="text-xl text-gray-400">BTC</span></p>
                  <p className="text-blue-600 font-black text-lg">₦4,980,000.00</p>
               </div>

               <div className="space-y-4 px-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-bold">Exchange Rate</span>
                    <span className="font-black text-gray-900 tabular-nums text-sm md:text-base">1 BTC = ₦8,962,026.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-bold">Network Fee</span>
                    <span className="font-black text-green-600 tabular-nums">₦20,000.00</span>
                  </div>
                  <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-gray-900 font-black text-xl">Total Cost</span>
                    <span className="font-black text-3xl text-blue-600 tabular-nums">₦5,000,000.00</span>
                  </div>
               </div>
            </div>

            <button
              onClick={() => onContinue(email)}
              className="w-full mt-12 bg-[#0063BF] hover:bg-blue-700 text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl shadow-blue-200 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-4 group"
            >
              <span>Verify My Email</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-2 transition-transform">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            
            <p className="mt-8 text-center text-gray-400 text-xs font-bold leading-relaxed px-4">
              By continuing you agree to our <span className="text-blue-600">Terms</span>, <span className="text-blue-600">Privacy</span> and <span className="text-blue-600">Cookies Policy</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteOrderEmail;

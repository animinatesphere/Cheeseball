import React, { useState } from "react";
import { ArrowLeft, Copy, ArrowRight } from "lucide-react";

const BuyCryptoAddress = ({ onBack, onCreateExchange }) => {
  const [address, setAddress] = useState("");

  return (
    <div className="min-h-screen bg-white animate-fade-in pb-24">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex flex-col gap-6 sm:gap-8">
            <button onClick={onBack} className="w-fit p-2.5 sm:p-3 bg-white/10 hover:bg-white/20 rounded-xl sm:rounded-2xl transition-all border border-white/10 font-black uppercase text-[10px] sm:text-xs tracking-widest leading-none">
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-4xl font-black mb-1 sm:mb-2 tracking-tight">Delivery Address</h1>
              <p className="text-blue-200 text-sm sm:text-base font-medium">Where should we send your assets?</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6 sm:-mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          <div className="space-y-6 sm:space-y-8">
             <div className="bg-blue-600 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/5 rounded-full -mr-24 -mt-24 sm:-mr-32 sm:-mt-32 transform group-hover:scale-110 transition-transform duration-700"></div>
                <div className="relative z-10 flex flex-col gap-8 sm:gap-10">
                   <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-0">
                      <div className="flex items-center gap-4 self-start sm:self-auto">
                         <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-lg sm:rounded-xl flex items-center justify-center text-green-400 font-black text-lg sm:text-xl backdrop-blur-md border border-white/10">N</div>
                         <div>
                            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-blue-200">You Pay</p>
                            <p className="text-xl sm:text-2xl font-black tabular-nums">5,000,000 <span className="text-xs sm:text-sm opacity-50">NGN</span></p>
                         </div>
                      </div>
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-full flex items-center justify-center rotate-90 sm:rotate-0">
                         <ArrowRight size={18} className="text-blue-200" />
                      </div>
                      <div className="flex items-center gap-4 text-right self-end sm:self-auto">
                         <div className="text-right">
                            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-blue-200">You Get</p>
                            <p className="text-xl sm:text-2xl font-black tabular-nums">0.002445 <span className="text-xs sm:text-sm opacity-50">BTC</span></p>
                         </div>
                         <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-lg sm:rounded-xl flex items-center justify-center text-orange-400 font-black text-lg sm:text-xl backdrop-blur-md border border-white/10">₿</div>
                      </div>
                   </div>
                   
                   <div className="bg-white/10 rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 backdrop-blur-md border border-white/10 text-sm sm:text-base">
                      <div className="flex justify-between items-center mb-3 sm:mb-4">
                         <span className="text-blue-200 font-bold">Network</span>
                         <span className="bg-blue-500 px-3 sm:px-4 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest">BTC Mainnet</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-blue-200 font-bold">Fiat Method</span>
                         <span className="font-black text-xs sm:text-base">PAYSTACK (SECURED)</span>
                      </div>
                   </div>
                </div>
             </div>
             
             <div className="p-6 sm:p-8 bg-blue-50 rounded-[2rem] sm:rounded-[2.5rem] border border-blue-100 flex items-center gap-4 sm:gap-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 text-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="sm:w-8 sm:h-8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <div>
                   <p className="text-blue-900 font-black text-base sm:text-lg leading-tight">Secure Transaction</p>
                   <p className="text-blue-600 font-bold text-xs sm:text-sm">Verified by blockchain protocols</p>
                </div>
             </div>
          </div>

          <div className="bg-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 lg:p-14 border border-gray-100 shadow-2xl flex flex-col">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-6 sm:mb-8">Recipient Address</h2>
            
            <div className="space-y-6 sm:space-y-8 flex-1">
               <div className="relative group">
                 <label className="text-gray-400 font-black uppercase text-[10px] sm:text-xs tracking-widest mb-3 sm:mb-4 block px-2">Bitcoin Address</label>
                 <div className="relative flex flex-col gap-4 sm:block">
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter ₿ address here..."
                      className="w-full pl-6 sm:pl-8 pr-6 sm:pr-32 py-5 sm:py-8 bg-gray-50 border-2 border-transparent focus:border-blue-100 rounded-[1.5rem] sm:rounded-[2rem] font-bold sm:font-black text-gray-900 placeholder-gray-300 outline-none transition-all shadow-inner text-sm sm:text-base"
                    />
                    <button className="sm:absolute sm:right-4 sm:top-1/2 sm:-translate-y-1/2 bg-[#0063BF] text-white px-6 sm:px-8 py-4 rounded-xl sm:rounded-[1.5rem] font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2 group/btn">
                       <span>Paste</span>
                       <Copy size={16} />
                    </button>
                 </div>
               </div>
               
               <div className="bg-orange-50 rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 border border-orange-100">
                  <p className="text-orange-900 font-black text-sm mb-2 flex items-center gap-2">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="sm:w-5 sm:h-5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                     Address Verification
                  </p>
                  <p className="text-orange-700 font-medium text-[11px] sm:text-xs leading-relaxed">Please ensure the recipient address is correct. Cryptocurrency transfers are irreversible and funds sent to the wrong address cannot be recovered.</p>
               </div>
            </div>

            <button
              onClick={onCreateExchange}
              className="w-full mt-8 sm:mt-12 bg-[#0063BF] hover:bg-blue-700 text-white py-5 sm:py-6 rounded-[1.5rem] sm:rounded-[2rem] font-black text-lg sm:text-xl shadow-2xl shadow-blue-200 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-4 group"
            >
              <span>Create Order</span>
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

export default BuyCryptoAddress;

import React from "react";
import { ArrowLeft, Bell, Star } from "lucide-react";

const CurrencyDetail = ({ currency, onBack, onExchange }) => {
  return (
    <div className="min-h-screen bg-[#ffffff] text-slate-800 pb-32 animate-fade-in uppercase tracking-tighter">
      {/* ═══ HEADER ═══ */}
      <div className="bg-[#f8f9fa] border-b border-white/5 py-4 sm:py-6 sticky top-0 z-30 backdrop-blur-xl bg-opacity-80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 sm:p-3 hover:bg-white/5 rounded-xl transition-all border border-white/5"
            >
              <ArrowLeft size={20} className="text-slate-500" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#f1f3f5] border border-white/5 rounded-xl flex items-center justify-center overflow-hidden">
                {typeof currency?.icon === 'string' ? (
                  <span className="font-black text-xl text-[#2563eb]">{currency.icon}</span>
                ) : (
                  currency?.icon || <span className="font-black text-xl text-[#2563eb]">₿</span>
                )}
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-black text-slate-900 leading-none mb-1">
                  {currency?.name || "BTC"}/USDT
                </h1>
                <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest leading-none">
                  {currency?.fullName || "BITCOIN"}
                </p>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xl sm:text-2xl font-black text-slate-900 leading-none mb-1">
              {currency?.price || "$86,244.91"}
            </p>
            <p className={`text-[10px] sm:text-xs font-black ${currency?.positive !== false ? "text-green-400" : "text-red-400"}`}>
              {currency?.change || "-2.95%"}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 sm:mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10">
          {/* ═══ CHART & DATA SECTION ═══ */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            <div className="bg-[#f8f9fa] rounded-[2rem] p-6 sm:p-10 border border-white/5 relative overflow-hidden group">
               <div className="flex justify-between items-center mb-10">
                  <div className="flex gap-2">
                     {['15m', '1h', '4h', '1D', '1W'].map(t => (
                        <button key={t} className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${t === '1D' ? 'bg-[#2563eb] text-black' : 'text-gray-500 hover:text-slate-900 hover:bg-white/5'}`}>{t}</button>
                     ))}
                  </div>
                  <div className="flex gap-4">
                     <Bell className="text-gray-500 w-5 h-5 cursor-pointer hover:text-slate-900 transition-colors" />
                     <Star className="text-[#2563eb] w-5 h-5 cursor-pointer" fill="currentColor" />
                  </div>
               </div>

               {/* Mock Chart Area */}
               <div className="h-64 sm:h-80 flex items-end gap-1 px-1">
                 {[40, 60, 45, 78, 55, 90, 65, 85, 45, 70, 80, 55, 95, 75, 85, 60, 100, 80, 60, 70].map((h, i) => (
                   <div key={i} className="flex-1 group/bar relative">
                     <div
                       className={`w-full rounded-t-sm transition-all duration-700 opacity-20 group-hover/bar:opacity-60 cursor-pointer ${i % 3 === 0 ? 'bg-red-500' : 'bg-green-500'}`}
                       style={{ height: `${h}%` }}
                     ></div>
                   </div>
                 ))}
               </div>
               <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#f8f9fa] to-transparent pointer-events-none"></div>
            </div>

            {/* Market Performance */}
            <div className="bg-[#f1f3f5] rounded-[2rem] p-8 sm:p-12 border border-white/5 shadow-2xl">
              <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-8">Asset Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { label: "Market Cap", value: "$1.7T", color: "text-[#2563eb]" },
                  { label: "24h Volume", value: "$35.2B", color: "text-green-400" },
                  { label: "Circulating Supply", value: "19.6M BTC", color: "text-slate-900" },
                  { label: "All Time High", value: "$93,450", color: "text-slate-900" },
                ].map((stat, i) => (
                  <div key={i}>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">{stat.label}</p>
                    <p className={`text-lg font-black ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ═══ ACTION PANEL ═══ */}
          <div className="space-y-6">
            <div className="bg-[#f8f9fa] rounded-[2rem] p-8 border border-white/5">
              <div className="flex gap-4 mb-8">
                 <button className="flex-1 py-4 bg-green-500/10 text-green-400 font-black rounded-xl border border-green-500/20 uppercase text-xs">Buy / Long</button>
                 <button className="flex-1 py-4 bg-red-500/10 text-red-400 font-black rounded-xl border border-red-500/20 uppercase text-xs">Sell / Short</button>
              </div>

              <div className="space-y-6 mb-10">
                <div className="flex justify-between items-center py-4 border-b border-white/5">
                  <span className="text-gray-500 font-black text-[10px] uppercase">Mark Price</span>
                  <span className="text-slate-900 font-black text-sm">{currency?.price || "$86,244"}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-white/5">
                  <span className="text-gray-500 font-black text-[10px] uppercase">Index Price</span>
                  <span className="text-slate-900 font-black text-sm">{currency?.price || "$86,210"}</span>
                </div>
              </div>

              <button
                onClick={onExchange}
                className="w-full bg-[#2563eb] hover:bg-[#2563eb]/90 text-black py-5 rounded-2xl font-black text-lg shadow-2xl shadow-[#2563eb]/10 transition-all active:scale-95 uppercase italic flex items-center justify-center gap-3"
              >
                <span>Instant Trade</span>
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>

              <div className="mt-8 pt-8 border-t border-white/5">
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-4">Depth Chart Info</p>
                <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-white/5">
                  <div className="w-2/3 bg-green-500/50"></div>
                  <div className="w-1/3 bg-red-500/50"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyDetail;


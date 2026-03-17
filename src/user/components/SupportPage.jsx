import React, { useState } from "react";
import { MessageCircle, ChevronRight, Bookmark } from "lucide-react";

const SupportPage = ({ onNavigate }) => {
  const [appUpdates, setAppUpdates] = useState(true);
  const [ordersUpdate, setOrdersUpdate] = useState(true);

  return (
    <div className="min-h-screen bg-[#0B0E11] text-[#EAECEF] pb-32 uppercase tracking-tighter">
      <div className="bg-[#181A20] border-b border-white/5 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <h1 className="text-2xl sm:text-4xl font-black text-white italic">24/7 Global Support</h1>
          <p className="text-[#FFB11A] text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">Institutional Grade Assistance</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 sm:mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Main Contact Card — Redesigned for Dark Theme */}
          <div className="bg-[#1E2329] rounded-[2.5rem] p-8 sm:p-12 border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFB11A]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="flex items-center justify-between mb-10 relative z-10">
               <div className="p-4 bg-white/5 rounded-2xl text-[#FFB11A] shadow-lg border border-white/5">
                 <MessageCircle className="w-8 h-8" />
               </div>
               <div className="text-right">
                 <h2 className="text-xl sm:text-2xl font-black text-white italic leading-none mb-1 uppercase tracking-tighter">Live Chat</h2>
                 <p className="text-green-400 font-black text-[10px] uppercase tracking-widest">Response: &lt;5 mins</p>
               </div>
            </div>

            <button className="w-full bg-white/5 rounded-3xl p-6 sm:p-8 flex items-center gap-6 hover:bg-white/10 transition-all border border-white/5 group relative z-10">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform shrink-0">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-lg sm:text-xl font-black text-white italic leading-none mb-1 truncate uppercase">WhatsApp Support</p>
                <p className="text-gray-500 font-bold text-xs sm:text-sm truncate">+234 901 2345 678</p>
              </div>
              <ChevronRight className="text-[#FFB11A] shrink-0" size={24} />
            </button>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {/* Address Book Card — Updated for Dark Theme */}
            <div className="bg-[#1E2329] rounded-[2rem] p-8 border border-white/5 shadow-xl">
              <label className="text-gray-600 font-black uppercase text-[10px] tracking-[0.2em] mb-6 block px-1">Institutional Settings</label>
              <button
                onClick={() => onNavigate && onNavigate("address-book")}
                className="w-full bg-white/5 rounded-2xl p-6 flex items-center justify-between hover:bg-white/10 transition-all border border-white/5 group"
              >
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl group-hover:bg-blue-400 group-hover:text-black transition-all">
                     <Bookmark size={20} />
                   </div>
                   <span className="text-lg font-black text-white italic uppercase tracking-tighter">Verified Addresses</span>
                </div>
                <ChevronRight className="text-gray-600 group-hover:text-[#FFB11A] transition-all shrink-0" size={20} />
              </button>
            </div>

            {/* Notifications Card — Updated for Dark Theme */}
            <div className="bg-[#1E2329] rounded-[2rem] p-8 border border-white/5 shadow-xl">
              <label className="text-gray-600 font-black uppercase text-[10px] tracking-[0.2em] mb-6 block px-1">Alert Preferences</label>
              <div className="space-y-4">
                {[
                  { label: "Institutional Updates", state: appUpdates, setState: setAppUpdates },
                  { label: "Real-time Order Status", state: ordersUpdate, setState: setOrdersUpdate }
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 p-6 rounded-2xl flex items-center justify-between border border-white/5 group">
                    <span className="text-base font-black text-gray-300 uppercase tracking-tighter">{item.label}</span>
                    <button
                      onClick={() => item.setState(!item.state)}
                      className={`w-14 h-8 rounded-full transition-all relative shrink-0 border border-white/10 ${
                        item.state ? "bg-[#FFB11A] shadow-lg shadow-[#FFB11A]/20" : "bg-[#2B3139]"
                      }`}
                    >
                      <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${item.state ? "translate-x-6" : ""}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;

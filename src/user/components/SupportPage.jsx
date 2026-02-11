import React, { useState } from "react";
import { MessageCircle, ChevronRight, Bookmark } from "lucide-react";

const SupportPage = ({ onNavigate }) => {
  const [appUpdates, setAppUpdates] = useState(true);
  const [ordersUpdate, setOrdersUpdate] = useState(true);

  return (
    <div className="min-h-screen bg-white pb-32">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Support Center</h1>
          <p className="text-blue-200 text-sm sm:text-base font-medium">How can we help you today?</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 sm:mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Main Contact Card */}
          <div className="bg-blue-50 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 border border-blue-100 shadow-sm">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
               <div className="p-3 sm:p-4 bg-blue-600 rounded-xl sm:rounded-2xl text-white shadow-lg shadow-blue-200">
                 <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8" />
               </div>
               <div className="text-right">
                 <h2 className="text-lg sm:text-2xl font-black text-blue-900 leading-none mb-1">Live Chat</h2>
                 <p className="text-blue-600 font-bold text-xs sm:text-sm">Response: ~5 mins</p>
               </div>
            </div>

            <button className="w-full bg-white rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 flex items-center gap-4 sm:gap-6 hover:shadow-xl transition-all border border-blue-50 group">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-100 group-hover:scale-110 transition-transform shrink-0">
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-base sm:text-xl font-black text-gray-900 leading-none mb-1 truncate">WhatsApp Support</p>
                <p className="text-gray-400 font-bold text-xs sm:text-sm truncate">+234 901 2345 678</p>
              </div>
              <ChevronRight className="text-blue-600 shrink-0" size={20} />
            </button>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {/* Address Book Card */}
            <div className="bg-gray-50 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 border border-gray-100">
              <label className="text-gray-400 font-black uppercase text-[10px] sm:text-xs tracking-widest mb-4 sm:mb-6 block px-1">User Settings</label>
              <button
                onClick={() => onNavigate && onNavigate("address-book")}
                className="w-full bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 flex items-center justify-between hover:shadow-lg hover:border-blue-100 transition-all border border-gray-50 group"
              >
                <div className="flex items-center gap-4">
                   <div className="p-2.5 sm:p-3 bg-blue-50 text-blue-600 rounded-lg sm:rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all scale-90 sm:scale-100">
                     <Bookmark size={18} />
                   </div>
                   <span className="text-base sm:text-lg font-black text-gray-900">Address Book</span>
                </div>
                <ChevronRight className="text-gray-300 group-hover:text-blue-600 transition-colors shrink-0" size={20} />
              </button>
            </div>

            {/* Notifications Card */}
            <div className="bg-gray-50 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 border border-gray-100">
              <label className="text-gray-400 font-black uppercase text-[10px] sm:text-xs tracking-widest mb-4 sm:mb-6 block px-1">Preferences</label>
              <div className="space-y-3 sm:space-y-4">
                {[
                  { label: "App Updates", state: appUpdates, setState: setAppUpdates },
                  { label: "Real-time Order Status", state: ordersUpdate, setState: setOrdersUpdate }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl flex items-center justify-between border border-gray-50">
                    <span className="text-sm sm:text-lg font-black text-gray-700">{item.label}</span>
                    <button
                      onClick={() => item.setState(!item.state)}
                      className={`w-12 h-6 sm:w-14 sm:h-8 rounded-full transition-all relative shrink-0 ${
                        item.state ? "bg-blue-600 shadow-lg shadow-blue-100" : "bg-gray-200"
                      }`}
                    >
                      <div className={`absolute top-0.5 sm:top-1 left-0.5 sm:left-1 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full transition-transform ${item.state ? "translate-x-6" : ""}`} />
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

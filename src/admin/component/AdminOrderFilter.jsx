import React, { useState } from "react";
import { X, Calendar, ChevronRight } from "lucide-react";

const AdminOrderFilter = ({ onClose, onApply }) => {
  const [filterDate, setFilterDate] = useState("All");

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-0 sm:p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-t-[2.5rem] sm:rounded-[3rem] w-full max-w-lg shadow-2xl animate-slide-up sm:animate-bounce-in h-fit overflow-hidden">
        <div className="p-8 sm:p-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Filter Orders</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-xl transition-all active:scale-95"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <div className="space-y-8">
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4 px-1">
                Time Horizon
              </label>
              <div className="flex flex-wrap gap-2">
                {["All", "Today", "Week", "Month"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setFilterDate(filter)}
                    className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                      filterDate === filter
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                        : "bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4 px-1">
                Custom Duration
              </label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="relative group cursor-pointer">
                    <input
                      type="text"
                      value="20/07/25"
                      className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent group-hover:bg-white group-hover:border-blue-50 outline-none transition-all font-bold text-gray-900 shadow-inner"
                      readOnly
                    />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </div>
                <div className="text-gray-300 font-black">→</div>
                <div className="flex-1">
                  <div className="relative group cursor-pointer">
                    <input
                      type="text"
                      value="20/07/25"
                      className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent group-hover:bg-white group-hover:border-blue-50 outline-none transition-all font-bold text-gray-900 shadow-inner"
                      readOnly
                    />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4 px-1">
                Asset Pair
              </label>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-[1.5rem] p-4 flex items-center justify-between group cursor-pointer hover:bg-white hover:shadow-xl hover:border-blue-50 border border-transparent transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-50 group-hover:scale-110 transition-transform">
                      ₿
                    </div>
                    <div>
                      <div className="font-black text-gray-900">Bitcoin</div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mt-1">BTC</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-blue-600 rotate-90" />
                </div>
                <div className="bg-gray-50 rounded-[1.5rem] p-4 flex items-center justify-between group cursor-pointer hover:bg-white hover:shadow-xl hover:border-blue-50 border border-transparent transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-50 group-hover:scale-110 transition-transform">
                      T
                    </div>
                    <div>
                      <div className="font-black text-gray-900">Tether</div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mt-1">TRC-20</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-blue-600 rotate-90" />
                </div>
              </div>
            </div>

            <button
              onClick={() => onApply({})}
              className="w-full mt-4 bg-blue-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98]"
            >
              Apply Filter
            </button>
            <button className="w-full text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em] hover:text-blue-600 transition-colors">
              Clear All Parameters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderFilter;

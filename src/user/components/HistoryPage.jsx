/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  ChevronLeft,
  SlidersHorizontal,
  ArrowRight,
  Calendar,
} from "lucide-react";

const HistoryPage = ({ onNavigate }) => {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("Waiting");

  const transactions = [
    { id: 1, date: "02 July 2023", from: { amount: "5000", currency: "USDT", symbol: "TRC-20", icon: "T" }, to: { amount: "0.002445", currency: "BTC", icon: "₿" }, status: "Waiting", exchangeId: "voec666krovitepmd" },
    { id: 2, date: "02 July 2023", from: { amount: "5000", currency: "USDT", symbol: "TRC-20", icon: "T" }, to: { amount: "0.002445", currency: "BTC", icon: "₿" }, status: "Approved", exchangeId: "voec666krovitepmd" },
    { id: 3, date: "02 July 2023", from: { amount: "5000", currency: "USDT", symbol: "TRC-20", icon: "T" }, to: { amount: "0.002445", currency: "BTC", icon: "₿" }, status: "Cancel", exchangeId: "voec666krovitepmd" },
    { id: 4, date: "02 July 2023", from: { amount: "5000", currency: "USDT", symbol: "TRC-20", icon: "T" }, to: { amount: "0.002445", currency: "BTC", icon: "₿" }, status: "Waiting", exchangeId: "voec666krovitepmd" },
    { id: 5, date: "02 July 2023", from: { amount: "5000", currency: "USDT", symbol: "TRC-20", icon: "T" }, to: { amount: "0.002445", currency: "BTC", icon: "₿" }, status: "Approved", exchangeId: "voec666krovitepmd" },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Waiting": return "text-orange-600 bg-orange-50 border-orange-100";
      case "Approved": return "text-green-600 bg-green-50 border-green-100";
      case "Cancel": return "text-red-600 bg-red-50 border-red-100";
      default: return "text-gray-500 bg-gray-50 border-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-white pb-32">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <button onClick={() => onNavigate("rates")} className="p-2.5 sm:p-3 bg-white/10 hover:bg-white/20 rounded-xl sm:rounded-2xl transition-all border border-white/10">
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={() => setShowFilterModal(true)}
              className="p-2.5 sm:p-3 bg-white/10 hover:bg-white/20 rounded-xl sm:rounded-2xl transition-all border border-white/10"
            >
              <SlidersHorizontal className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Swap History</h1>
          <p className="text-blue-200 text-sm sm:text-base font-medium">Tracking your global transactions</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 sm:mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {transactions.map((transaction, index) => (
            <div key={transaction.id} className="group">
              {(index === 0 || transactions[index - 1].date !== transaction.date) && (
                <div className="flex items-center gap-4 mb-4 sm:mb-6 px-2 sm:px-4">
                  <span className="text-gray-400 font-black uppercase text-[10px] sm:text-xs tracking-[0.2em]">{transaction.date}</span>
                  <div className="h-px bg-gray-100 flex-1"></div>
                </div>
              )}
              <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] p-5 sm:p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:border-blue-100 transition-all cursor-pointer">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8 mb-6 sm:mb-8">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-green-600 font-black text-lg sm:text-xl border border-green-100 shrink-0">
                      {transaction.from.icon}
                    </div>
                    <div>
                      <p className="font-black text-lg sm:text-xl text-gray-900 leading-none mb-1">
                        {transaction.from.amount} <span className="text-gray-400 text-xs sm:text-sm">{transaction.from.currency}</span>
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider">{transaction.from.symbol}</p>
                    </div>
                  </div>

                  <div className="hidden sm:block p-3 rounded-full bg-blue-50 text-blue-600">
                    <ArrowRight size={20} className="stroke-[3px]" />
                  </div>
                  <div className="sm:hidden w-full h-px bg-gray-50"></div>

                  <div className="flex items-center gap-4 w-full sm:w-auto sm:text-right">
                    <div className="sm:order-1 order-2 flex-1 sm:flex-none">
                       <p className="font-black text-lg sm:text-xl text-gray-900 leading-none mb-1">
                        {transaction.to.amount} <span className="text-gray-400 text-xs sm:text-sm">{transaction.to.currency}</span>
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider">{transaction.to.currency}</p>
                    </div>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-orange-600 font-black text-xl sm:text-2xl border border-orange-100 sm:order-2 order-1 shrink-0">
                      {transaction.to.icon}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-gray-50">
                  <span className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider border ${getStatusStyle(transaction.status)}`}>
                    {transaction.status}
                  </span>
                  <p className="text-[10px] sm:text-xs font-black text-blue-600/40 group-hover:text-blue-600 transition-colors uppercase tracking-widest leading-none">
                    ID: {transaction.exchangeId.slice(-8)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simplified Filter Modal for Full-Width */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-[3rem] p-10 animate-bounce-in shadow-2xl">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Filter Results</h2>
              <button onClick={() => setShowFilterModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <label className="text-gray-400 font-black uppercase text-xs tracking-widest mb-4 block">Time Range</label>
                <div className="grid grid-cols-2 gap-3">
                  {["Today", "Week", "Month", "All"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSelectedFilter(filter)}
                      className={`py-4 rounded-2xl font-black transition-all border-2 ${
                        selectedFilter === filter ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100" : "border-gray-100 text-gray-500 hover:border-blue-200"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-gray-400 font-black uppercase text-xs tracking-widest mb-4 block">Custom Range</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Start Date</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900">20/07/25</span>
                      <Calendar size={18} className="text-blue-600" />
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-black uppercase text-gray-400 mb-1">End Date</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900">Today</span>
                      <Calendar size={18} className="text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowFilterModal(false)}
              className="w-full mt-10 bg-[#0063BF] text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all"
            >
              Apply Filter
            </button>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full">
            <button onClick={() => setShowCancelModal(false)} className="mb-4">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-xl font-bold text-red-600 mb-4">
              Exchange was cancelled
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              This transaction was cancelled by our partner or it has been
              cancelled by you
            </p>
            <button
              onClick={() => setShowCancelModal(false)}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold mb-3"
            >
              Ok, I got it
            </button>
            <button className="w-full bg-blue-50 text-blue-600 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2">
              <span>Message Support</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default HistoryPage;

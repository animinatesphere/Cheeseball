import React, { useState } from "react";
import { ChevronLeft, SlidersHorizontal, ArrowRight, Calendar } from "lucide-react";

const AdminHistory = ({ onBack }) => {
  const [showFilter, setShowFilter] = useState(false);

  const transactions = [
    { id: 1, date: "02 July 2023", from: { amount: "5000", currency: "USDT", symbol: "TRC-20", icon: "T" }, to: { amount: "0.002445", currency: "BTC", icon: "₿" }, status: "Waiting", exchangeId: "voec666krovitepmd" },
    { id: 2, date: "02 July 2023", from: { amount: "5000", currency: "USDT", symbol: "TRC-20", icon: "T" }, to: { amount: "0.002445", currency: "BTC", icon: "₿" }, status: "Approved", exchangeId: "voec666krovitepmd" },
    { id: 3, date: "02 July 2023", from: { amount: "5000", currency: "USDT", symbol: "TRC-20", icon: "T" }, to: { amount: "0.002445", currency: "BTC", icon: "₿" }, status: "Cancel", exchangeId: "voec666krovitepmd" },
  ];

  const getStatusInfo = (status) => {
    switch (status) {
      case "Waiting": return { color: "text-orange-500 bg-orange-50", label: "Pending" };
      case "Approved": return { color: "text-green-600 bg-green-50", label: "Success" };
      case "Cancel": return { color: "text-red-500 bg-red-50", label: "Revoked" };
      default: return { color: "text-gray-500 bg-gray-50", label: status };
    }
  };

  return (
    <div className="flex-1 overflow-y-auto pb-32 animate-fade-in">
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="p-2.5 hover:bg-gray-100 rounded-xl transition-all active:scale-95">
                <ChevronLeft className="w-6 h-6 text-gray-900" />
              </button>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Audit Trail</h1>
            </div>
            <button
              onClick={() => setShowFilter(true)}
              className="bg-gray-50 p-2.5 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-95"
            >
              <SlidersHorizontal className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="space-y-8">
          {transactions.map((transaction, index) => {
            const showDate = index === 0 || transactions[index - 1].date !== transaction.date;
            const statusInfo = getStatusInfo(transaction.status);
            
            return (
              <div key={transaction.id} className="space-y-4">
                {showDate && (
                   <div className="flex items-center gap-4 px-2">
                      <span className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">{transaction.date}</span>
                      <div className="h-px bg-gray-100 flex-1"></div>
                   </div>
                )}

                <div className="bg-white rounded-[2rem] p-6 sm:p-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-6 sm:gap-8 hover:shadow-2xl border border-gray-50 transition-all cursor-pointer group">
                  <div className="flex-1 flex items-center justify-between sm:justify-start gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-50 group-hover:scale-110 transition-transform">
                        {transaction.from.icon}
                      </div>
                      <div>
                        <p className="font-black text-gray-900 leading-tight truncate max-w-[120px] sm:max-w-none">
                          {transaction.from.amount} {transaction.from.currency}
                        </p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                          {transaction.from.symbol}
                        </p>
                      </div>
                    </div>

                    <ArrowRight className="text-blue-600 shrink-0 group-hover:translate-x-1 transition-transform" />

                    <div className="flex items-center gap-4 text-right sm:text-left">
                      <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-50 order-last sm:order-first group-hover:scale-110 transition-transform">
                        {transaction.to.icon}
                      </div>
                      <div className="order-first sm:order-last">
                        <p className="font-black text-gray-900 leading-tight truncate max-w-[120px] sm:max-w-none">
                          {transaction.to.amount} {transaction.to.currency}
                        </p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1"> Settlement Asset </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 sm:pl-8 sm:border-l border-gray-50">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest"> ID: {transaction.exchangeId.slice(-8)} </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminHistory;

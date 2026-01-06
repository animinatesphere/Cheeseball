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
    {
      id: 1,
      date: "02 July 2023",
      from: { amount: "5000", currency: "USDT", symbol: "TRC-20", icon: "T" },
      to: { amount: "0.002445", currency: "BTC", icon: "₿" },
      status: "Waiting",
      exchangeId: "Exchange ID:voec666krovitepmd",
    },
    {
      id: 2,
      date: "02 July 2023",
      from: { amount: "5000", currency: "USDT", symbol: "TRC-20", icon: "T" },
      to: { amount: "0.002445", currency: "BTC", icon: "₿" },
      status: "Approved",
      exchangeId: "Exchange ID:voec666krovitepmd",
    },
    {
      id: 3,
      date: "02 July 2023",
      from: { amount: "5000", currency: "USDT", symbol: "TRC-20", icon: "T" },
      to: { amount: "0.002445", currency: "BTC", icon: "₿" },
      status: "Cancel",
      exchangeId: "Exchange ID:voec666krovitepmd",
    },
    {
      id: 4,
      date: "02 July 2023",
      from: { amount: "5000", currency: "USDT", symbol: "TRC-20", icon: "T" },
      to: { amount: "0.002445", currency: "BTC", icon: "₿" },
      status: "Waiting",
      exchangeId: "Exchange ID:voec666krovitepmd",
    },
    {
      id: 5,
      date: "02 July 2023",
      from: { amount: "5000", currency: "USDT", symbol: "TRC-20", icon: "T" },
      to: { amount: "0.002445", currency: "BTC", icon: "₿" },
      status: "Approved",
      exchangeId: "Exchange ID:voec666krovitepmd",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Waiting":
        return "text-orange-500 bg-orange-50";
      case "Approved":
        return "text-green-600 bg-green-50";
      case "Cancel":
        return "text-red-500 bg-red-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={() => onNavigate("rates")} className="mr-4">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-semibold">Swap History</h1>
        </div>
        <button
          onClick={() => setShowFilterModal(true)}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <SlidersHorizontal size={20} />
        </button>
      </div>

      {/* Transaction List */}
      <div className="px-4 py-4 space-y-4">
        {transactions.map((transaction, index) => (
          <div key={transaction.id}>
            {(index === 0 ||
              transactions[index - 1].date !== transaction.date) && (
              <h3 className="text-sm font-semibold text-gray-700 mb-3 mt-2">
                {transaction.date}
              </h3>
            )}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                {/* From Currency */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                    {transaction.from.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {transaction.from.amount} {transaction.from.currency}
                    </p>
                    <p className="text-xs text-gray-500">
                      {transaction.from.symbol}
                    </p>
                  </div>
                </div>

                {/* Arrow */}
                <ArrowRight
                  className="text-blue-600 flex-shrink-0 mx-2"
                  size={20}
                />

                {/* To Currency */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    {transaction.to.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {transaction.to.amount} {transaction.to.currency}
                    </p>
                    <p className="text-xs text-gray-500">
                      {transaction.to.currency}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status and Exchange ID */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    transaction.status
                  )}`}
                >
                  {transaction.status}
                </span>
                <p className="text-xs text-blue-600 font-medium">
                  {transaction.exchangeId}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-6 animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <button onClick={() => setShowFilterModal(false)}>
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
              <h2 className="text-lg font-bold">Filter</h2>
              <div className="w-6"></div>
            </div>

            {/* Time Filter */}
            <div className="flex space-x-2 mb-6">
              {["All", "Today", "Week", "Month"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                    selectedFilter === filter
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {filter === "All" && (
                    <svg
                      className="w-4 h-4 inline mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {filter}
                </button>
              ))}
            </div>

            {/* Custom Dates */}
            <h3 className="font-bold text-gray-900 mb-3">Custom dates</h3>
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1">
                <label className="text-sm text-gray-600 mb-1 block">From</label>
                <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
                  <span className="flex-1 text-sm text-gray-700">20/07/25</span>
                  <Calendar size={16} className="text-gray-400" />
                </div>
              </div>
              <div className="flex-1">
                <label className="text-sm text-gray-600 mb-1 block">To</label>
                <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
                  <span className="flex-1 text-sm text-blue-600">20/07/25</span>
                  <Calendar size={16} className="text-gray-400" />
                </div>
              </div>
            </div>

            {/* Currencies */}
            <h3 className="font-bold text-gray-900 mb-3">Currencies</h3>
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-2">You send</p>
              <div className="flex items-center justify-between bg-gray-100 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    ₿
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Bitcoin</p>
                    <p className="text-xs text-gray-500">BTC</p>
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">You get</p>
              <div className="flex items-center justify-between bg-gray-100 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                    T
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">5000 USDT</p>
                    <p className="text-xs text-gray-500">TRC-20</p>
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Status */}
            <h3 className="font-bold text-gray-900 mb-3">Status</h3>
            <div className="flex space-x-2 mb-6">
              {["Waiting", "Waiting", "Waiting"].map((status, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedStatus(status)}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                    idx === 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {status}
                  {idx === 1 && " ✕"}
                </button>
              ))}
            </div>

            {/* Actions */}
            <button className="text-blue-600 font-semibold mb-3 w-full text-center">
              Clear all
            </button>
            <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold">
              Ok, I got it
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

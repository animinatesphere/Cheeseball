import React, { useState } from "react";
import { MessageCircle, ChevronRight, Bookmark } from "lucide-react";

const SupportPage = ({ onNavigate }) => {
  const [appUpdates, setAppUpdates] = useState(true);
  const [ordersUpdate, setOrdersUpdate] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Support</h1>
      </div>

      {/* Contact Support Section */}
      <div className="p-6">
        <div className="bg-gray-100 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-blue-600">
              Contact Cheeseball support
            </h2>
            <MessageCircle className="text-blue-600" size={24} />
          </div>

          <div className="flex items-center bg-white rounded-lg p-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
              <MessageCircle className="text-white" size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Chat Cheeseball Support on Whatsapp
              </p>
              <p className="text-xs text-gray-500">+234 901 2345 678</p>
            </div>
            <ChevronRight className="text-gray-400" size={20} />
          </div>
        </div>
      </div>

      {/* Address Book Section */}
      <div className="px-6 pb-6">
        <h3 className="text-sm font-medium text-gray-500 mb-3">Address book</h3>
        <button
          onClick={() => onNavigate && onNavigate("address-book")}
          className="w-full bg-gray-100 rounded-xl p-4 flex items-center justify-between"
        >
          <span className="text-base font-medium text-gray-900">
            Address Book
          </span>
          <Bookmark className="text-blue-600" size={20} />
        </button>
      </div>

      {/* Push Notifications Section */}
      <div className="px-6 pb-6">
        <h3 className="text-sm font-medium text-gray-500 mb-3">
          Push Notifications
        </h3>
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <span className="text-base font-medium text-gray-900">
              App updates
            </span>
            <button
              onClick={() => setAppUpdates(!appUpdates)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                appUpdates ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  appUpdates ? "transform translate-x-6" : ""
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4">
            <span className="text-base font-medium text-gray-900">
              Orders Update
            </span>
            <button
              onClick={() => setOrdersUpdate(!ordersUpdate)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                ordersUpdate ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  ordersUpdate ? "transform translate-x-6" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex items-center justify-around py-2">
          <button
            onClick={() => onNavigate && onNavigate("rates")}
            className="flex flex-col items-center py-2 px-4"
          >
            <svg
              className="w-6 h-6 text-gray-400 mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            <span className="text-xs text-gray-600">Rate</span>
          </button>

          <button
            onClick={() => onNavigate && onNavigate("buy")}
            className="flex flex-col items-center py-2 px-4"
          >
            <svg
              className="w-6 h-6 text-gray-400 mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="text-xs text-gray-600">Buy</span>
          </button>

          <button
            onClick={() => onNavigate && onNavigate("history")}
            className="flex flex-col items-center py-2 px-4"
          >
            <svg
              className="w-6 h-6 text-gray-400 mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="text-xs text-gray-600">History</span>
          </button>

          <button
            onClick={() => onNavigate && onNavigate("support")}
            className="flex flex-col items-center py-2 px-4"
          >
            <svg
              className="w-6 h-6 text-blue-600 mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-xs text-blue-600 font-medium">Support</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;

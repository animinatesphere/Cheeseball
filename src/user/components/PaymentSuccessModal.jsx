import React from "react";

const PaymentSuccessModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 animate-fade-in z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 animate-bounce-in text-center relative">
        <button
          onClick={onClose}
          className="absolute top-6 left-6 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-8 mt-4">
          Your payment was successful
        </h2>

        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center animate-bounce-in">
            <svg
              className="w-16 h-16 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <p className="text-gray-600 mb-8">
          Your wallet will be credited shortly
        </p>

        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
        >
          Ok, I got it
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessModal;

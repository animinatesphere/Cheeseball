import React from "react";

const ExchangePageModal = ({ onAccept, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 animate-fade-in z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-bounce-in">
        <div className="flex justify-between items-start mb-6">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
          <div className="w-24 h-1 bg-gray-300 rounded-full mx-auto"></div>
          <div className="w-6"></div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Exchange Page
        </h2>

        <p className="text-gray-600 text-center leading-relaxed mb-8">
          You will be redirected to the page operated by our partner. Please
          don't leave our partner's page until all exchange information has been
          provided
        </p>

        <button
          onClick={onAccept}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
        >
          Ok, I got it
        </button>
      </div>
    </div>
  );
};

export default ExchangePageModal;

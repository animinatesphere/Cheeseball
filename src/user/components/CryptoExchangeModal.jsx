import React, { useState } from "react";

const CryptoExchangeModal = ({ onAccept, onClose }) => {
  const [agreed, setAgreed] = useState(true);
  const [termsAgreed, setTermsAgreed] = useState(false);

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

        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Crypto Exchange
        </h2>

        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          The crypto exchange is being handled by Mercuryo, Cheeseball's
          independent partner. After acceptance o the Terms of Service specified
          below, you'll be automatically redirected to the web-page operated
          fully and exclusively by Mercuryo
        </p>

        <div className="space-y-4 mb-6">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-5 h-5 mt-0.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              Mercuryo is a separate platform owned by a third party, and
              Cheeseball does not assume any liability or any loss or damage
              caused by your usage of Mercuryo's services. By using such third
              party service you agree to Mercuryo{" "}
              <span className="text-blue-600">Terms of Service</span> and{" "}
              <span className="text-blue-600">Privacy Policy</span>.
            </span>
          </label>

          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={termsAgreed}
              onChange={(e) => setTermsAgreed(e.target.checked)}
              className="w-5 h-5 mt-0.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              By using this website, you agree with our{" "}
              <span className="text-blue-600">Terms of Service</span>
            </span>
          </label>
        </div>

        <button
          onClick={onAccept}
          disabled={!agreed || !termsAgreed}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          Ok, I got it
        </button>
      </div>
    </div>
  );
};

export default CryptoExchangeModal;

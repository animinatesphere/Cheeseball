import React, { useState } from "react";
import { ArrowLeft, Copy } from "lucide-react";

const BuyCryptoAddress = ({ onBack, onCreateExchange }) => {
  const [address, setAddress] = useState("");

  return (
    <div className="min-h-screen bg-white animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 shadow-lg">
          <div className="flex items-center space-x-4 mb-2">
            <button onClick={onBack}>
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold">Buy Crypto</h1>
          </div>
          <p className="text-blue-100 ml-10">Enter the address</p>
        </div>

        <div className="px-6 py-8">
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                T
              </div>
              <div>
                <p className="font-bold">5,000,000 NGN</p>
                <p className="text-gray-500 text-sm">TRC-20</p>
              </div>
            </div>
            <ArrowLeft className="w-6 h-6 text-gray-400 rotate-180" />
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl">
                ₿
              </div>
              <div>
                <p className="font-bold">0.002445 BTC</p>
                <p className="text-gray-500 text-sm">BTC</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <label className="text-gray-800 font-bold mb-3 block">
              Enter Bitcoin address of the recipient
            </label>
            <div className="relative">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Bitcoin address"
                className="w-full px-4 py-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2 text-blue-600 font-bold px-3 py-2 hover:bg-blue-50 rounded-lg transition-all">
                <span>Paste</span>
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button
            onClick={onCreateExchange}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all mb-32"
          >
            Create Exchange
          </button>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-gray-600 text-sm mb-1">Fiat Method</p>
            <p className="text-blue-600 font-bold text-lg">PAYSTACK</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyCryptoAddress;

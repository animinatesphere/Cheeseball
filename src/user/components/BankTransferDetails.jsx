import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";

const BankTransferDetails = ({ onBack, onContinue }) => {
  const [copied, setCopied] = useState({
    account: false,
    name: false,
    bank: false,
  });

  const handleCopy = (field, value) => {
    navigator.clipboard.writeText(value);
    setCopied({ ...copied, [field]: true });
    setTimeout(() => setCopied({ ...copied, [field]: false }), 2000);
  };

  return (
    <div className="min-h-screen bg-white animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 shadow-lg flex justify-between items-center">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="font-semibold">NG</span>
            <span className="text-xl">▼</span>
          </div>
        </div>

        <div className="px-6 py-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">
            Complete your order
          </h1>

          <div className="mb-6">
            <p className="text-gray-600 font-semibold mb-4">You pay by</p>
            <div className="space-y-3">
              <label className="flex items-center justify-between bg-blue-50 p-4 rounded-xl cursor-pointer border-2 border-blue-600">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="payment"
                    checked
                    readOnly
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className="font-bold text-blue-600">Bank Transfer</span>
                </div>
                <div className="text-2xl">🏦</div>
              </label>

              <label className="flex items-center justify-between bg-white border-2 border-gray-200 p-4 rounded-xl cursor-pointer">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="payment"
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className="font-bold text-gray-700">Debit Card</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-700 font-bold text-xs">VISA</span>
                  <span className="text-orange-500 font-bold text-xs">MC</span>
                </div>
              </label>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-center text-red-600 font-semibold">
              This account expires in{" "}
              <span className="font-bold text-xl">29:05</span>
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div>
              <label className="text-gray-600 text-sm mb-2 block">
                Account No:
              </label>
              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                <span className="font-bold text-gray-800">Cheese Balls 05</span>
                <button
                  onClick={() => handleCopy("account", "Cheese Balls 05")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all"
                >
                  {copied.account ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            <div>
              <label className="text-gray-600 text-sm mb-2 block">
                Account Name
              </label>
              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                <span className="font-bold text-gray-800">Cheese Balls 05</span>
                <button
                  onClick={() => handleCopy("name", "Cheese Balls 05")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all"
                >
                  {copied.name ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            <div>
              <label className="text-gray-600 text-sm mb-2 block">
                Bank Name
              </label>
              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                <span className="font-bold text-gray-800">Loopay</span>
                <button
                  onClick={() => handleCopy("bank", "Loopay")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all"
                >
                  {copied.bank ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
          >
            I've sent the money
          </button>
        </div>

        <div className="px-6 pb-6 text-center">
          <p className="text-gray-400 text-sm">Cryptopowered by Paystack</p>
        </div>
      </div>
    </div>
  );
};

export default BankTransferDetails;

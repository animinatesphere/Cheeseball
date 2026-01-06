import React, { useState, useEffect } from "react";
import { ArrowLeft, Share2, Copy } from "lucide-react";

const AwaitingDeposit = ({ onBack }) => {
  const depositAddress = "0x52d39886F8022764880Fff88DdE280F6C5D3CcD";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [qrSquares, setQrSquares] = useState(() =>
    Array.from({ length: 64 }, () => false)
  );

  useEffect(() => {
    const squares = Array.from({ length: 64 }, () => Math.random() > 0.5);
    const timer = setTimeout(() => setQrSquares(squares), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 shadow-sm flex justify-between items-center">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-all">
            <Share2 className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6 py-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">
            Awaiting your deposit
          </h1>

          <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl p-6 mb-6 shadow-lg">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-bold">SWAP ID:</span> Hhdf u6784jdHDGA7
              </p>
              <p className="text-sm text-gray-600">
                Please send 5000 USDT to the deposit address
              </p>
            </div>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                T
              </div>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-800">5000 USDT</p>
              <p className="text-gray-600">TRC-20</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
            <p className="text-center font-semibold text-gray-800 mb-3">
              Deposit address
            </p>
            <p className="text-center text-blue-600 font-mono text-sm mb-4 break-all">
              {depositAddress}
            </p>
            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-center space-x-2 text-blue-600 font-semibold py-2 hover:bg-blue-50 rounded-lg transition-all"
            >
              <span>{copied ? "Copied!" : "Copy"}</span>
              <Copy className="w-4 h-4" />
            </button>

            <div className="mt-6 flex justify-center">
              <div className="w-48 h-48 bg-gray-900 rounded-xl flex items-center justify-center">
                <div className="grid grid-cols-8 gap-1 p-4">
                  {qrSquares.map((on, i) => (
                    <div
                      key={i}
                      className={`w-4 h-4 ${on ? "bg-white" : "bg-gray-900"}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <p className="text-center text-orange-600 text-sm mt-6 font-semibold">
              Only TRC network is supported. Please ensure your deposit is made
              on TRC network.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
            <p className="text-center text-gray-600 mb-3">You get</p>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl">
                ₿
              </div>
              <div>
                <p className="font-bold text-lg">0.002445 BTC</p>
                <p className="text-gray-500 text-sm">BTC</p>
              </div>
            </div>
          </div>

          <button
            onClick={onBack}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default AwaitingDeposit;

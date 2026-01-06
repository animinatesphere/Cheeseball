import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
const OTPPage = ({ onBack, onContinue }) => {
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    const id = setInterval(() => {
      setCountdown((c) => {
        if (c <= 0) {
          clearInterval(id);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

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
            Enter OTP sent to your mail
          </h1>

          <div className="mb-6">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="OTP"
              className="w-full px-4 py-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-center text-2xl tracking-widest font-bold"
              maxLength="6"
            />
          </div>

          <div className="flex justify-between items-center mb-8">
            <button className="text-blue-600 font-semibold hover:underline">
              Resend code
            </button>
            <span className="text-gray-500">
              You can resend code in {countdown}s
            </span>
          </div>

          <button
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
          >
            Continue
          </button>
        </div>

        <div className="px-6 pb-6 text-center">
          <p className="text-gray-400 text-sm">Cryptopowered by Paystack</p>
        </div>
      </div>
    </div>
  );
};

export default OTPPage;

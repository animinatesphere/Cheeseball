import React, { useState } from "react";
import { ArrowLeft, Clock } from "lucide-react";
const CompleteOrderEmail = ({ onBack, onContinue }) => {
  const [email, setEmail] = useState("");
  const [receiveUpdates, setReceiveUpdates] = useState(false);

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
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <label className="flex items-start space-x-3 mb-8 cursor-pointer">
            <input
              type="checkbox"
              checked={receiveUpdates}
              onChange={(e) => setReceiveUpdates(e.target.checked)}
              className="w-5 h-5 mt-0.5 text-blue-600 rounded border-gray-300"
            />
            <span className="text-gray-600">
              Want to receive updates from us?
            </span>
          </label>

          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-800">Your order</h3>
                <p className="text-gray-500 text-sm">All fees included</p>
              </div>
              <div className="text-right">
                <p className="text-blue-600 font-bold">
                  0.00212 BTC for ₦5,000,000
                </p>
                <p className="text-gray-500 text-sm flex items-center justify-end space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Update in 5 sec</span>
                </p>
              </div>
            </div>

            <div className="space-y-3 border-t border-gray-200 pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">1 BTC =</span>
                <span className="font-bold">₦89620.26</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pay for 0.00217609 BTC</span>
                <span className="font-bold">₦4,980,000.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">FEE:</span>
                <span className="font-bold">₦20,000.00</span>
              </div>
            </div>
          </div>

          <button
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all mb-6"
          >
            Continue
          </button>

          <p className="text-center text-gray-600 text-sm">
            By clicking "Continue" you agree to the{" "}
            <span className="text-blue-600">Terms of Service</span>,{" "}
            <span className="text-blue-600">Privacy Policy</span> and{" "}
            <span className="text-blue-600">Cookies Policy</span>
          </p>
        </div>

        <div className="px-6 pb-6 text-center">
          <p className="text-gray-400 text-sm">Cryptopowered by Paystack</p>
        </div>
      </div>
    </div>
  );
};
export default CompleteOrderEmail;

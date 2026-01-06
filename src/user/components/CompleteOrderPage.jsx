import React from "react";
import { Clock } from "lucide-react";

const CompleteOrderPage = ({ onBack, onBuyWithBankTransfer }) => {
  return (
    <div className="min-h-screen bg-white animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 shadow-lg flex justify-between items-center">
          <button
            onClick={onBack}
            className="text-blue-100 hover:text-white font-semibold"
          >
            Close
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

          <div className="mb-8">
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

              <label className="flex items-center justify-between bg-white border-2 border-gray-200 p-4 rounded-xl cursor-pointer hover:border-gray-300 transition-all">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="payment"
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className="font-bold text-gray-700">Debit Card</span>
                </div>
                <div className="flex items-center space-x-2">
                  <img
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='25' viewBox='0 0 40 25'%3E%3Crect fill='%231434CB' width='40' height='25' rx='3'/%3E%3Ctext x='20' y='17' font-family='Arial' font-size='10' font-weight='bold' fill='white' text-anchor='middle'%3EVISA%3C/text%3E%3C/svg%3E"
                    alt="VISA"
                    className="h-6"
                  />
                  <img
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='25' viewBox='0 0 40 25'%3E%3Crect fill='%23EB001B' width='18' height='25' rx='2'/%3E%3Crect fill='%23FF5F00' x='11' width='18' height='25' rx='2'/%3E%3Crect fill='%23F79E1B' x='22' width='18' height='25' rx='2'/%3E%3C/svg%3E"
                    alt="Mastercard"
                    className="h-6"
                  />
                </div>
              </label>
            </div>
          </div>

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
            onClick={onBuyWithBankTransfer}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
          >
            Buy with Bank Transfer
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteOrderPage;

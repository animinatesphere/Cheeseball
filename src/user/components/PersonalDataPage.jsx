// =====================================================
import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";

const PersonalDataPage = ({ onBack, onContinue }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Personal data
          </h1>
          <p className="text-gray-600 mb-8">
            Enter your personal data as it appears on your ID
          </p>

          <div className="mb-6">
            <label className="text-gray-600 text-sm mb-2 block">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="mb-8">
            <label className="text-gray-600 text-sm mb-2 block">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
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

export default PersonalDataPage;

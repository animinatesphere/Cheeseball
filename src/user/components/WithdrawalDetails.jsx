import React, { useState } from "react";
import { ArrowLeft, Landmark, CheckCircle2 } from "lucide-react";

const WithdrawalDetails = ({ onBack, onContinue, transactionData }) => {
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");

  return (
    <div className="min-h-screen bg-white animate-fade-in pb-24">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <button onClick={onBack} className="mb-8 p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-4xl font-black mb-2 tracking-tight">Withdrawal Details</h1>
          <p className="text-blue-200 font-medium">Where should we send your {transactionData?.toCurrency || 'funds'}?</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8">
        <div className="max-w-3xl mx-auto bg-gray-50 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 lg:p-12 border border-gray-100 shadow-sm">
          <div className="space-y-8 mb-10">
             <div>
                <label className="text-gray-400 font-black uppercase text-xs tracking-widest mb-4 block px-2">Select Bank</label>
                <div className="relative">
                   <select 
                     value={bankName}
                     onChange={(e) => setBankName(e.target.value)}
                     className="w-full px-8 py-6 bg-white rounded-2xl border-2 border-transparent focus:border-blue-100 outline-none transition-all text-lg font-bold text-gray-900 appearance-none shadow-sm cursor-pointer"
                   >
                     <option value="">Select Bank...</option>
                     <option value="access">Access Bank</option>
                     <option value="gtb">Guaranty Trust Bank</option>
                     <option value="zenith">Zenith Bank</option>
                     <option value="kuda">Kuda Microfinance Bank</option>
                     <option value="opay">OPay</option>
                   </select>
                   <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <Landmark size={20}/>
                   </div>
                </div>
             </div>

             <div>
                <label className="text-gray-400 font-black uppercase text-xs tracking-widest mb-4 block px-2">Account Number</label>
                <input
                  type="text"
                  placeholder="0000000000"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-8 py-6 bg-white rounded-2xl border-2 border-transparent focus:border-blue-100 outline-none transition-all text-lg font-bold text-gray-900 placeholder-gray-200 shadow-sm"
                />
             </div>

             <div>
                <label className="text-gray-400 font-black uppercase text-xs tracking-widest mb-4 block px-2">Account Name</label>
                <input
                  type="text"
                  placeholder="EX: JOHN DOE"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full px-8 py-6 bg-white rounded-2xl border-2 border-transparent focus:border-blue-100 outline-none transition-all text-lg font-bold text-gray-900 placeholder-gray-200 shadow-sm"
                />
             </div>
          </div>

          <div className="bg-green-50 p-6 rounded-2xl border border-green-100 flex items-center gap-4 mb-10">
             <div className="p-2 bg-green-500 text-white rounded-full"><CheckCircle2 size={16}/></div>
             <p className="text-sm text-green-800 font-bold">Payments are processed within 15-30 minutes of verification.</p>
          </div>

          <button
            onClick={() => onContinue({
              bankName,
              accountNumber,
              accountName
            })}
            disabled={!bankName || !accountNumber || !accountName}
            className="w-full bg-[#0063BF] hover:bg-blue-700 text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl transition-all flex items-center justify-center gap-4 group disabled:opacity-50"
          >
            <span>Confirm Payout Details</span>
            <ArrowLeft className="w-6 h-6 rotate-180 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalDetails;

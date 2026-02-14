import React, { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { usePaystackPayment } from "react-paystack";
import { PAYSTACK_PUBLIC_KEY } from "../../lib/paystack";
import { supabase } from "../../lib/supabaseClient";

const BankTransferDetails = ({ onBack, onContinue, transactionData }) => {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState({
    account: false,
    name: false,
    bank: false,
  });

  const config = {
    reference: (new Date()).getTime().toString(),
    email: "user@example.com", 
    amount: Math.round(Number(transactionData?.fromAmount || 0) * 100),
    publicKey: PAYSTACK_PUBLIC_KEY,
  };

  const onSuccess = (reference) => {
    onContinue(); // Success modal via CurrencyPage
  };

  const onClose = () => {
    setLoading(false);
  };

  const initializePayment = usePaystackPayment(config);

  const handleCopy = (field, value) => {
    navigator.clipboard.writeText(value);
    setCopied({ ...copied, [field]: true });
    setTimeout(() => setCopied({ ...copied, [field]: false }), 2000);
  };

  return (
    <div className="min-h-screen bg-white animate-fade-in pb-24">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <button onClick={onBack} className="mb-6 sm:mb-8 p-2.5 sm:p-3 bg-white/10 hover:bg-white/20 rounded-xl sm:rounded-2xl transition-all border border-white/10">
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black mb-1 sm:mb-2 tracking-tight">Checkout</h1>
              <p className="text-blue-200 text-sm sm:text-base font-medium">Securely complete your transaction</p>
            </div>
            <div className="hidden sm:flex items-center gap-3 bg-white/10 rounded-2xl px-5 py-3 border border-white/10 backdrop-blur-md">
              <span className="font-black text-sm uppercase tracking-widest">Paystack Secured</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6 sm:-mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          <div className="space-y-6 sm:space-y-8">
            <div className="bg-gray-50 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 border border-gray-100">
               <label className="text-gray-400 font-black uppercase text-[10px] sm:text-xs tracking-widest mb-4 sm:mb-6 block px-1">Payment Method</label>
               <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-between bg-white px-6 sm:px-8 py-4 sm:py-6 rounded-[1.5rem] sm:rounded-[2rem] border-2 border-blue-600 shadow-xl shadow-blue-50">
                    <div className="flex items-center gap-4 sm:gap-6">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-4 border-blue-600 flex items-center justify-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      </div>
                      <span className="font-black text-lg sm:text-xl text-blue-600">Bank Transfer</span>
                    </div>
                    <div className="text-2xl sm:text-3xl">🏦</div>
                  </div>

                  <button 
                    onClick={() => {
                        setLoading(true);
                        initializePayment(onSuccess, onClose);
                    }}
                    disabled={loading}
                    className="flex items-center justify-between bg-white px-6 sm:px-8 py-4 sm:py-6 rounded-[1.5rem] sm:rounded-[2rem] border-2 border-transparent hover:border-blue-100 transition-all group"
                  >
                    <div className="flex items-center gap-4 sm:gap-6">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-gray-300 group-hover:border-blue-400"></div>
                      <span className="font-black text-lg sm:text-xl text-gray-500 group-hover:text-blue-600">Pay with Card</span>
                    </div>
                    <div className="flex gap-2 sm:gap-2">
                       <span className="px-2 py-0.5 sm:py-1 bg-gray-200 rounded text-[9px] sm:text-[10px] font-black text-gray-500 uppercase">Visa</span>
                       <span className="px-2 py-0.5 sm:py-1 bg-gray-200 rounded text-[9px] sm:text-[10px] font-black text-gray-500 uppercase">Master</span>
                    </div>
                  </button>
               </div>
            </div>

            <div className="bg-red-50 border border-red-100 rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 flex flex-col items-center justify-center animate-pulse">
               <p className="text-red-900 font-black uppercase text-[10px] tracking-[0.2em] mb-2">Account Expires In</p>
               <p className="text-3xl sm:text-4xl font-black text-red-600 tabular-nums">29:05</p>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 lg:p-14 border border-gray-100 shadow-2xl flex flex-col">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-6 sm:mb-8">Payment Details</h2>
            
            <div className="space-y-4 sm:space-y-6 flex-1">
              {[
                { label: "Account Number", value: "0543210987" },
                { label: "Account Name", value: "CHEESE BALLS 05" },
                { label: "Bank Name", value: "LOOPAY" }
              ].map((item, i) => (
                <div key={i}>
                  <p className="text-gray-400 font-black uppercase text-[10px] sm:text-xs tracking-widest mb-2 sm:mb-3 px-2">{item.label}</p>
                  <div className="flex items-center justify-between bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 group hover:bg-gray-100 transition-colors">
                    <span className="font-black text-base sm:text-xl text-gray-900">{item.value}</span>
                    <button
                      onClick={() => handleCopy(item.label.toLowerCase().split(' ')[0], item.value)}
                      className="bg-[#0063BF] text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-black text-xs sm:text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-50 active:scale-95"
                    >
                      {copied[item.label.toLowerCase().split(' ')[0]] ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={onContinue}
              className="w-full mt-8 sm:mt-12 bg-[#0063BF] hover:bg-blue-700 text-white py-5 sm:py-6 rounded-[1.5rem] sm:rounded-[2rem] font-black text-lg sm:text-xl shadow-2xl shadow-blue-200 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-4 group"
            >
              <span>I've Made The Transfer</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-2 transition-transform">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankTransferDetails;

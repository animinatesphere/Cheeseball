import React from "react";
import { X, Copy } from "lucide-react";

const AdminAccountDetails = ({ onBack, onBackToIncome }) => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-32 animate-fade-in">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-6 sm:py-8 border-b border-gray-100 mb-8 sticky top-0 bg-white/80 backdrop-blur-md z-10 overflow-hidden">
          <button onClick={onBack} className="p-3 hover:bg-gray-100 rounded-xl transition-all active:scale-95">
            <X className="w-6 h-6 text-gray-900" />
          </button>
          <div className="text-center">
            <h1 className="text-xl font-black text-gray-900 tracking-tight">Profile Integrity</h1>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">
              Internal ID: cheese_balls_05_admin
            </p>
          </div>
          <div className="w-12"></div>
        </div>

        <div className="space-y-12">
          <section>
            <h3 className="text-gray-900 font-black uppercase text-xs tracking-[0.2em] ml-2 mb-6">Personal Identification</h3>
            <div className="space-y-4">
              {[
                { label: "Authorized Email", value: "Cheese Balls 05" },
                { label: "Legal Full Name", value: "Cheese Balls 05" },
                { label: "Mobile Endpoint", value: "Loopay" }
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 rounded-[1.5rem] p-6 border border-transparent hover:border-blue-100 transition-all group">
                  <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 leading-none">{item.label}</span>
                  <div className="flex items-center justify-between gap-4 font-bold text-gray-900">
                    <span className="truncate">{item.value}</span>
                    <button onClick={() => copyToClipboard(item.value)} className="bg-white p-2 rounded-xl border border-gray-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-gray-900 font-black uppercase text-xs tracking-[0.2em] ml-2 mb-6">Financial Settlement Details</h3>
            <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-transparent hover:border-blue-100 transition-all">
                <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 leading-none px-2">Primary USDT Settlement Address</span>
                <div className="bg-white p-6 rounded-2xl shadow-inner border border-gray-100 break-all font-mono text-xs font-bold text-gray-900 leading-relaxed mb-6">
                  Tcndjh73j6fhe78ej87hwey73h
                </div>
                <button
                  onClick={() => copyToClipboard("Tcndjh73j6fhe78ej87hwey73h")}
                  className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-blue-50 active:scale-95 transition-all"
                >
                  Synchronize Address
                </button>
            </div>
          </section>

          <button
            onClick={onBackToIncome}
            className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black text-xl shadow-2xl shadow-blue-200 transform hover:-translate-y-1 transition-all active:scale-[0.98]"
          >
            Acknowledge Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAccountDetails;

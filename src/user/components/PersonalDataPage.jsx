// =====================================================
import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";

const PersonalDataPage = ({ onBack, onContinue }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  return (
    <div className="min-h-screen bg-white animate-fade-in pb-24">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <button onClick={onBack} className="mb-8 p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-black mb-2 tracking-tight">Identity Profile</h1>
              <p className="text-blue-200 font-medium">Verify your personal information</p>
            </div>
            <div className="flex items-center gap-3 bg-white/10 rounded-2xl px-5 py-3 border border-white/10 backdrop-blur-md">
              <div className="w-6 h-6 rounded-full border-2 border-white/50 flex items-center justify-center">
                <div className="w-3 h-3 bg-green-400 rounded-full shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
              </div>
              <span className="font-black text-sm uppercase tracking-widest">NGN • Nigeria</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="max-w-3xl mx-auto bg-gray-50 rounded-[3rem] p-10 lg:p-14 border border-gray-100 shadow-sm">
          <div className="mb-12">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-4">Personal Details</h2>
            <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <p className="text-sm font-bold text-orange-900">Ensure names exactly match your government-issued ID.</p>
            </div>
          </div>

          <div className="space-y-10">
            <div>
              <label className="text-gray-400 font-black uppercase text-xs tracking-widest mb-4 block px-2">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Ex: David"
                className="w-full px-8 py-6 bg-white rounded-[1.5rem] border-2 border-transparent focus:border-blue-100 outline-none transition-all text-lg font-bold text-gray-900 placeholder-gray-200 shadow-sm"
              />
            </div>

            <div>
              <label className="text-gray-400 font-black uppercase text-xs tracking-widest mb-4 block px-2">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Ex: Oladapo"
                className="w-full px-8 py-6 bg-white rounded-[1.5rem] border-2 border-transparent focus:border-blue-100 outline-none transition-all text-lg font-bold text-gray-900 placeholder-gray-200 shadow-sm"
              />
            </div>

            <button
              onClick={onContinue}
              className="w-full bg-[#0063BF] hover:bg-blue-700 text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl shadow-blue-200 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-4 group mt-8"
            >
              <span>Verify & Continue</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-2 transition-transform">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Security powered by</span>
            <img src="https://paystack.com/assets/img/v3/logo/paystack-logo-vector.svg" alt="Paystack" className="h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};


export default PersonalDataPage;

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
    <div className="min-h-screen bg-white animate-fade-in pb-24">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex justify-between items-center mb-8">
            <button onClick={onBack} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10 font-black uppercase text-xs tracking-widest leading-none">
              Cancel Verification
            </button>
            <div className="flex items-center gap-3 bg-white/10 rounded-2xl px-5 py-3 border border-white/10 backdrop-blur-md">
              <div className="w-6 h-6 rounded-full border-2 border-white/50 flex items-center justify-center">
                <div className="w-3 h-3 bg-green-400 rounded-full shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
              </div>
              <span className="font-black text-sm uppercase tracking-widest">NGN • Nigeria</span>
            </div>
          </div>
          <h1 className="text-4xl font-black mb-2 tracking-tight">Email Verification</h1>
          <p className="text-blue-200 font-medium">Verify your email to secure this order</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-8">
        <div className="bg-white rounded-[3rem] p-10 lg:p-14 border border-gray-100 shadow-2xl flex flex-col items-center">
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-[1.5rem] flex items-center justify-center mb-10 shadow-lg shadow-blue-50/50">
             <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
             </svg>
          </div>
          
          <h2 className="text-3xl font-black text-gray-900 tracking-tight text-center mb-4">Enter 6-Digit Code</h2>
          <p className="text-gray-500 font-medium text-center mb-12">We just sent a verification code to your email</p>
          
          <div className="w-full max-w-md mb-12">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="••••••"
              className="w-full px-8 py-8 bg-gray-50 border-2 border-transparent focus:border-blue-100 rounded-[2.5rem] font-black text-gray-900 placeholder-gray-300 outline-none transition-all text-center text-4xl tracking-[0.5em] shadow-inner"
              maxLength="6"
            />
          </div>

          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6 mb-12 px-4">
            <button className="text-blue-600 font-black flex items-center gap-2 hover:translate-x-1 transition-transform">
              <span>Resend Verification Code</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0120.49 15"/>
              </svg>
            </button>
            <div className="flex items-center gap-3">
               <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
               <span className="text-gray-400 font-bold">Resend in <span className="text-blue-900 tabular-nums">{countdown}s</span></span>
            </div>
          </div>

          <button
            onClick={onContinue}
            className="w-full bg-[#0063BF] hover:bg-blue-700 text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl shadow-blue-200 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-4 group"
          >
            <span>Verify & Continue</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-2 transition-transform">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
          
          <p className="mt-12 text-gray-400 text-sm font-black uppercase tracking-widest">Cryptopowered by Paystack</p>
        </div>
      </div>
    </div>
  );
};

export default OTPPage;

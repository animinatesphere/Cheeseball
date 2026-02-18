import React, { useState, useEffect } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import Toast from "./Toast";

const OTPPage = ({ onBack, onContinue, email }) => {
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(90);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let id;
    if (countdown > 0) {
      id = setInterval(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    }
    return () => clearInterval(id);
  }, [countdown]);

  const handleResend = async () => {
    if (countdown > 0 || loading) return;

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + "/currency-change",
      },
    });

    if (error) {
      const errorStr = typeof error === 'string' ? error : (error.message || JSON.stringify(error));
      const isRateLimit = error.code === 'over_email_send_rate_limit' || errorStr.toLowerCase().includes("rate limit");
      
      setToast({
        message: isRateLimit
          ? "You've requested too many codes. Please wait 90 seconds before trying again." 
          : (error.message || "Request failed. Please try again."),
        type: "error"
      });
      if (isRateLimit) setCountdown(90);
    } else {
      setToast({ message: "Verification code resent successfully!", type: "success" });
      setCountdown(90);
    }
    setLoading(false);
  };

  const handleVerify = async () => {
    if (!otp || otp.length < 6 || loading) return;
    
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "magiclink",
    });

    if (error) {
      const errorStr = typeof error === 'string' ? error : (error.message || JSON.stringify(error));
      const isRateLimit = error.code === 'over_email_send_rate_limit' || errorStr.toLowerCase().includes("rate limit");
      const isExpired = errorStr.toLowerCase().includes("expired");

      setToast({
        message: isRateLimit 
          ? "Too many attempt. Please wait a moment." 
          : (isExpired ? "Code expired. Please resend." : (error.message || "Verification failed")),
        type: "error"
      });
    } else {
      setToast({ message: "Email verified successfully!", type: "success" });
      setTimeout(onContinue, 1000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white animate-fade-in pb-24">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
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
          
          <h2 className="text-3xl font-black text-gray-900 tracking-tight text-center mb-4">Enter Verification Code</h2>
          <p className="text-gray-500 font-medium text-center mb-12">We just sent a code to <span className="text-blue-600 break-all">{email}</span></p>
          
          <div className="w-full max-w-md mb-12">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="000000"
              className="w-full px-8 py-8 bg-gray-50 border-2 border-transparent focus:border-blue-100 rounded-[2.5rem] font-black text-gray-900 placeholder-gray-300 outline-none transition-all text-center text-4xl tracking-[0.5em] shadow-inner"
              maxLength="8"
            />
          </div>

          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6 mb-12 px-4">
            <button 
              onClick={handleResend}
              disabled={countdown > 0 || loading}
              className={`text-blue-600 font-black flex items-center gap-2 transition-all ${
                countdown > 0 || loading ? "opacity-50 cursor-not-allowed" : "hover:translate-x-1"
              }`}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0120.49 15"/>
                </svg>
              )}
              <span>Resend Verification Code</span>
            </button>
            <div className="flex items-center gap-3">
               <div className={`w-2 h-2 rounded-full ${countdown > 0 ? "bg-blue-600 animate-pulse" : "bg-gray-300"}`}></div>
               <span className="text-gray-400 font-bold">Resend in <span className="text-blue-900 tabular-nums">{countdown}s</span></span>
            </div>
          </div>

          <button
            onClick={handleVerify}
            className="w-full bg-[#0063BF] hover:bg-blue-700 text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl shadow-blue-200 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-4 group"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
              <>
                <span>Verify & Continue</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-2 transition-transform">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </>
            )}
          </button>
          
          <p className="mt-12 text-gray-400 text-sm font-black uppercase tracking-widest">Cryptopowered by Paystack</p>
        </div>
      </div>
    </div>
  );
};

export default OTPPage;

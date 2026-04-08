import React, { useState, useEffect } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import Toast from "./Toast";
import authService from "../../lib/authService";

const OTPPage = ({ onBack, onContinue, email }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let id;
    if (countdown > 0) {
      id = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(id);
  }, [countdown]);


  const handleResend = async () => {
    if (countdown > 0 || loading) return;

    try {
      await authService.resendOTP(email);
      setToast({ message: "Verification code sent successfully!", type: "success" });
      setCountdown(30);
    } catch (err) {
      setToast({ message: err.message || "Request failed. Please try again.", type: "error" });
      if (err.message?.toLowerCase().includes("rate limit") || err.message?.toLowerCase().includes("too many")) {
        setCountdown(30);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!otp || otp.length < 6 || loading) return;
    
    try {
      await authService.verifyOTP(email, otp);
      setToast({ message: "Email verified successfully!", type: "success" });
      setTimeout(onContinue, 1000);
    } catch (err) {
      setToast({ message: err.message || "Verification failed", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col mesh-gradient slide-in justify-center items-center py-12 px-4">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-md w-full card p-8 sm:p-10 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>

        <button
          onClick={onBack}
          className="absolute top-6 left-6 p-2 rounded-xl transition-all group hover:bg-white/5"
          style={{ color: "var(--text-muted)" }}
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </button>

        <div className="relative z-10">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20 shadow-lg shadow-blue-500/5">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black tracking-tight mb-2" style={{ color: "var(--text-primary)" }}>
              Verify Your Email
            </h2>
            <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
              We've sent a 6-digit code to <span className="text-blue-400 font-bold break-all">{email}</span>
            </p>
          </div>

          <div className="space-y-8">
            <div className="relative group">
              <div className="relative glow-ring rounded-[2rem]">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="000000"
                  className="w-full py-6 bg-white/5 border-2 border-white/10 rounded-[2rem] font-black text-slate-900 placeholder-white/20 outline-none transition-all text-center text-4xl tracking-[0.5em] focus:border-blue-500 focus:bg-white/10 focus:shadow-lg focus:shadow-blue-500/20"
                  maxLength="6"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handleResend}
                  disabled={loading || countdown > 0}
                  className={`text-xs font-bold transition-all flex items-center gap-2 ${
                    loading || countdown > 0 ? "opacity-30 cursor-not-allowed" : "text-blue-400 hover:text-blue-300"
                  }`}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0120.49 15" />
                    </svg>
                  )}
                  <span>Resend Code</span>
                </button>
                {countdown > 0 && (
                  <span className="text-[10px] font-black uppercase tracking-widest tabular-nums" style={{ color: "var(--text-muted)" }}>
                    {countdown}s
                  </span>
                )}
              </div>

              <button
                onClick={handleVerify}
                disabled={loading || otp.length < 6}
                className="btn-primary w-full py-4 text-base flex items-center justify-center gap-3 group"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <span>Verify & Continue</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>

            <div
              className="mt-8 pt-8 text-center"
              style={{ borderTop: "1px solid var(--border-primary)" }}
            >
              <p
                className="text-[10px] font-black uppercase tracking-widest"
                style={{ color: "var(--text-muted)" }}
              >
                Secured by Cheeseball Infrastructure
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPPage;

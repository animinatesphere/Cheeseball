import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import logo from "../../assets/CHEESEBALL 1.png";
import { ArrowRight, Mail, KeyRound, Loader2 } from "lucide-react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("email"); // 'email' or 'otp'
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + "/buy-crypto",
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setStep("otp");
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "magiclink", // or 'signup' depending on configuration
    });

    if (error) {
      setError(error.message);
    } else {
      navigate("/buy-crypto");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-blue-50 page-container slide-in justify-center items-center py-12">
      <div className="max-w-md w-full bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-2xl shadow-blue-100 border border-blue-50 relative overflow-hidden">
        {/* Abstract background element */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <img src={logo} alt="Cheeseball Logo" className="w-full max-w-[220px] mx-auto mb-10" />

          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2 op">
              {step === "email" ? "Secure Login" : "Verify Identity"}
            </h2>
            <p className="text-gray-500 text-sm font-medium op">
              {step === "email" 
                ? "Enter your email to receive a secure access code" 
                : `We've sent a secure code to ${email}`}
            </p>
          </div>

          <form onSubmit={step === "email" ? handleSendOtp : handleVerifyOtp} className="space-y-6">
            {step === "email" ? (
              <div className="relative group">
                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 px-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-14 pr-6 py-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-100 outline-none transition-all font-bold text-gray-900 shadow-inner"
                  />
                </div>
              </div>
            ) : (
              <div className="relative group">
                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 px-1">Security Code</label>
                <div className="relative">
                  <KeyRound className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="text"
                    required
                    maxLength={8}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="0 0 0 0 0 0 0 0"
                    className="w-full pl-14 pr-6 py-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-100 outline-none transition-all font-black text-center text-xl sm:text-2xl tracking-[0.3em] text-gray-900 shadow-inner"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold border border-red-100 flex items-center gap-3 animate-shake">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-200 transition-all transform active:scale-95 flex items-center justify-center gap-3 group"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <span>{step === "email" ? "Send Access Code" : "Verify & Sign In"}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {step === "otp" && (
            <button
              onClick={() => setStep("email")}
              className="w-full mt-6 text-blue-600 text-sm font-black uppercase tracking-widest hover:text-blue-700 transition-colors"
            >
              Change Email
            </button>
          )}

          <div className="mt-12 pt-8 border-t border-gray-50 text-center">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
              Secured by Supabase Infrastructure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

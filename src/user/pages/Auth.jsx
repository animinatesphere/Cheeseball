import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import logo from "../../assets/CHEESEBALL 1.png";
import {
  ArrowRight,
  Mail,
  KeyRound,
  Loader2,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";
import Toast from "../components/Toast";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const msg = error.message || "Login failed. Please try again.";
      setError(msg);
      setToast({ message: msg, type: "error" });
    } else {
      setToast({
        message: "Login successful! Redirecting...",
        type: "success",
      });
      setTimeout(() => navigate("/currency-change"), 1000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-blue-50 page-container slide-in justify-center items-center py-12">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-md w-full bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-2xl shadow-blue-100 border border-blue-50 relative overflow-hidden">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-8 left-8 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </button>

        {/* Abstract background element */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/5 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <img
            src={logo}
            alt="Cheeseball Logo"
            className="w-full max-w-[220px] mx-auto mb-10"
          />

          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-500 text-sm font-medium">
              Sign in with your email and password
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div className="relative group">
              <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 px-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-gray-50 hover:bg-gray-100 focus:bg-white border-2 border-gray-100 focus:border-blue-500 rounded-xl py-4 px-5 pl-14 font-medium text-gray-900 placeholder-gray-400 transition-all outline-none focus:shadow-lg focus:shadow-blue-200/50"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="relative group">
              <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 px-1">
                Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-gray-50 hover:bg-gray-100 focus:bg-white border-2 border-gray-100 focus:border-blue-500 rounded-xl py-4 px-5 pl-14 pr-14 font-medium text-gray-900 placeholder-gray-400 transition-all outline-none focus:shadow-lg focus:shadow-blue-200/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold border border-red-100 flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-200 transition-all transform active:scale-95 flex items-center justify-center gap-3 group"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              Don't have an account?
            </p>
            <button
              onClick={() => navigate("/signup")}
              className="w-full text-blue-600 hover:text-blue-700 font-bold text-sm transition-colors"
            >
              Create Account
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
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

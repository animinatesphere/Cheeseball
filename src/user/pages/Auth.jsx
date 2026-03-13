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
      const raw = error.message?.toLowerCase() || "";
      const msg = raw.includes("invalid login credentials") || raw.includes("invalid email or password")
        ? "Wrong email or password. Please double-check and try again."
        : raw.includes("email not confirmed")
        ? "You haven't confirmed your email yet. Check your inbox for a verification link."
        : raw.includes("too many requests") || raw.includes("rate limit")
        ? "Too many sign-in attempts. Please wait a moment and try again."
        : "Something went wrong while signing in. Please try again.";
      setError(msg);
      setToast({ message: msg, type: "error" });
    } else {
      setToast({
        message: "Welcome back! Taking you to your account...",
        type: "success",
      });
      setTimeout(() => navigate("/currency-change"), 1000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col mesh-gradient slide-in justify-center items-center py-8 px-4">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-md w-full card p-8 sm:p-10 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>

        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-6 left-6 p-2 rounded-xl transition-all group hover:bg-white/5"
          style={{ color: 'var(--text-muted)' }}
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </button>

        <div className="relative z-10">
          <img
            src={logo}
            alt="Cheeseball Logo"
            className="w-full max-w-[180px] mx-auto mb-8"
          />

          <div className="text-center mb-8">
            <h2 className="text-2xl font-black tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>
              Welcome Back
            </h2>
            <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
              Sign in to continue trading
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Input */}
            <div className="relative group">
              <label className="block text-[10px] font-black uppercase tracking-widest mb-2 px-1" style={{ color: 'var(--text-muted)' }}>
                Email Address
              </label>
              <div className="relative glow-ring rounded-xl">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="input-field pl-12"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="relative group">
              <label className="block text-[10px] font-black uppercase tracking-widest mb-2 px-1" style={{ color: 'var(--text-muted)' }}>
                Password
              </label>
              <div className="relative glow-ring rounded-xl">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors" style={{ color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-field pl-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-blue-400 transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password link */}
            <div className="text-right -mt-1">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            {error && (
              <div className="badge-danger p-3 rounded-xl text-xs font-bold flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-base flex items-center justify-center gap-3 group"
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

          <div className="mt-8 pt-6 text-center" style={{ borderTop: '1px solid var(--border-primary)' }}>
            <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
              Don't have an account?
            </p>
            <button
              onClick={() => navigate("/signup")}
              className="text-blue-400 hover:text-blue-300 font-bold text-sm transition-colors"
            >
              Create Account
            </button>
          </div>

          <div className="mt-6 pt-6 text-center" style={{ borderTop: '1px solid var(--border-primary)' }}>
            <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Secured by Supabase Infrastructure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

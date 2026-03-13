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

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      const msg = "Those passwords don't match. Please make sure both fields are the same.";
      setError(msg);
      setToast({ message: msg, type: "error" });
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      const msg = "Your password needs to be at least 6 characters long.";
      setError(msg);
      setToast({ message: msg, type: "error" });
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + "/currency-change",
      },
    });

    if (error) {
      const raw = error.message?.toLowerCase() || "";
      const msg = raw.includes("already registered") || raw.includes("already exists")
        ? "Looks like you already have an account with that email. Try signing in instead!"
        : raw.includes("invalid email")
        ? "That doesn't look like a valid email address. Please check it."
        : raw.includes("password")
        ? "Your password needs to be at least 6 characters long."
        : "Something went wrong while creating your account. Please try again.";
      setError(msg);
      setToast({ message: msg, type: "error" });
    } else {
      setToast({
        message: "Account created! Check your email to confirm, then sign in.",
        type: "success",
      });
      setTimeout(() => navigate("/login"), 2000);
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
              Create Account
            </h2>
            <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
              Join Cheeseball and start trading
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Email Input */}
            <div className="relative group">
              <label className="block text-[10px] font-black uppercase tracking-widest mb-2 px-1" style={{ color: 'var(--text-muted)' }}>
                Email Address
              </label>
              <div className="relative glow-ring rounded-xl">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
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
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
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

            {/* Confirm Password Input */}
            <div className="relative group">
              <label className="block text-[10px] font-black uppercase tracking-widest mb-2 px-1" style={{ color: 'var(--text-muted)' }}>
                Confirm Password
              </label>
              <div className="relative glow-ring rounded-xl">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="input-field pl-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-blue-400 transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
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
                  <span>Sign Up</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 text-center" style={{ borderTop: '1px solid var(--border-primary)' }}>
            <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
              Already have an account?
            </p>
            <button
              onClick={() => navigate("/login")}
              className="text-blue-400 hover:text-blue-300 font-bold text-sm transition-colors"
            >
              Sign In Instead
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

export default Signup;

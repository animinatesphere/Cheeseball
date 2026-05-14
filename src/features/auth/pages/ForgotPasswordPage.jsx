import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/CHEESEBALL 1.png";
import hand from "@/assets/6ea63607c4c189087888a13bff995a50efe7783e.png";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import Toast from "@/shared/components/Toast";
import authService from "@/services/authService";

/* ─────────────────────────────────────────────
   Shared layout wrapper (left panel + right panel)
───────────────────────────────────────────── */
const Layout = ({ children }) => (
  <div
    className="flex min-h-screen w-full overflow-hidden bg-[#f5f6fa]"
    style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
  >
    {/* Left blurred panel */}
    <div className="relative hidden lg:flex w-[45%] max-w-[45%] overflow-hidden items-end shrink-0">
      <img
        src={hand}
        alt="Cheeseball background"
        className="absolute inset-0 w-full h-full object-cover blur-[3px] brightness-75 scale-105"
      />
      <div className="absolute inset-0 bg-linear-to-b from-[rgba(0,20,255,0.18)] to-[rgba(9,19,127,0.72)]" />
      <div className="relative z-2 bg-[#FCFCFC3B] px-9 py-10 text-white w-full">
        <h2
          className="font-bold leading-tight mb-3 tracking-tight text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] text-center"
          style={{ textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}
        >
          Spend crypto like cash
        </h2>
        <p
          className="text-[clamp(13px,1.2vw,16px)] leading-relaxed text-white/85 text-center mx-auto"
          style={{ textShadow: "0 1px 6px rgba(0,0,0,0.3)" }}
        >
          Convert crypto and use it for real-life payments instantly
        </p>
      </div>
    </div>

    {/* Right content panel */}
    <div className="flex-1 overflow-y-auto flex justify-center items-center py-10 px-5 max-[480px]:py-7 max-[480px]:px-4 bg-white">
      <div className="w-full max-w-sm">
        <img
          src={logo}
          alt="Cheeseball logo"
          className="block max-w-35 mx-auto mb-8 object-contain"
        />
        {children}
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   STEP 1 — Forgot Password (email entry)
───────────────────────────────────────────── */
const EmailStep = ({ onNext, onBack, loading, setLoading, setToast }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setToast({ message: "Reset link sent! Check your inbox.", type: "success" });
      onNext(email);
    } catch (err) {
      setToast({ message: err.message || "Failed to send reset link. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Back + title */}
      <div className="flex items-center gap-3 mb-1">
        <button
          type="button"
          onClick={onBack}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-[#1e1e1e]" />
        </button>
        <h1 className="font-bold text-[#1e1e1e] text-[16px] sm:text-[18px]">
          forgot password
        </h1>
      </div>

      <p className="text-[clamp(11px,1vw,13px)] text-center text-[#636567] -mt-2 mb-2">
        enter your email below, if there's an account associated with this email, we'll send a reset link
      </p>

      {/* Email field */}
      <div className="flex flex-col gap-1">
        <label className="text-[clamp(12px,1vw,14px)] font-semibold text-[#1e1e1e]">
          Email
        </label>
        <input
          id="forgot-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email addresss"
          className="w-full h-11 border border-[#a2a2a2] rounded-md outline-none px-3 text-[clamp(12px,1.1vw,14px)] text-[#1e1e1e] bg-[#fafafa] transition-colors focus:border-[#0014ff] focus:bg-white"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 block w-full h-12 border-none rounded-full cursor-pointer text-[clamp(13px,1.2vw,15px)] font-semibold text-white bg-linear-to-r from-[#0014FF] to-[#09137F] transition-all hover:opacity-90 hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue"}
      </button>
    </form>
  );
};

/* ─────────────────────────────────────────────
   STEP 2 — Reset Password (new password entry)
───────────────────────────────────────────── */
const ResetPasswordStep = ({ email, token, onDone, onBack, loading, setLoading, setToast }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setToast({ message: "Password must be at least 6 characters.", type: "error" });
      return;
    }
    if (password !== confirmPassword) {
      setToast({ message: "Passwords don't match.", type: "error" });
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword({ email, token, password, confirm_password: confirmPassword });
      onDone();
    } catch (err) {
      setToast({ message: err.message || "Could not update password. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Back + title */}
      <div className="flex items-center gap-3 mb-1">
        <button
          type="button"
          onClick={onBack}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-[#1e1e1e]" />
        </button>
        <h1 className="font-bold text-[#1e1e1e] text-[16px] sm:text-[18px]">
          Reset Password
        </h1>
      </div>

      <p className="text-[clamp(11px,1vw,13px)] text-center text-[#636567] -mt-2 mb-2">
        please enter a new password below
      </p>

      {/* Password */}
      <div className="flex flex-col gap-1">
        <label className="text-[clamp(12px,1vw,14px)] font-semibold text-[#1e1e1e]">
          Password
        </label>
        <div className="relative">
          <input
            id="reset-password"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••••"
            className="w-full h-11 border border-[#a2a2a2] rounded-md outline-none px-3 pr-11 text-[clamp(12px,1.1vw,14px)] text-[#1e1e1e] bg-[#fafafa] transition-colors focus:border-[#0014ff] focus:bg-white"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9e9e9e] hover:text-[#1e1e1e] transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div className="flex flex-col gap-1">
        <label className="text-[clamp(12px,1vw,14px)] font-semibold text-[#1e1e1e]">
          Confirm Password
        </label>
        <div className="relative">
          <input
            id="reset-confirm-password"
            type={showConfirm ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••••••••"
            className="w-full h-11 border border-[#a2a2a2] rounded-md outline-none px-3 pr-11 text-[clamp(12px,1.1vw,14px)] text-[#1e1e1e] bg-[#fafafa] transition-colors focus:border-[#0014ff] focus:bg-white"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9e9e9e] hover:text-[#1e1e1e] transition-colors"
          >
            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 block w-full h-12 border-none rounded-full cursor-pointer text-[clamp(13px,1.2vw,15px)] font-semibold text-white bg-linear-to-r from-[#0014FF] to-[#09137F] transition-all hover:opacity-90 hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue"}
      </button>
    </form>
  );
};

/* ─────────────────────────────────────────────
   STEP 3 — Password Reset Successful
───────────────────────────────────────────── */
const SuccessStep = ({ onLogin }) => (
  <div className="flex flex-col items-center text-center gap-5">
    {/* Lock icon */}
    <div className="mt-4 mb-2">
      <svg width="80" height="90" viewBox="0 0 80 90" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lockGrad" x1="0" y1="0" x2="80" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#1D3FC4" />
          </linearGradient>
        </defs>
        {/* Shackle */}
        <path
          d="M24 38 V26 C24 13.85 56 13.85 56 26 V38"
          stroke="url(#lockGrad)"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />
        {/* Body */}
        <rect x="10" y="36" width="60" height="46" rx="8" fill="url(#lockGrad)" />
        {/* Keyhole */}
        <circle cx="40" cy="57" r="7" fill="white" opacity="0.9" />
        <rect x="37" y="60" width="6" height="10" rx="3" fill="white" opacity="0.9" />
      </svg>
    </div>

    <div>
      <h2 className="text-[20px] font-bold text-[#1e1e1e] mb-2">
        password reset successful!
      </h2>
      <p className="text-[13px] text-[#636567]">
        Your password has been updated. You can now login
      </p>
    </div>

    <div className="w-full mt-8">
      <button
        onClick={onLogin}
        className="block w-full h-12 border-none rounded-full cursor-pointer text-[clamp(13px,1.2vw,15px)] font-semibold text-white bg-linear-to-r from-[#0014FF] to-[#09137F] transition-all hover:opacity-90 hover:-translate-y-px"
      >
        Back to log in
      </button>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
const ForgotPassword = () => {
  const [step, setStep] = useState("email"); // email | password | success
  const [email, setEmail] = useState("");
  const [token] = useState(""); // token from OTP if needed later
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  return (
    <Layout>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {step === "email" && (
        <EmailStep
          onNext={(e) => { setEmail(e); setStep("password"); }}
          onBack={() => navigate("/login")}
          loading={loading}
          setLoading={setLoading}
          setToast={setToast}
        />
      )}

      {step === "password" && (
        <ResetPasswordStep
          email={email}
          token={token}
          onDone={() => setStep("success")}
          onBack={() => setStep("email")}
          loading={loading}
          setLoading={setLoading}
          setToast={setToast}
        />
      )}

      {step === "success" && (
        <SuccessStep onLogin={() => navigate("/login")} />
      )}
    </Layout>
  );
};

export default ForgotPassword;


import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import logo from "../../assets/CHEESEBALL 1.png";
import authService from "../../lib/authService";
import {
  ArrowRight,
  ArrowLeft,
  Mail,
  KeyRound,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";
import Toast from "../components/Toast";

// Step 1: Email Entry
const EmailStep = ({ onNext, loading, setLoading, setToast }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setToast({ message: "Done! Check your inbox — we've sent a 6-digit reset code to your email.", type: "success" });
      onNext(email);
    } catch (err) {
      setToast({ message: err.message || "Failed to send reset code. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-black tracking-tight mb-2" style={{ color: "var(--text-primary)" }}>
          Forgot Password?
        </h2>
        <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
          Enter your email and we'll send you a 6-digit reset code.
        </p>
      </div>

      <div className="relative group">
        <label className="block text-[10px] font-black uppercase tracking-widest mb-2 px-1" style={{ color: "var(--text-muted)" }}>
          Email Address
        </label>
        <div className="relative glow-ring rounded-xl">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="input-field"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full py-4 text-base flex items-center justify-center gap-3 group"
      >
        {loading ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <>
            <span>Send Reset Code</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
};

// Step 2: 6-Digit OTP Entry
const OTPStep = ({ email, onNext, onBack, loading, setLoading, setToast }) => {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    let id;
    if (countdown > 0) {
      id = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(id);
  }, [countdown]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newDigits = [...digits];
    pasted.split("").forEach((char, i) => {
      newDigits[i] = char;
    });
    setDigits(newDigits);
    const nextEmpty = newDigits.findIndex((d) => !d);
    inputRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();
  };

  const handleResend = async () => {
    if (countdown > 0 || loading) return;
    setLoading(true);
    try {
      await authService.resendOTP(email);
      setToast({ message: "New code sent! Check your inbox.", type: "success" });
      setCountdown(60);
    } catch (err) {
      setToast({ message: err.message || "Failed to resend code. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    const token = digits.join("");
    if (token.length < 6) {
      setToast({ message: "Please fill in all 6 digits of your code.", type: "error" });
      return;
    }
    setLoading(true);

    try {
      await authService.verifyOTP(email, token);
      setToast({ message: "Code verified! Now let's set your new password.", type: "success" });
      onNext(token);
    } catch (err) {
      setToast({ message: err.message || "Verification failed. Please try again.", type: "error" });
      setDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-black tracking-tight mb-2" style={{ color: "var(--text-primary)" }}>
          Enter Reset Code
        </h2>
        <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
          We sent a 6-digit code to{" "}
          <span className="text-blue-400 font-bold break-all">{email}</span>
        </p>
      </div>

      {/* 6 digit boxes */}
      <div className="flex gap-2 justify-center" onPaste={handlePaste}>
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className={`w-11 h-14 text-center text-2xl font-black rounded-xl border-2 outline-none transition-all
              ${digit ? "border-blue-500 bg-blue-500/10 text-blue-400" : "border-white/10 bg-white/5 text-white"}
              focus:border-blue-500 focus:bg-white/10 focus:shadow-lg focus:shadow-blue-500/20`}
          />
        ))}
      </div>

      {/* Resend row */}
      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={handleResend}
          disabled={loading || countdown > 0}
          className={`text-xs font-bold transition-all ${
            loading || countdown > 0
              ? "opacity-30 cursor-not-allowed"
              : "text-blue-400 hover:text-blue-300"
          }`}
        >
          {loading ? "Sending..." : "Resend Code"}
        </button>
        {countdown > 0 && (
          <span className="text-[10px] font-black uppercase tracking-widest tabular-nums" style={{ color: "var(--text-muted)" }}>
            {countdown}s
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={handleVerify}
        disabled={loading || digits.join("").length < 6}
        className="btn-primary w-full py-4 text-base flex items-center justify-center gap-3 group"
      >
        {loading ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <>
            <span>Verify Code</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>

      <button
        type="button"
        onClick={onBack}
        className="w-full text-xs font-bold transition-colors"
        style={{ color: "var(--text-muted)" }}
      >
        Use a different email
      </button>
    </div>
  );
};

// Step 3: New Password Entry
const NewPasswordStep = ({ email, token, onDone, loading, setLoading, setToast }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setToast({ message: "Your password needs to be at least 6 characters long.", type: "error" });
      return;
    }
    if (password !== confirmPassword) {
      setToast({ message: "Those passwords don't match. Please make sure both fields are the same.", type: "error" });
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({
        email,
        token,
        password,
        confirm_password: confirmPassword
      });
      onDone();
    } catch (err) {
      setToast({ message: err.message || "We couldn't update your password. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-black tracking-tight mb-2" style={{ color: "var(--text-primary)" }}>
          Set New Password
        </h2>
        <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
          Choose a strong password for your account.
        </p>
      </div>

      {/* New Password */}
      <div className="relative group">
        <label className="block text-[10px] font-black uppercase tracking-widest mb-2 px-1" style={{ color: "var(--text-muted)" }}>
          New Password
        </label>
        <div className="relative glow-ring rounded-xl">
          <input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="input-field pr-14"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-5 top-1/2 -translate-y-1/2 hover:text-blue-400 transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div className="relative group">
        <label className="block text-[10px] font-black uppercase tracking-widest mb-2 px-1" style={{ color: "var(--text-muted)" }}>
          Confirm Password
        </label>
        <div className="relative glow-ring rounded-xl">
          <input
            type={showConfirm ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
            className="input-field pr-14"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-5 top-1/2 -translate-y-1/2 hover:text-blue-400 transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full py-4 text-base flex items-center justify-center gap-3 group"
      >
        {loading ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <>
            <span>Update Password</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
};

// Step 4: Success screen
const SuccessStep = ({ onLogin }) => (
  <div className="text-center space-y-6 py-4">
    <div className="flex justify-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center shadow-lg shadow-green-100">
        <CheckCircle className="w-10 h-10 text-green-500" />
      </div>
    </div>
    <div>
      <h2 className="text-2xl font-black tracking-tight mb-2" style={{ color: "var(--text-primary)" }}>
        Password Updated!
      </h2>
      <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
        Your password has been changed successfully. You can now sign in with your new password.
      </p>
    </div>
    <button
      onClick={onLogin}
      className="btn-primary w-full py-4 text-base flex items-center justify-center gap-3 group"
    >
      <span>Back to Sign In</span>
      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
    </button>
  </div>
);

// Main ForgotPassword page
const ForgotPassword = () => {
  const [step, setStep] = useState("email"); // email | otp | password | success
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const stepIndex = { email: 0, otp: 1, password: 2, success: 3 };
  const totalSteps = 3;

  return (
    <div className="min-h-screen flex flex-col mesh-gradient slide-in justify-center items-center py-12 px-4 text-center">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-md w-full card p-8 sm:p-10 relative overflow-hidden text-left">
        {/* Back button */}
        {step !== "success" && (
          <button
            onClick={() => (step === "email" ? navigate("/login") : setStep("email"))}
            className="absolute top-6 left-6 p-2 rounded-xl transition-all group hover:bg-white/5"
            style={{ color: "var(--text-muted)" }}
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
        )}

        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <img
            src={logo}
            alt="Cheeseball Logo"
            className="w-full max-w-[180px] mx-auto mb-8"
          />

          {/* Progress dots */}
          {step !== "success" && (
            <div className="flex justify-center gap-2 mb-8">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i < stepIndex[step]
                      ? "w-6 bg-blue-600"
                      : i === stepIndex[step]
                      ? "w-6 bg-blue-600"
                      : "w-2 bg-gray-200"
                  }`}
                />
              ))}
            </div>
          )}

          {step === "email" && (
            <EmailStep
              onNext={(e) => { setEmail(e); setStep("otp"); }}
              loading={loading}
              setLoading={setLoading}
              setToast={setToast}
            />
          )}

          {step === "otp" && (
            <OTPStep
              email={email}
              onNext={(t) => { setToken(t); setStep("password"); }}
              onBack={() => setStep("email")}
              loading={loading}
              setLoading={setLoading}
              setToast={setToast}
            />
          )}

          {step === "password" && (
            <NewPasswordStep
              email={email}
              token={token}
              onDone={() => setStep("success")}
              loading={loading}
              setLoading={setLoading}
              setToast={setToast}
            />
          )}

          {step === "success" && (
            <SuccessStep onLogin={() => navigate("/login")} />
          )}

          {step !== "success" && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

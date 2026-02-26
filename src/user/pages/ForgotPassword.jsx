import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import logo from "../../assets/CHEESEBALL 1.png";
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

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/forgot-password",
    });

    if (error) {
      const raw = error.message?.toLowerCase() || "";
      const msg = raw.includes("rate limit") || raw.includes("too many")
        ? "You've sent too many requests. Please wait a minute and try again."
        : raw.includes("invalid email") || raw.includes("unable to validate")
        ? "That doesn't look like a valid email address. Please check it."
        : "We couldn't send the code right now. Please try again in a moment.";
      setToast({ message: msg, type: "error" });
    } else {
      setToast({ message: "Done! Check your inbox — we've sent a 6-digit reset code to your email.", type: "success" });
      onNext(email);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2">
          Forgot Password?
        </h2>
        <p className="text-gray-500 text-sm font-medium">
          Enter your email and we'll send you a 6-digit reset code.
        </p>
      </div>

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

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-200 transition-all transform active:scale-95 flex items-center justify-center gap-3 group"
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
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/forgot-password",
    });
    if (error) {
      const raw = error.message?.toLowerCase() || "";
      const msg = raw.includes("rate limit") || raw.includes("too many")
        ? "You've sent too many requests. Please wait a minute before trying again."
        : "We had trouble sending the code. Please try again.";
      setToast({ message: msg, type: "error" });
    } else {
      setToast({ message: "New code sent! Check your inbox.", type: "success" });
      setCountdown(60);
    }
    setLoading(false);
  };

  const handleVerify = async () => {
    const token = digits.join("");
    if (token.length < 6) {
      setToast({ message: "Please fill in all 6 digits of your code.", type: "error" });
      return;
    }
    setLoading(true);

    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "recovery",
    });

    if (error) {
      const msg = error.message?.toLowerCase() || "";
      setToast({
        message: msg.includes("expired")
          ? "That code has expired. Tap 'Resend Code' to get a fresh one."
          : msg.includes("invalid") || msg.includes("incorrect")
          ? "That code doesn't look right. Please check it and try again."
          : msg.includes("rate limit") || msg.includes("too many")
          ? "Too many attempts. Please wait a moment before trying again."
          : "Verification didn't work. Please try again.",
        type: "error",
      });
      setDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } else {
      setToast({ message: "Code verified! Now let's set your new password.", type: "success" });
      onNext();
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2">
          Enter Reset Code
        </h2>
        <p className="text-gray-500 text-sm font-medium">
          We sent a 6-digit code to{" "}
          <span className="text-blue-600 font-bold break-all">{email}</span>
        </p>
      </div>

      {/* 6 digit boxes */}
      <div className="flex gap-3 justify-center" onPaste={handlePaste}>
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
            className={`w-12 h-14 text-center text-2xl font-black rounded-xl border-2 outline-none transition-all
              ${digit ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 bg-gray-50 text-gray-900"}
              focus:border-blue-500 focus:bg-white focus:shadow-lg focus:shadow-blue-200/50`}
          />
        ))}
      </div>

      {/* Resend row */}
      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={handleResend}
          disabled={loading || countdown > 0}
          className={`text-sm font-bold transition-all ${
            loading || countdown > 0
              ? "text-gray-300 cursor-not-allowed"
              : "text-blue-600 hover:text-blue-700"
          }`}
        >
          {loading ? "Sending..." : "Resend Code"}
        </button>
        {countdown > 0 && (
          <span className="text-gray-400 text-sm font-bold tabular-nums">
            {countdown}s
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={handleVerify}
        disabled={loading || digits.join("").length < 6}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-200 transition-all transform active:scale-95 flex items-center justify-center gap-3 group"
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
        className="w-full text-gray-400 hover:text-gray-600 text-sm font-bold transition-colors"
      >
        Use a different email
      </button>
    </div>
  );
};

// Step 3: New Password Entry
const NewPasswordStep = ({ onDone, loading, setLoading, setToast }) => {
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
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setToast({ message: "We couldn't update your password. Please go back and try the reset process again.", type: "error" });
    } else {
      onDone();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2">
          Set New Password
        </h2>
        <p className="text-gray-500 text-sm font-medium">
          Choose a strong password for your account.
        </p>
      </div>

      {/* New Password */}
      <div className="relative group">
        <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 px-1">
          New Password
        </label>
        <div className="relative">
          <KeyRound className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
          <input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="w-full bg-gray-50 hover:bg-gray-100 focus:bg-white border-2 border-gray-100 focus:border-blue-500 rounded-xl py-4 px-5 pl-14 pr-14 font-medium text-gray-900 placeholder-gray-400 transition-all outline-none focus:shadow-lg focus:shadow-blue-200/50"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div className="relative group">
        <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 px-1">
          Confirm Password
        </label>
        <div className="relative">
          <KeyRound className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
          <input
            type={showConfirm ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
            className="w-full bg-gray-50 hover:bg-gray-100 focus:bg-white border-2 border-gray-100 focus:border-blue-500 rounded-xl py-4 px-5 pl-14 pr-14 font-medium text-gray-900 placeholder-gray-400 transition-all outline-none focus:shadow-lg focus:shadow-blue-200/50"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
          >
            {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-200 transition-all transform active:scale-95 flex items-center justify-center gap-3 group"
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
      <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2">
        Password Updated!
      </h2>
      <p className="text-gray-500 text-sm font-medium">
        Your password has been changed successfully. You can now sign in with your new password.
      </p>
    </div>
    <button
      onClick={onLogin}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-200 transition-all transform active:scale-95 flex items-center justify-center gap-3 group"
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
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const stepIndex = { email: 0, otp: 1, password: 2, success: 3 };
  const totalSteps = 3;

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
        {/* Back button */}
        {step !== "success" && (
          <button
            onClick={() => (step === "email" ? navigate("/login") : setStep("email"))}
            className="absolute top-8 left-8 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
        )}

        {/* Abstract background */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/5 rounded-full blur-3xl" />

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
              onNext={() => setStep("password")}
              onBack={() => setStep("email")}
              loading={loading}
              setLoading={setLoading}
              setToast={setToast}
            />
          )}

          {step === "password" && (
            <NewPasswordStep
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
            <div className="mt-8 pt-8 border-t border-gray-100 text-center">
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                Secured by Supabase Infrastructure
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

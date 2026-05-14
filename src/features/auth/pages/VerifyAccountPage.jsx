import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import hand from "@/assets/a4b38746e61ceb461d2300b359df6f28b300c73a.png";
import logo from "@/assets/CHEESEBALL 1.png";
import { ArrowLeft, Loader2 } from "lucide-react";
import authService from "@/services/authService";

const RESEND_SECONDS = 60;
const OTP_LENGTH = 6;

const Verify = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Read email forwarded from signup page
  const params = new URLSearchParams(location.search);
  const email = params.get("email") || "";

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState(null);
  const inputRefs = useRef([]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    const next = [...otp];
    pasted.split("").forEach((ch, i) => (next[i] = ch));
    setOtp(next);
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIdx]?.focus();
  };

  const handleResend = async () => {
    if (!canResend || resending) return;
    setError(null);
    setResending(true);
    try {
      await authService.resendOTP(email);
      setOtp(Array(OTP_LENGTH).fill(""));
      setCountdown(RESEND_SECONDS);
      setCanResend(false);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.message || "Failed to resend code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < OTP_LENGTH) return;
    setError(null);
    setLoading(true);
    try {
      await authService.verifyOTP(email, code);
      navigate("/email-verified");
    } catch (err) {
      setError(err.message || "Invalid code. Please try again.");
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen w-full overflow-hidden bg-[#f5f6fa]"
      style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
    >
      {/* ───────────── LEFT PANEL ───────────── */}
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

      {/* ───────────── RIGHT PANEL ───────────── */}
      <div className="flex-1 overflow-y-auto flex justify-center items-center py-10 px-5 max-[480px]:py-7 max-[480px]:px-4 bg-white">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <img
            src={logo}
            alt="Cheeseball logo"
            className="block max-w-35 mx-auto mb-6 object-contain"
          />

          {/* Back + Title row */}
          <div className="flex items-center gap-3 mb-1">
            <button
              onClick={() => navigate("/signup")}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-[#1e1e1e]" />
            </button>
            <h1 className="font-bold text-[#1e1e1e] text-[16px] sm:text-[18px]">
              Email Verification
            </h1>
          </div>

          <p className="text-[clamp(13px,1.2vw,15px)] font-semibold text-center text-[#47474a] mb-1">
            Create your Account
          </p>
          <p className="text-[clamp(11px,1vw,13px)] text-center text-[#636567] mb-2">
            A {OTP_LENGTH}-digit code has been sent to your email address,
            please input here.
          </p>
          {email && (
            <p className="text-[12px] text-center text-[#0014ff] font-semibold mb-6 break-all">
              {email}
            </p>
          )}

          {/* OTP label */}
          <p className="text-[13px] font-semibold text-[#1e1e1e] mb-3">OTP</p>

          {/* OTP Boxes */}
          <div className="flex gap-3 justify-center mb-6" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                id={`otp-box-${i}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-12 h-14 text-center text-[20px] font-semibold rounded-xl border border-[#d9d9d9] bg-[#f7f7f7] outline-none text-[#1e1e1e] shadow-sm transition-all focus:border-[#0014ff] focus:bg-white focus:shadow-md"
                style={{ caretColor: "#0014ff" }}
              />
            ))}
          </div>

          {/* Error */}
          {error && (
            <p className="text-[12px] text-red-500 text-center mb-3">{error}</p>
          )}

          {/* Resend text */}
          <p className="text-center text-[13px] text-[#636567] mb-1">
            Didn't get code?{" "}
            {canResend ? (
              <span className="text-[#9e9e9e]">Click resend code below</span>
            ) : (
              <span className="text-[#9e9e9e]">
                Click resend code in{" "}
                <span className="font-semibold text-[#1e1e1e]">
                  {formatTime(countdown)}
                </span>
              </span>
            )}
          </p>

          {/* Resend code button */}
          <p className="text-center mb-6">
            <button
              onClick={handleResend}
              disabled={!canResend || resending}
              className={`text-[14px] font-semibold transition-colors ${
                canResend && !resending
                  ? "text-[#0014ff] cursor-pointer hover:underline"
                  : "text-[#c0c0c0] cursor-not-allowed"
              }`}
            >
              {resending ? "Sending…" : "Resend code"}
            </button>
          </p>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={otp.join("").length < OTP_LENGTH || loading}
            className=" w-full h-12 border-none rounded-full cursor-pointer text-[clamp(13px,1.2vw,15px)] font-semibold text-white bg-linear-to-r from-[#0014FF] to-[#09137F] transition-all hover:opacity-90 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Verify;


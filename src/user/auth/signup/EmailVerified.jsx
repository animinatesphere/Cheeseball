import React from "react";
import hand from "../../../assets/a4b38746e61ceb461d2300b359df6f28b300c73a.png";
import logo from "../../../assets/CHEESEBALL 1.png";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmailVerified = () => {
  const navigate = useNavigate();

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
              onClick={() => navigate("/verify-account")}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-[#1e1e1e]" />
            </button>
            <h1 className="font-bold text-[#1e1e1e] text-[16px] sm:text-[18px]">
              Email Verification
            </h1>
          </div>

          <p className="text-[clamp(11px,1vw,13px)] text-center text-[#636567] mb-12">
            a 6-code digit has been sent to your email address, please input here.
          </p>

          {/* Verified icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              {/* Envelope body */}
              <svg
                width="100"
                height="90"
                viewBox="0 0 100 90"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Gradient definition */}
                <defs>
                  <linearGradient id="envGrad" x1="0" y1="0" x2="100" y2="90" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="100%" stopColor="#2563EB" />
                  </linearGradient>
                  <linearGradient id="flapGrad" x1="0" y1="0" x2="100" y2="50" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#60CAFF" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>

                {/* Envelope flap (top triangle) */}
                <path
                  d="M10 38 L50 8 L90 38"
                  fill="url(#flapGrad)"
                  opacity="0.9"
                />

                {/* Envelope body */}
                <rect
                  x="10" y="36" width="80" height="50" rx="4"
                  fill="url(#envGrad)"
                />

                {/* Left wing */}
                <path d="M10 86 L42 58" stroke="white" strokeWidth="2" opacity="0.5" />
                {/* Right wing */}
                <path d="M90 86 L58 58" stroke="white" strokeWidth="2" opacity="0.5" />

                {/* Checkmark badge circle */}
                <circle cx="50" cy="34" r="18" fill="white" />
                <circle cx="50" cy="34" r="15" fill="url(#flapGrad)" />

                {/* Checkmark */}
                <path
                  d="M41 34 L47 40 L60 27"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>
          </div>

          {/* Text */}
          <h2 className="text-[20px] font-bold text-center text-[#1e1e1e] mb-2">
            email verified!
          </h2>
          <p className="text-[14px] text-center text-[#636567] mb-16">
            your email has been verified
          </p>

          {/* Continue button */}
          <button
            onClick={() => navigate("/login")}
            className="block w-full h-12 border-none rounded-full cursor-pointer text-[clamp(13px,1.2vw,15px)] font-semibold text-white bg-linear-to-r from-[#0014FF] to-[#09137F] transition-all hover:opacity-90 hover:-translate-y-px"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerified;

import React, { useState } from "react";
import hand from "@/assets/33505f890be2287adf471640ddbb8a82fc460c93.png";
import logo from "@/assets/CHEESEBALL 1.png";
import message from "@/assets/fluent-mdl2_chat-invite-friend.png";
import gog from "@/assets/logo googleg 48dp.png";
import app from "@/assets/ddk.png";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import authService from "@/services/authService";

const AuthSignup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    referral_code: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!acceptedTerms) {
      setError("Please accept the Terms and Conditions to continue.");
      return;
    }
    if (form.password !== form.confirm_password) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await authService.register({
        email: form.email,
        password: form.password,
        confirm_password: form.confirm_password,
        referral_code: form.referral_code,
      });
      // Pass registered email to verify page via query param
      navigate(`/verify-account?email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
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
      <div className="flex-1 overflow-y-auto flex justify-center items-start py-10 px-5 max-[480px]:py-7 max-[480px]:px-4 bg-white">
        <div className="w-full max-w-115">
          {/* Logo */}
          <img
            src={logo}
            alt="Cheeseball logo"
            className="block max-h-17.5 max-w-35 mx-auto mb-5 object-contain"
          />

          <h1 className="text-[clamp(20px,2vw,26px)] font-bold text-center text-[#1e1e1e] mb-1">
            Sign up
          </h1>
          <p className="text-[clamp(13px,1.2vw,16px)] font-semibold text-center text-[#47474a] mb-1">
            Create your Account
          </p>
          <p className="text-[clamp(11px,1vw,13px)] text-center text-[#636567] mb-5">
            Get started using your email address and password
          </p>

          {/* Invite banner */}
          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-md mb-5 bg-linear-to-r from-[#0014FF] to-[#09137F] text-[#fbfbfb] text-[clamp(11px,1vw,13px)] max-[480px]:text-[11px]">
            <img src={message} alt="invite" className="w-5 h-5 shrink-0 brightness-[10]" />
            <p>Invite Detected. Your invite code has been pre-filled.</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* ── Fields ── */}
            <div className="flex flex-col gap-3.5 mb-4">
              {/* Invite code */}
              <div className="flex flex-col gap-1">
                <label className="text-[clamp(12px,1vw,14px)] font-semibold text-[#1e1e1e]">
                  Invite code
                </label>
                <input
                  type="text"
                  placeholder="INV- 47736 3773"
                  value={form.referral_code}
                  onChange={handleChange("referral_code")}
                  className="w-full h-11 border border-dashed border-[#a2a2a2] rounded-md outline-none px-3 text-[clamp(12px,1.1vw,14px)] text-[#1e1e1e] bg-[#fafafa] transition-colors focus:border-[#0014ff] focus:bg-white"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <label className="text-[clamp(12px,1vw,14px)] font-semibold text-[#1e1e1e]">
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange("email")}
                  className="w-full h-11 border border-[#a2a2a2] rounded-md outline-none px-3 text-[clamp(12px,1.1vw,14px)] text-[#1e1e1e] bg-[#fafafa] transition-colors focus:border-[#0014ff] focus:bg-white"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1">
                <label className="text-[clamp(12px,1vw,14px)] font-semibold text-[#1e1e1e]">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••••••"
                    value={form.password}
                    onChange={handleChange("password")}
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
                    type={showConfirm ? "text" : "password"}
                    required
                    placeholder="••••••••••••"
                    value={form.confirm_password}
                    onChange={handleChange("confirm_password")}
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
            </div>

            {/* Terms */}
            <div className="flex items-center gap-2 mb-4.5">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="w-4 h-4 accent-[#0014ff] shrink-0 cursor-pointer"
              />
              <label htmlFor="terms" className="text-[clamp(11px,1vw,13px)] text-[#9e9e9e] cursor-pointer">
                I accept the{" "}
                <span className="text-[#1e1e1e] font-semibold cursor-pointer">
                  Terms and Conditions
                </span>
              </label>
            </div>

            {/* Error */}
            {error && (
              <p className="text-[12px] text-red-500 text-center mb-3">{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="block w-full h-12 border-none rounded-full cursor-pointer text-[clamp(13px,1.2vw,15px)] font-semibold text-white bg-linear-to-r from-[#0014FF] to-[#09137F] mb-5 transition-all hover:opacity-90 hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create account"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-2.5 mb-4">
            <span className="flex-1 h-px bg-[#d9d9d9]" />
            <span className="text-[clamp(11px,1vw,13px)] text-[#7f7c7b] whitespace-nowrap">
              or continue with
            </span>
            <span className="flex-1 h-px bg-[#d9d9d9]" />
          </div>

          {/* Social */}
          <div className="flex gap-3 justify-center mb-5 max-[480px]:flex-col">
            <button className="flex items-center justify-center gap-2 px-6 py-2.5 border border-[#e0e0e0] rounded-lg bg-white cursor-pointer text-[clamp(12px,1.1vw,14px)] text-[#1e1e1e] font-medium shadow-sm flex-1 transition-all hover:shadow-md hover:-translate-y-px">
              <img src={gog} alt="Google" className="w-5 h-5 object-contain" />
              <span>Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-6 py-2.5 border border-[#e0e0e0] rounded-lg bg-white cursor-pointer text-[clamp(12px,1.1vw,14px)] text-[#1e1e1e] font-medium shadow-sm flex-1 transition-all hover:shadow-md hover:-translate-y-px">
              <img src={app} alt="Apple" className="w-5 h-5 object-contain" />
              <span>Apple</span>
            </button>
          </div>

          {/* Login link */}
            Already have an account?{" "}
            <button 
              onClick={() => navigate("/login")}
              className="text-[#0014ff] font-semibold no-underline hover:underline bg-transparent border-none cursor-pointer"
            >
              Login
            </button>
        </div>
      </div>
    </div>
  );
};

export default AuthSignup;


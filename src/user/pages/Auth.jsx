import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/CHEESEBALL 1.png";
import hand from "../../assets/86657202bb2efa65ee99337ee2ee615aae8f895f.png";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import Toast from "../components/Toast";
import authService from "../../lib/authService";

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

    try {
      const data = await authService.login({ email, password });

      if (data.access) localStorage.setItem("access_token", data.access);
      if (data.refresh) localStorage.setItem("refresh_token", data.refresh);

      setToast({
        message: "Welcome back! Taking you to your account...",
        type: "success",
      });

      setTimeout(() => navigate("/currency-change"), 1000);
    } catch (err) {
      const msg = err.message || "Login failed. Please double-check and try again.";
      setError(msg);
      setToast({ message: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen w-full overflow-hidden bg-[#f5f6fa]"
      style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
    >
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

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
          From wallet to real world.
          </h2>
          <p
            className="text-[clamp(13px,1.2vw,16px)] leading-relaxed text-white/85 text-center mx-auto"
            style={{ textShadow: "0 1px 6px rgba(0,0,0,0.3)" }}
          >
          Convert your crypto and pay for what matters—instantly
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
              onClick={() => navigate("/")}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-[#1e1e1e]" />
            </button>
            <h1 className="font-bold text-[#1e1e1e] text-[16px] sm:text-[18px]">
              Hi, Welcome Back
            </h1>
          </div>

          <p className="text-[clamp(11px,1vw,13px)] text-center text-[#636567] mb-7">
            Log in using your email/username address and password
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-[clamp(12px,1vw,14px)] font-semibold text-[#1e1e1e]">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="creativeomtayo@gmail.com"
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
                  id="login-password"
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
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <Eye className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>

              {/* Forgot password */}
              <div className="text-right mt-0.5">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-[12px] font-semibold text-[#0014ff] hover:underline transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-[12px] text-red-500 text-center -mt-1">{error}</p>
            )}

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="mt-2 block w-full h-12 border-none rounded-full cursor-pointer text-[clamp(13px,1.2vw,15px)] font-semibold text-white bg-linear-to-r from-[#0014FF] to-[#09137F] transition-all hover:opacity-90 hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Log in"
              )}
            </button>
          </form>

          {/* Sign up link */}
          <p className="text-[clamp(12px,1vw,14px)] text-[#636567] text-center mt-6">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-[#0014ff] font-semibold hover:underline transition-colors bg-transparent border-none cursor-pointer"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;

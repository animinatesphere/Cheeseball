import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/CHEESEBALL 1.png";
import {
  AlertCircle,
  Loader2,
  ArrowLeft,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  UserPlus,
  ArrowRight,
} from "lucide-react";
import Toast from "@/shared/components/Toast";
import authService from "@/services/authService";



export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toast, setToast] = useState(null);

  const handlePasswordChange = (value) => {
    setPassword(value);
    let strength = 0;
    if (value.length >= 8) strength++;
    if (/[A-Z]/.test(value)) strength++;
    if (/[0-9]/.test(value)) strength++;
    if (/[^A-Za-z0-9]/.test(value)) strength++;
    setPasswordStrength(strength);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setError("");

    if (!email || !password || !confirmPassword) {
      const msg = "Please fill in all fields";
      setFormError(msg);
      setToast({ message: msg, type: "error" });
      return;
    }

    if (password !== confirmPassword) {
      const msg = "Passwords do not match";
      setFormError(msg);
      setToast({ message: msg, type: "error" });
      return;
    }

    if (password.length < 6) {
      const msg = "Password must be at least 6 characters";
      setFormError(msg);
      setToast({ message: msg, type: "error" });
      return;
    }

    setIsLoading(true);

    try {
      await authService.register({
        email,
        password,
        confirm_password: confirmPassword,
        referral_code: referralCode,
      });

      setToast({
        message: "Account created! Please sign in to continue.",
        type: "success",
      });

      // Redirect to login after success
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const msg = err.message || "Registration failed. Please try again.";
      setError(msg);
      setToast({ message: msg, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col mesh-gradient slide-in justify-center items-center py-12 px-4">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-md w-full card p-8 sm:p-10 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>

        <button
          onClick={() => navigate("/")}
          className="absolute top-6 left-6 p-2 rounded-xl transition-all group hover:bg-white/5"
          style={{ color: "var(--text-muted)" }}
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
            <h2
              className="text-2xl font-black tracking-tight mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Create Account
            </h2>
            <p
              className="text-sm font-medium"
              style={{ color: "var(--text-muted)" }}
            >
              Join the future of crypto trading
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Address */}
            <div className="relative group">
              <label
                className="block text-[10px] font-black uppercase tracking-widest mb-2 px-1"
                style={{ color: "var(--text-muted)" }}
              >
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
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="relative group">
              <label
                className="block text-[10px] font-black uppercase tracking-widest mb-2 px-1"
                style={{ color: "var(--text-muted)" }}
              >
                Password
              </label>
              <div className="relative glow-ring rounded-xl">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="input-field pr-12"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-blue-400 transition-colors"
                  style={{ color: "var(--text-muted)" }}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="flex gap-2 mt-2 px-1">
                  <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        passwordStrength === 1 ? "w-1/4 bg-red-500"
                        : passwordStrength === 2 ? "w-1/2 bg-yellow-500"
                        : passwordStrength === 3 ? "w-3/4 bg-blue-500"
                        : passwordStrength === 4 ? "w-full bg-green-500"
                        : "w-0"
                      }`}
                    />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                    {passwordStrength === 1 && "Weak"}
                    {passwordStrength === 2 && "Fair"}
                    {passwordStrength === 3 && "Good"}
                    {passwordStrength === 4 && "Strong"}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative group">
              <label
                className="block text-[10px] font-black uppercase tracking-widest mb-2 px-1"
                style={{ color: "var(--text-muted)" }}
              >
                Confirm Password
              </label>
              <div className="relative glow-ring rounded-xl">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="input-field pr-12"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-blue-400 transition-colors"
                  style={{ color: "var(--text-muted)" }}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Referral Code */}
            <div className="relative group">
              <label
                className="block text-[10px] font-black uppercase tracking-widest mb-2 px-1"
                style={{ color: "var(--text-muted)" }}
              >
                Referral Code (Optional)
              </label>
              <div className="relative glow-ring rounded-xl">
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  placeholder="Enter referral code"
                  className="input-field"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group mt-2 px-1">
              <input
                type="checkbox"
                required
                className="w-5 h-5 rounded-lg border-2 border-white/10 bg-white/5 text-blue-600 focus:ring-blue-600/50 mt-0.5 transition-all group-hover:border-blue-400"
                defaultChecked
              />
              <span className="text-xs font-medium leading-relaxed" style={{ color: "var(--text-muted)" }}>
                I agree to the <span className="text-blue-400 font-bold">Terms of Service</span> and <span className="text-blue-400 font-bold">Privacy Policy</span>
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-4 text-base flex items-center justify-center gap-3 group"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Social Divider (if you decide to add social login later) */}
          <div
            className="mt-8 pt-6 text-center"
            style={{ borderTop: "1px solid var(--border-primary)" }}
          >
            <p
              className="text-[10px] font-black uppercase tracking-widest mb-3"
              style={{ color: "var(--text-muted)" }}
            >
              Already have an account?
            </p>
            <button
              onClick={() => navigate("/login")}
              className="text-blue-400 hover:text-blue-300 font-bold text-sm transition-colors"
            >
              Sign In Instead
            </button>
          </div>

          <div
            className="mt-6 pt-6 text-center"
            style={{ borderTop: "1px solid var(--border-primary)" }}
          >
            <p
              className="text-[10px] font-black uppercase tracking-widest"
              style={{ color: "var(--text-muted)" }}
            >
              Secured by Cheeseball Infrastructure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


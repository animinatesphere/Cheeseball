import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "@/services/authService";
import { getCurrencies } from "@/services/api";
import { paths } from "@/routes/paths";
import Toast from "@/shared/components/Toast";

/* ─── Tokens ─────────────────────────────────────────────────── */
const T = {
  blue:       "#1A6FFF",
  blueDark:   "#1259D9",
  blueLight:  "#EEF3FF",
  text:       "#0A0F1E",
  text2:      "#6B7A99",
  text3:      "#A8B4CC",
  border:     "#E8EEFF",
  surface:    "#F7F9FF",
  white:      "#FFFFFF",
  green:      "#00C48C",
  greenLight: "#E6FAF4",
  greenText:  "#00966B",
  mintGreen:  "#4ADE80",
  red:        "#EF4444",
  redLight:   "#FEF2F2",
  redText:    "#B91C1C",
};

const DEFAULT_RATES = [
  { sym: "BTC",  icon: "₿", color: "#F7931A", bg: "#FEF3E2", rate: "₦97,400,000", change: "+2.4%", pos: true  },
  { sym: "ETH",  icon: "Ξ", color: "#627EEA", bg: "#EEEFFE", rate: "₦4,872,000",  change: "-1.0%", pos: false },
  { sym: "USDT", icon: "₮", color: "#26A17B", bg: "#E6F7F2", rate: "₦1,648",      change: "+0.0%", pos: true  },
  { sym: "SOL",  icon: "◎", color: "#9945FF", bg: "#F3EEFF", rate: "₦236,800",    change: "+4.1%", pos: true  },
];

const ACTIVITY = [
  { name: "Adesola M.", action: "Sold 0.002 BTC",  amount: "+₦194,800", time: "2m ago"  },
  { name: "Emeka T.",   action: "Redeemed Amazon",  amount: "+₦51,200",  time: "5m ago"  },
  { name: "Fatima B.",  action: "Sold 120 USDT",    amount: "+₦197,760", time: "11m ago" },
  { name: "Chukwu O.",  action: "Sold 0.5 ETH",     amount: "+₦2,436,000",time: "14m ago"},
];

/* ─── Asset Metadata ─────────────────────────────────────────── */
const ASSET_META = {
  BTC:  { icon: "₿", color: "#F7931A", bg: "#FEF3E2" },
  ETH:  { icon: "Ξ", color: "#627EEA", bg: "#EEEFFE" },
  USDT: { icon: "₮", color: "#26A17B", bg: "#E6F7F2" },
  SOL:  { icon: "◎", color: "#9945FF", bg: "#F3EEFF" },
  BNB:  { icon: "B", color: "#F0B90B", bg: "#FFFBEB" },
  XRP:  { icon: "✕", color: "#00AAE4", bg: "#E8F7FE" },
};

/* ─── Icons ─────────────────────────────────────────────────── */
const EyeIcon = ({ show }) => show ? (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.text3} strokeWidth="2" strokeLinecap="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.text3} strokeWidth="2" strokeLinecap="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.mintGreen} strokeWidth="2" strokeLinecap="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const ArrowRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════ */
export default function Auth() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState("");
  const [rates, setRates] = useState([]);
  const [toast, setToast] = useState(null);

  const onSignUp = () => navigate(paths.signup);
  const onForgotPassword = () => navigate(paths.forgotPassword);

  // Show friendly message when redirected due to expired session
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("session_expired") === "true") {
      setToast({
        message: "Your session has expired. Please log in again.",
        type: "info",
      });
      // Clean up the URL without triggering a navigation
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await getCurrencies();
        if (res.data) {
          const mapped = res.data
            .filter(c => c.symbol !== "NGN")
            .slice(0, 4)
            .map(c => ({
              sym: c.symbol,
              icon: ASSET_META[c.symbol]?.icon || "₿",
              color: ASSET_META[c.symbol]?.color || T.blue,
              bg: ASSET_META[c.symbol]?.bg || T.blueLight,
              rate: `₦${c.sell_rate.toLocaleString()}`,
              change: (Math.random() > 0.5 ? "+" : "-") + (Math.random() * 5).toFixed(1) + "%",
              pos: Math.random() > 0.5
            }));
          setRates(mapped);
        }
      } catch (e) {
        console.error("Failed to fetch rates:", e);
      }
    };
    fetchRates();
  }, []);

  const valid = email.includes("@") && password.length >= 6;

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!valid || loading) return;
    setLoading(true);
    setError("");

    try {
      const data = await authService.login({ email, password });

      if (data.access) localStorage.setItem("access_token", data.access);
      if (data.refresh) localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("user_email", email);

      setToast({
        message: "Welcome back! Taking you to your account...",
        type: "success",
      });

      setTimeout(() => navigate(paths.dashboardHome), 1000);
    } catch (err) {
      const msg = err.message || "Login failed. Please double-check and try again.";
      setError(msg);
      setToast({ message: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") handleLogin(); };

  const displayRates = rates.length > 0 ? rates : DEFAULT_RATES;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'DM Sans',sans-serif;overflow-x:hidden;}
        input:-webkit-autofill{-webkit-box-shadow:0 0 0 40px ${T.white} inset!important;-webkit-text-fill-color:${T.text}!important;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes float2{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .fadein{animation:fadeUp 0.5s ease forwards}
        .fadein-2{animation:fadeUp 0.5s 0.1s ease both}
        .fadein-3{animation:fadeUp 0.5s 0.2s ease both}
        .fadein-4{animation:fadeUp 0.5s 0.3s ease both}
        .float{animation:float 5s ease-in-out infinite}
        .float2{animation:float2 6s 1.5s ease-in-out infinite}
        .blink{animation:blink 1.8s ease-in-out infinite}
        .activity-item{animation:slideUp 0.4s ease both}
        .login-btn:hover:not(:disabled){background:${T.blueDark}!important;}
        .login-btn:active:not(:disabled){transform:scale(0.985)!important;}
        .social-btn:hover{border-color:${T.blue}!important;background:${T.blueLight}!important;}

        @media (max-width: 1024px) {
          .login-grid { grid-template-columns: 1fr !important; }
          .brand-panel { display: none !important; }
          .form-panel { padding: 40px 20px !important; min-height: 100vh !important; justify-content: flex-start !important; }
          .mobile-logo { display: flex !important; }
          .nudge-top { position: static !important; margin-bottom: 24px; width: 100%; display: flex; justify-content: flex-end; }
          .form-container { margin-top: 20px; }
        }
      `}</style>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="login-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>

        {/* ══ LEFT — Brand panel ══ */}
        <div className="brand-panel" style={{ background: T.text, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", padding: "44px 52px" }}>
          {/* ... (keep existing brand panel content) ... */}
          <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: `${T.blue}12`, pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: `${T.blue}08`, pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1, marginBottom: "auto", cursor: "pointer" }} onClick={() => navigate(paths.home)}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 800, color: T.white, letterSpacing: "-0.5px" }}>
              Cheese<span style={{ color: T.blue }}>ball</span>
            </div>
          </div>

          <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingBottom: 24 }}>
            <div className="fadein" style={{ marginBottom: 36 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: T.blue, textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: 14 }}>
                Nigeria's #1 crypto platform
              </p>
              <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 40, fontWeight: 800, color: T.white, letterSpacing: "-1.2px", lineHeight: 1.1, marginBottom: 14 }}>
                Exchange smarter.<br />Get paid faster.
              </h2>
              <p style={{ fontSize: 15, color: T.text3, lineHeight: 1.7, maxWidth: 340 }}>
                Buy, sell and swap crypto and gift cards at the best rates in Nigeria — with payouts in under 5 minutes.
              </p>
            </div>

            <div className="fadein-2 float" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "20px", marginBottom: 16, backdropFilter: "blur(8px)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700, color: T.white }}>Live rates</p>
                <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(0,196,140,0.12)", borderRadius: 20, padding: "3px 9px" }}>
                  <div className="blink" style={{ width: 5, height: 5, borderRadius: "50%", background: T.green }} />
                  <span style={{ fontSize: 10, fontWeight: 600, color: T.green }}>Live</span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {displayRates.map((r) => (
                  <div key={r.sym} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 11 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: r.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora', sans-serif", fontSize: 11, fontWeight: 700, color: r.color, flexShrink: 0 }}>{r.icon}</div>
                    <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 12, fontWeight: 700, color: T.white, flex: 1 }}>{r.sym}</span>
                    <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>{r.rate}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: r.pos ? T.mintGreen : "#FCA5A5", minWidth: 36, textAlign: "right" }}>{r.change}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="fadein-3 float2" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: "16px 18px", backdropFilter: "blur(8px)" }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 12 }}>Recent payouts</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {ACTIVITY.map((a, i) => (
                  <div key={i} className="activity-item" style={{ display: "flex", alignItems: "center", gap: 10, animationDelay: `${i * 0.08}s` }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${T.blue}22`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora', sans-serif", fontSize: 10, fontWeight: 700, color: T.blue, flexShrink: 0 }}>
                      {a.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.75)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {a.name} · <span style={{ color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>{a.action}</span>
                      </p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 12, fontWeight: 700, color: T.mintGreen }}>{a.amount}</p>
                      <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 1 }}>{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 6 }}>
            <ShieldIcon />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>
              Your transaction is secure · Protected by Cheeseball
            </span>
          </div>
        </div>

        {/* ══ RIGHT — Login form ══ */}
        <div className="form-panel" style={{ background: T.white, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 72px", position: "relative" }}>

          {/* Top right link */}
          <div className="nudge-top" style={{ position: "absolute", top: 32, right: 40, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, color: T.text2 }}>Don't have an account?</span>
            <button
              onClick={onSignUp}
              style={{ fontSize: 13, fontWeight: 700, color: T.blue, background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              Sign up
            </button>
          </div>

          {/* Mobile Logo */}
          <div className="mobile-logo" style={{ display: "none", alignItems: "center", gap: 10, marginBottom: 40, alignSelf: "flex-start", cursor: "pointer" }} onClick={() => navigate(paths.home)}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 20, fontWeight: 800, color: T.text, letterSpacing: "-0.5px" }}>
              Cheese<span style={{ color: T.blue }}>ball</span>
            </div>
          </div>

          <div className="form-container" style={{ width: "100%", maxWidth: 400 }}>

            {/* Heading */}
            <div className="fadein" style={{ marginBottom: 36 }}>
              <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 30, fontWeight: 800, color: T.text, letterSpacing: "-0.8px", marginBottom: 8 }}>
                Welcome back
              </h1>
              <p style={{ fontSize: 14, color: T.text2, lineHeight: 1.6 }}>
                Sign in to your Cheeseball account.
              </p>
            </div>

            {/* Error banner */}
            {error && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: T.redLight, border: `1px solid #FECACA`, borderRadius: 12, padding: "12px 16px", marginBottom: 20, animation: "fadeUp 0.3s ease" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.red} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p style={{ fontSize: 13, color: T.redText, fontWeight: 500 }}>{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="fadein-2" style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Email */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.text2, marginBottom: 8 }}>Email address</label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused("")}
                  style={{ width: "100%", border: `1.5px solid ${focused === "email" ? T.blue : (error && focused === "") ? T.red : T.border}`, borderRadius: 14, padding: "14px 18px", fontSize: 14, color: T.text, fontFamily: "'DM Sans', sans-serif", outline: "none", transition: "border-color 0.15s", background: T.white }}
                />
              </div>

              {/* Password */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: T.text2 }}>Password</label>
                  <button
                    type="button"
                    onClick={onForgotPassword}
                    style={{ fontSize: 12, fontWeight: 600, color: T.blue, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  >
                    Forgot password?
                  </button>
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused("")}
                    style={{ width: "100%", border: `1.5px solid ${focused === "password" ? T.blue : (error && focused === "") ? T.red : T.border}`, borderRadius: 14, padding: "14px 48px 14px 18px", fontSize: 14, color: T.text, fontFamily: "'DM Sans', sans-serif", outline: "none", transition: "border-color 0.15s", background: T.white }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: 0 }}
                  >
                    <EyeIcon show={!showPass} />
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="login-btn"
                disabled={!valid || loading}
                style={{ width: "100%", padding: "16px", borderRadius: 14, border: "none", fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 700, cursor: valid && !loading ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: valid && !loading ? T.blue : "#E8EEFF", color: valid && !loading ? "#fff" : T.text3, transition: "all 0.18s", marginTop: 4 }}
              >
                {loading
                  ? <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Signing in…</>
                  : <>Sign in <ArrowRight /></>
                }
              </button>
            </form>

            {/* Divider */}
            <div className="fadein-3" style={{ display: "flex", alignItems: "center", gap: 14, margin: "24px 0" }}>
              <div style={{ flex: 1, height: 1, background: T.border }} />
              <span style={{ fontSize: 12, color: T.text3, fontWeight: 500, whiteSpace: "nowrap" }}>or continue with</span>
              <div style={{ flex: 1, height: 1, background: T.border }} />
            </div>

            {/* Social buttons */}
            <div className="fadein-4">
              <button
                type="button"
                className="social-btn"
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 9, padding: "14px", borderRadius: 14, border: `1.5px solid ${T.border}`, background: T.white, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: T.text, transition: "all 0.15s" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </div>

            {/* Sign up nudge */}
            <p className="fadein-4" style={{ textAlign: "center", fontSize: 13, color: T.text2, marginTop: 28 }}>
              New to Cheeseball?{" "}
              <button type="button" onClick={onSignUp} style={{ fontSize: 13, fontWeight: 700, color: T.blue, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                Create a free account
              </button>
            </p>
          </div>

          {/* Bottom footer */}
          <div style={{ position: "absolute", bottom: 24, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <ShieldIcon />
            <span style={{ fontSize: 11, color: T.text3, fontWeight: 500 }}>
              Your transaction is secure · Protected by Cheeseball
            </span>
          </div>
        </div>

      </div>
    </>
  );
}

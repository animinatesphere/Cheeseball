import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "@/services/authService";
import { paths } from "@/routes/paths";


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
  orange:     "#F97316",
  red:        "#EF4444",
  redLight:   "#FEF2F2",
  redText:    "#B91C1C",
};

/* ─── Icons ──────────────────────────────────────────────────── */
const ArrowLeft = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const ArrowRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const EyeIcon = ({ visible }) => visible ? (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.text3} strokeWidth="2" strokeLinecap="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.text3} strokeWidth="2" strokeLinecap="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const MailIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={T.blue} strokeWidth="1.8" strokeLinecap="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const ShieldIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.mintGreen} strokeWidth="2" strokeLinecap="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const CheckCircle = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const LockIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={T.blue} strokeWidth="1.8" strokeLinecap="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

/* ─── Password strength ──────────────────────────────────────── */
function PasswordStrength({ password }) {
  if (!password) return null;
  const score = [
    password.length >= 8,
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[^a-zA-Z0-9]/.test(password),
  ].filter(Boolean).length;
  const labels = ["", "Weak", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", T.red, T.red, T.orange, T.green, T.green];
  const c = colors[score] || T.border;
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 5 }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 4, background: i <= Math.min(score, 4) ? c : T.border, transition: "background 0.2s" }} />
        ))}
      </div>
      <p style={{ fontSize: 11, color: c, fontWeight: 600 }}>{labels[score]}</p>
    </div>
  );
}

/* ─── OTP input ──────────────────────────────────────────────── */
function OTPInput({ value, onChange, error }) {
  const inputs = useRef([]);
  const digits  = value.split("").concat(Array(6).fill("")).slice(0, 6);

  const handleChange = (i, val) => {
    const cleaned = val.replace(/\D/g, "").slice(-1);
    const next    = [...digits];
    next[i]       = cleaned;
    onChange(next.join(""));
    if (cleaned && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus();
      const next = [...digits]; next[i - 1] = ""; onChange(next.join(""));
    }
    if (e.key === "ArrowLeft" && i > 0) inputs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < 5) inputs.current[i + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted.padEnd(6, "").slice(0, 6).trimEnd());
    const focusIdx = Math.min(pasted.length, 5);
    inputs.current[focusIdx]?.focus();
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={el => inputs.current[i] = el}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            onPaste={handlePaste}
            onFocus={e => e.target.select()}
            style={{
              width: 52, height: 58,
              textAlign: "center",
              fontFamily: "'Sora', sans-serif",
              fontSize: 22, fontWeight: 700,
              color: T.text,
              border: `1.5px solid ${error ? T.red : d ? T.blue : T.border}`,
              borderRadius: 14,
              background: d ? T.blueLight : T.white,
              outline: "none",
              transition: "all 0.15s",
              caretColor: T.blue,
            }}
          />
        ))}
      </div>
      {error && <p style={{ fontSize: 12, color: T.red, textAlign: "center", marginTop: 10, fontWeight: 500 }}>{error}</p>}
    </div>
  );
}

/* ─── Countdown hook ─────────────────────────────────────────── */
function useCountdown(start, active) {
  const [secs, setSecs] = useState(start);
  useEffect(() => {
    if (!active) { setSecs(start); return; }
    if (secs <= 0) return;
    const t = setInterval(() => setSecs(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [active, secs]);
  const reset = () => setSecs(start);
  return [secs, reset];
}

/* ─── Left brand panel (shared across all steps) ────────────── */
function LeftPanel({ step }) {
  const COPY = {
    1: { title: "Forgot your\npassword?",    sub: "No worries. Enter your email and we'll send you a reset code in seconds."    },
    2: { title: "Check your\ninbox.",         sub: "We sent a 6-digit code to your email. It expires in 10 minutes."              },
    3: { title: "Almost\nthere.",             sub: "Create a strong new password to keep your Cheeseball account secure."         },
    4: { title: "You're back\nin.",           sub: "Your password has been reset. Sign in and continue exchanging."                  },
  };
  const c = COPY[step] || COPY[1];

  return (
    <div className="brand-panel" style={{ background: T.text, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", padding: "44px 52px" }}>
      <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: `${T.blue}12`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: `${T.blue}08`, pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 800, color: T.white, letterSpacing: "-0.5px" }}>
          Cheese<span style={{ color: T.blue }}>ball</span>
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 28 }}>

        {/* Step indicator */}
        {step < 4 && (
          <div style={{ display: "flex", gap: 6 }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ height: 3, borderRadius: 4, flex: i === step ? 2 : 1, background: i <= step ? T.blue : "rgba(255,255,255,0.1)", transition: "all 0.3s" }} />
            ))}
          </div>
        )}

        <div>
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 40, fontWeight: 800, color: T.white, letterSpacing: "-1.5px", lineHeight: 1.1, marginBottom: 14, whiteSpace: "pre-line" }}>
            {c.title}
          </h2>
          <p style={{ fontSize: 15, color: T.text3, lineHeight: 1.75, maxWidth: 300 }}>{c.sub}</p>
        </div>

        {/* Tips per step */}
        {step === 1 && (
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              "Make sure you enter the email linked to your account",
              "Check your spam folder if you don't see the email",
              "The reset code expires in 10 minutes",
            ].map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.blue, flexShrink: 0, marginTop: 6 }} />
                <p style={{ fontSize: 13, color: T.text3, lineHeight: 1.6 }}>{t}</p>
              </div>
            ))}
          </div>
        )}

        {step === 2 && (
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              "The code is 6 digits long",
              "Do not share this code with anyone",
              "Request a new code if it expires",
            ].map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.blue, flexShrink: 0, marginTop: 6 }} />
                <p style={{ fontSize: 13, color: T.text3, lineHeight: 1.6 }}>{t}</p>
              </div>
            ))}
          </div>
        )}

        {step === 3 && (
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              "Use at least 8 characters",
              "Mix uppercase, lowercase, numbers and symbols",
              "Do not reuse your previous password",
            ].map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.blue, flexShrink: 0, marginTop: 6 }} />
                <p style={{ fontSize: 13, color: T.text3, lineHeight: 1.6 }}>{t}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 6 }}>
        <ShieldIcon />
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontWeight: 500 }}>
          Your transaction is secure · Protected by Cheeseball
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step,      setStep]      = useState(1);
  const [email,     setEmail]     = useState("");
  const [token,     setToken]     = useState("");
  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [showPass,  setShowPass]  = useState(false);
  const [showConf,  setShowConf]  = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [errors,    setErrors]    = useState({});
  const [focused,   setFocused]   = useState("");


  const [countdown, resetCountdown] = useCountdown(60, step === 2);

  const maskEmail = (e) => {
    if (!e) return "";
    const parts = e.split("@");
    if (parts.length < 2) return e;
    const [user, domain] = parts;
    return user.slice(0, 2) + "••••••" + "@" + domain;
  };

  const onBackToLogin = () => navigate(paths.login || "/login");

  /* ── Step 1: send reset email ── */
  const handleSendEmail = async () => {
    if (!email.includes("@")) { setErrors({ email: "Enter a valid email address" }); return; }
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setStep(2);
      resetCountdown();
    } catch (err) {
      setErrors({ email: err.message || "Failed to send reset code. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  /* ── Step 2: verify token ── */
  const handleVerifyToken = async () => {
    if (token.length < 6) { setErrors({ token: "Enter the full 6-digit code" }); return; }
    setLoading(true);
    try {
      await authService.verifyResetToken(email, token);
      setErrors({});
      setStep(3);
    } catch (err) {
      setErrors({ token: err.message || "Invalid or expired code. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setToken("");
    setErrors({});
    try {
      await authService.forgotPassword(email);
      resetCountdown();
    } catch (err) {
      // Intentionally omitting toast, error handle could be added to errors state if needed
    }
  };

  /* ── Step 3: set new password ── */
  const handleSetPassword = async () => {
    const e = {};
    if (password.length < 8) e.password = "Password must be at least 8 characters";
    if (confirm !== password) e.confirm  = "Passwords do not match";
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      await authService.resetPassword({ email, token, password, confirm_password: confirm });
      setStep(4);
    } catch (err) {
      setErrors({ password: err.message || "Failed to reset password." });
    } finally {
      setLoading(false);
    }
  };

  const Btn = ({ label, disabled, loading: l, type = "submit" }) => (
    <button
      type={type}
      disabled={disabled || l}
      className="btn-primary"
    >
      {l ? (
        <>
          <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
          Loading…
        </>
      ) : (
        <>
          {label} <ArrowRight />
        </>
      )}
    </button>
  );

  const BackBtn = ({ onClick }) => (
    <button type="button" onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: T.text2, padding: 0, marginBottom: 28 }}>
      <ArrowLeft /> Back
    </button>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'DM Sans',sans-serif;}
        input:-webkit-autofill{-webkit-box-shadow:0 0 0 40px ${T.white} inset!important;-webkit-text-fill-color:${T.text}!important;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes popIn{0%{transform:scale(0.8);opacity:0}70%{transform:scale(1.05)}100%{transform:scale(1);opacity:1}}
        @keyframes ripple{0%{transform:scale(0.85);opacity:0.5}100%{transform:scale(2.4);opacity:0}}
        .fadein{animation:fadeUp 0.4s ease forwards}
        .popin{animation:popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards}
        .mobile-logo{display:none;}

        /* Premium Buttons CSS */
        .btn-primary {
          width: 100%;
          padding: 16px;
          border-radius: 14px;
          border: none;
          font-family: 'Sora', sans-serif;
          font-size: 15px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.15s ease;
          outline: none;
        }
        .btn-primary:not(:disabled) {
          background: ${T.blue};
          color: #fff;
          cursor: pointer;
        }
        .btn-primary:disabled {
          background: #E8EEFF;
          color: ${T.text3};
          cursor: not-allowed;
        }
        .btn-primary:hover:not(:disabled) {
          background: ${T.blueDark};
        }
        .btn-primary:active:not(:disabled) {
          transform: scale(0.985);
        }

        @media (max-width: 1024px) {
          .forgot-grid { grid-template-columns: 1fr !important; }
          .brand-panel { display: none !important; }
          .form-panel { padding: 40px 20px !important; min-height: 100vh !important; justify-content: flex-start !important; }
          .mobile-logo { display: flex !important; }
          .nudge-top { position: static !important; margin-bottom: 24px; width: 100%; display: flex; justify-content: flex-end; }
          .form-container { margin-top: 20px; }
        }
      `}</style>



      <div className="forgot-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
        <LeftPanel step={step} />

        {/* ══ RIGHT ══ */}
        <div className="form-panel" style={{ background: T.white, display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 72px", position: "relative" }}>

          {/* Back to login — top right */}
          <div className="nudge-top" style={{ position: "absolute", top: 32, right: 40 }}>
            <button type="button" onClick={onBackToLogin} style={{ fontSize: 13, fontWeight: 700, color: T.blue, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
              <ArrowLeft /> Back to login
            </button>
          </div>

          {/* Mobile Logo */}
          <div className="mobile-logo" style={{ display: "none", alignItems: "center", gap: 10, marginBottom: 40, alignSelf: "flex-start", cursor: "pointer" }} onClick={onBackToLogin}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 20, fontWeight: 800, color: T.text, letterSpacing: "-0.5px" }}>
              Cheese<span style={{ color: T.blue }}>ball</span>
            </div>
          </div>

          <div className="form-container" style={{ width: "100%", maxWidth: 400 }}>

            {/* ── STEP 1 — Email ── */}
            {step === 1 && (
              <form onSubmit={e => { e.preventDefault(); handleSendEmail(); }} className="fadein">
                <div style={{ width: 60, height: 60, borderRadius: 18, background: T.blueLight, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                  <MailIcon />
                </div>
                <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 26, fontWeight: 800, color: T.text, letterSpacing: "-0.6px", marginBottom: 8 }}>Reset your password</h1>
                <p style={{ fontSize: 14, color: T.text2, lineHeight: 1.6, marginBottom: 32 }}>
                  Enter the email address on your account and we'll send you a reset code.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.text2, marginBottom: 7 }}>Email address</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => { setEmail(e.target.value); if (errors.email) setErrors({}); }}
                      onFocus={() => setFocused("email")}
                      onBlur={() => setFocused("")}
                      style={{ width: "100%", border: `1.5px solid ${focused === "email" ? T.blue : errors.email ? T.red : T.border}`, borderRadius: 13, padding: "13px 16px", fontSize: 14, color: T.text, fontFamily: "'DM Sans', sans-serif", outline: "none", transition: "border-color 0.15s", background: T.white }}
                    />
                    {errors.email && <p style={{ fontSize: 11, color: T.red, marginTop: 5, fontWeight: 500 }}>{errors.email}</p>}
                  </div>
                  <Btn label="Send reset code" type="submit" disabled={!email} loading={loading} />
                </div>
              </form>
            )}

            {/* ── STEP 2 — Token ── */}
            {step === 2 && (
              <form onSubmit={e => { e.preventDefault(); handleVerifyToken(); }} className="fadein">
                <BackBtn onClick={() => { setStep(1); setToken(""); setErrors({}); }} />

                <div style={{ width: 60, height: 60, borderRadius: 18, background: T.blueLight, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={T.blue} strokeWidth="1.8" strokeLinecap="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.02z"/>
                  </svg>
                </div>

                <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 26, fontWeight: 800, color: T.text, letterSpacing: "-0.6px", marginBottom: 8 }}>Check your email</h1>
                <p style={{ fontSize: 14, color: T.text2, lineHeight: 1.6, marginBottom: 8 }}>
                  We sent a 6-digit code to
                </p>
                <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 32 }}>
                  {maskEmail(email)}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  <OTPInput value={token} onChange={t => { setToken(t); if (errors.token) setErrors({}); }} error={errors.token} />

                  <Btn label="Verify code" type="submit" disabled={token.length < 6} loading={loading} />

                  {/* Resend */}
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontSize: 13, color: T.text2 }}>
                      Didn't receive it?{" "}
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={countdown > 0}
                        style={{ fontSize: 13, fontWeight: 700, color: countdown > 0 ? T.text3 : T.blue, background: "none", border: "none", cursor: countdown > 0 ? "not-allowed" : "pointer", padding: 0, transition: "color 0.15s" }}
                      >
                        {countdown > 0 ? `Resend in ${countdown}s` : "Resend code"}
                      </button>
                    </p>
                  </div>
                </div>
              </form>
            )}

            {/* ── STEP 3 — New password ── */}
            {step === 3 && (
              <form onSubmit={e => { e.preventDefault(); handleSetPassword(); }} className="fadein">
                <BackBtn onClick={() => { setStep(2); setErrors({}); }} />

                <div style={{ width: 60, height: 60, borderRadius: 18, background: T.blueLight, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                  <LockIcon />
                </div>

                <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 26, fontWeight: 800, color: T.text, letterSpacing: "-0.6px", marginBottom: 8 }}>New password</h1>
                <p style={{ fontSize: 14, color: T.text2, lineHeight: 1.6, marginBottom: 32 }}>
                  Create a strong password for your Cheeseball account.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                  {/* Password */}
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.text2, marginBottom: 7 }}>New password</label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showPass ? "text" : "password"}
                        placeholder="At least 8 characters"
                        value={password}
                        onChange={e => { setPassword(e.target.value); if (errors.password) setErrors(v => ({ ...v, password: "" })); }}
                        onFocus={() => setFocused("password")}
                        onBlur={() => setFocused("")}
                        style={{ width: "100%", border: `1.5px solid ${focused === "password" ? T.blue : errors.password ? T.red : T.border}`, borderRadius: 13, padding: "13px 44px 13px 16px", fontSize: 14, color: T.text, fontFamily: "'DM Sans', sans-serif", outline: "none", transition: "border-color 0.15s", background: T.white }}
                      />
                      <button type="button" onClick={() => setShowPass(v => !v)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", display: "flex" }}>
                        <EyeIcon visible={!showPass} />
                      </button>
                    </div>
                    {errors.password && <p style={{ fontSize: 11, color: T.red, marginTop: 5, fontWeight: 500 }}>{errors.password}</p>}
                    <PasswordStrength password={password} />
                  </div>

                  {/* Confirm */}
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.text2, marginBottom: 7 }}>Confirm new password</label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showConf ? "text" : "password"}
                        placeholder="Re-enter your password"
                        value={confirm}
                        onChange={e => { setConfirm(e.target.value); if (errors.confirm) setErrors(v => ({ ...v, confirm: "" })); }}
                        onFocus={() => setFocused("confirm")}
                        onBlur={() => setFocused("")}
                        style={{ width: "100%", border: `1.5px solid ${focused === "confirm" ? T.blue : errors.confirm ? T.red : T.border}`, borderRadius: 13, padding: "13px 44px 13px 16px", fontSize: 14, color: T.text, fontFamily: "'DM Sans', sans-serif", outline: "none", transition: "border-color 0.15s", background: T.white }}
                      />
                      <button type="button" onClick={() => setShowConf(v => !v)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", display: "flex" }}>
                        <EyeIcon visible={!showConf} />
                      </button>
                    </div>
                    {errors.confirm
                      ? <p style={{ fontSize: 11, color: T.red, marginTop: 5, fontWeight: 500 }}>{errors.confirm}</p>
                      : confirm && confirm === password && <p style={{ fontSize: 11, color: T.greenText, marginTop: 5, fontWeight: 600 }}>✓ Passwords match</p>
                    }
                  </div>

                  <Btn label="Reset password" type="submit" disabled={!password || !confirm} loading={loading} />
                </div>
              </form>
            )}

            {/* ── STEP 4 — Success ── */}
            {step === 4 && (
              <div className="fadein" style={{ textAlign: "center" }}>
                <div style={{ position: "relative", width: 88, height: 88, margin: "0 auto 28px" }}>
                  <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `3px solid ${T.green}`, opacity: 0.25, animation: "ripple 1.8s ease-out infinite" }} />
                  <div className="popin" style={{ width: 88, height: 88, borderRadius: "50%", background: T.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CheckCircle />
                  </div>
                </div>

                <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 26, fontWeight: 800, color: T.text, letterSpacing: "-0.6px", marginBottom: 10 }}>Password reset!</h1>
                <p style={{ fontSize: 14, color: T.text2, lineHeight: 1.7, marginBottom: 36 }}>
                  Your password has been updated successfully. You can now sign in with your new password.
                </p>

                <button
                  type="button"
                  onClick={onBackToLogin}
                  style={{ width: "100%", padding: "16px", borderRadius: 14, border: "none", fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: T.blue, color: "#fff", transition: "all 0.18s" }}
                  onMouseEnter={e => e.currentTarget.style.background = T.blueDark}
                  onMouseLeave={e => e.currentTarget.style.background = T.blue}
                >
                  Sign in to your account <ArrowRight />
                </button>
              </div>
            )}

          </div>

          {/* Footer */}
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

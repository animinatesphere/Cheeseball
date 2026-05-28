import { useState, useEffect } from "react";
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
  red:        "#EF4444",
  redLight:   "#FEF2F2",
  redText:    "#B91C1C",
  orange:     "#F59E0B",
};

/* ─── Left panel data ────────────────────────────────────────── */
const PERKS = [
  { icon: "₦", label: "Earn ₦1,000",        sub: "For every friend you refer"             },
  { icon: "⚡", label: "Instant payouts",    sub: "NGN in your account under 5 minutes"   },
  { icon: "🔒", label: "Bank-grade security", sub: "256-bit encryption on every exchange"  },
  { icon: "📈", label: "Best NGN rates",     sub: "Live-updated, no hidden markups"        },
];

const RECENT = [
  { initials: "AO", name: "Adesola O.", action: "just joined", color: "#F7931A"  },
  { initials: "FB", name: "Fatima B.",  action: "just joined", color: T.blue     },
  { initials: "CE", name: "Chukwu E.",  action: "just joined", color: "#26A17B"  },
];

/* ─── Icons ──────────────────────────────────────────────────── */
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

const ShieldIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.mintGreen} strokeWidth="2" strokeLinecap="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const ArrowRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);



const GiftIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.blue} strokeWidth="2" strokeLinecap="round">
    <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/>
    <line x1="12" y1="22" x2="12" y2="7"/>
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
  </svg>
);

/* ─── Input component ────────────────────────────────────────── */
function Field({ label, type = "text", placeholder, value, onChange, onFocus, onBlur, focused, error, right, hint }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.text2, marginBottom: 7 }}>{label}</label>
      <div style={{ position: "relative" }}>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          style={{
            width: "100%", border: `1.5px solid ${focused ? T.blue : error ? T.red : T.border}`,
            borderRadius: 13, padding: right ? "13px 44px 13px 16px" : "13px 16px",
            fontSize: 14, color: T.text, fontFamily: "'DM Sans', sans-serif",
            outline: "none", transition: "border-color 0.15s", background: T.white,
          }}
        />
        {right && (
          <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)" }}>
            {right}
          </div>
        )}
      </div>
      {error && <p style={{ fontSize: 11, color: T.red, marginTop: 5, fontWeight: 500 }}>{error}</p>}
      {hint && !error && <p style={{ fontSize: 11, color: T.text3, marginTop: 5 }}>{hint}</p>}
    </div>
  );
}

/* ─── Password strength ──────────────────────────────────────── */
function PasswordStrength({ password }) {
  if (!password) return null;
  const hasLower   = /[a-z]/.test(password);
  const hasUpper   = /[A-Z]/.test(password);
  const hasNum     = /\d/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);
  const score = [password.length >= 8, hasLower, hasUpper, hasNum, hasSpecial].filter(Boolean).length;
  const label = score <= 2 ? "Weak" : score <= 3 ? "Fair" : score <= 4 ? "Good" : "Strong";
  const colors = ["#EF4444", "#EF4444", "#F59E0B", "#00C48C", "#00C48C"];
  const c = colors[score - 1] || T.border;
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 4, background: i <= Math.min(score, 4) ? c : T.border, transition: "background 0.2s" }} />
        ))}
      </div>
      <p style={{ fontSize: 11, color: c, fontWeight: 600 }}>{label} password</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
export default function AuthSignup({ onSignUp, onLogin, initialReferralCode = "" }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName:    "",
    email:       "",
    phone:       "",
    password:    "",
    confirmPass: "",
    referral:    initialReferralCode,
  });
  const [focused,      setFocused]      = useState("");
  const [showPass,     setShowPass]     = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [agreed,       setAgreed]       = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [errors,       setErrors]       = useState({});
  const [refFromLink,  setRefFromLink]  = useState(false);
  const [apiError,     setApiError]     = useState("");

  /* Auto-fill referral from URL query param: ?ref=CHEESE-JANE42 */
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const ref    = params.get("ref");
      if (ref) {
        setForm(f => ({ ...f, referral: ref }));
        setRefFromLink(true);
      }
    } catch (_) { /* SSR or env without window — safe to ignore */ }
  }, []);

  const set = (key) => (val) => {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim())               e.fullName    = "Full name is required";
    if (!form.email.includes("@"))           e.email       = "Enter a valid email address";
    if (form.phone.length < 10)              e.phone       = "Enter a valid phone number";
    if (form.password.length < 8)            e.password    = "Password must be at least 8 characters";
    if (form.confirmPass !== form.password)  e.confirmPass = "Passwords do not match";
    return e;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setApiError("");
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    if (!agreed || loading) return;
    setLoading(true);

    try {
      await authService.register({
        email: form.email,
        password: form.password,
        confirm_password: form.confirmPass,
        referral_code: form.referral,
      });

      if (onSignUp) {
        onSignUp();
      } else {
        navigate(`${paths.verifyAccount}?email=${encodeURIComponent(form.email)}`);
      }
    } catch (err) {
      setApiError(err.message || "Registration failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    if (onLogin) {
      onLogin();
    } else {
      navigate(paths.login);
    }
  };

  const canSubmit = agreed && form.fullName && form.email && form.phone && form.password && form.confirmPass && !loading;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'DM Sans',sans-serif;}
        input:-webkit-autofill{-webkit-box-shadow:0 0 0 40px ${T.white} inset!important;-webkit-text-fill-color:${T.text}!important;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .f1{animation:fadeUp 0.45s ease forwards}
        .f2{animation:fadeUp 0.45s 0.08s ease both}
        .f3{animation:fadeUp 0.45s 0.16s ease both}
        .float{animation:float 5s ease-in-out infinite}
        .blink{animation:blink 1.8s ease-in-out infinite}

        .submit-btn:hover:not(:disabled){background:${T.blueDark}!important;}
        .submit-btn:active:not(:disabled){transform:scale(0.985)!important;}
        .ref-chip-close:hover{background:rgba(26,111,255,0.2)!important;}

        .signup-grid { display: grid; grid-template-columns: 1fr 1fr; min-height: 100vh; font-family: 'DM Sans', sans-serif; }
        .left-panel { background: ${T.text}; position: relative; overflow: hidden; display: flex; flex-direction: column; padding: 44px 52px; }
        .right-panel { background: ${T.white}; overflow-y: auto; display: flex; flex-direction: column; align-items: center; padding: 48px 64px; }
        .mobile-logo { display: none; }
        .top-link { width: 100%; max-width: 420px; display: flex; justify-content: flex-end; margin-bottom: 28px; }

        @media (max-width: 1024px) {
          .signup-grid { grid-template-columns: 1fr !important; }
          .left-panel { display: none !important; }
          .right-panel { padding: 40px 20px !important; }
          .mobile-logo { display: flex !important; }
          .top-link { margin-bottom: 24px !important; }
        }
      `}</style>

      <div className="signup-grid">

        {/* ══ LEFT Panel ══ */}
        <div className="left-panel">
          <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: `${T.blue}12`, pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: `${T.blue}08`, pointerEvents: "none" }} />

          {/* Logo */}
          <div style={{ position: "relative", zIndex: 1, cursor: "pointer" }} onClick={() => navigate(paths.home)}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 800, color: T.white, letterSpacing: "-0.5px" }}>
              Cheese<span style={{ color: T.blue }}>ball</span>
            </div>
          </div>

          {/* Headline */}
          <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 28 }}>
            <div>
              <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 38, fontWeight: 800, color: T.white, letterSpacing: "-1.2px", lineHeight: 1.1, marginBottom: 12 }}>
                Your money.<br />Your speed.<br /><span style={{ color: T.blue }}>Your rates.</span>
              </h2>
              <p style={{ fontSize: 14, color: T.text3, lineHeight: 1.7, maxWidth: 320 }}>
                Create an account and start exchanging crypto &amp; gift cards for the best Naira rates — no hidden fees.
              </p>
            </div>

            {/* Perks */}
            <div className="float" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "20px", display: "flex", flexDirection: "column", gap: 14 }}>
              {PERKS.map((p) => (
                <div key={p.label} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 11, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{p.icon}</div>
                  <div>
                    <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700, color: T.white, marginBottom: 2 }}>{p.label}</p>
                    <p style={{ fontSize: 12, color: T.text3 }}>{p.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social proof */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                {RECENT.map((r, i) => (
                  <div key={r.initials} style={{ width: 30, height: 30, borderRadius: "50%", background: r.color, border: "2px solid rgba(10,15,30,0.8)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora', sans-serif", fontSize: 10, fontWeight: 700, color: "#fff", marginLeft: i > 0 ? -8 : 0, zIndex: RECENT.length - i }}>
                    {r.initials}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 12, color: T.text3, lineHeight: 1.5 }}>
                <span style={{ color: T.mintGreen, fontWeight: 600 }}>+38 people</span> joined this week
              </p>
            </div>
          </div>

          {/* Footer */}
          <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 6 }}>
            <ShieldIcon />
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontWeight: 500 }}>
              Your transaction is secure · Protected by Cheeseball
            </span>
          </div>
        </div>

        {/* ══ RIGHT — Form Panel ══ */}
        <div className="right-panel">

          {/* Top link */}
          <div className="top-link">
            <span style={{ fontSize: 13, color: T.text2 }}>Already have an account? </span>
            <button onClick={handleLoginRedirect} style={{ fontSize: 13, fontWeight: 700, color: T.blue, background: "none", border: "none", cursor: "pointer", padding: "0 0 0 5px" }}>
              Log in
            </button>
          </div>

          {/* Mobile Logo */}
          <div className="mobile-logo" style={{ alignItems: "center", gap: 10, marginBottom: 28, alignSelf: "flex-start", cursor: "pointer" }} onClick={() => navigate(paths.home)}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 20, fontWeight: 800, color: T.text, letterSpacing: "-0.5px" }}>
              Cheese<span style={{ color: T.blue }}>ball</span>
            </div>
          </div>

          <div style={{ width: "100%", maxWidth: 420 }}>

            {/* Heading */}
            <div className="f1" style={{ marginBottom: 28 }}>
              <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 28, fontWeight: 800, color: T.text, letterSpacing: "-0.7px", marginBottom: 6 }}>
                Create your account
              </h1>
              <p style={{ fontSize: 14, color: T.text2 }}>It takes less than 2 minutes.</p>
            </div>

            {/* Error banner */}
            {apiError && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: T.redLight, border: `1px solid #FECACA`, borderRadius: 12, padding: "12px 16px", marginBottom: 20, animation: "fadeUp 0.3s ease" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.red} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p style={{ fontSize: 13, color: T.redText, fontWeight: 500 }}>{apiError}</p>
              </div>
            )}

            {/* Fields form */}
            <form onSubmit={handleSubmit} className="f3" style={{ display: "flex", flexDirection: "column", gap: 14 }}>

              {/* Full name */}
              <Field
                label="Full name"
                placeholder="Jane Doe"
                value={form.fullName}
                onChange={set("fullName")}
                onFocus={() => setFocused("fullName")}
                onBlur={() => setFocused("")}
                focused={focused === "fullName"}
                error={errors.fullName}
              />

              {/* Email */}
              <Field
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={set("email")}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused("")}
                focused={focused === "email"}
                error={errors.email}
              />

              {/* Phone */}
              <Field
                label="Phone number"
                type="tel"
                placeholder="+234 800 000 0000"
                value={form.phone}
                onChange={set("phone")}
                onFocus={() => setFocused("phone")}
                onBlur={() => setFocused("")}
                focused={focused === "phone"}
                error={errors.phone}
              />

              {/* Password */}
              <div>
                <Field
                  label="Password"
                  type={showPass ? "text" : "password"}
                  placeholder="At least 8 characters"
                  value={form.password}
                  onChange={set("password")}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused("")}
                  focused={focused === "password"}
                  error={errors.password}
                  right={
                    <button type="button" onClick={() => setShowPass(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 0 }}>
                      <EyeIcon visible={!showPass} />
                    </button>
                  }
                />
                <PasswordStrength password={form.password} />
              </div>

              {/* Confirm password */}
              <Field
                label="Confirm password"
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter your password"
                value={form.confirmPass}
                onChange={set("confirmPass")}
                onFocus={() => setFocused("confirmPass")}
                onBlur={() => setFocused("")}
                focused={focused === "confirmPass"}
                error={errors.confirmPass}
                right={
                  <button type="button" onClick={() => setShowConfirm(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 0 }}>
                    <EyeIcon visible={!showConfirm} />
                  </button>
                }
              />

              {/* Referral code */}
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: T.text2, marginBottom: 7 }}>
                  <GiftIcon /> Referral code
                  <span style={{ fontSize: 11, color: T.text3, fontWeight: 400 }}>(optional)</span>
                </label>

                {refFromLink ? (
                  /* Auto-filled pill from referral link */
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: T.blueLight, border: `1.5px solid ${T.border}`, borderRadius: 13 }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: T.blue, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <CheckIcon />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700, color: T.blue, letterSpacing: "0.5px" }}>{form.referral}</p>
                      <p style={{ fontSize: 11, color: "#3B5AA8", marginTop: 1 }}>Referral code applied — you'll both earn ₦1,000</p>
                    </div>
                    <button
                      type="button"
                      className="ref-chip-close"
                      onClick={() => { setRefFromLink(false); set("referral")(""); }}
                      style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(26,111,255,0.12)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "background 0.15s" }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={T.blue} strokeWidth="3" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                ) : (
                  /* Empty input */
                  <input
                    type="text"
                    placeholder="e.g. CHEESE-JANE42"
                    value={form.referral}
                    onChange={e => set("referral")(e.target.value.toUpperCase())}
                    onFocus={() => setFocused("referral")}
                    onBlur={() => setFocused("")}
                    style={{ width: "100%", border: `1.5px solid ${focused === "referral" ? T.blue : T.border}`, borderRadius: 13, padding: "13px 16px", fontSize: 14, color: T.text, fontFamily: "'Sora', sans-serif", fontWeight: 600, letterSpacing: "0.5px", outline: "none", transition: "border-color 0.15s", background: T.white }}
                  />
                )}
              </div>

              {/* Terms checkbox */}
              <div
                style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer", marginTop: 2 }}
                onClick={() => setAgreed(a => !a)}
              >
                <div style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${agreed ? T.blue : T.border}`, background: agreed ? T.blue : T.white, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, transition: "all 0.15s" }}>
                  {agreed && <CheckIcon />}
                </div>
                <p style={{ fontSize: 13, color: T.text2, lineHeight: 1.55 }}>
                  I agree to Cheeseball's{" "}
                  <span style={{ color: T.blue, fontWeight: 600, cursor: "pointer" }}>Terms of Service</span>
                  {" "}and{" "}
                  <span style={{ color: T.blue, fontWeight: 600, cursor: "pointer" }}>Privacy Policy</span>.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="submit-btn"
                disabled={!canSubmit}
                style={{ width: "100%", padding: "16px", borderRadius: 14, border: "none", fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 700, cursor: canSubmit ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: canSubmit ? T.blue : "#E8EEFF", color: canSubmit ? "#fff" : T.text3, transition: "all 0.18s", marginTop: 10 }}
              >
                {loading
                  ? <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Creating account…</>
                  : <>Create account <ArrowRight /></>
                }
              </button>



              {/* Login link */}
              <p style={{ textAlign: "center", fontSize: 13, color: T.text2, paddingTop: 10 }}>
                Already have an account?{" "}
                <button type="button" onClick={handleLoginRedirect} style={{ fontSize: 13, fontWeight: 700, color: T.blue, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  Sign in
                </button>
              </p>
            </form>
          </div>
        </div>

      </div>
    </>
  );
}

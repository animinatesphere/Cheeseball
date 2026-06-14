import { useState, useRef, useEffect } from "react";
import { Upload, X, CheckCircle2, Shield, AlertTriangle, RefreshCw, ShieldCheck, Clock, ArrowRight, Lock, FileCheck, Hourglass } from "lucide-react";
import { uploadToCloudinary, submitKYC, getMyKYC } from "@/services/api";

/* ─── Tokens ─────────────────────────────────────────────────── */
const T = {
  blue:        "#1A6FFF",
  blueDark:    "#1259D9",
  blueLight:   "#EEF3FF",
  text:        "#0A0F1E",
  text2:       "#6B7A99",
  text3:       "#A8B4CC",
  border:      "#E8EEFF",
  surface:     "#F7F9FF",
  white:       "#FFFFFF",
  green:       "#00C48C",
  greenLight:  "#E6FAF4",
  greenText:   "#00966B",
  mintGreen:   "#4ADE80",
  orange:      "#F59E0B",
  orangeLight: "#FFFBEB",
  orangeText:  "#92400E",
  red:         "#EF4444",
  redLight:    "#FEF2F2",
  redText:     "#B91C1C",
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; }

  @keyframes fadeUp  { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
  @keyframes spin    { to { transform: rotate(360deg); } }
  @keyframes pulse   { 0%,100%{opacity:.2} 50%{opacity:.6} }
  @keyframes ripple  { 0%{transform:scale(.8);opacity:.5} 100%{transform:scale(2.4);opacity:0} }
  @keyframes blink   { 0%,100%{opacity:1} 50%{opacity:.25} }
  @keyframes pop     { 0%{transform:scale(.85);opacity:0} 70%{transform:scale(1.04)} 100%{transform:scale(1);opacity:1} }
  @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes tickIn  { from{stroke-dashoffset:40} to{stroke-dashoffset:0} }

  .fadein  { animation: fadeUp .4s ease both; }
  .fadein2 { animation: fadeUp .4s .08s ease both; }
  .fadein3 { animation: fadeUp .4s .16s ease both; }
  .fadein4 { animation: fadeUp .4s .24s ease both; }
  .fadein5 { animation: fadeUp .4s .32s ease both; }
  .popin   { animation: pop .45s cubic-bezier(.175,.885,.32,1.275) both; }
  .floater { animation: float 4s ease-in-out infinite; }

  .kyc-submit:hover:not(:disabled) { background: ${T.blueDark} !important; box-shadow: 0 8px 24px rgba(26,111,255,.28) !important; }
  .kyc-submit:active:not(:disabled) { transform: scale(.985) !important; }
  .idtype-btn:hover   { border-color: ${T.blue} !important; background: ${T.blueLight} !important; }
  .resubmit-btn:hover { background: ${T.blueDark} !important; box-shadow: 0 8px 24px rgba(26,111,255,.25) !important; }

  @media (max-width: 900px) {
    .kyc-split { flex-direction: column !important; }
    .kyc-right { border-left: none !important; border-top: 1px solid ${T.border} !important; padding: 32px 28px !important; }
    .kyc-left  { padding: 28px !important; }
  }
  @media (max-width: 640px) {
    .kyc-wrap { padding: 28px 20px 60px !important; }
    .idtype-grid { grid-template-columns: 1fr 1fr !important; }
  }
`;

/* ─── ID types ───────────────────────────────────────────────── */
const ID_TYPES = [
  { id: "nin",             label: "NIN",             sub: "National Identity Number", icon: "🪪" },
  { id: "passport",        label: "Passport",         sub: "International passport",  icon: "📘" },
  { id: "drivers_license", label: "Driver's License", sub: "Valid driving licence",   icon: "🚗" },
  { id: "voters_card",     label: "Voter's Card",     sub: "Permanent voter's card",  icon: "🗳️" },
];

/* ─── Upload zone ────────────────────────────────────────────── */
function UploadZone({ file, onFile, onRemove }) {
  const inputRef = useRef();
  const [drag, setDrag] = useState(false);
  const preview = file ? URL.createObjectURL(file) : null;

  const onDrop = (e) => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) onFile(f);
  };

  return (
    <div
      onClick={() => !file && inputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={onDrop}
      style={{
        border: `2px dashed ${file ? T.green : drag ? T.blue : T.border}`,
        borderRadius: 18, minHeight: 220,
        background: file ? T.greenLight : drag ? T.blueLight : T.surface,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        cursor: file ? "default" : "pointer", transition: "all .2s",
        position: "relative", overflow: "hidden",
      }}
    >
      {file ? (
        <>
          <img src={preview} alt="preview" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: .14 }} />
          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: T.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CheckCircle2 size={26} color="#fff" strokeWidth={2.5} />
            </div>
            <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 700, color: T.greenText }}>Document ready</p>
            <p style={{ fontSize: 12, color: T.text2 }}>{file.name}</p>
            <button onClick={e => { e.stopPropagation(); onRemove(); }}
              style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: T.redText, background: T.redLight, border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", marginTop: 4 }}>
              <X size={12} /> Change
            </button>
          </div>
        </>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "32px 24px", textAlign: "center" }}>
          <div style={{ width: 60, height: 60, borderRadius: 18, background: drag ? T.blue : T.white, border: `1.5px solid ${drag ? T.blue : T.border}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s", boxShadow: "0 2px 10px rgba(10,15,30,.06)" }}>
            <Upload size={24} color={drag ? "#fff" : T.text2} />
          </div>
          <div>
            <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 4 }}>
              {drag ? "Drop it here" : "Click or drag to upload"}
            </p>
            <p style={{ fontSize: 13, color: T.text3 }}>JPG, PNG · Max 5MB · Clear, well-lit photo</p>
          </div>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => { if (e.target.files[0]) onFile(e.target.files[0]); }} />
    </div>
  );
}

/* ─── UNDER REVIEW — full split layout ───────────────────────── */
function UnderReview() {
  const steps = [
    { label: "Documents received",    sub: "Your ID has been uploaded securely",        done: true,  active: false },
    { label: "Identity verification", sub: "Our compliance team is reviewing your ID",  done: false, active: true  },
    { label: "Verification complete", sub: "You'll be notified once a decision is made", done: false, active: false },
  ];

  return (
    <div className="kyc-split" style={{ display: "flex", flex: 1 }}>

      {/* LEFT — main message */}
      <div className="kyc-left" style={{ flex: "1 1 0", padding: "52px 60px", display: "flex", flexDirection: "column" }}>

        {/* Animated icon */}
        <div className="popin floater" style={{ position: "relative", width: 100, height: 100, marginBottom: 36 }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2.5px solid ${T.orange}`, opacity: .2, animation: "pulse 2.5s ease-in-out infinite" }} />
          <div style={{ position: "absolute", inset: 12, borderRadius: "50%", border: `2px solid ${T.orange}`, opacity: .12, animation: "pulse 2.5s .5s ease-in-out infinite" }} />
          <div style={{ width: 100, height: 100, borderRadius: "50%", background: `linear-gradient(145deg, ${T.orangeLight}, #FEF3C7)`, border: `2px solid #FDE68A`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 40px rgba(245,158,11,.2)" }}>
            <Clock size={44} color={T.orange} strokeWidth={1.6} />
          </div>
        </div>

        <span className="fadein" style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: T.orange, textTransform: "uppercase", letterSpacing: "1.4px", marginBottom: 14, background: T.orangeLight, border: "1px solid #FDE68A", borderRadius: 20, padding: "4px 12px", alignSelf: "flex-start" }}>
          In Review
        </span>

        <h1 className="fadein2" style={{ fontFamily: "'Sora',sans-serif", fontSize: 36, fontWeight: 800, color: T.text, letterSpacing: "-0.8px", lineHeight: 1.2, marginBottom: 16 }}>
          We're verifying<br />your identity
        </h1>

        <p className="fadein3" style={{ fontSize: 16, color: T.text2, lineHeight: 1.75, marginBottom: 36, maxWidth: 440 }}>
          Our compliance team is reviewing your documents. You'll receive an email notification the moment it's complete.
        </p>

        {/* Estimated time callout */}
        <div className="fadein4" style={{ display: "flex", alignItems: "center", gap: 14, background: T.orangeLight, border: "1.5px solid #FDE68A", borderRadius: 16, padding: "16px 22px", maxWidth: 380 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: T.orange, animation: "blink 1.5s ease-in-out infinite", flexShrink: 0 }} />
          <p style={{ fontSize: 14, color: T.orangeText, lineHeight: 1.5 }}>
            Estimated review time: <strong style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700 }}>2–6 hours</strong>
          </p>
        </div>

        <p className="fadein5" style={{ fontSize: 13, color: T.text3, marginTop: 28 }}>
          Questions? Email <strong style={{ color: T.text2 }}>support@cheeseballapp.com</strong>
        </p>
      </div>

      {/* RIGHT — progress tracker */}
      <div className="kyc-right" style={{ width: 380, flexShrink: 0, borderLeft: `1px solid ${T.border}`, background: T.surface, padding: "52px 40px", display: "flex", flexDirection: "column" }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: T.text3, textTransform: "uppercase", letterSpacing: ".8px", marginBottom: 32 }}>Verification progress</p>

        <div style={{ position: "relative" }}>
          {/* Vertical connector line */}
          <div style={{ position: "absolute", left: 17, top: 36, bottom: 36, width: 2, background: T.border, zIndex: 0 }} />

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 20, position: "relative", paddingBottom: i < steps.length - 1 ? 40 : 0 }}>
                {/* Node */}
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", flexShrink: 0, zIndex: 1,
                  background: step.done ? T.green : step.active ? T.orange : T.white,
                  border: `2px solid ${step.done ? T.green : step.active ? T.orange : T.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: step.active ? `0 0 0 5px ${T.orangeLight}` : step.done ? `0 0 0 4px ${T.greenLight}` : "none",
                  transition: "all .3s",
                }}>
                  {step.done
                    ? <CheckCircle2 size={18} color="#fff" strokeWidth={2.5} />
                    : step.active
                      ? <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#fff", animation: "blink 1.3s ease-in-out infinite" }} />
                      : <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.border }} />
                  }
                </div>

                {/* Content */}
                <div style={{ paddingTop: 4, flex: 1 }}>
                  <p style={{
                    fontFamily: step.done || step.active ? "'Sora',sans-serif" : "inherit",
                    fontSize: 14, fontWeight: step.done || step.active ? 700 : 500,
                    color: step.done ? T.text : step.active ? T.orangeText : T.text3,
                    marginBottom: 4,
                  }}>
                    {step.label}
                  </p>
                  <p style={{ fontSize: 13, color: step.active ? T.orange : T.text3, lineHeight: 1.5 }}>
                    {step.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What happens next */}
        <div style={{ marginTop: "auto", paddingTop: 36, borderTop: `1px solid ${T.border}` }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: T.text3, textTransform: "uppercase", letterSpacing: ".8px", marginBottom: 16 }}>What happens next</p>
          {[
            "We'll email you once review is complete",
            "If approved, your account is instantly unlocked",
            "If we need more info, we'll reach out directly",
          ].map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: T.blueLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                <ArrowRight size={10} color={T.blue} />
              </div>
              <p style={{ fontSize: 13, color: T.text2, lineHeight: 1.5 }}>{t}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── VERIFIED — full split layout ───────────────────────────── */
function Verified() {
  const perks = [
    { icon: <ShieldCheck size={20} color={T.greenText} />, label: "Identity Verified",       sub: "Your ID has been confirmed"           },
    { icon: "💸",                                          label: "Unlimited Withdrawals",   sub: "No payout limits on your account"     },
    { icon: "🔄",                                          label: "Full Crypto Swaps",       sub: "Access all swap pairs"                },
    { icon: "📈",                                          label: "Higher Trade Limits",     sub: "Trade larger volumes instantly"       },
    { icon: "🎁",                                          label: "Gift Card Redemption",    sub: "Redeem all gift card brands"          },
    { icon: "⚡",                                           label: "Priority Processing",    sub: "Faster transaction confirmations"     },
  ];

  return (
    <div className="kyc-split" style={{ display: "flex", flex: 1 }}>

      {/* LEFT */}
      <div className="kyc-left" style={{ flex: "1 1 0", padding: "52px 60px", display: "flex", flexDirection: "column" }}>

        {/* Animated badge */}
        <div className="popin floater" style={{ position: "relative", width: 110, height: 110, marginBottom: 36 }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `3px solid ${T.green}`, opacity: .25, animation: "ripple 2.2s ease-out infinite" }} />
          <div style={{ position: "absolute", inset: 10, borderRadius: "50%", border: `2px solid ${T.green}`, opacity: .12, animation: "ripple 2.2s .6s ease-out infinite" }} />
          <div style={{ width: 110, height: 110, borderRadius: "50%", background: `linear-gradient(145deg, #00E6A8, ${T.green})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 16px 48px rgba(0,196,140,.3)" }}>
            <ShieldCheck size={50} color="#fff" strokeWidth={1.6} />
          </div>
        </div>

        <span className="fadein" style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: T.greenText, textTransform: "uppercase", letterSpacing: "1.4px", marginBottom: 14, background: T.greenLight, border: "1px solid #A7F3D0", borderRadius: 20, padding: "4px 12px" }}>
          Verified
        </span>

        <h1 className="fadein2" style={{ fontFamily: "'Sora',sans-serif", fontSize: 36, fontWeight: 800, color: T.text, letterSpacing: "-0.8px", lineHeight: 1.2, marginBottom: 16 }}>
          You're fully<br />verified! 🎉
        </h1>

        <p className="fadein3" style={{ fontSize: 16, color: T.text2, lineHeight: 1.75, marginBottom: 36, maxWidth: 420 }}>
          Your identity has been confirmed. You now have complete access to all Cheeseball features with no restrictions.
        </p>

        <div className="fadein4" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: T.white, border: `1.5px solid #A7F3D0`, borderRadius: 30, padding: "12px 22px", boxShadow: "0 4px 20px rgba(0,196,140,.12)" }}>
          <Shield size={18} color={T.green} />
          <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 700, color: T.greenText }}>Cheeseball Verified Account</span>
        </div>
      </div>

      {/* RIGHT — perks grid */}
      <div className="kyc-right" style={{ width: 420, flexShrink: 0, borderLeft: `1px solid ${T.border}`, background: T.surface, padding: "52px 40px" }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: T.text3, textTransform: "uppercase", letterSpacing: ".8px", marginBottom: 24 }}>What you've unlocked</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {perks.map((p, i) => (
            <div
              key={i}
              style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 16, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, animation: `fadeUp .4s ${i * .06}s ease both`, transition: "border-color .15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = T.green}
              onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
            >
              <div style={{ width: 44, height: 44, borderRadius: 13, background: T.greenLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 20 }}>
                {typeof p.icon === "string" ? p.icon : p.icon}
              </div>
              <div>
                <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 700, color: T.text }}>{p.label}</p>
                <p style={{ fontSize: 12, color: T.text2, marginTop: 2 }}>{p.sub}</p>
              </div>
              <CheckCircle2 size={16} color={T.green} style={{ marginLeft: "auto", flexShrink: 0 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── REJECTED — full split layout ───────────────────────────── */
function Rejected({ reason, onResubmit }) {
  const fixes = [
    { n: "1", text: "Photo must be sharp and in-focus — no blurry shots" },
    { n: "2", text: "All four corners of the ID must be fully visible" },
    { n: "3", text: "No glare, shadows, obstructions or covering" },
    { n: "4", text: "Name on ID must exactly match your registered account name" },
    { n: "5", text: "Upload the original — no photocopies or digital scans" },
  ];

  return (
    <div className="kyc-split" style={{ display: "flex", flex: 1 }}>

      {/* LEFT */}
      <div className="kyc-left" style={{ flex: "1 1 0", padding: "52px 60px", display: "flex", flexDirection: "column" }}>

        <div className="popin" style={{ position: "relative", width: 100, height: 100, marginBottom: 36 }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: T.redLight, opacity: .6 }} />
          <div style={{ width: 100, height: 100, borderRadius: "50%", background: `linear-gradient(145deg, #FEE2E2, #FECACA)`, border: `2px solid #FECACA`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", boxShadow: "0 12px 36px rgba(239,68,68,.18)" }}>
            <AlertTriangle size={44} color={T.red} strokeWidth={1.6} />
          </div>
        </div>

        <span className="fadein" style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: T.redText, textTransform: "uppercase", letterSpacing: "1.4px", marginBottom: 14, background: T.redLight, border: "1px solid #FECACA", borderRadius: 20, padding: "4px 12px" }}>
          Action Required
        </span>

        <h1 className="fadein2" style={{ fontFamily: "'Sora',sans-serif", fontSize: 36, fontWeight: 800, color: T.text, letterSpacing: "-0.8px", lineHeight: 1.2, marginBottom: 16 }}>
          Verification<br />unsuccessful
        </h1>

        <p className="fadein3" style={{ fontSize: 16, color: T.text2, lineHeight: 1.75, marginBottom: 28, maxWidth: 420 }}>
          We couldn't verify your identity. Please review the reason below, fix the issue, and resubmit your documents.
        </p>

        {/* Rejection reason */}
        {reason && (
          <div className="fadein4" style={{ background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: 18, padding: "20px 24px", marginBottom: 32, maxWidth: 480 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: T.red, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <AlertTriangle size={14} color="#fff" />
              </div>
              <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 700, color: T.redText }}>Rejection reason</p>
            </div>
            <p style={{ fontSize: 14, color: T.redText, lineHeight: 1.65, fontStyle: "italic" }}>"{reason}"</p>
          </div>
        )}

        <button
          className="resubmit-btn"
          onClick={onResubmit}
          style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 32px", borderRadius: 16, border: "none", background: T.blue, color: "#fff", fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "all .2s", boxShadow: "0 8px 24px rgba(26,111,255,.22)", alignSelf: "flex-start" }}
        >
          <RefreshCw size={17} strokeWidth={2.5} /> Resubmit Documents
        </button>
      </div>

      {/* RIGHT — how to fix */}
      <div className="kyc-right" style={{ width: 400, flexShrink: 0, borderLeft: `1px solid ${T.border}`, background: T.surface, padding: "52px 40px", display: "flex", flexDirection: "column" }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: T.text3, textTransform: "uppercase", letterSpacing: ".8px", marginBottom: 24 }}>How to fix it</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {fixes.map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, animation: `fadeUp .4s ${i * .07}s ease both` }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: T.white, border: `1.5px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 12, fontWeight: 700, color: T.blue }}>{f.n}</span>
              </div>
              <p style={{ fontSize: 14, color: T.text2, lineHeight: 1.6, paddingTop: 3 }}>{f.text}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "auto", paddingTop: 32, borderTop: `1px solid ${T.border}` }}>
          <div style={{ background: T.blueLight, border: `1px solid ${T.blue}25`, borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "flex-start", gap: 10 }}>
            <Lock size={14} color={T.blue} style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 13, color: "#3B5AA8", lineHeight: 1.55 }}>
              Your documents are encrypted and stored securely. Resubmission uses the same secure upload.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── UPLOAD FORM — split layout ─────────────────────────────── */
function UploadForm({ isResubmit, rejectionReason, onSubmitted, onKycUpdate }) {
  const [idType,     setIdType]     = useState("nin");
  const [file,       setFile]       = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState("");
  const canSubmit = file && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true); setError("");
    try {
      const url = await uploadToCloudinary(file);
      await submitKYC({ id_type: idType, document_url: url });
      onKycUpdate?.();
      onSubmitted();
    } catch (err) {
      setError(err.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="kyc-split" style={{ display: "flex", flex: 1 }}>

      {/* LEFT — form */}
      <div className="kyc-left" style={{ flex: "1 1 0", padding: "52px 60px", display: "flex", flexDirection: "column" }}>

        {/* Resubmit rejection banner */}
        {isResubmit && rejectionReason && (
          <div className="fadein" style={{ background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: 16, padding: "16px 20px", display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 28 }}>
            <AlertTriangle size={16} color={T.red} style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: T.redText, marginBottom: 4 }}>Previous submission rejected</p>
              <p style={{ fontSize: 13, color: T.redText, lineHeight: 1.55 }}>{rejectionReason}</p>
            </div>
          </div>
        )}

        {/* Important notice */}
        <div className="fadein2" style={{ background: T.blueLight, border: `1px solid ${T.blue}20`, borderRadius: 16, padding: "14px 18px", display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 28 }}>
          <Shield size={16} color={T.blue} style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 13, color: "#3B5AA8", lineHeight: 1.6 }}>
            <strong>Important:</strong> The name on your ID must <strong>exactly match</strong> the name on your registered account.
          </p>
        </div>

        {/* ID type selector */}
        <div className="fadein3" style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: T.text2, marginBottom: 12, textTransform: "uppercase", letterSpacing: ".6px" }}>Select Document Type</p>
          <div className="idtype-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {ID_TYPES.map(t => {
              const active = idType === t.id;
              return (
                <button key={t.id} className="idtype-btn" onClick={() => setIdType(t.id)}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 14, border: `1.5px solid ${active ? T.blue : T.border}`, background: active ? T.blueLight : T.white, cursor: "pointer", transition: "all .15s", textAlign: "left" }}>
                  <span style={{ fontSize: 22 }}>{t.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 700, color: active ? T.blue : T.text }}>{t.label}</p>
                    <p style={{ fontSize: 11, color: active ? T.blue : T.text3, marginTop: 1 }}>{t.sub}</p>
                  </div>
                  {active && <div style={{ width: 18, height: 18, borderRadius: "50%", background: T.blue, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><CheckCircle2 size={11} color="#fff" /></div>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Upload */}
        <div className="fadein4" style={{ marginBottom: 24 }}>
          <UploadZone file={file} onFile={setFile} onRemove={() => setFile(null)} />
        </div>

        {error && (
          <div style={{ background: T.redLight, border: "1px solid #FECACA", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <AlertTriangle size={14} color={T.red} />
            <p style={{ fontSize: 13, color: T.redText }}>{error}</p>
          </div>
        )}

        <button
          className="kyc-submit"
          onClick={handleSubmit}
          disabled={!canSubmit}
          style={{ width: "100%", padding: "18px", borderRadius: 16, border: "none", fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 700, cursor: canSubmit ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, transition: "all .2s", background: canSubmit ? T.blue : "#E8EEFF", color: canSubmit ? "#fff" : T.text3, boxShadow: canSubmit ? "0 8px 24px rgba(26,111,255,.18)" : "none" }}
        >
          {submitting
            ? <><div style={{ width: 18, height: 18, border: "2.5px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .7s linear infinite" }} /> Uploading & Submitting…</>
            : isResubmit ? <><RefreshCw size={17} /> Resubmit for Verification</> : <>Submit for Verification <ArrowRight size={17} /></>
          }
        </button>

        <p style={{ fontSize: 12, color: T.text3, textAlign: "center", marginTop: 14, lineHeight: 1.5 }}>
          Your documents are encrypted in transit and stored securely.
        </p>
      </div>

      {/* RIGHT — tips panel */}
      <div className="kyc-right" style={{ width: 360, flexShrink: 0, borderLeft: `1px solid ${T.border}`, background: T.surface, padding: "52px 36px" }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: T.text3, textTransform: "uppercase", letterSpacing: ".8px", marginBottom: 24 }}>Photo requirements</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 36 }}>
          {[
            { icon: "✅", tip: "Sharp and in-focus — no motion blur"              },
            { icon: "✅", tip: "All four corners of the ID fully visible"          },
            { icon: "✅", tip: "Good lighting — no glare or heavy shadows"         },
            { icon: "✅", tip: "Same name as your registered Cheeseball account"   },
            { icon: "❌", tip: "No photocopies, scans or digital reproductions"   },
          ].map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{t.icon}</span>
              <p style={{ fontSize: 13, color: T.text2, lineHeight: 1.55 }}>{t.tip}</p>
            </div>
          ))}
        </div>

        <div style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 16, padding: "20px 22px" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: T.text3, textTransform: "uppercase", letterSpacing: ".6px", marginBottom: 14 }}>Accepted documents</p>
          {ID_TYPES.map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < ID_TYPES.length - 1 ? `1px solid ${T.border}` : "none" }}>
              <span style={{ fontSize: 18 }}>{t.icon}</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{t.label}</p>
                <p style={{ fontSize: 11, color: T.text3 }}>{t.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Breadcrumbs ────────────────────────────────────────────── */
function KYCBreadcrumbs({ onNavigate, status }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 52px", borderBottom: `1px solid ${T.border}`, background: T.white, flexShrink: 0 }}>
      <nav style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span onClick={() => onNavigate?.("dashboard")}
          style={{ fontSize: 13, color: T.text2, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
          Dashboard
        </span>
        <span style={{ color: T.text3, fontSize: 12 }}>›</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: T.blue, fontFamily: "'DM Sans',sans-serif" }}>
          Identity Verification
        </span>
      </nav>

      {/* Status pill */}
      {status && status !== "unverified" && (
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          background: status === "verified" ? T.greenLight : status === "in_review" ? T.orangeLight : T.redLight,
          border: `1px solid ${status === "verified" ? "#A7F3D0" : status === "in_review" ? "#FDE68A" : "#FECACA"}`,
          borderRadius: 30, padding: "5px 13px",
        }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: status === "verified" ? T.green : status === "in_review" ? T.orange : T.red, animation: status === "in_review" ? "blink 1.6s ease-in-out infinite" : "none" }} />
          <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 12, fontWeight: 700, color: status === "verified" ? T.greenText : status === "in_review" ? T.orangeText : T.redText }}>
            {status === "in_review" ? "In Review" : status === "verified" ? "Verified" : "Rejected"}
          </span>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
export default function KYCVerification({
  onNavigate,
  kycStatus:           initialStatus    = "unverified",
  kycRejectionReason:  initialRejReason = "",
  onKycUpdate,
}) {
  const mapStatus = (s) => {
    if (!s || s === "unverified" || s === "none") return "unverified";
    if (s === "submitted" || s === "in_review")   return "in_review";
    if (s === "verified")                          return "verified";
    if (s === "rejected")                          return "rejected";
    return "unverified";
  };

  const [status,          setStatus]          = useState(mapStatus(initialStatus));
  const [rejectionReason, setRejectionReason] = useState(initialRejReason || "");
  const [resubmit,        setResubmit]        = useState(false);

  useEffect(() => {
    setStatus(mapStatus(initialStatus));
    setRejectionReason(initialRejReason || "");
  }, [initialStatus, initialRejReason]);

  /* Live fetch from backend on mount */
  useEffect(() => {
    let mounted = true;
    getMyKYC().then(data => {
      if (!mounted) return;
      if (data?.kyc_status) setStatus(mapStatus(data.kyc_status));
      if (data?.latest_submission?.admin_note) setRejectionReason(data.latest_submission.admin_note);
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  const showForm = status === "unverified" || resubmit;

  return (
    <>
      <style>{CSS}</style>
      <div style={{ height: "100%", background: T.white, fontFamily: "'DM Sans',sans-serif", color: T.text, display: "flex", flexDirection: "column" }}>

        <KYCBreadcrumbs onNavigate={onNavigate} status={showForm ? null : status} />

        {/* Page title row */}
        {!showForm && (
          <div style={{ padding: "28px 52px 0" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.blue, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>Identity Verification</p>
          </div>
        )}
        {showForm && (
          <div style={{ padding: "28px 52px 0" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.blue, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>Identity Verification</p>
            <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: 26, fontWeight: 800, color: T.text, letterSpacing: "-0.5px" }}>
              {resubmit ? "Resubmit your documents" : "Verify your identity"}
            </h1>
          </div>
        )}

        {/* State content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {showForm && (
            <UploadForm
              isResubmit={resubmit}
              rejectionReason={rejectionReason}
              onKycUpdate={onKycUpdate}
              onSubmitted={() => { setResubmit(false); setStatus("in_review"); }}
            />
          )}
          {!showForm && status === "in_review" && <UnderReview />}
          {!showForm && status === "verified"   && <Verified />}
          {!showForm && status === "rejected"   && <Rejected reason={rejectionReason} onResubmit={() => setResubmit(true)} />}
        </div>
      </div>
    </>
  );
}

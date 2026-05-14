import React, { useState, useEffect } from "react";

const LAUNCH_DATE = new Date(Date.now() + 47 * 24 * 60 * 60 * 1000);

const pad = (n) => String(n).padStart(2, "0");

function useCountdown(target) {
  const [time, setTime] = useState({ d: "00", h: "00", m: "00", s: "00" });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, target - new Date());
      setTime({
        d: pad(Math.floor(diff / 864e5)),
        h: pad(Math.floor((diff % 864e5) / 36e5)),
        m: pad(Math.floor((diff % 36e5) / 6e4)),
        s: pad(Math.floor((diff % 6e4) / 1e3)),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return time;
}

const T = {
  blue:      "#1A6FFF",
  blueDark:  "#1259D9",
  blueLight: "#EEF3FF",
  text:      "#0A0F1E",
  text2:     "#6B7A99",
  text3:     "#A8B4CC",
  border:    "#E8EEFF",
  white:     "#FFFFFF",
  green:     "#00C48C",
  greenLight:"#E6FAF4",
  greenText: "#00966B",
  mintGreen: "#4ADE80",
};

const FEATURES = [
  "Buy & Sell Crypto",
  "Instant NGN Payouts",
  "Bank & Wallet Transfer",
];

const Ico = {
  shield: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.mintGreen} strokeWidth="2" strokeLinecap="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.green} strokeWidth="2.5" strokeLinecap="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
};

function CounterBlock({ value, label, sep }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 72 }}>
        <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 44, fontWeight: 700, color: T.text, letterSpacing: "-2px", lineHeight: 1 }}>
          {value}
        </span>
        <span style={{ fontSize: 11, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "0.8px" }}>
          {label}
        </span>
      </div>
      {sep && (
        <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 36, fontWeight: 700, color: T.border, lineHeight: 1, paddingBottom: 18 }}>
          :
        </span>
      )}
    </div>
  );
}

export default function SupportPage({ onBack }) {
  const [email, setEmail]       = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]       = useState(false);
  const { d, h, m, s }          = useCountdown(LAUNCH_DATE);

  const handleSubmit = () => {
    if (!email.trim() || !email.includes("@")) {
      setError(true);
      setTimeout(() => setError(false), 2000);
      return;
    }
    setSubmitted(true);
    // TODO: call your API here with `email`
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#fff;}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes popIn{0%{transform:scale(0.92);opacity:0}100%{transform:scale(1);opacity:1}}
        .fadein{animation:fadeUp 0.5s ease forwards;}
        .popin{animation:popIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards;}
        .blink{animation:blink 1.8s ease-in-out infinite;}
        .notify-btn:hover{background:#1259D9!important;}
        .notify-btn:active{transform:scale(0.97)!important;}
        .input-wrap:focus-within{border-color:#1A6FFF!important;}
      `}</style>

      <div style={{ minHeight: "100vh", background: T.white, fontFamily: "'DM Sans', sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 24px", position: "relative", overflow: "hidden" }}>

        {onBack && (
          <button 
            onClick={onBack}
            style={{ position: "absolute", top: 24, left: 24, padding: "10px 16px", background: "transparent", border: "1px solid " + T.border, borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, zIndex: 10 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.text} strokeWidth="2" strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 600, color: T.text }}>Back</span>
          </button>
        )}

        {/* Background blobs */}
        <div style={{ position: "absolute", top: -180, right: -160, width: 500, height: 500, borderRadius: "50%", background: T.blueLight, opacity: 0.5, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -120, left: -100, width: 320, height: 320, borderRadius: "50%", background: T.blueLight, opacity: 0.4, pointerEvents: "none" }} />

        <div className="fadein" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", width: "100%", maxWidth: 580, position: "relative", zIndex: 1 }}>

          {/* Logo */}
          <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 700, color: T.text, letterSpacing: "-0.5px", marginBottom: 36 }}>
            Cheese<span style={{ color: T.blue }}>ball</span>
          </p>

          {/* Status pill */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: T.blueLight, borderRadius: 20, padding: "6px 14px", marginBottom: 24 }}>
            <div className="blink" style={{ width: 7, height: 7, borderRadius: "50%", background: T.blue, flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: T.blue }}>In development</span>
          </div>

          {/* Headline */}
          <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 52, fontWeight: 700, color: T.text, letterSpacing: "-2px", lineHeight: 1.08, marginBottom: 18 }}>
            Something big<br />is coming.
          </h1>
          <p style={{ fontSize: 16, color: T.text2, lineHeight: 1.7, maxWidth: 400, marginBottom: 0 }}>
            We're building something you'll love. Be the first to know when we launch.
          </p>

          {/* Countdown */}
          <div style={{ display: "flex", alignItems: "center", gap: 0, margin: "40px 0" }}>
            <CounterBlock value={d} label="Days"  sep />
            <CounterBlock value={h} label="Hours" sep />
            <CounterBlock value={m} label="Mins"  sep />
            <CounterBlock value={s} label="Secs"  sep={false} />
          </div>

          {/* Email capture */}
          {!submitted ? (
            <div style={{ width: "100%", maxWidth: 440 }}>
              <div
                className="input-wrap"
                style={{ display: "flex", border: `1.5px solid ${error ? "#EF4444" : T.border}`, borderRadius: 14, overflow: "hidden", transition: "border-color 0.18s", background: T.white }}
              >
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  style={{ flex: 1, border: "none", outline: "none", padding: "15px 18px", fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: T.text, background: "transparent" }}
                />
                <button
                  className="notify-btn"
                  onClick={handleSubmit}
                  style={{ padding: "15px 24px", background: T.blue, border: "none", cursor: "pointer", fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 700, color: "#fff", transition: "background 0.18s", whiteSpace: "nowrap" }}
                >
                  Notify me
                </button>
              </div>
              {error && (
                <p style={{ fontSize: 12, color: "#EF4444", marginTop: 8, textAlign: "left", paddingLeft: 4 }}>
                  Please enter a valid email address.
                </p>
              )}
              <p style={{ fontSize: 12, color: T.text3, marginTop: 10 }}>No spam. Unsubscribe anytime.</p>
            </div>
          ) : (
            <div className="popin" style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 22px", background: T.greenLight, borderRadius: 14, border: `1.5px solid #A7F3D0` }}>
              <Ico.check />
              <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 700, color: T.greenText }}>
                You're on the list! We'll be in touch.
              </span>
            </div>
          )}

          {/* Feature hints */}
          <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap", marginTop: 44 }}>
            {FEATURES.map((f) => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: T.text2, fontWeight: 500 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.blue, flexShrink: 0 }} />
                {f}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 48 }}>
            <Ico.shield />
            <span style={{ fontSize: 12, color: T.text3, fontWeight: 500 }}>
              Your transaction is secure ·{" "}
              <span style={{ color: T.mintGreen, fontWeight: 600 }}>Protected by Cheeseball</span>
            </span>
          </div>

        </div>
      </div>
    </>
  );
}

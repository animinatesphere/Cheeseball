import { useState, useRef } from "react";
import {
  Upload, X, CheckCircle2, ChevronRight, ArrowLeft,
} from "lucide-react";

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
};

/* ─── Gift card catalogue ────────────────────────────────────── */
const CARDS = [
  { id: "amazon",      name: "Amazon",         color: "#FF9900", bg: "#FFF8EC", rate: 1_400, icon: "A",  popular: true  },
  { id: "itunes",      name: "iTunes / Apple", color: "#555555", bg: "#F5F5F7", rate: 1_350, icon: "🍎", popular: true  },
  { id: "google-play", name: "Google Play",    color: "#00C853", bg: "#E8FAF0", rate: 1_300, icon: "▶",  popular: true  },
  { id: "steam",       name: "Steam",          color: "#1B2838", bg: "#EDF0F5", rate: 1_250, icon: "S",  popular: false },
  { id: "xbox",        name: "Xbox",           color: "#107C10", bg: "#E8F5E8", rate: 1_200, icon: "X",  popular: false },
  { id: "playstation", name: "PlayStation",    color: "#003791", bg: "#E8EEF8", rate: 1_300, icon: "P",  popular: false },
  { id: "netflix",     name: "Netflix",        color: "#E50914", bg: "#FDEAEA", rate: 1_100, icon: "N",  popular: false },
  { id: "sephora",     name: "Sephora",        color: "#C5007C", bg: "#FAEAF5", rate: 1_150, icon: "S",  popular: false },
  { id: "walmart",     name: "Walmart",        color: "#0071CE", bg: "#E8F3FD", rate: 1_350, icon: "W",  popular: false },
  { id: "ebay",        name: "eBay",           color: "#E53238", bg: "#FDEAEA", rate: 1_280, icon: "e",  popular: false },
];

const DENOMINATIONS = [25, 50, 100, 200, 500];

/* ─── Helpers ────────────────────────────────────────────────── */
const fmtNGN = (n) => "₦" + Number(n).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtUSD = (n) => "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });

const Ico = {
  shield: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.mintGreen} strokeWidth="2" strokeLinecap="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
};

/* ─── Image uploader ─────────────────────────────────────────── */
function ImageUpload({ file, onFile, onRemove }) {
  const inputRef  = useRef();
  const [drag, setDrag] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) onFile(f);
  };

  const preview = file ? URL.createObjectURL(file) : null;

  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>Gift card image</p>
      <div
        onClick={() => !file && inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
        style={{ border: `1.5px dashed ${file ? T.green : drag ? T.blue : T.border}`, borderRadius: 16, background: file ? T.greenLight : drag ? T.blueLight : T.surface, minHeight: 160, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: file ? "default" : "pointer", transition: "all 0.18s", position: "relative", overflow: "hidden" }}
      >
        {file ? (
          <>
            <img src={preview} alt="Gift card" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.2 }} />
            <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: T.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CheckCircle2 size={20} color="#fff" />
              </div>
              <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700, color: T.greenText }}>Image uploaded</p>
              <p style={{ fontSize: 11, color: T.text2, maxWidth: 160, textAlign: "center", lineHeight: 1.4 }}>{file.name}</p>
              <button onClick={e => { e.stopPropagation(); onRemove(); }} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, color: T.red, background: T.redLight, border: "none", borderRadius: 8, padding: "5px 10px", cursor: "pointer", marginTop: 2 }}>
                <X size={11} /> Remove
              </button>
            </div>
          </>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: 24, textAlign: "center" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: drag ? T.blue : T.white, border: `1.5px solid ${drag ? T.blue : T.border}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.18s" }}>
              <Upload size={18} color={drag ? "#fff" : T.text2} />
            </div>
            <div>
              <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 3 }}>{drag ? "Drop here" : "Click or drag to upload"}</p>
              <p style={{ fontSize: 12, color: T.text3, lineHeight: 1.5 }}>Clear photo showing the card code</p>
            </div>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => { if (e.target.files[0]) onFile(e.target.files[0]); }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
export default function SwapGiftCard({ onNavigate }) {
  const [selected,     setSelected]     = useState(null);
  const [denomination, setDenomination] = useState("");
  const [customAmt,    setCustomAmt]    = useState("");
  const [cardImage,    setCardImage]    = useState(null);
  const [submitting,   setSubmitting]   = useState(false);
  const [submitted,    setSubmitted]    = useState(false);

  const card    = CARDS.find(c => c.id === selected);
  const amount  = denomination === "custom" ? parseFloat(customAmt) || 0 : parseFloat(denomination) || 0;
  const payout  = card ? amount * card.rate : 0;
  const fee     = payout * 0.01;
  const net     = payout - fee;
  const ready   = card && amount > 0 && cardImage && !submitting;

  const handleSubmit = () => {
    if (!ready) return;
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 1800);
  };

  const reset = () => { setSelected(null); setDenomination(""); setCustomAmt(""); setCardImage(null); setSubmitted(false); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-track{background:transparent;} ::-webkit-scrollbar-thumb{background:${T.border};border-radius:4px;}
        input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;}
        input[type=number]{-moz-appearance:textfield;}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes popIn{0%{transform:scale(0.95);opacity:0}100%{transform:scale(1);opacity:1}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes ripple{0%{transform:scale(0.8);opacity:0.5}100%{transform:scale(1.5);opacity:0}}
        .fadein{animation:fadeUp 0.3s ease forwards}
        .brand-card:hover{border-color:${T.blue}!important;transform:translateY(-1px);}
        .denom-btn:hover{border-color:${T.blue}!important;color:${T.blue}!important;background:${T.blueLight}!important;}
        .submit-btn:hover{background:${T.blueDark}!important;}
        .submit-btn:active{transform:scale(0.985)!important;}

        @media (max-width: 900px) {
          .gc-main-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .gc-container { padding: 24px 20px 60px !important; }
          .gc-side-panel { order: -1 !important; }
        }

        @media (max-width: 640px) {
          .gc-brand-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .gc-denom-grid { flex-direction: column !important; }
          .gc-denom-grid button { width: 100% !important; }
          .gc-top-bar { padding: 0 20px !important; }
        }

        @media (max-width: 480px) {
          .gc-brand-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .gc-header h1 { font-size: 22px !important; }
          .gc-success-card { padding: 32px 24px !important; }
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: T.surface, fontFamily: "'DM Sans', sans-serif", color: T.text, display: "flex", flexDirection: "column" }}>

        {/* Top bar */}
        <div className="gc-top-bar" style={{ background: T.white, borderBottom: `1px solid ${T.border}`, height: 60, padding: "0 40px", display: "flex", alignItems: "center", flexShrink: 0 }}>
          <nav style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 13, color: T.text2, fontWeight: 500, cursor: "pointer" }} onClick={() => onNavigate?.("dashboard")}>Dashboard</span>
            <span style={{ color: T.text3, fontSize: 12 }}>›</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.blue }}>Gift Cards</span>
          </nav>
        </div>

        {/* ── Success state ── */}
        {submitted && (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <div className="fadein gc-success-card" style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 24, padding: "52px 48px", textAlign: "center", maxWidth: 440, width: "100%" }}>
              <div style={{ position: "relative", width: 80, height: 80, margin: "0 auto 24px" }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `3px solid ${T.green}`, opacity: 0.25, animation: "ripple 1.8s ease-out infinite" }} />
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: T.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CheckCircle2 size={32} color="#fff" strokeWidth={2.5} />
                </div>
              </div>
              <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 700, color: T.text, letterSpacing: "-0.4px", marginBottom: 8 }}>Submitted Successfully</h2>
              <p style={{ fontSize: 14, color: T.text2, lineHeight: 1.7, marginBottom: 28 }}>
                Your <strong>{card?.name}</strong> gift card has been submitted. We'll process your payout of <strong>{fmtNGN(net)}</strong> once verified.
              </p>
              <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: "14px 20px", marginBottom: 28, textAlign: "left" }}>
                {[
                  { label: "Brand",   value: card?.name                    },
                  { label: "Amount",  value: fmtUSD(amount)                },
                  { label: "Rate",    value: `₦${card?.rate.toLocaleString("en-NG")} / $1` },
                  { label: "Payout",  value: fmtNGN(net), blue: true       },
                ].map(({ label, value, blue }, i, arr) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: i === arr.length - 1 ? "none" : `1px solid ${T.border}` }}>
                    <span style={{ fontSize: 13, color: T.text2 }}>{label}</span>
                    <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700, color: blue ? T.blue : T.text }}>{value}</span>
                  </div>
                ))}
              </div>
              <button onClick={reset} style={{ width: "100%", padding: "15px", borderRadius: 14, border: "none", background: T.blue, color: "#fff", fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "background 0.18s" }}
                onMouseEnter={e => e.currentTarget.style.background = T.blueDark}
                onMouseLeave={e => e.currentTarget.style.background = T.blue}
              >
                Redeem Another Card
              </button>
            </div>
          </div>
        )}

        {/* ── Main flow ── */}
        {!submitted && (
          <div className="gc-container" style={{ flex: 1, maxWidth: 1060, width: "100%", margin: "0 auto", padding: "32px 40px 60px" }}>

            <div className="gc-header" style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: T.blue, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>Redeem</p>
              <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 26, fontWeight: 700, color: T.text, letterSpacing: "-0.5px", marginBottom: 5 }}>Gift Cards</h1>
              <p style={{ fontSize: 14, color: T.text2 }}>Select a brand, enter the card value, and upload a photo to get paid.</p>
            </div>

            <div className="gc-main-grid" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>

              {/* ── LEFT ── */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                {/* Brand selector */}
                <div style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 20, padding: "22px 24px" }}>
                  <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 16 }}>Select brand</p>
                  <div className="gc-brand-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
                    {CARDS.map((c) => {
                      const active = selected === c.id;
                      return (
                        <button
                          key={c.id}
                          className="brand-card"
                          onClick={() => { setSelected(c.id); setDenomination(""); setCustomAmt(""); setCardImage(null); }}
                          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "14px 8px", borderRadius: 14, border: `1.5px solid ${active ? T.blue : T.border}`, background: active ? T.blueLight : T.white, cursor: "pointer", transition: "all 0.15s", position: "relative" }}
                        >
                          {c.popular && !active && (
                            <div style={{ position: "absolute", top: -6, right: -4, background: T.orange, borderRadius: 6, padding: "1px 5px", fontSize: 8, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.3px" }}>Hot</div>
                          )}
                          <div style={{ width: 38, height: 38, borderRadius: 10, background: active ? T.blue : c.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 700, color: active ? "#fff" : c.color, transition: "all 0.15s" }}>
                            {c.icon}
                          </div>
                          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700, color: active ? T.blue : T.text, textAlign: "center", lineHeight: 1.3 }}>{c.name}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Card details — shown after brand selected */}
                {card && (
                  <div className="fadein" style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 20, padding: "22px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

                    {/* Denomination picker */}
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10 }}>Card value (USD)</p>
                      <div className="gc-denom-grid" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {DENOMINATIONS.map((d) => (
                          <button
                            key={d}
                            className="denom-btn"
                            onClick={() => { setDenomination(String(d)); setCustomAmt(""); }}
                            style={{ padding: "9px 16px", borderRadius: 10, border: `1.5px solid ${denomination === String(d) ? T.blue : T.border}`, background: denomination === String(d) ? T.blueLight : T.white, color: denomination === String(d) ? T.blue : T.text2, fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.15s" }}
                          >
                            ${d}
                          </button>
                        ))}

                        {/* Custom */}
                        <div style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 100, border: `1.5px solid ${denomination === "custom" ? T.blue : T.border}`, borderRadius: 10, background: denomination === "custom" ? T.blueLight : T.white, overflow: "hidden", transition: "border-color 0.15s" }}>
                          <span style={{ padding: "9px 10px 9px 14px", fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700, color: T.text2 }}>$</span>
                          <input
                            type="number"
                            placeholder="Custom"
                            value={customAmt}
                            onChange={e => { setCustomAmt(e.target.value); setDenomination("custom"); }}
                            style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700, color: T.text, padding: "9px 10px 9px 0", minWidth: 0 }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Image upload */}
                    <ImageUpload file={cardImage} onFile={setCardImage} onRemove={() => setCardImage(null)} />

                    {/* Submit */}
                    <button
                      className="submit-btn"
                      onClick={handleSubmit}
                      disabled={!ready}
                      style={{ width: "100%", padding: "17px", borderRadius: 14, border: "none", fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 700, cursor: ready ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: ready ? T.blue : "#E8EEFF", color: ready ? "#fff" : T.text3, transition: "all 0.18s" }}
                    >
                      {submitting
                        ? <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Submitting…</>
                        : "Submit Gift Card"
                      }
                    </button>
                  </div>

                )}

                {/* All rates — always visible in left column */}
                <div style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 16, overflow: "hidden", marginTop: 16 }}>
                  <div style={{ padding: "14px 18px", borderBottom: `1px solid ${T.border}` }}>
                    <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700, color: T.text }}>All rates</p>
                  </div>
                  {CARDS.map((c, i) => (
                    <div key={c.id} onClick={() => { setSelected(c.id); setDenomination(""); setCustomAmt(""); setCardImage(null); }}
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 18px", borderBottom: i === CARDS.length - 1 ? "none" : `1px solid ${T.border}`, cursor: "pointer", background: selected === c.id ? T.blueLight : T.white, transition: "background 0.12s" }}
                      onMouseEnter={e => { if (selected !== c.id) e.currentTarget.style.background = T.surface; }}
                      onMouseLeave={e => { if (selected !== c.id) e.currentTarget.style.background = T.white; }}
                    >
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: selected === c.id ? T.blue : c.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora', sans-serif", fontSize: 11, fontWeight: 700, color: selected === c.id ? "#fff" : c.color, flexShrink: 0, transition: "all 0.15s" }}>{c.icon}</div>
                      <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: selected === c.id ? T.blue : T.text }}>{c.name}</span>
                      <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 12, fontWeight: 700, color: selected === c.id ? T.blue : T.text2 }}>₦{c.rate.toLocaleString("en-NG")}/$</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── RIGHT — Summary ── */}
              <div className="gc-side-panel" style={{ display: "flex", flexDirection: "column", gap: 14 }}>

                {/* Rate card */}
                {card ? (
                  <>
                    <div style={{ background: T.blue, borderRadius: 20, padding: "24px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                        <div style={{ width: 42, height: 42, borderRadius: 12, background: card.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 700, color: card.color, flexShrink: 0 }}>{card.icon}</div>
                        <div>
                          <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 700, color: "#fff" }}>{card.name}</p>
                          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 1 }}>Selected brand</p>
                        </div>
                      </div>

                      <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>Our rate</span>
                          <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 12, fontWeight: 700, color: "#fff" }}>₦{card.rate.toLocaleString("en-NG")} / $1</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>Card value</span>
                          <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 12, fontWeight: 700, color: amount > 0 ? "#fff" : "rgba(255,255,255,0.3)" }}>{amount > 0 ? fmtUSD(amount) : "—"}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>Service fee (1%)</span>
                          <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 12, fontWeight: 700, color: amount > 0 ? "#fff" : "rgba(255,255,255,0.3)" }}>{amount > 0 ? fmtNGN(fee) : "—"}</span>
                        </div>
                      </div>

                      <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.12)" }}>
                        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>You will receive</p>
                        <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 32, fontWeight: 700, color: amount > 0 ? "#fff" : "rgba(255,255,255,0.2)", letterSpacing: "-1.2px", lineHeight: 1 }}>
                          {amount > 0 ? fmtNGN(net) : "₦0.00"}
                        </p>
                      </div>
                    </div>

                    {/* Checklist */}
                    <div style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 16, padding: "16px 20px" }}>
                      <p style={{ fontSize: 11, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 12 }}>Submission checklist</p>
                      {[
                        { label: "Brand selected",    done: !!card         },
                        { label: "Card value entered", done: amount > 0    },
                        { label: "Image uploaded",     done: !!cardImage   },
                      ].map(({ label, done }, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderTop: i > 0 ? `1px solid ${T.border}` : "none" }}>
                          <div style={{ width: 22, height: 22, borderRadius: "50%", background: done ? T.green : T.surface, border: `1.5px solid ${done ? T.green : T.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
                            {done && <CheckCircle2 size={12} color="#fff" />}
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 500, color: done ? T.text : T.text3 }}>{label}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  /* Placeholder before selection */
                  <div style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 20, padding: "36px 24px", textAlign: "center" }}>
                    <div style={{ width: 52, height: 52, borderRadius: 16, background: T.surface, border: `1.5px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                      <span style={{ fontSize: 22 }}>🎁</span>
                    </div>
                    <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 6 }}>Select a brand</p>
                    <p style={{ fontSize: 13, color: T.text3, lineHeight: 1.6 }}>Choose a gift card brand on the left to see the rate and payout.</p>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ borderTop: `1px solid ${T.border}`, padding: "18px 40px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: T.white, flexShrink: 0 }}>
          <Ico.shield />
          <span style={{ fontSize: 12, color: T.text2, fontWeight: 500 }}>Your transaction is secure · </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: T.mintGreen }}>Protected by Cheeseball</span>
        </div>
      </div>
    </>
  );
}

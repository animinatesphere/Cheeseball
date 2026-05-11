import { useState, useEffect, useRef, useCallback } from "react";

/* ─── Constants ───────────────────────────────────────── */
const NGN_PER_USD  = 1_580;
const PRICE_TTL    = 300; // 5 minutes in seconds

const COINS = [
  // ── Tier 1: Most popular ──────────────────────────────
  { sym: "BTC",   name: "Bitcoin",       icon: "₿", color: "#F7931A", usd: 97_400,  bal: 0.0412  },
  { sym: "ETH",   name: "Ethereum",      icon: "Ξ", color: "#627EEA", usd:  3_210,  bal: 0.215   },
  { sym: "USDT",  name: "Tether",        icon: "₮", color: "#26A17B", usd:      1,  bal: 320     },
  { sym: "USDC",  name: "USD Coin",      icon: "$", color: "#2775CA", usd:      1,  bal: 150     },
  { sym: "BNB",   name: "BNB",           icon: "B", color: "#F0B90B", usd:    580,  bal: 1.2     },
  { sym: "SOL",   name: "Solana",        icon: "◎", color: "#9945FF", usd:    145,  bal: 4.5     },
  { sym: "XRP",   name: "XRP",           icon: "✕", color: "#00AAE4", usd:   0.52,  bal: 420     },
  { sym: "DOGE",  name: "Dogecoin",      icon: "Ð", color: "#C2A633", usd:   0.12,  bal: 800     },
  { sym: "ADA",   name: "Cardano",       icon: "₳", color: "#0033AD", usd:   0.45,  bal: 560     },
  { sym: "TRX",   name: "TRON",          icon: "T", color: "#EF0027", usd:   0.12,  bal: 1200    },
  // ── Tier 2 ────────────────────────────────────────────
  { sym: "LTC",   name: "Litecoin",      icon: "Ł", color: "#838383", usd:     85,  bal: 2.1     },
  { sym: "BCH",   name: "Bitcoin Cash",  icon: "B", color: "#8DC351", usd:    450,  bal: 0.8     },
  { sym: "AVAX",  name: "Avalanche",     icon: "A", color: "#E84142", usd:     35,  bal: 6.4     },
  { sym: "LINK",  name: "Chainlink",     icon: "L", color: "#2A5ADA", usd:     14,  bal: 18      },
  { sym: "MATIC", name: "Polygon",       icon: "M", color: "#8247E5", usd:   0.70,  bal: 340     },
  { sym: "DOT",   name: "Polkadot",      icon: "D", color: "#E6007A", usd:      7,  bal: 22      },
  { sym: "UNI",   name: "Uniswap",       icon: "U", color: "#FF007A", usd:      9,  bal: 14      },
  { sym: "ATOM",  name: "Cosmos",        icon: "A", color: "#6F7390", usd:      8,  bal: 12      },
  { sym: "TON",   name: "Toncoin",       icon: "T", color: "#0088CC", usd:      5,  bal: 30      },
  { sym: "XLM",   name: "Stellar",       icon: "X", color: "#14B6E7", usd:   0.11,  bal: 900     },
];

/* ─── Helpers ─────────────────────────────────────────── */
const fmtNGN  = (n) => "₦" + Number(n).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtUSD  = (n) => "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: n < 10 ? 2 : 0, maximumFractionDigits: n < 10 ? 4 : 0 });
const fmtCoin = (n, sym) => Number(n).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 6 }) + " " + sym;
const pad     = (n) => String(n).padStart(2, "0");
const fmtTime = (s) => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;

/* ─── Design tokens ───────────────────────────────────── */
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
  red:         "#EF4444",
  redLight:    "#FEF2F2",
  redText:     "#B91C1C",
  orange:      "#F59E0B",
  orangeLight: "#FFFBEB",
};

/* ─── SVG Icons ───────────────────────────────────────── */
const Ico = {
  trend:   () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.text2}      strokeWidth="2.5" strokeLinecap="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  arrow:   () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"  strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  arrowDn: (col="currentColor") => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>,
  naira:   () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  info:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.blue}         strokeWidth="2"   strokeLinecap="round" style={{flexShrink:0,marginTop:1}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  check:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.green}        strokeWidth="2.5" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  shield:  () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.mintGreen}    strokeWidth="2"   strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  refresh: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"   strokeWidth="2.5" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  clock:   (col) => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={col}         strokeWidth="2"   strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  alert:   () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.red}          strokeWidth="2"   strokeLinecap="round" style={{flexShrink:0}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  sparkle: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.blue}         strokeWidth="2"   strokeLinecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>,
};

/* ═══════════════════════════════════════════════════════ */
export default function SellCryptocurrency() {
  /* form state */
  const [coin, setCoin]       = useState(COINS[0]);
  const [amount, setAmount]   = useState("");
  const [ddOpen, setDdOpen]   = useState(false);
  const [focused, setFocused] = useState(false);

  /* price state: null | "loading" | "active" | "expired" */
  const [priceState, setPriceState] = useState(null);
  const [timeLeft, setTimeLeft]     = useState(PRICE_TTL);
  const timerRef = useRef(null);
  const ddRef    = useRef(null);

  const v        = parseFloat(amount) || 0;
  const ngnRate  = coin.usd * NGN_PER_USD;
  const grossNGN = v * ngnRate;
  const sysFee   = grossNGN * 0.01;
  const netNGN   = grossNGN - sysFee;
  const ready    = v > 0;

  /* countdown */
  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    setTimeLeft(PRICE_TTL);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setPriceState("expired");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => () => clearInterval(timerRef.current), []);

  /* outside click → close dropdown */
  useEffect(() => {
    const h = (e) => { if (ddRef.current && !ddRef.current.contains(e.target)) setDdOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const selectCoin = (c) => { setCoin(c); setAmount(""); setDdOpen(false); setPriceState(null); };

  const fetchPrice = () => {
    if (!ready) return;
    setPriceState("loading");
    // simulate API call
    setTimeout(() => {
      setPriceState("active");
      startTimer();
    }, 1200);
  };

  const refreshPrice = () => {
    setPriceState("loading");
    setTimeout(() => {
      setPriceState("active");
      startTimer();
    }, 1200);
  };

  /* progress ring */
  const pct      = timeLeft / PRICE_TTL;
  const radius   = 20;
  const circum   = 2 * Math.PI * radius;
  const isUrgent = timeLeft <= 60;
  const ringColor = isUrgent ? T.orange : T.green;
  const timerBg   = isUrgent ? T.orangeLight : T.greenLight;
  const timerTxt  = isUrgent ? "#92400E" : T.greenText;

  /* ── Style objects ── */
  const S = {
    page:      { display: "grid", gridTemplateColumns: "1fr 400px", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", background: T.white, color: T.text },
    left:      { padding: "44px 52px 60px", borderRight: `1px solid ${T.border}` },
    right:     { padding: "44px 32px 60px", background: T.surface, display: "flex", flexDirection: "column" },

    bc:        { display: "flex", alignItems: "center", gap: 6, marginBottom: 36 },
    bcLink:    { fontSize: 13, color: T.text2, fontWeight: 500, cursor: "pointer" },
    bcSep:     { color: T.text3, fontSize: 12 },
    bcCur:     { fontSize: 13, fontWeight: 600, color: T.blue },

    pageTag:   { fontSize: 11, fontWeight: 600, color: T.blue, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 },
    pageTitle: { fontFamily: "'Sora', sans-serif", fontSize: 28, fontWeight: 700, color: T.text, letterSpacing: "-0.6px", lineHeight: 1.15 },
    pageSub:   { fontSize: 14, color: T.text2, marginTop: 6, lineHeight: 1.6 },
    secLbl:    { fontSize: 11, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10 },

    coinBox:   (o) => ({ border: `1.5px solid ${o ? T.blue : T.border}`, borderRadius: 16, background: T.white, cursor: "pointer", transition: "border-color 0.18s", overflow: "hidden" }),
    coinTop:   { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px" },
    avatar:    (c) => ({ width: 44, height: 44, borderRadius: "50%", background: c, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 700, color: "#fff", flexShrink: 0 }),
    coinName:  { fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 700, color: T.text },
    coinSub:   { fontSize: 12, color: T.text2, marginTop: 3 },
    priceVal:  { fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 700, color: T.text, textAlign: "right" },
    priceSub:  { fontSize: 11, color: T.text3, textAlign: "right", marginTop: 2 },
    chev:      (o) => ({ fontSize: 16, color: T.blue, marginLeft: 10, display: "inline-block", transform: o ? "rotate(180deg)" : "none", transition: "transform 0.2s" }),

    ddList:    { borderTop: `1px solid ${T.border}`, padding: "8px 12px 12px", display: "flex", flexDirection: "column", gap: 2 },
    ddRow:     (sel) => ({ display: "flex", alignItems: "center", gap: 12, padding: "10px 10px", borderRadius: 12, cursor: "pointer", background: sel ? T.blueLight : "transparent", transition: "background 0.12s" }),
    ddAv:      (c) => ({ width: 32, height: 32, borderRadius: "50%", background: c, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }),
    ddName:    { fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 600, color: T.text },
    ddMeta:    { fontSize: 11, color: T.text2, marginTop: 1 },
    ddUSD:     { fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 600, color: T.text, textAlign: "right" },
    ddNGN:     { fontSize: 11, color: T.text3, textAlign: "right", marginTop: 1 },

    amtCard:   (f) => ({ border: `1.5px solid ${f ? T.blue : T.border}`, borderRadius: 16, padding: "20px 22px", background: T.white, transition: "border-color 0.18s", marginTop: 8 }),
    amtRow:    { display: "flex", alignItems: "center", gap: 10 },
    amtInput:  { flex: 1, border: "none", outline: "none", minWidth: 0, fontFamily: "'Sora', sans-serif", fontSize: 36, fontWeight: 700, background: "transparent", letterSpacing: "-1.5px" },
    unitChip:  { display: "flex", alignItems: "center", gap: 5, background: T.blueLight, borderRadius: 10, padding: "8px 13px", flexShrink: 0 },
    unitTxt:   { fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700, color: T.blue },
    amtFoot:   { display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, paddingTop: 14, borderTop: `1px solid ${T.border}` },
    amtHint:   { fontSize: 12, color: T.text2, display: "flex", alignItems: "center", gap: 5 },
    amtRate:   { fontFamily: "'Sora', sans-serif", fontSize: 12, fontWeight: 600, color: T.text },

    quickRow:  { display: "flex", gap: 8, marginTop: 10 },
    quickBtn:  { flex: 1, border: `1.5px solid ${T.border}`, background: T.white, borderRadius: 10, padding: "8px 4px", fontSize: 12, fontWeight: 600, color: T.text2, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s", textAlign: "center" },

    getPriceBtn: (on) => ({ width: "100%", marginTop: 20, padding: "17px", borderRadius: 14, border: "none", fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 700, cursor: on ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "all 0.2s", background: on ? T.blue : "#E8EEFF", color: on ? "#fff" : "#A8B4CC" }),

    /* right panel */
    orderLbl:  { fontSize: 11, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 16 },
    secNote:   { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, marginTop: 16 },
    secLine1:  { fontSize: 12, fontWeight: 600, color: T.text2 },
    secLine2:  { display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 500, color: T.mintGreen },
  };

  /* ── Right panel renderer ── */
  const renderRight = () => {

    /* ── EMPTY state ── */
    if (!priceState) {
      return (
        <>
          <p style={S.orderLbl}>Order summary</p>

          {/* placeholder card */}
          <div style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 20, padding: "32px 24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 14, minHeight: 200 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: T.blueLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Ico.sparkle />
            </div>
            <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 600, color: T.text, textAlign: "center" }}>Your price will appear here</p>
            <p style={{ fontSize: 13, color: T.text3, textAlign: "center", lineHeight: 1.5 }}>Select an asset and enter an amount, then get a live price.</p>
          </div>

          {/* rate info strip */}
          <div style={{ background: T.blueLight, borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ fontSize: 13, color: T.blue, fontWeight: 500 }}>Current exchange rate</span>
            <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700, color: T.blue }}>₦{NGN_PER_USD.toLocaleString("en-NG")} / $1</span>
          </div>

          {/* notice */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 14px", marginBottom: "auto" }}>
            <Ico.info />
            <span style={{ fontSize: 12, color: T.text2, lineHeight: 1.55 }}>
              Prices are locked for 5 minutes. Funds are credited to your Naira wallet instantly after confirmation.
            </span>
          </div>

          <SecureFooter />
        </>
      );
    }

    /* ── LOADING state ── */
    if (priceState === "loading") {
      return (
        <>
          <p style={S.orderLbl}>Order summary</p>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", border: `3px solid ${T.blueLight}`, borderTopColor: T.blue, animation: "spin 0.8s linear infinite" }} />
            <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 600, color: T.text }}>Fetching live price…</p>
            <p style={{ fontSize: 12, color: T.text3 }}>Locking the best rate for you</p>
          </div>
          <SecureFooter />
        </>
      );
    }

    /* ── EXPIRED state ── */
    if (priceState === "expired") {
      return (
        <>
          <p style={S.orderLbl}>Order summary</p>

          {/* expired banner */}
          <div style={{ background: T.redLight, border: `1.5px solid #FECACA`, borderRadius: 16, padding: "18px 20px", marginBottom: 16, display: "flex", gap: 12, alignItems: "flex-start" }}>
            <Ico.alert />
            <div>
              <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 700, color: T.redText, marginBottom: 4 }}>Rate expired</p>
              <p style={{ fontSize: 13, color: "#991B1B", lineHeight: 1.5 }}>This rate has expired. Refresh price to continue.</p>
            </div>
          </div>

          {/* stale price (dimmed) */}
          <div style={{ opacity: 0.45, pointerEvents: "none", display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
            <PriceCard coin={coin} amount={v} netNGN={netNGN} />
          </div>

          {/* refresh button */}
          <button className="ctaon" style={{ width: "100%", padding: "17px", borderRadius: 14, border: "none", fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: T.blue, color: "#fff", transition: "all 0.2s" }} onClick={refreshPrice}>
            <Ico.refresh /> Refresh Price
          </button>

          <SecureFooter />
        </>
      );
    }

    /* ── ACTIVE PRICE state ── */
    return (
      <>
        <p style={S.orderLbl}>Live price</p>

        <PriceCard coin={coin} amount={v} netNGN={netNGN} />

        {/* countdown */}
        <div style={{ background: timerBg, border: `1.5px solid ${isUrgent ? "#FDE68A" : "#A7F3D0"}`, borderRadius: 14, padding: "14px 18px", marginBottom: 14, display: "flex", alignItems: "center", gap: 12 }}>
          {/* ring */}
          <svg width={54} height={54} style={{ flexShrink: 0, transform: "rotate(-90deg)" }}>
            <circle cx={27} cy={27} r={radius} fill="none" stroke={isUrgent ? "#FDE68A" : "#A7F3D0"} strokeWidth={4} />
            <circle cx={27} cy={27} r={radius} fill="none" stroke={ringColor} strokeWidth={4}
              strokeDasharray={circum} strokeDashoffset={circum * (1 - pct)}
              strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.9s linear, stroke 0.5s" }}
            />
          </svg>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
              {Ico.clock(isUrgent ? T.orange : T.green)}
              <span style={{ fontSize: 11, fontWeight: 600, color: timerTxt, textTransform: "uppercase", letterSpacing: "0.6px" }}>
                {isUrgent ? "Expiring soon" : "Price expires in"}
              </span>
            </div>
            <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 26, fontWeight: 700, color: timerTxt, letterSpacing: "-1px", lineHeight: 1 }}>
              {fmtTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* continue CTA */}
        <button className="ctaon" style={{ width: "100%", padding: "17px", borderRadius: 14, border: "none", fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: T.blue, color: "#fff", transition: "all 0.2s", letterSpacing: "0.2px" }}>
          Confirm & Sell <Ico.arrow />
        </button>

        <SecureFooter />
      </>
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;}
        input[type=number]{-moz-appearance:textfield;}
        .qbtn:hover{border-color:#1A6FFF!important;color:#1A6FFF!important;background:#EEF3FF!important;}
        .ddopt:hover{background:#EEF3FF!important;}
        .csel:hover{border-color:#1A6FFF!important;}
        .ctaon:hover{background:#1259D9!important;}
        .ctaon:active{transform:scale(0.985)!important;}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .fadein{animation:fadeUp 0.3s ease forwards}
      `}</style>

      <div style={S.page}>

        {/* ══ LEFT ══ */}
        <div style={S.left}>
          <nav style={S.bc} aria-label="Breadcrumb">
            <span style={S.bcLink}>Dashboard</span>
            <span style={S.bcSep}>›</span>
            <span style={S.bcCur}>Sell Crypto</span>
          </nav>

          <p style={S.pageTag}>Transaction</p>
          <h1 style={S.pageTitle}>Sell Crypto</h1>
          <p style={S.pageSub}>Select an asset, enter an amount, and get a live price.</p>

          {/* Coin selector */}
          <div style={{ marginTop: 36 }}>
            <p style={S.secLbl}>Select asset</p>
            <div ref={ddRef} className="csel" style={S.coinBox(ddOpen)} onClick={() => setDdOpen((o) => !o)}>
              <div style={S.coinTop}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={S.avatar(coin.color)}>{coin.icon}</div>
                  <div>
                    <div style={S.coinName}>{coin.name}</div>
                    <div style={S.coinSub}>{coin.sym}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div>
                    <div style={S.priceVal}>{fmtUSD(coin.usd)}</div>
                    <div style={S.priceSub}>per {coin.sym}</div>
                  </div>
                  <span style={S.chev(ddOpen)}>⌄</span>
                </div>
              </div>

              {ddOpen && (
                <div style={S.ddList} onClick={(e) => e.stopPropagation()}>
                  {COINS.map((c) => (
                    <div key={c.sym} className="ddopt" style={S.ddRow(c.sym === coin.sym)} onClick={() => selectCoin(c)}>
                      <div style={S.ddAv(c.color)}>{c.icon}</div>
                      <div>
                        <div style={S.ddName}>{c.name}</div>
                        <div style={S.ddMeta}>{c.sym}</div>
                      </div>
                      <div style={{ marginLeft: "auto" }}>
                        <div style={S.ddUSD}>{fmtUSD(c.usd)}</div>
                        <div style={S.ddNGN}>{fmtNGN(c.usd * NGN_PER_USD)}</div>
                      </div>
                      {c.sym === coin.sym && <span style={{ color: T.blue, fontSize: 15, marginLeft: 8 }}>✓</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Amount input */}
          <div style={{ marginTop: 28 }}>
            <p style={S.secLbl}>Amount to sell</p>
            <div style={S.amtCard(focused)}>
              <div style={S.amtRow}>
                <input
                  style={{ ...S.amtInput, color: v > 0 ? T.text : "#CED6E8" }}
                  type="number" placeholder="0" value={amount} min={0} step={0.0001}
                  onChange={(e) => { setAmount(e.target.value); setPriceState(null); }}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                />
                <div style={S.unitChip}>
                  <span style={S.unitTxt}>{coin.sym}</span>
                  <span style={{ fontSize: 11, color: T.blue }}>⌄</span>
                </div>
              </div>
              <div style={S.amtFoot}>
                <span style={S.amtHint}><Ico.trend /> Rate</span>
                <span style={S.amtRate}>₦{NGN_PER_USD.toLocaleString("en-NG")} / $1</span>
              </div>
            </div>

            {/* Quick fill */}
            <div style={S.quickRow}>
              {[["25%", 0.25], ["50%", 0.5], ["75%", 0.75], ["Max", 1]].map(([lbl, pct]) => (
                <button key={lbl} className="qbtn" style={S.quickBtn}
                  onClick={() => { setAmount((coin.bal * pct).toFixed(6).replace(/\.?0+$/, "")); setPriceState(null); }}>
                  {lbl}
                </button>
              ))}
            </div>

            {v > 0 && priceState === null && (
              <div className="fadein" style={{ marginTop: 10, padding: "10px 14px", background: T.greenLight, borderRadius: 10, display: "flex", alignItems: "center", gap: 8 }}>
                <Ico.check />
                <span style={{ fontSize: 12, color: T.greenText, fontWeight: 500 }}>
                  Selling {fmtCoin(v, coin.sym)} · Est. {fmtNGN(netNGN)}
                </span>
              </div>
            )}
          </div>

          {/* Get Price CTA */}
          <button
            className={ready && priceState === null ? "ctaon" : ""}
            style={S.getPriceBtn(ready && priceState === null)}
            disabled={!ready || priceState === "loading" || priceState === "active"}
            onClick={fetchPrice}
          >
            {priceState === "active"
              ? <><Ico.check /> Price received</>
              : <><Ico.sparkle /> Get Live Price <Ico.arrow /></>
            }
          </button>
        </div>

        {/* ══ RIGHT ══ */}
        <div style={S.right}>
          {renderRight()}
        </div>

      </div>
    </>
  );
}

/* ─── PriceCard sub-component ─────────────────────────── */
function PriceCard({ coin, amount, netNGN }) {
  const ngnRate  = coin.usd * NGN_PER_USD;
  const grossNGN = amount * ngnRate;
  const sysFee   = grossNGN * 0.01;
  const v        = amount;

  return (
    <div className="fadein" style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 4 }}>

      {/* Selling */}
      <div style={{ background: "#fff", border: `1.5px solid ${T.border}`, borderRadius: 16, padding: "16px 20px" }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 12 }}>You are selling</p>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: coin.color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{coin.icon}</div>
          <div>
            <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 700, color: T.text, letterSpacing: "-0.8px", lineHeight: 1 }}>
              {Number(v).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 6 })} <span style={{ fontSize: 16 }}>{coin.sym}</span>
            </p>
            <p style={{ fontSize: 12, color: T.text2, marginTop: 4 }}>${(v * coin.usd).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      {/* Arrow connector */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: T.blueLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.blue} strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
        </div>
      </div>

      {/* Receiving */}
      <div style={{ background: T.blue, borderRadius: 16, padding: "18px 20px" }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 12 }}>You will receive</p>
        <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 28, fontWeight: 700, color: "#fff", letterSpacing: "-1px", lineHeight: 1 }}>
          {fmtNGN(netNGN)}
        </p>
        {/* Rate + fee strip */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.15)" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>Rate</span>
            <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>
              ₦{NGN_PER_USD.toLocaleString("en-NG")} / $1
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>System fee (1%)</span>
            <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>
              {fmtNGN(sysFee)}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}

/* ─── Secure footer ───────────────────────────────────── */
function SecureFooter() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, marginTop: 16 }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: T.text2 }}>Your transaction is secure</span>
      <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 500, color: T.mintGreen }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.mintGreen} strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        Protected by Cheeseball
      </span>
    </div>
  );
}
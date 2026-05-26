import { useState, useEffect, useRef, useCallback } from "react";
import SendCryptoStep from "./SendCryptoStep";
import PaymentSubmittedStep from "./PaymentSubmittedStep";
import { getCurrencies, getWallets, getSellQuote, createSellTransaction, getBeneficiaries, createBeneficiaryBankAccount } from "../../../../services/api";

/* ─── Constants ───────────────────────────────────────── */
const RATE_TTL    = 300; // 5 min in seconds
const DEBOUNCE_MS = 600; // wait before auto-fetching rate

/* ─── Helpers ────────────────────────────────────────── */
const fmtNGN  = (n) => "₦" + Number(n).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtUSD  = (n) => "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: n < 10 ? 2 : 0, maximumFractionDigits: n < 10 ? 4 : 0 });
const fmtCoin = (n, sym) => Number(n).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 6 }) + " " + sym;
const pad     = (n) => String(n).padStart(2, "0");
const fmtTime = (s) => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;

const COLORS = ["#F7931A", "#627EEA", "#26A17B", "#2775CA", "#F0B90B", "#9945FF"];

/* ─── Tokens ─────────────────────────────────────────── */
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
};

/* ─── Icons ──────────────────────────────────────────── */
const Ico = {
  trend:   () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.text2}      strokeWidth="2.5" strokeLinecap="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  arrow:   () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"  strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  naira:   () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff"          strokeWidth="2"   strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  info:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.blue}        strokeWidth="2"   strokeLinecap="round" style={{flexShrink:0}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  check:   (col) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={typeof col === 'string' ? col : T.green} strokeWidth="2.5" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  shield:  () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.mintGreen}   strokeWidth="2"   strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  clock:   (col) => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={typeof col === 'string' ? col : T.green} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  refresh: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"  strokeWidth="2.5" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  arrowDn: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.blue}        strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>,
  bank:    () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="10" width="18" height="11" rx="1"/><path d="M3 10l9-7 9 7"/><line x1="9" y1="21" x2="9" y2="10"/><line x1="15" y1="21" x2="15" y2="10"/></svg>,
  wallet:  () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4"/><circle cx="17" cy="12" r="1" fill="currentColor"/></svg>,
  plus:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.blue} strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  lock:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"  strokeWidth="2"   strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  warn:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.orange}      strokeWidth="2"   strokeLinecap="round" style={{flexShrink:0}}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  toggle:  () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.blue} strokeWidth="2.5" strokeLinecap="round"><path d="M17 3v18"/><path d="M10 21l7-7 7 7"/><path d="M7 21V3"/><path d="M14 3L7 10 0 3"/></svg> // Actually I'll just use text for toggle
};

/* ═══════════════════════════════════════════════════════ */
/* ── STEP 1: SELL AMOUNT ── */
function SellStep({ onContinue }) {
  const [coins, setCoins]       = useState([]);
  const [coin, setCoin]         = useState(null);
  const [amount, setAmount]     = useState("");
  const [ddOpen, setDdOpen]     = useState(false);
  const [focused, setFocused]   = useState(false);
  const [inputMode, setInputMode] = useState("crypto"); // "fiat" | "crypto"
  const [cryptoSource, setCryptoSource] = useState("external_wallet"); // "external_wallet" | "cheeseball_wallet"

  const [quote, setQuote] = useState(null);
  const [rateStatus, setRateStatus] = useState("idle");
  const [timeLeft, setTimeLeft] = useState(RATE_TTL);

  const ddRef      = useRef(null);
  const timerRef   = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [assetsRes, walletsRes] = await Promise.all([getCurrencies(), getWallets()]);
        const assetsList = Array.isArray(assetsRes) ? assetsRes : (assetsRes?.data || []);
        const walletsList = Array.isArray(walletsRes) ? walletsRes : (walletsRes?.data || []);

        let merged = assetsList.map((a, i) => {
          const symbol = a.symbol || a.code;
          const w = walletsList.find(w => w.asset === symbol);
          return {
            sym: symbol,
            name: a.name || symbol,
            icon: symbol[0],
            color: COLORS[i % COLORS.length],
            bal: w ? (w.available_balance || w.balance || 0) : 0,
          };
        });

        if (merged.length === 0) {
          merged = ["BTC", "ETH", "USDT"].map((sym, i) => {
            const w = walletsList.find(w => w.asset === sym);
            return {
              sym,
              name: sym,
              icon: sym[0],
              color: COLORS[i % COLORS.length],
              bal: w ? (w.available_balance || w.balance || 0) : 0,
            };
          });
        }
        
        setCoins(merged);
        if (merged.length > 0) setCoin(merged[0]);
      } catch (err) {
        console.error("Failed to load sell crypto data:", err);
        // Fallback on error
        const fallback = ["BTC", "ETH", "USDT"].map((sym, i) => ({ sym, name: sym, icon: sym[0], color: COLORS[i], bal: 0 }));
        setCoins(fallback);
        setCoin(fallback[0]);
      }
    }
    loadData();
  }, []);

  const v = parseFloat(amount) || 0;
  
  const fetchRate = useCallback(async () => {
    if (!coin || v <= 0) return;
    setRateStatus("fetching");
    clearInterval(timerRef.current);
    try {
      let q;
      if (inputMode === "fiat") {
        const payload = { asset: coin.sym, naira_amount: v };
        q = await getSellQuote(coin.sym, null).catch(() => null); // getSellQuote needs updating to send naira_amount if cryptoAmount is null
        
        // Let's use fetch directly since api wrapper doesn't support the overloaded signature perfectly yet
        const res = await fetch("https://cheeseball-v2.vercel.app/api/rates/sell-quote", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: "Bearer " + localStorage.getItem("access_token") },
            body: JSON.stringify({ asset: coin.sym, naira_amount: v })
        });
        if (!res.ok) throw new Error("Failed");
        q = await res.json();
      } else {
        const res = await fetch("https://cheeseball-v2.vercel.app/api/rates/sell-quote", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: "Bearer " + localStorage.getItem("access_token") },
            body: JSON.stringify({ asset: coin.sym, crypto_amount: v })
        });
        if (!res.ok) throw new Error("Failed");
        q = await res.json();
      }
      setQuote(q);
      setRateStatus("live");
      setTimeLeft(RATE_TTL);
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) { clearInterval(timerRef.current); setRateStatus("stale"); return 0; }
          return t - 1;
        });
      }, 1000);
    } catch (e) {
      setRateStatus("error");
      setQuote(null);
    }
  }, [coin, v, inputMode]);

  useEffect(() => {
    if (!v) { setRateStatus("idle"); setQuote(null); clearInterval(timerRef.current); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchRate, DEBOUNCE_MS);
    return () => clearTimeout(debounceRef.current);
  }, [v, coin?.sym, inputMode, fetchRate]);

  useEffect(() => {
    if (rateStatus === "stale" && v > 0) setTimeout(fetchRate, 400);
  }, [rateStatus, fetchRate, v]);

  useEffect(() => () => { clearInterval(timerRef.current); clearTimeout(debounceRef.current); }, []);

  useEffect(() => {
    const h = (e) => { if (ddRef.current && !ddRef.current.contains(e.target)) setDdOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  if (!coin) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 16 }}>
      <style>{`@keyframes cb-spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width: 40, height: 40, border: "3px solid #E8EEFF", borderTopColor: "#1A6FFF", borderRadius: "50%", animation: "cb-spin 0.6s linear infinite" }} />
      <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 12, fontWeight: 600, color: "#A8B4CC", textTransform: "uppercase", letterSpacing: "1px" }}>Loading assets…</p>
    </div>
  );

  const selectCoin = (c) => { setCoin(c); setAmount(""); setRateStatus("idle"); setDdOpen(false); clearInterval(timerRef.current); };
  
  const canContinue = v > 0 && quote && (rateStatus === "live" || rateStatus === "fetching");

  const isUrgent   = timeLeft <= 60 && rateStatus === "live";
  const timerColor = isUrgent ? T.orange : T.green;
  const timerBg    = isUrgent ? "#FFFBEB" : T.greenLight;
  const timerTxt   = isUrgent ? "#92400E" : T.greenText;

  const toggleInputMode = () => {
    setInputMode(prev => prev === "crypto" ? "fiat" : "crypto");
    setAmount("");
  };

  const sysFee = quote ? (quote.market_rate * (quote.markup_percent / 100)) * quote.crypto_amount * quote.crypto_usd_price : 0; // rough visual calc

  return (
    <div className="sell-grid" style={{ display: "grid", gridTemplateColumns: "1fr 400px", minHeight: "100vh", background: T.white, overflowX: "hidden", maxWidth: "100vw" }}>
      <div style={{ padding: "44px 52px 60px", borderRight: `1px solid ${T.border}` }}>
        <nav style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 36, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, color: T.text2, fontWeight: 500, cursor: "pointer" }}>Dashboard</span>
          <span style={{ color: T.text3, fontSize: 12 }}>›</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: T.blue }}>Sell Crypto</span>
        </nav>

        <p style={{ fontSize: 11, fontWeight: 600, color: T.blue, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>Transaction</p>
        <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 28, fontWeight: 700, color: T.text, letterSpacing: "-0.6px", lineHeight: 1.15 }}>Sell Crypto</h1>
        <p style={{ fontSize: 14, color: T.text2, marginTop: 6, lineHeight: 1.6 }}>Select an asset and enter an amount to get started.</p>

        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
           <button onClick={() => setCryptoSource("external_wallet")} style={{ flex: 1, padding: "12px", borderRadius: 12, border: `1px solid ${cryptoSource === "external_wallet" ? T.blue : T.border}`, background: cryptoSource === "external_wallet" ? T.blueLight : T.white, cursor: "pointer", fontWeight: 600, color: cryptoSource === "external_wallet" ? T.blue : T.text2 }}>External Wallet</button>
           <button onClick={() => setCryptoSource("cheeseball_wallet")} style={{ flex: 1, padding: "12px", borderRadius: 12, border: `1px solid ${cryptoSource === "cheeseball_wallet" ? T.blue : T.border}`, background: cryptoSource === "cheeseball_wallet" ? T.blueLight : T.white, cursor: "pointer", fontWeight: 600, color: cryptoSource === "cheeseball_wallet" ? T.blue : T.text2 }}>Cheeseball Wallet</button>
        </div>

        <div style={{ marginTop: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10 }}>Select asset</p>
          <div ref={ddRef} className="csel" style={{ border: `1.5px solid ${ddOpen ? T.blue : T.border}`, borderRadius: 16, background: T.white, cursor: "pointer", overflow: "hidden", transition: "border-color 0.18s" }} onClick={() => setDdOpen((o) => !o)}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: coin.color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{coin.icon}</div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 700, color: T.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{coin.name}</p>
                  <p style={{ fontSize: 12, color: T.text2, marginTop: 3 }}>{coin.sym}</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 700, color: T.text }}>Bal: {fmtCoin(coin.bal, "")}</p>
                  <p style={{ fontSize: 11, color: T.text3, marginTop: 2 }}>per {coin.sym}</p>
                </div>
                <span style={{ fontSize: 16, color: T.blue, transform: ddOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>⌄</span>
              </div>
            </div>
            {ddOpen && (
              <div style={{ borderTop: `1px solid ${T.border}`, padding: "8px 12px 12px", display: "flex", flexDirection: "column", gap: 2, maxHeight: 280, overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
                {coins.map((c) => (
                  <div key={c.sym} className="ddopt" style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 10px", borderRadius: 12, cursor: "pointer", background: c.sym === coin.sym ? T.blueLight : "transparent", transition: "background 0.12s" }} onClick={() => selectCoin(c)}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: c.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{c.icon}</div>
                    <div>
                      <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 600, color: T.text }}>{c.name}</p>
                      <p style={{ fontSize: 11, color: T.text2, marginTop: 1 }}>{c.sym}</p>
                    </div>
                    <div style={{ marginLeft: "auto", textAlign: "right" }}>
                      <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 600, color: T.text }}>Bal: {fmtCoin(c.bal, "")}</p>
                    </div>
                    {c.sym === coin.sym && <span style={{ color: T.blue, fontSize: 15, marginLeft: 6 }}>✓</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: 28 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10 }}>Amount to sell</p>
          <div style={{ border: `1.5px solid ${focused ? T.blue : T.border}`, borderRadius: 16, padding: "20px 22px", background: T.white, transition: "border-color 0.18s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input className="sell-amt-input"
                style={{ flex: 1, border: "none", outline: "none", minWidth: 0, fontFamily: "'Sora', sans-serif", fontSize: 36, fontWeight: 700, color: v > 0 ? T.text : "#CED6E8", background: "transparent", letterSpacing: "-1.5px" }}
                type="number" placeholder="0" value={amount} min={0} step={0.0001}
                onChange={(e) => setAmount(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
              />
              <div style={{ display: "flex", alignItems: "center", gap: 5, background: T.blueLight, borderRadius: 10, padding: "8px 13px", flexShrink: 0, cursor: "pointer" }} onClick={toggleInputMode}>
                <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700, color: T.blue }}>{inputMode === "crypto" ? coin.sym : "NGN"} ⇄</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, paddingTop: 14, borderTop: `1px solid ${T.border}` }}>
              <span style={{ fontSize: 12, color: T.text2, display: "flex", alignItems: "center", gap: 5 }}><Ico.trend /> Rate</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {rateStatus === "fetching" && <div className="pulsing" style={{ width: 60, height: 14, borderRadius: 4, background: T.border }} />}
                {(rateStatus === "live" || rateStatus === "stale") && quote && <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 12, fontWeight: 700, color: T.text }}>₦{quote.final_rate} / $1</span>}
                {rateStatus === "idle" && <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 12, fontWeight: 600, color: T.text3 }}>₦— / $1</span>}
              </div>
            </div>
          </div>
          {cryptoSource === "cheeseball_wallet" && inputMode === "crypto" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(70px, 1fr))", gap: 8, marginTop: 10 }}>
                {["Max"].map((lbl) => (
                <button key={lbl} className="qbtn" style={{ flex: "1 0 60px", border: `1.5px solid ${T.border}`, background: T.white, borderRadius: 10, padding: "8px 10px", fontSize: 12, fontWeight: 600, color: T.text2, cursor: "pointer", transition: "all 0.15s", textAlign: "center" }}
                    onClick={() => setAmount(coin.bal.toString())}>{lbl} ({fmtCoin(coin.bal, coin.sym)})</button>
                ))}
            </div>
          )}
          {v > 0 && rateStatus === "live" && quote && (
            <div className="fadein" style={{ marginTop: 10, padding: "10px 14px", background: T.greenLight, borderRadius: 10, display: "flex", alignItems: "center", gap: 8 }}>
              {Ico.check()}
              <span style={{ fontSize: 12, color: T.greenText, fontWeight: 500 }}>Selling {fmtCoin(quote.crypto_amount, coin.sym)} · You'll receive {fmtNGN(quote.naira_amount)}</span>
            </div>
          )}
        </div>

        <button className={canContinue ? "ctaon" : ""} disabled={!canContinue}
          onClick={() => canContinue && onContinue({ coin, amount: v, cryptoSource, quote, netNGN: quote.naira_amount, ngnRate: quote.final_rate, sysFee, usdValue: quote.crypto_amount * quote.crypto_usd_price })}
          style={{ width: "100%", marginTop: 24, padding: "17px", borderRadius: 14, border: "none", fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 700, cursor: canContinue ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "all 0.2s", background: canContinue ? T.blue : "#E8EEFF", color: canContinue ? "#fff" : "#A8B4CC" }}>
          {rateStatus === "fetching" ? <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Getting rate…</> : <>Continue <Ico.arrow /></>}
        </button>
      </div>

      {/* Summary side */}
      <div style={{ padding: "44px 32px 60px", background: T.surface, display: "flex", flexDirection: "column" }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 16 }}>Order summary</p>
        <div style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 16, padding: "18px 20px", marginBottom: 10 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 12 }}>You are selling</p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: coin.color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{coin.icon}</div>
            <div style={{ minWidth: 0 }}>
              <p className="sum-amt" style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 700, color: T.text, letterSpacing: "-0.8px", lineHeight: 1, wordBreak: "break-all" }}>{v > 0 && quote ? fmtCoin(quote.crypto_amount, coin.sym) : <span style={{ color: T.text3 }}>0.00 {coin.sym}</span>}</p>
              <p style={{ fontSize: 12, color: T.text2, marginTop: 4 }}>{coin.name}</p>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}><div style={{ width: 30, height: 30, borderRadius: "50%", background: T.blueLight, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico.arrowDn /></div></div>
        <div style={{ background: T.blue, borderRadius: 16, padding: "18px 20px", marginBottom: 14 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 12 }}>You will receive</p>
          {rateStatus === "fetching" ? <div style={{ display: "flex", flexDirection: "column", gap: 6 }}><div className="pulsing" style={{ width: "70%", height: 30, borderRadius: 8, background: "rgba(255,255,255,0.15)" }} /><div className="pulsing" style={{ width: "40%", height: 14, borderRadius: 6, background: "rgba(255,255,255,0.1)" }} /></div> : <p className="sum-rcv" style={{ fontFamily: "'Sora', sans-serif", fontSize: 30, fontWeight: 700, color: v > 0 && quote ? "#fff" : "rgba(255,255,255,0.3)", letterSpacing: "-1px", lineHeight: 1, wordBreak: "break-all" }}>{v > 0 && quote ? fmtNGN(quote.naira_amount) : "₦0.00"}</p>}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>Rate</span>{rateStatus === "fetching" ? <div className="pulsing" style={{ width: 80, height: 12, borderRadius: 4, background: "rgba(255,255,255,0.15)" }} /> : <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 12, fontWeight: 700, color: rateStatus === "live" && quote ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)" }}>₦{quote ? quote.final_rate : "—"} / $1</span>}</div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>System fee (1%)</span><span style={{ fontFamily: "'Sora', sans-serif", fontSize: 12, fontWeight: 700, color: rateStatus === "live" && v > 0 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)" }}>{v > 0 && rateStatus === "live" && quote ? "Included" : "₦0.00"}</span></div>
          </div>
        </div>
        {rateStatus === "live" && v > 0 && (
          <div className="fadein" style={{ background: timerBg, border: `1px solid ${isUrgent ? "#FDE68A" : "#A7F3D0"}`, borderRadius: 12, padding: "11px 16px", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>{Ico.clock(timerColor)}<span style={{ fontSize: 12, color: timerTxt, fontWeight: 500 }}>{isUrgent ? "Rate expiring soon" : "Rate refreshes in"}</span></div>
            <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 700, color: timerTxt }}>{fmtTime(timeLeft)}</span>
          </div>
        )}
        {rateStatus === "stale" && <div className="fadein pulsing" style={{ background: T.blueLight, borderRadius: 12, padding: "11px 16px", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 14, height: 14, border: `2px solid ${T.blueLight}`, borderTopColor: T.blue, borderRadius: "50%", animation: "spin 0.7s linear infinite", flexShrink: 0 }} /><span style={{ fontSize: 12, color: T.blue, fontWeight: 500 }}>Updating rate…</span></div>}
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}><span style={{ fontSize: 12, fontWeight: 600, color: T.text2 }}>Your transaction is secure</span><span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 500, color: T.mintGreen }}><Ico.shield /> Protected by Cheeseball</span></div>
      </div>
    </div>
  );
}

/* ── STEP 2: PAYOUT METHOD ── */
function PayoutStep({ order: s, onContinue }) {
  const [method, setMethod]         = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);
  const [banks, setBanks] = useState([]);

  useEffect(() => {
    getBeneficiaries().then(res => {
        setBanks(res.map(b => ({
            id: b.id,
            name: b.account_name,
            bank: b.bank_name,
            number: b.account_number
        })));
    });
  }, []);

  const ready = method === "wallet" || (method === "bank" && selectedBank !== null);

  return (
    <div className="sell-grid" style={{ display: "grid", gridTemplateColumns: "1fr 400px", minHeight: "100vh", background: T.white, overflowX: "hidden", maxWidth: "100vw" }}>
      <div style={{ padding: "44px 52px 60px", borderRight: `1px solid ${T.border}` }}>
        <nav style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 36, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, color: T.text2, fontWeight: 500, cursor: "pointer" }}>Dashboard</span>
          <span style={{ color: T.text3, fontSize: 12 }}>›</span>
          <span style={{ fontSize: 13, color: T.text2, fontWeight: 500, cursor: "pointer" }}>Sell Crypto</span>
          <span style={{ color: T.text3, fontSize: 12 }}>›</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: T.blue }}>Payout Method</span>
        </nav>
        <p style={{ fontSize: 11, fontWeight: 600, color: T.blue, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>Step 2 of 3</p>
        <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 28, fontWeight: 700, color: T.text, letterSpacing: "-0.6px", lineHeight: 1.15 }}>Choose Payout Method</h1>
        <p style={{ fontSize: 14, color: T.text2, marginTop: 6, lineHeight: 1.6 }}>How do you want to receive your money?</p>
        <div className="method-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 32 }}>
          {[ { key: "bank", label: "Bank Account", sub: "Send to your registered bank", Icon: Ico.bank }, { key: "wallet", label: "NGN Wallet", sub: "Credit your in-app wallet", Icon: Ico.wallet } ].map(({ key, label, sub, Icon }) => {
            const active = method === key;
            return (
              <button key={key} className="method-card" onClick={() => { setMethod(key); setSelectedBank(null); }}
                style={{ border: `1.5px solid ${active ? T.blue : T.border}`, borderRadius: 16, padding: "22px 20px", background: active ? T.blueLight : T.white, cursor: "pointer", textAlign: "left", transition: "all 0.18s", position: "relative" }}>
                {active && <div style={{ position: "absolute", top: 12, right: 12, width: 20, height: 20, borderRadius: "50%", background: T.blue, display: "flex", alignItems: "center", justifyContent: "center" }}>{Ico.check("#fff")}</div>}
                <div style={{ width: 42, height: 42, borderRadius: 12, background: active ? T.blue : T.surface, display: "flex", alignItems: "center", justifyContent: "center", color: active ? "#fff" : T.text2, marginBottom: 14, transition: "all 0.18s" }}><Icon /></div>
                <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 700, color: active ? T.blue : T.text, marginBottom: 4 }}>{label}</p>
                <p style={{ fontSize: 12, color: active ? "#3B5AA8" : T.text3, lineHeight: 1.4 }}>{sub}</p>
              </button>
            );
          })}
        </div>
        {method === "bank" && (
          <div className="fadein" style={{ marginTop: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 12 }}>Select bank account</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {banks.map((acc) => {
                const sel = selectedBank?.id === acc.id;
                return (
                  <div key={acc.id} className="bank-row" onClick={() => setSelectedBank(acc)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", border: `1.5px solid ${sel ? T.blue : T.border}`, borderRadius: 14, cursor: "pointer", background: sel ? T.blueLight : T.white, transition: "all 0.15s" }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: sel ? T.blue : T.surface, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Ico.bank /></div>
                    <div style={{ flex: 1 }}><p style={{ fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 700, color: sel ? T.blue : T.text }}>{acc.name}</p><p style={{ fontSize: 12, color: sel ? "#3B5AA8" : T.text2, marginTop: 2 }}>{acc.bank} · {acc.number}</p></div>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${sel ? T.blue : T.border}`, background: sel ? T.blue : T.white, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{sel && Ico.check("#fff")}</div>
                  </div>
                );
              })}
            </div>
            <button className="add-bank" style={{ width: "100%", marginTop: 10, padding: "14px 18px", border: `1.5px dashed ${T.border}`, borderRadius: 14, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 13, fontWeight: 600, color: T.blue, transition: "all 0.15s" }}><Ico.plus /> Add another bank account</button>
          </div>
        )}
        {method === "wallet" && (
          <div className="fadein" style={{ marginTop: 24 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, background: T.blueLight, borderRadius: 14, padding: "16px 18px" }}><Ico.info /><div><p style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700, color: T.blue, marginBottom: 4 }}>Instant credit</p><p style={{ fontSize: 13, color: "#3B5AA8", lineHeight: 1.55 }}>Your NGN wallet will be credited automatically after the transaction is confirmed.</p></div></div>
          </div>
        )}
        <button className={ready ? "ctaon" : ""} disabled={!ready} onClick={() => ready && onContinue({ method, bank: selectedBank })} style={{ width: "100%", marginTop: 28, padding: "17px", borderRadius: 14, border: "none", fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 700, cursor: ready ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "all 0.2s", background: ready ? T.blue : "#E8EEFF", color: ready ? "#fff" : "#A8B4CC" }}>Continue <Ico.arrow /></button>
      </div>

      {/* Summary side */}
      <div style={{ padding: "44px 32px 60px", background: T.surface, display: "flex", flexDirection: "column" }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 16 }}>Order summary</p>
        <div style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 16, padding: "18px 20px", marginBottom: 10 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 12 }}>You are selling</p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: s.coin.color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{s.coin.icon}</div>
            <div style={{ minWidth: 0 }}><p className="sum-amt" style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 700, color: T.text, letterSpacing: "-0.8px", lineHeight: 1, wordBreak: "break-all" }}>{fmtCoin(s.quote.crypto_amount, s.coin.sym)}</p><p style={{ fontSize: 12, color: T.text2, marginTop: 4 }}>{s.coin.name}</p></div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}><div style={{ width: 30, height: 30, borderRadius: "50%", background: T.blueLight, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico.arrowDn /></div></div>
        <div style={{ background: T.blue, borderRadius: 16, padding: "18px 20px", marginBottom: 14 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 12 }}>You will receive</p>
          <p className="sum-rcv" style={{ fontFamily: "'Sora', sans-serif", fontSize: 30, fontWeight: 700, color: "#fff", letterSpacing: "-1px", lineHeight: 1, wordBreak: "break-all" }}>{fmtNGN(s.netNGN)}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>Rate</span><span style={{ fontFamily: "'Sora', sans-serif", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>₦{s.ngnRate} / $1</span></div>
          </div>
        </div>
        {method && (
          <div className="fadein" style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 16, padding: "16px 18px", marginBottom: 14 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 12 }}>Payout method</p>
            {method === "wallet" ? (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={{ width: 34, height: 34, borderRadius: 10, background: T.greenLight, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico.wallet /></div><div><p style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700, color: T.text }}>NGN Wallet</p><p style={{ fontSize: 12, color: T.text2, marginTop: 1 }}>Instant credit on confirmation</p></div></div>
            ) : selectedBank ? (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={{ width: 34, height: 34, borderRadius: 10, background: T.blueLight, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico.bank /></div><div><p style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700, color: T.text }}>{selectedBank.name}</p><p style={{ fontSize: 12, color: T.text2, marginTop: 1 }}>{selectedBank.bank} · {selectedBank.number}</p></div></div>
            ) : <p style={{ fontSize: 13, color: T.text3, fontStyle: "italic" }}>Select a bank account above</p>}
          </div>
        )}
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}><span style={{ fontSize: 12, fontWeight: 600, color: T.text2 }}>Your transaction is secure</span><span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 500, color: T.mintGreen }}><Ico.shield /> Protected by Cheeseball</span></div>
      </div>
    </div>
  );
}

/* ── STEP 3: CONFIRM ── */
function ConfirmStep({ order: o, onConfirm }) {
  const [agreed, setAgreed]   = useState(false);
  const [loading, setLoading] = useState(false);
  const isBank = o.method === "bank";

  const handleConfirm = async () => {
    if (!agreed || loading) return;
    setLoading(true);
    try {
        const payload = {
            quote_id: o.quote.id,
            crypto_source: o.cryptoSource,
            payout_method: isBank ? "beneficiary_bank" : "ngn_wallet",
            beneficiary_id: isBank ? o.bank.id : null,
        };
        const res = await fetch("https://cheeseball-v2.vercel.app/api/broker/sell", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: "Bearer " + localStorage.getItem("access_token") },
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("Failed to create transaction");
        const data = await res.json();
        onConfirm(data);
    } catch (e) {
        alert("Transaction failed: " + e.message);
        setLoading(false);
    }
  };

  return (
    <div className="sell-grid" style={{ display: "grid", gridTemplateColumns: "1fr 420px", minHeight: "100vh", background: T.white, overflowX: "hidden", maxWidth: "100vw" }}>
      <div style={{ padding: "44px 52px 60px", borderRight: `1px solid ${T.border}` }}>
        <nav style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 36, flexWrap: "wrap" }}>
          {["Dashboard", "Sell Crypto", "Payout Method"].map((c, i) => (<span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 13, color: T.text2, fontWeight: 500, cursor: "pointer" }}>{c}</span><span style={{ color: T.text3, fontSize: 12 }}>›</span></span>))}
          <span style={{ fontSize: 13, fontWeight: 600, color: T.blue }}>Confirm</span>
        </nav>
        <p style={{ fontSize: 11, fontWeight: 600, color: T.blue, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>Step 3 of 3</p>
        <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 28, fontWeight: 700, color: T.text, letterSpacing: "-0.6px", lineHeight: 1.15 }}>Confirm Sell Order</h1>
        <p style={{ fontSize: 14, color: T.text2, marginTop: 6, lineHeight: 1.6 }}>Review your order carefully before confirming.</p>

        <div style={{ marginTop: 32, border: `1.5px solid ${T.border}`, borderRadius: 20, background: T.white, overflow: "hidden" }}>
          <div style={{ background: T.blueLight, padding: "22px 24px", display: "flex", alignItems: "center", gap: 16, borderBottom: `1px solid ${T.border}` }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: o.coin.color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora', sans-serif", fontSize: 18, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{o.coin.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}><p style={{ fontSize: 12, color: T.text2, marginBottom: 2 }}>You are selling</p><p className="sum-amt" style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 700, color: T.text, letterSpacing: "-0.8px", wordBreak: "break-all" }}>{fmtCoin(o.quote.crypto_amount, o.coin.sym)}</p></div>
            <div style={{ textAlign: "right" }}><p style={{ fontSize: 12, color: T.text2, marginBottom: 2 }}>USD value</p><p style={{ fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 700, color: T.text }}>${o.usdValue.toFixed(2)}</p></div>
          </div>
          <div style={{ padding: "0 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", borderBottom: `1px solid ${T.border}` }}><span style={{ fontSize: 13, color: T.text, fontWeight: 600 }}>You will receive</span><span style={{ fontFamily: "'Sora', sans-serif", fontSize: 18, fontWeight: 600, color: T.blue, wordBreak: "break-all", textAlign: "right", marginLeft: 16 }}>{fmtNGN(o.netNGN)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", borderBottom: `1px solid ${T.border}` }}><span style={{ fontSize: 13, color: T.text2 }}>Rate</span><span style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 600, color: T.text }}>₦{o.ngnRate} / $1</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", borderBottom: "none" }}><span style={{ fontSize: 13, color: T.text2 }}>Payout method</span><span style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 600, color: T.text, display: "flex", alignItems: "center", gap: 6 }}>{isBank ? <Ico.bank /> : <Ico.wallet />}{isBank ? "Bank Account" : "NGN Wallet"}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", borderBottom: "none" }}><span style={{ fontSize: 13, color: T.text2 }}>{isBank ? "Paid to" : "Credited to"}</span><span style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 600, color: T.text }}>{isBank ? `${o.bank.name} · ${o.bank.bank}` : "NGN Wallet"}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", borderBottom: "none" }}><span style={{ fontSize: 13, color: T.text2 }}>Crypto Source</span><span style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 600, color: T.text }}>{o.cryptoSource === "cheeseball_wallet" ? "Internal Wallet" : "External Wallet"}</span></div>
          </div>
        </div>

        <div style={{ marginTop: 16, display: "flex", alignItems: "flex-start", gap: 10, background: T.orangeLight, border: `1px solid #FDE68A`, borderRadius: 12, padding: "12px 14px" }}><Ico.warn /><p style={{ fontSize: 12, color: "#92400E", lineHeight: 1.55 }}>This action is <strong>irreversible</strong>. Please double-check all details above.</p></div>
        <div className="chkwrap" style={{ display: "flex", alignItems: "flex-start", gap: 12, marginTop: 20, cursor: "pointer" }} onClick={() => setAgreed((a) => !a)}><div className="chkbox" style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${agreed ? T.blue : T.border}`, background: agreed ? T.blue : T.white, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, transition: "all 0.15s" }}>{agreed && Ico.check("#fff")}</div><p style={{ fontSize: 13, color: T.text2, lineHeight: 1.5 }}>I confirm that all details above are correct and agree to Cheeseball's <span style={{ color: T.blue, fontWeight: 600 }}>Terms of Service</span>.</p></div>
        <button className={agreed && !loading ? "ctaon" : ""} disabled={!agreed || loading} onClick={handleConfirm} style={{ width: "100%", marginTop: 24, padding: "18px", borderRadius: 14, border: "none", fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 700, cursor: agreed && !loading ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "all 0.2s", background: agreed && !loading ? T.blue : "#E8EEFF", color: agreed && !loading ? "#fff" : "#A8B4CC" }}>{loading ? <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Processing…</> : <><Ico.lock /> Confirm & Sell {fmtCoin(o.quote.crypto_amount, o.coin.sym)}</>}</button>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, marginTop: 16 }}><span style={{ fontSize: 12, fontWeight: 600, color: T.text2 }}>Your transaction is secure</span><span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 500, color: T.mintGreen }}><Ico.shield /> Protected by Cheeseball</span></div>
      </div>

      <div style={{ padding: "44px 32px 60px", background: T.surface, display: "flex", flexDirection: "column" }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 20 }}>Transaction receipt</p>
        <div style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 20, overflow: "hidden" }}>
          <div style={{ background: T.blue, padding: "28px 24px" }}><p style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 10 }}>You will receive</p><p className="sum-rcv" style={{ fontFamily: "'Sora', sans-serif", fontSize: 36, fontWeight: 700, color: "#fff", letterSpacing: "-1.2px", lineHeight: 1, wordBreak: "break-all" }}>{fmtNGN(o.netNGN)}</p></div>
          <div style={{ padding: "4px 22px" }}>
            {[ { label: "Asset", value: `${o.coin.name} (${o.coin.sym})` }, { label: "Quantity", value: `${fmtCoin(o.quote.crypto_amount, o.coin.sym)}` }, { label: "Rate", value: `₦${o.ngnRate} / $1` }, { label: "Net payout", value: fmtNGN(o.netNGN), blue: true } ].map(({ label, value, blue }, i, arr) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: i === arr.length - 1 ? "none" : `1px solid ${T.border}` }}><span style={{ fontSize: 12, color: T.text2 }}>{label}</span><span style={{ fontFamily: "'Sora', sans-serif", fontSize: 12, fontWeight: 700, color: blue ? T.blue : T.text }}>{value}</span></div>
            ))}
          </div>
          <div style={{ borderTop: `1.5px dashed ${T.border}`, margin: "0 22px" }} />
          <div style={{ padding: "16px 22px 22px" }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 12 }}>Paid to</p>
            {isBank ? (
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 38, height: 38, borderRadius: 10, background: T.blueLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Ico.bank /></div><div><p style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700, color: T.text }}>{o.bank.name}</p><p style={{ fontSize: 12, color: T.text2, marginTop: 2 }}>{o.bank.bank}</p><p style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 600, color: T.text, marginTop: 1 }}>{o.bank.number}</p></div></div>
            ) : <div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 38, height: 38, borderRadius: 10, background: T.greenLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Ico.wallet /></div><div><p style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700, color: T.text }}>NGN Wallet</p><p style={{ fontSize: 12, color: T.text2, marginTop: 2 }}>Instant credit</p></div></div>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════ */
export default function SellCryptocurrency({ onNavigate }) {
  const [step, setStep] = useState(1);
  const [order, setOrder] = useState(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;font-family:'DM Sans',sans-serif;}
        input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;}
        .qbtn:hover{border-color:${T.blue}!important;color:${T.blue}!important;background:${T.blueLight}!important;}
        .ddopt:hover{background:${T.blueLight}!important;}
        .csel:hover{border-color:${T.blue}!important;}
        .ctaon:hover{background:${T.blueDark}!important;}
        .ctaon:active{transform:scale(0.985)!important;}
        .method-card:hover{border-color:${T.blue}!important;}
        .bank-row:hover{background:${T.surface}!important;}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
        .fadein{animation:fadeUp 0.25s ease forwards}
        .pulsing{animation:pulse 1.4s ease-in-out infinite}
        @media(max-width:900px){
          .sell-grid{grid-template-columns:1fr!important;}
          .sell-grid > div { min-width: 0 !important; }
          .sell-grid>div:first-child{padding:28px 20px 32px!important;border-right:none!important;border-bottom:1px solid ${T.border};}
          .sell-grid>div:last-child{padding:28px 20px 32px!important;}
        }
        @media(max-width:480px){
          .sell-grid>div:first-child{padding:20px 16px 24px!important;}
          .sell-grid>div:last-child{padding:20px 16px 24px!important;}
          .sell-grid h1{font-size:22px!important;}
          .sell-grid .sell-amt-input{font-size:24px!important;}
          .sell-grid .sum-amt{font-size:18px!important;}
          .sell-grid .sum-rcv{font-size:24px!important;}
          .method-grid{grid-template-columns:1fr!important;}
          .method-grid > div { min-width: 0 !important; }
        }
        @media(max-width:380px){
          .sell-grid>div:first-child{padding:16px 12px 20px!important;}
          .sell-grid>div:last-child{padding:16px 12px 20px!important;}
          .csel > div { padding: 12px 10px !important; }
          .csel .ddopt { padding: 10px 8px !important; }
          .bank-row { padding: 14px 12px !important; gap: 10px !important; }
        }
      `}</style>

      {step === 1 && <SellStep onContinue={(data) => { setOrder(data); setStep(2); }} />}
      {step === 2 && <PayoutStep order={order} onContinue={(data) => { setOrder(prev => ({ ...prev, ...data })); setStep(3); }} />}
      {step === 3 && <ConfirmStep order={order} onConfirm={(apiResp) => { setOrder(prev => ({ ...prev, submittedAt: new Date(), transaction: apiResp })); if (order.cryptoSource === "external_wallet") { setStep(4); } else { setStep(5); } }} />}
      {step === 4 && <SendCryptoStep order={order} onSent={() => setStep(5)} />}
      {step === 5 && <PaymentSubmittedStep order={order} onGoHome={() => onNavigate?.("rates")} onContactSupport={() => onNavigate?.("support")} />}
    </>
  );
}

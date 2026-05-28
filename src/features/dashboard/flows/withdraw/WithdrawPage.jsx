import { useState, useEffect } from "react";
import { getWallets, getBeneficiaryBankAccounts, createWithdrawal } from "../../../../services/api";

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
  red:         "#EF4444",
  redLight:    "#FEF2F2",
  redText:     "#B91C1C",
  orange:      "#F59E0B",
  orangeLight: "#FFFBEB",
  orangeText:  "#92400E",
};

/* ─── Known banks (for avatar colors) ────────────────────────── */
const BANKS = [
  { id: "access",       name: "Access Bank",                      color: "#E84142", abbr: "ACC" },
  { id: "citibank",     name: "Citibank Nigeria",                 color: "#003B70", abbr: "CTI" },
  { id: "ecobank",      name: "Ecobank Nigeria",                  color: "#00529B", abbr: "ECO" },
  { id: "fidelity",     name: "Fidelity Bank",                    color: "#009A44", abbr: "FID" },
  { id: "firstbank",    name: "First Bank of Nigeria",            color: "#003C88", abbr: "FBN" },
  { id: "fcmb",         name: "First City Monument Bank",         color: "#006633", abbr: "FCM" },
  { id: "gtb",          name: "Guaranty Trust Bank",              color: "#F7941D", abbr: "GTB" },
  { id: "keystone",     name: "Keystone Bank",                    color: "#00A651", abbr: "KEY" },
  { id: "polaris",      name: "Polaris Bank",                     color: "#800000", abbr: "POL" },
  { id: "stanbic",      name: "Stanbic IBTC Bank",               color: "#0033A0", abbr: "STN" },
  { id: "stanchart",    name: "Standard Chartered Bank Nigeria",  color: "#0072AA", abbr: "SCB" },
  { id: "sterling",     name: "Sterling Bank",                    color: "#C0392B", abbr: "STR" },
  { id: "union",        name: "Union Bank of Nigeria",            color: "#003366", abbr: "UBN" },
  { id: "uba",          name: "United Bank for Africa",           color: "#E31837", abbr: "UBA" },
  { id: "unity",        name: "Unity Bank",                       color: "#00653E", abbr: "UNT" },
  { id: "wema",         name: "Wema Bank",                        color: "#7B2D8B", abbr: "WEM" },
  { id: "zenith",       name: "Zenith Bank",                      color: "#C8102E", abbr: "ZEN" },
  { id: "opay",         name: "OPay",                             color: "#00AA40", abbr: "OPY" },
  { id: "palmpay",      name: "PalmPay",                          color: "#07A858", abbr: "PAL" },
  { id: "moniepoint",   name: "Moniepoint",                       color: "#0055FF", abbr: "MNP" },
  { id: "fairmoney",    name: "FairMoney",                        color: "#6C3FBF", abbr: "FMN" },
  { id: "kuda",         name: "Kuda Bank",                        color: "#4B0082", abbr: "KDA" },
  { id: "providus",     name: "Providus Bank",                    color: "#F26522", abbr: "PRV" },
];

/* ─── Constants ──────────────────────────────────────────────── */
const WITHDRAW_FEE = 50;
const MIN_WITHDRAW = 1_000;
const MAX_WITHDRAW = 5_000_000;
const QUICK = [1_000, 5_000, 10_000, 50_000];

/* ─── Helpers ────────────────────────────────────────────────── */
const fmtNGN  = (n) => "₦" + Number(n).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const maskNum = (n) => n?.length >= 6 ? n.slice(0, 3) + "••••" + n.slice(-3) : "••••";

function lookupBank(bankName) {
  const lower = (bankName || "").toLowerCase();
  const found = BANKS.find(b => b.name.toLowerCase() === lower || b.id === lower);
  if (found) return found;
  return { color: T.blue, abbr: (bankName || "BNK").substring(0, 3).toUpperCase() };
}

/* ─── Icons ──────────────────────────────────────────────────── */
const Ico = {
  shield:  () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.mintGreen} strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  arrow:   () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  back:    () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  check:   (c = "#fff") => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.8" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  wallet:  (c = T.blue) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4"/><circle cx="17" cy="12" r="1" fill={c}/></svg>,
  info:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.blue} strokeWidth="2" strokeLinecap="round" style={{flexShrink:0}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  warn:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.orange} strokeWidth="2" strokeLinecap="round" style={{flexShrink:0}}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  plus:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.blue} strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  naira:   () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  success: () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  arrowDn: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.blue} strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>,
};

/* ─── Bank Avatar ────────────────────────────────────────────── */
function BankAvatar({ bankName, size = 42, active = false }) {
  const bank = lookupBank(bankName);
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.27, background: active ? bank.color : bank.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.18s" }}>
      <span style={{ fontFamily: "'Sora', sans-serif", fontSize: size * 0.28, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>{bank.abbr}</span>
    </div>
  );
}

/* ─── Skeleton Loader ────────────────────────────────────────── */
const Skeleton = ({ width = "100%", height = 20, radius = 8 }) => (
  <div style={{ width, height, borderRadius: radius, background: `linear-gradient(90deg, ${T.surface} 25%, ${T.border} 50%, ${T.surface} 75%)`, backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
);

/* ═══════════════════════════════════════════════════════════════ */
export default function WithdrawPage({ onNavigate }) {
  /* ── Data state ── */
  const [ngnBalance,   setNgnBalance]   = useState(0);
  const [banks,        setBanks]        = useState([]);
  const [loading,      setLoading]      = useState(true);

  /* ── Form state ── */
  const [amount,       setAmount]       = useState("");
  const [selectedBank, setSelectedBank] = useState(null);
  const [focused,      setFocused]      = useState(false);
  const [submitting,   setSubmitting]   = useState(false);
  const [submitted,    setSubmitted]    = useState(false);
  const [pulse,        setPulse]        = useState(false);
  const [txRef,        setTxRef]        = useState("");

  /* ── Load data ── */
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [walletsData, banksData] = await Promise.all([
          getWallets(),
          getBeneficiaryBankAccounts(),
        ]);
        const wallets = Array.isArray(walletsData) ? walletsData : (walletsData?.data || walletsData?.results || []);
        const ngnWallet = wallets.find(w => (w.asset === "NGN" || w.asset?.code === "NGN" || w.currency === "NGN"));
        setNgnBalance(ngnWallet ? parseFloat(ngnWallet.available_balance || ngnWallet.balance || 0) : 0);

        const banksList = Array.isArray(banksData) ? banksData : (banksData?.data || banksData?.results || []);
        setBanks(banksList);
      } catch (err) {
        console.error("Failed to load withdraw data:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  /* ── Derived values ── */
  const v           = parseFloat(amount) || 0;
  const net         = Math.max(0, v - WITHDRAW_FEE);
  const remaining   = ngnBalance - v;
  const overBalance = v > ngnBalance;
  const underMin    = v > 0 && v < MIN_WITHDRAW;
  const overMax     = v > MAX_WITHDRAW;
  const hasError    = overBalance || underMin || overMax;
  const ready       = v >= MIN_WITHDRAW && !overBalance && !overMax && selectedBank && !submitting;

  const triggerPulse = () => { setPulse(true); setTimeout(() => setPulse(false), 300); };

  const handleAmountChange = (val) => {
    let cleaned = val.replace(/[^0-9.]/g, "");
    if (cleaned.split('.').length > 2) cleaned = cleaned.replace(/\.+$/, '');
    setAmount(cleaned);
    triggerPulse();
  };

  const setQuick = (n) => { setAmount(String(n)); triggerPulse(); };

  const handleSubmit = async () => {
    if (!ready) return;
    setSubmitting(true);
    try {
      const result = await createWithdrawal({
        amount: v,
        asset: "NGN",
        beneficiary_id: selectedBank.id,
        bank_name: selectedBank.bank_name,
        account_number: selectedBank.account_number,
        account_name: selectedBank.account_name,
      });
      setTxRef(result?.id || result?.reference || `WD-${Date.now().toString().slice(-6)}`);
      setSubmitted(true);
    } catch (err) {
      console.error("Withdrawal failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Success state ── */
  if (submitted) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');
          *{box-sizing:border-box;margin:0;padding:0;}
          @keyframes ripple{0%{transform:scale(0.85);opacity:0.5}100%{transform:scale(2.4);opacity:0}}
          @keyframes popIn{0%{transform:scale(0.8);opacity:0}70%{transform:scale(1.05)}100%{transform:scale(1);opacity:1}}
          @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
          .fadein{animation:fadeUp 0.35s ease forwards}
          .wd-success-cta:hover{background:${T.blueDark}!important;}
          @media(max-width:900px){
            .wd-success-grid{grid-template-columns:1fr!important;}
          }
          @media(max-width:480px){
            .wd-success-hero{padding:36px 24px!important;}
          }
        `}</style>
        <div className="withdraw-grid" style={{ display: "grid", gridTemplateColumns: "1fr 400px", minHeight: "100%", background: T.white, overflowX: "hidden", maxWidth: "100vw" }}>
          {/* LEFT */}
          <div style={{ padding: "44px 52px 60px", borderRight: `1px solid ${T.border}` }}>
            <nav style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 36, flexWrap: "wrap" }}>
              <span style={{ fontSize: 13, color: T.text2, fontWeight: 500, cursor: "pointer" }} onClick={() => onNavigate?.("dashboard")}>Dashboard</span>
              <span style={{ color: T.text3, fontSize: 12 }}>›</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.blue }}>Withdraw</span>
            </nav>

            <div className="fadein wd-success-hero" style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 24, padding: "48px 44px", textAlign: "center" }}>
              <div style={{ position: "relative", width: 88, height: 88, margin: "0 auto 28px" }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `3px solid ${T.green}`, opacity: 0.25, animation: "ripple 1.8s ease-out infinite" }} />
                <div style={{ width: 88, height: 88, borderRadius: "50%", background: T.green, display: "flex", alignItems: "center", justifyContent: "center", animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards" }}>
                  <Ico.success />
                </div>
              </div>
              <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 24, fontWeight: 700, color: T.text, letterSpacing: "-0.5px", marginBottom: 8 }}>Withdrawal Initiated</h2>
              <p style={{ fontSize: 14, color: T.text2, lineHeight: 1.7, marginBottom: 28, maxWidth: 380, margin: "0 auto 28px" }}>
                <strong>{fmtNGN(net)}</strong> is on its way to{" "}
                <strong>{selectedBank?.account_name}</strong> — {selectedBank?.bank_name}.
                This usually arrives within 5 minutes.
              </p>

              <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: "14px 18px", marginBottom: 28, textAlign: "left" }}>
                {[
                  { label: "Amount",    value: fmtNGN(v) },
                  { label: "Fee",       value: fmtNGN(WITHDRAW_FEE) },
                  { label: "You get",   value: fmtNGN(net), blue: true },
                  { label: "Sent to",   value: `${selectedBank?.bank_name} · ${maskNum(selectedBank?.account_number || "")}` },
                  { label: "Reference", value: txRef },
                ].map(({ label, value, blue }, i, arr) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i === arr.length - 1 ? "none" : `1px solid ${T.border}` }}>
                    <span style={{ fontSize: 13, color: T.text2 }}>{label}</span>
                    <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700, color: blue ? T.blue : T.text, textAlign: "right", maxWidth: "55%", wordBreak: "break-all" }}>{value}</span>
                  </div>
                ))}
              </div>

              <button className="wd-success-cta" onClick={() => onNavigate?.("dashboard")} style={{ width: "100%", padding: "16px", borderRadius: 14, border: "none", background: T.blue, color: "#fff", fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.15s" }}>
                Back to Dashboard
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div style={{ padding: "44px 32px 60px", background: T.surface, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ background: T.green, borderRadius: 20, padding: "24px" }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 14 }}>Withdrawal successful</p>
                <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 34, fontWeight: 700, color: "#fff", letterSpacing: "-1.2px", lineHeight: 1, marginBottom: 8, wordBreak: "break-all" }}>{fmtNGN(net)}</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>After {fmtNGN(WITHDRAW_FEE)} fee</p>
              </div>

              <div style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 16, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
                <BankAvatar bankName={selectedBank?.bank_name} size={44} active />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 2 }}>{selectedBank?.account_name}</p>
                  <p style={{ fontSize: 12, color: T.text2 }}>{selectedBank?.bank_name} · {maskNum(selectedBank?.account_number || "")}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, background: T.greenLight, borderRadius: 20, padding: "4px 10px" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.green }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: T.greenText }}>Sent</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: T.blueLight, borderRadius: 14, padding: "13px 16px" }}>
                <Ico.info />
                <p style={{ fontSize: 12, color: "#3B5AA8", lineHeight: 1.55 }}>
                  Funds usually arrive within 5 minutes. If not received after 30 minutes, please contact support.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, marginTop: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: T.text2 }}>Your transaction is secure</span>
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 500, color: T.mintGreen }}>
                  <Ico.shield /> Protected by Cheeseball
                </span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ── Main form ── */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-track{background:transparent;} ::-webkit-scrollbar-thumb{background:${T.border};border-radius:4px;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        .fadein{animation:fadeUp 0.25s ease forwards}
        .bank-card{transition:all 0.15s;}
        .bank-card:hover{border-color:${T.blue}!important;transform:translateY(-1px);box-shadow:0 4px 12px rgba(26,111,255,0.08);}
        .quick-btn:hover{border-color:${T.blue}!important;color:${T.blue}!important;background:${T.blueLight}!important;}
        .wd-cta:hover:not(:disabled){background:${T.blueDark}!important;}
        .wd-cta:active:not(:disabled){transform:scale(0.985)!important;}
        .add-bank:hover{border-color:${T.blue}!important;color:${T.blue}!important;}
        .withdraw-grid{display:grid;grid-template-columns:1fr 400px;min-height:100%;background:${T.white};overflow-x:hidden;max-width:100vw;}
        @media(max-width:900px){
          .withdraw-grid{grid-template-columns:1fr!important;}
          .withdraw-grid > div { min-width: 0 !important; }
          .wd-left{padding:28px 20px 32px!important;border-right:none!important;}
          .wd-right{padding:28px 20px 32px!important;}
        }
        @media(max-width:480px){
          .wd-left{padding:20px 16px 24px!important;}
          .wd-right{padding:20px 16px 24px!important;}
          .withdraw-grid h1{font-size:22px!important;}
          .quick-row{flex-wrap:wrap!important;}
          .quick-row .quick-btn{min-width:calc(50% - 4px)!important;flex:unset!important;}
        }
      `}</style>

      <div className="withdraw-grid">
        {/* ══ LEFT ══ */}
        <div className="wd-left" style={{ padding: "44px 52px 60px", borderRight: `1px solid ${T.border}` }}>
          {/* Breadcrumbs */}
          <nav style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 36, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, color: T.text2, fontWeight: 500, cursor: "pointer" }} onClick={() => onNavigate?.("dashboard")}>Dashboard</span>
            <span style={{ color: T.text3, fontSize: 12 }}>›</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.blue }}>Withdraw</span>
          </nav>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Heading */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: T.blue, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>NGN Wallet</p>
              <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 26, fontWeight: 700, color: T.text, letterSpacing: "-0.5px", marginBottom: 5 }}>Withdraw Funds</h1>
              <p style={{ fontSize: 14, color: T.text2 }}>Send Naira from your wallet to your bank account.</p>
            </div>

            {/* Balance card */}
            <div style={{ background: T.blue, borderRadius: 20, padding: "22px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative", zIndex: 1 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {Ico.wallet("#fff")}
                </div>
                <div>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 4 }}>Available balance</p>
                  {loading
                    ? <Skeleton width={140} height={28} radius={8} />
                    : <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 26, fontWeight: 700, color: "#fff", letterSpacing: "-0.8px", lineHeight: 1 }}>{fmtNGN(ngnBalance)}</p>
                  }
                </div>
              </div>
              <div style={{ textAlign: "right", position: "relative", zIndex: 1 }}>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 3 }}>After withdrawal</p>
                <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 18, fontWeight: 700, color: v > 0 && !overBalance ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)", letterSpacing: "-0.5px", transition: "color 0.2s" }}>
                  {v > 0 && !overBalance ? fmtNGN(remaining) : "—"}
                </p>
              </div>
            </div>

            {/* Amount input */}
            <div style={{ background: T.white, border: `1.5px solid ${focused ? T.blue : hasError ? T.red : T.border}`, borderRadius: 18, padding: "20px 22px", transition: "border-color 0.18s" }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 14 }}>Amount to withdraw</p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 28, fontWeight: 700, color: T.text3, flexShrink: 0 }}>₦</span>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="0"
                  value={amount}
                  onChange={e => handleAmountChange(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  style={{ flex: 1, width: "100%", border: "none", outline: "none", fontFamily: "'Sora', sans-serif", fontSize: 36, fontWeight: 700, color: hasError ? T.red : v > 0 ? T.text : "#CED6E8", background: "transparent", letterSpacing: "-1.5px", minWidth: 0 }}
                />
                <div style={{ background: T.blueLight, borderRadius: 10, padding: "8px 14px", flexShrink: 0 }}>
                  <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700, color: T.blue }}>NGN</span>
                </div>
              </div>

              {overBalance && (
                <div className="fadein" style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${T.border}` }}>
                  <Ico.warn />
                  <p style={{ fontSize: 12, color: T.orangeText, fontWeight: 500 }}>Amount exceeds your available balance of {fmtNGN(ngnBalance)}</p>
                </div>
              )}
              {underMin && (
                <div className="fadein" style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${T.border}` }}>
                  <Ico.warn />
                  <p style={{ fontSize: 12, color: T.orangeText, fontWeight: 500 }}>Minimum withdrawal is {fmtNGN(MIN_WITHDRAW)}</p>
                </div>
              )}
              {overMax && (
                <div className="fadein" style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${T.border}` }}>
                  <Ico.warn />
                  <p style={{ fontSize: 12, color: T.orangeText, fontWeight: 500 }}>Maximum withdrawal is {fmtNGN(MAX_WITHDRAW)}</p>
                </div>
              )}
              {!hasError && v > 0 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTop: `1px solid ${T.border}` }}>
                  <span style={{ fontSize: 12, color: T.text2 }}>Transaction fee</span>
                  <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 12, fontWeight: 700, color: T.text }}>{fmtNGN(WITHDRAW_FEE)}</span>
                </div>
              )}
            </div>

            {/* Quick amounts */}
            <div className="quick-row" style={{ display: "flex", gap: 8 }}>
              {QUICK.map(q => (
                <button key={q} className="quick-btn" onClick={() => setQuick(q)}
                  style={{ flex: 1, padding: "9px 4px", borderRadius: 10, border: `1.5px solid ${amount === String(q) ? T.blue : T.border}`, background: amount === String(q) ? T.blueLight : T.white, color: amount === String(q) ? T.blue : T.text2, fontFamily: "'Sora', sans-serif", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.15s", textAlign: "center" }}>
                  {fmtNGN(q).replace(".00", "")}
                </button>
              ))}
              <button className="quick-btn" onClick={() => setQuick(Math.max(0, ngnBalance - WITHDRAW_FEE))}
                style={{ flex: 1, padding: "9px 4px", borderRadius: 10, border: `1.5px solid ${T.border}`, background: T.white, color: T.text2, fontFamily: "'Sora', sans-serif", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.15s", textAlign: "center" }}>
                Max
              </button>
            </div>

            {/* Bank selector */}
            <div style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 18, padding: "20px 22px" }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 14 }}>Withdraw to</p>

              {loading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[1,2].map(i => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", border: `1.5px solid ${T.border}`, borderRadius: 14 }}>
                      <Skeleton width={42} height={42} radius={11} />
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                        <Skeleton width="60%" height={14} />
                        <Skeleton width="40%" height={12} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : banks.length === 0 ? (
                <div style={{ textAlign: "center", padding: "28px 16px" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: T.surface, border: `1.5px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                    {Ico.wallet(T.text3)}
                  </div>
                  <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 6 }}>No bank accounts yet</p>
                  <p style={{ fontSize: 13, color: T.text2, marginBottom: 18 }}>Add a bank account to withdraw your funds.</p>
                  <button className="add-bank" onClick={() => onNavigate?.("bank-accounts")}
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 20px", border: `1.5px solid ${T.border}`, borderRadius: 12, background: T.white, cursor: "pointer", fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700, color: T.text2, transition: "all 0.15s" }}>
                    <Ico.plus /> Add bank account
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {banks.map((bank) => {
                    const sel = selectedBank?.id === bank.id;
                    return (
                      <div
                        key={bank.id}
                        className="bank-card"
                        onClick={() => setSelectedBank(bank)}
                        style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", border: `1.5px solid ${sel ? T.blue : T.border}`, borderRadius: 14, cursor: "pointer", background: sel ? T.blueLight : T.white }}
                      >
                        <BankAvatar bankName={bank.bank_name} size={42} active={sel} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 700, color: sel ? T.blue : T.text, marginBottom: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{bank.account_name}</p>
                          <p style={{ fontSize: 12, color: sel ? "#3B5AA8" : T.text2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{bank.bank_name} · {maskNum(bank.account_number)}</p>
                        </div>
                        <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${sel ? T.blue : T.border}`, background: sel ? T.blue : T.white, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                          {sel && Ico.check()}
                        </div>
                      </div>
                    );
                  })}

                  <button className="add-bank" onClick={() => onNavigate?.("bank-accounts")}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "13px", border: `1.5px dashed ${T.border}`, borderRadius: 14, background: "transparent", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: T.text2, transition: "all 0.15s" }}>
                    <Ico.plus /> Add another bank account
                  </button>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              className="wd-cta"
              onClick={handleSubmit}
              disabled={!ready}
              style={{ width: "100%", padding: "17px", borderRadius: 14, border: "none", fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 700, cursor: ready ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: ready ? T.blue : "#E8EEFF", color: ready ? "#fff" : T.text3, transition: "all 0.18s" }}
            >
              {submitting
                ? <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Processing…</>
                : <>Withdraw {v > 0 && !hasError ? fmtNGN(v) : ""} <Ico.arrow /></>
              }
            </button>
          </div>
        </div>

        {/* ══ RIGHT ══ */}
        <div className="wd-right" style={{ padding: "44px 32px 60px", background: T.surface, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Payout hero */}
            <div style={{ background: T.blue, borderRadius: 20, padding: "24px", transition: "transform 0.18s", transform: pulse ? "scale(1.012)" : "scale(1)" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.8px" }}>You will receive</p>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Ico.naira />
                </div>
              </div>
              <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 34, fontWeight: 700, color: v > 0 && !hasError ? "#fff" : "rgba(255,255,255,0.25)", letterSpacing: "-1.2px", lineHeight: 1, marginBottom: 8, wordBreak: "break-all" }}>
                {v > 0 && !hasError ? fmtNGN(net) : "₦0.00"}
              </p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{v > 0 ? "After transaction fee" : "Enter an amount to continue"}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.12)" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>Withdrawal amount</span>
                  <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 12, fontWeight: 700, color: v > 0 && !hasError ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)" }}>{v > 0 && !hasError ? fmtNGN(v) : "—"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>Transaction fee</span>
                  <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>–{fmtNGN(WITHDRAW_FEE)}</span>
                </div>
              </div>
            </div>

            {/* Arrow divider */}
            <div style={{ display: "flex", justifyContent: "center", margin: "-20px 0" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: T.blueLight, display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${T.surface}`, zIndex: 2 }}>
                <Ico.arrowDn />
              </div>
            </div>

            {/* Destination card */}
            <div style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 16, padding: "18px 20px" }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 12 }}>Destination</p>
              {selectedBank ? (
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <BankAvatar bankName={selectedBank.bank_name} size={40} active />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 700, color: T.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{selectedBank.account_name}</p>
                    <p style={{ fontSize: 12, color: T.text2, marginTop: 2 }}>{selectedBank.bank_name} · {maskNum(selectedBank.account_number)}</p>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: T.surface, border: `1.5px dashed ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {Ico.wallet(T.text3)}
                  </div>
                  <p style={{ fontSize: 13, color: T.text3, fontWeight: 500 }}>Select a bank account</p>
                </div>
              )}
            </div>

            {/* Breakdown */}
            <div style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 16, padding: "4px 20px" }}>
              {[
                { label: "Source",       value: "NGN Wallet" },
                { label: "Destination",  value: selectedBank ? selectedBank.bank_name : "—" },
                { label: "Account",      value: selectedBank ? maskNum(selectedBank.account_number) : "—" },
                { label: "Est. arrival", value: "Within 5 minutes" },
              ].map(({ label, value }, i, arr) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i === arr.length - 1 ? "none" : `1px solid ${T.border}` }}>
                  <span style={{ fontSize: 13, color: T.text2 }}>{label}</span>
                  <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 600, color: T.text, textAlign: "right", maxWidth: 180 }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Info */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: T.blueLight, borderRadius: 14, padding: "13px 16px" }}>
              <Ico.info />
              <p style={{ fontSize: 12, color: "#3B5AA8", lineHeight: 1.55 }}>
                Withdrawals are processed instantly. Funds usually arrive within 5 minutes. A flat fee of {fmtNGN(WITHDRAW_FEE)} applies per withdrawal.
              </p>
            </div>

            {/* Limits */}
            <div style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 14, padding: "14px 18px", display: "flex", flexDirection: "column", gap: 8 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 4 }}>Withdrawal limits</p>
              {[
                { label: "Minimum",      value: fmtNGN(MIN_WITHDRAW) },
                { label: "Maximum",      value: fmtNGN(MAX_WITHDRAW) },
                { label: "Your balance", value: fmtNGN(ngnBalance), blue: true },
              ].map(({ label, value, blue }, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: T.text2 }}>{label}</span>
                  <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 12, fontWeight: blue ? 700 : 600, color: blue ? T.blue : T.text }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Secure */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, marginTop: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: T.text2 }}>Your transaction is secure</span>
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 500, color: T.mintGreen }}>
                <Ico.shield /> Protected by Cheeseball
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

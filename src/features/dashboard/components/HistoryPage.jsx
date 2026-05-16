import { useState, useMemo } from "react";
import {
  ArrowDownLeft, CircleDollarSign, Gift, ChevronRight,
  Download, Search, SlidersHorizontal, X, ChevronDown,
  History, Wallet, ShoppingCart, ArrowRightLeft,
} from "lucide-react";

/* ─── Design tokens ──────────────────────────────────────────── */
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

/* ─── Helpers ────────────────────────────────────────────────── */
const fmtNGN = (n) =>
  "₦" + Number(Math.abs(n)).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ─── Data ───────────────────────────────────────────────────── */
const ALL_TXN = [
  { id: "CHB-001", type: "sell",     label: "Sold BTC",          asset: "BTC",  icon: "₿", iconColor: "#F7931A", iconBg: "#FEF3E2",     amount: +120_000, date: "2024-04-22", time: "10:02 AM", status: "completed", method: "Bank Transfer",    bank: "Demo Bank · 0123456789",   ref: "CHB-2024-00847" },
  { id: "CHB-002", type: "buy",      label: "Bought ETH",        asset: "ETH",  icon: "Ξ", iconColor: "#627EEA", iconBg: "#EEEFFE",     amount: -75_200,  date: "2024-04-21", time: "3:45 PM",  status: "completed", method: "Card",             bank: null,                       ref: "CHB-2024-00821" },
  { id: "CHB-003", type: "sell",     label: "Sold USDT",         asset: "USDT", icon: "₮", iconColor: "#26A17B", iconBg: "#E6F7F2",     amount: +58_400,  date: "2024-04-20", time: "9:11 AM",  status: "pending",   method: "NGN Wallet",      bank: null,                       ref: "CHB-2024-00810" },
  { id: "CHB-004", type: "deposit",  label: "Deposit",           asset: "NGN",  icon: "₦", iconColor: T.blue,   iconBg: T.blueLight,   amount: +50_000,  date: "2024-04-19", time: "6:22 PM",  status: "completed", method: "Bank Transfer",    bank: "Access Bank · 0987654321", ref: "CHB-2024-00798" },
  { id: "CHB-005", type: "swap",     label: "Swapped BTC→USDT",  asset: "BTC",  icon: "₿", iconColor: "#F7931A", iconBg: "#FEF3E2",     amount: -30_000,  date: "2024-04-18", time: "2:10 PM",  status: "completed", method: "Swap",             bank: null,                       ref: "CHB-2024-00784" },
  { id: "CHB-006", type: "giftcard", label: "Gift Card Sale",    asset: "GIFT", icon: "G", iconColor: T.orange, iconBg: T.orangeLight, amount: +45_000,  date: "2024-04-17", time: "11:30 AM", status: "completed", method: "Amazon Gift Card", bank: null,                       ref: "CHB-2024-00771" },
  { id: "CHB-007", type: "sell",     label: "Sold SOL",          asset: "SOL",  icon: "◎", iconColor: "#9945FF", iconBg: "#F3EEFF",     amount: +88_200,  date: "2024-04-16", time: "4:55 PM",  status: "failed",    method: "Bank Transfer",    bank: "Demo Bank · 0123456789",   ref: "CHB-2024-00755" },
  { id: "CHB-008", type: "buy",      label: "Bought BTC",        asset: "BTC",  icon: "₿", iconColor: "#F7931A", iconBg: "#FEF3E2",     amount: -200_000, date: "2024-04-15", time: "8:00 AM",  status: "completed", method: "Card",             bank: null,                       ref: "CHB-2024-00740" },
  { id: "CHB-009", type: "withdraw", label: "Withdrawal",        asset: "NGN",  icon: "₦", iconColor: T.blue,   iconBg: T.blueLight,   amount: -40_000,  date: "2024-04-14", time: "1:20 PM",  status: "pending",   method: "Bank Transfer",    bank: "GTBank · 0112233445",      ref: "CHB-2024-00729" },
  { id: "CHB-010", type: "sell",     label: "Sold BNB",          asset: "BNB",  icon: "B", iconColor: "#F0B90B", iconBg: "#FFFBEB",     amount: +62_400,  date: "2024-04-13", time: "5:40 PM",  status: "completed", method: "NGN Wallet",       bank: null,                       ref: "CHB-2024-00712" },
  { id: "CHB-011", type: "buy",      label: "Bought USDT",       asset: "USDT", icon: "₮", iconColor: "#26A17B", iconBg: "#E6F7F2",     amount: -95_000,  date: "2024-04-12", time: "10:50 AM", status: "completed", method: "Card",             bank: null,                       ref: "CHB-2024-00700" },
  { id: "CHB-012", type: "giftcard", label: "Gift Card Sale",    asset: "GIFT", icon: "G", iconColor: T.orange, iconBg: T.orangeLight, amount: +22_500,  date: "2024-04-11", time: "3:15 PM",  status: "failed",    method: "iTunes Gift Card", bank: null,                       ref: "CHB-2024-00688" },
];

const STATUS_CFG = {
  completed: { label: "Completed", color: T.greenText,  bg: T.greenLight,  border: "#A7F3D0" },
  pending:   { label: "Pending",   color: T.orangeText, bg: T.orangeLight, border: "#FDE68A" },
  failed:    { label: "Failed",    color: T.redText,    bg: T.redLight,    border: "#FECACA" },
};

const TYPE_CFG = {
  sell:     { label: "Sell",      color: T.redText,    bg: T.redLight    },
  buy:      { label: "Buy",       color: T.greenText,  bg: T.greenLight  },
  swap:     { label: "Swap",      color: "#5B21B6",    bg: "#F5F3FF"     },
  deposit:  { label: "Deposit",   color: T.blue,       bg: T.blueLight   },
  withdraw: { label: "Withdraw",  color: T.orangeText, bg: T.orangeLight },
  giftcard: { label: "Gift Card", color: "#92400E",    bg: "#FFFBEB"     },
};

const TYPE_ICON = {
  sell:     CircleDollarSign,
  buy:      ShoppingCart,
  swap:     ArrowRightLeft,
  deposit:  ArrowDownLeft,
  withdraw: Wallet,
  giftcard: Gift,
};

const SUMMARY = [
  { label: "Total Transactions", value: String(ALL_TXN.length),                                                          color: T.blue       },
  { label: "Total Volume",       value: "₦889,200",                                                                      color: T.green      },
  { label: "Completed",          value: String(ALL_TXN.filter(t => t.status === "completed").length),                    color: T.greenText  },
  { label: "Pending / Failed",   value: String(ALL_TXN.filter(t => t.status !== "completed").length),                   color: T.orangeText },
];

const STATUS_TABS  = ["All", "Completed", "Pending", "Failed"];
const TYPE_FILTERS = ["All Types", "Buy", "Sell", "Swap", "Deposit", "Withdraw", "Gift Card"];

/* ─── Detail drawer ──────────────────────────────────────────── */
function TxnDetail({ txn, onClose }) {
  const s   = STATUS_CFG[txn.status];
  const inc = txn.amount > 0;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "flex-start", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(10,15,30,0.35)", backdropFilter: "blur(4px)" }} />
      <div style={{ position: "relative", zIndex: 1, width: 400, height: "100vh", background: T.white, borderLeft: `1px solid ${T.border}`, display: "flex", flexDirection: "column", animation: "slideIn 0.25s ease" }}>

        <div style={{ padding: "24px 28px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: 11, color: T.text3, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 4 }}>Transaction Detail</p>
            <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 700, color: T.text }}>{txn.label}</p>
          </div>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: 10, background: T.surface, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: T.text2 }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px", display: "flex", flexDirection: "column", gap: 14 }}>

          <div style={{ background: inc ? T.greenLight : T.blueLight, border: `1.5px solid ${inc ? "#A7F3D0" : T.border}`, borderRadius: 18, padding: "24px", textAlign: "center" }}>
            <div style={{ width: 50, height: 50, borderRadius: "50%", background: txn.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora', sans-serif", fontSize: 18, fontWeight: 700, color: txn.iconColor, margin: "0 auto 14px" }}>{txn.icon}</div>
            <p style={{ fontSize: 12, color: T.text2, marginBottom: 8, fontWeight: 500 }}>{txn.label}</p>
            <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 32, fontWeight: 700, color: inc ? T.greenText : T.text, letterSpacing: "-1.2px", lineHeight: 1 }}>
              {inc ? "+" : "−"}{fmtNGN(txn.amount)}
            </p>
          </div>

          <div style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 16, padding: "4px 20px" }}>
            {[
              { label: "Reference", value: txn.ref                               },
              { label: "Status",    value: s.label, badge: true, s               },
              { label: "Asset",     value: txn.asset                             },
              { label: "Date",      value: `${txn.date} · ${txn.time}`           },
              { label: "Method",    value: txn.method                            },
              ...(txn.bank ? [{ label: "Paid to", value: txn.bank }] : []),
            ].map(({ label, value, badge, s: st }, i, arr) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", borderBottom: i === arr.length - 1 ? "none" : `1px solid ${T.border}` }}>
                <span style={{ fontSize: 13, color: T.text2 }}>{label}</span>
                {badge
                  ? <span style={{ fontSize: 11, fontWeight: 700, color: st.color, background: st.bg, padding: "4px 10px", borderRadius: 8, textTransform: "uppercase", letterSpacing: "0.4px" }}>{value}</span>
                  : <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 600, color: T.text, textAlign: "right", maxWidth: 200 }}>{value}</span>
                }
              </div>
            ))}
          </div>

          <button
            style={{ width: "100%", padding: "15px", borderRadius: 14, border: `1.5px solid ${T.border}`, background: T.white, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: T.text2, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.blue; e.currentTarget.style.color = T.blue; e.currentTarget.style.background = T.blueLight; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.text2; e.currentTarget.style.background = T.white; }}
          >
            <Download size={14} /> Download Receipt
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
export default function TransactionHistory({ onNavigate }) {
  const [statusTab,  setStatusTab]  = useState("All");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [search,     setSearch]     = useState("");
  const [selected,   setSelected]   = useState(null);
  const [typeOpen,   setTypeOpen]   = useState(false);

  const filtered = useMemo(() => ALL_TXN.filter((t) => {
    const matchStatus = statusTab === "All" || t.status === statusTab.toLowerCase();
    const matchType   = typeFilter === "All Types" || TYPE_CFG[t.type]?.label === typeFilter;
    const matchSearch = !search ||
      t.label.toLowerCase().includes(search.toLowerCase()) ||
      t.ref.toLowerCase().includes(search.toLowerCase()) ||
      t.asset.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchType && matchSearch;
  }), [statusTab, typeFilter, search]);

  const totalIn  = filtered.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalOut = filtered.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const hasFilters = statusTab !== "All" || typeFilter !== "All Types" || search;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-track{background:transparent;} ::-webkit-scrollbar-thumb{background:${T.border};border-radius:4px;}
        @keyframes slideIn{from{transform:translateX(40px);opacity:0}to{transform:translateX(0);opacity:1}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .fadein{animation:fadeUp 0.3s ease forwards}
        .txn-row:hover{background:${T.surface}!important;}
        .txn-row:hover .txn-label{color:${T.blue}!important;}
        .tab:hover:not(.tab-active){background:${T.surface}!important;}
        .type-opt:hover{background:${T.blueLight}!important;}
        .icon-hover:hover{background:${T.blueLight}!important;color:${T.blue}!important;}
        @media (max-width: 1024px) {
          .summary-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .history-container { padding: 20px 16px 40px !important; }
          .history-top-bar { padding: 0 16px !important; }
          .history-header h1 { font-size: 22px !important; }
          .summary-grid { grid-template-columns: 1fr !important; gap: 10px !important; }
          .summary-grid > div { padding: 14px 18px !important; }
          .summary-grid p:last-child { font-size: 22px !important; }
          .filter-bar { padding: 10px !important; gap: 8px !important; }
          .table-header { display: none !important; }
          .txn-row { grid-template-columns: auto 1fr auto !important; padding: 12px 14px !important; gap: 8px 12px !important; }
          .txn-icon { width: 32px !important; height: 32px !important; font-size: 11px !important; border-radius: 9px !important; }
          .txn-label { font-size: 13px !important; margin-bottom: 2px !important; }
          .txn-type-badge { font-size: 8px !important; padding: 1px 5px !important; }
          .txn-ref { font-size: 9px !important; }
          .txn-amount-mobile { font-size: 15px !important; text-align: right !important; margin: 0 !important; grid-column: 3 !important; grid-row: 1 !important; }
          .txn-mobile-footer { display: flex !important; justify-content: space-between !important; align-items: center !important; grid-column: 2 / span 2 !important; grid-row: 2 !important; margin-top: -2px !important; }
          .txn-asset-col, .txn-date-col, .txn-status-col, .txn-arrow-col { display: none !important; }
          .txn-summary-footer { padding: 12px 16px !important; gap: 10px !important; flex-direction: column !important; align-items: flex-start !important; }
          .txn-summary-footer > div { width: 100% !important; justify-content: space-between !important; }
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: T.surface, fontFamily: "'DM Sans', sans-serif", color: T.text, display: "flex", flexDirection: "column" }}>

        {/* Top bar */}
        <div className="history-top-bar" style={{ background: T.white, borderBottom: `1px solid ${T.border}`, height: 60, padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <nav style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 13, color: T.text2, fontWeight: 500, cursor: "pointer" }} onClick={() => onNavigate?.("dashboard")}>Dashboard</span>
            <span style={{ color: T.text3, fontSize: 12 }}>›</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.blue }}>Transaction History</span>
          </nav>
          <button
            className="icon-hover"
            style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", border: `1.5px solid ${T.border}`, borderRadius: 10, background: T.white, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: T.text2, transition: "all 0.15s" }}
          >
            <Download size={14} /> Export CSV
          </button>
        </div>

        <div className="history-container" style={{ flex: 1, maxWidth: 1200, width: "100%", margin: "0 auto", padding: "32px 40px 60px" }}>

          {/* Heading */}
          <div className="history-header" style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: T.blue, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>Records</p>
            <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 26, fontWeight: 700, color: T.text, letterSpacing: "-0.5px", marginBottom: 5 }}>Transaction History</h1>
            <p style={{ fontSize: 14, color: T.text2 }}>View and manage all your transactions in one place.</p>
          </div>

          {/* Summary cards */}
          <div className="fadein summary-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
            {SUMMARY.map((s) => (
              <div key={s.label} style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 18, padding: "20px 22px" }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 10 }}>{s.label}</p>
                <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 28, fontWeight: 700, color: s.color, letterSpacing: "-1px", lineHeight: 1 }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Filter bar */}
          <div className="filter-bar" style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 18, padding: "16px 20px", marginBottom: 14, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>

            {/* Status tabs */}
            <div style={{ display: "flex", gap: 3, background: T.surface, borderRadius: 12, padding: 4, border: `1px solid ${T.border}` }}>
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab}
                  className={`tab ${statusTab === tab ? "tab-active" : ""}`}
                  onClick={() => setStatusTab(tab)}
                  style={{ padding: "7px 14px", borderRadius: 9, border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, transition: "all 0.15s", background: statusTab === tab ? T.blue : "transparent", color: statusTab === tab ? "#fff" : T.text2, whiteSpace: "nowrap" }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search */}
            <div style={{ flex: 1, minWidth: 200, position: "relative", display: "flex", alignItems: "center" }}>
              <Search size={14} style={{ position: "absolute", left: 12, color: T.text3 }} />
              <input
                type="text"
                placeholder="Search by asset, type or reference…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: "100%", border: `1.5px solid ${T.border}`, borderRadius: 12, paddingLeft: 34, paddingRight: search ? 32 : 14, paddingTop: 10, paddingBottom: 10, fontSize: 13, color: T.text, fontFamily: "'DM Sans', sans-serif", outline: "none", background: T.surface, transition: "border-color 0.15s" }}
                onFocus={e => e.target.style.borderColor = T.blue}
                onBlur={e => e.target.style.borderColor = T.border}
              />
              {search && (
                <button onClick={() => setSearch("")} style={{ position: "absolute", right: 10, background: "none", border: "none", cursor: "pointer", color: T.text3, display: "flex", alignItems: "center" }}>
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Type dropdown */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setTypeOpen(o => !o)}
                style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 14px", border: `1.5px solid ${typeFilter !== "All Types" ? T.blue : T.border}`, borderRadius: 12, background: typeFilter !== "All Types" ? T.blueLight : T.white, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: typeFilter !== "All Types" ? T.blue : T.text2, transition: "all 0.15s", whiteSpace: "nowrap" }}
              >
                <SlidersHorizontal size={14} />
                {typeFilter}
                <ChevronDown size={13} style={{ transform: typeOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
              </button>
              {typeOpen && (
                <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 14, padding: 6, zIndex: 50, width: 170, boxShadow: "0 8px 24px rgba(10,15,30,0.08)" }}>
                  {TYPE_FILTERS.map((f) => (
                    <button
                      key={f}
                      className="type-opt"
                      onClick={() => { setTypeFilter(f); setTypeOpen(false); }}
                      style={{ width: "100%", textAlign: "left", padding: "9px 12px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: typeFilter === f ? T.blue : T.text2, background: typeFilter === f ? T.blueLight : "transparent", transition: "background 0.12s" }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Clear filters */}
            {hasFilters && (
              <button
                onClick={() => { setStatusTab("All"); setTypeFilter("All Types"); setSearch(""); }}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", borderRadius: 12, background: T.redLight, border: `1px solid #FECACA`, color: T.redText, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}
              >
                <X size={12} /> Clear
              </button>
            )}
          </div>

          {/* Table */}
          <div style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 20, overflow: "hidden" }}>

            {/* Table head */}
            <div className="table-header" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1.2fr 1fr 40px", padding: "12px 24px", background: T.surface, borderBottom: `1px solid ${T.border}`, gap: 8 }}>
              {["Transaction", "Asset", "Amount", "Date & Time", "Status", ""].map((h, i) => (
                <p key={i} style={{ fontSize: 10, fontWeight: 700, color: T.text3, textTransform: "uppercase", letterSpacing: "0.8px", textAlign: i >= 2 && i < 5 ? "right" : "left", margin: 0 }}>{h}</p>
              ))}
            </div>

            {/* Empty state */}
            {filtered.length === 0 && (
              <div style={{ padding: "60px 24px", textAlign: "center" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: T.surface, border: `1.5px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <History size={22} color={T.text3} />
                </div>
                <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 6 }}>No transactions found</p>
                <p style={{ fontSize: 13, color: T.text2 }}>Try adjusting your filters or search term.</p>
              </div>
            )}

            {/* Rows */}
            {filtered.map((txn, i) => {
              const s   = STATUS_CFG[txn.status];
              const tc  = TYPE_CFG[txn.type];
              const inc = txn.amount > 0;
              return (
                <div
                  key={txn.id}
                  className="txn-row"
                  onClick={() => setSelected(txn)}
                  style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1.2fr 1fr 40px", padding: "16px 24px", borderBottom: i === filtered.length - 1 ? "none" : `1px solid ${T.border}`, cursor: "pointer", transition: "background 0.12s", alignItems: "center", gap: 8 }}
                >
                  {/* Label + type */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="txn-icon" style={{ width: 40, height: 40, borderRadius: 12, background: txn.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 700, color: txn.iconColor, flexShrink: 0 }}>
                      {txn.icon}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p className="txn-label" style={{ fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 4, transition: "color 0.12s", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{txn.label}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span className="txn-type-badge" style={{ fontSize: 10, fontWeight: 700, color: tc.color, background: tc.bg, padding: "2px 8px", borderRadius: 6, textTransform: "uppercase", letterSpacing: "0.4px" }}>{tc.label}</span>
                        <span className="txn-ref" style={{ fontSize: 11, color: T.text3, fontWeight: 500 }}>{txn.ref}</span>
                      </div>
                    </div>
                  </div>

                  {/* Asset */}
                  <div className="txn-asset-col">
                    <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700, color: T.text }}>{txn.asset}</p>
                    <p style={{ fontSize: 11, color: T.text3, fontWeight: 500, marginTop: 2 }}>{txn.method}</p>
                  </div>

                  {/* Amount */}
                  <p className="txn-amount-mobile" style={{ fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 700, color: inc ? T.greenText : T.text, textAlign: "right", letterSpacing: "-0.3px" }}>
                    {inc ? "+" : "−"}{fmtNGN(txn.amount)}
                  </p>

                  {/* Date */}
                  <div className="txn-date-col" style={{ textAlign: "right" }}>
                    <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 600, color: T.text }}>{txn.date}</p>
                    <p style={{ fontSize: 11, color: T.text3, fontWeight: 500, marginTop: 2 }}>{txn.time}</p>
                  </div>

                  {/* Status */}
                  <div className="txn-status-col" style={{ textAlign: "right" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: s.color, background: s.bg, border: `1px solid ${s.border}`, padding: "5px 10px", borderRadius: 8, textTransform: "uppercase", letterSpacing: "0.4px", whiteSpace: "nowrap" }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                      {s.label}
                    </span>
                  </div>

                  {/* Mobile Footer */}
                  <div className="txn-mobile-footer" style={{ display: "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                       <span style={{ fontSize: 11, color: T.text3, fontWeight: 500 }}>{txn.date} · {txn.time}</span>
                    </div>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 700, color: s.color, background: s.bg, border: `1px solid ${s.border}`, padding: "4px 8px", borderRadius: 6, textTransform: "uppercase" }}>
                      {s.label}
                    </span>
                  </div>

                  {/* Arrow */}
                  <div className="txn-arrow-col" style={{ display: "flex", justifyContent: "center" }}>
                    <ChevronRight size={16} color={T.text3} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer summary bar */}
          {filtered.length > 0 && (
            <div className="txn-summary-footer" style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 14, flexWrap: "wrap", gap: 16 }}>
              <p style={{ fontSize: 13, color: T.text2, fontWeight: 500 }}>
                Showing <span style={{ fontWeight: 700, color: T.text }}>{filtered.length}</span> of {ALL_TXN.length} transactions
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.green }} />
                  <span style={{ fontSize: 12, color: T.text2, fontWeight: 500 }}>In:</span>
                  <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700, color: T.greenText }}>+{fmtNGN(totalIn)}</span>
                </div>
                <div style={{ width: 1, height: 16, background: T.border }} />
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.red }} />
                  <span style={{ fontSize: 12, color: T.text2, fontWeight: 500 }}>Out:</span>
                  <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700, color: T.text }}>−{fmtNGN(totalOut)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Page footer */}
        <div style={{ borderTop: `1px solid ${T.border}`, padding: "18px 40px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: T.white, flexShrink: 0 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.mintGreen} strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span style={{ fontSize: 12, color: T.text2, fontWeight: 500 }}>Your transaction is secure · </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: T.mintGreen }}>Protected by Cheeseball</span>
        </div>
      </div>

      {/* Detail drawer */}
      {selected && <TxnDetail txn={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

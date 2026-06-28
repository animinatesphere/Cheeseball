import React, { useState, useEffect } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ShoppingCart,
  CircleDollarSign,
  ArrowRightLeft,
  Wallet,
  Gift,
  ChevronRight,
  CheckCircle2,
  BarChart2,
  Copy,
  Eye,
  EyeOff,
  Send,
  Landmark,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import {
  getWallets,
  getCurrencies,
  getUserTransactions,
  getReferralData,
} from "@/services/api";
import { useRates } from "@/context/RatesContext";
import KYCStatusBanner from "./KYCStatusBanner";

/* ─── Design tokens ──────────────────────────────────────────── */
const T = {
  blue: "#1A6FFF",
  blueDark: "#1259D9",
  blueLight: "#EEF3FF",
  blueMid: "#C2D6FF",
  text: "#0A0F1E",
  text2: "#6B7A99",
  text3: "#A8B4CC",
  border: "#E8EEFF",
  surface: "#F7F9FF",
  white: "#FFFFFF",
  green: "#00C48C",
  greenLight: "#E6FAF4",
  greenText: "#00966B",
  mintGreen: "#4ADE80",
  red: "#EF4444",
  redLight: "#FEF2F2",
  redText: "#B91C1C",
  orange: "#F59E0B",
  orangeLight: "#FFFBEB",
  orangeText: "#92400E",
};

/* ─── Helpers ────────────────────────────────────────────────── */
const fmt = (n) =>
  new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
const fmtUSD = (n) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
const fmtCompact = (n) =>
  new Intl.NumberFormat("en-NG", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
const fmtCompactUSD = (n) =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);

const STATUS = {
  completed: {
    color: T.greenText,
    bg: T.greenLight,
    border: "#A7F3D0",
    label: "Completed",
  },
  pending: {
    color: T.orangeText,
    bg: T.orangeLight,
    border: "#FDE68A",
    label: "Pending",
  },
  failed: {
    color: T.redText,
    bg: T.redLight,
    border: "#FECACA",
    label: "Failed",
  },
  waiting: {
    color: T.orangeText,
    bg: T.orangeLight,
    border: "#FDE68A",
    label: "Pending",
  },
};

const QUICK_ACTIONS = [
  {
    label: "Send Crypto",
    icon: Send,
    color: T.blue,
    bg: T.blueLight,
    page: "send",
  },
  {
    label: "Withdraw",
    icon: Wallet,
    color: T.green,
    bg: T.greenLight,
    page: "withdraw",
  },
  {
    label: "Gift Cards",
    icon: Gift,
    color: T.orange,
    bg: T.orangeLight,
    page: "giftcard-swap",
  },
  {
    label: "KYC Verify",
    icon: ShieldCheck,
    color: "#7C3AED",
    bg: "#F5F3FF",
    page: "kyc",
  },
  {
    label: "Bank Accounts",
    icon: Landmark,
    color: "#0891B2",
    bg: "#ECFEFF",
    page: "bank-accounts",
  },
  {
    label: "Support",
    icon: HelpCircle,
    color: T.text2,
    bg: "#F1F5F9",
    page: "support",
  },
];

const CurrencyRates = ({ onNavigate, searchQuery = "", kycStatus = "unverified", kycRejectionReason }) => {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [copied, setCopied] = useState(false);
  const [assets, setAssets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [refData, setRefData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { rates: liveRates } = useRates();

  useEffect(() => {
    async function loadData() {
      try {
        const [wRes, cRes, tRes] = await Promise.all([
          getWallets(),
          getCurrencies(),
          getUserTransactions(),
        ]);
        const wallets = Array.isArray(wRes) ? wRes : wRes?.data || [];
        const currencies = Array.isArray(cRes) ? cRes : cRes?.data || [];
        const txns = Array.isArray(tRes) ? tRes : tRes?.items || tRes?.data || [];
        // Use the BTC buy-rate from context as a live USD/NGN base rate for portfolio valuation
        const systemUsdRate = liveRates?.BTC?.buyRate || 0;

        const COLORS = [
          "#F7931A",
          "#627EEA",
          "#26A17B",
          T.blue,
          "#9945FF",
          "#F0B90B",
        ];
        const BGS = [
          "#FEF3E2",
          "#EEEFFE",
          "#E6F7F2",
          T.blueLight,
          "#F3EEFF",
          "#FFFBEB",
        ];

        const interactedAssets = new Set();
        txns.forEach(t => {
          const status = t.status === "pending_payment" ? "pending" : t.status || "pending";
          const isSettled = status === "completed" || status === "successful" || status === "success";
          if (t.asset_code && isSettled) interactedAssets.add(t.asset_code);
        });
        
        // Always include NGN
        interactedAssets.add("NGN");

        // Ensure all wallets with >0 balance are included (balance comes as string from API)
        wallets.forEach(w => {
          const bal = parseFloat(w.balance || w.available_balance || 0);
          if (bal > 0) {
            interactedAssets.add(w.asset);
          }
        });


        const computedAssets = [];
        let colorIdx = 0;

        interactedAssets.forEach(symbol => {
          if (!symbol) return;
          const w = wallets.find((w) => w.asset === symbol) || {
            asset: symbol,
            balance: 0,
            available_balance: 0,
          };
          const cur = currencies.find((c) => (c.symbol || c.code) === symbol) || { name: symbol };
          
          const bal = parseFloat(w.available_balance || w.balance || 0);
          const priceNGN = parseFloat(cur.buy_rate || (symbol === "NGN" ? 1 : 0));
          const isNGN = symbol === "NGN";
          const usdRate = parseFloat(cur.usd_rate || (isNGN ? 0 : (systemUsdRate ? priceNGN / systemUsdRate : 0)));
          
          computedAssets.push({
            symbol: symbol,
            name: cur.name || symbol,
            balance: bal,
            balanceLabel: symbol === "NGN" ? `${bal.toFixed(2)} ${symbol}` : `${bal.toFixed(4).replace(/\.?0+$/, "")} ${symbol}`,
            valueNGN: bal * priceNGN,
            valueUSD: isNGN ? 0 : bal * usdRate,
            priceNGN: priceNGN,
            priceUSD: usdRate,
            isNGN,
            change: 0,
            color: COLORS[colorIdx % COLORS.length],
            bg: BGS[colorIdx % BGS.length],
            icon: symbol[0],
          });
          colorIdx++;
        });
        
        setAssets(computedAssets);


        const recentTxns = txns.slice(0, 6).map((t) => {
          const type = t.transaction_type || t.type || "transfer";
          const isBuy = type.toLowerCase().includes("buy");
          const isSell = type.toLowerCase().includes("sell");
          const asset = t.asset_code || "Crypto";
          const amount = t.naira_amount || 0;
          const status =
            t.status === "pending_payment"
              ? "pending"
              : t.status || "pending";
          // Only mark as settled/positive if the transaction is actually completed
          const isSettled = status === "completed" || status === "successful" || status === "success";
          const isCredit = !isBuy && type !== "withdraw";
          // Amount prefix: only show + for completed credits, − for debits, nothing for pending
          let amountStr;
          if (isBuy) {
            amountStr = `−₦${fmt(amount)}`;
          } else if (isCredit && isSettled) {
            amountStr = `+₦${fmt(amount)}`;
          } else {
            amountStr = `₦${fmt(amount)}`;
          }

          return {
            id: t.id || Math.random(),
            rawId: t.id,
            type: isBuy ? `Bought ${asset}` : isSell ? `Sold ${asset}` : type,
            method: t.payment_method || t.payout_method || "Wallet",
            amount: amountStr,
            date: new Date(t.created_at || Date.now()).toLocaleString(),
            status,
            // Only colour green when the credit is actually settled
            positive: isCredit && isSettled,
          };
        });
        setTransactions(recentTxns);
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
    getReferralData()
      .then(setRefData)
      .catch((err) => console.error("Referral Error:", err));
  }, []);

  const handleCopy = (link) => {
    if (link) {
      navigator.clipboard.writeText(link).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const ngnAsset = assets.find((a) => a.symbol === "NGN");
  const ngnBalance = ngnAsset ? ngnAsset.valueNGN : 0;

  const totalReferrals = refData?.total_referrals || 0;
  const nextMilestone = 5;
  const milestoneProgress = Math.min((totalReferrals % nextMilestone) / nextMilestone, 1);
  const rewardPerRef = 1000;
  const totalEarned = refData?.total_earned || refData?.earnings || 0;

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          gap: 16,
        }}
      >
        <style>{`@keyframes cb-spin{to{transform:rotate(360deg)}}`}</style>
        <div
          style={{
            width: 40,
            height: 40,
            border: `3px solid ${T.border}`,
            borderTopColor: T.blue,
            borderRadius: "50%",
            animation: "cb-spin 0.6s linear infinite",
          }}
        />
        <p
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: 12,
            fontWeight: 600,
            color: T.text3,
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Loading dashboard…
        </p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .quick-card:hover{border-color:${T.blue}!important;transform:translateY(-2px);box-shadow:0 8px 24px rgba(26,111,255,0.08)!important;}
        .txn-row:hover{background:${T.surface}!important;}
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @media (max-width: 1024px) {
          .dash-grid-top, .dash-grid-bottom { grid-template-columns: 1fr !important; }
          .quick-actions-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .quick-actions-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .balance-card { padding: 24px 20px !important; }
          .balance-card h1, .balance-card span { font-size: 28px !important; }
          .balance-actions { overflow-x: visible !important; flex-wrap: nowrap !important; gap: 8px !important; padding-bottom: 0 !important; width: 100%; display: flex; justify-content: space-between; }
          .balance-btn { flex: 1 !important; min-width: 0 !important; padding: 12px 2px !important; flex-direction: column !important; justify-content: center !important; gap: 6px !important; font-size: 11px !important; border-radius: 14px !important; }
          .balance-btn > svg { width: 18px !important; height: 18px !important; }
          .portfolio-table { border-radius: 18px !important; }
          .portfolio-grid { display: block !important; }
          .asset-row { padding: 16px 20px !important; }
          .asset-hide-mobile { display: none !important; }
          .ref-card-main { padding: 16px !important; gap: 14px !important; }
          .ref-card-main h2 { font-size: 13px !important; }
          .txn-row { grid-template-columns: auto 1fr auto !important; padding: 12px 14px !important; gap: 8px 12px !important; }
          .txn-icon { width: 32px !important; height: 32px !important; border-radius: 9px !important; }
          .txn-icon svg { width: 14px !important; height: 14px !important; }
          .txn-label { font-size: 13px !important; margin-bottom: 2px !important; }
          .txn-ref { font-size: 10px !important; }
          .txn-amount-mobile { font-size: 15px !important; text-align: right !important; margin: 0 !important; grid-column: 3 !important; grid-row: 1 !important; }
          .txn-mobile-footer { display: flex !important; justify-content: space-between !important; align-items: center !important; grid-column: 2 / span 2 !important; grid-row: 2 !important; margin-top: -2px !important; }
          .txn-date-col, .txn-status-col { display: none !important; }
        }
        @media (max-width: 430px) {
          .dash-grid-top, .dash-grid-bottom { grid-template-columns: 1fr !important; }
          .quick-actions-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
          .balance-card { padding: 20px 16px !important; }
          .balance-card span, .balance-card h1 { font-size: 22px !important; }
          .balance-actions { gap: 8px !important; flex-wrap: wrap !important; }
          .balance-btn { padding: 10px 8px !important; font-size: 12px !important; border-radius: 12px !important; }
          .portfolio-table { border-radius: 14px !important; }
          .portfolio-grid { display: block !important; padding: 12px 16px !important; }
          .portfolio-grid > div { margin-bottom: 8px !important; }
          .asset-hide-mobile { display: none !important; }
          .ref-card { padding: 16px !important; border-radius: 14px !important; }
          .ref-row { flex-direction: column !important; gap: 10px !important; }
          .market-card, .balance-card, .portfolio-table { width: 100% !important; }
          .quick-card { padding: 16px 8px !important; }
          .portfolio-grid .asset-name { font-size: 13px !important; }
        }
      `}</style>
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {/* ── KYC Status Banner ── */}
        <KYCStatusBanner
          status={kycStatus}
          rejectionReason={kycRejectionReason}
          onNavigate={onNavigate}
        />

        {/* ── ROW 1: Balance (full width) ── */}
        <div
          className="dash-grid-top"
          style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}
        >
          {/* Balance card */}
          <div
            className="balance-card"
            style={{
              background: "linear-gradient(135deg, #1A6FFF 0%, #0849B8 100%)",
              borderRadius: 24,
              padding: "36px 40px",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 12px 32px rgba(26, 111, 255, 0.25)",
            }}
          >
            {/* Subtle bg rings */}
            <div
              style={{
                position: "absolute",
                top: -60,
                right: -60,
                width: 260,
                height: 260,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.05)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -80,
                left: -40,
                width: 200,
                height: 200,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.04)",
                pointerEvents: "none",
              }}
            />

            <div style={{ position: "relative", zIndex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: 28,
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.55)",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      marginBottom: 10,
                    }}
                  >
                    NGN Balance
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: 8,
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Sora', sans-serif",
                        fontSize: 42,
                        fontWeight: 700,
                        color: "#fff",
                        letterSpacing: "-1.5px",
                        lineHeight: 1,
                      }}
                    >
                      {balanceVisible ? `₦${fmt(ngnBalance)}` : "₦ ••••••"}
                    </span>
                    <button
                      onClick={() => setBalanceVisible((v) => !v)}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: "rgba(255,255,255,0.12)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      {balanceVisible ? (
                        <Eye size={16} color="rgba(255,255,255,0.8)" />
                      ) : (
                        <EyeOff size={16} color="rgba(255,255,255,0.8)" />
                      )}
                    </button>
                  </div>
                </div>
                <div
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: 14,
                    padding: "12px 18px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      fontSize: 10,
                      color: "rgba(255,255,255,0.5)",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.6px",
                      marginBottom: 4,
                    }}
                  >
                    Assets
                  </p>
                  <p
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      fontSize: 22,
                      fontWeight: 700,
                      color: "#fff",
                      lineHeight: 1,
                    }}
                  >
                    {assets.length}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div
                className="balance-actions no-scrollbar"
                style={{ display: "flex", gap: 10 }}
              >
                {[
                  {
                    label: "Buy",
                    icon: ShoppingCart,
                    page: "buy",
                    primary: true,
                  },
                  {
                    label: "Sell",
                    icon: CircleDollarSign,
                    page: "sell",
                    primary: false,
                  },
                  {
                    label: "Swap",
                    icon: ArrowRightLeft,
                    page: "swap",
                    primary: false,
                  },
                  {
                    label: "Deposit",
                    icon: ArrowDownLeft,
                    page: "deposit",
                    primary: false,
                  },
                ].map(({ label, icon: Icon, page, primary }) => (
                  <button
                    key={label}
                    className="balance-btn"
                    onClick={() => onNavigate(page)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "12px 22px",
                      borderRadius: 14,
                      cursor: "pointer",
                      fontFamily: "'Sora', sans-serif",
                      fontSize: 13,
                      fontWeight: 700,
                      background: primary ? "#fff" : "rgba(255,255,255,0.12)",
                      color: primary ? T.blue : "#fff",
                      border: primary
                        ? "none"
                        : "1px solid rgba(255,255,255,0.18)",
                      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                      whiteSpace: "nowrap",
                      boxShadow: primary ? "0 4px 12px rgba(0,0,0,0.05)" : "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-1.5px)";
                      e.currentTarget.style.boxShadow = primary 
                        ? "0 6px 16px rgba(0,0,0,0.1)" 
                        : "0 6px 16px rgba(255,255,255,0.08)";
                      e.currentTarget.style.background = primary ? "#ffffff" : "rgba(255,255,255,0.18)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "none";
                      e.currentTarget.style.boxShadow = primary ? "0 4px 12px rgba(0,0,0,0.05)" : "none";
                      e.currentTarget.style.background = primary ? "#fff" : "rgba(255,255,255,0.12)";
                    }}
                  >
                    <Icon size={16} strokeWidth={2.5} />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* ── ROW 2: Quick Actions ── */}
        <div
          className="quick-actions-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: 14,
          }}
        >
          {QUICK_ACTIONS.map((qa) => (
            <button
              key={qa.label}
              className="quick-card"
              onClick={() => onNavigate(qa.page)}
              style={{
                background: T.white,
                border: `1.5px solid ${T.border}`,
                borderRadius: 20,
                padding: "22px 12px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                cursor: "pointer",
                transition: "all 0.18s",
                boxShadow: "none",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: qa.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "transform 0.18s",
                }}
              >
                <qa.icon size={20} color={qa.color} strokeWidth={2} />
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: T.text,
                  textTransform: "uppercase",
                  letterSpacing: "0.6px",
                  textAlign: "center",
                }}
              >
                {qa.label}
              </span>
            </button>
          ))}
        </div>

        {/* ── ROW 3: Portfolio + Transactions ── */}
        <div
          className="dash-grid-bottom"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 380px",
            gap: 20,
            alignItems: "start",
          }}
        >
          {/* Recent Activity (swapped into Row 3 left) */}
          <div
            style={{
              background: T.white,
              borderRadius: 24,
              border: `1.5px solid ${T.border}`,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "22px 28px",
                borderBottom: `1px solid ${T.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h2
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 15,
                  fontWeight: 700,
                  color: T.text,
                  letterSpacing: "-0.3px",
                }}
              >
                Recent Activity
              </h2>
              <button
                onClick={() => onNavigate("history")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 12,
                  fontWeight: 600,
                  color: T.blue,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                View All <ChevronRight size={14} />
              </button>
            </div>

            <div
              className="portfolio-grid asset-hide-mobile"
              style={{
                display: "grid",
                gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
                padding: "12px 28px",
                background: T.surface,
                borderBottom: `1px solid ${T.border}`,
              }}
            >
              {["Transaction", "Date", "Status", "Amount"].map((h, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: T.text3,
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    textAlign: i === 3 ? "right" : "left",
                  }}
                >
                  {h}
                </p>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              {transactions.length === 0 && !isLoading && (
                <p
                  style={{
                    fontSize: 13,
                    color: T.text3,
                    textAlign: "center",
                    padding: "20px 0",
                  }}
                >
                  No recent activity.
                </p>
              )}
              {transactions.map((txn, i) => {
                const cfg = STATUS[txn.status] || STATUS.pending;
                return (
                  <div
                    key={txn.id}
                    onClick={() => onNavigate(`transaction/${txn.rawId}`)}
                    className="txn-row"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
                      padding: "18px 28px",
                      borderBottom: i === transactions.length - 1 ? "none" : `1px solid ${T.border}`,
                      alignItems: "center",
                      cursor: "pointer",
                      transition: "background 0.12s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div
                        className="txn-icon"
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 12,
                          background: T.surface,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {txn.positive ? (
                          <ArrowDownLeft size={18} color={T.green} />
                        ) : (
                          <ArrowUpRight size={18} color={T.text3} />
                        )}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p
                          className="txn-label"
                          style={{
                            fontFamily: "'Sora', sans-serif",
                            fontSize: 14,
                            fontWeight: 700,
                            color: T.text,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {txn.type}
                        </p>
                        <p className="txn-ref" style={{ fontSize: 11, color: T.text3, fontWeight: 500, marginTop: 1 }}>
                          {txn.method}
                        </p>
                      </div>
                    </div>

                    <div className="txn-date-col">
                      <p style={{ fontSize: 13, fontWeight: 500, color: T.text2 }}>{txn.date}</p>
                    </div>

                    <div className="txn-status-col">
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: cfg.color,
                          background: cfg.bg,
                          padding: "4px 8px",
                          borderRadius: 6,
                          textTransform: "uppercase",
                          letterSpacing: "0.4px",
                        }}
                      >
                        {cfg.label}
                      </span>
                    </div>

                    <div className="txn-amount-mobile" style={{ textAlign: "right" }}>
                      <p
                        style={{
                          fontFamily: "'Sora', sans-serif",
                          fontSize: 14,
                          fontWeight: 700,
                          color: txn.positive ? T.greenText : T.text,
                        }}
                      >
                        {txn.amount}
                      </p>
                    </div>

                    {/* Mobile Footer */}
                    <div className="txn-mobile-footer" style={{ display: "none" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                         <span style={{ fontSize: 11, color: T.text3, fontWeight: 500 }}>{txn.date}</span>
                      </div>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 700, color: cfg.color, background: cfg.bg, padding: "4px 8px", border: `1px solid ${cfg.border}`, borderRadius: 6, textTransform: "uppercase" }}>
                        {cfg.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Referral & Earnings Spotlight ── */}
          <div
            style={{
              background: T.text,
              borderRadius: 24,
              padding: "28px 26px",
              position: "relative",
              overflow: "hidden",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Decorative blobs */}
            <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: `${T.blue}20`, pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -30, left: -20, width: 100, height: 100, borderRadius: "50%", background: `${T.green}15`, pointerEvents: "none" }} />

            <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%", gap: 20 }}>

              {/* Header */}
              <div>
                <p style={{ fontSize: 10, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>Referral Programme</p>
                <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: "-0.4px", lineHeight: 1.2 }}>
                  Invite friends,<br />earn <span style={{ color: T.blue }}>₦{(rewardPerRef).toLocaleString()}</span> each
                </p>
              </div>

              {/* Stats pills */}
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "12px 14px", textAlign: "center" }}>
                  <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{totalReferrals}</p>
                  <p style={{ fontSize: 10, color: T.text3, marginTop: 4, fontWeight: 500 }}>Friends invited</p>
                </div>
                <div style={{ flex: 1, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "12px 14px", textAlign: "center" }}>
                  <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 700, color: T.green, lineHeight: 1 }}>₦{totalEarned > 0 ? (totalEarned).toLocaleString() : "0"}</p>
                  <p style={{ fontSize: 10, color: T.text3, marginTop: 4, fontWeight: 500 }}>Total earned</p>
                </div>
              </div>

              {/* Milestone progress */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <p style={{ fontSize: 11, color: T.text3, fontWeight: 500 }}>Next milestone</p>
                  <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 11, fontWeight: 700, color: T.blue }}>
                    {totalReferrals % nextMilestone}/{nextMilestone} friends
                  </p>
                </div>
                <div style={{ height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${milestoneProgress * 100}%`, background: `linear-gradient(90deg, ${T.blue}, ${T.green})`, borderRadius: 99, transition: "width 0.6s ease" }} />
                </div>
                <p style={{ fontSize: 10, color: T.text3, marginTop: 6, fontWeight: 500 }}>
                  Reach {nextMilestone} referrals → unlock <span style={{ color: T.green, fontWeight: 700 }}>₦{(nextMilestone * rewardPerRef).toLocaleString()}</span> bonus
                </p>
              </div>

              {/* Referral code + copy */}
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "11px 14px" }}>
                  <p style={{ fontSize: 9, color: T.text3, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 3 }}>Your code</p>
                  <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 700, color: T.blue, letterSpacing: "2px" }}>{refData?.referral_code || "—"}</p>
                </div>
                <button
                  onClick={() => handleCopy(refData?.referral_link)}
                  style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 16px", background: copied ? T.green : T.blue, border: "none", borderRadius: 12, cursor: "pointer", fontFamily: "'Sora', sans-serif", fontSize: 12, fontWeight: 700, color: "#fff", transition: "all 0.18s", whiteSpace: "nowrap" }}
                >
                  {copied ? <><CheckCircle2 size={13} /> Copied!</> : <><Copy size={13} /> Copy Link</>}
                </button>
              </div>

              {/* How it works */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 16, marginTop: "auto" }}>
                <p style={{ fontSize: 10, color: T.text3, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 12 }}>How it works</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { step: "1", text: "Share your referral link with a friend" },
                    { step: "2", text: "They sign up and complete their first trade" },
                    { step: "3", text: "You both earn ₦1,000 credited instantly" },
                  ].map(({ step, text }) => (
                    <div key={step} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", background: T.blue, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                        <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 9, fontWeight: 700, color: "#fff" }}>{step}</span>
                      </div>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.4, fontWeight: 500 }}>{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── ROW 4: Portfolio Assets (swapped into Row 4) ── */}
        <div
          className="portfolio-table"
          style={{
            background: T.white,
            borderRadius: 24,
            border: `1.5px solid ${T.border}`,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "22px 28px",
              borderBottom: `1px solid ${T.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h2
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: 15,
                fontWeight: 700,
                color: T.text,
                letterSpacing: "-0.3px",
              }}
            >
              Portfolio Assets
            </h2>
          </div>

          {/* Table head */}
          <div
            className="portfolio-grid asset-hide-mobile"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              padding: "12px 28px",
              background: T.surface,
              borderBottom: `1px solid ${T.border}`,
            }}
          >
            {["Asset", "Balance", "Value"].map((h, i) => (
              <p
                key={i}
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: T.text3,
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  textAlign: i === 0 ? "left" : (i === 1 ? "center" : "right"),
                }}
              >
                {h}
              </p>
            ))}
          </div>

          {assets.length === 0 && !isLoading && (
            <div style={{ padding: "40px 24px", textAlign: "center" }}>
              <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 6 }}>
                No assets yet
              </p>
              <p style={{ fontSize: 13, color: T.text2 }}>
                Your asset balances will appear here once you deposit or trade.
              </p>
            </div>
          )}

          {assets.map((asset, i) => (
            <div
              key={asset.symbol}
              className="portfolio-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                padding: "18px 28px",
                borderBottom:
                  i === assets.length - 1 ? "none" : `1px solid ${T.border}`,
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: asset.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Sora', sans-serif",
                    fontSize: 14,
                    fontWeight: 700,
                    color: asset.color,
                    border: `1px solid ${asset.color}18`,
                    flexShrink: 0,
                  }}
                >
                  {asset.icon}
                </div>
                <div>
                  <p
                    className="asset-name"
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      fontSize: 14,
                      fontWeight: 700,
                      color: T.text,
                      transition: "color 0.12s",
                    }}
                  >
                    {asset.symbol}
                  </p>
                  <p
                    style={{
                      fontSize: 11,
                      color: T.text3,
                      fontWeight: 500,
                      marginTop: 1,
                    }}
                  >
                    {asset.name}
                  </p>
                </div>
              </div>

              <div
                className="asset-hide-mobile"
                style={{ textAlign: "center" }}
              >
                <p style={{ fontSize: 13, fontWeight: 600, color: T.text2 }}>
                  {asset.balanceLabel}
                </p>
              </div>

              <div style={{ textAlign: "right" }}>
                <p
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    fontSize: 14,
                    fontWeight: 700,
                    color: T.text,
                  }}
                >
                  {asset.isNGN
                    ? `₦${fmt(asset.valueNGN)}`
                    : `$${fmtCompactUSD(asset.valueUSD)}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CurrencyRates;

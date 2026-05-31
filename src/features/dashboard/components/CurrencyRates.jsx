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
  Sparkles,
  History,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  getWallets,
  getCurrencies,
  getUserTransactions,
  getReferralData,
} from "@/services/api";

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
    label: "Deposit",
    icon: ArrowDownLeft,
    color: T.blue,
    bg: T.blueLight,
    page: "deposit",
  },
  {
    label: "Buy Crypto",
    icon: ShoppingCart,
    color: "#7C3AED",
    bg: "#F5F3FF",
    page: "buy",
  },
  {
    label: "Sell Crypto",
    icon: CircleDollarSign,
    color: T.red,
    bg: T.redLight,
    page: "sell",
  },
  {
    label: "Swap",
    icon: ArrowRightLeft,
    color: "#0891B2",
    bg: "#ECFEFF",
    page: "swap",
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
];

const CurrencyRates = ({ onNavigate, searchQuery = "" }) => {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [copied, setCopied] = useState(false);
  const [assets, setAssets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [market, setMarket] = useState([]);
  const [refData, setRefData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
        const txns = Array.isArray(tRes) ? tRes : tRes?.data || [];

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

        const TARGET_ASSETS = ["BTC", "ETH", "USDT", "NGN"];

        const computedAssets = TARGET_ASSETS.map((symbol, i) => {
          const w = wallets.find((w) => w.asset === symbol) || {
            asset: symbol,
            balance: 0,
            available_balance: 0,
          };
          const cur = currencies.find(
            (c) => (c.symbol || c.code) === symbol,
          ) || { name: symbol };
          const priceNGN = cur.buy_rate || (symbol === "NGN" ? 1 : 0);
          const bal = w.available_balance || w.balance || 0;
          const isNGN = symbol === "NGN";
          // For crypto assets, derive a USD price from the NGN rate (approx ₦1,650/USD)
          const usdRate = cur.usd_rate || (isNGN ? 0 : priceNGN / 1650);
          return {
            symbol: symbol,
            name: cur.name || symbol,
            balance: bal,
            balanceLabel: `${bal} ${symbol}`,
            valueNGN: bal * priceNGN,
            valueUSD: isNGN ? 0 : bal * usdRate,
            priceNGN: priceNGN,
            priceUSD: usdRate,
            isNGN,
            change: 0,
            color: COLORS[i % COLORS.length],
            bg: BGS[i % BGS.length],
            icon: symbol[0],
          };
        });
        setAssets(computedAssets);

        const computedMarket = currencies.map((c, i) => ({
          symbol: c.symbol || c.code,
          name: c.name,
          price: `₦${fmt(c.buy_rate || 1)}`,
          change: 0,
          color: COLORS[i % COLORS.length],
          icon: (c.symbol || c.code)[0],
        }));
        setMarket(computedMarket);

        const recentTxns = txns.slice(0, 5).map((t) => {
          const type = t.transaction_type || t.type || "transfer";
          const isBuy = type.toLowerCase().includes("buy");
          const isSell = type.toLowerCase().includes("sell");
          const asset = t.asset_code || "Crypto";
          const amount = t.naira_amount || 0;

          return {
            id: t.id || Math.random(),
            type: isBuy ? `Bought ${asset}` : isSell ? `Sold ${asset}` : type,
            method: t.payment_method || t.payout_method || "Wallet",
            amount: isBuy ? `−₦${fmt(amount)}` : `+₦${fmt(amount)}`,
            date: new Date(t.created_at || Date.now()).toLocaleString(),
            status:
              t.status === "pending_payment"
                ? "pending"
                : t.status || "pending",
            positive: !isBuy && type !== "withdraw",
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
  const filteredMarket = market.filter(
    (m) =>
      m.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
        {/* ── ROW 1: Balance + Referral ── */}
        <div
          className="dash-grid-top"
          style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}
        >
          {/* Balance card */}
          <div
            className="balance-card"
            style={{
              background: T.blue,
              borderRadius: 24,
              padding: "36px 40px",
              position: "relative",
              overflow: "hidden",
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
                      padding: "10px 18px",
                      borderRadius: 12,
                      cursor: "pointer",
                      fontFamily: "'Sora', sans-serif",
                      fontSize: 13,
                      fontWeight: 700,
                      background: primary ? "#fff" : "rgba(255,255,255,0.12)",
                      color: primary ? T.blue : "#fff",
                      border: primary
                        ? "none"
                        : "1px solid rgba(255,255,255,0.15)",
                      transition: "all 0.15s",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "0.88";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "1";
                    }}
                  >
                    <Icon size={16} strokeWidth={2.5} />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Referral card (Matched from Settings) */}
          <div
            className="ref-card"
            style={{
              background: T.text,
              borderRadius: 20,
              padding: "24px 26px",
              position: "relative",
              overflow: "hidden",
              height: "100%",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -30,
                right: -30,
                width: 140,
                height: 140,
                borderRadius: "50%",
                background: `${T.blue}18`,
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "relative",
                zIndex: 1,
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "space-between",
              }}
            >
              <div
                className="ref-header"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: T.text3,
                      textTransform: "uppercase",
                      letterSpacing: "0.8px",
                      marginBottom: 4,
                    }}
                  >
                    Referral programme
                  </p>
                  <p
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#fff",
                      letterSpacing: "-0.3px",
                    }}
                  >
                    Invite friends, earn{" "}
                    <span style={{ color: T.blue }}>₦1,000</span> each
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      fontSize: 22,
                      fontWeight: 700,
                      color: "#fff",
                      lineHeight: 1,
                    }}
                  >
                    {refData?.total_referrals || 0}
                  </p>
                  <p style={{ fontSize: 11, color: T.text3, marginTop: 2 }}>
                    referrals · ₦0 earned
                  </p>
                </div>
              </div>

              {/* Code */}
              <div className="ref-row" style={{ display: "flex", gap: 8 }}>
                <div
                  style={{
                    flex: 1,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    padding: "12px 16px",
                  }}
                >
                  <p
                    style={{
                      fontSize: 10,
                      color: T.text3,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      marginBottom: 3,
                    }}
                  >
                    Your code
                  </p>
                  <p
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      fontSize: 15,
                      fontWeight: 700,
                      color: T.blue,
                      letterSpacing: "1.5px",
                    }}
                  >
                    {refData?.referral_code || "N/A"}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(refData?.referral_link)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "12px 18px",
                    background: copied ? T.greenLight : T.blue,
                    border: "none",
                    borderRadius: 12,
                    cursor: "pointer",
                    fontFamily: "'Sora', sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    color: copied ? T.greenText : "#fff",
                    transition: "all 0.18s",
                    whiteSpace: "nowrap",
                  }}
                >
                  {copied ? (
                    <>
                      <CheckCircle2 size={14} /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Copy Link
                    </>
                  )}
                </button>
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
          {/* Portfolio table */}
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
              <button
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
                Deep Dive <ChevronRight size={14} />
              </button>
            </div>

            {/* Table head */}
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
              {["Asset", "Price", "Balance", "Value"].map((h, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: T.text3,
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    textAlign: i > 0 ? "right" : "left",
                  }}
                >
                  {h}
                </p>
              ))}
            </div>

            {assets.map((asset, i) => (
              <div
                key={asset.symbol}
                className="portfolio-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
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
                  style={{ textAlign: "right" }}
                >
                  <p
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      fontSize: 13,
                      fontWeight: 600,
                      color: T.text,
                    }}
                  >
                    {asset.isNGN
                      ? `₦${fmt(asset.priceNGN)}`
                      : `$${fmtUSD(asset.priceUSD)}`}
                  </p>
                  <p
                    style={{
                      fontSize: 11,
                      color: asset.change >= 0 ? T.greenText : T.redText,
                      fontWeight: 600,
                      marginTop: 2,
                    }}
                  >
                    {asset.change > 0 ? "+" : ""}
                    {asset.change}%
                  </p>
                </div>

                <div
                  className="asset-hide-mobile"
                  style={{ textAlign: "right" }}
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
                      ? `₦${fmtCompact(asset.valueNGN)}`
                      : `$${fmtCompactUSD(asset.valueUSD)}`}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Recent transactions */}
            <div
              style={{
                background: T.white,
                borderRadius: 24,
                border: `1.5px solid ${T.border}`,
                padding: "22px 24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 20,
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
                    width: 32,
                    height: 32,
                    borderRadius: 9,
                    background: T.surface,
                    border: `1px solid ${T.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: T.text2,
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = T.blueLight;
                    e.currentTarget.style.color = T.blue;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = T.surface;
                    e.currentTarget.style.color = T.text2;
                  }}
                >
                  <History size={14} />
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {transactions.length === 0 && !isLoading && (
                  <p
                    style={{
                      fontSize: 13,
                      color: T.text3,
                      textAlign: "center",
                      padding: "10px 0",
                    }}
                  >
                    No recent activity.
                  </p>
                )}
                {transactions.map((txn) => {
                  const cfg = STATUS[txn.status] || STATUS.pending;
                  return (
                    <div
                      key={txn.id}
                      className="txn-row"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "11px 10px",
                        borderRadius: 12,
                        cursor: "pointer",
                        transition: "background 0.12s",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: 11,
                            background: T.surface,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative",
                            flexShrink: 0,
                          }}
                        >
                          {txn.positive ? (
                            <ArrowDownLeft size={16} color={T.green} />
                          ) : (
                            <ArrowUpRight size={16} color={T.text3} />
                          )}
                          <div
                            style={{
                              position: "absolute",
                              bottom: -1,
                              right: -1,
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              background: cfg.bg,
                              border: `1.5px solid ${cfg.border}`,
                            }}
                          />
                        </div>
                        <div>
                          <p
                            style={{
                              fontFamily: "'Sora', sans-serif",
                              fontSize: 13,
                              fontWeight: 700,
                              color: T.text,
                              marginBottom: 2,
                            }}
                          >
                            {txn.type}
                          </p>
                          <p
                            style={{
                              fontSize: 11,
                              color: T.text3,
                              fontWeight: 500,
                            }}
                          >
                            {txn.date}
                          </p>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p
                          style={{
                            fontFamily: "'Sora', sans-serif",
                            fontSize: 13,
                            fontWeight: 700,
                            color: txn.positive ? T.greenText : T.text,
                            marginBottom: 3,
                          }}
                        >
                          {txn.amount}
                        </p>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: cfg.color,
                            background: cfg.bg,
                            padding: "2px 7px",
                            borderRadius: 6,
                            textTransform: "uppercase",
                            letterSpacing: "0.4px",
                          }}
                        >
                          {cfg.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Market card */}
            <div
              style={{
                background: T.blue,
                borderRadius: 24,
                padding: "28px 24px",
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -40,
                  right: -40,
                  width: 180,
                  height: 180,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.06)",
                  pointerEvents: "none",
                }}
              />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      background: "rgba(255,255,255,0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <BarChart2 size={20} color="#fff" />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      background: "rgba(255,255,255,0.12)",
                      borderRadius: 20,
                      padding: "5px 12px",
                    }}
                  >
                    <div
                      className="blink"
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: T.mintGreen,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#fff",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Market +2.4%
                    </span>
                  </div>
                </div>
                <h3
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#fff",
                    lineHeight: 1.2,
                    marginBottom: 6,
                  }}
                >
                  Global Market Rates
                </h3>
                <p
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.5)",
                    marginBottom: 20,
                    fontWeight: 500,
                  }}
                >
                  Real-time data for 200+ pairs
                </p>

                {/* Market rows */}
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {filteredMarket.slice(0, 3).map((m) => (
                    <div
                      key={m.symbol}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 14px",
                        background: "rgba(255,255,255,0.08)",
                        borderRadius: 12,
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: "50%",
                          background: m.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "'Sora', sans-serif",
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#fff",
                          flexShrink: 0,
                        }}
                      >
                        {m.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            fontFamily: "'Sora', sans-serif",
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#fff",
                          }}
                        >
                          {m.symbol}
                        </p>
                        <p
                          style={{
                            fontSize: 10,
                            color: "rgba(255,255,255,0.45)",
                            fontWeight: 500,
                          }}
                        >
                          {m.name}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p
                          style={{
                            fontFamily: "'Sora', sans-serif",
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#fff",
                          }}
                        >
                          {m.price}
                        </p>
                        <p
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: m.change >= 0 ? T.mintGreen : "#FCA5A5",
                          }}
                        >
                          {m.change >= 0 ? "+" : ""}
                          {m.change}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CurrencyRates;

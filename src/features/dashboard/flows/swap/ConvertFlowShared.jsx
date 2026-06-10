import React from "react";

export const ASSETS = [
  { id: "ngn", symbol: "NGN", name: "Nigerian Naira", icon: "₦", color: "#00C48C", bg: "#E6FAF4" },
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", network: "Bitcoin", icon: "₿", color: "#F7931A", bg: "#FEF3E2" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", network: "ERC20", icon: "Ξ", color: "#627EEA", bg: "#EEEFFE" },
  { id: "tether", symbol: "USDT", name: "Tether", network: "TRC20", icon: "₮", color: "#26A17B", bg: "#E6F7F2" },
  { id: "usd-coin", symbol: "USDC", name: "USD Coin", network: "ERC20", icon: "$", color: "#2775CA", bg: "#E6F0FA" },
  { id: "bnb", symbol: "BNB", name: "BNB", network: "BEP20", icon: "⬡", color: "#F0B90B", bg: "#FEF8E6" },
  { id: "solana", symbol: "SOL", name: "Solana", network: "Solana", icon: "◎", color: "#9945FF", bg: "#F1E9FF" },
];

export const T = {
  blue: "#1A6FFF",
  blueDark: "#1259D9",
  blueLight: "#EEF3FF",
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
  orange: "#F59E0B",
  orangeLight: "#FFFBEB",
  red: "#EF4444",
  redLight: "#FEF2F2",
};

export const Ico = {
  arrow: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  arrowDn: () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1A6FFF"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </svg>
  ),
  shield: () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#4ADE80"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  check: (c) => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke={typeof c === "string" ? c : "#00C48C"}
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  clock: (c) => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke={typeof c === "string" ? c : "#F59E0B"}
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  info: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1A6FFF"
      strokeWidth="2"
      strokeLinecap="round"
      style={{ flexShrink: 0 }}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  lock: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  search: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#A8B4CC"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  copy: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  wallet: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4" />
      <circle cx="17" cy="12" r="1" fill="currentColor" />
    </svg>
  ),
  exchange: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </svg>
  ),
  chevDn: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#A8B4CC"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  x: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

export const NGN_RATE = 1412.14;
export const formatNGN = (v) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(v);
export const formatUSD = (v) => {
  if (v >= 100)
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(v);
  if (v >= 1)
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(v);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(v);
};
export const truncateAddress = (a) =>
  a ? `${a.slice(0, 6)}...${a.slice(-4)}` : "";
export const formatTime = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export const SecureFooter = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 4,
      marginTop: "auto",
      paddingTop: 24,
    }}
  >
    <span
      style={{
        fontSize: 12,
        fontWeight: 600,
        color: T.text2,
        fontFamily: "'DM Sans',sans-serif",
      }}
    >
      Your transaction is secure
    </span>
    <span
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        fontSize: 12,
        fontWeight: 500,
        color: T.mintGreen,
        fontFamily: "'DM Sans',sans-serif",
      }}
    >
      <Ico.shield /> Protected by Cheeseball
    </span>
  </div>
);

export const CTA = ({ onClick, disabled, children, style = {} }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={disabled ? "" : "ctabtn"}
    style={{
      width: "100%",
      padding: "17px",
      borderRadius: 14,
      border: "none",
      fontFamily: "'Sora',sans-serif",
      fontSize: 15,
      fontWeight: 700,
      cursor: disabled ? "not-allowed" : "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      transition: "all 0.2s",
      background: disabled ? "#E8EEFF" : T.blue,
      color: disabled ? "#A8B4CC" : "#fff",
      ...style,
    }}
  >
    {children}
  </button>
);

export const GhostBtn = ({ onClick, children, style = {} }) => (
  <button
    onClick={onClick}
    className="ghostbtn"
    style={{
      padding: "17px 24px",
      borderRadius: 14,
      border: `1.5px solid ${T.border}`,
      background: T.white,
      color: T.text2,
      fontSize: 14,
      fontWeight: 600,
      fontFamily: "'DM Sans',sans-serif",
      cursor: "pointer",
      transition: "all 0.2s",
      ...style,
    }}
  >
    {children}
  </button>
);

export const ConversionSummaryPanel = ({
  fromAmount,
  toAmount,
  selectedFromAsset,
  selectedToAsset,
  rate,
  markupPercent,
  expiryTime,
  step,
}) => {
  const isUrgent = expiryTime <= 60;

  const rows = [
    [
      "From Asset",
      selectedFromAsset
        ? `${selectedFromAsset.name} (${selectedFromAsset.symbol})`
        : "—",
    ],
    [
      "To Asset",
      selectedToAsset
        ? `${selectedToAsset.name} (${selectedToAsset.symbol})`
        : "—",
    ],
    [
      "Exchange Rate",
      rate
        ? selectedFromAsset?.symbol === "NGN"
          ? `1 ${selectedToAsset?.symbol} = ${formatNGN(rate)}`
          : `${rate} NGN per ${selectedToAsset?.symbol}`
        : "—",
    ],
    ["Platform Markup", markupPercent ? `${markupPercent}%` : "—"],
    ["Delivery", "Internal Wallet"],
  ];

  return (
    <div
      className="rightpanel"
      style={{
        padding: "44px 28px 60px",
        background: T.surface,
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <p
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: T.text3,
          textTransform: "uppercase",
          letterSpacing: "0.8px",
          marginBottom: 16,
          fontFamily: "'DM Sans',sans-serif",
        }}
      >
        Conversion Summary
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div
          style={{
            background: T.white,
            border: `1.5px solid ${T.border}`,
            borderRadius: 16,
            padding: "18px 20px",
          }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: T.text3,
              textTransform: "uppercase",
              letterSpacing: "0.7px",
              marginBottom: 12,
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            You will send
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: selectedFromAsset?.color || T.blue,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Sora',sans-serif",
                fontSize: 14,
                fontWeight: 700,
                color: "#fff",
                flexShrink: 0,
              }}
            >
              {selectedFromAsset?.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: fromAmount > 0 ? T.text : T.text3,
                  letterSpacing: "-0.8px",
                  lineHeight: 1,
                  overflowWrap: "break-word",
                }}
              >
                {fromAmount > 0
                  ? selectedFromAsset?.symbol === "NGN"
                    ? formatNGN(fromAmount)
                    : `${fromAmount.toFixed(8)} ${selectedFromAsset?.symbol}`
                  : `0.00 ${selectedFromAsset?.symbol || ""}`}
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: T.text2,
                  marginTop: 4,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {selectedFromAsset?.name}
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "-15px 0",
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: T.blueLight,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `2px solid ${T.surface}`,
              zIndex: 2,
            }}
          >
            <Ico.arrowDn />
          </div>
        </div>

        <div
          style={{ background: T.blue, borderRadius: 16, padding: "18px 20px" }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "rgba(255,255,255,0.6)",
              textTransform: "uppercase",
              letterSpacing: "0.7px",
              marginBottom: 12,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            You will receive
          </p>
          <p
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: 24,
              fontWeight: 700,
              color: toAmount > 0 ? "#fff" : "rgba(255,255,255,0.3)",
              letterSpacing: "-1px",
              lineHeight: 1,
              overflowWrap: "break-word",
            }}
          >
            {toAmount > 0
              ? selectedToAsset?.symbol === "NGN"
                ? formatNGN(toAmount)
                : `${toAmount.toFixed(8)} ${selectedToAsset?.symbol}`
              : `0.00 ${selectedToAsset?.symbol || ""}`}
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginTop: 14,
              paddingTop: 14,
              borderTop: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>
                Delivery
              </span>
              <span
                style={{
                  fontFamily: "'Sora',sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                Internal Wallet
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          background: T.white,
          border: `1.5px solid ${T.border}`,
          borderRadius: 16,
          padding: "6px 18px",
          marginTop: 14,
          marginBottom: 14,
        }}
      >
        {rows.map(([label, value], i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "9px 0",
              borderBottom:
                i < rows.length - 1 ? `1px solid ${T.border}` : "none",
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: T.text2,
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              {label}
            </span>
            <span
              style={{
                fontFamily: "'Sora',sans-serif",
                fontSize: 12,
                fontWeight: 700,
                color: T.text,
                textAlign: "right",
                maxWidth: "60%",
                wordBreak: "break-all",
              }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      {step >= 2 && expiryTime > 0 && (
        <div
          className="fadein"
          style={{
            background: isUrgent ? T.orangeLight : T.greenLight,
            border: `1px solid ${isUrgent ? "#FDE68A" : "#A7F3D0"}`,
            borderRadius: 12,
            padding: "10px 16px",
            marginBottom: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {Ico.clock(isUrgent ? T.orange : T.green)}
            <span
              style={{
                fontSize: 12,
                color: isUrgent ? "#92400E" : T.greenText,
                fontWeight: 500,
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              {isUrgent ? "Rate expiring soon" : "Rate locked"}
            </span>
          </div>
          <span
            style={{
              fontFamily: "'Sora',sans-serif",
              fontSize: 13,
              fontWeight: 700,
              color: isUrgent ? "#92400E" : T.greenText,
            }}
          >
            {formatTime(expiryTime)}
          </span>
        </div>
      )}
      <SecureFooter />
    </div>
  );
};

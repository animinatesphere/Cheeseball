import React, { useState } from "react";

/* ─────────────────────────────────────────────────────────────────
   KYCStatusBanner
   Props:
     status          – "unverified" | "in_review" | "rejected" | "verified"
     rejectionReason – optional string shown in rejected state subtitle
     onNavigate      – (page: string) => void  (navigates to kyc page)
   Returns null when status === "verified".
───────────────────────────────────────────────────────────────── */

/* ── SVG icon primitives ── */
const ShieldIcon = ({ color }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const ClockIcon = ({ color }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const XCircleIcon = ({ color }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

/* ── Config map per status ── */
const CONFIG = {
  unverified: {
    accent: "#D4860A",
    bg: "rgba(245,166,35,0.12)",
    border: "rgba(245,166,35,0.45)",
    borderHover: "rgba(245,166,35,0.7)",
    iconBg: "rgba(245,166,35,0.18)",
    iconBorder: "rgba(245,166,35,0.4)",
    Icon: ShieldIcon,
    title: "Identity Verification Required",
    subtitle:
      "Complete KYC to unlock withdrawals and full platform access.",
    cta: "Verify Now →",
  },
  in_review: {
    accent: "#C47C08",
    bg: "rgba(245,166,35,0.10)",
    border: "rgba(245,166,35,0.38)",
    borderHover: "rgba(245,166,35,0.65)",
    iconBg: "rgba(245,166,35,0.15)",
    iconBorder: "rgba(245,166,35,0.35)",
    Icon: ClockIcon,
    title: "KYC Under Review",
    subtitle:
      "Your documents are being reviewed. This takes 1–3 business days.",
    cta: "View Status →",
  },
  rejected: {
    accent: "#D92B47",
    bg: "rgba(246,70,93,0.12)",
    border: "rgba(246,70,93,0.45)",
    borderHover: "rgba(246,70,93,0.7)",
    iconBg: "rgba(246,70,93,0.16)",
    iconBorder: "rgba(246,70,93,0.4)",
    Icon: XCircleIcon,
    title: "KYC Rejected — Action Required",
    subtitle: null, // dynamically set from rejectionReason prop
    cta: "Resubmit →",
  },
};

export default function KYCStatusBanner({
  status = "unverified",
  rejectionReason = "Your documents could not be verified. Please resubmit with a clear, valid ID.",
  onNavigate,
}) {
  const [hovered, setHovered] = useState(false);

  // Verified → completely hidden
  if (status === "verified") return null;

  const cfg = CONFIG[status] || CONFIG.unverified;

  // For rejected, the subtitle comes from the rejection reason prop
  const subtitle =
    status === "rejected" ? rejectionReason : cfg.subtitle;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        @keyframes kyc-fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .kyc-banner-root {
          animation: kyc-fadeUp 0.32s cubic-bezier(0.22,1,0.36,1) both;
        }
      `}</style>

      <a
        className="kyc-banner-root"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onNavigate?.("kyc");
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          /* Layout */
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "14px 18px",
          borderRadius: 12,
          textDecoration: "none",
          cursor: "pointer",
          userSelect: "none",
          /* Visuals */
          background: cfg.bg,
          border: `1.5px solid ${hovered ? cfg.borderHover : cfg.border}`,
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          boxShadow: hovered
            ? `0 2px 12px ${cfg.border}`
            : "none",
        }}
        aria-label={`KYC status: ${status}`}
        id="kyc-status-banner"
      >
        {/* ── Icon box ── */}
        <div
          style={{
            flexShrink: 0,
            width: 38,
            height: 38,
            borderRadius: 10,
            background: cfg.iconBg,
            border: `1.5px solid ${cfg.iconBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <cfg.Icon color={cfg.accent} />
        </div>

        {/* ── Text block ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 13,
              fontWeight: 700,
              color: cfg.accent,
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            {cfg.title}
          </p>
          <p
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 12,
              fontWeight: 500,
              color: "#4A5568",
              margin: "3px 0 0",
              lineHeight: 1.4,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* ── CTA ── */}
        <span
          style={{
            flexShrink: 0,
            fontFamily: "'Outfit', sans-serif",
            fontSize: 12,
            fontWeight: 700,
            color: cfg.accent,
            letterSpacing: "0.2px",
            whiteSpace: "nowrap",
            paddingLeft: 8,
            borderLeft: `1.5px solid ${cfg.border}`,
          }}
        >
          {cfg.cta}
        </span>
      </a>
    </>
  );
}

import React from "react";
import { T, Ico, CTA, formatNGN } from "./ConvertFlowShared";

export default function ConvertFlowStep3({
  result,
  selectedFromAsset,
  selectedToAsset,
  onClose,
}) {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-NG", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: T.surface,
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: 500,
          width: "100%",
          background: T.white,
          borderRadius: 20,
          padding: "40px 32px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
        }}
      >
        {/* Success Icon */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: T.greenLight,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "popIn 0.6s cubic-bezier(0.175,0.885,0.32,1.275)",
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke={T.green}
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: "'Sora',sans-serif",
            fontSize: 24,
            fontWeight: 700,
            color: T.text,
            textAlign: "center",
            marginBottom: 8,
            letterSpacing: "-0.5px",
          }}
        >
          Conversion Completed!
        </h1>
        <p
          style={{
            fontSize: 14,
            color: T.text2,
            textAlign: "center",
            marginBottom: 32,
            fontFamily: "'DM Sans',sans-serif",
          }}
        >
          Your assets have been successfully converted and deposited to your
          wallet.
        </p>

        {/* Conversion Details */}
        <div
          style={{
            background: T.surface,
            borderRadius: 16,
            padding: "16px",
            marginBottom: 24,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {/* From */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: 12,
              borderBottom: `1px solid ${T.border}`,
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: T.text2,
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              You sent
            </span>
            <span
              style={{
                fontFamily: "'Sora',sans-serif",
                fontSize: 14,
                fontWeight: 700,
                color: T.text,
              }}
            >
              {selectedFromAsset?.symbol === "NGN"
                ? formatNGN(result.from_amount)
                : `${result.from_amount?.toFixed(8)} ${selectedFromAsset?.symbol}`}
            </span>
          </div>

          {/* To */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: 12,
              borderBottom: `1px solid ${T.border}`,
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: T.text2,
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              You received
            </span>
            <span
              style={{
                fontFamily: "'Sora',sans-serif",
                fontSize: 14,
                fontWeight: 700,
                color: T.text,
              }}
            >
              {selectedToAsset?.symbol === "NGN"
                ? formatNGN(result.to_amount)
                : `${result.to_amount?.toFixed(8)} ${selectedToAsset?.symbol}`}
            </span>
          </div>

          {/* Rate */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: 12,
              borderBottom: `1px solid ${T.border}`,
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: T.text2,
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              Exchange Rate
            </span>
            <span
              style={{
                fontFamily: "'Sora',sans-serif",
                fontSize: 14,
                fontWeight: 700,
                color: T.text,
              }}
            >
              {result.rate?.toFixed(8) || "—"}
            </span>
          </div>

          {/* Status */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: T.text2,
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              Status
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: T.green,
                }}
              />
              <span
                style={{
                  fontFamily: "'Sora',sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: T.greenText,
                  textTransform: "capitalize",
                }}
              >
                {result.status || "Completed"}
              </span>
            </div>
          </div>
        </div>

        {/* Transaction ID */}
        <div
          style={{
            background: T.blueLight,
            borderRadius: 12,
            padding: "12px 14px",
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ minWidth: 0, flex: 1 }}>
            <p
              style={{
                fontSize: 10,
                color: T.text3,
                textTransform: "uppercase",
                letterSpacing: "0.6px",
                fontFamily: "'DM Sans',sans-serif",
                marginBottom: 4,
              }}
            >
              Transaction ID
            </p>
            <p
              style={{
                fontFamily: "'Sora',sans-serif",
                fontSize: 13,
                fontWeight: 700,
                color: T.blue,
                wordBreak: "break-all",
              }}
            >
              {result.id}
            </p>
          </div>
          <button
            onClick={() => copyToClipboard(result.id)}
            style={{
              padding: "8px 12px",
              marginLeft: 8,
              background: T.blue,
              border: "none",
              borderRadius: 8,
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
              flexShrink: 0,
            }}
            onMouseOver={(e) => (e.target.style.background = T.blueDark)}
            onMouseOut={(e) => (e.target.style.background = T.blue)}
          >
            <Ico.copy />
          </button>
        </div>

        {/* Timestamps */}
        <div
          style={{
            background: T.surface,
            borderRadius: 12,
            padding: "12px 14px",
            marginBottom: 24,
            fontSize: 12,
            fontFamily: "'DM Sans',sans-serif",
            color: T.text2,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Started</span>
            <span>{formatDateTime(result.created_at)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Completed</span>
            <span>{formatDateTime(result.completed_at)}</span>
          </div>
        </div>

        {/* Info Box */}
        <div
          style={{
            background: T.blueLight,
            borderRadius: 12,
            padding: "12px 14px",
            marginBottom: 32,
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
          }}
        >
          <Ico.info />
          <span
            style={{
              fontSize: 12,
              color: T.text2,
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            Your converted assets are now in your wallet and available for use
            immediately.
          </span>
        </div>

        {/* Close Button */}
        <CTA onClick={onClose}>Close & Return to Dashboard</CTA>
      </div>
    </div>
  );
}

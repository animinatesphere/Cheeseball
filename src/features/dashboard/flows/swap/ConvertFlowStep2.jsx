import React, { useState, useEffect } from "react";
import {
  T,
  Ico,
  CTA,
  ConversionSummaryPanel,
  GhostBtn,
  formatTime,
} from "./ConvertFlowShared";
import { executeConversion } from "@/services/api";

export default function ConvertFlowStep2({
  preview,
  selectedFromAsset,
  selectedToAsset,
  onExecuted,
  onBack,
  breadcrumbs,
}) {
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isExpired = timeRemaining <= 0;

  // Countdown timer
  useEffect(() => {
    if (!preview?.expires_at) return;

    const interval = setInterval(() => {
      const now = new Date();
      const expiry = new Date(preview.expires_at);
      const remaining = Math.max(0, Math.floor((expiry - now) / 1000));
      setTimeRemaining(remaining);
    }, 100);

    return () => clearInterval(interval);
  }, [preview?.expires_at]);

  const handleConfirm = async () => {
    if (isExpired) {
      setError("Rate lock expired. Please go back and preview again.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await executeConversion(preview.rate_lock_id);
      onExecuted(result);
    } catch (err) {
      setError(
        err.message || "Failed to execute conversion. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const isUrgent = timeRemaining <= 60 && timeRemaining > 0;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 400px",
        minHeight: "100vh",
        background: T.white,
        width: "100%",
      }}
      className="buygrid"
    >
      <div
        className="step-content"
        style={{
          padding: "44px 52px 60px",
          borderRight: `1px solid ${T.border}`,
          width: "100%",
          minWidth: 0,
        }}
      >
        {breadcrumbs}
        <p
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: T.blue,
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: 6,
            fontFamily: "'DM Sans',sans-serif",
          }}
        >
          Confirmation
        </p>
        <h1
          className="responsive-title"
          style={{
            fontFamily: "'Sora',sans-serif",
            fontSize: 28,
            fontWeight: 700,
            color: T.text,
            letterSpacing: "-0.6px",
            lineHeight: 1.15,
          }}
        >
          Review Conversion
        </h1>
        <p
          style={{
            fontSize: 14,
            color: T.text2,
            marginTop: 6,
            lineHeight: 1.6,
          }}
        >
          Please review the details below. Your rate is locked for 60 seconds.
        </p>

        {/* Rate Expiry Warning */}
        {isExpired ? (
          <div
            className="fadein"
            style={{
              marginTop: 24,
              padding: "14px 16px",
              borderRadius: 12,
              background: T.redLight,
              border: `1px solid #FECACA`,
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
            }}
          >
            <Ico.info />
            <div>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: T.red,
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                Rate Lock Expired
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: T.red,
                  marginTop: 4,
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                Please go back and preview again to get a fresh rate.
              </p>
            </div>
          </div>
        ) : isUrgent ? (
          <div
            className="fadein"
            style={{
              marginTop: 24,
              padding: "14px 16px",
              borderRadius: 12,
              background: T.orangeLight,
              border: "1px solid #FDE68A",
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
            }}
          >
            {Ico.clock(T.orange)}
            <div>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#92400E",
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                Rate Expiring Soon
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: "#92400E",
                  marginTop: 4,
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                {formatTime(timeRemaining)} remaining. Confirm now or the quote
                will expire.
              </p>
            </div>
          </div>
        ) : null}

        {/* Details Section */}
        <div
          style={{
            marginTop: 32,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* From Details */}
          <div
            style={{ background: T.surface, borderRadius: 12, padding: "16px" }}
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
              You are sending
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: selectedFromAsset?.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Sora',sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {selectedFromAsset?.icon}
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "'Sora',sans-serif",
                    fontSize: 20,
                    fontWeight: 700,
                    color: T.text,
                    letterSpacing: "-0.5px",
                  }}
                >
                  {selectedFromAsset?.symbol === "NGN"
                    ? `₦${preview.from_amount?.toLocaleString()}`
                    : `${preview.from_amount?.toFixed(8)} ${selectedFromAsset?.symbol}`}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: T.text2,
                    marginTop: 2,
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  {selectedFromAsset?.name}
                </p>
              </div>
            </div>
          </div>

          {/* Arrow Divider */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                width: 32,
                height: 32,
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

          {/* To Details */}
          <div
            style={{ background: T.blue, borderRadius: 12, padding: "16px" }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "rgba(255,255,255,0.6)",
                textTransform: "uppercase",
                letterSpacing: "0.7px",
                marginBottom: 12,
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              You will receive
            </p>
            <p
              style={{
                fontFamily: "'Sora',sans-serif",
                fontSize: 24,
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "-0.8px",
              }}
            >
              {selectedToAsset?.symbol === "NGN"
                ? `₦${preview.to_amount?.toLocaleString()}`
                : `${preview.to_amount?.toFixed(8)}`}
            </p>
            <p
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.8)",
                marginTop: 4,
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              {selectedToAsset?.name}
            </p>
          </div>

          {/* Rate Details */}
          <div
            style={{ background: T.surface, borderRadius: 12, padding: "16px" }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    color: T.text2,
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  Exchange Rate
                </span>
                <span
                  style={{
                    fontFamily: "'Sora',sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    color: T.text,
                  }}
                >
                  {preview.rate?.toFixed(8) || "—"}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    color: T.text2,
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  Platform Markup
                </span>
                <span
                  style={{
                    fontFamily: "'Sora',sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    color: T.text,
                  }}
                >
                  {preview.markup_percent ? `${preview.markup_percent}%` : "—"}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: 12,
                  borderTop: `1px solid ${T.border}`,
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: T.text,
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  Rate Locked Until
                </span>
                <span
                  style={{
                    fontFamily: "'Sora',sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    color: T.blue,
                  }}
                >
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 10,
                background: T.redLight,
                border: `1px solid #FECACA`,
                color: T.red,
                fontSize: 13,
                fontFamily: "'DM Sans',sans-serif",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Ico.info /> {error}
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
          <CTA onClick={handleConfirm} disabled={loading || isExpired} loading={loading}>
            Confirm Conversion
          </CTA>
          <GhostBtn onClick={onBack}>Cancel</GhostBtn>
        </div>
      </div>

      <ConversionSummaryPanel
        fromAmount={preview.from_amount}
        toAmount={preview.to_amount}
        selectedFromAsset={selectedFromAsset}
        selectedToAsset={selectedToAsset}
        rate={preview.rate}
        markupPercent={preview.markup_percent}
        expiryTime={timeRemaining}
        step={2}
      />
    </div>
  );
}

import React, { useState, useRef, useEffect } from "react";
import {
  T,
  Ico,
  ASSETS,
  formatNGN,
  CTA,
  ConversionSummaryPanel,
  GhostBtn,
} from "./ConvertFlowShared";
import { previewConversion } from "@/services/api";

export default function ConvertFlowStep1({
  selectedFromAsset,
  setSelectedFromAsset,
  selectedToAsset,
  setSelectedToAsset,
  fromAmount,
  setFromAmount,
  balances,
  onPreviewFetched,
  breadcrumbs,
}) {
  const [ddFromOpen, setDdFromOpen] = useState(false);
  const [ddToOpen, setDdToOpen] = useState(false);
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const ddFromRef = useRef(null);
  const ddToRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const h = (e) => {
      if (ddFromRef.current && !ddFromRef.current.contains(e.target))
        setDdFromOpen(false);
      if (ddToRef.current && !ddToRef.current.contains(e.target))
        setDdToOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const getAvailableBalance = (asset) => {
    const balance = balances?.find((b) => b.asset === asset);
    return balance?.available_balance || 0;
  };

  const selectFromAsset = (asset) => {
    setSelectedFromAsset(asset);
    setDdFromOpen(false);
    setSearchFrom("");
    // Auto-clear toAsset if it's the same
    if (selectedToAsset?.symbol === asset.symbol) {
      setSelectedToAsset(null);
    }
  };

  const selectToAsset = (asset) => {
    setSelectedToAsset(asset);
    setDdToOpen(false);
    setSearchTo("");
  };

  const handleContinue = async () => {
    const numericAmount = Number(
      (fromAmount || "").toString().replace(/,/g, ""),
    );
    if (!numericAmount || numericAmount <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    const availableBalance = getAvailableBalance(selectedFromAsset?.symbol);
    if (numericAmount > availableBalance) {
      setError(
        `Insufficient balance. Available: ${formatNGN(availableBalance)}`,
      );
      return;
    }

    if (!selectedToAsset) {
      setError("Please select an asset to convert to");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const preview = await previewConversion(
        selectedFromAsset.symbol,
        selectedToAsset.symbol,
        numericAmount,
      );
      onPreviewFetched(preview);
    } catch (err) {
      setError(err.message || "Failed to generate quote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredFromAssets = ASSETS.filter(
    (a) =>
      a.name.toLowerCase().includes((searchFrom || "").toLowerCase()) ||
      a.symbol.toLowerCase().includes((searchFrom || "").toLowerCase()),
  );

  const filteredToAssets = ASSETS.filter(
    (a) =>
      a.symbol !== selectedFromAsset?.symbol &&
      (a.name.toLowerCase().includes((searchTo || "").toLowerCase()) ||
        a.symbol.toLowerCase().includes((searchTo || "").toLowerCase())),
  );

  const availableBalance = getAvailableBalance(selectedFromAsset?.symbol);
  const maxAmountDisplay =
    selectedFromAsset?.symbol === "NGN"
      ? formatNGN(availableBalance)
      : availableBalance.toFixed(8);

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
          Conversion
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
          Convert Assets
        </h1>
        <p
          style={{
            fontSize: 14,
            color: T.text2,
            marginTop: 6,
            lineHeight: 1.6,
          }}
        >
          Exchange between NGN and cryptocurrencies at the best rates. Rates are
          locked for 60 seconds after preview.
        </p>

        <div
          style={{
            marginTop: 36,
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          {/* From Asset Selection */}
          <div>
            <label
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: T.text2,
                textTransform: "uppercase",
                letterSpacing: "0.7px",
                display: "block",
                marginBottom: 12,
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              From Asset
            </label>
            <div ref={ddFromRef} style={{ position: "relative" }}>
              <button
                onClick={() => setDdFromOpen(!ddFromOpen)}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: 12,
                  border: `1.5px solid ${T.border}`,
                  background: T.white,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontSize: 14,
                  fontWeight: 600,
                  color: T.text,
                  fontFamily: "'DM Sans',sans-serif",
                }}
                className="netsel"
              >
                <span
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  {selectedFromAsset && (
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: selectedFromAsset.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "'Sora',sans-serif",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#fff",
                      }}
                    >
                      {selectedFromAsset.icon}
                    </div>
                  )}
                  <span>
                    {selectedFromAsset
                      ? `${selectedFromAsset.name} (${selectedFromAsset.symbol})`
                      : "Select asset"}
                  </span>
                </span>
                <Ico.chevDn />
              </button>

              {ddFromOpen && (
                <div
                  className="fadein"
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    marginTop: 8,
                    background: T.white,
                    border: `1.5px solid ${T.border}`,
                    borderRadius: 12,
                    zIndex: 1000,
                    maxHeight: 300,
                    overflow: "auto",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Search asset..."
                    value={searchFrom}
                    onChange={(e) => setSearchFrom(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "none",
                      borderBottom: `1px solid ${T.border}`,
                      outline: "none",
                      fontSize: 13,
                      fontFamily: "'DM Sans',sans-serif",
                      borderRadius: "11px 11px 0 0",
                    }}
                  />
                  {filteredFromAssets.map((asset, i) => (
                    <button
                      key={i}
                      onClick={() => selectFromAsset(asset)}
                      className="ddopt"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "none",
                        borderBottom:
                          i < filteredFromAssets.length - 1
                            ? `1px solid ${T.border}`
                            : "none",
                        background: T.white,
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        cursor: "pointer",
                        transition: "all 0.15s",
                        textAlign: "left",
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 13,
                        fontWeight: 500,
                        color: T.text,
                      }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: asset.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "'Sora',sans-serif",
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#fff",
                          flexShrink: 0,
                        }}
                      >
                        {asset.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontWeight: 600,
                            color: T.text,
                            fontSize: 13,
                          }}
                        >
                          {asset.name}
                        </p>
                        <p style={{ fontSize: 11, color: T.text3 }}>
                          {asset.symbol}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {selectedFromAsset && (
              <div
                style={{
                  marginTop: 10,
                  fontSize: 12,
                  color: T.text2,
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                Available: {maxAmountDisplay}
              </div>
            )}
          </div>

          {/* Amount Input */}
          <div>
            <label
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: T.text2,
                textTransform: "uppercase",
                letterSpacing: "0.7px",
                display: "block",
                marginBottom: 12,
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              Amount
            </label>
            <div
              className="amtwrap"
              style={{
                display: "flex",
                alignItems: "center",
                padding: "2px",
                borderRadius: 12,
                border: `1.5px solid ${T.border}`,
                background: T.white,
                transition: "all 0.2s",
              }}
            >
              <input
                type="number"
                value={fromAmount}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || !isNaN(val)) {
                    setFromAmount(val);
                  }
                }}
                placeholder="0"
                style={{
                  flex: 1,
                  padding: "14px 16px",
                  border: "none",
                  outline: "none",
                  fontSize: 16,
                  fontWeight: 600,
                  fontFamily: "'Sora',sans-serif",
                  background: "transparent",
                  color: T.text,
                }}
              />
              {selectedFromAsset && (
                <button
                  onClick={() => setFromAmount(availableBalance.toString())}
                  className="qbtn"
                  style={{
                    padding: "8px 14px",
                    marginRight: 8,
                    borderRadius: 8,
                    border: `1px solid ${T.border}`,
                    background: T.white,
                    color: T.text2,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  Max
                </button>
              )}
            </div>
          </div>

          {/* To Asset Selection */}
          <div>
            <label
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: T.text2,
                textTransform: "uppercase",
                letterSpacing: "0.7px",
                display: "block",
                marginBottom: 12,
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              To Asset
            </label>
            <div ref={ddToRef} style={{ position: "relative" }}>
              <button
                onClick={() => setDdToOpen(!ddToOpen)}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: 12,
                  border: `1.5px solid ${T.border}`,
                  background: T.white,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontSize: 14,
                  fontWeight: 600,
                  color: T.text,
                  fontFamily: "'DM Sans',sans-serif",
                }}
                className="netsel"
              >
                <span
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  {selectedToAsset && (
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: selectedToAsset.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "'Sora',sans-serif",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#fff",
                      }}
                    >
                      {selectedToAsset.icon}
                    </div>
                  )}
                  <span>
                    {selectedToAsset
                      ? `${selectedToAsset.name} (${selectedToAsset.symbol})`
                      : "Select asset"}
                  </span>
                </span>
                <Ico.chevDn />
              </button>

              {ddToOpen && (
                <div
                  className="fadein"
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    marginTop: 8,
                    background: T.white,
                    border: `1.5px solid ${T.border}`,
                    borderRadius: 12,
                    zIndex: 1000,
                    maxHeight: 300,
                    overflow: "auto",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Search asset..."
                    value={searchTo}
                    onChange={(e) => setSearchTo(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "none",
                      borderBottom: `1px solid ${T.border}`,
                      outline: "none",
                      fontSize: 13,
                      fontFamily: "'DM Sans',sans-serif",
                      borderRadius: "11px 11px 0 0",
                    }}
                  />
                  {filteredToAssets.map((asset, i) => (
                    <button
                      key={i}
                      onClick={() => selectToAsset(asset)}
                      className="ddopt"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "none",
                        borderBottom:
                          i < filteredToAssets.length - 1
                            ? `1px solid ${T.border}`
                            : "none",
                        background: T.white,
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        cursor: "pointer",
                        transition: "all 0.15s",
                        textAlign: "left",
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 13,
                        fontWeight: 500,
                        color: T.text,
                      }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: asset.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "'Sora',sans-serif",
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#fff",
                          flexShrink: 0,
                        }}
                      >
                        {asset.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontWeight: 600,
                            color: T.text,
                            fontSize: 13,
                          }}
                        >
                          {asset.name}
                        </p>
                        <p style={{ fontSize: 11, color: T.text3 }}>
                          {asset.symbol}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Validation Checks */}
          {selectedFromAsset && !selectedToAsset && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                background: T.orangeLight,
                border: `1px solid #FDE68A`,
                color: "#92400E",
                fontSize: 13,
                fontFamily: "'DM Sans',sans-serif",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Ico.info /> Please select asset to convert to
            </div>
          )}

          {error && (
            <div
              style={{
                padding: "10px 14px",
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

        <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
          <CTA
            onClick={handleContinue}
            disabled={
              loading ||
              !selectedFromAsset ||
              !selectedToAsset ||
              !fromAmount ||
              Number(fromAmount) <= 0
            }
          >
            {loading ? "Getting Quote..." : "Get Quote"}
          </CTA>
        </div>
      </div>

      <ConversionSummaryPanel
        fromAmount={0}
        toAmount={0}
        selectedFromAsset={selectedFromAsset}
        selectedToAsset={selectedToAsset}
        rate={null}
        markupPercent={null}
        expiryTime={0}
        step={1}
      />
    </div>
  );
}

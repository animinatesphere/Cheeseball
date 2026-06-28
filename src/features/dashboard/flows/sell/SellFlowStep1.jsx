import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  T,
  Ico,
  ASSETS,
  formatNGN,
  CTA,
  RightPanel,
} from "./SellFlowShared";
import { getSellQuote } from "@/services/api";

const ALLOWED_SYMBOLS = [
  "BTC", "ETH", "USDT", "USDC", "BNB", "SOL", "XRP", "TRX", "LTC", "DOGE",
  "BCH", "ADA", "MATIC", "DOT", "LINK", "AVAX", "UNI", "XLM", "ATOM", "ETC", "TON"
];

export default function SellFlowStep1({
  selectedAsset,
  setSelectedAsset,
  selectedNetwork,
  setSelectedNetwork,
  cryptoSource,
  setCryptoSource,
  payAmount,
  setPayAmount,
  inputCurrency,
  setInputCurrency,
  searchQuery,
  setSearchQuery,
  breadcrumbs,
  onQuoteFetched,
}) {
  const [ddOpen, setDdOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const ddRef = useRef(null);

  // cachedRate: NGN per 1 unit of crypto
  const [cachedRate, setCachedRate] = useState(null);
  const [quoteFetching, setQuoteFetching] = useState(false);
  const debounceRef = useRef(null);

  const numericInput = Number((payAmount || "").toString().replace(/,/g, ""));
  const liveEquivalent = cachedRate && numericInput > 0
    ? inputCurrency === "NGN"
      ? numericInput / cachedRate          // NGN → crypto
      : numericInput * cachedRate           // crypto → NGN
    : null;

  const fetchRateFromQuote = useCallback(async (amount, currency, symbol) => {
    if (!amount || amount <= 0) return;
    setQuoteFetching(true);
    try {
      let q;
      if (currency === "NGN") {
        if (amount < 100) return;
        q = await getSellQuote(symbol, null, amount);
      } else {
        q = await getSellQuote(symbol, amount);
      }
      if (q && q.naira_amount && q.crypto_amount) {
        const rate = parseFloat(q.naira_amount) / parseFloat(q.crypto_amount);
        if (rate > 0) setCachedRate(rate);
      }
      setError(null);
    } catch {
      // silently fail — cached rate stays intact
    } finally {
      setQuoteFetching(false);
    }
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchRateFromQuote(numericInput, inputCurrency, selectedAsset.symbol);
    }, 800);
    return () => clearTimeout(debounceRef.current);
  }, [numericInput, inputCurrency, selectedAsset.symbol]); // eslint-disable-line

  useEffect(() => {
    setCachedRate(null);
    setError(null);
  }, [selectedAsset.symbol]);

  useEffect(() => {
    const h = (e) => {
      if (ddRef.current && !ddRef.current.contains(e.target)) setDdOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const selectCoin = (asset) => {
    setSelectedAsset(asset);
    // Reset to the asset's default network when switching assets
    setSelectedNetwork(asset.networks ? asset.networks[0].id : (asset.network || ""));
    setPayAmount("");
    setDdOpen(false);
  };

  const handleSwap = () => {
    setError(null);
    if (liveEquivalent !== null && liveEquivalent > 0) {
      if (inputCurrency === "NGN") {
        const cryptoVal = parseFloat(liveEquivalent.toFixed(8));
        setPayAmount(String(cryptoVal));
        setInputCurrency("CRYPTO");
      } else {
        const ngnVal = Math.round(liveEquivalent);
        setPayAmount(ngnVal.toLocaleString("en-US"));
        setInputCurrency("NGN");
      }
    } else {
      setPayAmount("");
      setInputCurrency(c => c === "NGN" ? "CRYPTO" : "NGN");
    }
  };

  const handleContinue = async () => {
    const numericAmount = Number(
      (payAmount || "").toString().replace(/,/g, ""),
    );
    if (!numericAmount || numericAmount <= 0) return;

    setLoading(true);
    setError(null);
    try {
      let quote;
      if (inputCurrency === "NGN") {
        if (numericAmount < 1000) {
          setError("Minimum sell amount is ₦1,000");
          setLoading(false);
          return;
        }
        quote = await getSellQuote(selectedAsset.symbol, null, numericAmount);
      } else {
        const ngnEquiv = cachedRate ? numericAmount * cachedRate : null;
        if (ngnEquiv !== null && ngnEquiv < 1000) {
          setError("Minimum sell amount is ₦1,000");
          setLoading(false);
          return;
        }
        quote = await getSellQuote(selectedAsset.symbol, numericAmount);
        if (parseFloat(quote.naira_amount) < 1000) {
           setError("Minimum sell amount is ₦1,000");
           setLoading(false);
           return;
        }
      }
      onQuoteFetched(quote);
    } catch (err) {
      setError(err.message || "Failed to get quote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredAssets = ASSETS.filter(
    (a) => ALLOWED_SYMBOLS.includes(a.symbol) && (
      a.name.toLowerCase().includes((searchQuery || "").toLowerCase()) ||
      a.symbol.toLowerCase().includes((searchQuery || "").toLowerCase())
    )
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 400px",
        minHeight: "100vh",
        background: T.white,
        width: "100%",
      }}
      className="sellgrid"
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
            Step 1 of 3
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
          Sell Crypto
        </h1>
        <p
          style={{
            fontSize: 14,
            color: T.text2,
            marginTop: 6,
            lineHeight: 1.6,
            fontFamily: "'DM Sans',sans-serif",
          }}
        >
          Select an asset, choose your source, and enter an amount. Your fiat will be deposited based on your selection.
        </p>

        {/* Crypto Source Cards */}
        <div style={{ marginTop: 28 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10, fontFamily: "'DM Sans',sans-serif" }}>
            Crypto Source
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { key: "external_wallet", label: "External Wallet", sub: "Send from Binance, Trust Wallet, etc.", IconComp: Ico.external },
              { key: "cheeseball_wallet", label: "Cheeseball Wallet", sub: "Sell directly from your balance", IconComp: Ico.wallet },
            ].map(({ key, label, sub, IconComp }) => {
              const active = cryptoSource === key;
              return (
                <button
                  key={key}
                  onClick={() => setCryptoSource(key)}
                  style={{
                    border: `1.5px solid ${active ? T.blue : T.border}`,
                    borderRadius: 16, padding: "20px 18px", background: active ? T.blueLight : T.white,
                    cursor: "pointer", textAlign: "left", transition: "all 0.18s", position: "relative",
                  }}
                >
                  {active && (
                    <div style={{ position: "absolute", top: 12, right: 12, width: 20, height: 20, borderRadius: "50%", background: T.blue, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {Ico.check("#fff")}
                    </div>
                  )}
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: active ? T.blue : T.surface, display: "flex", alignItems: "center", justifyContent: "center", color: active ? "#fff" : T.text2, marginBottom: 12 }}>
                    <IconComp />
                  </div>
                  <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 700, color: active ? T.blue : T.text }}>{label}</p>
                  <p style={{ fontSize: 12, color: T.text2, marginTop: 4, lineHeight: 1.4 }}>{sub}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Asset selector */}
        <div style={{ marginTop: 28 }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: T.text3,
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              marginBottom: 10,
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            Select asset
          </p>
          <div
            ref={ddRef}
            className="csel"
            style={{
              border: `1.5px solid ${ddOpen ? T.blue : T.border}`,
              borderRadius: 16,
              background: T.white,
              cursor: "pointer",
              overflow: "hidden",
              transition: "border-color 0.18s",
            }}
            onClick={() => setDdOpen((o) => !o)}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: selectedAsset.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Sora',sans-serif",
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  {selectedAsset.icon}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p
                    style={{
                      fontFamily: "'Sora',sans-serif",
                      fontSize: 15,
                      fontWeight: 700,
                      color: T.text,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {selectedAsset.name}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                    <p style={{ fontSize: 12, color: T.text2 }}>
                      {selectedAsset.symbol}
                    </p>
                    <div style={{ padding: "2px 6px", borderRadius: 4, background: T.surface, border: `1px solid ${T.border}`, fontSize: 10, color: T.text2, fontWeight: 600 }}>
                      {selectedNetwork || selectedAsset.network}
                    </div>
                  </div>
                </div>
              </div>
              <span
                style={{
                  fontSize: 16,
                  color: T.blue,
                  transform: ddOpen ? "rotate(180deg)" : "none",
                  transition: "transform 0.2s",
                  display: "inline-block",
                  marginLeft: 8,
                }}
              >
                ⌄
              </span>
            </div>
            {ddOpen && (
              <div
                style={{
                  borderTop: `1px solid ${T.border}`,
                  padding: "8px 12px 12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  maxHeight: 280,
                  overflowY: "auto",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {filteredAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="ddopt"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 10px",
                      borderRadius: 12,
                      cursor: "pointer",
                      background:
                        asset.id === selectedAsset.id
                          ? T.blueLight
                          : "transparent",
                      transition: "background 0.12s",
                    }}
                    onClick={() => selectCoin(asset)}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: asset.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#fff",
                        flexShrink: 0,
                      }}
                    >
                      {asset.icon}
                    </div>
                    <div>
                      <p
                        style={{
                          fontFamily: "'Sora',sans-serif",
                          fontSize: 13,
                          fontWeight: 600,
                          color: T.text,
                        }}
                      >
                        {asset.name}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                        <p style={{ fontSize: 11, color: T.text2 }}>
                          {asset.symbol}
                        </p>
                        <div style={{ padding: "2px 6px", borderRadius: 4, background: T.white, border: `1px solid ${T.border}`, fontSize: 9, color: T.text2, fontWeight: 600 }}>
                          {asset.network}
                        </div>
                      </div>
                    </div>

                    {asset.id === selectedAsset.id && (
                      <span
                        style={{ color: T.blue, fontSize: 15, marginLeft: 6 }}
                      >
                        ✓
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Network selector — only shown for multi-network assets */}
        {selectedAsset.networks && selectedAsset.networks.length > 1 && (
          <div style={{ marginTop: 20 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10, fontFamily: "'DM Sans',sans-serif" }}>
              Select Network
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {selectedAsset.networks.map((net) => {
                const active = (selectedNetwork || selectedAsset.networks[0].id) === net.id;
                const badgeColor = net.badge === "Cheapest" ? T.green
                  : net.badge === "Cheap" ? T.blue
                  : "#F59E0B";
                const badgeBg = net.badge === "Cheapest" ? T.greenLight
                  : net.badge === "Cheap" ? T.blueLight
                  : "#FFFBEB";
                return (
                  <button
                    key={net.id}
                    onClick={() => setSelectedNetwork(net.id)}
                    style={{
                      display: "flex", flexDirection: "column", gap: 4,
                      padding: "10px 14px", borderRadius: 12,
                      border: `1.5px solid ${active ? T.blue : T.border}`,
                      background: active ? T.blueLight : T.white,
                      cursor: "pointer", transition: "all 0.18s", textAlign: "left",
                    }}
                  >
                    <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 12, fontWeight: 700, color: active ? T.blue : T.text }}>
                      {net.label}
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: badgeColor, background: badgeBg, borderRadius: 4, padding: "1px 6px", alignSelf: "flex-start" }}>
                      {net.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Amount input */}
        <div style={{ marginTop: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: T.text3,
                textTransform: "uppercase",
                letterSpacing: "0.8px",
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              You sell
            </p>
          </div>
          <div
            style={{
              border: `1.5px solid ${T.border}`,
              borderRadius: 16,
              padding: "20px 22px",
              background: T.white,
              transition: "border-color 0.18s",
            }}
            className="amtwrap"
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                className="responsive-amount"
                style={{
                  fontFamily: "'Sora',sans-serif",
                  fontSize: 36,
                  fontWeight: 700,
                  color: T.text3,
                  display: inputCurrency === "NGN" ? "inline" : "none",
                }}
              >
                ₦
              </span>
              <input
                type="text"
                placeholder={inputCurrency === "NGN" ? "1000" : "0.01"}
                value={payAmount || ""}
                onChange={(e) => {
                  let raw = (e.target.value || "").replace(/[^0-9.]/g, "");
                  if (raw.split(".").length > 2) raw = raw.replace(/\.+$/, "");
                  
                  if (inputCurrency === "NGN") {
                    const parts = raw.split(".");
                    parts[0] = parts[0].replace(/^0+(?=\d)/, "");
                    const intPart = parts[0]
                      ? Number(parts[0]).toLocaleString("en-US")
                      : "";
                    const formatted =
                      parts[1] !== undefined ? intPart + "." + parts[1] : intPart;
                    setPayAmount(formatted);
                  } else {
                    setPayAmount(raw);
                  }
                  setError(null);
                }}
                className="sell-amt-input"
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  fontFamily: "'Sora',sans-serif",
                  fontSize: 36,
                  fontWeight: 700,
                  color:
                    parseFloat((payAmount || "").toString().replace(/,/g, "")) > 0
                      ? T.text
                      : "#CED6E8",
                  background: "transparent",
                  minWidth: 0,
                  letterSpacing: "-1.5px",
                }}
              />
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: T.blueLight,
                    borderRadius: 10,
                    padding: "8px 13px",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Sora',sans-serif",
                      fontSize: 13,
                      fontWeight: 700,
                      color: T.blue,
                    }}
                  >
                    {inputCurrency === "NGN" ? "NGN" : selectedAsset.symbol}
                  </span>
                  <span style={{ fontSize: 16 }}>{inputCurrency === "NGN" ? "🇳🇬" : ""}</span>
                </div>
                
                <button
                  onClick={handleSwap}
                  className="qbtn"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: T.surface,
                    border: `1.5px solid ${T.border}`,
                    cursor: "pointer",
                    color: T.text,
                    transition: "all 0.2s",
                  }}
                  title="Swap Currency"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 3 21 3 21 8"></polyline>
                    <line x1="4" y1="14" x2="21" y2="3"></line>
                    <polyline points="8 21 3 21 3 16"></polyline>
                    <line x1="20" y1="10" x2="3" y2="21"></line>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <div className="fadein" style={{ marginTop: 8, paddingLeft: 6, minHeight: 24 }}>
            {liveEquivalent !== null && !error ? (
              <p style={{ fontSize: 14, color: T.green, fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}>
                ≈ {inputCurrency === "NGN"
                   ? `${parseFloat(liveEquivalent.toFixed(8))} ${selectedAsset.symbol}`
                   : `${formatNGN(Math.round(liveEquivalent))}`}
              </p>
            ) : quoteFetching ? (
              <p style={{ fontSize: 12, color: T.text3, fontFamily: "'DM Sans',sans-serif" }}>Fetching rate…</p>
            ) : null}
          </div>
        </div>

        {error && (
          <div
            className="fadein"
            style={{
              marginTop: 16,
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              background: T.redLight,
              border: `1px solid #FECACA`,
              borderRadius: 12,
              padding: "12px 16px",
            }}
          >
            <Ico.info />
            <p
              style={{
                fontSize: 13,
                color: T.red,
                fontFamily: "'DM Sans',sans-serif",
                lineHeight: 1.5,
              }}
            >
              {error}
            </p>
          </div>
        )}

        <div style={{ marginTop: 24 }}>
          <CTA
            onClick={handleContinue}
            disabled={!payAmount || loading}
            loading={loading}
          >
            Continue <Ico.arrow />
          </CTA>
        </div>
      </div>
      <RightPanel
        payAmount={inputCurrency === "CRYPTO" ? numericInput : (liveEquivalent ? parseFloat(liveEquivalent.toFixed(8)) : 0)}
        receiveAmount={inputCurrency === "NGN" ? numericInput : (liveEquivalent ? Math.round(liveEquivalent) : 0)}
        rate={cachedRate}
        selectedAsset={selectedAsset}
        selectedNetwork={selectedNetwork}
        expiryTime={0}
        step={1}
      />
    </div>
  );
}

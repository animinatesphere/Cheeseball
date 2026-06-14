import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  T,
  Ico,
  ASSETS,
  formatNGN,
  CTA,
  RightPanel,
} from "./BuyFlowShared";
import { getBuyQuote } from "@/services/api";


const ALLOWED_SYMBOLS = [
  "BTC", "ETH", "USDT", "USDC", "BNB", "SOL", "XRP", "TRX", "LTC", "DOGE",
  "BCH", "ADA", "MATIC", "DOT", "LINK", "AVAX", "UNI", "XLM", "ATOM", "ETC", "TON"
];

export default function BuyFlowStep1({
  selectedAsset,
  setSelectedAsset,
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

  // cachedRate: NGN per 1 unit of crypto (e.g. 108,000,000 for BTC)
  // Derived from any successful API quote. All live-label math uses this.
  const [cachedRate, setCachedRate] = useState(null);
  const [quoteFetching, setQuoteFetching] = useState(false);
  const debounceRef = useRef(null);

  // Compute the "other side" value purely from the cached rate
  const numericInput = Number((payAmount || "").toString().replace(/,/g, ""));
  const liveEquivalent = cachedRate && numericInput > 0
    ? inputCurrency === "NGN"
      ? numericInput / cachedRate          // NGN → crypto
      : numericInput * cachedRate           // crypto → NGN
    : null;

  // Fetch a quote from backend to anchor the rate
  const fetchRateFromQuote = useCallback(async (amount, currency, symbol) => {
    if (!amount || amount <= 0) return;
    setQuoteFetching(true);
    try {
      let q;
      if (currency === "NGN") {
        if (amount < 100) return;
        q = await getBuyQuote(symbol, null, amount);
      } else {
        q = await getBuyQuote(symbol, amount, null);
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

  // Debounced rate refresh whenever input changes
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchRateFromQuote(numericInput, inputCurrency, selectedAsset.symbol);
    }, 800);
    return () => clearTimeout(debounceRef.current);
  }, [numericInput, inputCurrency, selectedAsset.symbol]); // eslint-disable-line

  // Reset rate when asset changes
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
    setPayAmount("");
    setDdOpen(false);
  };

  const handleSwap = () => {
    setError(null);
    // Pre-fill the swapped field with the currently computed equivalent
    if (liveEquivalent !== null && liveEquivalent > 0) {
      if (inputCurrency === "NGN") {
        // switching to CRYPTO → pre-fill with crypto amount, up to 8 decimals
        const cryptoVal = parseFloat(liveEquivalent.toFixed(8));
        setPayAmount(String(cryptoVal));
        setInputCurrency("CRYPTO");
      } else {
        // switching to NGN → pre-fill with NGN amount rounded to whole number
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
          setError("Minimum buy amount is ₦1,000");
          setLoading(false);
          return;
        }
        quote = await getBuyQuote(selectedAsset.symbol, null, numericAmount);
      } else {
        // If cachedRate exists, derive equivalent NGN to validate minimum
        const ngnEquiv = cachedRate ? numericAmount * cachedRate : null;
        if (ngnEquiv !== null && ngnEquiv < 1000) {
          setError("Minimum buy amount is ₦1,000");
          setLoading(false);
          return;
        }
        quote = await getBuyQuote(selectedAsset.symbol, numericAmount, null);
        if (parseFloat(quote.naira_amount) < 1000) {
           setError("Minimum buy amount is ₦1,000");
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
          Transaction
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
          Buy Crypto
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
          Select an asset and enter the amount you'd like to purchase. Crypto is
          delivered instantly to your Cheeseball wallet.
        </p>

        {/* Asset selector */}
        <div style={{ marginTop: 32 }}>
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
                      {selectedAsset.network}
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
              You pay
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
                    // For crypto, allow decimals as typed
                    setPayAmount(raw);
                  }
                  setError(null);
                }}
                className="buy-amt-input"
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
          
          {/* Dynamic Green Label — computed locally from cached rate */}
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

          {inputCurrency === "NGN" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
                gap: 8,
                marginTop: 10,
              }}
            >
              {[5000, 10000, 50000, 100000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => {
                    setPayAmount(amt);
                    setError(null);
                  }}
                  className="qbtn"
                  style={{
                    flex: "1 0 80px",
                    border: `1.5px solid ${payAmount == amt ? T.blue : T.border}`,
                    background: payAmount == amt ? T.blueLight : T.white,
                    borderRadius: 10,
                    padding: "8px 10px",
                    fontSize: 12,
                    fontWeight: 600,
                    color: payAmount == amt ? T.blue : T.text2,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    textAlign: "center",
                    fontFamily: "'DM Sans',sans-serif",
                    minWidth: "fit-content",
                  }}
                >
                  {formatNGN(amt)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Error message */}
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

        {/* Delivery info banner */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            background: T.blueLight,
            borderRadius: 14,
            padding: "14px 18px",
            marginTop: 20,
          }}
        >
          <Ico.info />
          <p
            style={{
              fontSize: 13,
              color: "#1A3A8A",
              lineHeight: 1.6,
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            Purchased crypto is automatically deposited into your Cheeseball
            internal wallet — no external address needed.
          </p>
        </div>

        <div style={{ marginTop: 24 }}>
          <CTA
            onClick={handleContinue}
            disabled={!payAmount || loading}
            loading={loading}
          >
            Continue <Ico.arrow />
          </CTA>
          <p
            style={{
              fontSize: 11,
              textAlign: "center",
              color: T.text3,
              fontWeight: 500,
              marginTop: 12,
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            The exact amount you'll receive will be confirmed on the next
            screen.
          </p>
        </div>
      </div>
      <RightPanel
        payAmount={inputCurrency === "NGN" ? numericInput : (liveEquivalent ? Math.round(liveEquivalent) : 0)}
        receiveAmount={inputCurrency === "CRYPTO" ? numericInput : (liveEquivalent ? parseFloat(liveEquivalent.toFixed(8)) : 0)}
        rate={cachedRate}
        selectedAsset={selectedAsset}
        expiryTime={0}
        step={1}
      />
    </div>
  );
}

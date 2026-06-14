import React, { useState, useEffect, useRef } from "react";
import { T, Ico, ASSETS, CTA } from "../swap/ConvertFlowShared";
import { lookupUser, sendCrypto, getUserPortfolio } from "../../../../services/api";

const SEND_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; overflow-x: hidden; }

  .ctabtn:hover:not(:disabled)  { background: ${T.blueDark} !important; }
  .ctabtn:active:not(:disabled) { transform: scale(0.985); }
  .method-card:hover { border-color: ${T.blue} !important; box-shadow: 0 4px 12px rgba(26, 111, 255, 0.1) !important; }

  @keyframes fadeUp  { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  @keyframes popIn   { 0% { transform:scale(0.95); opacity:0; } 100% { transform:scale(1); opacity:1; } }
  @keyframes spin    { to { transform: rotate(360deg); } }
  .fadein  { animation: fadeUp 0.25s ease forwards; }
  .popIn   { animation: popIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275) forwards; }
  
  input::placeholder { color: #CED6E8; }
`;

function SendBreadcrumbs({ step, onNavigate, onClose }) {
  const steps = [{ id: 1, label: "Send Crypto" }];
  
  if (step >= 2) steps.push({ id: 2, label: "Select Asset" });
  if (step >= 3) steps.push({ id: 3, label: "Details" });
  if (step >= 4) steps.push({ id: 4, label: "Summary" });
  if (step >= 5) steps.push({ id: 5, label: "Status" });

  return (
    <nav
      className="breadcrumb-nav"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        flexWrap: "wrap",
        marginBottom: 36,
      }}
    >
      <span
        onClick={onClose}
        className="breadcrumb-item"
        style={{ fontSize: 13, color: T.text2, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
      >
        Dashboard
      </span>

      {steps.map((s, idx) => {
        const isLast = idx === steps.length - 1;
        const clickable = !isLast && step < 5;

        return (
          <React.Fragment key={s.id}>
            <span className="breadcrumb-item" style={{ color: T.text3, fontSize: 12, userSelect: "none" }}>›</span>
            <span
              onClick={() => clickable && onNavigate(s.id)}
              className="breadcrumb-item"
              style={{
                fontSize: 13,
                fontWeight: isLast ? 600 : 500,
                color: isLast ? T.blue : T.text2,
                cursor: clickable ? "pointer" : "default",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {s.label}
            </span>
          </React.Fragment>
        );
      })}
    </nav>
  );
}

export default function SendCryptoFlow({ onNavigate, onBack }) {
  // Navigation & Data
  const [step, setStep] = useState(1);
  const [sendMethod, setSendMethod] = useState(null); // 'internal' | 'external'
  const [selectedAsset, setSelectedAsset] = useState(null);
  
  // Details
  const [amount, setAmount] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [network, setNetwork] = useState("");
  const [lookupMethod, setLookupMethod] = useState("email");
  const [recipientUuid, setRecipientUuid] = useState("");
  
  // User Lookup
  const [lookedUpUser, setLookedUpUser] = useState(null);
  const [lookupError, setLookupError] = useState("");
  const [isLookingUp, setIsLookingUp] = useState(false);

  // Submit
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitResult, setSubmitResult] = useState(null); // success details

  const cryptoAssets = ASSETS.filter((a) => a.symbol !== "NGN");
  const [balances, setBalances] = useState([]);

  useEffect(() => {
    getUserPortfolio().then(setBalances).catch(console.error);
  }, []);

  const availableBalance = balances?.find((b) => b.asset === selectedAsset?.symbol)?.available_balance || 0;

  const [ddOpen, setDdOpen] = useState(false);
  const [assetQuery, setAssetQuery] = useState("");
  const ddRef = useRef(null);

  const filteredAssets = cryptoAssets.filter(a =>
    a.name.toLowerCase().includes(assetQuery.toLowerCase()) ||
    a.symbol.toLowerCase().includes(assetQuery.toLowerCase())
  );

  useEffect(() => {
    const h = e => { if (ddRef.current && !ddRef.current.contains(e.target)) setDdOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleSelectMethod = (method) => {
    setSendMethod(method);
    setStep(2);
  };

  const handleSelectAsset = (asset) => {
    setSelectedAsset(asset);
    setStep(3);
    setNetwork(asset.networks ? asset.networks[0].name : "Mainnet");
  };

  const handleAmountChange = (val) => {
    let cleaned = val.replace(/[^0-9.]/g, "");
    if (cleaned.split(".").length > 2) cleaned = cleaned.replace(/\.+$/, "");
    setAmount(cleaned);
  };

  const performLookup = async () => {
    const query = lookupMethod === "email" ? recipientEmail : recipientUuid;
    if (!query || query.trim().length === 0) return;
    setIsLookingUp(true);
    setLookupError("");
    setLookedUpUser(null);
    try {
      const user = await lookupUser(query.trim());
      setLookedUpUser(user);
    } catch (err) {
      setLookupError(`User not found with this ${lookupMethod === "email" ? "email" : "ID"}`);
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleBlur = () => {
    const query = lookupMethod === "email" ? recipientEmail : recipientUuid;
    if (query && !lookedUpUser && !lookupError) {
      performLookup();
    }
  };

  const goToSummary = () => {
    if (sendMethod === "internal" && !lookedUpUser) {
      performLookup();
      return;
    }
    setStep(4);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError("");
    try {
      const payload = {
        transfer_type: sendMethod,
        asset: selectedAsset.symbol,
        amount: parseFloat(amount),
      };

      if (sendMethod === "internal") {
        payload.recipient_email = lookedUpUser.email;
      } else {
        payload.recipient_address = recipientAddress;
        payload.recipient_network = network;
      }

      const res = await sendCrypto(payload);
      setSubmitResult(res);
      setStep(5);
    } catch (err) {
      setSubmitError(err.message || "Transfer failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackStep = () => {
    if (step === 1) {
      if (onBack) onBack();
      else window.history.back();
    } else {
      setStep(step - 1);
    }
  };

  return (
    <>
      <style>{SEND_CSS}</style>

      <div
        className="step-content"
        style={{
          minHeight: "100vh",
          background: T.white,
          padding: "44px 52px 60px",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div style={{ maxWidth: 640 }}>
          <SendBreadcrumbs 
            step={step} 
            onNavigate={(s) => setStep(s)} 
            onClose={() => { if (onBack) onBack(); else window.history.back(); }} 
          />
          {step === 1 && (
            <div className="fadein">
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: T.blue,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: 4,
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                Send Crypto
              </p>
              <h1
                style={{
                  fontFamily: "'Sora',sans-serif",
                  fontSize: 32,
                  fontWeight: 700,
                  color: T.text,
                  letterSpacing: "-0.6px",
                  marginBottom: 8,
                }}
              >
                How would you like to send?
              </h1>
              <p
                style={{
                  fontSize: 15,
                  color: T.text2,
                  marginBottom: 20,
                  lineHeight: 1.6,
                }}
              >
                Send cryptocurrency instantly to another Cheeseball user for free, or
                send it externally to an on-chain wallet address.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: 16,
                  marginBottom: 16,
                }}
              >
                {/* Internal Option */}
                <button
                  onClick={() => handleSelectMethod("internal")}
                  className="method-card"
                  style={{
                    padding: 28,
                    background: T.white,
                    border: `2px solid ${T.border}`,
                    borderRadius: 16,
                    cursor: "pointer",
                    transition: "all 0.3s",
                    textAlign: "left",
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontFamily: "'Sora',sans-serif",
                          fontSize: 18,
                          fontWeight: 700,
                          color: T.text,
                          marginBottom: 4,
                        }}
                      >
                        Cheeseball User
                      </p>
                      <p
                        style={{
                          fontSize: 13,
                          color: T.text2,
                          fontFamily: "'DM Sans',sans-serif",
                        }}
                      >
                        Send to friends via email
                      </p>
                    </div>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: T.blue,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 12px",
                      background: T.greenLight,
                      borderRadius: 10,
                    }}
                  >
                    {Ico.check(T.green)}
                    <span
                      style={{
                        fontSize: 12,
                        color: T.greenText,
                        fontWeight: 600,
                        fontFamily: "'DM Sans',sans-serif",
                      }}
                    >
                      Instant & Zero Fees
                    </span>
                  </div>
                </button>

                {/* External Option */}
                <button
                  onClick={() => handleSelectMethod("external")}
                  className="method-card"
                  style={{
                    padding: 28,
                    background: T.white,
                    border: `2px solid ${T.border}`,
                    borderRadius: 16,
                    cursor: "pointer",
                    transition: "all 0.3s",
                    textAlign: "left",
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontFamily: "'Sora',sans-serif",
                          fontSize: 18,
                          fontWeight: 700,
                          color: T.text,
                          marginBottom: 4,
                        }}
                      >
                        External Wallet
                      </p>
                      <p
                        style={{
                          fontSize: 13,
                          color: T.text2,
                          fontFamily: "'DM Sans',sans-serif",
                        }}
                      >
                        Send on-chain to any address
                      </p>
                    </div>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: "#334155",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4"/><circle cx="17" cy="12" r="1" fill="#fff"/>
                      </svg>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 12px",
                      background: T.blueLight,
                      borderRadius: 10,
                    }}
                  >
                    {Ico.check(T.blue)}
                    <span
                      style={{
                        fontSize: 12,
                        color: T.blue,
                        fontWeight: 600,
                        fontFamily: "'DM Sans',sans-serif",
                      }}
                    >
                      Supports all major networks
                    </span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="fadein">
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: T.blue,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: 4,
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                Step 2 of 4
              </p>
              <h1
                style={{
                  fontFamily: "'Sora',sans-serif",
                  fontSize: 32,
                  fontWeight: 700,
                  color: T.text,
                  letterSpacing: "-0.6px",
                  marginBottom: 8,
                }}
              >
                Select Cryptocurrency
              </h1>
              <p
                style={{
                  fontSize: 15,
                  color: T.text2,
                  marginBottom: 20,
                  lineHeight: 1.6,
                }}
              >
                Choose which cryptocurrency you'd like to send.
              </p>

              <div style={{ maxWidth: 500, marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: T.text2, textTransform: "uppercase", letterSpacing: "0.7px", display: "block", marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>
                  Asset to Send
                </label>

                {/* Dropdown trigger */}
                <div ref={ddRef} style={{ position: "relative" }}>
                  <button
                    onClick={() => setDdOpen(!ddOpen)}
                    className="netsel"
                    style={{
                      width: "100%", padding: "16px", borderRadius: 14,
                      border: `1.5px solid ${selectedAsset ? T.blue : T.border}`,
                      background: selectedAsset ? T.blueLight : T.white,
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      cursor: "pointer", transition: "all 0.2s",
                      fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, color: T.text,
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      {selectedAsset && (
                        <div style={{
                          width: 32, height: 32, borderRadius: "50%", background: selectedAsset.color,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 700, color: "#fff",
                        }}>{selectedAsset.icon}</div>
                      )}
                      <span style={{ color: selectedAsset ? T.text : T.text3 }}>
                        {selectedAsset ? `${selectedAsset.name} (${selectedAsset.symbol})` : "Select an asset to send"}
                      </span>
                    </span>
                    {ddOpen ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.text2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.text2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    )}
                  </button>

                  {ddOpen && (
                    <div className="fadein" style={{
                      position: "absolute", top: "100%", left: 0, right: 0, marginTop: 8,
                      background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 14,
                      zIndex: 1000, maxHeight: 320, overflow: "auto",
                      boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
                    }}>
                      <div style={{ position: "sticky", top: 0, background: T.white, zIndex: 1, padding: "12px 16px", borderBottom: `1px solid ${T.border}` }}>
                        <div style={{ display: "flex", alignItems: "center", background: T.surface, borderRadius: 10, padding: "8px 12px", gap: 6 }}>
                          <Ico.search />
                          <input
                            type="text" placeholder="Search asset..." value={assetQuery}
                            onChange={e => setAssetQuery(e.target.value)}
                            autoFocus
                            style={{ flex: 1, border: "none", outline: "none", fontSize: 14, fontFamily: "'DM Sans',sans-serif", background: "transparent", color: T.text }}
                          />
                        </div>
                      </div>

                      {filteredAssets.map((asset, i) => (
                        <button key={asset.id} className="ddopt"
                          onClick={() => {
                            setSelectedAsset(asset);
                            setDdOpen(false);
                            setAssetQuery("");
                          }}
                          style={{
                            width: "100%", padding: "14px 16px", border: "none",
                            borderBottom: i < filteredAssets.length - 1 ? `1px solid ${T.border}` : "none",
                            background: T.white, display: "flex", alignItems: "center", gap: 12,
                            cursor: "pointer", transition: "all 0.15s", textAlign: "left",
                          }}
                        >
                          <div style={{
                            width: 36, height: 36, borderRadius: "50%", background: asset.color,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0,
                          }}>{asset.icon}</div>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontWeight: 600, color: T.text, fontSize: 14, fontFamily: "'Sora',sans-serif" }}>{asset.name}</p>
                            <p style={{ fontSize: 12, color: T.text2, marginTop: 2 }}>{asset.symbol} · {asset.network}</p>
                          </div>
                        </button>
                      ))}
                      {filteredAssets.length === 0 && (
                        <div style={{ padding: 20, textAlign: "center", color: T.text3, fontSize: 13 }}>No assets found.</div>
                      )}
                    </div>
                  )}
                </div>

                <div style={{ marginTop: 24 }}>
                  <CTA onClick={() => {
                    setStep(3);
                    setNetwork(selectedAsset.networks ? selectedAsset.networks[0].name : "Mainnet");
                  }} disabled={!selectedAsset}>
                    Continue
                  </CTA>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="fadein" style={{ maxWidth: 500, margin: "0 auto" }}>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: T.blue,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: 4,
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                Step 3 of 4
              </p>
              <h1
                style={{
                  fontFamily: "'Sora',sans-serif",
                  fontSize: 32,
                  fontWeight: 700,
                  color: T.text,
                  letterSpacing: "-0.6px",
                  marginBottom: 8,
                }}
              >
                Transfer Details
              </h1>
              <p style={{ fontSize: 15, color: T.text2, marginBottom: 20 }}>
                Enter the amount and recipient details below.
              </p>

              <div
                style={{
                  background: T.white,
                  border: `1px solid ${T.border}`,
                  borderRadius: 20,
                  padding: "24px",
                }}
              >
                {/* Amount Input */}
                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 13,
                      fontWeight: 600,
                      color: T.text,
                      marginBottom: 8,
                    }}
                  >
                    Amount to send
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      border: `1.5px solid ${T.border}`,
                      borderRadius: 12,
                      padding: "12px 16px",
                      background: T.surface,
                    }}
                  >
                    <input
                      type="text"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      style={{
                        flex: 1,
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        fontSize: 20,
                        fontWeight: 700,
                        fontFamily: "'Sora', sans-serif",
                        color: T.text,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: T.text,
                        fontFamily: "'Sora', sans-serif",
                        background: T.white,
                        padding: "4px 10px",
                        borderRadius: 8,
                        border: `1px solid ${T.border}`,
                      }}
                    >
                      {selectedAsset?.symbol}
                    </span>
                  </div>
                  {parseFloat(amount) > availableBalance && (
                    <p style={{ fontSize: 12, color: T.red, marginTop: 8, fontFamily: "'DM Sans',sans-serif" }}>
                      Insufficient {selectedAsset?.symbol} balance. Available: {availableBalance}
                    </p>
                  )}
                </div>

                {sendMethod === "internal" ? (
                  <>
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
                        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: T.text, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                          <input type="radio" checked={lookupMethod === "email"} onChange={() => { setLookupMethod("email"); setLookedUpUser(null); setLookupError(""); }} />
                          Lookup by Email
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: T.text, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                          <input type="radio" checked={lookupMethod === "uuid"} onChange={() => { setLookupMethod("uuid"); setLookedUpUser(null); setLookupError(""); }} />
                          Lookup by User ID
                        </label>
                      </div>
                      
                      {lookupMethod === "email" ? (
                        <input
                          type="email"
                          placeholder="user@example.com"
                          value={recipientEmail}
                          onChange={(e) => {
                            setRecipientEmail(e.target.value);
                            setLookedUpUser(null);
                            setLookupError("");
                          }}
                          onBlur={handleBlur}
                          style={{
                            width: "100%",
                            border: `1.5px solid ${T.border}`,
                            borderRadius: 12,
                            padding: "16px",
                            fontSize: 15,
                            color: T.text,
                            fontFamily: "'DM Sans', sans-serif",
                            outline: "none",
                            transition: "border-color 0.2s",
                          }}
                        />
                      ) : (
                        <input
                          type="text"
                          placeholder="e.g. 4a79b1c7-2e2c-4dbb-84db-..."
                          value={recipientUuid}
                          onChange={(e) => {
                            setRecipientUuid(e.target.value);
                            setLookedUpUser(null);
                            setLookupError("");
                          }}
                          onBlur={handleBlur}
                          style={{
                            width: "100%",
                            border: `1.5px solid ${T.border}`,
                            borderRadius: 12,
                            padding: "16px",
                            fontSize: 15,
                            color: T.text,
                            fontFamily: "'DM Sans', sans-serif",
                            outline: "none",
                            transition: "border-color 0.2s",
                          }}
                        />
                      )}
                      {isLookingUp && (
                        <div style={{ marginTop: 12, fontSize: 13, color: T.blue, display: "flex", alignItems: "center", gap: 8 }}>
                           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 0.6s linear infinite" }}>
                             <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                           </svg>
                           Looking up user...
                        </div>
                      )}
                      {lookupError && (
                        <p style={{ fontSize: 12, color: T.red, marginTop: 8 }}>
                          {lookupError}
                        </p>
                      )}
                      {lookedUpUser && (
                        <div
                          className="fadein"
                          style={{
                            marginTop: 12,
                            padding: "12px 16px",
                            background: T.blueLight,
                            borderRadius: 10,
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              background: T.blue,
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 700,
                              fontFamily: "'Sora', sans-serif",
                              fontSize: 12,
                            }}
                          >
                            {lookedUpUser.fullname
                              ? lookedUpUser.fullname.charAt(0).toUpperCase()
                              : lookedUpUser.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 700, color: T.text }}>
                              {lookedUpUser.fullname || "Cheeseball User"}
                            </p>
                            <p style={{ fontSize: 12, color: T.text2 }}>
                              {lookedUpUser.email}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ marginBottom: 20 }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: 13,
                          fontWeight: 600,
                          color: T.text,
                          marginBottom: 8,
                        }}
                      >
                        Destination Address
                      </label>
                      <input
                        type="text"
                        placeholder="Paste wallet address"
                        value={recipientAddress}
                        onChange={(e) => setRecipientAddress(e.target.value)}
                        style={{
                          width: "100%",
                          border: `1.5px solid ${T.border}`,
                          borderRadius: 12,
                          padding: "16px",
                          fontSize: 14,
                          color: T.text,
                          fontFamily: "'DM Sans', sans-serif",
                          outline: "none",
                        }}
                      />
                    </div>
                    {selectedAsset?.networks && (
                      <div style={{ marginBottom: 24 }}>
                        <label
                          style={{
                            display: "block",
                            fontSize: 13,
                            fontWeight: 600,
                            color: T.text,
                            marginBottom: 8,
                          }}
                        >
                          Network
                        </label>
                        <select
                          value={network}
                          onChange={(e) => setNetwork(e.target.value)}
                          style={{
                            width: "100%",
                            border: `1.5px solid ${T.border}`,
                            borderRadius: 12,
                            padding: "16px",
                            fontSize: 14,
                            color: T.text,
                            fontFamily: "'DM Sans', sans-serif",
                            outline: "none",
                            appearance: "none",
                            background: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%230A0F1E' stroke-width='2' stroke-linecap='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E") no-repeat right 16px center / 16px`,
                          }}
                        >
                          {selectedAsset.networks.map((n) => (
                            <option key={n.name} value={n.name}>
                              {n.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </>
                )}

                <CTA
                  onClick={goToSummary}
                  disabled={
                    !amount ||
                    parseFloat(amount) <= 0 ||
                    parseFloat(amount) > availableBalance ||
                    (sendMethod === "internal" && lookupMethod === "email" && !recipientEmail) ||
                    (sendMethod === "internal" && lookupMethod === "uuid" && !recipientUuid) ||
                    (sendMethod === "external" && !recipientAddress)
                  }
                  style={{ width: "100%" }}
                >
                  Continue
                </CTA>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="fadein" style={{ maxWidth: 500, margin: "0 auto" }}>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: T.blue,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: 4,
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                Step 4 of 4
              </p>
              <h1
                style={{
                  fontFamily: "'Sora',sans-serif",
                  fontSize: 32,
                  fontWeight: 700,
                  color: T.text,
                  letterSpacing: "-0.6px",
                  marginBottom: 8,
                }}
              >
                Confirm Transfer
              </h1>
              <p style={{ fontSize: 15, color: T.text2, marginBottom: 20 }}>
                Please review the details of your transaction before confirming.
              </p>

              <div
                style={{
                  background: T.white,
                  border: `1px solid ${T.border}`,
                  borderRadius: 20,
                  padding: "24px",
                }}
              >
                {/* Send Details */}
                <div style={{ background: T.surface, borderRadius: 12, padding: "16px", marginBottom: 16 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 12, fontFamily: "'DM Sans',sans-serif" }}>You are sending</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: selectedAsset?.color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 700, color: "#fff" }}>
                      {selectedAsset?.icon}
                    </div>
                    <div>
                      <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 20, fontWeight: 700, color: T.text, letterSpacing: "-0.5px" }}>{amount} {selectedAsset?.symbol}</p>
                      <p style={{ fontSize: 12, color: T.text2, marginTop: 2, fontFamily: "'DM Sans',sans-serif" }}>{selectedAsset?.name}</p>
                    </div>
                  </div>
                </div>

                {/* Arrow Divider */}
                <div style={{ display: "flex", justifyContent: "center", marginTop: -8, marginBottom: -8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: T.blueLight, display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${T.white}`, zIndex: 2 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.blue} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
                  </div>
                </div>

                {/* To Details */}
                <div style={{ background: T.blue, borderRadius: 12, padding: "16px", marginTop: 16, marginBottom: 32 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 12, fontFamily: "'DM Sans',sans-serif" }}>Recipient</p>
                  <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: "-0.8px", wordBreak: "break-all" }}>
                    {sendMethod === "internal" ? lookedUpUser?.email : `${recipientAddress.slice(0, 8)}...${recipientAddress.slice(-8)}`}
                  </p>
                  {sendMethod === "internal" && lookedUpUser?.fullname && (
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 4, fontFamily: "'DM Sans',sans-serif" }}>{lookedUpUser.fullname}</p>
                  )}
                </div>

                <div
                  style={{
                    background: T.surface,
                    borderRadius: 14,
                    padding: "16px 20px",
                    marginBottom: 32,
                  }}
                >
                  {[
                    {
                      label: "To",
                      value:
                        sendMethod === "internal"
                          ? lookedUpUser?.email
                          : `${recipientAddress.slice(0, 8)}...${recipientAddress.slice(-8)}`,
                    },
                    {
                      label: "Network",
                      value:
                        sendMethod === "internal" ? "Internal (Cheeseball)" : network,
                    },
                    {
                      label: "Fee",
                      value: sendMethod === "internal" ? "0.00 (Free)" : "Network Fee Applies",
                    },
                  ].map((item, i, arr) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "12px 0",
                        borderBottom:
                          i === arr.length - 1 ? "none" : `1px solid ${T.border}`,
                      }}
                    >
                      <span style={{ fontSize: 13, color: T.text2 }}>
                        {item.label}
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: T.text,
                          fontFamily: "'Sora', sans-serif",
                        }}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                {submitError && (
                  <div
                    style={{
                      padding: "12px 16px",
                      background: T.redLight,
                      borderRadius: 12,
                      color: T.red,
                      fontSize: 13,
                      marginBottom: 24,
                      display: "flex",
                      gap: 8,
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {submitError}
                  </div>
                )}

                <CTA
                  onClick={handleSubmit}
                  disabled={submitting}
                  style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 10 }}
                >
                  {submitting ? (
                    <>
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          border: "2px solid rgba(255,255,255,0.3)",
                          borderTopColor: "#fff",
                          borderRadius: "50%",
                          animation: "spin 0.7s linear infinite",
                        }}
                      />
                      Processing...
                    </>
                  ) : (
                    "Confirm Transfer"
                  )}
                </CTA>
              </div>
            </div>
          )}

          {step === 5 && (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
              <div className="fadein" style={{ maxWidth: 500, width: "100%", background: T.white, borderRadius: 20, padding: "40px 32px", boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}>
                {/* Success Icon */}
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                  <div style={{ width: 80, height: 80, borderRadius: "50%", background: submitResult?.status === "pending_review" ? T.orangeLight : T.greenLight, display: "flex", alignItems: "center", justifyContent: "center", animation: "popIn 0.6s cubic-bezier(0.175,0.885,0.32,1.275)" }}>
                    {submitResult?.status === "pending_review" ? (
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={T.orange} strokeWidth="2.5" strokeLinecap="round">
                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                      </svg>
                    ) : (
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={T.green} strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                </div>

                <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: 24, fontWeight: 700, color: T.text, textAlign: "center", marginBottom: 8, letterSpacing: "-0.5px" }}>
                  {submitResult?.status === "pending_review" ? "Transfer Queued" : "Transfer Successful!"}
                </h1>
                <p style={{ fontSize: 14, color: T.text2, textAlign: "center", marginBottom: 32, fontFamily: "'DM Sans',sans-serif" }}>
                  {submitResult?.status === "pending_review"
                    ? "Your external transfer requires manual admin review due to platform liquidity checks. Your funds have been locked, and you will be notified once it is approved."
                    : `Your assets have been successfully transferred to ${sendMethod === "internal" ? lookedUpUser?.email : `${recipientAddress.slice(0, 8)}...`}.`
                  }
                </p>

                {/* Transfer Details Card */}
                <div style={{ background: T.surface, borderRadius: 16, padding: "16px", marginBottom: 24, display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12, borderBottom: `1px solid ${T.border}` }}>
                    <span style={{ fontSize: 12, color: T.text2, fontFamily: "'DM Sans',sans-serif" }}>Amount Sent</span>
                    <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 700, color: T.text }}>{amount} {selectedAsset?.symbol}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12, borderBottom: `1px solid ${T.border}` }}>
                    <span style={{ fontSize: 12, color: T.text2, fontFamily: "'DM Sans',sans-serif" }}>Recipient</span>
                    <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 700, color: T.text }}>{sendMethod === "internal" ? lookedUpUser?.email : `${recipientAddress.slice(0, 8)}...`}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: T.text2, fontFamily: "'DM Sans',sans-serif" }}>Status</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: submitResult?.status === "pending_review" ? T.orange : T.green }} />
                      <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 700, color: submitResult?.status === "pending_review" ? T.orange : T.greenText, textTransform: "capitalize" }}>
                        {submitResult?.status || "Completed"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Transaction ID */}
                {submitResult?.id && (
                  <div style={{ background: T.blueLight, borderRadius: 12, padding: "12px 14px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ fontSize: 10, color: T.text3, textTransform: "uppercase", letterSpacing: "0.6px", fontFamily: "'DM Sans',sans-serif", marginBottom: 4 }}>Transaction ID</p>
                      <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 700, color: T.blue, wordBreak: "break-all" }}>{submitResult?.id}</p>
                    </div>
                    <button
                      onClick={() => navigator.clipboard.writeText(submitResult?.id)}
                      style={{ padding: "8px 12px", marginLeft: 8, background: T.blue, border: "none", borderRadius: 8, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                      onMouseOver={(e) => (e.currentTarget.style.background = T.blueDark)}
                      onMouseOut={(e) => (e.currentTarget.style.background = T.blue)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    </button>
                  </div>
                )}

                {/* Timestamps */}
                {submitResult?.created_at && (
                  <div style={{ background: T.surface, borderRadius: 12, padding: "12px 14px", marginBottom: 32, fontSize: 12, fontFamily: "'DM Sans',sans-serif", color: T.text2, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Date</span>
                      <span>{new Date(submitResult?.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <CTA onClick={() => { if (onNavigate) onNavigate("dashboard"); else window.location.href = "/currency-change/dashboard"; }} style={{ width: "100%" }}>
                  Close & Return to Dashboard
                </CTA>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

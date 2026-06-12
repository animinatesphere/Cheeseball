import React, { useState, useEffect } from "react";
import { T, Ico, ASSETS, CTA } from "../swap/ConvertFlowShared";
import { lookupUser, sendCrypto } from "../../../../services/api";

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
  
  // User Lookup
  const [lookedUpUser, setLookedUpUser] = useState(null);
  const [lookupError, setLookupError] = useState("");
  const [isLookingUp, setIsLookingUp] = useState(false);

  // Submit
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitResult, setSubmitResult] = useState(null); // success details

  const cryptoAssets = ASSETS.filter((a) => a.symbol !== "NGN");

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
    if (!recipientEmail || recipientEmail.trim().length === 0) return;
    setIsLookingUp(true);
    setLookupError("");
    setLookedUpUser(null);
    try {
      const user = await lookupUser(recipientEmail.trim());
      setLookedUpUser(user);
    } catch (err) {
      setLookupError("User not found with this email");
    } finally {
      setIsLookingUp(false);
    }
  };

  // Trigger lookup when email input blurs
  const handleEmailBlur = () => {
    if (recipientEmail && !lookedUpUser && !lookupError) {
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
        asset_id: selectedAsset.symbol,
        amount: parseFloat(amount),
      };

      if (sendMethod === "internal") {
        payload.recipient_email = lookedUpUser.email;
      } else {
        payload.recipient_address = recipientAddress;
        payload.network = network;
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
        style={{
          minHeight: "100vh",
          background: T.surface,
          padding: "40px 20px",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {step < 5 && (
          <button
            onClick={handleBackStep}
            style={{
              padding: "10px 16px",
              background: "transparent",
              border: `1.5px solid ${T.border}`,
              borderRadius: 10,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 32,
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = T.blueLight)}
            onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke={T.text}
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: 14,
                fontWeight: 600,
                color: T.text,
              }}
            >
              Back
            </span>
          </button>
        )}

        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {step === 1 && (
            <div className="fadein">
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: T.blue,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: 8,
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
                  marginBottom: 12,
                }}
              >
                How would you like to send?
              </h1>
              <p
                style={{
                  fontSize: 15,
                  color: T.text2,
                  marginBottom: 40,
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
                  gap: 20,
                  marginBottom: 32,
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
                  marginBottom: 8,
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
                  marginBottom: 12,
                }}
              >
                Select Cryptocurrency
              </h1>
              <p
                style={{
                  fontSize: 15,
                  color: T.text2,
                  marginBottom: 32,
                  lineHeight: 1.6,
                }}
              >
                Choose which cryptocurrency you'd like to send.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: 16,
                  marginBottom: 32,
                }}
              >
                {cryptoAssets.map((asset) => (
                  <button
                    key={asset.id}
                    onClick={() => handleSelectAsset(asset)}
                    className="method-card popIn"
                    style={{
                      padding: 20,
                      background: selectedAsset?.id === asset.id ? T.blueLight : T.white,
                      border: `2px solid ${selectedAsset?.id === asset.id ? T.blue : T.border}`,
                      borderRadius: 14,
                      cursor: "pointer",
                      transition: "all 0.3s",
                      textAlign: "left",
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        background: asset.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "'Sora',sans-serif",
                        fontSize: 18,
                        fontWeight: 700,
                        color: "#fff",
                        flexShrink: 0,
                      }}
                    >
                      {asset.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontFamily: "'Sora',sans-serif",
                          fontSize: 15,
                          fontWeight: 700,
                          color: T.text,
                        }}
                      >
                        {asset.name}
                      </p>
                      <p
                        style={{
                          fontSize: 12,
                          color: T.text2,
                          marginTop: 2,
                          fontFamily: "'DM Sans',sans-serif",
                        }}
                      >
                        {asset.symbol}
                      </p>
                    </div>
                    {selectedAsset?.id === asset.id && Ico.check(T.blue)}
                  </button>
                ))}
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
                  marginBottom: 8,
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
                  marginBottom: 12,
                }}
              >
                Transfer Details
              </h1>
              <p style={{ fontSize: 15, color: T.text2, marginBottom: 32 }}>
                Enter the amount and recipient details below.
              </p>

              <div
                style={{
                  background: T.white,
                  border: `1px solid ${T.border}`,
                  borderRadius: 20,
                  padding: "32px",
                }}
              >
                {/* Amount Input */}
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
                </div>

                {sendMethod === "internal" ? (
                  <>
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
                        Recipient Email
                      </label>
                      <input
                        type="email"
                        placeholder="user@example.com"
                        value={recipientEmail}
                        onChange={(e) => {
                          setRecipientEmail(e.target.value);
                          setLookedUpUser(null);
                          setLookupError("");
                        }}
                        onBlur={handleEmailBlur}
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
                      {isLookingUp && (
                        <p style={{ fontSize: 12, color: T.blue, marginTop: 8 }}>
                          Looking up user...
                        </p>
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
                    (sendMethod === "internal" && !recipientEmail) ||
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
                  marginBottom: 8,
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
                  marginBottom: 12,
                }}
              >
                Confirm Transfer
              </h1>
              <p style={{ fontSize: 15, color: T.text2, marginBottom: 32 }}>
                Please review the details of your transaction before confirming.
              </p>

              <div
                style={{
                  background: T.white,
                  border: `1px solid ${T.border}`,
                  borderRadius: 20,
                  padding: "32px",
                }}
              >
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                  <p style={{ fontSize: 13, color: T.text2, marginBottom: 8 }}>
                    You are sending
                  </p>
                  <p
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      fontSize: 36,
                      fontWeight: 700,
                      color: T.text,
                      lineHeight: 1,
                    }}
                  >
                    {amount} {selectedAsset?.symbol}
                  </p>
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
            <div className="fadein" style={{ maxWidth: 500, margin: "0 auto", textAlign: "center", padding: "40px 20px" }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: submitResult?.status === "pending_review" ? T.orange : T.green,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                  animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards",
                }}
              >
                {submitResult?.status === "pending_review" ? (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                ) : (
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <h1
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 28,
                  fontWeight: 700,
                  color: T.text,
                  marginBottom: 16,
                }}
              >
                {submitResult?.status === "pending_review" ? "Transfer Queued" : "Transfer Successful"}
              </h1>
              <p style={{ fontSize: 15, color: T.text2, lineHeight: 1.6, marginBottom: 32 }}>
                {submitResult?.status === "pending_review"
                  ? "Your external transfer requires manual admin review due to platform liquidity checks. Your funds have been locked, and you will be notified once it is approved."
                  : `Successfully sent ${amount} ${selectedAsset?.symbol} to ${sendMethod === "internal" ? lookedUpUser?.email : recipientAddress}.`
                }
              </p>

              <CTA
                onClick={() => {
                  if (onNavigate) onNavigate("dashboard");
                  else window.location.href = "/currency-change/dashboard";
                }}
                style={{ width: "100%" }}
              >
                Back to Dashboard
              </CTA>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

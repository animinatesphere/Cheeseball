import React, { useState, useRef, useEffect } from "react";
import { T, Ico, ASSETS, CTA } from "../swap/ConvertFlowShared";
import { createDeposit, fundNGNWallet } from "../../../../services/api";

/* ─── styles ─────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; overflow-x: hidden; }

  .ctabtn:hover  { background: ${T.blueDark} !important; }
  .ctabtn:active { transform: scale(0.985); }
  .ghostbtn:hover { background: ${T.blueLight} !important; color: ${T.blue} !important; }
  .method-card:hover { border-color: ${T.blue} !important; box-shadow: 0 4px 12px rgba(26,111,255,0.1) !important; }
  .ddopt:hover { background: ${T.surface} !important; }
  .netsel:hover { border-color: ${T.blue} !important; }

  @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
  @keyframes popIn  { 0% { transform:scale(0.95); opacity:0; } 100% { transform:scale(1); opacity:1; } }
  .fadein { animation: fadeUp 0.25s ease forwards; }
  .popIn  { animation: popIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275) forwards; }

  .addr-box {
    font-family: 'DM Mono', 'Courier New', monospace;
    word-break: break-all;
    background: ${T.surface};
    border: 1.5px solid ${T.border};
    border-radius: 12px;
    padding: 16px;
    font-size: 13px;
    color: ${T.text};
    line-height: 1.6;
  }
  .copy-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 9px 14px; border-radius: 10px;
    border: 1.5px solid ${T.border};
    background: ${T.white};
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 600; color: ${T.text2};
    cursor: pointer; transition: all 0.2s;
  }
  .copy-btn:hover { background: ${T.blueLight}; color: ${T.blue}; border-color: ${T.blue}; }
`;

function DepositBreadcrumbs({ screen, onNavigate, onClose }) {
  let steps = [{ id: "choose", label: "Deposit" }];
  
  if (screen.startsWith("crypto")) {
    if (screen === "crypto-select" || screen === "crypto-address" || screen === "crypto-status") {
      steps.push({ id: "crypto-select", label: "Receive Crypto" });
    }
    if (screen === "crypto-address" || screen === "crypto-status") {
      steps.push({ id: "crypto-address", label: "Address" });
    }
    if (screen === "crypto-status") {
      steps.push({ id: "crypto-status", label: "Status" });
    }
  } else if (screen.startsWith("ngn")) {
    if (screen === "ngn-amount" || screen === "ngn-details") {
      steps.push({ id: "ngn-amount", label: "Deposit Naira" });
    }
    if (screen === "ngn-details") {
      steps.push({ id: "ngn-details", label: "Details" });
    }
  }

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

      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1;
        const clickable = !isLast && screen !== "crypto-status" && screen !== "ngn-details";

        return (
          <React.Fragment key={step.id}>
            <span className="breadcrumb-item" style={{ color: T.text3, fontSize: 12, userSelect: "none" }}>›</span>
            <span
              onClick={() => clickable && onNavigate(step.id)}
              className="breadcrumb-item"
              style={{
                fontSize: 13,
                fontWeight: isLast ? 600 : 500,
                color: isLast ? T.blue : T.text2,
                cursor: clickable ? "pointer" : "default",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {step.label}
            </span>
          </React.Fragment>
        );
      })}
    </nav>
  );
}

/* ─── label ────────────────────────────────────────────────── */
const Label = ({ children }) => (
  <p style={{ fontSize: 11, fontWeight: 600, color: T.blue, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>
    {children}
  </p>
);

/* ─── copy helper ──────────────────────────────────────────── */
function CopyBtn({ text, label = "Copy" }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button className="copy-btn" onClick={copy}>
      <Ico.copy />
      {copied ? "Copied!" : label}
    </button>
  );
}

/* ─── Step 0 – choose Crypto vs NGN ─────────────────────── */
function StepChoose({ onChoose }) {
  return (
    <div className="fadein">
      <Label>Deposit</Label>
      <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: 30, fontWeight: 700, color: T.text, letterSpacing: "-0.6px", marginBottom: 10 }}>
        How would you like to deposit?
      </h1>
      <p style={{ fontSize: 15, color: T.text2, marginBottom: 40, lineHeight: 1.6 }}>
        Receive cryptocurrency directly to your wallet, or fund your NGN balance via bank transfer.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, maxWidth: 640 }}>
        {/* Crypto */}
        <button onClick={() => onChoose("crypto")} className="method-card"
          style={{ padding: 28, background: T.white, border: `2px solid ${T.border}`, borderRadius: 16, cursor: "pointer", transition: "all 0.3s", textAlign: "left", display: "flex", flexDirection: "column", gap: 16 }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 700, color: T.text, marginBottom: 4 }}>Receive Crypto</p>
              <p style={{ fontSize: 13, color: T.text2 }}>Generate a wallet deposit address</p>
            </div>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "#9945FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: "#fff", flexShrink: 0 }}>◎</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: T.blueLight, borderRadius: 10 }}>
            {Ico.check(T.blue)}
            <span style={{ fontSize: 12, color: T.blue, fontWeight: 600 }}>20+ assets supported</span>
          </div>
        </button>

        {/* NGN */}
        <button onClick={() => onChoose("ngn")} className="method-card"
          style={{ padding: 28, background: T.white, border: `2px solid ${T.border}`, borderRadius: 16, cursor: "pointer", transition: "all 0.3s", textAlign: "left", display: "flex", flexDirection: "column", gap: 16 }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 700, color: T.text, marginBottom: 4 }}>Deposit Naira</p>
              <p style={{ fontSize: 13, color: T.text2 }}>Fund wallet via bank transfer with paystack</p>
            </div>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: T.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: "#fff", fontWeight: 700, flexShrink: 0 }}>₦</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: T.greenLight, borderRadius: 10 }}>
            {Ico.check(T.green)}
            <span style={{ fontSize: 12, color: T.greenText, fontWeight: 600 }}>Powered by Paystack</span>
          </div>
        </button>
      </div>
    </div>
  );
}

/* ─── Step 1 – Select crypto asset ──────────────────────── */
function StepSelectAsset({ onContinue, loading }) {
  const [selected, setSelected] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [ddOpen, setDdOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ddRef = useRef(null);

  const cryptoAssets = ASSETS.filter(a => a.symbol !== "NGN");
  const filtered = cryptoAssets.filter(a =>
    a.name.toLowerCase().includes(query.toLowerCase()) ||
    a.symbol.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const h = e => { if (ddRef.current && !ddRef.current.contains(e.target)) setDdOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div className="fadein">
      <Label>Receive Crypto</Label>
      <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: 30, fontWeight: 700, color: T.text, letterSpacing: "-0.6px", marginBottom: 10 }}>
        Select asset to receive
      </h1>
      <p style={{ fontSize: 15, color: T.text2, marginBottom: 36, lineHeight: 1.6 }}>
        Choose which cryptocurrency you'd like to deposit. We'll generate a wallet address for you.
      </p>

      <div style={{ maxWidth: 500 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: T.text2, textTransform: "uppercase", letterSpacing: "0.7px", display: "block", marginBottom: 10, fontFamily: "'DM Sans',sans-serif" }}>
          Asset to Deposit
        </label>

        {/* Dropdown trigger */}
        <div ref={ddRef} style={{ position: "relative" }}>
          <button
            onClick={() => setDdOpen(!ddOpen)}
            className="netsel"
            style={{
              width: "100%", padding: "16px", borderRadius: 14,
              border: `1.5px solid ${selected ? T.blue : T.border}`,
              background: selected ? T.blueLight : T.white,
              display: "flex", alignItems: "center", justifyContent: "space-between",
              cursor: "pointer", transition: "all 0.2s",
              fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, color: T.text,
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {selected && (
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", background: selected.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 700, color: "#fff",
                }}>{selected.icon}</div>
              )}
              <span style={{ color: selected ? T.text : T.text3, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                {selected ? `${selected.name} (${selected.symbol})` : "Select an asset to deposit"}
                {selected && (
                  <span style={{ fontSize: 11, color: T.text2, marginTop: 2, background: T.white, padding: "2px 6px", borderRadius: 4, border: `1px solid ${T.border}` }}>
                    Network: {selected.networks?.find(n => n.id === (selectedNetwork || selected.networks[0].id))?.label || selectedNetwork || selected.network}
                  </span>
                )}
              </span>
            </span>
            <Ico.chevDn />
          </button>

          {ddOpen && (
            <div className="fadein" style={{
              position: "absolute", top: "100%", left: 0, right: 0, marginTop: 8,
              background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 14,
              zIndex: 1000, maxHeight: 320, overflow: "auto",
              boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
            }}>
              {/* Search */}
              <div style={{ position: "sticky", top: 0, background: T.white, zIndex: 1, padding: "12px 16px", borderBottom: `1px solid ${T.border}` }}>
                <div style={{ display: "flex", alignItems: "center", background: T.surface, borderRadius: 10, padding: "8px 12px", gap: 6 }}>
                  <Ico.search />
                  <input
                    type="text" placeholder="Search asset..." value={query}
                    onChange={e => setQuery(e.target.value)}
                    autoFocus
                    style={{ flex: 1, border: "none", outline: "none", fontSize: 14, fontFamily: "'DM Sans',sans-serif", background: "transparent", color: T.text }}
                  />
                </div>
              </div>

              {filtered.map((asset, i) => (
                <button key={asset.id} className="ddopt"
                  onClick={() => { setSelected(asset); setSelectedNetwork(asset.networks ? asset.networks[0].id : null); setDdOpen(false); setQuery(""); }}
                  style={{
                    width: "100%", padding: "14px 16px", border: "none",
                    borderBottom: i < filtered.length - 1 ? `1px solid ${T.border}` : "none",
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
              {filtered.length === 0 && (
                <div style={{ padding: 20, textAlign: "center", color: T.text3, fontSize: 13 }}>No assets found.</div>
              )}
            </div>
          )}
        </div>

        {/* Network selector — only shown for multi-network assets */}
        {selected?.networks && selected.networks.length > 1 && (
          <div className="fadein" style={{ marginTop: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10, fontFamily: "'DM Sans',sans-serif" }}>
              Select Network
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {selected.networks.map((net) => {
                const active = (selectedNetwork || selected.networks[0].id) === net.id;
                const isCheapest = net.badge === "Cheapest";
                return (
                  <button
                    key={net.id}
                    onClick={() => setSelectedNetwork(net.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "14px 18px",
                      borderRadius: 12,
                      border: `1.5px solid ${active ? T.blue : T.border}`,
                      background: active ? `${T.blue}08` : T.white,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      textAlign: "left",
                      width: "100%",
                      boxShadow: active ? `0 4px 12px ${T.blue}0a` : "none",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      {/* Radio Indicator */}
                      <div style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        border: `2px solid ${active ? T.blue : T.text3}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s ease",
                        background: active ? T.white : "transparent",
                      }}>
                        {active && (
                          <div style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: T.blue,
                          }} />
                        )}
                      </div>
                      
                      <span style={{
                        fontFamily: "'Sora',sans-serif",
                        fontSize: 13,
                        fontWeight: 700,
                        color: active ? T.blue : T.text,
                        transition: "color 0.2s ease",
                      }}>
                        {net.label}
                      </span>
                    </div>

                    {isCheapest && (
                      <span style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: T.greenText || T.green,
                        background: T.greenLight,
                        borderRadius: 6,
                        padding: "3px 8px",
                        letterSpacing: "0.5px",
                        textTransform: "uppercase",
                        fontFamily: "'DM Sans',sans-serif",
                      }}>
                        Cheapest
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Continue button – same width as dropdown */}
        <div style={{ marginTop: 24 }}>
          <CTA onClick={() => onContinue(selected, selectedNetwork)} disabled={!selected || loading} loading={loading}>
            Generate Deposit Address
          </CTA>
        </div>
      </div>
    </div>
  );
}

/* ─── Step 2 – Show crypto deposit address ───────────────── */
function StepCryptoAddress({ depositData, asset, onClose }) {
  const [platformAddress, setPlatformAddress] = useState(depositData?.platform_address || "");
  const { reference_code, network, memo_supported } = depositData;

  useEffect(() => {
    if (platformAddress || !depositData?.id) return;
    
    const interval = setInterval(async () => {
      try {
        const { getDepositStatus } = await import('../../../../services/api');
        const res = await getDepositStatus(depositData.id);
        if (res.platform_address) {
          setPlatformAddress(res.platform_address);
          clearInterval(interval);
        }
      } catch (e) {
        // ignore polling errors
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [platformAddress, depositData?.id]);

  const displayAddress = platformAddress || "Generating address...";

  return (
    <div className="fadein">
      <Label>Receive Crypto</Label>
      <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: 30, fontWeight: 700, color: T.text, letterSpacing: "-0.6px", marginBottom: 10 }}>
        Your {asset.symbol} deposit address
      </h1>
      <p style={{ fontSize: 15, color: T.text2, marginBottom: 32, lineHeight: 1.6 }}>
        Send <strong>{asset.name}</strong> to the address below. Your wallet will be credited automatically once the transaction is confirmed on-chain.
      </p>

      <div style={{ maxWidth: 560 }}>

        {/* Asset info pill */}
        <div style={{
          display: "flex", alignItems: "center", gap: 14, padding: "10px 16px",
          background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 14, marginBottom: 16,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%", background: asset.color,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 700, color: "#fff",
          }}>{asset.icon}</div>
          <div>
            <p style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, color: T.text, fontSize: 14 }}>{asset.name}</p>
            <p style={{ fontSize: 11, color: T.text2, marginTop: 2 }}>Network: <strong>{network || asset.network}</strong></p>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, background: platformAddress ? T.greenLight : T.orangeLight, borderRadius: 8, padding: "4px 10px" }}>
            {platformAddress ? Ico.check(T.green) : null}
            <span style={{ fontSize: 11, fontWeight: 600, color: platformAddress ? T.greenText : T.orange }}>{platformAddress ? "Active" : "Generating"}</span>
          </div>
        </div>

        {/* Wallet Address */}
        <label style={{ fontSize: 11, fontWeight: 600, color: T.text2, textTransform: "uppercase", letterSpacing: "0.7px", display: "block", marginBottom: 6 }}>
          Deposit Address
        </label>
        <div className="addr-box" style={{ marginBottom: 10, padding: "12px", fontSize: 12 }}>{displayAddress}</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <CopyBtn text={displayAddress} label="Copy Address" />
        </div>

        {/* Reference / Memo */}
        <label style={{ fontSize: 11, fontWeight: 600, color: T.text2, textTransform: "uppercase", letterSpacing: "0.7px", display: "block", marginBottom: 6 }}>
          {memo_supported ? "Reference / Memo (Required)" : "Reference Code"}
        </label>
        <div className="addr-box" style={{ marginBottom: 10, padding: "10px 12px", fontFamily: "'Sora',sans-serif", fontSize: 16, fontWeight: 700, letterSpacing: 2 }}>
          {reference_code}
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <CopyBtn text={reference_code} label="Copy Reference" />
        </div>

        {/* Memo warning */}
        {memo_supported && (
          <div style={{
            display: "flex", alignItems: "flex-start", gap: 10,
            background: "#FFF7ED", border: "1px solid #FDE68A",
            borderRadius: 12, padding: "10px 14px", marginBottom: 16,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <div>
              <p style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 12, color: "#92400E", marginBottom: 2 }}>
                Memo / Tag required
              </p>
              <p style={{ fontSize: 11, color: "#92400E", lineHeight: 1.5 }}>
                You <strong>must</strong> include the reference code as the memo/destination tag when sending.
              </p>
            </div>
          </div>
        )}

        {/* Info box */}
        <div style={{
          display: "flex", alignItems: "flex-start", gap: 12,
          background: T.blueLight, borderRadius: 12, padding: "10px 14px", marginBottom: 16,
        }}>
          <Ico.info />
          <span style={{ fontSize: 12, color: T.text2, lineHeight: 1.5 }}>
            Only send <strong>{asset.symbol}</strong> on the <strong>{network || asset.network}</strong> network.
          </span>
        </div>

        {/* Done button */}
        <div style={{ marginTop: 16 }}>
          <CTA onClick={() => onClose(depositData)}>I have paid</CTA>
        </div>
      </div>
    </div>
  );
}

/* ─── Step 3 – Crypto Deposit Status ─────────────────────── */
function StepCryptoStatus({ depositData, asset, onBack, onNavigate }) {
  const [status, setStatus] = useState(depositData?.status || "pending");
  
  useEffect(() => {
    if (status === "completed" || !depositData?.id) return;
    const interval = setInterval(async () => {
      try {
        const { getDepositStatus } = await import('../../../../services/api');
        const res = await getDepositStatus(depositData.id);
        if (res.status) {
          setStatus(res.status);
          if (res.status === "completed" || res.status === "failed") {
            clearInterval(interval);
          }
        }
      } catch (e) {}
    }, 5000);
    return () => clearInterval(interval);
  }, [status, depositData?.id]);

  const fmtDate = (d) => d.toLocaleDateString("en-NG",{day:"numeric",month:"short",year:"numeric"});
  const fmtTime = (d) => d.toLocaleTimeString("en-NG",{hour:"2-digit",minute:"2-digit"});
  const submittedAt = new Date(depositData.created_at || Date.now());

  const steps = [
    { label: "Deposit initiated", done: true },
    { label: "Payment sent", done: status === "completed" },
    { label: "Blockchain confirming", active: status === "pending" },
    { label: "Wallet credited", done: status === "completed" },
  ];

  return (
    <div className="sellgrid fadein" style={{ display: "grid", gridTemplateColumns: "1fr 360px", minHeight: "100vh", fontFamily: "'DM Sans',sans-serif", background: T.white, color: T.text, overflowX: "hidden", maxWidth: "100vw" }}>

      {/* ── LEFT PANEL ── */}
      <div style={{ padding: "28px 36px 28px", borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", overflow: "hidden" }} className="step-content">

        <DepositBreadcrumbs screen="crypto-status" onNavigate={(s) => {}} onClose={onNavigate} />

        {/* Status icon + headline */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <div style={{ position: "relative", width: 48, height: 48, flexShrink: 0 }}>
            {status === "completed" ? (
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: T.green, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 14px rgba(0,196,140,0.28)" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
            ) : (
              <>
                <div className="ripple" style={{ position: "absolute", inset: -5, borderRadius: "50%", border: `2px solid rgba(245,158,11,0.35)` }} />
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "linear-gradient(135deg,#F59E0B 0%,#D97706 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 14px rgba(245,158,11,0.28), inset 0 1px 0 rgba(255,255,255,0.2)" }}>
                  {Ico.clock("#fff")}
                </div>
              </>
            )}
          </div>
          <div>
            <p style={{ fontSize: 10, fontWeight: 600, color: T.blue, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 2, fontFamily: "'DM Sans',sans-serif" }}>Deposit Status</p>
            <h1 className="responsive-title" style={{ fontFamily: "'Sora',sans-serif", fontSize: 22, fontWeight: 700, color: T.text, letterSpacing: "-0.5px", lineHeight: 1.15 }}>
              {status === "completed" ? "Deposit Successful" : "Deposit Processing"}
            </h1>
          </div>
        </div>

        {/* Amount highlight */}
        <div style={{ background: status === "completed" ? T.greenLight : "linear-gradient(135deg,#FFFBEB 0%,#FEF3C7 100%)", border: `1.5px solid ${status === "completed" ? "#A7F3D0" : "#FDE68A"}`, borderRadius: 14, padding: "14px 18px", marginBottom: 12 }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: status === "completed" ? T.greenText : "#92400E", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4, fontFamily: "'DM Sans',sans-serif" }}>You are depositing</p>
          <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 28, fontWeight: 700, color: status === "completed" ? T.greenText : "#92400E", letterSpacing: "-1px", lineHeight: 1 }}>{asset.symbol}</p>
          <p style={{ fontSize: 12, color: status === "completed" ? T.greenText : "#B45309", marginTop: 5, lineHeight: 1.4 }}>
            {status === "completed" ? "Your crypto wallet has been credited successfully." : "Confirming on the blockchain — your wallet will be credited shortly."}
          </p>
        </div>

        {/* Transaction detail card */}
        <div style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 14, overflow: "hidden", marginBottom: 12 }}>
          {[
            { label: "Reference", value: depositData.reference_code, mono: true },
            { label: "Date", value: `${fmtDate(submittedAt)} • ${fmtTime(submittedAt)}`, mono: true },
            { label: "Asset to deposit", value: `${asset.name} (${asset.symbol})`, mono: true },
          ].map(({ label, value, mono }, i, arr) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 16px", borderBottom: i < arr.length - 1 ? `1px solid ${T.border}` : "none" }}>
              <span style={{ fontSize: 12, color: T.text2, fontFamily: "'DM Sans',sans-serif" }}>{label}</span>
              <span style={{ fontFamily: mono ? "'Sora',sans-serif" : "'DM Sans',sans-serif", fontSize: 12, fontWeight: 700, color: T.text }}>{value}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 16px" }}>
            <span style={{ fontSize: 12, color: T.text2, fontFamily: "'DM Sans',sans-serif" }}>Status</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: status === "completed" ? T.greenLight : T.orangeLight, border: `1px solid ${status === "completed" ? "#A7F3D0" : "#FDE68A"}`, padding: "3px 10px", borderRadius: 20 }}>
              {status !== "completed" && <div className="pulsing" style={{ width: 5, height: 5, borderRadius: "50%", background: T.orange, flexShrink: 0 }} />}
              <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 11, fontWeight: 700, color: status === "completed" ? T.greenText : "#92400E", textTransform: "capitalize" }}>{status}</span>
            </div>
          </div>
        </div>

        {/* Step progress tracker */}
        <div style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 14, padding: "12px 16px", marginBottom: 16 }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10, fontFamily: "'DM Sans',sans-serif" }}>Progress</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "stretch", gap: 10 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%",
                    background: s.done ? T.green : s.active ? "linear-gradient(135deg,#F59E0B,#D97706)" : T.surface,
                    border: s.done ? `2px solid ${T.green}` : s.active ? "2px solid #D97706" : `2px solid ${T.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: s.active ? "0 3px 8px rgba(245,158,11,0.3)" : "none",
                    transition: "all 0.3s",
                    flexShrink: 0,
                  }}>
                    {s.done
                      ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      : s.active
                        ? <div className="pulsing" style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />
                        : <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.border }} />
                    }
                  </div>
                  {i < steps.length - 1 && (
                    <div style={{ width: 2, flex: 1, minHeight: 14, background: s.done ? T.green : T.border, borderRadius: 2 }} />
                  )}
                </div>
                <div style={{ paddingBottom: i < steps.length - 1 ? 16 : 0, paddingTop: 3, flex: 1 }}>
                  <p style={{ fontSize: 12, fontWeight: s.active ? 700 : s.done ? 600 : 500, color: s.active ? "#92400E" : s.done ? T.greenText : T.text3, fontFamily: s.active || s.done ? "'Sora',sans-serif" : "'DM Sans',sans-serif", margin: 0 }}>
                    {s.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="actions-wrap" style={{ display: "flex", gap: 10, marginTop: "auto" }}>
          <button onClick={() => onNavigate && onNavigate("history")} className="ghostbtn" style={{ flex: 1, padding: "13px 16px", fontSize: 13, borderRadius: 14, border: `1.5px solid ${T.border}`, background: T.white, color: T.text2, fontWeight: 600, fontFamily: "'DM Sans',sans-serif", cursor: "pointer", transition: "all 0.2s" }}>View Transactions</button>
          <CTA onClick={() => onNavigate && onNavigate("dashboard")} style={{ flex: 1, padding: "13px 16px", fontSize: 13, boxShadow: "0 6px 16px rgba(26,111,255,0.25)" }}>Return to Dashboard</CTA>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{ padding: "28px 20px 24px", background: T.surface, display: "flex", flexDirection: "column", overflow: "hidden" }} className="rightpanel">
        <p style={{ fontSize: 10, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 12, fontFamily: "'DM Sans',sans-serif" }}>Deposit Details</p>

        {/* Asset summary */}
        <div style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 14, overflow: "hidden", marginBottom: 10 }}>
          <div style={{ padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: asset.color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{asset.icon}</div>
              <div>
                <p style={{ fontSize: 11, color: T.text3, marginBottom: 2, fontFamily: "'DM Sans',sans-serif" }}>Receiving to</p>
                <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 700, color: T.text }}>Cheeseball Wallet</p>
              </div>
            </div>
          </div>

          <div style={{ borderTop: `1.5px dashed ${T.border}`, margin: "0 16px" }} />
          <div style={{ padding: "8px 16px" }}>
            {[
              ["Asset", `${asset.name} (${asset.symbol})`],
              ["Network", asset.network],
              ["Deposit Address", depositData.platform_address ? depositData.platform_address.slice(0, 10) + "..." : "Awaiting..."],
            ].map(([label, val], i, arr) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < arr.length - 1 ? `1px solid ${T.border}` : "none" }}>
                <span style={{ fontSize: 12, color: T.text2, fontFamily: "'DM Sans',sans-serif" }}>{label}</span>
                <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 12, fontWeight: 700, color: T.text }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info note */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, background: T.blueLight, border: `1px solid ${T.border}`, borderRadius: 12, padding: "10px 12px", marginBottom: 10 }}>
          <Ico.info />
          <p style={{ fontSize: 11, color: T.text2, lineHeight: 1.5, fontFamily: "'DM Sans',sans-serif" }}>
            Cryptocurrency deposits require multiple block confirmations before the balance is securely credited to your account. This process is automatic.
          </p>
        </div>

      </div>
    </div>
  );
}

/* ─── NGN – Enter amount ─────────────────────────────────── */
function StepNGNAmount({ onContinue, loading }) {
  const [amount, setAmount] = useState("");
  const numericAmount = parseFloat(String(amount).replace(/,/g, "")) || 0;
  const isValid = numericAmount >= 1000;

  const fmt = val => {
    const n = String(val).replace(/[^0-9]/g, "");
    return n ? Number(n).toLocaleString() : "";
  };

  return (
    <div className="fadein">
      <Label>Deposit Naira</Label>
      <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: 30, fontWeight: 700, color: T.text, letterSpacing: "-0.6px", marginBottom: 10 }}>
        How much would you like to deposit?
      </h1>
      <p style={{ fontSize: 15, color: T.text2, marginBottom: 36, lineHeight: 1.6 }}>
        Enter the amount of Nigerian Naira you'd like to add to your wallet. You'll be redirected to Paystack to complete the payment.
      </p>

      <div style={{ maxWidth: 500 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: T.text2, textTransform: "uppercase", letterSpacing: "0.7px", display: "block", marginBottom: 10 }}>
          Amount (NGN)
        </label>

        <div style={{
          display: "flex", alignItems: "center",
          border: `1.5px solid ${numericAmount > 0 ? T.blue : T.border}`,
          borderRadius: 14, background: numericAmount > 0 ? T.blueLight : T.white,
          overflow: "hidden", transition: "all 0.2s",
        }}>
          <span style={{
            padding: "0 16px", fontFamily: "'Sora',sans-serif", fontSize: 20, fontWeight: 700,
            color: numericAmount > 0 ? T.blue : T.text3, borderRight: `1px solid ${T.border}`,
          }}>₦</span>
          <input
            type="text"
            inputMode="numeric"
            placeholder="0"
            value={amount}
            onChange={e => setAmount(fmt(e.target.value))}
            style={{
              flex: 1, padding: "18px 16px", border: "none", outline: "none",
              fontFamily: "'Sora',sans-serif", fontSize: 22, fontWeight: 700,
              color: T.text, background: "transparent", width: "100%",
            }}
          />
        </div>
        {numericAmount > 0 && numericAmount < 1000 && (
          <p style={{ fontSize: 12, color: T.red, marginTop: 8, fontFamily: "'DM Sans',sans-serif" }}>
            Minimum deposit amount is ₦1000.
          </p>
        )}

        <div style={{ marginTop: 24 }}>
          <CTA onClick={() => onContinue(numericAmount)} disabled={!isValid || loading} loading={loading}>
            Continue to Paystack
          </CTA>
        </div>
      </div>
    </div>
  );
}

/* ─── NGN Step 2 – Bank transfer details ────────────────── */
function StepNGNDetails({ fundingData, amount, onClose }) {
  const { authorization_url, account_number, bank_name, account_name, reference, expires_at } = fundingData;

  // If Paystack returns a redirect URL, open it
  useEffect(() => {
    if (authorization_url) {
      window.open(authorization_url, "_blank");
    }
  }, [authorization_url]);

  return (
    <div className="fadein">
      <Label>Deposit Naira</Label>
      <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: 30, fontWeight: 700, color: T.text, letterSpacing: "-0.6px", marginBottom: 10 }}>
        {account_number ? "Transfer to this account" : "Complete payment on Paystack"}
      </h1>
      <p style={{ fontSize: 15, color: T.text2, marginBottom: 32, lineHeight: 1.6 }}>
        {account_number
          ? "Make a bank transfer to the account below. Your wallet will be credited automatically once payment is confirmed."
          : "A new tab has been opened for you to complete the Paystack payment. Once done, your wallet will be credited automatically."}
      </p>

      <div style={{ maxWidth: 560 }}>

        {/* Amount */}
        <div style={{
          background: T.blue, borderRadius: 16, padding: "22px 24px", marginBottom: 20,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginBottom: 6, fontFamily: "'DM Sans',sans-serif" }}>Amount to Transfer</p>
            <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 28, fontWeight: 700, color: "#fff" }}>
              ₦{Number(amount).toLocaleString()}
            </p>
          </div>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: "#fff" }}>₦</div>
        </div>

        {/* Bank details (if virtual account) */}
        {account_number && (
          <div style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 16, overflow: "hidden", marginBottom: 20 }}>
            {[
              ["Bank Name", bank_name],
              ["Account Number", account_number],
              ["Account Name", account_name],
            ].map(([label, value], i, arr) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "16px 20px",
                borderBottom: i < arr.length - 1 ? `1px solid ${T.border}` : "none",
              }}>
                <span style={{ fontSize: 13, color: T.text2, fontFamily: "'DM Sans',sans-serif" }}>{label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 700, color: T.text }}>{value || "—"}</span>
                  {value && <CopyBtn text={value} />}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reference */}
        {reference && (
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: T.text2, textTransform: "uppercase", letterSpacing: "0.7px", display: "block", marginBottom: 10 }}>
              Payment Reference
            </label>
            <div className="addr-box" style={{ marginBottom: 8, fontFamily: "'Sora',sans-serif", fontSize: 16, fontWeight: 700 }}>
              {reference}
            </div>
            <CopyBtn text={reference} label="Copy Reference" />
          </div>
        )}

        {/* Expiry */}
        {expires_at && (
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "#FFF7ED", border: "1px solid #FDE68A",
            borderRadius: 12, padding: "12px 16px", marginBottom: 20,
          }}>
            {Ico.clock("#D97706")}
            <span style={{ fontSize: 13, color: "#92400E", lineHeight: 1.5 }}>
              This account expires at <strong>{new Date(expires_at).toLocaleTimeString()}</strong>. Please complete the transfer before it expires.
            </span>
          </div>
        )}

        {/* Paystack button if no virtual account */}
        {authorization_url && !account_number && (
          <a href={authorization_url} target="_blank" rel="noreferrer"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              width: "100%", padding: "17px", borderRadius: 14, background: T.blue,
              color: "#fff", fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 700,
              textDecoration: "none", marginBottom: 12, transition: "all 0.2s",
            }}
          >
            Open Paystack
          </a>
        )}

        {/* Info */}
        <div style={{
          display: "flex", alignItems: "flex-start", gap: 12,
          background: T.blueLight, borderRadius: 12, padding: "14px 16px", marginBottom: 24,
        }}>
          <Ico.info />
          <span style={{ fontSize: 13, color: T.text2, lineHeight: 1.6 }}>
            Your wallet balance will update automatically once your transfer is confirmed. This usually takes a few minutes.
          </span>
        </div>

        <CTA onClick={onClose}>Done</CTA>
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────── */
export default function DepositFlow({ onBack, onNavigate, onClose }) {
  // "choose" | "crypto-select" | "crypto-address" | "ngn-amount" | "ngn-details"
  const [screen, setScreen] = useState("choose");
  const [depositData, setDepositData] = useState(null);
  const [fundingData, setFundingData] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [ngnAmount, setNgnAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClose = onBack || onClose;
  const navigateFn = onNavigate || handleClose;

  const handleGoBack = () => {
    setError(null);
    if (screen === "crypto-select" || screen === "ngn-amount") setScreen("choose");
    else if (screen === "crypto-address") setScreen("crypto-select");
    else if (screen === "crypto-status") setScreen("crypto-address");
    else if (screen === "ngn-details") setScreen("ngn-amount");
    else handleClose?.();
  };

  const handleCryptoAssetContinue = async (asset, network) => {
    setLoading(true);
    setError(null);
    setSelectedAsset(asset);
    try {
      const data = await createDeposit(asset.symbol, 0, network || asset.network);
      if (data?.id) {
        setDepositData(data);
        setScreen("crypto-address");
      } else {
        setError(data?.detail || "This asset is temporarily unavailable for deposits.");
      }
    } catch (err) {
      setError("Failed to generate address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNGNContinue = async (amount) => {
    setLoading(true);
    setError(null);
    setNgnAmount(amount);
    try {
      const data = await fundNGNWallet(amount);
      if (data?.id) {
        setFundingData(data);
        setScreen("ngn-details");
      } else {
        setError(data?.detail || "Could not initiate payment. Please try again.");
      }
    } catch (err) {
      setError("Failed to connect to Paystack. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{CSS}</style>
      {screen === "crypto-status" && depositData ? (
        <StepCryptoStatus depositData={depositData} asset={selectedAsset} onBack={() => setScreen("crypto-address")} onNavigate={navigateFn} />
      ) : (
        <div className="step-content" style={{ minHeight: "100vh", background: T.white, padding: "44px 52px 60px", fontFamily: "'DM Sans',sans-serif" }}>
          <div style={{ maxWidth: 640 }}>
            <DepositBreadcrumbs screen={screen} onNavigate={(s) => setScreen(s)} onClose={handleClose} />

            {error && (
              <div className="fadein" style={{
                display: "flex", alignItems: "center", gap: 10,
                background: T.redLight, border: `1px solid ${T.red}`,
                borderRadius: 12, padding: "12px 16px", marginBottom: 20, maxWidth: 560,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.red} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span style={{ fontSize: 13, color: T.red, fontFamily: "'DM Sans',sans-serif" }}>{error}</span>
                <button onClick={() => setError(null)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: T.red, fontSize: 16, lineHeight: 1 }}>✕</button>
              </div>
            )}

            {screen === "choose" && <StepChoose onChoose={t => setScreen(t === "crypto" ? "crypto-select" : "ngn-amount")} />}
            {screen === "crypto-select" && <StepSelectAsset onContinue={handleCryptoAssetContinue} loading={loading} />}
            {screen === "crypto-address" && depositData && <StepCryptoAddress depositData={depositData} asset={selectedAsset} onClose={() => setScreen("crypto-status")} />}
            {screen === "ngn-amount" && <StepNGNAmount onContinue={handleNGNContinue} loading={loading} />}
            {screen === "ngn-details" && fundingData && <StepNGNDetails fundingData={fundingData} amount={ngnAmount} onClose={handleClose} />}
          </div>
        </div>
      )}
    </>
  );
}

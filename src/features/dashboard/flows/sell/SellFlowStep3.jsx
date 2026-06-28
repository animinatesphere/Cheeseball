import React, { useState, useEffect, useRef } from "react";
import { T, Ico, formatNGN, CTA, GhostBtn, SecureFooter } from "./SellFlowShared";
import { request } from "@/services/api";

const fmtTime = (d) => d.toLocaleTimeString("en-NG",{hour:"2-digit",minute:"2-digit"});
const fmtDate = (d) => d.toLocaleDateString("en-NG",{day:"numeric",month:"short",year:"numeric"});

function ExternalWalletVariant({ payAmount, receiveAmount, selectedAsset, selectedNetwork, transactionData, depositAddressData, onBack, onNavigate, paymentMethod }) {
  const [copied, setCopied] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [brokerAddress, setBrokerAddress] = useState(depositAddressData?.address || "");
  // Resolve network: prefer what backend returned, then what user selected, then asset default
  const rawNetwork = depositAddressData?.network || selectedNetwork || selectedAsset.network;
  // Resolve human-readable label from the asset's networks list if available
  const networkLabel = selectedAsset.networks?.find(n => n.id === rawNetwork || n.id === rawNetwork?.toLowerCase())?.label || rawNetwork;

  useEffect(() => {
    if (brokerAddress || !transactionData?.id) return;
    const interval = setInterval(async () => {
      try {
        const res = await request(`/api/broker/transactions/${transactionData.id}`);
        if (res.broker_wallet_address) {
          setBrokerAddress(res.broker_wallet_address);
          clearInterval(interval);
        }
      } catch (e) {
        // ignore errors while polling
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [brokerAddress, transactionData?.id]);

  const displayAddress = brokerAddress || "Awaiting address...";
  
  const copyAddress = () => {
    navigator.clipboard.writeText(displayAddress).catch(()=>{});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (hasPaid) {
    const txRef = transactionData?.id || "CHB-2024-" + String(Date.now()).slice(-5);
    const submittedAt = new Date();

    const steps = [
      { label: "Order placed", done: true },
      { label: "Payment sent", done: true },
      { label: "Blockchain confirming", active: true },
      { label: "NGN credited", done: false },
    ];

    return (
      <div className="sellgrid fadein" style={{ display: "grid", gridTemplateColumns: "1fr 360px", height: "100vh", fontFamily: "'DM Sans',sans-serif", background: T.white, color: T.text, overflowX: "hidden", maxWidth: "100vw" }}>

        {/* ── LEFT PANEL ── */}
        <div style={{ padding: "28px 36px 28px", borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", overflow: "hidden" }} className="step-content">

          {/* Status icon + headline */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <div style={{ position: "relative", width: 48, height: 48, flexShrink: 0 }}>
              <div className="ripple" style={{ position: "absolute", inset: -5, borderRadius: "50%", border: `2px solid rgba(245,158,11,0.35)` }} />
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "linear-gradient(135deg,#F59E0B 0%,#D97706 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 14px rgba(245,158,11,0.28), inset 0 1px 0 rgba(255,255,255,0.2)" }}>
                {Ico.clock("#fff")}
              </div>
            </div>
            <div>
              <p style={{ fontSize: 10, fontWeight: 600, color: T.blue, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 2, fontFamily: "'DM Sans',sans-serif" }}>Transaction Status</p>
              <h1 className="responsive-title" style={{ fontFamily: "'Sora',sans-serif", fontSize: 22, fontWeight: 700, color: T.text, letterSpacing: "-0.5px", lineHeight: 1.15 }}>Payment Processing</h1>
            </div>
          </div>

          {/* Amount highlight */}
          <div style={{ background: "linear-gradient(135deg,#FFFBEB 0%,#FEF3C7 100%)", border: "1.5px solid #FDE68A", borderRadius: 14, padding: "14px 18px", marginBottom: 12 }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: "#92400E", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4, fontFamily: "'DM Sans',sans-serif" }}>You will receive</p>
            <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 28, fontWeight: 700, color: "#92400E", letterSpacing: "-1px", lineHeight: 1 }}>{formatNGN(receiveAmount)}</p>
            <p style={{ fontSize: 12, color: "#B45309", marginTop: 5, lineHeight: 1.4 }}>
              Confirming on the blockchain — your NGN wallet will be credited shortly.
            </p>
          </div>

          {/* Transaction detail card */}
          <div style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 14, overflow: "hidden", marginBottom: 12 }}>
            {[
              { label: "Reference", value: txRef, mono: true },
              { label: "Date", value: `${fmtDate(submittedAt)} • ${fmtTime(submittedAt)}`, mono: true },
              { label: "Asset sent", value: `${payAmount} ${selectedAsset.symbol}`, mono: true },
            ].map(({ label, value, mono }, i, arr) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 16px", borderBottom: i < arr.length - 1 ? `1px solid ${T.border}` : "none" }}>
                <span style={{ fontSize: 12, color: T.text2, fontFamily: "'DM Sans',sans-serif" }}>{label}</span>
                <span style={{ fontFamily: mono ? "'Sora',sans-serif" : "'DM Sans',sans-serif", fontSize: 12, fontWeight: 700, color: T.text }}>{value}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 16px" }}>
              <span style={{ fontSize: 12, color: T.text2, fontFamily: "'DM Sans',sans-serif" }}>Status</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: T.orangeLight, border: "1px solid #FDE68A", padding: "3px 10px", borderRadius: 20 }}>
                <div className="pulsing" style={{ width: 5, height: 5, borderRadius: "50%", background: T.orange, flexShrink: 0 }} />
                <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 11, fontWeight: 700, color: "#92400E" }}>Processing</span>
              </div>
            </div>
          </div>

          {/* Step progress tracker */}
          <div style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 14, padding: "12px 16px", marginBottom: 16 }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10, fontFamily: "'DM Sans',sans-serif" }}>Progress</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {steps.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: "50%",
                      background: s.done ? T.green : s.active ? "linear-gradient(135deg,#F59E0B,#D97706)" : T.surface,
                      border: s.done ? `2px solid ${T.green}` : s.active ? "2px solid #D97706" : `2px solid ${T.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: s.active ? "0 3px 8px rgba(245,158,11,0.3)" : "none",
                      transition: "all 0.3s",
                    }}>
                      {s.done
                        ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                        : s.active
                          ? <div className="pulsing" style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />
                          : <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.border }} />
                      }
                    </div>
                    {i < steps.length - 1 && (
                      <div style={{ width: 2, height: 14, background: s.done ? T.green : T.border, borderRadius: 2, margin: "2px 0" }} />
                    )}
                  </div>
                  <p style={{ fontSize: 12, fontWeight: s.active ? 700 : s.done ? 600 : 500, color: s.active ? "#92400E" : s.done ? T.greenText : T.text3, paddingTop: 3, fontFamily: s.active || s.done ? "'Sora',sans-serif" : "'DM Sans',sans-serif", marginBottom: i < steps.length - 1 ? 10 : 0 }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="actions-wrap" style={{ display: "flex", gap: 10, marginTop: 0 }}>
            <GhostBtn onClick={onBack} style={{ flex: 1, padding: "13px 16px", fontSize: 13 }}>Return to Dashboard</GhostBtn>
            <CTA onClick={() => onNavigate("history")} style={{ flex: 1, padding: "13px 16px", fontSize: 13, boxShadow: "0 6px 16px rgba(26,111,255,0.25)" }}>View History</CTA>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={{ padding: "28px 20px 24px", background: T.surface, display: "flex", flexDirection: "column", overflow: "hidden" }} className="rightpanel">
          <p style={{ fontSize: 10, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 12, fontFamily: "'DM Sans',sans-serif" }}>Transaction Summary</p>

          {/* Asset swap visual */}
          <div style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 14, overflow: "hidden", marginBottom: 10 }}>
            <div style={{ padding: "12px 14px" }}>
              {/* Sent */}
              <div style={{ display: "flex", alignItems: "center", padding: "10px 12px", background: T.surface, borderRadius: 10, marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: selectedAsset.color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora',sans-serif", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{selectedAsset.icon}</div>
                  <div>
                    <p style={{ fontSize: 10, color: T.text3, marginBottom: 1, fontFamily: "'DM Sans',sans-serif" }}>You sent</p>
                    <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 700, color: T.text }}>{payAmount} {selectedAsset.symbol}</p>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div style={{ display: "flex", justifyContent: "center", margin: "3px 0" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: T.blueLight, border: `1.5px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Ico.arrowDn />
                </div>
              </div>

              {/* Receive */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "linear-gradient(135deg,#F59E0B 0%,#D97706 100%)", borderRadius: 10, marginTop: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  </div>
                  <div>
                    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", marginBottom: 1, fontFamily: "'DM Sans',sans-serif" }}>You receive</p>
                    <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 700, color: "#fff" }}>{formatNGN(receiveAmount)}</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(255,255,255,0.2)", padding: "3px 8px", borderRadius: 20 }}>
                  <div className="pulsing" style={{ width: 4, height: 4, borderRadius: "50%", background: "#fff" }} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", fontFamily: "'Sora',sans-serif" }}>Processing</span>
                </div>
              </div>
            </div>

            {/* Detail rows */}
            <div style={{ borderTop: `1.5px dashed ${T.border}`, margin: "0 14px" }} />
            <div style={{ padding: "4px 14px 6px" }}>
              {[
                ["Asset", `${selectedAsset.name} (${selectedAsset.symbol})`],
                ["Network", networkLabel],
                ["Payout to", "NGN Wallet"],
              ].map(([label, val], i, arr) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: i < arr.length - 1 ? `1px solid ${T.border}` : "none" }}>
                  <span style={{ fontSize: 11, color: T.text2, fontFamily: "'DM Sans',sans-serif" }}>{label}</span>
                  <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 11, fontWeight: 700, color: T.text }}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Info note */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, background: T.blueLight, border: `1px solid ${T.border}`, borderRadius: 12, padding: "10px 12px", marginBottom: 10 }}>
            <Ico.info />
            <p style={{ fontSize: 12, color: T.blue, lineHeight: 1.5, fontFamily: "'DM Sans',sans-serif" }}>
              Once the blockchain confirms your deposit, funds are credited to your NGN wallet automatically — no action needed.
            </p>
          </div>

          <SecureFooter />
        </div>
      </div>
    );
  }

  return (
    <div className="sellgrid" style={{ display: "grid", gridTemplateColumns: "1fr 400px", minHeight: "100vh", fontFamily: "'DM Sans',sans-serif", background: T.white, color: T.text, overflowX: "hidden", maxWidth: "100vw" }}>
      <div style={{ padding: "44px 52px 60px", borderRight: `1px solid ${T.border}` }} className="step-content">
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: selectedAsset.color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora',sans-serif", fontSize: 16, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{selectedAsset.icon}</div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: T.blue, textTransform: "uppercase", letterSpacing: "1px" }}>Step 3 of 3</p>
            <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: 26, fontWeight: 700, color: T.text, letterSpacing: "-0.5px", lineHeight: 1.1 }}>Send {selectedAsset.symbol}</h1>
          </div>
        </div>
        <p style={{ fontSize: 14, color: T.text2, marginTop: 8, lineHeight: 1.6 }}>Send from your external wallet or exchange (Trust Wallet, Binance, Bybit, etc.)</p>

        <div style={{ marginTop: 28, background: T.blueLight, border: `1.5px solid ${T.border}`, borderRadius: 16, padding: "20px 22px" }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: T.text2, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10 }}>Send exactly</p>
          <p className="responsive-amount" style={{ fontFamily: "'Sora',sans-serif", fontSize: 38, fontWeight: 700, color: T.text, letterSpacing: "-1.5px", lineHeight: 1, wordBreak: "break-all" }}>{payAmount} <span style={{ fontSize: 24, color: selectedAsset.color }}>{selectedAsset.symbol}</span></p>
          <p style={{ fontSize: 12, color: T.text2, marginTop: 6 }}>Any amount other than <strong>{payAmount} {selectedAsset.symbol}</strong> will delay your payout.</p>
        </div>

        <div style={{ marginTop: 16 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10 }}>To this wallet address</p>
          <div style={{ border: `1.5px solid ${T.border}`, borderRadius: 16, padding: "16px 20px", background: T.white, display: "flex", alignItems: "center", gap: 12 }}>
            <p style={{ flex: 1, fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 600, color: T.text, wordBreak: "break-all", lineHeight: 1.5 }}>{displayAddress}</p>
            <button onClick={copyAddress} style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 16px", border: `1.5px solid ${copied ? T.green : T.border}`, borderRadius: 10, background: copied ? T.greenLight : T.white, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, color: copied ? T.greenText : T.blue, flexShrink: 0, transition: "all 0.18s", whiteSpace: "nowrap" }}>
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <div style={{ marginTop: 12, border: `1.5px solid ${T.border}`, borderRadius: 14, padding: "14px 18px", background: T.white, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, color: T.text2 }}>Network</span>
          <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 700, color: T.text, display: "flex", alignItems: "center", gap: 7 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: selectedAsset.color }} />{networkLabel}</span>
        </div>

        <div style={{ marginTop: 16, display: "flex", alignItems: "flex-start", gap: 12, background: T.orangeLight, border: "1.5px solid #FDE68A", borderRadius: 14, padding: "14px 18px" }}>
          <Ico.info />
          <div>
            <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 700, color: "#92400E", marginBottom: 4 }}>Important</p>
            <p style={{ fontSize: 13, color: "#92400E", lineHeight: 1.55 }}>Only send <strong>{selectedAsset.symbol}</strong> on the <strong>{networkLabel}</strong> network. Sending the wrong asset or using the wrong network may result in permanent loss of funds.</p>
          </div>
        </div>

        <div style={{ marginTop: 24, background: "linear-gradient(135deg, #EEF3FF 0%, #F7F9FF 100%)", border: `1.5px solid ${T.border}`, borderRadius: 16, padding: "20px 22px", display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: T.blueLight, border: `2px solid ${T.blue}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <div className="pulsing" style={{ width: 12, height: 12, borderRadius: "50%", background: T.blue }} />
          </div>
          <div>
            <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 4 }}>Awaiting your deposit</p>
            <p style={{ fontSize: 13, color: T.text2, lineHeight: 1.6 }}>
              Once your transfer arrives on-chain, it will be detected automatically and your payout will be processed — no further action needed.
            </p>
          </div>
        </div>

        <div className="actions-wrap" style={{ display: "flex", gap: 12, marginTop: 32 }}>
          <GhostBtn onClick={onBack} style={{ flex: 1 }}>Return to Dashboard</GhostBtn>
          <CTA onClick={() => setHasPaid(true)} style={{ flex: 1 }}>I Have Paid</CTA>
        </div>
      </div>

      {/* Summary Sidebar */}
      <div style={{ padding: "44px 32px 60px", background: T.surface, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "0.8px" }}>Transaction details</p>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: T.orangeLight, border: "1px solid #FDE68A", borderRadius: 20, padding: "4px 10px" }}>
            <div className="pulsing" style={{ width: 6, height: 6, borderRadius: "50%", background: T.orange, flexShrink: 0 }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: "#92400E" }}>Awaiting payment</span>
          </div>
        </div>
        <div style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 20, overflow: "hidden", marginBottom: 14 }}>
          <div style={{ padding: "22px 22px 0" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: T.surface, borderRadius: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: selectedAsset.color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{selectedAsset.icon}</div>
                <div><p style={{ fontSize: 11, color: T.text3, marginBottom: 2 }}>You send</p><p style={{ fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 700, color: T.text }}>{payAmount} {selectedAsset.symbol}</p></div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", margin: "8px 0" }}><div style={{ width: 28, height: 28, borderRadius: "50%", background: T.blueLight, border: `1.5px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico.arrowDn /></div></div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: T.blue, borderRadius: 14, marginBottom: 22 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                </div>
                <div><p style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginBottom: 2 }}>You receive</p><p style={{ fontFamily: "'Sora',sans-serif", fontSize: 15, fontWeight: 700, color: "#fff" }}>{formatNGN(receiveAmount)}</p></div>
              </div>
            </div>
          </div>
          <div style={{ borderTop: `1.5px dashed ${T.border}`, margin: "0 22px" }} />
          <div style={{ padding: "6px 22px 8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${T.border}` }}><span style={{ fontSize: 12, color: T.text2 }}>Asset</span><span style={{ fontFamily: "'Sora',sans-serif", fontSize: 12, fontWeight: 700, color: T.text }}>{selectedAsset.name} ({selectedAsset.symbol})</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${T.border}` }}><span style={{ fontSize: 12, color: T.text2 }}>Quantity</span><span style={{ fontFamily: "'Sora',sans-serif", fontSize: 12, fontWeight: 700, color: T.text }}>{payAmount} {selectedAsset.symbol}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0" }}><span style={{ fontSize: 12, color: T.text2 }}>Net payout</span><span style={{ fontFamily: "'Sora',sans-serif", fontSize: 12, fontWeight: 700, color: T.blue }}>{formatNGN(receiveAmount)}</span></div>
          </div>
          <div style={{ borderTop: `1.5px dashed ${T.border}`, margin: "0 22px" }} />
          <div style={{ padding: "16px 22px 20px" }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 12 }}>Payout destination</p>
            {paymentMethod === "bank_transfer" ? (
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: T.blueLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Ico.bank /></div>
                <div><p style={{ fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 700, color: T.text }}>Bank Account</p><p style={{ fontSize: 12, color: T.text2, marginTop: 1 }}>Funds arrive in minutes</p></div>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: T.greenLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Ico.wallet /></div>
                <div><p style={{ fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 700, color: T.text }}>NGN Wallet</p><p style={{ fontSize: 12, color: T.text2, marginTop: 1 }}>Credited instantly</p></div>
              </div>
            )}
          </div>
        </div>
        <SecureFooter />
      </div>
    </div>
  );
}

function InternalWalletVariant({ payAmount, receiveAmount, selectedAsset, transactionData, onBack, paymentMethod }) {
  const txRef = transactionData?.id || "CHB-2024-" + String(Date.now()).slice(-5);
  const submittedAt = new Date();

  return (
    <div style={{ minHeight: "100vh", background: T.surface, fontFamily: "'DM Sans',sans-serif", color: T.text, overflowX: "hidden", maxWidth: "100vw", display: "flex", flexDirection: "column" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "80px 24px", width: "100%" }}>
        <div className="fadein" style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 24, padding: "48px", textAlign: "center", boxShadow: "0 10px 40px rgba(0,0,0,0.03)" }}>
          <div style={{ position: "relative", width: 80, height: 80, margin: "0 auto 24px" }}>
            <div className="pulsing" style={{ position: "absolute", inset: 0, borderRadius: "50%", background: T.greenLight }} />
            <div style={{ position: "relative", width: 80, height: 80, borderRadius: "50%", background: T.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
          </div>
          <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: 28, fontWeight: 700, color: T.text, letterSpacing: "-0.5px", marginBottom: 12 }}>Sell Successful</h1>
          <p style={{ fontSize: 15, color: T.text2, lineHeight: 1.6, maxWidth: 420, margin: "0 auto 32px" }}>
            Your <strong>{payAmount} {selectedAsset.symbol}</strong> sale was successful. 
            Your {paymentMethod === "bank_transfer" ? "bank account" : "NGN wallet"} has been credited with <strong>{formatNGN(receiveAmount)}</strong>.
          </p>
          
          <div style={{ background: T.surface, borderRadius: 16, padding: "20px", display: "inline-block", textAlign: "left", minWidth: 320 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: T.text2 }}>Reference</span>
              <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 700, color: T.text }}>{txRef}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: T.text2 }}>Date</span>
              <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 700, color: T.text }}>{fmtDate(submittedAt)} {fmtTime(submittedAt)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: T.text2 }}>Status</span>
              <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 700, color: T.greenText }}>Completed</span>
            </div>
          </div>

          <div style={{ marginTop: 40, display: "flex", justifyContent: "center", gap: 16 }}>
            <CTA onClick={onBack} style={{ padding: "16px 32px", width: "auto" }}>Return to Dashboard</CTA>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SellFlowStep3(props) {
  const { cryptoSource } = props;

  if (cryptoSource === "external_wallet") {
    return <ExternalWalletVariant {...props} />;
  }
  return <InternalWalletVariant {...props} />;
}

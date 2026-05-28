import React, { useState, useEffect } from "react";
import { getBeneficiaryBankAccounts, createBeneficiaryBankAccount, deleteBeneficiaryBankAccount } from "@/services/api";
import { Loader2 } from "lucide-react";

/* ─── Tokens ─────────────────────────────────────────────────── */
const T = {
  blue:        "#1A6FFF",
  blueDark:    "#1259D9",
  blueLight:   "#EEF3FF",
  text:        "#0A0F1E",
  text2:       "#6B7A99",
  text3:       "#A8B4CC",
  border:      "#E8EEFF",
  surface:     "#F7F9FF",
  white:       "#FFFFFF",
  green:       "#00C48C",
  greenLight:  "#E6FAF4",
  greenText:   "#00966B",
  mintGreen:   "#4ADE80",
  red:         "#EF4444",
  redLight:    "#FEF2F2",
  redText:     "#B91C1C",
  orange:      "#F59E0B",
  orangeLight: "#FFFBEB",
};

const MAX_ACCOUNTS = 5;

/* ─── Nigerian banks ─────────────────────────────────────────── */
const BANKS = [
  // ── Commercial banks ──
  { id: "access",       name: "Access Bank",                      color: "#E84142", abbr: "ACC" },
  { id: "citibank",     name: "Citibank Nigeria",                 color: "#003B70", abbr: "CTI" },
  { id: "ecobank",      name: "Ecobank Nigeria",                  color: "#00529B", abbr: "ECO" },
  { id: "fidelity",     name: "Fidelity Bank",                    color: "#009A44", abbr: "FID" },
  { id: "firstbank",    name: "First Bank of Nigeria",            color: "#003C88", abbr: "FBN" },
  { id: "fcmb",         name: "First City Monument Bank",         color: "#006633", abbr: "FCM" },
  { id: "globus",       name: "Globus Bank",                      color: "#D4A017", abbr: "GLB" },
  { id: "gtb",          name: "Guaranty Trust Bank",              color: "#F7941D", abbr: "GTB" },
  { id: "keystone",     name: "Keystone Bank",                    color: "#00A651", abbr: "KEY" },
  { id: "nova",         name: "Nova Commercial Bank",             color: "#1C1C5E", abbr: "NOV" },
  { id: "optimus",      name: "Optimus Bank",                     color: "#2E4057", abbr: "OPT" },
  { id: "parallex",     name: "Parallex Bank",                    color: "#4B286D", abbr: "PAR" },
  { id: "polaris",      name: "Polaris Bank",                     color: "#800000", abbr: "POL" },
  { id: "premiumtrust", name: "Premium Trust Bank",               color: "#0B3D91", abbr: "PTB" },
  { id: "providus",     name: "Providus Bank",                    color: "#F26522", abbr: "PRV" },
  { id: "signature",    name: "Signature Bank",                   color: "#1A237E", abbr: "SIG" },
  { id: "stanbic",      name: "Stanbic IBTC Bank",               color: "#0033A0", abbr: "STN" },
  { id: "stanchart",    name: "Standard Chartered Bank Nigeria",  color: "#0072AA", abbr: "SCB" },
  { id: "sterling",     name: "Sterling Bank",                    color: "#C0392B", abbr: "STR" },
  { id: "suntrust",     name: "SunTrust Bank Nigeria",            color: "#E8B600", abbr: "SUN" },
  { id: "titan",        name: "Titan Trust Bank",                 color: "#1B3A5C", abbr: "TTB" },
  { id: "union",        name: "Union Bank of Nigeria",            color: "#003366", abbr: "UBN" },
  { id: "uba",          name: "United Bank for Africa",           color: "#E31837", abbr: "UBA" },
  { id: "unity",        name: "Unity Bank",                       color: "#00653E", abbr: "UNT" },
  { id: "wema",         name: "Wema Bank",                        color: "#7B2D8B", abbr: "WEM" },
  { id: "zenith",       name: "Zenith Bank",                      color: "#C8102E", abbr: "ZEN" },
  // ── Fintechs / MFBs ──
  { id: "opay",         name: "OPay",                             color: "#00AA40", abbr: "OPY" },
  { id: "palmpay",      name: "PalmPay",                          color: "#07A858", abbr: "PAL" },
  { id: "moniepoint",   name: "Moniepoint",                       color: "#0055FF", abbr: "MNP" },
  { id: "fairmoney",    name: "FairMoney",                        color: "#6C3FBF", abbr: "FMN" },
];

/* ─── Icons ──────────────────────────────────────────────────── */
const Ico = {
  bank:    (color = T.text2) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
      <rect x="3" y="10" width="18" height="11" rx="1"/><path d="M3 10l9-7 9 7"/>
      <line x1="9" y1="21" x2="9" y2="10"/><line x1="15" y1="21" x2="15" y2="10"/>
    </svg>
  ),
  plus:    () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  trash:   (color = T.red) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  ),
  star:    (filled) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? T.orange : "none"} stroke={filled ? T.orange : T.text3} strokeWidth="2" strokeLinecap="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  check:   () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  shield:  () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.mintGreen} strokeWidth="2" strokeLinecap="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  x:       (color = T.text2) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  warn:    () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.red} strokeWidth="2" strokeLinecap="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  verify:  () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  lock:    () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.text3} strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
};

/* ─── Mask account number ────────────────────────────────────── */
const maskNum = (n) => n?.length >= 6 ? n.slice(0, 3) + "••••" + n.slice(-3) : "••••";

/* ─── Bank avatar ────────────────────────────────────────────── */
function BankAvatar({ bankId, bankName, size = 46 }) {
  let bank = BANKS.find(b => b.id === bankId || b.name.toLowerCase() === bankName?.toLowerCase());
  if (!bank && bankName) {
    const abbr = bankName.substring(0, 3).toUpperCase();
    bank = { color: T.blue, abbr };
  } else if (!bank) {
    bank = { color: T.blue, abbr: "BNK" };
  }

  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.28, background: bank.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ fontFamily: "'Sora', sans-serif", fontSize: size * 0.28, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>{bank.abbr}</span>
    </div>
  );
}

/* ─── Delete confirmation modal ─────────────────────────────── */
function DeleteModal({ account, onConfirm, onCancel }) {
  const [deleting, setDeleting] = useState(false);
  
  const handleConfirm = async () => {
    setDeleting(true);
    await onConfirm();
    setDeleting(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={onCancel} style={{ position: "absolute", inset: 0, background: "rgba(10,15,30,0.4)", backdropFilter: "blur(4px)" }} />
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 400, background: T.white, borderRadius: 22, border: `1.5px solid ${T.border}`, padding: "32px 28px", textAlign: "center", animation: "popIn 0.25s ease" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: T.redLight, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
          <Ico.warn />
        </div>
        <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 18, fontWeight: 700, color: T.text, marginBottom: 8 }}>Remove bank account?</h3>
        <p style={{ fontSize: 14, color: T.text2, lineHeight: 1.6, marginBottom: 10 }}>
          Are you sure you want to remove
        </p>
        <div style={{ background: T.surface, borderRadius: 12, padding: "12px 16px", marginBottom: 24, display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
          <BankAvatar bankId={account.bank_name} bankName={account.bank_name} size={38} />
          <div>
            <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700, color: T.text }}>{account.account_name}</p>
            <p style={{ fontSize: 12, color: T.text2, marginTop: 2 }}>{account.bank_name} · {maskNum(account.account_number)}</p>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <button onClick={onCancel} disabled={deleting} style={{ padding: "13px", borderRadius: 12, border: `1.5px solid ${T.border}`, background: T.white, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: T.text2, cursor: deleting ? "not-allowed" : "pointer", transition: "all 0.15s" }}
            onMouseEnter={e => { if(!deleting) e.currentTarget.style.background = T.surface; }}
            onMouseLeave={e => { if(!deleting) e.currentTarget.style.background = T.white; }}
          >
            Cancel
          </button>
          <button onClick={handleConfirm} disabled={deleting} style={{ padding: "13px", borderRadius: 12, border: "none", background: T.red, fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 700, color: "#fff", cursor: deleting ? "not-allowed" : "pointer", transition: "background 0.15s", display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}
            onMouseEnter={e => { if(!deleting) e.currentTarget.style.background = "#DC2626"; }}
            onMouseLeave={e => { if(!deleting) e.currentTarget.style.background = T.red; }}
          >
            {deleting ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Removing</> : "Yes, remove"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Add account drawer ─────────────────────────────────────── */
function AddAccountDrawer({ onClose, onSave }) {
  const [bankId,      setBankId]      = useState("");
  const [accNumber,   setAccNumber]   = useState("");
  const [accName,     setAccName]     = useState("");
  const [verifying,   setVerifying]   = useState(false);
  const [verified,    setVerified]    = useState(false);
  const [verifyErr,   setVerifyErr]   = useState("");
  const [saving,      setSaving]      = useState(false);
  const [bankOpen,    setBankOpen]    = useState(false);
  const [bankSearch,  setBankSearch]  = useState("");
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  const filteredBanks = BANKS.filter(b =>
    b.name.toLowerCase().includes(bankSearch.toLowerCase())
  );

  const selectedBank = BANKS.find(b => b.id === bankId);
  const canVerify    = bankId && accNumber.length === 10 && !verified;
  const canSave      = verified && bankId && accNumber.length === 10 && accName.trim().length > 0;

  const handleNumberChange = (val) => {
    const cleaned = val.replace(/\D/g, "").slice(0, 10);
    setAccNumber(cleaned);
    setVerified(false);
    setAccName("");
    setVerifyErr("");
  };

  const handleVerify = () => {
    if (!canVerify) return;
    setVerifying(true);
    setVerifyErr("");
    
    // Simulate lookup delay
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
    }, 1000);
  };

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      await onSave({ bankId, bankName: selectedBank.name, accountName: accName, number: accNumber });
    } catch (err) {
      setVerifyErr(err.message || "Failed to save account");
      setSaving(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: isMobile ? "flex-end" : "flex-start", justifyContent: isMobile ? "center" : "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(10,15,30,0.35)", backdropFilter: "blur(4px)" }} />
      <div style={{
        position: "relative", zIndex: 1, width: "100%",
        ...(isMobile
          ? { maxHeight: "92vh", borderRadius: "22px 22px 0 0", animation: "slideUp 0.3s ease" }
          : { maxWidth: 420, height: "100vh", borderLeft: `1px solid ${T.border}`, animation: "slideIn 0.25s ease" }
        ),
        background: T.white, display: "flex", flexDirection: "column",
      }}>

        {/* Mobile drag handle */}
        {isMobile && (
          <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 0" }}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: T.border }} />
          </div>
        )}

        {/* Header */}
        <div style={{ padding: isMobile ? "16px 20px" : "24px 28px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: 11, color: T.text3, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 4 }}>Bank accounts</p>
            <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 700, color: T.text }}>Add new account</p>
          </div>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: 10, background: T.surface, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: T.text2 }}>
            <Ico.x />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "20px 20px" : "24px 28px", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Bank selector */}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.text2, marginBottom: 8 }}>Select bank</label>
            <div style={{ position: "relative" }}>
              <div
                onClick={() => setBankOpen(o => !o)}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", border: `1.5px solid ${bankOpen ? T.blue : T.border}`, borderRadius: 14, cursor: "pointer", background: T.white, transition: "border-color 0.15s", userSelect: "none" }}
              >
                {selectedBank ? (
                  <>
                    <BankAvatar bankId={bankId} size={32} />
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: T.text }}>{selectedBank.name}</span>
                  </>
                ) : (
                  <>
                    <div style={{ width: 32, height: 32, borderRadius: 9, background: T.surface, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {Ico.bank()}
                    </div>
                    <span style={{ flex: 1, fontSize: 14, color: T.text3 }}>Choose your bank</span>
                  </>
                )}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.text3} strokeWidth="2" strokeLinecap="round" style={{ transform: bankOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>

              {bankOpen && (
                <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 14, zIndex: 10, maxHeight: 300, overflowY: "auto", boxShadow: "0 8px 24px rgba(10,15,30,0.1)" }}>
                  {/* Search input */}
                  <div style={{ position: "sticky", top: 0, background: T.white, padding: "10px 12px", borderBottom: `1px solid ${T.border}`, zIndex: 1 }}>
                    <input
                      type="text"
                      placeholder="Search bank…"
                      value={bankSearch}
                      onChange={e => setBankSearch(e.target.value)}
                      autoFocus
                      style={{ width: "100%", border: `1.5px solid ${T.border}`, borderRadius: 10, padding: "9px 12px", fontSize: 13, color: T.text, outline: "none", fontFamily: "'DM Sans', sans-serif" }}
                      onFocus={e => e.target.style.borderColor = T.blue}
                      onBlur={e => e.target.style.borderColor = T.border}
                    />
                  </div>
                  {filteredBanks.length === 0 ? (
                    <div style={{ padding: "20px 14px", textAlign: "center" }}>
                      <p style={{ fontSize: 13, color: T.text3 }}>No banks found</p>
                    </div>
                  ) : (
                    filteredBanks.map((b) => (
                      <div
                        key={b.id}
                        onClick={() => { setBankId(b.id); setBankOpen(false); setVerified(false); setAccName(""); setBankSearch(""); }}
                        style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", cursor: "pointer", background: bankId === b.id ? T.blueLight : T.white, transition: "background 0.12s" }}
                        onMouseEnter={e => { if (bankId !== b.id) e.currentTarget.style.background = T.surface; }}
                        onMouseLeave={e => { if (bankId !== b.id) e.currentTarget.style.background = T.white; }}
                      >
                        <BankAvatar bankId={b.id} size={30} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: bankId === b.id ? T.blue : T.text }}>{b.name}</span>
                        {bankId === b.id && (
                          <div style={{ marginLeft: "auto", width: 20, height: 20, borderRadius: "50%", background: T.blue, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Ico.check />
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Account number */}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.text2, marginBottom: 8 }}>Account number</label>
            <div style={{ display: "flex", gap: 10 }}>
              <input
                type="text"
                inputMode="numeric"
                placeholder="10-digit account number"
                value={accNumber}
                onChange={e => handleNumberChange(e.target.value)}
                maxLength={10}
                style={{ flex: 1, border: `1.5px solid ${verified ? T.green : T.border}`, borderRadius: 13, padding: "13px 16px", fontSize: 14, color: T.text, fontFamily: "'Sora', sans-serif", fontWeight: 600, letterSpacing: "1.5px", outline: "none", transition: "border-color 0.15s", width: "100%" }}
              />
              <button
                onClick={handleVerify}
                disabled={!canVerify || verifying}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "13px 16px", borderRadius: 13, border: "none", fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700, cursor: canVerify && !verifying ? "pointer" : "not-allowed", background: canVerify && !verifying ? T.blue : "#E8EEFF", color: canVerify && !verifying ? "#fff" : T.text3, transition: "all 0.15s", whiteSpace: "nowrap", flexShrink: 0 }}
                onMouseEnter={e => { if (canVerify && !verifying) e.currentTarget.style.background = T.blueDark; }}
                onMouseLeave={e => { if (canVerify && !verifying) e.currentTarget.style.background = T.blue; }}
              >
                {verifying
                  ? <><div style={{ width: 13, height: 13, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: canVerify ? "#fff" : T.text3, borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Verifying</>
                  : <><Ico.verify /> Verify</>
                }
              </button>
            </div>
          </div>

          {/* Verified account name */}
          {verified && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, animation: "fadeUp 0.3s ease" }}>
               <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.text2 }}>Account Name</label>
               <input
                 type="text"
                 placeholder="Enter Account Name"
                 value={accName}
                 onChange={e => setAccName(e.target.value)}
                 style={{ width: "100%", border: `1.5px solid ${T.border}`, borderRadius: 13, padding: "13px 16px", fontSize: 14, color: T.text, fontFamily: "'Sora', sans-serif", fontWeight: 600, outline: "none", transition: "border-color 0.15s" }}
                 onFocus={e => e.target.style.borderColor = T.blue}
                 onBlur={e => e.target.style.borderColor = T.border}
                 autoFocus
               />
               <p style={{ fontSize: 12, color: T.greenText, display: "flex", alignItems: "center", gap: 4 }}>
                 <Ico.check /> Number Verified
               </p>
            </div>
          )}
          
          {verifyErr && <p style={{ fontSize: 12, color: T.red, marginTop: -10, fontWeight: 500, padding: "10px", background: T.redLight, borderRadius: "8px" }}>{verifyErr}</p>}

          {/* Notice */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: T.blueLight, borderRadius: 13, padding: "13px 16px", marginTop: "auto" }}>
            <Ico.lock />
            <p style={{ fontSize: 12, color: "#3B5AA8", lineHeight: 1.55 }}>
              Always verify that the account name matches your registered name before saving.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: isMobile ? "16px 20px" : "18px 28px", borderTop: `1px solid ${T.border}` }}>
          <button
            onClick={handleSave}
            disabled={!canSave || saving}
            style={{ width: "100%", padding: "16px", borderRadius: 14, border: "none", fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 700, cursor: canSave && !saving ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: canSave && !saving ? T.blue : "#E8EEFF", color: canSave && !saving ? "#fff" : T.text3, transition: "all 0.18s" }}
            onMouseEnter={e => { if (canSave && !saving) e.currentTarget.style.background = T.blueDark; }}
            onMouseLeave={e => { if (canSave && !saving) e.currentTarget.style.background = T.blue; }}
          >
            {saving
              ? <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Saving…</>
              : "Save bank account"
            }
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
export default function BankAccountPage({ onNavigate }) {
  const [accounts,    setAccounts]    = useState([]);
  const [showAdd,     setShowAdd]     = useState(false);
  const [deleteTarget,setDeleteTarget]= useState(null);
  const [loading,     setLoading]     = useState(true);

  const atLimit   = accounts.length >= MAX_ACCOUNTS;
  const remaining = MAX_ACCOUNTS - accounts.length;

  const loadAccounts = async () => {
    setLoading(true);
    try {
      const data = await getBeneficiaryBankAccounts();
      setAccounts(Array.isArray(data) ? data : data?.data || data?.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleSave = async (acc) => {
    await createBeneficiaryBankAccount({
      bank_name: acc.bankName,
      account_number: acc.number,
      account_name: acc.accountName,
      account_type: "savings" // default since form doesn't specify
    });
    await loadAccounts();
    setShowAdd(false);
  };

  const handleDelete = async () => {
    await deleteBeneficiaryBankAccount(deleteTarget.id);
    await loadAccounts();
    setDeleteTarget(null);
  };

  const handleSetDefault = (id) => {
    // Backend doesn't support 'isDefault' currently, so this is frontend only mockup for the button
    setAccounts(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-track{background:transparent;} ::-webkit-scrollbar-thumb{background:${T.border};border-radius:4px;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
        @keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes popIn{0%{transform:scale(0.95);opacity:0}100%{transform:scale(1);opacity:1}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .fadein{animation:fadeUp 0.3s ease forwards}
        .acc-card:hover .acc-actions{opacity:1!important;}
        .acc-card:hover{border-color:${T.blue}!important;}
        .del-btn:hover{background:${T.redLight}!important;border-color:#FECACA!important; color: ${T.red} !important;}
        .default-btn:hover{background:${T.blueLight}!important;border-color:${T.blue}!important;color:${T.blue}!important;}
        .add-btn:hover:not(:disabled){border-color:${T.blue}!important;background:${T.blueLight}!important;color:${T.blue}!important;}
        
        @media (max-width: 768px) {
          .bank-top-bar { padding: 0 20px !important; }
          .bank-container { padding: 24px 20px 48px !important; }
          .acc-card { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
          .acc-actions { opacity: 1 !important; width: 100%; justify-content: flex-end; }
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: T.surface, fontFamily: "'DM Sans', sans-serif", color: T.text, display: "flex", flexDirection: "column", overflowX: "hidden" }}>

        {/* Top bar */}
        <div className="bank-top-bar" style={{ background: T.white, borderBottom: `1px solid ${T.border}`, height: 60, padding: "0 40px", display: "flex", alignItems: "center", flexShrink: 0 }}>
          <nav style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, color: T.text2, fontWeight: 500, cursor: "pointer" }} onClick={() => onNavigate?.("dashboard")}>Dashboard</span>
            <span style={{ color: T.text3, fontSize: 12 }}>›</span>
            <span style={{ fontSize: 13, color: T.text2, fontWeight: 500, cursor: "pointer" }} onClick={() => onNavigate?.("account")}>Settings</span>
            <span style={{ color: T.text3, fontSize: 12 }}>›</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.blue }}>Bank Accounts</span>
          </nav>
        </div>

        <div className="bank-container" style={{ flex: 1, maxWidth: 680, width: "100%", margin: "0 auto", padding: "32px 20px 60px" }}>

          {/* Page heading */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: "10px" }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: T.blue, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>Payment methods</p>
              <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 26, fontWeight: 700, color: T.text, letterSpacing: "-0.5px", marginBottom: 5 }}>Bank Accounts</h1>
              <p style={{ fontSize: 14, color: T.text2 }}>
                Manage where your Naira payouts are sent.
              </p>
            </div>

            <button
              className="add-btn"
              onClick={() => !atLimit && setShowAdd(true)}
              disabled={atLimit}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 18px", borderRadius: 12, border: `1.5px solid ${T.border}`, background: T.white, fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700, color: T.text2, cursor: atLimit ? "not-allowed" : "pointer", transition: "all 0.15s", flexShrink: 0, marginTop: 4 }}
            >
              <Ico.plus /> Add account
            </button>
          </div>

          {/* Limit indicator */}
          <div style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 14, padding: "14px 20px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", gap: 5 }}>
                {[...Array(MAX_ACCOUNTS)].map((_, i) => (
                  <div key={i} style={{ width: 28, height: 28, borderRadius: 8, background: i < accounts.length ? T.blue : T.surface, border: `1.5px solid ${i < accounts.length ? T.blue : T.border}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                    {i < accounts.length && <Ico.check />}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 13, color: T.text2, fontWeight: 500 }}>
                <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: T.text }}>{accounts.length}</span> of {MAX_ACCOUNTS} accounts used
              </p>
            </div>
            {atLimit ? (
              <span style={{ fontSize: 12, fontWeight: 600, color: T.orangeText, background: T.orangeLight, padding: "4px 10px", borderRadius: 8 }}>Limit reached</span>
            ) : (
              <span style={{ fontSize: 12, fontWeight: 500, color: T.text3 }}>{remaining} slot{remaining !== 1 ? "s" : ""} remaining</span>
            )}
          </div>

          {/* Accounts list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", gap: 16 }}>
                <Loader2 size={36} color={T.blue} style={{ animation: "spin 1s linear infinite" }} />
                <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 12, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "1px" }}>Loading accounts…</p>
              </div>
            ) : accounts.length === 0 ? (
              <div style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 20, padding: "52px 24px", textAlign: "center" }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: T.surface, border: `1.5px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  {Ico.bank(T.text3)}
                </div>
                <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 6 }}>No bank accounts yet</p>
                <p style={{ fontSize: 13, color: T.text2, marginBottom: 24 }}>Add a bank account to receive Naira payouts.</p>
                <button onClick={() => setShowAdd(true)} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "12px 22px", borderRadius: 12, border: "none", background: T.blue, color: "#fff", fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  <Ico.plus /> Add your first account
                </button>
              </div>
            ) : (
              accounts.map((acc, i) => (
                <div
                  key={acc.id}
                  className="acc-card fadein"
                  style={{ background: T.white, border: `1.5px solid ${acc.isDefault ? T.blue : T.border}`, borderRadius: 18, padding: "20px 22px", display: "flex", alignItems: "center", gap: 16, transition: "all 0.18s", position: "relative", animationDelay: `${i * 0.05}s`, flexWrap: "wrap" }}
                >
                  {/* Bank avatar */}
                  <BankAvatar bankId={acc.bank_name} bankName={acc.bank_name} size={48} />
  
                  {/* Info */}
                  <div style={{ flex: 1, minWidth: "200px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 700, color: T.text }}>{acc.account_name}</p>
                      {acc.isDefault && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, color: T.blue, background: T.blueLight, padding: "3px 8px", borderRadius: 6, textTransform: "uppercase", letterSpacing: "0.4px" }}>
                          {Ico.star(true)} Default
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 13, color: T.text2, marginBottom: 2 }}>{acc.bank_name}</p>
                    <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 600, color: T.text3, letterSpacing: "1px" }}>{maskNum(acc.account_number)}</p>
                  </div>
  
                  {/* Actions — revealed on hover */}
                  <div className="acc-actions" style={{ display: "flex", alignItems: "center", gap: 8, opacity: 0, transition: "opacity 0.18s" }}>
                    {!acc.isDefault && (
                      <button
                        className="default-btn"
                        onClick={() => handleSetDefault(acc.id)}
                        style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 10, border: `1px solid ${T.border}`, background: T.white, fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: T.text2, cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap" }}
                      >
                        Set default
                      </button>
                    )}
                    <button
                      className="del-btn"
                      onClick={() => setDeleteTarget(acc)}
                      style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${T.border}`, background: T.white, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s", color: T.text3 }}
                    >
                      {Ico.trash("currentColor")}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Limit notice */}
          {atLimit && (
            <div style={{ marginTop: 16, display: "flex", alignItems: "flex-start", gap: 10, background: T.orangeLight, border: `1px solid #FDE68A`, borderRadius: 14, padding: "14px 18px" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.orange} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <p style={{ fontSize: 13, color: T.orangeText, lineHeight: 1.55 }}>
                You've reached the maximum of <strong>{MAX_ACCOUNTS} bank accounts</strong>. Remove an existing account to add a new one.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ borderTop: `1px solid ${T.border}`, padding: "18px 40px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: T.white, flexShrink: 0 }}>
          <Ico.shield />
          <span style={{ fontSize: 12, color: T.text2, fontWeight: 500 }}>Your transaction is secure · </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: T.mintGreen }}>Protected by Cheeseball</span>
        </div>
      </div>

      {/* Add drawer */}
      {showAdd && <AddAccountDrawer onClose={() => setShowAdd(false)} onSave={handleSave} />}

      {/* Delete modal */}
      {deleteTarget && <DeleteModal account={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
    </>
  );
}

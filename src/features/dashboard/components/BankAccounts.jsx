import React, { useState, useEffect } from "react";
import { Search, Landmark, Trash2, CheckCircle2, AlertCircle, Plus, Loader2, Building2 } from "lucide-react";
import { getBeneficiaryBankAccounts, createBeneficiaryBankAccount, deleteBeneficiaryBankAccount } from "@/services/api";

/* ─── Design tokens ──────────────────────────────────────────── */
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
  orange:      "#F59E0B",
  orangeLight: "#FFFBEB",
  red:         "#EF4444",
  redLight:    "#FEF2F2",
  redText:     "#B91C1C",
};

/* ─── Helpers ────────────────────────────────────────────────── */
const bankColorMap = {
  gtbank: "#E85D04", gt: "#E85D04", guaranty: "#E85D04",
  access: "#F77F00", accessbank: "#F77F00",
  first: "#002D72", firstbank: "#002D72",
  uba: "#CC0000", united: "#CC0000",
  zenith: "#CC0033",
  kuda: "#6C3FBF",
  opay: "#1ACE8B",
  palmpay: "#6C3FBF",
  moniepoint: "#004AAD",
  wema: "#6B21A8",
  sterling: "#0E4A86",
  polaris: "#6B21A8",
  fcmb: "#5B21B6",
  stanbic: "#003DA5",
  ecobank: "#005FAB",
  fidelity: "#003399",
  union: "#003EA5",
};

const getBankColor = (bankName) => {
  if (!bankName) return T.blue;
  const key = bankName.toLowerCase().replace(/\s+/g, "").replace(/bank$/i, "");
  for (const [k, v] of Object.entries(bankColorMap)) {
    if (key.includes(k)) return v;
  }
  let hash = 0;
  for (let i = 0; i < bankName.length; i++) hash = bankName.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 55%, 45%)`;
};

const getBankInitials = (bankName) => {
  if (!bankName) return "?";
  const words = bankName.trim().split(/\s+/);
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

/* ─── Component ──────────────────────────────────────────────── */
const BankAccounts = ({ onBack }) => {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Form State
  const [formData, setFormData] = useState({
    bank_name: "",
    account_number: "",
    account_name: "",
    account_type: "savings",
  });
  const [focusedField, setFocusedField] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  // Interactions
  const [deleteId, setDeleteId] = useState(null);
  const [hoverCard, setHoverCard] = useState(null);

  /* ─── Data ─────────────────────────────────────────────────── */
  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getBeneficiaryBankAccounts();
      setAccounts(Array.isArray(data) ? data : data?.data || data?.results || []);
    } catch (err) {
      console.error("Failed to load bank accounts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bank account?")) return;
    
    setDeleteId(id);
    try {
      await deleteBeneficiaryBankAccount(id);
      // Optimistic delete
      setAccounts((prev) => prev.filter((acc) => acc.id !== id));
    } catch (err) {
      alert("Failed to delete account");
    } finally {
      setDeleteId(null);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^\d+$/.test(formData.account_number)) {
      setError("Account number must contain only numbers");
      return;
    }

    setSubmitting(true);
    try {
      await createBeneficiaryBankAccount(formData);
      setFormData({ bank_name: "", account_number: "", account_name: "", account_type: "savings" });
      await loadData();
    } catch (err) {
      setError(err.message || "Failed to add bank account");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAccounts = accounts.filter((a) =>
    (a.bank_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (a.account_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (a.account_number || "").includes(search)
  );

  /* ─── Render ───────────────────────────────────────────────── */
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", minHeight: "100vh", background: T.white, overflowX: "hidden", maxWidth: "100vw" }}>
      
      {/* ── Left Column: List ─────────────────────────────────── */}
      <div style={{ padding: "44px 52px 60px", borderRight: `1px solid ${T.border}` }}>
        <nav style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 36, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, color: T.text2, fontWeight: 500, cursor: "pointer" }} onClick={onBack}>Dashboard</span>
          <span style={{ color: T.text3, fontSize: 12 }}>›</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: T.blue }}>Bank Accounts</span>
        </nav>

        <p style={{ fontSize: 11, fontWeight: 600, color: T.blue, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>Payout Destinations</p>
        <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 28, fontWeight: 700, color: T.text, letterSpacing: "-0.6px", lineHeight: 1.15 }}>Bank Accounts</h1>
        <p style={{ fontSize: 14, color: T.text2, marginTop: 6, lineHeight: 1.6 }}>Manage your saved NGN bank accounts for withdrawals.</p>

        {/* Search */}
        <div style={{ marginTop: 28, marginBottom: 24, position: "relative", maxWidth: 400 }}>
          <Search size={18} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: T.text3 }} />
          <input
            type="text"
            placeholder="Search by bank name or account..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px 12px 42px",
              background: T.surface,
              border: `1.5px solid ${T.border}`,
              borderRadius: 12,
              fontWeight: 600,
              fontSize: 13,
              color: T.text,
              outline: "none",
              transition: "border 0.2s",
              boxSizing: "border-box"
            }}
            onFocus={(e) => (e.target.style.borderColor = T.blue)}
            onBlur={(e) => (e.target.style.borderColor = T.border)}
          />
        </div>

        {/* List */}
        {isLoading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", gap: 16 }}>
            <style>{`@keyframes cb-spin{to{transform:rotate(360deg)}}`}</style>
            <Loader2 size={36} color={T.blue} style={{ animation: "cb-spin 1s linear infinite" }} />
            <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 12, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "1px" }}>Loading accounts…</p>
          </div>
        ) : filteredAccounts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 24px", background: T.surface, borderRadius: 16, border: `1px solid ${T.border}` }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: T.blueLight, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Building2 size={28} style={{ color: T.blue }} />
            </div>
            <p style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: T.text, fontSize: 15, marginBottom: 4 }}>
              {search ? "No matching accounts" : "No saved bank accounts found."}
            </p>
            <p style={{ fontWeight: 500, color: T.text2, fontSize: 13 }}>
              {search ? "Try a different search term" : "Use the form on the right to add an account."}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filteredAccounts.map((acc, i) => {
              const color = getBankColor(acc.bank_name);
              const initials = getBankInitials(acc.bank_name);
              const isHover = hoverCard === acc.id;
              const isDeleting = deleteId === acc.id;

              return (
                <div
                  key={acc.id || i}
                  style={{
                    background: T.white,
                    borderRadius: 16,
                    padding: "16px 20px",
                    border: `1.5px solid ${isHover ? T.blue + "40" : T.border}`,
                    boxShadow: isHover ? "0 4px 16px rgba(26,111,255,0.06)" : "0 2px 4px rgba(10,15,30,0.02)",
                    transition: "all 0.2s ease",
                    transform: isHover ? "translateY(-1px)" : "translateY(0)",
                    opacity: isDeleting ? 0.6 : 1,
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    gap: 16
                  }}
                  onMouseEnter={() => setHoverCard(acc.id)}
                  onMouseLeave={() => setHoverCard(null)}
                >
                  {/* Icon */}
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: color + "14",
                    border: `1px solid ${color}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 14,
                    color: color,
                    fontFamily: "'Sora', sans-serif",
                    flexShrink: 0
                  }}>
                    {initials}
                  </div>

                  {/* Bank Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 15, color: T.text, marginBottom: 2 }}>
                      {acc.bank_name || "Unknown Bank"}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <p style={{ fontFamily: "'Roboto Mono', monospace", fontWeight: 600, fontSize: 13, color: T.text2 }}>
                        {acc.account_number || "—"}
                      </p>
                      <span style={{ color: T.border }}>•</span>
                      <p style={{ fontSize: 12, fontWeight: 600, color: T.text2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                        {acc.account_name || "—"}
                      </p>
                      <span style={{ color: T.border }}>•</span>
                      <p style={{ fontSize: 12, fontWeight: 600, color: T.text2, textTransform: "capitalize" }}>
                        {acc.account_type || "Savings"}
                      </p>
                    </div>
                  </div>

                  {/* Badges & Actions */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                    <div style={{ background: T.greenLight, color: T.greenText, borderRadius: 8, padding: "6px 10px", display: "flex", alignItems: "center", gap: 6 }}>
                      <CheckCircle2 size={14} style={{ color: T.greenText }} />
                      <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Verified</span>
                    </div>
                    
                    <button
                      onClick={() => handleDelete(acc.id)}
                      disabled={isDeleting}
                      style={{
                        padding: 8,
                        background: "transparent",
                        border: "none",
                        borderRadius: 8,
                        cursor: isDeleting ? "not-allowed" : "pointer",
                        color: T.text3,
                        transition: "all 0.2s",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = T.redLight; e.currentTarget.style.color = T.red; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.text3; }}
                    >
                      {isDeleting ? <Loader2 size={18} style={{ animation: "cb-spin 1s linear infinite" }} /> : <Trash2 size={18} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Right Column: Form ────────────────────────────────── */}
      <div style={{ padding: "44px 40px", background: T.surface, display: "flex", flexDirection: "column" }}>
        
        <div style={{ background: T.white, borderRadius: 20, padding: "28px", border: `1px solid ${T.border}`, boxShadow: "0 4px 12px rgba(10,15,30,0.03)" }}>
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 18, fontWeight: 700, color: T.text, marginBottom: 4 }}>Add New Account</h2>
          <p style={{ fontSize: 13, color: T.text2, marginBottom: 24, lineHeight: 1.5 }}>
            Enter the details of the bank account you want to save for future withdrawals.
          </p>

          <form onSubmit={handleAddSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {error && (
              <div style={{ padding: "12px 14px", background: T.redLight, color: T.redText, borderRadius: 12, fontSize: 12, fontWeight: 600, border: "1px solid #FECACA", display: "flex", alignItems: "center", gap: 8 }}>
                <AlertCircle size={14} /> {error}
              </div>
            )}

            {/* Bank Name */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>Bank Name</p>
              <div style={{ border: `1.5px solid ${focusedField === "bank" ? T.blue : T.border}`, borderRadius: 12, padding: "14px 16px", background: T.white, transition: "border-color 0.18s" }}>
                <input
                  style={{ width: "100%", border: "none", outline: "none", fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 600, color: T.text, background: "transparent" }}
                  type="text"
                  placeholder="e.g. GTBank"
                  required
                  value={formData.bank_name}
                  onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                  onFocus={() => setFocusedField("bank")}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            {/* Account Number */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>Account Number</p>
              <div style={{ border: `1.5px solid ${focusedField === "accNum" ? T.blue : T.border}`, borderRadius: 12, padding: "14px 16px", background: T.white, transition: "border-color 0.18s" }}>
                <input
                  style={{ width: "100%", border: "none", outline: "none", fontFamily: "'Roboto Mono', monospace", fontSize: 14, fontWeight: 600, color: T.text, background: "transparent", letterSpacing: "1px" }}
                  type="text"
                  placeholder="0123456789"
                  required
                  value={formData.account_number}
                  onChange={(e) => setFormData({ ...formData, account_number: e.target.value.replace(/\D/g, '') })}
                  onFocus={() => setFocusedField("accNum")}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            {/* Account Name */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>Account Name</p>
              <div style={{ border: `1.5px solid ${focusedField === "accName" ? T.blue : T.border}`, borderRadius: 12, padding: "14px 16px", background: T.white, transition: "border-color 0.18s" }}>
                <input
                  style={{ width: "100%", border: "none", outline: "none", fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 600, color: T.text, background: "transparent" }}
                  type="text"
                  placeholder="John Doe"
                  required
                  value={formData.account_name}
                  onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                  onFocus={() => setFocusedField("accName")}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            {/* Account Type */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>Account Type</p>
              <div style={{ display: "flex", gap: 10 }}>
                {["savings", "checking"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, account_type: type })}
                    style={{
                      flex: 1,
                      padding: "12px",
                      borderRadius: 12,
                      border: `1.5px solid ${formData.account_type === type ? T.blue : T.border}`,
                      background: formData.account_type === type ? T.blueLight : T.white,
                      color: formData.account_type === type ? T.blue : T.text2,
                      fontWeight: 600,
                      fontSize: 13,
                      textTransform: "capitalize",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              disabled={submitting}
              type="submit"
              style={{
                marginTop: 8,
                padding: "16px",
                background: submitting ? T.text3 : T.blue,
                color: T.white,
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 14,
                fontFamily: "'Sora', sans-serif",
                border: "none",
                cursor: submitting ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8
              }}
              onMouseEnter={(e) => { if(!submitting) e.currentTarget.style.opacity = "0.9" }}
              onMouseLeave={(e) => { if(!submitting) e.currentTarget.style.opacity = "1" }}
            >
              {submitting ? <><Loader2 size={16} style={{ animation: "cb-spin 1s linear infinite" }} /> Saving...</> : <><Plus size={16} strokeWidth={3} /> Save Account</>}
            </button>
          </form>
        </div>

        {/* Security badge */}
        <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 10, padding: "16px", background: T.white, border: `1px solid ${T.border}`, borderRadius: 16 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: T.greenLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CheckCircle2 size={16} style={{ color: T.green }} />
          </div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: T.text, fontFamily: "'Sora', sans-serif" }}>Secure Storage</p>
            <p style={{ fontSize: 11, color: T.text2, marginTop: 2 }}>Your account details are encrypted</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BankAccounts;

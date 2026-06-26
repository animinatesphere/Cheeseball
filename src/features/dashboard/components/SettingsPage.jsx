import { useState, useEffect } from "react";
import {
  Copy, CheckCircle2, ChevronRight, Shield, Bell,
  Landmark, LogOut, Camera, Check, Eye, EyeOff,
} from "lucide-react";
import { getCurrentUser, getReferralData } from "@/services/api";
import authService from "@/services/authService";

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
};

/* ─── Helpers ────────────────────────────────────────────────── */
const Ico = {
  shield: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.mintGreen} strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
};

function Toggle({ on, onChange }) {
  return (
    <div
      onClick={() => onChange(!on)}
      style={{ width: 44, height: 24, borderRadius: 12, background: on ? T.blue : T.border, cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}
    >
      <div style={{ position: "absolute", top: 3, left: on ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: T.white, transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }} />
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 20, overflow: "hidden" }}>
      {title && (
        <div style={{ padding: "18px 24px", borderBottom: `1px solid ${T.border}` }}>
          <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 700, color: T.text, letterSpacing: "-0.2px" }}>{title}</p>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}

function Row({ icon: Icon, label, value, action, danger, last, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 24px", borderBottom: last ? "none" : `1px solid ${T.border}`, cursor: onClick ? "pointer" : "default", transition: "background 0.12s" }}
      onMouseEnter={e => { if (onClick) e.currentTarget.style.background = T.surface; }}
      onMouseLeave={e => { if (onClick) e.currentTarget.style.background = T.white; }}
    >
      {Icon && (
        <div style={{ width: 34, height: 34, borderRadius: 10, background: danger ? T.redLight : T.surface, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={15} color={danger ? T.red : T.text2} strokeWidth={2} />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: danger ? T.red : T.text, marginBottom: value ? 2 : 0 }}>{label}</p>
        {value && <p style={{ fontSize: 12, color: T.text3, fontWeight: 500 }}>{value}</p>}
      </div>
      {action || (onClick && !action && <ChevronRight size={15} color={T.text3} />)}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
export default function SettingsPage({ onNavigate }) {
  const [copied,  setCopied]  = useState(false);
  const [notifs,  setNotifs]  = useState({ transactions: true, rates: false, promos: true });
  const [user, setUser] = useState(null);
  const [refData, setRefData] = useState(null);

  useEffect(() => {
    getCurrentUser().then(setUser);
    getReferralData().then(setRefData).catch(err => console.error("Referral Error:", err));
  }, []);

  const copyRef = (text) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const name = user?.fullname || "User";
  const initials = user?.email ? user.email.substring(0, 2).toUpperCase() : "CB";
  const verified = !!user?.verified_at;
  const joinedDate = user?.verified_at ? new Date(user.verified_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "Recently";
  const referralCode = refData?.referral_code || user?.referral_code || "N/A";
  const referralLink = refData?.referral_link || (user?.referral_code ? `https://www.cheeseballapp.com/register?ref=${user.referral_code}` : "");
  const totalReferrals = refData?.total_referrals || 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-track{background:transparent;} ::-webkit-scrollbar-thumb{background:${T.border};border-radius:4px;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .fadein{animation:fadeUp 0.3s ease forwards}
        @media (max-width: 768px) {
          .settings-container { padding: 24px 20px 48px !important; }
          .settings-top-bar { padding: 0 20px !important; }
          .ref-row { flex-direction: column !important; }
          .ref-card { padding: 20px !important; }
          .ref-header { flex-direction: column !important; gap: 16px !important; }
          .ref-header div:last-child { text-align: left !important; }
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: T.surface, fontFamily: "'DM Sans', sans-serif", color: T.text, display: "flex", flexDirection: "column" }}>

        {/* Top bar */}
        <div className="settings-top-bar" style={{ background: T.white, borderBottom: `1px solid ${T.border}`, height: 60, padding: "0 40px", display: "flex", alignItems: "center", flexShrink: 0 }}>
          <nav style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 13, color: T.text2, fontWeight: 500, cursor: "pointer" }} onClick={() => onNavigate?.("dashboard")}>Dashboard</span>
            <span style={{ color: T.text3, fontSize: 12 }}>›</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.blue }}>Settings</span>
          </nav>
        </div>

        <div className="settings-container" style={{ flex: 1, maxWidth: 720, width: "100%", margin: "0 auto", padding: "32px 40px 60px", display: "flex", flexDirection: "column", gap: 16 }}>

          {/* ── Profile card ── */}
          <div className="fadein" style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 20, padding: "28px 28px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>

              {/* Avatar */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{ width: 68, height: 68, borderRadius: "50%", background: T.blue, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 700, color: "#fff" }}>{initials}</span>
                </div>
                <div style={{ position: "absolute", bottom: 0, right: 0, width: 22, height: 22, borderRadius: "50%", background: T.surface, border: `2px solid ${T.white}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <Camera size={10} color={T.text2} />
                </div>
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 18, fontWeight: 700, color: T.text, letterSpacing: "-0.4px" }}>{name}</p>
                  {verified && (
                    <div style={{ display: "flex", alignItems: "center", gap: 4, background: T.greenLight, borderRadius: 20, padding: "3px 9px" }}>
                      <Check size={10} color={T.green} strokeWidth={3} />
                      <span style={{ fontSize: 10, fontWeight: 700, color: T.greenText, textTransform: "uppercase", letterSpacing: "0.4px" }}>Verified</span>
                    </div>
                  )}
                </div>
                <p style={{ fontSize: 13, color: T.text2, marginBottom: 3 }}>{user?.email || "Loading..."}</p>
                <p style={{ fontSize: 11, color: T.text3, fontWeight: 500 }}>Member since {joinedDate}</p>
              </div>

            </div>
          </div>

          {/* ── Referral card ── */}
          <div className="ref-card" style={{ background: T.text, borderRadius: 20, padding: "24px 26px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -30, right: -30, width: 140, height: 140, borderRadius: "50%", background: `${T.blue}18`, pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div className="ref-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>Referral programme</p>
                  <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: "-0.3px" }}>
                    Invite friends, earn <span style={{ color: T.blue }}>₦1,000</span> each
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{totalReferrals}</p>
                  <p style={{ fontSize: 11, color: T.text3, marginTop: 2 }}>referrals · ₦0 earned</p>
                </div>
              </div>

              {/* Code */}
              <div className="ref-row" style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 16px" }}>
                  <p style={{ fontSize: 10, color: T.text3, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 3 }}>Your code</p>
                  <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 700, color: T.blue, letterSpacing: "1.5px" }}>{referralCode}</p>
                </div>
                <button
                  onClick={() => copyRef(referralLink)}
                  style={{ display: "flex", alignItems: "center", gap: 7, padding: "12px 18px", background: copied ? T.greenLight : T.blue, border: "none", borderRadius: 12, cursor: "pointer", fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700, color: copied ? T.greenText : "#fff", transition: "all 0.18s", whiteSpace: "nowrap" }}
                >
                  {copied ? <><CheckCircle2 size={14} /> Copied!</> : <><Copy size={14} /> Copy Link</>}
                </button>
              </div>
            </div>
          </div>

          {/* ── Account ── */}
          <SectionCard title="Account">
            <Row label="Full name"  value={name}  onClick={() => {}} />
            <Row label="Email"      value={user?.email || "Loading..."} onClick={() => {}} />
            <Row label="Phone"      value={user?.phone_number || "Not set"} onClick={() => {}} last />
          </SectionCard>

          {/* ── Security ── */}
          <SectionCard title="Security">
            <Row icon={Shield} label="Two-factor authentication" value="Enabled via authenticator app" onClick={() => {}} />
            <Row icon={Eye}    label="Transaction PIN"           value="4-digit PIN set"               onClick={() => {}} last />
          </SectionCard>

          {/* ── Notifications ── */}
          <SectionCard title="Notifications">
            {[
              { key: "transactions", label: "Transaction alerts",    sub: "Get notified on every transaction"      },
              { key: "rates",        label: "Rate updates",          sub: "Alerts when rates change significantly" },
              { key: "promos",       label: "Promotions & updates",  sub: "News, offers and product updates"       },
            ].map(({ key, label, sub }, i, arr) => (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 24px", borderBottom: i === arr.length - 1 ? "none" : `1px solid ${T.border}` }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 2 }}>{label}</p>
                  <p style={{ fontSize: 12, color: T.text3, fontWeight: 500 }}>{sub}</p>
                </div>
                <Toggle on={notifs[key]} onChange={(v) => setNotifs(n => ({ ...n, [key]: v }))} />
              </div>
            ))}
          </SectionCard>

          {/* ── Danger zone ── */}
          <SectionCard>
            <Row icon={LogOut} label="Log out" danger onClick={() => authService.logout()} last />
          </SectionCard>

        </div>

        {/* Footer */}
        <div style={{ borderTop: `1px solid ${T.border}`, padding: "18px 40px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: T.white, flexShrink: 0 }}>
          <Ico.shield />
          <span style={{ fontSize: 12, color: T.text2, fontWeight: 500 }}>Your transaction is secure · </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: T.mintGreen }}>Protected by Cheeseball</span>
        </div>
      </div>
    </>
  );
}

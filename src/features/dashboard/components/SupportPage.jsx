import { useState } from "react";
import {
  Search, ChevronDown, ChevronRight, X, MessageCircle,
  Mail, Phone, FileText, ArrowUpRight, CheckCircle2,
  ShoppingCart, CircleDollarSign, ArrowRightLeft, Wallet,
  Gift, Shield, AlertCircle, Clock, Send, HelpCircle,
  ExternalLink, Landmark,
} from "lucide-react";

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
  orangeText:  "#92400E",
  red:         "#EF4444",
  redLight:    "#FEF2F2",
};

/* ─── FAQ data ───────────────────────────────────────────────── */
const CATEGORIES = [
  { id: "account",      label: "Account",       icon: Shield,          color: T.blue,       bg: T.blueLight,   count: 8  },
  { id: "buy",          label: "Buy Crypto",     icon: ShoppingCart,    color: "#7C3AED",    bg: "#F5F3FF",     count: 6  },
  { id: "sell",         label: "Sell Crypto",    icon: CircleDollarSign,color: T.red,        bg: T.redLight,    count: 9  },
  { id: "swap",         label: "Swap",           icon: ArrowRightLeft,  color: "#0891B2",    bg: "#ECFEFF",     count: 5  },
  { id: "transactions", label: "Transactions",   icon: Landmark,        color: T.greenText,  bg: T.greenLight,  count: 11 },
  { id: "giftcards",    label: "Gift Cards",     icon: Gift,            color: T.orangeText, bg: T.orangeLight, count: 7  },
];

const FAQS = {
  account: [
    { q: "How do I verify my account?",                  a: "Go to Settings → Identity Verification and upload a valid government-issued ID. Verification usually takes 5–10 minutes." },
    { q: "I forgot my password. How do I reset it?",     a: "On the login screen, tap 'Forgot Password', enter your registered email, and follow the reset link we send you." },
    { q: "How do I enable two-factor authentication?",   a: "Go to Settings → Security → Two-Factor Authentication. We support authenticator apps and SMS codes." },
    { q: "Can I change my registered email address?",    a: "Yes. Go to Settings → Account → Email. You will need to verify both your current and new email addresses." },
  ],
  sell: [
    { q: "How does selling crypto work on Cheeseball?",  a: "You select your asset, enter the amount, choose a payout method (bank or NGN wallet), and send the crypto to our broker wallet. Once confirmed by our team, your Naira is paid out." },
    { q: "How long does a sell transaction take?",       a: "Payments are usually processed within 5–30 minutes after we confirm your crypto transfer on the blockchain." },
    { q: "What rate will I get for my crypto?",         a: "Rates are fetched live when you enter your amount. The rate is locked for 5 minutes after you proceed to the send screen." },
    { q: "My sell was rejected. What do I do?",         a: "Check the rejection reason shown on the transaction screen. Common reasons include sending the wrong amount or using the wrong network. Contact support if you already sent funds." },
    { q: "Which bank accounts can I pay out to?",       a: "Any Nigerian bank account registered under your name. You can add and manage accounts in Settings → Payment Methods." },
  ],
  buy: [
    { q: "How do I buy crypto on Cheeseball?",          a: "Go to Buy Crypto, select the asset you want, enter the amount in NGN or crypto, choose your payment method, and complete the payment." },
    { q: "What payment methods are accepted for buying?",a: "We accept bank transfers, debit cards, and NGN wallet balance." },
    { q: "How long does it take to receive my crypto?", a: "Card payments are near-instant. Bank transfers are confirmed within 10–30 minutes of receiving your payment." },
  ],
  transactions: [
    { q: "Where can I see all my transactions?",        a: "Go to Transaction History from the dashboard or the sidebar. You can filter by type, status, and date." },
    { q: "Can I download a receipt for a transaction?", a: "Yes. Open any transaction from History and tap 'Download Receipt' to save a PDF." },
    { q: "A transaction is stuck on pending. Help?",    a: "Pending transactions are usually resolved within 30 minutes. If it's been longer, contact support with your transaction reference." },
    { q: "Why was my transaction failed?",              a: "Transactions fail for various reasons including network issues, wrong amount sent, or payment not received. Check the transaction detail screen for the specific reason." },
  ],
  swap: [
    { q: "What assets can I swap?",                     a: "You can swap between any of the supported crypto assets on Cheeseball. Rates are pulled live at the time of the swap." },
    { q: "Is there a fee for swapping?",                a: "Yes, a 0.5% swap fee applies. This is shown clearly before you confirm the swap." },
  ],
  giftcards: [
    { q: "Which gift card brands do you accept?",       a: "We accept Amazon, iTunes/Apple, Google Play, Steam, and others. More brands are being added regularly." },
    { q: "How do I sell a gift card?",                  a: "Go to Gift Cards → Sell, select the brand, enter the card details and amount, and submit. Payouts go to your NGN wallet." },
    { q: "Why was my gift card rejected?",              a: "Gift cards can be rejected if they are already redeemed, invalid, or from an unsupported region. Contact support with your submission ID for a review." },
  ],
};

const CONTACT_METHODS = [
  {
    icon: MessageCircle,
    label: "Live Chat",
    sub: "Chat with us right now",
    badge: "Online",
    badgeColor: T.greenText,
    badgeBg: T.greenLight,
    color: T.blue,
    bg: T.blueLight,
    action: "Start Chat",
  },
  {
    icon: Mail,
    label: "Email Support",
    sub: "support@cheeseball.io",
    badge: "< 2 hrs",
    badgeColor: T.orangeText,
    badgeBg: T.orangeLight,
    color: "#7C3AED",
    bg: "#F5F3FF",
    action: "Send Email",
  },
  {
    icon: Phone,
    label: "WhatsApp",
    sub: "+234 800 CHEESE",
    badge: "Mon–Sat 8am–8pm",
    badgeColor: T.greenText,
    badgeBg: T.greenLight,
    color: T.green,
    bg: T.greenLight,
    action: "Message Us",
  },
];

/* ─── Sub-components ─────────────────────────────────────────── */

function FaqItem({ q, a, open, onToggle }) {
  return (
    <div style={{ borderBottom: `1px solid ${T.border}` }}>
      <button
        onClick={onToggle}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: 16 }}
      >
        <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 700, color: open ? T.blue : T.text, flex: 1, lineHeight: 1.4 }}>{q}</span>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: open ? T.blue : T.surface, border: `1px solid ${open ? T.blue : T.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.18s" }}>
          <ChevronDown size={14} color={open ? "#fff" : T.text2} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.18s" }} />
        </div>
      </button>
      {open && (
        <div style={{ paddingBottom: 18, paddingRight: 44 }}>
          <p style={{ fontSize: 14, color: T.text2, lineHeight: 1.7 }}>{a}</p>
        </div>
      )}
    </div>
  );
}

function TicketForm({ onClose, onSubmit }) {
  const [form, setForm] = useState({ subject: "", category: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handle = () => {
    if (!form.subject || !form.message) return;
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); onClose(); }, 2000);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(10,15,30,0.4)", backdropFilter: "blur(4px)" }} />
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 520, background: T.white, borderRadius: 24, border: `1.5px solid ${T.border}`, overflow: "hidden", animation: "popIn 0.3s ease" }}>

        <div style={{ padding: "24px 28px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: 11, color: T.text3, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 4 }}>Support</p>
            <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 700, color: T.text }}>Submit a Ticket</p>
          </div>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: 10, background: T.surface, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: T.text2 }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 16 }}>

          {submitted ? (
            <div style={{ padding: "32px", textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: T.greenLight, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <CheckCircle2 size={24} color={T.green} />
              </div>
              <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 6 }}>Ticket submitted!</p>
              <p style={{ fontSize: 13, color: T.text2 }}>We'll get back to you within 2 hours.</p>
            </div>
          ) : (
            <>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "0.7px", display: "block", marginBottom: 8 }}>Subject</label>
                <input
                  type="text"
                  placeholder="Brief description of your issue"
                  value={form.subject}
                  onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                  style={{ width: "100%", border: `1.5px solid ${T.border}`, borderRadius: 12, padding: "12px 16px", fontSize: 14, color: T.text, fontFamily: "'DM Sans', sans-serif", outline: "none", transition: "border-color 0.15s" }}
                  onFocus={e => e.target.style.borderColor = T.blue}
                  onBlur={e => e.target.style.borderColor = T.border}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "0.7px", display: "block", marginBottom: 8 }}>Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  style={{ width: "100%", border: `1.5px solid ${T.border}`, borderRadius: 12, padding: "12px 16px", fontSize: 14, color: form.category ? T.text : T.text3, fontFamily: "'DM Sans', sans-serif", outline: "none", background: T.white, cursor: "pointer" }}
                >
                  <option value="" disabled>Select a category</option>
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "0.7px", display: "block", marginBottom: 8 }}>Message</label>
                <textarea
                  placeholder="Describe your issue in detail. Include transaction references if applicable."
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  rows={5}
                  style={{ width: "100%", border: `1.5px solid ${T.border}`, borderRadius: 12, padding: "12px 16px", fontSize: 14, color: T.text, fontFamily: "'DM Sans', sans-serif", outline: "none", resize: "vertical", transition: "border-color 0.15s", lineHeight: 1.6 }}
                  onFocus={e => e.target.style.borderColor = T.blue}
                  onBlur={e => e.target.style.borderColor = T.border}
                />
              </div>

              <button
                onClick={handle}
                disabled={!form.subject || !form.message}
                style={{ width: "100%", padding: "16px", borderRadius: 14, border: "none", fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 700, cursor: form.subject && form.message ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s", background: form.subject && form.message ? T.blue : "#E8EEFF", color: form.subject && form.message ? "#fff" : T.text3 }}
              >
                <Send size={15} /> Submit Ticket
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
export default function SupportPage({ onNavigate }) {
  const [search,       setSearch]       = useState("");
  const [activeCategory, setActiveCategory] = useState("sell");
  const [openFaq,      setOpenFaq]      = useState(null);
  const [showTicket,   setShowTicket]   = useState(false);

  const currentFaqs = (FAQS[activeCategory] || []).filter(
    f => !search || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
  );

  const allMatchingFaqs = search
    ? Object.entries(FAQS).flatMap(([cat, items]) =>
        items.filter(f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()))
          .map(f => ({ ...f, cat }))
      )
    : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-track{background:transparent;} ::-webkit-scrollbar-thumb{background:${T.border};border-radius:4px;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes popIn{0%{transform:scale(0.95);opacity:0}100%{transform:scale(1);opacity:1}}
        .fadein{animation:fadeUp 0.3s ease forwards}
        .cat-btn:hover{border-color:${T.blue}!important;}
        .contact-card:hover{border-color:${T.blue}!important;transform:translateY(-2px);}
        .ticket-btn:hover{background:${T.blueDark}!important;}
        .ticket-btn:active{transform:scale(0.985)!important;}
        @media (max-width: 900px) {
          .support-container { padding: 24px 20px 48px !important; }
          .support-top-bar { padding: 0 20px !important; }
          .support-hero { padding: 32px 24px !important; }
          .support-hero h1 { font-size: 24px !important; }
          .contact-grid { grid-template-columns: 1fr !important; }
          .faq-grid { grid-template-columns: 1fr !important; }
          .cat-sidebar { display: flex !important; flex-direction: row !important; overflow-x: auto !important; padding: 12px !important; }
          .cat-sidebar p { display: none !important; }
          .cat-btn { width: auto !important; white-space: nowrap !important; }
          .strip-grid { flex-direction: column !important; gap: 16px !important; }
          .strip-item { padding-left: 0 !important; border-left: none !important; }
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: T.surface, fontFamily: "'DM Sans', sans-serif", color: T.text, display: "flex", flexDirection: "column" }}>

        {/* Top bar */}
        <div className="support-top-bar" style={{ background: T.white, borderBottom: `1px solid ${T.border}`, height: 60, padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <nav style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 13, color: T.text2, fontWeight: 500, cursor: "pointer" }} onClick={() => onNavigate?.("dashboard")}>Dashboard</span>
            <span style={{ color: T.text3, fontSize: 12 }}>›</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.blue }}>Support</span>
          </nav>

          {/* Online status */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: T.greenLight, border: `1px solid #A7F3D0`, borderRadius: 20, padding: "5px 12px" }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.green, animation: "pulse 1.8s ease-in-out infinite" }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: T.greenText }}>Support Online</span>
          </div>
        </div>

        <div className="support-container" style={{ flex: 1, maxWidth: 1100, width: "100%", margin: "0 auto", padding: "36px 40px 60px" }}>

          {/* ── Hero ── */}
          <div className="fadein support-hero" style={{ background: T.blue, borderRadius: 24, padding: "44px 48px", marginBottom: 28, position: "relative", overflow: "hidden", textAlign: "center" }}>
            <div style={{ position: "absolute", top: -60, right: -60, width: 260, height: 260, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -80, left: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", border: "1px solid rgba(255,255,255,0.15)" }}>
                <HelpCircle size={24} color="#fff" />
              </div>
              <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 32, fontWeight: 700, color: "#fff", letterSpacing: "-0.8px", marginBottom: 10 }}>
                How can we help you?
              </h1>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", marginBottom: 28, lineHeight: 1.6 }}>
                Search our help centre or browse by category below.
              </p>

              {/* Search bar */}
              <div style={{ maxWidth: 520, margin: "0 auto", position: "relative" }}>
                <Search size={16} style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", color: T.text3 }} />
                <input
                  type="text"
                  placeholder="Search help articles…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ width: "100%", border: "none", borderRadius: 14, padding: "16px 48px 16px 48px", fontSize: 14, color: T.text, fontFamily: "'DM Sans', sans-serif", outline: "none", boxShadow: "0 4px 24px rgba(10,15,30,0.1)" }}
                />
                {search && (
                  <button onClick={() => setSearch("")} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: T.text3, display: "flex" }}>
                    <X size={15} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── Contact methods ── */}
          <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 28 }}>
            {CONTACT_METHODS.map((c) => (
              <div
                key={c.label}
                className="contact-card"
                style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 20, padding: "22px 24px", cursor: "pointer", transition: "all 0.18s" }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 13, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <c.icon size={20} color={c.color} strokeWidth={2} />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: c.badgeColor, background: c.badgeBg, padding: "3px 9px", borderRadius: 20, letterSpacing: "0.3px" }}>{c.badge}</span>
                </div>
                <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 4 }}>{c.label}</p>
                <p style={{ fontSize: 13, color: T.text2, marginBottom: 16 }}>{c.sub}</p>
                <button style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: c.color, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  {c.action} <ExternalLink size={13} />
                </button>
              </div>
            ))}
          </div>

          {/* ── FAQ section ── */}
          <div className="faq-grid" style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 20, alignItems: "start" }}>

            {/* Category sidebar */}
            <div className="cat-sidebar" style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 20, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: T.text3, textTransform: "uppercase", letterSpacing: "0.8px", padding: "6px 12px", marginBottom: 4 }}>Categories</p>
              {CATEGORIES.map((cat) => {
                const active = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    className="cat-btn"
                    onClick={() => { setActiveCategory(cat.id); setOpenFaq(null); setSearch(""); }}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 12px", borderRadius: 12, border: `1.5px solid ${active ? T.blue : "transparent"}`, background: active ? T.blueLight : "transparent", cursor: "pointer", textAlign: "left", transition: "all 0.15s", width: "100%" }}
                  >
                    <div style={{ width: 32, height: 32, borderRadius: 9, background: active ? T.blue : cat.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                      <cat.icon size={15} color={active ? "#fff" : cat.color} strokeWidth={2} />
                    </div>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: active ? T.blue : T.text, flex: 1 }}>{cat.label}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: active ? T.blue : T.text3, background: active ? "rgba(26,111,255,0.12)" : T.surface, padding: "2px 7px", borderRadius: 8 }}>{cat.count}</span>
                  </button>
                );
              })}
            </div>

            {/* FAQ list */}
            <div style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 20, padding: "28px 32px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <div>
                  <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 18, fontWeight: 700, color: T.text, letterSpacing: "-0.3px", marginBottom: 4 }}>
                    {search ? `Results for "${search}"` : CATEGORIES.find(c => c.id === activeCategory)?.label}
                  </h2>
                  <p style={{ fontSize: 13, color: T.text2 }}>
                    {search ? `${allMatchingFaqs?.length || 0} articles found` : `${FAQS[activeCategory]?.length} articles`}
                  </p>
                </div>
                <button
                  className="ticket-btn"
                  onClick={() => setShowTicket(true)}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 18px", borderRadius: 12, border: "none", background: T.blue, color: "#fff", fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.18s", whiteSpace: "nowrap" }}
                >
                  <FileText size={14} /> Submit a Ticket
                </button>
              </div>

              {/* Search results mode */}
              {search && allMatchingFaqs && (
                allMatchingFaqs.length === 0 ? (
                  <div style={{ padding: "40px 0", textAlign: "center" }}>
                    <div style={{ width: 52, height: 52, borderRadius: "50%", background: T.surface, border: `1.5px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                      <AlertCircle size={22} color={T.text3} />
                    </div>
                    <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 6 }}>No results found</p>
                    <p style={{ fontSize: 13, color: T.text2, marginBottom: 20 }}>We couldn't find anything for "{search}". Try different keywords or submit a ticket.</p>
                    <button onClick={() => setShowTicket(true)} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "11px 20px", borderRadius: 12, border: "none", background: T.blue, color: "#fff", fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                      <Send size={14} /> Contact Support
                    </button>
                  </div>
                ) : (
                  <div>
                    {allMatchingFaqs.map((f, i) => (
                      <FaqItem key={i} q={f.q} a={f.a} open={openFaq === `search-${i}`} onToggle={() => setOpenFaq(openFaq === `search-${i}` ? null : `search-${i}`)} />
                    ))}
                  </div>
                )
              )}

              {/* Category mode */}
              {!search && (
                <div>
                  {(FAQS[activeCategory] || []).map((f, i) => (
                    <FaqItem key={i} q={f.q} a={f.a} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
                  ))}
                </div>
              )}

              {/* Still need help nudge */}
              {!search && (
                <div style={{ marginTop: 28, padding: "18px 20px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: T.blueLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <MessageCircle size={16} color={T.blue} />
                    </div>
                    <div>
                      <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 2 }}>Still need help?</p>
                      <p style={{ fontSize: 12, color: T.text2 }}>Our support team is online and ready to assist.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowTicket(true)}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 11, border: `1.5px solid ${T.border}`, background: T.white, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: T.blue, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = T.blueLight; e.currentTarget.style.borderColor = T.blue; }}
                    onMouseLeave={e => { e.currentTarget.style.background = T.white; e.currentTarget.style.borderColor = T.border; }}
                  >
                    Get Help <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── Response time strip ── */}
          <div className="strip-grid" style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 24, padding: "16px 24px", background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 16 }}>
            {[
              { icon: Clock,        label: "Avg. response time",  value: "< 2 hours"   },
              { icon: CheckCircle2, label: "Resolution rate",     value: "98.4%"        },
              { icon: MessageCircle,label: "Support hours",       value: "Mon–Sat 8–8"  },
            ].map(({ icon: Icon, label, value }, i) => (
              <div key={label} className="strip-item" style={{ display: "flex", alignItems: "center", gap: 10, ...(i > 0 ? { paddingLeft: 24, borderLeft: `1px solid ${T.border}` } : {}) }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: T.blueLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={14} color={T.blue} />
                </div>
                <div>
                  <p style={{ fontSize: 11, color: T.text3, fontWeight: 600, marginBottom: 1 }}>{label}</p>
                  <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700, color: T.text }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: `1px solid ${T.border}`, padding: "18px 40px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: T.white, flexShrink: 0 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.mintGreen} strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span style={{ fontSize: 12, color: T.text2, fontWeight: 500 }}>Your transaction is secure · </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: T.mintGreen }}>Protected by Cheeseball</span>
        </div>
      </div>

      {/* Ticket modal */}
      {showTicket && <TicketForm onClose={() => setShowTicket(false)} />}
    </>
  );
}

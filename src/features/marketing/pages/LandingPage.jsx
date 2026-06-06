import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrencies } from "@/services/api";
import { paths } from "@/routes/paths";
import logo from "@/assets/cheese.jpeg";

/* ─── Tokens ─────────────────────────────────────────────────── */
const T = {
  blue: "#1A6FFF",
  blueDark: "#1259D9",
  blueLight: "#EEF3FF",
  text: "#0A0F1E",
  text2: "#6B7A99",
  text3: "#A8B4CC",
  border: "#E8EEFF",
  surface: "#F7F9FF",
  white: "#FFFFFF",
  green: "#00C48C",
  greenLight: "#E6FAF4",
  greenText: "#00966B",
  mintGreen: "#4ADE80",
  orange: "#F59E0B",
  red: "#FF4D4D",
};

/* ─── Asset Metadata ─────────────────────────────────────────── */
const ASSET_META = {
  BTC: { icon: "₿", color: "#F7931A", bg: "#FEF3E2" },
  ETH: { icon: "Ξ", color: "#627EEA", bg: "#EEEFFE" },
  USDT: { icon: "₮", color: "#000100", bg: "#E6F7F2" },
  SOL: { icon: "◎", color: "#9945FF", bg: "#F3EEFF" },
  BNB: { icon: "B", color: "#F0B90B", bg: "#FFFBEB" },
  XRP: { icon: "✕", color: "#00AAE4", bg: "#E8F7FE" },
};

/* ─── Static Data ────────────────────────────────────────────── */
const STATS = [
  { value: "50,000+", label: "Active users" },
  { value: "₦2.4B+", label: "Volume exchanged" },
  { value: "99.9%", label: "Uptime reliability" },
  { value: "< 5 min", label: "Avg. payout time" },
];

const FEATURES = [
  {
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
    title: "Premium Rates",
    body: "We source the best NGN/USD rates in real time so you always get more Naira for your crypto.",
    color: T.blue,
    bg: T.blueLight,
  },
  {
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "Instant Payouts",
    body: "Naira lands in your bank account or NGN wallet in under 5 minutes after we confirm your payment.",
    color: T.green,
    bg: T.greenLight,
  },
  {
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Bank-Grade Security",
    body: "Every transaction is encrypted end-to-end and manually verified by our compliance team.",
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Create your account",
    body: "Sign up in 2 minutes. Verify your identity once and you're ready to exchange.",
  },
  {
    n: "02",
    title: "Select an asset & amount",
    body: "Choose from BTC, USDT, ETH, gift cards and more. Enter how much you want to exchange.",
  },
  {
    n: "03",
    title: "Get paid instantly",
    body: "Send from any wallet or exchange. Once confirmed, your Naira hits your account fast.",
  },
];

const TESTIMONIALS = [
  {
    name: "Chukwuemeka A.",
    role: "Freelancer, Lagos",
    text: "Best rates I've found anywhere in Nigeria. Cheeseball pays out faster than any other platform I've tried.",
    initials: "CA",
    color: "#F7931A",
  },
  {
    name: "Fatima B.",
    role: "Business owner, Abuja",
    text: "I sell USDT almost every week. The process is seamless — I barely have to think about it anymore.",
    initials: "FB",
    color: T.blue,
  },
  {
    name: "Tunde O.",
    role: "Developer, PH",
    text: "Finally a platform that treats gift cards seriously. Amazon, iTunes, Google Play — all at great rates.",
    initials: "TO",
    color: "#26A17B",
  },
];

const GIFTCARDS = [
  "Amazon",
  "iTunes",
  "Google Play",
  "Steam",
  "Xbox",
  "Netflix",
];

const NAV_LINKS = [
  { name: "Features", id: "features" },
  { name: "How it works", id: "how-it-works" },
  { name: "Rates", id: "rates" },
  { name: "Gift Cards", id: "giftcards" },
];

/* ─── Tiny SVG icons ─────────────────────────────────────────── */
const ArrowRight = ({ size = 16, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);
const CheckIcon = ({ color = T.blue }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.8"
    strokeLinecap="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const ShieldIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke={T.mintGreen}
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

/* ═══════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const navigate = useNavigate();
  const [tickIdx, setTickIdx] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);

  const onGetStarted = () => navigate(paths.signup);
  const onLogin = () => navigate(paths.login);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await getCurrencies();
        if (Array.isArray(res)) {
          const mapped = res
            .filter((c) => c.symbol !== "NGN")
            .map((c) => ({
              sym: c.symbol,
              name: c.name,
              icon: ASSET_META[c.symbol]?.icon || "₿",
              color: ASSET_META[c.symbol]?.color || T.blue,
              bg: ASSET_META[c.symbol]?.bg || T.blueLight,
              rate: `₦${c.sell_rate.toLocaleString()}`,
              change:
                (Math.random() > 0.5 ? "+" : "-") +
                (Math.random() * 5).toFixed(1) +
                "%",
            }));
          setRates(mapped);
        }
      } catch (e) {
        console.error("Failed to fetch rates:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchRates();
  }, []);

  useEffect(() => {
    if (rates.length === 0) return;
    const interval = setInterval(
      () => setTickIdx((i) => (i + 1) % rates.length),
      2800,
    );
    return () => clearInterval(interval);
  }, [rates]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const tickRate = rates[tickIdx];
  const displayRates =
    rates.length > 0
      ? rates
      : [
          {
            sym: "BTC",
            name: "Bitcoin",
            icon: "₿",
            color: "#F7931A",
            bg: "#FEF3E2",
            rate: "₦97,400,000",
            change: "+2.4%",
          },
          {
            sym: "ETH",
            name: "Ethereum",
            icon: "Ξ",
            color: "#627EEA",
            bg: "#EEEFFE",
            rate: "₦4,872,000",
            change: "-1.0%",
          },
          {
            sym: "USDT",
            name: "Tether",
            icon: "₮",
            color: "#26A17B",
            bg: "#E6F7F2",
            rate: "₦1,648",
            change: "+0.0%",
          },
          {
            sym: "SOL",
            name: "Solana",
            icon: "◎",
            color: "#9945FF",
            bg: "#F3EEFF",
            rate: "₦236,800",
            change: "+4.1%",
          },
        ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        body{font-family:'DM Sans',sans-serif;color:${T.text};background:${T.white};overflow-x:hidden;}
        ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-track{background:transparent;} ::-webkit-scrollbar-thumb{background:${T.border};border-radius:4px;}

        @keyframes float{0%,100%{transform:translateY(0px)}50%{transform:translateY(-10px)}}
        @keyframes float2{0%,100%{transform:translateY(0px)}50%{transform:translateY(-6px)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes ticker{0%{opacity:0;transform:translateY(8px)}15%{opacity:1;transform:translateY(0)}85%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-8px)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}

        .fadein{animation:fadeUp 0.6s ease forwards;}
        .fadein-2{animation:fadeUp 0.6s 0.15s ease both;}
        .fadein-3{animation:fadeUp 0.6s 0.3s ease both;}
        .fadein-4{animation:fadeUp 0.6s 0.45s ease both;}
        .float{animation:float 4s ease-in-out infinite;}
        .float2{animation:float2 5s 1s ease-in-out infinite;}
        .ticker{animation:ticker 2.8s ease-in-out infinite;}
        .blink{animation:blink 1.8s ease-in-out infinite;}

        .nav-link{font-size:14px;font-weight:500;color:${T.text2};cursor:pointer;transition:color 0.15s;text-decoration:none;}
        .nav-link:hover{color:${T.text};}

        .btn-primary{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;border-radius:14px;border:none;background:${T.blue};color:#fff;font-family:'Sora',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:all 0.18s;letter-spacing:0.2px;text-decoration:none;justify-content:center;}
        .btn-primary:hover{background:${T.blueDark};transform:translateY(-1px);box-shadow:0 8px 24px rgba(26,111,255,0.25);}
        .btn-primary:active{transform:scale(0.98);}
        .btn-ghost{display:inline-flex;align-items:center;gap:8px;padding:14px 24px;border-radius:14px;border:1.5px solid ${T.border};background:${T.white};color:${T.text};font-family:'Sora',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:all 0.18s;text-decoration:none;justify-content:center;}
        .btn-ghost:hover{border-color:${T.blue};color:${T.blue};background:${T.blueLight};}

        .feature-card:hover{border-color:${T.blue}!important;transform:translateY(-4px);box-shadow:0 16px 40px rgba(26,111,255,0.07)!important;}
        .rate-row:hover{background:${T.surface}!important;}
        .step-card:hover .step-num{background:${T.blue}!important;color:#fff!important;}
        .testimonial-card:hover{border-color:${T.blue}!important;}

        .hero-pill{display:inline-flex;align-items:center;gap:8px;background:${T.blueLight};border:1px solid ${T.blueDark}22;border-radius:20px;padding:6px 14px;margin-bottom:24px;min-height:32px;}
        
        .section-container { max-width: 1280px; margin: 0 auto; padding: 80px 64px; }
        
        @media (max-width: 1024px) {
          .section-container { padding: 60px 24px; }
          .hero-grid { grid-template-columns: 1fr !important; gap: 60px !important; text-align: center; padding-top: 40px !important; }
          .hero-content { display: flex; flex-direction: column; align-items: center; }
          .hero-content p { max-width: 500px !important; }
          .hero-visual { display: flex; justify-content: center; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 40px !important; padding: 40px 24px !important; }
          .feature-grid, .steps-grid, .testimonial-grid { grid-template-columns: 1fr 1fr !important; gap: 20px !important; }
          .rates-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          nav { padding: 0 24px !important; }
          .nav-links { display: none !important; }
          .hero-btns { justify-content: center !important; }
        }

        @media (max-width: 768px) {
          .feature-grid, .steps-grid, .testimonial-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .stats-grid div { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.12); padding-bottom: 24px; }
          .stats-grid div:last-child { border-bottom: none; }
          .cta-banner { grid-template-columns: 1fr !important; padding: 40px !important; text-align: center; }
          .cta-banner div { align-items: center !important; }
          .footer-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .hero-h1 { font-size: 42px !important; }
          .hero-pill { margin-bottom: 16px; }
          .hero-visual { padding-bottom: 0 !important; }
          .float2 { display: none !important; }
          .hero-btns { justify-content: center !important; width: 100%; }
        }
      `}</style>

      <div style={{ background: T.white }}>
        {/* ── NAVBAR ── */}
        <nav
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            background: scrolled ? "rgba(255,255,255,0.92)" : T.white,
            backdropFilter: scrolled ? "blur(12px)" : "none",
            borderBottom: `1px solid ${scrolled ? T.border : "transparent"}`,
            transition: "all 0.25s",
            padding: "0 64px",
            height: 68,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
            }}
            onClick={() => navigate(paths.home)}
          >
            <img
              src={logo}
              alt="Logo"
              style={{ height: 40, width: 40, borderRadius: "50%" }}
            />
            <div
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: 20,
                fontWeight: 800,
                color: T.text,
                letterSpacing: "-0.5px",
              }}
            >
              Cheese<span style={{ color: T.blue }}>ball</span>
            </div>
          </div>
          <div
            className="nav-links"
            style={{ display: "flex", alignItems: "center", gap: 36 }}
          >
            {NAV_LINKS.map((l) => (
              <a key={l.id} href={`#${l.id}`} className="nav-link">
                {l.name}
              </a>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              className="btn-ghost"
              style={{ padding: "10px 18px", fontSize: 13 }}
              onClick={onLogin}
            >
              Login
            </button>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section
          className="hero-grid"
          style={{
            padding: "80px 64px 0",
            maxWidth: 1280,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 520px",
            gap: 60,
            alignItems: "center",
            minHeight: "85vh",
          }}
        >
          {/* Left */}
          <div className="hero-content">
            <div className="fadein hero-pill">
              <div
                className="blink"
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: T.green,
                  flexShrink: 0,
                }}
              />
              <span
                className="ticker"
                style={{ fontSize: 12, fontWeight: 600, color: T.blue }}
              >
                {tickRate
                  ? `Live: ${tickRate.sym} at ${tickRate.rate}`
                  : "Live in Nigeria · 50,000+ exchangers"}
              </span>
            </div>

            <h1
              className="fadein-2 hero-h1"
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: 58,
                fontWeight: 800,
                color: T.text,
                letterSpacing: "-2.5px",
                lineHeight: 1.06,
                marginBottom: 20,
              }}
            >
              Buy, Sell &amp; Swap
              <br />
              Crypto <span style={{ color: T.blue }}>Instantly.</span>
            </h1>

            <p
              className="fadein-3"
              style={{
                fontSize: 17,
                color: T.text2,
                lineHeight: 1.75,
                maxWidth: 460,
                marginBottom: 36,
              }}
            >
              The most reliable platform to exchange BTC, USDT and Gift Cards in
              Nigeria. Enjoy premium rates, automated payouts, and bank-grade
              security.
            </p>

            <div
              className="fadein-4 hero-btns"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 40,
                flexWrap: "wrap",
              }}
            >
              <button
                className="btn-primary"
                onClick={onGetStarted}
                style={{ fontSize: 15, padding: "16px 32px" }}
              >
                Get started <ArrowRight color="#fff" />
              </button>
              <a
                href="#rates"
                className="btn-ghost"
                style={{ fontSize: 15, padding: "16px 28px" }}
              >
                See our rates
              </a>
            </div>

            {/* Trust chips */}
            <div
              className="fadein-4 hero-btns"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                flexWrap: "wrap",
              }}
            >
              {["No hidden fees", "Instant NGN payouts", "KYC secured"].map(
                (t) => (
                  <div
                    key={t}
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: T.greenLight,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CheckIcon color={T.green} />
                    </div>
                    <span
                      style={{ fontSize: 13, fontWeight: 500, color: T.text2 }}
                    >
                      {t}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Right — hero visual */}
          <div
            className="hero-visual"
            style={{ position: "relative", paddingBottom: 60 }}
          >
            {/* Main rate card */}
            <div
              className="float"
              style={{
                background: T.white,
                borderRadius: 24,
                border: `1.5px solid ${T.border}`,
                boxShadow: "0 32px 80px rgba(10,15,30,0.1)",
                padding: "28px",
                position: "relative",
                zIndex: 2,
                width: "100%",
                maxWidth: 420,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <p
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    fontSize: 14,
                    fontWeight: 700,
                    color: T.text,
                  }}
                >
                  Live rates
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    background: T.greenLight,
                    borderRadius: 20,
                    padding: "4px 10px",
                  }}
                >
                  <div
                    className="blink"
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: T.green,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: T.greenText,
                    }}
                  >
                    Updated live
                  </span>
                </div>
              </div>

              {displayRates.slice(0, 4).map((r) => (
                <div
                  key={r.sym}
                  className="rate-row"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 10px",
                    borderRadius: 12,
                    transition: "background 0.12s",
                    cursor: "default",
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 11,
                      background: r.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "'Sora', sans-serif",
                      fontSize: 14,
                      fontWeight: 700,
                      color: r.color,
                      flexShrink: 0,
                    }}
                  >
                    {r.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontFamily: "'Sora', sans-serif",
                        fontSize: 13,
                        fontWeight: 700,
                        color: T.text,
                      }}
                    >
                      {r.sym}
                    </p>
                    <p style={{ fontSize: 11, color: T.text3, marginTop: 1 }}>
                      {r.name}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p
                      style={{
                        fontFamily: "'Sora', sans-serif",
                        fontSize: 13,
                        fontWeight: 700,
                        color: T.text,
                      }}
                    >
                      {r.rate}
                    </p>
                    <p
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: r.change.startsWith("+") ? T.greenText : T.red,
                        marginTop: 1,
                      }}
                    >
                      {r.change}
                    </p>
                  </div>
                </div>
              ))}

              <button
                className="btn-primary"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  marginTop: 16,
                  fontSize: 14,
                }}
                onClick={onGetStarted}
              >
                Start exchanging now <ArrowRight color="#fff" />
              </button>
            </div>

            {/* Floating badge 1 — payout */}
            <div
              className="float2"
              style={{
                position: "absolute",
                bottom: 20,
                left: -32,
                background: T.white,
                borderRadius: 16,
                border: `1.5px solid ${T.border}`,
                boxShadow: "0 12px 40px rgba(10,15,30,0.1)",
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                zIndex: 3,
                minWidth: 200,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: T.greenLight,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={T.green}
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    fontSize: 14,
                    fontWeight: 700,
                    color: T.text,
                  }}
                >
                  ₦124,850
                </p>
                <p style={{ fontSize: 11, color: T.text2, marginTop: 1 }}>
                  Paid out · just now
                </p>
              </div>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: T.green,
                  marginLeft: 4,
                }}
              />
            </div>

            {/* Floating badge 2 — security */}
            <div
              className="float2"
              style={{
                position: "absolute",
                top: -20,
                right: -20,
                background: T.text,
                borderRadius: 14,
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                zIndex: 3,
                boxShadow: "0 8px 32px rgba(10,15,30,0.18)",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  background: `${T.blue}22`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={T.blue}
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  256-bit encrypted
                </p>
                <p style={{ fontSize: 10, color: T.text3, marginTop: 1 }}>
                  Bank-grade security
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="section-container" style={{ paddingTop: 0 }}>
          <div
            className="stats-grid"
            style={{
              background: T.blue,
              borderRadius: 28,
              padding: "48px 64px",
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 0,
            }}
          >
            {STATS.map((s, i) => (
              <div
                key={s.label}
                style={{
                  textAlign: "center",
                  padding: "0 24px",
                  borderRight:
                    i < STATS.length - 1
                      ? "1px solid rgba(255,255,255,0.12)"
                      : "none",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    fontSize: 40,
                    fontWeight: 800,
                    color: "#fff",
                    letterSpacing: "-1.5px",
                    lineHeight: 1,
                    marginBottom: 8,
                  }}
                >
                  {s.value}
                </p>
                <p
                  style={{
                    fontSize: 14,
                    color: "rgba(255,255,255,0.55)",
                    fontWeight: 500,
                  }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="features" className="section-container">
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: T.blue,
                textTransform: "uppercase",
                letterSpacing: "1.2px",
                marginBottom: 12,
              }}
            >
              Why Cheeseball
            </p>
            <h2
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: 40,
                fontWeight: 800,
                color: T.text,
                letterSpacing: "-1.2px",
                lineHeight: 1.1,
                marginBottom: 14,
              }}
            >
              Built for serious exchangers
            </h2>
            <p
              style={{
                fontSize: 16,
                color: T.text2,
                maxWidth: 480,
                margin: "0 auto",
                lineHeight: 1.7,
              }}
            >
              Everything you need to exchange crypto safely and profitably —
              without the complexity.
            </p>
          </div>

          <div
            className="feature-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 20,
            }}
          >
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="feature-card"
                style={{
                  background: T.white,
                  border: `1.5px solid ${T.border}`,
                  borderRadius: 22,
                  padding: "32px",
                  transition: "all 0.2s",
                  boxShadow: "0 2px 12px rgba(10,15,30,0.04)",
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    background: f.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: f.color,
                    marginBottom: 22,
                  }}
                >
                  {f.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    fontSize: 19,
                    fontWeight: 700,
                    color: T.text,
                    letterSpacing: "-0.3px",
                    marginBottom: 10,
                  }}
                >
                  {f.title}
                </h3>
                <p style={{ fontSize: 14, color: T.text2, lineHeight: 1.7 }}>
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works" style={{ background: T.surface }}>
          <div className="section-container">
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: T.blue,
                  textTransform: "uppercase",
                  letterSpacing: "1.2px",
                  marginBottom: 12,
                }}
              >
                Simple process
              </p>
              <h2
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 40,
                  fontWeight: 800,
                  color: T.text,
                  letterSpacing: "-1.2px",
                  lineHeight: 1.1,
                }}
              >
                Exchange in 3 steps
              </h2>
            </div>

            <div
              className="steps-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 24,
              }}
            >
              {STEPS.map((s, i) => (
                <div
                  key={i}
                  className="step-card"
                  style={{ position: "relative" }}
                >
                  <div
                    style={{
                      background: T.white,
                      border: `1.5px solid ${T.border}`,
                      borderRadius: 22,
                      padding: "30px 28px",
                      height: "100%",
                    }}
                  >
                    <div
                      className="step-num"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 44,
                        height: 44,
                        borderRadius: 13,
                        background: T.surface,
                        border: `1.5px solid ${T.border}`,
                        fontFamily: "'Sora', sans-serif",
                        fontSize: 13,
                        fontWeight: 800,
                        color: T.text2,
                        marginBottom: 20,
                        transition: "all 0.2s",
                      }}
                    >
                      {s.n}
                    </div>
                    <h3
                      style={{
                        fontFamily: "'Sora', sans-serif",
                        fontSize: 18,
                        fontWeight: 700,
                        color: T.text,
                        letterSpacing: "-0.3px",
                        marginBottom: 10,
                      }}
                    >
                      {s.title}
                    </h3>
                    <p
                      style={{ fontSize: 14, color: T.text2, lineHeight: 1.7 }}
                    >
                      {s.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── RATES TABLE ── */}
        <section id="rates" className="section-container">
          <div
            className="rates-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 60,
              alignItems: "center",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: T.blue,
                  textTransform: "uppercase",
                  letterSpacing: "1.2px",
                  marginBottom: 12,
                }}
              >
                Our rates
              </p>
              <h2
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 40,
                  fontWeight: 800,
                  color: T.text,
                  letterSpacing: "-1.2px",
                  lineHeight: 1.1,
                  marginBottom: 16,
                }}
              >
                The best NGN rates
                <br />
                in Nigeria.
              </h2>
              <p
                style={{
                  fontSize: 15,
                  color: T.text2,
                  lineHeight: 1.75,
                  marginBottom: 28,
                }}
              >
                We update our rates every 60 seconds to make sure you're always
                getting the most competitive price for your crypto and gift
                cards.
              </p>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {[
                  "Rates refreshed every 60 seconds",
                  "No hidden markups or fees",
                  "Rate locked for 5 minutes after you proceed",
                ].map((t) => (
                  <div
                    key={t}
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: T.blueLight,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <CheckIcon />
                    </div>
                    <span style={{ fontSize: 14, color: T.text2 }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                background: T.white,
                border: `1.5px solid ${T.border}`,
                borderRadius: 24,
                overflow: "hidden",
                boxShadow: "0 8px 40px rgba(10,15,30,0.06)",
              }}
            >
              <div
                style={{
                  padding: "18px 24px",
                  borderBottom: `1px solid ${T.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    fontSize: 14,
                    fontWeight: 700,
                    color: T.text,
                  }}
                >
                  Current rates
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    background: T.greenLight,
                    borderRadius: 20,
                    padding: "4px 10px",
                  }}
                >
                  <div
                    className="blink"
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: T.green,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: T.greenText,
                    }}
                  >
                    Live
                  </span>
                </div>
              </div>
              <div style={{ padding: "8px 12px" }}>
                {loading ? (
                  <div
                    style={{
                      padding: 40,
                      textAlign: "center",
                      color: T.text3,
                      fontSize: 14,
                    }}
                  >
                    Loading rates...
                  </div>
                ) : (
                  displayRates.map((r, i) => (
                    <div
                      key={r.sym}
                      className="rate-row"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "13px 10px",
                        borderRadius: 12,
                        borderBottom:
                          i < displayRates.length - 1
                            ? `1px solid ${T.border}`
                            : "none",
                        transition: "background 0.12s",
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          background: r.bg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "'Sora', sans-serif",
                          fontSize: 13,
                          fontWeight: 700,
                          color: r.color,
                          flexShrink: 0,
                        }}
                      >
                        {r.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            fontFamily: "'Sora', sans-serif",
                            fontSize: 13,
                            fontWeight: 700,
                            color: T.text,
                          }}
                        >
                          {r.sym}{" "}
                          <span
                            style={{
                              fontWeight: 500,
                              color: T.text3,
                              fontSize: 11,
                            }}
                          >
                            {r.name}
                          </span>
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p
                          style={{
                            fontFamily: "'Sora', sans-serif",
                            fontSize: 13,
                            fontWeight: 700,
                            color: T.text,
                          }}
                        >
                          {r.rate}
                        </p>
                        <p
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: r.change.startsWith("+")
                              ? T.greenText
                              : T.red,
                            marginTop: 1,
                          }}
                        >
                          {r.change}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── GIFT CARDS ── */}
        <section id="giftcards" style={{ background: T.surface }}>
          <div className="section-container" style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: T.blue,
                textTransform: "uppercase",
                letterSpacing: "1.2px",
                marginBottom: 12,
              }}
            >
              Gift cards
            </p>
            <h2
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: 40,
                fontWeight: 800,
                color: T.text,
                letterSpacing: "-1.2px",
                lineHeight: 1.1,
                marginBottom: 14,
              }}
            >
              Sell your gift cards for Naira
            </h2>
            <p
              style={{
                fontSize: 15,
                color: T.text2,
                maxWidth: 460,
                margin: "0 auto 44px",
                lineHeight: 1.7,
              }}
            >
              Upload your gift card image and get paid instantly. We accept the
              most popular brands.
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 14,
                flexWrap: "wrap",
              }}
            >
              {GIFTCARDS.map((g) => (
                <div
                  key={g}
                  style={{
                    background: T.white,
                    border: `1.5px solid ${T.border}`,
                    borderRadius: 16,
                    padding: "16px 28px",
                    fontFamily: "'Sora', sans-serif",
                    fontSize: 14,
                    fontWeight: 700,
                    color: T.text,
                    boxShadow: "0 2px 8px rgba(10,15,30,0.04)",
                  }}
                >
                  {g}
                </div>
              ))}
              <div
                style={{
                  background: T.blueLight,
                  border: `1.5px solid ${T.border}`,
                  borderRadius: 16,
                  padding: "16px 28px",
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  color: T.blue,
                }}
              >
                +14 more →
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="section-container">
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: T.blue,
                textTransform: "uppercase",
                letterSpacing: "1.2px",
                marginBottom: 12,
              }}
            >
              Testimonials
            </p>
            <h2
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: 40,
                fontWeight: 800,
                color: T.text,
                letterSpacing: "-1.2px",
                lineHeight: 1.1,
              }}
            >
              Loved by exchangers across Nigeria
            </h2>
          </div>

          <div
            className="testimonial-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 20,
            }}
          >
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="testimonial-card"
                style={{
                  background: T.white,
                  border: `1.5px solid ${T.border}`,
                  borderRadius: 22,
                  padding: "28px",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ display: "flex", marginBottom: 6, gap: 3 }}>
                  {[...Array(5)].map((_, j) => (
                    <svg
                      key={j}
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill={T.orange}
                      stroke="none"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p
                  style={{
                    fontSize: 14,
                    color: T.text2,
                    lineHeight: 1.75,
                    marginBottom: 24,
                    marginTop: 10,
                  }}
                >
                  "{t.text}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: t.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "'Sora', sans-serif",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#fff",
                      flexShrink: 0,
                    }}
                  >
                    {t.initials}
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <p
                      style={{
                        fontFamily: "'Sora', sans-serif",
                        fontSize: 13,
                        fontWeight: 700,
                        color: T.text,
                      }}
                    >
                      {t.name}
                    </p>
                    <p style={{ fontSize: 12, color: T.text3, marginTop: 1 }}>
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section className="section-container" style={{ paddingTop: 0 }}>
          <div
            className="cta-banner"
            style={{
              background: T.text,
              borderRadius: 28,
              padding: "72px 80px",
              display: "grid",
              gridTemplateColumns: "1fr auto",
              alignItems: "center",
              gap: 40,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -80,
                right: 200,
                width: 300,
                height: 300,
                borderRadius: "50%",
                background: `${T.blue}18`,
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -60,
                right: 60,
                width: 200,
                height: 200,
                borderRadius: "50%",
                background: `${T.blue}10`,
                pointerEvents: "none",
              }}
            />
            <div style={{ position: "relative", zIndex: 1 }}>
              <h2
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 44,
                  fontWeight: 800,
                  color: T.white,
                  letterSpacing: "-1.5px",
                  lineHeight: 1.1,
                  marginBottom: 14,
                }}
              >
                Ready to start exchanging?
              </h2>
              <p
                style={{
                  fontSize: 16,
                  color: T.text3,
                  lineHeight: 1.7,
                  maxWidth: 480,
                }}
              >
                Join 50,000+ Nigerians already using Cheeseball for the best
                crypto and gift card rates.
              </p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                alignItems: "flex-end",
                position: "relative",
                zIndex: 1,
                flexShrink: 0,
              }}
            >
              <button
                className="btn-primary"
                style={{
                  fontSize: 15,
                  padding: "16px 36px",
                  whiteSpace: "nowrap",
                }}
                onClick={onGetStarted}
              >
                Create free account <ArrowRight color="#fff" size={16} />
              </button>
              <p style={{ fontSize: 12, color: T.text3, textAlign: "center" }}>
                No fees to sign up · Instant setup
              </p>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer
          style={{
            borderTop: `1px solid ${T.border}`,
            padding: "48px 64px 32px",
          }}
        >
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div
              className="footer-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
                gap: 48,
                marginBottom: 48,
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 12,
                  }}
                >
                  <img
                    src={logo}
                    alt="Logo"
                    style={{ height: 32, width: 32, borderRadius: "50%" }}
                  />
                  <div
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      fontSize: 20,
                      fontWeight: 800,
                      color: T.text,
                      letterSpacing: "-0.5px",
                    }}
                  >
                    Cheese<span style={{ color: T.blue }}>ball</span>
                  </div>
                </div>
                <p
                  style={{
                    fontSize: 14,
                    color: T.text2,
                    lineHeight: 1.7,
                    maxWidth: 240,
                    marginBottom: 18,
                  }}
                >
                  Nigeria's most reliable platform for exchanging crypto and
                  gift cards.
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <ShieldIcon />
                  <span
                    style={{ fontSize: 12, fontWeight: 500, color: T.text3 }}
                  >
                    Protected by Cheeseball
                  </span>
                </div>
              </div>

              {[
                {
                  title: "Product",
                  links: [
                    { name: "Buy Crypto", path: paths.dashboardBuy },
                    { name: "Sell Crypto", path: paths.dashboardSell },
                    { name: "Swap", path: paths.dashboardSwap },
                    { name: "Gift Cards", path: "#giftcards" },
                    { name: "Rates", path: "#rates" },
                  ],
                },
                {
                  title: "Company",
                  links: [
                    { name: "About us", path: paths.about },
                    { name: "Blog", path: "#" },
                    { name: "Careers", path: paths.careers },
                    { name: "Press", path: paths.press },
                  ],
                },
                {
                  title: "Support",
                  links: [
                    { name: "Help centre", path: "#" },
                    { name: "Contact us", path: "#" },
                    { name: "Privacy policy", path: paths.privacy },
                    { name: "Terms of use", path: paths.terms },
                  ],
                },
              ].map((col) => (
                <div key={col.title}>
                  <p
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      fontSize: 13,
                      fontWeight: 700,
                      color: T.text,
                      marginBottom: 16,
                      letterSpacing: "-0.2px",
                    }}
                  >
                    {col.title}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 11,
                    }}
                  >
                    {col.links.map((l) => (
                      <a
                        key={l.name}
                        href={l.path}
                        style={{
                          fontSize: 13,
                          color: T.text2,
                          cursor: "pointer",
                          textDecoration: "none",
                          transition: "color 0.15s",
                        }}
                        onMouseEnter={(e) => (e.target.style.color = T.text)}
                        onMouseLeave={(e) => (e.target.style.color = T.text2)}
                      >
                        {l.name}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                borderTop: `1px solid ${T.border}`,
                paddingTop: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 20,
              }}
            >
              <p style={{ fontSize: 12, color: T.text3 }}>
                © {new Date().getFullYear()} Cheeseball. All rights reserved.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: T.green,
                  }}
                />
                <span style={{ fontSize: 12, color: T.text2, fontWeight: 500 }}>
                  All systems operational
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

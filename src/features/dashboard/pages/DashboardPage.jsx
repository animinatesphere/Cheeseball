import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { Bell, Menu, Search, LayoutDashboard, ShoppingCart, CircleDollarSign, ArrowRightLeft, ArrowDownLeft, Gift, History, HelpCircle, Settings, ChevronRight, X, ShieldCheck } from "lucide-react";
import { createTransaction, createGiftCardTrade, getCurrentUser } from "@/services/api";

import CurrencyRates from "../components/CurrencyRates";
import CurrencyDetail from "../components/CurrencyDetail";
import ConvertFlow from "../flows/swap/ConvertFlow";
import AwaitingDeposit from "../flows/transaction/AwaitingDeposit";
import BuyFlow from "../flows/buy/BuyFlow";
import PaymentSuccessModal from "../flows/transaction/PaymentSuccessModal";
import AddressBook from "../components/AddressBook";
import SupportPage from "../components/SupportPage";
import HistoryPage from "../components/HistoryPage";
import SellCryptocurrency from "../flows/sell/SellCryptocurrency";
import SwapGiftCard from "../flows/swap/SwapGiftCard";
import GiftCardUpload from "../flows/gift-card/GiftCardUpload";
import SettingsPage from "../components/SettingsPage";
import DepositFlow from "../flows/deposit/DepositFlow";
import WithdrawalFlow from "../flows/withdrawal/WithdrawalFlow";
import KYCVerification from "../components/KYCVerification";

/* ─── Design tokens ─── */
const T = {
  blue:        "#1A6FFF",
  blueDark:    "#1259D9",
  blueLight:   "#EEF3FF",
  blueMid:     "#C2D6FF",
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
  orangeText:  "#92400E",
};

const NAV_ITEMS = [
  { id: "dashboard",     icon: LayoutDashboard,  label: "Dashboard"  },
  { id: "buy",           icon: ShoppingCart,     label: "Buy Crypto" },
  { id: "sell",          icon: CircleDollarSign, label: "Sell Crypto"},
  { id: "swap",          icon: ArrowRightLeft,   label: "Swap"       },
  { id: "deposit",       icon: ArrowDownLeft,    label: "Deposit"    },
  { id: "giftcard-swap", icon: Gift,             label: "Gift Cards" },
  { id: "history",       icon: History,          label: "History"    },
  { id: "kyc",           icon: ShieldCheck,      label: "KYC Verify" },
  { id: "support",       icon: HelpCircle,       label: "Support"    },
  { id: "account",       icon: Settings,         label: "Settings"   },
];

/* ─── Sidebar Component ─── */
const Sidebar = ({ onNavigate, collapsed, mobileOpen, setMobileOpen, initials }) => {
  const location = useLocation();
  const currentPage = location.pathname.split("/").pop() || "dashboard";

  return (
    <>
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(10,15,30,0.4)", backdropFilter: "blur(4px)", zIndex: 60, animation: "fadeIn 0.2s ease" }}
        />
      )}

      <aside style={{
        position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 70,
        width: collapsed ? 64 : 240,
        background: T.white,
        borderRight: `1px solid ${T.border}`,
        display: "flex", flexDirection: "column",
        transition: "width 0.25s ease, transform 0.25s ease",
        transform: mobileOpen ? "translateX(0)" : (window.innerWidth < 1024 && !mobileOpen ? "translateX(-100%)" : "translateX(0)"),
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{ padding: collapsed ? "20px 0" : "20px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 10, justifyContent: collapsed ? "center" : "flex-start" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: T.blue, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 16, color: "#fff" }}>b</span>
          </div>
          {!collapsed && (
            <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 16, color: T.text, letterSpacing: "-0.4px", whiteSpace: "nowrap" }}>
              Cheese<span style={{ color: T.blue }}>ball</span>
            </span>
          )}
          {mobileOpen && (
            <button onClick={() => setMobileOpen(false)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: T.text3, padding: 4 }}>
              <X size={18} />
            </button>
          )}
        </div>

        <nav style={{ flex: 1, padding: "16px 10px", display: "flex", flexDirection: "column", gap: 2, overflowY: "auto" }}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.id || (item.id === "dashboard" && ["dashboard", "detail"].includes(currentPage));
            return (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setMobileOpen(false); }}
                title={collapsed ? item.label : ""}
                style={{
                  display: "flex", alignItems: "center", gap: collapsed ? 0 : 10,
                  justifyContent: collapsed ? "center" : "flex-start",
                  padding: collapsed ? "10px 0" : "10px 14px",
                  borderRadius: 12, border: "none", cursor: "pointer",
                  background: active ? T.blue : "transparent",
                  color: active ? "#fff" : T.text2,
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
                  transition: "all 0.15s", width: "100%", textAlign: "left",
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = T.surface; e.currentTarget.style.color = T.text; }}}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.text2; }}}
              >
                <Icon size={17} strokeWidth={active ? 2.5 : 2} style={{ flexShrink: 0 }} />
                {!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}
                {!collapsed && active && <ChevronRight size={14} style={{ opacity: 0.6 }} />}
              </button>
            );
          })}
        </nav>

        {!collapsed && (
          <div style={{ padding: "12px 10px", borderTop: `1px solid ${T.border}` }}>
            <div
              onClick={() => onNavigate("account")}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, background: T.surface, border: `1px solid ${T.border}`, cursor: "pointer", transition: "border-color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = T.blue}
              onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
            >
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: T.blue, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 11, color: "#fff" }}>{initials}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: T.text, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>My Account</p>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.green }} />
                  <p style={{ fontSize: 10, color: T.text3, fontWeight: 600, margin: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>Verified</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

const CurrencyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [showModal, setShowModal] = useState(null);
  const [transactionData, setTransactionData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Global layout state
  const [user, setUser] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => { getCurrentUser().then(setUser); }, []);

  const handleContinue = async (extraData = {}) => {
    setLoading(true);
    try {
      const finalData = { ...transactionData, ...extraData };
      const isGiftCard = finalData.type === 'giftcard' || !!finalData.cardName;

      if (isGiftCard) {
        const { error } = await createGiftCardTrade({
          card_type: finalData.cardName || 'Gift Card',
          amount: parseFloat(finalData.fromAmount),
          fiat_amount: parseFloat(finalData.toAmount),
          front_image_url: finalData.frontImage, 
          back_image_url: finalData.backImage,   
          screenshot_url: finalData.screenshotUrl,
          bank_name: finalData.bankName,
          bank_account_number: finalData.accountNumber,
          bank_account_name: finalData.accountName,
          promo_code: finalData.promoCode,
          promo_benefit: finalData.promoBenefit || 0,
          status: 'pending'
        });
        if (error) throw error;
      } else {
        const { error } = await createTransaction({
          exchange_id: `ID:${Math.random().toString(36).substr(2, 10).toUpperCase()}`,
          type: finalData.type || 'sell',
          status: 'waiting',
          from_amount: parseFloat(finalData.fromAmount),
          to_amount: parseFloat(finalData.toAmount),
          from_currency_id: finalData.fromCurrencyId,
          to_currency_id: finalData.toCurrencyId,
          from_token_network: finalData.type === 'giftcard' ? finalData.cardName : finalData.fromCurrency,
          to_token_network: finalData.toCurrency,
          screenshot_url: finalData.screenshot_url,
          payment_method: finalData.paymentMethod || 'manual',
          wallet_address: finalData.wallet_address || '',
          bank_name: finalData.bankName,
          bank_account_number: finalData.accountNumber,
          bank_account_name: finalData.accountName,
          promo_code: finalData.promoCode,
          promo_benefit: finalData.promoBenefit || 0
        });
        if (error) throw error;
      }
      setShowModal("payment-success");
    } catch (err) {
      console.error("Failed to save transaction:", err);
      alert("An error occurred: " + (err.message || "Please contact support."));
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (path) => {
    navigate(`/currency-change/${path}`);
  };

  const handleBack = () => {
    navigate("/currency-change/dashboard");
  };

  const initials = user?.email ? user.email.substring(0, 2).toUpperCase() : "CB";
  const username = user?.email?.split("@")[0] || "User";

  // Dynamic routing display
  const currentPageTitle = (() => {
    const p = location.pathname.split("/").pop();
    const nav = NAV_ITEMS.find(n => n.id === p);
    if (nav) return nav.label;
    if (p === "detail") return "Asset Details";
    if (p === "giftcard-upload") return "Upload Gift Card";
    if (p === "withdrawal-details") return "Withdrawal";
    return "Dashboard";
  })();

  const sidebarWidth = collapsed ? 64 : 240;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'DM Sans',sans-serif;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:#E8EEFF;border-radius:4px;}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
        .fadein{animation:fadeUp 0.3s ease forwards}
        .blink{animation:blink 1.8s ease-in-out infinite}
        @media (max-width: 768px) {
          .dash-header { padding: 0 16px !important; }
          .dash-main { padding: 20px 16px 40px !important; }
          .dash-header-welcome { display: none !important; }
        }
      `}</style>

      <div style={{ display: "flex", height: "100vh", background: T.surface, fontFamily: "'DM Sans', sans-serif", overflow: "hidden" }}>
        
        {/* SIDEBAR */}
        <div className="hidden lg:block">
          <Sidebar
            onNavigate={handleNavigation}
            collapsed={collapsed}
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
            initials={initials}
          />
        </div>
        <div className="lg:hidden">
           <Sidebar
            onNavigate={handleNavigation}
            collapsed={false}
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
            initials={initials}
          />
        </div>

        {/* MAIN LAYOUT */}
        <div className="flex-1 flex flex-col overflow-hidden transition-all duration-250 ease-in-out" style={{ lg: { marginLeft: sidebarWidth } }}>
          {/* Workaround for inline style margin left for desktop view */}
          <style>{`
            @media (min-width: 1024px) {
              .main-layout { margin-left: ${sidebarWidth}px; }
            }
            .nav-btn:hover:not(.active){background:${T.surface}!important;color:${T.text}!important;}
          `}</style>

          <div className="main-layout flex-1 flex flex-col overflow-hidden transition-all duration-300">
            {/* TOP BAR */}
            <header className="dash-header" style={{ background: T.white, borderBottom: `1px solid ${T.border}`, height: 64, padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, zIndex: 50 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <button className="lg:hidden" onClick={() => setMobileOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: T.text2, padding: 4 }}>
                  <Menu size={20} />
                </button>
                <button
                  className="hidden lg:flex"
                  onClick={() => setCollapsed(v => !v)}
                  style={{ width: 34, height: 34, borderRadius: 10, background: T.surface, border: `1px solid ${T.border}`, alignItems: "center", justifyContent: "center", cursor: "pointer", color: T.text2, transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = T.blueLight; e.currentTarget.style.color = T.blue; }}
                  onMouseLeave={e => { e.currentTarget.style.background = T.surface; e.currentTarget.style.color = T.text2; }}
                >
                  <Menu size={16} />
                </button>
                <div>
                  <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 18, fontWeight: 700, color: T.text, letterSpacing: "-0.4px", lineHeight: 1 }}>{currentPageTitle}</h1>
                  <p className="dash-header-welcome" style={{ fontSize: 12, color: T.text2, marginTop: 3, fontWeight: 500 }}>Welcome back, {username} 👋</p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="hidden md:flex" style={{ position: "relative", alignItems: "center" }}>
                  <Search size={14} style={{ position: "absolute", left: 12, color: T.text3 }} />
                  <input
                    type="text"
                    placeholder="Search assets…"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, paddingLeft: 34, paddingRight: 14, paddingTop: 9, paddingBottom: 9, fontSize: 13, color: T.text, fontFamily: "'DM Sans', sans-serif", outline: "none", width: 220, transition: "border-color 0.15s" }}
                    onFocus={e => e.target.style.borderColor = T.blue}
                    onBlur={e => e.target.style.borderColor = T.border}
                  />
                </div>
                <button style={{ position: "relative", width: 38, height: 38, borderRadius: 10, background: T.white, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <Bell size={17} color={T.text2} />
                  <span style={{ position: "absolute", top: 9, right: 9, width: 7, height: 7, borderRadius: "50%", background: T.blue, border: "2px solid #fff" }} />
                </button>
                <button
                  onClick={() => handleNavigation("account")}
                  style={{ width: 38, height: 38, borderRadius: 10, background: T.blue, display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer" }}
                >
                  <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 12, color: "#fff" }}>{initials}</span>
                </button>
              </div>
            </header>

            {/* ROUTE CONTENT WRAPPER */}
            <main style={{ flex: 1, overflowY: "auto", position: "relative" }}>
              <Routes>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={
                  <div className="dash-main" style={{ padding: "28px 32px 48px" }}>
                    <CurrencyRates
                      searchQuery={searchQuery}
                      onSelectCurrency={(cur) => { setSelectedCurrency(cur); navigate("/currency-change/detail"); }}
                      onNavigate={handleNavigation}
                    />
                  </div>
                } />
                <Route path="detail" element={
                  <div className="dash-main" style={{ padding: "28px 32px 48px" }}>
                    <CurrencyDetail
                      currency={selectedCurrency}
                      onBack={handleBack}
                      onExchange={() => navigate("/currency-change/swap")}
                    />
                  </div>
                } />
                <Route path="swap" element={
                  <ConvertFlow
                    onBack={handleBack}
                    onNavigate={handleNavigation}
                  />
                } />
                <Route path="confirm" element={<Navigate to="/currency-change/swap" replace />} />
                <Route path="awaiting" element={
                  <AwaitingDeposit 
                    transactionData={transactionData} 
                    onBack={handleBack} 
                    onContinue={(data) => {
                      const updatedData = { ...transactionData, ...data };
                      setTransactionData(updatedData);
                      if (updatedData.type === 'sell') navigate("/currency-change/withdrawal-details");
                      else handleContinue(updatedData);
                    }}
                  />
                } />
                <Route path="buy" element={
                  <BuyFlow onBack={handleBack} onComplete={handleContinue} />
                } />
                <Route path="deposit" element={
                  <DepositFlow onBack={handleBack} onNavigate={handleNavigation} />
                } />
                <Route path="sell" element={
                  <SellCryptocurrency
                    onBack={handleBack}
                    onNavigate={handleNavigation}
                  />
                } />
                <Route path="giftcard-swap" element={
                  <SwapGiftCard onNavigate={handleNavigation} />
                } />
                <Route path="giftcard-upload" element={
                  <GiftCardUpload
                    transactionData={transactionData}
                    onBack={() => navigate("/currency-change/giftcard-swap")}
                    onContinue={(data) => { setTransactionData(prev => ({ ...prev, ...data })); navigate("/currency-change/withdrawal-details"); }}
                  />
                } />
                <Route path="withdrawal-details" element={
                  <WithdrawalFlow
                    onBack={handleBack}
                    onNavigate={handleNavigation}
                  />
                } />
                <Route path="history" element={<HistoryPage onNavigate={handleNavigation} />} />
                <Route path="kyc" element={<KYCVerification onNavigate={handleNavigation} />} />
                <Route path="account" element={<SettingsPage onNavigate={handleNavigation} />} />
                <Route path="support" element={<SupportPage onNavigate={handleNavigation} />} />
                <Route path="address-book" element={<div className="dash-main" style={{ padding: "28px 32px 48px" }}><AddressBook onBack={() => navigate("/currency-change/support")} /></div>} />
              </Routes>
            </main>

          </div>
        </div>

        {showModal === "payment-success" && (
          <PaymentSuccessModal
            onClose={() => { setShowModal(null); navigate("/currency-change/dashboard"); }}
          />
        )}
      </div>
    </>
  );
};

export default CurrencyPage;

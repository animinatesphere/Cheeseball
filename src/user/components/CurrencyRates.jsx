import React, { useState, useEffect } from "react";
import {
  Bell,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  ArrowDownLeft,
  ArrowUpRight,
  Send,
  ShoppingCart,
  CircleDollarSign,
  ArrowRightLeft,
  Wallet,
  Gift,
  ChevronRight,
  CheckCircle2,
  BarChart2,
  Copy,
  Sparkles,
  LayoutDashboard,
  History,
  Settings,
  Coins,
  Search,
  Star,
  HelpCircle,
  Menu,
  X,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

/* ── helpers ─────────────────────────────────────────────────── */
const fmt = (n) =>
  new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

const fmtCompact = (n) =>
  new Intl.NumberFormat("en-NG", { notation: "compact", maximumFractionDigits: 1 }).format(n);

/* ── static data ─────────────────────────────────────────────── */
const MOCK_ASSETS = [
  { symbol: "BTC", name: "Bitcoin",  balance: 0.00412, balanceLabel: "0.00412 BTC", valueNGN: 387_500, change: +2.41, color: "#F7931A", bg: "#FEF3E2", icon: "₿" },
  { symbol: "USDT", name: "Tether",  balance: 245.5,   balanceLabel: "245.50 USDT", valueNGN: 392_800, change: +0.04, color: "#26A17B", bg: "#E6F7F2", icon: "₮" },
  { symbol: "ETH", name: "Ethereum", balance: 0.12,    balanceLabel: "0.12 ETH",    valueNGN: 584_640, change: -1.03, color: "#627EEA", bg: "#EEEFFE", icon: "Ξ" },
  { symbol: "NGN", name: "Naira",    balance: 142_000,  balanceLabel: "₦142,000",    valueNGN: 142_000, change: 0,    color: "#2563EB", bg: "#EFF6FF", icon: "₦" },
];

const MOCK_TXN = [
  { id: 1, type: "Received BTC",  method: "Crypto",        amount: "+₦58,400",  date: "Today, 10:02 AM",  status: "completed", positive: true  },
  { id: 2, type: "Sold USDT",     method: "Bank Transfer",  amount: "+₦120,000", date: "Yesterday, 3:45 PM", status: "completed", positive: true  },
  { id: 3, type: "Bought ETH",    method: "Card",           amount: "−₦75,200",  date: "Apr 18, 9:11 AM",  status: "pending",   positive: false },
  { id: 4, type: "Transfer",      method: "Internal",       amount: "−₦30,000",  date: "Apr 17, 6:22 PM",  status: "failed",    positive: false },
  { id: 5, type: "Gift Card Sale",method: "Amazon Gift",    amount: "+₦45,000",  date: "Apr 16, 2:10 PM",  status: "completed", positive: true  },
];

const MARKET = [
  { symbol: "BTC",  name: "Bitcoin",  price: "₦94,050,000", change: +2.41, mktCap: "₦71.2T", vol: "₦2.1T",  color: "#F7931A", icon: "₿" },
  { symbol: "ETH",  name: "Ethereum", price: "₦4,872,000",  change: -1.03, mktCap: "₦8.5T",  vol: "₦890B", color: "#627EEA", icon: "Ξ" },
  { symbol: "USDT", name: "Tether",   price: "₦1,600",      change: +0.04, mktCap: "₦15.8T", vol: "₦5.2T",  color: "#26A17B", icon: "₮" },
  { symbol: "SOL",  name: "Solana",   price: "₦236,800",    change: +4.12, mktCap: "₦1.9T",  vol: "₦340B", color: "#9945FF", icon: "◎" },
  { symbol: "BNB",  name: "BNB",      price: "₦976,000",    change: -0.68, mktCap: "₦5.8T",  vol: "₦210B", color: "#F0B90B", icon: "⬡" },
];

const STATUS_CFG = {
  completed: { dot: "bg-emerald-500", label: "Completed", text: "text-emerald-700", bg: "bg-emerald-50 border-emerald-100" },
  pending:   { dot: "bg-amber-400",   label: "Pending",   text: "text-amber-700",   bg: "bg-amber-50 border-amber-100"   },
  failed:    { dot: "bg-red-500",     label: "Failed",    text: "text-red-700",     bg: "bg-red-50 border-red-100"       },
};

const NAV_ITEMS = [
  { id: "rates",    icon: LayoutDashboard, label: "Dashboard" },
  { id: "buy",      icon: ShoppingCart,    label: "Buy Crypto" },
  { id: "sell",     icon: CircleDollarSign,label: "Sell Crypto" },
  { id: "swap",     icon: ArrowRightLeft,  label: "Swap" },
  { id: "giftcard-swap", icon: Gift,       label: "Gift Cards" },
  { id: "history",  icon: History,         label: "History" },
  { id: "support",  icon: HelpCircle,      label: "Support" },
  { id: "account",  icon: Settings,        label: "Settings" },
];

const QUICK_ACTIONS = [
  { label: "Buy Crypto",  icon: ShoppingCart,    color: "#2563EB", bg: "#EFF6FF", page: "buy"       },
  { label: "Sell Crypto", icon: CircleDollarSign,color: "#7C3AED", bg: "#F5F3FF", page: "sell"      },
  { label: "Swap",        icon: ArrowRightLeft,  color: "#0891B2", bg: "#ECFEFF", page: "swap"      },
  { label: "Withdraw",    icon: Wallet,          color: "#059669", bg: "#ECFDF5", page: "withdrawal-details" },
  { label: "Gift Cards",  icon: Gift,            color: "#DC2626", bg: "#FEF2F2", page: "giftcard-swap" },
  { label: "Earn",        icon: Star,            color: "#D97706", bg: "#FFFBEB", page: "support"   },
];

/* ── SIDEBAR ─────────────────────────────────────────────────── */
const Sidebar = ({ currentPage, onNavigate, collapsed, setCollapsed, user, mobileOpen, setMobileOpen }) => {
  const initials = user?.email ? user.email.substring(0, 2).toUpperCase() : "CB";

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-slate-100 transition-all duration-300 z-[70] flex flex-col 
          ${collapsed ? "w-16" : "w-64"} 
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          shrink-0 dm-sans`}
        style={{ boxShadow: "4px 0 24px rgba(0,0,0,0.04)" }}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 px-5 py-6 border-b border-slate-50 ${collapsed ? "justify-center" : ""}`}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-200 shrink-0">
            <span className="text-white sora font-black text-lg leading-none">b</span>
          </div>
          {!collapsed && (
            <span className="sora font-extrabold text-slate-900 text-lg tracking-tight whitespace-nowrap">
              Cheese<span className="text-blue-600">ball</span>
            </span>
          )}
          {/* Mobile close button */}
          <button onClick={() => setMobileOpen(false)} className="lg:hidden ml-auto p-2 text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.id ||
              (item.id === "history" && currentPage === "history") ||
              (item.id === "rates" && ["rates", "detail"].includes(currentPage));
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  if (window.innerWidth < 1024) setMobileOpen(false);
                }}
                title={collapsed ? item.label : ""}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 group ${
                  active
                    ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                } ${collapsed ? "justify-center" : ""}`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${active ? "text-white" : "text-slate-400 group-hover:text-slate-600"}`} strokeWidth={active ? 2.5 : 2} />
                {!collapsed && <span>{item.label}</span>}
                {active && !collapsed && <ChevronRight className="ml-auto w-4 h-4 opacity-70" />}
              </button>
            );
          })}
        </nav>

        {/* User pill */}
        {!collapsed && (
          <div className="p-4 border-t border-slate-50">
            <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 cursor-pointer group transition-all" onClick={() => onNavigate("account")}>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 border-2 border-white shadow-sm">
                <span className="text-white sora font-bold text-xs">{initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-extrabold text-slate-800 truncate">{user?.email || "user@cheeseball.io"}</p>
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-emerald-500" />
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Verified VIP</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

/* ── MAIN AREA ─────────────────────────────────────────────── */
const CurrencyRates = ({ onSelectCurrency, onNavigate }) => {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [user, setUser] = useState(null);
  const [copied, setCopied] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeMarketTab, setActiveMarketTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUser(session.user);
    });
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText("CHEESE2025");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalBalance = MOCK_ASSETS.reduce((s, a) => s + a.valueNGN, 0);
  const totalChange = +1.87;
  const initials = user?.email ? user.email.substring(0, 2).toUpperCase() : "CB";

  const filteredMarket = MARKET.filter(
    (m) =>
      m.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden dm-sans">
      {/* ── SIDEBAR ─────────────────────────────────────────── */}
      <Sidebar
        currentPage="rates"
        onNavigate={onNavigate}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        user={user}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* ── MAIN AREA ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden relative">

        {/* Top Bar */}
        <header className="bg-white border-b border-slate-100 px-4 lg:px-8 py-4 flex items-center justify-between shrink-0 z-50">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={() => setSidebarCollapsed((v) => !v)}
              className="hidden lg:flex w-9 h-9 items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-xl transition-all"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div>
              <h1 className="sora text-slate-900 font-extrabold text-lg lg:text-xl leading-none">Dashboard</h1>
              <p className="text-slate-400 text-xs mt-1 font-bold">Welcome back, {user?.email?.split('@')[0] || "User"} 👋</p>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            {/* Search */}
            <div className="relative hidden md:flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search assets..."
                className="bg-slate-50 border border-slate-100 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50 transition-all w-48 lg:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Notifications */}
            <button className="relative w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm">
              <Bell className="w-5 h-5 text-slate-600" strokeWidth={2} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
            </button>

            {/* Avatar */}
            <button
              onClick={() => onNavigate("account")}
              className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-100 hover:scale-105 transition-transform border-2 border-white"
            >
              <span className="text-white sora font-extrabold text-xs">{initials}</span>
            </button>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">

            {/* ── ROW 1: Hero Balance + Quick Actions ────────── */}
            <div className="grid grid-cols-12 gap-4 lg:gap-8">

              {/* Hero Balance Card */}
              <div
                className="col-span-12 lg:col-span-8 relative rounded-[2rem] overflow-hidden p-6 lg:p-10"
                style={{
                  background: "linear-gradient(145deg, #2563EB 0%, #1E40AF 100%)",
                  boxShadow: "0 24px 48px -12px rgba(37,99,235,0.45)",
                }}
              >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl -ml-20 -mb-20" />

                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
                    <div>
                      <p className="text-blue-100/60 text-xs font-bold uppercase tracking-[0.2em] mb-3">
                        Total Balance
                      </p>
                      <div className="flex items-center gap-4">
                        <span className="text-white sora font-black text-3xl lg:text-5xl tracking-tight leading-none font-numbers">
                          {balanceVisible ? `₦${fmt(totalBalance)}` : "₦ ••••••••"}
                        </span>
                        <button
                          onClick={() => setBalanceVisible((v) => !v)}
                          className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all border border-white/10 backdrop-blur-md"
                        >
                          {balanceVisible
                            ? <Eye className="w-5 h-5 text-white/80" />
                            : <EyeOff className="w-5 h-5 text-white/80" />}
                        </button>
                      </div>
                      
                      <div className={`inline-flex items-center gap-1.5 mt-5 px-3 py-1.5 rounded-xl text-xs font-black sora ${totalChange >= 0 ? "bg-emerald-400/20 text-emerald-300" : "bg-red-400/20 text-red-300"}`}>
                        {totalChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {totalChange >= 0 ? "+" : ""}{totalChange}% 
                        <span className="text-white/40 ml-1 font-bold">vs last month</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                       <div className="bg-white/10 rounded-2xl px-5 py-3 border border-white/10 backdrop-blur-sm">
                          <p className="text-blue-100/40 text-[10px] font-bold uppercase tracking-widest mb-1">Active Assets</p>
                          <p className="text-white sora font-black text-lg font-numbers">{MOCK_ASSETS.length}</p>
                       </div>
                       <div className="bg-white/10 rounded-2xl px-5 py-3 border border-white/10 backdrop-blur-sm">
                          <p className="text-blue-100/40 text-[10px] font-bold uppercase tracking-widest mb-1">Monthly Gain</p>
                          <p className="text-emerald-400 sora font-black text-lg font-numbers">+₦82.4K</p>
                       </div>
                    </div>
                  </div>

                  {/* Primary Actions */}
                  <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
                    {[
                      { label: "Buy",     icon: ShoppingCart,    page: "buy",      primary: true  },
                      { label: "Sell",    icon: CircleDollarSign,page: "sell",     primary: false },
                      { label: "Swap",    icon: ArrowRightLeft,  page: "swap",     primary: false },
                      { label: "Receive", icon: ArrowDownLeft,   page: "buy-address", primary: false },
                    ].map((a) => {
                      const Icon = a.icon;
                      return (
                        <button
                          key={a.label}
                          onClick={() => onNavigate(a.page)}
                          className={`flex items-center gap-2.5 h-12 lg:h-14 px-6 rounded-2xl font-bold text-sm transition-all duration-300 whitespace-nowrap active:scale-95
                            ${a.primary 
                              ? "bg-white text-blue-700 shadow-xl shadow-blue-900/30 hover:bg-slate-50" 
                              : "bg-white/10 hover:bg-white/20 text-white border border-white/10"}`}
                        >
                          <Icon className="w-5 h-5" strokeWidth={2.5} />
                          {a.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Referral Panel */}
              <div className="col-span-12 lg:col-span-4 bg-slate-900 rounded-[2rem] p-8 lg:p-10 relative overflow-hidden flex flex-col justify-between group border border-slate-800 shadow-2xl">
                 <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                 <div className="relative z-10">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-6">
                       <Sparkles className="text-blue-400 w-6 h-6" />
                    </div>
                    <h2 className="sora text-white font-black text-2xl lg:text-3xl leading-tight mb-2 tracking-tight">
                       Invite & <br />
                       <span className="text-blue-400">Earn ₦5,000</span>
                    </h2>
                    <p className="text-slate-400 text-sm font-bold leading-relaxed mb-8">
                       Help your friends join CheeseBall and get rewarded instantly.
                    </p>
                 </div>
                 
                 <div className="relative z-10">
                    <button 
                      onClick={handleCopy}
                      className="w-full bg-slate-800/80 hover:bg-slate-800 text-white rounded-2xl p-4 flex items-center justify-between group/btn transition-all border border-slate-700/50"
                    >
                       <span className="font-mono font-bold text-blue-400 tracking-widest text-sm">CHEESE2025</span>
                       <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest group-hover/btn:text-white">
                          {copied ? "Copied" : "Copy"}
                          {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                       </div>
                    </button>
                 </div>
              </div>
            </div>

            {/* ── ROW 2: Quick Grid ──────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
               {QUICK_ACTIONS.map((qa) => (
                 <button
                   key={qa.label}
                   onClick={() => onNavigate(qa.page)}
                   className="bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-blue-200 transition-all group flex flex-col items-center gap-4 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1"
                 >
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110" style={{ background: qa.bg }}>
                       <qa.icon className="w-6 h-6" style={{ color: qa.color }} strokeWidth={2} />
                    </div>
                    <span className="text-xs font-black text-slate-800 uppercase tracking-widest">{qa.label}</span>
                 </button>
               ))}
            </div>

            {/* ── ROW 3: Asset Details ────────────────────────── */}
            <div className="grid grid-cols-12 gap-4 lg:gap-8">
               {/* Assets Table */}
               <div className="col-span-12 xl:col-span-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                  <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                     <h2 className="sora font-black text-slate-900 text-lg uppercase tracking-tight">Portfolio Assets</h2>
                     <button className="text-blue-600 sora font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5 hover:gap-2.5 transition-all">
                        Deep Dive <ChevronRight size={14} />
                     </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead>
                           <tr className="bg-slate-50/50 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                              <th className="px-8 py-4">Asset</th>
                              <th className="px-4 py-4 text-right">Balance</th>
                              <th className="px-4 py-4 text-right">Value (₦)</th>
                              <th className="px-8 py-4 text-right">24h Gain</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                           {MOCK_ASSETS.map((asset) => (
                              <tr 
                                key={asset.symbol} 
                                className="group cursor-pointer hover:bg-slate-50/70 transition-colors"
                                onClick={() => onSelectCurrency({ symbol: asset.symbol, name: asset.name })}
                              >
                                 <td className="px-8 py-5">
                                    <div className="flex items-center gap-4">
                                       <div 
                                         className="w-11 h-11 rounded-2xl flex items-center justify-center sora font-black text-lg border shadow-sm transition-transform group-hover:scale-105"
                                         style={{ background: asset.bg, color: asset.color, borderColor: asset.color + '20' }}
                                       >
                                          {asset.icon}
                                       </div>
                                       <div>
                                          <p className="sora font-black text-slate-900 group-hover:text-blue-600 transition-colors">{asset.symbol}</p>
                                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{asset.name}</p>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-4 py-5 text-right font-numbers">
                                    <p className="text-sm font-bold text-slate-700">{asset.balanceLabel}</p>
                                 </td>
                                 <td className="px-4 py-5 text-right font-numbers">
                                    <p className="sora font-black text-slate-900 leading-none mb-1">₦{fmtCompact(asset.valueNGN)}</p>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Market Value</p>
                                 </td>
                                 <td className="px-8 py-5 text-right">
                                    <div className={`sora font-black text-xs inline-flex items-center gap-1 px-3 py-1.5 rounded-xl ${asset.change >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                                       {asset.change > 0 ? "+" : ""}{asset.change.toFixed(2)}%
                                    </div>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>

               {/* Recent Transactions List */}
               <div className="col-span-12 xl:col-span-4 flex flex-col gap-4 lg:gap-8">
                  <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 flex-1">
                     <div className="flex items-center justify-between mb-8">
                        <h2 className="sora font-black text-slate-900 text-lg uppercase tracking-tight">Live History</h2>
                        <button onClick={() => onNavigate("history")} className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                           <History size={16} />
                        </button>
                     </div>

                     <div className="space-y-6">
                        {MOCK_TXN.map((txn) => {
                           const cfg = STATUS_CFG[txn.status];
                           return (
                              <div key={txn.id} className="flex items-center justify-between group cursor-pointer">
                                 <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 bg-slate-50 rounded-2xl flex items-center justify-center relative transition-colors group-hover:bg-blue-50">
                                       {txn.positive 
                                          ? <ArrowDownLeft className="text-emerald-500 w-5 h-5" /> 
                                          : <ArrowUpRight className="text-slate-400 w-5 h-5 group-hover:text-blue-400" />}
                                       <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${cfg.dot}`} />
                                    </div>
                                    <div>
                                       <p className="sora font-black text-slate-900 text-sm leading-tight mb-0.5">{txn.type}</p>
                                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{txn.date}</p>
                                    </div>
                                 </div>
                                 <div className="text-right font-numbers">
                                    <p className={`sora font-black text-sm mb-1 ${txn.positive ? "text-emerald-600" : "text-slate-800"}`}>
                                       {txn.amount}
                                    </p>
                                    <p className={`text-[9px] font-black uppercase tracking-widest ${cfg.text}`}>{cfg.label}</p>
                                 </div>
                              </div>
                           );
                        })}
                     </div>
                  </div>

                  {/* Market Micro Card */}
                  <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-8 border border-blue-500/30 shadow-xl shadow-blue-900/20 group cursor-pointer hover:rotate-1 transition-all">
                     <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-md">
                           <BarChart2 className="text-white w-6 h-6" />
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full">
                           <Coins className="w-3 h-3 text-amber-400" />
                           <span className="text-[9px] font-black text-white uppercase tracking-widest">Market Up • 2.4%</span>
                        </div>
                     </div>
                     <h3 className="sora font-black text-white text-xl leading-tight mb-2">View Global <br />Market Rates</h3>
                     <p className="text-blue-100/60 font-bold text-xs mb-8">Real-time data for 200+ crypto pairs</p>
                     <div className="flex items-center -space-x-3">
                        {MARKET.slice(0, 4).map((m, i) => (
                           <div key={m.symbol} className="w-8 h-8 rounded-full border-2 border-blue-600 flex items-center justify-center sora font-bold text-[10px] bg-slate-900 text-white" style={{ zIndex: 4-i }}>
                              {m.icon}
                           </div>
                        ))}
                        <div className="w-8 h-8 rounded-full border-2 border-blue-600 bg-white/10 backdrop-blur-md flex items-center justify-center text-[8px] font-black text-white z-0">
                           +15
                        </div>
                        <span className="pl-6 text-white/40 font-black text-[10px] uppercase tracking-widest">Institutional Feed</span>
                     </div>
                  </div>
               </div>
            </div>

          </div>
        </main>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CurrencyRates;

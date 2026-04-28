import React, { useState, useEffect } from "react";
import { fetchTopCurrencies } from "../../utils/cryptoApi";
import {
  Bell,
  Search,
  ChevronRight,
  ChevronDown,
  Info,
  Wallet,
  Building2,
  CreditCard,
  Plus,
  X,
} from "lucide-react";

/* ── Mock Data ─────────────────────────────────────────────── */
const ASSETS = [
  { symbol: "BTC",  name: "Bitcoin",  price: "$64,280",  change: "+2.14%", color: "#F7931A", bg: "#FEF3E2", icon: "₿", selected: true  },
  { symbol: "ETH",  name: "Ethereum", price: "$3,140",   change: "-0.87%", color: "#627EEA", bg: "#EEEFFE", icon: "Ξ", selected: false },
  { symbol: "USDT", name: "Tether",   price: "$1.001",   change: "+0.01%", color: "#26A17B", bg: "#E6F7F2", icon: "₮", selected: false },
  { symbol: "SOL",  name: "Solana",   price: "$148.20",  change: "+4.56%", color: "#9945FF", bg: "#F1E9FF", icon: "◎", selected: false },
  { symbol: "BNB",  name: "BNB",      price: "$572.40",  change: "+1.33%", color: "#F0B90B", bg: "#FEF8E6", icon: "⬡", selected: false },
  { symbol: "XRP",  name: "XRP",      price: "$0.621",   change: "-1.08%", color: "#000000", bg: "#E6E6E6", icon: "✕", selected: false },
];

const RECENT = [
  { id: 1, symbol: "BTC",  name: "Bitcoin",  amount: "₦80,000",  date: "Apr 11 • Market", crypto: "+0.00124 BTC", color: "#F7931A", bg: "#FEF3E2" },
  { id: 2, symbol: "ETH",  name: "Ethereum", amount: "₦120,000", date: "Apr 8 • Market",  crypto: "+0.038 ETH",   color: "#627EEA", bg: "#EEEFFE" },
  { id: 3, symbol: "USDT", name: "Tether",   amount: "₦50,000",  date: "Apr 5 • Market",  crypto: "+33.2 USDT",   color: "#26A17B", bg: "#E6F7F2" },
];

/* ── Solid Check SVG ─────────────────────────────────────── */
const SolidCheck = () => (
  <svg className="w-5 h-5 text-[#0066FF]" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" clipRule="evenodd" />
  </svg>
);

/* ── Price Chart ─────────────────────────────────────────── */
const CHART_POINTS = [
  62100, 61800, 62400, 62000, 61500, 62800, 63100, 62700,
  63500, 63200, 64000, 63800, 64200, 63900, 64500, 64100,
  64800, 64400, 64900, 64600, 65200, 64800, 65000, 64280,
];
const TIME_TABS = ["1H", "24H", "7D", "1M", "1Y"];

const PriceChart = () => {
  const [activeTab, setActiveTab] = useState("24H");

  const W = 500, H = 90, pad = 8;
  const min = Math.min(...CHART_POINTS);
  const max = Math.max(...CHART_POINTS);
  const rng = max - min || 1;

  const pts = CHART_POINTS.map((v, i) => {
    const x = (i / (CHART_POINTS.length - 1)) * W;
    const y = pad + ((max - v) / rng) * (H - pad * 2);
    return `${x},${y}`;
  });
  const poly = pts.join(" ");
  const lastPt = pts[pts.length - 1];
  const [lx, ly] = lastPt.split(",").map(parseFloat);
  const area = `M0,${H} L${pts.map(p => `L${p}`).join(" ").slice(1)} L${W},${H} Z`;

  return (
    <div className="mb-5">
      <div className="flex items-center gap-1 mb-3">
        {TIME_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all ${
              activeTab === tab ? "bg-[#0066FF] text-white" : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="w-full">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full" style={{ height: 80 }}>
          <defs>
            <linearGradient id="btcG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0066FF" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#0066FF" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill="url(#btcG)" />
          <polyline points={poly} fill="none" stroke="#0066FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={lx} cy={ly} r="5" fill="#0066FF" />
          <circle cx={lx} cy={ly} r="9" fill="#0066FF" fillOpacity="0.15" />
        </svg>
        <div className="flex justify-between mt-1">
          {["12:00", "06:00", "12:00", "18:00", "Now"].map((l, i) => (
            <span key={i} className="text-[9px] text-slate-400 font-medium">{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── Asset List Panel ────────────────────────────────────── */
const AssetList = ({ assets, selectedSymbol, onSelect, onClose }) => (
  <div className="flex flex-col h-full">
    <div className="flex items-center justify-between mb-4">
      <h2 className="font-bold text-slate-900 text-base">Choose Asset</h2>
      {onClose && (
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 lg:hidden">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
    <div className="relative mb-4">
      <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
      <input
        type="text"
        placeholder="Search coins..."
        className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-[#0066FF] transition-colors placeholder:text-slate-400 font-medium shadow-sm"
      />
    </div>
    <div className="flex-1 overflow-y-auto space-y-1 pr-0.5">
      {assets.map((asset) => {
        const isSelected = asset.symbol.toUpperCase() === selectedSymbol?.toUpperCase();
        return (
          <div
            key={asset.id || asset.symbol}
            onClick={() => onSelect(asset)}
            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
              isSelected ? "bg-[#F0F6FF] border-[#0066FF]" : "border-transparent hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shadow-sm shrink-0 overflow-hidden"
                style={{ backgroundColor: asset.bg || "#F8FAFC", color: asset.color || "#0066FF" }}
              >
                {asset.image ? <img src={asset.image} alt={asset.name} className="w-full h-full object-cover" /> : (asset.icon || asset.symbol[0])}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900">{asset.name}</span>
                <span className="text-[11px] text-slate-500 font-medium">{asset.symbol.toUpperCase()}</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-slate-900">
                  {asset.current_price ? `₦${asset.current_price.toLocaleString()}` : asset.price}
                </span>
                {isSelected && <SolidCheck />}
              </div>
              <span className={`text-[11px] font-semibold mt-0.5 ${
                (asset.price_change_percentage_24h || 0) >= 0 ? "text-green-500" : "text-red-500"
              }`}>
                {asset.price_change_percentage_24h ? `${asset.price_change_percentage_24h.toFixed(2)}%` : asset.change}
              </span>
            </div>
          </div>
        );
      })}
    </div>
    <div className="pt-3 border-t border-slate-100 mt-3">
      <button className="flex items-center justify-between w-full py-2 text-sm font-bold text-slate-700 hover:text-[#0066FF] transition-colors">
        View all assets <ChevronRight className="w-4 h-4 text-slate-400" />
      </button>
    </div>
  </div>
);

/* ── Main Component ──────────────────────────────────────── */
const BuyFlow = ({ onBack }) => {
  const [payAmount, setPayAmount]       = useState("150,000");
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [showAssetDrawer, setShowAssetDrawer] = useState(false);
  const [assets, setAssets] = useState(ASSETS);
  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        const data = await fetchTopCurrencies();
        if (data && data.length > 0) {
          setAssets(data);
          // Auto-select BTC or first asset
          const btc = data.find(a => a.symbol.toUpperCase() === "BTC");
          setSelectedAsset(btc || data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch assets:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAssets();
  }, []);

  const handleAssetSelect = (asset) => {
    setSelectedAsset(asset);
    setShowAssetDrawer(false);
  };

  const getNumericAmount = (str) => {
    return parseFloat(str.replace(/,/g, "")) || 0;
  };

  const receiveAmount = selectedAsset?.current_price 
    ? (getNumericAmount(payAmount) / selectedAsset.current_price).toFixed(8)
    : "0.00000000";

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-16">

      {/* ── Top Header ── */}
      <header className="bg-white border-b border-slate-100 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        {/* Back + Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <div className="hidden sm:flex items-center gap-2 text-sm font-medium">
            <span className="text-slate-500 cursor-pointer hover:text-slate-800 transition-colors" onClick={onBack}>
              Dashboard
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="text-slate-900 font-bold">Buy Crypto</span>
          </div>
          <span className="sm:hidden text-slate-900 font-bold text-base">Buy Crypto</span>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Mobile: Choose Asset trigger */}
          <button
            onClick={() => setShowAssetDrawer(true)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#0066FF] text-[#0066FF] text-xs font-bold hover:bg-[#F0F6FF] transition-colors"
          >
            <div className="w-4 h-4 rounded-full overflow-hidden flex items-center justify-center shrink-0">
              {selectedAsset?.image ? <img src={selectedAsset.image} alt="" className="w-full h-full object-cover" /> : <span className="text-[10px] font-bold">₿</span>}
            </div>
            {selectedAsset?.symbol?.toUpperCase() || "BTC"}
            <ChevronDown className="w-3 h-3" />
          </button>

          <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center relative cursor-pointer hover:bg-slate-50">
            <Bell className="w-4 h-4 text-slate-600" />
            <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </div>
          <div className="w-8 h-8 rounded-full bg-[#0066FF] flex items-center justify-center text-white font-bold text-xs shadow-sm cursor-pointer">
            AK
          </div>
        </div>
      </header>

      {/* ── Mobile Asset Drawer ── */}
      {showAssetDrawer && (
        <div className="fixed inset-0 z-[200] flex flex-col lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAssetDrawer(false)} />
          <div className="relative mt-auto bg-white rounded-t-2xl p-5 max-h-[85vh] flex flex-col shadow-2xl">
            <AssetList 
              assets={assets} 
              selectedSymbol={selectedAsset?.symbol} 
              onSelect={handleAssetSelect} 
              onClose={() => setShowAssetDrawer(false)} 
            />
          </div>
        </div>
      )}

      {/* ── Page Content ── */}
      <div className="w-full px-4 sm:px-6 lg:px-8 mt-6">

        {/* Page Title */}
        <div className="mb-5">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-0.5">Buy Crypto</h1>
          <p className="text-sm text-slate-500 font-medium">Select an asset and enter the amount you'd like to purchase.</p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

          {/* 1. Left Panel — hidden on mobile (shown via drawer) */}
          <div className="hidden lg:flex lg:col-span-3 flex-col">
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.06)] flex flex-col sticky top-20" style={{ maxHeight: "calc(100vh - 90px)" }}>
              <AssetList 
                assets={assets} 
                selectedSymbol={selectedAsset?.symbol} 
                onSelect={handleAssetSelect} 
              />
            </div>
          </div>

          {/* 2. Center Panel — Main Buy Form */}
          <div className="lg:col-span-6 flex flex-col gap-5 w-full">
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.06)] w-full">

              {/* Asset Info Header */}
              <div className="flex items-center justify-between mb-5 pb-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-slate-50 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                    {selectedAsset?.image ? <img src={selectedAsset.image} alt="" className="w-full h-full object-cover" /> : <span className="text-xl font-bold">₿</span>}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">{selectedAsset?.name || "Bitcoin"}</h2>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">{selectedAsset?.symbol?.toUpperCase() || "BTC"} • {selectedAsset?.name || "Bitcoin"} Network</p>
                  </div>
                </div>
               
              </div>

              {/* Price Chart */}
              <PriceChart />

              {/* You Pay */}
              <div className="mb-5">
                <div className="flex justify-between items-end mb-2">
                  <label className="text-sm font-bold text-slate-900">You Pay</label>
                  <span className="text-xs font-semibold text-slate-500">
                    Balance: <span className="text-[#0066FF]">₦341,830</span>
                  </span>
                </div>

                <div className="flex items-center border border-slate-200 rounded-lg px-3 py-2.5 transition-all focus-within:border-[#0066FF] focus-within:ring-1 focus-within:ring-[#0066FF] mb-2 shadow-sm bg-white">
                  {/* Nigeria flag */}
                  <div className="w-6 h-6 rounded-full overflow-hidden flex shrink-0 mr-3 border border-slate-100 shadow-sm">
                    <div className="w-1/3 h-full bg-green-600" />
                    <div className="w-1/3 h-full bg-white" />
                    <div className="w-1/3 h-full bg-green-600" />
                  </div>
                  <input
                    type="text"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="flex-1 bg-transparent text-xl sm:text-2xl font-bold text-slate-900 outline-none min-w-0"
                  />
                  <div className="flex items-center gap-1 pl-3 border-l border-slate-200 cursor-pointer shrink-0">
                    <span className="text-sm font-bold text-slate-900">NGN</span>
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  </div>
                </div>

                <div className="flex justify-between items-center px-0.5 mb-4">
                  <span className="text-[11px] font-medium text-slate-500">1 {selectedAsset?.symbol?.toUpperCase() || "BTC"} = ₦{selectedAsset?.current_price?.toLocaleString() || "96,420,000"}</span>
                  <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                    <span>Updated just now</span>
                    <Info className="w-3 h-3 text-slate-400" />
                  </div>
                </div>

                {/* Quick Select */}
                <div className="flex items-center gap-2 overflow-x-auto pb-0.5 no-scrollbar">
                  {["N5K", "N20K", "N150K", "N500K", "Max"].map((amt) => (
                    <button
                      key={amt}
                      className={`px-3 sm:px-4 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all shrink-0 ${
                        amt === "N150K"
                          ? "bg-[#0066FF] text-white border border-[#0066FF]"
                          : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* You Receive */}
              <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                  <label className="text-sm font-bold text-slate-900">You Receive</label>
                  <span className="text-[11px] font-medium text-slate-500">Est. at market price</span>
                </div>
                <div className="flex items-center border border-slate-200 rounded-lg px-3 py-2.5 bg-white shadow-sm">
                  <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center shrink-0 mr-3">
                    {selectedAsset?.image ? <img src={selectedAsset.image} alt="" className="w-full h-full object-cover" /> : <span className="font-bold text-sm">₿</span>}
                  </div>
                  <div className="flex items-baseline gap-2 min-w-0">
                    <span className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight truncate">{receiveAmount}</span>
                    <span className="text-sm font-bold text-slate-500 shrink-0">{selectedAsset?.symbol?.toUpperCase() || "BTC"}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <label className="text-sm font-bold text-slate-900 block mb-3">Payment Method</label>
                {/* Stacks on mobile, 3 cols on sm+ */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                  {[
                    {
                      id: "wallet",
                      label: "Naira Wallet",
                      sub: "Balance: ₦341,830",
                      tag: "Instant",
                      icon: <Wallet className="w-4 h-4" />,
                      iconBg: "bg-blue-100 text-blue-600",
                      iconActive: "bg-[#0066FF] text-white",
                    },
                    {
                      id: "bank",
                      label: "Bank Transfer",
                      sub: "GTBank •••• 4421",
                      tag: "1-2 hrs",
                      icon: <Building2 className="w-4 h-4" />,
                      iconBg: "bg-green-100 text-green-600",
                      iconActive: "bg-green-100 text-green-600",
                    },
                    {
                      id: "card",
                      label: "Paystack",
                      sub: "Visa •••• 8812",
                      tag: "Instant",
                      icon: <CreditCard className="w-4 h-4" />,
                      iconBg: "bg-orange-100 text-orange-600",
                      iconActive: "bg-orange-100 text-orange-600",
                    },
                  ].map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      className={`flex items-center sm:items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        paymentMethod === m.id
                          ? "border-[#0066FF] bg-[#F0F6FF]"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          paymentMethod === m.id && m.id === "wallet" ? m.iconActive : m.iconBg
                        }`}
                      >
                        {m.icon}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-slate-900 mb-0.5">{m.label}</span>
                        <span className="text-[10px] text-slate-500 truncate">{m.sub}</span>
                        <span className="text-[10px] text-slate-500">{m.tag}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <div>
                <button className="w-full py-3.5 rounded-xl bg-[#0066FF] hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm sm:text-base transition-colors shadow-[0_4px_14px_0_rgba(0,102,255,0.35)] flex items-center justify-center gap-2">
                  <div className="w-4 h-4 rounded-full border border-white flex items-center justify-center">
                    <Plus className="w-3 h-3" strokeWidth={3} />
                  </div>
                  Buy ₦{payAmount} of {selectedAsset?.symbol?.toUpperCase() || "BTC"}
                </button>
                <p className="text-[11px] text-center text-slate-500 mt-3 font-medium leading-relaxed">
                  By confirming, you agree to Cheeseball's{" "}
                  <span className="text-[#0066FF] cursor-pointer hover:underline">terms</span>. Prices may vary slightly at execution.
                </p>
              </div>
            </div>
          </div>

          {/* 3. Right Sidebar */}
          <div className="lg:col-span-3 flex flex-col gap-5 w-full">

            {/* Price Alert */}
            <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.06)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-sm">Price Alert</h3>
                <div className="w-10 h-6 bg-[#0066FF] rounded-full relative cursor-pointer shrink-0">
                  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm" />
                </div>
              </div>
              <div className="relative mb-3">
                <Bell className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Set target price (e.g. $60,000)"
                  className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs outline-none focus:border-[#0066FF] transition-colors placeholder:text-slate-400 font-medium shadow-sm"
                />
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                Get notified when {selectedAsset?.symbol?.toUpperCase() || "BTC"} hits your target price.
              </p>
            </div>

            {/* Recent Purchases */}
            <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.06)]">
              <h3 className="font-bold text-slate-900 mb-4 text-sm">Recent Purchases</h3>
              <div className="space-y-4">
                {RECENT.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm shrink-0"
                        style={{ backgroundColor: item.bg, color: item.color }}
                      >
                        {item.symbol === "BTC" ? "₿" : item.symbol === "ETH" ? "Ξ" : "₮"}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[13px] font-bold text-slate-900 truncate">{item.name}</span>
                        <span className="text-[11px] text-slate-500 font-medium truncate">{item.date}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                      <span className="text-[13px] font-bold text-slate-900">{item.amount}</span>
                      <span className="text-[11px] font-semibold text-green-500 mt-0.5">{item.crypto}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 flex justify-center">
                <button className="text-xs font-bold text-[#0066FF] hover:text-blue-800 transition-colors flex items-center gap-1">
                  View all purchases <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyFlow;

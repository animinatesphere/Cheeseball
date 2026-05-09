import React, { useState, useEffect, useCallback } from "react";
import { 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Info, 
  Wallet, 
  Building2, 
  CreditCard, 
  ArrowLeft, 
  Check, 
  Clock, 
  AlertCircle, 
  Copy, 
  ArrowRight, 
  Upload, 
  Lock,
  RefreshCw,
  Bell,
  ArrowLeftCircle,
  Landmark,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import BuyCryptoBreadcrumbs from "./BuyCryptoBreadcrumbs";

/* ── CONSTANTS & MOCK DATA ─────────────────────────────────── */
const ASSETS = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", network: "Bitcoin Network", price: 96420000, change: 2.14, icon: "₿", color: "#F7931A", bg: "#FEF3E2" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", network: "Ethereum Network", price: 4710000, change: -0.87, icon: "Ξ", color: "#627EEA", bg: "#EEEFFE" },
  { id: "tether", symbol: "USDT", name: "Tether", network: "Tron Network (TRC20)", price: 1550, change: 0.01, icon: "₮", color: "#26A17B", bg: "#E6F7F2" },
  { id: "solana", symbol: "SOL", name: "Solana", network: "Solana Network", price: 228000, change: 4.56, icon: "◎", color: "#9945FF", bg: "#F1E9FF" },
  { id: "bnb", symbol: "BNB", name: "BNB", network: "BSC (BEP20)", price: 887000, change: 1.33, icon: "⬡", color: "#F0B90B", bg: "#FEF8E6" },
  { id: "xrp", symbol: "XRP", name: "XRP", network: "Ripple Network", price: 960, change: -1.08, icon: "✕", color: "#000000", bg: "#E6E6E6" },
];

const NETWORKS = {
  BTC: ["Bitcoin Network"],
  ETH: ["Ethereum Network", "Arbitrum", "Optimism"],
  USDT: ["Tron (TRC20)", "Ethereum (ERC20)", "BSC (BEP20)"],
  SOL: ["Solana Network"],
  BNB: ["BSC (BEP20)"],
  XRP: ["Ripple Network"],
};

const PRICE_EXPIRY_TIME = 900; // 15 minutes in seconds


/* ── UTILS ─────────────────────────────────────────────────── */
const formatNGN = (val) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(val);
};

const truncateAddress = (addr) => {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
};

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

/* ── SUB-COMPONENTS (Defined outside to preserve focus/hooks) ─ */

const Header = ({ step, onBack }) => {
  if (step >= 2) return null; // Steps 2+ have their own header

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-2">
        <span className="hover:text-blue-600 cursor-pointer" onClick={onBack}>Dashboard</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-900 font-semibold">Buy Crypto</span>
        {step > 1 && (
           <>
             <ChevronRight className="w-4 h-4" />
             <span className="text-slate-900 font-semibold">
               {step === 2 ? "Review" : step === 3 ? "Wallet" : step === 4 ? "Payment" : "Complete"}
             </span>
           </>
        )}
      </div>
      <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 sora">Buy Crypto</h1>
      {step === 1 && <p className="text-slate-500 mt-1 font-medium">Select an asset and enter the amount you'd like to purchase.</p>}
    </div>
  );
};

const TransactionSummary = ({ payAmount, receiveAmount, selectedAsset, walletAddress, expiryTime, isExpired, step }) => (
  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Transaction Summary</h3>
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-slate-500">You pay</span>
        <span className="text-sm font-bold text-slate-900">{formatNGN(payAmount)}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-slate-500">You receive</span>
        <span className="text-sm font-bold text-slate-900">{receiveAmount} {selectedAsset.symbol}</span>
      </div>
      {step >= 4 && walletAddress && (
        <div className="flex justify-between items-center pt-3 border-t border-slate-100">
          <span className="text-sm font-medium text-slate-500">Wallet</span>
          <span className="text-sm font-mono font-medium text-slate-900">{truncateAddress(walletAddress)}</span>
        </div>
      )}
      <div className="flex justify-between items-center pt-3 border-t border-slate-100">
        <span className="text-sm font-medium text-slate-500">Rate</span>
        <span className="text-sm font-bold text-slate-900">1 {selectedAsset.symbol} = {formatNGN(selectedAsset.price)}</span>
      </div>
    </div>
    {expiryTime > 0 && !isExpired && (
      <div className="mt-4 flex items-center justify-between p-3 bg-white rounded-xl border border-blue-100">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold text-blue-600 uppercase tracking-tight">Price expires in</span>
        </div>
        <span className="text-sm font-bold text-blue-700">{formatTime(expiryTime)}</span>
      </div>
    )}
  </div>
);

const Step1 = ({ selectedAsset, setSelectedAsset, setSelectedNetwork, payAmount, setPayAmount, searchQuery, setSearchQuery, nextStep, onViewAll }) => (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
    <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-auto lg:h-[500px]">
      <div className="p-5 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Choose Asset</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search coins..." 
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {ASSETS.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.symbol.toLowerCase().includes(searchQuery.toLowerCase())).map((asset) => (
          <div 
            key={asset.id} 
            onClick={() => {
              setSelectedAsset(asset);
              setSelectedNetwork(NETWORKS[asset.symbol][0]);
            }}
            className={`flex items-center justify-between p-4 cursor-pointer transition-all ${
              selectedAsset.id === asset.id ? "bg-blue-50 border-l-4 border-l-blue-600" : "hover:bg-slate-50 border-l-4 border-l-transparent"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold shrink-0 shadow-sm" style={{ backgroundColor: asset.bg, color: asset.color }}>
                {asset.icon}
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">{asset.name}</div>
                <div className="text-[11px] text-slate-500 font-medium uppercase">{asset.symbol} • {asset.network}</div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">{formatNGN(asset.price)}</span>
                {selectedAsset.id === asset.id && <Check className="w-4 h-4 text-blue-600" />}
              </div>
              <span className={`text-[11px] font-bold ${asset.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                {asset.change >= 0 ? "+" : ""}{asset.change}%
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-slate-50 bg-slate-50/30">
        <button 
          onClick={onViewAll}
          className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white text-blue-600 transition-all group border border-transparent hover:border-blue-100 hover:shadow-sm"
        >
          <span className="text-sm font-bold">View All Assets</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
    <div className="lg:col-span-7 space-y-6">
      <div className="bg-white rounded-2xl p-6 lg:p-8 border border-slate-200 shadow-sm space-y-8">
        <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100">
           <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: selectedAsset.bg, color: selectedAsset.color }}>
             {selectedAsset.icon}
           </div>
           <div>
             <div className="text-sm font-bold text-slate-900">{selectedAsset.name}</div>
             <div className="text-[10px] text-slate-500 font-medium uppercase tracking-tight">{selectedAsset.symbol} • {selectedAsset.network}</div>
           </div>
        </div>
        <div className="space-y-4">
          <label className="text-sm font-bold text-slate-500 block">You Pay</label>
          <div className="flex items-center bg-white border-2 border-slate-100 rounded-2xl p-5 focus-within:border-blue-500 transition-all shadow-sm">
             <span className="text-2xl font-bold text-slate-900 mr-3">₦</span>
             <input 
               type="number" 
               value={payAmount}
               onChange={(e) => setPayAmount(e.target.value)}
               className="flex-1 text-3xl font-bold text-slate-900 outline-none placeholder:text-slate-200"
               placeholder="0.00"
             />
             <div className="flex items-center gap-2 pl-4 border-l border-slate-100">
               <span className="text-lg font-bold text-slate-900">NGN</span>
               <span className="text-xl">🇳🇬</span>
             </div>
          </div>
          <div className="flex flex-wrap gap-2">
             {[5000, 10000, 50000, 100000].map(amt => (
               <button 
                key={amt}
                onClick={() => setPayAmount(amt)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  payAmount == amt ? "bg-blue-600 text-white border-blue-600 shadow-md" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
               >
                 {formatNGN(amt)}
               </button>
             ))}
          </div>
        </div>
        {/* <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
             <div className="flex flex-col">
               <span className="text-xs font-bold text-slate-400">Getting best rate...</span>
               <span className="text-sm font-bold text-slate-900">1 {selectedAsset.symbol} ≈ {formatNGN(selectedAsset.price)}</span>
             </div>
           </div>
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-blue-600 uppercase">Updating...</span>
              <span className="text-[10px] text-slate-400 font-medium">Updated just now</span>
           </div>
        </div> */}
        <button 
          onClick={nextStep}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 group"
        >
          Continue <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
        <p className="text-[11px] text-center text-slate-400 font-medium leading-relaxed">
          The exact amount of crypto you’ll receive will be confirmed on the next screen.
        </p>
      </div>
    </div>
  </div>
);

const Step2 = ({ payAmount, receiveAmount, selectedAsset, selectedNetwork, nextStep, prevStep, expiryTime, isExpired, resetExpiry, onBack }) => (
  <div className="max-w-[1100px] mx-auto space-y-8 pb-12">
    {/* TOP SECTION */}
    <div className="flex flex-col space-y-6">
      {/* Removed old breadcrumb row */}

      {/* Page Title + Subtext + Timer */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 sora">Price Preview</h1>
          <p className="text-sm lg:text-base text-slate-500 font-medium">Review the details below. This price is locked for a short time.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-100 rounded-full shadow-[0_2px_10px_rgba(251,146,60,0.1)] w-fit">
          <Clock className="w-4 h-4 text-orange-500" />
          <span className="text-xs lg:text-sm font-bold text-orange-600">Price expires in {formatTime(expiryTime)}</span>
        </div>
      </div>
    </div>

    {/* MAIN CARD (CORE CONTENT) */}
    <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
      {/* TOP ROW — YOU PAY → YOU RECEIVE */}
      <div className="p-6 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-0 border-b border-[#E5E7EB]">
        <div className="space-y-2 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-2">
            <span className="text-xl">🇳🇬</span>
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">You pay</span>
          </div>
          <h3 className="text-2xl lg:text-4xl font-black text-slate-900 sora tracking-tight">{formatNGN(payAmount)}</h3>
        </div>

        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border border-[#E5E7EB] flex items-center justify-center bg-white shadow-sm rotate-90 lg:rotate-0">
          <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
        </div>

        <div className="space-y-2 text-center lg:text-right">
          <div className="flex items-center justify-center lg:justify-end gap-2">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">You receive</span>
            <div className="w-6 h-6 rounded-full bg-[#F7931A] flex items-center justify-center text-white text-[10px] font-bold">₿</div>
          </div>
          <h3 className="text-2xl lg:text-4xl font-black text-blue-600 sora tracking-tight">{receiveAmount} {selectedAsset.symbol}</h3>
        </div>
      </div>

      {/* ASSET + NETWORK ROW */}
      <div className="px-6 lg:px-10 py-6 grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 border-b border-[#E5E7EB]">
        <div className="space-y-1">
          <p className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest">Asset</p>
          <p className="text-sm lg:text-base font-bold text-slate-900">{selectedAsset.name} ({selectedAsset.symbol})</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest">Network</p>
          <p className="text-sm lg:text-base font-bold text-slate-900">{selectedAsset.symbol} · {selectedNetwork}</p>
        </div>
      </div>

      {/* PRICE BREAKDOWN SECTION */}
      <div className="p-8 lg:p-10 space-y-6">
        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Price breakdown</h4>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-500">Markup / spread</span>
              <Info className="w-4 h-4 text-slate-300 cursor-pointer" />
            </div>
            <span className="text-sm font-bold text-slate-900">3%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-500">Estimated crypto amount</span>
            <span className="text-sm font-bold text-slate-900">{receiveAmount} {selectedAsset.symbol}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-500">NGN amount</span>
            <span className="text-sm font-bold text-slate-900">{formatNGN(payAmount)}</span>
          </div>
        </div>

        {/* INFO NOTICE */}
        <div className="mt-8 flex items-start gap-3 p-5 bg-[#F9FAFB] rounded-2xl border border-[#F1F3F5] text-sm font-medium text-slate-600 leading-relaxed">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <p>This price is temporarily locked. If it expires before you continue, we’ll refresh the price before checkout.</p>
        </div>
      </div>
    </div>

    {/* ACTIONS (BOTTOM) */}
    <div className="flex items-center gap-4">
      <button 
        onClick={prevStep} 
        className="flex-1 py-4 px-6 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all text-center"
      >
        Edit Amount
      </button>
      <button 
        onClick={nextStep} 
        className="flex-[2] py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group"
      >
        Continue <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>

    {/* FOOTNOTE */}
    <p className="text-sm text-center text-slate-400 font-medium">
      Prices may change slightly before the transaction is completed.
    </p>

    {isExpired && (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
         <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full text-center shadow-2xl space-y-6">
           <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-3xl flex items-center justify-center mx-auto">
             <Clock className="w-10 h-10" />
           </div>
           <div className="space-y-2">
             <h3 className="text-2xl font-black text-slate-900 sora">Price expired</h3>
             <p className="text-slate-500 font-medium">Rates changed while you were reviewing this purchase. Refresh to get the latest price.</p>
           </div>
           <button onClick={resetExpiry} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2">
             <RefreshCw className="w-5 h-5" /> Refresh Price
           </button>
         </div>
      </div>
    )}
  </div>
);

const Step3 = ({ selectedAsset, receiveAmount, selectedNetwork, setSelectedNetwork, walletAddress, setWalletAddress, walletLabel, setWalletLabel, nextStep, prevStep, payAmount, expiryTime, isExpired, resetExpiry, onBack }) => {
  const isAddressInvalid = walletAddress.length > 0 && walletAddress.length < 20;
  
  return (
    <div className="max-w-[1100px] mx-auto space-y-8 pb-12">
      {/* TOP SECTION */}
      <div className="flex flex-col space-y-6">
        {/* Header Row Removed */}

        {/* Page Title + Subtitle + Expiry Badge */}
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-slate-900 sora">Wallet Address + Network</h1>
            <p className="text-slate-500 font-medium">Enter the wallet address and select the network where you want to receive your crypto.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-100 rounded-full shadow-[0_2px_10px_rgba(251,146,60,0.1)]">
            <Clock className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-bold text-orange-600">Price expires in {formatTime(expiryTime)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT — MAIN FORM CARD */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E5E7EB] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 space-y-8">
          
          {/* RECEIVE PREVIEW */}
          <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xl shadow-sm">
                ₿
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">You will receive</p>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-black text-slate-900 sora">{receiveAmount} BTC</h3>
                  <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-600 uppercase">Bitcoin (BTC)</span>
                </div>
              </div>
            </div>
          </div>

          {/* NETWORK SELECTOR */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-900">Network</label>
            <div className="relative">
              <select 
                value={selectedNetwork} 
                onChange={(e) => setSelectedNetwork(e.target.value)} 
                className="w-full bg-white border-2 border-slate-100 rounded-2xl px-5 py-4 text-base font-bold text-slate-900 outline-none appearance-none focus:border-blue-500 transition-all cursor-pointer shadow-sm"
              >
                {NETWORKS[selectedAsset.symbol].map(nw => <option key={nw} value={nw}>{nw}</option>)}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
            <p className="text-xs font-medium text-slate-400">Select the network that matches your wallet.</p>
          </div>

          {/* WALLET ADDRESS INPUT */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-900">Wallet address</label>
            <div className="relative group">
              <input 
                type="text" 
                placeholder={`Paste your ${selectedAsset.symbol} wallet address`} 
                value={walletAddress} 
                onChange={(e) => setWalletAddress(e.target.value)} 
                className={`w-full bg-white border-2 ${isAddressInvalid ? 'border-red-100 focus:border-red-500' : 'border-slate-100 focus:border-blue-500'} rounded-2xl px-5 py-4 pr-12 text-base font-mono font-medium outline-none transition-all shadow-sm`}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <Copy className="w-5 h-5 text-slate-400 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => navigator.clipboard.readText().then(text => setWalletAddress(text))} />
              </div>
            </div>
            {isAddressInvalid && (
              <p className="text-red-500 text-[11px] font-bold flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-3.5 h-3.5" /> Enter a valid {selectedAsset.symbol} wallet address
              </p>
            )}
          </div>
{/* the commented placenhhhh */}
          {/* WALLET LABEL (OPTIONAL)rffffffffffffffffffffffffffffffggg
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-900">Wallet label (optional)</label>
            <input 
              type="text" 
              placeholder="My Binance wallet" 
              value={walletLabel} 
              onChange={(e) => setWalletLabel(e.target.value)} 
              className="w-full bg-white border-2 border-slate-100 focus:border-blue-500 rounded-2xl px-5 py-4 text-base font-medium outline-none transition-all shadow-sm"
            />
            <p className="text-xs font-medium text-slate-400">Add a label to easily identify this wallet.</p>
          </div> */}

          {/* SAFETY NOTICE BOX */}
          <div className="flex items-start gap-4 p-5 bg-[#F9FAFB] rounded-2xl border border-[#F1F3F5] text-sm font-medium text-slate-600 leading-relaxed">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <p>Make sure this address supports the selected network. Crypto sent to the wrong network may be lost.</p>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-4 pt-4">
            <button 
              onClick={prevStep} 
              className="flex-1 py-4 px-6 border-2 border-slate-100 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all text-center"
            >
              Back
            </button>
            <button 
              onClick={nextStep} 
              disabled={!walletAddress || isAddressInvalid}
              className="flex-[2] py-4 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group"
            >
              Continue <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* RIGHT PANEL — TRANSACTION SUMMARY */}
        <div className="lg:col-span-5 space-y-6 sticky top-6">
          <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 space-y-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Transaction summary</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-500">You pay</span>
                <span className="text-sm font-bold text-slate-900">{formatNGN(payAmount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-500">You receive</span>
                <span className="text-sm font-bold text-slate-900">{receiveAmount} {selectedAsset.symbol}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-500">Asset</span>
                <span className="text-sm font-bold text-slate-900">{selectedAsset.name} ({selectedAsset.symbol})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-500">Network</span>
                <span className="text-sm font-bold text-slate-900">{selectedAsset.symbol} · {selectedNetwork}</span>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Price Breakdown</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-500">Markup / spread</span>
                  <span className="text-sm font-bold text-slate-900">3%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-500">Estimated crypto amount</span>
                  <span className="text-sm font-bold text-slate-900">{receiveAmount} {selectedAsset.symbol}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-500">NGN amount</span>
                  <span className="text-sm font-bold text-slate-900">{formatNGN(payAmount)}</span>
                </div>
              </div>
            </div>

            {/* EXPIRY IN SUMMARY */}
            <div className="pt-6 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-500">Price expires in</span>
                <span className="text-sm font-bold text-orange-600 border border-orange-100 px-3 py-1 rounded-full">{formatTime(expiryTime)}</span>
              </div>
            </div>

            {/* SECURITY NOTE */}
            <div className="pt-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-blue-100 flex items-center justify-center text-blue-600">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Your transaction is secure</p>
                <p className="text-xs font-medium text-slate-500">Protected by Cheeseball</p>
              </div>
            </div>
          </div>

          {/* FOOTNOTE */}
          <p className="text-xs text-center text-slate-400 font-medium">
            Prices may change slightly before the transaction is completed.
          </p>
        </div>
      </div>

      {/* EXPIRED STATE OVERLAY */}
      {isExpired && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full text-center shadow-2xl space-y-6">
             <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-3xl flex items-center justify-center mx-auto">
               <Clock className="w-10 h-10" />
             </div>
             <div className="space-y-2">
               <h3 className="text-2xl font-black text-slate-900 sora">Price expired</h3>
               <p className="text-slate-500 font-medium">Rates changed while you were reviewing this purchase. Refresh to get the latest price.</p>
             </div>
             <button onClick={resetExpiry} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2">
               <RefreshCw className="w-5 h-5" /> Refresh Price
             </button>
           </div>
        </div>
      )}
    </div>
  );
};


const Step4 = ({ 
  payAmount, 
  paymentMethod, 
  setPaymentMethod, 
  nextStep, 
  prevStep, 
  receiveAmount, 
  selectedAsset, 
  expiryTime 
}) => (
  <div className="min-h-screen bg-white text-[#0F172A]">
    <div className="max-w-[1200px] mx-auto px-8 py-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-[20px] lg:text-[22px] leading-none font-bold tracking-[-0.5px] text-[#0F172A]">Payment Method</h1>
          <p className="text-[#64748B] mt-1 text-[13px]">Choose how you want to pay.</p>
        </div>
        <div className="px-4 py-2.5 lg:px-5 lg:py-3 rounded-2xl border border-[#FED7AA] bg-[#FFF7ED] flex items-center gap-3 w-fit">
          <div className="w-4 h-4 lg:w-5 lg:h-5 rounded-full border-2 border-[#F97316] flex items-center justify-center">
            <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-[#F97316]" />
          </div>
          <span className="text-[#EA580C] font-semibold text-xs lg:text-[15px]">Price expires in {formatTime(expiryTime)}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-7">
        <div className="bg-white border border-[#E5E7EB] rounded-[28px] p-7">
          <div className="space-y-5">
            {/* NGN WALLET */}
            <div onClick={() => { setPaymentMethod("wallet"); nextStep(); }}
              className={`rounded-[24px] p-4 lg:p-6 flex items-start lg:items-center gap-4 lg:gap-5 cursor-pointer transition ${paymentMethod === "wallet" ? "border-2 border-[#2563EB] bg-[#F8FBFF]" : "border border-[#E5E7EB] bg-white hover:border-[#CBD5E1]"}`}>
              <div className={`w-5 h-5 lg:w-6 lg:h-6 rounded-full mt-1 lg:mt-0 flex-shrink-0 ${paymentMethod === "wallet" ? "border-[5px] border-[#2563EB] bg-white" : "border-2 border-[#CBD5E1] bg-white"}`} />
              <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-[#E8F1FF] flex items-center justify-center flex-shrink-0">
                <Wallet size={24} className="text-[#2563EB]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm lg:text-[15px] font-bold text-[#0F172A]">NGN Wallet</h3>
                <p className="text-[#64748B] mt-1 text-[13px] lg:text-[16px] leading-relaxed">Pay instantly from your Cheeseball balance</p>
                <div className="flex flex-wrap items-center gap-2 lg:gap-3 mt-3 lg:mt-4 text-[13px] lg:text-[15px]">
                  <span className="text-[#2563EB] font-semibold">Available: ₦250k</span>
                  <span className="hidden sm:block w-1 h-1 rounded-full bg-[#CBD5E1]" />
                  <span className="text-[#2563EB] font-semibold">Instant</span>
                </div>
              </div>
            </div>
            {/* PAYSTACK */}
            <div onClick={() => setPaymentMethod("paystack")}
              className={`rounded-[24px] p-4 lg:p-6 flex items-start lg:items-center gap-4 lg:gap-5 cursor-pointer transition ${paymentMethod === "paystack" ? "border-2 border-[#2563EB] bg-[#F8FBFF]" : "border border-[#E5E7EB] bg-white hover:border-[#CBD5E1]"}`}>
              <div className={`w-5 h-5 lg:w-6 lg:h-6 rounded-full mt-1 lg:mt-0 flex-shrink-0 ${paymentMethod === "paystack" ? "border-[5px] border-[#2563EB] bg-white" : "border-2 border-[#CBD5E1] bg-white"}`} />
              <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-[#ECFDF3] flex items-center justify-center flex-shrink-0">
                <CreditCard size={24} className="text-[#16A34A]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm lg:text-[15px] font-bold text-[#0F172A]">Paystack</h3>
                <p className="text-[#64748B] mt-1 text-[13px] lg:text-[16px] leading-relaxed">Pay with card or bank</p>
                <div className="mt-3 lg:mt-4 text-[13px] lg:text-[15px] text-[#64748B] font-medium">Fast confirmation through Paystack</div>
              </div>
            </div>
            {/* BANK TRANSFER */}
            <div onClick={() => setPaymentMethod("bank")}
              className={`rounded-[24px] p-4 lg:p-6 flex items-start lg:items-center gap-4 lg:gap-5 cursor-pointer transition ${paymentMethod === "bank" ? "border-2 border-[#2563EB] bg-[#F8FBFF]" : "border border-[#E5E7EB] bg-white hover:border-[#CBD5E1]"}`}>
              <div className={`w-5 h-5 lg:w-6 lg:h-6 rounded-full mt-1 lg:mt-0 flex-shrink-0 ${paymentMethod === "bank" ? "border-[5px] border-[#2563EB] bg-white" : "border-2 border-[#CBD5E1] bg-white"}`} />
              <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-[#FFFBEB] flex items-center justify-center flex-shrink-0">
                <Landmark size={24} className="text-[#D97706]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm lg:text-[15px] font-bold text-[#0F172A]">Bank Transfer</h3>
                <p className="text-[#64748B] mt-1 text-[13px] lg:text-[16px] leading-relaxed">Manual bank transfer</p>
                <div className="mt-2 lg:mt-3 text-[13px] lg:text-[15px] text-[#64748B] font-medium">Transfer and upload proof</div>
                <div className="inline-flex mt-3 lg:mt-4 px-2.5 py-0.5 lg:px-3 lg:py-1 rounded-full bg-[#FFF7ED] text-[#EA580C] text-[11px] lg:text-[13px] font-semibold">Review required</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 mt-8">
            <button onClick={prevStep} className="h-[48px] rounded-xl border border-[#E5E7EB] bg-white text-[#0F172A] font-bold text-[14px] hover:bg-[#F8FAFC] transition order-2 sm:order-1">← Back</button>
            <button onClick={nextStep} className="h-[48px] rounded-xl bg-[#2563EB] text-white font-bold text-[14px] hover:bg-[#1D4ED8] transition shadow-lg shadow-blue-100 order-1 sm:order-2">Continue →</button>
          </div>
          <div className="flex items-center justify-center gap-2 mt-10 text-[#64748B] text-[14px]">
            <ShieldCheck size={16} />
            <span>Prices may change slightly before the transaction is completed.</span>
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-[28px] p-7 h-fit">
          <h2 className="text-[15px] font-bold text-[#0F172A] mb-8">Transaction Summary</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[#64748B] text-[16px]">You pay</span>
              <span className="font-bold text-[14px] text-[#0F172A]">{formatNGN(payAmount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#64748B] text-[16px]">You receive</span>
              <span className="font-bold text-[14px] text-[#2563EB]">{receiveAmount} {selectedAsset.symbol}</span>
            </div>
          </div>
          <div className="h-px bg-[#E5E7EB] my-8" />
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[#64748B] text-[16px]">Asset</span>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[13px] font-bold" style={{ backgroundColor: selectedAsset.color }}>{selectedAsset.icon}</div>
                <span className="font-semibold text-[16px]">{selectedAsset.name} ({selectedAsset.symbol})</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#64748B] text-[16px]">Network</span>
              <span className="font-semibold text-[16px] text-right">{selectedAsset.symbol} · {selectedAsset.network}</span>
            </div>
          </div>
          <div className="h-px bg-[#E5E7EB] my-8" />
          <div>
            <h3 className="font-bold text-[13px] mb-3">Price Breakdown</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[#64748B] text-[16px]">Markup / spread</span>
                  <Info size={15} className="text-[#94A3B8]" />
                </div>
                <span className="font-semibold text-[16px]">3%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B] text-[16px]">Estimated crypto amount</span>
                <span className="font-semibold text-[16px]">{receiveAmount} {selectedAsset.symbol}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B] text-[16px]">NGN amount</span>
                <span className="font-semibold text-[16px]">{formatNGN(payAmount)}</span>
              </div>
            </div>
          </div>
          <div className="h-px bg-[#E5E7EB] my-8" />
          <div className="flex items-center justify-between">
            <span className="text-[#64748B] text-[16px]">Price expires in</span>
            <span className="font-bold text-[#EA580C] text-[13px]">{formatTime(expiryTime)}</span>
          </div>
          <div className="mt-8 bg-white border border-[#E5E7EB] rounded-2xl p-5 flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center">
              <ShieldCheck size={22} className="text-[#2563EB]" />
            </div>
            <div>
              <div className="font-semibold text-[16px] text-[#0F172A]">Your transaction is secure</div>
              <div className="text-[#64748B] mt-1 text-[14px]">Protected by Cheeseball</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Step5 = ({ 
  paymentMethod, 
  payAmount, 
  receiveAmount, 
  selectedAsset, 
  walletAddress, 
  expiryTime, 
  prevStep, 
  setStep, 
  hasPaid, 
  setHasPaid, 
  proofFile, 
  setProofFile 
}) => {
  const [uploading, setUploading] = useState(false);

  if (paymentMethod === "wallet") {
    return (
      <div className="min-h-screen bg-white text-[#0F172A]">
        <div className="max-w-[1200px] mx-auto px-8 py-10">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-8 gap-4">
            <div>
              <h1 className="text-[20px] lg:text-[22px] leading-none tracking-[-0.5px] font-bold text-[#0F172A]">Pay with NGN Wallet</h1>
              <p className="text-[#64748B] mt-1 text-[13px]">Review the details below and confirm payment from your NGN wallet.</p>
            </div>
            <div className="px-4 py-2.5 lg:px-5 lg:py-3 rounded-2xl border border-[#FED7AA] bg-[#FFF7ED] flex items-center gap-3 w-fit">
              <div className="w-4 h-4 lg:w-5 lg:h-5 rounded-full border-2 border-[#F97316] flex items-center justify-center">
                <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-[#F97316]" />
              </div>
              <span className="text-[#EA580C] font-semibold text-xs lg:text-[15px]">Price expires in {formatTime(expiryTime)}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-7">
            <div className="bg-white border border-[#E5E7EB] rounded-[30px] p-7">
              <div className="mb-6">
                <h3 className="text-[14px] font-bold text-[#0F172A]">Payment method</h3>
              </div>
              <div className="border-2 border-[#2563EB] bg-[#F8FBFF] rounded-[24px] p-4 lg:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 lg:gap-5">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-[#E8F1FF] flex items-center justify-center flex-shrink-0">
                    <Wallet size={24} className="text-[#2563EB]" />
                  </div>
                  <div>
                    <h4 className="text-sm lg:text-[15px] font-bold text-[#0F172A]">NGN Wallet</h4>
                    <p className="text-[#64748B] text-[13px] lg:text-[16px] mt-0.5 lg:mt-1">Pay instantly from balance</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full bg-white border border-[#DBEAFE] self-end sm:self-auto">
                  <span className="text-[#2563EB] font-semibold text-[12px] lg:text-[14px]">Selected</span>
                  <CheckCircle2 size={16} className="text-[#2563EB]" />
                </div>
              </div>
              <div className="h-px bg-[#E5E7EB] my-8" />
              <div>
                <h3 className="text-[14px] font-bold text-[#0F172A] mb-3">Wallet balance</h3>
                <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-[24px] p-4 lg:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 lg:gap-5">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-white flex items-center justify-center border border-[#DCFCE7] flex-shrink-0">
                      <Wallet size={24} className="text-[#16A34A]" />
                    </div>
                    <div>
                      <p className="text-[#166534] text-[13px] lg:text-[16px] font-medium">Available balance</p>
                      <h2 className="text-xl lg:text-[24px] leading-none font-bold text-[#0F172A] mt-0.5 lg:mt-1">₦250,000.00</h2>
                    </div>
                  </div>
                  <div className="px-3 py-2 lg:px-4 lg:py-3 rounded-full bg-[#DCFCE7] flex items-center gap-2 self-end sm:self-auto">
                    <CheckCircle2 size={16} className="text-[#16A34A]" />
                    <span className="text-[#15803D] font-semibold text-[12px] lg:text-[15px]">Sufficient funds</span>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <h3 className="text-[14px] font-bold text-[#0F172A] mb-3">Payment details</h3>
                <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-[22px] p-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-[#64748B] text-[16px]">You pay</span>
                      <span className="font-bold text-[14px] text-[#0F172A]">{formatNGN(payAmount)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#64748B] text-[16px]">Wallet balance after payment</span>
                      <span className="font-bold text-[14px] text-[#0F172A]">₦100,000.00</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 bg-white border border-[#E2E8F0] rounded-[20px] p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#DBEAFE] flex items-center justify-center flex-shrink-0">
                  <Info size={20} className="text-[#2563EB]" />
                </div>
                <p className="text-[#1E3A8A] text-[15px] leading-[26px]">Your payment will be processed instantly and your crypto will be sent to the wallet address you provided.</p>
              </div>
              <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 mt-8">
                <button onClick={prevStep} className="h-[48px] rounded-xl border border-[#E5E7EB] bg-white text-[#0F172A] font-bold text-[14px] hover:bg-[#F8FAFC] transition order-2 sm:order-1">← Back</button>
                <button onClick={() => setStep(6)} className="h-[48px] rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] transition text-white font-bold text-[14px] shadow-xl shadow-blue-100 flex items-center justify-center gap-2 order-1 sm:order-2">
                  <Lock size={16} />
                  Pay {formatNGN(payAmount)}
                </button>
              </div>
              <div className="flex items-center justify-center gap-2 mt-10 text-[#64748B] text-[14px]">
                <ShieldCheck size={16} />
                <span>Prices may change slightly before the transaction is completed.</span>
              </div>
            </div>
            <div className="bg-white border border-[#E5E7EB] rounded-[30px] p-7 h-fit">
              <h2 className="text-[15px] font-bold text-[#0F172A] mb-5">Transaction summary</h2>
              <div className="space-y-7">
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B] text-[16px]">You pay</span>
                  <span className="font-bold text-[14px] text-[#0F172A]">{formatNGN(payAmount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B] text-[16px]">You receive</span>
                  <span className="font-bold text-[14px] text-[#2563EB]">{receiveAmount} {selectedAsset.symbol}</span>
                </div>
              </div>
              <div className="h-px bg-[#E5E7EB] my-8" />
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B] text-[16px]">Asset</span>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[13px] font-bold" style={{ backgroundColor: selectedAsset.color }}>{selectedAsset.icon}</div>
                    <span className="font-semibold text-[16px]">{selectedAsset.name} ({selectedAsset.symbol})</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B] text-[16px]">Network</span>
                  <span className="font-semibold text-[16px] text-right">{selectedAsset.symbol} · {selectedAsset.network}</span>
                </div>
              </div>
              <div className="h-px bg-[#E5E7EB] my-8" />
              <div>
                <h3 className="font-bold text-[13px] mb-3">Price Breakdown</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B] text-[16px]">Markup / spread</span>
                    <span className="font-semibold text-[16px]">3%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B] text-[16px]">Estimated crypto amount</span>
                    <span className="font-semibold text-[16px]">{receiveAmount} {selectedAsset.symbol}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B] text-[16px]">NGN amount</span>
                    <span className="font-semibold text-[16px]">{formatNGN(payAmount)}</span>
                  </div>
                </div>
              </div>
              <div className="h-px bg-[#E5E7EB] my-8" />
              <div className="flex items-center justify-between">
                <span className="text-[#64748B] text-[16px]">Price expires in</span>
                <span className="font-bold text-[#EA580C] text-[13px]">{formatTime(expiryTime)}</span>
              </div>
              <div className="mt-8 bg-white border border-[#E5E7EB] rounded-[22px] p-5 flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center">
                  <ShieldCheck size={22} className="text-[#2563EB]" />
                </div>
                <div>
                  <div className="font-semibold text-[16px] text-[#0F172A]">Your transaction is secure</div>
                  <div className="text-[#64748B] mt-1 text-[14px]">Protected by Cheeseball</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (paymentMethod === "paystack") {
    return (
      <div className="w-full space-y-6 lg:space-y-8 px-4 lg:px-0">
         <div className="bg-white rounded-[2.5rem] p-6 lg:p-12 border border-slate-200 shadow-sm space-y-8 lg:space-y-10 text-center">
            <div className="w-20 h-20 bg-white border border-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto"><CreditCard className="w-10 h-10" /></div>
            <div className="space-y-2"><h2 className="text-[18px] font-bold text-slate-900 sora">Pay with Paystack</h2><p className="text-slate-500 text-[13px] font-medium max-w-sm mx-auto">You will be redirected to Paystack to complete your payment securely.</p></div>
            <div className="max-w-xs mx-auto p-6 bg-white rounded-3xl border border-slate-100 space-y-4">
               <div className="space-y-1"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</span><div className="text-[20px] font-black text-slate-900 sora">{formatNGN(payAmount)}</div></div>
               <div className="pt-3 border-t border-slate-200"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">You receive</span><div className="text-sm font-bold text-slate-900">{receiveAmount} {selectedAsset.symbol}</div></div>
               <div className="pt-2"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Wallet</span><div className="text-xs font-mono font-medium text-slate-900">{truncateAddress(walletAddress)}</div></div>
            </div>
            <div className="flex items-center gap-2 justify-center py-2 px-4 bg-white text-orange-600 rounded-full w-fit mx-auto border border-orange-100"><Clock className="w-4 h-4" /><span className="text-xs font-bold uppercase tracking-tight">Quote expires in: {formatTime(expiryTime)}</span></div>
            <div className="flex items-center gap-4 pt-4">
               <button onClick={prevStep} className="flex-1 text-slate-500 font-bold hover:text-slate-900 py-3 text-[14px] transition-all">Back</button>
               <button onClick={() => setStep(6)} className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 group text-[14px]">Proceed to Paystack <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all" /></button>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Secure payment powered by Paystack</p>
         </div>
      </div>
    );
  }

  if (paymentMethod === "bank") {
    return (
      <div className="w-full space-y-6 lg:space-y-8 px-4 lg:px-0">
         <div className="bg-white rounded-[2rem] p-6 lg:p-10 border border-slate-200 shadow-sm space-y-8">
            <h2 className="text-base lg:text-[18px] font-bold text-slate-900 sora text-center">{hasPaid ? "Upload Payment Proof" : "Bank Transfer Details"}</h2>
            {!hasPaid ? (
              <>
                <div className="p-5 lg:p-6 bg-[#F8FAFC] border border-[#E5E7EB] rounded-[1.5rem] text-center space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transfer exactly</span>
                  <div className="text-xl lg:text-[24px] font-black text-[#0F172A] sora">{formatNGN(payAmount)}</div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-wider">Bank Details</h3>
                  <div className="space-y-3">
                    {[{ label: "Bank", val: "Example Bank" }, { label: "Account Name", val: "CheeseBall Technologies" }, { label: "Account Number", val: "1234567890", copy: true }].map((item, i) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 gap-2">
                        <span className="text-xs lg:text-sm font-medium text-slate-500">{item.label}</span>
                        <div className="flex items-center justify-between sm:justify-end gap-2">
                          <span className="text-sm font-bold text-slate-900">{item.val}</span>
                          {item.copy && <Copy className="w-4 h-4 text-blue-600 cursor-pointer hover:scale-110 transition-transform" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 shrink-0" />
                  <p className="text-[11px] lg:text-xs font-medium text-orange-800">After payment, upload your proof of transfer for faster review.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                  <button onClick={prevStep} className="w-full sm:flex-1 text-slate-500 font-bold hover:text-slate-900 py-3 text-[14px] transition-all">Back</button>
                  <button onClick={() => setHasPaid(true)} className="w-full sm:flex-[2] bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold shadow-xl text-[14px]">I Have Paid</button>
                </div>
              </>
            ) : (
              <>
                <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-8 lg:p-12 flex flex-col items-center justify-center text-center space-y-4 hover:border-blue-300 transition-all cursor-pointer bg-slate-50/50" onClick={() => document.getElementById('fileInput').click()}>
                  <input type="file" id="fileInput" className="hidden" onChange={(e) => setProofFile(e.target.files[0])} />
                  <div className="w-14 h-14 lg:w-16 lg:h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-600">
                    <Upload className="w-7 h-7 lg:w-8 lg:h-8" />
                  </div>
                  <div>
                    <h4 className="text-sm lg:text-base font-bold text-slate-900">Upload screenshot or receipt</h4>
                    <p className="text-[10px] lg:text-xs font-medium text-slate-500">Max file size 5MB (JPG, PNG or PDF)</p>
                  </div>
                  {proofFile && <div className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase rounded-full">{proofFile.name}</div>}
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                  <button onClick={() => setHasPaid(false)} className="w-full sm:flex-1 text-slate-500 font-bold hover:text-slate-900 py-3 text-[14px] transition-all">Back</button>
                  <button onClick={() => { setUploading(true); setTimeout(() => { setUploading(false); setStep(6); }, 2000); }} disabled={!proofFile || uploading} className="w-full sm:flex-[2] bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-4 rounded-xl font-bold shadow-xl flex items-center justify-center gap-2 text-[14px]">
                    {uploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Submit for Review"}
                  </button>
                </div>
              </>
            )}
         </div>
      </div>
    );
  }
};

const Step6 = ({ 
  paymentMethod, 
  receiveAmount, 
  selectedAsset, 
  payAmount, 
  walletAddress, 
  onBack, 
  setStep 
}) => (
  <div className="min-h-screen bg-white text-[#0F172A] overflow-hidden">
    <div className="max-w-[1200px] mx-auto px-8 py-10">
      <div className="bg-white border border-[#E6EBF2] rounded-[32px] px-8 py-10 shadow-[0_10px_30px_rgba(15,23,42,0.03)]">
        {/* SUCCESS ICON & TITLE */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-[#EAF8EF] flex items-center justify-center">
              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full border-4 border-[#16A34A] flex items-center justify-center bg-white shadow-sm">
                <Check size={28} strokeWidth={3} className="text-[#16A34A] lg:w-8" />
              </div>
            </div>
          </div>
          <h1 className="text-2xl lg:text-[32px] leading-tight font-black tracking-[-1px] text-[#0F172A]">Payment Successful!</h1>
          <p className="mt-2 text-sm lg:text-[16px] text-[#64748B] font-medium">Your crypto purchase has been processed successfully.</p>
        </div>

        {/* TWO COLUMN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* LEFT COLUMN: RECEIPT DETAILS */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-1">Transaction Receipt</h3>
            <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-[24px] p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-[#64748B] text-sm lg:text-base font-medium">You Paid</span>
                <span className="text-lg lg:text-xl font-bold text-[#0F172A]">{formatNGN(payAmount)}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <span className="text-[#64748B] text-sm lg:text-base font-medium">You Receive</span>
                <div className="text-left sm:text-right">
                  <div className="text-lg lg:text-xl font-bold text-[#2563EB]">{receiveAmount} {selectedAsset.symbol}</div>
                  <div className="text-[10px] lg:text-[11px] text-[#64748B] font-bold uppercase tracking-tight">{selectedAsset.name}</div>
                </div>
              </div>
              <div className="h-px bg-[#E5E7EB]" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-[#64748B] text-sm lg:text-base font-medium">Wallet Address</span>
                <span className="text-[11px] lg:text-sm font-mono font-bold text-[#0F172A] break-all">{truncateAddress(walletAddress)}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-[#64748B] text-sm lg:text-base font-medium">Network</span>
                <span className="text-sm lg:text-base font-bold text-[#0F172A]">{selectedAsset.network}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-[#64748B] text-sm lg:text-base font-medium">Payment Method</span>
                <span className="text-sm lg:text-base font-bold text-[#0F172A] uppercase">{paymentMethod}</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: STATUS & NEXT STEPS */}
          <div className="space-y-8">
            <div className="bg-[#F2FBF5] border border-[#DDF5E5] rounded-[24px] p-8 flex items-start gap-5">
              <div className="w-14 h-14 rounded-full bg-[#DDF5E5] flex items-center justify-center shrink-0">
                <ShieldCheck size={28} className="text-[#16A34A]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0F172A]">Funds are Secure</h3>
                <p className="mt-1 text-sm leading-relaxed text-[#475569]">Your transaction is being broadcasted to the blockchain. Most transfers complete in 5-10 minutes.</p>
              </div>
            </div>

            <div className="bg-[#F5F8FF] border border-[#DCE7FF] rounded-[24px] p-8">
              <h3 className="text-lg font-bold text-[#0F172A] mb-4">What's next?</h3>
              <p className="text-sm leading-relaxed text-[#475569] mb-6">You can monitor the real-time status of this transaction and download the official receipt in your dashboard.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-1 h-[48px] px-6 rounded-xl border-2 border-[#DCE7FF] bg-white text-[#0063C0] font-bold text-[14px] hover:bg-white/50 transition flex items-center justify-center gap-2">
                  View Transactions <ArrowRight size={16} />
                </button>
                <button onClick={onBack} className="flex-1 h-[48px] px-6 rounded-xl bg-[#0063C0] text-white font-bold text-[14px] hover:bg-[#0054A3] transition shadow-lg shadow-blue-500/20">
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECURITY FOOTER */}
        <div className="mt-12 flex items-center justify-center gap-3 text-[#64748B] py-4 border-t border-slate-50">
          <Lock size={14} className="text-[#94A3B8]" />
          <p className="text-[12px] font-medium tracking-tight">Secured and Encrypted by Cheeseball Infrastructure</p>
        </div>
      </div>
    </div>
  </div>
);

/* ── MAIN COMPONENT ────────────────────────────────────────── */
const BuyFlow = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0]);
  const [payAmount, setPayAmount] = useState(150000);
  const [receiveAmount, setReceiveAmount] = useState(0.00155569);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletLabel, setWalletLabel] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState(NETWORKS[ASSETS[0].symbol][0]);
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [expiryTime, setExpiryTime] = useState(PRICE_EXPIRY_TIME);
  const [isExpired, setIsExpired] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [proofFile, setProofFile] = useState(null);
  const [hasPaid, setHasPaid] = useState(false);

  useEffect(() => {
    if (step >= 2 && step < 6 && expiryTime > 0 && !isExpired) {
      const timer = setInterval(() => setExpiryTime(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (expiryTime === 0) {
      setIsExpired(true);
    }
  }, [step, expiryTime, isExpired]);

  const resetExpiry = () => { setExpiryTime(PRICE_EXPIRY_TIME); setIsExpired(false); };
  const nextStep = () => setStep(prev => Math.min(prev + 1, 6));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <div className={`min-h-screen ${step >= 4 ? "" : step === 2 || step === 3 ? "bg-white" : "bg-white"} ${step >= 4 ? "" : "p-4 lg:p-8"} font-sans antialiased text-slate-900 overflow-x-hidden w-full ${step === 1 ? "lg:aspect-[16/9]" : ""}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Sora:wght@100..800&display=swap');
        .sora { font-family: 'Sora', sans-serif; }
        .font-sans { font-family: 'DM Sans', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>
      <div className={`${step >= 4 ? "w-full" : "max-w-7xl mx-auto"}`}>
        <BuyCryptoBreadcrumbs 
          currentStep={step} 
          onStepClick={(s) => setStep(s)} 
          onBackToDashboard={onBack} 
        />
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
           {step === 1 && <Step1 selectedAsset={selectedAsset} setSelectedAsset={setSelectedAsset} setSelectedNetwork={setSelectedNetwork} payAmount={payAmount} setPayAmount={setPayAmount} searchQuery={searchQuery} setSearchQuery={setSearchQuery} nextStep={nextStep} onViewAll={onBack} />}
           {step === 2 && <Step2 payAmount={payAmount} receiveAmount={receiveAmount} selectedAsset={selectedAsset} selectedNetwork={selectedNetwork} nextStep={nextStep} prevStep={prevStep} expiryTime={expiryTime} isExpired={isExpired} resetExpiry={resetExpiry} onBack={onBack} />}
           {step === 3 && <Step3 selectedAsset={selectedAsset} receiveAmount={receiveAmount} selectedNetwork={selectedNetwork} setSelectedNetwork={setSelectedNetwork} walletAddress={walletAddress} setWalletAddress={setWalletAddress} walletLabel={walletLabel} setWalletLabel={setWalletLabel} nextStep={nextStep} prevStep={prevStep} payAmount={payAmount} expiryTime={expiryTime} isExpired={isExpired} resetExpiry={resetExpiry} onBack={onBack} />}
           {step === 4 && <Step4 payAmount={payAmount} paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} nextStep={nextStep} prevStep={prevStep} receiveAmount={receiveAmount} selectedAsset={selectedAsset} walletAddress={walletAddress} expiryTime={expiryTime} isExpired={isExpired} />}
           {step === 5 && <Step5 paymentMethod={paymentMethod} payAmount={payAmount} receiveAmount={receiveAmount} selectedAsset={selectedAsset} walletAddress={walletAddress} expiryTime={expiryTime} prevStep={prevStep} setStep={setStep} hasPaid={hasPaid} setHasPaid={setHasPaid} proofFile={proofFile} setProofFile={setProofFile} />}
           {step === 6 && <Step6 paymentMethod={paymentMethod} receiveAmount={receiveAmount} selectedAsset={selectedAsset} payAmount={payAmount} walletAddress={walletAddress} onBack={onBack} setStep={setStep} resetExpiry={resetExpiry} setHasPaid={setHasPaid} setProofFile={setProofFile} />}
        </div>
      </div>
    </div>
  );
};

export default BuyFlow;

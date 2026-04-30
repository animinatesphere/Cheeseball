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
} from "lucide-react";

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

const Header = ({ step, onBack }) => (
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
      <div className="mt-4 flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold text-blue-600 uppercase tracking-tight">Price expires in</span>
        </div>
        <span className="text-sm font-bold text-blue-700">{formatTime(expiryTime)}</span>
      </div>
    )}
  </div>
);

const Step1 = ({ selectedAsset, setSelectedAsset, setSelectedNetwork, payAmount, setPayAmount, searchQuery, setSearchQuery, nextStep }) => (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
    <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-auto lg:h-[500px]">
      <div className="p-5 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Choose Asset</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search coins..." 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors"
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
    </div>
    <div className="lg:col-span-7 space-y-6">
      <div className="bg-white rounded-2xl p-6 lg:p-8 border border-slate-200 shadow-sm space-y-8">
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
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
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
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
        </div>
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

const Step2 = ({ payAmount, receiveAmount, selectedAsset, selectedNetwork, nextStep, prevStep, expiryTime, isExpired, resetExpiry }) => (
  <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
    <div className="lg:col-span-8 bg-white rounded-2xl p-6 lg:p-10 border border-slate-200 shadow-sm space-y-10">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 sora">Review Purchase</h2>
        <p className="text-slate-500 mt-1 font-medium">Confirm the details of your purchase before proceeding.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 rounded-3xl p-8 border border-slate-100">
         <div className="space-y-1">
           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">You pay</span>
           <h3 className="text-4xl font-black text-slate-900 sora tracking-tight">{formatNGN(payAmount)}</h3>
         </div>
         <div className="space-y-1 md:text-right">
           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">You receive</span>
           <h3 className="text-4xl font-black text-blue-600 sora tracking-tight">{receiveAmount} {selectedAsset.symbol}</h3>
         </div>
      </div>
      <div className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
         <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold shrink-0" style={{ backgroundColor: selectedAsset.bg, color: selectedAsset.color }}>
           {selectedAsset.icon}
         </div>
         <div className="flex-1">
           <div className="text-lg font-bold text-slate-900">{selectedAsset.name}</div>
           <div className="text-sm font-medium text-slate-500">Network: {selectedNetwork}</div>
         </div>
         <div className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold uppercase tracking-tighter border border-blue-100">
           Locked Price
         </div>
      </div>
      <div className="space-y-4">
         <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pricing Breakdown</h4>
         <div className="space-y-3 p-2">
           <div className="flex justify-between items-center text-sm">
             <span className="text-slate-500 font-medium">Market rate</span>
             <span className="text-slate-900 font-bold">{formatNGN(selectedAsset.price * 0.992)}</span>
           </div>
           <div className="flex justify-between items-center text-sm">
             <span className="text-slate-500 font-medium">Markup / spread (0.8%)</span>
             <span className="text-slate-900 font-bold">{formatNGN(selectedAsset.price * 0.008)}</span>
           </div>
           <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-base">
             <span className="text-slate-900 font-bold">Final rate</span>
             <span className="text-blue-600 font-black">{formatNGN(selectedAsset.price)}</span>
           </div>
         </div>
      </div>
      <div className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-[11px] font-medium text-slate-600 leading-relaxed">
         <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
         <p>This price is temporarily locked. If it expires before you continue, we’ll refresh the price before checkout.</p>
      </div>
      <div className="flex flex-col gap-3 pt-4">
         <button onClick={nextStep} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all">Continue</button>
         <button onClick={prevStep} className="w-full text-slate-500 hover:text-slate-900 py-3 rounded-xl font-bold transition-all text-sm">Edit Amount</button>
      </div>
    </div>
    <div className="lg:col-span-4 sticky top-6">
      <TransactionSummary payAmount={payAmount} receiveAmount={receiveAmount} selectedAsset={selectedAsset} walletAddress={null} expiryTime={expiryTime} isExpired={isExpired} step={2} />
    </div>
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

const Step3 = ({ selectedAsset, receiveAmount, selectedNetwork, setSelectedNetwork, walletAddress, setWalletAddress, walletLabel, setWalletLabel, nextStep, prevStep, payAmount, expiryTime, isExpired }) => (
  <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
    <div className="lg:col-span-8 bg-white rounded-2xl p-6 lg:p-10 border border-slate-200 shadow-sm space-y-10">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 sora">Receive Wallet</h2>
        <p className="text-slate-500 mt-1 font-medium">Where should we send your {selectedAsset.symbol}?</p>
      </div>
      <div className="bg-slate-900 rounded-3xl p-8 text-center space-y-2">
         <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">You'll receive</span>
         <div className="text-4xl lg:text-5xl font-black text-white sora tracking-tight">
           {receiveAmount} <span className="text-blue-500">{selectedAsset.symbol}</span>
         </div>
      </div>
      <div className="space-y-6">
         <div className="space-y-3">
           <label className="text-sm font-bold text-slate-900">Network</label>
           <div className="relative">
              <select value={selectedNetwork} onChange={(e) => setSelectedNetwork(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 outline-none appearance-none focus:border-blue-500">
                {NETWORKS[selectedAsset.symbol].map(nw => <option key={nw} value={nw}>{nw}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
           </div>
         </div>
         <div className="space-y-3">
           <label className="text-sm font-bold text-slate-900">Wallet address</label>
           <input type="text" placeholder={`Paste your ${selectedAsset.symbol} wallet address`} value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-mono font-medium outline-none focus:border-blue-500" />
           {walletAddress.length > 0 && walletAddress.length < 20 && (
             <p className="text-red-500 text-[11px] font-bold flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> Enter a valid {selectedAsset.symbol} wallet address</p>
           )}
         </div>
         <div className="space-y-3">
           <label className="text-sm font-bold text-slate-900">Wallet label (optional)</label>
           <input type="text" placeholder="e.g. My Binance wallet" value={walletLabel} onChange={(e) => setWalletLabel(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium outline-none focus:border-blue-500" />
         </div>
      </div>
      <div className="flex items-start gap-3 p-4 bg-orange-50/50 rounded-xl border border-orange-100 text-[11px] font-medium text-orange-800 leading-relaxed">
         <AlertCircle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
         <p>Make sure this address supports the selected network. Crypto sent to the wrong network may be lost.</p>
      </div>
      <div className="flex flex-col gap-3 pt-4">
         <button onClick={nextStep} disabled={!walletAddress || walletAddress.length < 20} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all">Continue</button>
         <button onClick={prevStep} className="w-full text-slate-500 hover:text-slate-900 py-3 rounded-xl font-bold transition-all text-sm">Back</button>
      </div>
    </div>
    <div className="lg:col-span-4 sticky top-6">
      <TransactionSummary payAmount={payAmount} receiveAmount={receiveAmount} selectedAsset={selectedAsset} walletAddress={walletAddress} expiryTime={expiryTime} isExpired={isExpired} step={3} />
    </div>
  </div>
);

const Step4 = ({ payAmount, paymentMethod, setPaymentMethod, nextStep, prevStep, receiveAmount, selectedAsset, walletAddress, expiryTime, isExpired }) => (
  <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
    <div className="lg:col-span-8 bg-white rounded-2xl p-6 lg:p-10 border border-slate-200 shadow-sm space-y-10">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 sora">Payment Method</h2>
        <p className="text-slate-500 mt-1 font-medium">Choose how you want to pay for your crypto.</p>
      </div>
      <div className="space-y-4">
         {[
           { id: "wallet", title: "NGN Wallet", desc: "Pay instantly from your Cheeseball NGN balance", sub: "Available: ₦250,000.00 • Instant", icon: <Wallet className="w-6 h-6" />, color: "bg-blue-600", activeBg: "bg-blue-50", activeBorder: "border-blue-600" },
           { id: "paystack", title: "Paystack", desc: "Pay with card or bank", sub: "Fast confirmation through Paystack", icon: <CreditCard className="w-6 h-6" />, color: "bg-emerald-500", activeBg: "bg-emerald-50", activeBorder: "border-emerald-600" },
           { id: "bank", title: "Bank Transfer", desc: "Manual bank transfer", sub: "Transfer to our account and upload proof", hint: "Review required", icon: <Building2 className="w-6 h-6" />, color: "bg-orange-500", activeBg: "bg-orange-50", activeBorder: "border-orange-600" },
         ].map((method) => (
           <div key={method.id} onClick={() => setPaymentMethod(method.id)} className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === method.id ? `${method.activeBg} ${method.activeBorder}` : "bg-white border-slate-100 hover:border-slate-200"}`}>
              <div className={`w-12 h-12 rounded-xl ${paymentMethod === method.id ? method.color : "bg-slate-100"} text-white flex items-center justify-center shrink-0 transition-colors`}>{method.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{method.title}</h3>
                  {method.hint && <span className="px-1.5 py-0.5 bg-orange-100 text-orange-600 text-[10px] font-black uppercase rounded-md">{method.hint}</span>}
                </div>
                <p className="text-xs font-medium text-slate-500 leading-tight mt-0.5">{method.desc}</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">{method.sub}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === method.id ? "border-blue-600" : "border-slate-200"}`}>{paymentMethod === method.id && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}</div>
           </div>
         ))}
      </div>
      {paymentMethod === "wallet" && payAmount > 250000 && (
         <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex items-center gap-3">
           <AlertCircle className="w-5 h-5 text-red-600" />
           <span className="text-xs font-bold text-red-700">Insufficient balance. Please switch to another method or fund your wallet.</span>
         </div>
      )}
      <div className="flex flex-col gap-3 pt-4">
         <button onClick={nextStep} disabled={paymentMethod === "wallet" && payAmount > 250000} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all">Continue</button>
         <button onClick={prevStep} className="w-full text-slate-500 hover:text-slate-900 py-3 rounded-xl font-bold transition-all text-sm">Back</button>
      </div>
    </div>
    <div className="lg:col-span-4 sticky top-6">
      <TransactionSummary payAmount={payAmount} receiveAmount={receiveAmount} selectedAsset={selectedAsset} walletAddress={walletAddress} expiryTime={expiryTime} isExpired={isExpired} step={4} />
    </div>
  </div>
);

const Step5 = ({ paymentMethod, payAmount, receiveAmount, selectedAsset, walletAddress, expiryTime, prevStep, setStep, hasPaid, setHasPaid, proofFile, setProofFile }) => {
  const [uploading, setUploading] = useState(false);

  if (paymentMethod === "wallet") {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
         <div className="bg-white rounded-[2.5rem] p-10 lg:p-12 border border-slate-200 shadow-sm space-y-10">
            <h2 className="text-2xl font-bold text-slate-900 sora text-center">Confirm Wallet Payment</h2>
            <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-4">
               <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
               <p className="text-sm font-medium text-blue-800">You are about to pay from your NGN Wallet balance.</p>
            </div>
            <div className="space-y-4">
               <div className="flex justify-between items-center py-3 border-b border-slate-100"><span className="text-sm font-medium text-slate-500">Available balance</span><span className="text-sm font-bold text-slate-900">₦250,000.00</span></div>
               <div className="flex justify-between items-center py-3 border-b border-slate-100"><span className="text-sm font-medium text-slate-500">Amount to pay</span><span className="text-sm font-bold text-red-600">-{formatNGN(payAmount)}</span></div>
               <div className="flex justify-between items-center py-3"><span className="text-sm font-bold text-slate-900">Balance after</span><span className="text-lg font-black text-slate-900 sora">₦147,000.00</span></div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-5 space-y-3">
               <div className="flex justify-between text-xs font-bold text-slate-400 uppercase"><span>You receive</span><span>Wallet</span></div>
               <div className="flex justify-between items-center"><span className="text-lg font-black text-blue-600 sora">{receiveAmount} {selectedAsset.symbol}</span><span className="text-sm font-mono font-bold text-slate-900">{truncateAddress(walletAddress)}</span></div>
            </div>
            <div className="flex items-center gap-4 pt-4">
               <button onClick={prevStep} className="flex-1 text-slate-500 font-bold hover:text-slate-900 py-4 transition-all">Back</button>
               <button onClick={() => setStep(6)} className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2"><Lock className="w-5 h-5" /> Confirm Payment</button>
            </div>
         </div>
      </div>
    );
  }

  if (paymentMethod === "paystack") {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
         <div className="bg-white rounded-[2.5rem] p-10 lg:p-12 border border-slate-200 shadow-sm space-y-10 text-center">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto"><CreditCard className="w-10 h-10" /></div>
            <div className="space-y-2"><h2 className="text-2xl font-bold text-slate-900 sora">Pay with Paystack</h2><p className="text-slate-500 font-medium max-w-sm mx-auto">You will be redirected to Paystack to complete your payment securely.</p></div>
            <div className="max-w-xs mx-auto p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
               <div className="space-y-1"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</span><div className="text-2xl font-black text-slate-900 sora">{formatNGN(payAmount)}</div></div>
               <div className="pt-3 border-t border-slate-200"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">You receive</span><div className="text-sm font-bold text-slate-900">{receiveAmount} {selectedAsset.symbol}</div></div>
               <div className="pt-2"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Wallet</span><div className="text-xs font-mono font-medium text-slate-900">{truncateAddress(walletAddress)}</div></div>
            </div>
            <div className="flex items-center gap-2 justify-center py-2 px-4 bg-orange-50 text-orange-600 rounded-full w-fit mx-auto border border-orange-100"><Clock className="w-4 h-4" /><span className="text-xs font-bold uppercase tracking-tight">Quote expires in: {formatTime(expiryTime)}</span></div>
            <div className="flex items-center gap-4 pt-4">
               <button onClick={prevStep} className="flex-1 text-slate-500 font-bold hover:text-slate-900 py-4 transition-all">Back</button>
               <button onClick={() => setStep(6)} className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 group">Proceed to Paystack <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-all" /></button>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Secure payment powered by Paystack</p>
         </div>
      </div>
    );
  }

  if (paymentMethod === "bank") {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
         <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 border border-slate-200 shadow-sm space-y-8">
            <h2 className="text-2xl font-bold text-slate-900 sora text-center">{hasPaid ? "Upload Payment Proof" : "Bank Transfer Details"}</h2>
            {!hasPaid ? (
              <>
                <div className="p-8 bg-slate-900 rounded-[2rem] text-center space-y-2"><span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transfer exactly</span><div className="text-4xl font-black text-white sora">{formatNGN(payAmount)}</div></div>
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bank Details</h3>
                  <div className="space-y-3">
                    {[{ label: "Bank", val: "Example Bank" }, { label: "Account Name", val: "CheeseBall Technologies" }, { label: "Account Number", val: "1234567890", copy: true }].map((item, i) => (
                      <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100"><span className="text-sm font-medium text-slate-500">{item.label}</span><div className="flex items-center gap-2"><span className="text-sm font-bold text-slate-900">{item.val}</span>{item.copy && <Copy className="w-4 h-4 text-blue-600 cursor-pointer hover:scale-110 transition-transform" />}</div></div>
                    ))}
                  </div>
                </div>
                <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 flex items-start gap-3"><AlertCircle className="w-5 h-5 text-orange-600 shrink-0" /><p className="text-xs font-medium text-orange-800">After payment, upload your proof of transfer for faster review.</p></div>
                <div className="flex items-center gap-4 pt-4"><button onClick={prevStep} className="flex-1 text-slate-500 font-bold hover:text-slate-900 py-4 transition-all">Back</button><button onClick={() => setHasPaid(true)} className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-xl">I Have Paid</button></div>
              </>
            ) : (
              <>
                <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center space-y-4 hover:border-blue-300 transition-all cursor-pointer bg-slate-50/50" onClick={() => document.getElementById('fileInput').click()}>
                  <input type="file" id="fileInput" className="hidden" onChange={(e) => setProofFile(e.target.files[0])} />
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-600"><Upload className="w-8 h-8" /></div>
                  <div><h4 className="text-base font-bold text-slate-900">Upload screenshot or receipt</h4><p className="text-xs font-medium text-slate-500">Max file size 5MB (JPG, PNG or PDF)</p></div>
                  {proofFile && <div className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase rounded-full">{proofFile.name}</div>}
                </div>
                <div className="flex items-center gap-4 pt-4"><button onClick={() => setHasPaid(false)} className="flex-1 text-slate-500 font-bold hover:text-slate-900 py-4 transition-all">Back</button><button onClick={() => { setUploading(true); setTimeout(() => { setUploading(false); setStep(6); }, 2000); }} disabled={!proofFile || uploading} className="flex-[2] bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-4 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2">{uploading ? <RefreshCw className="w-5 h-5 animate-spin" /> : "Submit for Review"}</button></div>
              </>
            )}
         </div>
      </div>
    );
  }
};

const Step6 = ({ paymentMethod, receiveAmount, selectedAsset, payAmount, walletAddress, onBack, setStep, resetExpiry, setHasPaid, setProofFile }) => (
  <div className="max-w-2xl mx-auto py-10">
    <div className="bg-white rounded-[3rem] p-10 lg:p-16 border border-slate-200 shadow-2xl text-center space-y-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -ml-32 -mb-32 opacity-50" />
      <div className="relative space-y-8">
        <div className="w-24 h-24 bg-emerald-500 text-white rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-200 scale-110"><Check className="w-12 h-12" strokeWidth={3} /></div>
        <div className="space-y-3">
          <h2 className="text-3xl font-black text-slate-900 sora uppercase tracking-tight">{paymentMethod === "bank" ? "Transfer Submitted!" : "Purchase Successful!"}</h2>
          <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">{paymentMethod === "bank" ? "Your transfer proof has been received and is currently under review. Your crypto will be sent shortly." : `Your purchase of ${receiveAmount} ${selectedAsset.symbol} was successful. The assets have been sent to your wallet.`}</p>
        </div>
        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 space-y-4 max-w-md mx-auto">
           <div className="flex justify-between items-center text-sm"><span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Amount Paid</span><span className="text-slate-900 font-black">{formatNGN(payAmount)}</span></div>
           <div className="flex justify-between items-center text-sm"><span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Asset Received</span><span className="text-blue-600 font-black">{receiveAmount} {selectedAsset.symbol}</span></div>
           <div className="pt-4 border-t border-slate-200 flex justify-between items-center"><span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Wallet Address</span><span className="text-xs font-mono font-bold text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-100">{truncateAddress(walletAddress)}</span></div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
           <button onClick={onBack} className="flex-1 bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-bold shadow-xl transition-all">Go to Dashboard</button>
           <button onClick={() => { setStep(1); resetExpiry(); setHasPaid(false); setProofFile(null); }} className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 py-4 rounded-2xl font-bold border border-blue-100 transition-all">Buy More Crypto</button>
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
  const [expiryTime, setExpiryTime] = useState(300);
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

  const resetExpiry = () => { setExpiryTime(300); setIsExpired(false); };
  const nextStep = () => setStep(prev => Math.min(prev + 1, 6));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-8 font-sans antialiased text-slate-900 overflow-x-hidden lg:aspect-[16/9]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Sora:wght@100..800&display=swap');
        .sora { font-family: 'Sora', sans-serif; }
        .font-sans { font-family: 'DM Sans', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>
      <div className="max-w-7xl mx-auto">
        <Header step={step} onBack={onBack} />
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
           {step === 1 && <Step1 selectedAsset={selectedAsset} setSelectedAsset={setSelectedAsset} setSelectedNetwork={setSelectedNetwork} payAmount={payAmount} setPayAmount={setPayAmount} searchQuery={searchQuery} setSearchQuery={setSearchQuery} nextStep={nextStep} />}
           {step === 2 && <Step2 payAmount={payAmount} receiveAmount={receiveAmount} selectedAsset={selectedAsset} selectedNetwork={selectedNetwork} nextStep={nextStep} prevStep={prevStep} expiryTime={expiryTime} isExpired={isExpired} resetExpiry={resetExpiry} />}
           {step === 3 && <Step3 selectedAsset={selectedAsset} receiveAmount={receiveAmount} selectedNetwork={selectedNetwork} setSelectedNetwork={setSelectedNetwork} walletAddress={walletAddress} setWalletAddress={setWalletAddress} walletLabel={walletLabel} setWalletLabel={setWalletLabel} nextStep={nextStep} prevStep={prevStep} payAmount={payAmount} expiryTime={expiryTime} isExpired={isExpired} />}
           {step === 4 && <Step4 payAmount={payAmount} paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} nextStep={nextStep} prevStep={prevStep} receiveAmount={receiveAmount} selectedAsset={selectedAsset} walletAddress={walletAddress} expiryTime={expiryTime} isExpired={isExpired} />}
           {step === 5 && <Step5 paymentMethod={paymentMethod} payAmount={payAmount} receiveAmount={receiveAmount} selectedAsset={selectedAsset} walletAddress={walletAddress} expiryTime={expiryTime} prevStep={prevStep} setStep={setStep} hasPaid={hasPaid} setHasPaid={setHasPaid} proofFile={proofFile} setProofFile={setProofFile} />}
           {step === 6 && <Step6 paymentMethod={paymentMethod} receiveAmount={receiveAmount} selectedAsset={selectedAsset} payAmount={payAmount} walletAddress={walletAddress} onBack={onBack} setStep={setStep} resetExpiry={resetExpiry} setHasPaid={setHasPaid} setProofFile={setProofFile} />}
        </div>
      </div>
    </div>
  );
};

export default BuyFlow;

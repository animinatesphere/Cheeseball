import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  ChevronRight, 
  Copy, 
  CheckCircle2, 
  Upload, 
  Clock, 
  ShieldCheck, 
  Info, 
  CreditCard, 
  Building2, 
  AlertCircle,
  Loader2,
  Wallet,
  Globe,
  Zap
} from "lucide-react";

/* ── MOCK DATA ─────────────────────────────────────────────── */
const ASSETS = [
  { symbol: "BTC",  name: "Bitcoin",  icon: "₿", color: "#F7931A", bg: "#FEF3E2", rate: 145000000 },
  { symbol: "ETH",  name: "Ethereum", icon: "Ξ", color: "#627EEA", bg: "#EEEFFE", rate: 5800000 },
  { symbol: "USDT", name: "Tether",   icon: "₮", color: "#26A17B", bg: "#E6F7F2", rate: 1650 },
  { symbol: "SOL",  name: "Solana",   icon: "◎", color: "#9945FF", bg: "#F1E9FF", rate: 245000 },
];

const NETWORKS = [
  { symbol: "BTC",  networks: ["Bitcoin (Legacy)", "SegWit", "Lightning"] },
  { symbol: "ETH",  networks: ["ERC-20", "Arbitrum", "Optimism", "Polygon"] },
  { symbol: "USDT", networks: ["TRC-20", "ERC-20", "BEP-20", "Solana"] },
  { symbol: "SOL",  networks: ["Solana Mainnet"] },
];

const BANK_DETAILS = {
  bankName: "Opay Digital Bank",
  accountName: "Cheeseball Global Enterprise",
  accountNumber: "8123456789",
};

/* ── SUB-COMPONENTS (Moved outside to prevent focus loss) ─────── */

// 1. QUOTE STEP
const QuoteStep = ({ formData, setFormData, updateAmount, nextStep }) => (
  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
    <div className="bg-white rounded-[2rem] p-6 lg:p-8 border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
      <div className="flex justify-between items-center px-1">
        <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Select Asset</label>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full">
          <Zap className="w-3" size={12} />
          <span className="text-[10px] font-black text-emerald-600 uppercase">Best Price Active</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {ASSETS.map(a => (
          <button
            key={a.symbol}
            onClick={() => setFormData(prev => ({ ...prev, asset: a }))}
            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
              formData.asset.symbol === a.symbol 
                ? "border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-900/10" 
                : "border-slate-50 bg-white hover:border-slate-200"
            }`}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg border shadow-sm" style={{ background: a.bg, color: a.color }}>
              {a.icon}
            </div>
            <span className="sora font-black text-sm text-slate-900">{a.symbol}</span>
          </button>
        ))}
      </div>

      <div className="space-y-4 pt-4">
         {/* NGN Input */}
         <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 transition-all focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">You Pay (NGN)</span>
              <span className="text-[10px] font-bold text-slate-400">Min: ₦10,000</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="sora font-black text-2xl text-slate-400">₦</span>
              <input 
                type="number"
                placeholder="0.00"
                value={formData.amountNGN}
                onChange={(e) => updateAmount(e.target.value, "NGN")}
                className="bg-transparent text-right text-3xl font-black sora text-slate-900 placeholder-slate-200 outline-none w-full"
                autoFocus
              />
            </div>
         </div>

         {/* Crypto Result */}
         <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">You Receive ({formData.asset.symbol})</span>
              <span className="text-[10px] font-bold text-slate-400">Rate: ₦{formData.asset.rate.toLocaleString()} / {formData.asset.symbol}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm border shadow-sm bg-white" style={{ color: formData.asset.color }}>
                 {formData.asset.icon}
              </div>
              <input 
                type="number"
                placeholder="0.000000"
                value={formData.amountCrypto}
                onChange={(e) => updateAmount(e.target.value, "Crypto")}
                className="bg-transparent text-right text-3xl font-black sora text-slate-900 placeholder-slate-200 outline-none w-full"
              />
            </div>
         </div>
      </div>

      <button 
        onClick={nextStep}
        disabled={!formData.amountNGN || parseFloat(formData.amountNGN) < 1000}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white sora font-black py-5 rounded-3xl shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-30 disabled:pointer-events-none"
      >
        Next Step <ChevronRight className="w-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  </div>
);

// 2. DESTINATION STEP
const DestinationStep = ({ formData, setFormData, nextStep, prevStep }) => (
  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
    <div className="bg-white rounded-[2rem] p-6 lg:p-8 border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
      <h2 className="sora font-black text-slate-900 text-xl">Wallet Details</h2>
      <p className="text-slate-500 text-sm font-bold">Enter your {formData.asset.name} destination address correctly.</p>

      <div className="space-y-4 pt-2">
         <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Choose Network</label>
            <div className="grid grid-cols-1 gap-2">
               {NETWORKS.find(n => n.symbol === formData.asset.symbol)?.networks.map(net => (
                 <button
                   key={net}
                   onClick={() => setFormData(prev => ({ ...prev, network: net }))}
                   className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                     formData.network === net 
                      ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm" 
                      : "border-slate-100 bg-white hover:border-slate-200"
                   }`}
                 >
                   <div className="flex items-center gap-3">
                      <Globe className={`w-4 ${formData.network === net ? "text-blue-600" : "text-slate-400"}`} />
                      <span className="text-sm font-black">{net}</span>
                   </div>
                   {formData.network === net && <CheckCircle2 className="w-4 h-4" />}
                 </button>
               ))}
            </div>
         </div>

         <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 transition-all focus-within:border-blue-300">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Recipient Wallet Address</label>
            <div className="flex items-center gap-3">
               <Wallet className="text-slate-300 w-6 h-6" />
               <input 
                  type="text"
                  placeholder={`Paste ${formData.asset.symbol} address here...`}
                  value={formData.walletAddress}
                  onChange={(e) => setFormData(prev => ({ ...prev, walletAddress: e.target.value }))}
                  className="bg-transparent w-full sora font-bold text-sm text-slate-900 placeholder-slate-300 outline-none"
                  autoFocus
               />
            </div>
         </div>

         <div className="bg-amber-50 rounded-2xl p-5 flex items-start gap-4 border border-amber-100">
            <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
            <p className="text-amber-800 text-[11px] font-bold leading-relaxed">
               Sending {formData.asset.symbol} to a different network or the wrong address will result in permanent loss of funds. Triple check before proceeding.
            </p>
         </div>
      </div>

      <div className="flex gap-4">
        <button onClick={prevStep} className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-900 sora font-black py-5 rounded-3xl transition-all">Back</button>
        <button 
          disabled={!formData.walletAddress || !formData.network}
          onClick={nextStep}
          className="flex-[2] bg-slate-900 hover:bg-black text-white sora font-black py-5 rounded-3xl shadow-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-30"
        >
          Choose Payment <ChevronRight className="w-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  </div>
);

// 3. PAYMENT METHOD SELECTION
const PaymentStep = ({ formData, setFormData, nextStep, prevStep }) => (
  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
    <div className="bg-white rounded-[2rem] p-6 lg:p-8 border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
      <h2 className="sora font-black text-slate-900 text-xl">Payment Method</h2>
      
      <div className="space-y-4 pt-2">
         <button
           onClick={() => setFormData(prev => ({ ...prev, paymentMethod: "bank_transfer" }))}
           className={`w-full flex items-center gap-5 p-6 rounded-3xl border-2 transition-all text-left ${
             formData.paymentMethod === "bank_transfer" 
               ? "border-blue-600 bg-blue-50 shadow-lg shadow-blue-900/5" 
               : "border-slate-50 bg-white"
           }`}
         >
            <div className="w-14 h-14 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center text-blue-600 transition-colors">
               <Building2 className="w-7 h-7" />
            </div>
            <div className="flex-1">
               <h3 className="sora font-black text-slate-900 text-sm">Direct Bank Transfer</h3>
               <p className="text-slate-500 text-[11px] font-bold mt-1">Transfer manually to our bank account. Instant review.</p>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === "bank_transfer" ? "border-blue-600 bg-blue-600" : "border-slate-200"}`}>
               {formData.paymentMethod === "bank_transfer" && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
            </div>
         </button>

         <div className="w-full flex items-center gap-5 p-6 rounded-3xl border-2 border-slate-50 bg-slate-50/50 opacity-60 cursor-not-allowed">
            <div className="w-14 h-14 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center text-slate-400">
               <CreditCard className="w-7 h-7" />
            </div>
            <div className="flex-1">
               <h3 className="sora font-black text-slate-400 text-sm">Debit Card (Paystack)</h3>
               <p className="text-slate-400 text-[11px] font-bold mt-1 uppercase tracking-widest">Available Soon</p>
            </div>
         </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button onClick={prevStep} className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-900 sora font-black py-5 rounded-3xl transition-all">Back</button>
        <button 
          onClick={nextStep}
          className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white sora font-black py-5 rounded-3xl shadow-xl transition-all flex items-center justify-center gap-2 group"
        >
          Review Order <ChevronRight className="w-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  </div>
);

// 4. REVIEW & INSTRUCTIONS
const InstructionsStep = ({ formData, handleCopy, copied, nextStep }) => (
  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
    <div className="bg-white rounded-[2rem] p-6 lg:p-8 border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
      <div className="text-center pb-2">
         <h2 className="sora font-black text-slate-900 text-xl mb-2">Order Summary</h2>
         <p className="text-slate-400 text-sm font-bold">Transfer the target amount to receive your crypto.</p>
      </div>

      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 divide-y divide-slate-200/50">
         <div className="flex justify-between py-4">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Amount to Pay</span>
            <span className="sora font-black text-lg text-slate-900">₦{parseFloat(formData.amountNGN).toLocaleString()}</span>
         </div>
         <div className="flex justify-between py-4">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Buying</span>
            <div className="flex items-center gap-2">
               <span className="sora font-black text-blue-600 text-lg">{formData.amountCrypto} {formData.asset.symbol}</span>
            </div>
         </div>
         <div className="flex justify-between py-4">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Asset Network</span>
            <span className="text-xs font-black text-slate-700 uppercase tracking-widest px-3 py-1 bg-white rounded-lg border border-slate-100">{formData.network}</span>
         </div>
      </div>

      {/* BANK INSTRUCTIONS */}
      <div className="bg-blue-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-500/30">
         <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
         <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
               <Building2 className="w-5 h-5 text-blue-200" />
               <h3 className="sora font-black uppercase text-[10px] tracking-widest text-blue-200">Bank Transfer Details</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
               <div>
                  <label className="text-[9px] font-black text-blue-200/60 uppercase tracking-[0.2em] block mb-1">Bank Name</label>
                  <p className="sora font-black text-lg">{BANK_DETAILS.bankName}</p>
               </div>
               <div className="flex items-center justify-between group">
                  <div>
                     <label className="text-[9px] font-black text-blue-200/60 uppercase tracking-[0.2em] block mb-1">Account Number</label>
                     <p className="sora font-black text-2xl tracking-widest">{BANK_DETAILS.accountNumber}</p>
                  </div>
                  <button 
                    onClick={() => handleCopy(BANK_DETAILS.accountNumber, 'acc')}
                    className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition-all border border-white/10 backdrop-blur-md"
                  >
                     {copied === 'acc' ? <CheckCircle2 className="text-emerald-400" size={20} /> : <Copy size={20} />}
                  </button>
               </div>
               <div>
                  <label className="text-[9px] font-black text-blue-200/60 uppercase tracking-[0.2em] block mb-1">Account Name</label>
                  <p className="sora font-black text-lg">{BANK_DETAILS.accountName}</p>
               </div>
            </div>
         </div>
      </div>

      <button 
        onClick={nextStep}
        className="w-full bg-slate-900 hover:bg-black text-white sora font-black py-5 rounded-3xl shadow-xl transition-all flex items-center justify-center gap-2 group"
      >
        I have made the transfer <ChevronRight className="w-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  </div>
);

// 5. UPLOAD PROOF
const UploadStep = ({ formData, setFormData, uploading, setUploading, nextStep }) => (
  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
    <div className="bg-white rounded-[2rem] p-6 lg:p-8 border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
      <h2 className="sora font-black text-slate-900 text-xl">Proof of Payment</h2>
      <p className="text-slate-500 text-sm font-bold leading-relaxed">
         Upload a screenshot of your successful transfer receipt. This speeds up your verification.
      </p>

      <div className="pt-2">
         <div 
           className={`relative border-2 border-dashed rounded-[2rem] p-10 text-center transition-all cursor-pointer ${
             formData.receiptUrl ? "border-emerald-200 bg-emerald-50/30" : "border-slate-200 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/30"
           }`}
           onClick={() => !uploading && setUploading(true)}
         >
            {uploading ? (
               <div className="flex flex-col items-center gap-4 py-4">
                  <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                  <span className="sora font-black text-sm text-blue-700 uppercase tracking-widest">Uploading to secure server...</span>
               </div>
            ) : formData.receiptUrl ? (
               <div className="flex flex-col items-center gap-4 py-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                     <CheckCircle2 size={32} />
                  </div>
                  <div>
                     <span className="sora font-black text-sm text-emerald-700 block mb-1">Receipt Received</span>
                     <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">File: transfer_receipt_001.png</span>
                  </div>
               </div>
            ) : (
               <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center text-slate-400">
                     <Upload size={32} />
                  </div>
                  <div>
                     <span className="sora font-black text-sm text-slate-900 block mb-1">Choose Screenshot</span>
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">JPG, PNG, max 10MB</span>
                  </div>
               </div>
            )}
            {/* Simulation trigger */}
            {uploading && setTimeout(() => {
              setUploading(false);
              setFormData(prev => ({ ...prev, receiptUrl: "mock_url" }));
            }, 2000)}
         </div>
      </div>

      <div className="space-y-4 pt-2">
         <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 transition-all focus-within:border-blue-300">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Reference / Memo (Optional)</label>
            <input 
               type="text"
               placeholder="Enter bank reference number..."
               value={formData.receiptReference}
               onChange={(e) => setFormData(prev => ({ ...prev, receiptReference: e.target.value }))}
               className="bg-transparent w-full sora font-bold text-sm text-slate-900 placeholder-slate-300 outline-none"
            />
         </div>
      </div>

      <button 
         onClick={nextStep}
         disabled={!formData.receiptUrl}
         className="w-full bg-blue-600 hover:bg-blue-700 text-white sora font-black py-5 rounded-3xl shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-30"
      >
        Submit for Review <ChevronRight className="w-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  </div>
);

// 6. FINAL STATUS TRACKER
const StatusStep = ({ onBack }) => (
  <div className="animate-in fade-in zoom-in-95 duration-500">
     <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 border border-slate-100 shadow-2xl shadow-slate-300/50 text-center space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
        
        <div className="relative z-10 flex flex-col items-center">
           <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mb-6 shadow-lg shadow-blue-100 border border-blue-100">
              <Clock className="w-12 h-12" />
           </div>
           <h2 className="sora font-black text-slate-900 text-2xl lg:text-3xl mb-3 tracking-tight">Processing Payment</h2>
           <p className="text-slate-500 text-sm font-bold leading-relaxed max-w-sm mx-auto">
              Your transfer proof has been submitted. Our team is manually verifying the transaction. This usually takes 5-15 minutes.
           </p>
        </div>

        <div className="relative z-10 w-full bg-slate-50 rounded-3xl p-6 space-y-6">
           {/* Timeline */}
           {[
             { icon: CheckCircle2, label: "Proof Uploaded", status: "completed", time: "Just now" },
             { icon: Loader2,      label: "Awaiting Bank Confirmation", status: "active", time: "Estimated 5m" },
             { icon: Wallet,       label: "Crypto Disbursement", status: "pending", time: "Pending" }
           ].map((item, idx) => {
             const Icon = item.icon;
             return (
                <div key={item.label} className="flex items-start gap-4 text-left">
                   <div className="flex flex-col items-center gap-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        item.status === 'completed' ? "bg-emerald-500 text-white" : 
                        item.status === 'active' ? "bg-blue-600 text-white animate-pulse" : 
                        "bg-slate-200 text-slate-400"
                      }`}>
                         <Icon size={14} className={item.status === 'active' ? "animate-spin" : ""} />
                      </div>
                      {idx !== 2 && <div className={`w-0.5 h-6 rounded-full ${item.status === 'completed' ? "bg-emerald-500" : "bg-slate-200"}`} />}
                   </div>
                   <div className="flex-1 pt-1">
                      <p className={`sora font-black text-xs ${item.status === 'pending' ? "text-slate-400" : "text-slate-900"}`}>{item.label}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.time}</p>
                   </div>
                </div>
             );
           })}
        </div>

        <button 
           onClick={onBack}
           className="w-full bg-slate-900 hover:bg-black text-white sora font-black py-5 rounded-3xl transition-all shadow-lg"
        >
           Return to Dashboard
        </button>

        <div className="flex items-center justify-center gap-2">
           <ShieldCheck size={14} className="text-blue-600" />
           <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Insured by CheeseBall Guarantee</span>
        </div>
     </div>
  </div>
);

/* ── MAIN FLOW COMPONENT ─────────────────────────────────────── */

const BuyFlow = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    asset: ASSETS[0],
    amountNGN: "",
    amountCrypto: "",
    walletAddress: "",
    network: "",
    paymentMethod: "bank_transfer",
    receiptUrl: "",
    receiptReference: "",
  });

  const [copied, setCopied] = useState(null);
  const [uploading, setUploading] = useState(false);

  /* ── Handlers ─────────────────────────────────────────────── */
  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const updateAmount = (val, type) => {
    if (type === "NGN") {
      setFormData(prev => ({
        ...prev,
        amountNGN: val,
        amountCrypto: val ? (parseFloat(val) / prev.asset.rate).toFixed(6) : ""
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        amountCrypto: val,
        amountNGN: val ? (parseFloat(val) * prev.asset.rate).toFixed(2) : ""
      }));
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-100 px-6 lg:px-12 py-6 flex items-center justify-between sticky top-0 z-[100]">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="sora font-black text-slate-900 text-lg uppercase tracking-tight">Buy Crypto</h1>
            <div className="flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step {step} of 6</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Safe Mode</span>
              <div className="w-8 h-4 bg-blue-600 rounded-full relative">
                 <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full" />
              </div>
           </div>
           <button className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
              <Info size={18} />
           </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 mt-8 lg:mt-12">
        {step === 1 && <QuoteStep formData={formData} setFormData={setFormData} updateAmount={updateAmount} nextStep={nextStep} />}
        {step === 2 && <DestinationStep formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />}
        {step === 3 && <PaymentStep formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />}
        {step === 4 && <InstructionsStep formData={formData} handleCopy={handleCopy} copied={copied} nextStep={nextStep} />}
        {step === 5 && <UploadStep formData={formData} setFormData={setFormData} uploading={uploading} setUploading={setUploading} nextStep={nextStep} />}
        {step === 6 && <StatusStep onBack={onBack} />}
      </main>

      {/* FOOTER NAV (Breadcrumbs) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 lg:hidden">
         <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${step >= i ? "bg-blue-600 w-8" : "bg-slate-100"}`} />
            ))}
         </div>
      </div>

      <style>{`
        @keyframes in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-in { animation: in 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default BuyFlow;

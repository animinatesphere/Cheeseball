import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, 
  Copy,  
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Zap, 
  Loader2, 
  AlertCircle,
  QrCode,
  Info,
  ArrowRight,
  Wallet,
  Globe,
  RefreshCw
} from "lucide-react";
import { 
  getCurrencies, 
  createDeposit, 
  getDepositStatus 
} from "../../lib/api";

const DepositFlow = ({ onBack, onNavigate }) => {
  /* ── STATE ─────────────────────────────────────────────────── */
  const [step, setStep] = useState(1); // 1: Input, 2: Details/Polling, 3: Success
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  
  // Form State
  const [asset, setAsset] = useState("USDT");
  const [amount, setAmount] = useState("");
  
  // Deposit Data
  const [deposit, setDeposit] = useState(null);
  const [status, setStatus] = useState("pending"); // pending, completed, failed
  
  const pollingRef = useRef(null);
  const pollCountRef = useRef(0);

  /* ── INITIALIZATION ────────────────────────────────────────── */
  useEffect(() => {
    const init = async () => {
      try {
        const { data: currData } = await getCurrencies();
        if (currData) {
          setCurrencies(currData.filter(c => c.is_active && c.symbol !== "NGN"));
        }
      } catch (err) {
        console.error("Init error:", err);
        setError("Failed to load supported assets.");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  /* ── POLLING LOGIC ─────────────────────────────────────────── */
  useEffect(() => {
    if (deposit && step === 2 && status === "pending") {
      const poll = async () => {
        try {
          pollCountRef.current += 1;
          const data = await getDepositStatus(deposit.id);
          
          if (data.status === "completed") {
            setStatus("completed");
            setStep(3);
            clearInterval(pollingRef.current);
          } else if (data.status === "failed") {
            setStatus("failed");
            setError("Deposit matching failed. Please contact support.");
            clearInterval(pollingRef.current);
          }
          
          // Backoff logic
          if (pollCountRef.current > 24) { // After 2 minutes (assuming 5s interval)
            clearInterval(pollingRef.current);
            pollingRef.current = setInterval(poll, 30000); // Switch to 30s
          }
        } catch (err) {
          console.warn("Polling error:", err);
        }
      };

      pollingRef.current = setInterval(poll, 5000);
      return () => clearInterval(pollingRef.current);
    }
  }, [deposit, step, status]);

  /* ── HANDLERS ─────────────────────────────────────────────── */
  const handleCreateIntent = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    setCreating(true);
    setError(null);
    try {
      const data = await createDeposit(asset, amount);
      setDeposit(data);
      setStep(2);
      pollCountRef.current = 0;
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const getAssetIcon = (symbol) => {
    const curr = currencies.find(c => c.symbol === symbol);
    if (curr?.icon_url) return <img src={curr.icon_url} alt="" className="w-full h-full object-contain" />;
    return <span className="font-black text-xs">{symbol[0]}</span>;
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    // Simple visual feedback could be added here if needed
  };

  /* ── RENDERERS ─────────────────────────────────────────────── */
  
  if (loading && step === 1) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-8">
        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
        <p className="sora font-black text-slate-400 uppercase tracking-widest text-xs">Loading Assets...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 animate-in fade-in duration-700">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 lg:mb-16">
        <div className="flex items-center gap-4 lg:gap-6">
          <button onClick={onBack} className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-all shadow-sm hover:shadow-md">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="sora font-black text-slate-900 text-xl lg:text-3xl uppercase tracking-tight">Deposit Crypto</h1>
            <div className="flex items-center gap-2 mt-1">
               <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
               <p className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest">Instant detection enabled</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-2xl mx-auto mb-10 bg-red-50 border border-red-100 rounded-[2rem] p-6 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
          <p className="text-red-700 text-xs font-bold leading-relaxed">{error}</p>
        </div>
      )}

      {/* STEP 1: INPUT */}
      {step === 1 && (
        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
           <div className="bg-white rounded-[2.5rem] p-6 lg:p-10 border border-slate-100 shadow-2xl shadow-slate-200/50 space-y-10">
              <div className="space-y-6">
                 {/* ASSET SELECT */}
                 <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Select Asset to Deposit</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                       {currencies.map(c => (
                          <button 
                            key={c.symbol}
                            onClick={() => setAsset(c.symbol)}
                            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                              asset === c.symbol 
                                ? "border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-900/10" 
                                : "border-slate-50 bg-white hover:border-slate-100"
                            }`}
                          >
                             <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center border shadow-sm">
                                {getAssetIcon(c.symbol)}
                             </div>
                             <span className="sora font-black text-xs text-slate-900">{c.symbol}</span>
                          </button>
                       ))}
                    </div>
                 </div>

                 {/* AMOUNT INPUT */}
                 <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Amount to Send</label>
                    <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6 lg:p-8 transition-all focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-50">
                       <div className="flex items-center justify-between">
                          <input 
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="bg-transparent text-3xl lg:text-4xl font-black sora text-slate-900 placeholder-slate-200 outline-none w-full"
                          />
                          <span className="sora font-black text-xl text-slate-400">{asset}</span>
                       </div>
                    </div>
                 </div>
              </div>

              <button 
                onClick={handleCreateIntent}
                disabled={!amount || parseFloat(amount) <= 0 || creating}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white sora font-black py-6 rounded-3xl shadow-2xl shadow-blue-500/25 transition-all flex items-center justify-center gap-3 group disabled:opacity-30"
              >
                {creating ? <Loader2 className="w-7 h-7 animate-spin" /> : (
                  <>
                    <span className="text-lg">Generate Deposit Address</span>
                    <Zap className="w-5 h-5 group-hover:scale-125 transition-transform" />
                  </>
                )}
              </button>
           </div>
        </div>
      )}

      {/* STEP 2: DEPOSIT DETAILS */}
      {step === 2 && deposit && (
        <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-8 animate-in fade-in zoom-in-95 duration-500">
           {/* Main Column */}
           <div className="flex-[1.5] space-y-6">
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
                 <div className="bg-slate-900 px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                       <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Awaiting your transfer</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-400">
                       <Clock size={14} className="animate-spin-slow" />
                       <span className="sora font-black text-[10px] uppercase">Polling Status...</span>
                    </div>
                 </div>

                 <div className="p-8 lg:p-10 space-y-10">
                    {/* QR & Instruction */}
                    <div className="flex flex-col items-center text-center space-y-6">
                       <div className="p-4 bg-white rounded-3xl border border-slate-100 shadow-xl">
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${deposit.platform_address}`} 
                            alt="Deposit QR" 
                            className="w-40 h-40 lg:w-48 lg:h-48"
                          />
                       </div>
                       <div className="space-y-2">
                          <h2 className="sora font-black text-slate-900 text-xl lg:text-2xl uppercase tracking-tight">Send exactly {deposit.expected_amount} {deposit.asset}</h2>
                          <p className="text-slate-500 text-xs font-bold max-w-sm mx-auto leading-relaxed uppercase tracking-widest opacity-60">To the following wallet address below</p>
                       </div>
                    </div>

                    {/* DETAILS GRID */}
                    <div className="space-y-4">
                       {/* ADDRESS */}
                       <div className="bg-slate-50 rounded-[2rem] p-6 lg:p-8 border border-slate-100 relative group">
                          <div className="flex flex-col gap-1 mb-2">
                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Platform Wallet Address</label>
                             <div className="flex items-center gap-3">
                                <p className="text-sm lg:text-base font-bold text-slate-900 break-all font-mono tracking-tight">{deposit.platform_address}</p>
                                <button 
                                  onClick={(e) => {
                                    copyToClipboard(deposit.platform_address);
                                    const btn = e.currentTarget;
                                    btn.innerHTML = '<span class="text-[10px] font-black text-emerald-600">COPIED</span>';
                                    setTimeout(() => btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>', 2000);
                                  }}
                                  className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm shrink-0"
                                >
                                   <Copy size={18} />
                                </button>
                             </div>
                          </div>
                       </div>

                       {/* REFERENCE */}
                       <div className="bg-blue-50 rounded-[2rem] p-6 lg:p-8 border border-blue-100 relative">
                          <div className="flex flex-col gap-1 mb-2">
                             <label className="text-[9px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                                Reference Code <span className="px-1.5 py-0.5 bg-blue-100 rounded-md text-blue-600 tracking-tighter">REQUIRED</span>
                             </label>
                             <div className="flex items-center justify-between gap-4">
                                <p className="text-2xl font-black text-blue-900 sora tracking-[0.2em]">{deposit.reference_code}</p>
                                <button 
                                  onClick={(e) => {
                                    copyToClipboard(deposit.reference_code);
                                    const btn = e.currentTarget;
                                    btn.innerHTML = '<span class="text-[10px] font-black text-blue-600 uppercase">COPIED</span>';
                                    setTimeout(() => btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>', 2000);
                                  }}
                                  className="p-3 bg-white border border-blue-200 rounded-2xl text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm shrink-0"
                                >
                                   <Copy size={18} />
                                </button>
                             </div>
                             <p className="text-[10px] font-bold text-blue-700 mt-3 opacity-60">Include this code in the memo/note if your network supports it.</p>
                          </div>
                       </div>
                    </div>

                    {/* NETWORK INFO */}
                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Network</p>
                          <p className="text-sm font-black text-slate-900">{deposit.network || "Standard"}</p>
                       </div>
                       <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Memo Support</p>
                          <p className={`text-sm font-black ${deposit.memo_supported ? "text-emerald-600" : "text-slate-500"}`}>
                             {deposit.memo_supported ? "Required" : "Not Supported"}
                          </p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Sidebar Instructions */}
           <div className="flex-1 space-y-6">
              <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40">
                 <h3 className="sora font-black text-slate-900 text-sm uppercase mb-6 tracking-tight">Deposit Instructions</h3>
                 <div className="space-y-6">
                    <div className="flex gap-4">
                       <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 sora font-black text-xs text-slate-900">1</div>
                       <p className="text-[11px] font-bold text-slate-400 leading-relaxed pt-1">Copy the platform address and open your crypto wallet.</p>
                    </div>
                    <div className="flex gap-4">
                       <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 sora font-black text-xs text-slate-900">2</div>
                       <p className="text-[11px] font-bold text-slate-400 leading-relaxed pt-1">Send the exact amount specified. Small variations may delay processing.</p>
                    </div>
                    <div className="flex gap-4">
                       <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 sora font-black text-xs text-blue-600">3</div>
                       <p className="text-[11px] font-bold text-slate-900 leading-relaxed pt-1">
                          {deposit.memo_supported 
                            ? "CRITICAL: You MUST include the reference code as the MEMO/Tag." 
                            : "Matching for this network is handled by amount and timestamp. Please ensure exact amount."}
                       </p>
                    </div>
                 </div>
              </div>

              <div className="bg-amber-50 rounded-[2rem] p-8 border border-amber-100">
                 <div className="flex items-center gap-3 mb-4">
                    <AlertCircle className="text-amber-500 w-5 h-5" />
                    <h3 className="sora font-black text-amber-900 text-xs uppercase">Warning</h3>
                 </div>
                 <p className="text-amber-800 text-[10px] font-bold leading-relaxed">
                    Only send {deposit.asset} to this address. Sending any other asset will result in permanent loss. Deposits are processed automatically but may take 10-30 minutes depending on network congestion.
                 </p>
              </div>
           </div>
        </div>
      )}

      {/* STEP 3: SUCCESS */}
      {step === 3 && (
        <div className="max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-500">
           <div className="bg-white rounded-[2.5rem] p-10 lg:p-20 border border-slate-100 shadow-2xl shadow-slate-300/50 text-center space-y-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] -mr-48 -mt-48" />
              
              <div className="relative z-10 flex flex-col items-center">
                 <div className="w-28 h-28 bg-emerald-50 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-xl shadow-emerald-100 border border-emerald-100">
                    <CheckCircle2 className="w-14 h-14" />
                 </div>
                 <h2 className="sora font-black text-slate-900 text-3xl lg:text-4xl mb-4 tracking-tight uppercase">Deposit Received!</h2>
                 <p className="text-slate-500 text-sm lg:text-base font-bold leading-relaxed max-w-sm mx-auto">
                    Your account has been successfully credited with {amount} {asset}.
                 </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                 <button 
                    onClick={() => { setStep(1); setAmount(""); setDeposit(null); setStatus("pending"); }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white sora font-black py-6 rounded-3xl transition-all shadow-2xl shadow-blue-500/30"
                 >
                    New Deposit
                 </button>
                 <button 
                    onClick={() => onNavigate("rates")}
                    className="flex-1 bg-slate-900 hover:bg-black text-white sora font-black py-6 rounded-3xl transition-all shadow-xl"
                 >
                    Back to Wallet
                 </button>
              </div>
           </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-in { animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-spin-slow { animation: spin 3s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default DepositFlow;

import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, 
  ArrowDown, 
  ChevronDown, 
  Clock, 
  ShieldCheck, 
  Zap, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Wallet,
  RefreshCw,
  Info,
  Copy
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { 
  getCurrencies, 
  previewConversion, 
  executeConversion, 
  getWallets 
} from "../../lib/api";

const ConvertFlow = ({ onBack, onNavigate }) => {
  /* ── STATE ─────────────────────────────────────────────────── */
  const [step, setStep] = useState(1); // 1: Input, 2: Preview, 3: Success
  const [currencies, setCurrencies] = useState([]);
  const [wallets, setWallets] = useState({});
  const [loading, setLoading] = useState(true);
  const [converting, setConverting] = useState(false);
  
  // Form State
  const [fromAsset, setFromAsset] = useState("NGN");
  const [toAsset, setToAsset] = useState("USDT");
  const [fromAmount, setFromAmount] = useState("");
  
  // Preview Data
  const [preview, setPreview] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState(null);
  
  // Success Data
  const [result, setResult] = useState(null);

  const timerRef = useRef(null);

  /* ── INITIALIZATION ────────────────────────────────────────── */
  useEffect(() => {
    const init = async () => {
      try {
        const { data: currData } = await getCurrencies();
        if (currData) setCurrencies(currData.filter(c => c.is_active));
        
        try {
          const walletData = await getWallets();
          if (walletData && Array.isArray(walletData)) {
             const walletMap = {};
             walletData.forEach(w => { walletMap[w.asset] = w.balance; });
             setWallets(walletMap);
          }
        } catch (walletErr) {
          console.warn("Could not fetch wallet balances, using defaults:", walletErr);
        }
      } catch (err) {
        console.error("Initialization error:", err);
        setError("System initialization failed. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  /* ── TIMER LOGIC ───────────────────────────────────────────── */
  useEffect(() => {
    if (preview && preview.expires_at) {
      const expiry = new Date(preview.expires_at).getTime();
      
      const updateTimer = () => {
        const now = new Date().getTime();
        const diff = Math.max(0, Math.floor((expiry - now) / 1000));
        setTimeLeft(diff);
        
        if (diff === 0) {
          clearInterval(timerRef.current);
        }
      };

      updateTimer();
      timerRef.current = setInterval(updateTimer, 1000);
      
      return () => clearInterval(timerRef.current);
    }
  }, [preview]);

  /* ── HANDLERS ─────────────────────────────────────────────── */
  const handleSwapAssets = () => {
    const temp = fromAsset;
    setFromAsset(toAsset);
    setToAsset(temp);
    setPreview(null);
    setStep(1);
  };

  const handleFetchPreview = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) return;
    if (fromAsset === toAsset) {
      setError("Source and destination assets must be different.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await previewConversion(fromAsset, toAsset, fromAmount);
      setPreview(data);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExecute = async () => {
    if (!preview?.rate_lock_id || timeLeft <= 0) return;
    
    setConverting(true);
    setError(null);
    try {
      const data = await executeConversion(preview.rate_lock_id);
      setResult(data);
      setStep(3);
      
      const walletData = await getWallets();
      if (walletData) {
         const walletMap = {};
         walletData.forEach(w => { walletMap[w.asset] = w.balance; });
         setWallets(walletMap);
      }
    } catch (err) {
      setError(err.message);
      if (err.message.includes("expired")) {
        setPreview(null);
        setStep(1);
      }
    } finally {
      setConverting(false);
    }
  };

  const getAssetIcon = (symbol) => {
    const curr = currencies.find(c => c.symbol === symbol);
    if (curr?.icon_url) return <img src={curr.icon_url} alt="" className="w-full h-full object-contain" />;
    return <span className="font-black text-xs">{symbol[0]}</span>;
  };

  const formatAmount = (val, asset) => {
    const num = parseFloat(val);
    if (isNaN(num)) return "0.00";
    if (asset === "NGN") return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 });
  };

  /* ── RENDERERS ─────────────────────────────────────────────── */
  
  if (loading && step === 1) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-8 px-4">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-3 h-3 bg-blue-600 rounded-full animate-ping" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <p className="sora font-black text-slate-900 uppercase tracking-widest text-sm">Initializing Secure Channel</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Establishing encrypted link to liquidity provider</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 animate-in fade-in duration-700">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 lg:mb-16">
        <div className="flex items-center gap-4 lg:gap-6">
          <button onClick={onBack} className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-all shadow-sm hover:shadow-md hover:-translate-x-1">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="sora font-black text-slate-900 text-xl lg:text-3xl uppercase tracking-tight">Convert Assets</h1>
            <div className="flex items-center gap-2 mt-1">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <p className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest">Real-time market execution</p>
            </div>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-3 px-5 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
           <ShieldCheck className="w-5 h-5 text-blue-600" />
           <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Insured by CheeseBall Guarantee</span>
        </div>
      </div>

      {error && (
        <div className="max-w-2xl mx-auto mb-10 bg-red-50 border border-red-100 rounded-[2.5rem] p-6 lg:p-8 flex items-start gap-5 animate-in fade-in slide-in-from-top-4">
          <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
             <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div className="space-y-1 pt-1">
             <p className="text-red-900 text-sm font-black uppercase tracking-tight">Transaction Error</p>
             <p className="text-red-700 text-xs font-bold leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {/* STEP 1: INPUT */}
      {step === 1 && (
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="w-full lg:flex-[1.5] space-y-6">
            <div className="bg-white rounded-[2.5rem] p-6 lg:p-10 border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden group">
              {/* Decorative backgrounds */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl -mr-40 -mt-40 group-hover:bg-blue-500/10 transition-colors" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-2xl -ml-20 -mb-20" />
              
              <div className="space-y-8 relative z-10">
                 {/* FROM ASSET */}
                 <div className="space-y-4">
                   <div className="flex justify-between items-center px-1">
                     <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">You Convert</label>
                     <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-100">
                        <Wallet size={12} className="text-blue-600" />
                        <span className="text-[10px] font-black text-blue-700 uppercase">Available: {formatAmount(wallets[fromAsset] || 0, fromAsset)}</span>
                     </div>
                   </div>
                   
                   <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6 lg:p-8 transition-all focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-50">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:bg-slate-50 transition-all shrink-0">
                           <div className="w-8 h-8 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center border shadow-sm">
                              {getAssetIcon(fromAsset)}
                           </div>
                           <select 
                             value={fromAsset} 
                             onChange={(e) => setFromAsset(e.target.value)}
                             className="bg-transparent sora font-black text-sm outline-none appearance-none pr-2 cursor-pointer"
                           >
                             <option value="NGN">NGN</option>
                             {currencies.map(c => <option key={c.symbol} value={c.symbol}>{c.symbol}</option>)}
                           </select>
                           <ChevronDown size={14} className="text-slate-400" />
                        </div>
                        <input 
                          type="number"
                          placeholder="0.00"
                          value={fromAmount}
                          onChange={(e) => setFromAmount(e.target.value)}
                          className="flex-1 bg-transparent text-right text-3xl lg:text-4xl font-black sora text-slate-900 placeholder-slate-200 outline-none w-full"
                          autoFocus
                        />
                      </div>
                   </div>
                 </div>

                 {/* SWAP BUTTON */}
                 <div className="flex justify-center -my-12 relative z-20">
                    <button 
                      onClick={handleSwapAssets}
                      className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center hover:rotate-180 active:scale-90 transition-all duration-700 shadow-2xl group/btn"
                    >
                       <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white group-hover/btn:bg-slate-900 transition-colors shadow-lg shadow-blue-500/20">
                          <ArrowDown className="w-7 h-7" />
                       </div>
                    </button>
                 </div>

                 {/* TO ASSET */}
                 <div className="space-y-4 pt-4">
                   <div className="flex justify-between items-center px-1">
                     <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">You Receive</label>
                     <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
                        <Zap size={10} className="text-emerald-500" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Flash Rates Active</span>
                     </div>
                   </div>

                   <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6 lg:p-8 transition-all">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:bg-slate-50 transition-all shrink-0">
                           <div className="w-8 h-8 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center border shadow-sm">
                              {getAssetIcon(toAsset)}
                           </div>
                           <select 
                             value={toAsset} 
                             onChange={(e) => setToAsset(e.target.value)}
                             className="bg-transparent sora font-black text-sm outline-none appearance-none pr-2 cursor-pointer"
                           >
                             <option value="USDT">USDT</option>
                             <option value="NGN">NGN</option>
                             {currencies.map(c => <option key={c.symbol} value={c.symbol}>{c.symbol}</option>)}
                           </select>
                           <ChevronDown size={14} className="text-slate-400" />
                        </div>
                        <div className="flex-1 text-right">
                           <span className="text-3xl lg:text-4xl font-black sora text-slate-200">0.000000</span>
                        </div>
                      </div>
                   </div>
                 </div>
              </div>

              <button 
                onClick={handleFetchPreview}
                disabled={!fromAmount || parseFloat(fromAmount) <= 0 || loading}
                className="w-full mt-12 bg-blue-600 hover:bg-blue-700 text-white sora font-black py-6 rounded-3xl shadow-2xl shadow-blue-500/30 transition-all flex items-center justify-center gap-3 group disabled:opacity-30 active:scale-[0.98]"
              >
                {loading ? <Loader2 className="w-7 h-7 animate-spin" /> : (
                  <>
                    <span className="text-lg">Preview Conversion</span>
                    <Zap className="w-5 h-5 group-hover:scale-125 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="hidden lg:flex lg:flex-1 flex-col gap-6">
             <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40">
                <h3 className="sora font-black text-slate-900 text-sm uppercase mb-6 tracking-tight">Market Intelligence</h3>
                <div className="space-y-8">
                   <div className="flex items-start gap-5">
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0 border border-blue-100">
                         <Zap className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="pt-1">
                         <p className="text-[11px] font-black text-slate-900 uppercase tracking-wider">Instant Settlement</p>
                         <p className="text-[11px] font-bold text-slate-400 leading-relaxed mt-1.5">Conversions are executed immediately upon confirmation. No waiting for network approvals.</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-5">
                      <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-100">
                         <ShieldCheck className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div className="pt-1">
                         <p className="text-[11px] font-black text-slate-900 uppercase tracking-wider">Fixed Rate Window</p>
                         <p className="text-[11px] font-bold text-slate-400 leading-relaxed mt-1.5">Your rate is locked for a full 60 seconds. What you see is exactly what you get.</p>
                      </div>
                   </div>
                </div>
             </div>

             <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20">
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl -mr-24 -mt-24" />
                <div className="relative z-10">
                   <h3 className="sora font-black text-white text-sm uppercase mb-3">Professional OTC</h3>
                   <p className="text-slate-400 text-xs font-bold leading-relaxed mb-8">Converting more than $50,000? Get personalized rates through our institutional desk.</p>
                   <button className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] hover:text-blue-300 transition-colors">
                      Institutional Support <ArrowRight size={14} />
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* STEP 2: PREVIEW */}
      {step === 2 && preview && (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
           <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
              <div className="bg-slate-900 px-10 py-5 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Price Lock active</span>
                 </div>
                 <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${timeLeft <= 10 ? "border-red-500 bg-red-500/10 text-red-500" : "border-blue-500/30 bg-blue-500/10 text-blue-400"}`}>
                    <span className="sora font-black text-sm tabular-nums">{timeLeft}s remaining</span>
                 </div>
              </div>

              <div className="p-10 lg:p-12 space-y-10">
                 <div className="text-center space-y-3">
                    <h2 className="sora font-black text-slate-400 uppercase text-[11px] tracking-[0.2em]">You will receive</h2>
                    <div className="flex items-center justify-center gap-4">
                       <span className="sora font-black text-5xl lg:text-6xl text-slate-900 tracking-tight">
                         {formatAmount(preview.to_amount, preview.to_asset)}
                       </span>
                       <span className="sora font-black text-2xl text-blue-600 mt-3">{preview.to_asset}</span>
                    </div>
                 </div>

                 <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 divide-y divide-slate-200/50">
                    <div className="flex justify-between items-center py-5">
                       <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Converting</span>
                       <span className="sora font-black text-sm text-slate-900">{formatAmount(preview.from_amount, preview.from_asset)} {preview.from_asset}</span>
                    </div>
                    <div className="flex justify-between items-center py-5">
                       <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Rate</span>
                       <span className="sora font-black text-sm text-slate-900">1 {preview.from_asset} ≈ {formatAmount(preview.rate, preview.to_asset)} {preview.to_asset}</span>
                    </div>
                    <div className="flex justify-between items-center py-5">
                       <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Markup</span>
                       <span className="sora font-black text-sm text-emerald-600">{preview.markup_percent}% (Included)</span>
                    </div>
                 </div>

                 <div className="flex items-center justify-between px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                    <div className="flex flex-col">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Quote ID</span>
                       <span className="text-[10px] font-bold text-slate-500 font-mono tracking-tighter">{preview.rate_lock_id}</span>
                    </div>
                    <button 
                      onClick={(e) => { 
                        navigator.clipboard.writeText(preview.rate_lock_id);
                        const btn = e.currentTarget;
                        const originalHtml = btn.innerHTML;
                        btn.innerHTML = '<span class="text-[9px] font-black text-emerald-600">COPIED!</span>';
                        setTimeout(() => { btn.innerHTML = originalHtml; }, 2000);
                      }}
                      className="p-3 hover:bg-slate-200 rounded-xl transition-all text-slate-400 hover:text-slate-900"
                    >
                       <Copy size={16} />
                    </button>
                 </div>

                 {timeLeft > 0 ? (
                    <button 
                      onClick={handleExecute}
                      disabled={converting}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white sora font-black py-6 rounded-3xl shadow-2xl shadow-blue-500/30 transition-all flex items-center justify-center gap-3 group active:scale-[0.98]"
                    >
                      {converting ? <Loader2 className="w-7 h-7 animate-spin" /> : (
                        <>
                          <span className="text-lg">Confirm & Convert</span>
                          <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </>
                      )}
                    </button>
                 ) : (
                    <div className="space-y-4">
                       <div className="bg-red-50 border border-red-100 rounded-2xl p-5 flex items-center gap-4">
                          <AlertCircle className="w-6 h-6 text-red-500" />
                          <span className="text-red-700 text-xs font-black uppercase tracking-tight">Rate expired. Please refresh.</span>
                       </div>
                       <button 
                         onClick={() => { setPreview(null); setStep(1); handleFetchPreview(); }}
                         className="w-full bg-slate-900 hover:bg-black text-white sora font-black py-6 rounded-3xl transition-all shadow-xl flex items-center justify-center gap-3 group"
                       >
                          <RefreshCw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-700" />
                          <span>Refresh Quote</span>
                       </button>
                    </div>
                 )}
              </div>
           </div>

           <button onClick={() => setStep(1)} className="w-full text-slate-400 sora font-black text-xs uppercase tracking-widest hover:text-slate-600 transition-colors py-4">
              ← Cancel & Adjust Amount
           </button>
        </div>
      )}

      {/* STEP 3: SUCCESS */}
      {step === 3 && result && (
        <div className="max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-500">
           <div className="bg-white rounded-[2.5rem] p-10 lg:p-20 border border-slate-100 shadow-2xl shadow-slate-300/50 text-center space-y-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] -mr-48 -mt-48" />
              
              <div className="relative z-10 flex flex-col items-center">
                 <div className="w-28 h-28 bg-emerald-50 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-xl shadow-emerald-100 border border-emerald-100 animate-in zoom-in duration-700">
                    <CheckCircle2 className="w-14 h-14" />
                 </div>
                 <h2 className="sora font-black text-slate-900 text-3xl lg:text-4xl mb-4 tracking-tight uppercase">Success!</h2>
                 <p className="text-slate-500 text-sm lg:text-base font-bold leading-relaxed max-w-sm mx-auto">
                    Your conversion was successful. Your funds have been updated in your wallet.
                 </p>
              </div>

              <div className="relative z-10 w-full bg-slate-50 rounded-[2.5rem] p-10 space-y-8 border border-slate-100 shadow-inner">
                 <div className="flex flex-col items-center gap-6">
                    <div className="flex flex-col items-center gap-2">
                       <span className="text-slate-400 sora font-black text-[10px] uppercase tracking-widest">You Swapped</span>
                       <span className="text-slate-900 sora font-black text-2xl tracking-tight">{formatAmount(result.from_amount, result.from_asset)} {result.from_asset}</span>
                    </div>
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-100">
                       <ArrowDown className="text-blue-500 w-5 h-5" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                       <span className="text-slate-400 sora font-black text-[10px] uppercase tracking-widest">You Received</span>
                       <span className="text-emerald-600 sora font-black text-4xl tracking-tight">{formatAmount(result.to_amount, result.to_asset)} {result.to_asset}</span>
                    </div>
                 </div>
                 
                 <div className="pt-8 border-t border-slate-200/60 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span>Transaction ID</span>
                    <span className="text-slate-900 font-mono">{result.id.slice(0, 16).toUpperCase()}</span>
                 </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                 <button 
                    onClick={() => { setStep(1); setPreview(null); setFromAmount(""); }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white sora font-black py-6 rounded-3xl transition-all shadow-2xl shadow-blue-500/30"
                 >
                    New Swap
                 </button>
                 <button 
                    onClick={() => onNavigate("rates")}
                    className="flex-1 bg-slate-900 hover:bg-black text-white sora font-black py-6 rounded-3xl transition-all shadow-xl"
                 >
                    Back to Wallet
                 </button>
              </div>

              <div className="flex items-center justify-center gap-3 pt-4 opacity-50">
                 <ShieldCheck size={16} className="text-emerald-500" />
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Institutional Grade Security</span>
              </div>
           </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-in { animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default ConvertFlow;

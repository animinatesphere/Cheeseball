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
  ArrowRight,
  Wallet,
  Building2,
  Plus,
  RefreshCw,
  XCircle,
  ExternalLink,
  ChevronRight,
  Info
} from "lucide-react";
import { 
  getWallets, 
  getBeneficiaries, 
  createWithdrawal, 
  getWithdrawalStatus 
} from "../../lib/api";

const WithdrawalFlow = ({ onBack, onNavigate }) => {
  /* ── STATE ─────────────────────────────────────────────────── */
  const [step, setStep] = useState(1); // 1: Form, 2: Status/Polling
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Data
  const [wallets, setWallets] = useState({});
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [showNewBeneficiary, setShowNewBeneficiary] = useState(false);
  
  // Form State
  const [amount, setAmount] = useState("");
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [newBank, setNewBank] = useState({
    bank_name: "",
    bank_account_name: "",
    bank_account_number: ""
  });
  
  // Active Withdrawal
  const [withdrawal, setWithdrawal] = useState(null);
  const [status, setStatus] = useState("pending");
  
  const pollingRef = useRef(null);
  const pollCountRef = useRef(0);

  /* ── INITIALIZATION ────────────────────────────────────────── */
  useEffect(() => {
    const init = async () => {
      try {
        const [wData, bData] = await Promise.all([
          getWallets(),
          getBeneficiaries()
        ]);
        
        if (wData && Array.isArray(wData)) {
          const wMap = {};
          wData.forEach(w => { wMap[w.asset] = w; });
          setWallets(wMap);
        }
        
        if (bData.data) setBeneficiaries(bData.data);
        
        // Restore active withdrawal from localStorage
        const savedId = localStorage.getItem("active_withdrawal_id");
        if (savedId) {
          fetchWithdrawalStatus(savedId);
        }
      } catch (err) {
        console.error("Init error:", err);
        setError("Failed to load account data.");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const fetchWithdrawalStatus = async (id) => {
    try {
      const data = await getWithdrawalStatus(id);
      setWithdrawal(data);
      setStatus(data.status);
      setStep(2);
    } catch (err) {
      console.warn("Restore error:", err);
      localStorage.removeItem("active_withdrawal_id");
    }
  };

  /* ── POLLING LOGIC ─────────────────────────────────────────── */
  useEffect(() => {
    if (withdrawal && step === 2 && status === "pending") {
      const poll = async () => {
        try {
          pollCountRef.current += 1;
          const data = await getWithdrawalStatus(withdrawal.id);
          setStatus(data.status);
          setWithdrawal(data);
          
          if (data.status !== "pending") {
            clearInterval(pollingRef.current);
            if (data.status === "completed") {
               localStorage.removeItem("active_withdrawal_id");
               // Refresh wallets on success
               const wData = await getWallets();
               if (wData && Array.isArray(wData)) {
                 const wMap = {};
                 wData.forEach(w => { wMap[w.asset] = w; });
                 setWallets(wMap);
               }
            }
          }
          
          // Backoff
          if (pollCountRef.current > 12) {
            clearInterval(pollingRef.current);
            pollingRef.current = setInterval(poll, 30000);
          }
        } catch (err) {
          console.warn("Polling error:", err);
        }
      };

      pollingRef.current = setInterval(poll, 5000);
      return () => clearInterval(pollingRef.current);
    }
  }, [withdrawal, step, status]);

  /* ── HANDLERS ─────────────────────────────────────────────── */
  const handleWithdraw = async () => {
    const available = wallets["NGN"]?.balance || 0;
    if (parseFloat(amount) > available) {
      setError("Insufficient available balance.");
      return;
    }

    const bankDetails = showNewBeneficiary ? newBank : selectedBeneficiary;
    if (!bankDetails?.bank_account_number) {
      setError("Please select or add a bank account.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        asset: "NGN",
        amount: parseFloat(amount),
        ...bankDetails
      };
      
      const data = await createWithdrawal(payload);
      setWithdrawal(data);
      setStatus("pending");
      setStep(2);
      localStorage.setItem("active_withdrawal_id", data.id);
      pollCountRef.current = 0;
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatAmount = (num) => {
    return parseFloat(num).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  /* ── RENDERERS ─────────────────────────────────────────────── */
  
  if (loading && step === 1) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-8">
        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
        <p className="sora font-black text-slate-400 uppercase tracking-widest text-xs">Preparing Wallet...</p>
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
            <h1 className="sora font-black text-slate-900 text-xl lg:text-3xl uppercase tracking-tight">Withdraw NGN</h1>
            <div className="flex items-center gap-2 mt-1">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <p className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest">Secure Bank Settlement</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-2xl mx-auto mb-10 bg-red-50 border border-red-100 rounded-[2rem] p-6 flex items-start gap-4 animate-in fade-in slide-in-from-top-4">
          <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
          <p className="text-red-700 text-xs font-bold leading-relaxed">{error}</p>
        </div>
      )}

      {/* STEP 1: FORM */}
      {step === 1 && (
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12 animate-in fade-in slide-in-from-right-4 duration-500">
           <div className="w-full lg:flex-[1.5] space-y-8">
              <div className="bg-white rounded-[2.5rem] p-6 lg:p-10 border border-slate-100 shadow-2xl shadow-slate-200/50 space-y-10">
                 {/* BALANCE HERO */}
                 <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-32 -mt-32" />
                    <div className="relative z-10 space-y-4">
                       <p className="text-blue-200/50 text-[10px] font-black uppercase tracking-[0.2em]">Available Balance</p>
                       <div className="flex items-baseline gap-2">
                          <span className="text-4xl lg:text-5xl font-black sora tracking-tight">₦{formatAmount(wallets["NGN"]?.balance || 0)}</span>
                       </div>
                       <div className="flex items-center gap-3 pt-2">
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                             <Clock size={12} className="text-blue-400" />
                             <span className="text-[10px] font-bold text-blue-100/60 uppercase">Locked: ₦{formatAmount(wallets["NGN"]?.locked_balance || 0)}</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* AMOUNT INPUT */}
                 <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Amount to Withdraw</label>
                    <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6 lg:p-8 transition-all focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-50">
                       <div className="flex items-center justify-between">
                          <span className="sora font-black text-2xl text-slate-400">₦</span>
                          <input 
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="bg-transparent text-right text-3xl lg:text-4xl font-black sora text-slate-900 placeholder-slate-200 outline-none w-full"
                            autoFocus
                          />
                       </div>
                    </div>
                    <div className="flex justify-between px-1">
                       <p className="text-[10px] font-bold text-slate-400 uppercase">Min: ₦1,000</p>
                       <button 
                         onClick={() => setAmount(wallets["NGN"]?.balance || "0")}
                         className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700"
                       >
                          Withdraw Max
                       </button>
                    </div>
                 </div>

                 {/* BENEFICIARY SELECTION */}
                 <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Select Destination</label>
                       <button 
                         onClick={() => setShowNewBeneficiary(!showNewBeneficiary)}
                         className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 uppercase tracking-widest"
                       >
                          {showNewBeneficiary ? "Saved Accounts" : "Add New Account"}
                          {showNewBeneficiary ? <ArrowLeft size={12} /> : <Plus size={12} />}
                       </button>
                    </div>

                    {!showNewBeneficiary ? (
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {beneficiaries.map(b => (
                             <button 
                               key={b.id}
                               onClick={() => setSelectedBeneficiary(b)}
                               className={`p-5 rounded-3xl border-2 transition-all text-left flex flex-col gap-2 relative ${
                                 selectedBeneficiary?.id === b.id 
                                   ? "border-blue-600 bg-blue-50/50 shadow-lg" 
                                   : "border-slate-50 bg-white hover:border-slate-100"
                               }`}
                             >
                                <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-100 shadow-sm">
                                      <Building2 size={18} className="text-slate-400" />
                                   </div>
                                   <div className="min-w-0">
                                      <p className="text-xs font-black text-slate-900 truncate uppercase">{b.bank_name}</p>
                                      <p className="text-[10px] font-bold text-slate-400 font-mono tracking-tighter">{b.bank_account_number}</p>
                                   </div>
                                </div>
                                <p className="text-[10px] font-black text-slate-500 truncate mt-1">{b.bank_account_name}</p>
                                {selectedBeneficiary?.id === b.id && (
                                   <div className="absolute top-3 right-3 text-blue-600">
                                      <CheckCircle2 size={16} />
                                   </div>
                                )}
                             </button>
                          ))}
                          {beneficiaries.length === 0 && (
                             <div className="col-span-full py-12 flex flex-col items-center justify-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                <Building2 className="text-slate-200 w-12 h-12 mb-3" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No saved accounts found</p>
                             </div>
                          )}
                       </div>
                    ) : (
                       <div className="space-y-3 bg-slate-50 p-6 lg:p-8 rounded-[2.5rem] border border-slate-100 animate-in fade-in slide-in-from-top-4">
                          <div className="space-y-1.5">
                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Bank Name</label>
                             <input 
                               placeholder="e.g. Opay, Zenith Bank"
                               value={newBank.bank_name}
                               onChange={(e) => setNewBank(prev => ({ ...prev, bank_name: e.target.value }))}
                               className="w-full bg-white border border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-900 outline-none focus:border-blue-300"
                             />
                          </div>
                          <div className="space-y-1.5">
                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Account Number</label>
                             <input 
                               placeholder="10 Digits"
                               value={newBank.bank_account_number}
                               onChange={(e) => setNewBank(prev => ({ ...prev, bank_account_number: e.target.value }))}
                               className="w-full bg-white border border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-900 outline-none focus:border-blue-300"
                             />
                          </div>
                          <div className="space-y-1.5">
                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Account Name</label>
                             <input 
                               placeholder="Full Account Holder Name"
                               value={newBank.bank_account_name}
                               onChange={(e) => setNewBank(prev => ({ ...prev, bank_account_name: e.target.value }))}
                               className="w-full bg-white border border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-900 outline-none focus:border-blue-300"
                             />
                          </div>
                       </div>
                    )}
                 </div>

                 <button 
                   onClick={handleWithdraw}
                   disabled={!amount || parseFloat(amount) < 1000 || submitting}
                   className="w-full bg-slate-900 hover:bg-black text-white sora font-black py-6 rounded-3xl shadow-2xl shadow-slate-900/20 transition-all flex items-center justify-center gap-3 group disabled:opacity-30 active:scale-[0.98]"
                 >
                   {submitting ? <Loader2 className="w-7 h-7 animate-spin" /> : (
                     <>
                       <span className="text-lg">Submit Withdrawal Request</span>
                       <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                     </>
                   )}
                 </button>
              </div>
           </div>

           {/* SIDEBAR */}
           <div className="flex-1 space-y-6">
              <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40">
                 <h3 className="sora font-black text-slate-900 text-sm uppercase mb-6 tracking-tight">Security & Polling</h3>
                 <div className="space-y-6">
                    <div className="flex gap-4">
                       <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                          <ShieldCheck className="w-4 h-4 text-blue-600" />
                       </div>
                       <p className="text-[11px] font-bold text-slate-400 leading-relaxed pt-1">Withdrawals are processed manually by our finance desk for security.</p>
                    </div>
                    <div className="flex gap-4">
                       <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                          <Zap className="w-4 h-4 text-emerald-600" />
                       </div>
                       <p className="text-[11px] font-bold text-slate-400 leading-relaxed pt-1">Typical processing time: 5-30 minutes during business hours.</p>
                    </div>
                 </div>
              </div>

              <div className="bg-blue-50 rounded-[2rem] p-8 border border-blue-100 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-2xl" />
                 <h3 className="sora font-black text-blue-900 text-xs uppercase mb-3 flex items-center gap-2">
                    <Info size={14} /> Available Balance Note
                 </h3>
                 <p className="text-blue-700 text-[10px] font-bold leading-relaxed">
                    This withdrawal is a request — funds will be sent after admin confirmation. Please ensure your bank details are correct. The transaction will be debited when an admin confirms.
                 </p>
              </div>
           </div>
        </div>
      )}

      {/* STEP 2: STATUS */}
      {step === 2 && withdrawal && (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
           <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
              {/* TOP STRIP: STATUS */}
              <div className={`px-8 py-5 flex items-center justify-between transition-colors duration-700 ${
                status === 'completed' ? "bg-emerald-600" : 
                status === 'failed' ? "bg-red-600" : "bg-slate-900"
              }`}>
                 <div className="flex items-center gap-3">
                    {status === 'pending' ? <Clock className="w-4 h-4 text-blue-400" /> : 
                     status === 'completed' ? <CheckCircle2 className="w-4 h-4 text-white" /> : 
                     <XCircle className="w-4 h-4 text-white" />}
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                       {status === 'pending' ? "Withdrawal Pending" : 
                        status === 'completed' ? "Settlement Complete" : "Withdrawal Rejected"}
                    </span>
                 </div>
                 {status === 'pending' && (
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400">
                       <span className="sora font-black text-[10px] uppercase tracking-widest animate-pulse">Polling Live</span>
                    </div>
                 )}
              </div>

              <div className="p-10 lg:p-12 space-y-10">
                 {/* Success/Error Icon */}
                 {status !== 'pending' && (
                    <div className="flex justify-center">
                       <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center shadow-xl animate-in zoom-in duration-500 ${
                         status === 'completed' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"
                       }`}>
                          {status === 'completed' ? <CheckCircle2 size={48} /> : <XCircle size={48} />}
                       </div>
                    </div>
                 )}

                 <div className="text-center space-y-3">
                    <h2 className="sora font-black text-slate-400 uppercase text-[11px] tracking-[0.2em]">Withdrawal Amount</h2>
                    <div className="flex items-center justify-center gap-3">
                       <span className={`sora font-black text-5xl lg:text-6xl tracking-tight ${status === 'failed' ? "text-slate-300 line-through" : "text-slate-900"}`}>
                         ₦{formatAmount(withdrawal.amount)}
                       </span>
                    </div>
                    {status === 'failed' && withdrawal.rejection_reason && (
                       <p className="text-red-600 text-[11px] font-black uppercase bg-red-50 inline-block px-4 py-1.5 rounded-full">Reason: {withdrawal.rejection_reason}</p>
                    )}
                    {status === 'completed' && (withdrawal.admin_note || withdrawal.external_reference) && (
                       <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 max-w-sm mx-auto">
                          <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Admin Note / Reference</p>
                          <p className="text-[11px] font-bold text-emerald-800">{withdrawal.admin_note || withdrawal.external_reference}</p>
                       </div>
                    )}
                 </div>

                 <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 space-y-6">
                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Bank Name</p>
                          <p className="text-sm font-black text-slate-900 uppercase">{withdrawal.bank_name}</p>
                       </div>
                       <div className="space-y-1 text-right">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Account Number</p>
                          <p className="text-sm font-black text-slate-900 font-mono tracking-tight">{withdrawal.bank_account_number}</p>
                       </div>
                    </div>
                    <div className="pt-6 border-t border-slate-200/60">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Beneficiary Name</p>
                       <p className="text-sm font-black text-slate-900 uppercase">{withdrawal.bank_account_name}</p>
                    </div>
                 </div>

                 <div className="flex items-center justify-between px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                    <div className="flex flex-col">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Transaction ID</span>
                       <span className="text-[10px] font-bold text-slate-500 font-mono tracking-tighter">{withdrawal.id}</span>
                    </div>
                    <button 
                      onClick={(e) => { 
                        navigator.clipboard.writeText(withdrawal.id);
                        const btn = e.currentTarget;
                        btn.innerHTML = '<span class="text-[9px] font-black text-emerald-600">COPIED</span>';
                        setTimeout(() => { btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>'; }, 2000);
                      }}
                      className="p-3 hover:bg-slate-200 rounded-xl transition-all text-slate-400"
                    >
                       <Copy size={16} />
                    </button>
                 </div>

                 {status === 'pending' ? (
                    <div className="bg-blue-50 rounded-3xl p-6 flex flex-col items-center text-center gap-4">
                       <p className="text-[11px] font-bold text-blue-700 leading-relaxed">
                          Your request is being processed. You can leave this screen safely; we will notify you once completed.
                       </p>
                       <button 
                         onClick={() => { setStep(1); setAmount(""); setWithdrawal(null); }}
                         className="text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline"
                       >
                          Initiate another withdrawal
                       </button>
                    </div>
                 ) : (
                    <div className="space-y-4">
                       <button 
                         onClick={() => { setStep(1); setAmount(""); setWithdrawal(null); }}
                         className="w-full bg-blue-600 hover:bg-blue-700 text-white sora font-black py-6 rounded-3xl shadow-xl transition-all"
                       >
                          Back to Wallet
                       </button>
                       <button 
                         onClick={() => onNavigate("support")}
                         className="w-full text-slate-400 sora font-black text-xs uppercase tracking-widest hover:text-slate-600 transition-colors py-2"
                       >
                          Need help with this? Contact Support
                       </button>
                    </div>
                 )}
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

export default WithdrawalFlow;

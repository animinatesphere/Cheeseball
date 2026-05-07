import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, 
  ChevronRight, 
  Copy, 
  CheckCircle2, 
  Plus,
  Clock, 
  ShieldCheck, 
  Info, 
  Building2, 
  AlertCircle,
  Loader2,
  Wallet,
  Zap,
  RefreshCw,
  XCircle,
  AlertTriangle
} from "lucide-react";
import { sellService } from "../../lib/sellService";
import { getCurrencies } from "../../lib/api";
import BeneficiarySidePanel from "./BeneficiarySidePanel";

/* ── SUB-COMPONENTS ─────────────────────────────────────────── */

// 1. QUOTE STEP
const QuoteStep = ({ formData, setFormData, updateAmount, nextStep, currencies, loading }) => (
  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
    <div className="bg-white rounded-[2rem] p-6 lg:p-8 border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
      <div className="flex justify-between items-center px-1">
        <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Select Asset</label>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full">
          <Zap className="w-3 text-emerald-600" size={12} />
          <span className="text-[10px] font-black text-emerald-600 uppercase">Live Rates</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {loading ? (
          Array(4).fill(0).map((_, i) => <div key={i} className="h-20 bg-slate-50 rounded-2xl animate-pulse" />)
        ) : (
          currencies.map((c, index) => (
            <button
              key={c.id || `${c.symbol}-${index}`}
              onClick={() => setFormData(prev => ({ ...prev, asset: c }))}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                formData.asset?.symbol === c.symbol 
                  ? "border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-900/10" 
                  : "border-slate-50 bg-white hover:border-slate-200"
              }`}
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center font-black text-lg border shadow-sm bg-white">
                {c.icon_url ? <img src={c.icon_url} alt="" className="w-full h-full object-cover" /> : c.symbol[0]}
              </div>
              <span className="sora font-black text-sm text-slate-900">{c.symbol}</span>
            </button>
          ))
        )}
      </div>

      <div className="space-y-4 pt-4">
         {/* Crypto Input */}
         <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 transition-all focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">You Sell ({formData.asset?.symbol || "..."})</span>
              <span className="text-[10px] font-bold text-slate-400">Min: 0.0001</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="w-8 h-8 shrink-0 rounded-lg overflow-hidden flex items-center justify-center font-black text-sm border shadow-sm bg-white">
                 {formData.asset?.icon_url ? <img src={formData.asset.icon_url} alt="" className="w-full h-full" /> : "?"}
              </div>
              <input 
                type="number"
                placeholder="0.000000"
                value={formData.amountCrypto}
                onChange={(e) => updateAmount(e.target.value, "Crypto")}
                className="bg-transparent text-right text-3xl font-black sora text-slate-900 placeholder-slate-200 outline-none w-full"
                autoFocus
              />
            </div>
         </div>

         {/* NGN Result */}
         <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">You Receive (NGN)</span>
              <span className="text-[10px] font-bold text-slate-400">Rate: ₦{parseFloat(formData.asset?.price || 0).toLocaleString()} / {formData.asset?.symbol}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="sora font-black text-2xl text-slate-400">₦</span>
              <input 
                type="text"
                readOnly
                value={formData.amountNGN ? (parseFloat(formData.amountNGN)).toLocaleString() : ""}
                placeholder="0.00"
                className="bg-transparent text-right text-3xl font-black sora text-slate-900 placeholder-slate-200 outline-none w-full"
              />
            </div>
         </div>
      </div>

      <button 
        onClick={nextStep}
        disabled={!formData.amountCrypto || parseFloat(formData.amountCrypto) <= 0}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white sora font-black py-5 rounded-3xl shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-30 disabled:pointer-events-none"
      >
        Continue to Bank <ChevronRight className="w-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  </div>
);

// 2. BENEFICIARY STEP
const BeneficiaryStep = ({ formData, setFormData, nextStep, prevStep, openPanel, loadingQuote }) => (
  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
    <div className="bg-white rounded-[2rem] p-6 lg:p-8 border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
      <h2 className="sora font-black text-slate-900 text-xl">Payout Destination</h2>
      <p className="text-slate-500 text-sm font-bold leading-relaxed">Select or add a bank account where you want to receive your NGN.</p>

      <div className="pt-2">
        {formData.beneficiary ? (
          <div className="space-y-4">
             <div className="p-6 bg-blue-50 border-2 border-blue-600 rounded-[2rem] flex items-center gap-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <Building2 size={80} />
                </div>
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600 border border-blue-100">
                   <Landmark size={28} />
                </div>
                <div className="flex-1">
                   <h4 className="sora font-black text-slate-900 text-lg">{formData.beneficiary.account_name}</h4>
                   <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em]">{formData.beneficiary.bank_name}</p>
                   <p className="text-xs font-bold text-slate-500 mt-1 tracking-widest">{formData.beneficiary.account_number}</p>
                </div>
             </div>
             <button 
                onClick={openPanel}
                className="w-full py-4 text-blue-600 text-xs font-black uppercase tracking-widest hover:bg-blue-50 rounded-2xl transition-all"
             >
                Change Bank Account
             </button>
          </div>
        ) : (
          <button 
            onClick={openPanel}
            className="w-full p-10 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center gap-4 hover:border-blue-400 hover:bg-blue-50/30 transition-all group"
          >
             <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[1.5rem] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                <Plus size={32} />
             </div>
             <div className="text-center">
                <span className="sora font-black text-slate-900 block mb-1">Link Bank Account</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Saved accounts show up here</span>
             </div>
          </button>
        )}
      </div>

      <div className="flex gap-4 pt-4">
        <button onClick={prevStep} className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 sora font-black py-5 rounded-3xl transition-all">Back</button>
        <button 
          disabled={!formData.beneficiary || loadingQuote}
          onClick={nextStep}
          className="flex-[2] bg-slate-900 hover:bg-black text-white sora font-black py-5 rounded-3xl shadow-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-30"
        >
          {loadingQuote ? <Loader2 className="w-5 animate-spin" /> : <>Create Transaction <ChevronRight className="w-5 group-hover:translate-x-1 transition-transform" /></>}
        </button>
      </div>
    </div>
  </div>
);

// 3. TRANSACTION DETAILS (Wallet address)
const TransactionStep = ({ formData, handleCopy, copied, nextStep }) => (
  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
    <div className="bg-white rounded-[2rem] p-6 lg:p-8 border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
      <div className="text-center pb-2">
         <h2 className="sora font-black text-slate-900 text-xl mb-2">Send Crypto</h2>
         <p className="text-slate-400 text-sm font-bold">Transfer the EXACT amount to the address below.</p>
      </div>

      <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-500/30">
         <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10" />
         <div className="relative z-10 space-y-8">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-md">
                     <Wallet className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="sora font-black uppercase text-[10px] tracking-widest text-blue-100">Official Receiving Wallet</h3>
               </div>
               <div className="px-3 py-1 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10 backdrop-blur-md">
                  {formData.asset.symbol} Only
               </div>
            </div>
            
            <div className="space-y-4">
               <div>
                  <label className="text-[9px] font-black text-blue-200/60 uppercase tracking-[0.2em] block mb-2">Recipient Address</label>
                  <div className="flex items-center justify-between bg-black/10 p-4 rounded-2xl border border-white/5 backdrop-blur-sm group">
                     <p className="sora font-black text-xs break-all flex-1 tracking-tight pr-4 leading-relaxed">
                        {formData.transaction?.broker_wallet_address}
                     </p>
                     <button 
                        onClick={() => handleCopy(formData.transaction?.broker_wallet_address, 'addr')}
                        className="w-10 h-10 bg-white text-blue-600 rounded-xl flex items-center justify-center shrink-0 transition-all hover:scale-110 active:scale-95 shadow-lg"
                     >
                        {copied === 'addr' ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                     </button>
                  </div>
               </div>

               <div>
                  <label className="text-[9px] font-black text-blue-200/60 uppercase tracking-[0.2em] block mb-2">Amount to Send</label>
                  <div className="flex items-center justify-between bg-white text-blue-600 p-6 rounded-[2rem] shadow-xl">
                     <div>
                        <p className="sora font-black text-3xl">{formData.transaction?.crypto_amount}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-blue-400 mt-1">{formData.asset.name}</p>
                     </div>
                     <button 
                        onClick={() => handleCopy(formData.transaction?.crypto_amount, 'amt')}
                        className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center transition-all hover:bg-blue-100"
                     >
                        {copied === 'amt' ? <CheckCircle2 size={24} /> : <Copy size={24} />}
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="bg-amber-50 rounded-2xl p-5 flex items-start gap-4 border border-amber-100">
         <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
         <p className="text-amber-800 text-[11px] font-bold leading-relaxed">
            Ensure you send the exact amount of {formData.transaction?.crypto_amount} {formData.asset.symbol}. Less or more will cause delays in processing.
         </p>
      </div>

      <button 
        onClick={nextStep}
        className="w-full bg-slate-900 hover:bg-black text-white sora font-black py-5 rounded-3xl shadow-xl transition-all flex items-center justify-center gap-2 group"
      >
        I Have Sent Crypto <ChevronRight className="w-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  </div>
);

// 4. STATUS STEP
const StatusStep = ({ transaction, onBack }) => {
  const statusLabels = {
    pending_payment: "Awaiting Your Deposit",
    pending_review: "Verifying Transaction",
    completed: "Payout Successful",
    rejected: "Transaction Rejected",
    failed: "Transaction Failed",
  };

  const statusDescriptions = {
    pending_payment: "Your transaction is created. Please send the crypto to the provided wallet address to proceed.",
    pending_review: "We have received your signal. Our system is now confirming the transaction on the blockchain.",
    completed: "The NGN has been sent to your bank account. It should reflect in a few minutes.",
    rejected: "Your transaction was rejected. Please check the reason below or contact support.",
    failed: "There was an issue processing your transaction. This might be due to network congestion.",
  };

  const isSuccess = transaction.status === 'completed';
  const isError = ['rejected', 'failed'].includes(transaction.status);
  const isPending = !isSuccess && !isError;

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 border border-slate-100 shadow-2xl shadow-slate-300/50 text-center space-y-8 relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -mr-32 -mt-32 ${isSuccess ? "bg-emerald-500/5" : isError ? "bg-red-500/5" : "bg-blue-500/5"}`} />
        
        <div className="relative z-10 flex flex-col items-center">
           <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mb-6 shadow-xl transition-all border ${
             isSuccess ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
             isError ? "bg-red-50 text-red-600 border-red-100" : 
             "bg-blue-50 text-blue-600 border-blue-100 animate-pulse-glow"
           }`}>
              {isSuccess ? <CheckCircle2 className="w-12 h-12" /> : 
               isError ? <XCircle className="w-12 h-12" /> : 
               <Clock className="w-12 h-12" />}
           </div>
           
           <h2 className="sora font-black text-slate-900 text-2xl lg:text-3xl mb-3 tracking-tight">
             {statusLabels[transaction.status] || "Processing..."}
           </h2>
           <p className="text-slate-500 text-sm font-bold leading-relaxed max-w-sm mx-auto">
             {transaction.reason || statusDescriptions[transaction.status] || "Updating transaction status..."}
           </p>
        </div>

        {/* BANK INFO ON SUCCESS */}
        {(isSuccess || isPending) && transaction.bank_details && (
          <div className="relative z-10 w-full bg-slate-50 rounded-3xl p-6 border border-slate-100">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Payout Destination</p>
             <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 border border-slate-100">
                   <Building2 size={24} />
                </div>
                <div>
                   <p className="sora font-black text-sm text-slate-900">{transaction.bank_details.account_name}</p>
                   <p className="text-[10px] font-bold text-slate-400">{transaction.bank_details.bank_name} • {transaction.bank_details.account_number}</p>
                </div>
             </div>
          </div>
        )}

        <div className="relative z-10 space-y-4 pt-2">
          {isPending && (
             <div className="flex items-center justify-center gap-2 text-blue-600 bg-blue-50 py-3 rounded-2xl border border-blue-100">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-widest">Auto-refreshes every 10s</span>
             </div>
          )}

          <button 
             onClick={onBack}
             className={`w-full sora font-black py-5 rounded-3xl transition-all shadow-lg text-white ${
               isError ? "bg-slate-900 hover:bg-black" : "bg-blue-600 hover:bg-blue-700"
             }`}
          >
             {isSuccess ? "Done" : "Return to Dashboard"}
          </button>
        </div>

        <div className="flex items-center justify-center gap-2">
           <ShieldCheck size={14} className="text-blue-600" />
           <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Insured by CheeseBall Guarantee</span>
        </div>
      </div>
    </div>
  );
};

/* ── MAIN FLOW COMPONENT ─────────────────────────────────────── */

const SellCryptocurrency = ({ onBack, onNavigate }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [currencies, setCurrencies] = useState([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [copied, setCopied] = useState(null);
  
  const [formData, setFormData] = useState({
    asset: null,
    amountCrypto: "",
    amountNGN: "",
    beneficiary: null,
    quote: null,
    transaction: null,
  });

  const pollingRef = useRef(null);

  // Fetch initial data
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const { data } = await getCurrencies();
        if (data) {
          const actives = data.filter(c => c.is_active);
          setCurrencies(actives);
          if (actives.length > 0) {
            setFormData(prev => ({ ...prev, asset: actives[0] }));
          }
        }
      } catch (err) {
        console.error("Init error:", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Handlers
  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const updateAmount = (val, type) => {
    if (!formData.asset) return;
    if (type === "Crypto") {
      setFormData(prev => ({
        ...prev,
        amountCrypto: val,
        amountNGN: val ? (parseFloat(val) * prev.asset.price).toFixed(2) : ""
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        amountNGN: val,
        amountCrypto: val ? (parseFloat(val) / prev.asset.price).toFixed(6) : ""
      }));
    }
  };

  const nextStep = async () => {
    if (step === 2) {
      // Step 2 -> 3: Create Quote and then Transaction
      setLoadingQuote(true);
      try {
        // 1. Create Quote
        const quote = await sellService.createSellQuote({
          asset: formData.asset.symbol,
          crypto_amount: formData.amountCrypto
        });
        
        // 2. Create Sell Transaction
        const transaction = await sellService.createSellTransaction({
          quote_id: quote.quote_id || quote.id,
          beneficiary_id: formData.beneficiary.id
        });
        
        setFormData(prev => ({ ...prev, quote, transaction }));
        setStep(3);
      } catch (err) {
        alert(err.message || "Failed to create transaction");
      } finally {
        setLoadingQuote(false);
      }
    } else if (step === 3) {
      // Step 3 -> 4: Confirm Sent
      try {
        await sellService.confirmCryptoSent(formData.transaction.id);
        setStep(4);
      } catch (err) {
        alert(err.message || "Failed to confirm crypto sent");
      }
    } else {
      setStep(s => s + 1);
    }
  };

  const prevStep = () => setStep(s => s - 1);

  // Polling logic for Step 4
  useEffect(() => {
    if (step === 4 && formData.transaction?.id) {
       pollingRef.current = setInterval(async () => {
         try {
           const statusData = await sellService.getTransactionStatus(formData.transaction.id);
           setFormData(prev => ({
             ...prev,
             transaction: { ...prev.transaction, ...statusData }
           }));
           // Stop polling if completed or error
           if (['completed', 'rejected', 'failed'].includes(statusData.status)) {
             clearInterval(pollingRef.current);
           }
         } catch (err) {
           console.error("Polling error:", err);
         }
       }, 10000);
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [step, formData.transaction?.id]);

  if (loading) return <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#F8FAFC]">
     <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
     <span className="sora font-black text-sm text-slate-400 uppercase tracking-[0.2em]">Syncing Markets...</span>
  </div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-100 px-6 lg:px-12 py-6 flex items-center justify-between sticky top-0 z-[100]">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="sora font-black text-slate-900 text-lg uppercase tracking-tight">Sell Crypto</h1>
            <div className="flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{step === 4 ? "Live Status" : `Step ${step} of 3`}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <button className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 transition-transform active:scale-95">
              <RefreshCw size={18} />
           </button>
           <button className="hidden lg:flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700">
              <span className="text-[10px] font-black uppercase tracking-widest">Connect Wallet</span>
           </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 mt-8 lg:mt-12">
        {step === 1 && (
          <QuoteStep 
            formData={formData} 
            setFormData={setFormData} 
            updateAmount={updateAmount} 
            nextStep={nextStep} 
            currencies={currencies}
            loading={loading}
          />
        )}
        
        {step === 2 && (
          <BeneficiaryStep 
            formData={formData} 
            setFormData={setFormData} 
            nextStep={nextStep} 
            prevStep={prevStep} 
            openPanel={() => setIsPanelOpen(true)}
            loadingQuote={loadingQuote}
          />
        )}

        {step === 3 && (
          <TransactionStep 
            formData={formData} 
            handleCopy={handleCopy} 
            copied={copied} 
            nextStep={nextStep} 
          />
        )}

        {step === 4 && (
          <StatusStep 
            transaction={formData.transaction} 
            onBack={onBack} 
          />
        )}
      </main>

      <BeneficiarySidePanel 
        isOpen={isPanelOpen} 
        onClose={() => setIsPanelOpen(false)} 
        onSelect={(b) => {
          setFormData(prev => ({ ...prev, beneficiary: b }));
          setIsPanelOpen(false);
        }}
      />



      <style>{`
        @keyframes in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-in { animation: in 0.4s ease-out forwards; }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.2); }
          50% { box-shadow: 0 0 20px rgba(59, 100, 246, 0.4); }
        }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default SellCryptocurrency;

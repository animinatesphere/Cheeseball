import React, { useState, useEffect } from "react";
import { ArrowLeft, Loader2, TrendingUp, Info, ShieldCheck, ChevronRight, Ticket, XCircle, CheckCircle2, Coins } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { getCurrencies, getUserPortfolio, validatePromoCode } from "../../lib/api";

const SellCryptocurrency = ({ onBack, onExchange, onNavigate }) => {
  const [sendAmount, setSendAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [currencies, setCurrencies] = useState([]);
  const [portfolio, setPortfolio] = useState({});
  const [fromCurrency, setFromCurrency] = useState("BTC");
  const [toCurrency, setToCurrency] = useState("NGN");
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState("");
  const [promoBenefit, setPromoBenefit] = useState(0); 
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState(false);
  const [promoLoading, setPromoLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: currData } = await getCurrencies();
      if (currData) {
        const activeOnly = currData.filter(c => c.is_active);
        setCurrencies(activeOnly);
        if (activeOnly.length > 0) setFromCurrency(activeOnly[0].symbol);
      }
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: portData } = await getUserPortfolio(session.user.id);
        if (portData) setPortfolio(portData);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const SELL_RATES = {
     USDT: 1530,
     BTC: 92450000,
     ETH: 5850000,
  };

  const handleAmountChange = (val) => {
    setSendAmount(val);
    const curr = currencies.find(c => c.symbol === fromCurrency);
    const rate = SELL_RATES[fromCurrency] || (curr ? Number(curr.price) : 0);
    
    if (val && rate && parseFloat(val) > 0) {
       const baseAmount = parseFloat(val) * rate;
       const bonus = baseAmount * (promoBenefit / 100);
       setReceiveAmount((baseAmount + bonus).toLocaleString(undefined, { 
         minimumFractionDigits: 2, 
         maximumFractionDigits: 2 
       }));
    } else {
       setReceiveAmount("");
    }
  };

  const handleApplyPromo = async () => {
    if (!promoCode) return;
    setPromoLoading(true);
    setPromoError("");
    setPromoSuccess(false);
    const { data, error } = await validatePromoCode(promoCode);
    if (error || !data) {
      setPromoError(error?.message || "Invalid promo code");
      setPromoBenefit(0);
    } else {
      setPromoBenefit(data.benefit_percentage);
      setPromoSuccess(true);
    }
    setPromoLoading(false);
  };

  useEffect(() => {
    handleAmountChange(sendAmount);
  }, [fromCurrency, sendAmount, promoBenefit]);

  const selectedFromCurrency = currencies.find(c => c.symbol === fromCurrency);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0B0E11] text-[#FFB11A]"><Loader2 className="w-10 h-10 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#0B0E11] text-[#EAECEF] pb-32">
      {/* Navbar Header */}
      <div className="bg-[#181A20] px-4 py-6 border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-xl font-black uppercase tracking-tight">Sell Crypto</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-8">
        {/* Market Stats Preview */}
        <div className="bg-[#1E2329]/50 border border-white/5 rounded-2xl p-4 mb-8 flex justify-between items-center">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                 <Coins className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-gray-500 uppercase">Instant Settlement</p>
                 <p className="text-xs font-bold">24/7 Automated Payouts</p>
              </div>
           </div>
           <Info className="w-5 h-5 text-gray-700" />
        </div>

        {/* Sell Inputs */}
        <div className="space-y-4">
          {/* FROM */}
          <div className="bg-[#1E2329] border border-white/5 p-6 rounded-[2rem] focus-within:border-[#FFB11A]/30 transition-all">
            <div className="flex justify-between items-center mb-6 px-1">
               <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">You Sell</span>
               <div className="flex items-center gap-2">
                 <span className="text-[10px] font-bold text-gray-500">Balance:</span>
                 <span className="text-[10px] font-black text-[#FFB11A]">{portfolio[fromCurrency] || 0} {fromCurrency}</span>
               </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-[#2B3139] px-4 py-2 rounded-xl group cursor-pointer hover:bg-[#363C45] transition-colors max-w-[140px]">
                 <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-gray-600 font-black text-[10px]">
                    {selectedFromCurrency?.icon_url ? <img src={selectedFromCurrency.icon_url} alt="" className="w-full h-full object-cover" /> : fromCurrency[0]}
                 </div>
                 <select 
                   value={fromCurrency}
                   onChange={(e) => setFromCurrency(e.target.value)}
                   className="bg-transparent font-black text-lg outline-none cursor-pointer appearance-none text-white pr-2 flex-1"
                 >
                    {currencies.map(c => <option key={c.id} value={c.symbol} className="bg-[#1E2329]">{c.symbol}</option>)}
                 </select>
              </div>
              <input
                type="number"
                placeholder="0.00"
                value={sendAmount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className="flex-1 bg-transparent text-right text-3xl font-black outline-none text-white placeholder-gray-700"
              />
            </div>
          </div>

          <div className="flex justify-center -my-8 relative z-10">
             <div className="bg-[#0B0E11] p-1 rounded-2xl">
                <button className="w-12 h-12 bg-[#FFB11A] text-black rounded-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-2xl">
                   <TrendingUp className="w-6 h-6 rotate-180" />
                </button>
             </div>
          </div>

          {/* TO */}
          <div className="bg-[#1E2329] border border-white/5 p-6 rounded-[2rem] opacity-90 transition-all">
            <div className="flex justify-between items-center mb-6 px-1">
               <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">You Receive</span>
               <span className="text-[10px] font-bold text-gray-500">1 {fromCurrency} ≈ {SELL_RATES[fromCurrency]?.toLocaleString()} NGN</span>
            </div>
            <div className="flex items-center gap-4 text-white/40">
              <div className="flex items-center gap-3 bg-[#2B3139] px-6 py-2 rounded-xl">
                 <span className="text-xl">🇳🇬</span>
                 <span className="font-black text-lg">NGN</span>
              </div>
              <input
                type="text"
                readOnly
                value={receiveAmount}
                placeholder="0.00"
                className="flex-1 bg-transparent text-right text-3xl font-black outline-none text-[#FFB11A] placeholder-gray-800"
              />
            </div>
          </div>
        </div>

        {/* Promo Code Hub */}
        <div className="mt-8 bg-[#181A20]/50 border border-white/5 rounded-[2rem] p-6 focus-within:border-[#FFB11A]/20 transition-all">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-500">
                <Ticket size={20} />
             </div>
             <input
               type="text"
               value={promoCode}
               onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
               placeholder="PROMO CODE"
               className="flex-1 bg-transparent text-sm font-black text-white placeholder-gray-700 outline-none uppercase tracking-widest"
             />
             <button 
               onClick={handleApplyPromo}
               disabled={promoLoading || !promoCode}
               className="bg-[#2B3139] text-white text-[10px] font-black px-6 py-3 rounded-xl uppercase tracking-widest hover:bg-[#363C45] transition-all disabled:opacity-30"
             >
               {promoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
             </button>
          </div>
          {promoError && <p className="mt-3 text-red-500 text-[10px] font-bold flex items-center gap-2 px-2 uppercase tracking-widest"><XCircle size={14} /> {promoError}</p>}
          {promoSuccess && <p className="mt-3 text-emerald-500 text-[10px] font-bold flex items-center gap-2 px-2 uppercase tracking-widest"><CheckCircle2 size={14} /> Success! {promoBenefit}% rate boost applied</p>}
        </div>

        {/* Action Button */}
        <div className="mt-12 space-y-4">
           <div className="flex items-center justify-between px-2 text-[#FFE600]/40">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Secured by Bybit Liquidity</span>
           </div>
           
           <button
            onClick={() => {
              if (!sendAmount) return;
              onExchange({
                type: 'sell',
                fromAmount: sendAmount,
                fromCurrency: fromCurrency,
                toAmount: receiveAmount.replace(/,/g, ''),
                toCurrency: toCurrency,
                rate: SELL_RATES[fromCurrency],
                promoCode: promoSuccess ? promoCode : null,
                promoBenefit: promoSuccess ? promoBenefit : 0
              });
            }}
            disabled={!sendAmount}
            className="w-full bg-[#FFB11A] hover:bg-[#ffb11a]/90 text-black py-6 rounded-[2rem] font-black text-xl shadow-[#FFB11A]/10 shadow-2xl flex items-center justify-center gap-4 group transition-all disabled:opacity-30 active:scale-95"
          >
            <span>Instant Sell</span>
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellCryptocurrency;

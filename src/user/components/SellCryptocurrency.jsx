import React, { useState, useEffect } from "react";
import { ArrowLeft, Loader2, TrendingUp } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { getCurrencies, getUserPortfolio, validatePromoCode } from "../../lib/api";
import { CheckCircle2, Ticket, XCircle } from "lucide-react";

const SellCryptocurrency = ({ onBack, onExchange, onNavigate }) => {
  const [sendAmount, setSendAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [currencies, setCurrencies] = useState([]);
  const [portfolio, setPortfolio] = useState({});
  const [fromCurrency, setFromCurrency] = useState("BTC");
  const [toCurrency, setToCurrency] = useState("NGN");
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState("");
  const [promoBenefit, setPromoBenefit] = useState(0); // percentage boost
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState(false);
  const [promoLoading, setPromoLoading] = useState(false);

  const fiatCurrencies = [
    { symbol: "NGN", name: "Nigerian Naira", icon: "₦" },
    { symbol: "USD", name: "US Dollar", icon: "$" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: currData } = await getCurrencies();
      if (currData) setCurrencies(currData);

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: portData } = await getUserPortfolio(session.user.id);
        if (portData) setPortfolio(portData);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const getPrice = (symbol) => {
    const fiatPrices = { 'USD': 1, 'NGN': 0.00065 };
    if (fiatPrices[symbol]) return fiatPrices[symbol];
    const curr = currencies.find(c => c.symbol === symbol);
    return curr ? Number(curr.price) : 0;
  };

  const getCurrencyIcon = (symbol) => {
    const curr = currencies.find(c => c.symbol === symbol);
    return curr?.icon_url ? <img src={curr.icon_url} alt="" className="w-full h-full object-cover rounded-full" /> : (curr?.symbol?.[0] || symbol?.[0]);
  };

  // New SELL_RATES constant
  const SELL_RATES = {
     USDT: 1530,
     BTC: 92450000,
     ETH: 5850000,
  };

  // New handleAmountChange function
  const handleAmountChange = (val) => {
    setSendAmount(val);
    const rate = SELL_RATES[fromCurrency] || 0;
    if (val && rate) {
       const baseAmount = parseFloat(val) * rate;
       const bonus = baseAmount * (promoBenefit / 100);
       setReceiveAmount((baseAmount + bonus).toFixed(2));
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

  // Update receiveAmount when fromCurrency changes
  useEffect(() => {
    handleAmountChange(sendAmount);
  }, [fromCurrency, sendAmount]);


  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}><Loader2 className="w-10 h-10 animate-spin text-blue-500" /></div>;

  return (
    <div className="min-h-screen animate-fade-in pb-24" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div style={{ background: 'var(--bg-secondary)' }} className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">
          <div className="flex flex-col gap-6">
            <button onClick={onBack} className="w-fit p-3 rounded-2xl transition-all" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-secondary)' }}>
                <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl sm:text-5xl font-black mb-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>Sell Crypto</h1>
              <p className="text-blue-400 text-sm sm:text-lg font-medium">Instantly convert your assets to local currency</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-4">
        <div className="max-w-3xl mx-auto card rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 lg:p-14 relative overflow-hidden group">
          <div className="space-y-10 relative z-10">
            {/* Sell Card */}
            <div>
              <div className="flex justify-between items-center mb-4 px-2">
                <label className="text-gray-400 font-black uppercase text-[10px] sm:text-xs tracking-widest">You Sell</label>
                <div className="text-blue-600 font-bold text-[10px] sm:text-xs uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100 italic">Balance: {portfolio[fromCurrency] || 0} {fromCurrency}</div>
              </div>
              <div className="bg-white p-6 sm:p-8 rounded-[2rem] border-2 border-transparent focus-within:border-blue-100 transition-all shadow-sm">
                <div className="flex items-center gap-6">
                   <div className="relative group/select">
                      <select 
                        value={fromCurrency}
                        onChange={(e) => setFromCurrency(e.target.value)}
                        className="bg-gray-50 pl-4 pr-10 py-4 rounded-2xl font-black text-gray-900 appearance-none outline-none border-2 border-transparent focus:border-blue-200 transition-all cursor-pointer min-w-[100px]"
                      >
                         <option value="USDT">USDT</option>
                         <option value="BTC">BTC</option>
                         <option value="ETH">ETH</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover/select:text-blue-500 transition-colors">
                         <TrendingUp size={16} />
                      </div>
                   </div>
                   <input
                     type="number"
                     value={sendAmount}
                     onChange={(e) => handleAmountChange(e.target.value)}
                     placeholder="0.00"
                     className="flex-1 bg-transparent text-2xl sm:text-4xl font-black text-gray-900 placeholder-gray-200 outline-none tabular-nums"
                   />
                </div>
              </div>
            </div>

             {/* Promo Code Card */}
            <div>
              <div className="flex justify-between items-center mb-4 px-2">
                <label className="text-gray-400 font-black uppercase text-[10px] sm:text-xs tracking-widest">Promo Code</label>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-[2rem] border-2 border-transparent focus-within:border-blue-100 transition-all shadow-sm">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                      <Ticket size={20} />
                   </div>
                   <input
                     type="text"
                     value={promoCode}
                     onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                     placeholder="ENTER CODE"
                     className="flex-1 bg-transparent text-lg font-black text-gray-900 placeholder-gray-200 outline-none uppercase tracking-widest"
                   />
                   <button 
                     onClick={handleApplyPromo}
                     disabled={promoLoading || !promoCode}
                     className="px-6 py-3 bg-gray-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50"
                   >
                     {promoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                   </button>
                </div>
                {promoError && <p className="mt-3 text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><XCircle size={14} /> {promoError}</p>}
                {promoSuccess && <p className="mt-3 text-green-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><CheckCircle2 size={14} /> Success! {promoBenefit}% boost applied</p>}
              </div>
            </div>

            {/* Receive Card */}
            <div>
              <div className="flex justify-between items-center mb-4 px-2">
                <label className="text-gray-400 font-black uppercase text-[10px] sm:text-xs tracking-widest">You Get</label>
                {promoSuccess && <span className="text-[10px] font-black text-green-600 uppercase bg-green-50 px-2 py-0.5 rounded-md">Includes {promoBenefit}% Boost</span>}
              </div>
              <div className="bg-white p-6 sm:p-8 rounded-[2rem] border-2 border-transparent focus-within:border-blue-100 transition-all shadow-sm">
                <div className="flex items-center gap-6">
                   <div className="bg-gray-50 px-6 py-4 rounded-2xl font-black text-gray-900 flex items-center gap-3">
                      <span className="text-green-600">🇳🇬</span>
                      {toCurrency}
                   </div>
                   <input
                     type="text"
                     value={receiveAmount}
                     readOnly
                     placeholder="0.00"
                     className="flex-1 bg-transparent text-2xl sm:text-4xl font-black text-gray-900 placeholder-gray-200 outline-none tabular-nums"
                   />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (!sendAmount) return;
              const fromCurrObj = currencies.find(c => c.symbol === fromCurrency);
              onExchange({
                type: 'sell',
                fromAmount: sendAmount,
                fromCurrency: fromCurrency,
                fromCurrencyId: fromCurrObj?.id,
                 toAmount: receiveAmount,
                toCurrency: toCurrency,
                rate: SELL_RATES[fromCurrency],
                promoCode: promoSuccess ? promoCode : null,
                promoBenefit: promoSuccess ? promoBenefit : 0
              });
            }}
            disabled={!sendAmount}
            className="w-full mt-12 bg-[#0063BF] hover:bg-blue-700 text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl transition-all flex items-center justify-center gap-4 group disabled:opacity-50"
          >
            <span>Preview Sale</span>
            <ArrowLeft className="w-6 h-6 rotate-180 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellCryptocurrency;

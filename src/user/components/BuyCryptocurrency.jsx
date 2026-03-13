import React, { useState, useEffect } from "react";
import { getCurrencies, getUserPortfolio, validatePromoCode } from "../../lib/api";
import { supabase } from "../../lib/supabaseClient";
import { ArrowLeft, TrendingUp, ShoppingCart, Clock, User, Loader2, Ticket, CheckCircle2, XCircle } from "lucide-react";

const BuyCryptocurrency = ({ onBack, onExchange, onNavigate }) => {
  const [sendAmount, setSendAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [currencies, setCurrencies] = useState([]);
  const [portfolio, setPortfolio] = useState({});
  const [fromCurrency, setFromCurrency] = useState("NGN");
  const [toCurrency, setToCurrency] = useState("BTC");
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState("");
  const [promoBenefit, setPromoBenefit] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState(false);
  const [promoLoading, setPromoLoading] = useState(false);

  // Hardcoded Fiat options for "Buy" flow
  const fiatCurrencies = [
    { symbol: "NGN", name: "Nigerian Naira", icon: "₦" },
    { symbol: "USD", name: "US Dollar", icon: "$" },
    { symbol: "EUR", name: "Euro", icon: "€" },
    { symbol: "GBP", name: "British Pound", icon: "£" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // 1. Fetch Crypto Currencies
      const { data: currData } = await getCurrencies();
      if (currData) {
        setCurrencies(currData);
        // Default To currency
        const hasBTC = currData.find(c => c.symbol === 'BTC');
        if (hasBTC) setToCurrency(hasBTC.symbol);
      }

      // 2. Fetch Portfolio
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: portData } = await getUserPortfolio(session.user.id);
        if (portData) setPortfolio(portData);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleFromChange = (e) => {
    setFromCurrency(e.target.value);
  };

  const handleToChange = (e) => {
    setToCurrency(e.target.value);
  };

  const getPrice = (symbol) => {
    // Mock Fiat Prices relative to USD
    const fiatPrices = {
      'USD': 1,
      'NGN': 0.00065, // Example: 1 NGN = 0.00065 USD (approx 1500 NGN/USD)
      'EUR': 1.08,
      'GBP': 1.25
    };
    if (fiatPrices[symbol]) return fiatPrices[symbol];

    // Crypto prices from DB
    const curr = currencies.find(c => c.symbol === symbol);
    return curr ? Number(curr.price) : 0;
  };

  const handleSendAmountChange = (e) => {
    const value = e.target.value;
    setSendAmount(value);
    
    if (!value || isNaN(value)) {
      setReceiveAmount("");
      return;
    }

    const fromPrice = getPrice(fromCurrency);
    const toPrice = getPrice(toCurrency);

    if (fromPrice && toPrice) {
      const baseConverted = (parseFloat(value) * fromPrice) / toPrice;
      const bonus = baseConverted * (promoBenefit / 100);
      const decimals = ['NGN', 'USD', 'EUR', 'GBP'].includes(toCurrency) ? 2 : 6;
      setReceiveAmount((baseConverted + bonus).toFixed(decimals));
    }
  };

  const handleApplyPromo = async () => {
    if (!promoCode) return;
    setPromoLoading(true);
    setPromoError("");
    setPromoSuccess(false);
    
    const { data, error } = await validatePromoCode(promoCode);
    
    if (error || !data) {
      setPromoError(error?.message || "Invalid code");
      setPromoBenefit(0);
    } else {
      setPromoBenefit(data.benefit_percentage);
      setPromoSuccess(true);
    }
    setPromoLoading(false);
  };

  const handleReceiveAmountChange = (e) => {
    const value = e.target.value;
    setReceiveAmount(value);

    // If user types in "Receive", calculate "Send"
    // Send = (Receive * ToPrice) / FromPrice
    if (!value || isNaN(value)) {
      setSendAmount("");
      return;
    }

    const fromPrice = getPrice(fromCurrency);
    const toPrice = getPrice(toCurrency);

    if (fromPrice && toPrice) {
      const converted = (parseFloat(value) * toPrice) / fromPrice;
      const decimals = ['NGN', 'USD', 'EUR', 'GBP'].includes(fromCurrency) ? 2 : 6;
      setSendAmount(converted.toFixed(decimals));
    }
  };

  // Recalculate when currency changes
  useEffect(() => {
    if (sendAmount) {
        const fromPrice = getPrice(fromCurrency);
        const toPrice = getPrice(toCurrency);
        if (fromPrice && toPrice) {
            const baseConverted = (parseFloat(sendAmount) * fromPrice) / toPrice;
            const bonus = baseConverted * (promoBenefit / 100);
            const decimals = ['NGN', 'USD', 'EUR', 'GBP'].includes(toCurrency) ? 2 : 6;
            setReceiveAmount((baseConverted + bonus).toFixed(decimals));
        }
    }
  }, [fromCurrency, toCurrency, currencies, promoBenefit]);


  const currentBalance = portfolio[fromCurrency] || 0;
  const selectedFiat = fiatCurrencies.find(c => c.symbol === fromCurrency) || fiatCurrencies[0];
  const exchangeRate = (getPrice(toCurrency) / getPrice(fromCurrency)).toLocaleString(undefined, { maximumFractionDigits: 2 });

   // Simple mock matching for icons/colors based on loaded currencies
  const getCurrencyIcon = (symbol) => {
    const curr = currencies.find(c => c.symbol === symbol);
    return curr?.icon_url ? <img src={curr.icon_url} alt="" className="w-full h-full object-cover rounded-full" /> : (curr?.symbol?.[0] || symbol?.[0]);
  };

  if (loading) {
     return (
       <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
         <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
       </div>
     );
  }

  return (
    <div className="min-h-screen animate-fade-in pb-24" style={{ background: 'var(--bg-primary)' }}>
      <div style={{ background: 'var(--bg-secondary)' }} className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">
          <button onClick={onBack} className="mb-6 p-3 rounded-2xl transition-all" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', color: 'var(--text-secondary)' }}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl sm:text-4xl font-black mb-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>Buy Crypto</h1>
          <p className="text-blue-400 font-medium text-sm">Purchase assets with fiat instantly</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-4">
        <div className="max-w-3xl mx-auto card rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 lg:p-12 text-sm sm:text-base">
          <div className="mb-8 sm:mb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4 px-2">
              <label className="text-gray-400 font-black uppercase text-[10px] sm:text-xs tracking-widest">You Pay</label>
              <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] sm:text-sm bg-blue-50 px-3 py-1 rounded-full whitespace-nowrap">
                Balance: {currentBalance.toLocaleString()} {fromCurrency}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 bg-white rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 shadow-sm border border-gray-100 focus-within:border-blue-300 transition-all">
              <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100 w-full sm:w-auto">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-black text-xs shrink-0 font-sans">
                  {selectedFiat.icon}
                </div>
                <select 
                  value={fromCurrency}
                  onChange={handleFromChange}
                  className="bg-transparent font-black text-lg outline-none cursor-pointer flex-1 sm:flex-none"
                >
                  {fiatCurrencies.map(c => <option key={c.symbol} value={c.symbol}>{c.symbol}</option>)}
                </select>
              </div>
              <input
                type="number"
                placeholder="0.00"
                value={sendAmount}
                onChange={handleSendAmountChange}
                className="flex-1 bg-transparent text-left sm:text-right text-2xl sm:text-3xl font-black outline-none text-gray-900 placeholder-gray-200 min-w-0"
              />
            </div>
          </div>

          <div className="flex justify-center -my-10 sm:-my-14 relative z-10">
            <button className="w-12 h-12 sm:w-16 sm:h-16 bg-white border-4 sm:border-8 border-gray-50 rounded-[1rem] sm:rounded-[1.5rem] flex items-center justify-center hover:scale-110 transition-all shadow-xl group">
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 group-hover:rotate-180 transition-transform duration-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </button>
          </div>

          <div className="mt-10 sm:mt-14 mb-8 sm:mb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4 px-2">
              <label className="text-gray-400 font-black uppercase text-[10px] sm:text-xs tracking-widest">You Receive</label>
              <div className="text-gray-400 font-bold text-[10px] sm:text-xs bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
                1 {toCurrency} ≈ {exchangeRate} {fromCurrency}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 bg-white rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 shadow-sm border border-gray-100 focus-within:border-blue-300 transition-all">
              <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100 w-full sm:w-auto">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white text-xl shrink-0 overflow-hidden">
                  {getCurrencyIcon(toCurrency)}
                </div>
                <select 
                  value={toCurrency}
                  onChange={handleToChange}
                  className="bg-transparent font-black text-lg outline-none cursor-pointer flex-1 sm:flex-none"
                >
                  {currencies.map(c => <option key={c.id} value={c.symbol}>{c.symbol}</option>)}
                </select>
              </div>
              <input
                type="number"
                placeholder="0.00"
                value={receiveAmount}
                onChange={handleReceiveAmountChange}
                className="flex-1 bg-transparent text-left sm:text-right text-2xl sm:text-3xl font-black outline-none text-gray-900 placeholder-gray-200 min-w-0"
              />
            </div>
          </div>

          <div className="mb-8 sm:mb-12">
            <div className="flex justify-between items-center mb-4 px-2">
              <label className="text-gray-400 font-black uppercase text-[10px] sm:text-xs tracking-widest">Promo Code</label>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border-2 border-transparent focus-within:border-blue-100 transition-all shadow-sm flex flex-col sm:flex-row items-center gap-4">
               <div className="flex items-center gap-4 flex-1 w-full">
                 <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <Ticket size={20} />
                 </div>
                 <input
                   type="text"
                   value={promoCode}
                   onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                   placeholder="ENTER CODE"
                   className="flex-1 bg-transparent text-lg font-black text-gray-900 placeholder-gray-200 outline-none uppercase tracking-widest"
                 />
               </div>
               <button 
                 onClick={handleApplyPromo}
                 disabled={promoLoading || !promoCode}
                 className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50"
               >
                 {promoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
               </button>
            </div>
            {promoError && <p className="mt-3 px-2 text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><XCircle size={14} /> {promoError}</p>}
            {promoSuccess && <p className="mt-3 px-2 text-green-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><CheckCircle2 size={14} /> Success! {promoBenefit}% bonus crypto added</p>}
          </div>

          <button
            onClick={() => {
              const toCurrObj = currencies.find(c => c.symbol === toCurrency);
              const fromCurrObj = currencies.find(c => c.symbol === fromCurrency);

              onExchange({
                type: 'buy',
                fromAmount: sendAmount,
                fromCurrency: fromCurrency,
                fromCurrencyId: fromCurrObj?.id || null, 
                toAmount: receiveAmount,
                toCurrency: toCurrency,
                toCurrencyId: toCurrObj?.id,
                toCurrencyIcon: toCurrObj?.icon_url,
                promoCode: promoSuccess ? promoCode : null,
                promoBenefit: promoSuccess ? promoBenefit : 0
              });
            }}
            className="w-full bg-[#0063BF] hover:bg-blue-700 text-white py-5 sm:py-6 rounded-[1.5rem] sm:rounded-[2rem] font-black text-lg sm:text-xl shadow-2xl shadow-blue-200 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-4 group"
          >
            <span>Preview Order</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-2 transition-transform">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
  
export default BuyCryptocurrency;

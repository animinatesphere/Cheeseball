import React, { useState, useEffect } from "react";
import { getCurrencies, getUserPortfolio, validatePromoCode } from "../../lib/api";
import { supabase } from "../../lib/supabaseClient";
import { 
  ArrowLeft, 
  Loader2, 
  Ticket, 
  CheckCircle2, 
  XCircle,
  ChevronRight,
  Info,
  ShieldCheck,
  Zap,
  Repeat
} from "lucide-react";

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

  const fiatCurrencies = [
    { symbol: "NGN", name: "Nigerian Naira", icon: "🇳🇬" },
    { symbol: "USD", name: "US Dollar", icon: "🇺🇸" },
    { symbol: "EUR", name: "Euro", icon: "🇪🇺" },
    { symbol: "GBP", name: "British Pound", icon: "🇬🇧" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: currData } = await getCurrencies();
      if (currData) {
        setCurrencies(currData.filter(c => c.is_active));
        const hasBTC = currData.find(c => c.symbol === 'BTC');
        if (hasBTC) setToCurrency(hasBTC.symbol);
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

  const getPrice = (symbol) => {
    const fiatPrices = { 'USD': 1, 'NGN': 0.00065, 'EUR': 1.08, 'GBP': 1.25 };
    if (fiatPrices[symbol]) return fiatPrices[symbol];
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

  const selectedFiat = fiatCurrencies.find(c => c.symbol === fromCurrency) || fiatCurrencies[0];
  const exchangeRate = (getPrice(toCurrency) / getPrice(fromCurrency)).toLocaleString(undefined, { maximumFractionDigits: 2 });
  const selectedToCurrency = currencies.find(c => c.symbol === toCurrency);

  if (loading) {
     return (
       <div className="min-h-screen flex items-center justify-center bg-[#0B0E11]">
         <Loader2 className="w-10 h-10 animate-spin text-[#FFB11A]" />
       </div>
     );
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-[#EAECEF] pb-32">
      {/* Navbar Style Header */}
      <div className="bg-[#181A20] px-4 py-6 border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-black uppercase tracking-tight">Buy Crypto</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-8">
        {/* Market Stats Preview */}
        <div className="bg-[#1E2329]/50 border border-white/5 rounded-2xl p-4 mb-8 flex justify-between items-center">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                 <ShieldCheck className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-gray-500 uppercase">Trusted Payment</p>
                 <p className="text-xs font-bold">100% Secure Transaction</p>
              </div>
           </div>
           <Info className="w-5 h-5 text-gray-700" />
        </div>

        {/* Amount Input Section */}
        <div className="space-y-4">
          {/* PAY */}
          <div className="bg-[#1E2329] border border-white/5 p-6 rounded-[2rem] focus-within:border-[#FFB11A]/30 transition-all">
            <div className="flex justify-between items-center mb-6">
               <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">You Pay</span>
               <span className="text-[10px] font-bold text-[#FFB11A] bg-[#FFB11A]/10 px-2 py-0.5 rounded italic">Fiat Balance</span>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-3 bg-[#2B3139] px-4 py-2 rounded-xl group cursor-pointer hover:bg-[#363C45] transition-colors">
                  <span className="text-xl">{selectedFiat.icon}</span>
                  <select 
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="bg-transparent font-black text-lg outline-none cursor-pointer appearance-none text-white pr-2"
                  >
                    {fiatCurrencies.map(c => <option key={c.symbol} value={c.symbol} className="bg-[#1E2329]">{c.symbol}</option>)}
                  </select>
               </div>
               <input
                 type="number"
                 placeholder="0.00"
                 value={sendAmount}
                 onChange={handleSendAmountChange}
                 className="flex-1 bg-transparent text-right text-3xl font-black outline-none text-white placeholder-gray-700"
               />
            </div>
          </div>

          <div className="flex justify-center -my-8 relative z-10">
             <div className="bg-[#0B0E11] p-1 rounded-2xl">
                <button className="w-12 h-12 bg-[#FFB11A] text-black rounded-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-2xl">
                   <Repeat className="w-6 h-6" />
                </button>
             </div>
          </div>

          {/* RECEIVE */}
          <div className="bg-[#1E2329] border border-white/5 p-6 rounded-[2rem] focus-within:border-[#FFB11A]/30 transition-all">
            <div className="flex justify-between items-center mb-6">
               <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">You Receive</span>
               <span className="text-[10px] font-bold text-gray-500">1 {toCurrency} ≈ {exchangeRate} {fromCurrency}</span>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-3 bg-[#2B3139] px-4 py-2 rounded-xl group cursor-pointer hover:bg-[#363C45] transition-colors max-w-[140px]">
                  <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-gray-600 font-black text-[10px]">
                    {selectedToCurrency?.icon ? <img src={selectedToCurrency.icon} alt="" className="w-full h-full object-cover" /> : toCurrency[0]}
                  </div>
                  <select 
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="bg-transparent font-black text-lg outline-none cursor-pointer appearance-none text-white pr-2 flex-1"
                  >
                    {currencies.map(c => <option key={c.id} value={c.symbol} className="bg-[#1E2329]">{c.symbol}</option>)}
                  </select>
               </div>
               <input
                 type="number"
                 placeholder="0.00"
                 value={receiveAmount}
                 onChange={handleReceiveAmountChange}
                 className="flex-1 bg-transparent text-right text-3xl font-black outline-none text-white placeholder-gray-700"
               />
            </div>
          </div>
        </div>

        {/* Promo Code Integrated */}
        <div className="mt-6 bg-[#181A20]/50 border border-white/5 rounded-[2rem] p-6 focus-within:border-[#FFB11A]/20 transition-all">
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
               className="bg-[#FFB11A] text-black text-[10px] font-black px-6 py-3 rounded-xl uppercase tracking-widest hover:bg-[#ffb11a]/80 transition-all disabled:opacity-30"
             >
               {promoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
             </button>
          </div>
          {promoError && <p className="mt-3 text-red-500 text-[10px] font-bold flex items-center gap-2 px-2 uppercase tracking-widest"><XCircle size={14} /> {promoError}</p>}
          {promoSuccess && <p className="mt-3 text-emerald-500 text-[10px] font-bold flex items-center gap-2 px-2 uppercase tracking-widest"><CheckCircle2 size={14} /> Applied: {promoBenefit}% extra crypto</p>}
        </div>

        {/* Payment Methods Footer Stub */}
        <div className="mt-12 space-y-4">
           <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Payment Security</span>
              <div className="flex gap-2">
                 <div className="w-8 h-5 bg-white/5 rounded border border-white/10"></div>
                 <div className="w-8 h-5 bg-white/5 rounded border border-white/10"></div>
                 <div className="w-8 h-5 bg-white/5 rounded border border-white/10"></div>
              </div>
           </div>

           <button
            onClick={() => {
              const toCurrObj = currencies.find(c => c.symbol === toCurrency);
              onExchange({
                type: 'buy',
                fromAmount: sendAmount,
                fromCurrency: fromCurrency,
                toAmount: receiveAmount,
                toCurrency: toCurrency,
                toCurrencyId: toCurrObj?.id,
                toCurrencyIcon: toCurrObj?.icon_url,
                promoCode: promoSuccess ? promoCode : null,
                promoBenefit: promoSuccess ? promoBenefit : 0
              });
            }}
            disabled={!sendAmount}
            className="w-full bg-[#FFB11A] hover:bg-[#ffb11a]/90 text-black py-6 rounded-[2rem] font-black text-xl shadow-2xl flex items-center justify-center gap-4 group transition-all disabled:opacity-30 active:scale-95"
          >
            <span>Proceed to Buy</span>
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
  
export default BuyCryptocurrency;

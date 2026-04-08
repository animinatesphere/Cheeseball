import React, { useState, useEffect } from "react";
import { ArrowLeft, Loader2, Repeat, Info, ShieldCheck, ChevronRight, Zap } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { getCurrencies, getUserPortfolio } from "../../lib/api";

const SwapCrypto = ({ onBack, onSwap, onNavigate }) => {
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [currencies, setCurrencies] = useState([]);
  const [portfolio, setPortfolio] = useState({});
  const [fromCurrency, setFromCurrency] = useState("USDT");
  const [toCurrency, setToCurrency] = useState("BTC");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: currData } = await getCurrencies();
      if (currData) {
        const activeOnly = currData.filter(c => c.is_active);
        setCurrencies(activeOnly);
        const hasUSDT = activeOnly.find(c => c.symbol === 'USDT');
        const hasBTC = activeOnly.find(c => c.symbol === 'BTC');
        if (hasUSDT) setFromCurrency(hasUSDT.symbol);
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
    if (['USDT', 'USDC'].includes(symbol)) return 1;
    const curr = currencies.find(c => c.symbol === symbol);
    return curr ? Number(curr.price) : 0;
  };

  const handleFromAmountChange = (e) => {
    const value = e.target.value;
    setFromAmount(value);
    if (!value || isNaN(value)) {
      setToAmount("");
      return;
    }
    const fromPrice = getPrice(fromCurrency);
    const toPrice = getPrice(toCurrency);
    if (fromPrice && toPrice) {
      const converted = (parseFloat(value) * fromPrice) / toPrice;
      setToAmount(converted.toFixed(6));
    }
  };

  const handleToAmountChange = (e) => {
    const value = e.target.value;
    setToAmount(value);
    if (!value || isNaN(value)) {
      setFromAmount("");
      return;
    }
    const fromPrice = getPrice(fromCurrency);
    const toPrice = getPrice(toCurrency);
    if (fromPrice && toPrice) {
      const converted = (parseFloat(value) * toPrice) / fromPrice;
      setFromAmount(converted.toFixed(6));
    }
  };

  useEffect(() => {
    if (fromAmount) {
        const fromPrice = getPrice(fromCurrency);
        const toPrice = getPrice(toCurrency);
        if (fromPrice && toPrice) {
            const converted = (parseFloat(fromAmount) * fromPrice) / toPrice;
            setToAmount(converted.toFixed(6));
        }
    }
  }, [fromCurrency, toCurrency, currencies]);

  const currentBalance = portfolio[fromCurrency] || 0;
  const exchangeRate = getPrice(fromCurrency) && getPrice(toCurrency) 
    ? (getPrice(fromCurrency) / getPrice(toCurrency)).toFixed(6) 
    : "...";
  
  const selectedFrom = currencies.find(c => c.symbol === fromCurrency);
  const selectedTo = currencies.find(c => c.symbol === toCurrency);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white text-blue-600"><Loader2 className="w-10 h-10 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-32">
      <div className="bg-white px-4 py-6 border-b border-black/5 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-black uppercase tracking-tight text-slate-900">Convert</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-8">
        <div className="flex bg-gray-100 p-1 rounded-2xl border border-black/5 mb-8">
          <button className="flex-1 py-3 rounded-xl bg-white text-blue-600 font-black text-sm uppercase tracking-widest shadow-md">
            Crypto
          </button>
          <button onClick={() => onNavigate("giftcard-swap")} className="flex-1 py-3 rounded-xl text-gray-500 font-bold text-sm uppercase tracking-widest hover:text-slate-600 transition-colors">
            Gift Card
          </button>
        </div>

        <div className="bg-gray-50 border border-black/5 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
           
           <div className="space-y-6 relative z-10">
              {/* FROM */}
              <div className="bg-[#e9ecef]/50 border border-white/5 p-6 rounded-[2rem]">
                 <div className="flex justify-between items-center mb-6 px-1">
                    <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">From</span>
                    <span className="text-[10px] font-bold text-blue-600">Balance: {currentBalance.toLocaleString()} {fromCurrency}</span>
                 </div>
                 <div className="flex items-center gap-4">
                   <div className="flex items-center gap-3 bg-[#f8f9fa] px-4 py-2 rounded-xl group cursor-pointer hover:bg-[#e9ecef] transition-colors max-w-[140px]">
                      <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-gray-700 font-black text-[10px]">
                        {selectedFrom?.icon_url ? <img src={selectedFrom.icon_url} alt="" className="w-full h-full object-cover" /> : fromCurrency[0]}
                      </div>
                      <select 
                        value={fromCurrency}
                        onChange={(e) => setFromCurrency(e.target.value)}
                        className="bg-transparent font-black text-lg outline-none cursor-pointer appearance-none text-slate-900 pr-2 flex-1"
                      >
                         {currencies.map(c => <option key={c.id} value={c.symbol} className="bg-white">{c.symbol}</option>)}
                      </select>
                   </div>
                   <input
                     type="number"
                     placeholder="0.00"
                     value={fromAmount}
                     onChange={handleFromAmountChange}
                     className="flex-1 bg-transparent text-right text-3xl font-black outline-none text-slate-900 placeholder-gray-300"
                   />
                 </div>
              </div>

              <div className="flex justify-center -my-10 relative z-20">
                 <button className="w-12 h-12 bg-blue-600 text-white border-4 border-white rounded-2xl flex items-center justify-center hover:rotate-180 active:scale-90 transition-all duration-500 shadow-xl shadow-blue-500/20">
                    <Repeat className="w-6 h-6" />
                 </button>
              </div>

              {/* TO */}
              <div className="bg-[#e9ecef]/50 border border-white/5 p-6 rounded-[2rem]">
                 <div className="flex justify-between items-center mb-6 px-1">
                    <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">To</span>
                    <span className="text-[10px] font-bold text-gray-500 italic">1 {fromCurrency} ≈ {exchangeRate} {toCurrency}</span>
                 </div>
                 <div className="flex items-center gap-4">
                   <div className="flex items-center gap-3 bg-[#f8f9fa] px-4 py-2 rounded-xl group cursor-pointer hover:bg-[#e9ecef] transition-colors max-w-[140px]">
                      <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-gray-700 font-black text-[10px]">
                        {selectedTo?.icon_url ? <img src={selectedTo.icon_url} alt="" className="w-full h-full object-cover" /> : toCurrency[0]}
                      </div>
                      <select 
                        value={toCurrency}
                        onChange={(e) => setToCurrency(e.target.value)}
                        className="bg-transparent font-black text-lg outline-none cursor-pointer appearance-none text-slate-900 pr-2 flex-1"
                      >
                         {currencies.map(c => <option key={c.id} value={c.symbol} className="bg-white">{c.symbol}</option>)}
                      </select>
                   </div>
                   <input
                     type="number"
                     placeholder="0.00"
                     value={toAmount}
                     onChange={handleToAmountChange}
                     className="flex-1 bg-transparent text-right text-3xl font-black outline-none text-slate-900 placeholder-gray-300"
                   />
                 </div>
              </div>
           </div>

           <div className="mt-12 space-y-4">
              <div className="bg-[#e9ecef]/30 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#FF8A00]" />
                    <span className="text-[10px] font-black uppercase text-gray-500">No Slippage Guarantee</span>
                 </div>
                 <Zap className="w-4 h-4 text-[#2563eb]" />
              </div>

              <button
                onClick={() => {
                  onSwap({
                    type: 'swap',
                    fromAmount,
                    fromCurrency,
                    fromCurrencyId: selectedFrom?.id,
                    fromCurrencyIcon: selectedFrom?.icon_url,
                    toAmount,
                    toCurrency,
                    toCurrencyId: selectedTo?.id,
                    toCurrencyIcon: selectedTo?.icon_url,
                  });
                }}
                disabled={!fromAmount || parseFloat(fromAmount) === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl shadow-blue-500/20 transition-all flex items-center justify-center gap-4 group disabled:opacity-30 active:scale-95"
              >
                <span>Convert Now</span>
                <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SwapCrypto;

import React, { useState, useEffect } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
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
      
      // 1. Fetch Currencies
      const { data: currData } = await getCurrencies();
      if (currData) {
        setCurrencies(currData);
        if (currData.length > 0) {
           // Default to first two if not set, or keep defaults
           // For now, let's try to find USDT and BTC, or fallback
           const hasUSDT = currData.find(c => c.symbol === 'USDT');
           const hasBTC = currData.find(c => c.symbol === 'BTC');
           if (hasUSDT) setFromCurrency(hasUSDT.symbol);
           if (hasBTC) setToCurrency(hasBTC.symbol);
        }
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
    // If it's a stablecoin, force 1 USD (optional but good for UX)
    if (['USDT', 'USDC'].includes(symbol)) return 1;

    // Crypto prices from DB
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
      // Calculate: (Amount * FromPrice) / ToPrice
      const converted = (parseFloat(value) * fromPrice) / toPrice;
      setToAmount(converted.toFixed(6));
    }
  };

  const handleToAmountChange = (e) => {
    const value = e.target.value;
    setToAmount(value);

    // If user types in "Receive", calculate "Send"
    // Send = (Receive * ToPrice) / FromPrice
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

  // Recalculate when currency changes
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
  
  // Simple mock matching for icons/colors based on loaded currencies
  const getCurrencyIcon = (symbol) => {
    const curr = currencies.find(c => c.symbol === symbol);
    return curr?.icon_url ? <img src={curr.icon_url} alt="" className="w-full h-full object-cover rounded-full" /> : (curr?.symbol?.[0] || symbol?.[0]);
  };
  
  const getCurrencyColor = (symbol) => {
     // fallback color logic or use data from DB if stored
     return "bg-blue-500"; 
  };

  if (loading) {
     return (
       <div className="min-h-screen bg-white flex items-center justify-center">
         <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
       </div>
     );
  }

  return (
    <div className="min-h-screen bg-white animate-fade-in pb-24">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <button onClick={onBack} className="mb-8 p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-4xl font-black mb-2 tracking-tight">Swap Assets</h1>
          <p className="text-blue-200 font-medium">Instant conversion with zero slippage</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8">
        <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-xl p-1.5 flex border border-gray-100 mb-8 sm:mb-12 max-w-md mx-auto">
          <button onClick={() => onNavigate("buy")} className="flex-1 py-3 sm:py-4 rounded-[1.2rem] sm:rounded-[1.5rem] text-gray-500 font-bold hover:bg-gray-50 transition-all text-sm sm:text-base">
            Buy/Sell
          </button>
          <button className="flex-1 py-3 sm:py-4 rounded-[1.2rem] sm:rounded-[1.5rem] bg-blue-600 text-white font-black shadow-lg shadow-blue-100 text-sm sm:text-base">
            Swap
          </button>
        </div>

        <div className="max-w-3xl mx-auto bg-gray-50 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 lg:p-12 border border-gray-100 shadow-sm">
          <div className="mb-8 sm:mb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4 px-2 text-sm sm:text-base">
              <label className="text-gray-400 font-black uppercase text-[10px] sm:text-xs tracking-widest">Swap From</label>
              <div className="text-blue-600 font-bold text-[10px] sm:text-xs bg-blue-50 px-3 py-1 rounded-full">
                Max: {currentBalance.toLocaleString()} {fromCurrency}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 bg-white rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 shadow-sm border border-gray-100 focus-within:border-blue-300 transition-all">
              <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100 w-full sm:w-auto">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-black text-xs shrink-0 overflow-hidden">
                  {getCurrencyIcon(fromCurrency)}
                </div>
                <select 
                  value={fromCurrency}
                  onChange={handleFromChange}
                  className="bg-transparent font-black text-lg outline-none cursor-pointer flex-1 sm:flex-none"
                >
                  {currencies.map(c => <option key={c.id} value={c.symbol}>{c.symbol}</option>)}
                </select>
              </div>
              <input
                type="number"
                placeholder="0.00"
                value={fromAmount}
                onChange={handleFromAmountChange}
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

          <div className="mt-10 sm:mt-14 mb-8 sm:mb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4 px-2">
              <label className="text-gray-400 font-black uppercase text-[10px] sm:text-xs tracking-widest">Swap To</label>
              <div className="text-gray-400 font-bold text-[10px] sm:text-xs bg-gray-100 px-3 py-1 rounded-full">
                Est. Price: 1 {fromCurrency} ≈ {exchangeRate} {toCurrency}
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
                value={toAmount}
                onChange={handleToAmountChange}
                className="flex-1 bg-transparent text-left sm:text-right text-2xl sm:text-3xl font-black outline-none text-gray-900 placeholder-gray-200 min-w-0"
              />
            </div>
          </div>

          <button className="w-full mb-6 sm:mb-8 border-2 border-dashed border-gray-200 text-gray-500 py-4 sm:py-5 rounded-[1.5rem] sm:rounded-[2rem] font-bold hover:border-blue-300 hover:text-blue-600 transition-all flex items-center justify-between px-6 sm:px-8 group text-sm sm:text-base">
            <span>Add refund address</span>
            <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => {
              const fromCurrObj = currencies.find(c => c.symbol === fromCurrency);
              const toCurrObj = currencies.find(c => c.symbol === toCurrency);
              
              onSwap({
                type: 'swap',
                fromAmount,
                fromCurrency,
                fromCurrencyId: fromCurrObj?.id,
                fromCurrencyIcon: fromCurrObj?.icon_url,
                toAmount,
                toCurrency,
                toCurrencyId: toCurrObj?.id,
                toCurrencyIcon: toCurrObj?.icon_url,
              });
            }}
            className="w-full bg-[#0063BF] hover:bg-blue-700 text-white py-5 sm:py-6 rounded-[1.5rem] sm:rounded-[2rem] font-black text-lg sm:text-xl shadow-2xl shadow-blue-200 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-4 group"
          >
            <span>Preview Swap</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-2 transition-transform">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwapCrypto;

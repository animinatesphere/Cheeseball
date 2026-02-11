import React, { useState, useEffect } from "react";
import { ArrowLeft, TrendingUp, ShoppingCart, Clock, User, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { getCurrencies, getUserPortfolio } from "../../lib/api";

const BuyCryptocurrency = ({ onBack, onExchange, onNavigate }) => {
  const [sendAmount, setSendAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [currencies, setCurrencies] = useState([]);
  const [portfolio, setPortfolio] = useState({});
  const [fromCurrency, setFromCurrency] = useState("NGN");
  const [toCurrency, setToCurrency] = useState("BTC");
  const [loading, setLoading] = useState(true);

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
      // Calculate: (Amount * FromPrice) / ToPrice
      const converted = (parseFloat(value) * fromPrice) / toPrice;
      // Format to appropriate decimals (2 for fiat, 6 for crypto)
      const decimals = ['NGN', 'USD', 'EUR', 'GBP'].includes(toCurrency) ? 2 : 6;
      setReceiveAmount(converted.toFixed(decimals));
    }
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
        // Trigger generic calculation based on sendAmount
        const fromPrice = getPrice(fromCurrency);
        const toPrice = getPrice(toCurrency);
        if (fromPrice && toPrice) {
            const converted = (parseFloat(sendAmount) * fromPrice) / toPrice;
            const decimals = ['NGN', 'USD', 'EUR', 'GBP'].includes(toCurrency) ? 2 : 6;
            setReceiveAmount(converted.toFixed(decimals));
        }
    }
  }, [fromCurrency, toCurrency, currencies]);


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
          <h1 className="text-4xl font-black mb-2 tracking-tight">Trade Crypto</h1>
          <p className="text-blue-200 font-medium">Fast, secure cryptocurrency exchange</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8">
        <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-xl p-1.5 flex border border-gray-100 mb-8 sm:mb-12 max-w-md mx-auto">
          <button className="flex-1 py-3 sm:py-4 rounded-[1.2rem] sm:rounded-[1.5rem] bg-blue-600 text-white font-black shadow-lg shadow-blue-100 text-sm sm:text-base">
            Buy/Sell
          </button>
          <button onClick={() => onNavigate("swap")} className="flex-1 py-3 sm:py-4 rounded-[1.2rem] sm:rounded-[1.5rem] text-gray-500 font-bold hover:bg-gray-50 transition-all text-sm sm:text-base">
            Swap
          </button>
        </div>

        <div className="max-w-3xl mx-auto bg-gray-50 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 lg:p-12 border border-gray-100 shadow-sm text-sm sm:text-base">
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

          <button
            onClick={() => {
              const toCurrObj = currencies.find(c => c.symbol === toCurrency);
              // Fiat doesn't have an ID in our currencies table typically, so we pass null or check currencies
              // If we added NGN to currencies table, we could find it. For now assume null or try find.
              const fromCurrObj = currencies.find(c => c.symbol === fromCurrency);

              onExchange({
                type: 'buy',
                fromAmount: sendAmount,
                fromCurrency: fromCurrency,
                fromCurrencyId: fromCurrObj?.id || null, // Allow null for Fiat if not in DB
                toAmount: receiveAmount,
                toCurrency: toCurrency,
                toCurrencyId: toCurrObj?.id,
                toCurrencyIcon: toCurrObj?.icon_url,
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

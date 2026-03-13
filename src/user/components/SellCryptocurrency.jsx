import React, { useState, useEffect } from "react";
import { ArrowLeft, Loader2, TrendingUp } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { getCurrencies, getUserPortfolio } from "../../lib/api";

const SellCryptocurrency = ({ onBack, onExchange, onNavigate }) => {
  const [sendAmount, setSendAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [currencies, setCurrencies] = useState([]);
  const [portfolio, setPortfolio] = useState({});
  const [fromCurrency, setFromCurrency] = useState("BTC");
  const [toCurrency, setToCurrency] = useState("NGN");
  const [loading, setLoading] = useState(true);

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
       setReceiveAmount((parseFloat(val) * rate).toFixed(2));
    } else {
       setReceiveAmount("");
    }
  };

  // Update receiveAmount when fromCurrency changes
  useEffect(() => {
    handleAmountChange(sendAmount);
  }, [fromCurrency, sendAmount]);


  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-red-600" /></div>;

  return (
    <div className="min-h-screen bg-white animate-fade-in pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col gap-8">
            <button onClick={onBack} className="w-fit p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10 uppercase text-[10px] sm:text-xs font-black tracking-widest leading-none">
                <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl sm:text-5xl font-black mb-2 tracking-tight">Sell Crypto</h1>
              <p className="text-blue-200 text-sm sm:text-lg font-medium">Instantly convert your assets to local currency</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8">
        <div className="max-w-3xl mx-auto bg-gray-50 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 lg:p-14 border border-gray-100 shadow-2xl relative overflow-hidden group">
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

            {/* Receive Card */}
            <div>
              <div className="flex justify-between items-center mb-4 px-2">
                <label className="text-gray-400 font-black uppercase text-[10px] sm:text-xs tracking-widest">You Get</label>
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
                rate: SELL_RATES[fromCurrency]
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

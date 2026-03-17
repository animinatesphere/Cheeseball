import React, { useState, useEffect } from "react";
import {
  Bell,
  TrendingUp,
  TrendingDown,
  Search,
  Loader2,
  Filter,
  ArrowUpRight,
  ChevronRight,
  Globe,
  Wallet
} from "lucide-react";
import { getCurrencies } from "../../lib/api";

const CurrencyRates = ({ onSelectCurrency, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrencies = async () => {
      setLoading(true);
      const { data } = await getCurrencies();
      if (data) {
        const mappedCurrencies = data.map(c => ({
          id: c.id,
          symbol: c.symbol,
          name: c.name,
          price: `₦${Number(c.price).toLocaleString()}`,
          change: c.change_24h,
          positive: c.is_positive,
          icon: c.icon_url || null,
          colorClass: c.color_class || 'bg-blue-600'
        }));
        setCurrencies(mappedCurrencies);
      }
      setLoading(false);
    };

    fetchCurrencies();
  }, []);

  const filteredCurrencies = currencies.filter(c => 
    c.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05070a]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-blue-500 font-bold text-[10px] uppercase tracking-widest">Live</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070a] text-white selection:bg-blue-500/30">
      {/* Premium Mesh Gradient Header */}
      <div className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-8">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -mr-48 -mt-48 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px] -ml-24 -mb-24"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex justify-between items-end mb-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping"></span>
                Global Markets
              </div>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tighter leading-none mb-2 bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent">
                Market
              </h1>
              <p className="text-gray-400 font-medium text-sm sm:text-base">Track and trade your favorite digital assets in real-time.</p>
            </div>
            <button
              onClick={() => onNavigate("alert-rates")}
              className="group p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-blue-600/10 hover:border-blue-500/30 transition-all active:scale-95"
            >
              <Bell className="w-6 h-6 text-gray-400 group-hover:text-blue-400 transition-colors" />
            </button>
          </div>

          {/* Integrated Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="text"
                placeholder="Search by asset name or symbol..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm sm:text-base font-medium outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all placeholder:text-gray-600"
              />
            </div>
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === "all" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                All Assets
              </button>
              <button
                onClick={() => setActiveTab("favorites")}
                className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === "favorites" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                Favorites
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-8 pb-32">
        {/* Market Stats Bar (Optional, for flavor) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
           {[
             { label: "Market Cap", value: "₦1.2T", icon: Globe, color: "text-blue-400" },
             { label: "24h Volume", value: "₦45.8B", icon: TrendingUp, color: "text-emerald-400" },
             { label: "Top Gainer", value: "SOL +8.4%", icon: ArrowUpRight, color: "text-cyan-400" },
             { label: "Assets", value: currencies.length.toString(), icon: Wallet, color: "text-indigo-400" }
           ].map((stat, i) => (
             <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-5 hover:bg-white/[0.07] transition-all">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">{stat.label}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black">{stat.value}</span>
                  <stat.icon className={`w-5 h-5 ${stat.color} opacity-40`} />
                </div>
             </div>
           ))}
        </div>

        {/* Assets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCurrencies.map((currency) => (
            <div
              key={currency.id}
              onClick={() => onSelectCurrency(currency)}
              className="group relative bg-[#0d1117] border border-white/5 rounded-[2rem] p-6 cursor-pointer hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 overflow-hidden"
            >
              {/* Card Glow Effect */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110 group-hover:rotate-6 overflow-hidden ${currency.colorClass || 'bg-blue-600'}`}>
                    {currency.icon ? (
                      <img src={currency.icon} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-black text-white">{currency.symbol[0]}</span>
                    )}
                  </div>
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${
                    currency.positive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                  }`}>
                    {currency.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {currency.change}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-2xl font-black group-hover:text-blue-400 transition-colors">
                    {currency.symbol}
                  </h3>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{currency.name}</p>
                </div>

                <div className="mt-auto flex items-end justify-between">
                  <div>
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block mb-1">Buy Price</span>
                    <span className="text-2xl font-light tracking-tight tabular-nums">
                      {currency.price}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-all duration-300">
                    <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCurrencies.length === 0 && (
          <div className="py-20 text-center bg-white/5 border border-white/10 border-dashed rounded-[3rem]">
            <Search className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-black mb-2">No results found</h3>
            <p className="text-gray-500 font-medium">Try searching for a different asset or symbol.</p>
          </div>
        )}
      </div>

      {/* Modern Gradient Styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.1); }
        }
        .animate-pulse { animation: pulse 8s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default CurrencyRates;

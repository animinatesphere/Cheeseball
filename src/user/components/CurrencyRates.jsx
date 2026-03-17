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
  Wallet,
  Zap,
  LayoutGrid,
  Users,
  Coins,
  ShieldCheck,
  Megaphone,
  CreditCard,
  UserPlus,
  Repeat,
  Download
} from "lucide-react";
import { getCurrencies } from "../../lib/api";

const CurrencyRates = ({ onSelectCurrency, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("hot");
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newsIndex, setNewsIndex] = useState(0);

  const news = [
    "New Listing: CHEESE is now available for trading!",
    "Launchpad: Stake USDT to earn 150% APR on new project tokens.",
    "ByVotes: Vote for your favorite project to be listed next.",
    "Security: 100% Reserve Proof updated. Your assets are SAFU."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setNewsIndex((prev) => (prev + 1) % news.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchCurrencies = async () => {
      setLoading(true);
      const { data } = await getCurrencies();
      if (data) {
        const activeOnly = data.filter(c => c.is_active);
        const mappedCurrencies = activeOnly.map(c => ({
          id: c.id,
          symbol: c.symbol,
          name: c.name,
          price: `₦${Number(c.price).toLocaleString()}`,
          rawPrice: Number(c.price),
          change: c.change_24h,
          rawChange: parseFloat(c.change_24h) || 0,
          positive: c.is_positive,
          icon: c.icon_url || null,
          colorClass: c.color_class || 'bg-blue-600',
          volume: "₦" + (Math.random() * 1000).toFixed(1) + "M" // Mock volume
        }));
        setCurrencies(mappedCurrencies);
      }
      setLoading(false);
    };

    fetchCurrencies();
  }, []);

  const getFilteredCurrencies = () => {
    let filtered = currencies.filter(c => 
      c.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (activeTab) {
      case "gainers":
        return [...filtered].sort((a, b) => b.rawChange - a.rawChange);
      case "volume":
        return filtered; // Standard sorting for now
      case "new":
        return [...filtered].reverse();
      case "hot":
      default:
        return filtered;
    }
  };

  const filteredCurrencies = getFilteredCurrencies();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0E11]">
        <div className="w-12 h-12 border-4 border-[#FFB11A]/20 border-t-[#FFB11A] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-[#EAECEF] selection:bg-[#FFB11A]/30 pb-32">
      
      {/* 1. Bybit-style Announcement Bar */}
      <div className="bg-[#181A20] py-2 px-4 border-b border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Megaphone className="w-4 h-4 text-[#FFB11A] shrink-0" />
          <div className="relative h-5 flex-1 overflow-hidden">
            {news.map((item, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-transform duration-500 ease-in-out flex items-center`}
                style={{ transform: `translateY(${(i - newsIndex) * 100}%)` }}
              >
                <span className="text-xs font-medium text-gray-400 truncate">{item}</span>
              </div>
            ))}
          </div>
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </div>
      </div>

      {/* 2. Premium Promo Banners (CSS Gradients) */}
      <div className="px-4 pt-6 pb-2 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex gap-4 min-w-max">
          <div onClick={() => onNavigate('buy')} className="w-[300px] h-40 rounded-2xl p-6 relative overflow-hidden group cursor-pointer bg-gradient-to-br from-[#1E2329] to-[#0B0E11] border border-white/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFB11A]/10 rounded-full blur-2xl -mr-12 -mt-12"></div>
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <h4 className="text-xl font-black leading-tight text-white italic">Double Your<br/>Rewards</h4>
                <p className="text-[10px] uppercase font-black text-[#FFB11A] mt-2 tracking-widest">Launchpad Live</p>
              </div>
              <button className="bg-[#FFB11A] text-black text-[10px] font-black px-4 py-2 rounded-lg w-fit uppercase tracking-tighter">Participate</button>
            </div>
            <Coins className="absolute bottom-4 right-4 w-20 h-20 text-[#FFB11A]/10 rotate-12" />
          </div>

          <div onClick={() => onNavigate('swap')} className="w-[300px] h-40 rounded-2xl p-6 relative overflow-hidden group cursor-pointer bg-gradient-to-br from-[#2B3139] to-[#1E2329] border border-white/5">
             <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <h4 className="text-xl font-black leading-tight text-white italic">Zero Fee<br/>Trading</h4>
                <p className="text-[10px] uppercase font-black text-blue-400 mt-2 tracking-widest">Limited Offer</p>
              </div>
              <button className="bg-white/10 backdrop-blur-md text-white border border-white/10 text-[10px] font-black px-4 py-2 rounded-lg w-fit uppercase tracking-tighter">Trade Now</button>
            </div>
            <Zap className="absolute bottom-4 right-4 w-20 h-20 text-blue-500/10 -rotate-12" />
          </div>
          
          <div onClick={() => onNavigate('support')} className="w-[300px] h-40 rounded-2xl p-6 relative overflow-hidden group cursor-pointer bg-[#000000] border border-white/5">
             <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <h4 className="text-xl font-black leading-tight text-white italic">Invite &<br/>Earn $50</h4>
                <p className="text-[10px] uppercase font-black text-emerald-400 mt-2 tracking-widest">Referral Hub</p>
              </div>
              <button className="bg-emerald-500 text-black text-[10px] font-black px-4 py-2 rounded-lg w-fit uppercase tracking-tighter">Copy Link</button>
            </div>
            <Users className="absolute bottom-4 right-4 w-20 h-20 text-emerald-500/10" />
          </div>
        </div>
      </div>

      {/* 3. Bybit Quick Actions Grid */}
      <div className="px-4 py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-4 sm:grid-cols-5 gap-y-8 gap-x-2">
          {[
            { label: "Deposit", icon: LayoutGrid, color: "text-[#FFB11A]", bg: "bg-[#FFB11A]/10", page: "buy" },
            { label: "Buy Crypto", icon: CreditCard, color: "text-blue-400", bg: "bg-blue-400/10", page: "buy" },
            { label: "P2P Trading", icon: Users, color: "text-purple-400", bg: "bg-purple-400/10", page: "buy" },
            { label: "Convert", icon: Repeat, color: "text-pink-400", bg: "bg-pink-400/10", page: "swap" },
            { label: "Earn", icon: Coins, color: "text-orange-400", bg: "bg-orange-400/10", page: "support" }
          ].map((action, i) => (
            <button key={i} onClick={() => onNavigate(action.page)} className="flex flex-col items-center gap-2 group">
              <div className={`w-12 h-12 ${action.bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <action.icon className={`w-6 h-6 ${action.color}`} />
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter group-hover:text-white transition-colors">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-4">
        {/* 4. Tabbed Filter System */}
        <div className="flex border-b border-white/5 mb-6 overflow-x-auto no-scrollbar">
          {[
            { id: "hot", label: "Hot" },
            { id: "gainers", label: "Gainers" },
            { id: "new", label: "New" },
            { id: "volume", label: "24h Vol" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-sm font-black uppercase tracking-widest relative transition-colors whitespace-nowrap ${
                activeTab === tab.id ? "text-[#FFB11A]" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-[#FFB11A] shadow-[0_0_8px_rgba(255,177,26,0.5)]"></div>
              )}
            </button>
          ))}
        </div>

        {/* 5. Asset Search */}
        <div className="mb-8 px-2 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#FFB11A] transition-colors" />
          <input
            type="text"
            placeholder="Search Coin"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1e2329]/50 border border-transparent focus:border-[#FFB11A]/30 focus:bg-[#1e2329] py-3 pl-12 pr-6 rounded-xl text-sm font-bold outline-none transition-all"
          />
        </div>

        {/* 6. High-Density Asset List (Exchange Style) */}
        <div className="space-y-1">
          {/* Table Header */}
          <div className="flex px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-600">
             <div className="w-[45%]">Asset / Vol</div>
             <div className="w-[30%] text-right">Price</div>
             <div className="w-[25%] text-right">24h Chg</div>
          </div>

          {filteredCurrencies.map((currency) => (
            <div
              key={currency.id}
              onClick={() => onSelectCurrency(currency)}
              className="flex items-center px-4 py-5 hover:bg-white/[0.02] active:bg-white/[0.04] transition-colors cursor-pointer group rounded-xl"
            >
              <div className="w-[45%] flex items-center gap-3">
                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-black/40 overflow-hidden ${currency.colorClass || 'bg-blue-600'}`}>
                    {currency.icon ? <img src={currency.icon} alt="" className="w-full h-full object-cover" /> : currency.symbol[0]}
                 </div>
                 <div className="min-w-0">
                    <div className="text-sm font-black leading-none mb-1 text-white group-hover:text-[#FFB11A] transition-colors">{currency.symbol}</div>
                    <div className="text-[10px] font-bold text-gray-600 truncate">{currency.volume}</div>
                 </div>
              </div>

              <div className="w-[30%] text-right">
                <div className="text-sm font-black text-white tabular-nums leading-none mb-1">{currency.price}</div>
                <div className="text-[10px] font-bold text-gray-600">≈ $...</div>
              </div>

              <div className="w-[25%] flex justify-end">
                <div className={`min-w-[70px] py-2 px-1 rounded-lg text-[11px] font-black text-center tabular-nums transition-colors ${
                  currency.positive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                }`}>
                  {currency.change}
                </div>
              </div>
            </div>
          ))}

          {filteredCurrencies.length === 0 && (
            <div className="py-20 text-center">
              <LayoutGrid className="w-12 h-12 text-gray-800 mx-auto mb-4 opacity-20" />
              <p className="text-gray-500 font-black text-xs uppercase tracking-widest">No matching assets</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default CurrencyRates;

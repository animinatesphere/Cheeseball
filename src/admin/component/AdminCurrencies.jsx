import React, { useState, useEffect } from "react";
import { Search, Plus, ArrowLeft, Loader2, RefreshCcw, TrendingUp, TrendingDown, Globe, Zap } from "lucide-react";
import { getCurrencies, createCurrency, updateCurrency } from "../../lib/api";
import { fetchTopCurrencies } from "../../utils/cryptoApi";

const AdminCurrencies = ({ onAddCurrency, onBack }) => {
  const [activeView, setActiveView] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchCurrencies = async () => {
    setLoading(true);
    try {
      const { data } = await getCurrencies();
      if (data) setCurrencies(data);
    } catch (err) {
      console.error("Fetch currencies failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const handleSyncData = async () => {
    setSyncing(true);
    try {
        const topCoins = await fetchTopCurrencies(50);
        for (const coin of topCoins) {
            const existing = currencies.find(c => c.symbol === coin.symbol.toUpperCase());
            const currencyData = {
                name: coin.name,
                symbol: coin.symbol.toUpperCase(),
                price: coin.current_price,
                change_24h: (coin.price_change_percentage_24h > 0 ? '+' : '') + coin.price_change_percentage_24h.toFixed(2) + '%',
                is_positive: coin.price_change_percentage_24h >= 0,
                icon_url: coin.image,
                is_active: true,
                color_class: existing?.color_class || (coin.price_change_percentage_24h >= 0 ? 'bg-emerald-500' : 'bg-red-500') 
            };
            if (existing) {
                await updateCurrency(existing.id, currencyData);
            } else {
                await createCurrency(currencyData);
            }
        }
        await fetchCurrencies();
    } catch (err) {
        console.error("Sync failed", err);
        alert("Failed to sync data. Please try again.");
    } finally {
        setSyncing(false);
    }
  };

  const MiniChart = ({ positive }) => (
    <svg width="60" height="24" viewBox="0 0 60 24" className="group-hover:scale-110 transition-transform">
      <path
        d="M0,18 Q10,14 20,12 T40,10 T60,6"
        fill="none"
        stroke={positive ? "#10b981" : "#ef4444"}
        strokeWidth="3"
        strokeLinecap="round"
        className="drop-shadow-[0_0_5px_currentColor]"
      />
    </svg>
  );

  const filteredCurrencies = currencies.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesView = activeView === "all" ? true : c.is_active;
    return matchesSearch && matchesView;
  });

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full" style={{ background: 'var(--bg-primary)' }}>
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-32 animate-fade-in" style={{ background: 'var(--bg-primary)' }}>
      {/* Sticky Premium Header */}
      <div className="sticky top-0 z-20 border-b" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-primary)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between py-8 sm:py-10 gap-6">
            <div className="flex items-center gap-4 sm:gap-6">
              <button onClick={onBack} className="p-3 sm:p-4 btn-ghost rounded-xl sm:rounded-2xl group active:scale-95">
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-1 transition-transform" />
              </button>
              <div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tighter" style={{ color: 'var(--text-primary)' }}>Market</h1>
                <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mt-1">Live Asset Management</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 sm:gap-4">
                 <button
                  onClick={handleSyncData}
                  disabled={syncing}
                  className="btn-ghost flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl disabled:opacity-50 group active:scale-95"
                >
                  {syncing ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : <RefreshCcw className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-180 transition-transform" />}
                  <span className="font-extrabold text-[10px] sm:text-sm uppercase tracking-widest" style={{ color: 'var(--text-primary)' }}>Sync Market</span>
                </button>
                
                <button
                  onClick={onAddCurrency}
                  className="btn-primary flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl group active:scale-95"
                >
                  <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="hidden sm:inline">Add Asset</span>
                </button>
            </div>
          </div>

          <div className="pb-8 flex flex-col sm:flex-row gap-6">
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Search global markets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-14"
              />
            </div>

            <div className="flex bg-gray-100/50 dark:bg-gray-800/30 p-1 rounded-2xl sm:w-auto self-start">
              <button
                onClick={() => setActiveView("active")}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeView === "active" ? "bg-white dark:bg-gray-700 text-blue-600 shadow-lg" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Enabled
              </button>
              <button
                onClick={() => setActiveView("all")}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeView === "all" ? "bg-white dark:bg-gray-700 text-blue-600 shadow-lg" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Archived
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCurrencies.map((currency) => (
            <div
              key={currency.id}
              className="card p-6 flex items-center gap-6 animate-fade-in relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-blue-500/10 transition-all"></div>
              
              <div className="relative">
                <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center text-white font-black text-2xl shadow-xl transition-transform group-hover:scale-110 group-hover:rotate-6 overflow-hidden ${currency.color_class || 'bg-blue-600'}`}>
                  {currency.icon_url ? <img src={currency.icon_url} alt="" className="w-full h-full object-cover" /> : (currency.symbol ? currency.symbol[0] : '$')}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-lg flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-lg ${currency.is_active ? 'bg-emerald-500' : 'bg-gray-400'}`}>
                   {currency.is_active ? <Zap className="w-3 h-3 text-white" /> : <Shield className="w-3 h-3 text-white" />}
                </div>
              </div>

              <div className="flex-1 min-w-0 relative z-10">
                <div className="font-extrabold text-xl truncate leading-tight" style={{ color: 'var(--text-primary)' }}>
                  {currency.name}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>{currency.symbol}</span>
                  {currency.is_positive ? <TrendingUp className="w-3 h-3 text-emerald-500" /> : <TrendingDown className="w-3 h-3 text-red-500" />}
                </div>
              </div>
              
              <div className="text-right relative z-10">
                <div className="font-black text-lg tabular-nums" style={{ color: 'var(--text-primary)' }}>
                  ${Number(currency.price).toLocaleString()}
                </div>
                <div className="flex flex-col items-end gap-1 mt-1">
                   <MiniChart positive={currency.is_positive} />
                   <span className={`text-[10px] font-black tabular-nums transition-colors ${currency.is_positive ? "text-emerald-500" : "text-red-500"}`}>
                    {currency.change_24h}
                  </span>
                </div>
              </div>

              {activeView === "all" && (
                <div className="pl-4 ml-4 border-l transition-colors" style={{ borderColor: 'var(--border-primary)' }}>
                  <label className="relative inline-flex items-center cursor-pointer group/toggle">
                    <input type="checkbox" className="sr-only peer" defaultChecked={currency.is_active} />
                    <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 shadow-inner"></div>
                  </label>
                </div>
              )}
            </div>
          ))}

          {filteredCurrencies.length === 0 && (
             <div className="col-span-full py-24 text-center card border-dashed border-2">
                <Globe className="w-16 h-16 text-gray-200 mx-auto mb-6 animate-pulse" />
                <h3 className="text-xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>No Market Results</h3>
                <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>No records found for that search query.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCurrencies;

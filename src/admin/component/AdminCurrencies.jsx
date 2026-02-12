import React, { useState, useEffect } from "react";
import { Search, Plus, ArrowLeft, Loader2 } from "lucide-react";
import { getCurrencies, createCurrency, updateCurrency } from "../../lib/api"; // Ensure updateCurrency is imported
import { fetchTopCurrencies } from "../../utils/cryptoApi"; // Import the utility

const AdminCurrencies = ({ onAddCurrency, onBack }) => {
  const [activeView, setActiveView] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false); // State for sync loading

  const fetchCurrencies = async () => {
    setLoading(true);
    const { data } = await getCurrencies();
    if (data) {
      setCurrencies(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const handleSyncData = async () => {
    setSyncing(true);
    try {
        const topCoins = await fetchTopCurrencies(50);
        
        // Upsert logic (simplistic: check if exists, then update or insert)
        // Ideally use supabase upsert if constraint exists on symbol/name
        // For now, let's just loop and update/insert
        
        for (const coin of topCoins) {
            // Check if currency exists by symbol
            const existing = currencies.find(c => c.symbol === coin.symbol.toUpperCase());
            
            const currencyData = {
                name: coin.name,
                symbol: coin.symbol.toUpperCase(),
                price: coin.current_price,
                change_24h: (coin.price_change_percentage_24h > 0 ? '+' : '') + coin.price_change_percentage_24h.toFixed(2) + '%',
                is_positive: coin.price_change_percentage_24h >= 0,
                icon_url: coin.image,
                is_active: true,
                // Assign a color class loosely based on change or random? Keeping existing logic or default
                color_class: existing?.color_class || (coin.price_change_percentage_24h >= 0 ? 'bg-green-500' : 'bg-red-500') 
            };

            if (existing) {
                await updateCurrency(existing.id, currencyData);
            } else {
                await createCurrency(currencyData);
            }
        }
        
        // Refresh list
        await fetchCurrencies();

    } catch (err) {
        console.error("Sync failed", err);
        alert("Failed to sync data. Please try again.");
    } finally {
        setSyncing(false);
    }
  };


  const MiniChart = ({ positive }) => (
    <svg width="60" height="24" viewBox="0 0 60 24" className="opacity-60">
      <path
        d="M0,18 Q10,14 20,12 T40,10 T60,6"
        fill="none"
        stroke={positive ? "#22C55E" : "#EF4444"}
        strokeWidth="2.5"
        strokeLinecap="round"
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
      <div className="flex-1 flex items-center justify-center h-full">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-32 animate-fade-in">
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="p-2.5 hover:bg-gray-100 rounded-xl transition-all active:scale-95">
                <ArrowLeft className="w-6 h-6 text-gray-900" />
              </button>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Market Assets</h1>
            </div>
            
            <div className="flex items-center gap-3">
                 <button
                  onClick={handleSyncData}
                  disabled={syncing}
                  className="bg-gray-900 text-white p-3 rounded-xl shadow-lg hover:bg-gray-800 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {syncing ? <Loader2 className="w-5 h-5 animate-spin" /> : <div className="w-5 h-5 flex items-center justify-center font-bold">↻</div>}
                  <span className="hidden sm:inline font-black uppercase text-[10px] tracking-widest px-1">Sync Data</span>
                </button>
                
                <button
                  onClick={onAddCurrency}
                  className="bg-blue-600 text-white p-3 rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline font-black uppercase text-[10px] tracking-widest px-1">Add New</span>
                </button>
            </div>
          </div>

          <div className="pb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search global assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-gray-50 rounded-[1.5rem] border-2 border-transparent focus:border-blue-100 focus:bg-white outline-none transition-all font-bold text-gray-900 shadow-inner"
              />
            </div>

            <div className="flex gap-2 p-1.5 bg-gray-50 rounded-2xl sm:w-auto">
              <button
                onClick={() => setActiveView("active")}
                className={`px-6 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${
                  activeView === "active" ? "bg-white text-blue-600 shadow-md" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setActiveView("all")}
                className={`px-6 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${
                  activeView === "all" ? "bg-white text-blue-600 shadow-md" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Global List
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredCurrencies.map((currency) => (
            <div
              key={currency.id}
              className="bg-white rounded-[2rem] p-5 flex items-center gap-5 hover:shadow-2xl hover:border-blue-100 transition-all border border-gray-50 group cursor-pointer"
            >
              <div
                className={`w-14 h-14 ${currency.color_class || 'bg-blue-500'} rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shrink-0 group-hover:scale-110 transition-transform`}
              >
                {currency.symbol ? currency.symbol[0] : '$'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-black text-lg text-gray-900 leading-tight truncate">
                  {currency.name}
                </div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {currency.symbol}
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-black text-gray-900 tabular-nums">
                  ${currency.price}
                </div>
                <div className="flex items-center justify-end gap-2 mt-0.5">
                   <MiniChart positive={currency.is_positive} />
                   <span className={`text-[10px] font-black uppercase ${currency.is_positive ? "text-green-500" : "text-red-500"}`}>
                    {currency.change_24h}
                  </span>
                </div>
              </div>

              {activeView === "all" && (
                <div className="pl-2 ml-2 border-l border-gray-100">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={currency.is_active} />
                    <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              )}
            </div>
          ))}
          {filteredCurrencies.length === 0 && (
             <div className="col-span-full text-center py-12 text-gray-400 font-bold">
                No assets found matching your criteria.
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCurrencies;

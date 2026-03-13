import React, { useState, useEffect } from "react";
import {
  Bell,
  TrendingUp,
  TrendingDown,
  Search,
  Loader2,
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
          name: c.symbol,
          fullName: c.name,
          price: `$${Number(c.price).toLocaleString()}`,
          change: c.change_24h,
          positive: c.is_positive,
          icon: c.symbol ? c.symbol[0] : '$',
          colorClass: c.color_class || 'bg-gray-100'
        }));
        setCurrencies(mappedCurrencies);
      }
      setLoading(false);
    };

    fetchCurrencies();
  }, []);

  const filteredCurrencies = currencies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
     return (
       <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
         <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
       </div>
     );
  }

  return (
    <div className="min-h-screen animate-fade-in" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="relative overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl translate-x-1/4 translate-y-1/4"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Market
              </h1>
              <p className="text-blue-400 font-bold text-sm mt-1">Live cryptocurrency rates</p>
            </div>
            <button
              onClick={() => onNavigate("alert-rates")}
              className="p-3 sm:p-4 rounded-2xl transition-all border hover:border-blue-500/30"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}
            >
              <Bell className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: 'var(--text-secondary)' }} />
            </button>
          </div>
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search currencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-12 sm:pl-14 text-base sm:text-lg rounded-2xl"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-4">
        {/* Tab switcher */}
        <div className="card rounded-2xl p-1.5 flex mb-6 sm:mb-8 max-w-sm">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 py-3 rounded-xl font-bold transition-all text-sm ${
              activeTab === "all"
                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                : "hover:bg-white/5"
            }`}
            style={activeTab !== "all" ? { color: 'var(--text-muted)' } : {}}
          >
            All Market
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`flex-1 py-3 rounded-xl font-bold transition-all text-sm ${
              activeTab === "favorites"
                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                : "hover:bg-white/5"
            }`}
            style={activeTab !== "favorites" ? { color: 'var(--text-muted)' } : {}}
          >
            Favorites
          </button>
        </div>

        {/* Currency Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 pb-24">
          {filteredCurrencies.map((currency) => (
            <div
              key={currency.id}
              onClick={() => onSelectCurrency(currency)}
              className="card p-5 sm:p-6 cursor-pointer group"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-5 sm:mb-6">
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 ${currency.colorClass} rounded-xl flex items-center justify-center text-white text-xl sm:text-2xl font-black shadow-lg group-hover:scale-110 transition-transform`}>
                    {currency.icon}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold ${
                    currency.positive ? "badge-success" : "badge-danger"
                  }`}>
                    {currency.change}
                  </div>
                </div>
                
                <div className="mb-5 sm:mb-6">
                  <h3 className="font-black text-lg sm:text-xl group-hover:text-blue-400 transition-colors" style={{ color: 'var(--text-primary)' }}>
                    {currency.name}
                  </h3>
                  <p className="font-bold text-xs tracking-wide" style={{ color: 'var(--text-muted)' }}>{currency.fullName}</p>
                </div>

                <div className="mt-auto flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Price</p>
                    <p className="font-black text-base sm:text-lg leading-none" style={{ color: 'var(--text-primary)' }}>
                      {currency.price}
                    </p>
                  </div>
                  <div className="w-14 h-7 sm:w-16 sm:h-8 opacity-40 group-hover:opacity-100 transition-opacity">
                    {currency.positive ? (
                      <TrendingUp className="w-full h-full text-emerald-400" />
                    ) : (
                      <TrendingDown className="w-full h-full text-red-400" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filteredCurrencies.length === 0 && (
             <div className="col-span-full text-center py-12 font-bold" style={{ color: 'var(--text-muted)' }}>
                No active currencies found.
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrencyRates;

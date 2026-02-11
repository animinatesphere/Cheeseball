import React, { useEffect, useState } from "react";
import { 
  ChevronDown, 
  Calendar, 
  RefreshCw, 
  TrendingUp, 
  FileText, 
  Wallet, 
  ChevronRight,
  Loader2
} from "lucide-react";
import { getAdminStats, getSystemStatus } from "../../lib/api";

const AdminDashboardHome = ({ onNavigate }) => {
  const [stats, setStats] = useState({ orderCount: 0, currencyCount: 0, volume: "0" });
  const [systemStatus, setSystemStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const statsData = await getAdminStats();
      const { data: statusData } = await getSystemStatus();
      
      setStats(statsData);
      setSystemStatus(statusData || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-32 animate-fade-in">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-8 sm:py-12">
          <div>
            <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">Dashboard</h1>
            <p className="text-blue-600 font-black uppercase text-xs tracking-[0.2em] mt-2">Welcome back, Admin</p>
          </div>
          <button className="bg-white border-2 border-gray-100 hover:border-blue-200 text-gray-700 px-6 py-3 rounded-2xl flex items-center gap-3 font-black text-sm uppercase tracking-widest transition-all shadow-sm hover:shadow-lg active:scale-95">
            Today <ChevronDown className="w-5 h-5 text-blue-600" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] sm:rounded-[3rem] shadow-2xl shadow-gray-100 p-8 sm:p-10 border border-gray-50">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-gray-900 font-black text-xl tracking-tight">Order Velocity</h2>
              <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">
                <Calendar className="w-4 h-4" />
                {new Date().toLocaleDateString()}
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-12 sm:gap-16">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="50%" cy="50%" r="80" fill="none" stroke="#F8FAFC" strokeWidth="20" />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="80"
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="20"
                    strokeDasharray="502"
                    strokeDashoffset="125"
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-2xl sm:text-3xl font-black text-gray-900 tabular-nums">{stats.volume}</div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Volume</div>
                </div>
              </div>

              <div className="space-y-4 flex-1 w-full">
                {[
                  { label: "Total Orders", count: `${stats.orderCount} Orders`, color: "bg-blue-600", bg: "bg-blue-50" },
                  // { label: "Completed", count: "45 Orders", color: "bg-blue-600", bg: "bg-blue-50/50" },
                  // { label: "Canceled", count: "10 Orders", color: "bg-red-400", bg: "bg-red-50" },
                ].map((item, idx) => (
                  <div key={idx} className={`${item.bg} p-5 rounded-2xl sm:rounded-3xl flex items-center gap-4 border border-white/50`}>
                    <div className={`w-1.5 h-10 ${item.color} rounded-full`}></div>
                    <div className="flex-1">
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</div>
                      <div className="font-black text-gray-900 text-lg">{item.count}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 sm:gap-8">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-200 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transform group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                    <RefreshCw className="w-6 h-6 animate-spin-slow" />
                  </div>
                  <TrendingUp className="w-6 h-6 opacity-50" />
                </div>
                <div className="text-blue-100 text-[10px] font-black uppercase tracking-widest mb-1">Active Currencies</div>
                <div className="text-4xl font-black mb-1 tabular-nums">{stats.currencyCount}</div>
                <div className="text-blue-200 text-xs font-bold">+12 since yesterday</div>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-50 flex flex-col justify-center">
              <div className="bg-gray-50 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                <FileText className="w-6 h-6" />
              </div>
              <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Market Listing</div>
              <div className="text-4xl font-black text-gray-900 mb-1 tabular-nums">{stats.currencyCount}</div>
              <div className="text-gray-400 text-xs font-bold">Managed globally</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          <div className="space-y-4">
            <h3 className="text-gray-900 font-black uppercase text-xs tracking-[0.2em] ml-2 mb-6">Quick Infrastructure</h3>
            <button
              onClick={() => onNavigate("rate")}
              className="w-full bg-white border-2 border-gray-50 rounded-[2rem] p-6 flex items-center justify-between hover:border-blue-100 hover:shadow-2xl transition-all group active:scale-[0.98]"
            >
              <div className="flex items-center gap-5">
                <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-lg shadow-blue-50">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <span className="block font-black text-gray-900 text-lg leading-tight">Rate Management</span>
                  <span className="text-xs font-bold text-gray-400">Update global exchange values</span>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </button>
            <button className="w-full bg-white border-2 border-gray-50 rounded-[2rem] p-6 flex items-center justify-between hover:border-blue-100 hover:shadow-2xl transition-all group active:scale-[0.98]">
              <div className="flex items-center gap-5">
                <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-lg shadow-blue-50">
                  <Wallet className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <span className="block font-black text-gray-900 text-lg leading-tight">Master Wallet</span>
                  <span className="text-xs font-bold text-gray-400">Audit system reserves</span>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </button>
          </div>
          
          <div className="bg-gray-50 rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-10 border border-gray-100 font-medium">
            <h3 className="text-gray-900 font-black uppercase text-xs tracking-[0.2em] mb-8">System Architecture</h3>
            <div className="space-y-4">
              {systemStatus.length > 0 ? (
                systemStatus.map((item, i) => (
                   <div key={i} className="flex justify-between items-center p-5 bg-white rounded-2xl border border-gray-100 hover:border-blue-100 transition-all shadow-sm">
                     <span className="text-gray-700 font-black text-sm">{item.name}</span>
                     <div className="flex items-center gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest ${item.status === 'Healthy' ? 'text-green-600' : 'text-red-500'}`}>{item.status}</span>
                       <span className={`w-2.5 h-2.5 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)] ${item.status === 'Healthy' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                     </div>
                   </div>
                 ))
              ) : (
                <div className="text-center text-gray-400 text-sm">No system status reported.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHome;

import React, { useEffect, useState } from "react";
import { 
  ChevronDown, 
  Calendar, 
  RefreshCw, 
  TrendingUp, 
  FileText, 
  Wallet, 
  ChevronRight,
  Loader2,
  Activity,
  Zap,
  Shield,
  Layers
} from "lucide-react";
import { getAdminStats, getSystemStatus } from "../../lib/api";

const AdminDashboardHome = ({ onNavigate }) => {
  const [stats, setStats] = useState({ orderCount: 0, currencyCount: 0, volume: "0" });
  const [systemStatus, setSystemStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const statsData = await getAdminStats();
        const { data: statusData } = await getSystemStatus();
        setStats(statsData || { orderCount: 0, currencyCount: 0, volume: "0" });
        setSystemStatus(statusData || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full" style={{ background: 'var(--bg-primary)' }}>
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-32 animate-fade-in" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 py-10 sm:py-16">
          <div className="reveal active">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tighter" style={{ color: 'var(--text-primary)' }}>
              Overview
            </h1>
            <div className="flex items-center gap-2 mt-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
              <p className="text-blue-500 font-bold uppercase text-[10px] tracking-widest">Master Control Panel • Online</p>
            </div>
          </div>
          <button className="btn-ghost flex items-center gap-3 px-6 py-4 rounded-2xl group active:scale-95">
            <Calendar className="w-5 h-5 text-blue-500" />
            <span className="font-extrabold text-sm uppercase tracking-widest" style={{ color: 'var(--text-primary)' }}>Today</span>
            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:rotate-180 transition-transform" />
          </button>
        </div>

        {/* Top Grid: Main Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {/* Velocity Chart / Main Stat Card */}
          <div className="lg:col-span-2 card p-8 sm:p-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl -mr-40 -mt-40 group-hover:bg-blue-500/10 transition-all duration-700"></div>
            
            <div className="flex justify-between items-center mb-12 relative z-10">
              <div>
                <h2 className="font-black text-2xl tracking-tight" style={{ color: 'var(--text-primary)' }}>Trade Velocity</h2>
                <p className="text-xs font-bold uppercase tracking-widest mt-1" style={{ color: 'var(--text-muted)' }}>Real-time volume analysis</p>
              </div>
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500">
                <Activity className="w-6 h-6 animate-pulse" />
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-12 sm:gap-20 relative z-10">
              <div className="relative w-56 h-56 sm:w-64 sm:h-64">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="50%" cy="50%" r="90" fill="none" stroke="var(--border-primary)" strokeWidth="24" strokeLinecap="round" />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="90"
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="24"
                    strokeDasharray="565"
                    strokeDashoffset="141"
                    strokeLinecap="round"
                    className="transition-all duration-1000 shadow-[0_0_20px_var(--accent-glow)]"
                    style={{ stroke: 'url(#gradient-blue)' }}
                  />
                  <defs>
                    <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-3xl sm:text-4xl font-black tabular-nums" style={{ color: 'var(--text-primary)' }}>{stats.volume}</div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>Units Traded</div>
                </div>
              </div>

              <div className="space-y-5 flex-1 w-full">
                <div className="p-6 rounded-3xl border border-transparent transition-all hover:border-blue-500/30 group/item" style={{ background: 'var(--bg-elevated)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Zap className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Total Orders</span>
                    </div>
                    <span className="text-xs font-bold text-blue-500">+18% this hour</span>
                  </div>
                  <div className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>{stats.orderCount} <span className="text-sm font-medium text-gray-500">Transactions</span></div>
                </div>

                <div className="p-6 rounded-3xl border border-transparent transition-all hover:border-emerald-500/30 group/item" style={{ background: 'var(--bg-elevated)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Success Rate</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-500">Peak Performance</span>
                  </div>
                  <div className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>99.8% <span className="text-sm font-medium text-gray-500">Efficiency</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Cards: System Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 sm:gap-8">
            <div className="rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl transition-all hover:-translate-y-1" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transform group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
                    <RefreshCw className="w-7 h-7 animate-spin-slow" />
                  </div>
                  <TrendingUp className="w-6 h-6 opacity-40" />
                </div>
                <div>
                  <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mb-1">Active Currencies</p>
                  <p className="text-5xl font-black mb-2 tabular-nums">{stats.currencyCount}</p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-black border border-white/10">
                    <Zap className="w-3 h-3 text-yellow-300" />
                    SYNCED WITH COINCEX
                  </div>
                </div>
              </div>
            </div>

            <div className="card-elevated rounded-[2.5rem] p-8 relative overflow-hidden group transition-all hover:-translate-y-1">
               <div className="flex justify-between items-start mb-8">
                  <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500">
                    <FileText className="w-7 h-7" />
                  </div>
                  <div className="text-[10px] font-black text-gray-400 border border-gray-400/20 px-3 py-1 rounded-full">INTERNAL</div>
               </div>
               <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Market Listings</p>
                  <p className="text-5xl font-black tabular-nums" style={{ color: 'var(--text-primary)' }}>{stats.currencyCount}</p>
                  <p className="text-xs font-medium mt-2" style={{ color: 'var(--text-muted)' }}>Currently managed and active</p>
               </div>
            </div>
          </div>
        </div>

        {/* Bottom Grid: Actions and Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 pb-20">
          {/* Quick Actions */}
          <div className="space-y-6">
            <h3 className="font-black uppercase text-xs tracking-[0.3em] ml-2" style={{ color: 'var(--text-muted)' }}>Quick Infrastructure</h3>
            <div className="space-y-4">
              {[
                { id: "rate", label: "Rate Management", sub: "Update global exchange values", icon: TrendingUp, color: "text-blue-500", bg: "rgba(59,130,246,0.1)" },
                { id: "wallet", label: "Master Wallet", sub: "Audit system reserves & cold storage", icon: Wallet, color: "text-emerald-500", bg: "rgba(16,185,129,0.1)" },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => onNavigate(item.id)}
                  className="w-full card border-2 border-transparent p-6 flex items-center justify-between hover:border-blue-500/20 hover:shadow-2xl transition-all group active:scale-[0.98]"
                  style={{ background: 'var(--bg-card)' }}
                >
                  <div className="flex items-center gap-6">
                    <div className="p-4 rounded-2xl shadow-xl transition-all group-hover:scale-110" style={{ background: item.bg, color: item.color }}>
                      <item.icon className="w-7 h-7" />
                    </div>
                    <div className="text-left">
                      <span className="block font-black text-xl leading-tight" style={{ color: 'var(--text-primary)' }}>{item.label}</span>
                      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{item.sub}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
          
          {/* System Status Table */}
          <div className="card rounded-[3rem] p-8 sm:p-12 font-medium">
            <div className="flex items-center gap-3 mb-10">
              <Layers className="w-6 h-6 text-blue-500" />
              <h3 className="font-black uppercase text-xs tracking-widest" style={{ color: 'var(--text-muted)' }}>System Architecture</h3>
            </div>
            
            <div className="space-y-3">
              {systemStatus && systemStatus.length > 0 ? (
                systemStatus.map((item, i) => (
                   <div key={i} className="flex justify-between items-center p-5 rounded-2xl transition-all group border border-transparent hover:border-blue-500/20" style={{ background: 'var(--bg-elevated)' }}>
                     <div className="flex items-center gap-4">
                       <div className="w-2 h-10 bg-blue-500/20 group-hover:bg-blue-500 rounded-full transition-all"></div>
                       <span className="font-extrabold text-sm" style={{ color: 'var(--text-primary)' }}>{item.name}</span>
                     </div>
                     <div className="flex items-center gap-3">
                       <span className={`text-[10px] font-black uppercase tracking-widest ${item.status === 'Healthy' ? 'text-emerald-500' : 'text-red-500'}`}>
                         {item.status}
                       </span>
                       <div className={`w-3 h-3 rounded-full ${item.status === 'Healthy' ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]' : 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]'}`}></div>
                     </div>
                   </div>
                 ))
              ) : (
                <div className="text-center py-12 px-6 rounded-3xl border-2 border-dashed border-gray-100/10">
                  <Shield className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 font-bold">Systems Diagnostic Offline</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-2">Checking node availability...</p>
                </div>
              )}
            </div>

            <div className="mt-8 pt-8 border-t" style={{ borderColor: 'var(--border-primary)' }}>
               <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>
                  <span>Last Diagnostic Scan</span>
                  <span>{new Date().toLocaleTimeString()}</span>
               </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Global CSS for some custom animations used above */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboardHome;

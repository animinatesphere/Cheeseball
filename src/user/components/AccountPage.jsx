import React, { useEffect, useState } from "react";
import { User, Mail, Phone, Shield, ArrowRight, Settings, LogOut, TrendingUp, CreditCard, Sun, Moon } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { useTheme } from "../../context/ThemeProvider";

const AccountPage = ({ onNavigate }) => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ totalTrades: 0, activeOrders: 0 });
  const [loading, setLoading] = useState(true);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      setProfile({ ...data, email: session.user.email });

      const { count: txCount } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id);
      
      const { count: giftCount } = await supabase
        .from('gift_card_trades')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id);

      setStats({
        totalTrades: (txCount || 0) + (giftCount || 0),
        activeOrders: 0 
      });

    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 animate-fade-in overflow-x-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Header gradient area */}
      <div className="h-48 sm:h-64 relative overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl translate-x-1/4 translate-y-1/4"></div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-24 sm:-mt-32 relative z-10">
        <div className="space-y-5">
          {/* Profile Header Card */}
          <div className="card p-6 sm:p-8 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[2rem] flex items-center justify-center text-white shadow-lg overflow-hidden ring-4 rotate-3 hover:rotate-0 transition-all duration-500" style={{ background: 'linear-gradient(135deg, var(--accent), #1d4ed8)', ringColor: 'var(--border-primary)' }}>
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 sm:w-12 sm:h-12" />
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-7 h-7 rounded-xl border-4 flex items-center justify-center shadow-lg" style={{ borderColor: 'var(--bg-card)' }}>
                   <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>
                  {profile?.full_name || "Welcome User"}
                </h1>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  <span className="px-3 py-1 bg-blue-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-blue-500/20">
                    {profile?.role || "Verified"}
                  </span>
                  <span className="px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-widest" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border-primary)' }}>
                    ID: {profile?.id?.slice(0, 8).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="card p-5 sm:p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent-subtle)' }}>
                {theme === 'dark' ? <Moon className="w-5 h-5 text-blue-400" /> : <Sun className="w-5 h-5 text-yellow-500" />}
              </div>
              <div>
                <p className="text-sm font-black" style={{ color: 'var(--text-primary)' }}>Appearance</p>
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="relative w-14 h-8 rounded-full transition-all duration-300 cursor-pointer"
              style={{ background: theme === 'dark' ? 'var(--accent)' : 'var(--border-hover)' }}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${theme === 'dark' ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="card p-6 hover:border-blue-500/30 transition-all group">
               <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ background: 'var(--accent-subtle)' }}>
                  <TrendingUp className="w-5 h-5 text-blue-400" />
               </div>
               <p className="text-2xl sm:text-3xl font-black mb-1" style={{ color: 'var(--text-primary)' }}>{stats.totalTrades}</p>
               <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Total Trades</p>
            </div>
            <div className="card p-6 hover:border-emerald-500/30 transition-all group">
               <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ background: 'rgba(16,185,129,0.1)' }}>
                  <CreditCard className="w-5 h-5 text-emerald-400" />
               </div>
               <p className="text-2xl sm:text-3xl font-black mb-1" style={{ color: 'var(--text-primary)' }}>{stats.activeOrders}</p>
               <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Active Orders</p>
            </div>
          </div>

          {/* Settings List */}
          <div className="card overflow-hidden">
            {[
              { icon: Mail, label: "Primary Email", value: profile?.email || "Not set", color: "text-blue-400" },
              { icon: Phone, label: "Phone Number", value: profile?.phone || "No phone linked", color: "text-purple-400" },
              { icon: Shield, label: "Account Security", value: "Verified Profile", color: "text-emerald-400" },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center p-5 transition-all group cursor-pointer hover:bg-white/5" style={{ borderBottom: i < 2 ? '1px solid var(--border-primary)' : 'none' }}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`} style={{ background: 'var(--bg-elevated)' }}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'var(--text-muted)' }}>{item.label}</p>
                    <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{item.value}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" style={{ color: 'var(--text-muted)' }} />
              </div>
            ))}
          </div>

          {/* Action Footer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button className="btn-ghost py-4 flex items-center justify-center gap-3 group">
               <Settings className="w-5 h-5 group-hover:rotate-90 transition-all duration-500" style={{ color: 'var(--text-muted)' }} />
               <span className="uppercase text-xs tracking-widest font-bold">Edit Profile</span>
            </button>
            <button 
              onClick={handleLogout}
              className="py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 group text-sm uppercase tracking-widest"
              style={{ background: 'var(--danger)', color: 'white' }}
            >
               <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
               <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;

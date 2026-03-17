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
    <div className="min-h-screen pb-32 animate-fade-in bg-[#0B0E11] text-[#EAECEF] uppercase tracking-tighter">
      {/* Header gradient area */}
      <div className="h-48 sm:h-64 relative overflow-hidden bg-[#181A20] border-b border-white/5">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#FFB11A]/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-x-1/4 translate-y-1/4"></div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-24 sm:-mt-32 relative z-10">
        <div className="space-y-6">
          {/* Profile Header Card */}
          <div className="bg-[#1E2329] rounded-[2.5rem] p-6 sm:p-10 relative overflow-hidden border border-white/5 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[2rem] flex items-center justify-center text-black shadow-lg overflow-hidden ring-4 rotate-3 hover:rotate-0 transition-all duration-500 bg-gradient-to-br from-[#FFB11A] to-[#FF8A00] ring-white/10">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 sm:w-12 sm:h-12" />
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-green-500 w-7 h-7 rounded-xl border-4 border-[#1E2329] flex items-center justify-center shadow-lg">
                   <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>

              <div className="text-center sm:text-left flex-1">
                <h1 className="text-2xl sm:text-3xl font-black text-white italic tracking-tighter mb-2">
                  {profile?.full_name || "Premium User"}
                </h1>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  <span className="px-3 py-1 bg-[#FFB11A] text-black rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#FFB11A]/20">
                    {profile?.role || "Verified VIP"}
                  </span>
                  <span className="px-3 py-1 bg-[#2B3139] text-gray-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/5">
                    ID: {profile?.id?.slice(0, 8).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="bg-[#1E2329] rounded-2xl p-5 sm:p-6 flex items-center justify-between border border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-white/5">
                {theme === 'dark' ? <Moon className="w-5 h-5 text-[#FFB11A]" /> : <Sun className="w-5 h-5 text-[#FFB11A]" />}
              </div>
              <div>
                <p className="text-xs font-black text-white italic">Appearance</p>
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                  Custom Interface Theme
                </p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="relative w-14 h-8 bg-[#2B3139] border border-white/10 rounded-full transition-all duration-300 cursor-pointer"
            >
              <div className={`absolute top-1 w-6 h-6 rounded-full shadow-md transition-all duration-300 ${theme === 'dark' ? 'left-7 bg-[#FFB11A]' : 'left-1 bg-gray-600'}`}></div>
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1E2329] rounded-[2rem] p-8 hover:border-[#FFB11A]/30 transition-all group border border-white/5">
               <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform bg-[#FFB11A]/10">
                  <TrendingUp className="w-5 h-5 text-[#FFB11A]" />
               </div>
               <p className="text-3xl font-black text-white mb-1 leading-none">{stats.totalTrades}</p>
               <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Trades</p>
            </div>
            <div className="bg-[#1E2329] rounded-[2rem] p-8 hover:border-green-500/30 transition-all group border border-white/5">
               <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform bg-green-500/10">
                  <CreditCard className="w-5 h-5 text-green-400" />
               </div>
               <p className="text-3xl font-black text-white mb-1 leading-none">{stats.activeOrders}</p>
               <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Active</p>
            </div>
          </div>

          {/* Settings List */}
          <div className="bg-[#1E2329] rounded-[2rem] overflow-hidden border border-white/5 shadow-xl">
            {[
              { icon: Mail, label: "Security Email", value: profile?.email || "NOT LINKED", color: "text-[#FFB11A]" },
              { icon: Phone, label: "Phone Linked", value: profile?.phone || "NOT SET", color: "text-blue-400" },
              { icon: Shield, label: "KYC Status", value: "Level 2 • Verified", color: "text-green-400" },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center p-6 transition-all group cursor-pointer hover:bg-white/5" style={{ borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform bg-black/20 border border-white/5`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-0.5">{item.label}</p>
                    <p className="text-sm font-black text-white">{item.value}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-600 group-hover:translate-x-1 group-hover:text-[#FFB11A] transition-all" />
              </div>
            ))}
          </div>

          {/* Action Footer */}
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-[#1E2329] text-gray-400 p-5 rounded-2xl flex items-center justify-center gap-3 group border border-white/5 hover:text-white transition-all">
               <Settings className="w-5 h-5 group-hover:rotate-90 transition-all duration-700" />
               <span className="uppercase text-[10px] tracking-[0.2em] font-black">Preferences</span>
            </button>
            <button
              onClick={handleLogout}
              className="p-5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-black transition-all flex items-center justify-center gap-3 group text-[10px] uppercase tracking-[0.2em]"
            >
               <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
               <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;

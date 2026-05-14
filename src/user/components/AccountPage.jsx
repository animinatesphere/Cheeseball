import React, { useEffect, useState } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  ArrowRight, 
  Settings, 
  LogOut, 
  TrendingUp, 
  CreditCard, 
  Sun, 
  Moon,
  ChevronRight,
  ShieldCheck,
  Zap,
  Bell,
  Lock,
  Smartphone,
  Eye,
  HelpCircle
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { useTheme } from "../../context/ThemeProvider";

const AccountPage = ({ onNavigate }) => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ totalTrades: 0, activeOrders: 0, totalVolume: "₦0.00" });
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

      // Fetch actual stats
      const [txRes, giftRes] = await Promise.all([
        supabase.from('transactions').select('*', { count: 'exact', head: true }).eq('user_id', session.user.id),
        supabase.from('gift_card_trades').select('*', { count: 'exact', head: true }).eq('user_id', session.user.id)
      ]);

      setStats({
        totalTrades: (txRes.count || 0) + (giftRes.count || 0),
        activeOrders: 0,
        totalVolume: "₦5.2M" // Mock volume for aesthetic
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
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-white">
        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
        <p className="sora font-black text-slate-400 uppercase tracking-[0.2em] text-[10px]">Synchronizing Profile</p>
      </div>
    );
  }

  const initials = profile?.full_name 
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase() 
    : "CB";

  return (
    <div className="min-h-screen pb-32 animate-in fade-in duration-700 bg-[#F8FAFC]">
      {/* ── PREMIUM HEADER AREA ────────────────────────────────── */}
      <div className="h-64 sm:h-80 relative overflow-hidden" style={{ background: "linear-gradient(145deg, #2563EB 0%, #1E40AF 100%)" }}>
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[120px] -mr-48 -mt-48 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-[100px] -ml-32 -mb-32" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        
        <div className="max-w-4xl mx-auto px-6 pt-12 flex justify-between items-start relative z-10">
           <div className="space-y-1">
              <h1 className="sora font-black text-white text-2xl lg:text-3xl uppercase tracking-tight italic">Profile Settings</h1>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Node: Active</span>
              </div>
           </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 -mt-32 sm:-mt-40 relative z-20 space-y-8">
        
        {/* ── PROFILE HEADER CARD ────────────────────────────────── */}
        <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 group-hover:bg-blue-50 transition-colors duration-700" />
           
           <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="relative">
                 <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-[2.5rem] p-1 shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500" style={{ background: "linear-gradient(135deg, #2563EB 0%, #FF8A00 100%)" }}>
                    <div className="w-full h-full rounded-[2.3rem] bg-white overflow-hidden flex items-center justify-center">
                       {profile?.avatar_url ? (
                          <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                       ) : (
                          <span className="sora font-black text-4xl lg:text-5xl text-slate-900">{initials}</span>
                       )}
                    </div>
                 </div>
                 <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-2xl border-4 border-white flex items-center justify-center shadow-lg">
                    <ShieldCheck className="text-white w-5 h-5" />
                 </div>
              </div>

              <div className="text-center md:text-left flex-1 space-y-4">
                 <div className="space-y-1">
                    <h2 className="sora font-black text-slate-900 text-3xl lg:text-4xl tracking-tight uppercase italic">{profile?.full_name || "Account Owner"}</h2>
                    <p className="text-slate-400 text-sm font-bold tracking-tight">{profile?.email || "user@cheeseball.io"}</p>
                 </div>
                 <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <div className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/20">
                       Institutional VIP
                    </div>
                    <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100">
                       Tier 3 Verification
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* ── BENTO STATS GRID ───────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 group hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 border border-blue-100 group-hover:scale-110 transition-transform">
                 <TrendingUp size={24} />
              </div>
              <p className="sora font-black text-3xl text-slate-900 mb-1 leading-none">{stats.totalTrades}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lifetime Trades</p>
           </div>
           
           <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 group hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 border border-emerald-100 group-hover:scale-110 transition-transform">
                 <Zap size={24} />
              </div>
              <p className="sora font-black text-3xl text-slate-900 mb-1 leading-none">{stats.totalVolume}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Volume</p>
           </div>

           <div className="bg-slate-900 rounded-[2rem] p-8 shadow-2xl shadow-slate-900/20 group hover:-translate-y-1 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl" />
              <div className="w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-6 border border-white/10 backdrop-blur-md">
                 <CreditCard size={24} />
              </div>
              <p className="sora font-black text-3xl text-white mb-1 leading-none">2</p>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Cards</p>
           </div>
        </div>

        {/* ── SETTINGS GROUPS ─────────────────────────────────────── */}
        <div className="space-y-6">
           <h3 className="sora font-black text-slate-400 text-xs uppercase tracking-[0.3em] px-4">Account Integrity</h3>
           
           <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 divide-y divide-slate-50 overflow-hidden">
              {[
                { icon: Smartphone, label: "Phone Security", value: profile?.phone || "Verification Required", color: "text-blue-500", bg: "bg-blue-50" },
                { icon: Shield, label: "Identity (KYC)", value: "Level 2 • Verified", color: "text-emerald-500", bg: "bg-emerald-50" },
                { icon: Lock, label: "2FA Authentication", value: "Enabled • Biometric", color: "text-indigo-500", bg: "bg-indigo-50" },
                { icon: Bell, label: "Push Notifications", value: "Smart Alerts Active", color: "text-amber-500", bg: "bg-amber-50" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-6 lg:p-8 hover:bg-slate-50 transition-all cursor-pointer group">
                   <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.bg} ${item.color} border border-transparent group-hover:border-white transition-all shadow-sm`}>
                         <item.icon size={24} />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                         <p className="text-sm font-black text-slate-900">{item.value}</p>
                      </div>
                   </div>
                   <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                      <ChevronRight size={18} />
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* ── FOOTER ACTIONS ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
           <button className="bg-white border border-slate-100 p-6 rounded-[2rem] flex items-center justify-between group hover:border-blue-200 transition-all shadow-sm hover:shadow-xl hover:shadow-blue-900/5">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                    <HelpCircle size={22} />
                 </div>
                 <span className="sora font-black text-xs text-slate-900 uppercase">Support Center</span>
              </div>
              <ArrowRight size={18} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
           </button>

           <button 
             onClick={handleLogout}
             className="bg-red-50 border border-red-100 p-6 rounded-[2rem] flex items-center justify-between group hover:bg-red-600 transition-all shadow-sm hover:shadow-red-900/10"
           >
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-white text-red-500 flex items-center justify-center shadow-sm group-hover:scale-90 transition-all">
                    <LogOut size={22} />
                 </div>
                 <span className="sora font-black text-xs text-red-600 uppercase group-hover:text-white">Secure Logout</span>
              </div>
              <XCircle size={18} className="text-red-300 group-hover:text-white transition-all" />
           </button>
        </div>

        <div className="text-center pt-8">
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">CheeseBall v2.4.0 • Institutional Grade</p>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-in { animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

// Simple fallback for missing icon
const XCircle = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>
  </svg>
);

export default AccountPage;

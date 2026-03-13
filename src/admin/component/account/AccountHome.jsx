import React from "react";
import { Wallet, Users, Bell, MessageCircle, ChevronRight, ShieldCheck, Mail, LogOut } from "lucide-react";

const AccountHome = ({ onNavigate }) => {
  const menuItems = [
    { id: "income", label: "Financial Grid", sub: "Audit system income & fees", icon: Wallet, color: "text-blue-500", bg: "rgba(59,130,246,0.1)" },
    { id: "admins", label: "Admin Hierarchy", sub: "Permissions & authority levels", icon: Users, color: "text-indigo-500", bg: "rgba(99,102,241,0.1)" },
    { id: "notification", label: "Global Broadcast", sub: "Push system-wide alerts", icon: Bell, color: "text-amber-500", bg: "rgba(245,158,11,0.1)" },
    { id: "support", label: "Support Control", sub: "Help desk & user concierge", icon: MessageCircle, color: "text-emerald-500", bg: "rgba(16,185,129,0.1)" },
  ];

  return (
    <div className="flex-1 overflow-y-auto pb-32 animate-fade-in" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="py-10 sm:py-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-8">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tighter" style={{ color: 'var(--text-primary)' }}>Authority</h1>
            <div className="flex items-center gap-3">
               <button className="btn-ghost flex items-center gap-2 p-4 rounded-xl text-red-500 hover:bg-red-500/10">
                  <LogOut className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Terminate Session</span>
               </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[3rem] p-10 sm:p-14 text-white shadow-2xl relative overflow-hidden group mb-16">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48 transform group-hover:scale-110 transition-transform duration-1000"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -ml-32 -mb-32"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
              <div className="flex items-center gap-8">
                 <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-xl border-2 border-white/20 flex items-center justify-center text-4xl shadow-inner overflow-hidden">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Creative" alt="Admin" className="w-full h-full object-cover" />
                 </div>
                 <div>
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tighter mb-2">Creative Omotayo</h2>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 opacity-80">
                       <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span className="font-bold text-sm tracking-tight text-blue-50">creativeomotayo@gmail.com</span>
                       </div>
                       <div className="hidden sm:block w-1.5 h-1.5 bg-white/30 rounded-full"></div>
                       <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4" />
                          <span className="font-bold text-sm tracking-tight text-blue-50">Level 4 Access</span>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="px-8 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-[10px] font-black uppercase tracking-[0.3em] shadow-lg">
                Root Administrator
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className="card p-8 flex items-center justify-between group animate-fade-in transition-all hover:-translate-y-1"
                >
                  <div className="flex items-center gap-8">
                    <div className="p-5 rounded-2xl shadow-xl transition-all group-hover:scale-110 group-hover:rotate-3" style={{ background: item.bg, color: item.color }}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="text-left">
                       <p className="font-black text-2xl tracking-tighter" style={{ color: 'var(--text-primary)' }}>{item.label}</p>
                       <p className="text-[10px] font-black uppercase tracking-widest mt-1" style={{ color: 'var(--text-muted)' }}>{item.sub}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-500/5 text-blue-500 rounded-xl group-hover:bg-blue-500 group-hover:text-white group-hover:translate-x-1 transition-all">
                    <ChevronRight className="w-6 h-6" />
                  </div>
                </button>
              );
            })}
          </div>
          
          <div className="mt-20 pt-10 border-t flex flex-col sm:flex-row items-center justify-between gap-6" style={{ borderColor: 'var(--border-primary)' }}>
             <p className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: 'var(--text-muted)' }}>© 2026 Cheeseball Network Authority</p>
             <div className="flex items-center gap-8">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Security: Hardened</span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: 'var(--text-muted)' }}>Nodes: 12 Active</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountHome;

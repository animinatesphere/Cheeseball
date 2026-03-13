import React, { useState, useEffect } from "react";
import { Plus, Trash2, Ticket, Loader2, Calendar, Percent, CheckCircle2, X, Star, Zap, Clock } from "lucide-react";
import { getPromoCodes, createPromoCode, deletePromoCode } from "../../lib/api";

const AdminPromoCodes = () => {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPromo, setNewPromo] = useState({
    code: "",
    benefit_percentage: "",
    expires_at: "",
    is_active: true
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPromos();
  }, []);

  const fetchPromos = async () => {
    setLoading(true);
    try {
      const { data } = await getPromoCodes();
      if (data) setPromos(data);
    } catch (err) {
      console.error("Fetch promos error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const { error: err } = await createPromoCode({
        ...newPromo,
        benefit_percentage: parseFloat(newPromo.benefit_percentage),
        code: newPromo.code.toUpperCase()
      });

      if (err) {
        setError(err.message);
      } else {
        setShowAddModal(false);
        setNewPromo({ code: "", benefit_percentage: "", expires_at: "", is_active: true });
        fetchPromos();
      }
    } catch (err) {
      setError("System error creating code");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanent deletion of this promo system?")) return;
    const { error } = await deletePromoCode(id);
    if (!error) fetchPromos();
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full" style={{ background: 'var(--bg-primary)' }}>
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-32 animate-fade-in" style={{ background: 'var(--bg-primary)' }}>
      {/* Premium Header */}
      <div className="sticky top-0 z-20 border-b" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-primary)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-10 gap-6">
            <div>
              <h1 className="text-4xl font-black tracking-tighter" style={{ color: 'var(--text-primary)' }}>Promotion Engine</h1>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mt-1">Growth & Rewards System</p>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center gap-3 px-8 py-4 rounded-2xl group active:scale-95"
            >
              <Plus className="w-6 h-6 group-hover:rotate-180 transition-transform" />
              <span>Generate Code</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {promos.map((promo) => (
            <div key={promo.id} className="card p-8 group relative overflow-hidden animate-fade-in transition-all hover:-translate-y-1">
               <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all">
                  <button 
                    onClick={() => handleDelete(promo.id)}
                    className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-lg"
                  >
                    <Trash2 size={20} />
                  </button>
               </div>
               
               <div className="flex items-start gap-6 mb-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/10 group-hover:translate-x-full transition-transform duration-700"></div>
                     <Ticket size={28} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-2xl tracking-tighter uppercase mb-1 leading-none group-hover:text-blue-500 transition-colors" style={{ color: 'var(--text-primary)' }}>{promo.code}</h3>
                    <div className="flex items-center gap-3">
                       <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${promo.is_active ? 'text-emerald-500' : 'text-gray-400'}`}>
                          <div className={`w-2 h-2 rounded-full ${promo.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`}></div>
                          {promo.is_active ? 'Active Now' : 'Disabled'}
                       </span>
                    </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-6 relative z-10">
                  <div className="p-5 rounded-3xl" style={{ background: 'var(--bg-elevated)' }}>
                     <div className="text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                        <Percent size={14} className="text-blue-500" /> Multiplier
                     </div>
                     <div className="text-2xl font-black tabular-nums" style={{ color: 'var(--text-primary)' }}>+{promo.benefit_percentage}%</div>
                  </div>
                  <div className="p-5 rounded-3xl" style={{ background: 'var(--bg-elevated)' }}>
                     <div className="text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                        <Clock size={14} className="text-amber-500" /> Deadline
                     </div>
                     <div className="text-sm font-extrabold truncate" style={{ color: 'var(--text-primary)' }}>
                        {promo.expires_at ? new Date(promo.expires_at).toLocaleDateString() : 'PERPETUAL'}
                     </div>
                  </div>
               </div>
               
               {/* Background detail */}
               <Star className="absolute -bottom-8 -right-8 w-32 h-32 text-blue-500/5 rotate-12" />
            </div>
          ))}

          {promos.length === 0 && (
            <div className="col-span-full py-24 card border-dashed border-2 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-blue-500/10 rounded-[2rem] flex items-center justify-center text-blue-500 mb-6 animate-bounce">
                 <Ticket size={40} />
              </div>
              <h3 className="font-black text-2xl mb-2 uppercase tracking-tight" style={{ color: 'var(--text-primary)' }}>No Reward Nodes</h3>
              <p className="text-sm font-medium max-w-xs mx-auto" style={{ color: 'var(--text-muted)' }}>Initialize your first cryptographic promo sequence to incentivize user liquidity.</p>
            </div>
          )}
        </div>
      </div>

      {/* Premium Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-xl" onClick={() => setShowAddModal(false)}></div>
          <div className="card w-full max-w-lg rounded-[3rem] relative z-10 overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.2)] animate-in fade-in zoom-in duration-300" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-accent)' }}>
            <div className="p-10 pb-0 relative">
              <button 
                onClick={() => setShowAddModal(false)} 
                className="absolute top-10 right-10 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                style={{ color: 'var(--text-muted)' }}
              >
                <X size={24} />
              </button>
              <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                <Zap className="w-3 h-3" /> New Campaign
              </div>
              <h2 className="text-4xl font-black tracking-tighter uppercase mb-2" style={{ color: 'var(--text-primary)' }}>Deployment</h2>
              <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Configure your promotional node parameters below.</p>
            </div>
            
            <form onSubmit={handleCreate} className="p-10 space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] px-1" style={{ color: 'var(--text-muted)' }}>Secret Access Code</label>
                <input 
                  type="text" 
                  required
                  placeholder="E.G. NODEZERO"
                  className="input-field text-xl tracking-widest uppercase"
                  value={newPromo.code}
                  onChange={e => setNewPromo({...newPromo, code: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] px-1" style={{ color: 'var(--text-muted)' }}>Reward Bonus %</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      required
                      placeholder="5.0"
                      className="input-field"
                      value={newPromo.benefit_percentage}
                      onChange={e => setNewPromo({...newPromo, benefit_percentage: e.target.value})}
                    />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-blue-500 font-black">%</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] px-1" style={{ color: 'var(--text-muted)' }}>Expiry Epoch</label>
                  <input 
                    type="date" 
                    className="input-field"
                    value={newPromo.expires_at}
                    onChange={e => setNewPromo({...newPromo, expires_at: e.target.value})}
                  />
                </div>
              </div>

              {error && (
                <div className="p-5 rounded-3xl bg-red-500/10 border border-red-500/20 animate-shake">
                   <p className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center">{error}</p>
                </div>
              )}

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full py-5 text-lg flex items-center justify-center gap-4 group"
                >
                  {submitting ? <Loader2 size={24} className="animate-spin" /> : <>
                    <CheckCircle2 size={24} className="group-hover:scale-110 transition-transform" />
                    <span>INITIALIZE NODE</span>
                  </>}
                </button>
                <p className="text-[8px] text-center font-bold text-gray-400 uppercase tracking-widest mt-6">Secure Transaction • Logged as System Admin</p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPromoCodes;

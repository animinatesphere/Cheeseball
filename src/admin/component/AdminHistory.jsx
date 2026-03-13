import React, { useState, useEffect } from "react";
import { ChevronLeft, SlidersHorizontal, ArrowRight, Calendar, Loader2, Search, History, ShieldCheck } from "lucide-react";
import { getTransactions } from "../../lib/api";

const AdminHistory = ({ onBack }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const { data } = await getTransactions();
        if (data) {
          const mappedTransactions = data.map(t => ({
            id: t.id,
            date: new Date(t.created_at).toLocaleDateString("en-GB", { day: '2-digit', month: 'long', year: 'numeric' }),
            from: { 
              amount: t.from_amount, 
              currency: t.from_currency?.symbol || 'USD', 
              symbol: t.from_token_network, 
              icon: t.from_currency?.icon_url || t.from_currency?.symbol?.[0] || 'F' 
            }, 
            to: { 
              amount: t.to_amount, 
              currency: t.to_currency?.symbol || 'BTC', 
              icon: t.to_currency?.icon_url || t.to_currency?.symbol?.[0] || 'T' 
            }, 
            status: t.status.charAt(0).toUpperCase() + t.status.slice(1), 
            exchangeId: t.exchange_id 
          }));
          setTransactions(mappedTransactions);
        }
      } catch (err) {
        console.error("Audit trail fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const getStatusInfo = (status) => {
    switch (status) {
      case "Waiting": 
      case "Pending":
        return { color: "bg-amber-500/10 text-amber-500 border-amber-500/20", label: "Queued" };
      case "Approved": 
      case "Completed":
        return { color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", label: "Verified" };
      case "Cancel": 
      case "Rejected":
        return { color: "bg-red-500/10 text-red-500 border-red-500/20", label: "Voided" };
      default: 
        return { color: "bg-gray-500/10 text-gray-500 border-gray-500/20", label: status };
    }
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
          <div className="flex items-center justify-between py-8 sm:py-10">
            <div className="flex items-center gap-6">
              <button onClick={onBack} className="p-4 btn-ghost rounded-2xl group active:scale-95">
                <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
              </button>
              <div>
                <h1 className="text-4xl font-black tracking-tighter" style={{ color: 'var(--text-primary)' }}>Audit Trail</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mt-1">Immutable Transaction Logs</p>
              </div>
            </div>
            <button
              onClick={() => setShowFilter(true)}
              className="p-4 btn-ghost rounded-2xl text-gray-400 hover:text-blue-500 transition-all active:scale-95"
            >
              <SlidersHorizontal className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="space-y-12">
          {transactions.map((transaction, index) => {
            const showDate = index === 0 || transactions[index - 1].date !== transaction.date;
            const statusInfo = getStatusInfo(transaction.status);
            
            return (
              <div key={transaction.id} className="space-y-6">
                {showDate && (
                   <div className="flex items-center gap-6 px-2">
                       <div className="flex items-center gap-2">
                         <Calendar className="w-4 h-4 text-gray-400" />
                         <span className="text-[10px] font-black uppercase text-gray-500 tracking-[0.4em]">{transaction.date}</span>
                       </div>
                       <div className="h-px bg-gradient-to-r from-gray-200 dark:from-gray-800 to-transparent flex-1"></div>
                   </div>
                )}

                <div className="card p-6 sm:p-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-8 group animate-fade-in relative overflow-hidden transition-all hover:bg-gray-50/50 dark:hover:bg-gray-900/10">
                  <div className="flex-1 flex items-center justify-between sm:justify-start gap-10">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl transition-transform group-hover:scale-110 group-hover:rotate-6 overflow-hidden">
                        {transaction.from.icon?.length > 2 ? <img src={transaction.from.icon} alt="" className="w-full h-full object-cover" /> : transaction.from.icon}
                      </div>
                      <div>
                        <p className="font-black text-2xl tracking-tighter tabular-nums truncate max-w-[150px] sm:max-w-none" style={{ color: 'var(--text-primary)' }}>
                          {transaction.from.amount} {transaction.from.currency}
                        </p>
                        <p className="text-[10px] font-black uppercase tracking-widest mt-1" style={{ color: 'var(--text-muted)' }}>
                          Initiated • {transaction.from.symbol || 'System'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-blue-500">
                      <div className="h-px w-8 bg-blue-500/20"></div>
                      <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                      <div className="h-px w-8 bg-blue-500/20"></div>
                    </div>

                    <div className="flex items-center gap-6 text-right sm:text-left">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl order-last sm:order-first transition-transform group-hover:scale-110 group-hover:-rotate-6 overflow-hidden">
                        {transaction.to.icon?.length > 2 ? <img src={transaction.to.icon} alt="" className="w-full h-full object-cover" /> : transaction.to.icon}
                      </div>
                      <div className="order-first sm:order-last">
                        <p className="font-black text-2xl tracking-tighter tabular-nums truncate max-w-[150px] sm:max-w-none" style={{ color: 'var(--text-primary)' }}>
                          {transaction.to.amount} {transaction.to.currency}
                        </p>
                        <p className="text-[10px] font-black uppercase tracking-widest mt-1" style={{ color: 'var(--text-muted)' }}> Settlement Asset </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-10 sm:pl-10 sm:border-l border-gray-100 dark:border-gray-800">
                    <div className="flex flex-col items-end">
                       <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                      <div className="flex items-center gap-2 mt-2 opacity-40">
                         <ShieldCheck className="w-3 h-3" />
                         <span className="text-[9px] font-black uppercase tracking-widest">SECURE_LOG</span>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tracking ID</p>
                       <p className="text-xs font-black mt-1" style={{ color: 'var(--text-primary)' }}>{transaction.exchangeId.split(':')[1]?.slice(-8) || transaction.exchangeId.slice(-8)}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {transactions.length === 0 && (
            <div className="text-center py-24 card border-dashed border-2">
              <History className="w-16 h-16 text-gray-200 mx-auto mb-6 animate-pulse" />
              <h3 className="text-xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>Immutable Log Empty</h3>
              <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>No historical records currently available in the master audit trail.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHistory;

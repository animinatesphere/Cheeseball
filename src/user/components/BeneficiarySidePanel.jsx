import React, { useState, useEffect } from "react";
import { X, Plus, Landmark, CheckCircle2, Loader2, User, CreditCard } from "lucide-react";
import { sellService } from "../../lib/sellService";

const BeneficiarySidePanel = ({ isOpen, onClose, onSelect }) => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("list"); // "list" or "create"
  const [formData, setFormData] = useState({
    account_name: "",
    bank_name: "",
    account_number: "",
    account_type: "savings",
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const fetchBeneficiaries = async () => {
    setLoading(true);
    try {
      const data = await sellService.getBeneficiaries();
      setBeneficiaries(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load bank accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchBeneficiaries();
      setView("list");
    }
  }, [isOpen]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError("");
    try {
      const newBeneficiary = await sellService.createBeneficiary(formData);
      setBeneficiaries(prev => [newBeneficiary, ...prev]);
      setView("list");
      setFormData({ account_name: "", bank_name: "", account_number: "", account_type: "savings" });
    } catch (err) {
      setError(err.message || "Failed to create bank account");
    } finally {
      setCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="sora font-black text-slate-900 text-xl">
            {view === "list" ? "Bank Accounts" : "Add Bank Account"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              {error}
            </div>
          )}

          {view === "list" ? (
            <div className="space-y-4">
              <button 
                onClick={() => setView("create")}
                className="w-full p-6 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center gap-3 hover:border-blue-400 hover:bg-blue-50/30 transition-all group"
              >
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus size={24} />
                </div>
                <span className="sora font-black text-sm text-slate-900">Add New Account</span>
              </button>

              {loading ? (
                <div className="flex flex-col items-center py-12 gap-4">
                  <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading accounts...</span>
                </div>
              ) : beneficiaries.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-400 text-sm font-bold">No bank accounts found</p>
                </div>
              ) : (
                beneficiaries.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => onSelect(b)}
                    className="w-full text-left p-6 bg-slate-50 border border-slate-100 rounded-[2rem] hover:border-blue-300 hover:bg-blue-50/30 transition-all group relative overflow-hidden"
                  >
                    <div className="relative z-10 flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-blue-600">
                        <Landmark size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="sora font-black text-slate-900 text-sm truncate">{b.account_name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{b.bank_name}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-200" />
                          <span className="text-[10px] font-bold text-slate-500 tracking-wider">****{b.account_number.slice(-4)}</span>
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                         <div className="w-8 h-8 bg-blue-600 text-white rounded-xl flex items-center justify-center">
                            <Plus size={16} />
                         </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          ) : (
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Account Holder Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      required
                      type="text"
                      value={formData.account_name}
                      onChange={(e) => setFormData(p => ({ ...p, account_name: e.target.value }))}
                      placeholder="e.g. John Doe"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-blue-300 focus:bg-white outline-none transition-all font-bold text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Bank Name</label>
                  <div className="relative">
                    <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      required
                      type="text"
                      value={formData.bank_name}
                      onChange={(e) => setFormData(p => ({ ...p, bank_name: e.target.value }))}
                      placeholder="e.g. Access Bank"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-blue-300 focus:bg-white outline-none transition-all font-bold text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Account Number</label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      required
                      type="text"
                      maxLength="10"
                      pattern="[0-9]*"
                      value={formData.account_number}
                      onChange={(e) => setFormData(p => ({ ...p, account_number: e.target.value.replace(/\D/g, '') }))}
                      placeholder="0123456789"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-blue-300 focus:bg-white outline-none transition-all font-bold text-sm tracking-widest"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {['savings', 'current'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, account_type: type }))}
                      className={`py-4 rounded-2xl border transition-all sora font-black text-[10px] uppercase tracking-widest ${
                        formData.account_type === type 
                          ? "border-blue-600 bg-blue-50 text-blue-700" 
                          : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setView("list")}
                  className="flex-1 py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-[2] py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                >
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus size={16} />}
                  Save Account
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center leading-relaxed">
              Saved accounts are encrypted and used only for your payouts.
           </p>
        </div>
      </div>
    </div>
  );
};

export default BeneficiarySidePanel;

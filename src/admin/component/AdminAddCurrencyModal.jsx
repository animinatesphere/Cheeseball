import React, { useState } from "react";
import { X, Check, Loader2 } from "lucide-react";
import { createCurrency } from "../../lib/api";

const AdminAddCurrencyModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    price: "",
    change_24h: "+0.00%",
    is_positive: true,
    color_class: "bg-blue-500",
    icon_url: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await createCurrency(formData);
    setLoading(false);
    
    if (data) {
      onSave(data[0]);
    } else {
      console.error("Error creating currency:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl animate-bounce-in overflow-hidden">
        <div className="p-8 sm:p-10">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">New Asset</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-xl transition-all active:scale-95"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 px-1">Asset Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Bitcoin"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-100 outline-none transition-all font-bold text-gray-900 shadow-inner"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 px-1">Symbol</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BTC"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                  className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-100 outline-none transition-all font-bold text-gray-900 shadow-inner"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 px-1">Price (USD)</label>
                <input
                  type="number"
                  required
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-100 outline-none transition-all font-bold text-gray-900 shadow-inner"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-blue-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Deploy Asset <Check className="w-5 h-5" /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAddCurrencyModal;

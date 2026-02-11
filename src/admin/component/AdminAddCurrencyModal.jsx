import React, { useState } from "react";
import { X, Upload } from "lucide-react";

const AdminAddCurrencyModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "Bitcoin",
    symbol: "BTC",
    dataLink: "https://btcdatachart.com",
    network: "BTC Network",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl animate-bounce-in overflow-hidden">
        <div className="p-8 sm:p-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Add Currency</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-xl transition-all active:scale-95"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 px-1">
                  Asset Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bitcoin"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-300 outline-none transition-all font-bold text-gray-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 px-1">
                  Symbol
                </label>
                <input
                  type="text"
                  placeholder="e.g. BTC"
                  value={formData.symbol}
                  onChange={(e) =>
                    setFormData({ ...formData, symbol: e.target.value })
                  }
                  className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-300 outline-none transition-all font-bold text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 px-1">
                Network Protocol
              </label>
              <input
                type="text"
                placeholder="e.g. ERC-20"
                value={formData.network}
                onChange={(e) =>
                  setFormData({ ...formData, network: e.target.value })
                }
                className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-300 outline-none transition-all font-bold text-gray-900"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 px-1">
                Oracle Data Link
              </label>
              <input
                type="text"
                value={formData.dataLink}
                onChange={(e) =>
                  setFormData({ ...formData, dataLink: e.target.value })
                }
                className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-300 outline-none transition-all font-bold text-gray-900"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 px-1">
                Visual Identity
              </label>
              <div className="w-full h-32 bg-gray-50 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-all border-2 border-dashed border-gray-200 group">
                <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform mb-2">
                  <Upload className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Upload Emblem</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98]"
            >
              Verify & Add Asset
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAddCurrencyModal;

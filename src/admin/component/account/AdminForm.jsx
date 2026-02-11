import React from "react";
import { X, ShieldCheck } from "lucide-react";

const AdminForm = ({ title, type, onClose, onSave, accountName }) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl animate-bounce-in overflow-hidden">
        <div className="p-8 sm:p-10">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">{title}</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-xl transition-all active:scale-95"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <div className="space-y-8">
             <div className="bg-blue-50 p-6 rounded-2xl flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                   <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest leading-none mb-1">Account Target</p>
                   <p className="font-black text-blue-600 text-lg">{accountName || "Provisioning New Identity"}</p>
                </div>
             </div>

            <div className="space-y-6">
              {type === "new" && (
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 px-1">
                    System Level / Admin Rank
                  </label>
                  <input
                    type="text"
                    defaultValue="2"
                    className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-100 outline-none transition-all font-bold text-gray-900 shadow-inner"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 px-1">
                  Verified Identity Name
                </label>
                <input
                  type="text"
                  defaultValue={accountName || ""}
                  className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-100 outline-none transition-all font-bold text-gray-900 shadow-inner"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 px-1">
                  Cryptographic Passphrase
                </label>
                <input
                  type="password"
                  placeholder="Enter secure key..."
                  className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-100 outline-none transition-all font-bold text-gray-900 shadow-inner"
                />
              </div>
            </div>

            <button
              onClick={() => onSave({})}
              className="w-full mt-4 bg-blue-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98]"
            >
              Authorize & Commit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminForm;

import React from "react";
import { X, BellRing, Calendar, Clock } from "lucide-react";

const AdminNotificationForm = ({ onClose, onSave }) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl animate-bounce-in overflow-hidden">
        <div className="p-8 sm:p-10">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Signal Broadcast</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-xl transition-all active:scale-95"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <div className="space-y-8">
            <div className="flex items-center gap-5 p-6 bg-blue-50 rounded-2xl">
               <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                  <BellRing className="w-8 h-8" />
               </div>
               <div>
                  <h3 className="font-black text-blue-600 text-lg">Broadcast Logic</h3>
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none mt-1">Global Alert System</p>
               </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 px-1">
                  Subject Header
                </label>
                <input
                  type="text"
                  placeholder="Enter transmission title..."
                  className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-100 outline-none transition-all font-bold text-gray-900 shadow-inner"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 px-1">
                    Release Date
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      defaultValue="11:00am"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-100 outline-none transition-all font-bold text-gray-900 shadow-inner"
                    />
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 px-1">
                    Release Time
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      defaultValue="05:00pm"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-100 outline-none transition-all font-bold text-gray-900 shadow-inner"
                    />
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 px-1">
                  Payload Metadata (Body)
                </label>
                <textarea
                  placeholder="Describe the alert parameters..."
                  className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-100 outline-none transition-all font-bold text-gray-900 shadow-inner h-32 resize-none"
                />
              </div>
            </div>

            <button
              onClick={() => onSave({})}
              className="w-full mt-4 bg-blue-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98]"
            >
              Initialize Broadcast
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotificationForm;

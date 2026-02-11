import React from "react";
import AdminAccountHeader from "./AdminAccountHeader";
import { Info, Mail, Phone } from "lucide-react";

const AdminSupportSettings = ({ onBack, onSave }) => {
  return (
    <div className="flex-1 overflow-y-auto pb-32 animate-fade-in">
      <AdminAccountHeader title="Response Protocol" onBack={onBack} />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-yellow-50 border-2 border-yellow-100 rounded-[2rem] p-6 sm:p-8 flex items-start gap-5 mb-10 group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-100 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700 opacity-50"></div>
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-yellow-600 shadow-sm shrink-0">
             <Info className="w-6 h-6" />
          </div>
          <div className="relative z-10 pt-1">
            <h4 className="font-black text-yellow-800 text-lg leading-tight mb-1">Operational Maintenance</h4>
            <p className="text-sm font-bold text-yellow-700/80 leading-relaxed">
              Ensure support credentials and communication bridges (WhatsApp/Email) are current to maintain system uptime.
            </p>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-50 rounded-[2.5rem] p-8 sm:p-10 shadow-sm space-y-8">
           <section>
              <label className="block text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-2 mb-4">Official Escalation Channel</label>
              <div className="relative group">
                <input
                  type="email"
                  defaultValue="customersupport@loopay.com"
                  className="w-full pl-14 pr-6 py-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-100 outline-none transition-all font-black text-gray-900 shadow-inner"
                />
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              </div>
           </section>

           <section>
              <label className="block text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-2 mb-4">Immediate Response Hotline</label>
              <div className="flex flex-col sm:flex-row gap-4">
                 <div className="w-full sm:w-32">
                    <select className="w-full px-5 py-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-100 outline-none transition-all font-black text-gray-900 shadow-inner appearance-none text-center">
                      <option>+234</option>
                      <option>+1</option>
                      <option>+44</option>
                    </select>
                 </div>
                 <div className="flex-1 relative group">
                    <input
                      type="tel"
                      defaultValue="9012456789"
                      className="w-full pl-14 pr-6 py-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-100 outline-none transition-all font-black text-gray-900 shadow-inner"
                    />
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                 </div>
              </div>
           </section>

           <button
              onClick={onSave}
              className="w-full mt-4 bg-blue-600 text-white py-6 rounded-3xl font-black text-xl shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98]"
           >
              Update Security Matrix
           </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSupportSettings;

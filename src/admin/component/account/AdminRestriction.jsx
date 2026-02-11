import React from "react";
import AdminAccountHeader from "./AdminAccountHeader";

const AdminRestriction = ({ admin, onBack, onUpdatePassword }) => {
  return (
    <div className="flex-1 overflow-y-auto pb-32 animate-fade-in">
      <AdminAccountHeader title="Access Controls" onBack={onBack} />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-blue-50 rounded-[2.5rem] p-8 sm:p-10 border border-blue-100 shadow-sm mb-10 group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700 opacity-50"></div>
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">{admin?.name || "Creative Omotayo"}</h2>
              <p className="text-blue-600 font-bold mt-1">creativeomotayo@gmail.com</p>
            </div>
            <span className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-full shadow-lg shadow-blue-100">
              {admin?.role || "System Admin"}
            </span>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-50 rounded-[2.5rem] p-8 sm:p-10 shadow-sm mb-10">
          <h3 className="text-gray-900 font-black uppercase text-xs tracking-[0.2em] ml-2 mb-8 px-2">Module Permissions</h3>
          <div className="space-y-4">
            {["Asset Management", "Revenue Insights", "Order Verification", "Audit Trial", "System Oracle"].map(
              (item) => (
                <div key={item} className="flex justify-between items-center p-5 bg-gray-50 rounded-2xl border border-transparent hover:border-blue-100 transition-all">
                  <span className="font-black text-gray-900 text-sm tracking-tight">{item}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-200 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              )
            )}
          </div>
        </div>

        <button
          onClick={onUpdatePassword}
          className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black text-xl shadow-2xl shadow-blue-200 transform hover:-translate-y-1 transition-all active:scale-[0.98]"
        >
          Secure Credentials Upgrade
        </button>
      </div>
    </div>
  );
};

export default AdminRestriction;

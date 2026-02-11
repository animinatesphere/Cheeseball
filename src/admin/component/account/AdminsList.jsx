import React from "react";
import { Plus, Trash2, ChevronLeft } from "lucide-react";

const AdminsList = ({ admins, onBack, onAdd, onSelectAdmin }) => {
  return (
    <div className="flex-1 overflow-y-auto pb-32 animate-fade-in">
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-gray-100 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-6">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2.5 hover:bg-gray-100 rounded-xl transition-all active:scale-95">
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">System Admins</h1>
          </div>
          <button
            onClick={onAdd}
            className="bg-blue-600 text-white p-3 rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline font-black uppercase text-[10px] tracking-widest px-1">Provision Admin</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-100 mb-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 transform group-hover:scale-110 transition-transform duration-700"></div>
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
                 <span className="text-2xl font-black">CO</span>
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight">Creative Omotayo</h2>
                <p className="text-blue-100 font-bold">creativeomotayo@gmail.com</p>
              </div>
            </div>
            <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-full border border-white/20">
              Super Administrator
            </span>
          </div>
        </div>

        <h3 className="text-gray-900 font-black uppercase text-xs tracking-[0.2em] ml-2 mb-6">Sub-Admins Pool</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {admins.map((admin) => (
            <div
              key={admin.id}
              onClick={() => onSelectAdmin(admin)}
              className="bg-white rounded-[2rem] p-6 flex flex-col items-start gap-6 hover:shadow-2xl hover:border-blue-100 border border-gray-50 transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start w-full">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black text-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                    {admin.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 group-hover:text-blue-600 transition-colors truncate max-w-[120px]">{admin.name}</h4>
                    <span className="inline-block bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md mt-1">
                      {admin.role}
                    </span>
                  </div>
                </div>
                <button className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-95">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="w-full pt-4 border-t border-gray-50 flex items-center justify-between mt-auto">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Manage Permission</span>
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                   <ChevronLeft className="w-4 h-4 rotate-180" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminsList;

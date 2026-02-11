import React from "react";
import { ArrowLeft } from "lucide-react";

const AdminAccountHeader = ({ title, onBack }) => {
  return (
    <div className="flex items-center gap-4 py-6 sm:py-8 border-b border-gray-100 mb-8 sticky top-0 bg-white/80 backdrop-blur-md z-10 w-full px-4 sm:px-6">
      <button onClick={onBack} className="p-3 hover:bg-gray-100 rounded-xl transition-all active:scale-95">
        <ArrowLeft className="w-6 h-6 text-gray-900" />
      </button>
      <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">{title}</h1>
    </div>
  );
};

export default AdminAccountHeader;

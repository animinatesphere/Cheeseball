import React, { useState } from "react";
import { Search, Bookmark, ChevronLeft } from "lucide-react";

const AddressBook = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState("saved");
  const [addresses, setAddresses] = useState([
    { id: 1, address: "0x52d39886F8022764880FF788DdE280F6C5D3CCb", saved: true },
    { id: 2, address: "0x52d39886F8022764880FF788DdE280F6C5D3CCb", saved: true },
    { id: 3, address: "0x52d39886F8022764880FF788DdE280F6C5D3CCb", saved: true },
    { id: 4, address: "0x52d39886F8022764880FF788DdE280F6C5D3CCb", saved: true },
  ]);

  const toggleSave = (id) => {
    setAddresses(
      addresses.map((addr) =>
        addr.id === id ? { ...addr, saved: !addr.saved } : addr
      )
    );
  };

  const filteredAddresses =
    activeTab === "saved" ? addresses.filter((addr) => addr.saved) : addresses;

  return (
    <div className="min-h-screen bg-white pb-32">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <button onClick={onBack} className="mb-8 p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-4xl font-black mb-2 tracking-tight">Address Book</h1>
          <p className="text-blue-200 font-medium">Manage your favorite crypto destinations</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8">
        <div className="bg-white rounded-[2rem] shadow-xl p-8 lg:p-12 border border-gray-100 flex flex-col gap-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="bg-gray-100 rounded-[1.5rem] p-1.5 flex w-full md:w-80">
              <button
                onClick={() => setActiveTab("recent")}
                className={`flex-1 py-3 rounded-[1.2rem] font-black tracking-tight transition-all ${
                  activeTab === "recent" ? "bg-white text-blue-600 shadow-lg shadow-blue-50" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Recent
              </button>
              <button
                onClick={() => setActiveTab("saved")}
                className={`flex-1 py-3 rounded-[1.2rem] font-black tracking-tight transition-all ${
                  activeTab === "saved" ? "bg-white text-blue-600 shadow-lg shadow-blue-50" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Saved
              </button>
            </div>

            <div className="relative flex-1 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={24} />
              <input
                type="text"
                placeholder="Search by address or label..."
                className="w-full pl-16 pr-8 py-5 bg-gray-50 border-2 border-transparent focus:border-blue-100 rounded-[1.5rem] font-bold text-gray-900 placeholder-gray-300 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAddresses.map((addr) => (
              <div
                key={addr.id}
                className="group bg-white rounded-[2rem] p-6 border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:-translate-y-1 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 font-black text-2xl border border-orange-100">
                    ₿
                  </div>
                  <button onClick={() => toggleSave(addr.id)} className="p-2 hover:bg-blue-50 rounded-xl transition-all">
                    <Bookmark size={24} className={addr.saved ? "fill-blue-600 text-blue-600" : "text-gray-300"} />
                  </button>
                </div>
                
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-2 px-1">Receiver Address</p>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs font-mono font-bold text-gray-600 break-all leading-relaxed">
                    {addr.address}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressBook;

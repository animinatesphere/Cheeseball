import React, { useState } from "react";
import { Search, Bookmark, ChevronLeft } from "lucide-react";

const AddressBook = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState("saved");
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      address: "0x52d39886F8022764880FF788DdE280F6C5D3CCb",
      saved: true,
    },
    {
      id: 2,
      address: "0x52d39886F8022764880FF788DdE280F6C5D3CCb",
      saved: true,
    },
    {
      id: 3,
      address: "0x52d39886F8022764880FF788DdE280F6C5D3CCb",
      saved: true,
    },
    {
      id: 4,
      address: "0x52d39886F8022764880FF788DdE280F6C5D3CCb",
      saved: true,
    },
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 flex items-center">
        <button onClick={onBack} className="mr-4">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold">Address book</h1>
      </div>

      {/* Tabs */}
      <div className="bg-white px-6 pt-6">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("recent")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "recent"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600"
            }`}
          >
            Recent
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "saved"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600"
            }`}
          >
            Saved
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-4 mb-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Enter an address or name"
              className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Address List */}
      <div className="bg-white px-6 pb-6">
        {filteredAddresses.map((addr) => (
          <div
            key={addr.id}
            className="flex items-center py-4 border-b border-gray-100 last:border-b-0"
          >
            {/* Bitcoin Icon */}
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <span className="text-white font-bold text-lg">₿</span>
            </div>

            {/* Address Info */}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 mb-1">address</p>
              <p className="text-xs font-mono text-gray-900 truncate">
                {addr.address}
              </p>
            </div>

            {/* Bookmark Button */}
            <button
              onClick={() => toggleSave(addr.id)}
              className="ml-3 flex-shrink-0"
            >
              <Bookmark
                size={20}
                className={`${
                  addr.saved ? "fill-blue-600 text-blue-600" : "text-gray-400"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressBook;

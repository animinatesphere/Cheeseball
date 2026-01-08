import React, { useState } from "react";
import {
  TrendingUp,
  RefreshCw,
  FileText,
  User,
  Search,
  Plus,
  X,
  Upload,
  ChevronDown,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";

// Bottom Navigation Component
function BottomNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: "rate", label: "Rate", icon: TrendingUp },
    { id: "orders", label: "Orders", icon: RefreshCw },
    { id: "history", label: "History", icon: FileText },
    { id: "account", label: "Account", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue-600 shadow-lg z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                activeTab === tab.id ? "text-white" : "text-blue-200"
              }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Dashboard Screen
function Dashboard({ onNavigate }) {
  return (
    <div className="flex-1 overflow-y-auto pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      <div className="flex justify-between items-center py-4 sm:py-6">
        <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>
        <button className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 text-sm sm:text-base">
          Today <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-blue-600 font-semibold text-sm sm:text-base">
            Todays Orders
          </h2>
          <span className="text-gray-500 text-xs sm:text-sm">02 Nov, 2023</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="60"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="12"
              />
              <circle
                cx="50%"
                cy="50%"
                r="60"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="12"
                strokeDasharray="377"
                strokeDashoffset="94"
                strokeLinecap="round"
              />
              <circle
                cx="50%"
                cy="50%"
                r="60"
                fill="none"
                stroke="#93C5FD"
                strokeWidth="12"
                strokeDasharray="377"
                strokeDashoffset="188"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-2xl sm:text-3xl font-bold">5,824,213</div>
              <div className="text-xs sm:text-sm text-gray-400">Total</div>
            </div>
          </div>

          <div className="space-y-3 flex-1 w-full sm:w-auto">
            <div className="flex items-center gap-3">
              <div className="w-12 h-1 bg-blue-200 rounded"></div>
              <div className="flex-1">
                <div className="text-xs sm:text-sm text-gray-500">
                  Active Orders
                </div>
                <div className="font-semibold text-sm sm:text-base">
                  5 Orders
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-1 bg-blue-600 rounded"></div>
              <div className="flex-1">
                <div className="text-xs sm:text-sm text-gray-500">
                  Completed Orders
                </div>
                <div className="font-semibold text-sm sm:text-base">
                  45 Orders
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-1 bg-blue-100 rounded"></div>
              <div className="flex-1">
                <div className="text-xs sm:text-sm text-gray-500">
                  Canceled Orders
                </div>
                <div className="font-semibold text-sm sm:text-base">
                  10 Orders
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
          <div className="text-gray-600 text-sm sm:text-base mb-2">
            Active Currencies
          </div>
          <div className="text-3xl sm:text-4xl font-bold text-blue-600">
            567
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
          <div className="text-gray-600 text-sm sm:text-base mb-2">
            All Currencies
          </div>
          <div className="text-3xl sm:text-4xl font-bold text-blue-600">78</div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-gray-600 text-sm font-medium">Quick action</h3>
        <button
          onClick={() => onNavigate("rate")}
          className="w-full bg-gray-50 rounded-xl p-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
        >
          <span className="font-medium">Currencies</span>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
        <button className="w-full bg-gray-50 rounded-xl p-4 flex items-center justify-between hover:bg-gray-100 transition-colors">
          <span className="font-medium">Update wallet</span>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>
  );
}

// Currencies Screen
function Currencies({ onAddCurrency }) {
  const [activeView, setActiveView] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");

  const currencies = [
    {
      id: 1,
      name: "AAVE",
      symbol: "Aave",
      price: "$69.7100",
      change: "+2.24%",
      positive: true,
      color: "bg-blue-500",
      icon: "A",
    },
    {
      id: 2,
      name: "AAVE",
      symbol: "Aave",
      price: "$69.7100",
      change: "+2.24%",
      positive: true,
      color: "bg-red-500",
      icon: "A",
    },
    {
      id: 3,
      name: "AAVE",
      symbol: "Aave",
      price: "$69.7100",
      change: "+2.24%",
      positive: true,
      color: "bg-orange-500",
      icon: "₿",
    },
    {
      id: 4,
      name: "AAVE",
      symbol: "Aave",
      price: "$69.7100",
      change: "+2.24%",
      positive: true,
      color: "bg-yellow-500",
      icon: "◈",
    },
    {
      id: 5,
      name: "AAVE",
      symbol: "Aave",
      price: "$69.7100",
      change: "-2.24%",
      positive: false,
      color: "bg-yellow-600",
      icon: "Ð",
    },
    {
      id: 6,
      name: "AAVE",
      symbol: "Aave",
      price: "$69.7100",
      change: "+2.24%",
      positive: true,
      color: "bg-indigo-500",
      icon: "E",
    },
    {
      id: 7,
      name: "AAVE",
      symbol: "Aave",
      price: "$69.7100",
      change: "+2.24%",
      positive: true,
      color: "bg-blue-600",
      icon: "Ł",
    },
    {
      id: 8,
      name: "AAVE",
      symbol: "Aave",
      price: "$69.7100",
      change: "-5.10%",
      positive: false,
      color: "bg-green-400",
      icon: "S",
    },
  ];

  const MiniChart = ({ positive }) => (
    <svg width="80" height="30" viewBox="0 0 80 30" className="mx-2">
      <defs>
        <linearGradient
          id={`grad-${positive}`}
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop
            offset="0%"
            stopColor={positive ? "#10B981" : "#EF4444"}
            stopOpacity="0.3"
          />
          <stop
            offset="100%"
            stopColor={positive ? "#10B981" : "#EF4444"}
            stopOpacity="0"
          />
        </linearGradient>
      </defs>
      <path
        d="M0,20 Q10,15 20,12 T40,10 T60,8 T80,5"
        fill="none"
        stroke={positive ? "#10B981" : "#EF4444"}
        strokeWidth="2"
      />
      <path
        d="M0,20 Q10,15 20,12 T40,10 T60,8 T80,5 L80,30 L0,30 Z"
        fill={`url(#grad-${positive})`}
      />
    </svg>
  );

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      <div className="sticky top-0 bg-white z-10 border-b border-gray-100">
        <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <button className="w-8 h-8 flex items-center justify-center">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold">Currencies</h1>
            </div>
            <button
              onClick={onAddCurrency}
              className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for currency"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-2 pb-4">
            <button
              onClick={() => setActiveView("active")}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                activeView === "active"
                  ? "bg-white shadow-sm text-gray-900"
                  : "bg-transparent text-gray-500"
              }`}
            >
              Active currencies
            </button>
            <button
              onClick={() => setActiveView("all")}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                activeView === "all"
                  ? "bg-white shadow-sm text-gray-900"
                  : "bg-transparent text-gray-500"
              }`}
            >
              All currencies
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {activeView === "active" ? (
          <div className="space-y-2 py-4">
            {currencies.map((currency) => (
              <div
                key={currency.id}
                className="bg-white rounded-lg p-4 flex items-center gap-4 hover:shadow-md transition-shadow border border-gray-100"
              >
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 ${currency.color} rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}
                >
                  {currency.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-base sm:text-lg">
                    {currency.name}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    {currency.symbol}
                  </div>
                </div>
                <div className="hidden sm:block flex-shrink-0">
                  <MiniChart positive={currency.positive} />
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-bold text-gray-500 text-sm sm:text-base">
                    {currency.price}
                  </div>
                  <div
                    className={`text-xs sm:text-sm font-medium ${
                      currency.positive ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {currency.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2 py-4">
            {currencies.map((currency) => (
              <div
                key={currency.id}
                className="bg-white rounded-lg p-4 flex items-center gap-4 hover:shadow-md transition-shadow border border-gray-100"
              >
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}
                >
                  A
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-base sm:text-lg">
                    {currency.name}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    {currency.symbol}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-bold text-gray-500 text-sm sm:text-base">
                    {currency.price}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-green-500">
                    {currency.change}
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Add Currency Modal
function AddCurrencyModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "Bitcoin",
    symbol: "BTC",
    dataLink: "https://btcdatachart.com",
  });

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Add Currency</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Coin/Token Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Coin/Token Symbol
              </label>
              <input
                type="text"
                value={formData.symbol}
                onChange={(e) =>
                  setFormData({ ...formData, symbol: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Data Link
              </label>
              <input
                type="text"
                value={formData.dataLink}
                onChange={(e) =>
                  setFormData({ ...formData, dataLink: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Upload Coin/Token emblem
              </label>
              <div className="w-full h-32 bg-gray-50 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors border-2 border-dashed border-gray-300">
                <Upload className="w-12 h-12 text-blue-500 mb-2" />
                <span className="text-sm text-gray-500">Click to upload</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full mt-6 bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// Main App Component
export default function AdminDashboard() {
  const [currentScreen, setCurrentScreen] = useState("dashboard");
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddCurrency = () => {
    setShowAddModal(true);
  };

  const handleSaveCurrency = (data) => {
    console.log("Saving currency:", data);
    setShowAddModal(false);
    setCurrentScreen("rate");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col overflow-hidden">
        {currentScreen === "dashboard" && (
          <Dashboard onNavigate={setCurrentScreen} />
        )}
        {currentScreen === "rate" && (
          <Currencies onAddCurrency={handleAddCurrency} />
        )}
        {currentScreen === "orders" && (
          <div className="flex-1 flex items-center justify-center pb-20">
            <div className="text-center">
              <RefreshCw className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Orders screen coming soon</p>
            </div>
          </div>
        )}
        {currentScreen === "history" && (
          <div className="flex-1 flex items-center justify-center pb-20">
            <div className="text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">History screen coming soon</p>
            </div>
          </div>
        )}
        {currentScreen === "account" && (
          <div className="flex-1 flex items-center justify-center pb-20">
            <div className="text-center">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Account screen coming soon</p>
            </div>
          </div>
        )}
      </div>

      <BottomNav activeTab={currentScreen} onTabChange={setCurrentScreen} />

      {showAddModal && (
        <AddCurrencyModal
          onClose={() => setShowAddModal(false)}
          onSave={handleSaveCurrency}
        />
      )}
    </div>
  );
}

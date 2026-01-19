import React, { useState } from "react";
import {
  X,
  ChevronRight,
  Menu,
  Copy,
  MoreVertical,
  Calendar,
  TrendingUp,
  RefreshCw,
  FileText,
  User,
  Search,
  Plus,
  Upload,
  ChevronDown,
  ArrowLeft,
  ChevronLeft,
  SlidersHorizontal,
  ArrowRight,
  // Plus,
  // X,
  // Menu,
  Wallet,
  Users,
  Bell,
  MessageCircle,
  // Copy,
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
      <div className="flex justify-around items-center h-16 ">
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

// Orders Component
function OrdersScreen() {
  const [currentPage, setCurrentPage] = useState("orders");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const orders = [
    {
      id: 1,
      date: "02 July 2023",
      fromAmount: "5000 USDT",
      fromToken: "TRC-20",
      toAmount: "0.002445 BTC",
      toToken: "BTC",
      status: "Waiting",
      exchangeId: "ID:voec66skoivtqpmd",
      email: "Cheese Balls 05",
      fullName: "Cheese Balls 05",
      phone: "Loopay",
      address: "Tcndjh73j6fhe78ej87hwey73h",
      transactionHash: "243h7dyjf7e7jh89e...",
      fee: "-7.89",
      network: "TRC-20",
      transactionDate: "Feb 2, 2025 at 2:52 am",
    },
    {
      id: 2,
      date: "02 July 2023",
      fromAmount: "5000 USDT",
      fromToken: "TRC-20",
      toAmount: "0.002445 BTC",
      toToken: "BTC",
      status: "Approved",
      exchangeId: "ID:voec66skoivtqpmd",
      email: "Cheese Balls 05",
      fullName: "Cheese Balls 05",
      phone: "Loopay",
      address: "Tcndjh73j6fhe78ej87hwey73h",
      transactionHash: "243h7dyjf7e7jh89e...",
      fee: "-7.89",
      network: "TRC-20",
      transactionDate: "Feb 2, 2025 at 2:52 am",
    },
    {
      id: 3,
      date: "02 July 2023",
      fromAmount: "5000 USDT",
      fromToken: "TRC-20",
      toAmount: "0.002445 BTC",
      toToken: "BTC",
      status: "Waiting",
      exchangeId: "ID:voec66skoivtqpmd",
      email: "Cheese Balls 05",
      fullName: "Cheese Balls 05",
      phone: "Loopay",
      address: "Tcndjh73j6fhe78ej87hwey73h",
      transactionHash: "243h7dyjf7e7jh89e...",
      fee: "-7.89",
      network: "TRC-20",
      transactionDate: "Feb 2, 2025 at 2:52 am",
    },
    {
      id: 4,
      date: "02 July 2023",
      fromAmount: "5000 USDT",
      fromToken: "TRC-20",
      toAmount: "0.002445 BTC",
      toToken: "BTC",
      status: "Approved",
      exchangeId: "ID:voec66skoivtqpmd",
      email: "Cheese Balls 05",
      fullName: "Cheese Balls 05",
      phone: "Loopay",
      address: "Tcndjh73j6fhe78ej87hwey73h",
      transactionHash: "243h7dyjf7e7jh89e...",
      fee: "-7.89",
      network: "TRC-20",
      transactionDate: "Feb 2, 2025 at 2:52 am",
    },
  ];

  // eslint-disable-next-line no-unused-vars
  const [filterActive, setFilterActive] = useState("All");
  const [filterDate, setFilterDate] = useState("All");

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    if (order.status === "Approved") {
      setCurrentPage("completed");
    } else {
      setCurrentPage("pending");
    }
  };

  const handleCheckDetails = () => {
    setCurrentPage("details");
  };

  const handleBack = () => {
    if (currentPage === "details") {
      if (selectedOrder?.status === "Approved") {
        setCurrentPage("completed");
      } else {
        setCurrentPage("pending");
      }
    } else {
      setCurrentPage("orders");
      setSelectedOrder(null);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  // Filter Page
  if (currentPage === "filter") {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <button onClick={() => setCurrentPage("orders")}>
              <X className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold">Filter</h1>
            <div className="w-6"></div>
          </div>

          <div className="p-6">
            {/* Time Filter Buttons */}
            <div className="flex gap-2 mb-6">
              {["All", "Today", "Week", "Month"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setFilterDate(filter)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm ${
                    filterDate === filter
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {filter === "All" && <span className="mr-1">✓</span>}
                  {filter}
                </button>
              ))}
            </div>

            {/* Custom Dates */}
            <div className="mb-6">
              <h3 className="text-center font-semibold mb-4">Custom dates</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-sm text-gray-600 mb-1 block">
                    From
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value="20/07/25"
                      className="w-full p-3 bg-gray-100 rounded-lg text-gray-700"
                      readOnly
                    />
                    <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-sm text-gray-600 mb-1 block">To</label>
                  <div className="relative">
                    <input
                      type="text"
                      value="20/07/25"
                      className="w-full p-3 bg-gray-100 rounded-lg text-blue-600"
                      readOnly
                    />
                    <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Currencies */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Currencies</h3>
              <div className="mb-3">
                <label className="text-sm text-gray-600 mb-2 block">
                  You send
                </label>
                <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                      ₿
                    </div>
                    <div>
                      <div className="font-semibold">Bitcoin</div>
                      <div className="text-sm text-gray-500">BTC</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-blue-600 rotate-90" />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-2 block">
                  You get
                </label>
                <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                      T
                    </div>
                    <div>
                      <div className="font-semibold">5000 USDT</div>
                      <div className="text-sm text-gray-500">TRC-20</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-blue-600 rotate-90" />
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Status</h3>
              <div className="flex gap-2">
                {["Waiting", "Waiting", "Waiting"].map((status, idx) => (
                  <button
                    key={idx}
                    className={`px-6 py-2 rounded-full font-medium text-sm ${
                      idx === 1
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {status}
                    {idx === 1 && <span className="ml-2">×</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear All */}
            <button className="text-blue-600 font-semibold mb-4 w-full text-center">
              Clear all
            </button>

            {/* Ok Button */}
            <button
              onClick={() => setCurrentPage("orders")}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold"
            >
              Ok, I got it
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Details Page
  if (currentPage === "details" && selectedOrder) {
    return (
      <div className="min-h-screen bg-white">
        <div className="">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <button onClick={handleBack}>
              <X className="w-6 h-6" />
            </button>
            <div className="text-center">
              <h1 className="text-lg font-semibold">Details</h1>
              <p className="text-xs text-blue-600">
                Exchange {selectedOrder.exchangeId}
              </p>
            </div>
            <div className="w-6"></div>
          </div>

          <div className="p-6">
            {/* Personal Details */}
            <div className="mb-6">
              <h3 className="font-semibold mb-4">Personal details</h3>

              <div className="mb-4">
                <label className="text-sm text-gray-600 mb-2 block">
                  Email
                </label>
                <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-between">
                  <span className="text-gray-700">{selectedOrder.email}</span>
                  <button
                    onClick={() => copyToClipboard(selectedOrder.email)}
                    className="bg-blue-600 text-white px-4 py-1 rounded text-sm font-medium"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-sm text-gray-600 mb-2 block">
                  Full Name
                </label>
                <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-between">
                  <span className="text-gray-700">
                    {selectedOrder.fullName}
                  </span>
                  <button
                    onClick={() => copyToClipboard(selectedOrder.fullName)}
                    className="bg-blue-600 text-white px-4 py-1 rounded text-sm font-medium"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-sm text-gray-600 mb-2 block">
                  Phone
                </label>
                <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-between">
                  <span className="text-gray-700">{selectedOrder.phone}</span>
                  <button
                    onClick={() => copyToClipboard(selectedOrder.phone)}
                    className="bg-blue-600 text-white px-4 py-1 rounded text-sm font-medium"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>

            {/* Refund Details */}
            <div className="mb-8">
              <h3 className="font-semibold mb-4">Refund details</h3>

              <div className="mb-4">
                <label className="text-sm text-gray-600 mb-2 block">
                  Address(USDT)
                </label>
                <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-between">
                  <span className="text-gray-700 text-sm">
                    {selectedOrder.address}
                  </span>
                  <button
                    onClick={() => copyToClipboard(selectedOrder.address)}
                    className="bg-blue-600 text-white px-4 py-1 rounded text-sm font-medium"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>

            {/* Ok Button */}
            <button
              onClick={handleBack}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold"
            >
              Ok, I got it
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Completed Page
  if (currentPage === "completed" && selectedOrder) {
    return (
      <div className="min-h-screen bg-white">
        <div className=" mb-[4rem]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <button onClick={handleBack}>
              <X className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-green-600">Completed</h1>
            <button>
              <MoreVertical className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            {/* Transaction Summary */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                  T
                </div>
                <div>
                  <div className="font-semibold">
                    {selectedOrder.fromAmount}
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedOrder.fromToken}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                  ₿
                </div>
                <div>
                  <div className="font-semibold">{selectedOrder.toAmount}</div>
                  <div className="text-sm text-gray-500">
                    {selectedOrder.toToken}
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Date</span>
                <span className="text-blue-600 font-medium">
                  {selectedOrder.transactionDate}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Status</span>
                <span className="text-blue-600 font-medium">succeeded</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Network</span>
                <span className="text-blue-600 font-medium">
                  {selectedOrder.network}
                </span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-gray-600">Fee</span>
                <span className="text-blue-600 font-medium">
                  {selectedOrder.fee}
                </span>
              </div>
            </div>

            {/* Swap Details */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold mb-4">Swap Details</h3>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Transaction hash</span>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 text-sm">
                    {selectedOrder.transactionHash}
                  </span>
                  <Copy className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">You Paid</span>
                <span className="text-gray-900 font-medium">
                  {selectedOrder.fromAmount.replace(" ", "")}
                </span>
              </div>
              <div className="flex justify-between py-3 mb-4">
                <span className="text-gray-600">You Received</span>
                <span className="text-gray-900 font-medium">
                  {selectedOrder.toAmount.replace(" ", "")}
                </span>
              </div>
              <button className="text-blue-600 font-medium w-full text-center">
                View on Mercuryo &gt;&gt;
              </button>
            </div>

            {/* Success Message */}
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <p className="text-blue-600 text-sm">
                This transaction was successful, your wallet/account has been
                credited
              </p>
            </div>

            {/* Check Details Button */}
            <button
              onClick={handleCheckDetails}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold"
            >
              Check details
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pending Page
  if (currentPage === "pending" && selectedOrder) {
    return (
      <div className="min-h-screen bg-white">
        <div className=" mb-[4rem]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 ">
            <button onClick={handleBack}>
              <X className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-orange-500">Pending</h1>
            <button>
              <MoreVertical className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            {/* Transaction Summary */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                  T
                </div>
                <div>
                  <div className="font-semibold">
                    {selectedOrder.fromAmount}
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedOrder.fromToken}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                  ₿
                </div>
                <div>
                  <div className="font-semibold">{selectedOrder.toAmount}</div>
                  <div className="text-sm text-gray-500">
                    {selectedOrder.toToken}
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Date</span>
                <span className="text-blue-600 font-medium">
                  {selectedOrder.transactionDate}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Status</span>
                <span className="text-blue-600 font-medium">succeeded</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Network</span>
                <span className="text-blue-600 font-medium">
                  {selectedOrder.network}
                </span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-gray-600">Fee</span>
                <span className="text-blue-600 font-medium">
                  {selectedOrder.fee}
                </span>
              </div>
            </div>

            {/* Swap Details */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold mb-4">Swap Details</h3>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Transaction hash</span>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 text-sm">
                    {selectedOrder.transactionHash}
                  </span>
                  <Copy className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">You Paid</span>
                <span className="text-gray-900 font-medium">
                  {selectedOrder.fromAmount.replace(" ", "")}
                </span>
              </div>
              <div className="flex justify-between py-3 mb-4">
                <span className="text-gray-600">You Received</span>
                <span className="text-gray-900 font-medium">
                  {selectedOrder.toAmount.replace(" ", "")}
                </span>
              </div>
              <button className="text-blue-600 font-medium w-full text-center">
                View on Mercuryo &gt;&gt;
              </button>
            </div>

            {/* Pending Message */}
            <div className="bg-orange-50 rounded-xl p-4 mb-6">
              <p className="text-orange-600 text-sm">
                This transaction is awaiting verification for Mercuryo You'll be
                notified when it's completed
              </p>
            </div>

            {/* Check Details Button */}
            <button
              onClick={handleCheckDetails}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold"
            >
              Check details
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Orders List Page (Default)
  return (
    <div className="min-h-screen bg-gray-50">
      <div className=" mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white border-b">
          <h1 className="text-2xl font-bold">Orders</h1>
          <button
            onClick={() => setCurrentPage("filter")}
            className="bg-gray-100 p-2 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Orders List */}
        <div className="p-4">
          {orders.map((order, index) => (
            <div key={order.id}>
              {(index === 0 || orders[index - 1].date !== order.date) && (
                <div className="text-sm font-semibold mb-3 mt-4 first:mt-0">
                  {order.date}
                </div>
              )}

              <div
                onClick={() => handleOrderClick(order)}
                className="bg-gray-50 rounded-xl p-4 mb-3 cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                      T
                    </div>
                    <div>
                      <div className="font-semibold">{order.fromAmount}</div>
                      <div className="text-sm text-gray-500">
                        {order.fromToken}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                      ₿
                    </div>
                    <div>
                      <div className="font-semibold">{order.toAmount}</div>
                      <div className="text-sm text-gray-500">
                        {order.toToken}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === "Waiting"
                          ? "bg-orange-100 text-orange-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="text-xs text-blue-600">
                      Exchange {order.exchangeId}
                    </span>
                  </div>
                  <button className="text-blue-600 font-medium flex items-center gap-1">
                    Check Order
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t max-w-md mx-auto">
          <div className="flex items-center justify-around py-3">
            <button className="flex flex-col items-center gap-1 text-gray-400">
              <div className="text-xl">📈</div>
              <span className="text-xs">Rate</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-blue-600">
              <div className="text-xl">🔄</div>
              <span className="text-xs font-medium">Orders</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-gray-400">
              <div className="text-xl">📋</div>
              <span className="text-xs">History</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-gray-400">
              <div className="text-xl">👤</div>
              <span className="text-xs">Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function HistoryPage({ onNavigate }) {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  // eslint-disable-next-line no-unused-vars
  const [selectedStatus, setSelectedStatus] = useState("Waiting");

  const handleBack = () => {
    onNavigate("dashboard");
  };
  const transactions = [
    {
      id: 1,
      date: "02 July 2023",
      from: { amount: "5000", currency: "USDT", symbol: "TRC-20", icon: "T" },
      to: { amount: "0.002445", currency: "BTC", icon: "₿" },
      status: "Waiting",
      exchangeId: "Exchange ID:voec666krovitepmd",
    },
    {
      id: 2,
      date: "02 July 2023",
      from: { amount: "5000", currency: "USDT", symbol: "TRC-20", icon: "T" },
      to: { amount: "0.002445", currency: "BTC", icon: "₿" },
      status: "Approved",
      exchangeId: "Exchange ID:voec666krovitepmd",
    },
    {
      id: 3,
      date: "02 July 2023",
      from: { amount: "5000", currency: "USDT", symbol: "TRC-20", icon: "T" },
      to: { amount: "0.002445", currency: "BTC", icon: "₿" },
      status: "Cancel",
      exchangeId: "Exchange ID:voec666krovitepmd",
    },
    {
      id: 4,
      date: "02 July 2023",
      from: { amount: "5000", currency: "USDT", symbol: "TRC-20", icon: "T" },
      to: { amount: "0.002445", currency: "BTC", icon: "₿" },
      status: "Waiting",
      exchangeId: "Exchange ID:voec666krovitepmd",
    },
    {
      id: 5,
      date: "02 July 2023",
      from: { amount: "5000", currency: "USDT", symbol: "TRC-20", icon: "T" },
      to: { amount: "0.002445", currency: "BTC", icon: "₿" },
      status: "Approved",
      exchangeId: "Exchange ID:voec666krovitepmd",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Waiting":
        return "text-orange-500 bg-orange-50";
      case "Approved":
        return "text-green-600 bg-green-50";
      case "Cancel":
        return "text-red-500 bg-red-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={handleBack} className="mr-4">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-semibold">Swap History</h1>
        </div>
        <button
          onClick={() => setShowFilterModal(true)}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <SlidersHorizontal size={20} />
        </button>
      </div>

      {/* Transaction List */}
      <div className="px-4 py-4 space-y-4">
        {transactions.map((transaction, index) => (
          <div key={transaction.id}>
            {(index === 0 ||
              transactions[index - 1].date !== transaction.date) && (
              <h3 className="text-sm font-semibold text-gray-700 mb-3 mt-2">
                {transaction.date}
              </h3>
            )}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                {/* From Currency */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                    {transaction.from.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {transaction.from.amount} {transaction.from.currency}
                    </p>
                    <p className="text-xs text-gray-500">
                      {transaction.from.symbol}
                    </p>
                  </div>
                </div>

                {/* Arrow */}
                <ArrowRight
                  className="text-blue-600 flex-shrink-0 mx-2"
                  size={20}
                />

                {/* To Currency */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    {transaction.to.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {transaction.to.amount} {transaction.to.currency}
                    </p>
                    <p className="text-xs text-gray-500">
                      {transaction.to.currency}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status and Exchange ID */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    transaction.status
                  )}`}
                >
                  {transaction.status}
                </span>
                <p className="text-xs text-blue-600 font-medium">
                  {transaction.exchangeId}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-6 animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <button onClick={() => setShowFilterModal(false)}>
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <h2 className="text-lg font-bold">Filter</h2>
              <div className="w-6"></div>
            </div>

            {/* Time Filter */}
            <div className="flex space-x-2 mb-6">
              {["All", "Today", "Week", "Month"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                    selectedFilter === filter
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {filter === "All" && (
                    <svg
                      className="w-4 h-4 inline mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {filter}
                </button>
              ))}
            </div>

            {/* Custom Dates */}
            <h3 className="font-bold text-gray-900 mb-3">Custom dates</h3>
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1">
                <label className="text-sm text-gray-600 mb-1 block">From</label>
                <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
                  <span className="flex-1 text-sm text-gray-700">20/07/25</span>
                  <Calendar size={16} className="text-gray-400" />
                </div>
              </div>
              <div className="flex-1">
                <label className="text-sm text-gray-600 mb-1 block">To</label>
                <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
                  <span className="flex-1 text-sm text-blue-600">20/07/25</span>
                  <Calendar size={16} className="text-gray-400" />
                </div>
              </div>
            </div>

            {/* Currencies */}
            <h3 className="font-bold text-gray-900 mb-3">Currencies</h3>
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-2">You send</p>
              <div className="flex items-center justify-between bg-gray-100 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    ₿
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Bitcoin</p>
                    <p className="text-xs text-gray-500">BTC</p>
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">You get</p>
              <div className="flex items-center justify-between bg-gray-100 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                    T
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">5000 USDT</p>
                    <p className="text-xs text-gray-500">TRC-20</p>
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Status */}
            <h3 className="font-bold text-gray-900 mb-3">Status</h3>
            <div className="flex space-x-2 mb-6">
              {["Waiting", "Waiting", "Waiting"].map((status, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedStatus(status)}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                    idx === 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {status}
                  {idx === 1 && " ✕"}
                </button>
              ))}
            </div>

            {/* Actions */}
            <button className="text-blue-600 font-semibold mb-3 w-full text-center">
              Clear all
            </button>
            <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold">
              Ok, I got it
            </button>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full">
            <button onClick={() => setShowCancelModal(false)} className="mb-4">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-xl font-bold text-red-600 mb-4">
              Exchange was cancelled
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              This transaction was cancelled by our partner or it has been
              cancelled by you
            </p>
            <button
              onClick={() => setShowCancelModal(false)}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold mb-3"
            >
              Ok, I got it
            </button>
            <button className="w-full bg-blue-50 text-blue-600 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2">
              <span>Message Support</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
// import React, { useState } from 'react';

function Account() {
  const [currentPage, setCurrentPage] = useState("account");
  // eslint-disable-next-line no-unused-vars
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  // Mock data
  const transactions = Array(7).fill({
    name: "Creative Omotayo",
    amount: "₦125,500.65",
  });

  const admins = [
    { id: 1, name: "Creative Omotayo", role: "Admin 1" },
    { id: 2, name: "Creative Omotayo", role: "Admin 2" },
    { id: 3, name: "Creative Omotayo", role: "Admin 3" },
  ];

  const notifications = [
    {
      id: 1,
      title: "#1 Notification",
      date: "02/04/24 7:00pm",
      heading: "Lorem ipsum dolor",
      body: "sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.",
    },
    {
      id: 2,
      title: "#1 Notification",
      date: "02/04/24 7:00pm",
      heading: "Lorem ipsum dolor",
      body: "sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.",
    },
  ];

  // Account Page
  const AccountPage = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Account</h1>

        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold">Creative Omotayo</h2>
              <p className="text-sm text-blue-600">creativeomotayo@gmail.com</p>
            </div>
            <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded">
              Admin 1
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => setCurrentPage("income")}
            className="w-full bg-gray-200 rounded-lg p-4 flex items-center gap-3 hover:bg-gray-300 transition"
          >
            <Wallet className="text-blue-600" size={24} />
            <span className="text-gray-700 font-medium">Income</span>
          </button>

          <button
            onClick={() => setCurrentPage("admins")}
            className="w-full bg-gray-200 rounded-lg p-4 flex items-center gap-3 hover:bg-gray-300 transition"
          >
            <Users className="text-blue-600" size={24} />
            <span className="text-gray-700 font-medium">Admins</span>
          </button>

          <button
            onClick={() => setCurrentPage("notification")}
            className="w-full bg-gray-200 rounded-lg p-4 flex items-center gap-3 hover:bg-gray-300 transition"
          >
            <Bell className="text-blue-600" size={24} />
            <span className="text-gray-700 font-medium">Notification</span>
          </button>

          <button
            onClick={() => setCurrentPage("support")}
            className="w-full bg-gray-200 rounded-lg p-4 flex items-center gap-3 hover:bg-gray-300 transition"
          >
            <MessageCircle className="text-blue-600" size={24} />
            <span className="text-gray-700 font-medium">Support</span>
          </button>
        </div>
      </div>

      <BottomNav currentPage="account" setCurrentPage={setCurrentPage} />
    </div>
  );

  // Income Page
  const IncomePage = () => (
    <div className="min-h-screen bg-gray-50">
      <Header title="Income" onBack={() => setCurrentPage("account")} />

      <div className="p-4">
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="text-sm text-gray-600 mb-2">Total earnings</div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">₦</span>
              <span className="text-2xl font-bold">₦ 2,300,027.87</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            </div>
          </div>
          <div className="text-sm text-gray-600 mt-2">
            Pending income - <span className="font-semibold">₦ 2859.87</span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">Transactions</h2>
          <span className="text-sm text-gray-500">21st May - 25th Aug</span>
        </div>

        <div className="space-y-3">
          {transactions.map((transaction, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-4 flex justify-between items-center shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  C
                </div>
                <div>
                  <div className="font-medium">{transaction.name}</div>
                  <div className="text-blue-600 font-semibold">
                    {transaction.amount}
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedTransaction(transaction);
                  setCurrentPage("transactionDetail");
                }}
                className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700 transition"
              >
                Check
              </button>
            </div>
          ))}
        </div>
      </div>

      <BottomNav currentPage="income" setCurrentPage={setCurrentPage} />
    </div>
  );

  // Transaction Detail Page
  const TransactionDetailPage = () => (
    <div className="min-h-screen bg-white">
      <div className="p-4 border-b flex justify-between items-center">
        <X
          onClick={() => setCurrentPage("income")}
          className="cursor-pointer"
        />
        <h2 className="text-lg font-semibold text-blue-600">Completed</h2>
        <div className="w-6"></div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
              T
            </div>
            <div>
              <div className="font-semibold">5000 USDT</div>
              <div className="text-xs text-gray-500">TRC-20</div>
            </div>
          </div>
          <div className="text-gray-400">→</div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
              ฿
            </div>
            <div>
              <div className="font-semibold">0.002445 BTC</div>
              <div className="text-xs text-gray-500">BTC</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-gray-600">Date</div>
            <div className="text-right text-blue-600">
              Feb 2, 2025 at 2:52 am
            </div>

            <div className="text-gray-600">Status</div>
            <div className="text-right text-blue-600">succeeded</div>

            <div className="text-gray-600">Network</div>
            <div className="text-right text-blue-600">TRC-20</div>

            <div className="text-gray-600">Fee</div>
            <div className="text-right text-blue-600">-7.89</div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-3">Swap Details</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm mb-2">
              <div className="text-gray-600">Transaction hash</div>
              <div className="text-right text-blue-600 flex items-center justify-end gap-1">
                243h7dyj7fe7jj89e...
                <Copy size={14} className="cursor-pointer" />
              </div>

              <div className="text-gray-600">You Paid</div>
              <div className="text-right font-semibold">5000USDT</div>

              <div className="text-gray-600">You Received</div>
              <div className="text-right font-semibold">0.002455BTC</div>
            </div>
            <button className="text-blue-600 text-sm mt-2">
              View on Mercuryo &gt;&gt;
            </button>
          </div>
        </div>

        <div className="text-sm text-blue-600 mb-6">
          This transaction was successful, your wallet/account has been credited
        </div>

        <button
          onClick={() => setCurrentPage("details")}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Check details
        </button>
      </div>
    </div>
  );

  // Details Page
  const DetailsPage = () => (
    <div className="min-h-screen bg-white">
      <div className="p-4 border-b flex justify-between items-center">
        <X
          onClick={() => setCurrentPage("transactionDetail")}
          className="cursor-pointer"
        />
        <div className="text-center">
          <h2 className="text-lg font-semibold">Details</h2>
          <p className="text-xs text-blue-600">Exchange ID:voec6dskroivopmd</p>
        </div>
        <div className="w-6"></div>
      </div>

      <div className="p-6">
        <h3 className="font-semibold mb-4">Personal details</h3>

        <div className="space-y-4 mb-8">
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <div className="bg-gray-100 rounded-lg p-3 flex justify-between items-center mt-1">
              <span>Cheese Balls 05</span>
              <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                Copy
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">Full Name</label>
            <div className="bg-gray-100 rounded-lg p-3 flex justify-between items-center mt-1">
              <span>Cheese Balls 05</span>
              <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                Copy
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">Phone</label>
            <div className="bg-gray-100 rounded-lg p-3 flex justify-between items-center mt-1">
              <span>Loopay</span>
              <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                Copy
              </button>
            </div>
          </div>
        </div>

        <h3 className="font-semibold mb-4">Refund details</h3>

        <div>
          <label className="text-sm text-gray-600">Address(USDT)</label>
          <div className="bg-gray-100 rounded-lg p-3 flex justify-between items-center mt-1">
            <span className="text-sm">Tcndjh73j6fhe78ej87hwey73h</span>
            <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
              Copy
            </button>
          </div>
        </div>

        <button
          onClick={() => setCurrentPage("income")}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold mt-8 hover:bg-blue-700 transition"
        >
          Ok, I got it
        </button>
      </div>
    </div>
  );

  // Admins Page
  const AdminsPage = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <ChevronLeft
          onClick={() => setCurrentPage("account")}
          className="cursor-pointer"
        />
        <h1 className="text-lg font-semibold">Admins</h1>
        <Plus
          onClick={() => setCurrentPage("newAdmin")}
          className="cursor-pointer"
        />
      </div>

      <div className="p-4">
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold">Creative Omotayo</h2>
              <p className="text-sm text-blue-600">creativeomotayo@gmail.com</p>
            </div>
            <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded">
              Super admin
            </span>
          </div>
        </div>

        <h3 className="font-semibold mb-4">Other admins</h3>

        <div className="space-y-3">
          {admins.map((admin) => (
            <div
              key={admin.id}
              onClick={() => {
                setSelectedAdmin(admin);
                setCurrentPage("pagesRestriction");
              }}
              className="bg-white rounded-lg p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                  <span className="text-red-500">🗑</span>
                </div>
                <span className="text-gray-600">{admin.name}</span>
              </div>
              <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded">
                {admin.role}
              </span>
            </div>
          ))}
        </div>
      </div>

      <BottomNav currentPage="admins" setCurrentPage={setCurrentPage} />
    </div>
  );

  // Pages and Restriction Page
  const PagesRestrictionPage = () => (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Pages and Restriction"
        onBack={() => setCurrentPage("admins")}
      />

      <div className="p-4">
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold">Creative Omotayo</h2>
              <p className="text-sm text-blue-600">creativeomotayo@gmail.com</p>
            </div>
            <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded">
              Admin 1
            </span>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {["Add Wallet", "Income", "Orders", "History", "Currencies"].map(
            (item) => (
              <div key={item} className="flex justify-between items-center">
                <span className="font-medium">{item}</span>
                <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            )
          )}
        </div>

        <button
          onClick={() => setCurrentPage("updatePassword")}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Update Password
        </button>
      </div>

      <BottomNav currentPage="admins" setCurrentPage={setCurrentPage} />
    </div>
  );

  // Update Password Page
  const UpdatePasswordPage = () => (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full ">
        <div className="flex justify-between items-center mb-8">
          <X
            onClick={() => setCurrentPage("pagesRestriction")}
            className="cursor-pointer"
          />
          <h2 className="text-lg font-semibold">Password</h2>
          <div className="w-6"></div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Enter Account Name</label>
            <input
              type="text"
              value="Creative Omotayo"
              className="w-full bg-gray-100 rounded-lg p-3 mt-1"
              readOnly
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Enter New password</label>
            <input
              type="text"
              value="7.0"
              className="w-full bg-gray-100 rounded-lg p-3 mt-1"
            />
          </div>

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Save
          </button>
        </div>
      </div>
    </div>
  );

  // New Admin Page
  const NewAdminPage = () => (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full ">
        <div className="flex justify-between items-center mb-8">
          <X
            onClick={() => setCurrentPage("admins")}
            className="cursor-pointer"
          />
          <h2 className="text-lg font-semibold">New Admin</h2>
          <div className="w-6"></div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Admin No</label>
            <input
              type="text"
              value="2"
              className="w-full bg-gray-100 rounded-lg p-3 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Enter Account Name</label>
            <input
              type="text"
              value="Creative Omotayo"
              className="w-full bg-gray-100 rounded-lg p-3 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Enter New password</label>
            <input
              type="text"
              value="123454566"
              className="w-full bg-gray-100 rounded-lg p-3 mt-1"
            />
          </div>

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Save
          </button>
        </div>
      </div>
    </div>
  );

  // Notification Page
  const NotificationPage = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <ChevronLeft
          onClick={() => setCurrentPage("account")}
          className="cursor-pointer"
        />
        <h1 className="text-lg font-semibold">Notification</h1>
        <Plus
          onClick={() => setCurrentPage("newNotification")}
          className="cursor-pointer"
        />
      </div>

      <div className="p-4 space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="bg-white rounded-lg p-4 shadow-sm"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-blue-600 font-semibold">
                {notification.title}
              </span>
              <span className="text-sm text-gray-500">{notification.date}</span>
            </div>
            <h3 className="font-semibold mb-2">{notification.heading}</h3>
            <p className="text-sm text-gray-600 mb-4">{notification.body}</p>
            <button className="text-blue-600 text-sm flex items-center gap-1">
              Resend Notification
              <span>→</span>
            </button>
          </div>
        ))}
      </div>

      <BottomNav currentPage="notification" setCurrentPage={setCurrentPage} />
    </div>
  );

  // New/Edit Notification Page
  const NewNotificationPage = () => (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="New/Edit Notification"
        onBack={() => setCurrentPage("notification")}
      />

      <div className="p-4">
        <div className="bg-white rounded-lg p-4 mb-6">
          <h3 className="text-center text-blue-600 font-semibold mb-4">
            Notification
          </h3>

          <input
            type="text"
            placeholder="Enter title"
            className="w-full border border-gray-300 rounded-lg p-3 mb-4"
          />

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-blue-600">Date</label>
              <input
                type="text"
                value="11:00am"
                className="w-full border border-gray-300 rounded-lg p-3 mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-blue-600">Time</label>
              <input
                type="text"
                value="05:00pm"
                className="w-full border border-gray-300 rounded-lg p-3 mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-blue-600">Enter body</label>
            <textarea
              placeholder="Kindly Provide details below"
              className="w-full border border-gray-300 rounded-lg p-3 mt-1 h-32"
            />
          </div>
        </div>

        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
          Save
        </button>
      </div>
    </div>
  );

  // Support Page
  const SupportPage = () => (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Help and Support"
        onBack={() => setCurrentPage("account")}
      />

      <div className="p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6 flex items-start gap-2">
          <span className="text-yellow-600">⚠</span>
          <span className="text-sm text-blue-600">
            update support mail address and whatsapp contact
          </span>
        </div>

        <div className="space-y-4 mb-6">
          <input
            type="email"
            value="customersupport@loopay.com"
            className="w-full border border-gray-300 rounded-lg p-3"
          />

          <div className="flex gap-4">
            <select className="border border-gray-300 rounded-lg p-3">
              <option>+234</option>
            </select>
            <input
              type="tel"
              value="9012456789"
              className="flex-1 border border-gray-300 rounded-lg p-3"
            />
          </div>
        </div>

        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
          Save
        </button>
      </div>

      <BottomNav currentPage="support" setCurrentPage={setCurrentPage} />
    </div>
  );

  // Header Component
  const Header = ({ title, onBack }) => (
    <div>
      <div className=" text-white p-4 flex justify-between items-center"></div>
      <div className="bg-white p-4 shadow-sm flex items-center gap-4">
        <ChevronLeft onClick={onBack} className="cursor-pointer" />
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
    </div>
  );

  // Render current page
  const renderPage = () => {
    switch (currentPage) {
      case "account":
        return <AccountPage />;
      case "income":
        return <IncomePage />;
      case "transactionDetail":
        return <TransactionDetailPage />;
      case "details":
        return <DetailsPage />;
      case "admins":
        return <AdminsPage />;
      case "pagesRestriction":
        return <PagesRestrictionPage />;
      case "updatePassword":
        return <UpdatePasswordPage />;
      case "newAdmin":
        return <NewAdminPage />;
      case "notification":
        return <NotificationPage />;
      case "newNotification":
        return <NewNotificationPage />;
      case "support":
        return <SupportPage />;
      default:
        return <AccountPage />;
    }
  };

  return <div className=" bg-white shadow-xl min-h-screen">{renderPage()}</div>;
}

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
        {currentScreen === "orders" && <OrdersScreen />}
        {currentScreen === "history" && <HistoryPage />}
        {currentScreen === "account" && <Account />}
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

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Navbar is rendered globally in Routee; don't import here to avoid duplication
import {
  ArrowLeft,
  Bell,
  Star,
  Copy,
  Share2,
  TrendingUp,
  TrendingDown,
  Search,
  Home,
  ShoppingCart,
  Clock,
  User,
} from "lucide-react";

// Currency Rates Component
const CurrencyRates = ({ onSelectCurrency, onNavigate }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const currencies = [
    {
      id: 1,
      name: "AAVE",
      fullName: "Aave",
      price: "$69.7100",
      change: "+2.24%",
      positive: true,
      icon: "🔷",
    },
    {
      id: 2,
      name: "AAVE",
      fullName: "Aave",
      price: "$69.7100",
      change: "+2.24%",
      positive: true,
      icon: "🔴",
    },
    {
      id: 3,
      name: "BTC",
      fullName: "Bitcoin",
      price: "$86,244.91",
      change: "-2.95%",
      positive: false,
      icon: "₿",
    },
    {
      id: 4,
      name: "BNB",
      fullName: "Binance",
      price: "$69.7100",
      change: "+2.24%",
      positive: true,
      icon: "🟡",
    },
    {
      id: 5,
      name: "DOGE",
      fullName: "Dogecoin",
      price: "$69.7100",
      change: "-2.24%",
      positive: false,
      icon: "🐕",
    },
    {
      id: 6,
      name: "ETH",
      fullName: "Ethereum",
      price: "$69.7100",
      change: "+2.24%",
      positive: true,
      icon: "◆",
    },
    {
      id: 7,
      name: "LTC",
      fullName: "Litecoin",
      price: "$69.7100",
      change: "+2.24%",
      positive: true,
      icon: "Ł",
    },
    {
      id: 8,
      name: "SOL",
      fullName: "Solana",
      price: "$69.7100",
      change: "-2.24%",
      positive: false,
      icon: "◎",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Currency rates</h1>
            <button className="p-2 hover:bg-white/20 rounded-full transition-all">
              <Bell className="w-6 h-6" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for currency"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/95 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-6 mt-6">
        <div className="bg-white rounded-xl shadow-sm p-1 flex">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "all"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            All Currencies
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "favorites"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Favorite Currencies
          </button>
        </div>
      </div>

      {/* Currency List */}
      <div className="max-w-4xl mx-auto px-6 mt-6 pb-24">
        <div className="space-y-3">
          {currencies.map((currency) => (
            <div
              key={currency.id}
              onClick={() => onSelectCurrency(currency)}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-2xl">
                    {currency.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">
                      {currency.name}
                    </h3>
                    <p className="text-gray-500 text-sm">{currency.fullName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-12">
                    {currency.positive ? (
                      <TrendingUp className="w-full h-full text-green-500" />
                    ) : (
                      <TrendingDown className="w-full h-full text-red-500" />
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-gray-800">
                      {currency.price}
                    </p>
                    <p
                      className={`text-sm font-semibold ${
                        currency.positive ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {currency.change}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-3">
          <div className="flex justify-around">
            <button
              onClick={() => (onNavigate ? onNavigate("rates") : navigate("/currency-change"))}
              className="flex flex-col items-center space-y-1 text-blue-600"
            >
              <TrendingUp className="w-6 h-6" />
              <span className="text-xs font-semibold">Rate</span>
            </button>
            <button
              onClick={() => (onNavigate ? onNavigate("buy") : navigate("/buy-crypto"))}
              className="flex flex-col items-center space-y-1 text-blue-600"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="text-xs font-semibold">Buy</span>
            </button>
            <button className="flex flex-col items-center space-y-1 text-gray-400 hover:text-blue-600 transition-colors">
              <Clock className="w-6 h-6" />
              <span className="text-xs font-semibold">History</span>
            </button>
            <button className="flex flex-col items-center space-y-1 text-gray-400 hover:text-blue-600 transition-colors">
              <User className="w-6 h-6" />
              <span className="text-xs font-semibold">Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Currency Detail Component
const CurrencyDetail = ({ currency, onExchange }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white p-6 shadow-sm flex justify-between items-center">
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <Bell className="w-6 h-6" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <Star className="w-6 h-6 text-blue-600" fill="currentColor" />
            </button>
          </div>
        </div>

        {/* Currency Info */}
        <div className="text-center py-12 px-6">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl shadow-lg animate-bounce-in">
            ₿
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">BITCOIN</h1>
          <p className="text-gray-500 mb-6">BTC</p>
          <h2 className="text-5xl font-bold text-gray-900 mb-2">
            {currency?.price || "$86,244.91"}
          </h2>
          <p className="text-red-500 text-xl font-semibold">
            {currency?.change || "-2.95%"}
          </p>
        </div>

        {/* Exchange Button */}
        <div className="px-6 pb-6">
          <button
            onClick={onExchange}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all flex items-center justify-center space-x-2"
          >
            <span>Exchange</span>
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Swap Crypto Component
const SwapCrypto = ({ onSwap }) => {
  const [fromAmount, setFromAmount] = useState("5000");
  const [toAmount, setToAmount] = useState("0.010000056");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 shadow-lg">
          <button onClick={() => window.history.back()} className="mb-4">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold mb-2">Swap Cryptocurrency</h1>
          <p className="text-blue-100">
            Swap Crypto currencies from one asset to another
          </p>
        </div>

        {/* Tabs */}
        <div className="px-6 mt-6">
          <div className="bg-white rounded-xl shadow-sm p-1 flex">
            <button className="flex-1 py-3 rounded-lg text-gray-600 font-semibold hover:bg-gray-100 transition-all">
              Buy/Sell/Crypto
            </button>
            <button className="flex-1 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow-md">
              Swap Crypto
            </button>
          </div>
        </div>

        {/* Swap Form */}
        <div className="px-6 mt-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            {/* From */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label className="text-gray-600 font-semibold">From</label>
                <label className="text-gray-600 font-semibold">Network</label>
              </div>
              <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-4">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  T
                </div>
                <select className="bg-transparent font-bold text-lg outline-none">
                  <option>USDT</option>
                </select>
                <input
                  type="text"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  className="flex-1 bg-transparent text-right text-xl font-bold outline-none"
                />
                <span className="text-gray-400 text-sm">TRC-20</span>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center -my-3 relative z-10">
              <button className="w-12 h-12 bg-white border-4 border-blue-100 rounded-full flex items-center justify-center hover:bg-blue-50 transition-all shadow-md">
                <svg
                  className="w-6 h-6 text-blue-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                  />
                </svg>
              </button>
            </div>

            {/* To */}
            <div className="mt-6">
              <label className="text-gray-600 font-semibold mb-2 block">
                To
              </label>
              <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-4">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl">
                  ₿
                </div>
                <select className="bg-transparent font-bold text-lg outline-none">
                  <option>BTC</option>
                </select>
                <input
                  type="text"
                  value={toAmount}
                  onChange={(e) => setToAmount(e.target.value)}
                  className="flex-1 bg-transparent text-right text-xl font-bold outline-none"
                />
                <span className="text-gray-400 text-sm">BTC</span>
              </div>
            </div>

            {/* Refund Details */}
            <button className="w-full mt-6 border-2 border-blue-600 text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all flex items-center justify-between px-4">
              <span>Add the refund details</span>
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </button>

            {/* Swap Action Button */}
            <button
              onClick={onSwap}
              className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
            >
              Swap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Confirm Swap Component
const ConfirmSwap = ({ onConfirm }) => {
  const [address, setAddress] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white p-6 shadow-sm">
          <button onClick={() => window.history.back()}>
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6 py-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">
            Confirm swap
          </h1>

          {/* Swap Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  T
                </div>
                <div>
                  <p className="font-bold text-lg">5000 USDT</p>
                  <p className="text-gray-500 text-sm">TRC-20</p>
                </div>
              </div>
              <ArrowLeft className="w-6 h-6 text-gray-400 rotate-180" />
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl">
                  ₿
                </div>
                <div>
                  <p className="font-bold text-lg">0.002445 BTC</p>
                  <p className="text-gray-500 text-sm">BTC</p>
                </div>
              </div>
            </div>
          </div>

          {/* Address Input */}
          <div className="mb-8">
            <label className="text-gray-800 font-semibold mb-3 block">
              Enter Bitcoin address of the recipient
            </label>
            <div className="relative">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Bitcoin address"
                className="w-full px-4 py-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2 text-blue-600 font-semibold px-3 py-2 hover:bg-blue-50 rounded-lg transition-all">
                <span>Paste</span>
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Confirm Button */}
          <button
            onClick={onConfirm}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
          >
            Swap
          </button>
        </div>
      </div>
    </div>
  );
};

// Awaiting Deposit Component
const AwaitingDeposit = () => {
  const depositAddress = "0x52d39886F8022764880Fff88DdE280F6C5D3CcD";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [qrSquares, setQrSquares] = useState(() =>
    Array.from({ length: 64 }, () => false)
  );

  useEffect(() => {
    const squares = Array.from({ length: 64 }, () => Math.random() > 0.5);
    const timer = setTimeout(() => setQrSquares(squares), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white p-6 shadow-sm flex justify-between items-center">
          <button onClick={() => window.history.back()}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-all">
            <Share2 className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6 py-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">
            Awaiting your deposit
          </h1>

          {/* Swap Info Card */}
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl p-6 mb-6 shadow-lg">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-bold">SWAP ID:</span> Hhdf u6784jdHDGA7
              </p>
              <p className="text-sm text-gray-600">
                Please send 5000 USDT to the deposit address
              </p>
            </div>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                T
              </div>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-800">5000 USDT</p>
              <p className="text-gray-600">TRC-20</p>
            </div>
          </div>

          {/* Deposit Address */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
            <p className="text-center font-semibold text-gray-800 mb-3">
              Deposit address
            </p>
            <p className="text-center text-blue-600 font-mono text-sm mb-4 break-all">
              {depositAddress}
            </p>
            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-center space-x-2 text-blue-600 font-semibold py-2 hover:bg-blue-50 rounded-lg transition-all"
            >
              <span>{copied ? "Copied!" : "Copy"}</span>
              <Copy className="w-4 h-4" />
            </button>

            {/* QR Code Placeholder */}
            <div className="mt-6 flex justify-center">
              <div className="w-48 h-48 bg-gray-900 rounded-xl flex items-center justify-center">
                <div className="grid grid-cols-8 gap-1 p-4">
                  {qrSquares.map((on, i) => (
                    <div
                      key={i}
                      className={`w-4 h-4 ${on ? "bg-white" : "bg-gray-900"}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <p className="text-center text-orange-600 text-sm mt-6 font-semibold">
              Only TRC network is supported. Please ensure your deposit is made
              on TRC network.
            </p>
          </div>

          {/* You Get */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
            <p className="text-center text-gray-600 mb-3">You get</p>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl">
                ₿
              </div>
              <div>
                <p className="font-bold text-lg">0.002445 BTC</p>
                <p className="text-gray-500 text-sm">BTC</p>
              </div>
            </div>
          </div>

          {/* Done Button */}
          <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

// Buy Cryptocurrency Component (Picture 10)
const BuyCryptocurrency = ({ onExchange }) => {
  const [sendAmount, setSendAmount] = useState("5,000,000.00");
  const [receiveAmount, setReceiveAmount] = useState("0.010000056");

  return (
    <div className="min-h-screen bg-white animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 shadow-lg">
          <button onClick={() => window.history.back()} className="mb-4">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold mb-2">Buy Cryptocurrency</h1>
          <p className="text-blue-100">Buy Crypto currencies</p>
        </div>

        {/* Tabs */}
        <div className="px-6 mt-6">
          <div className="bg-gray-100 rounded-xl p-1 flex">
            <button className="flex-1 py-3 rounded-lg bg-white text-gray-800 font-semibold shadow-sm">
              Buy/Sell/Crypto
            </button>
            <button className="flex-1 py-3 rounded-lg text-gray-600 font-semibold hover:bg-gray-50 transition-all">
              Swap Crypto
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="px-6 mt-8">
          {/* You send */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <label className="text-gray-600 font-semibold">You send</label>
              <label className="text-gray-600 font-semibold">Network</label>
            </div>
            <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-4">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                T
              </div>
              <select className="bg-transparent font-bold text-lg outline-none">
                <option>NGN</option>
              </select>
              <input
                type="text"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                className="flex-1 bg-transparent text-right text-xl font-bold outline-none"
              />
              <span className="text-gray-400 text-sm">NGN</span>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-end -my-3 relative z-10 pr-4">
            <button className="w-12 h-12 bg-white border-4 border-blue-100 rounded-full flex items-center justify-center hover:bg-blue-50 transition-all shadow-md">
              <svg
                className="w-6 h-6 text-blue-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </button>
          </div>

          {/* You get */}
          <div className="mt-6">
            <div className="flex justify-between mb-2">
              <label className="text-gray-600 font-semibold">You get</label>
              <label className="text-gray-600 font-semibold">Network</label>
            </div>
            <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-4">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl">
                ₿
              </div>
              <select className="bg-transparent font-bold text-lg outline-none">
                <option>BTC</option>
              </select>
              <input
                type="text"
                value={receiveAmount}
                onChange={(e) => setReceiveAmount(e.target.value)}
                className="flex-1 bg-transparent text-right text-xl font-bold outline-none"
              />
              <span className="text-gray-400 text-sm">BTC</span>
            </div>
          </div>

          {/* Exchange Button */}
          <button
            onClick={onExchange}
            className="w-full mt-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
          >
            Exchange
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-3">
          <div className="flex justify-around">
            <button className="flex flex-col items-center space-y-1 text-gray-400 hover:text-blue-600 transition-colors">
              <TrendingUp className="w-6 h-6" />
              <span className="text-xs font-semibold">Rate</span>
            </button>
            <button className="flex flex-col items-center space-y-1 text-blue-600">
              <ShoppingCart className="w-6 h-6" />
              <span className="text-xs font-semibold">Buy</span>
            </button>
            <button className="flex flex-col items-center space-y-1 text-gray-400 hover:text-blue-600 transition-colors">
              <Clock className="w-6 h-6" />
              <span className="text-xs font-semibold">History</span>
            </button>
            <button className="flex flex-col items-center space-y-1 text-gray-400 hover:text-blue-600 transition-colors">
              <User className="w-6 h-6" />
              <span className="text-xs font-semibold">Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Crypto Exchange Modal (Picture 8)
const CryptoExchangeModal = ({ onAccept }) => {
  const [agreed, setAgreed] = useState(true);
  const [termsAgreed, setTermsAgreed] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 animate-fade-in z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-bounce-in">
        <div className="flex justify-between items-start mb-6">
          <button
            onClick={() => window.history.back()}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
          <div className="w-24 h-1 bg-gray-300 rounded-full mx-auto"></div>
          <div className="w-6"></div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Crypto Exchange
        </h2>

        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          The crypto exchange is being handled by Mercuryo, Cheeseball's
          independent partner. After acceptance o the Terms of Service specified
          below, you'll be automatically redirected to the web-page operated
          fully and exclusively by Mercuryo
        </p>

        <div className="space-y-4 mb-6">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-5 h-5 mt-0.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              Mercuryo is a separate platform owned by a third party, and
              Cheeseball does not assume any liability or any loss or damage
              caused by your usage of Mercuryo's services. By using such third
              party service you agree to Mercuryo{" "}
              <span className="text-blue-600">Terms of Service</span> and{" "}
              <span className="text-blue-600">Privacy Policy</span>.
            </span>
          </label>

          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={termsAgreed}
              onChange={(e) => setTermsAgreed(e.target.checked)}
              className="w-5 h-5 mt-0.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              By using this website, you agree with our{" "}
              <span className="text-blue-600">Terms of Service</span>
            </span>
          </label>
        </div>

        <button
          onClick={onAccept}
          disabled={!agreed || !termsAgreed}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          Ok, I got it
        </button>
      </div>
    </div>
  );
};

// Buy Crypto Address (Picture 9)
const BuyCryptoAddress = ({ onCreateExchange }) => {
  const [address, setAddress] = useState("");

  return (
    <div className="min-h-screen bg-white animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 shadow-lg">
          <div className="flex items-center space-x-4 mb-2">
            <button onClick={() => window.history.back()}>
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold">Buy Crypto</h1>
          </div>
          <p className="text-blue-100 ml-10">Enter the address</p>
        </div>

        <div className="px-6 py-8">
          {/* Exchange Summary */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                T
              </div>
              <div>
                <p className="font-bold">5,000,000 NGN</p>
                <p className="text-gray-500 text-sm">TRC-20</p>
              </div>
            </div>
            <ArrowLeft className="w-6 h-6 text-gray-400 rotate-180" />
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl">
                ₿
              </div>
              <div>
                <p className="font-bold">0.002445 BTC</p>
                <p className="text-gray-500 text-sm">BTC</p>
              </div>
            </div>
          </div>

          {/* Address Input */}
          <div className="mb-8">
            <label className="text-gray-800 font-bold mb-3 block">
              Enter Bitcoin address of the recipient
            </label>
            <div className="relative">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Bitcoin address"
                className="w-full px-4 py-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2 text-blue-600 font-bold px-3 py-2 hover:bg-blue-50 rounded-lg transition-all">
                <span>Paste</span>
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Create Exchange Button */}
          <button
            onClick={onCreateExchange}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all mb-32"
          >
            Create Exchange
          </button>

          {/* Fiat Method */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-gray-600 text-sm mb-1">Fiat Method</p>
            <p className="text-blue-600 font-bold text-lg">PAYSTACK</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Exchange Page Modal (Picture 7)
const ExchangePageModal = ({ onAccept }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 animate-fade-in z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-bounce-in">
        <div className="flex justify-between items-start mb-6">
          <button
            onClick={() => window.history.back()}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
          <div className="w-24 h-1 bg-gray-300 rounded-full mx-auto"></div>
          <div className="w-6"></div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Exchange Page
        </h2>

        <p className="text-gray-600 text-center leading-relaxed mb-8">
          You will be redirected to the page operated by our partner. Please
          don't leave our partner's page until all exchange information has been
          provided
        </p>

        <button
          onClick={onAccept}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
        >
          Ok, I got it
        </button>
      </div>
    </div>
  );
};

// Complete Order Page (Picture 6)
const CompleteOrderPage = ({ onBuyWithBankTransfer }) => {
  return (
    <div className="min-h-screen bg-white animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 shadow-lg flex justify-between items-center">
          <button
            onClick={() => window.history.back()}
            className="text-blue-100 hover:text-white font-semibold"
          >
            Close
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="font-semibold">NG</span>
            <span className="text-xl">▼</span>
          </div>
        </div>

        <div className="px-6 py-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">
            Complete your order
          </h1>

          {/* Payment Method */}
          <div className="mb-8">
            <p className="text-gray-600 font-semibold mb-4">You pay by</p>
            <div className="space-y-3">
              <label className="flex items-center justify-between bg-blue-50 p-4 rounded-xl cursor-pointer border-2 border-blue-600">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="payment"
                    checked
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className="font-bold text-blue-600">Bank Transfer</span>
                </div>
                <div className="text-2xl">🏦</div>
              </label>

              <label className="flex items-center justify-between bg-white border-2 border-gray-200 p-4 rounded-xl cursor-pointer hover:border-gray-300 transition-all">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="payment"
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className="font-bold text-gray-700">Debit Card</span>
                </div>
                <div className="flex items-center space-x-2">
                  <img
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='25' viewBox='0 0 40 25'%3E%3Crect fill='%231434CB' width='40' height='25' rx='3'/%3E%3Ctext x='20' y='17' font-family='Arial' font-size='10' font-weight='bold' fill='white' text-anchor='middle'%3EVISA%3C/text%3E%3C/svg%3E"
                    alt="VISA"
                    className="h-6"
                  />
                  <img
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='25' viewBox='0 0 40 25'%3E%3Crect fill='%23EB001B' width='18' height='25' rx='2'/%3E%3Crect fill='%23FF5F00' x='11' width='18' height='25' rx='2'/%3E%3Crect fill='%23F79E1B' x='22' width='18' height='25' rx='2'/%3E%3C/svg%3E"
                    alt="Mastercard"
                    className="h-6"
                  />
                </div>
              </label>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-800">Your order</h3>
                <p className="text-gray-500 text-sm">All fees included</p>
              </div>
              <div className="text-right">
                <p className="text-blue-600 font-bold">
                  0.00212 BTC for ₦5,000,000
                </p>
                <p className="text-gray-500 text-sm flex items-center justify-end space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Update in 5 sec</span>
                </p>
              </div>
            </div>

            <div className="space-y-3 border-t border-gray-200 pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">1 BTC =</span>
                <span className="font-bold">₦89620.26</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pay for 0.00217609 BTC</span>
                <span className="font-bold">₦4,980,000.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">FEE:</span>
                <span className="font-bold">₦20,000.00</span>
              </div>
            </div>
          </div>

          {/* Buy Button */}
          <button
            onClick={onBuyWithBankTransfer}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
          >
            Buy with Bank Transfer
          </button>
        </div>
      </div>
    </div>
  );
};

// Complete Order Email (Picture 5)
const CompleteOrderEmail = ({ onContinue }) => {
  const [email, setEmail] = useState("");
  const [receiveUpdates, setReceiveUpdates] = useState(false);

  return (
    <div className="min-h-screen bg-white animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 shadow-lg flex justify-between items-center">
          <button onClick={() => window.history.back()}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="font-semibold">NG</span>
            <span className="text-xl">▼</span>
          </div>
        </div>

        <div className="px-6 py-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">
            Complete your order
          </h1>

          {/* Email Input */}
          <div className="mb-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Checkbox */}
          <label className="flex items-start space-x-3 mb-8 cursor-pointer">
            <input
              type="checkbox"
              checked={receiveUpdates}
              onChange={(e) => setReceiveUpdates(e.target.checked)}
              className="w-5 h-5 mt-0.5 text-blue-600 rounded border-gray-300"
            />
            <span className="text-gray-600">
              Want to receive updates from us?
            </span>
          </label>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-800">Your order</h3>
                <p className="text-gray-500 text-sm">All fees included</p>
              </div>
              <div className="text-right">
                <p className="text-blue-600 font-bold">
                  0.00212 BTC for ₦5,000,000
                </p>
                <p className="text-gray-500 text-sm flex items-center justify-end space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Update in 5 sec</span>
                </p>
              </div>
            </div>

            <div className="space-y-3 border-t border-gray-200 pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">1 BTC =</span>
                <span className="font-bold">₦89620.26</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pay for 0.00217609 BTC</span>
                <span className="font-bold">₦4,980,000.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">FEE:</span>
                <span className="font-bold">₦20,000.00</span>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all mb-6"
          >
            Continue
          </button>

          {/* Terms */}
          <p className="text-center text-gray-600 text-sm">
            By clicking "Continue" you agree to the{" "}
            <span className="text-blue-600">Terms of Service</span>,{" "}
            <span className="text-blue-600">Privacy Policy</span> and{" "}
            <span className="text-blue-600">Cookies Policy</span>
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 text-center">
          <p className="text-gray-400 text-sm">Cryptopowered by Paystack</p>
        </div>
      </div>
    </div>
  );
};

// OTP Page (Picture 4)
const OTPPage = ({ onContinue }) => {
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    const id = setInterval(() => {
      setCountdown((c) => {
        if (c <= 0) {
          clearInterval(id);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-white animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 shadow-lg flex justify-between items-center">
          <button onClick={() => window.history.back()}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="font-semibold">NG</span>
            <span className="text-xl">▼</span>
          </div>
        </div>

        <div className="px-6 py-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">
            Enter OTP sent to your mail
          </h1>

          {/* OTP Input */}
          <div className="mb-6">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="OTP"
              className="w-full px-4 py-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-center text-2xl tracking-widest font-bold"
              maxLength="6"
            />
          </div>

          {/* Resend Code */}
          <div className="flex justify-between items-center mb-8">
            <button className="text-blue-600 font-semibold hover:underline">
              Resend code
            </button>
            <span className="text-gray-500">
              You can resend code in {countdown}s
            </span>
          </div>

          {/* Continue Button */}
          <button
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
          >
            Continue
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 text-center">
          <p className="text-gray-400 text-sm">Cryptopowered by Paystack</p>
        </div>
      </div>
    </div>
  );
};

// Personal Data Page (Picture 3)
const PersonalDataPage = ({ onContinue }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  return (
    <div className="min-h-screen bg-white animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 shadow-lg flex justify-between items-center">
          <button onClick={() => window.history.back()}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="font-semibold">NG</span>
            <span className="text-xl">▼</span>
          </div>
        </div>

        <div className="px-6 py-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Personal data
          </h1>
          <p className="text-gray-600 mb-8">
            Enter your personal data as it appears on your ID
          </p>

          {/* First Name */}
          <div className="mb-6">
            <label className="text-gray-600 text-sm mb-2 block">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Last Name */}
          <div className="mb-8">
            <label className="text-gray-600 text-sm mb-2 block">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Continue Button */}
          <button
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
          >
            Continue
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 text-center">
          <p className="text-gray-400 text-sm">Cryptopowered by Paystack</p>
        </div>
      </div>
    </div>
  );
};

// Bank Transfer Details (Picture 2)
const BankTransferDetails = ({ onContinue }) => {
  const [copied, setCopied] = useState({
    account: false,
    name: false,
    bank: false,
  });

  const handleCopy = (field, value) => {
    navigator.clipboard.writeText(value);
    setCopied({ ...copied, [field]: true });
    setTimeout(() => setCopied({ ...copied, [field]: false }), 2000);
  };

  return (
    <div className="min-h-screen bg-white animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 shadow-lg flex justify-between items-center">
          <button onClick={() => window.history.back()}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="font-semibold">NG</span>
            <span className="text-xl">▼</span>
          </div>
        </div>

        <div className="px-6 py-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">
            Complete your order
          </h1>

          {/* Payment Method */}
          <div className="mb-6">
            <p className="text-gray-600 font-semibold mb-4">You pay by</p>
            <div className="space-y-3">
              <label className="flex items-center justify-between bg-blue-50 p-4 rounded-xl cursor-pointer border-2 border-blue-600">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="payment"
                    checked
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className="font-bold text-blue-600">Bank Transfer</span>
                </div>
                <div className="text-2xl">🏦</div>
              </label>

              <label className="flex items-center justify-between bg-white border-2 border-gray-200 p-4 rounded-xl cursor-pointer">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="payment"
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className="font-bold text-gray-700">Debit Card</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-700 font-bold text-xs">VISA</span>
                  <span className="text-orange-500 font-bold text-xs">MC</span>
                </div>
              </label>
            </div>
          </div>

          {/* Timer */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-center text-red-600 font-semibold">
              This account expires in{" "}
              <span className="font-bold text-xl">29:05</span>
            </p>
          </div>

          {/* Bank Details */}
          <div className="space-y-4 mb-8">
            <div>
              <label className="text-gray-600 text-sm mb-2 block">
                Account No:
              </label>
              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                <span className="font-bold text-gray-800">Cheese Balls 05</span>
                <button
                  onClick={() => handleCopy("account", "Cheese Balls 05")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all"
                >
                  {copied.account ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            <div>
              <label className="text-gray-600 text-sm mb-2 block">
                Account Name
              </label>
              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                <span className="font-bold text-gray-800">Cheese Balls 05</span>
                <button
                  onClick={() => handleCopy("name", "Cheese Balls 05")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all"
                >
                  {copied.name ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            <div>
              <label className="text-gray-600 text-sm mb-2 block">
                Bank Name
              </label>
              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                <span className="font-bold text-gray-800">Loopay</span>
                <button
                  onClick={() => handleCopy("bank", "Loopay")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all"
                >
                  {copied.bank ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          </div>

          {/* Confirm Button */}
          <button
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
          >
            I've sent the money
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 text-center">
          <p className="text-gray-400 text-sm">Cryptopowered by Paystack</p>
        </div>
      </div>
    </div>
  );
};

// Payment Success Modal (Picture 1)
const PaymentSuccessModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 animate-fade-in z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 animate-bounce-in text-center">
        <button
          onClick={onClose}
          className="absolute top-6 left-6 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-8 mt-4">
          Your payment was successful
        </h2>

        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center animate-bounce-in">
            <svg
              className="w-16 h-16 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <p className="text-gray-600 mb-8">
          Your wallet will be credited shortly
        </p>

        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
        >
          Ok, I got it
        </button>
      </div>
    </div>
  );
};

// Main App Component with Routing
const CurrencyPage = () => {
  const [currentPage, setCurrentPage] = useState("rates");
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [showModal, setShowModal] = useState(null);

  const handleSelectCurrency = (currency) => {
    setSelectedCurrency(currency);
    setCurrentPage("detail");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "rates":
        return (
          <CurrencyRates
            onSelectCurrency={handleSelectCurrency}
            onNavigate={setCurrentPage}
          />
        );
      case "detail":
        return (
          <CurrencyDetail
            currency={selectedCurrency}
            onExchange={() => setCurrentPage("swap")}
          />
        );
      case "swap":
        return <SwapCrypto onSwap={() => setCurrentPage("confirm")} />;
      case "confirm":
        return <ConfirmSwap onConfirm={() => setCurrentPage("awaiting")} />;
      case "awaiting":
        return <AwaitingDeposit />;
      case "buy":
        return (
          <BuyCryptocurrency
            onExchange={() => setShowModal("crypto-exchange")}
          />
        );
      case "buy-address":
        return (
          <BuyCryptoAddress
            onCreateExchange={() => setShowModal("exchange-page")}
          />
        );
      case "complete-order":
        return (
          <CompleteOrderPage
            onBuyWithBankTransfer={() => setCurrentPage("complete-order-email")}
          />
        );
      case "complete-order-email":
        return <CompleteOrderEmail onContinue={() => setCurrentPage("otp")} />;
      case "otp":
        return <OTPPage onContinue={() => setCurrentPage("personal-data")} />;
      case "personal-data":
        return (
          <PersonalDataPage
            onContinue={() => setCurrentPage("bank-transfer")}
          />
        );
      case "bank-transfer":
        return (
          <BankTransferDetails
            onContinue={() => setShowModal("payment-success")}
          />
        );
      default:
        return (
          <CurrencyRates
            onSelectCurrency={handleSelectCurrency}
            onNavigate={setCurrentPage}
          />
        );
    }
  };

  const renderModal = () => {
    switch (showModal) {
      case "crypto-exchange":
        return (
          <CryptoExchangeModal
            onAccept={() => {
              setShowModal(null);
              setCurrentPage("buy-address");
            }}
          />
        );
      case "exchange-page":
        return (
          <ExchangePageModal
            onAccept={() => {
              setShowModal(null);
              setCurrentPage("complete-order");
            }}
          />
        );
      case "payment-success":
        return (
          <PaymentSuccessModal
            onClose={() => {
              setShowModal(null);
              setCurrentPage("rates");
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes bounce-in {
          0% { transform: scale(0); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }
      `}</style>
      {renderPage()}
      {renderModal()}
    </div>
  );
};

export default CurrencyPage;

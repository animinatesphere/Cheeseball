import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  Check,
} from "lucide-react";

export default function SellCryptocurrency({ onBack, onNavigate }) {
  const navigate = useNavigate();
  const [selectedAsset, setSelectedAsset] = useState("BTC");
  const [amount, setAmount] = useState("");

  const assets = [
    {
      symbol: "BTC",
      name: "Bitcoin",
      icon: "₿",
      network: "Bitcoin Network",
      iconColor: "#F5B300",
      iconBg: "rgba(245, 179, 0, 0.1)",
      rate: 98000000,
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      icon: "Ξ",
      network: "Ethereum Network",
      iconColor: "#627EEA",
      iconBg: "rgba(98, 126, 234, 0.1)",
      rate: 4500000,
    },
    {
      symbol: "USDT",
      name: "Tether",
      icon: "₮",
      network: "TRC20",
      iconColor: "#26A17B",
      iconBg: "rgba(38, 161, 123, 0.1)",
      rate: 1600,
    },
    {
      symbol: "SOL",
      name: "Solana",
      icon: "S",
      network: "Solana Network",
      iconColor: "#9945FF",
      iconBg: "rgba(153, 69, 255, 0.1)",
      rate: 240000,
    },
  ];

  const activeAsset = assets.find(
    (asset) => asset.symbol === selectedAsset
  );

  const receiveAmount = amount
    ? (
        parseFloat(amount || 0) * (activeAsset?.rate || 0)
      ).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "0.00";

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleContinue = () => {
    if (onNavigate) {
      onNavigate("withdrawal-details");
    } else {
      navigate("/currency-change/withdrawal-details");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] font-['DM_Sans'] text-[#111827]">
      {/* TOPBAR */}
      <nav className="sticky top-0 z-50 h-[72px] bg-white border-b border-[#E5E7EB] flex items-center px-4 md:px-8">
        <div className="max-w-[1200px] mx-auto w-full flex items-center gap-6">
          {/* BACK BUTTON */}
          <button
            onClick={handleBack}
            className="
              w-10 h-10 rounded-[12px] border border-[#E5E7EB]
              flex items-center justify-center
              bg-white transition-all duration-300
              hover:border-[#0063C0] hover:text-[#0063C0]
              hover:shadow-sm
              active:scale-95
            "
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>

          {/* BREADCRUMB */}
          <div className="flex items-center gap-2.5 text-[14px] font-medium text-[#6B7280]">
            <span 
              onClick={() => navigate("/")}
              className="hover:text-[#0063C0] cursor-pointer transition-colors"
            >
              Dashboard
            </span>
            <ChevronRight size={14} className="text-[#D1D5DB]" />
            <span className="font-bold text-[#111827]">Sell Crypto</span>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex justify-center px-4 py-12 md:py-16">
        <div
          className="
            w-full max-w-[680px]
            bg-white
            rounded-[28px]
            shadow-[0_20px_50px_rgba(0,0,0,0.04)]
            border border-[#F0F2F5]
            p-8 md:p-10
          "
        >
          {/* HEADER SECTION */}
          <div className="mb-10">
            <h1
              className="
                font-['Sora']
                text-[32px] md:text-[36px]
                font-bold
                tracking-[-1px]
                text-[#111827]
              "
            >
              Sell Crypto
            </h1>
            <p className="mt-2 text-[16px] text-[#6B7280] leading-relaxed">
              Select the crypto asset and enter the amount you want to sell.
            </p>
          </div>

          {/* CRYPTO SELECTOR */}
          <div className="mb-10">
            <label
              className="
                block mb-4
                text-[12px]
                font-black
                uppercase
                tracking-[1px]
                text-[#9CA3AF]
              "
            >
              Select Asset
            </label>

            <div className="grid grid-cols-1 gap-3">
              {assets.map((asset) => (
                <button
                  key={asset.symbol}
                  onClick={() => setSelectedAsset(asset.symbol)}
                  className={`
                    group w-full
                    rounded-[20px]
                    border-[2px]
                    p-5
                    flex items-center justify-between
                    transition-all duration-300
                    text-left

                    ${
                      selectedAsset === asset.symbol
                        ? "border-[#0063C0] bg-[#F8FBFF] shadow-[0_8px_20px_rgba(0,99,192,0.06)]"
                        : "border-[#F1F3F5] bg-white hover:border-[#E2E8F0] hover:bg-[#F9FAFB]"
                    }
                  `}
                >
                  <div className="flex items-center gap-5">
                    {/* ASSET ICON */}
                    <div
                      style={{ 
                        backgroundColor: asset.iconBg,
                        color: asset.iconColor 
                      }}
                      className="
                        w-14 h-14 rounded-[16px]
                        flex items-center justify-center
                        text-[24px] font-bold
                        shadow-sm
                        group-hover:scale-105 transition-transform duration-300
                      "
                    >
                      {asset.icon}
                    </div>

                    {/* ASSET INFO */}
                    <div>
                      <div className="text-[17px] font-bold text-[#111827]">
                        {asset.name}
                      </div>
                      <div className="mt-1 text-[14px] text-[#6B7280] font-medium">
                        {asset.symbol} · {asset.network}
                      </div>
                    </div>
                  </div>

                  {/* SELECTION INDICATOR */}
                  <div className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center
                    transition-all duration-300
                    ${selectedAsset === asset.symbol 
                      ? "bg-[#0063C0] border-[#0063C0]" 
                      : "border-[#E5E7EB] bg-white"}
                  `}>
                    {selectedAsset === asset.symbol && (
                      <Check size={14} className="text-white" strokeWidth={3} />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* AMOUNT INPUT */}
          <div className="mb-8">
            <label
              className="
                block mb-4
                text-[12px]
                font-black
                uppercase
                tracking-[1px]
                text-[#9CA3AF]
              "
            >
              Amount to Sell
            </label>

            <div
              className="
                group
                rounded-[24px]
                border-[2px] border-[#F1F3F5]
                bg-white
                p-5 md:p-6
                flex items-center gap-4
                transition-all duration-300
                focus-within:border-[#0063C0]
                focus-within:shadow-[0_0_0_5px_rgba(0,99,192,0.06)]
                focus-within:bg-white
              "
            >
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.001"
                className="
                  flex-1 bg-transparent outline-none border-none
                  font-['Sora']
                  text-[32px] md:text-[40px]
                  font-bold
                  tracking-[-1.5px]
                  text-[#111827]
                  placeholder:text-[#E2E8F0]
                "
              />

              {/* CURRENCY DROPDOWN PILL */}
              <button
                className="
                  h-[52px] px-5 rounded-[16px]
                  bg-[#F3F4F6] hover:bg-[#E5E7EB]
                  flex items-center gap-2.5
                  transition-all duration-200
                  border border-transparent
                  active:scale-95
                "
              >
                <div 
                  style={{ color: activeAsset?.iconColor }}
                  className="font-bold text-[15px]"
                >
                  {activeAsset?.symbol}
                </div>
                <ChevronDown size={16} className="text-[#6B7280]" />
              </button>
            </div>
          </div>

          {/* RECEIVE PREVIEW CARD */}
          <div
            className="
              rounded-[28px]
              border border-[#F1F3F5]
              bg-[#F8FAFC]
              p-7 md:p-8
              relative overflow-hidden
            "
          >
            <div className="relative z-10">
              <span
                className="
                  text-[12px]
                  font-black
                  uppercase
                  tracking-[1px]
                  text-[#9CA3AF]
                "
              >
                You will receive
              </span>

              <h2
                className="
                  mt-4
                  font-['Sora']
                  text-[38px] md:text-[46px]
                  font-bold
                  tracking-[-2px]
                  text-[#111827]
                "
              >
                ₦{receiveAmount}
              </h2>

              <div className="mt-4 inline-flex items-center gap-2 text-[14px] font-bold text-[#0063C0] bg-white/50 px-3 py-1.5 rounded-full border border-[#E0E7FF]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0063C0] animate-pulse" />
                Current rate: ₦{(activeAsset?.rate || 0).toLocaleString()}/{activeAsset?.symbol}
              </div>
            </div>
            
            {/* SUBTLE BACKGROUND ACCENT */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0063C0] opacity-[0.02] rounded-full -mr-16 -mt-16" />
          </div>

          {/* CONTINUE BUTTON */}
          <button
            onClick={handleContinue}
            disabled={!amount || parseFloat(amount) <= 0}
            className="
              w-full h-[72px]
              mt-10
              rounded-[22px]
              bg-[#0063C0]
              text-white
              font-['Sora']
              text-[18px]
              font-bold
              tracking-[-0.5px]
              flex items-center justify-center
              transition-all duration-300

              hover:bg-[#0052A3]
              hover:-translate-y-[2px]
              hover:shadow-[0_15px_30px_rgba(0,99,192,0.25)]
              active:scale-[0.98]
              active:translate-y-0

              disabled:opacity-40
              disabled:cursor-not-allowed
              disabled:transform-none
              disabled:shadow-none
            "
          >
            Continue to Sell
          </button>

          {/* FOOTER TEXT */}
          <p className="mt-6 text-center text-[13px] text-[#9CA3AF] font-medium leading-relaxed">
            Transactions are processed instantly. By continuing you agree to our <span className="text-[#0063C0] underline cursor-pointer">Terms of Service</span>.
          </p>
        </div>
      </main>
    </div>
  );
}
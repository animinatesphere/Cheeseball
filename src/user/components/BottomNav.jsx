import { TrendingUp, ArrowDownCircle, ArrowUpCircle, Repeat, Clock, User } from "lucide-react";
import { useTheme } from "../../context/ThemeProvider";

const BottomNav = ({ currentPage, onNavigate }) => {
  const { theme } = useTheme();
  const navItems = [
    { id: "rates", icon: TrendingUp, label: "Market" },
    { id: "buy", icon: ArrowDownCircle, label: "Buy" },
    { id: "sell", icon: ArrowUpCircle, label: "Sell" },
    { id: "swap", icon: Repeat, label: "Swap" },
    { id: "history", icon: Clock, label: "History" },
    { id: "account", icon: User, label: "Account" },
  ];

  const isActive = (pageId) => {
    if (pageId === "support") return currentPage === "support" || currentPage === "address-book";
    if (pageId === "buy") return ["buy", "buy-address", "complete-order", "complete-order-email", "otp", "personal-data", "bank-transfer"].includes(currentPage);
    if (pageId === "sell") return ["sell"].includes(currentPage);
    if (pageId === "swap") return ["swap", "confirm", "awaiting", "giftcard-swap"].includes(currentPage);
    if (pageId === "cards") return ["cards"].includes(currentPage);
    if (pageId === "rates") return ["rates", "detail"].includes(currentPage);
    return currentPage === pageId;
  };

  const isDark = theme === 'dark';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-3 sm:px-6 pb-3 sm:pb-5 flex justify-center pointer-events-none">
      <div
        className="w-full max-w-2xl rounded-2xl sm:rounded-3xl px-2 sm:px-6 py-2 sm:py-3 flex justify-around items-center pointer-events-auto shadow-2xl backdrop-blur-xl"
        style={{
          background: isDark ? 'rgba(10, 14, 26, 0.85)' : 'rgba(255, 255, 255, 0.85)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
          boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.1)'
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.id);

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-0.5 sm:gap-1 transition-all duration-300 group relative ${
                active
                  ? "text-blue-400"
                  : isDark ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {active && (
                <div className="absolute -top-1 w-1 h-1 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              )}
              <div className={`p-1.5 sm:p-2 rounded-xl sm:rounded-2xl transition-all ${
                active
                  ? 'bg-blue-500/15'
                  : isDark ? 'group-hover:bg-white/5' : 'group-hover:bg-gray-100'
              }`}>
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${active ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} />
              </div>
              <span className={`text-[8px] sm:text-[10px] uppercase tracking-widest font-bold transition-opacity ${
                active ? "opacity-100" : "opacity-0 sm:group-hover:opacity-100"
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;

import {
  TrendingUp,
  ArrowDownCircle,
  ArrowUpCircle,
  Repeat,
  Clock,
  User,
  Bell,
} from "lucide-react";
import { useTheme } from "@/shared/providers/ThemeProvider";
import { useNotifications } from "@/services/useNotifications";

const BottomNav = ({ currentPage, onNavigate }) => {
  const { theme } = useTheme();
  const { unreadCount } = useNotifications();
  const navItems = [
    { id: "rates", icon: TrendingUp, label: "Market" },
    { id: "buy", icon: ArrowDownCircle, label: "Buy" },
    { id: "sell", icon: ArrowUpCircle, label: "Sell" },
    { id: "swap", icon: Repeat, label: "Swap" },
    { id: "history", icon: Clock, label: "History" },
    {
      id: "notifications",
      icon: Bell,
      label: "Notifications",
      badge: unreadCount,
    },
    { id: "account", icon: User, label: "Account" },
  ];

  const isActive = (pageId) => {
    if (pageId === "support")
      return currentPage === "support" || currentPage === "address-book";
    if (pageId === "buy")
      return [
        "buy",
        "buy-address",
        "complete-order",
        "complete-order-email",
        "otp",
        "personal-data",
        "bank-transfer",
      ].includes(currentPage);
    if (pageId === "sell") return ["sell"].includes(currentPage);
    if (pageId === "swap")
      return ["swap", "confirm", "awaiting", "giftcard-swap"].includes(
        currentPage,
      );
    if (pageId === "cards") return ["cards"].includes(currentPage);
    if (pageId === "rates") return ["rates", "detail"].includes(currentPage);
    if (pageId === "notifications")
      return ["notifications"].includes(currentPage);
    return currentPage === pageId;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-3 sm:px-6 pb-4 sm:pb-6 flex justify-center pointer-events-none">
      <div
        className="w-full max-w-2xl rounded-2xl sm:rounded-3xl px-2 sm:px-6 py-2 sm:py-3 flex justify-around items-center pointer-events-auto shadow-2xl backdrop-blur-3xl"
        style={{
          background: "rgba(255, 255, 255, 0.9)",
          border: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 12px 48px rgba(0,0,0,0.1)",
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.id);

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 sm:gap-1.5 transition-all duration-300 group relative ${
                active ? "text-[#2563eb]" : "text-slate-500 hover:text-gray-600"
              }`}
            >
              {active && (
                <div className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-[#2563eb] shadow-[0_0_12px_rgba(37,99,235,0.4)]" />
              )}
              <div
                className={`p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl transition-all relative ${
                  active ? "bg-[#2563eb]/10" : "group-hover:bg-gray-100"
                }`}
              >
                <Icon
                  className={`w-5 h-5 sm:w-6 sm:h-6 ${active ? "stroke-[2.5px]" : "stroke-[1.5px]"}`}
                />
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-black transition-opacity ${
                  active
                    ? "opacity-100"
                    : "opacity-0 sm:group-hover:opacity-100"
                }`}
              >
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

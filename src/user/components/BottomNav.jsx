import React from "react";
import { TrendingUp, ShoppingCart, Clock, User } from "lucide-react";

const BottomNav = ({ currentPage, onNavigate }) => {
  const navItems = [
    { id: "rates", icon: TrendingUp, label: "Market" },
    { id: "buy", icon: ShoppingCart, label: "Trade" },
    { id: "history", icon: Clock, label: "History" },
    { id: "support", icon: User, label: "Support" },
  ];

  const isActive = (pageId) => {
    if (pageId === "support") return currentPage === "support" || currentPage === "address-book";
    if (pageId === "buy") return ["buy", "buy-address", "complete-order", "complete-order-email", "otp", "personal-data", "bank-transfer"].includes(currentPage);
    if (pageId === "rates") return ["rates", "detail", "swap", "confirm", "awaiting"].includes(currentPage);
    return currentPage === pageId;
  };

  return (
    <div className="fixed bottom-4 sm:bottom-8 left-0 right-0 z-50 px-4 sm:px-6 flex justify-center pointer-events-none">
      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-2xl border border-white/20 shadow-2xl shadow-blue-900/10 rounded-[2rem] sm:rounded-[2.5rem] px-4 sm:px-8 py-3 sm:py-4 flex justify-around items-center pointer-events-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.id);

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 sm:gap-1.5 transition-all duration-300 group ${
                active ? "text-blue-600 scale-105 sm:scale-110" : "text-gray-400 hover:text-blue-400 saturate-0 hover:saturate-100"
              }`}
            >
              <div className={`p-1.5 sm:p-2 rounded-xl sm:rounded-2xl transition-all ${active ? 'bg-blue-50' : 'group-hover:bg-gray-50'}`}>
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${active ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
              </div>
              <span className={`text-[9px] sm:text-[10px] uppercase tracking-widest font-black transition-opacity ${active ? "opacity-100" : "opacity-0 sm:group-hover:opacity-100"}`}>
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

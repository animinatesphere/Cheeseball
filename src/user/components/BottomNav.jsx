import React from "react";
import { TrendingUp, ShoppingCart, Clock, User } from "lucide-react";

const BottomNav = ({ currentPage, onNavigate }) => {
  const navItems = [
    { id: "rates", icon: TrendingUp, label: "Rate" },
    { id: "buy", icon: ShoppingCart, label: "Buy" },
    { id: "history", icon: Clock, label: "History" },
    { id: "support", icon: User, label: "Support" },
  ];

  const isActive = (pageId) => {
    // Check if current page matches or is a sub-page
    if (pageId === "support") {
      return currentPage === "support" || currentPage === "address-book";
    }
    if (pageId === "buy") {
      return (
        currentPage === "buy" ||
        currentPage === "buy-address" ||
        currentPage === "complete-order" ||
        currentPage === "complete-order-email" ||
        currentPage === "otp" ||
        currentPage === "personal-data" ||
        currentPage === "bank-transfer"
      );
    }
    if (pageId === "rates") {
      return (
        currentPage === "rates" ||
        currentPage === "detail" ||
        currentPage === "swap" ||
        currentPage === "confirm" ||
        currentPage === "awaiting"
      );
    }
    if (pageId === "history") {
      return currentPage === "history";
    }
    return currentPage === pageId;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-4xl mx-auto px-6 py-3">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.id);

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center space-y-1 ${
                  active ? "text-blue-600" : "text-gray-400"
                } hover:text-blue-600 transition-colors`}
              >
                <Icon className="w-6 h-6" />
                <span
                  className={`text-xs ${
                    active ? "font-semibold" : "font-medium"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;

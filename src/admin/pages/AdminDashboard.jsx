import React, { useState } from "react";
import AdminBottomNav from "../component/AdminBottomNav";
import AdminDashboardHome from "../component/AdminDashboardHome";
import AdminCurrencies from "../component/AdminCurrencies";
import AdminOrders from "../component/AdminOrders";
import AdminHistory from "../component/AdminHistory";
import AdminAccount from "../component/AdminAccount";
import AdminAddCurrencyModal from "../component/AdminAddCurrencyModal";

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

  const renderScreen = () => {
    switch (currentScreen) {
      case "dashboard":
        return <AdminDashboardHome onNavigate={setCurrentScreen} />;
      case "rate":
        return <AdminCurrencies onAddCurrency={handleAddCurrency} />;
      case "orders":
        return <AdminOrders />;
      case "history":
        return <AdminHistory onBack={() => setCurrentScreen("dashboard")} />;
      case "account":
        return <AdminAccount />;
      default:
        return <AdminDashboardHome onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-700">
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {renderScreen()}
      </main>

      <AdminBottomNav activeTab={currentScreen} onTabChange={setCurrentScreen} />

      {showAddModal && (
        <AdminAddCurrencyModal
          onClose={() => setShowAddModal(false)}
          onSave={handleSaveCurrency}
        />
      )}
    </div>
  );
}

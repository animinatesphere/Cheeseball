import React, { useState } from "react";
import AccountHome from "./account/AccountHome";
import AdminIncome from "./account/AdminIncome";
import AdminAccountDetails from "./account/AdminAccountDetails";
import AdminsList from "./account/AdminsList";
import AdminRestriction from "./account/AdminRestriction";
import AdminForm from "./account/AdminForm";
import AdminNotifications from "./account/AdminNotifications";
import AdminNotificationForm from "./account/AdminNotificationForm";
import AdminSupportSettings from "./account/AdminSupportSettings";

const AdminAccount = () => {
  const [currentPage, setCurrentPage] = useState("account");
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const admins = [
    { id: 1, name: "Creative Omotayo", role: "Admin 1" },
    { id: 2, name: "Creative Omotayo", role: "Admin 2" },
    { id: 3, name: "Creative Omotayo", role: "Admin 3" },
  ];

  const notifications = [
    {
      id: 1,
      title: "#1 Postmaster Alert",
      date: "02/04/24 7:00pm",
      heading: "System Protocol Optimized",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
    },
    {
      id: 2,
      title: "#2 Postmaster Alert",
      date: "02/04/24 7:15pm",
      heading: "Security Grid Update",
      body: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.",
    },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case "account":
        return <AccountHome onNavigate={setCurrentPage} />;
      case "income":
        return (
          <AdminIncome
            onBack={() => setCurrentPage("account")}
            onSelectTransaction={() => setCurrentPage("transactionDetail")}
          />
        );
      case "transactionDetail":
        return (
          <AdminAccountDetails
            onBack={() => setCurrentPage("income")}
            onBackToIncome={() => setCurrentPage("income")}
          />
        );
      case "admins":
        return (
          <AdminsList
            admins={admins}
            onBack={() => setCurrentPage("account")}
            onAdd={() => setCurrentPage("newAdmin")}
            onSelectAdmin={(admin) => {
              setSelectedAdmin(admin);
              setCurrentPage("pagesRestriction");
            }}
          />
        );
      case "pagesRestriction":
        return (
          <AdminRestriction
            admin={selectedAdmin}
            onBack={() => setCurrentPage("admins")}
            onUpdatePassword={() => setCurrentPage("updatePassword")}
          />
        );
      case "updatePassword":
        return (
          <AdminForm
            title="Credential Upgrade"
            type="update"
            accountName={selectedAdmin?.name || "Creative Omotayo"}
            onClose={() => setCurrentPage("pagesRestriction")}
            onSave={() => setCurrentPage("pagesRestriction")}
          />
        );
      case "newAdmin":
        return (
          <AdminForm
            title="Provision Admin"
            type="new"
            onClose={() => setCurrentPage("admins")}
            onSave={() => setCurrentPage("admins")}
          />
        );
      case "notification":
        return (
          <AdminNotifications
            notifications={notifications}
            onBack={() => setCurrentPage("account")}
            onAdd={() => setCurrentPage("newNotification")}
          />
        );
      case "newNotification":
        return (
          <AdminNotificationForm
            onClose={() => setCurrentPage("notification")}
            onSave={() => setCurrentPage("notification")}
          />
        );
      case "support":
        return (
          <AdminSupportSettings
            onBack={() => setCurrentPage("account")}
            onSave={() => setCurrentPage("account")}
          />
        );
      default:
        return <AccountHome onNavigate={setCurrentPage} />;
    }
  };

  return <div className="flex h-full w-full bg-white">{renderPage()}</div>;
};

export default AdminAccount;

import React, { useState } from "react";
import CurrencyRates from "../components/CurrencyRates";
import CurrencyDetail from "../components/CurrencyDetail";
import SwapCrypto from "../components/SwapCrypto";
import ConfirmSwap from "../components/ConfirmSwap";
import AwaitingDeposit from "../components/AwaitingDeposit";
import BuyCryptocurrency from "../components/BuyCryptocurrency";
import BuyCryptoAddress from "../components/BuyCryptoAddress";
import CompleteOrderPage from "../components/CompleteOrderPage";
import CompleteOrderEmail from "../components/CompleteOrderEmail";
import OTPPage from "../components/OTPPage";
import PersonalDataPage from "../components/PersonalDataPage";
import BankTransferDetails from "../components/BankTransferDetails";
import CryptoExchangeModal from "../components/CryptoExchangeModal";
import ExchangePageModal from "../components/ExchangePageModal";
import PaymentSuccessModal from "../components/PaymentSuccessModal";
import AddressBook from "../components/AddressBook";
import SupportPage from "../components/SupportPage";
import HistoryPage from "../components/HistoryPage";
import AlertRatesPage from "../components/AlertRatesPage";

const CurrencyPage = () => {
  const [currentPage, setCurrentPage] = useState("rates");
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [showModal, setShowModal] = useState(null);

  const handleSelectCurrency = (currency) => {
    setSelectedCurrency(currency);
    setCurrentPage("detail");
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
    setShowModal(null);
    if (page === "rates") {
      setSelectedCurrency(null);
    }
  };

  const handleBack = () => {
    setCurrentPage("rates");
    setSelectedCurrency(null);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "rates":
        return (
          <CurrencyRates
            onSelectCurrency={handleSelectCurrency}
            onNavigate={handleNavigation}
          />
        );

      case "detail":
        return (
          <CurrencyDetail
            currency={selectedCurrency}
            onBack={handleBack}
            onExchange={() => setCurrentPage("swap")}
          />
        );

      case "swap":
        return (
          <SwapCrypto
            onBack={handleBack}
            onSwap={() => setCurrentPage("confirm")}
          />
        );

      case "confirm":
        return (
          <ConfirmSwap
            onBack={() => setCurrentPage("swap")}
            onConfirm={() => setCurrentPage("awaiting")}
          />
        );

      case "awaiting":
        return <AwaitingDeposit onBack={handleBack} />;

      case "buy":
        return (
          <BuyCryptocurrency
            onBack={handleBack}
            onExchange={() => setShowModal("crypto-exchange")}
            onNavigate={handleNavigation}
          />
        );

      case "buy-address":
        return (
          <BuyCryptoAddress
            onBack={() => setCurrentPage("buy")}
            onCreateExchange={() => setShowModal("exchange-page")}
          />
        );

      case "complete-order":
        return (
          <CompleteOrderPage
            onBack={() => setCurrentPage("buy-address")}
            onBuyWithBankTransfer={() => setCurrentPage("complete-order-email")}
          />
        );

      case "complete-order-email":
        return (
          <CompleteOrderEmail
            onBack={() => setCurrentPage("complete-order")}
            onContinue={() => setCurrentPage("otp")}
          />
        );

      case "otp":
        return (
          <OTPPage
            onBack={() => setCurrentPage("complete-order-email")}
            onContinue={() => setCurrentPage("personal-data")}
          />
        );

      case "personal-data":
        return (
          <PersonalDataPage
            onBack={() => setCurrentPage("otp")}
            onContinue={() => setCurrentPage("bank-transfer")}
          />
        );

      case "bank-transfer":
        return (
          <BankTransferDetails
            onBack={() => setCurrentPage("personal-data")}
            onContinue={() => setShowModal("payment-success")}
          />
        );

      case "address-book":
        return <AddressBook onBack={() => setCurrentPage("support")} />;

      case "support":
        return <SupportPage onNavigate={handleNavigation} />;

      case "history":
        return <HistoryPage onNavigate={handleNavigation} />;

      default:
        return (
          <CurrencyRates
            onSelectCurrency={handleSelectCurrency}
            onNavigate={handleNavigation}
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
            onClose={() => setShowModal(null)}
          />
        );

      case "exchange-page":
        return (
          <ExchangePageModal
            onAccept={() => {
              setShowModal(null);
              setCurrentPage("complete-order");
            }}
            onClose={() => setShowModal(null)}
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

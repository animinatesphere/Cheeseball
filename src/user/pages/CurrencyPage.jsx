import React, { useState } from "react";
import { getCurrencies, getUserPortfolio, createTransaction, createGiftCardTrade } from "../../lib/api";
import { supabase } from "../../lib/supabaseClient";
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
import BottomNav from "../components/BottomNav";
import SellCryptocurrency from "../components/SellCryptocurrency";
import SwapGiftCard from "../components/SwapGiftCard";
import CardManagement from "../components/CardManagement";
import GiftCardUpload from "../components/GiftCardUpload";
import WithdrawalDetails from "../components/WithdrawalDetails";

const CurrencyPage = () => {
  const [currentPage, setCurrentPage] = useState("rates");
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [showModal, setShowModal] = useState(null);
  const [transactionData, setTransactionData] = useState(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContinue = async (extraData = {}) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No active session");

      const finalData = { ...transactionData, ...extraData, user_id: session.user.id };

      // Harden the check - if it has a cardName, it's a gift card trade
      const isGiftCard = finalData.type === 'giftcard' || !!finalData.cardName;

      if (isGiftCard) {
        const { error } = await createGiftCardTrade({
          user_id: session.user.id,
          card_type: finalData.cardName || 'Gift Card',
          amount: parseFloat(finalData.fromAmount),
          fiat_amount: parseFloat(finalData.toAmount),
          front_image_url: finalData.frontImage, 
          back_image_url: finalData.backImage,   
          screenshot_url: finalData.screenshotUrl,
          bank_name: finalData.bankName,
          bank_account_number: finalData.accountNumber,
          bank_account_name: finalData.accountName,
          status: 'pending'
        });
        if (error) throw error;
      } else {
        const { error } = await createTransaction({
          user_id: session.user.id,
          exchange_id: `ID:${Math.random().toString(36).substr(2, 10).toUpperCase()}`,
          type: finalData.type || 'sell',
          status: 'waiting',
          from_amount: parseFloat(finalData.fromAmount),
          to_amount: parseFloat(finalData.toAmount),
          from_currency_id: finalData.fromCurrencyId,
          to_currency_id: finalData.toCurrencyId,
          from_token_network: finalData.type === 'giftcard' ? finalData.cardName : finalData.fromCurrency,
          to_token_network: finalData.toCurrency,
          screenshot_url: finalData.screenshot_url,
          payment_method: finalData.paymentMethod || 'manual',
          wallet_address: finalData.wallet_address || '',
          bank_name: finalData.bankName,
          bank_account_number: finalData.accountNumber,
          bank_account_name: finalData.accountName
        });
        if (error) throw error;
      }

      setShowModal("payment-success");
    } catch (err) {
      console.error("Failed to save transaction:", err);
      alert("An error occurred while saving your transaction. Please contact support.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCurrency = (currency) => {
    setSelectedCurrency(currency);
    setCurrentPage("detail");
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
    setShowModal(null);
    if (page === "rates") {
      setSelectedCurrency(null);
      setEmail("");
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
            onSwap={(data) => {
              setTransactionData(data);
              setCurrentPage("confirm");
            }}
            onNavigate={handleNavigation}
          />
        );

      case "confirm":
        return (
          <ConfirmSwap
            transactionData={transactionData}
            onBack={() => setCurrentPage("swap")}
            onConfirm={() => setCurrentPage("awaiting")}
          />
        );

      case "awaiting":
        return (
          <AwaitingDeposit 
            transactionData={transactionData} 
            onBack={handleBack} 
            onContinue={(data) => {
              const updatedData = { ...transactionData, ...data };
              setTransactionData(updatedData);
              if (updatedData.type === 'sell') setCurrentPage("withdrawal-details");
              else handleContinue(data);
            }}
          />
        );

      case "buy":
        return (
          <BuyCryptocurrency
            onBack={handleBack}
            onExchange={(data) => {
              setTransactionData(data);
              setCurrentPage("buy-address");
            }}
          />
        );

      case "sell":
        return (
          <SellCryptocurrency
            onBack={handleBack}
            onExchange={(data) => {
              setTransactionData(data);
              setCurrentPage("awaiting");
            }}
            onNavigate={handleNavigation}
          />
        );

      case "giftcard-swap":
        return (
          <SwapGiftCard 
            onBack={handleBack} 
            onSwap={(data) => {
              setTransactionData(data);
              setCurrentPage("giftcard-upload");
            }}
            onNavigate={handleNavigation} 
          />
        );

      case "giftcard-upload":
        return (
          <GiftCardUpload
            transactionData={transactionData}
            onBack={() => setCurrentPage("giftcard-swap")}
            onContinue={(data) => {
              setTransactionData(prev => ({ ...prev, ...data }));
              setCurrentPage("withdrawal-details");
            }}
          />
        );

      case "withdrawal-details":
        return (
          <WithdrawalDetails
            transactionData={transactionData}
            onBack={() => {
              if (transactionData?.type === 'sell') setCurrentPage("awaiting");
              else setCurrentPage("giftcard-upload");
            }}
            onContinue={(data) => handleContinue(data)}
          />
        );

      case "buy-address":
        return (
          <BuyCryptoAddress
            transactionData={transactionData}
            onBack={() => setCurrentPage("buy")}
            onCreateExchange={(address) => {
              setTransactionData(prev => ({ ...prev, wallet_address: address }));
              setShowModal("exchange-page");
            }}
          />
        );

      case "complete-order":
        return (
          <CompleteOrderPage
            transactionData={transactionData}
            onBack={() => setCurrentPage("buy-address")}
            onBuyWithBankTransfer={() => setCurrentPage("bank-transfer")}
          />
        );

      case "complete-order-email":
        return (
          <CompleteOrderEmail
            onBack={() => setCurrentPage("complete-order")}
            onContinue={(emailVal) => {
              setEmail(emailVal);
              setCurrentPage("otp");
            }}
          />
        );

      case "otp":
        return (
          <OTPPage
            email={email}
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
            transactionData={transactionData}
            onBack={() => setCurrentPage("complete-order")}
            onContinue={(data) => handleContinue(data)}
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
    <div className="min-h-screen bg-white">
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
      <div className="pb-32">
        {renderPage()}
      </div>
      {renderModal()}
      <BottomNav currentPage={currentPage} onNavigate={handleNavigation} />
    </div>
  );
};

export default CurrencyPage;




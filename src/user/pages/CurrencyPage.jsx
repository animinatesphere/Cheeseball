import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { getCurrencies, getUserPortfolio, createTransaction, createGiftCardTrade } from "../../lib/api";
import { supabase } from "../../lib/supabaseClient";
import CurrencyRates from "../components/CurrencyRates";
import CurrencyDetail from "../components/CurrencyDetail";
import ConvertFlow from "../components/ConvertFlow";
import AwaitingDeposit from "../components/AwaitingDeposit";
import BuyFlow from "../components/BuyFlow";
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
import SellCryptocurrency from "../components/SellCryptocurrency";
import SwapGiftCard from "../components/SwapGiftCard";
import CardManagement from "../components/CardManagement";
import GiftCardUpload from "../components/GiftCardUpload";
import WithdrawalDetails from "../components/WithdrawalDetails";
import AccountPage from "../components/AccountPage";
import DepositFlow from "../components/DepositFlow";
import WithdrawalFlow from "../components/WithdrawalFlow";

const CurrencyPage = () => {
  const navigate = useNavigate();
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
          promo_code: finalData.promoCode,
          promo_benefit: finalData.promoBenefit || 0,
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
          bank_account_name: finalData.accountName,
          promo_code: finalData.promoCode,
          promo_benefit: finalData.promoBenefit || 0
        });
        if (error) throw error;
      }
      setShowModal("payment-success");
    } catch (err) {
      console.error("Failed to save transaction:", err);
      alert("An error occurred: " + (err.message || "Please contact support."));
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (path) => {
    navigate(`/currency-change/${path}`);
  };

  const handleBack = () => {
    navigate("/currency-change/rates");
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Routes>
        <Route index element={<Navigate to="rates" replace />} />
        <Route path="rates" element={
          <CurrencyRates
            onSelectCurrency={(cur) => { setSelectedCurrency(cur); navigate("/currency-change/detail"); }}
            onNavigate={handleNavigation}
          />
        } />
        <Route path="detail" element={
          <CurrencyDetail
            currency={selectedCurrency}
            onBack={handleBack}
            onExchange={() => navigate("/currency-change/swap")}
          />
        } />
        <Route path="swap" element={
          <ConvertFlow
            onBack={handleBack}
            onNavigate={handleNavigation}
          />
        } />
        <Route path="confirm" element={<Navigate to="/currency-change/swap" replace />} />
        <Route path="awaiting" element={
          <AwaitingDeposit 
            transactionData={transactionData} 
            onBack={handleBack} 
            onContinue={(data) => {
              const updatedData = { ...transactionData, ...data };
              setTransactionData(updatedData);
              if (updatedData.type === 'sell') navigate("/currency-change/withdrawal-details");
              else handleContinue(updatedData);
            }}
          />
        } />
        <Route path="buy" element={
          <BuyFlow onBack={handleBack} onComplete={handleContinue} />
        } />
        <Route path="deposit" element={
          <DepositFlow onBack={handleBack} onNavigate={handleNavigation} />
        } />
        <Route path="sell" element={
          <SellCryptocurrency
            onBack={handleBack}
            onNavigate={handleNavigation}
          />
        } />
        <Route path="giftcard-swap" element={
          <SwapGiftCard 
            onBack={handleBack} 
            onSwap={(data) => { setTransactionData(data); navigate("/currency-change/giftcard-upload"); }}
            onNavigate={handleNavigation} 
          />
        } />
        <Route path="giftcard-upload" element={
          <GiftCardUpload
            transactionData={transactionData}
            onBack={() => navigate("/currency-change/giftcard-swap")}
            onContinue={(data) => { setTransactionData(prev => ({ ...prev, ...data })); navigate("/currency-change/withdrawal-details"); }}
          />
        } />
        <Route path="withdrawal-details" element={
          <WithdrawalFlow
            onBack={handleBack}
            onNavigate={handleNavigation}
          />
        } />
        <Route path="history" element={<HistoryPage onNavigate={handleNavigation} />} />
        <Route path="account" element={<AccountPage onNavigate={handleNavigation} />} />
        <Route path="support" element={<SupportPage onNavigate={handleNavigation} />} />
        <Route path="address-book" element={<AddressBook onBack={() => navigate("/currency-change/support")} />} />
      </Routes>

      {showModal === "payment-success" && (
        <PaymentSuccessModal
          onClose={() => { setShowModal(null); navigate("/currency-change/rates"); }}
        />
      )}
    </div>
  );
};

export default CurrencyPage;

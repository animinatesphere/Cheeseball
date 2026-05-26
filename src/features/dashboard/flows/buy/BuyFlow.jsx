import React, { useState, useEffect } from "react";
import { ASSETS, T } from "./BuyFlowShared";
import BuyCryptoBreadcrumbs from "./BuyCryptoBreadcrumbs";
import BuyFlowStep1 from "./BuyFlowStep1";
import BuyFlowStep2 from "./BuyFlowStep2";
import BuyFlowStep3 from "./BuyFlowStep3";
import BuyFlowStep4 from "./BuyFlowStep4";
import BuyFlowStep5 from "./BuyFlowStep5";

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; overflow-x: hidden; }
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
  input[type=number] { -moz-appearance: textfield; }

  .ctabtn:hover  { background: #1259D9 !important; }
  .ctabtn:active { transform: scale(0.985); }
  .ghostbtn:hover { background: #EEF3FF !important; color: #1A6FFF !important; }
  .ddopt:hover   { background: #EEF3FF !important; }
  .method-card:hover { border-color: #1A6FFF !important; }
  .netsel:focus  { border-color: #1A6FFF !important; }
  .addrinput:focus { border-color: #1A6FFF !important; }
  .amtwrap:focus-within { border-color: #1A6FFF !important; }
  .dropzone:hover { border-color: #1A6FFF !important; }
  .qbtn:hover    { border-color: #1A6FFF !important; color: #1A6FFF !important; background: #EEF3FF !important; }

  @keyframes fadeUp  { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  @keyframes spin    { to { transform: rotate(360deg); } }
  @keyframes ripple  { 0% { transform:scale(1); opacity:0.6; } 100% { transform:scale(1.8); opacity:0; } }
  @keyframes popIn   { 0% { transform:scale(0); opacity:0; } 80% { transform:scale(1.1); } 100% { transform:scale(1); opacity:1; } }
  @keyframes pulse   { 0%,100% { opacity:1; } 50% { opacity:0.5; } }

  .fadein  { animation: fadeUp 0.25s ease forwards; }
  .pulsing { animation: pulse 1.4s ease-in-out infinite; }
  .ripple  { animation: ripple 1.8s ease-out infinite; }
  .popIn   { animation: popIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275) forwards; }

  /* Responsive Utilities */
  @media (max-width: 1024px) {
    .buygrid { grid-template-columns: 1fr 360px !important; }
  }

  @media (max-width: 900px) {
    .buygrid { grid-template-columns: 1fr !important; }
    .buygrid > div { min-width: 0 !important; }
    .buygrid > div:first-child { border-right: none !important; border-bottom: 1px solid #E8EEFF; padding: 32px 24px 48px !important; }
    .rightpanel { min-height: auto !important; padding: 32px 24px 60px !important; }
    .s6grid  { grid-template-columns: 1fr !important; }
    .step-content { padding: 32px 24px 48px !important; }
    .responsive-title { font-size: 24px !important; overflow-wrap: break-word; }
    .responsive-amount { font-size: 28px !important; }
    .actions-wrap { flex-direction: column-reverse !important; }
    .actions-wrap button { width: 100% !important; flex: none !important; }
  }

  @media (max-width: 540px) {
    .buygrid > div { padding: 24px 20px 36px !important; }
    .step-content { padding: 24px 20px 40px !important; }
    .buy-amt-input { font-size: 28px !important; }
    .s6grid  { padding: 0 16px !important; }
    .rightpanel { padding: 24px 20px 48px !important; }
    .csel-info { display: none !important; }
    .preview-header { flex-direction: column !important; align-items: flex-start !important; gap: 16px !important; }
    .preview-amount-wrap { flex-direction: column !important; align-items: center !important; text-align: center !important; }
    .preview-amount-item { text-align: center !important; }
    .preview-arrow { transform: rotate(90deg) !important; margin: 12px 0 !important; }
    .preview-amount-val { font-size: 28px !important; }
    .breadcrumb-nav { margin-bottom: 24px !important; }
    .breadcrumb-item:not(:last-child):not(:first-child):not(:nth-last-child(2)) { display: none !important; }
  }

  @media (max-width: 480px) {
    .buygrid > div:first-child { padding: 20px 16px 24px !important; }
    .buygrid > div:last-child { padding: 20px 16px 24px !important; }
    .responsive-title { font-size: 22px !important; }
    .buy-amt-input { font-size: 24px !important; }
    .csel > div { padding: 12px 14px !important; }
    .amtwrap { padding: 16px 18px !important; }
  }

  @media (max-width: 380px) {
    .buygrid > div:first-child { padding: 16px 12px 20px !important; }
    .buygrid > div:last-child { padding: 16px 12px 20px !important; }
    .csel > div { padding: 12px 10px !important; }
    .ddopt { padding: 10px 8px !important; }
  }
`;

const BuyFlow = ({ onBack }) => {
  // Navigation
  const [step, setStep] = useState(1);

  // Step 1 state
  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0]);
  const [payAmount, setPayAmount]         = useState(0);
  const [searchQuery, setSearchQuery]     = useState("");

  // API data state
  const [quoteData, setQuoteData]           = useState(null);   // from POST /api/rates/buy-quote
  const [transactionData, setTransactionData] = useState(null); // from POST /api/broker/buy
  const [paymentData, setPaymentData]       = useState(null);   // from POST /api/payments/setup
  const [bankInstructions, setBankInstructions] = useState(null);

  // Step 3 state
  const [paymentMethod, setPaymentMethod]   = useState("ngn_wallet");

  // Step 4 state
  const [proofFile, setProofFile]           = useState(null);
  const [hasPaid, setHasPaid]               = useState(false);

  // Quote expiry
  const [expiryTime, setExpiryTime]         = useState(0);
  const [isExpired, setIsExpired]           = useState(false);

  // Derived values from quote
  const receiveAmount = quoteData?.crypto_amount ? parseFloat(quoteData.crypto_amount) : 0;
  const finalRate     = quoteData?.final_rate    ? parseFloat(quoteData.final_rate)    : 0;

  // Countdown timer driven from quoteData.expires_at
  useEffect(() => {
    if (!quoteData?.expires_at || step < 2 || step >= 5) return;
    const tick = () => {
      const remaining = Math.max(0, Math.round((new Date(quoteData.expires_at) - Date.now()) / 1000));
      setExpiryTime(remaining);
      if (remaining === 0) setIsExpired(true);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [quoteData, step]);

  const resetExpiry = () => { setIsExpired(false); setStep(1); setQuoteData(null); };
  const nextStep    = () => setStep(p => Math.min(p + 1, 5));
  const prevStep    = () => setStep(p => Math.max(p - 1, 1));

  const breadcrumbs = (
    <BuyCryptoBreadcrumbs
      currentStep={step}
      onStepClick={s => { if (s < step) setStep(s); }}
      onBackToDashboard={onBack}
    />
  );

  const commonProps = {
    payAmount,
    receiveAmount,
    selectedAsset,
    expiryTime,
    finalRate,
    breadcrumbs,
  };

  return (
    <div style={{ minHeight: "100vh", background: T.white, overflowX: "hidden", width: "100%" }}>
      <style>{GLOBAL_CSS}</style>
      <div style={{ animation: "fadeUp 0.25s ease forwards" }}>

        {step === 1 && (
          <BuyFlowStep1
            selectedAsset={selectedAsset}
            setSelectedAsset={setSelectedAsset}
            payAmount={payAmount}
            setPayAmount={setPayAmount}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            breadcrumbs={breadcrumbs}
            onQuoteFetched={(quote) => { setQuoteData(quote); setIsExpired(false); nextStep(); }}
          />
        )}

        {step === 2 && (
          <BuyFlowStep2
            {...commonProps}
            quoteData={quoteData}
            isExpired={isExpired}
            resetExpiry={resetExpiry}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}

        {step === 3 && (
          <BuyFlowStep3
            {...commonProps}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}

        {step === 4 && (
          <BuyFlowStep4
            {...commonProps}
            paymentMethod={paymentMethod}
            quoteData={quoteData}
            transactionData={transactionData}
            setTransactionData={setTransactionData}
            paymentData={paymentData}
            setPaymentData={setPaymentData}
            bankInstructions={bankInstructions}
            setBankInstructions={setBankInstructions}
            proofFile={proofFile}
            setProofFile={setProofFile}
            hasPaid={hasPaid}
            setHasPaid={setHasPaid}
            prevStep={prevStep}
            onSuccess={() => setStep(5)}
          />
        )}

        {step === 5 && (
          <BuyFlowStep5
            paymentMethod={paymentMethod}
            receiveAmount={receiveAmount}
            selectedAsset={selectedAsset}
            payAmount={payAmount}
            transactionData={transactionData}
            onBack={onBack}
            setStep={setStep}
            breadcrumbs={breadcrumbs}
          />
        )}

      </div>
    </div>
  );
};

export default BuyFlow;

import React, { useState, useEffect } from "react";
import { ASSETS, NETWORKS, PRICE_EXPIRY_TIME, T } from "./BuyFlowShared";
import BuyCryptoBreadcrumbs from "./BuyCryptoBreadcrumbs";
import BuyFlowStep1 from "./BuyFlowStep1";
import BuyFlowStep2 from "./BuyFlowStep2";
import BuyFlowStep3 from "./BuyFlowStep3";
import BuyFlowStep4 from "./BuyFlowStep4";
import BuyFlowStep5 from "./BuyFlowStep5";
import BuyFlowStep6 from "./BuyFlowStep6";

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
  const [step, setStep]                   = useState(1);
  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0]);
  const [payAmount, setPayAmount]         = useState(150000);
  const [receiveAmount]                   = useState(0.00155569);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletLabel, setWalletLabel]     = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState(NETWORKS[ASSETS[0].symbol][0]);
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [expiryTime, setExpiryTime]       = useState(PRICE_EXPIRY_TIME);
  const [isExpired, setIsExpired]         = useState(false);
  const [searchQuery, setSearchQuery]     = useState("");
  const [proofFile, setProofFile]         = useState(null);
  const [hasPaid, setHasPaid]             = useState(false);

  useEffect(() => {
    if (step >= 2 && step < 6 && expiryTime > 0 && !isExpired) {
      const t = setInterval(() => setExpiryTime(p => p - 1), 1000);
      return () => clearInterval(t);
    }
    if (expiryTime === 0) setIsExpired(true);
  }, [step, expiryTime, isExpired]);

  const resetExpiry = () => { setExpiryTime(PRICE_EXPIRY_TIME); setIsExpired(false); };
  const nextStep    = () => setStep(p => Math.min(p + 1, 6));
  const prevStep    = () => setStep(p => Math.max(p - 1, 1));

  const breadcrumbs = <BuyCryptoBreadcrumbs currentStep={step} onStepClick={setStep} onBackToDashboard={onBack} />;
  const commonProps = { payAmount, receiveAmount, selectedAsset, expiryTime, walletAddress, selectedNetwork, breadcrumbs };

  return (
    <div style={{ minHeight:"100vh", background: T.white, overflowX:"hidden", width:"100%" }}>
      <style>{GLOBAL_CSS}</style>

      {/* Top breadcrumb bar removed, passed as prop instead */}

      <div style={{ animation: "fadeUp 0.25s ease forwards" }}>
        {step === 1 && (
          <BuyFlowStep1
            selectedAsset={selectedAsset} setSelectedAsset={setSelectedAsset}
            setSelectedNetwork={setSelectedNetwork} payAmount={payAmount}
            setPayAmount={setPayAmount} searchQuery={searchQuery}
            setSearchQuery={setSearchQuery} nextStep={nextStep} onViewAll={onBack}
            breadcrumbs={breadcrumbs}
          />
        )}
        {step === 2 && (
          <BuyFlowStep2
            {...commonProps} nextStep={nextStep} prevStep={prevStep}
            isExpired={isExpired} resetExpiry={resetExpiry}
          />
        )}
        {step === 3 && (
          <BuyFlowStep3
            {...commonProps} setSelectedNetwork={setSelectedNetwork}
            setWalletAddress={setWalletAddress} walletLabel={walletLabel}
            setWalletLabel={setWalletLabel} nextStep={nextStep} prevStep={prevStep}
            isExpired={isExpired} resetExpiry={resetExpiry}
          />
        )}
        {step === 4 && (
          <BuyFlowStep4
            {...commonProps} paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod} nextStep={nextStep} prevStep={prevStep}
          />
        )}
        {step === 5 && (
          <BuyFlowStep5
            {...commonProps} paymentMethod={paymentMethod} prevStep={prevStep}
            setStep={setStep} hasPaid={hasPaid} setHasPaid={setHasPaid}
            proofFile={proofFile} setProofFile={setProofFile}
          />
        )}
        {step === 6 && (
          <BuyFlowStep6
            paymentMethod={paymentMethod} receiveAmount={receiveAmount}
            selectedAsset={selectedAsset} payAmount={payAmount}
            walletAddress={walletAddress} onBack={onBack} setStep={setStep}
            breadcrumbs={breadcrumbs}
          />
        )}
      </div>
    </div>
  );
};

export default BuyFlow;


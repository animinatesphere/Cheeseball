import React, { useState, useEffect } from "react";
import { T } from "./ConvertFlowShared";
import ConvertFlowBreadcrumbs from "./ConvertFlowBreadcrumbs";
import ConvertFlowStep1 from "./ConvertFlowStep1";
import ConvertFlowStep2 from "./ConvertFlowStep2";
import ConvertFlowStep3 from "./ConvertFlowStep3";
import { getWallets } from "@/services/api";

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; overflow-x: hidden; }
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
  input[type=number] { -moz-appearance: textfield; }

  .ctabtn:hover  { background: ${T.blueDark} !important; }
  .ctabtn:active { transform: scale(0.985); }
  .ghostbtn:hover { background: ${T.blueLight} !important; color: ${T.blue} !important; }
  .ddopt:hover   { background: ${T.blueLight} !important; }
  .method-card:hover { border-color: ${T.blue} !important; }
  .netsel:focus  { border-color: ${T.blue} !important; }
  .addrinput:focus { border-color: ${T.blue} !important; }
  .amtwrap:focus-within { border-color: ${T.blue} !important; }
  .dropzone:hover { border-color: ${T.blue} !important; }
  .qbtn:hover    { border-color: ${T.blue} !important; color: ${T.blue} !important; background: ${T.blueLight} !important; }

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
    .buygrid > div:first-child { border-right: none !important; border-bottom: none !important; padding: 32px 24px 48px !important; }
    .rightpanel { display: none !important; }
  }

  @media (max-width: 640px) {
    .step-content { padding: 24px 16px 40px !important; }
    .responsive-title { font-size: 24px !important; }
  }
`;

export default function ConvertFlow({ onClose }) {
  const [step, setStep] = useState(1);
  const [balances, setBalances] = useState([]);
  const [selectedFromAsset, setSelectedFromAsset] = useState(null);
  const [selectedToAsset, setSelectedToAsset] = useState(null);
  const [fromAmount, setFromAmount] = useState("");
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);

  // Load balances on mount
  useEffect(() => {
    (async () => {
      try {
        const wallets = await getWallets();
        if (Array.isArray(wallets)) {
          setBalances(wallets);
        }
      } catch (err) {
        console.error("Failed to load balances:", err);
      }
    })();
  }, []);

  const handlePreviewFetched = (previewData) => {
    setPreview(previewData);
    setStep(2);
  };

  const handleExecuted = (resultData) => {
    setResult(resultData);
    setStep(3);
  };

  const handleBackToStep1 = () => {
    setStep(1);
    setPreview(null);
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      window.history.back();
    }
  };

  const breadcrumbs = (
    <ConvertFlowBreadcrumbs currentStep={step} totalSteps={3} />
  );

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      {step === 1 && (
        <ConvertFlowStep1
          selectedFromAsset={selectedFromAsset}
          setSelectedFromAsset={setSelectedFromAsset}
          selectedToAsset={selectedToAsset}
          setSelectedToAsset={setSelectedToAsset}
          fromAmount={fromAmount}
          setFromAmount={setFromAmount}
          balances={balances}
          onPreviewFetched={handlePreviewFetched}
          breadcrumbs={breadcrumbs}
        />
      )}
      {step === 2 && preview && (
        <ConvertFlowStep2
          preview={preview}
          selectedFromAsset={selectedFromAsset}
          selectedToAsset={selectedToAsset}
          onExecuted={handleExecuted}
          onBack={handleBackToStep1}
          breadcrumbs={breadcrumbs}
        />
      )}
      {step === 3 && result && (
        <ConvertFlowStep3
          result={result}
          selectedFromAsset={selectedFromAsset}
          selectedToAsset={selectedToAsset}
          onClose={handleClose}
        />
      )}
    </>
  );
}

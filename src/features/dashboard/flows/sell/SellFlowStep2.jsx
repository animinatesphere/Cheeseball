import React, { useState, useEffect } from "react";
import { T, Ico, formatNGN, CTA, GhostBtn, RightPanel } from "./SellFlowShared";
import { validatePromoCode, createSellTransaction } from "@/services/api";

export default function SellFlowStep2(props) {
  const {
    payAmount, receiveAmount, selectedAsset, selectedNetwork, quoteData, finalRate, expiryTime,
    promoCode, setPromoCode, promoBenefit, setPromoBenefit,
    onSuccess, prevStep, setTransactionData, setDepositAddressData, cryptoSource,
    isExpired, resetExpiry
  } = props;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [promoInput, setPromoInput] = useState("");
  const [promoStatus, setPromoStatus] = useState(null); // 'valid', 'invalid', 'checking'

  const applyPromo = async () => {
    const code = (promoInput || "").trim();
    if (!code) return;
    setPromoStatus("checking");
    try {
      const res = await validatePromoCode(code);
      if (res?.valid) {
        setPromoStatus("valid");
        setPromoCode(code);
        setPromoBenefit(res.benefit || res.discount || 0);
      } else {
        setPromoStatus("invalid");
        setPromoCode("");
        setPromoBenefit(0);
      }
    } catch {
      setPromoStatus("invalid");
      setPromoCode("");
      setPromoBenefit(0);
    }
  };

  const finalReceiveAmount = receiveAmount + promoBenefit;

  const handleSell = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        quote_id: quoteData.id,
        payout_method: "ngn_wallet",
        crypto_source: cryptoSource,
        network: selectedNetwork || selectedAsset.network || undefined,
      };
      if (promoCode) payload.promo_code = promoCode;

      const res = await createSellTransaction(payload);
      setTransactionData(res);
      if (cryptoSource === "external_wallet" && res.broker_wallet_address) {
        setDepositAddressData({
          address: res.broker_wallet_address,
          memo: res.deposit_memo,
          network: res.network || selectedNetwork || selectedAsset.network,
        });
      }
      onSuccess();
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  const getErrorMessage = (err) => {
    if (!err) return null;
    if (typeof err === 'string') return err;
    if (err.message) return err.message;
    return JSON.stringify(err);
  };

  const errorMessage = getErrorMessage(error) || "Failed to create transaction.";

  const buttonText = cryptoSource === "external_wallet" ? "Generate Wallet" : "Confirm & Sell";

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", minHeight: "100vh", background: T.white, overflowX: "hidden", maxWidth: "100vw" }} className="sellgrid">
      <div style={{ padding: "44px 52px 60px", borderRight: `1px solid ${T.border}` }} className="step-content">

        <p style={{ fontSize: 11, fontWeight: 600, color: T.blue, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6, fontFamily: "'DM Sans',sans-serif" }}>Step 2 of 3</p>
        <h1 className="responsive-title" style={{ fontFamily: "'Sora',sans-serif", fontSize: 28, fontWeight: 700, color: T.text, letterSpacing: "-0.6px", lineHeight: 1.15 }}>Confirm Details</h1>
        <p style={{ fontSize: 14, color: T.text2, marginTop: 6, lineHeight: 1.6, fontFamily: "'DM Sans',sans-serif" }}>Review your order details and apply any promo codes before confirming.</p>

        <div style={{ marginTop: 32 }}>
          {/* Promo code */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.text3, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12, fontFamily: "'DM Sans',sans-serif" }}>Promo Code (Optional)</p>
            <div style={{ display: "flex", gap: 10 }}>
              <input
                type="text"
                placeholder="Enter promo code"
                value={promoInput}
                onChange={(e) => { setPromoInput(e.target.value); setPromoStatus(null); }}
                style={{ flex: 1, padding: "14px 16px", borderRadius: 14, border: `1.5px solid ${promoStatus === "invalid" ? T.red : T.border}`, background: T.surface, outline: "none", fontSize: 14, fontFamily: "'DM Sans',sans-serif", color: T.text }}
              />
              <button
                onClick={applyPromo}
                disabled={!promoInput || promoStatus === "checking" || promoStatus === "valid"}
                style={{ padding: "0 24px", borderRadius: 14, border: "none", background: promoStatus === "valid" ? T.green : T.blue, color: "#fff", fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 700, cursor: (!promoInput || promoStatus === "checking" || promoStatus === "valid") ? "not-allowed" : "pointer", opacity: (!promoInput || promoStatus === "checking") ? 0.6 : 1, transition: "all 0.2s" }}
              >
                {promoStatus === "checking" ? "..." : promoStatus === "valid" ? "Applied ✓" : "Apply"}
              </button>
            </div>
            {promoStatus === "invalid" && <p style={{ fontSize: 12, color: T.red, marginTop: 8, fontFamily: "'DM Sans',sans-serif" }}>Invalid or expired promo code.</p>}
          </div>

          {/* Summary */}
          <div style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 16, padding: "16px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
              <span style={{ fontSize: 13, color: T.text2, fontFamily: "'DM Sans',sans-serif" }}>Amount due</span>
              <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 700, color: T.text }}>{formatNGN(receiveAmount)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
              <span style={{ fontSize: 13, color: T.text2, fontFamily: "'DM Sans',sans-serif" }}>Promo code</span>
              {promoBenefit > 0 ? (
                <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 700, color: T.greenText }}>+{formatNGN(promoBenefit)}</span>
              ) : (
                <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 700, color: T.text2 }}>—</span>
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
              <span style={{ fontSize: 13, color: T.text2, fontFamily: "'DM Sans',sans-serif" }}>Final payout</span>
              <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 700, color: T.text }}>{formatNGN(finalReceiveAmount)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
              <span style={{ fontSize: 13, color: T.text2, fontFamily: "'DM Sans',sans-serif" }}>You sell</span>
              <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 700, color: T.red }}>{payAmount} {selectedAsset.symbol}</span>
            </div>
          </div>

          {error && (
            <div className="fadein" style={{ marginTop: 16, display: "flex", alignItems: "flex-start", gap: 10, background: T.redLight, border: `1px solid #FECACA`, borderRadius: 12, padding: "12px 16px", wordBreak: "break-word" }}>
              <Ico.info />
              <p style={{ fontSize: 13, color: T.red, fontFamily: "'DM Sans',sans-serif", lineHeight: 1.5 }}>{errorMessage}</p>
            </div>
          )}

          <div className="actions-wrap" style={{ display: "flex", gap: 12, marginTop: 32 }}>
            <GhostBtn onClick={prevStep} style={{ flex: 1 }}>← Back</GhostBtn>
            <CTA onClick={handleSell} disabled={loading} loading={loading} style={{ flex: 2 }}>
              {buttonText}
            </CTA>
          </div>
        </div>
      </div>

      <RightPanel payAmount={payAmount} receiveAmount={receiveAmount} rate={finalRate} selectedAsset={selectedAsset} selectedNetwork={selectedNetwork} expiryTime={expiryTime} step={2} />

      {/* Expired overlay */}
      {isExpired && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(10,15,30,0.6)", backdropFilter: "blur(6px)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: T.white, borderRadius: 28, padding: 40, maxWidth: 420, width: "100%", textAlign: "center", boxShadow: "0 25px 60px rgba(0,0,0,0.15)" }}>
            <div style={{ width: 72, height: 72, background: T.orangeLight, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              {Ico.clock(T.orange)}
            </div>
            <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 22, fontWeight: 700, color: T.text, marginBottom: 8 }}>Rate expired</h3>
            <p style={{ color: T.text2, fontSize: 14, lineHeight: 1.6, marginBottom: 24, fontFamily: "'DM Sans',sans-serif" }}>Rates changed while you were reviewing. Go back to get a fresh quote.</p>
            <CTA onClick={resetExpiry}><Ico.refresh /> Get New Quote</CTA>
          </div>
        </div>
      )}
    </div>
  );
}

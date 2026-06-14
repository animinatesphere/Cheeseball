import React, { useState, useEffect, useRef } from "react";
import {
  T,
  Ico,
  formatNGN,
  formatTime,
  CTA,
  GhostBtn,
  RightPanel,
  SecureFooter,
} from "./BuyFlowShared";
import {
  createBuyTransaction,
  setupPayment,
  getBuyTransactionStatus,
  getWallets,
  validatePromoCode,
} from "@/services/api";

function PromoCodeInput({ promoCode, setPromoCode, promoBenefit, setPromoBenefit }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [inputVal, setInputVal] = useState(promoCode || "");

  const apply = async () => {
    if (!inputVal) return;
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await validatePromoCode(inputVal);
      if (res.valid) {
        setPromoBenefit(res.discount || res.benefit || 0);
        setPromoCode(inputVal);
        setSuccess(true);
      } else {
        setError("Invalid or expired promo code");
        setPromoBenefit(0);
        setPromoCode("");
      }
    } catch (e) {
      setError(e.message || "Failed to validate code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 24, marginBottom: 16 }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>
        Promo code (optional)
      </p>
      <div style={{ display: "flex", gap: 10 }}>
        <input
          type="text"
          placeholder="Enter promo code"
          value={inputVal}
          onChange={(e) => {
            setInputVal(e.target.value.toUpperCase());
            setError(null);
            setSuccess(false);
            if (e.target.value === "") {
               setPromoBenefit(0);
               setPromoCode("");
            }
          }}
          style={{ flex: 1, border: `1.5px solid ${success ? T.green : error ? T.red : T.border}`, borderRadius: 12, padding: "12px 16px", fontSize: 13, fontFamily: "'DM Sans',sans-serif", color: T.text, outline: "none", background: T.white }}
          onFocus={(e) => { if(!success && !error) e.target.style.borderColor = T.blue; }}
          onBlur={(e) => { if(!success && !error) e.target.style.borderColor = T.border; }}
        />
        <button
          onClick={apply}
          disabled={!inputVal || loading || success}
          style={{ background: success ? T.greenLight : T.surface, border: `1.5px solid ${success ? "#A7F3D0" : T.border}`, color: success ? T.greenText : T.text, padding: "0 18px", borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: (!inputVal || loading || success) ? "not-allowed" : "pointer", transition: "all 0.15s", fontFamily: "'DM Sans',sans-serif" }}
        >
          {loading ? "..." : success ? "Applied" : "Apply"}
        </button>
      </div>
      {error && <p style={{ fontSize: 12, color: T.red, marginTop: 6, fontFamily: "'DM Sans',sans-serif" }}>{error}</p>}
      {success && <p style={{ fontSize: 12, color: T.greenText, marginTop: 6, fontFamily: "'DM Sans',sans-serif" }}>Promo code applied! {formatNGN(promoBenefit)} discount</p>}
    </div>
  );
}

/* ─── NGN Wallet variant ─── */
function WalletVariant({
  payAmount, receiveAmount, selectedAsset, expiryTime, quoteData,
  setTransactionData, prevStep, onSuccess, breadcrumbs,
  promoCode, setPromoCode, promoBenefit, setPromoBenefit, finalRate, isExpired, resetExpiry
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);

  useEffect(() => {
    getWallets().then((wallets) => {
      const list = Array.isArray(wallets) ? wallets : (wallets?.results || []);
      const ngn = list.find(
        (w) => (w.asset === "NGN" || w.asset_symbol === "NGN" || w.currency === "NGN" || w.symbol === "NGN")
      );
      if (ngn) {
        const bal = ngn.available_balance ?? ngn.balance ?? ngn.amount ?? 0;
        setWalletBalance(parseFloat(bal) || 0);
      } else {
        // No NGN wallet found — treat as 0 balance so UI is not stuck on Loading
        setWalletBalance(0);
      }
    }).catch(() => setWalletBalance(0));
  }, []);

  const finalPayAmount = Math.max(0, payAmount - promoBenefit);
  const hasSufficientBalance = walletBalance === null || walletBalance >= finalPayAmount;

  const handlePay = async () => {
    setLoading(true);
    setError(null);
    try {
      const txn = await createBuyTransaction(quoteData.id, "ngn_wallet", { promo_code: promoCode, promo_benefit: promoBenefit });
      setTransactionData(txn);
      onSuccess();
    } catch (err) {
      setError(err.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 400px",minHeight:"100vh",background:T.white,maxWidth:"100vw"}} className="buygrid">
      <div className="step-content" style={{padding:"44px 52px 60px",borderRight:`1px solid ${T.border}`}}>
        {breadcrumbs}
        <p style={{fontSize:11,fontWeight:600,color:T.blue,textTransform:"uppercase",letterSpacing:"1px",marginBottom:6,fontFamily:"'DM Sans',sans-serif"}}>Step 3 of 4</p>
        <h1 className="responsive-title" style={{fontFamily:"'Sora',sans-serif",fontSize:28,fontWeight:700,color:T.text,letterSpacing:"-0.6px"}}>Confirm Purchase</h1>
        <p style={{fontSize:14,color:T.text2,marginTop:6,lineHeight:1.6,fontFamily:"'DM Sans',sans-serif"}}>Review your instant NGN wallet payment.</p>

        {/* Promo code */}
        <PromoCodeInput promoCode={promoCode} setPromoCode={setPromoCode} promoBenefit={promoBenefit} setPromoBenefit={setPromoBenefit} />

        {/* Wallet balance */}
        <div style={{marginTop:16,background:hasSufficientBalance?"#F0FDF4":T.redLight,border:`1.5px solid ${hasSufficientBalance?"#DCFCE7":"#FECACA"}`,borderRadius:16,padding:"20px 22px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:48,height:48,borderRadius:14,background:T.white,display:"flex",alignItems:"center",justifyContent:"center",border:`1.5px solid ${hasSufficientBalance?"#DCFCE7":"#FECACA"}`}}><Ico.wallet/></div>
            <div>
              <p style={{fontSize:13,color:hasSufficientBalance?"#166534":T.red,fontFamily:"'DM Sans',sans-serif"}}>Available NGN balance</p>
              <p style={{fontFamily:"'Sora',sans-serif",fontSize:22,fontWeight:700,color:T.text,marginTop:2}}>{walletBalance !== null ? formatNGN(walletBalance) : "Loading…"}</p>
            </div>
          </div>
        </div>

        {/* Payment detail */}
        <div style={{marginTop:16,background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:16,padding:"16px 20px"}}>
          <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${T.border}`}}>
            <span style={{fontSize:13,color:T.text2,fontFamily:"'DM Sans',sans-serif"}}>Amount due</span>
            <span style={{fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:700,color:T.text}}>{formatNGN(payAmount)}</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${T.border}`}}>
            <span style={{fontSize:13,color:T.text2,fontFamily:"'DM Sans',sans-serif"}}>Promo code</span>
            {promoBenefit > 0 ? (
              <span style={{fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:700,color:T.greenText}}>-{formatNGN(promoBenefit)}</span>
            ) : (
              <span style={{fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:700,color:T.text2}}>—</span>
            )}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${T.border}`}}>
            <span style={{fontSize:13,color:T.text2,fontFamily:"'DM Sans',sans-serif"}}>Final total</span>
            <span style={{fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:700,color:T.text}}>{formatNGN(finalPayAmount)}</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0"}}>
            <span style={{fontSize:13,color:T.text2,fontFamily:"'DM Sans',sans-serif"}}>You receive</span>
            <span style={{fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:700,color:T.blue}}>{receiveAmount} {selectedAsset.symbol}</span>
          </div>
        </div>

        {error && (
          <div style={{marginTop:16,display:"flex",alignItems:"flex-start",gap:10,background:T.redLight,border:"1px solid #FECACA",borderRadius:12,padding:"12px 16px"}}>
            <Ico.info/><p style={{fontSize:13,color:T.red,fontFamily:"'DM Sans',sans-serif",lineHeight:1.5}}>{error}</p>
          </div>
        )}

        <div className="actions-wrap" style={{display:"flex",gap:12,marginTop:24}}>
          <GhostBtn onClick={prevStep} style={{flex:1}}>← Back</GhostBtn>
          <CTA onClick={handlePay} disabled={loading||!hasSufficientBalance} loading={loading} style={{flex:2}}>
            {`Pay ${formatNGN(finalPayAmount)}`}
          </CTA>
        </div>
        <SecureFooter/>
      </div>
      <RightPanel payAmount={finalPayAmount} receiveAmount={receiveAmount} selectedAsset={selectedAsset} expiryTime={expiryTime} step={3} rate={finalRate}/>
      
      {isExpired && (
        <div style={{position:"fixed",inset:0,background:"rgba(10,15,30,0.6)",backdropFilter:"blur(6px)",zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
          <div style={{background:T.white,borderRadius:28,padding:40,maxWidth:420,width:"100%",textAlign:"center",boxShadow:"0 25px 60px rgba(0,0,0,0.15)"}}>
            <div style={{width:72,height:72,background:T.orangeLight,borderRadius:20,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}>{Ico.clock(T.orange)}</div>
            <h3 style={{fontFamily:"'Sora',sans-serif",fontSize:22,fontWeight:700,color:T.text,marginBottom:8}}>Rate expired</h3>
            <p style={{color:T.text2,fontSize:14,lineHeight:1.6,marginBottom:24,fontFamily:"'DM Sans',sans-serif"}}>Rates changed while you were reviewing. Go back to get a fresh quote.</p>
            <CTA onClick={resetExpiry}><Ico.refresh/> Get New Quote</CTA>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Paystack variant ─── */
function PaystackVariant({
  payAmount, receiveAmount, selectedAsset, expiryTime, quoteData,
  setTransactionData, setPaymentData, prevStep, onSuccess, breadcrumbs,
  promoCode, setPromoCode, promoBenefit, setPromoBenefit, finalRate, isExpired, resetExpiry
}) {
  const [loading, setLoading] = useState(false);
  const [setupDone, setSetupDone] = useState(false);
  const [bankDetails, setBankDetails] = useState(null);
  const [error, setError] = useState(null);
  const [polling, setPolling] = useState(false);
  const [pollStatus, setPollStatus] = useState(null);
  const pollRef = useRef(null);

  const finalPayAmount = Math.max(0, payAmount - promoBenefit);

  const handleSetupPayment = async () => {
    setLoading(true);
    setError(null);
    try {
      const txn = await createBuyTransaction(quoteData.id, "paystack", { promo_code: promoCode, promo_benefit: promoBenefit });
      setTransactionData(txn);
      const setup = await setupPayment(txn.id, "paystack");
      setPaymentData(setup);
      const pd = setup?.provider_payload?.data;
      setBankDetails(pd);
      setSetupDone(true);
      setPolling(true);
      pollRef.current = setInterval(async () => {
        try {
          const status = await getBuyTransactionStatus(txn.id);
          setPollStatus(status.status);
          if (["completed", "failed", "rejected"].includes(status.status)) {
            clearInterval(pollRef.current);
            setPolling(false);
            if (status.status === "completed") onSuccess();
          }
        } catch { }
      }, 12000);
    } catch (err) {
      setError(err.message || "Failed to setup payment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  const statusMessages = {
    pending_payment: "Waiting for your transfer…",
    confirming: "Payment detected — confirming on-chain…",
    processing: "Processing your crypto…",
  };

  return (
    <div style={{ background: T.white, minHeight: "100vh", width: "100%" }}>
      <div className="step-content" style={{ padding: "44px 52px 0" }}>{breadcrumbs}</div>
      <div className="step-content" style={{ padding: "0 52px 60px", maxWidth: 640, margin: "0 auto", width: "100%" }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: T.blue, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6, fontFamily: "'DM Sans',sans-serif" }}>Step 3 of 4</p>
        <div style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 20, padding: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
            <div style={{ width: 56, height: 56, background: "#E0F2FE", borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", color: "#0BA4DB", flexShrink: 0 }}><Ico.paystack /></div>
            <div>
              <h2 className="responsive-title" style={{ fontFamily: "'Sora',sans-serif", fontSize: 20, fontWeight: 700, color: T.text }}>Pay with Paystack</h2>
              <p style={{ fontSize: 13, color: T.text2, fontFamily: "'DM Sans',sans-serif", marginTop: 2 }}>Transfer to the virtual bank account below</p>
            </div>
          </div>

          {!setupDone && <PromoCodeInput promoCode={promoCode} setPromoCode={setPromoCode} promoBenefit={promoBenefit} setPromoBenefit={setPromoBenefit} />}

          {/* Summary */}
          <div style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 16, padding: "16px 20px", marginBottom: 20 }}>
            <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${T.border}`}}>
              <span style={{fontSize:13,color:T.text2,fontFamily:"'DM Sans',sans-serif"}}>Amount due</span>
              <span style={{fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:700,color:T.text}}>{formatNGN(payAmount)}</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${T.border}`}}>
              <span style={{fontSize:13,color:T.text2,fontFamily:"'DM Sans',sans-serif"}}>Promo code</span>
              {promoBenefit > 0 ? (
                <span style={{fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:700,color:T.greenText}}>-{formatNGN(promoBenefit)}</span>
              ) : (
                <span style={{fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:700,color:T.text2}}>—</span>
              )}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${T.border}`}}>
              <span style={{fontSize:13,color:T.text2,fontFamily:"'DM Sans',sans-serif"}}>Final total</span>
              <span style={{fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:700,color:T.text}}>{formatNGN(finalPayAmount)}</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${T.border}`}}>
              <span style={{fontSize:13,color:T.text2,fontFamily:"'DM Sans',sans-serif"}}>Exchange Rate</span>
              <span style={{fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:700,color:T.text}}>{finalRate ? `${formatNGN(finalRate)} / ${selectedAsset.symbol}` : "—"}</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0"}}>
              <span style={{fontSize:13,color:T.text2,fontFamily:"'DM Sans',sans-serif"}}>You receive</span>
              <span style={{fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:700,color:T.blue}}>{receiveAmount} {selectedAsset.symbol}</span>
            </div>
          </div>

          {setupDone && bankDetails && (
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: T.text3, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12, fontFamily: "'DM Sans',sans-serif" }}>Transfer to this account</p>
              <div className="bank-details" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  ["Bank", typeof bankDetails.bank === "object" ? bankDetails.bank.name : bankDetails.bank],
                  ["Account Number", bankDetails.account_number, true],
                  ["Amount", formatNGN(finalPayAmount)],
                  ...(bankDetails.display_text ? [["Note", bankDetails.display_text]] : []),
                ].filter((r) => r[1]).map(([l, v, copy], i) => (
                  <div key={i} className="bank-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 14 }}>
                    <span style={{ fontSize: 13, color: T.text2, fontFamily: "'DM Sans',sans-serif" }}>{l}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 700, color: T.text }}>{v}</span>
                      {copy && <button onClick={() => navigator.clipboard.writeText(v)} style={{ background: "none", border: "none", cursor: "pointer", color: T.blue, display: "flex" }}><Ico.copy /></button>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {polling && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, background: T.blueLight, borderRadius: 14, padding: "14px 18px", marginBottom: 20 }}>
              <span style={{ width: 18, height: 18, border: `2px solid rgba(26,111,255,0.3)`, borderTopColor: T.blue, borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite", flexShrink: 0 }} />
              <p style={{ fontSize: 13, color: T.blue, fontFamily: "'DM Sans',sans-serif", fontWeight: 500 }}>{statusMessages[pollStatus] || "Monitoring for your payment…"}</p>
            </div>
          )}

          {(pollStatus === "failed" || pollStatus === "rejected") && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: T.redLight, border: "1px solid #FECACA", borderRadius: 12, padding: "12px 16px", marginBottom: 20 }}>
              <Ico.info />
              <p style={{ fontSize: 13, color: T.red, fontFamily: "'DM Sans',sans-serif", lineHeight: 1.5 }}>Payment failed or was rejected. Please try again.</p>
            </div>
          )}

          {expiryTime > 0 && !setupDone && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: T.orangeLight, border: "1px solid #FDE68A", borderRadius: 999, padding: "8px 16px", marginBottom: 20 }}>
              {Ico.clock(T.orange)}
              <span style={{ fontSize: 12, fontWeight: 700, color: "#92400E", fontFamily: "'DM Sans',sans-serif" }}>Rate expires in {formatTime(expiryTime)}</span>
            </div>
          )}

          {error && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: T.redLight, border: "1px solid #FECACA", borderRadius: 12, padding: "12px 16px", marginBottom: 20 }}>
              <Ico.info /><p style={{ fontSize: 13, color: T.red, fontFamily: "'DM Sans',sans-serif", lineHeight: 1.5 }}>{error}</p>
            </div>
          )}

          <div className="actions-wrap" style={{ display: "flex", gap: 12 }}>
            <GhostBtn onClick={prevStep} style={{ flex: 1 }}>Back</GhostBtn>
            {!setupDone ? (
              <CTA onClick={handleSetupPayment} disabled={loading} loading={loading} style={{ flex: 2 }}>Generate Account</CTA>
            ) : (
              <CTA disabled style={{ flex: 2, background: T.greenLight, color: T.greenText, border: `1px solid #A7F3D0` }}>{Ico.check(T.greenText)} Waiting for payment…</CTA>
            )}
          </div>
        </div>
      </div>
      {isExpired && !setupDone && (
        <div style={{position:"fixed",inset:0,background:"rgba(10,15,30,0.6)",backdropFilter:"blur(6px)",zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
          <div style={{background:T.white,borderRadius:28,padding:40,maxWidth:420,width:"100%",textAlign:"center",boxShadow:"0 25px 60px rgba(0,0,0,0.15)"}}>
            <div style={{width:72,height:72,background:T.orangeLight,borderRadius:20,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}>{Ico.clock(T.orange)}</div>
            <h3 style={{fontFamily:"'Sora',sans-serif",fontSize:22,fontWeight:700,color:T.text,marginBottom:8}}>Rate expired</h3>
            <p style={{color:T.text2,fontSize:14,lineHeight:1.6,marginBottom:24,fontFamily:"'DM Sans',sans-serif"}}>Rates changed while you were reviewing. Go back to get a fresh quote.</p>
            <CTA onClick={resetExpiry}><Ico.refresh/> Get New Quote</CTA>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BuyFlowStep3(props) {
  if (props.paymentMethod === "ngn_wallet") return <WalletVariant {...props} />;
  if (props.paymentMethod === "paystack") return <PaystackVariant {...props} />;
  return null;
}

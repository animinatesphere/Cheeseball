import React, { useState, useEffect, useRef } from "react";
import { T, Ico, formatNGN, formatTime, truncateAddress, CTA, GhostBtn, RightPanel, SecureFooter } from "./BuyFlowShared";
import { createBuyTransaction, setupPayment, getPaymentInstructions, submitBankTransferProof, getBuyTransactionStatus, uploadFile, getWallets } from "@/services/api";

/* ─── NGN Wallet variant ─── */
function WalletVariant({ payAmount, receiveAmount, selectedAsset, expiryTime, quoteData, setTransactionData, prevStep, onSuccess, breadcrumbs }) {
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);

  useEffect(() => {
    getWallets().then(wallets => {
      const ngn = Array.isArray(wallets) ? wallets.find(w => w.asset === "NGN") : null;
      if (ngn) setWalletBalance(ngn.available_balance ?? ngn.balance ?? 0);
    }).catch(() => setWalletBalance(null));
  }, []);

  const hasSufficientBalance = walletBalance === null || walletBalance >= payAmount;

  const handlePay = async () => {
    setLoading(true);
    setError(null);
    try {
      const txn = await createBuyTransaction(quoteData.id, "ngn_wallet");
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
        <p style={{fontSize:11,fontWeight:600,color:T.blue,textTransform:"uppercase",letterSpacing:"1px",marginBottom:6,fontFamily:"'DM Sans',sans-serif"}}>Step 4 of 5</p>
        <h1 className="responsive-title" style={{fontFamily:"'Sora',sans-serif",fontSize:28,fontWeight:700,color:T.text,letterSpacing:"-0.6px"}}>Pay with NGN Wallet</h1>
        <p style={{fontSize:14,color:T.text2,marginTop:6,lineHeight:1.6,fontFamily:"'DM Sans',sans-serif"}}>Review and confirm your instant NGN wallet payment.</p>

        {/* Payment method badge */}
        <div style={{marginTop:28,border:`1.5px solid ${T.blue}`,borderRadius:16,padding:"16px 20px",background:T.blueLight,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:48,height:48,borderRadius:14,background:T.white,display:"flex",alignItems:"center",justifyContent:"center",color:T.blue,border:`1.5px solid ${T.border}`}}><Ico.wallet/></div>
            <div><p style={{fontFamily:"'Sora',sans-serif",fontSize:14,fontWeight:700,color:T.text}}>NGN Wallet</p><p style={{fontSize:12,color:T.text2,fontFamily:"'DM Sans',sans-serif"}}>Instant internal payment</p></div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:5,padding:"6px 12px",background:T.white,border:`1px solid ${T.border}`,borderRadius:999}}>
            {Ico.check(T.blue)}<span style={{fontSize:12,fontWeight:600,color:T.blue,fontFamily:"'DM Sans',sans-serif"}}>Selected</span>
          </div>
        </div>

        {/* Wallet balance */}
        <div style={{marginTop:16,background:hasSufficientBalance?"#F0FDF4":T.redLight,border:`1.5px solid ${hasSufficientBalance?"#DCFCE7":"#FECACA"}`,borderRadius:16,padding:"20px 22px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:48,height:48,borderRadius:14,background:T.white,display:"flex",alignItems:"center",justifyContent:"center",border:`1.5px solid ${hasSufficientBalance?"#DCFCE7":"#FECACA"}`}}><Ico.wallet/></div>
            <div>
              <p style={{fontSize:13,color:hasSufficientBalance?"#166534":T.red,fontFamily:"'DM Sans',sans-serif"}}>Available balance</p>
              <p style={{fontFamily:"'Sora',sans-serif",fontSize:22,fontWeight:700,color:T.text,marginTop:2}}>
                {walletBalance !== null ? formatNGN(walletBalance) : "Loading…"}
              </p>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:5,padding:"6px 14px",background:hasSufficientBalance?"#DCFCE7":"#FECACA",borderRadius:999}}>
            {hasSufficientBalance ? Ico.check("#16A34A") : Ico.info()}
            <span style={{fontSize:12,fontWeight:600,color:hasSufficientBalance?"#15803D":T.red,fontFamily:"'DM Sans',sans-serif"}}>{hasSufficientBalance?"Sufficient":"Insufficient"}</span>
          </div>
        </div>

        {/* Payment detail */}
        <div style={{marginTop:16,background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:16,padding:"16px 20px"}}>
          {[
            ["You pay", formatNGN(payAmount)],
            ["You receive", `${receiveAmount} ${selectedAsset.symbol}`],
            ["Delivery", "Cheeseball Internal Wallet"],
            ["Processing", "Instant"],
          ].map(([l,v],i,a)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:i<a.length-1?`1px solid ${T.border}`:"none"}}>
              <span style={{fontSize:13,color:T.text2,fontFamily:"'DM Sans',sans-serif"}}>{l}</span>
              <span style={{fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:700,color:T.text}}>{v}</span>
            </div>
          ))}
        </div>

        {error && (
          <div style={{marginTop:16,display:"flex",alignItems:"flex-start",gap:10,background:T.redLight,border:"1px solid #FECACA",borderRadius:12,padding:"12px 16px"}}>
            <Ico.info/><p style={{fontSize:13,color:T.red,fontFamily:"'DM Sans',sans-serif",lineHeight:1.5}}>{error}</p>
          </div>
        )}

        <div className="actions-wrap" style={{display:"flex",gap:12,marginTop:24}}>
          <GhostBtn onClick={prevStep} style={{flex:1}}>← Back</GhostBtn>
          <CTA onClick={handlePay} disabled={loading || !hasSufficientBalance} style={{flex:2}}>
            {loading
              ? <><span style={{width:16,height:16,border:"2px solid rgba(255,255,255,0.4)",borderTopColor:"#fff",borderRadius:"50%",display:"inline-block",animation:"spin 0.7s linear infinite"}}/> Processing…</>
              : <><Ico.lock/> Pay {formatNGN(payAmount)}</>
            }
          </CTA>
        </div>
        <SecureFooter/>
      </div>
      <RightPanel payAmount={payAmount} receiveAmount={receiveAmount} selectedAsset={selectedAsset} expiryTime={expiryTime} step={4}/>
    </div>
  );
}

/* ─── Paystack variant ─── */
function PaystackVariant({ payAmount, receiveAmount, selectedAsset, expiryTime, quoteData, setTransactionData, setPaymentData, prevStep, onSuccess, breadcrumbs }) {
  const [loading, setLoading]       = useState(false);
  const [setupDone, setSetupDone]   = useState(false);
  const [bankDetails, setBankDetails] = useState(null);
  const [error, setError]           = useState(null);
  const [polling, setPolling]       = useState(false);
  const [pollStatus, setPollStatus] = useState(null);
  const pollRef = useRef(null);

  const handleSetupPayment = async () => {
    setLoading(true);
    setError(null);
    try {
      const txn = await createBuyTransaction(quoteData.id, "paystack");
      setTransactionData(txn);
      const setup = await setupPayment(txn.id, "paystack");
      setPaymentData(setup);
      const pd = setup?.provider_payload?.data;
      setBankDetails(pd);
      setSetupDone(true);
      // start polling
      setPolling(true);
      pollRef.current = setInterval(async () => {
        try {
          const status = await getBuyTransactionStatus(txn.id);
          setPollStatus(status.status);
          if (["completed","failed","rejected"].includes(status.status)) {
            clearInterval(pollRef.current);
            setPolling(false);
            if (status.status === "completed") onSuccess();
          }
        } catch { /* ignore poll errors */ }
      }, 12000);
    } catch (err) {
      setError(err.message || "Failed to setup payment. Please try again.");
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
    <div style={{background:T.white,minHeight:"100vh",width:"100%"}}>
      <div className="step-content" style={{padding:"44px 52px 0"}}>{breadcrumbs}</div>
      <div className="step-content" style={{padding:"0 52px 60px",maxWidth:640,margin:"0 auto",width:"100%"}}>
        <p style={{fontSize:11,fontWeight:600,color:T.blue,textTransform:"uppercase",letterSpacing:"1px",marginBottom:6,fontFamily:"'DM Sans',sans-serif"}}>Step 4 of 5</p>

        <div style={{background:T.white,border:`1.5px solid ${T.border}`,borderRadius:20,padding:28}}>
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:24}}>
            <div style={{width:56,height:56,background:"#E0F2FE",borderRadius:18,display:"flex",alignItems:"center",justifyContent:"center",color:"#0BA4DB",flexShrink:0}}><Ico.paystack/></div>
            <div>
              <h2 className="responsive-title" style={{fontFamily:"'Sora',sans-serif",fontSize:20,fontWeight:700,color:T.text}}>Pay with Paystack</h2>
              <p style={{fontSize:13,color:T.text2,fontFamily:"'DM Sans',sans-serif",marginTop:2}}>A virtual bank account will be generated for your payment</p>
            </div>
          </div>

          {/* Summary */}
          <div style={{background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:16,padding:"16px 20px",marginBottom:20}}>
            {[["Amount",formatNGN(payAmount)],["You receive",`${receiveAmount} ${selectedAsset.symbol}`],["Delivery","Internal Wallet"]].map(([l,v],i,a)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:i<a.length-1?`1px solid ${T.border}`:"none"}}>
                <span style={{fontSize:13,color:T.text2,fontFamily:"'DM Sans',sans-serif"}}>{l}</span>
                <span style={{fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:700,color:T.text}}>{v}</span>
              </div>
            ))}
          </div>

          {/* Bank details shown after setup */}
          {setupDone && bankDetails && (
            <div style={{marginBottom:20}}>
              <p style={{fontSize:11,fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:"1px",marginBottom:12,fontFamily:"'DM Sans',sans-serif"}}>Transfer to this account</p>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {[
                  ["Bank", typeof bankDetails.bank === "object" ? bankDetails.bank.name : bankDetails.bank],
                  ["Account Number", bankDetails.account_number, true],
                  ["Amount", formatNGN(payAmount)],
                  ...(bankDetails.display_text ? [["Note", bankDetails.display_text]] : []),
                ].filter(r=>r[1]).map(([l,v,copy],i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 18px",background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:14}}>
                    <span style={{fontSize:13,color:T.text2,fontFamily:"'DM Sans',sans-serif"}}>{l}</span>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:700,color:T.text}}>{v}</span>
                      {copy && <button onClick={()=>navigator.clipboard.writeText(v)} style={{background:"none",border:"none",cursor:"pointer",color:T.blue,display:"flex"}}><Ico.copy/></button>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Polling status */}
          {polling && (
            <div style={{display:"flex",alignItems:"center",gap:12,background:T.blueLight,borderRadius:14,padding:"14px 18px",marginBottom:20}}>
              <span style={{width:18,height:18,border:`2px solid rgba(26,111,255,0.3)`,borderTopColor:T.blue,borderRadius:"50%",display:"inline-block",animation:"spin 0.8s linear infinite",flexShrink:0}}/>
              <p style={{fontSize:13,color:T.blue,fontFamily:"'DM Sans',sans-serif",fontWeight:500}}>{statusMessages[pollStatus] || "Monitoring for your payment…"}</p>
            </div>
          )}

          {pollStatus === "failed" || pollStatus === "rejected" ? (
            <div style={{display:"flex",alignItems:"flex-start",gap:10,background:T.redLight,border:"1px solid #FECACA",borderRadius:12,padding:"12px 16px",marginBottom:20}}>
              <Ico.info/><p style={{fontSize:13,color:T.red,fontFamily:"'DM Sans',sans-serif",lineHeight:1.5}}>Payment failed or was rejected. Please go back and try again.</p>
            </div>
          ) : null}

          {expiryTime > 0 && !setupDone && (
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:T.orangeLight,border:"1px solid #FDE68A",borderRadius:999,padding:"8px 16px",marginBottom:20}}>
              {Ico.clock(T.orange)}<span style={{fontSize:12,fontWeight:700,color:"#92400E",fontFamily:"'DM Sans',sans-serif"}}>Rate expires in {formatTime(expiryTime)}</span>
            </div>
          )}

          {error && (
            <div style={{display:"flex",alignItems:"flex-start",gap:10,background:T.redLight,border:"1px solid #FECACA",borderRadius:12,padding:"12px 16px",marginBottom:20}}>
              <Ico.info/><p style={{fontSize:13,color:T.red,fontFamily:"'DM Sans',sans-serif",lineHeight:1.5}}>{error}</p>
            </div>
          )}

          <div className="actions-wrap" style={{display:"flex",gap:12}}>
            <GhostBtn onClick={prevStep} style={{flex:1}}>Back</GhostBtn>
            {!setupDone ? (
              <CTA onClick={handleSetupPayment} disabled={loading} style={{flex:2}}>
                {loading
                  ? <><span style={{width:16,height:16,border:"2px solid rgba(255,255,255,0.4)",borderTopColor:"#fff",borderRadius:"50%",display:"inline-block",animation:"spin 0.7s linear infinite"}}/> Setting up…</>
                  : <>Generate Account <Ico.arrow/></>
                }
              </CTA>
            ) : (
              <CTA onClick={()=>{}} disabled style={{flex:2,background:T.greenLight,color:T.greenText,border:`1px solid #A7F3D0`}}>
                {Ico.check(T.greenText)} Waiting for payment…
              </CTA>
            )}
          </div>
          <p style={{fontSize:11,color:T.text3,marginTop:14,textAlign:"center",fontFamily:"'DM Sans',sans-serif"}}>Secure payment powered by Paystack. Crypto is delivered automatically once confirmed.</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Bank Transfer variant ─── */
function BankVariant({ payAmount, receiveAmount, selectedAsset, quoteData, setTransactionData, bankInstructions, setBankInstructions, proofFile, setProofFile, hasPaid, setHasPaid, prevStep, onSuccess, breadcrumbs }) {
  const [loading, setLoading]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]       = useState(null);
  const [txnId, setTxnId]       = useState(null);
  const [reference, setReference] = useState("");

  useEffect(() => {
    if (!bankInstructions) {
      getPaymentInstructions().then(data => setBankInstructions(data)).catch(()=>{});
    }
  }, []);

  const handleCreateTxn = async () => {
    setLoading(true);
    setError(null);
    try {
      const txn = await createBuyTransaction(quoteData.id, "bank_transfer");
      setTransactionData(txn);
      setTxnId(txn.id);
      setHasPaid(true);
    } catch (err) {
      setError(err.message || "Failed to create transaction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitProof = async () => {
    if (!proofFile) return;
    setSubmitting(true);
    setError(null);
    try {
      const url = await uploadFile(proofFile, "receipts");
      await submitBankTransferProof(txnId, reference || `ref-${Date.now()}`, url);
      onSuccess();
    } catch (err) {
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!hasPaid) return (
    <div style={{background:T.white,minHeight:"100vh",width:"100%"}}>
      <div className="step-content" style={{padding:"44px 52px 0"}}>{breadcrumbs}</div>
      <div className="step-content" style={{padding:"0 52px 60px",maxWidth:600,margin:"0 auto",width:"100%"}}>
        <p style={{fontSize:11,fontWeight:600,color:T.blue,textTransform:"uppercase",letterSpacing:"1px",marginBottom:6,fontFamily:"'DM Sans',sans-serif"}}>Step 4 of 5</p>
        <div style={{background:T.white,border:`1.5px solid ${T.border}`,borderRadius:20,padding:28}}>
          <h2 className="responsive-title" style={{fontFamily:"'Sora',sans-serif",fontSize:22,fontWeight:700,color:T.text,marginBottom:6,textAlign:"center"}}>Bank Transfer Details</h2>
          <p style={{fontSize:13,color:T.text2,fontFamily:"'DM Sans',sans-serif",textAlign:"center",marginBottom:24}}>Transfer the exact amount below to complete your purchase</p>

          <div style={{background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:16,padding:"20px 24px",textAlign:"center",marginBottom:20}}>
            <p style={{fontSize:11,fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:"1px",marginBottom:6,fontFamily:"'DM Sans',sans-serif"}}>Transfer exactly</p>
            <p style={{fontFamily:"'Sora',sans-serif",fontSize:28,fontWeight:700,color:T.text}}>{formatNGN(payAmount)}</p>
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
            {[
              ["Bank", bankInstructions?.bank_name || "Loading…"],
              ["Account Name", bankInstructions?.account_name || "Loading…"],
              ["Account Number", bankInstructions?.account_number || "Loading…", true],
            ].map(([l,v,copy],i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 18px",background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:14}}>
                <span style={{fontSize:13,color:T.text2,fontFamily:"'DM Sans',sans-serif"}}>{l}</span>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:700,color:T.text}}>{v}</span>
                  {copy && bankInstructions && <button onClick={()=>navigator.clipboard.writeText(v)} style={{background:"none",border:"none",cursor:"pointer",color:T.blue,display:"flex"}}><Ico.copy/></button>}
                </div>
              </div>
            ))}
          </div>

          <div style={{display:"flex",alignItems:"flex-start",gap:10,background:T.orangeLight,borderRadius:12,padding:"12px 16px",marginBottom:24}}>
            {Ico.info()}<p style={{fontSize:12,color:"#92400E",fontFamily:"'DM Sans',sans-serif",lineHeight:1.55}}>After transferring, click "I Have Paid" to upload your proof of payment for faster review.</p>
          </div>

          {error && <div style={{display:"flex",alignItems:"flex-start",gap:10,background:T.redLight,border:"1px solid #FECACA",borderRadius:12,padding:"12px 16px",marginBottom:20}}><Ico.info/><p style={{fontSize:13,color:T.red,fontFamily:"'DM Sans',sans-serif",lineHeight:1.5}}>{error}</p></div>}

          <div className="actions-wrap" style={{display:"flex",gap:12}}>
            <GhostBtn onClick={prevStep} style={{flex:1}}>Back</GhostBtn>
            <CTA onClick={handleCreateTxn} disabled={loading} style={{flex:2}}>
              {loading
                ? <><span style={{width:16,height:16,border:"2px solid rgba(255,255,255,0.4)",borderTopColor:"#fff",borderRadius:"50%",display:"inline-block",animation:"spin 0.7s linear infinite"}}/> Please wait…</>
                : "I Have Paid"
              }
            </CTA>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{background:T.white,minHeight:"100vh",width:"100%"}}>
      <div className="step-content" style={{padding:"44px 52px 0"}}>{breadcrumbs}</div>
      <div className="step-content" style={{padding:"0 52px 60px",maxWidth:600,margin:"0 auto",width:"100%"}}>
        <div style={{background:T.white,border:`1.5px solid ${T.border}`,borderRadius:20,padding:28}}>
          <h2 className="responsive-title" style={{fontFamily:"'Sora',sans-serif",fontSize:22,fontWeight:700,color:T.text,marginBottom:6,textAlign:"center"}}>Upload Payment Proof</h2>
          <p style={{fontSize:13,color:T.text2,fontFamily:"'DM Sans',sans-serif",textAlign:"center",marginBottom:24}}>Upload a screenshot or receipt of your bank transfer</p>

          {/* Reference input */}
          <div style={{marginBottom:16}}>
            <p style={{fontSize:11,fontWeight:600,color:T.text3,textTransform:"uppercase",letterSpacing:"0.8px",marginBottom:8,fontFamily:"'DM Sans',sans-serif"}}>Transaction reference (optional)</p>
            <input type="text" value={reference} onChange={e=>setReference(e.target.value)} placeholder="e.g. your bank reference number"
              style={{width:"100%",border:`1.5px solid ${T.border}`,borderRadius:12,padding:"13px 16px",fontSize:13,fontFamily:"'DM Sans',sans-serif",color:T.text,outline:"none",background:T.white,boxSizing:"border-box"}}
              onFocus={e=>e.target.style.borderColor=T.blue} onBlur={e=>e.target.style.borderColor=T.border}
            />
          </div>

          <div onClick={()=>document.getElementById("proofInput").click()}
            style={{border:`2px dashed ${proofFile?T.blue:T.border}`,borderRadius:20,padding:"48px 24px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",cursor:"pointer",background:proofFile?T.blueLight:T.surface,transition:"all 0.18s"}} className="dropzone">
            <input type="file" id="proofInput" style={{display:"none"}} accept="image/*,.pdf" onChange={e=>setProofFile(e.target.files[0])}/>
            <div style={{width:56,height:56,background:T.white,borderRadius:16,border:`1.5px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14,color:T.blue}}><Ico.upload/></div>
            <p style={{fontFamily:"'Sora',sans-serif",fontSize:14,fontWeight:700,color:T.text,marginBottom:4}}>Upload screenshot or receipt</p>
            <p style={{fontSize:12,color:T.text3,fontFamily:"'DM Sans',sans-serif"}}>Max 5MB — JPG, PNG or PDF</p>
            {proofFile && <div style={{marginTop:14,padding:"6px 16px",background:T.blue,color:"#fff",borderRadius:999,fontSize:11,fontWeight:700,fontFamily:"'DM Sans',sans-serif"}}>{proofFile.name}</div>}
          </div>

          {error && <div style={{display:"flex",alignItems:"flex-start",gap:10,background:T.redLight,border:"1px solid #FECACA",borderRadius:12,padding:"12px 16px",marginTop:16,marginBottom:4}}><Ico.info/><p style={{fontSize:13,color:T.red,fontFamily:"'DM Sans',sans-serif",lineHeight:1.5}}>{error}</p></div>}

          <div className="actions-wrap" style={{display:"flex",gap:12,marginTop:24}}>
            <GhostBtn onClick={()=>{setHasPaid(false);setError(null);}} style={{flex:1}}>Back</GhostBtn>
            <CTA onClick={handleSubmitProof} disabled={!proofFile||submitting} style={{flex:2}}>
              {submitting
                ? <><span style={{width:16,height:16,border:"2px solid rgba(255,255,255,0.4)",borderTopColor:"#fff",borderRadius:"50%",display:"inline-block",animation:"spin 0.7s linear infinite"}}/> Uploading…</>
                : "Submit Proof"
              }
            </CTA>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Step 4 export ─── */
export default function BuyFlowStep4({
  paymentMethod, payAmount, receiveAmount, selectedAsset, expiryTime,
  quoteData, transactionData, setTransactionData,
  paymentData, setPaymentData,
  bankInstructions, setBankInstructions,
  proofFile, setProofFile, hasPaid, setHasPaid,
  prevStep, onSuccess, breadcrumbs,
}) {
  if (paymentMethod === "ngn_wallet") return (
    <WalletVariant payAmount={payAmount} receiveAmount={receiveAmount} selectedAsset={selectedAsset}
      expiryTime={expiryTime} quoteData={quoteData} setTransactionData={setTransactionData}
      prevStep={prevStep} onSuccess={onSuccess} breadcrumbs={breadcrumbs} />
  );
  if (paymentMethod === "paystack") return (
    <PaystackVariant payAmount={payAmount} receiveAmount={receiveAmount} selectedAsset={selectedAsset}
      expiryTime={expiryTime} quoteData={quoteData} setTransactionData={setTransactionData}
      setPaymentData={setPaymentData} prevStep={prevStep} onSuccess={onSuccess} breadcrumbs={breadcrumbs} />
  );
  return (
    <BankVariant payAmount={payAmount} receiveAmount={receiveAmount} selectedAsset={selectedAsset}
      quoteData={quoteData} setTransactionData={setTransactionData}
      bankInstructions={bankInstructions} setBankInstructions={setBankInstructions}
      proofFile={proofFile} setProofFile={setProofFile}
      hasPaid={hasPaid} setHasPaid={setHasPaid}
      prevStep={prevStep} onSuccess={onSuccess} breadcrumbs={breadcrumbs} />
  );
}

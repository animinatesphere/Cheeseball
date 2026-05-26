import React from "react";
import { T, Ico, formatNGN, SecureFooter } from "./BuyFlowShared";

const methodLabels = {
  ngn_wallet: "NGN Wallet",
  paystack: "Paystack",
  bank_transfer: "Bank Transfer",
};

export default function BuyFlowStep5({ paymentMethod, receiveAmount, selectedAsset, payAmount, transactionData, onBack, setStep, breadcrumbs }) {
  // Bank transfer goes to pending_review, others are completed
  const isBankTransfer   = paymentMethod === "bank_transfer";
  const txnStatus        = transactionData?.status || (isBankTransfer ? "pending_review" : "completed");
  const isPendingReview  = txnStatus === "pending_review";
  const isCompleted      = txnStatus === "completed";

  const cryptoAmount = transactionData?.crypto_amount ? parseFloat(transactionData.crypto_amount) : receiveAmount;
  const nairaAmount  = transactionData?.naira_amount  ? parseFloat(transactionData.naira_amount)  : payAmount;

  return (
    <div className="step-content" style={{maxWidth:960,margin:"0 auto",padding:"44px 24px 80px"}}>
      {breadcrumbs}

      {/* Status hero */}
      <div style={{textAlign:"center",marginBottom:40}}>
        <div style={{position:"relative",width:96,height:96,margin:"0 auto 20px",display:"flex",alignItems:"center",justifyContent:"center"}}>
          {isCompleted && (
            <div className="ripple" style={{position:"absolute",width:96,height:96,borderRadius:"50%",background:T.greenLight,animation:"ripple 1.8s ease-out infinite"}}/>
          )}
          {isPendingReview && (
            <div style={{position:"absolute",width:96,height:96,borderRadius:"50%",background:T.orangeLight,animation:"ripple 2.2s ease-out infinite"}}/>
          )}
          <div className="popIn" style={{
            width:80,height:80,borderRadius:"50%",
            background:isCompleted?T.green:isPendingReview?T.orange:"#6B7A99",
            display:"flex",alignItems:"center",justifyContent:"center",
            position:"relative",zIndex:1
          }}>
            {isCompleted ? Ico.check("#fff") : Ico.clock("#fff")}
          </div>
        </div>

        {isCompleted && (
          <>
            <h1 className="responsive-title" style={{fontFamily:"'Sora',sans-serif",fontSize:30,fontWeight:700,color:T.text,letterSpacing:"-0.8px"}}>Purchase Successful!</h1>
            <p style={{fontSize:15,color:T.text2,marginTop:8,fontFamily:"'DM Sans',sans-serif"}}>{cryptoAmount} {selectedAsset.symbol} has been added to your Cheeseball wallet.</p>
          </>
        )}
        {isPendingReview && (
          <>
            <h1 className="responsive-title" style={{fontFamily:"'Sora',sans-serif",fontSize:30,fontWeight:700,color:T.text,letterSpacing:"-0.8px"}}>Proof Submitted!</h1>
            <p style={{fontSize:15,color:T.text2,marginTop:8,fontFamily:"'DM Sans',sans-serif"}}>Your payment proof is under review. We'll credit your wallet within 1–24 hours.</p>
          </>
        )}
      </div>

      {/* Two-column receipt + next steps */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:28}} className="s6grid">

        {/* LEFT: Transaction receipt */}
        <div>
          <p style={{fontSize:11,fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:"1px",marginBottom:12,fontFamily:"'DM Sans',sans-serif"}}>Transaction Receipt</p>
          <div style={{background:T.white,border:`1.5px solid ${T.border}`,borderRadius:20,overflow:"hidden"}}>
            {/* Top band */}
            <div style={{background:isCompleted?T.green:T.orange,padding:"20px 24px"}}>
              <p style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.7)",textTransform:"uppercase",letterSpacing:"0.7px",marginBottom:8,fontFamily:"'DM Sans',sans-serif"}}>
                {isCompleted ? "You received" : "Pending amount"}
              </p>
              <p className="responsive-amount" style={{fontFamily:"'Sora',sans-serif",fontSize:32,fontWeight:700,color:"#fff",letterSpacing:"-1px",lineHeight:1}}>
                {cryptoAmount} {selectedAsset.symbol}
              </p>
            </div>
            {/* Receipt rows */}
            <div style={{padding:"4px 24px"}}>
              {[
                ["You Paid",       formatNGN(nairaAmount)],
                ["Asset",          `${selectedAsset.name} (${selectedAsset.symbol})`],
                ["Delivery",       "Cheeseball Internal Wallet"],
                ["Payment Method", methodLabels[paymentMethod] || paymentMethod],
                ["Status",         isPendingReview ? "⏳ Pending Review" : isCompleted ? "✅ Completed" : txnStatus],
                ...(transactionData?.id ? [["Transaction ID", String(transactionData.id).slice(0, 16) + "…"]] : []),
              ].map(([l,v],i,a)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"13px 0",borderBottom:i<a.length-1?`1.5px dashed ${T.border}`:"none"}}>
                  <span style={{fontSize:13,color:T.text2,fontFamily:"'DM Sans',sans-serif"}}>{l}</span>
                  <span style={{fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:700,color:T.text,textAlign:"right",maxWidth:"55%",wordBreak:"break-all"}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Status + Next steps */}
        <div style={{display:"flex",flexDirection:"column",gap:20}}>
          {isCompleted && (
            <div style={{background:T.greenLight,border:"1.5px solid #A7F3D0",borderRadius:20,padding:"24px",display:"flex",alignItems:"flex-start",gap:16}}>
              <div style={{width:52,height:52,borderRadius:"50%",background:"#A7F3D0",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{Ico.check(T.greenText)}</div>
              <div>
                <h3 style={{fontFamily:"'Sora',sans-serif",fontSize:16,fontWeight:700,color:T.text,marginBottom:6}}>Crypto in Your Wallet</h3>
                <p style={{fontSize:13,color:T.text2,lineHeight:1.65,fontFamily:"'DM Sans',sans-serif"}}>{cryptoAmount} {selectedAsset.symbol} has been credited to your Cheeseball internal wallet. You can swap, send, or hold it anytime.</p>
              </div>
            </div>
          )}

          {isPendingReview && (
            <div style={{background:T.orangeLight,border:"1.5px solid #FDE68A",borderRadius:20,padding:"24px",display:"flex",alignItems:"flex-start",gap:16}}>
              <div style={{width:52,height:52,borderRadius:"50%",background:"#FDE68A",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{Ico.clock("#92400E")}</div>
              <div>
                <h3 style={{fontFamily:"'Sora',sans-serif",fontSize:16,fontWeight:700,color:T.text,marginBottom:6}}>Under Review</h3>
                <p style={{fontSize:13,color:T.text2,lineHeight:1.65,fontFamily:"'DM Sans',sans-serif"}}>Our team is reviewing your payment proof. Once approved, {cryptoAmount} {selectedAsset.symbol} will be credited to your wallet. This typically takes 1–24 hours.</p>
              </div>
            </div>
          )}

          <div style={{background:T.blueLight,border:`1.5px solid ${T.border}`,borderRadius:20,padding:"24px"}}>
            <h3 style={{fontFamily:"'Sora',sans-serif",fontSize:16,fontWeight:700,color:T.text,marginBottom:8}}>What's next?</h3>
            <p style={{fontSize:13,color:T.text2,lineHeight:1.65,fontFamily:"'DM Sans',sans-serif",marginBottom:20}}>
              {isCompleted
                ? "Monitor your portfolio on the dashboard. You can sell, swap, or hold your new crypto anytime."
                : "You'll be notified once your payment is verified and crypto is released to your wallet."
              }
            </p>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <button
                onClick={() => {}} // navigate to history
                style={{width:"100%",padding:"14px",borderRadius:14,border:`1.5px solid ${T.border}`,background:T.white,color:T.blue,fontSize:14,fontWeight:700,fontFamily:"'Sora',sans-serif",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}
                className="ghostbtn">
                View Transactions <Ico.arrow/>
              </button>
              <button
                onClick={onBack}
                style={{width:"100%",padding:"14px",borderRadius:14,border:"none",background:T.blue,color:"#fff",fontSize:14,fontWeight:700,fontFamily:"'Sora',sans-serif",cursor:"pointer"}}
                className="ctabtn">
                Back to Dashboard
              </button>
              {isCompleted && (
                <button
                  onClick={() => setStep(1)}
                  style={{width:"100%",padding:"14px",borderRadius:14,border:`1.5px solid ${T.border}`,background:T.white,color:T.text2,fontSize:14,fontWeight:600,fontFamily:"'DM Sans',sans-serif",cursor:"pointer"}}
                  className="ghostbtn">
                  Buy More Crypto
                </button>
              )}
            </div>
          </div>

          <SecureFooter/>
        </div>
      </div>
    </div>
  );
}

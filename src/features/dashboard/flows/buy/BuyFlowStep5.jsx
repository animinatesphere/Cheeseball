import React, { useState } from "react";
import { T, Ico, formatNGN, formatTime, truncateAddress, CTA, GhostBtn, RightPanel, SecureFooter } from "./BuyFlowShared";

function WalletVariant({payAmount,receiveAmount,selectedAsset,walletAddress,selectedNetwork,expiryTime,prevStep,setStep,breadcrumbs}){
  return(
    <div style={{display:"grid",gridTemplateColumns:"1fr 400px",minHeight:"100vh",background:T.white,maxWidth:"100vw"}} className="buygrid">
      <div style={{padding:"0 52px 60px",borderRight:`1px solid ${T.border}`}}>
        {breadcrumbs}
        <p style={{fontSize:11,fontWeight:600,color:T.blue,textTransform:"uppercase",letterSpacing:"1px",marginBottom:6,fontFamily:"'DM Sans',sans-serif"}}>Step 5 of 6</p>
        <h1 style={{fontFamily:"'Sora',sans-serif",fontSize:28,fontWeight:700,color:T.text,letterSpacing:"-0.6px"}}>Pay with NGN Wallet</h1>
        <p style={{fontSize:14,color:T.text2,marginTop:6,lineHeight:1.6,fontFamily:"'DM Sans',sans-serif"}}>Review and confirm payment from your NGN wallet.</p>

        {/* Payment method badge */}
        <div style={{marginTop:28,border:`1.5px solid ${T.blue}`,borderRadius:16,padding:"16px 20px",background:T.blueLight,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:48,height:48,borderRadius:14,background:T.white,display:"flex",alignItems:"center",justifyContent:"center",color:T.blue,border:`1.5px solid ${T.border}`}}><Ico.wallet/></div>
            <div><p style={{fontFamily:"'Sora',sans-serif",fontSize:14,fontWeight:700,color:T.text}}>NGN Wallet</p><p style={{fontSize:12,color:T.text2,fontFamily:"'DM Sans',sans-serif"}}>Pay instantly from balance</p></div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:5,padding:"6px 12px",background:T.white,border:`1px solid ${T.border}`,borderRadius:999}}>
            {Ico.check(T.blue)}
            <span style={{fontSize:12,fontWeight:600,color:T.blue,fontFamily:"'DM Sans',sans-serif"}}>Selected</span>
          </div>
        </div>

        {/* Wallet balance */}
        <div style={{marginTop:20,background:"#F0FDF4",border:"1.5px solid #DCFCE7",borderRadius:16,padding:"20px 22px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:48,height:48,borderRadius:14,background:T.white,display:"flex",alignItems:"center",justifyContent:"center",border:"1.5px solid #DCFCE7"}}><Ico.wallet/></div>
            <div><p style={{fontSize:13,color:"#166534",fontFamily:"'DM Sans',sans-serif"}}>Available balance</p><p style={{fontFamily:"'Sora',sans-serif",fontSize:22,fontWeight:700,color:T.text,marginTop:2}}>₦250,000.00</p></div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:5,padding:"6px 14px",background:"#DCFCE7",borderRadius:999}}>
            {Ico.check("#16A34A")}
            <span style={{fontSize:12,fontWeight:600,color:"#15803D",fontFamily:"'DM Sans',sans-serif"}}>Sufficient</span>
          </div>
        </div>

        {/* Payment detail */}
        <div style={{marginTop:20,background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:16,padding:"16px 20px"}}>
          {[["You pay",formatNGN(payAmount)],["Balance after payment","₦100,000.00"]].map(([l,v],i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:i===0?`1px solid ${T.border}`:"none"}}>
              <span style={{fontSize:13,color:T.text2,fontFamily:"'DM Sans',sans-serif"}}>{l}</span>
              <span style={{fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:700,color:T.text}}>{v}</span>
            </div>
          ))}
        </div>

        <div style={{display:"flex",alignItems:"flex-start",gap:10,background:T.blueLight,borderRadius:14,padding:"14px 18px",marginTop:16}}>
          <Ico.info/>
          <p style={{fontSize:13,color:"#1A3A8A",lineHeight:1.6,fontFamily:"'DM Sans',sans-serif"}}>Your payment will be processed instantly and crypto sent to your wallet address.</p>
        </div>

        <div style={{display:"flex",gap:12,marginTop:28}}>
          <GhostBtn onClick={prevStep} style={{flex:1}}>← Back</GhostBtn>
          <CTA onClick={()=>setStep(6)} style={{flex:2}}><Ico.lock/> Pay {formatNGN(payAmount)}</CTA>
        </div>
        <SecureFooter/>
      </div>
      <RightPanel payAmount={payAmount} receiveAmount={receiveAmount} selectedAsset={selectedAsset} expiryTime={expiryTime} walletAddress={walletAddress} selectedNetwork={selectedNetwork} step={5}/>
    </div>
  );
}

function PaystackVariant({payAmount,receiveAmount,selectedAsset,walletAddress,expiryTime,prevStep,setStep,breadcrumbs}){
  return(
    <div style={{background:T.white,minHeight:"100vh",width:"100%"}}>
      <div style={{padding:"44px 52px 0"}}>{breadcrumbs}</div>
      <div style={{padding:"0 52px 60px",maxWidth:600,margin:"0 auto"}}>
      <div style={{background:T.white,border:`1.5px solid ${T.border}`,borderRadius:20,padding:40,textAlign:"center"}}>
        <div style={{width:64,height:64,background:"#ECFDF3",borderRadius:18,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",color:"#16A34A"}}><Ico.card/></div>
        <h2 style={{fontFamily:"'Sora',sans-serif",fontSize:20,fontWeight:700,color:T.text,marginBottom:8}}>Pay with Paystack</h2>
        <p style={{fontSize:14,color:T.text2,fontFamily:"'DM Sans',sans-serif",lineHeight:1.6,marginBottom:24}}>You'll be redirected to Paystack to complete your payment securely.</p>
        <div style={{background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:16,padding:"20px 24px",marginBottom:20}}>
          {[["Amount",formatNGN(payAmount)],["You receive",`${receiveAmount} ${selectedAsset.symbol}`],["Wallet",truncateAddress(walletAddress)]].map(([l,v],i,a)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:i<a.length-1?`1px solid ${T.border}`:"none"}}>
              <span style={{fontSize:13,color:T.text2,fontFamily:"'DM Sans',sans-serif"}}>{l}</span>
              <span style={{fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:700,color:T.text}}>{v}</span>
            </div>
          ))}
        </div>
        {expiryTime>0&&<div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:T.orangeLight,border:"1px solid #FDE68A",borderRadius:999,padding:"8px 16px",marginBottom:20}}>
          {Ico.clock(T.orange)}<span style={{fontSize:12,fontWeight:700,color:"#92400E",fontFamily:"'DM Sans',sans-serif"}}>Rate expires in {formatTime(expiryTime)}</span>
        </div>}
        <div style={{display:"flex",gap:12}}>
          <GhostBtn onClick={prevStep} style={{flex:1}}>Back</GhostBtn>
          <CTA onClick={()=>setStep(6)} style={{flex:2}}>Proceed to Paystack <Ico.arrow/></CTA>
        </div>
        <p style={{fontSize:11,color:T.text3,marginTop:14,fontFamily:"'DM Sans',sans-serif"}}>Secure payment powered by Paystack</p>
      </div>
    </div>
    </div>
  );
}

function BankVariant({payAmount,receiveAmount,selectedAsset,prevStep,setStep,hasPaid,setHasPaid,proofFile,setProofFile,breadcrumbs}){
  const [uploading,setUploading]=useState(false);
  if(!hasPaid) return(
    <div style={{background:T.white,minHeight:"100vh",width:"100%"}}>
      <div style={{padding:"44px 52px 0"}}>{breadcrumbs}</div>
      <div style={{padding:"0 52px 60px",maxWidth:600,margin:"0 auto"}}>
      <div style={{background:T.white,border:`1.5px solid ${T.border}`,borderRadius:20,padding:36}}>
        <h2 style={{fontFamily:"'Sora',sans-serif",fontSize:22,fontWeight:700,color:T.text,marginBottom:24,textAlign:"center"}}>Bank Transfer Details</h2>
        <div style={{background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:16,padding:"20px 24px",textAlign:"center",marginBottom:20}}>
          <p style={{fontSize:11,fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:"1px",marginBottom:6,fontFamily:"'DM Sans',sans-serif"}}>Transfer exactly</p>
          <p style={{fontFamily:"'Sora',sans-serif",fontSize:28,fontWeight:700,color:T.text}}>{formatNGN(payAmount)}</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
          {[["Bank","Example Bank"],["Account Name","CheeseBall Technologies"],["Account Number","1234567890",true]].map(([l,v,copy],i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 18px",background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:14}}>
              <span style={{fontSize:13,color:T.text2,fontFamily:"'DM Sans',sans-serif"}}>{l}</span>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:700,color:T.text}}>{v}</span>
                {copy&&<button onClick={()=>navigator.clipboard.writeText(v)} style={{background:"none",border:"none",cursor:"pointer",color:T.blue,display:"flex"}}><Ico.copy/></button>}
              </div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",alignItems:"flex-start",gap:10,background:T.orangeLight,borderRadius:12,padding:"12px 16px",marginBottom:24}}>
          {Ico.info()}
          <p style={{fontSize:12,color:"#92400E",fontFamily:"'DM Sans',sans-serif",lineHeight:1.55}}>After payment, upload your proof of transfer for faster review.</p>
        </div>
        <div style={{display:"flex",gap:12}}>
          <GhostBtn onClick={prevStep} style={{flex:1}}>Back</GhostBtn>
          <CTA onClick={()=>setHasPaid(true)} style={{flex:2}}>I Have Paid</CTA>
        </div>
      </div>
    </div>
    </div>
  );
  return(
    <div style={{background:T.white,minHeight:"100vh",width:"100%"}}>
      <div style={{padding:"44px 52px 0"}}>{breadcrumbs}</div>
      <div style={{padding:"0 52px 60px",maxWidth:600,margin:"0 auto"}}>
      <div style={{background:T.white,border:`1.5px solid ${T.border}`,borderRadius:20,padding:36}}>
        <h2 style={{fontFamily:"'Sora',sans-serif",fontSize:22,fontWeight:700,color:T.text,marginBottom:24,textAlign:"center"}}>Upload Payment Proof</h2>
        <div onClick={()=>document.getElementById("proofInput").click()} style={{border:`2px dashed ${T.border}`,borderRadius:20,padding:"48px 24px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",cursor:"pointer",background:T.surface,transition:"border-color 0.18s"}} className="dropzone">
          <input type="file" id="proofInput" style={{display:"none"}} onChange={e=>setProofFile(e.target.files[0])}/>
          <div style={{width:56,height:56,background:T.white,borderRadius:16,border:`1.5px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14,color:T.blue}}><Ico.upload/></div>
          <p style={{fontFamily:"'Sora',sans-serif",fontSize:14,fontWeight:700,color:T.text,marginBottom:4}}>Upload screenshot or receipt</p>
          <p style={{fontSize:12,color:T.text3,fontFamily:"'DM Sans',sans-serif"}}>Max 5MB — JPG, PNG or PDF</p>
          {proofFile&&<div style={{marginTop:14,padding:"6px 16px",background:T.blue,color:"#fff",borderRadius:999,fontSize:11,fontWeight:700,fontFamily:"'DM Sans',sans-serif"}}>{proofFile.name}</div>}
        </div>
        <div style={{display:"flex",gap:12,marginTop:24}}>
          <GhostBtn onClick={()=>setHasPaid(false)} style={{flex:1}}>Back</GhostBtn>
          <CTA onClick={()=>{setUploading(true);setTimeout(()=>{setUploading(false);setStep(6);},2000);}} disabled={!proofFile||uploading} style={{flex:2}}>
            {uploading?<><Ico.refresh/> Uploading…</>:"Submit for Review"}
          </CTA>
        </div>
      </div>
    </div>
    </div>
  );
}

export default function BuyFlowStep5({paymentMethod,payAmount,receiveAmount,selectedAsset,walletAddress,expiryTime,prevStep,setStep,hasPaid,setHasPaid,proofFile,setProofFile,selectedNetwork,breadcrumbs}){
  if(paymentMethod==="wallet") return <WalletVariant payAmount={payAmount} receiveAmount={receiveAmount} selectedAsset={selectedAsset} walletAddress={walletAddress} selectedNetwork={selectedNetwork} expiryTime={expiryTime} prevStep={prevStep} setStep={setStep} breadcrumbs={breadcrumbs}/>;
  if(paymentMethod==="paystack") return <PaystackVariant payAmount={payAmount} receiveAmount={receiveAmount} selectedAsset={selectedAsset} walletAddress={walletAddress} expiryTime={expiryTime} prevStep={prevStep} setStep={setStep} breadcrumbs={breadcrumbs}/>;
  return <BankVariant payAmount={payAmount} receiveAmount={receiveAmount} selectedAsset={selectedAsset} prevStep={prevStep} setStep={setStep} hasPaid={hasPaid} setHasPaid={setHasPaid} proofFile={proofFile} setProofFile={setProofFile} breadcrumbs={breadcrumbs}/>;
}


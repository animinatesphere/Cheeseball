import React from "react";
import { T, Ico, formatNGN, formatTime, CTA, GhostBtn, RightPanel } from "./BuyFlowShared";

export default function BuyFlowStep4({payAmount,paymentMethod,setPaymentMethod,nextStep,prevStep,receiveAmount,selectedAsset,expiryTime,walletAddress,selectedNetwork,breadcrumbs}){
  const methods=[
    {key:"wallet",label:"NGN Wallet",sub:"Pay instantly from your Cheeseball balance",meta:"Available: ₦250,000 · Instant",Icon:Ico.wallet,iconBg:T.blueLight,iconColor:T.blue},
    {key:"paystack",label:"Paystack",sub:"Pay with card or bank transfer",meta:"Fast confirmation through Paystack",Icon:Ico.card,iconBg:"#ECFDF3",iconColor:"#16A34A"},
    {key:"bank",label:"Bank Transfer",sub:"Manual bank transfer with proof of payment",meta:"Review required after upload",Icon:Ico.bank,iconBg:"#FFFBEB",iconColor:"#D97706"},
  ];

  const handleSelect=(key)=>{
    setPaymentMethod(key);
    if(key==="wallet") nextStep();
  };

  return(
    <div style={{display:"grid",gridTemplateColumns:"1fr 400px",minHeight:"100vh",background:T.white,overflowX:"hidden",maxWidth:"100vw"}} className="buygrid">
      <div style={{padding:"44px 52px 60px",borderRight:`1px solid ${T.border}`}}>
        {breadcrumbs}
        <p style={{fontSize:11,fontWeight:600,color:T.blue,textTransform:"uppercase",letterSpacing:"1px",marginBottom:6,fontFamily:"'DM Sans',sans-serif"}}>Step 4 of 6</p>
        <h1 style={{fontFamily:"'Sora',sans-serif",fontSize:28,fontWeight:700,color:T.text,letterSpacing:"-0.6px",lineHeight:1.15}}>Payment Method</h1>
        <p style={{fontSize:14,color:T.text2,marginTop:6,lineHeight:1.6,fontFamily:"'DM Sans',sans-serif"}}>Choose how you want to pay.</p>

        <div style={{marginTop:32,display:"flex",flexDirection:"column",gap:14}}>
          {methods.map(({key,label,sub,meta,Icon,iconBg,iconColor})=>{
            const active=paymentMethod===key;
            return(
              <div key={key} onClick={()=>handleSelect(key)} className="method-card"
                style={{border:`1.5px solid ${active?T.blue:T.border}`,borderRadius:20,padding:"20px 22px",background:active?T.blueLight:T.white,cursor:"pointer",display:"flex",alignItems:"center",gap:18,transition:"all 0.18s",position:"relative"}}>
                {active&&<div style={{position:"absolute",top:14,right:14,width:22,height:22,borderRadius:"50%",background:T.blue,display:"flex",alignItems:"center",justifyContent:"center"}}>{Ico.check("#fff")}</div>}
                <div style={{width:56,height:56,borderRadius:16,background:iconBg,display:"flex",alignItems:"center",justifyContent:"center",color:iconColor,flexShrink:0}}><Icon/></div>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{fontFamily:"'Sora',sans-serif",fontSize:15,fontWeight:700,color:active?T.blue:T.text}}>{label}</p>
                  <p style={{fontSize:13,color:active?"#3B5AA8":T.text2,marginTop:4,lineHeight:1.5,fontFamily:"'DM Sans',sans-serif"}}>{sub}</p>
                  <p style={{fontSize:12,color:active?T.blue:T.text3,marginTop:6,fontWeight:500,fontFamily:"'DM Sans',sans-serif"}}>{meta}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{display:"flex",gap:12,marginTop:32}}>
          <GhostBtn onClick={prevStep} style={{flex:1}}>← Back</GhostBtn>
          <CTA onClick={nextStep} disabled={!paymentMethod} style={{flex:2}}>Continue <Ico.arrow/></CTA>
        </div>
        <p style={{fontSize:12,textAlign:"center",color:T.text3,marginTop:14,fontFamily:"'DM Sans',sans-serif"}}>Prices may change slightly before the transaction is completed.</p>
      </div>
      <RightPanel payAmount={payAmount} receiveAmount={receiveAmount} selectedAsset={selectedAsset} expiryTime={expiryTime} walletAddress={walletAddress} selectedNetwork={selectedNetwork} step={4}/>
    </div>
  );
}


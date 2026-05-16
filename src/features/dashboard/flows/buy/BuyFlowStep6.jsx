import React from "react";
import { T, Ico, formatNGN, truncateAddress, SecureFooter } from "./BuyFlowShared";

export default function BuyFlowStep6({paymentMethod,receiveAmount,selectedAsset,payAmount,walletAddress,onBack,setStep,breadcrumbs}){
  return(
    <div className="step-content" style={{maxWidth:960,margin:"0 auto",padding:"44px 24px 80px"}}>
      {breadcrumbs}
      {/* Animated success icon */}
      <div style={{textAlign:"center",marginBottom:40}}>
        <div style={{position:"relative",width:96,height:96,margin:"0 auto 20px",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div className="ripple" style={{position:"absolute",width:96,height:96,borderRadius:"50%",background:T.greenLight,animation:"ripple 1.8s ease-out infinite"}}/>
          <div className="popIn" style={{width:80,height:80,borderRadius:"50%",background:T.green,display:"flex",alignItems:"center",justifyContent:"center",animation:"popIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275) forwards",position:"relative",zIndex:1}}>
            {Ico.check("#fff")}
          </div>
        </div>
        <h1 className="responsive-title" style={{fontFamily:"'Sora',sans-serif",fontSize:30,fontWeight:700,color:T.text,letterSpacing:"-0.8px"}}>Payment Successful!</h1>
        <p style={{fontSize:15,color:T.text2,marginTop:8,fontFamily:"'DM Sans',sans-serif"}}>Your crypto purchase has been processed successfully.</p>
      </div>

      {/* Two-column receipt + next steps */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:28}} className="s6grid">

        {/* LEFT: Transaction receipt */}
        <div>
          <p style={{fontSize:11,fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:"1px",marginBottom:12,fontFamily:"'DM Sans',sans-serif"}}>Transaction Receipt</p>
          <div style={{background:T.white,border:`1.5px solid ${T.border}`,borderRadius:20,overflow:"hidden"}}>
            {/* Green top band */}
            <div style={{background:T.green,padding:"20px 24px"}}>
              <p style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.7)",textTransform:"uppercase",letterSpacing:"0.7px",marginBottom:8,fontFamily:"'DM Sans',sans-serif"}}>You receive</p>
              <p className="responsive-amount" style={{fontFamily:"'Sora',sans-serif",fontSize:32,fontWeight:700,color:"#fff",letterSpacing:"-1px",lineHeight:1}}>{receiveAmount} {selectedAsset.symbol}</p>
            </div>
            {/* Receipt rows */}
            <div style={{padding:"4px 24px"}}>
              {[
                ["You Paid", formatNGN(payAmount)],
                ["Asset", `${selectedAsset.name} (${selectedAsset.symbol})`],
                ["Wallet Address", truncateAddress(walletAddress)],
                ["Network", selectedAsset.network],
                ["Payment Method", paymentMethod.charAt(0).toUpperCase()+paymentMethod.slice(1)],
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
          <div style={{background:T.greenLight,border:"1.5px solid #A7F3D0",borderRadius:20,padding:"24px",display:"flex",alignItems:"flex-start",gap:16}}>
            <div style={{width:52,height:52,borderRadius:"50%",background:"#A7F3D0",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{Ico.check(T.greenText)}</div>
            <div>
              <h3 style={{fontFamily:"'Sora',sans-serif",fontSize:16,fontWeight:700,color:T.text,marginBottom:6}}>Funds are Secure</h3>
              <p style={{fontSize:13,color:T.text2,lineHeight:1.65,fontFamily:"'DM Sans',sans-serif"}}>Your transaction is being broadcasted to the blockchain. Most transfers complete in 5–10 minutes.</p>
            </div>
          </div>

          <div style={{background:T.blueLight,border:`1.5px solid ${T.border}`,borderRadius:20,padding:"24px"}}>
            <h3 style={{fontFamily:"'Sora',sans-serif",fontSize:16,fontWeight:700,color:T.text,marginBottom:8}}>What's next?</h3>
            <p style={{fontSize:13,color:T.text2,lineHeight:1.65,fontFamily:"'DM Sans',sans-serif",marginBottom:20}}>You can monitor the status of this transaction and download your official receipt from your dashboard.</p>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <button style={{width:"100%",padding:"14px",borderRadius:14,border:`1.5px solid ${T.border}`,background:T.white,color:T.blue,fontSize:14,fontWeight:700,fontFamily:"'Sora',sans-serif",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}} className="ghostbtn">
                View Transactions <Ico.arrow/>
              </button>
              <button onClick={onBack} style={{width:"100%",padding:"14px",borderRadius:14,border:"none",background:T.blue,color:"#fff",fontSize:14,fontWeight:700,fontFamily:"'Sora',sans-serif",cursor:"pointer"}} className="ctabtn">
                Back to Dashboard
              </button>
            </div>
          </div>

          <SecureFooter/>
        </div>
      </div>
    </div>
  );
}


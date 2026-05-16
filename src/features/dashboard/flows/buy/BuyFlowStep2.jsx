import React from "react";
import { T, Ico, formatNGN, formatTime, CTA, GhostBtn } from "./BuyFlowShared";

export default function BuyFlowStep2({payAmount,receiveAmount,selectedAsset,selectedNetwork,nextStep,prevStep,expiryTime,isExpired,resetExpiry,breadcrumbs}){
  const isUrgent = expiryTime<=60;
  return(
    <div style={{background:T.white,minHeight:"100vh",width:"100%"}}>
      <div className="step-content" style={{padding:"44px 52px 0"}}>{breadcrumbs}</div>
      <div className="step-content" style={{padding:"0 52px 60px",background:T.white,maxWidth:860,margin:"0 auto",width:"100%"}}>
        <div className="preview-header" style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:32,flexWrap:"wrap",gap:12}}>
          <div>
            <h1 className="responsive-title" style={{fontFamily:"'Sora',sans-serif",fontSize:28,fontWeight:700,color:T.text,letterSpacing:"-0.6px"}}>Price Preview</h1>
            <p style={{fontSize:14,color:T.text2,marginTop:6,fontFamily:"'DM Sans',sans-serif"}}>Review the details below. This price is locked for a short time.</p>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:7,background:isUrgent?T.orangeLight:T.greenLight,border:`1px solid ${isUrgent?"#FDE68A":"#A7F3D0"}`,borderRadius:999,padding:"8px 16px"}}>
            {Ico.clock(isUrgent?T.orange:T.green)}
            <span style={{fontSize:13,fontWeight:700,color:isUrgent?"#92400E":T.greenText,fontFamily:"'DM Sans',sans-serif"}}>Rate expires in {formatTime(expiryTime)}</span>
          </div>
        </div>

        {/* Main preview card */}
        <div style={{background:T.white,border:`1.5px solid ${T.border}`,borderRadius:20,overflow:"hidden",marginBottom:24}}>
          {/* You pay → You receive */}
          <div className="preview-amount-wrap" style={{padding:"28px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,borderBottom:`1px solid ${T.border}`,flexWrap:"wrap"}}>
          <div className="preview-amount-item" style={{textAlign:"left"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><span style={{fontSize:18}}>🇳🇬</span><span style={{fontSize:12,fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:"0.7px",fontFamily:"'DM Sans',sans-serif"}}>You pay</span></div>
            <p className="preview-amount-val" style={{fontFamily:"'Sora',sans-serif",fontSize:36,fontWeight:700,color:T.text,letterSpacing:"-1.5px",lineHeight:1}}>{formatNGN(payAmount)}</p>
          </div>
          <div className="preview-arrow" style={{width:44,height:44,borderRadius:"50%",border:`1.5px solid ${T.border}`,background:T.blueLight,display:"flex",alignItems:"center",justifyContent:"center",color:T.blue,flexShrink:0}}><Ico.arrow/></div>
          <div className="preview-amount-item" style={{textAlign:"right"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,justifyContent:"flex-end"}}>
              <span style={{fontSize:12,fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:"0.7px",fontFamily:"'DM Sans',sans-serif"}}>You receive</span>
              <div style={{width:24,height:24,borderRadius:"50%",background:selectedAsset.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff"}}>{selectedAsset.icon}</div>
            </div>
            <p className="preview-amount-val" style={{fontFamily:"'Sora',sans-serif",fontSize:36,fontWeight:700,color:T.blue,letterSpacing:"-1.5px",lineHeight:1}}>{receiveAmount} {selectedAsset.symbol}</p>
          </div>
        </div>

        {/* Asset + Network */}
        <div style={{padding:"18px 32px",display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(140px, 1fr))",gap:24,borderBottom:`1px solid ${T.border}`}}>
          <div>
            <p style={{fontSize:10,fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:"1px",marginBottom:4,fontFamily:"'DM Sans',sans-serif"}}>Asset</p>
            <p style={{fontFamily:"'Sora',sans-serif",fontSize:14,fontWeight:700,color:T.text}}>{selectedAsset.name} ({selectedAsset.symbol})</p>
          </div>
          <div>
            <p style={{fontSize:10,fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:"1px",marginBottom:4,fontFamily:"'DM Sans',sans-serif"}}>Network</p>
            <p style={{fontFamily:"'Sora',sans-serif",fontSize:14,fontWeight:700,color:T.text}}>{selectedAsset.symbol} · {selectedNetwork}</p>
          </div>
        </div>

        {/* Price breakdown */}
        <div style={{padding:"24px 32px"}}>
          <p style={{fontSize:11,fontWeight:700,color:T.text,textTransform:"uppercase",letterSpacing:"1px",marginBottom:16,fontFamily:"'DM Sans',sans-serif"}}>Price breakdown</p>
          {[["Markup / spread","3%"],["Estimated crypto amount",`${receiveAmount} ${selectedAsset.symbol}`],["NGN amount",formatNGN(payAmount)]].map(([label,value],i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <span style={{fontSize:13,color:T.text2,fontFamily:"'DM Sans',sans-serif"}}>{label}</span>
              <span style={{fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:700,color:T.text}}>{value}</span>
            </div>
          ))}
          <div style={{display:"flex",alignItems:"flex-start",gap:10,background:T.blueLight,borderRadius:12,padding:"14px 16px",marginTop:16}}>
            <Ico.info/>
            <p style={{fontSize:13,color:"#1A3A8A",lineHeight:1.6,fontFamily:"'DM Sans',sans-serif"}}>This price is temporarily locked. If it expires before you continue, we'll refresh it before checkout.</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="actions-wrap" style={{display:"flex",gap:12,alignItems:"center"}}>
        <GhostBtn onClick={prevStep} style={{flex:1}}>← Edit Amount</GhostBtn>
        <CTA onClick={nextStep} style={{flex:2}}>Continue <Ico.arrow/></CTA>
      </div>
      <p style={{fontSize:12,textAlign:"center",color:T.text3,marginTop:14,fontFamily:"'DM Sans',sans-serif"}}>Prices may change slightly before the transaction is completed.</p>

      {/* Expired overlay */}
      {isExpired&&(
        <div style={{position:"fixed",inset:0,background:"rgba(10,15,30,0.6)",backdropFilter:"blur(6px)",zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
          <div style={{background:T.white,borderRadius:28,padding:40,maxWidth:420,width:"100%",textAlign:"center",boxShadow:"0 25px 60px rgba(0,0,0,0.15)"}}>
            <div style={{width:72,height:72,background:T.orangeLight,borderRadius:20,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}>
              {Ico.clock(T.orange)}
            </div>
            <h3 style={{fontFamily:"'Sora',sans-serif",fontSize:22,fontWeight:700,color:T.text,marginBottom:8}}>Rate expired</h3>
            <p style={{color:T.text2,fontSize:14,lineHeight:1.6,marginBottom:24,fontFamily:"'DM Sans',sans-serif"}}>Rates changed while you were reviewing. Refresh to get the latest.</p>
            <CTA onClick={resetExpiry}><Ico.refresh/> Refresh Rate</CTA>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}


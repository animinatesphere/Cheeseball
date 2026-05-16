import React, { useState } from "react";
import { T, Ico, NETWORKS, formatNGN, formatTime, CTA, GhostBtn, RightPanel } from "./BuyFlowShared";

export default function BuyFlowStep3({selectedAsset,receiveAmount,selectedNetwork,setSelectedNetwork,walletAddress,setWalletAddress,nextStep,prevStep,payAmount,expiryTime,isExpired,resetExpiry,breadcrumbs}){
  const [copied,setCopied] = useState(false);
  const isInvalid = walletAddress.length>0 && walletAddress.length<20;

  const handlePaste = async()=>{
    try{
      const t=await navigator.clipboard.readText();
      setWalletAddress(t);
    }catch{
      // Clipboard access can be blocked by the browser; manual entry still works.
    }
  };
  const handleCopy = ()=>{
    if(walletAddress){ navigator.clipboard.writeText(walletAddress); setCopied(true); setTimeout(()=>setCopied(false),2000); }
  };

  return(
    <div style={{display:"grid",gridTemplateColumns:"1fr 400px",minHeight:"100vh",background:T.white,overflowX:"hidden",maxWidth:"100vw"}} className="buygrid">
      <div className="step-content" style={{padding:"44px 52px 60px",borderRight:`1px solid ${T.border}`}}>
        {breadcrumbs}
        <p style={{fontSize:11,fontWeight:600,color:T.blue,textTransform:"uppercase",letterSpacing:"1px",marginBottom:6,fontFamily:"'DM Sans',sans-serif"}}>Step 3 of 6</p>
        <h1 className="responsive-title" style={{fontFamily:"'Sora',sans-serif",fontSize:28,fontWeight:700,color:T.text,letterSpacing:"-0.6px",lineHeight:1.15}}>Wallet Address</h1>
        <p style={{fontSize:14,color:T.text2,marginTop:6,lineHeight:1.6,fontFamily:"'DM Sans',sans-serif"}}>Enter the wallet address and select the network where you want to receive your crypto.</p>

        {/* Receive preview */}
        <div style={{marginTop:32,display:"flex",alignItems:"center",gap:16,padding:"18px 20px",background:T.surface,borderRadius:16,border:`1.5px solid ${T.border}`}}>
          <div style={{width:48,height:48,borderRadius:"50%",background:selectedAsset.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:700,color:"#fff",flexShrink:0,fontFamily:"'Sora',sans-serif"}}>{selectedAsset.icon}</div>
          <div>
            <p style={{fontSize:11,fontWeight:600,color:T.text3,textTransform:"uppercase",letterSpacing:"0.7px",fontFamily:"'DM Sans',sans-serif"}}>You will receive</p>
            <p style={{fontFamily:"'Sora',sans-serif",fontSize:22,fontWeight:700,color:T.text,letterSpacing:"-0.8px",marginTop:2}}>{receiveAmount} {selectedAsset.symbol}</p>
          </div>
        </div>

        {/* Network selector */}
        <div style={{marginTop:24}}>
          <p style={{fontSize:11,fontWeight:600,color:T.text3,textTransform:"uppercase",letterSpacing:"0.8px",marginBottom:10,fontFamily:"'DM Sans',sans-serif"}}>Network</p>
          <div style={{position:"relative"}}>
            <select value={selectedNetwork} onChange={e=>setSelectedNetwork(e.target.value)}
              style={{width:"100%",border:`1.5px solid ${T.border}`,borderRadius:16,padding:"16px 44px 16px 20px",fontSize:14,fontWeight:600,color:T.text,fontFamily:"'DM Sans',sans-serif",background:T.white,outline:"none",appearance:"none",cursor:"pointer",transition:"border-color 0.18s"}}
              className="netsel">
              {NETWORKS[selectedAsset.symbol].map(n=><option key={n} value={n}>{n}</option>)}
            </select>
            <span style={{position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}><Ico.chevDn/></span>
          </div>
          <p style={{fontSize:12,color:T.text3,marginTop:6,fontFamily:"'DM Sans',sans-serif"}}>Select the network that matches your wallet.</p>
        </div>

        {/* Wallet address input */}
        <div style={{marginTop:24}}>
          <p style={{fontSize:11,fontWeight:600,color:T.text3,textTransform:"uppercase",letterSpacing:"0.8px",marginBottom:10,fontFamily:"'DM Sans',sans-serif"}}>Wallet address</p>
          <div style={{position:"relative"}}>
            <input type="text" placeholder={`Paste your ${selectedAsset.symbol} wallet address`} value={walletAddress} onChange={e=>setWalletAddress(e.target.value)}
              style={{width:"100%",border:`1.5px solid ${isInvalid?T.red:T.border}`,borderRadius:16,padding:"16px 52px 16px 20px",fontSize:14,fontFamily:"monospace",fontWeight:500,color:T.text,background:T.white,outline:"none",transition:"border-color 0.18s",boxSizing:"border-box"}}
              className="addrinput"/>
            <button onClick={copied?null:handleCopy} title={walletAddress?"Copy":"Paste"} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:copied?T.green:T.text3,display:"flex",alignItems:"center",gap:4,fontSize:11,fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>
              {copied?<>{Ico.check(T.green)} Copied!</>:<><Ico.copy/></>}
            </button>
          </div>
          {!walletAddress&&<button onClick={handlePaste} style={{marginTop:8,background:"none",border:"none",color:T.blue,fontSize:12,fontWeight:600,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",padding:0}}>Paste from clipboard</button>}
          {isInvalid&&<p style={{color:T.red,fontSize:12,fontWeight:600,marginTop:6,fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:4}}><Ico.info/> Enter a valid {selectedAsset.symbol} wallet address</p>}
        </div>

        {/* Safety notice */}
        <div style={{display:"flex",alignItems:"flex-start",gap:10,background:T.blueLight,borderRadius:14,padding:"14px 18px",marginTop:20}}>
          <Ico.info/>
          <p style={{fontSize:13,color:"#1A3A8A",lineHeight:1.6,fontFamily:"'DM Sans',sans-serif"}}>Make sure this address supports the selected network. Crypto sent to the wrong network may be lost.</p>
        </div>

        {/* Actions */}
        <div className="actions-wrap" style={{display:"flex",gap:12,marginTop:28}}>
          <GhostBtn onClick={prevStep} style={{flex:1}}>← Back</GhostBtn>
          <CTA onClick={nextStep} disabled={!walletAddress||isInvalid} style={{flex:2}}>Continue <Ico.arrow/></CTA>
        </div>
      </div>
      <RightPanel payAmount={payAmount} receiveAmount={receiveAmount} selectedAsset={selectedAsset} expiryTime={expiryTime} walletAddress={walletAddress} selectedNetwork={selectedNetwork} step={3}/>

      {/* Expired overlay */}
      {isExpired&&(
        <div style={{position:"fixed",inset:0,background:"rgba(10,15,30,0.6)",backdropFilter:"blur(6px)",zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
          <div style={{background:T.white,borderRadius:28,padding:40,maxWidth:420,width:"100%",textAlign:"center",boxShadow:"0 25px 60px rgba(0,0,0,0.15)"}}>
            <div style={{width:72,height:72,background:T.orangeLight,borderRadius:20,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}>{Ico.clock(T.orange)}</div>
            <h3 style={{fontFamily:"'Sora',sans-serif",fontSize:22,fontWeight:700,color:T.text,marginBottom:8}}>Rate expired</h3>
            <p style={{color:T.text2,fontSize:14,lineHeight:1.6,marginBottom:24,fontFamily:"'DM Sans',sans-serif"}}>Rates changed while you were reviewing. Refresh to get the latest.</p>
            <CTA onClick={resetExpiry}><Ico.refresh/> Refresh Rate</CTA>
          </div>
        </div>
      )}
    </div>
  );
}


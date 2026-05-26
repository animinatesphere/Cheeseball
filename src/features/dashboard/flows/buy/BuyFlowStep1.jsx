import React, { useState, useRef, useEffect } from "react";
import { T, Ico, ASSETS, formatNGN, formatUSD, NGN_RATE, CTA, RightPanel } from "./BuyFlowShared";
import { getBuyQuote } from "@/services/api";

export default function BuyFlowStep1({
  selectedAsset, setSelectedAsset,
  payAmount, setPayAmount,
  searchQuery, setSearchQuery,
  breadcrumbs, onQuoteFetched,
}) {
  const [ddOpen, setDdOpen]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const ddRef = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ddRef.current && !ddRef.current.contains(e.target)) setDdOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const selectCoin = (asset) => {
    setSelectedAsset(asset);
    setDdOpen(false);
  };

  const handleContinue = async () => {
    if (!payAmount || payAmount <= 0) return;
    if (Number(payAmount) < 1000) {
      setError("Minimum buy amount is ₦1,000");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const quote = await getBuyQuote(selectedAsset.symbol, Number(payAmount));
      onQuoteFetched(quote);
    } catch (err) {
      setError(err.message || "Failed to get quote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredAssets = ASSETS.filter(a =>
    a.name.toLowerCase().includes((searchQuery||"").toLowerCase()) ||
    a.symbol.toLowerCase().includes((searchQuery||"").toLowerCase())
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", minHeight: "100vh", background: T.white, width: "100%" }} className="buygrid">
      <div className="step-content" style={{ padding: "44px 52px 60px", borderRight: `1px solid ${T.border}`, width: "100%", minWidth: 0 }}>
        {breadcrumbs}
        <p style={{fontSize:11,fontWeight:600,color:T.blue,textTransform:"uppercase",letterSpacing:"1px",marginBottom:6,fontFamily:"'DM Sans',sans-serif"}}>Transaction</p>
        <h1 className="responsive-title" style={{fontFamily:"'Sora',sans-serif",fontSize:28,fontWeight:700,color:T.text,letterSpacing:"-0.6px",lineHeight:1.15}}>Buy Crypto</h1>
        <p style={{fontSize:14,color:T.text2,marginTop:6,lineHeight:1.6,fontFamily:"'DM Sans',sans-serif"}}>Select an asset and enter the amount you'd like to purchase. Crypto is delivered instantly to your Cheeseball wallet.</p>

        {/* Asset selector */}
        <div style={{marginTop:32}}>
          <p style={{fontSize:11,fontWeight:600,color:T.text3,textTransform:"uppercase",letterSpacing:"0.8px",marginBottom:10,fontFamily:"'DM Sans',sans-serif"}}>Select asset</p>
          <div ref={ddRef} className="csel" style={{border:`1.5px solid ${ddOpen?T.blue:T.border}`,borderRadius:16,background:T.white,cursor:"pointer",overflow:"hidden",transition:"border-color 0.18s"}} onClick={()=>setDdOpen(o=>!o)}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 20px"}}>
              <div style={{display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:44,height:44,borderRadius:"50%",background:selectedAsset.color,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Sora',sans-serif",fontSize:15,fontWeight:700,color:"#fff",flexShrink:0}}>{selectedAsset.icon}</div>
                <div style={{minWidth:0}}>
                  <p style={{fontFamily:"'Sora',sans-serif",fontSize:15,fontWeight:700,color:T.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{selectedAsset.name}</p>
                  <p style={{fontSize:12,color:T.text2,marginTop:3}}>{selectedAsset.symbol}</p>
                </div>
              </div>
              <span style={{fontSize:16,color:T.blue,transform:ddOpen?"rotate(180deg)":"none",transition:"transform 0.2s",display:"inline-block",marginLeft:8}}>⌄</span>
            </div>
            {ddOpen && (
              <div style={{borderTop:`1px solid ${T.border}`,padding:"8px 12px 12px",display:"flex",flexDirection:"column",gap:2,maxHeight:280,overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
                {filteredAssets.map(asset=>(
                  <div key={asset.id} className="ddopt" style={{display:"flex",alignItems:"center",gap:12,padding:"10px 10px",borderRadius:12,cursor:"pointer",background:asset.id===selectedAsset.id?T.blueLight:"transparent",transition:"background 0.12s"}} onClick={()=>selectCoin(asset)}>
                    <div style={{width:32,height:32,borderRadius:"50%",background:asset.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff",flexShrink:0}}>{asset.icon}</div>
                    <div>
                      <p style={{fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:600,color:T.text}}>{asset.name}</p>
                      <p style={{fontSize:11,color:T.text2,marginTop:1}}>{asset.symbol}</p>
                    </div>

                    {asset.id===selectedAsset.id&&<span style={{color:T.blue,fontSize:15,marginLeft:6}}>✓</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Amount input */}
        <div style={{marginTop:28}}>
          <p style={{fontSize:11,fontWeight:600,color:T.text3,textTransform:"uppercase",letterSpacing:"0.8px",marginBottom:10,fontFamily:"'DM Sans',sans-serif"}}>You pay</p>
          <div style={{border:`1.5px solid ${T.border}`,borderRadius:16,padding:"20px 22px",background:T.white,transition:"border-color 0.18s"}} className="amtwrap">
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span className="responsive-amount" style={{fontFamily:"'Sora',sans-serif",fontSize:36,fontWeight:700,color:T.text3}}>₦</span>
              <input type="number" placeholder="1000" value={payAmount||""} onChange={e=>{setPayAmount(e.target.value);setError(null);}}
                className="buy-amt-input"
                style={{flex:1,border:"none",outline:"none",fontFamily:"'Sora',sans-serif",fontSize:36,fontWeight:700,color:payAmount>0?T.text:"#CED6E8",background:"transparent",minWidth:0,letterSpacing:"-1.5px"}}/>
              <div style={{display:"flex",alignItems:"center",gap:6,background:T.blueLight,borderRadius:10,padding:"8px 13px",flexShrink:0}}>
                <span style={{fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:700,color:T.blue}}>NGN</span>
                <span style={{fontSize:16}}>🇳🇬</span>
              </div>
            </div>
          </div>
          <div style={{display:"grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap:8, marginTop:10}}>
            {[5000,10000,50000,100000].map(amt=>(
              <button key={amt} onClick={()=>{setPayAmount(amt);setError(null);}} className="qbtn"
                style={{flex:"1 0 80px",border:`1.5px solid ${payAmount==amt?T.blue:T.border}`,background:payAmount==amt?T.blueLight:T.white,borderRadius:10,padding:"8px 10px",fontSize:12,fontWeight:600,color:payAmount==amt?T.blue:T.text2,cursor:"pointer",transition:"all 0.15s",textAlign:"center",fontFamily:"'DM Sans',sans-serif",minWidth:"fit-content"}}>
                {formatNGN(amt)}
              </button>
            ))}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div style={{marginTop:16,display:"flex",alignItems:"flex-start",gap:10,background:T.redLight,border:`1px solid #FECACA`,borderRadius:12,padding:"12px 16px"}}>
            <Ico.info/>
            <p style={{fontSize:13,color:T.red,fontFamily:"'DM Sans',sans-serif",lineHeight:1.5}}>{error}</p>
          </div>
        )}

        {/* Delivery info banner */}
        <div style={{display:"flex",alignItems:"flex-start",gap:10,background:T.blueLight,borderRadius:14,padding:"14px 18px",marginTop:20}}>
          <Ico.info/>
          <p style={{fontSize:13,color:"#1A3A8A",lineHeight:1.6,fontFamily:"'DM Sans',sans-serif"}}>Purchased crypto is automatically deposited into your Cheeseball internal wallet — no external address needed.</p>
        </div>

        <div style={{marginTop:24}}>
          <CTA onClick={handleContinue} disabled={!payAmount||Number(payAmount)<1000||loading}>
            {loading
              ? <><span style={{width:16,height:16,border:"2px solid rgba(255,255,255,0.4)",borderTopColor:"#fff",borderRadius:"50%",display:"inline-block",animation:"spin 0.7s linear infinite"}}/> Getting Quote…</>
              : <>Get Quote <Ico.arrow/></>
            }
          </CTA>
          <p style={{fontSize:11,textAlign:"center",color:T.text3,fontWeight:500,marginTop:12,fontFamily:"'DM Sans',sans-serif"}}>The exact amount you'll receive will be confirmed on the next screen.</p>
        </div>
      </div>
      <RightPanel payAmount={payAmount} receiveAmount={0} selectedAsset={selectedAsset} expiryTime={0} step={1}/>
    </div>
  );
}

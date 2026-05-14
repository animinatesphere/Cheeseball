import { useState } from "react";

const T = {
  blue:"#1A6FFF",blueDark:"#1259D9",blueLight:"#EEF3FF",
  text:"#0A0F1E",text2:"#6B7A99",text3:"#A8B4CC",
  border:"#E8EEFF",surface:"#F7F9FF",white:"#FFFFFF",
  green:"#00C48C",greenLight:"#E6FAF4",greenText:"#00966B",
  mintGreen:"#4ADE80",orange:"#F59E0B",orangeLight:"#FFFBEB",
};

const fmtNGN = (n) => "₦" + Number(n).toLocaleString("en-NG",{minimumFractionDigits:2,maximumFractionDigits:2});

const Ico = {
  copy:(col=T.blue)=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  check:(col=T.green)=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  warn:()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.orange} strokeWidth="2" strokeLinecap="round" style={{flexShrink:0,marginTop:1}}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  shield:()=><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.mintGreen} strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  arrowDn:()=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.blue} strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>,
  bank:()=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.blue} strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="10" width="18" height="11" rx="1"/><path d="M3 10l9-7 9 7"/><line x1="9" y1="21" x2="9" y2="10"/><line x1="15" y1="21" x2="15" y2="10"/></svg>,
  wallet:()=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.green} strokeWidth="1.8" strokeLinecap="round"><path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4"/><circle cx="17" cy="12" r="1" fill={T.green}/></svg>,
  send:()=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
};

export default function SendCryptoStep({ order, onSent }) {
  const [copied,setCopied] = useState(false);
  const [loading,setLoading] = useState(false);
  const o = order;
  const brokerAddress = "bc1qbrokerwallet123abc456def789xyz";
  const network = o.coin.name === "Ethereum" ? "ERC-20" : o.coin.name === "BNB" ? "BEP-20" : o.coin.name;

  const copyAddress = () => { navigator.clipboard.writeText(brokerAddress).catch(()=>{}); setCopied(true); setTimeout(()=>setCopied(false),2000); };
  const handleSent = () => { setLoading(true); setTimeout(()=>{setLoading(false); onSent?.();},1500); };

  return (
    <>
      <style>{`
        .copy-btn:hover{background:${T.blueLight}!important;border-color:${T.blue}!important;}
        .ctaon4:hover{background:${T.blueDark}!important;}
        .ctaon4:active{transform:scale(0.985)!important;}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .blink{animation:blink 2s ease-in-out infinite}
        @media(max-width:900px){
          .send-grid{grid-template-columns:1fr!important;}
          .send-grid > div { min-width: 0 !important; }
          .send-grid>div:first-child{padding:28px 20px 32px!important;border-right:none!important;border-bottom:1px solid ${T.border};}
          .send-grid>div:last-child{padding:28px 20px 32px!important;}
        }
        @media(max-width:480px){
          .send-grid>div:first-child{padding:20px 16px 24px!important;}
          .send-grid>div:last-child{padding:20px 16px 24px!important;}
          .send-grid h1{font-size:22px!important;}
          .send-grid .send-amt{font-size:26px!important;}
        }
        @media(max-width:380px){
          .send-grid>div:first-child{padding:16px 12px 20px!important;}
          .send-grid>div:last-child{padding:16px 12px 20px!important;}
          .send-grid .send-amt{font-size:22px!important;}
        }
      `}</style>
      <div className="send-grid" style={{display:"grid",gridTemplateColumns:"1fr 400px",minHeight:"100vh",fontFamily:"'DM Sans',sans-serif",background:T.white,color:T.text,overflowX:"hidden",maxWidth:"100vw"}}>
        <div style={{padding:"44px 52px 60px",borderRight:`1px solid ${T.border}`}}>
          <nav style={{display:"flex",alignItems:"center",gap:6,marginBottom:36,flexWrap:"wrap"}}>
            {["Dashboard","Sell Crypto","Payout Method","Confirm"].map((c,i)=>(<span key={i} style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:13,color:T.text2,fontWeight:500,cursor:"pointer"}}>{c}</span><span style={{color:T.text3,fontSize:12}}>›</span></span>))}
            <span style={{fontSize:13,fontWeight:600,color:T.blue}}>Send Crypto</span>
          </nav>
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:6}}>
            <div style={{width:44,height:44,borderRadius:"50%",background:o.coin.color,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Sora',sans-serif",fontSize:16,fontWeight:700,color:"#fff",flexShrink:0}}>{o.coin.icon}</div>
            <div>
              <p style={{fontSize:11,fontWeight:600,color:T.blue,textTransform:"uppercase",letterSpacing:"1px"}}>Step 4 of 5</p>
              <h1 style={{fontFamily:"'Sora',sans-serif",fontSize:26,fontWeight:700,color:T.text,letterSpacing:"-0.5px",lineHeight:1.1}}>Send {o.coin.sym}</h1>
            </div>
          </div>
          <p style={{fontSize:14,color:T.text2,marginTop:8,lineHeight:1.6}}>Send from your external wallet or exchange (Trust Wallet, Binance, Bybit, etc.)</p>

          <div style={{marginTop:28,background:T.blueLight,border:`1.5px solid ${T.border}`,borderRadius:16,padding:"20px 22px"}}>
            <p style={{fontSize:11,fontWeight:600,color:T.text2,textTransform:"uppercase",letterSpacing:"0.8px",marginBottom:10}}>Send exactly</p>
            <p className="send-amt" style={{fontFamily:"'Sora',sans-serif",fontSize:38,fontWeight:700,color:T.text,letterSpacing:"-1.5px",lineHeight:1,wordBreak:"break-all"}}>{o.amount} <span style={{fontSize:24,color:o.coin.color}}>{o.coin.sym}</span></p>
            <p style={{fontSize:12,color:T.text2,marginTop:6}}>Any amount other than <strong>{o.amount} {o.coin.sym}</strong> will delay your payout.</p>
          </div>

          <div style={{marginTop:16}}>
            <p style={{fontSize:11,fontWeight:600,color:T.text3,textTransform:"uppercase",letterSpacing:"0.8px",marginBottom:10}}>To this wallet address</p>
            <div style={{border:`1.5px solid ${T.border}`,borderRadius:16,padding:"16px 20px",background:T.white,display:"flex",alignItems:"center",gap:12}}>
              <p style={{flex:1,fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:600,color:T.text,wordBreak:"break-all",lineHeight:1.5}}>{brokerAddress}</p>
              <button className="copy-btn" onClick={copyAddress} style={{display:"flex",alignItems:"center",gap:7,padding:"10px 16px",border:`1.5px solid ${copied?T.green:T.border}`,borderRadius:10,background:copied?T.greenLight:T.white,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:600,color:copied?T.greenText:T.blue,flexShrink:0,transition:"all 0.18s",whiteSpace:"nowrap"}}>
                {copied?<><Ico.check /> Copied!</>:<><Ico.copy /> Copy</>}
              </button>
            </div>
          </div>

          <div style={{marginTop:12,border:`1.5px solid ${T.border}`,borderRadius:14,padding:"14px 18px",background:T.white,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span style={{fontSize:13,color:T.text2}}>Network</span>
            <span style={{fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:700,color:T.text,display:"flex",alignItems:"center",gap:7}}><div style={{width:8,height:8,borderRadius:"50%",background:o.coin.color}}/>{network}</span>
          </div>

          <div style={{marginTop:16,display:"flex",alignItems:"flex-start",gap:12,background:T.orangeLight,border:"1.5px solid #FDE68A",borderRadius:14,padding:"14px 18px"}}>
            <Ico.warn />
            <div>
              <p style={{fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:700,color:"#92400E",marginBottom:4}}>Important</p>
              <p style={{fontSize:13,color:"#92400E",lineHeight:1.55}}>Only send <strong>{o.coin.sym}</strong> on the <strong>{network}</strong> network. Sending the wrong asset or using the wrong network may result in permanent loss of funds.</p>
            </div>
          </div>

          <button className="ctaon4" onClick={handleSent} disabled={loading} style={{width:"100%",marginTop:24,padding:"18px",borderRadius:14,border:"none",fontFamily:"'Sora',sans-serif",fontSize:15,fontWeight:700,cursor:loading?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10,background:T.blue,color:"#fff",transition:"all 0.2s",letterSpacing:"0.2px"}}>
            {loading?<><div style={{width:16,height:16,border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/> Submitting…</>:<><Ico.send /> I Have Sent Crypto</>}
          </button>
          <p style={{fontSize:12,color:T.text3,textAlign:"center",marginTop:12,lineHeight:1.5}}>Only tap this after you have completed the transfer from your external wallet.</p>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,marginTop:20}}><span style={{fontSize:12,fontWeight:600,color:T.text2}}>Your transaction is secure</span><span style={{display:"flex",alignItems:"center",gap:5,fontSize:12,fontWeight:500,color:T.mintGreen}}><Ico.shield /> Protected by Cheeseball</span></div>
        </div>

        <div style={{padding:"44px 32px 60px",background:T.surface,display:"flex",flexDirection:"column"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
            <p style={{fontSize:11,fontWeight:600,color:T.text3,textTransform:"uppercase",letterSpacing:"0.8px"}}>Transaction details</p>
            <div style={{display:"flex",alignItems:"center",gap:6,background:T.orangeLight,border:"1px solid #FDE68A",borderRadius:20,padding:"4px 10px"}}><div className="blink" style={{width:6,height:6,borderRadius:"50%",background:T.orange,flexShrink:0}}/><span style={{fontSize:11,fontWeight:600,color:"#92400E"}}>Awaiting payment</span></div>
          </div>
          <div style={{background:T.white,border:`1.5px solid ${T.border}`,borderRadius:20,overflow:"hidden",marginBottom:14}}>
            <div style={{padding:"22px 22px 0"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px",background:T.surface,borderRadius:14}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:38,height:38,borderRadius:"50%",background:o.coin.color,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:700,color:"#fff",flexShrink:0}}>{o.coin.icon}</div>
                  <div><p style={{fontSize:11,color:T.text3,marginBottom:2}}>You send</p><p style={{fontFamily:"'Sora',sans-serif",fontSize:15,fontWeight:700,color:T.text}}>{o.amount} {o.coin.sym}</p></div>
                </div>
                <div style={{textAlign:"right"}}><p style={{fontSize:11,color:T.text3,marginBottom:2}}>Network</p><div style={{display:"flex",alignItems:"center",gap:5,justifyContent:"flex-end"}}><div style={{width:6,height:6,borderRadius:"50%",background:o.coin.color}}/><p style={{fontFamily:"'Sora',sans-serif",fontSize:12,fontWeight:600,color:T.text}}>{network}</p></div></div>
              </div>
              <div style={{display:"flex",justifyContent:"center",margin:"8px 0"}}><div style={{width:28,height:28,borderRadius:"50%",background:T.blueLight,border:`1.5px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center"}}><Ico.arrowDn /></div></div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px",background:T.blue,borderRadius:14,marginBottom:22}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:38,height:38,borderRadius:"50%",background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
                  <div><p style={{fontSize:11,color:"rgba(255,255,255,0.55)",marginBottom:2}}>You receive</p><p style={{fontFamily:"'Sora',sans-serif",fontSize:15,fontWeight:700,color:"#fff"}}>{fmtNGN(o.netNGN)}</p></div>
                </div>
                <div style={{textAlign:"right"}}><p style={{fontSize:11,color:"rgba(255,255,255,0.5)",marginBottom:2}}>After fee</p><p style={{fontFamily:"'Sora',sans-serif",fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.75)"}}>1% system fee</p></div>
              </div>
            </div>
            <div style={{borderTop:`1.5px dashed ${T.border}`,margin:"0 22px"}}/>
            <div style={{padding:"6px 22px 8px"}}>
              {[{label:"Asset",value:`${o.coin.name} (${o.coin.sym})`},{label:"Quantity",value:`${o.amount} ${o.coin.sym}`},{label:"Network",value:network},{label:"Net payout",value:fmtNGN(o.netNGN),blue:true}].map(({label,value,blue},i,arr)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i===arr.length-1?"none":`1px solid ${T.border}`}}><span style={{fontSize:12,color:T.text2}}>{label}</span><span style={{fontFamily:"'Sora',sans-serif",fontSize:12,fontWeight:700,color:blue?T.blue:T.text}}>{value}</span></div>
              ))}
            </div>
            <div style={{borderTop:`1.5px dashed ${T.border}`,margin:"0 22px"}}/>
            <div style={{padding:"16px 22px 20px"}}>
              <p style={{fontSize:11,fontWeight:600,color:T.text3,textTransform:"uppercase",letterSpacing:"0.7px",marginBottom:12}}>Payout destination</p>
              {o.method==="bank"?(
                <div style={{display:"flex",alignItems:"center",gap:12}}><div style={{width:38,height:38,borderRadius:10,background:T.blueLight,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ico.bank /></div><div><p style={{fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:700,color:T.text}}>{o.bank.name}</p><p style={{fontSize:12,color:T.text2,marginTop:1}}>{o.bank.bank}</p><p style={{fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:600,color:T.text,marginTop:1,letterSpacing:"0.4px"}}>{o.bank.number}</p></div></div>
              ):(
                <div style={{display:"flex",alignItems:"center",gap:12}}><div style={{width:38,height:38,borderRadius:10,background:T.greenLight,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ico.wallet /></div><div><p style={{fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:700,color:T.text}}>NGN Wallet</p><p style={{fontSize:12,color:T.text2,marginTop:1}}>Credited instantly on confirmation</p></div></div>
              )}
            </div>
          </div>
          <div style={{background:T.white,border:`1.5px solid ${T.border}`,borderRadius:14,padding:"14px 16px",display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <div style={{width:34,height:34,borderRadius:10,background:T.blueLight,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.blue} strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></div>
            <div style={{flex:1,minWidth:0}}><p style={{fontSize:11,color:T.text3,marginBottom:2}}>Wallet address</p><p style={{fontFamily:"'Sora',sans-serif",fontSize:11,fontWeight:600,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{brokerAddress}</p></div>
          </div>
          <div style={{marginTop:"auto",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}><span style={{fontSize:12,fontWeight:600,color:T.text2}}>Your transaction is secure</span><span style={{display:"flex",alignItems:"center",gap:5,fontSize:12,fontWeight:500,color:T.mintGreen}}><Ico.shield /> Protected by Cheeseball</span></div>
        </div>
      </div>
    </>
  );
}


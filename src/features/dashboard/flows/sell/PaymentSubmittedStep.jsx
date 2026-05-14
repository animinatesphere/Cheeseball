import { useState } from "react";

const T = {
  blue:"#1A6FFF",blueDark:"#1259D9",blueLight:"#EEF3FF",
  text:"#0A0F1E",text2:"#6B7A99",text3:"#A8B4CC",
  border:"#E8EEFF",surface:"#F7F9FF",white:"#FFFFFF",
  green:"#00C48C",greenLight:"#E6FAF4",greenText:"#00966B",
  mintGreen:"#4ADE80",orange:"#F59E0B",orangeLight:"#FFFBEB",
};

const fmtNGN  = (n) => "₦"+Number(n).toLocaleString("en-NG",{minimumFractionDigits:2,maximumFractionDigits:2});
const fmtTime = (d) => d.toLocaleTimeString("en-NG",{hour:"2-digit",minute:"2-digit"});
const fmtDate = (d) => d.toLocaleDateString("en-NG",{day:"numeric",month:"short",year:"numeric"});

const STEPS = [
  {key:"submitted",label:"Payment submitted",sub:"We received your confirmation"},
  {key:"reviewing",label:"Pending review",sub:"Admin is verifying your payment"},
  {key:"processing",label:"Processing payout",sub:"Sending funds to your account"},
  {key:"completed",label:"Completed",sub:"Funds delivered successfully"},
];

const Ico = {
  shield:()=><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.mintGreen} strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  check:(c)=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.8" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  bank:()=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.blue} strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="10" width="18" height="11" rx="1"/><path d="M3 10l9-7 9 7"/><line x1="9" y1="21" x2="9" y2="10"/><line x1="15" y1="21" x2="15" y2="10"/></svg>,
  wallet:()=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.green} strokeWidth="1.8" strokeLinecap="round"><path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4"/><circle cx="17" cy="12" r="1" fill={T.green}/></svg>,
  home:()=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  copy:()=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.text2} strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  info:()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.blue} strokeWidth="2" strokeLinecap="round" style={{flexShrink:0}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  support:()=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
};

export default function PaymentSubmittedStep({ order, onGoHome, onContactSupport }) {
  const [copied,setCopied] = useState(false);
  const o = order;
  const txRef = o.txRef || "CHB-2024-"+String(Date.now()).slice(-5);
  const submittedAt = o.submittedAt || new Date();
  const network = o.coin.name === "Ethereum" ? "ERC-20" : o.coin.name === "BNB" ? "BEP-20" : o.coin.name;

  const copyRef = () => { navigator.clipboard.writeText(txRef).catch(()=>{}); setCopied(true); setTimeout(()=>setCopied(false),2000); };

  const activeStep = 1;

  return (
    <>
      <style>{`
        .btn-ghost5:hover{background:${T.blueLight}!important;color:${T.blue}!important;}
        .btn-primary5:hover{background:${T.blueDark}!important;}
        .btn-primary5:active{transform:scale(0.985)!important;}
        .copy-ref5:hover{background:${T.surface}!important;}
        @keyframes pulse5{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.6;transform:scale(0.92)}}
        @keyframes ripple5{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2.2);opacity:0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .pulse-dot5{animation:pulse5 1.8s ease-in-out infinite}
        .ripple5{animation:ripple5 1.8s ease-out infinite}
        .fadein{animation:fadeUp 0.35s ease forwards}
        @media(max-width:900px){
          .ps-body{grid-template-columns:1fr!important;}
          .ps-body > div { min-width: 0 !important; }
          .ps-topbar{padding:0 24px!important;}
        }
        @media(max-width:480px){
          .ps-body{padding:24px 16px 40px!important;}
          .ps-topbar{padding:0 16px!important;}
          .ps-footer{padding:14px 16px!important;}
          .ps-hero h1{font-size:22px!important;}
          .ps-hero{padding:28px 20px 24px!important;}
          .ps-actions{flex-direction:column!important;}
          .ps-receive{font-size:28px!important;}
        }
        @media(max-width:380px){
          .ps-body{padding:16px 12px 30px!important;}
          .ps-receive{font-size:24px!important;}
        }
      `}</style>

      <div style={{minHeight:"100vh",background:T.surface,fontFamily:"'DM Sans',sans-serif",color:T.text,overflowX:"hidden",maxWidth:"100vw"}}>

        {/* Top bar */}
        <div className="ps-topbar" style={{background:T.white,borderBottom:`1px solid ${T.border}`,padding:"0 48px",height:60,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <nav style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
            {["Dashboard","Sell Crypto","Payout Method","Confirm","Send Crypto"].map((c,i)=>(
              <span key={i} style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:13,color:T.text2,fontWeight:500,cursor:"pointer"}}>{c}</span><span style={{color:T.text3,fontSize:12}}>›</span></span>
            ))}
            <span style={{fontSize:13,fontWeight:600,color:T.blue}}>Payment Submitted</span>
          </nav>
        </div>

        {/* Body */}
        <div className="ps-body" style={{maxWidth:"100%",margin:"0 auto",padding:"48px 24px 80px",display:"grid",gridTemplateColumns:"1fr 360px",gap:28,alignItems:"start"}}>

          {/* LEFT */}
          <div style={{display:"flex",flexDirection:"column",gap:16}}>

            {/* Success hero */}
            <div className="fadein ps-hero" style={{background:T.white,border:`1.5px solid ${T.border}`,borderRadius:24,padding:"36px 36px 32px",textAlign:"center"}}>
              <div style={{position:"relative",width:80,height:80,margin:"0 auto 24px"}}>
                <div className="ripple5" style={{position:"absolute",inset:0,borderRadius:"50%",background:T.blueLight}}/>
                <div style={{position:"relative",width:80,height:80,borderRadius:"50%",background:T.blue,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </div>
              </div>
              <h1 style={{fontFamily:"'Sora',sans-serif",fontSize:26,fontWeight:700,color:T.text,letterSpacing:"-0.5px",marginBottom:8}}>Payment Submitted</h1>
              <p style={{fontSize:15,color:T.text2,lineHeight:1.6,maxWidth:420,margin:"0 auto 24px"}}>We are checking your {o.coin.sym} payment. This usually takes a few minutes.</p>
              <div style={{display:"inline-flex",alignItems:"center",gap:8,background:T.orangeLight,border:"1.5px solid #FDE68A",borderRadius:30,padding:"8px 18px"}}>
                <div className="pulse-dot5" style={{width:8,height:8,borderRadius:"50%",background:T.orange,flexShrink:0}}/>
                <span style={{fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:700,color:"#92400E"}}>Pending Review</span>
              </div>
              <div style={{marginTop:20,display:"flex",justifyContent:"center"}}>
                <button className="copy-ref5" onClick={copyRef} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",border:`1px solid ${T.border}`,borderRadius:10,background:T.white,cursor:"pointer",transition:"background 0.15s"}}>
                  <span style={{fontSize:12,color:T.text2}}>Ref:</span>
                  <span style={{fontFamily:"'Sora',sans-serif",fontSize:12,fontWeight:700,color:T.text}}>{txRef}</span>
                  {copied?Ico.check(T.green):<Ico.copy />}
                </button>
              </div>
            </div>

            {/* Timeline */}
            <div style={{background:T.white,border:`1.5px solid ${T.border}`,borderRadius:20,padding:"28px 32px"}}>
              <p style={{fontSize:11,fontWeight:600,color:T.text3,textTransform:"uppercase",letterSpacing:"0.8px",marginBottom:24}}>Transaction progress</p>
              <div style={{display:"flex",flexDirection:"column",gap:0}}>
                {STEPS.map((step,i)=>{
                  const done=i<activeStep, active=i===activeStep, pending=i>activeStep, last=i===STEPS.length-1;
                  return (
                    <div key={step.key} style={{display:"flex",gap:16}}>
                      <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                        <div style={{width:32,height:32,borderRadius:"50%",flexShrink:0,background:done?T.green:active?T.blue:T.surface,border:`2px solid ${done?T.green:active?T.blue:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.3s"}}>
                          {done?Ico.check("#fff"):active?<div className="pulse-dot5" style={{width:10,height:10,borderRadius:"50%",background:"#fff"}}/>:<div style={{width:8,height:8,borderRadius:"50%",background:T.border}}/>}
                        </div>
                        {!last&&<div style={{width:2,height:36,background:done?T.green:T.border,marginTop:2,transition:"background 0.3s",borderRadius:2}}/>}
                      </div>
                      <div style={{paddingBottom:last?0:36,paddingTop:4}}>
                        <p style={{fontFamily:"'Sora',sans-serif",fontSize:14,fontWeight:700,color:pending?T.text3:T.text,marginBottom:2}}>
                          {step.label}
                          {active&&<span style={{marginLeft:10,fontSize:11,fontWeight:600,color:T.blue,background:T.blueLight,padding:"2px 8px",borderRadius:20}}>Current</span>}
                        </p>
                        <p style={{fontSize:13,color:pending?T.text3:T.text2}}>{step.sub}</p>
                        {i===0&&<p style={{fontSize:11,color:T.text3,marginTop:3}}>{fmtTime(submittedAt)} · {fmtDate(submittedAt)}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Info */}
            <div style={{display:"flex",alignItems:"flex-start",gap:12,background:T.blueLight,border:`1px solid ${T.blueDark}22`,borderRadius:14,padding:"14px 18px"}}>
              <Ico.info />
              <p style={{fontSize:13,color:"#2A4A9A",lineHeight:1.6}}>Our team manually verifies all crypto payments. Once confirmed, your payout of <strong>{fmtNGN(o.netNGN)}</strong> will be sent immediately. You'll be notified when it's done.</p>
            </div>

            {/* Buttons */}
            <div className="ps-actions" style={{display:"flex",gap:12}}>
              <button className="btn-primary5" onClick={onGoHome} style={{flex:1,padding:"16px",borderRadius:14,border:"none",fontFamily:"'Sora',sans-serif",fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:T.blue,color:"#fff",transition:"all 0.2s"}}><Ico.home /> Go to Dashboard</button>
              <button className="btn-ghost5" onClick={onContactSupport} style={{flex:1,padding:"16px",borderRadius:14,border:`1.5px solid ${T.border}`,fontFamily:"'Sora',sans-serif",fontSize:14,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:T.white,color:T.text2,transition:"all 0.2s"}}><Ico.support /> Contact Support</button>
            </div>
          </div>

          {/* RIGHT */}
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{background:T.blue,borderRadius:20,padding:"26px 24px"}}>
              <p style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.6)",textTransform:"uppercase",letterSpacing:"0.8px",marginBottom:12}}>You will receive</p>
              <p className="ps-receive" style={{fontFamily:"'Sora',sans-serif",fontSize:34,fontWeight:700,color:"#fff",letterSpacing:"-1.2px",lineHeight:1,wordBreak:"break-all"}}>{fmtNGN(o.netNGN)}</p>
              <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginTop:8}}>After 1% system fee</p>
            </div>

            <div style={{background:T.white,border:`1.5px solid ${T.border}`,borderRadius:20,overflow:"hidden"}}>
              <div style={{padding:"16px 20px",background:T.surface,borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:38,height:38,borderRadius:"50%",background:o.coin.color,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:700,color:"#fff",flexShrink:0}}>{o.coin.icon}</div>
                <div><p style={{fontFamily:"'Sora',sans-serif",fontSize:14,fontWeight:700,color:T.text}}>{o.amount} {o.coin.sym}</p><p style={{fontSize:12,color:T.text2,marginTop:1}}>{network} network</p></div>
                <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:5,background:T.orangeLight,borderRadius:20,padding:"4px 10px"}}><div style={{width:6,height:6,borderRadius:"50%",background:T.orange}}/><span style={{fontSize:11,fontWeight:600,color:"#92400E"}}>Pending</span></div>
              </div>
              <div style={{padding:"4px 20px"}}>
                {[{label:"Status",value:"Pending review",highlight:"orange"},{label:"Reference",value:txRef},{label:"Submitted",value:`${fmtTime(submittedAt)}, ${fmtDate(submittedAt)}`}].map(({label,value,highlight},i,arr)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:i===arr.length-1?"none":`1px solid ${T.border}`}}><span style={{fontSize:12,color:T.text2}}>{label}</span><span style={{fontFamily:"'Sora',sans-serif",fontSize:12,fontWeight:700,color:highlight==="orange"?"#92400E":T.text}}>{value}</span></div>
                ))}
              </div>
              <div style={{borderTop:`1.5px dashed ${T.border}`,margin:"0 20px"}}/>
              <div style={{padding:"14px 20px 18px"}}>
                <p style={{fontSize:11,fontWeight:600,color:T.text3,textTransform:"uppercase",letterSpacing:"0.7px",marginBottom:12}}>Payout destination</p>
                {o.method==="bank"?(
                  <div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:36,height:36,borderRadius:10,background:T.blueLight,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ico.bank /></div><div><p style={{fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:700,color:T.text}}>{o.bank.name}</p><p style={{fontSize:12,color:T.text2,marginTop:1}}>{o.bank.bank} · {o.bank.number}</p></div></div>
                ):(
                  <div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:36,height:36,borderRadius:10,background:T.greenLight,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ico.wallet /></div><div><p style={{fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:700,color:T.text}}>NGN Wallet</p><p style={{fontSize:12,color:T.text2,marginTop:1}}>Instant credit on confirmation</p></div></div>
                )}
              </div>
            </div>

            <div style={{background:T.white,border:`1.5px solid ${T.border}`,borderRadius:14,padding:"14px 18px",display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:36,height:36,borderRadius:10,background:T.surface,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:T.text2}}><Ico.support /></div>
              <div><p style={{fontFamily:"'Sora',sans-serif",fontSize:12,fontWeight:700,color:T.text,marginBottom:2}}>Need help?</p><p style={{fontSize:12,color:T.text2,lineHeight:1.4}}>Contact support if your payment isn't confirmed within 30 minutes.</p></div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="ps-footer" style={{borderTop:`1px solid ${T.border}`,padding:"18px 48px",display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:T.white}}>
          <Ico.shield />
          <span style={{fontSize:12,color:T.text2,fontWeight:500}}>Your transaction is secure · </span>
          <span style={{fontSize:12,fontWeight:600,color:T.mintGreen}}>Protected by Cheeseball</span>
        </div>
      </div>
    </>
  );
}


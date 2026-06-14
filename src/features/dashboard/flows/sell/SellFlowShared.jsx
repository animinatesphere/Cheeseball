import React from "react";
import { Loader2 } from "lucide-react";

export const ASSETS = [
  { id:"bitcoin", symbol:"BTC", name:"Bitcoin", network:"Bitcoin", price:108280523, change:2.14, icon:"₿", color:"#F7931A", bg:"#FEF3E2" },
  { id:"ethereum", symbol:"ETH", name:"Ethereum", network:"ERC20", price:4236420, change:-0.87, icon:"Ξ", color:"#627EEA", bg:"#EEEFFE" },
  { id:"tether", symbol:"USDT", name:"Tether", network:"TRC20", price:1412, change:0.01, icon:"₮", color:"#26A17B", bg:"#E6F7F2" },
  { id:"usd-coin", symbol:"USDC", name:"USD Coin", network:"ERC20", price:1412, change:0.00, icon:"$", color:"#2775CA", bg:"#E6F0FA" },
  { id:"bnb", symbol:"BNB", name:"BNB", network:"BEP20", price:847284, change:1.33, icon:"⬡", color:"#F0B90B", bg:"#FEF8E6" },
  { id:"solana", symbol:"SOL", name:"Solana", network:"Solana", price:211821, change:4.56, icon:"◎", color:"#9945FF", bg:"#F1E9FF" },
  { id:"ripple", symbol:"XRP", name:"XRP", network:"Ripple", price:847, change:0.5, icon:"✕", color:"#23292F", bg:"#E9EBEF" },
  { id:"tron", symbol:"TRX", name:"TRON", network:"TRC20", price:169, change:-1.2, icon:"▼", color:"#FF0013", bg:"#FFE5E7" },
  { id:"litecoin", symbol:"LTC", name:"Litecoin", network:"Litecoin", price:115000, change:2.1, icon:"Ł", color:"#345D9D", bg:"#EAF0F7" },
  { id:"dogecoin", symbol:"DOGE", name:"Dogecoin", network:"Dogecoin", price:250, change:5.5, icon:"Ð", color:"#C2A633", bg:"#F9F6EB" },
  { id:"bitcoin-cash", symbol:"BCH", name:"Bitcoin Cash", network:"Bitcoin Cash", price:650000, change:1.1, icon:"Ƀ", color:"#8DC351", bg:"#F3F9EC" },
  { id:"cardano", symbol:"ADA", name:"Cardano", network:"Cardano", price:850, change:0.8, icon:"₳", color:"#0033AD", bg:"#E5EBF6" },
  { id:"polygon", symbol:"MATIC", name:"Polygon", network:"Polygon", price:1200, change:-0.4, icon:"M", color:"#8247E5", bg:"#F2EDFC" },
  { id:"polkadot", symbol:"DOT", name:"Polkadot", network:"Polkadot", price:10500, change:1.8, icon:"P", color:"#E6007A", bg:"#FCE5F1" },
  { id:"chainlink", symbol:"LINK", name:"Chainlink", network:"ERC20", price:25000, change:3.2, icon:"L", color:"#2A5ADA", bg:"#EAEFFE" },
  { id:"avalanche", symbol:"AVAX", name:"Avalanche", network:"Avalanche", price:52000, change:-1.5, icon:"A", color:"#E84142", bg:"#FCECEC" },
  { id:"uniswap", symbol:"UNI", name:"Uniswap", network:"ERC20", price:14000, change:2.4, icon:"U", color:"#FF007A", bg:"#FFE5F1" },
  { id:"stellar", symbol:"XLM", name:"Stellar", network:"Stellar", price:155, change:0.2, icon:"*", color:"#14B6E7", bg:"#E7F7FD" },
  { id:"cosmos", symbol:"ATOM", name:"Cosmos", network:"Cosmos", price:12500, change:1.1, icon:"C", color:"#2E3148", bg:"#EAEAEF" },
  { id:"ethereum-classic", symbol:"ETC", name:"Ethereum Classic", network:"Ethereum Classic", price:38000, change:-0.9, icon:"⟠", color:"#328332", bg:"#EAF2EA" },
  { id:"toncoin", symbol:"TON", name:"Toncoin", network:"TON", price:9800, change:4.1, icon:"T", color:"#0098EA", bg:"#E5F4FD" },
];

export const NETWORKS = {
  BTC:["Bitcoin"],
  ETH:["ERC20"],
  USDT:["TRC20"],
  USDC:["ERC20"],
  BNB:["BEP20"],
  SOL:["Solana"],
  XRP:["Ripple"],
  TRX:["TRC20"],
  LTC:["Litecoin"],
  DOGE:["Dogecoin"],
  BCH:["Bitcoin Cash"],
  ADA:["Cardano"],
  MATIC:["Polygon"],
  DOT:["Polkadot"],
  LINK:["ERC20"],
  AVAX:["Avalanche"],
  UNI:["ERC20"],
  XLM:["Stellar"],
  ATOM:["Cosmos"],
  ETC:["Ethereum Classic"],
  TON:["TON"],
};

export const PRICE_EXPIRY_TIME = 900;

export const T = {
  blue:"#1A6FFF",blueDark:"#1259D9",blueLight:"#EEF3FF",
  text:"#0A0F1E",text2:"#6B7A99",text3:"#A8B4CC",border:"#E8EEFF",
  surface:"#F7F9FF",white:"#FFFFFF",green:"#00C48C",greenLight:"#E6FAF4",
  greenText:"#00966B",mintGreen:"#4ADE80",orange:"#F59E0B",orangeLight:"#FFFBEB",
  red:"#EF4444",redLight:"#FEF2F2",
};

export const Ico = {
  arrow:  ()=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  arrowDn:()=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1A6FFF" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>,
  shield: ()=><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  check:  (c)=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={typeof c==="string"?c:"#00C48C"} strokeWidth="2.5" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  clock:  (c)=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={typeof c==="string"?c:"#F59E0B"} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  info:   ()=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1A6FFF" strokeWidth="2" strokeLinecap="round" style={{flexShrink:0}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  lock:   ()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  search: ()=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A8B4CC" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  copy:   ()=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  wallet: ()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4"/><circle cx="17" cy="12" r="1" fill="currentColor"/></svg>,
  bank:   ()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="10" width="18" height="11" rx="1"/><path d="M3 10l9-7 9 7"/><line x1="9" y1="21" x2="9" y2="10"/><line x1="15" y1="21" x2="15" y2="10"/></svg>,
  card:   ()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  upload: ()=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
  refresh:()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  chevDn: ()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A8B4CC" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>,
  external: ()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
};

export const formatNGN = v=>new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",minimumFractionDigits:0}).format(Number(String(v).replace(/,/g, '')));
export const truncateAddress = a=>a?`${a.slice(0,6)}...${a.slice(-4)}`:"";
export const formatTime = s=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

export const SecureFooter = ()=>(
  <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,marginTop:"auto",paddingTop:24}}>
    <span style={{fontSize:12,fontWeight:600,color:T.text2,fontFamily:"'DM Sans',sans-serif"}}>Your transaction is secure</span>
    <span style={{display:"flex",alignItems:"center",gap:5,fontSize:12,fontWeight:500,color:T.mintGreen,fontFamily:"'DM Sans',sans-serif"}}><Ico.shield/> Protected by Cheeseball</span>
  </div>
);

export const CTA = ({onClick,disabled,loading,children,style={}})=>(
  <button onClick={onClick} disabled={disabled || loading} className={disabled || loading ?"":"ctabtn"}
    style={{width:"100%",padding:"17px",borderRadius:14,border:"none",fontFamily:"'Sora',sans-serif",fontSize:15,fontWeight:700,
      cursor:disabled || loading ?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10,
      transition:"all 0.2s",background:disabled || loading ?"#E8EEFF":T.blue,color:disabled || loading ?"#A8B4CC":"#fff",...style}}>
    {loading && <Loader2 className="animate-spin" size={18} />}
    {children}
  </button>
);

export const GhostBtn = ({onClick,children,style={}})=>(
  <button onClick={onClick} className="ghostbtn"
    style={{padding:"17px 24px",borderRadius:14,border:`1.5px solid ${T.border}`,background:T.white,
      color:T.text2,fontSize:14,fontWeight:600,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",transition:"all 0.2s",...style}}>
    {children}
  </button>
);

export const RightPanel = ({payAmount,receiveAmount,selectedAsset,expiryTime,step,rate})=>{
  const isUrgent = expiryTime<=60;
  
  const numPayAmount = Number((payAmount || "").toString().replace(/,/g, ""));
  const numReceiveAmount = Number((receiveAmount || "").toString().replace(/,/g, ""));

  const rows=[
    ["You sell", numPayAmount > 0 ? `${numPayAmount} ${selectedAsset.symbol}` : "—"],
    ["You receive", numReceiveAmount > 0 ? formatNGN(numReceiveAmount) : "—"],
    ["Exchange Rate", rate ? `${formatNGN(rate)} / ${selectedAsset.symbol}` : "—"],
    ["Asset", `${selectedAsset.name} (${selectedAsset.symbol})`],
    ["Network", selectedAsset.network],
  ];

  return(
    <div className="rightpanel" style={{padding:"44px 28px 60px",background:T.surface,display:"flex",flexDirection:"column",minHeight:"100vh"}}>
      <p style={{fontSize:11,fontWeight:600,color:T.text3,textTransform:"uppercase",letterSpacing:"0.8px",marginBottom:16,fontFamily:"'DM Sans',sans-serif"}}>Order Summary</p>
      
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <div style={{background:T.white,border:`1.5px solid ${T.border}`,borderRadius:16,padding:"18px 20px"}}>
          <p style={{fontSize:11,fontWeight:600,color:T.text3,textTransform:"uppercase",letterSpacing:"0.7px",marginBottom:12,fontFamily:"'DM Sans',sans-serif"}}>You are selling</p>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:40,height:40,borderRadius:"50%",background:selectedAsset.color,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Sora',sans-serif",fontSize:14,fontWeight:700,color:"#fff",flexShrink:0}}>{selectedAsset.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 18, fontWeight: 700, color: numPayAmount > 0 ? T.text : T.text3, letterSpacing: "-0.8px", lineHeight: 1, overflowWrap: "break-word" }}>{numPayAmount > 0 ? `${numPayAmount} ${selectedAsset.symbol}` : `0.00 ${selectedAsset.symbol}`}</p>
              <p style={{ fontSize: 11, color: T.text2, marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>{selectedAsset.name}</p>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", margin: "-15px 0" }}><div style={{ width: 24, height: 24, borderRadius: "50%", background: T.blueLight, display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${T.surface}`, zIndex: 2 }}><Ico.arrowDn /></div></div>

        <div style={{ background: T.blue, borderRadius: 16, padding: "18px 20px" }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 12, fontFamily: "'DM Sans', sans-serif" }}>You will receive</p>
          <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 24, fontWeight: 700, color: numReceiveAmount > 0 ? "#fff" : "rgba(255,255,255,0.3)", letterSpacing: "-1px", lineHeight: 1, overflowWrap: "break-word" }}>{numReceiveAmount > 0 ? formatNGN(numReceiveAmount) : "₦0.00"}</p>
        </div>
      </div>

      <div style={{background:T.white,border:`1.5px solid ${T.border}`,borderRadius:16,padding:"6px 18px",marginTop:14,marginBottom:14}}>
        {rows.map(([label,value],i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:i<rows.length-1?`1px solid ${T.border}`:"none"}}>
            <span style={{fontSize:12,color:T.text2,fontFamily:"'DM Sans',sans-serif"}}>{label}</span>
            <span style={{fontFamily:"'Sora',sans-serif",fontSize:12,fontWeight:700,color:T.text,textAlign:"right",maxWidth:"60%",wordBreak:"break-all"}}>{value}</span>
          </div>
        ))}
      </div>

      {step>=2&&expiryTime>0&&(
        <div className="fadein" style={{background:isUrgent?T.orangeLight:T.greenLight,border:`1px solid ${isUrgent?"#FDE68A":"#A7F3D0"}`,borderRadius:12,padding:"10px 16px",marginBottom:14,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>{Ico.clock(isUrgent?T.orange:T.green)}<span style={{fontSize:12,color:isUrgent?"#92400E":T.greenText,fontWeight:500,fontFamily:"'DM Sans',sans-serif"}}>{isUrgent?"Rate expiring soon":"Rate locked"}</span></div>
          <span style={{fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:700,color:isUrgent?"#92400E":T.greenText}}>{formatTime(expiryTime)}</span>
        </div>
      )}
      <SecureFooter/>
    </div>
  );
};

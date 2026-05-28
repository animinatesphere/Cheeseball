import React, { useEffect, useState } from "react";

/* ─── Tokens ─────────────────────────────────────────────────── */
const T = {
  blue:       "#1A6FFF",
  blueLight:  "#EEF3FF",
  text:       "#0A0F1E",
  text2:      "#6B7A99",
  text3:      "#A8B4CC",
  border:     "#E8EEFF",
  white:      "#FFFFFF",
  green:      "#00C48C",
  greenLight: "#E6FAF4",
  greenText:  "#00966B",
  red:        "#EF4444",
  redLight:   "#FEF2F2",
  redText:    "#B91C1C",
};

const Toast = ({ message, type = "info", duration = 4000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const entranceTimer = setTimeout(() => setIsVisible(true), 10);
    const closeTimer = setTimeout(() => handleClose(), duration);
    return () => { clearTimeout(entranceTimer); clearTimeout(closeTimer); };
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 400); // Wait for slide-out animation
  };

  const config = {
    success: { 
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />, 
      color: T.green, bg: T.greenLight, title: "Success"
    },
    error: { 
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />, 
      color: T.red, bg: T.redLight, title: "Error"
    },
    info: { 
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />, 
      color: T.blue, bg: T.blueLight, title: "Information"
    },
    loading: {
      isLoader: true,
      color: T.blue, bg: T.blueLight, title: "Processing"
    }
  };

  const style = config[type] || config.info;

  return (
    <>
      <style>{`
        @keyframes toastSlideIn {
          0% { opacity: 0; transform: translateX(40px) scale(0.95); filter: blur(4px); }
          100% { opacity: 1; transform: translateX(0) scale(1); filter: blur(0); }
        }
        @keyframes toastSlideOut {
          0% { opacity: 1; transform: translateX(0) scale(1); filter: blur(0); }
          100% { opacity: 0; transform: translateX(40px) scale(0.95); filter: blur(4px); }
        }
        @keyframes toastProgress {
          0% { width: 100%; }
          100% { width: 0%; }
        }
        @keyframes toastSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      
      <div
        style={{
          position: "fixed",
          top: "32px",
          right: "32px",
          zIndex: 9999,
          animation: isVisible 
            ? "toastSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards" 
            : "toastSlideOut 0.4s cubic-bezier(0.7, 0, 0.84, 0) forwards",
          pointerEvents: isVisible ? "auto" : "none",
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderRadius: "20px",
            border: "1px solid rgba(255, 255, 255, 0.6)",
            boxShadow: "0 20px 40px -12px rgba(10, 15, 30, 0.15), 0 0 0 1px rgba(10, 15, 30, 0.05)",
            padding: "16px 20px 16px 16px",
            display: "flex",
            alignItems: "flex-start",
            gap: "16px",
            width: "360px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Glowing Progress Bar */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "3px", background: "rgba(0,0,0,0.03)" }}>
            <div 
              style={{ 
                height: "100%", 
                background: style.color, 
                boxShadow: `0 0 8px ${style.color}`,
                animation: `toastProgress ${duration}ms linear forwards` 
              }} 
            />
          </div>

          {/* Icon Container with glowing effect */}
          <div style={{ position: "relative", flexShrink: 0 }}>
             <div style={{ 
               position: "absolute", inset: 0, background: style.color, filter: "blur(10px)", opacity: 0.3, borderRadius: "50%" 
             }} />
             <div style={{ 
               width: "42px", height: "42px", borderRadius: "14px", background: style.bg, 
               display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
               border: `1px solid ${style.color}20`
             }}>
               {style.isLoader ? (
                 <div style={{ width: "20px", height: "20px", border: `2.5px solid ${style.color}40`, borderTopColor: style.color, borderRadius: "50%", animation: "toastSpin 0.8s linear infinite" }} />
               ) : (
                 <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={style.color}>
                   {style.icon}
                 </svg>
               )}
             </div>
          </div>

          {/* Text Content */}
          <div style={{ flex: 1, paddingTop: "2px" }}>
            <p style={{ fontFamily: "'Sora', sans-serif", fontSize: "15px", fontWeight: 700, color: T.text, lineHeight: 1.2, letterSpacing: "-0.3px", marginBottom: "4px" }}>
              {style.title}
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13.5px", color: T.text2, lineHeight: 1.5 }}>
              {message}
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            style={{ 
              width: "28px", height: "28px", borderRadius: "50%", border: "none", 
              background: "rgba(10,15,30,0.03)", cursor: "pointer", color: T.text3, 
              display: "flex", alignItems: "center", justifyContent: "center", 
              transition: "all 0.2s", flexShrink: 0, marginTop: "2px"
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(10,15,30,0.08)"; e.currentTarget.style.color = T.text; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(10,15,30,0.03)"; e.currentTarget.style.color = T.text3; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default Toast;

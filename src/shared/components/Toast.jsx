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
    // Entrance
    const entranceTimer = setTimeout(() => setIsVisible(true), 10);
    
    // Auto-close
    const closeTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(entranceTimer);
      clearTimeout(closeTimer);
    };
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 400); // Wait for fade-out animation
  };

  const icons = {
    success: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.green} strokeWidth="2.5" strokeLinecap="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
    error: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.red} strokeWidth="2.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
    ),
    info: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.blue} strokeWidth="2.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>
    ),
    loading: (
      <div style={{ width: 18, height: 18, border: `2.5px solid ${T.blue}22`, borderTopColor: T.blue, borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
    ),
  };

  const bgStyles = {
    success: { bg: T.greenLight, border: T.green, text: T.greenText },
    error:   { bg: T.redLight,   border: T.red,   text: T.redText },
    info:    { bg: T.blueLight,  border: T.blue,  text: T.blue },
    loading: { bg: T.white,      border: T.border,text: T.text },
  };

  const style = bgStyles[type] || bgStyles.info;

  return (
    <>
      <style>{`
        @keyframes toastIn { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes toastOut { from { opacity: 1; transform: translateY(0) scale(1); } to { opacity: 0; transform: translateY(-10px) scale(0.95); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes progress { from { width: 100%; } to { width: 0%; } }
      `}</style>
      
      <div
        style={{
          position: "fixed",
          top: "32px",
          right: "32px",
          zIndex: 1000,
          animation: isVisible ? "toastIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards" : "toastOut 0.3s ease forwards",
          pointerEvents: isVisible ? "auto" : "none",
        }}
      >
        <div
          style={{
            background: T.white,
            borderRadius: "18px",
            border: `1.5px solid ${T.border}`,
            boxShadow: "0 12px 40px rgba(10,15,30,0.12)",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            minWidth: "320px",
            maxWidth: "400px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Progress Bar */}
          <div style={{ position: "absolute", bottom: 0, left: 0, height: "3px", background: style.bg, opacity: 0.8 }}>
             <div style={{ height: "100%", background: style.border, animation: `progress ${duration}ms linear forwards` }} />
          </div>

          {/* Icon */}
          <div style={{ width: 40, height: 40, borderRadius: "12px", background: style.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {icons[type]}
          </div>

          {/* Content */}
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "'Sora', sans-serif", fontSize: "14px", fontWeight: 700, color: T.text, lineHeight: 1.4 }}>
              {type === "success" ? "Success" : type === "error" ? "Error" : "Note"}
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: T.text2, marginTop: "2px" }}>
              {message}
            </p>
          </div>

          {/* Close */}
          <button
            onClick={handleClose}
            style={{ padding: "8px", borderRadius: "8px", border: "none", background: "none", cursor: "pointer", color: T.text3, display: "flex", transition: "all 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.04)"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default Toast;

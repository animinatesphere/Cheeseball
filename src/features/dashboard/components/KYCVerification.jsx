import { useState, useRef } from "react";
import {
  Upload, X, CheckCircle2, Clock, AlertCircle,
  Shield, RotateCcw, ChevronRight, Eye,
} from "lucide-react";

/* ─── Tokens ─────────────────────────────────────────────────── */
const T = {
  blue:        "#1A6FFF",
  blueDark:    "#1259D9",
  blueLight:   "#EEF3FF",
  text:        "#0A0F1E",
  text2:       "#6B7A99",
  text3:       "#A8B4CC",
  border:      "#E8EEFF",
  surface:     "#F7F9FF",
  white:       "#FFFFFF",
  green:       "#00C48C",
  greenLight:  "#E6FAF4",
  greenText:   "#00966B",
  mintGreen:   "#4ADE80",
  orange:      "#F59E0B",
  orangeLight: "#FFFBEB",
  orangeText:  "#92400E",
  red:         "#EF4444",
  redLight:    "#FEF2F2",
  redText:     "#B91C1C",
};

const Ico = {
  shield: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.mintGreen} strokeWidth="2" strokeLinecap="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
};

/* ─── Upload card ────────────────────────────────────────────── */
function UploadCard({ label, sub, file, onFile, onRemove, dragging, setDragging }) {
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) onFile(f);
  };

  const handleChange = (e) => {
    const f = e.target.files[0];
    if (f) onFile(f);
  };

  const preview = file ? URL.createObjectURL(file) : null;

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>{label}</p>
      <div
        onClick={() => !file && inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        style={{
          border: `1.5px dashed ${file ? T.green : dragging ? T.blue : T.border}`,
          borderRadius: 16,
          background: file ? T.greenLight : dragging ? T.blueLight : T.surface,
          minHeight: 180,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          cursor: file ? "default" : "pointer",
          transition: "all 0.18s",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {file ? (
          <>
            <img
              src={preview}
              alt="ID preview"
              style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0, opacity: 0.25 }}
            />
            <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: T.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CheckCircle2 size={20} color="#fff" />
              </div>
              <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700, color: T.greenText }}>Photo uploaded</p>
              <p style={{ fontSize: 11, color: T.text2, maxWidth: 140, textAlign: "center", lineHeight: 1.4 }}>{file.name}</p>
              <button
                onClick={e => { e.stopPropagation(); onRemove(); }}
                style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, color: T.redText, background: T.redLight, border: "none", borderRadius: 8, padding: "5px 10px", cursor: "pointer", marginTop: 4 }}
              >
                <X size={11} /> Remove
              </button>
            </div>
          </>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: 24, textAlign: "center" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: dragging ? T.blue : T.white, border: `1.5px solid ${dragging ? T.blue : T.border}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.18s" }}>
              <Upload size={18} color={dragging ? "#fff" : T.text2} />
            </div>
            <div>
              <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 3 }}>
                {dragging ? "Drop here" : "Click or drag to upload"}
              </p>
              <p style={{ fontSize: 12, color: T.text3, lineHeight: 1.5 }}>{sub}</p>
            </div>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleChange} />
      </div>
    </div>
  );
}

/* ─── Status screens ─────────────────────────────────────────── */

function InReview() {
  return (
    <div style={{ textAlign: "center", padding: "48px 0" }}>
      <div style={{ position: "relative", width: 80, height: 80, margin: "0 auto 24px" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `3px solid ${T.orange}`, opacity: 0.25, animation: "pulse 2s ease-in-out infinite" }} />
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: T.orangeLight, border: `2px solid #FDE68A`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Clock size={30} color={T.orange} />
        </div>
      </div>
      <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 700, color: T.text, letterSpacing: "-0.4px", marginBottom: 10 }}>
        Under Review
      </h2>
      <p style={{ fontSize: 14, color: T.text2, lineHeight: 1.7, maxWidth: 360, margin: "0 auto 28px" }}>
        We've received your ID documents and our team is reviewing them. This usually takes a few hours.
      </p>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: T.orangeLight, border: `1px solid #FDE68A`, borderRadius: 12, padding: "12px 20px" }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.orange, animation: "blink 1.8s ease-in-out infinite" }} />
        <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700, color: T.orangeText }}>Pending Review</span>
      </div>

      <div style={{ marginTop: 32, padding: "16px 20px", background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 16, maxWidth: 400, margin: "32px auto 0", textAlign: "left" }}>
        {[
          { label: "Documents submitted", done: true  },
          { label: "Identity check",      done: false },
          { label: "Verification complete",done: false },
        ].map((step, i, arr) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i === arr.length - 1 ? "none" : `1px solid ${T.border}` }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: step.done ? T.green : T.surface, border: `1.5px solid ${step.done ? T.green : T.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {step.done
                ? <CheckCircle2 size={13} color="#fff" />
                : <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.border }} />
              }
            </div>
            <span style={{ fontSize: 13, fontWeight: step.done ? 600 : 500, color: step.done ? T.text : T.text3 }}>{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Verified() {
  return (
    <div style={{ textAlign: "center", padding: "48px 0" }}>
      <div style={{ position: "relative", width: 88, height: 88, margin: "0 auto 24px" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `3px solid ${T.green}`, opacity: 0.3, animation: "ripple 1.8s ease-out infinite" }} />
        <div style={{ width: 88, height: 88, borderRadius: "50%", background: T.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CheckCircle2 size={36} color="#fff" strokeWidth={2.5} />
        </div>
      </div>
      <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 700, color: T.text, letterSpacing: "-0.4px", marginBottom: 10 }}>
        Identity Verified
      </h2>
      <p style={{ fontSize: 14, color: T.text2, lineHeight: 1.7, maxWidth: 340, margin: "0 auto 24px" }}>
        Your account is fully verified. You now have access to all features on Cheeseball.
      </p>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: T.greenLight, border: `1px solid #A7F3D0`, borderRadius: 12, padding: "12px 20px" }}>
        <Shield size={15} color={T.green} />
        <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700, color: T.greenText }}>Verified Account</span>
      </div>
    </div>
  );
}

function Rejected({ reason, onResubmit }) {
  return (
    <div style={{ textAlign: "center", padding: "48px 0" }}>
      <div style={{ width: 80, height: 80, borderRadius: "50%", background: T.redLight, border: `2px solid #FECACA`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
        <AlertCircle size={32} color={T.red} />
      </div>
      <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 700, color: T.text, letterSpacing: "-0.4px", marginBottom: 10 }}>
        Verification Unsuccessful
      </h2>
      <p style={{ fontSize: 14, color: T.text2, lineHeight: 1.7, maxWidth: 360, margin: "0 auto 20px" }}>
        We were unable to verify your identity. Please review the reason below and resubmit.
      </p>

      {reason && (
        <div style={{ background: T.redLight, border: `1.5px solid #FECACA`, borderRadius: 14, padding: "16px 20px", maxWidth: 420, margin: "0 auto 28px", textAlign: "left" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: T.redText, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 6 }}>Reason</p>
          <p style={{ fontSize: 13, color: T.redText, lineHeight: 1.6 }}>{reason}</p>
        </div>
      )}

      <button
        onClick={onResubmit}
        style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 14, border: "none", background: T.blue, color: "#fff", fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "background 0.18s" }}
        onMouseEnter={e => e.currentTarget.style.background = T.blueDark}
        onMouseLeave={e => e.currentTarget.style.background = T.blue}
      >
        <RotateCcw size={15} /> Resubmit Documents
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
export default function KYCVerification({ onNavigate, kycStatus: initialStatus = "unverified", rejectionReason = "The ID image was blurry or unreadable. Please upload a clear, well-lit photo of your government-issued ID." }) {

  /* In production, kycStatus comes from your backend/API */
  const [kycStatus, setKycStatus] = useState(initialStatus);
  const [frontFile,  setFrontFile]  = useState(null);
  const [backFile,   setBackFile]   = useState(null);
  const [draggingFront, setDraggingFront] = useState(false);
  const [draggingBack,  setDraggingBack]  = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = frontFile && backFile && !submitting;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitting(true);
    /**
     * TODO: Upload to Cloudinary, get URLs, send to backend
     * const formData = new FormData();
     * formData.append("front", frontFile);
     * formData.append("back", backFile);
     * const res = await uploadToCloudinary(formData);
     * await api.submitKYC({ frontUrl: res.frontUrl, backUrl: res.backUrl });
     */
    setTimeout(() => {
      setSubmitting(false);
      setKycStatus("in_review");
    }, 1800);
  };

  const showUploadForm = kycStatus === "unverified" || (kycStatus === "rejected" && false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes pulse{0%,100%{opacity:0.3}50%{opacity:0.7}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes ripple{0%{transform:scale(0.85);opacity:0.5}100%{transform:scale(2.2);opacity:0}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .submit-btn:hover{background:${T.blueDark}!important;}
        .submit-btn:active{transform:scale(0.985)!important;}
        @media (max-width: 768px) {
          .kyc-container { padding: 24px 20px 48px !important; }
          .kyc-upload-row { flex-direction: column !important; }
          .kyc-top-bar { padding: 0 20px !important; }
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: T.surface, fontFamily: "'DM Sans', sans-serif", color: T.text, display: "flex", flexDirection: "column" }}>

        {/* Top bar */}
        <div className="kyc-top-bar" style={{ background: T.white, borderBottom: `1px solid ${T.border}`, height: 60, padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <nav style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 13, color: T.text2, fontWeight: 500, cursor: "pointer" }} onClick={() => onNavigate?.("dashboard")}>Dashboard</span>
            <span style={{ color: T.text3, fontSize: 12 }}>›</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.blue }}>KYC</span>
          </nav>

          {/* Status badge */}
          {kycStatus !== "unverified" && (
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              background: kycStatus === "verified" ? T.greenLight : kycStatus === "in_review" ? T.orangeLight : T.redLight,
              border: `1px solid ${kycStatus === "verified" ? "#A7F3D0" : kycStatus === "in_review" ? "#FDE68A" : "#FECACA"}`,
              borderRadius: 20, padding: "5px 12px",
            }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: kycStatus === "verified" ? T.green : kycStatus === "in_review" ? T.orange : T.red, animation: kycStatus === "in_review" ? "blink 1.8s ease-in-out infinite" : "none" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: kycStatus === "verified" ? T.greenText : kycStatus === "in_review" ? T.orangeText : T.redText, textTransform: "capitalize" }}>
                {kycStatus === "in_review" ? "In Review" : kycStatus}
              </span>
            </div>
          )}
        </div>

        <div className="kyc-container" style={{ flex: 1, maxWidth: 640, width: "100%", margin: "0 auto", padding: "36px 40px 60px" }}>

          {/* ── Heading ── */}
          {(kycStatus === "unverified" || kycStatus === "rejected") && (
            <div style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: T.blue, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>Identity Verification</p>
              <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 26, fontWeight: 700, color: T.text, letterSpacing: "-0.5px", marginBottom: 6 }}>
                {kycStatus === "rejected" ? "Resubmit your ID" : "Verify your identity"}
              </h1>
              <p style={{ fontSize: 14, color: T.text2, lineHeight: 1.6 }}>
                Upload a clear photo of both sides of your government-issued ID to unlock full access.
              </p>
            </div>
          )}

          {/* ── Main card ── */}
          <div style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 22, overflow: "hidden" }}>

            {/* Rejected reason banner (above upload form) */}
            {kycStatus === "rejected" && (
              <div style={{ background: T.redLight, borderBottom: `1px solid #FECACA`, padding: "14px 24px", display: "flex", alignItems: "flex-start", gap: 10 }}>
                <AlertCircle size={15} color={T.red} style={{ flexShrink: 0, marginTop: 1 }} />
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: T.redText, marginBottom: 2 }}>Previous submission rejected</p>
                  <p style={{ fontSize: 12, color: T.redText, lineHeight: 1.5 }}>{rejectionReason}</p>
                </div>
              </div>
            )}

            {/* Content area */}
            <div style={{ padding: "28px" }}>

              {/* Status-based rendering */}
              {kycStatus === "in_review"  && <InReview />}
              {kycStatus === "verified"   && <Verified />}
              {kycStatus === "rejected"   && <Rejected reason={rejectionReason} onResubmit={() => setKycStatus("unverified")} />}

              {/* Upload form — unverified only */}
              {kycStatus === "unverified" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                  {/* Upload row */}
                  <div className="kyc-upload-row" style={{ display: "flex", gap: 14 }}>
                    <UploadCard
                      label="Front of ID"
                      sub="National ID, driver's licence or passport"
                      file={frontFile}
                      onFile={setFrontFile}
                      onRemove={() => setFrontFile(null)}
                      dragging={draggingFront}
                      setDragging={setDraggingFront}
                    />
                    <UploadCard
                      label="Back of ID"
                      sub="Clear photo of the back side"
                      file={backFile}
                      onFile={setBackFile}
                      onRemove={() => setBackFile(null)}
                      dragging={draggingBack}
                      setDragging={setDraggingBack}
                    />
                  </div>

                  {/* Tips */}
                  <div style={{ background: T.blueLight, border: `1px solid ${T.blueDark}22`, borderRadius: 14, padding: "14px 18px" }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: T.blue, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 }}>Tips for a successful upload</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                      {[
                        "Make sure the photo is clear and well-lit",
                        "All four corners of the ID must be visible",
                        "The document must bear the same name as your registered account",
                        "Accepted formats: JPG, PNG — Max 5MB",
                        "Do not upload a scanned or photocopied ID",
                      ].map((tip, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                          <div style={{ width: 16, height: 16, borderRadius: "50%", background: T.blue, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                            <CheckCircle2 size={10} color="#fff" />
                          </div>
                          <p style={{ fontSize: 12, color: "#3B5AA8", lineHeight: 1.5 }}>{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    className="submit-btn"
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    style={{ width: "100%", padding: "17px", borderRadius: 14, border: "none", fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 700, cursor: canSubmit ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "all 0.18s", background: canSubmit ? T.blue : "#E8EEFF", color: canSubmit ? "#fff" : T.text3 }}
                  >
                    {submitting
                      ? <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Uploading…</>
                      : "Submit for Verification"
                    }
                  </button>

                  <p style={{ fontSize: 12, color: T.text3, textAlign: "center", lineHeight: 1.5 }}>
                    Your documents are encrypted and stored securely. We'll notify you once reviewed.
                  </p>
                </div>
              )}
            </div>
          </div>


        </div>

        {/* Footer */}
        <div style={{ borderTop: `1px solid ${T.border}`, padding: "18px 40px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: T.white, flexShrink: 0 }}>
          <Ico.shield />
          <span style={{ fontSize: 12, color: T.text2, fontWeight: 500 }}>Your data is encrypted · </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: T.mintGreen }}>Protected by Cheeseball</span>
        </div>
      </div>
    </>
  );
}

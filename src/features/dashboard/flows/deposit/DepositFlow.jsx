import React, { useState } from "react";
import { T, Ico, ASSETS, CTA, GhostBtn } from "../swap/ConvertFlowShared";

const DEPOSIT_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; overflow-x: hidden; }

  .ctabtn:hover  { background: ${T.blueDark} !important; }
  .ctabtn:active { transform: scale(0.985); }
  .ghostbtn:hover { background: ${T.blueLight} !important; color: ${T.blue} !important; }
  .method-card:hover { border-color: ${T.blue} !important; box-shadow: 0 4px 12px rgba(26, 111, 255, 0.1) !important; }

  @keyframes fadeUp  { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  @keyframes popIn   { 0% { transform:scale(0.95); opacity:0; } 100% { transform:scale(1); opacity:1; } }
  .fadein  { animation: fadeUp 0.25s ease forwards; }
  .popIn   { animation: popIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275) forwards; }
`;

export default function DepositFlow({ onClose }) {
  const [depositType, setDepositType] = useState(null); // "crypto" or "ngn"
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [loading, setLoading] = useState(false);

  const cryptoAssets = ASSETS.filter((a) => a.symbol !== "NGN");
  const ngnOption = ASSETS.find((a) => a.symbol === "NGN");

  const handleSelectCrypto = (asset) => {
    setSelectedAsset(asset);
  };

  const handleSelectNGN = () => {
    setSelectedAsset(ngnOption);
  };

  const handleContinue = async () => {
    setLoading(true);
    try {
      // TODO: Implement deposit logic
      // If crypto: Generate wallet address
      // If NGN: Create bank account via Paystack
      console.log("Deposit type:", depositType, "Asset:", selectedAsset);
    } catch (err) {
      console.error("Deposit failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (depositType) {
      setDepositType(null);
      setSelectedAsset(null);
    } else if (onClose) {
      onClose();
    } else {
      window.history.back();
    }
  };

  return (
    <>
      <style>{DEPOSIT_CSS}</style>

      <div
        style={{
          minHeight: "100vh",
          background: T.surface,
          padding: "40px 20px",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* Back Button */}
        {(depositType || true) && (
          <button
            onClick={handleBack}
            style={{
              padding: "10px 16px",
              background: "transparent",
              border: `1.5px solid ${T.border}`,
              borderRadius: 10,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 32,
              transition: "all 0.2s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.background = T.blueLight)
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke={T.text}
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: 14,
                fontWeight: 600,
                color: T.text,
              }}
            >
              Back
            </span>
          </button>
        )}

        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {!depositType ? (
            <div className="fadein">
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: T.blue,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: 8,
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                Deposit
              </p>
              <h1
                style={{
                  fontFamily: "'Sora',sans-serif",
                  fontSize: 32,
                  fontWeight: 700,
                  color: T.text,
                  letterSpacing: "-0.6px",
                  marginBottom: 12,
                }}
              >
                How would you like to deposit?
              </h1>
              <p
                style={{
                  fontSize: 15,
                  color: T.text2,
                  marginBottom: 40,
                  lineHeight: 1.6,
                }}
              >
                Select your preferred deposit method. You can receive
                cryptocurrency directly to your wallet or NGN via bank transfer.
              </p>

              {/* Option Cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: 20,
                  marginBottom: 32,
                }}
              >
                {/* Crypto Option */}
                <button
                  onClick={() => setDepositType("crypto")}
                  className="method-card"
                  style={{
                    padding: 28,
                    background: T.white,
                    border: `2px solid ${T.border}`,
                    borderRadius: 16,
                    cursor: "pointer",
                    transition: "all 0.3s",
                    textAlign: "left",
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontFamily: "'Sora',sans-serif",
                          fontSize: 18,
                          fontWeight: 700,
                          color: T.text,
                          marginBottom: 4,
                        }}
                      >
                        Receive Crypto
                      </p>
                      <p
                        style={{
                          fontSize: 13,
                          color: T.text2,
                          fontFamily: "'DM Sans',sans-serif",
                        }}
                      >
                        Instant deposit to your wallet
                      </p>
                    </div>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: "#9945FF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        fontSize: 24,
                      }}
                    >
                      ◎
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 12px",
                      background: T.blueLight,
                      borderRadius: 10,
                    }}
                  >
                    {Ico.check(T.blue)}
                    <span
                      style={{
                        fontSize: 12,
                        color: T.blue,
                        fontWeight: 600,
                        fontFamily: "'DM Sans',sans-serif",
                      }}
                    >
                      Multiple assets supported
                    </span>
                  </div>
                </button>

                {/* NGN Option */}
                <button
                  onClick={() => setDepositType("ngn")}
                  className="method-card"
                  style={{
                    padding: 28,
                    background: T.white,
                    border: `2px solid ${T.border}`,
                    borderRadius: 16,
                    cursor: "pointer",
                    transition: "all 0.3s",
                    textAlign: "left",
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontFamily: "'Sora',sans-serif",
                          fontSize: 18,
                          fontWeight: 700,
                          color: T.text,
                          marginBottom: 4,
                        }}
                      >
                        Receive NGN
                      </p>
                      <p
                        style={{
                          fontSize: 13,
                          color: T.text2,
                          fontFamily: "'DM Sans',sans-serif",
                        }}
                      >
                        Direct bank deposit
                      </p>
                    </div>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: T.green,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        fontSize: 24,
                      }}
                    >
                      ₦
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 12px",
                      background: T.greenLight,
                      borderRadius: 10,
                    }}
                  >
                    {Ico.check(T.green)}
                    <span
                      style={{
                        fontSize: 12,
                        color: T.greenText,
                        fontWeight: 600,
                        fontFamily: "'DM Sans',sans-serif",
                      }}
                    >
                      Powered by Paystack
                    </span>
                  </div>
                </button>
              </div>
            </div>
          ) : depositType === "crypto" ? (
            <div className="fadein">
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: T.blue,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: 8,
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                Deposit
              </p>
              <h1
                style={{
                  fontFamily: "'Sora',sans-serif",
                  fontSize: 32,
                  fontWeight: 700,
                  color: T.text,
                  letterSpacing: "-0.6px",
                  marginBottom: 12,
                }}
              >
                Select Cryptocurrency
              </h1>
              <p
                style={{
                  fontSize: 15,
                  color: T.text2,
                  marginBottom: 32,
                  lineHeight: 1.6,
                }}
              >
                Choose which cryptocurrency you'd like to deposit. We'll
                generate a wallet address for you.
              </p>

              {/* Crypto Assets Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: 16,
                  marginBottom: 32,
                }}
              >
                {cryptoAssets.map((asset) => (
                  <button
                    key={asset.id}
                    onClick={() => handleSelectCrypto(asset)}
                    className="method-card popIn"
                    style={{
                      padding: 20,
                      background:
                        selectedAsset?.id === asset.id ? T.blueLight : T.white,
                      border: `2px solid ${selectedAsset?.id === asset.id ? T.blue : T.border}`,
                      borderRadius: 14,
                      cursor: "pointer",
                      transition: "all 0.3s",
                      textAlign: "left",
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        background: asset.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "'Sora',sans-serif",
                        fontSize: 18,
                        fontWeight: 700,
                        color: "#fff",
                        flexShrink: 0,
                      }}
                    >
                      {asset.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontFamily: "'Sora',sans-serif",
                          fontSize: 15,
                          fontWeight: 700,
                          color: T.text,
                        }}
                      >
                        {asset.name}
                      </p>
                      <p
                        style={{
                          fontSize: 12,
                          color: T.text2,
                          marginTop: 2,
                          fontFamily: "'DM Sans',sans-serif",
                        }}
                      >
                        {asset.symbol}
                      </p>
                    </div>
                    {selectedAsset?.id === asset.id && Ico.check(T.blue)}
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <CTA
                  onClick={handleContinue}
                  disabled={loading || !selectedAsset}
                >
                  {loading ? "Processing..." : "Continue"}
                </CTA>
              </div>
            </div>
          ) : (
            <div className="fadein">
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: T.blue,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: 8,
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                Deposit
              </p>
              <h1
                style={{
                  fontFamily: "'Sora',sans-serif",
                  fontSize: 32,
                  fontWeight: 700,
                  color: T.text,
                  letterSpacing: "-0.6px",
                  marginBottom: 12,
                }}
              >
                Deposit Nigerian Naira
              </h1>
              <p
                style={{
                  fontSize: 15,
                  color: T.text2,
                  marginBottom: 32,
                  lineHeight: 1.6,
                }}
              >
                We'll connect you with Paystack to securely transfer NGN to your
                Cheeseball wallet.
              </p>

              {/* NGN Selection Card */}
              <button
                onClick={handleSelectNGN}
                className="method-card"
                style={{
                  width: "100%",
                  maxWidth: 500,
                  padding: 28,
                  background:
                    selectedAsset?.symbol === "NGN" ? T.greenLight : T.white,
                  border: `2px solid ${selectedAsset?.symbol === "NGN" ? T.green : T.border}`,
                  borderRadius: 16,
                  cursor: "pointer",
                  transition: "all 0.3s",
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  marginBottom: 32,
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: T.green,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Sora',sans-serif",
                    fontSize: 32,
                    fontWeight: 700,
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  ₦
                </div>
                <div style={{ flex: 1, textAlign: "left" }}>
                  <p
                    style={{
                      fontFamily: "'Sora',sans-serif",
                      fontSize: 20,
                      fontWeight: 700,
                      color: T.text,
                    }}
                  >
                    Nigerian Naira
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      color: T.text2,
                      marginTop: 4,
                      fontFamily: "'DM Sans',sans-serif",
                    }}
                  >
                    Secure bank transfer via Paystack
                  </p>
                </div>
                {selectedAsset?.symbol === "NGN" && Ico.check(T.green)}
              </button>

              {/* Info Box */}
              <div
                style={{
                  background: T.blueLight,
                  borderRadius: 12,
                  padding: "16px",
                  marginBottom: 32,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                }}
              >
                <Ico.info />
                <span
                  style={{
                    fontSize: 13,
                    color: T.text2,
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  You'll be redirected to Paystack to complete the secure bank
                  transfer process.
                </span>
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <CTA
                  onClick={handleContinue}
                  disabled={loading || !selectedAsset}
                >
                  {loading ? "Processing..." : "Connect Paystack"}
                </CTA>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

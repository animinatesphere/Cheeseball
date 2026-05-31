import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, X, Bell, RefreshCcw } from "lucide-react";
import { fetchMockNotifications } from "@/services/mockNotifications";

const T = {
  blue: "#1A6FFF",
  blueLight: "#EEF3FF",
  text: "#0A0F1E",
  text2: "#6B7A99",
  text3: "#A8B4CC",
  border: "#E8EEFF",
  surface: "#F7F9FF",
  white: "#FFFFFF",
  green: "#00C48C",
};

function NavBar({ onBack }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 12,
      }}
    >
      <button
        onClick={onBack}
        style={{
          border: "none",
          background: "none",
          cursor: "pointer",
          color: T.blue,
          fontSize: 18,
        }}
      >
        ‹
      </button>
      <div>
        <h2
          style={{ margin: 0, fontFamily: "'Sora',sans-serif", color: T.text }}
        >
          Notifications
        </h2>
        <p style={{ margin: 0, fontSize: 12, color: T.text3, marginTop: 4 }}>
          Activity from your account and updates
        </p>
      </div>
    </div>
  );
}

function ActionButton({ children, onClick, primary }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 14px",
        borderRadius: 12,
        border: primary ? "none" : `1px solid ${T.border}`,
        background: primary ? T.blue : T.white,
        color: primary ? "#fff" : T.text,
        cursor: "pointer",
        fontWeight: 700,
      }}
    >
      {children}
    </button>
  );
}

export default function NotificationsPage({ onNavigate }) {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await fetchMockNotifications();
        if (mounted) setItems(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  const markAllRead = () =>
    setItems((s) => s.map((i) => ({ ...i, read: true })));
  const markRead = (id) =>
    setItems((s) => s.map((i) => (i.id === id ? { ...i, read: true } : i)));
  const removeItem = (id) => setItems((s) => s.filter((i) => i.id !== id));

  const reload = async () => {
    setLoading(true);
    try {
      const data = await fetchMockNotifications();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="notifications-container"
      style={{
        minHeight: "100%",
        background: T.surface,
        fontFamily: "'DM Sans',sans-serif",
        padding: "24px 32px",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@400;600&display=swap');`}</style>

      <NavBar onBack={() => navigate(-1)} />

      <div
        className="action-buttons"
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 18,
          alignItems: "center",
        }}
      >
        <ActionButton onClick={markAllRead} primary>
          Mark all as read
        </ActionButton>
        <ActionButton onClick={() => onNavigate?.("support")}>
          Contact support
        </ActionButton>
        <div style={{ marginLeft: 8 }}>
          <button
            onClick={reload}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: T.text2,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <RefreshCcw size={16} /> Refresh
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 760 }}>
        {loading ? (
          <div
            style={{
              padding: 18,
              background: T.white,
              border: `1px solid ${T.border}`,
              borderRadius: 12,
            }}
          >
            <p style={{ margin: 0, color: T.text2 }}>Loading notifications…</p>
          </div>
        ) : (
          items.length === 0 && (
            <div
              style={{
                background: T.white,
                border: `1px solid ${T.border}`,
                borderRadius: 16,
                padding: 28,
                textAlign: "center",
              }}
            >
              <Bell size={36} color={T.text3} />
              <p
                style={{
                  marginTop: 12,
                  fontSize: 16,
                  fontWeight: 700,
                  color: T.text,
                }}
              >
                No notifications yet
              </p>
              <p style={{ marginTop: 6, color: T.text2 }}>
                We'll show important updates here.
              </p>
            </div>
          )
        )}

        <div style={{ display: "grid", gap: 12 }}>
          {items.map((n) => (
            <div
              key={n.id}
              className="notification-card"
              style={{
                background: T.white,
                border: `1px solid ${T.border}`,
                borderRadius: 14,
                padding: 16,
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
              }}
            >
              <div style={{ width: 10, height: 10, marginTop: 6 }}>
                {!n.read && (
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 10,
                      background: T.blue,
                    }}
                  />
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 14,
                        fontWeight: 700,
                        color: T.text,
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {n.title}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        marginTop: 8,
                        color: T.text2,
                        fontSize: 13,
                      }}
                    >
                      {n.body}
                    </p>
                  </div>
                  <div
                    className="meta"
                    style={{ color: T.text3, fontSize: 12, textAlign: "right" }}
                  >
                    <div>{n.time}</div>
                    <div
                      style={{
                        marginTop: 8,
                        display: "flex",
                        gap: 8,
                        justifyContent: "flex-end",
                      }}
                    >
                      {!n.read && (
                        <button
                          onClick={() => markRead(n.id)}
                          style={{
                            border: "none",
                            background: T.blueLight,
                            color: T.blue,
                            padding: "6px 8px",
                            borderRadius: 10,
                            cursor: "pointer",
                            fontWeight: 700,
                          }}
                        >
                          <CheckCircle2 size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => removeItem(n.id)}
                        style={{
                          border: "none",
                          background: "transparent",
                          color: T.text3,
                          cursor: "pointer",
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 430px) {
          .notifications-container { padding: 14px 12px !important; }
          .notifications-container h2 { font-size: 18px !important; }
          .notifications-container p { font-size: 13px !important; }
          .action-buttons { flex-direction: column; gap: 10px; }
          .action-buttons button { width: 100%; }
          .notification-card { padding: 12px !important; border-radius: 12px !important; }
          .notification-card p { font-size: 13px !important; }
          .notification-card .meta { text-align: right; min-width: 70px; }
          .notification-card > div:first-child { min-width: 0; }
        }
      `}</style>
    </div>
  );
}

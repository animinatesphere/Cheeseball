import React from "react";
import { useNavigate } from "react-router-dom";
import { X, Bell, RefreshCcw } from "lucide-react";
import { useNotifications } from "@/services/useNotifications";
import {
  getNotificationConfig,
  getReferenceRoute,
} from "@/services/notificationConfig";

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

function ActionButton({ children, onClick, primary, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "10px 14px",
        borderRadius: 12,
        border: primary ? "none" : `1px solid ${T.border}`,
        background: primary ? T.blue : T.white,
        color: primary ? "#fff" : T.text,
        cursor: disabled ? "not-allowed" : "pointer",
        fontWeight: 700,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
    </button>
  );
}

export default function NotificationsPage({ onNavigate }) {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refetch,
  } = useNotifications();

  const handleNotificationClick = async (notification) => {
    // Mark as read
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }

    // Deep-link to reference if available
    if (notification.reference_type && notification.reference_id) {
      const route = getReferenceRoute(
        notification.reference_type,
        notification.reference_id,
      );
      if (route) {
        navigate(route);
        return;
      }
    }

    // Navigate back if no deep-link available
    navigate(-1);
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  const formatTime = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
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
        <ActionButton
          onClick={handleMarkAllAsRead}
          primary
          disabled={unreadCount === 0 || loading}
        >
          Mark all as read
        </ActionButton>
        <ActionButton onClick={() => onNavigate?.("support")}>
          Contact support
        </ActionButton>
        <div style={{ marginLeft: 8 }}>
          <button
            onClick={refetch}
            disabled={loading}
            style={{
              border: "none",
              background: "transparent",
              cursor: loading ? "not-allowed" : "pointer",
              color: T.text2,
              opacity: loading ? 0.5 : 1,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <RefreshCcw
              size={16}
              style={{
                animation: loading ? "spin 1s linear infinite" : "none",
              }}
            />{" "}
            Refresh
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 760 }}>
        {loading && notifications.length === 0 ? (
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
        ) : notifications.length === 0 ? (
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
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {notifications.map((n) => {
              const config = getNotificationConfig(n.type);
              const Icon = config.icon;

              return (
                <div
                  key={n.id}
                  className="notification-card"
                  onClick={() => handleNotificationClick(n)}
                  style={{
                    background: T.white,
                    border: `1px solid ${T.border}`,
                    borderRadius: 14,
                    padding: 16,
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    opacity: n.is_read ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#F0F4FF";
                    e.currentTarget.style.borderColor = config.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = T.white;
                    e.currentTarget.style.borderColor = T.border;
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: `${config.color}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={20} color={config.color} />
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
                          {n.title || config.label}
                        </p>
                        <p
                          style={{
                            margin: 0,
                            marginTop: 8,
                            color: T.text2,
                            fontSize: 13,
                            lineHeight: 1.4,
                          }}
                        >
                          {n.message}
                        </p>
                      </div>
                      <div
                        className="meta"
                        style={{
                          color: T.text3,
                          fontSize: 12,
                          textAlign: "right",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <div>{formatTime(n.created_at)}</div>
                        {!n.is_read && (
                          <div
                            style={{
                              marginTop: 8,
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background: T.blue,
                              margin: "8px auto 0",
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    style={{
                      border: "none",
                      background: "transparent",
                      color: T.text3,
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
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

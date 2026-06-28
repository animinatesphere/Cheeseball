import React from "react";
import { useNavigate } from "react-router-dom";
import { X, Bell, RefreshCcw, CheckCircle2, ChevronRight, HelpCircle, MessageSquare } from "lucide-react";
import { useNotifications } from "@/services/useNotifications";
import {
  getNotificationConfig,
  getReferenceRoute,
} from "@/services/notificationConfig";

const T = {
  blue: "#1A6FFF",
  blueLight: "#EEF3FF",
  blueGradient: "linear-gradient(135deg, #1A6FFF 0%, #0052D9 100%)",
  text: "#0A0F1E",
  text2: "#6B7A99",
  text3: "#A8B4CC",
  border: "#E8EEFF",
  surface: "#F7F9FF",
  white: "#FFFFFF",
  green: "#00C48C",
  greenLight: "#E6FAF4",
  red: "#EF4444",
  redLight: "#FEF2F2",
};

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
    if (!notification.is_read) {
      try {
        await markAsRead(notification.id);
      } catch (err) {
        console.error("Failed to mark as read:", err);
      }
    }

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
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      style={{
        minHeight: "100%",
        background: "#FAF9FC",
        fontFamily: "'DM Sans', sans-serif",
        padding: "32px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        
        .notification-card {
          position: relative;
          background: #ffffff;
          border: 1px solid #EAE6F0;
          border-radius: 16px;
          padding: 20px;
          display: flex;
          gap: 16px;
          align-items: flex-start;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(10, 15, 30, 0.015);
        }
        
        .notification-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(26, 111, 255, 0.06);
          border-color: #D3CDE0;
        }

        .notification-card.unread {
          border-left: 4px solid #1A6FFF;
          box-shadow: 0 4px 16px rgba(26, 111, 255, 0.03);
          background: #FCFDFF;
        }
        
        .notification-card.unread:hover {
          border-left: 4px solid #0052D9;
        }

        .action-btn-primary {
          background: #1A6FFF;
          color: #ffffff;
          border: none;
          padding: 10px 20px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .action-btn-primary:hover:not(:disabled) {
          background: #0052D9;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(26, 111, 255, 0.2);
        }
        
        .action-btn-primary:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .action-btn-secondary {
          background: #ffffff;
          color: #4A5568;
          border: 1px solid #E2E8F0;
          padding: 10px 20px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn-secondary:hover {
          background: #F7FAFC;
          color: #1A202C;
          border-color: #CBD5E0;
        }

        .spin-anim {
          animation: spin 1.2s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 640px) {
          .notification-header { flex-direction: column; align-items: flex-start; gap: 16px; }
          .notification-actions { width: 100%; justify-content: space-between; }
          .action-btn-primary, .action-btn-secondary { flex: 1; text-align: center; justify-content: center; }
        }
      `}</style>

      {/* Header Bar */}
      <div
        className="notification-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "28px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                border: "none",
                background: "#ffffff",
                width: 36,
                height: 36,
                borderRadius: "50%",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: T.text2,
                transition: "all 0.2s",
                fontWeight: "bold",
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateX(-2px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "none"}
            >
              ‹
            </button>
            <h2 style={{ margin: 0, fontFamily: "'Sora', sans-serif", fontSize: "22px", fontWeight: 700, color: T.text, letterSpacing: "-0.5px" }}>
              Notifications
            </h2>
            {unreadCount > 0 && (
              <span
                style={{
                  background: "#1A6FFF",
                  color: "#fff",
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "4px 8px",
                  borderRadius: "20px",
                  lineHeight: 1,
                }}
              >
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p style={{ margin: "4px 0 0 46px", fontSize: "13px", color: T.text2, fontWeight: 500 }}>
            Stay updated with deposits, conversions, and account activity
          </p>
        </div>

        {/* Action Controls */}
        <div
          className="notification-actions"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <button
            onClick={refetch}
            disabled={loading}
            style={{
              border: "none",
              background: "transparent",
              cursor: loading ? "not-allowed" : "pointer",
              color: T.text2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 38,
              height: 38,
              borderRadius: "10px",
              border: "1px solid #E2E8F0",
              background: "#fff",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#F7FAFC"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}
          >
            <RefreshCcw size={16} className={loading ? "spin-anim" : ""} />
          </button>

          <button
            onClick={handleMarkAllAsRead}
            className="action-btn-primary"
            disabled={unreadCount === 0 || loading}
          >
            <CheckCircle2 size={15} />
            Mark all read
          </button>

          <button onClick={() => onNavigate?.("support")} className="action-btn-secondary">
            Support
          </button>
        </div>
      </div>

      {/* Notifications list layout */}
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {loading && notifications.length === 0 ? (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              background: "#ffffff",
              borderRadius: "20px",
              border: "1px solid #EAE6F0",
            }}
          >
            <RefreshCcw size={28} className="spin-anim" color={T.blue} style={{ margin: "0 auto 12px" }} />
            <p style={{ margin: 0, color: T.text2, fontWeight: 500 }}>Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #EAE6F0",
              borderRadius: "24px",
              padding: "50px 30px",
              textAlign: "center",
              boxShadow: "0 4px 20px rgba(0,0,0,0.01)",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "#F2F0F7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <Bell size={28} color={T.text3} />
            </div>
            <h3 style={{ margin: 0, fontFamily: "'Sora', sans-serif", fontSize: "18px", fontWeight: 700, color: T.text }}>
              All caught up!
            </h3>
            <p style={{ margin: "8px 0 0", color: T.text2, fontSize: "14px", fontWeight: 500 }}>
              No new updates or alerts at the moment.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "12px" }}>
            {notifications.map((n) => {
              const config = getNotificationConfig(n.type);
              const Icon = config.icon;
              const isUnread = !n.is_read;

              return (
                <div
                  key={n.id}
                  className={`notification-card ${isUnread ? "unread" : ""}`}
                  onClick={() => handleNotificationClick(n)}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: `${config.color}10`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: config.color,
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={20} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 12,
                      }}
                    >
                      <div>
                        <h4
                          style={{
                            margin: 0,
                            fontFamily: "'Sora', sans-serif",
                            fontSize: "14px",
                            fontWeight: isUnread ? 700 : 600,
                            color: T.text,
                            lineHeight: 1.3,
                          }}
                        >
                          {n.title || config.label}
                        </h4>
                        <p
                          style={{
                            margin: "6px 0 0",
                            color: T.text2,
                            fontSize: "13px",
                            lineHeight: 1.45,
                            fontWeight: 450,
                          }}
                        >
                          {n.message}
                        </p>
                      </div>
                      
                      <div
                        style={{
                          textAlign: "right",
                          flexShrink: 0,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          gap: 6,
                        }}
                      >
                        <span style={{ fontSize: "11px", color: T.text3, fontWeight: 500 }}>
                          {formatTime(n.created_at)}
                        </span>
                        
                        {isUnread && (
                          <span
                            style={{
                              width: "7px",
                              height: "7px",
                              borderRadius: "50%",
                              background: T.blue,
                              display: "inline-block",
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      alignSelf: "center",
                      color: T.text3,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <ChevronRight size={16} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


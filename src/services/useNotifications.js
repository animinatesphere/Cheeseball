import { useState, useEffect, useCallback, useRef } from "react";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "./api";

const POLL_INTERVAL = 60000; // 60 seconds

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pollIntervalRef = useRef(null);

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getNotifications();

      if (Array.isArray(data)) {
        setNotifications(data);
        const count = data.filter((n) => !n.is_read).length;
        setUnreadCount(count);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark single notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      // Update local state
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      throw err;
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await markAllNotificationsAsRead();
      // Update local state
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
      throw err;
    }
  }, []);

  // Setup polling
  useEffect(() => {
    // Fetch immediately on mount
    fetchNotifications();

    // Set up polling interval
    pollIntervalRef.current = setInterval(() => {
      fetchNotifications();
    }, POLL_INTERVAL);

    // Cleanup on unmount
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
  };
};

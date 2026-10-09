import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

const NotificationContext = createContext();

const LOCAL_STORAGE_KEY = 'gaati_track_notifications_db';

// Helper function to format relative timestamps dynamically
export const getRelativeTime = (createdAt) => {
  if (!createdAt) return 'Just now';
  const now = new Date();
  const past = new Date(createdAt);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 10) return 'Just now';
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  const diffInMins = Math.floor(diffInSeconds / 60);
  if (diffInMins < 60) return `${diffInMins}m ago`;
  const diffInHours = Math.floor(diffInMins / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

// Initial Notification Seeds
const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'DELIVERY_COMPLETED',
    title: '🟢 Delivery Completed',
    message: 'Shipment GT-984201 has been successfully delivered to Leanne Graham in Hyderabad.',
    trackingNumber: 'GT-984201',
    shipmentId: 1,
    read: false,
    createdAt: new Date(Date.now() - 10 * 60000).toISOString()
  },
  {
    id: 'notif-2',
    type: 'STATUS_UPDATED',
    title: '🚚 Status Updated to In Transit',
    message: 'Shipment GT-884102 is now In Transit via NH-44 Linehaul Route to Bangalore.',
    trackingNumber: 'GT-884102',
    shipmentId: 2,
    read: false,
    createdAt: new Date(Date.now() - 35 * 60000).toISOString()
  },
  {
    id: 'notif-3',
    type: 'FAILED_DELIVERY',
    title: '⚠️ Failed Delivery Alert',
    message: 'Delivery attempt failed for Shipment GT-772190. Recipient address was closed.',
    trackingNumber: 'GT-772190',
    shipmentId: 3,
    read: false,
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString()
  },
  {
    id: 'notif-4',
    type: 'SHIPMENT_CREATED',
    title: '🎉 New Shipment Booked',
    message: 'Shipment GT-661044 was registered by Ervin Howell for Express Delivery.',
    trackingNumber: 'GT-661044',
    shipmentId: 4,
    read: true,
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString()
  }
];

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY);
      return data ? JSON.parse(data) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  // Save to LocalStorage whenever notifications state changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.error('Failed to save notifications to LocalStorage', e);
    }
  }, [notifications]);

  // Unread Count
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Add Notification Function with Toast Alert
  const addNotification = useCallback(
    ({ type, title, message, trackingNumber, shipmentId, silent = false }) => {
      const newNotif = {
        id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        type: type || 'STATUS_UPDATED',
        title: title || 'Notification Alert',
        message: message || '',
        trackingNumber: trackingNumber || '',
        shipmentId: shipmentId || null,
        read: false,
        createdAt: new Date().toISOString()
      };

      setNotifications((prev) => [newNotif, ...prev]);

      // Pop toast alert on screen when user performs action
      if (!silent) {
        const toastMsg = `${title}: ${message}`;
        if (type === 'FAILED_DELIVERY') {
          toast.error(toastMsg, { icon: '⚠️' });
        } else if (type === 'DELIVERY_COMPLETED') {
          toast.success(toastMsg, { icon: '🟢' });
        } else if (type === 'SHIPMENT_CREATED') {
          toast.info(toastMsg, { icon: '🎉' });
        } else {
          toast.info(toastMsg, { icon: '🚚' });
        }
      }
    },
    []
  );

  // Mark single notification as read
  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

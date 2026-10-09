import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Truck,
  PlusCircle,
  Check,
  Trash2,
  X,
  ChevronRight,
  BellRing
} from 'lucide-react';
import { useNotifications, getRelativeTime } from '../context/NotificationContext';

const NotificationCenter = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unread' | 'alerts'
  const popoverRef = useRef(null);
  const navigate = useNavigate();

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter notifications based on tab
  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.read;
    if (activeTab === 'alerts') return n.type === 'FAILED_DELIVERY' || n.type === 'DELIVERY_COMPLETED';
    return true;
  });

  // Handle clicking a notification
  const handleItemClick = (notif) => {
    markAsRead(notif.id);
    setIsOpen(false);

    if (notif.trackingNumber) {
      navigate(`/tracking?query=${notif.trackingNumber}`);
    } else if (notif.shipmentId) {
      navigate(`/shipments/${notif.shipmentId}`);
    }
  };

  // Icon Helper for notification types
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'DELIVERY_COMPLETED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'FAILED_DELIVERY':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'SHIPMENT_CREATED':
        return <PlusCircle className="w-4 h-4 text-amber-500" />;
      case 'STATUS_UPDATED':
      default:
        return <Truck className="w-4 h-4 text-[#0B2E8C]" />;
    }
  };

  // Container styling based on type
  const getNotificationBg = (type, read) => {
    if (!read) {
      if (type === 'FAILED_DELIVERY') return 'bg-rose-50/90 border-rose-300';
      if (type === 'DELIVERY_COMPLETED') return 'bg-emerald-50/90 border-emerald-300';
      return 'bg-blue-50/90 border-blue-200';
    }
    return 'bg-white border-slate-100 hover:bg-slate-50';
  };

  return (
    <div className="relative" ref={popoverRef}>
      
      {/* BELL BUTTON WITH UNREAD BADGE */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-all cursor-pointer flex items-center justify-center group"
        title="Notifications"
      >
        <Bell className="w-4 h-4 text-[#0B2E8C] group-hover:rotate-12 transition-transform" />
        
        {/* Unread Badge Count Pill */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-md animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* NOTIFICATION CENTER POPOVER DROPDOWN */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden font-sans animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* TOP HEADER */}
          <div className="p-4 bg-[#0B2E8C] text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <BellRing className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-extrabold tracking-tight">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                  {unreadCount} New
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[11px] text-white/90 hover:text-white font-bold flex items-center gap-1 bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-full transition-all cursor-pointer"
                  title="Mark all as read"
                >
                  <Check className="w-3 h-3 text-amber-400" /> Mark Read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white p-1 cursor-pointer transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* FILTER TABS */}
          <div className="flex border-b border-slate-200 bg-slate-50 px-3 py-2 gap-2 text-xs font-bold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#0B2E8C] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                activeTab === 'unread'
                  ? 'bg-[#0B2E8C] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                activeTab === 'alerts'
                  ? 'bg-[#0B2E8C] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              Alerts
            </button>
          </div>

          {/* NOTIFICATION HISTORY LIST */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleItemClick(notif)}
                  className={`p-3.5 border-l-4 transition-all cursor-pointer flex items-start justify-between gap-3 ${getNotificationBg(
                    notif.type,
                    notif.read
                  )}`}
                >
                  <div className="flex items-start gap-2.5 flex-1">
                    <div className="mt-0.5 p-1.5 rounded-full bg-white shadow-xs border border-slate-200 shrink-0">
                      {getNotificationIcon(notif.type)}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900 leading-tight">
                          {notif.title}
                        </h4>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-[#0B2E8C] shrink-0"></span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug font-medium">
                        {notif.message}
                      </p>
                      <span className="text-[10px] font-semibold text-slate-400 block pt-1">
                        {getRelativeTime(notif.createdAt)}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-400 self-center shrink-0" />
                </div>
              ))
            ) : (
              <div className="p-8 text-center space-y-2">
                <Bell className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-500">No notifications found</p>
              </div>
            )}
          </div>

          {/* FOOTER ACTIONS */}
          {notifications.length > 0 && (
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={clearNotifications}
                className="text-slate-500 hover:text-red-600 font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear All
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/shipments');
                }}
                className="text-[#0B2E8C] font-black hover:underline flex items-center gap-1"
              >
                View Shipments Hub <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default NotificationCenter;

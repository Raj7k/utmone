import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'loading';
export type DisplayMode = 'hud' | 'banner' | 'alert';

export interface NotificationAction {
  label: string;
  onClick: () => void;
  destructive?: boolean;
}

export interface Notification {
  id: string;
  type: NotificationType;
  mode: DisplayMode;
  title: string;
  description?: string;
  duration?: number;
  action?: NotificationAction;
  secondaryAction?: NotificationAction;
  onDismiss?: () => void;
  createdAt: number;
}

interface NotificationContextType {
  notifications: Notification[];
  show: (notification: Omit<Notification, 'id' | 'createdAt'>) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
  update: (id: string, updates: Partial<Notification>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

let notificationId = 0;
const generateId = () => `notification-${++notificationId}`;

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const dismiss = useCallback((id: string) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id);
      if (notification?.onDismiss) {
        notification.onDismiss();
      }
      return prev.filter(n => n.id !== id);
    });
  }, []);

  const show = useCallback((notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const id = generateId();
    const newNotification: Notification = {
      ...notification,
      id,
      createdAt: Date.now(),
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-dismiss based on type and mode
    if (notification.mode !== 'alert' && notification.type !== 'loading') {
      const duration = notification.duration ?? (notification.type === 'success' ? 2000 : 4000);
      setTimeout(() => {
        dismiss(id);
      }, duration);
    }

    return id;
  }, [dismiss]);

  const dismissAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const update = useCallback((id: string, updates: Partial<Notification>) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, ...updates } : n))
    );
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    notifications,
    show,
    dismiss,
    dismissAll,
    update,
  }), [notifications, show, dismiss, dismissAll, update]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
}

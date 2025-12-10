/**
 * Global notification API - works outside React components
 * Uses a singleton pattern to bridge React context with imperative calls
 */

import { NotificationType, DisplayMode, NotificationAction } from '@/contexts/NotificationContext';

interface NotifyOptions {
  description?: string;
  duration?: number;
  action?: NotificationAction;
  secondaryAction?: NotificationAction;
  onDismiss?: () => void;
}

interface AlertOptions extends NotifyOptions {
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}

type ShowFn = (notification: {
  type: NotificationType;
  mode: DisplayMode;
  title: string;
  description?: string;
  duration?: number;
  action?: NotificationAction;
  secondaryAction?: NotificationAction;
  onDismiss?: () => void;
}) => string;

type DismissFn = (id: string) => void;
type UpdateFn = (id: string, updates: Record<string, unknown>) => void;

// Singleton store for the notification context functions
let showFn: ShowFn | null = null;
let dismissFn: DismissFn | null = null;
let updateFn: UpdateFn | null = null;

// Called by NotificationProvider to register the context functions
export function registerNotificationContext(
  show: ShowFn,
  dismiss: DismissFn,
  update: UpdateFn
) {
  showFn = show;
  dismissFn = dismiss;
  updateFn = update;
}

function getShow(): ShowFn {
  if (!showFn) {
    console.warn('Notification context not initialized. Make sure NotificationProvider is mounted.');
    return () => '';
  }
  return showFn;
}

// Global notify API
export const notify = {
  // HUD notifications (center screen, auto-dismiss)
  success: (title: string, options?: NotifyOptions): string => {
    return getShow()({ type: 'success', mode: 'hud', title, ...options });
  },

  error: (title: string, options?: NotifyOptions): string => {
    return getShow()({ type: 'error', mode: 'hud', title, duration: 3000, ...options });
  },

  warning: (title: string, options?: NotifyOptions): string => {
    return getShow()({ type: 'warning', mode: 'hud', title, ...options });
  },

  info: (title: string, options?: NotifyOptions): string => {
    return getShow()({ type: 'info', mode: 'hud', title, ...options });
  },

  loading: (title: string, options?: NotifyOptions): string => {
    return getShow()({ type: 'loading', mode: 'hud', title, ...options });
  },

  // Banner notifications
  banner: {
    success: (title: string, options?: NotifyOptions): string => {
      return getShow()({ type: 'success', mode: 'banner', title, ...options });
    },
    error: (title: string, options?: NotifyOptions): string => {
      return getShow()({ type: 'error', mode: 'banner', title, duration: 6000, ...options });
    },
    warning: (title: string, options?: NotifyOptions): string => {
      return getShow()({ type: 'warning', mode: 'banner', title, ...options });
    },
    info: (title: string, options?: NotifyOptions): string => {
      return getShow()({ type: 'info', mode: 'banner', title, ...options });
    },
    loading: (title: string, options?: NotifyOptions): string => {
      return getShow()({ type: 'loading', mode: 'banner', title, ...options });
    },
  },

  // Alert modal
  alert: (title: string, options?: AlertOptions): string => {
    const { onConfirm, onCancel, confirmLabel, cancelLabel, destructive, ...rest } = options || {};
    
    return getShow()({
      type: 'warning',
      mode: 'alert',
      title,
      action: onConfirm ? {
        label: confirmLabel || 'confirm',
        onClick: onConfirm,
        destructive,
      } : undefined,
      secondaryAction: onCancel ? {
        label: cancelLabel || 'cancel',
        onClick: onCancel,
      } : (onConfirm ? {
        label: cancelLabel || 'cancel',
        onClick: () => {},
      } : undefined),
      ...rest,
    });
  },

  // Utility methods
  dismiss: (id: string) => {
    if (dismissFn) dismissFn(id);
  },

  update: (id: string, updates: Record<string, unknown>) => {
    if (updateFn) updateFn(id, updates);
  },
};

// Legacy toast compatibility layer
export function toast(props: {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}) {
  const title = props.title || props.description || '';
  const description = props.title ? props.description : undefined;
  
  if (props.variant === 'destructive') {
    return notify.error(title, { description });
  }
  return notify.success(title, { description });
}

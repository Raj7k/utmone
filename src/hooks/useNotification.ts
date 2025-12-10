import { useCallback } from 'react';
import { useNotificationContext, NotificationType, DisplayMode, NotificationAction } from '@/contexts/NotificationContext';

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

export function useNotification() {
  const { show, dismiss, dismissAll, update } = useNotificationContext();

  const createNotify = useCallback(
    (type: NotificationType, mode: DisplayMode = 'hud') =>
      (title: string, options?: NotifyOptions) => {
        return show({
          type,
          mode,
          title,
          ...options,
        });
      },
    [show]
  );

  const notify = {
    // HUD notifications (center screen, auto-dismiss)
    success: useCallback((title: string, options?: NotifyOptions) => {
      return show({ type: 'success', mode: 'hud', title, ...options });
    }, [show]),

    error: useCallback((title: string, options?: NotifyOptions) => {
      return show({ type: 'error', mode: 'hud', title, duration: 3000, ...options });
    }, [show]),

    warning: useCallback((title: string, options?: NotifyOptions) => {
      return show({ type: 'warning', mode: 'hud', title, ...options });
    }, [show]),

    info: useCallback((title: string, options?: NotifyOptions) => {
      return show({ type: 'info', mode: 'hud', title, ...options });
    }, [show]),

    loading: useCallback((title: string, options?: NotifyOptions) => {
      return show({ type: 'loading', mode: 'hud', title, ...options });
    }, [show]),

    // Banner notifications (top of screen, with optional actions)
    banner: {
      success: useCallback((title: string, options?: NotifyOptions) => {
        return show({ type: 'success', mode: 'banner', title, ...options });
      }, [show]),

      error: useCallback((title: string, options?: NotifyOptions) => {
        return show({ type: 'error', mode: 'banner', title, duration: 6000, ...options });
      }, [show]),

      warning: useCallback((title: string, options?: NotifyOptions) => {
        return show({ type: 'warning', mode: 'banner', title, ...options });
      }, [show]),

      info: useCallback((title: string, options?: NotifyOptions) => {
        return show({ type: 'info', mode: 'banner', title, ...options });
      }, [show]),

      loading: useCallback((title: string, options?: NotifyOptions) => {
        return show({ type: 'loading', mode: 'banner', title, ...options });
      }, [show]),
    },

    // Alert modal (full screen, requires action)
    alert: useCallback((title: string, options?: AlertOptions) => {
      const { onConfirm, onCancel, confirmLabel, cancelLabel, destructive, ...rest } = options || {};
      
      return show({
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
    }, [show]),

    // Confirmation dialog (convenience method)
    confirm: useCallback((title: string, options?: AlertOptions) => {
      return new Promise<boolean>((resolve) => {
        show({
          type: 'warning',
          mode: 'alert',
          title,
          description: options?.description,
          action: {
            label: options?.confirmLabel || 'confirm',
            onClick: () => resolve(true),
            destructive: options?.destructive,
          },
          secondaryAction: {
            label: options?.cancelLabel || 'cancel',
            onClick: () => resolve(false),
          },
        });
      });
    }, [show]),

    // Utility methods
    dismiss,
    dismissAll,
    update,
  };

  return notify;
}

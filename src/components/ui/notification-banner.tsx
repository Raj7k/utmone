import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertTriangle, Info, Loader2 } from 'lucide-react';
import { Notification, useNotificationContext } from '@/contexts/NotificationContext';
import { Button } from './button';

const icons = {
  success: Check,
  error: X,
  warning: AlertTriangle,
  info: Info,
  loading: Loader2,
};

const bgColors = {
  success: 'bg-green-500/10 border-green-500/20',
  error: 'bg-red-500/10 border-red-500/20',
  warning: 'bg-amber-500/10 border-amber-500/20',
  info: 'bg-blue-500/10 border-blue-500/20',
  loading: 'bg-muted/50 border-border',
};

const iconColors = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-amber-500',
  info: 'text-blue-500',
  loading: 'text-muted-foreground',
};

interface NotificationBannerProps {
  notifications: Notification[];
}

export function NotificationBanner({ notifications }: NotificationBannerProps) {
  const { dismiss } = useNotificationContext();
  const bannerNotifications = notifications.filter(n => n.mode === 'banner');

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-full max-w-md px-4">
      <AnimatePresence mode="popLayout">
        {bannerNotifications.map(notification => (
          <motion.div
            key={notification.id}
            layout
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl 
              backdrop-blur-xl border shadow-lg
              ${bgColors[notification.type]}
            `}
          >
            <BannerIcon type={notification.type} />
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground lowercase truncate">
                {notification.title}
              </p>
              {notification.description && (
                <p className="text-xs text-muted-foreground lowercase truncate">
                  {notification.description}
                </p>
              )}
            </div>

            {notification.action && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  notification.action?.onClick();
                  dismiss(notification.id);
                }}
                className="shrink-0 h-7 text-xs lowercase"
              >
                {notification.action.label}
              </Button>
            )}

            <button
              onClick={() => dismiss(notification.id)}
              className="shrink-0 p-1 rounded-md hover:bg-muted/50 transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function BannerIcon({ type }: { type: Notification['type'] }) {
  const Icon = icons[type];
  const colorClass = iconColors[type];

  return (
    <div className={`shrink-0 ${colorClass}`}>
      <Icon 
        className={`w-5 h-5 ${type === 'loading' ? 'animate-spin' : ''}`} 
        strokeWidth={type === 'success' ? 2.5 : 2}
      />
    </div>
  );
}

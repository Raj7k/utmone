import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertTriangle, Info, Loader2 } from 'lucide-react';
import { Notification, useNotificationContext } from '@/contexts/NotificationContext';

const icons = {
  success: Check,
  error: X,
  warning: AlertTriangle,
  info: Info,
  loading: Loader2,
};

const iconColors = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-amber-500',
  info: 'text-blue-500',
  loading: 'text-muted-foreground',
};

interface NotificationHUDProps {
  notifications: Notification[];
}

export function NotificationHUD({ notifications }: NotificationHUDProps) {
  const { dismiss } = useNotificationContext();
  const hudNotifications = notifications.filter(n => n.mode === 'hud');
  const current = hudNotifications[hudNotifications.length - 1];

  return (
    <AnimatePresence mode="wait">
      {current && (
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
        >
          <motion.div
            onClick={() => dismiss(current.id)}
            className="pointer-events-auto cursor-pointer"
          >
            <div className="flex flex-col items-center justify-center gap-3 px-8 py-6 rounded-2xl bg-card/95 backdrop-blur-xl border border-border shadow-2xl min-w-[140px]">
              <HUDIcon type={current.type} />
              <div className="text-center">
                <p className="text-sm font-medium text-foreground lowercase">
                  {current.title}
                </p>
                {current.description && (
                  <p className="text-xs text-muted-foreground mt-1 lowercase">
                    {current.description}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function HUDIcon({ type }: { type: Notification['type'] }) {
  const Icon = icons[type];
  const colorClass = iconColors[type];

  return (
    <div className={`w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center ${colorClass}`}>
      <Icon 
        className={`w-6 h-6 ${type === 'loading' ? 'animate-spin' : ''}`} 
        strokeWidth={type === 'success' ? 3 : 2}
      />
    </div>
  );
}

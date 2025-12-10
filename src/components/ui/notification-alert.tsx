import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, X, Check, Loader2 } from 'lucide-react';
import { Notification, useNotificationContext } from '@/contexts/NotificationContext';
import { Button } from './button';

const icons = {
  success: Check,
  error: X,
  warning: AlertTriangle,
  info: Info,
  loading: Loader2,
};

const iconColors = {
  success: 'text-green-500 bg-green-500/10',
  error: 'text-red-500 bg-red-500/10',
  warning: 'text-amber-500 bg-amber-500/10',
  info: 'text-blue-500 bg-blue-500/10',
  loading: 'text-muted-foreground bg-muted/50',
};

interface NotificationAlertProps {
  notifications: Notification[];
}

export function NotificationAlert({ notifications }: NotificationAlertProps) {
  const { dismiss } = useNotificationContext();
  const alertNotifications = notifications.filter(n => n.mode === 'alert');
  const current = alertNotifications[0];

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => {
              if (current.type !== 'loading') {
                dismiss(current.id);
              }
            }}
          />

          {/* Alert Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="relative w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6">
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <AlertIcon type={current.type} />
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground">
                  {current.title}
                </h3>
                {current.description && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {current.description}
                  </p>
                )}
              </div>

              {/* Actions */}
              {(current.action || current.secondaryAction || current.type !== 'loading') && (
                <div className="mt-6 flex flex-col gap-2">
                  {current.action && (
                    <Button
                      onClick={() => {
                        current.action?.onClick();
                        dismiss(current.id);
                      }}
                      variant={current.action.destructive ? 'destructive' : 'default'}
                      className="w-full"
                    >
                      {current.action.label}
                    </Button>
                  )}
                  {current.secondaryAction && (
                    <Button
                      onClick={() => {
                        current.secondaryAction?.onClick();
                        dismiss(current.id);
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      {current.secondaryAction.label}
                    </Button>
                  )}
                  {!current.action && !current.secondaryAction && current.type !== 'loading' && (
                    <Button
                      onClick={() => dismiss(current.id)}
                      variant="outline"
                      className="w-full"
                    >
                      dismiss
                    </Button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AlertIcon({ type }: { type: Notification['type'] }) {
  const Icon = icons[type];
  const colorClass = iconColors[type];

  return (
    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${colorClass}`}>
      <Icon 
        className={`w-8 h-8 ${type === 'loading' ? 'animate-spin' : ''}`} 
        strokeWidth={type === 'success' ? 2.5 : 2}
      />
    </div>
  );
}

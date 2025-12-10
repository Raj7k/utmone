import { useEffect } from 'react';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { registerNotificationContext } from '@/lib/notify';
import { NotificationHUD } from './notification-hud';
import { NotificationBanner } from './notification-banner';
import { NotificationAlert } from './notification-alert';

export function Toaster() {
  const { notifications, show, dismiss, update } = useNotificationContext();

  // Register context functions for global notify API
  useEffect(() => {
    registerNotificationContext(show, dismiss, update);
  }, [show, dismiss, update]);

  return (
    <>
      <NotificationHUD notifications={notifications} />
      <NotificationBanner notifications={notifications} />
      <NotificationAlert notifications={notifications} />
    </>
  );
}

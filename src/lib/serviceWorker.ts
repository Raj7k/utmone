// Service Worker helper — SW has been removed to fix recurring MIME-type /
// stale-chunk errors. This module now only unregisters leftover SWs and
// clears caches so existing users auto-migrate.

/**
 * Instead of registering a SW, actively unregister any existing one and
 * purge all caches. The self-destruct sw.js in public/ handles users who
 * haven't visited since the change; this handles the current session.
 */
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r => r.unregister().catch(() => false)));
    }
    if ('caches' in window) {
      const names = await caches.keys();
      await Promise.all(names.map(n => caches.delete(n).catch(() => false)));
    }
  } catch (_) {
    // Non-fatal
  }
  return null;
};

// Check if app is running as installed PWA
export const isStandalone = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
};

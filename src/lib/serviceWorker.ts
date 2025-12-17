// Service Worker Registration Helper

export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  // Only register in production
  if (!('serviceWorker' in navigator) || import.meta.env.DEV) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    // Check for updates periodically (every hour)
    setInterval(() => {
      registration.update();
    }, 60 * 60 * 1000);

    // Handle updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      
      if (!newWorker) return;

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // Auto-skip waiting and apply update silently
          if (registration.waiting) {
            registration.waiting.postMessage('skipWaiting');
          }
        }
      });
    });

    // Track if there was already a service worker controller when page loaded
    // (indicates this is an update, not first-time installation)
    const wasControlled = Boolean(navigator.serviceWorker.controller);

    // Only reload on service worker UPDATE, not on first install
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      // If there was no previous controller, this is first-time install - don't reload
      if (!wasControlled) {
        console.log('[SW] First-time installation complete, skipping reload');
        return;
      }

      // This is an update - reload to apply changes after a short delay
      console.log('[SW] Service Worker updated, reloading to apply changes...');
      setTimeout(() => window.location.reload(), 1500);
    });

    console.log('Service Worker registered successfully');
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
};

// Skip waiting and activate new service worker
export const skipWaiting = (registration: ServiceWorkerRegistration): void => {
  if (registration.waiting) {
    registration.waiting.postMessage('skipWaiting');
  }
};

// Check if app is running as installed PWA
export const isStandalone = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
};

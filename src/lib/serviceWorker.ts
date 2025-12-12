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
          // New version available - dispatch event for UI notification
          window.dispatchEvent(new CustomEvent('sw-update', { detail: registration }));
        }
      });
    });

    // Handle controller change (when user accepts update)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      // Optionally reload the page when new SW takes control
      // window.location.reload();
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

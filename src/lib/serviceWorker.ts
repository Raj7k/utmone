// Service Worker Registration Helper

// Expected SW version - injected at build time
const EXPECTED_SW_VERSION = '__BUILD_TIMESTAMP__';

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
    const wasControlled = Boolean(navigator.serviceWorker.controller);

    // Only reload on service worker UPDATE, not on first install
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!wasControlled) {
        console.log('[SW] First-time installation complete, skipping reload');
        return;
      }

      console.log('[SW] Service Worker updated, reloading to apply changes...');
      setTimeout(() => window.location.reload(), 1500);
    });

    // Listen for stale chunk notifications from SW
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data?.type === 'staleChunk') {
        console.warn('[SW] Received stale chunk notification:', event.data.url);
        // The lazyWithRetry will handle the reload
      }
    });

    // Validate SW version on load
    validateServiceWorkerVersion();

    console.log('Service Worker registered successfully');
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
};

// Validate that the running SW version matches the expected version
export const validateServiceWorkerVersion = async (): Promise<boolean> => {
  if (!navigator.serviceWorker.controller) {
    return true; // No SW controlling, skip validation
  }

  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      console.warn('[SW] Version check timed out');
      resolve(true); // Assume OK if timeout
    }, 3000);

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'version') {
        clearTimeout(timeout);
        navigator.serviceWorker.removeEventListener('message', handleMessage);

        const swVersion = event.data.version;
        const expectedVersion = EXPECTED_SW_VERSION;

        // If version is still placeholder, skip validation
        if (expectedVersion === '__BUILD_TIMESTAMP__' || swVersion === '__BUILD_TIMESTAMP__') {
          resolve(true);
          return;
        }

        if (swVersion !== expectedVersion) {
          console.warn('[SW] Version mismatch - SW:', swVersion, 'Expected:', expectedVersion);
          // Clear caches and reload
          clearAllCaches().then(() => {
            window.location.reload();
          });
          resolve(false);
        } else {
          console.log('[SW] Version validated:', swVersion);
          resolve(true);
        }
      }
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);
    navigator.serviceWorker.controller.postMessage('getVersion');
  });
};

// Clear all caches
export const clearAllCaches = async (): Promise<void> => {
  // Clear via SW message
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage('clearCache');
  }

  // Also clear from main thread
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((name) => caches.delete(name)));
  }

  console.log('[SW] All caches cleared');
};

// Clear static cache only (for chunk loading errors)
export const clearStaticCache = async (): Promise<void> => {
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'clearStaticCache' });
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

// Prefetch critical routes for faster navigation
export const prefetchRoutes = (routes: string[]): void => {
  if (!('serviceWorker' in navigator)) return;

  routes.forEach((route) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = route;
    link.as = 'document';
    document.head.appendChild(link);
  });
};

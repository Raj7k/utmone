// Service Worker Registration Helper

// Expected SW version - injected at build time
const EXPECTED_SW_VERSION = '__BUILD_TIMESTAMP__';

/**
 * Hosts where we must NOT run a service worker:
 *   - Lovable preview iframes (each deploy changes chunk hashes, SW serves
 *     stale chunks, React fails to boot, "loading is taking longer than
 *     expected" fallback fires. This was the recurring bug.)
 *   - Vercel preview deployments (same pattern)
 *   - localhost (dev)
 * On these hosts we also actively unregister any SW the user may already
 * have from a previous visit, and purge all caches, so they immediately
 * stop hitting stale bundles.
 */
function isEphemeralPreviewHost(): boolean {
  if (typeof window === 'undefined') return false;
  const h = window.location.hostname;
  return (
    /\.lovable\.app$/i.test(h) ||
    /\.lovableproject\.com$/i.test(h) ||
    /\.vercel\.app$/i.test(h) ||
    h === 'localhost' ||
    h === '127.0.0.1'
  );
}

async function unregisterAllServiceWorkersAndCaches(): Promise<void> {
  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r => r.unregister().catch(() => false)));
    }
    if ('caches' in window) {
      const names = await caches.keys();
      await Promise.all(names.map(n => caches.delete(n).catch(() => false)));
    }
  } catch (err) {
    console.warn('[SW] Cleanup on preview host failed (non-fatal):', err);
  }
}

export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  // Only register in production
  if (!('serviceWorker' in navigator) || import.meta.env.DEV) {
    return null;
  }

  // Skip SW on preview hosts — they don't benefit from caching (every deploy
  // is a fresh preview) and the mismatched chunk hashes break page loads.
  // Also actively clean up any SW/cache left over from previous visits.
  if (isEphemeralPreviewHost()) {
    await unregisterAllServiceWorkersAndCaches();
    console.log('[SW] Preview host detected — service worker disabled and caches cleared.');
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
    // Added reload loop protection via sessionStorage
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!wasControlled) {
        console.log('[SW] First-time installation complete, skipping reload');
        return;
      }

      // Prevent reload loops - only reload once per 30 seconds
      const lastReload = sessionStorage.getItem('sw_last_reload');
      const now = Date.now();
      if (lastReload && now - parseInt(lastReload) < 30000) {
        console.warn('[SW] Skipping reload - too recent (loop protection)');
        return;
      }

      console.log('[SW] Service Worker updated, reloading to apply changes...');
      sessionStorage.setItem('sw_last_reload', now.toString());
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
          // Clear caches but DON'T force reload - let user continue
          // The reload from controllerchange will handle it with loop protection
          clearAllCaches().then(() => {
            console.log('[SW] Caches cleared due to version mismatch');
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

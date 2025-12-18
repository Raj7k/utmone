// Service Worker for utm.one PWA - Dynamic versioning
const SW_VERSION = '__BUILD_TIMESTAMP__';
const CACHE_NAME = 'utm-one-' + SW_VERSION;
const STATIC_CACHE = 'utm-one-static-' + SW_VERSION;

// Static assets to precache
const PRECACHE_ASSETS = [
  '/manifest.json',
  '/favicon.ico',
  '/offline.html',
];

// Install event - precache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - aggressively clean up ALL old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            // Delete ALL caches that don't match current version
            return name !== CACHE_NAME && name !== STATIC_CACHE;
          })
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('[SW] v' + SW_VERSION + ' activated, claiming clients');
      return self.clients.claim();
    })
  );
});

// Check if URL is a hashed asset (immutable - safe to cache long-term)
function isHashedAsset(url) {
  // Match patterns like: index-abc123.js, styles-def456.css
  return /[-\.][a-f0-9]{8,}\.(?:js|css)$/i.test(url);
}

// Fetch event - stale-while-revalidate for static assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and external requests
  if (request.method !== 'GET' || !url.origin.includes(self.location.origin)) {
    return;
  }

  // Skip API and auth requests - never cache these
  if (url.pathname.startsWith('/rest/') || 
      url.pathname.startsWith('/auth/') ||
      url.pathname.includes('supabase') ||
      url.pathname.includes('/functions/')) {
    return;
  }

  // Network-first for navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, clone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request)
            .then((cached) => cached || caches.match('/offline.html'));
        })
    );
    return;
  }

  // Handle static assets (JS, CSS, fonts, images)
  if (request.destination === 'script' || 
      request.destination === 'style' ||
      request.destination === 'font' ||
      request.destination === 'image') {
    
    event.respondWith(
      (async () => {
        const cache = await caches.open(STATIC_CACHE);
        const cachedResponse = await cache.match(request);
        
        // For hashed assets (immutable), return cache immediately if available
        if (cachedResponse && isHashedAsset(url.pathname)) {
          return cachedResponse;
        }
        
        try {
          const networkResponse = await fetch(request);
          
          // Handle 404 for JS/CSS chunks - indicates stale deployment
          if (networkResponse.status === 404 && 
              (request.destination === 'script' || request.destination === 'style')) {
            console.warn('[SW] Stale chunk detected (404):', url.pathname);
            
            // Clear static cache - chunks are from old deployment
            await caches.delete(STATIC_CACHE);
            
            // Notify clients to reload
            self.clients.matchAll().then((clients) => {
              clients.forEach((client) => {
                client.postMessage({ type: 'staleChunk', url: url.pathname });
              });
            });
            
            // Return error response that lazyWithRetry can handle
            return new Response('Chunk not found - deployment updated', { 
              status: 404,
              statusText: 'Stale Chunk'
            });
          }
          
          // Cache successful responses
          if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
          }
          
          return networkResponse;
        } catch (error) {
          // Network failed - return cached if available
          if (cachedResponse) {
            return cachedResponse;
          }
          throw error;
        }
      })()
    );
    return;
  }
});

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
  
  // Force cache clear on demand
  if (event.data === 'clearCache') {
    caches.keys().then((names) => {
      names.forEach((name) => caches.delete(name));
    });
  }
  
  // Expose version for debugging and validation
  if (event.data === 'getVersion') {
    event.source?.postMessage({ type: 'version', version: SW_VERSION });
  }
  
  // Clear specific cache type
  if (event.data?.type === 'clearStaticCache') {
    caches.delete(STATIC_CACHE).then(() => {
      console.log('[SW] Static cache cleared');
      event.source?.postMessage({ type: 'staticCacheCleared' });
    });
  }
});

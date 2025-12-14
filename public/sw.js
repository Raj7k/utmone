// Service Worker for utm.one PWA - v2 with aggressive cache busting
const SW_VERSION = '2.0.0';
const CACHE_NAME = 'utm-one-v2';
const STATIC_CACHE = 'utm-one-static-v2';

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
  // This ensures fresh routes are always fetched
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone and cache successful responses
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, clone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache, then offline page
          return caches.match(request)
            .then((cached) => cached || caches.match('/offline.html'));
        })
    );
    return;
  }

  // Stale-while-revalidate for static assets (JS, CSS, fonts, images)
  if (request.destination === 'script' || 
      request.destination === 'style' ||
      request.destination === 'font' ||
      request.destination === 'image') {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchPromise = fetch(request).then((networkResponse) => {
            if (networkResponse.ok) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => cachedResponse);

          return cachedResponse || fetchPromise;
        });
      })
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
});

// Service Worker for utm.one PWA - Dynamic versioning with aggressive cache invalidation
const SW_VERSION = '__BUILD_TIMESTAMP__';
const CACHE_NAME = 'utm-one-' + SW_VERSION;
const STATIC_CACHE = 'utm-one-static-' + SW_VERSION;

// On ephemeral preview hosts (Lovable / Vercel previews, localhost), this
// service worker causes more harm than good: it caches JS chunk hashes from
// a previous deploy, so after the next deploy the browser requests chunks
// that no longer exist and React fails to boot. When a client installs a
// fresh copy of this SW on a preview host, we self-destruct: unregister
// ourselves, delete every cache, and tell open clients to reload. After
// that the app runs with no SW and always loads fresh bundles.
const PREVIEW_HOST_RE = /(^|\.)lovable\.app$|\.lovableproject\.com$|\.vercel\.app$|^localhost$|^127\.0\.0\.1$/i;
const IS_PREVIEW_HOST = PREVIEW_HOST_RE.test(self.location.hostname);

// Static assets to precache
const PRECACHE_ASSETS = [
  '/manifest.json',
  '/favicon.ico',
];

// Install event - precache critical assets and skip waiting immediately
self.addEventListener('install', (event) => {
  console.log('[SW] Installing v' + SW_VERSION + ' on ' + self.location.hostname);
  // Preview hosts: skip waiting immediately so we can self-destruct in activate
  if (IS_PREVIEW_HOST) {
    event.waitUntil(self.skipWaiting());
    return;
  }
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => {
        console.log('[SW] Precache complete, skipping waiting');
        return self.skipWaiting();
      })
  );
});

// Activate event - on preview hosts SELF-DESTRUCT; otherwise clean old caches.
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating v' + SW_VERSION + ' on ' + self.location.hostname);

  if (IS_PREVIEW_HOST) {
    // Preview host: wipe ALL caches, unregister self, tell clients to reload.
    event.waitUntil((async () => {
      try {
        const names = await caches.keys();
        await Promise.all(names.map((n) => caches.delete(n)));
        console.log('[SW] Preview host — all caches cleared');

        // Tell every connected client to reload so they fetch fresh HTML
        // (which, thanks to index.html cleanup, will not re-register this SW).
        const clients = await self.clients.matchAll({ includeUncontrolled: true });
        clients.forEach((client) => {
          try { client.postMessage({ type: 'forceReload' }); } catch (_) { /* noop */ }
        });

        // Unregister self so no future navigation is intercepted.
        await self.registration.unregister();
        console.log('[SW] Preview host — unregistered self');
      } catch (err) {
        console.warn('[SW] Self-destruct failed (non-fatal):', err);
      }
    })());
    return;
  }

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

// Fetch event - network-first for JS/CSS, stale-while-revalidate for images
self.addEventListener('fetch', (event) => {
  // Preview host: don't intercept anything. Every request goes straight to
  // the network untouched. Combined with the self-unregister in activate,
  // this prevents a half-destroyed SW from serving stale assets during the
  // short window before unregister() completes.
  if (IS_PREVIEW_HOST) {
    return;
  }

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
            .then((cached) => cached || new Response('Offline', { status: 503 }));
        })
    );
    return;
  }

  // Handle static assets (JS, CSS) - Network-first to avoid stale module issues
  if (request.destination === 'script' || request.destination === 'style') {
    event.respondWith(
      (async () => {
        try {
          // Always try network first for scripts/styles
          const networkResponse = await fetch(request);
          
          // Handle 404 for JS/CSS chunks - indicates stale deployment
          if (networkResponse.status === 404) {
            console.warn('[SW] Stale chunk detected (404):', url.pathname);
            
            // Clear ALL caches - deployment was updated
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map(name => caches.delete(name)));
            
            // Notify clients to reload
            const clients = await self.clients.matchAll();
            clients.forEach((client) => {
              client.postMessage({ type: 'staleChunk', url: url.pathname });
            });
            
            return new Response('Chunk not found - deployment updated', { 
              status: 404,
              statusText: 'Stale Chunk'
            });
          }
          
          // Cache successful responses for hashed assets only
          if (networkResponse.ok && isHashedAsset(url.pathname)) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
          }
          
          return networkResponse;
        } catch (error) {
          // Network failed - try cache as fallback for hashed assets
          if (isHashedAsset(url.pathname)) {
            const cached = await caches.match(request);
            if (cached) return cached;
          }
          throw error;
        }
      })()
    );
    return;
  }

  // Handle fonts and images - stale-while-revalidate (these are safe to cache)
  if (request.destination === 'font' || request.destination === 'image') {
    event.respondWith(
      (async () => {
        const cache = await caches.open(STATIC_CACHE);
        const cachedResponse = await cache.match(request);
        
        // Return cached immediately, update in background
        const fetchPromise = fetch(request).then((networkResponse) => {
          if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => cachedResponse);
        
        return cachedResponse || fetchPromise;
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
      Promise.all(names.map((name) => caches.delete(name))).then(() => {
        event.source?.postMessage({ type: 'cacheCleared' });
      });
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
  
  // Force update - clear all and reload
  if (event.data === 'forceUpdate') {
    caches.keys().then((names) => {
      return Promise.all(names.map((name) => caches.delete(name)));
    }).then(() => {
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'forceReload' });
        });
      });
    });
  }
});
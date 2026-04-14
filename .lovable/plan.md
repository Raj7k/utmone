

## Plan: Fix Recurring Module Script MIME Type / createContext Errors

### Root Cause

The **service worker** (`public/sw.js`) is caching hashed JS chunks (lines 142-188). When a new deploy ships different chunk hashes, the old service worker either:
1. Serves stale cached chunks with incorrect MIME types (`application/octet-stream`)
2. Serves chunks from a previous build where module boundaries differ, causing `createContext` to be undefined in vendor splits

Additionally, the version validation in `src/lib/serviceWorker.ts` line 4 uses `'__BUILD_TIMESTAMP__'` as a string literal — but the Vite plugin only replaces that placeholder inside `dist/sw.js`, **not** inside the bundled app code. So `EXPECTED_SW_VERSION` is always the literal string `'__BUILD_TIMESTAMP__'`, meaning version validation **always skips** (line 149), and stale SWs are never detected.

This is a recurring issue that previous fixes (removing modulepreload hints, adding cache-clearing logic) haven't resolved because the SW itself is the problem.

### Fix: Remove Service Worker Entirely

The SW provides minimal value (offline support for a dashboard app that requires network anyway) and is the source of repeated production outages.

**Step 1: Convert `public/sw.js` to a self-destruct-only script**

Replace the entire file with a minimal SW that unregisters itself and clears all caches on any host. This ensures existing users with an installed SW get cleaned up automatically.

```js
// Self-destruct SW — clears all caches and unregisters
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.map(n => caches.delete(n)));
    const clients = await self.clients.matchAll({ includeUncontrolled: true });
    clients.forEach(c => { try { c.postMessage({ type: 'forceReload' }); } catch(_){} });
    await self.registration.unregister();
  })());
});
```

**Step 2: Stop registering the SW in `src/lib/serviceWorker.ts`**

Change `registerServiceWorker` to always unregister any existing SW and return null. Keep the export signature so callers don't break.

**Step 3: Remove the `injectServiceWorkerVersion` Vite plugin from `vite.config.ts`**

No longer needed since sw.js is static.

**Step 4: Clean up index.html cache-busting logic**

The `__BUILD_VERSION__` / version-mismatch / auto-retry logic in `index.html` (lines 244-322) can be simplified since the SW won't be caching anything anymore. Keep a simple 20s timeout fallback but remove the cache-clearing complexity.

### What this fixes
- No more stale chunks served with wrong MIME types
- No more `createContext` errors from mismatched vendor splits
- No more "loading is taking longer than expected" from SW-cached 404s
- Existing production users auto-migrate: the self-destruct SW replaces their old one

### What's lost
- Offline capability (the app requires network for all features anyway)
- Static asset caching (CDN/browser cache already handles this)


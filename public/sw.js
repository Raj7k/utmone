// Self-destruct service worker — clears all caches and unregisters itself.
// This replaces the previous caching SW that caused recurring MIME-type and
// stale-chunk errors after deploys. Existing users who still have the old SW
// will receive this file as an update; it will activate, wipe their caches,
// and remove itself so all future page loads are SW-free.

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // Delete every cache
    const names = await caches.keys();
    await Promise.all(names.map(n => caches.delete(n)));

    // Tell open tabs to reload so they get fresh assets
    const clients = await self.clients.matchAll({ includeUncontrolled: true });
    clients.forEach(c => {
      try { c.postMessage({ type: 'forceReload' }); } catch (_) { /* noop */ }
    });

    // Unregister self — no more SW interception after this
    await self.registration.unregister();
  })());
});

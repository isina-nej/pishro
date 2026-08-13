/* Kill-switch: unregister and clear caches (fixes stale chunk Application errors). */
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true,
      });
      await Promise.all(
        clients.map((client) => {
          if ('navigate' in client) {
            return client.navigate(client.url);
          }
          return undefined;
        })
      );
    })()
  );
});

self.addEventListener('fetch', () => {
  // No caching — pass through to network.
});

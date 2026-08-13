/* Pishro static asset cache — faster repeat visits */
const STATIC_CACHE = 'pishro-static-v1';
const STATIC_PREFIXES = [
  '/_next/static/',
  '/font/',
  '/logo/',
  '/images/',
  '/icons/',
  '/videos/',
];

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE)
          .map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

function isStaticAsset(pathname) {
  return STATIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  // Never cache HTML navigations / API — always network first.
  if (!isStaticAsset(requestUrl.pathname)) {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;
        if (event.request.mode === 'navigate') {
          return Response.redirect('/');
        }
        return new Response('', { status: 503, statusText: 'Offline' });
      })
    );
    return;
  }

  // Stale-while-revalidate for fonts, logo, hashed Next chunks, etc.
  event.respondWith(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      const cached = await cache.match(event.request);

      const networkPromise = fetch(event.request)
        .then((response) => {
          if (response && response.ok) {
            cache.put(event.request, response.clone());
          }
          return response;
        })
        .catch(() => cached);

      return cached || networkPromise;
    })()
  );
});

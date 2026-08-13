/* Pishro static asset cache — bump version after each public release */
const STATIC_CACHE = 'pishro-static-v2';
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

  // Network-first for hashed Next chunks so deploys never serve a stale mismatch.
  // Other static assets stay stale-while-revalidate.
  const isNextChunk = requestUrl.pathname.startsWith('/_next/static/');

  event.respondWith(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);

      if (isNextChunk) {
        try {
          const response = await fetch(event.request);
          if (response && response.ok) {
            cache.put(event.request, response.clone());
          }
          return response;
        } catch {
          const cached = await cache.match(event.request);
          if (cached) return cached;
          throw new Error('Chunk unavailable');
        }
      }

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

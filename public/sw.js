/*
  Simple service worker for offline support and basic caching.
  - Caches the offline page and a few core routes on install.
  - For navigations: network-first with offline fallback.
  - For static assets: stale-while-revalidate.
*/

const CACHE_VERSION = "v1";
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const PAGES_CACHE = `pages-${CACHE_VERSION}`;

const OFFLINE_URL = "/offline";
const PRECACHE_URLS = [
  "/",
  OFFLINE_URL,
  "/manifest.webmanifest",
  "/icons/pubquiz.svg",
  "/icons/pubquiz-maskable.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      try {
        await cache.addAll(PRECACHE_URLS);
      } catch (e) {
        // Some routes may fail to pre-cache during dev; ignore
      }
      self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== PAGES_CACHE)
          .map((key) => caches.delete(key))
      );
      self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin GET requests
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  // For navigations, try network first then fall back to offline page
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request);
          const cache = await caches.open(PAGES_CACHE);
          cache.put(request, networkResponse.clone());
          return networkResponse;
        } catch (e) {
          const cache = await caches.open(STATIC_CACHE);
          const cachedOffline = await cache.match(OFFLINE_URL);
          if (cachedOffline) return cachedOffline;
          return new Response("You are offline.", { status: 503, statusText: "Offline" });
        }
      })()
    );
    return;
  }

  // For assets: stale-while-revalidate strategy
  if (/\.(?:js|css|png|jpg|jpeg|gif|webp|svg|ico|woff2?)$/i.test(url.pathname)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(STATIC_CACHE);
        const cached = await cache.match(request);
        const networkPromise = fetch(request)
          .then((response) => {
            cache.put(request, response.clone());
            return response;
          })
          .catch(() => undefined);
        return cached || networkPromise || fetch(request);
      })()
    );
  }
});

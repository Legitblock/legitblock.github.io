// LegitBlock Air-Gapped Offline Governance Service Worker
const CACHE_NAME = "legitblock-v2";
const ASSETS_CACHE = "legitblock-assets-v2";

const OFFLINE_URLS = [
  "/",
  "/playground",
  "/templates",
  "/why-blockchain",
  "/architecture",
  "/core-library",
  "/web-app",
  "/cli",
  "/api-reference"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(OFFLINE_URLS).catch(() => {
        // Soft fail if assets are dynamic
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== ASSETS_CACHE)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Cache-First strategy for immutable static assets (_next/static, images, fonts)
  if (url.pathname.includes("/_next/static/") || url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|woff2|woff)$/)) {
    event.respondWith(
      caches.open(ASSETS_CACHE).then((cache) => {
        return cache.match(event.request).then((cached) => {
          if (cached) return cached;
          return fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // Network-First strategy with offline fallback for HTML navigation
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        const match = await cache.match(event.request);
        if (match) return match;

        // Try clean URL or fallback to root offline page
        const path = url.pathname;
        const cleanMatch = await cache.match(path) || await cache.match(path + "/") || await cache.match(path + ".html");
        return cleanMatch || cache.match("/");
      })
  );
});

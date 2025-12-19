/* ---------------- NO VERSIONING REQUIRED ---------------- */

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

/* ---------------- FETCH ---------------- */
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Always fetch latest HTML / JS / CSS
  if (
    request.destination === "document" ||
    request.destination === "script" ||
    request.destination === "style"
  ) {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
    return;
  }

  // Cache images & icons
  if (request.destination === "image") {
    event.respondWith(
      caches.open("images-cache").then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) return cached;

          return fetch(request).then((response) => {
            cache.put(request, response.clone());
            return response;
          });
        })
      )
    );
    return;
  }

  // Default: network first
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});

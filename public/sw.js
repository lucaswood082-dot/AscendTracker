const CACHE_NAME = 'ascendtracker-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/workout.html',
  '/view.html',
  '/style.css',
  '/manifest.json',
  '/sw.js',
  // Add any other static files or icons you use
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install Service Worker and cache files
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching app files');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Service Worker and clean old caches
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', name);
            return caches.delete(name);
          }
        })
      )
    )
  );
  return self.clients.claim();
});

// Intercept fetch requests and serve from cache if available
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Serve cached file if found, else fetch from network
      return response || fetch(event.request);
    }).catch(() => {
      // Optionally: fallback if offline and resource not cached
      if (event.request.mode === 'navigate') {
        return caches.match('/index.html');
      }
    })
  );
});

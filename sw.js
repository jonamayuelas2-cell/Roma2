const CACHE_NAME = 'roma-eterna-v1.0.0';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/lista.json',
  '/manifest.json'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 Roma Eterna: Cacheando assets estáticos...');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('🗑️ Eliminando caché antigua:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - Network First con fallback a caché
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Para imágenes de picsum, usar caché primero
  if (url.hostname === 'picsum.photos') {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(event.request);
        if (cached) return cached;
        try {
          const response = await fetch(event.request);
          cache.put(event.request, response.clone());
          return response;
        } catch {
          return new Response('', { status: 503 });
        }
      })
    );
    return;
  }

  // Para API del tiempo, network first
  if (url.hostname.includes('open-meteo.com') || url.hostname.includes('nominatim')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Para el resto: red primero, caché como respaldo
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// Background sync (para mensajes compartidos)
self.addEventListener('sync', (event) => {
  if (event.tag === 'share-place') {
    event.waitUntil(Promise.resolve());
  }
});

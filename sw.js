// Keeps a copy of the page on the phone so it opens without a signal.
// The saved copy shows straight away and is refreshed in the background.
const CACHE = 'contact-qr';

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(['./', 'qr-code.jpg'])));
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const fresh = fetch(event.request).then(async (response) => {
    if (response.ok) {
      const cache = await caches.open(CACHE);
      await cache.put(event.request, response.clone());
    }
    return response;
  });

  event.waitUntil(fresh.catch(() => {}));
  event.respondWith(caches.match(event.request).then((saved) => saved || fresh));
});

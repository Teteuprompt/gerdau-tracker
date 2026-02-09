self.addEventListener('fetch', function(event) {
  // Basic fetch pass-through to satisfy PWA requirements
  event.respondWith(fetch(event.request));
});
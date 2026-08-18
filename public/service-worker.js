self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);

  // Only handle same-origin GET requests (static assets/navigation).
  // Let everything else - especially cross-origin API calls like
  // POST /api/auth/login to the backend - go straight to the network,
  // untouched by the service worker.
  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return; // no event.respondWith() = browser handles it natively
  }

  event.respondWith(
    fetch(request).catch(() => {
      // Network failed (e.g. offline) - don't throw an uncaught
      // rejection, just surface a real network error response.
      return new Response("Network error", {
        status: 503,
        statusText: "Service Unavailable",
      });
    })
  );
});

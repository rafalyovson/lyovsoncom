// Service Worker for PWA functionality
// Version 2.0.0 - Upgraded to 2025 best practices with hybrid caching strategies

const VERSION = "2.0.0";
const CACHE_NAME = `lyovson-cache-v${VERSION}`;
const OFFLINE_URL = "/offline";
const HTTP_OK = 200;
const HTTP_REDIRECT = 300;
const CACHE_MAX_SIZE = 50; // Maximum number of items in runtime cache
const NETWORK_TIMEOUT = 3000; // 3 seconds
const STATIC_ASSET_PATTERN =
  /\.(png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|otf|ico)$/i;
const IS_DEV = self.location.hostname === "localhost";

/**
 * @param {"warn" | "error" | "info"} level
 * @param {string} message
 * @param {unknown} [detail]
 */
function swLog(level, message, detail) {
  if (!IS_DEV) {
    return;
  }

  if (level === "warn") {
    /* biome-ignore lint/suspicious/noConsole: Developer diagnostics are only emitted during local development */
    console.warn(message, detail);
    return;
  }

  if (level === "error") {
    /* biome-ignore lint/suspicious/noConsole: Developer diagnostics are only emitted during local development */
    console.error(message, detail);
    return;
  }

  /* biome-ignore lint/suspicious/noConsole: Developer diagnostics are only emitted during local development */
  console.info(message, detail);
}

// Essential URLs to precache on install
const urlsToCache = [
  "/",
  "/offline",
  "/posts",
  "/projects",
  "/rafa",
  "/jess",
  "/manifest.webmanifest",
];

// Helper: Check if request is for a static asset
function isStaticAsset(url) {
  return STATIC_ASSET_PATTERN.test(url);
}

// Helper: Check if request should be handled by service worker
function shouldHandleRequest(request) {
  const url = new URL(request.url);

  // Skip non-HTTP(S) requests
  if (!request.url.startsWith("http")) {
    return false;
  }

  // Skip API requests (they use network-first)
  if (url.pathname.startsWith("/api/")) {
    return false;
  }

  // Skip admin routes
  if (url.pathname.startsWith("/admin")) {
    return false;
  }

  // Skip Payload CMS routes
  if (url.pathname.startsWith("/_next/")) {
    return false;
  }

  return true;
}

// Helper: Limit cache size
async function limitCacheSize(cacheName, maxSize) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  if (keys.length > maxSize) {
    // Delete oldest entries
    const keysToDelete = keys.slice(0, keys.length - maxSize);
    await Promise.all(keysToDelete.map((key) => cache.delete(key)));
  }
}

// Helper: Network with timeout
async function fetchWithTimeout(request, timeout) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(request, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Install event - precache essential resources with error handling
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);

        // Try to cache all URLs, but handle individual failures
        const cachePromises = urlsToCache.map(async (url) => {
          try {
            await cache.add(url);
          } catch (error) {
            swLog(
              "warn",
              `Failed to cache ${url}`,
              error instanceof Error ? error.message : error
            );
            // Continue even if one URL fails
          }
        });

        await Promise.allSettled(cachePromises);

        // Skip waiting to activate immediately
        await self.skipWaiting();
      } catch (error) {
        swLog("error", "Service worker installation failed", error);
      }
    })()
  );
});

// Activate event - cleanup old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cacheNames = await caches.keys();

        // Delete old caches
        await Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName))
        );

        // Take control of all clients
        await self.clients.claim();
      } catch (error) {
        swLog("error", "Service worker activation failed", error);
      }
    })()
  );
});

// Fetch event - implement hybrid caching strategies
self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") {
    return;
  }

  // Check if request should be handled
  if (!shouldHandleRequest(event.request)) {
    return;
  }

  const url = new URL(event.request.url);

  // Strategy 1: Cache-First for static assets (images, fonts)
  if (isStaticAsset(url.pathname)) {
    event.respondWith(
      (async () => {
        try {
          // Check cache first
          const cachedResponse = await caches.match(event.request);
          if (cachedResponse) {
            return cachedResponse;
          }

          // Fetch from network
          const networkResponse = await fetchWithTimeout(
            event.request,
            NETWORK_TIMEOUT
          );

          // Cache successful responses
          if (networkResponse.status === HTTP_OK) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(event.request, networkResponse.clone());
            await limitCacheSize(CACHE_NAME, CACHE_MAX_SIZE);
          }

          return networkResponse;
        } catch (_error) {
          // Return cached version or fallback
          const cachedResponse = await caches.match(event.request);
          return (
            cachedResponse ||
            new Response("Offline", {
              status: 503,
              statusText: "Service Unavailable",
            })
          );
        }
      })()
    );
    return;
  }

  // Strategy 2: Stale-While-Revalidate for HTML, CSS, JS
  // Returns cached version immediately while updating cache in background
  event.respondWith(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(event.request);

        // Fetch from network in the background
        const fetchPromise = (async () => {
          try {
            const networkResponse = await fetchWithTimeout(
              event.request,
              NETWORK_TIMEOUT
            );

            // Update cache with new response (don't await)
            if (networkResponse.status < HTTP_REDIRECT) {
              cache.put(event.request, networkResponse.clone());
              await limitCacheSize(CACHE_NAME, CACHE_MAX_SIZE);
            }

            return networkResponse;
          } catch (error) {
            // Network failed, return cached or offline page
            swLog(
              "warn",
              `Network fetch failed during revalidation: ${event.request.url}`,
              error
            );
            if (event.request.mode === "navigate") {
              return (
                cache.match(OFFLINE_URL) ||
                new Response("Offline", {
                  status: 503,
                  statusText: "Service Unavailable",
                })
              );
            }
            throw error;
          }
        })();

        // Return cached response immediately if available, otherwise wait for network
        return cachedResponse || fetchPromise;
      } catch (error) {
        // If all fails, show offline page for navigation
        swLog(
          "error",
          `Stale-while-revalidate failed completely: ${event.request.url}`,
          error
        );
        if (event.request.mode === "navigate") {
          return (
            caches.match(OFFLINE_URL) ||
            new Response("Offline", {
              status: 503,
              statusText: "Service Unavailable",
            })
          );
        }

        return new Response("Offline", {
          status: 503,
          statusText: "Service Unavailable",
        });
      }
    })()
  );
});

// Handle messages from the main thread
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "GET_VERSION") {
    event.ports[0]?.postMessage({ version: VERSION });
  }

  if (event.data && event.data.type === "CACHE_URLS") {
    const urls = event.data.payload || [];
    event.waitUntil(
      (async () => {
        try {
          const cache = await caches.open(CACHE_NAME);

          // Cache URLs individually with error handling
          const cachePromises = urls.map(async (url) => {
            try {
              await cache.add(url);
            } catch (error) {
              swLog(
                "warn",
                `Failed to cache ${url}`,
                error instanceof Error ? error.message : error
              );
            }
          });

          await Promise.allSettled(cachePromises);
          await limitCacheSize(CACHE_NAME, CACHE_MAX_SIZE);
        } catch (error) {
          swLog("error", "Failed to cache URLs", error);
        }
      })()
    );
  }
});

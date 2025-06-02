// Simple Service Worker for PWA functionality
// Version 1.0.0

const CACHE_NAME = 'lyovson-cache-v1'
const OFFLINE_URL = '/offline'

// Essential URLs to cache
const urlsToCache = ['/', '/offline', '/posts', '/projects', '/rafa', '/jess', '/manifest.json']

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  console.log('Service Worker: Install')

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching essential resources')
      return cache.addAll(urlsToCache)
    }),
  )

  // Skip waiting to activate immediately
  self.skipWaiting()
})

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activate')

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName)
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )

  // Take control of all clients
  self.clients.claim()
})

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return

  // Skip non-HTTP(S) requests
  if (!event.request.url.startsWith('http')) return

  // Skip API requests
  if (event.request.url.includes('/api/')) return

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached version if available
      if (cachedResponse) {
        return cachedResponse
      }

      // Otherwise, fetch from network
      return fetch(event.request)
        .then((networkResponse) => {
          // Cache successful responses
          if (networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseClone = networkResponse.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone)
            })
          }
          return networkResponse
        })
        .catch(() => {
          // If network fails and no cache, show offline page for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL)
          }

          // For other requests, return a generic offline response
          return new Response('Offline', {
            status: 503,
            statusText: 'Service Unavailable',
          })
        })
    }),
  )
})

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data)

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0]?.postMessage({ version: '1.0.0' })
  }

  if (event.data && event.data.type === 'CACHE_URLS') {
    const urls = event.data.payload || []
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(urls)
      }),
    )
  }
})

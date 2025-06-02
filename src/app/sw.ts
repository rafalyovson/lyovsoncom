/// <reference types="@serwist/sw" />
/// <reference lib="webworker" />

import { defaultCache } from '@serwist/next/worker'
import { installSerwist } from '@serwist/sw'
import type { PrecacheEntry } from '@serwist/precaching'

declare const self: ServiceWorkerGlobalScope & {
  __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
}

// Install Serwist with default configuration
installSerwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  fallbacks: {
    entries: [
      {
        url: '/offline',
        revision: '1',
        matcher({ request }) {
          return request.destination === 'document'
        },
      },
    ],
  },
})

// Custom service worker logic for additional PWA features

// Handle background sync
self.addEventListener('sync', (event: SyncEvent) => {
  console.log('Service Worker: Background sync', event.tag)

  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Add your background sync logic here
      Promise.resolve().then(() => {
        console.log('Performing background sync...')
      }),
    )
  }
})

// Handle push notifications
self.addEventListener('push', (event: PushEvent) => {
  console.log('Service Worker: Push received')

  if (event.data) {
    try {
      const data = event.data.json()

      const options = {
        body: data.body || 'New notification from Lyovson.com',
        icon: '/android-chrome-192x192.png',
        badge: '/android-chrome-192x192.png',
        data: {
          dateOfArrival: Date.now(),
          primaryKey: data.primaryKey || '1',
          url: data.url || '/',
        },
        actions: [
          {
            action: 'explore',
            title: 'Go to site',
            icon: '/android-chrome-192x192.png',
          },
          {
            action: 'close',
            title: 'Close notification',
            icon: '/android-chrome-192x192.png',
          },
        ],
        requireInteraction: false,
        silent: false,
      }

      event.waitUntil(self.registration.showNotification(data.title || 'Lyovson.com', options))
    } catch (error) {
      console.error('Error parsing push data:', error)

      // Fallback notification
      event.waitUntil(
        self.registration.showNotification('New update from Lyovson.com', {
          body: 'Check out the latest content!',
          icon: '/android-chrome-192x192.png',
          data: { url: '/' },
        }),
      )
    }
  }
})

// Handle notification clicks
self.addEventListener('notificationclick', (event: NotificationEvent) => {
  console.log('Service Worker: Notification click received.')

  event.notification.close()

  const urlToOpen = event.notification.data?.url || '/'

  if (event.action === 'explore') {
    event.waitUntil(self.clients.openWindow(urlToOpen))
  } else if (event.action === 'close') {
    // Notification is already closed
    return
  } else {
    // Default action - open the app
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then((clientList) => {
        // If a Window tab matching the target URL already exists, focus it
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus()
          }
        }
        // If no existing window, open a new one
        if (self.clients.openWindow) {
          return self.clients.openWindow(urlToOpen)
        }
      }),
    )
  }
})

// Handle messages from the main thread
self.addEventListener('message', (event: ExtendableMessageEvent) => {
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
      caches.open('user-cache-v1').then((cache) => {
        return cache.addAll(urls)
      }),
    )
  }
})

// Handle install event for additional setup
self.addEventListener('install', (event: ExtendableEvent) => {
  console.log('Service Worker: Custom install logic')

  event.waitUntil(
    caches.open('lyovson-cache-v1').then((cache) => {
      return cache.addAll(['/', '/offline', '/posts', '/projects', '/rafa', '/jess'])
    }),
  )
})

// Handle activate event for cleanup
self.addEventListener('activate', (event: ExtendableEvent) => {
  console.log('Service Worker: Custom activate logic')

  const cacheWhitelist = ['lyovson-cache-v1', 'user-cache-v1']

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Service Worker: Deleting old cache', cacheName)
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})

export {}

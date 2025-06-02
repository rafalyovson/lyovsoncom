'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

type BeforeInstallPromptEvent = Event & {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }
}

export function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isServiceWorkerReady, setIsServiceWorkerReady] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      const isIOSStandalone = (window.navigator as any).standalone === true
      setIsInstalled(isStandalone || isIOSStandalone)
    }

    // Check if device is iOS
    const checkIfIOS = () => {
      const userAgent = window.navigator.userAgent
      const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream
      setIsIOS(isIOSDevice)
    }

    // Register service worker
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
          })
          console.log('Service Worker registered:', registration)
          setIsServiceWorkerReady(true)

          // Check for updates
          registration.addEventListener('updatefound', () => {
            console.log('Service Worker update found')
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('New service worker installed, ready to update')
                }
              })
            }
          })
        } catch (error) {
          console.error('Service Worker registration failed:', error)
        }
      }
    }

    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    // Handle app installed event
    const handleAppInstalled = () => {
      console.log('PWA was installed')
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
    }

    checkIfInstalled()
    checkIfIOS()
    registerServiceWorker()

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === 'accepted') {
        console.log('User accepted the install prompt')
      } else {
        console.log('User dismissed the install prompt')
      }

      setDeferredPrompt(null)
      setIsInstallable(false)
    } catch (error) {
      console.error('Error during install:', error)
    }
  }

  // Don't show anything if already installed
  if (isInstalled) {
    return null
  }

  // iOS specific instructions
  if (isIOS && !isInstalled) {
    return (
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Install Lyovson.com
            </h3>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
              To install this app on your iOS device, tap the share button{' '}
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs bg-blue-100 dark:bg-blue-800 rounded">
                ⎋
              </span>{' '}
              and then &ldquo;Add to Home Screen&rdquo;{' '}
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs bg-blue-100 dark:bg-blue-800 rounded">
                ➕
              </span>
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Standard install prompt for other browsers
  if (isInstallable && deferredPrompt) {
    return (
      <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                Install Lyovson.com
              </h3>
              <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                Get faster access and offline support by installing our app.
              </p>
            </div>
          </div>
          <Button
            onClick={handleInstallClick}
            size="sm"
            className="ml-4 bg-green-600 hover:bg-green-700 text-white"
          >
            Install
          </Button>
        </div>
      </div>
    )
  }

  // Show service worker status for development
  if (process.env.NODE_ENV === 'development' && isServiceWorkerReady) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 mb-4 text-xs text-gray-600 dark:text-gray-400">
        PWA Service Worker Ready ✅ - Offline support enabled
      </div>
    )
  }

  return null
}

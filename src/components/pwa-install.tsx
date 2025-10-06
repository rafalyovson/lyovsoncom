"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

// iOS device detection regex
const IOS_DEVICE_REGEX = /iPad|iPhone|iPod/;

type BeforeInstallPromptEvent = Event & {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
};

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isServiceWorkerReady, setIsServiceWorkerReady] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia(
        "(display-mode: standalone)"
      ).matches;
      const isIOSStandalone = (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone || isIOSStandalone);
    };

    // Check if device is iOS
    const checkIfIOS = () => {
      const userAgent = window.navigator.userAgent;
      const isIOSDevice =
        IOS_DEVICE_REGEX.test(userAgent) && !(window as any).MSStream;
      setIsIOS(isIOSDevice);
    };

    // Register service worker
    const registerServiceWorker = async () => {
      if ("serviceWorker" in navigator) {
        try {
          const registration = await navigator.serviceWorker.register(
            "/sw.js",
            {
              scope: "/",
            }
          );
          setIsServiceWorkerReady(true);

          // Check for updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  // Service worker updated - could notify user to reload
                }
              });
            }
          });
        } catch (_error) {
          // Service worker registration failed - PWA features unavailable
        }
      }
    };

    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    // Handle app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    checkIfInstalled();
    checkIfIOS();
    registerServiceWorker();

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    try {
      await deferredPrompt.prompt();
      await deferredPrompt.userChoice;

      // User choice handled - cleanup state regardless of outcome
      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (_error) {
      // Install prompt failed - reset state
    }
  };

  // Don't show anything if already installed
  if (isInstalled) {
    return null;
  }

  // iOS specific instructions
  if (isIOS && !isInstalled) {
    return (
      <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                clipRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                fillRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-blue-800 text-sm dark:text-blue-200">
              Install Lyovson.com
            </h3>
            <p className="mt-1 text-blue-700 text-sm dark:text-blue-300">
              To install this app on your iOS device, tap the share button{" "}
              <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-blue-100 text-xs dark:bg-blue-800">
                ⎋
              </span>{" "}
              and then &ldquo;Add to Home Screen&rdquo;{" "}
              <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-blue-100 text-xs dark:bg-blue-800">
                ➕
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Standard install prompt for other browsers
  if (isInstallable && deferredPrompt) {
    return (
      <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
        <div className="flex items-center justify-between">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  clipRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                  fillRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-green-800 text-sm dark:text-green-200">
                Install Lyovson.com
              </h3>
              <p className="mt-1 text-green-700 text-sm dark:text-green-300">
                Get faster access and offline support by installing our app.
              </p>
            </div>
          </div>
          <Button
            className="ml-4 bg-green-600 text-white hover:bg-green-700"
            onClick={handleInstallClick}
            size="sm"
          >
            Install
          </Button>
        </div>
      </div>
    );
  }

  // Show service worker status for development
  if (process.env.NODE_ENV === "development" && isServiceWorkerReady) {
    return (
      <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-2 text-gray-600 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
        PWA Service Worker Ready ✅ - Offline support enabled
      </div>
    );
  }

  return null;
}

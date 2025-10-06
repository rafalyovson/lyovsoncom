"use client";

import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-md p-8 text-center">
        <div className="mb-6">
          <svg
            aria-label="Clock icon"
            className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-600"
            fill="none"
            role="img"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>Offline indicator</title>
            <path
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
            />
          </svg>
        </div>

        <h1 className="mb-4 font-bold text-3xl text-gray-900 dark:text-white">
          You&apos;re Offline
        </h1>

        <p className="mb-6 text-gray-600 dark:text-gray-300">
          It looks like you&apos;ve lost your internet connection. Don&apos;t
          worry, you can still browse cached pages and content you&apos;ve
          visited before.
        </p>

        <div className="space-y-4">
          <Link
            className="inline-block w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-blue-700"
            href="/"
          >
            Go to Homepage
          </Link>

          <button
            className="inline-block w-full rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            onClick={() => window.location.reload()}
            type="button"
          >
            Refresh Page
          </button>
        </div>

        <div className="mt-8 text-gray-500 text-sm dark:text-gray-400">
          <p>
            This page works offline thanks to our Progressive Web App
            technology.
          </p>
        </div>
      </div>
    </main>
  );
}

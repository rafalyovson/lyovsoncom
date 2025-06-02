import { Metadata } from 'next/types'
import Link from 'next/link'

export default function OfflinePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md mx-auto text-center p-8">
        <div className="mb-6">
          <svg
            className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          You&apos;re Offline
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          It looks like you&apos;ve lost your internet connection. Don&apos;t worry, you can still
          browse cached pages and content you&apos;ve visited before.
        </p>

        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Go to Homepage
          </Link>

          <a
            href=""
            className="inline-block w-full px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            Refresh Page
          </a>
        </div>

        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>This page works offline thanks to our Progressive Web App technology.</p>
        </div>
      </div>
    </main>
  )
}

export const metadata: Metadata = {
  title: "Offline - You're not connected | Lyovson.com",
  description:
    'You are currently offline. This page helps you navigate while disconnected from the internet.',
  robots: {
    index: false, // Don't index offline pages
    follow: false,
    noarchive: true,
  },
}

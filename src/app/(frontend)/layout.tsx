import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { cn } from 'src/utilities/cn'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'
import { draftMode } from 'next/headers'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Providers } from '@/providers'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import { Grid } from '@/components/grid'
import { Toaster } from '@/components/ui/sonner'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>{/* Icon and manifest links are now managed by the metadata object below */}</head>
      <body>
        <Providers>
          <LivePreviewListener />
          <Grid>{children}</Grid>
          <Toaster />
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  title: {
    default: 'Lyovson.com',
    template: '%s | Lyovson.com',
  },
  description:
    'Website and blog of Rafa and Jess Lyovson — featuring writing, projects, and research.',
  applicationName: 'Lyovson.com',
  authors: [
    { name: 'Rafa Lyovson', url: `${getServerSideURL()}/rafa` },
    { name: 'Jess Lyovson', url: `${getServerSideURL()}/jess` },
  ],
  generator: 'Next.js',
  keywords: ['programming', 'writing', 'design', 'philosophy', 'research', 'projects'],
  referrer: 'origin-when-cross-origin',
  creator: 'Rafa & Jess Lyovson',
  publisher: 'Lyovson.com',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
  icons: [
    { rel: 'apple-touch-icon', sizes: '180x180', url: '/apple-touch-icon.png' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', url: '/favicon-32x32.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', url: '/favicon-16x16.png' },
    { rel: 'shortcut icon', url: '/favicon.ico' },
  ],
  // Use hex equivalents of your theme colors for better compatibility
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' }, // Light mode background
    { media: '(prefers-color-scheme: dark)', color: '#121212' }, // Dark mode background
  ],
  colorScheme: 'light dark',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 2,
  },
  openGraph: mergeOpenGraph({
    type: 'website',
    locale: 'en_US',
    url: getServerSideURL(),
    siteName: 'Lyovson.com',
    title: 'Lyovson.com',
    description:
      'Website and blog of Rafa and Jess Lyovson — featuring writing, projects, and research.',
  }),
  twitter: {
    card: 'summary_large_image',
    creator: '@lyovson',
    site: '@lyovson',
  },
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': `${getServerSideURL()}/feed.xml`,
    },
  },
}

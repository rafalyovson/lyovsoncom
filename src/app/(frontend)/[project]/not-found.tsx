import React from 'react'
import { Metadata } from 'next/types'

import { GridCardNotFound, GridCardNav } from '@/components/grid'

export default function NotFound() {
  return (
    <>
      <GridCardNotFound />
    </>
  )
}

export const metadata: Metadata = {
  title: 'Project Not Found (404) | Lyovson.com',
  description:
    'The project you are looking for could not be found. Browse our available projects and latest content on Lyovson.com.',
  keywords: ['404', 'not found', 'project not found', 'Lyovson.com'],
  alternates: {
    canonical: '/404', // Canonical for 404 pages
  },
  openGraph: {
    title: 'Project Not Found (404)',
    description:
      'The project you are looking for could not be found. Browse our available projects instead.',
    type: 'website',
    url: '/404',
  },
  twitter: {
    card: 'summary',
    title: 'Project Not Found (404)',
    description: 'The project you are looking for could not be found.',
    site: '@lyovson',
  },
  robots: {
    index: false, // Don't index 404 pages
    follow: true, // But follow links from them
    noarchive: true,
  },
}

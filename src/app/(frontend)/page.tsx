import { CollectionArchive } from '@/components/CollectionArchive'
import { Pagination } from '@/components/Pagination'
import { SkeletonGrid } from '@/components/grid/skeleton'
import { Skeleton } from '@/components/ui/skeleton'
import { getLatestPosts } from '@/utilities/get-post'
import type { Metadata } from 'next/types'
import { Suspense } from 'react'
import { unstable_cacheTag as cacheTag, unstable_cacheLife as cacheLife } from 'next/cache'
import { PWAInstall } from '@/components/pwa-install'

export default async function Page() {
  'use cache'
  cacheTag('homepage')
  cacheTag('posts')
  cacheLife('posts')

  const posts = await getLatestPosts(12)

  return (
    <>
      {/* <PWAInstall /> */}

      <Suspense fallback={<SkeletonGrid />}>
        <CollectionArchive posts={posts.docs} />
      </Suspense>

      <div className="container">
        {posts.totalPages > 1 && posts.page && (
          <Suspense fallback={<Skeleton className="h-10 w-64 mx-auto mt-4" />}>
            <Pagination page={posts.page} totalPages={posts.totalPages} />
          </Suspense>
        )}
      </div>
    </>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Lyovson.com',
    description:
      'Official website of Rafa and Jess Lyovson — featuring writing, projects, and research on programming, design, philosophy, and technology.',
    keywords: [
      'Rafa Lyovson',
      'Jess Lyovson',
      'programming',
      'writing',
      'design',
      'philosophy',
      'research',
      'projects',
      'technology',
      'blog',
    ],
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: 'Lyovson.com - Writing, Projects & Research',
      description:
        'Official website of Rafa and Jess Lyovson featuring writing, projects, and research on programming, design, philosophy, and technology.',
      type: 'website',
      url: '/',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Lyovson.com - Writing, Projects & Research',
      description:
        'Official website of Rafa and Jess Lyovson featuring writing, projects, and research on programming, design, philosophy, and technology.',
      creator: '@lyovson',
      site: '@lyovson',
    },
    other: {
      'article:author': 'Rafa Lyovson, Jess Lyovson',
      'application-name': 'Lyovson.com',
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'black-translucent',
      'apple-mobile-web-app-title': 'Lyovson.com',
      'msapplication-TileColor': '#000000',
      'msapplication-config': '/browserconfig.xml',
      'theme-color': '#000000',
    },
  }
}

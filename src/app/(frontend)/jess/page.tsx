import { GridCardHeader, GridCardPost } from '@/components/grid'
import configPromise from '@payload-config'
import type { Metadata } from 'next/types'
import { getPayload } from 'payload'
import { Suspense } from 'react'

const getPosts = async () => {
  'use cache'

  const payload = await getPayload({ config: configPromise })

  return await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: false,
  })
}

export default async function PlaygroundGrid() {
  const posts = await getPosts()

  return (
    <>
      <GridCardHeader className={``} />
      <Suspense fallback={<div>Loading...</div>}>
        {posts.docs.map((post) => (
          <GridCardPost key={post.slug} post={post} />
        ))}
      </Suspense>
    </>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Payload Website Template Posts`,
    description: `A collection of posts from the Payload Website Template`,
  }
}

import { GridCardPost } from '@/components/grid'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { Metadata } from 'next/types'
import { Suspense } from 'react'

const getPosts = async () => {
  'use cache'
  console.log('🐙')
  const payload = await getPayload({ config: configPromise })

  return payload.find({
    collection: 'posts',
    limit: 12,
  })
}

export default async function PlaygroundGrid() {
  const posts = await getPosts()

  return (
    <>
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

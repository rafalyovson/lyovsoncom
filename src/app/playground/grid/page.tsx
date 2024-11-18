import { Grid, GridCardHero, GridCardNav, GridCardPost } from '@/components/grid'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

import type { Metadata } from 'next/types'

export default async function PlaygroundGrid() {
  const payload = await getPayloadHMR({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    limit: 12,
  })

  return (
    <Grid>
      <GridCardHero />
      <GridCardNav />
      {posts.docs.map((post) => (
        <GridCardPost key={post.slug} post={post} />
        // <div key={post.slug}>{post.title}</div>
      ))}
    </Grid>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Payload Website Template Posts`,
    description: `A collection of posts from the Payload Website Template`,
  }
}

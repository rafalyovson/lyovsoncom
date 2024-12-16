import type { Metadata } from 'next'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'
import { GridCardHero } from 'src/components/grid/card/hero'
import { GridCardRelatedPosts } from '@/components/grid/card/related'
import { GridCardHeader } from 'src/components/grid/card/header'
import { notFound } from 'next/navigation'

type Args = {
  params: Promise<{
    project: string
    slug: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { project: projectSlug, slug } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const post = await payload.find({
    collection: 'posts',
    depth: 2,
    where: {
      AND: [
        {
          slug: {
            equals: slug,
          },
        },
        {
          'project.slug': {
            equals: projectSlug,
          },
        },
      ],
    },
  })

  if (!post.docs[0]) {
    return notFound()
  }

  return (
    <>
      <GridCardHeader
        className={`g2:col-start-1 g2:col-end-2 g2:row-start-1 g2:row-end-2 g4:h-[400px] g4:self-start`}
      />
      <GridCardHero
        post={post.docs[0]}
        className={`g2:col-start-2 g2:col-end-3 g2:row-start-1 g2:row-end-2 g3:col-start-2 g3:col-end-4 g4:self-start`}
      />

      <div className="g2:col-start-2 g2:col-end-4 g2:row-start-2 g2:row-auto">
        <RichText className="h-full" content={post.docs[0].content} enableGutter={true} />
      </div>
      <div
        className={`g2:col-start-1 g2:col-end-2 g2:row-start-2 g2:row-end-3 g2:self-start g4:col-start-4 g4:col-end-5 g4:row-start-1 g4:row-end-2`}
      >
        {post.docs[0].relatedPosts && post.docs[0].relatedPosts.length > 0 && (
          <GridCardRelatedPosts posts={post.docs[0].relatedPosts} />
        )}
      </div>
    </>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { project: projectSlug, slug } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const post = await payload.find({
    collection: 'posts',
    depth: 1,
    where: {
      AND: [
        {
          slug: {
            equals: slug,
          },
        },
        {
          'project.slug': {
            equals: projectSlug,
          },
        },
      ],
    },
  })

  if (!post.docs[0]) return {}

  return {
    title: `${post.docs[0].meta?.title || post.docs[0].title}`,
    description: post.docs[0].meta?.description,
  }
}

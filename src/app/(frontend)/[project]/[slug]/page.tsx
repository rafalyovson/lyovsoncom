import type { Metadata } from 'next'
import React from 'react'
import RichText from '@/components/RichText'
import { GridCardHero } from 'src/components/grid/card/hero'
import { GridCardRelatedPosts } from '@/components/grid/card/related'
import { GridCardHeader } from 'src/components/grid/card/header'
import { notFound } from 'next/navigation'
import { getProject } from '@/utilities/get-project'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

type Args = {
  params: Promise<{
    project: string
    slug: string
  }>
}

export const dynamicParams = false

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const projects = await payload.find({
    collection: 'projects',
    limit: 1000,
  })

  const paths: { project: string; slug: string }[] = []

  for (const project of projects.docs) {
    if (project.slug) {
      const posts = await payload.find({
        collection: 'posts',
        where: {
          'project.id': {
            equals: project.id,
          },
        },
        limit: 1000,
      })

      for (const post of posts.docs) {
        if (post.slug) {
          paths.push({
            project: project.slug,
            slug: post.slug,
          })
        }
      }
    }
  }

  return paths
}

export default async function Post({ params: paramsPromise }: Args) {
  const { project: projectSlug, slug } = await paramsPromise

  const project = await getProject(projectSlug)
  if (!project) {
    return notFound()
  }

  const payload = await getPayload({ config: configPromise })
  const response = await payload.find({
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

  if (!response || !response.docs || response.docs.length === 0) {
    return notFound()
  }

  const post = response.docs[0]
  if (!post || !post.content) {
    return notFound()
  }

  return (
    <>
      <GridCardHeader
        className={`g2:col-start-1 g2:col-end-2 g2:row-start-1 g2:row-end-2 g4:h-[400px] g4:self-start`}
      />
      <GridCardHero
        post={post}
        className={`g2:col-start-2 g2:col-end-3 g2:row-start-1 g2:row-end-2 g3:col-start-2 g3:col-end-4 g4:self-start`}
      />
      <div className="g2:col-start-2 g2:col-end-4 g2:row-start-2 g2:row-auto">
        <RichText className="h-full" content={post.content} enableGutter={true} />
      </div>
      <div
        className={`g2:col-start-1 g2:col-end-2 g2:row-start-2 g2:row-end-3 g2:self-start g4:col-start-4 g4:col-end-5 g4:row-start-1 g4:row-end-2`}
      >
        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <GridCardRelatedPosts posts={post.relatedPosts} />
        )}
      </div>
    </>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { project: projectSlug, slug } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const response = await payload.find({
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

  if (!response || !response.docs || response.docs.length === 0) {
    return {
      title: 'Not Found | Lyovson.com',
      description: 'The requested project could not be found',
    }
  }

  const { docs } = response

  return {
    title: `${docs[0].meta?.title || docs[0].title} | Lyovson.com`,
    description: docs[0].meta?.description,
  }
}

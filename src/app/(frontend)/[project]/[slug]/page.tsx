import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { Suspense } from 'react'
import { GridCardHero } from 'src/components/grid/card/hero'
import { unstable_cacheTag as cacheTag, unstable_cacheLife as cacheLife } from 'next/cache'

import { GridCardRelatedPosts } from '@/components/grid/card/related'
import RichText from '@/components/RichText'
import { Skeleton } from '@/components/ui/skeleton'
import { getProject } from '@/utilities/get-project'
import { getPostByProjectAndSlug } from '@/utilities/get-post'
import { GridCardNav } from 'src/components/grid/card/nav'

type Args = {
  params: Promise<{
    project: string
    slug: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  'use cache'

  const { project: projectSlug, slug } = await paramsPromise

  // Add cache tags for this specific post and project
  cacheTag('posts')
  cacheTag(`post-${slug}`)
  cacheTag(`project-${projectSlug}`)
  cacheLife('posts')

  const project = await getProject(projectSlug)
  if (!project) {
    return notFound()
  }

  const post = await getPostByProjectAndSlug(projectSlug, slug)
  if (!post || !post.content) {
    return notFound()
  }

  return (
    <>
      <SchemaArticle post={post} url={`https://lyovson.com/${projectSlug}/${slug}`} />
      <GridCardNav
        className={`g2:col-start-1 g2:col-end-2 g2:row-start-1 g2:row-end-2 g4:h-[400px] g4:self-start`}
      />
      <GridCardHero
        post={post}
        className={`g2:col-start-2 g2:col-end-3 g2:row-start-1 g2:row-end-2 g3:col-start-2 g3:col-end-4 g4:self-start`}
      />
      <div className="g2:col-start-2 g2:col-end-3 g2:row-start-2 g2:row-auto w-[400px] g3:w-[816px] g3:col-end-4 border p-4 rounded-lg">
        <RichText
          className="h-full "
          content={post.content}
          enableGutter={false}
          enableProse={true}
        />
      </div>
      <div
        className={`g2:col-start-1 g2:col-end-2 g2:row-start-2 g2:row-end-3 g2:self-start g4:col-start-4 g4:col-end-5 g4:row-start-1 g4:row-end-2`}
      >
        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <GridCardRelatedPosts posts={post.relatedPosts} />
          </Suspense>
        )}
      </div>
    </>
  )
}

export async function generateStaticParams() {
  'use cache'
  cacheTag('posts')
  cacheTag('projects')
  cacheLife('static') // Build-time data doesn't change often

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

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  'use cache'

  const { project: projectSlug, slug } = await paramsPromise

  // Add cache tags for metadata
  cacheTag('posts')
  cacheTag(`post-${slug}`)
  cacheTag(`project-${projectSlug}`)
  cacheLife('posts')

  const post = await getPostByProjectAndSlug(projectSlug, slug)
  if (!post) {
    return {
      title: 'Not Found | Lyovson.com',
      description: 'The requested project could not be found',
    }
  }

  const title = post.meta?.title || post.title
  const description = post.meta?.description || ''

  // Handle both cases: when image is a media object or just an ID
  const metaImage = post.meta?.image && typeof post.meta.image === 'object' ? post.meta.image : null

  // Keep URLs relative since metadataBase is set in layout
  let imageUrl: string | null = null
  if (metaImage?.url) {
    // If URL starts with http, keep it absolute, otherwise keep just the path
    imageUrl = metaImage.url.startsWith('http') ? metaImage.url : metaImage.url
  }

  const ogImageAlt = metaImage?.alt || title

  // Fix the topic mapping
  const keywords = post.topics
    ?.map((topic) => {
      if (typeof topic === 'object' && topic !== null) {
        return topic.name || topic.slug || ''
      }
      return ''
    })
    .filter(Boolean)

  // Relative URL path - metadataBase will be prepended automatically
  const canonicalUrl = `/${projectSlug}/${slug}`

  return {
    title: `${title} | Lyovson.com`,
    description,
    keywords: keywords?.join(', '),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl, // Let metadataBase handle the domain
      siteName: 'Lyovson.com',
      images: imageUrl
        ? [
            {
              url: imageUrl, // Relative URL since metadataBase is set
              width: 1200,
              height: 630,
              alt: ogImageAlt || '',
            },
          ]
        : undefined,
      locale: 'en_US',
      type: 'article',
      publishedTime: post.publishedAt || undefined,
      modifiedTime: post.updatedAt || undefined,
      authors: post.populatedAuthors?.map((author) => `/${author.username}`) || [], // Make author URLs relative
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  }
}

function SchemaArticle({ post, url }: { post: any; url: string }) {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.meta?.title || post.title,
    description: post.meta?.description || '',
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author:
      post.populatedAuthors?.map((a: any) => ({
        '@type': 'Person',
        name: a.name,
        url: `https://lyovson.com/${a.username}`,
      })) || [],
    image: post.meta?.image?.url,
    url,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  )
}

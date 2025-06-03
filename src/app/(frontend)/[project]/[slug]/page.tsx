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
import { getServerSideURL } from '@/utilities/getURL'

// Helper function to extract text from rich content
function extractTextFromContent(content: any): string {
  if (!content) return ''

  if (typeof content === 'string') return content

  if (Array.isArray(content)) {
    return content.map(extractTextFromContent).join(' ')
  }

  if (typeof content === 'object') {
    if (content.text) return content.text
    if (content.children) return extractTextFromContent(content.children)
    if (content.content) return extractTextFromContent(content.content)
  }

  return ''
}

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

      <GridCardHero
        post={post}
        className={`g2:col-start-2 g2:col-end-3 g2:row-start-1 g2:row-end-2 g3:col-start-2 g3:col-end-4 g4:self-start`}
      />
      <article className="g2:col-start-2 g2:col-end-3 g2:row-start-2 g2:row-auto w-[400px] g3:w-[816px] g3:col-end-4 glass-card glass-interactive p-6  rounded-lg ">
        <div className="prose prose-lg max-w-none glass-stagger-3 prose-headings:glass-text prose-p:glass-text prose-a:glass-text prose-li:glass-text prose-blockquote:glass-text-secondary">
          <RichText
            className="h-full"
            content={post.content}
            enableGutter={false}
            enableProse={true}
          />
        </div>
      </article>

      <aside
        className={`g2:col-start-1 g2:col-end-2 g2:row-start-2 g2:row-end-3 g2:self-start g4:col-start-4 g4:col-end-5 g4:row-start-1 g4:row-end-2`}
      >
        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <Suspense
            fallback={
              <div className="glass-section glass-loading w-[400px] h-[400px] rounded-xl animate-pulse">
                <Skeleton className="h-full w-full glass-badge" />
              </div>
            }
          >
            <GridCardRelatedPosts posts={post.relatedPosts} />
          </Suspense>
        )}
      </aside>
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
      site: '@lyovson',
      creator: post.populatedAuthors?.[0]?.username
        ? `@${post.populatedAuthors[0].username}`
        : '@lyovson',
      title,
      description,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: ogImageAlt || '',
              width: 1200,
              height: 630,
            },
          ]
        : undefined,
    },
    other: {
      // Only include defined values to satisfy TypeScript
      ...(process.env.FACEBOOK_APP_ID ? { 'fb:app_id': process.env.FACEBOOK_APP_ID } : {}),
      ...(post.populatedAuthors?.length
        ? { 'article:author': post.populatedAuthors.map((author) => author.name).join(', ') }
        : {}),
      ...(post.publishedAt ? { 'article:published_time': post.publishedAt } : {}),
      ...(post.updatedAt ? { 'article:modified_time': post.updatedAt } : {}),
      ...(post.project && typeof post.project === 'object' && post.project.slug
        ? { 'article:section': post.project.slug }
        : {}),
      ...(keywords?.length ? { 'article:tag': keywords.join(', ') } : {}),
      // AI-specific meta tags for individual articles
      'ai-content-type': 'article',
      'ai-content-license': 'attribution-required',
      'ai-content-language': 'en',
      'ai-word-count': post.content
        ? Math.ceil(extractTextFromContent(post.content).split(' ').length).toString()
        : '0',
      'ai-reading-time': post.content
        ? Math.ceil(extractTextFromContent(post.content).split(' ').length / 200).toString()
        : '0',
      'ai-api-url': `${getServerSideURL()}/api/posts/${post.id}`,
      'ai-embedding-url': `${getServerSideURL()}/api/embeddings/posts/${post.id}`,
      ...(post.project && typeof post.project === 'object' && post.project.slug
        ? { 'ai-project': post.project.slug }
        : {}),
      ...(keywords?.length ? { 'ai-topics': keywords.join(',') } : {}),
      ...(post.populatedAuthors?.length
        ? {
            'ai-authors': post.populatedAuthors
              .map((author) => author.username || author.name)
              .join(','),
          }
        : {}),
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
        sameAs: a.socialLinks ? Object.values(a.socialLinks).filter(Boolean) : undefined,
      })) || [],
    publisher: {
      '@type': 'Organization',
      name: 'Lyovson.com',
      url: 'https://lyovson.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://lyovson.com/logo-black.webp',
        width: 600,
        height: 60,
      },
      sameAs: ['https://twitter.com/lyovson', 'https://github.com/lyovson'],
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    image: post.meta?.image?.url
      ? {
          '@type': 'ImageObject',
          url: post.meta.image.url,
          width: 1200,
          height: 630,
          alt: post.meta.image.alt || post.title,
        }
      : undefined,
    url,
    inLanguage: 'en-US',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Lyovson.com',
      url: 'https://lyovson.com',
    },
    about:
      post.topics
        ?.map((topic: any) => (typeof topic === 'object' ? topic.name || topic.slug : topic))
        .filter(Boolean)
        .map((name: string) => ({
          '@type': 'Thing',
          name,
        })) || undefined,
    keywords:
      post.topics
        ?.map((topic: any) => (typeof topic === 'object' ? topic.name || topic.slug : topic))
        .filter(Boolean)
        .join(', ') || undefined,
    articleSection:
      post.project && typeof post.project === 'object' ? post.project.slug : undefined,
    ...(post.content && {
      wordCount: post.content.length ? Math.ceil(post.content.length / 5) : undefined,
    }),
    ...(post.content && {
      timeRequired: post.content.length
        ? `PT${Math.max(1, Math.ceil(post.content.length / 5 / 200))}M`
        : undefined,
    }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  )
}

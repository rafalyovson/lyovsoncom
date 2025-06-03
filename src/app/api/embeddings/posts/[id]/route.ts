import { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { unstable_cacheTag as cacheTag, unstable_cacheLife as cacheLife } from 'next/cache'
import { generateEmbedding, extractPostText } from '@/utilities/generate-embedding'

type Args = {
  params: Promise<{
    id: string
  }>
}

export async function GET(request: NextRequest, { params: paramsPromise }: Args) {
  const { id } = await paramsPromise
  const { searchParams } = new URL(request.url)
  const includeContent = searchParams.get('content') === 'true'
  const format = searchParams.get('format') || 'full' // 'full', 'vector-only', 'metadata-only'
  const regenerate = searchParams.get('regenerate') === 'true' // Force regenerate

  const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://lyovson.com'

  try {
    const payload = await getPayload({ config: configPromise })

    const post = await payload.findByID({
      collection: 'posts',
      id: parseInt(id),
      depth: 2,
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        meta: true,
        topics: true,
        project: true,
        populatedAuthors: true,
        publishedAt: true,
        updatedAt: true,
        embedding: true, // Include pre-computed embedding
      },
    })

    if (!post) {
      return new Response(
        JSON.stringify({
          error: 'Post not found',
          id: parseInt(id),
          timestamp: new Date().toISOString(),
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=300', // Short cache for 404s
          },
        },
      )
    }

    // Use pre-computed embedding if available and not forcing regeneration
    let embedding: number[] = []
    let model = 'unknown'
    let dimensions = 0
    let isPrecomputed = false

    if ((post as any).embedding?.vector && !regenerate) {
      // Use pre-computed embedding
      embedding = (post as any).embedding.vector
      model = (post as any).embedding.model || 'pre-computed'
      dimensions = (post as any).embedding.dimensions || embedding.length
      isPrecomputed = true
    } else {
      // Generate on-demand (fallback or forced regeneration)
      const textContent = extractPostText(post)

      if (!textContent.trim()) {
        return new Response(
          JSON.stringify({
            error: 'No content available for embedding',
            id: parseInt(id),
            timestamp: new Date().toISOString(),
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }

      const result = await generateEmbedding(textContent)
      embedding = result.vector
      model = result.model
      dimensions = result.dimensions
    }

    // Extract text content for metadata
    const textContent = extractPostText(post)

    // Build comprehensive metadata
    const metadata = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      url:
        post.project && typeof post.project === 'object'
          ? `${SITE_URL}/${post.project.slug}/${post.slug}`
          : `${SITE_URL}/posts/${post.slug}`,
      publishedAt: post.publishedAt,
      lastModified: post.updatedAt,
      wordCount: textContent.split(' ').length,
      readingTime: Math.ceil(textContent.split(' ').length / 200),
      authors: post.populatedAuthors?.map((author: any) => ({
        name: author.name,
        username: author.username,
        url: `${SITE_URL}/${author.username}`,
      })),
      project:
        post.project && typeof post.project === 'object'
          ? {
              name: post.project.name,
              slug: post.project.slug,
              url: `${SITE_URL}/${post.project.slug}`,
            }
          : null,
      topics: post.topics
        ?.map((t: any) => (typeof t === 'object' ? { name: t.name, slug: t.slug } : t))
        .filter(Boolean),
      ...(includeContent && { content: textContent }),
      isPrecomputed,
      embeddingGeneratedAt: isPrecomputed
        ? (post as any).embedding?.generatedAt
        : new Date().toISOString(),
    }

    // Return different formats based on request
    let response: any

    switch (format) {
      case 'vector-only':
        response = {
          id: post.id,
          embedding,
          dimensions,
          model,
          isPrecomputed,
        }
        break

      case 'metadata-only':
        response = {
          id: post.id,
          metadata,
          wordCount: textContent.split(' ').length,
          readingTime: Math.ceil(textContent.split(' ').length / 200),
          isPrecomputed,
        }
        break

      default: // 'full'
        response = {
          id: post.id,
          embedding,
          dimensions,
          metadata,
          model,
          usage: {
            tokensProcessed: textContent.length,
            includeContent,
            format,
            isPrecomputed,
          },
          api: {
            vectorOnly: `${SITE_URL}/api/embeddings/posts/${id}?format=vector-only`,
            metadataOnly: `${SITE_URL}/api/embeddings/posts/${id}?format=metadata-only`,
            withContent: `${SITE_URL}/api/embeddings/posts/${id}?content=true`,
            regenerate: `${SITE_URL}/api/embeddings/posts/${id}?regenerate=true`,
          },
          timestamp: new Date().toISOString(),
        }
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': isPrecomputed
          ? 'public, max-age=7200, s-maxage=7200' // Cache pre-computed embeddings longer
          : 'public, max-age=1800, s-maxage=1800', // Cache on-demand embeddings shorter
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        // AI-friendly headers
        'X-Embedding-Model': model,
        'X-Embedding-Dimensions': dimensions.toString(),
        'X-Content-Word-Count': textContent.split(' ').length.toString(),
        'X-Content-Language': 'en',
        'X-Embedding-Source': isPrecomputed ? 'pre-computed' : 'on-demand',
        'X-Embedding-Generated-At': isPrecomputed
          ? (post as any).embedding?.generatedAt || 'unknown'
          : new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Error generating post embedding:', error)

    return new Response(
      JSON.stringify({
        error: 'Failed to generate embedding',
        id: parseInt(id),
        message: 'Please try again later or contact hello@lyovson.com',
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-cache',
        },
      },
    )
  }
}

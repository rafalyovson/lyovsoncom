import { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET(request: NextRequest) {
  const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://lyovson.com'

  try {
    const payload = await getPayload({ config: configPromise })

    // Get embedding statistics
    const [allPosts, postsWithEmbeddings] = await Promise.all([
      payload.find({
        collection: 'posts',
        where: { _status: { equals: 'published' } },
        limit: 0,
        pagination: false,
      }),
      payload.find({
        collection: 'posts',
        where: {
          _status: { equals: 'published' },
          'embedding.vector': { exists: true },
        },
        limit: 0,
        pagination: false,
      }),
    ])

    // Sample a few embeddings to check models
    const sampleEmbeddings = await payload.find({
      collection: 'posts',
      where: {
        _status: { equals: 'published' },
        'embedding.vector': { exists: true },
      },
      limit: 5,
      select: {
        id: true,
        title: true,
        embedding: true,
      },
    })

    const modelStats = sampleEmbeddings.docs.reduce((acc: any, post: any) => {
      const model = post.embedding?.model || 'unknown'
      acc[model] = (acc[model] || 0) + 1
      return acc
    }, {})

    const status = {
      system: {
        healthy: true,
        openaiConfigured: !!process.env.OPENAI_API_KEY,
        preferredModel: process.env.OPENAI_API_KEY ? 'text-embedding-3-small' : 'fallback-hash',
        dimensions: process.env.OPENAI_API_KEY ? 1536 : 384,
      },

      statistics: {
        totalPublishedPosts: allPosts.totalDocs,
        postsWithEmbeddings: postsWithEmbeddings.totalDocs,
        coveragePercentage:
          allPosts.totalDocs > 0
            ? Math.round((postsWithEmbeddings.totalDocs / allPosts.totalDocs) * 100)
            : 0,
        postsNeedingEmbeddings: allPosts.totalDocs - postsWithEmbeddings.totalDocs,
      },

      models: {
        modelsInUse: modelStats,
        sampleSize: sampleEmbeddings.docs.length,
      },

      endpoints: {
        status: `${SITE_URL}/api/embeddings/status`,
        bulk: `${SITE_URL}/api/embeddings?type=posts`,
        individual: `${SITE_URL}/api/embeddings/posts/{id}`,
        query: `${SITE_URL}/api/embeddings?q={text}`,
        documentation: `${SITE_URL}/ai-docs`,
        apiDocs: `${SITE_URL}/api/docs`,
      },

      recommendations: [] as Array<{
        type: 'success' | 'info' | 'warning' | 'error'
        message: string
        action: string
      }>,

      timestamp: new Date().toISOString(),
    }

    // Add recommendations based on status
    if (!process.env.OPENAI_API_KEY) {
      status.recommendations.push({
        type: 'warning',
        message: 'No OpenAI API key configured - using fallback hash-based embeddings',
        action: 'Add OPENAI_API_KEY to environment variables for higher quality embeddings',
      })
    }

    if (status.statistics.coveragePercentage < 100) {
      status.recommendations.push({
        type: 'info',
        message: `${status.statistics.postsNeedingEmbeddings} posts need embeddings`,
        action: 'Edit and save existing posts to generate embeddings automatically',
      })
    }

    if (status.statistics.coveragePercentage === 100) {
      status.recommendations.push({
        type: 'success',
        message: 'All published posts have embeddings!',
        action: 'System is ready for AI applications and semantic search',
      })
    }

    return new Response(JSON.stringify(status, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=300', // Cache for 5 minutes
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('Error getting embedding status:', error)

    return new Response(
      JSON.stringify({
        system: {
          healthy: false,
          error: 'Failed to get embedding status',
        },
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

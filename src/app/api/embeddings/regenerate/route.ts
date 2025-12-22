import configPromise from '@payload-config'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import {
  generateEmbeddingForPost,
  generateEmbeddingForNote,
} from '@/utilities/generate-embedding-helpers'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })

    // Parse request body
    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      )
    }

    const { collection, id, force } = body

    // Validate required fields
    if (!collection || !id) {
      return NextResponse.json(
        { error: 'collection and id are required' },
        { status: 400 }
      )
    }

    if (collection !== 'posts' && collection !== 'notes') {
      return NextResponse.json(
        { error: 'collection must be "posts" or "notes"' },
        { status: 400 }
      )
    }

    const docId = Number.parseInt(String(id), 10)
    if (Number.isNaN(docId)) {
      return NextResponse.json(
        { error: 'id must be a valid number' },
        { status: 400 }
      )
    }

    // Authentication check
    // Allow authenticated admins or requests with valid CRON_SECRET
    const authHeader = request.headers.get('authorization')
    const cronSecret = authHeader?.replace('Bearer ', '')
    const hasValidSecret =
      cronSecret && cronSecret === process.env.CRON_SECRET

    // Create a mock request object for the helper functions
    // In a real Payload request context, req.user would be available
    // For API routes, we'll use the payload instance directly
    const mockReq = {
      payload,
      user: null, // Will be set if authenticated via Payload session
    } as any

    // Try to get authenticated user from Payload session
    // This allows calling from Payload admin UI
    try {
      const { user } = await payload.auth({ headers: request.headers })
      if (user) {
        mockReq.user = user
      }
    } catch {
      // Not authenticated via Payload session, check CRON_SECRET
      if (!hasValidSecret) {
        return NextResponse.json(
          { error: 'Unauthorized. Requires admin authentication or valid CRON_SECRET' },
          { status: 401 }
        )
      }
    }

    // Fetch document to get current embedding info
    const doc = await payload.findByID({
      collection: collection as 'posts' | 'notes',
      id: docId,
      select: {
        id: true,
        title: true,
        embedding_model: true,
        embedding_dimensions: true,
      },
    })

    if (!doc) {
      return NextResponse.json(
        { error: `${collection} not found` },
        { status: 404 }
      )
    }

    // If force is true, clear the hash to force regeneration
    if (force && collection === 'posts') {
      await payload.update({
        collection: 'posts',
        id: docId,
        data: {
          embedding_text_hash: null,
        },
        context: {
          skipEmbeddingGeneration: true,
          skipRecommendationCompute: true,
          skipRevalidation: true,
        },
      })
    } else if (force && collection === 'notes') {
      await payload.update({
        collection: 'notes',
        id: docId,
        data: {
          embedding_text_hash: null,
        },
        context: {
          skipEmbeddingGeneration: true,
          skipRevalidation: true,
        },
      })
    }

    // Call appropriate helper function
    let result
    if (collection === 'posts') {
      result = await generateEmbeddingForPost(docId, mockReq)
    } else {
      result = await generateEmbeddingForNote(docId, mockReq)
    }

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to regenerate embedding',
        },
        { status: 500 }
      )
    }

    // Fetch updated document to get embedding details
    const updatedDoc = await payload.findByID({
      collection: collection as 'posts' | 'notes',
      id: docId,
      select: {
        embedding_model: true,
        embedding_dimensions: true,
        recommended_post_ids: true,
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Embedding regenerated successfully',
        model: (updatedDoc as any).embedding_model || 'unknown',
        dimensions: (updatedDoc as any).embedding_dimensions || 0,
        recommendationsUpdated:
          collection === 'posts' && (updatedDoc as any).recommended_post_ids
            ? true
            : false,
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    )
  }
}


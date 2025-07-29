import { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { unstable_cacheTag as cacheTag, unstable_cacheLife as cacheLife } from 'next/cache'
import { generateEmbedding, extractTextFromContent } from '@/utilities/generate-embedding'

// Books-specific text extraction for API
function extractBooksText(book: any): string {
  const parts: string[] = []

  if (book.title) {
    parts.push(book.title)
  }

  if (book.description) {
    parts.push(book.description)
  }

  // Include Rafa's quotes for richer embeddings
  if (book.rafasQuotes && Array.isArray(book.rafasQuotes)) {
    const rafaQuotes = book.rafasQuotes
      .map((q: any) => q.quote)
      .filter(Boolean)
      .join(' ')
    if (rafaQuotes) {
      parts.push(rafaQuotes)
    }
  }

  // Include Jess's quotes for richer embeddings
  if (book.jesssQuotes && Array.isArray(book.jesssQuotes)) {
    const jessQuotes = book.jesssQuotes
      .map((q: any) => q.quote)
      .filter(Boolean)
      .join(' ')
    if (jessQuotes) {
      parts.push(jessQuotes)
    }
  }

  return parts.filter(Boolean).join(' ')
}

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

    const book = await payload.findByID({
      collection: 'books',
      id: parseInt(id),
      depth: 2,
      select: {
        title: true,
        slug: true,
        description: true,
        rafasQuotes: true,
        jesssQuotes: true,
        releaseDate: true, // Books use releaseDate, not publishedAt
        updatedAt: true,
        embedding_vector: true, // pgvector field
        embedding_model: true,
        embedding_dimensions: true,
        embedding_generated_at: true,
        embedding_text_hash: true,
      },
    })

    if (!book) {
      return new Response(
        JSON.stringify({
          error: 'Book not found',
          id: parseInt(id),
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Parse existing embedding from pgvector format
    const bookWithEmbedding = book as any // Type assertion for new pgvector fields
    let existingEmbedding = null
    if (bookWithEmbedding.embedding_vector) {
      try {
        const vectorString = bookWithEmbedding.embedding_vector.replace(/^\[|\]$/g, '') // Remove brackets
        const vectorArray = vectorString.split(',').map(Number)
        existingEmbedding = {
          vector: vectorArray,
          model: bookWithEmbedding.embedding_model,
          dimensions: bookWithEmbedding.embedding_dimensions,
          generatedAt: bookWithEmbedding.embedding_generated_at,
          textHash: bookWithEmbedding.embedding_text_hash,
        }
      } catch (error) {
        console.error('Error parsing embedding vector:', error)
      }
    }

    // Handle regeneration or missing embedding
    let embedding = existingEmbedding
    if (regenerate || !existingEmbedding) {
      const textContent = extractBooksText(book)

      if (!textContent.trim()) {
        return new Response(
          JSON.stringify({
            error: 'Book has no content to embed',
            id: parseInt(id),
            title: book.title,
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }

      const { vector, model, dimensions } = await generateEmbedding(textContent)

      embedding = {
        vector,
        model,
        dimensions,
        generatedAt: new Date().toISOString(),
        textHash: bookWithEmbedding.embedding_text_hash, // Use existing hash if available
      }

      // Only update the database if regenerating
      if (regenerate) {
        try {
          await payload.update({
            collection: 'books',
            id: parseInt(id),
            data: {
              embedding_vector: `[${vector.join(',')}]`,
              embedding_model: model,
              embedding_dimensions: dimensions,
              embedding_generated_at: embedding.generatedAt,
            } as any, // Type assertion for new pgvector fields
          })
        } catch (updateError) {
          console.error('Failed to update book embedding:', updateError)
        }
      }
    }

    // Format response based on requested format
    const baseResponse = {
      id: book.id,
      title: book.title,
      slug: book.slug,
      url: `${SITE_URL}/books/${book.slug}`, // Books collection URL structure
      embedding: null as any,
      releaseDate: book.releaseDate,
      updatedAt: book.updatedAt,
      // Books-specific metadata
      metadata: {
        type: 'book',
        quotesCount: {
          rafa: Array.isArray(book.rafasQuotes) ? book.rafasQuotes.length : 0,
          jess: Array.isArray(book.jesssQuotes) ? book.jesssQuotes.length : 0,
        },
        totalQuotes:
          (Array.isArray(book.rafasQuotes) ? book.rafasQuotes.length : 0) +
          (Array.isArray(book.jesssQuotes) ? book.jesssQuotes.length : 0),
      },
    }

    switch (format) {
      case 'vector-only':
        baseResponse.embedding = embedding?.vector || null
        break
      case 'metadata-only':
        baseResponse.embedding = embedding
          ? {
              model: embedding.model,
              dimensions: embedding.dimensions,
              generatedAt: embedding.generatedAt,
            }
          : null
        break
      default: // 'full'
        baseResponse.embedding = embedding
        if (includeContent) {
          ;(baseResponse as any).content = {
            description: book.description,
            rafasQuotes: book.rafasQuotes,
            jesssQuotes: book.jesssQuotes,
          }
        }
        break
    }

    const response = new Response(JSON.stringify(baseResponse, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': regenerate
          ? 'no-cache, no-store, must-revalidate'
          : 'public, max-age=3600, s-maxage=3600',
        'Access-Control-Allow-Origin': '*',
      },
    })

    // Note: cacheTag and cacheLife can only be used inside "use cache" functions
    // For now, we'll rely on the Cache-Control headers
    return response
  } catch (error) {
    console.error('Error in Books embeddings API:', error)

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        id: parseInt(id),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}

// Handle POST requests for embedding operations
export async function POST(request: NextRequest, { params: paramsPromise }: Args) {
  const { id } = await paramsPromise

  try {
    const body = await request.json()
    const { action = 'regenerate' } = body

    if (action === 'regenerate') {
      // Redirect to GET with regenerate=true
      const url = new URL(request.url)
      url.searchParams.set('regenerate', 'true')

      return new Response(null, {
        status: 302,
        headers: {
          Location: url.toString(),
        },
      })
    }

    return new Response(
      JSON.stringify({
        error: 'Invalid action',
        validActions: ['regenerate'],
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Invalid request body',
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}

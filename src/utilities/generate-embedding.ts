import { embed } from 'ai'
import { openai } from '@ai-sdk/openai'
import crypto from 'crypto'

// Helper function to extract text from Lexical content
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

// Extract content text for embedding from a post
export function extractPostText(post: any): string {
  // Extract text content for embedding
  const textToEmbed = [post.title, post.description].filter(Boolean).join(' ')

  return textToEmbed
}

// Generate a simple hash-based fallback embedding
function generateFallbackEmbedding(text: string): number[] {
  const hash = crypto.createHash('sha256').update(text).digest('hex')

  // Convert hash to deterministic vector
  const vector = new Array(384).fill(0).map((_, i) => {
    const slice = hash.slice(i % 32, (i % 32) + 8)
    const num = parseInt(slice, 16)
    return (num / 0xffffffff - 0.5) * 2 // Normalize to [-1, 1]
  })

  return vector
}

// Create a hash of the text content for change detection
export function createTextHash(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex').slice(0, 16)
}

// Main embedding generation function
export async function generateEmbedding(text: string): Promise<{
  vector: number[]
  model: string
  dimensions: number
}> {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    console.log('No OpenAI API key found, using fallback embedding')
    const vector = generateFallbackEmbedding(text)
    return {
      vector,
      model: 'fallback-hash',
      dimensions: vector.length,
    }
  }

  try {
    // Use Vercel AI SDK for embeddings
    const { embedding } = await embed({
      model: openai.embedding('text-embedding-3-small'),
      value: text.substring(0, 8000), // OpenAI token limit
    })

    return {
      vector: embedding,
      model: 'text-embedding-3-small',
      dimensions: embedding.length,
    }
  } catch (error) {
    console.error('Error generating OpenAI embedding, falling back to hash:', error)

    // Fallback to hash-based embedding on error
    const vector = generateFallbackEmbedding(text)
    return {
      vector,
      model: 'fallback-hash-error',
      dimensions: vector.length,
    }
  }
}

// Check if embedding needs to be regenerated
export function shouldRegenerateEmbedding(currentEmbedding: any, newTextHash: string): boolean {
  if (!currentEmbedding?.vector || !currentEmbedding?.textHash) {
    return true // No existing embedding
  }

  if (currentEmbedding.textHash !== newTextHash) {
    return true // Content has changed
  }

  // Check if embedding is too old (regenerate weekly)
  if (currentEmbedding.generatedAt) {
    const oneWeek = 7 * 24 * 60 * 60 * 1000
    const generatedAt = new Date(currentEmbedding.generatedAt)
    if (Date.now() - generatedAt.getTime() > oneWeek) {
      return true
    }
  }

  return false
}

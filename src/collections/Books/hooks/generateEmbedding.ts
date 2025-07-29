import { createEmbeddingHook } from '@/utilities/generate-embedding'

// Books-specific text extraction
function extractBooksText(data: any): string {
  const parts: string[] = []

  if (data.title) {
    parts.push(data.title)
  }

  if (data.description) {
    parts.push(data.description)
  }

  // Include Rafa's quotes for richer embeddings
  if (data.rafasQuotes && Array.isArray(data.rafasQuotes)) {
    const rafaQuotes = data.rafasQuotes
      .map((q: any) => q.quote)
      .filter(Boolean)
      .join(' ')
    if (rafaQuotes) {
      parts.push(rafaQuotes)
    }
  }

  // Include Jess's quotes for richer embeddings
  if (data.jesssQuotes && Array.isArray(data.jesssQuotes)) {
    const jessQuotes = data.jesssQuotes
      .map((q: any) => q.quote)
      .filter(Boolean)
      .join(' ')
    if (jessQuotes) {
      parts.push(jessQuotes)
    }
  }

  return parts.filter(Boolean).join(' ')
}

// Create Books-specific embedding hook
export const generateEmbeddingHook = createEmbeddingHook(extractBooksText, 'Books')

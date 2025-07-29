import { createEmbeddingHook, extractTextFromContent } from '@/utilities/generate-embedding'

// Notes-specific text extraction
function extractNotesText(data: any): string {
  const parts: string[] = []

  if (data.title) {
    parts.push(data.title)
  }

  // Extract content from Lexical JSONB format
  if (data.content) {
    const contentText = extractTextFromContent(data.content)
    if (contentText) {
      parts.push(contentText)
    }
  }

  return parts.filter(Boolean).join(' ')
}

// Create Notes-specific embedding hook
export const generateEmbeddingHook = createEmbeddingHook(extractNotesText, 'Notes')

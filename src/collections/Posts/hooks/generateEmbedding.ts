import {
  createEmbeddingHook,
  extractTextFromContent,
} from "@/utilities/generate-embedding";

// Posts-specific text extraction
function extractPostsText(data: any): string {
  const parts: string[] = [];

  if (data.title) {
    parts.push(data.title);
  }

  if (data.description) {
    parts.push(data.description);
  }

  // Extract content from Lexical JSONB format
  if (data.content) {
    const contentText = extractTextFromContent(data.content);
    if (contentText) {
      parts.push(contentText);
    }
  }

  return parts.filter(Boolean).join(" ");
}

// Create Posts-specific embedding hook
export const generateEmbeddingHook = createEmbeddingHook(
  extractPostsText,
  "Posts"
);

// Note: Regeneration is handled automatically by the main hook when content changes
// Force regeneration can be triggered by adding ?regenerateEmbedding=true to API calls

// Embedding-related TypeScript types for better type safety

export type EmbeddingVector = number[]

export type EmbeddingModel =
  | 'text-embedding-3-small'
  | 'text-embedding-3-large'
  | 'text-embedding-ada-002'
  | 'fallback-hash'
  | 'fallback-hash-error'

export interface EmbeddingData {
  vector: EmbeddingVector
  model: EmbeddingModel
  dimensions: number
  generatedAt: string
  textHash: string
}

export interface EmbeddingGenerationResult {
  vector: EmbeddingVector
  model: EmbeddingModel
  dimensions: number
}

export interface EmbeddingStats {
  totalPosts: number
  postsWithEmbeddings: number
  postsNeedingEmbeddings: number
  coveragePercentage: number
}

export interface EmbeddingRegenerationResult {
  success: boolean
  postId: number
  title?: string
  model?: EmbeddingModel
  dimensions?: number
  wordCount?: number
  error?: string
}

export interface EmbeddingSystemHealth {
  healthy: boolean
  openaiConfigured: boolean
  model?: EmbeddingModel
  dimensions?: number
  stats?: EmbeddingStats
  error?: string
  lastChecked: string
}

// Database schema extensions for collections with embeddings
export interface WithEmbedding {
  embedding_vector: string | null // pgvector format: "[1.0,2.0,3.0]"
  embedding_model: EmbeddingModel | null
  embedding_dimensions: number | null
  embedding_generated_at: string | null
  embedding_text_hash: string | null
}

// Collection-specific text extractors
export type TextExtractor<T = any> = (data: T) => string

// Similarity search types
export interface SimilaritySearchOptions {
  limit?: number
  threshold?: number
  includeScore?: boolean
  includeContent?: boolean
}

export interface SimilarityResult<T = any> {
  item: T
  similarity: number
  distance: number
}

export interface SimilaritySearchResult<T = any> {
  query: string
  results: SimilarityResult<T>[]
  model: EmbeddingModel
  dimensions: number
  searchTime: number
}

// API response types
export interface EmbeddingAPIResponse {
  id: number
  title: string
  slug: string
  url: string
  embedding: EmbeddingData | EmbeddingVector | null
  publishedAt: string
  updatedAt: string
  content?: any
}

export interface QueryEmbeddingResponse {
  query: string
  embedding: EmbeddingVector
  dimensions: number
  model: EmbeddingModel
  timestamp: string
}

// Hook factory types
export interface EmbeddingHookOptions {
  extractText: TextExtractor
  collectionName: string
  skipDrafts?: boolean
  skipAutosave?: boolean
}

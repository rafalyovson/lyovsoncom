// Embedding-related TypeScript types for better type safety

export type EmbeddingVector = number[];

export type EmbeddingModel =
  | "text-embedding-3-small"
  | "text-embedding-3-large";

export interface EmbeddingData {
  dimensions: number;
  generatedAt: string;
  model: EmbeddingModel;
  textHash: string;
  vector: EmbeddingVector;
}

export interface EmbeddingGenerationResult {
  dimensions: number;
  model: EmbeddingModel;
  vector: EmbeddingVector;
}

export interface EmbeddingStats {
  coveragePercentage: number;
  postsNeedingEmbeddings: number;
  postsWithEmbeddings: number;
  totalPosts: number;
}

export interface EmbeddingRegenerationResult {
  dimensions?: number;
  error?: string;
  model?: EmbeddingModel;
  postId: number;
  success: boolean;
  title?: string;
  wordCount?: number;
}

export interface EmbeddingSystemHealth {
  dimensions?: number;
  error?: string;
  healthy: boolean;
  lastChecked: string;
  model?: EmbeddingModel;
  openaiConfigured: boolean;
  stats?: EmbeddingStats;
}

// Database schema extensions for collections with embeddings
export interface WithEmbedding {
  embedding_dimensions: number | null;
  embedding_generated_at: string | null;
  embedding_model: EmbeddingModel | null;
  embedding_text_hash: string | null;
  embedding_vector: string | null; // pgvector format: "[1.0,2.0,3.0]"
}

// Collection-specific text extractors
export type TextExtractor<T = unknown> = (data: T) => string;

// Similarity search types
export interface SimilaritySearchOptions {
  includeContent?: boolean;
  includeScore?: boolean;
  limit?: number;
  threshold?: number;
}

export interface SimilarityResult<T = unknown> {
  distance: number;
  item: T;
  similarity: number;
}

export interface SimilaritySearchResult<T = unknown> {
  dimensions: number;
  model: EmbeddingModel;
  query: string;
  results: SimilarityResult<T>[];
  searchTime: number;
}

// API response types
export interface EmbeddingAPIResponse {
  content?: unknown;
  embedding: EmbeddingData | EmbeddingVector | null;
  id: number;
  publishedAt: string;
  slug: string;
  title: string;
  updatedAt: string;
  url: string;
}

export interface QueryEmbeddingResponse {
  dimensions: number;
  embedding: EmbeddingVector;
  model: EmbeddingModel;
  query: string;
  timestamp: string;
}

// Hook factory types
export interface EmbeddingHookOptions {
  collectionName: string;
  extractText: TextExtractor;
  skipAutosave?: boolean;
  skipDrafts?: boolean;
}

// Embedding-related TypeScript types for better type safety

export type EmbeddingVector = number[];

export type EmbeddingModel =
  | "text-embedding-3-small"
  | "text-embedding-3-large";

export type EmbeddingData = {
  vector: EmbeddingVector;
  model: EmbeddingModel;
  dimensions: number;
  generatedAt: string;
  textHash: string;
};

export type EmbeddingGenerationResult = {
  vector: EmbeddingVector;
  model: EmbeddingModel;
  dimensions: number;
};

export type EmbeddingStats = {
  totalPosts: number;
  postsWithEmbeddings: number;
  postsNeedingEmbeddings: number;
  coveragePercentage: number;
};

export type EmbeddingRegenerationResult = {
  success: boolean;
  postId: number;
  title?: string;
  model?: EmbeddingModel;
  dimensions?: number;
  wordCount?: number;
  error?: string;
};

export type EmbeddingSystemHealth = {
  healthy: boolean;
  openaiConfigured: boolean;
  model?: EmbeddingModel;
  dimensions?: number;
  stats?: EmbeddingStats;
  error?: string;
  lastChecked: string;
};

// Database schema extensions for collections with embeddings
export type WithEmbedding = {
  embedding_vector: string | null; // pgvector format: "[1.0,2.0,3.0]"
  embedding_model: EmbeddingModel | null;
  embedding_dimensions: number | null;
  embedding_generated_at: string | null;
  embedding_text_hash: string | null;
};

// Collection-specific text extractors
export type TextExtractor<T = unknown> = (data: T) => string;

// Similarity search types
export type SimilaritySearchOptions = {
  limit?: number;
  threshold?: number;
  includeScore?: boolean;
  includeContent?: boolean;
};

export type SimilarityResult<T = unknown> = {
  item: T;
  similarity: number;
  distance: number;
};

export type SimilaritySearchResult<T = unknown> = {
  query: string;
  results: SimilarityResult<T>[];
  model: EmbeddingModel;
  dimensions: number;
  searchTime: number;
};

// API response types
export type EmbeddingAPIResponse = {
  id: number;
  title: string;
  slug: string;
  url: string;
  embedding: EmbeddingData | EmbeddingVector | null;
  publishedAt: string;
  updatedAt: string;
  content?: unknown;
};

export type QueryEmbeddingResponse = {
  query: string;
  embedding: EmbeddingVector;
  dimensions: number;
  model: EmbeddingModel;
  timestamp: string;
};

// Hook factory types
export type EmbeddingHookOptions = {
  extractText: TextExtractor;
  collectionName: string;
  skipDrafts?: boolean;
  skipAutosave?: boolean;
};

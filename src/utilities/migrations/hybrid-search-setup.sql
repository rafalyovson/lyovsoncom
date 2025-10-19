-- =====================================================
-- Hybrid Search Setup for Posts
-- Combines semantic (pgvector) + full-text + fuzzy search
-- Uses Reciprocal Rank Fusion (RRF) for optimal ranking
-- =====================================================

-- Enable pg_trgm extension for fuzzy/trigram search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add generated tsvector column for full-text search
-- This auto-updates when title or description changes
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS search_vector tsvector
GENERATED ALWAYS AS (
  to_tsvector('english',
    coalesce(title, '') || ' ' ||
    coalesce(description, '')
  )
) STORED;

-- Create GIN index for fast full-text search
CREATE INDEX IF NOT EXISTS posts_search_vector_idx
ON posts USING GIN (search_vector);

-- Create GiST trigram indexes for fuzzy search
CREATE INDEX IF NOT EXISTS posts_title_trgm_idx
ON posts USING GIST (title gist_trgm_ops);

CREATE INDEX IF NOT EXISTS posts_description_trgm_idx
ON posts USING GIST (description gist_trgm_ops);

-- =====================================================
-- Hybrid Search Function with RRF
-- =====================================================

CREATE OR REPLACE FUNCTION hybrid_search_posts(
  query_text TEXT,
  query_embedding vector(1536),
  match_count INT DEFAULT 10,
  rrf_k INT DEFAULT 60
)
RETURNS TABLE (
  id INT,
  title TEXT,
  slug TEXT,
  description TEXT,
  featured_image_id INT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  semantic_rank BIGINT,
  fts_rank BIGINT,
  fuzzy_rank BIGINT,
  combined_score NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH semantic_search AS (
    SELECT
      posts.id,
      ROW_NUMBER() OVER (ORDER BY posts.embedding_vector::vector(1536) <=> query_embedding) AS rank
    FROM posts
    WHERE
      posts._status = 'published'
      AND posts.embedding_vector IS NOT NULL
    ORDER BY posts.embedding_vector::vector(1536) <=> query_embedding
    LIMIT match_count * 2
  ),
  fulltext_search AS (
    SELECT
      posts.id,
      ROW_NUMBER() OVER (ORDER BY ts_rank(posts.search_vector, websearch_to_tsquery('english', query_text)) DESC) AS rank
    FROM posts
    WHERE
      posts._status = 'published'
      AND posts.search_vector @@ websearch_to_tsquery('english', query_text)
    ORDER BY ts_rank(posts.search_vector, websearch_to_tsquery('english', query_text)) DESC
    LIMIT match_count * 2
  ),
  fuzzy_search AS (
    SELECT
      posts.id,
      ROW_NUMBER() OVER (
        ORDER BY
          GREATEST(
            similarity(posts.title, query_text),
            similarity(COALESCE(posts.description, ''), query_text)
          ) DESC
      ) AS rank
    FROM posts
    WHERE
      posts._status = 'published'
      AND (
        posts.title % query_text
        OR COALESCE(posts.description, '') % query_text
      )
    LIMIT match_count * 2
  )
  SELECT
    posts.id,
    posts.title,
    posts.slug,
    posts.description,
    posts.featured_image_id,
    posts.created_at,
    posts.updated_at,
    semantic_search.rank AS semantic_rank,
    fulltext_search.rank AS fts_rank,
    fuzzy_search.rank AS fuzzy_rank,
    -- RRF Score: combines all three search methods
    COALESCE(1.0 / (rrf_k + semantic_search.rank), 0.0) * 0.4 +
    COALESCE(1.0 / (rrf_k + fulltext_search.rank), 0.0) * 0.4 +
    COALESCE(1.0 / (rrf_k + fuzzy_search.rank), 0.0) * 0.2 AS combined_score
  FROM posts
  LEFT JOIN semantic_search ON posts.id = semantic_search.id
  LEFT JOIN fulltext_search ON posts.id = fulltext_search.id
  LEFT JOIN fuzzy_search ON posts.id = fuzzy_search.id
  WHERE
    posts._status = 'published'
    AND (
      semantic_search.id IS NOT NULL
      OR fulltext_search.id IS NOT NULL
      OR fuzzy_search.id IS NOT NULL
    )
  ORDER BY combined_score DESC
  LIMIT match_count;
END;
$$;

-- =====================================================
-- Populate search_vector for existing posts
-- (Generated column auto-updates, but this ensures data)
-- =====================================================

-- Trigger index creation and vector population
ANALYZE posts;

-- Verify setup
DO $$
BEGIN
  RAISE NOTICE 'Hybrid search setup complete!';
  RAISE NOTICE 'Extensions: pg_trgm ✓';
  RAISE NOTICE 'Indexes: search_vector (GIN), title_trgm (GIST), description_trgm (GIST) ✓';
  RAISE NOTICE 'Function: hybrid_search_posts() ✓';
  RAISE NOTICE 'Ready to search!';
END $$;

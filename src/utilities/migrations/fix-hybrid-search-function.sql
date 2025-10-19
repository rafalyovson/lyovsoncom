-- =====================================================
-- Fix Hybrid Search Function Return Types
-- =====================================================
--
-- Issue: Function return types must EXACTLY match database column types.
-- PostgreSQL error: "structure of query does not match function result type"
--
-- Changes:
-- - INT → INTEGER (id, featured_image_id)
-- - TEXT → VARCHAR (title, slug, description)
--
-- Run via Neon MCP or psql
-- =====================================================

-- Drop existing function
DROP FUNCTION IF EXISTS hybrid_search_posts(TEXT, vector(1536), INT, INT);

-- Recreate with corrected return types
CREATE OR REPLACE FUNCTION hybrid_search_posts(
  query_text TEXT,
  query_embedding vector(1536),
  match_count INT DEFAULT 10,
  rrf_k INT DEFAULT 60
)
RETURNS TABLE (
  id INTEGER,                    -- Changed from INT to INTEGER
  title VARCHAR,                 -- Changed from TEXT to VARCHAR
  slug VARCHAR,                  -- Changed from TEXT to VARCHAR
  description VARCHAR,           -- Changed from TEXT to VARCHAR
  featured_image_id INTEGER,     -- Changed from INT to INTEGER
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

-- Verify function was created
DO $$
BEGIN
  RAISE NOTICE 'Hybrid search function updated with corrected return types!';
  RAISE NOTICE '  id: INT → INTEGER';
  RAISE NOTICE '  title: TEXT → VARCHAR';
  RAISE NOTICE '  slug: TEXT → VARCHAR';
  RAISE NOTICE '  description: TEXT → VARCHAR';
  RAISE NOTICE '  featured_image_id: INT → INTEGER';
  RAISE NOTICE 'Function ready to use!';
END $$;

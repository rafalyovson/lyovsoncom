-- =====================================================
-- Fix "Too Eager" Hybrid Search
-- =====================================================
--
-- Issue: Search returns too many irrelevant results due to semantic-only matches
-- Example: "hades" returns 12 results, but only #1 actually contains the word
--
-- Changes:
-- 1. Reduce semantic search limit from `match_count * 2` to `match_count`
-- 2. Require at least one keyword match (fts_rank OR fuzzy_rank)
-- 3. Keep semantic search for boosting relevance of keyword matches
--
-- This ensures all results either:
-- - Contain the keyword (full-text match), OR
-- - Have very similar title/description (fuzzy match)
-- =====================================================

-- Drop existing function
DROP FUNCTION IF EXISTS hybrid_search_posts(TEXT, vector(1536), INT, INT);

-- Recreate with stricter matching requirements
CREATE OR REPLACE FUNCTION hybrid_search_posts(
  query_text TEXT,
  query_embedding vector(1536),
  match_count INT DEFAULT 10,
  rrf_k INT DEFAULT 60
)
RETURNS TABLE (
  id INTEGER,
  title VARCHAR,
  slug VARCHAR,
  description VARCHAR,
  featured_image_id INTEGER,
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
    LIMIT match_count  -- Changed from match_count * 2 to match_count
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
      -- CHANGED: Require at least one keyword match (fts OR fuzzy)
      -- Semantic search only boosts relevance, doesn't return semantic-only results
      fulltext_search.id IS NOT NULL
      OR fuzzy_search.id IS NOT NULL
    )
  ORDER BY combined_score DESC
  LIMIT match_count;
END;
$$;

-- Verify function was created
DO $$
BEGIN
  RAISE NOTICE 'Hybrid search function updated to require keyword matches!';
  RAISE NOTICE 'Changes:';
  RAISE NOTICE '  1. Reduced semantic search limit (match_count * 2 → match_count)';
  RAISE NOTICE '  2. Require fts_rank OR fuzzy_rank (no semantic-only results)';
  RAISE NOTICE '  3. Semantic search still boosts relevance scores';
  RAISE NOTICE 'Function ready to use!';
END $$;

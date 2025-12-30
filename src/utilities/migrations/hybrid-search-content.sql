-- =====================================================
-- Hybrid Search (Posts + Notes + Activities)
--
-- Notes:
-- - Posts are searched via existing `hybrid_search_posts(...)`
-- - Notes + Activities use the same 3-channel approach (semantic + full-text + fuzzy),
--   fused via Reciprocal Rank Fusion (RRF), matching the posts strategy.
-- - `hybrid_search_content(...)` is a thin wrapper that UNIONs all three and sorts.
--
-- This file is meant to be applied to the app database (commonly `verceldb` on Neon).
-- =====================================================

-- Enable pg_trgm extension for fuzzy/trigram search (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- =====================================================
-- Notes hybrid search (RRF)
-- =====================================================

CREATE OR REPLACE FUNCTION hybrid_search_notes(
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
LANGUAGE sql
AS $sql$
WITH semantic_search AS (
  SELECT
    n.id,
    ROW_NUMBER() OVER (ORDER BY n.embedding_vector::vector(1536) <=> query_embedding) AS rank
  FROM notes n
  WHERE n._status = 'published' AND n.embedding_vector IS NOT NULL
  ORDER BY n.embedding_vector::vector(1536) <=> query_embedding
  LIMIT match_count * 2
),
fulltext_search AS (
  SELECT
    n.id,
    ROW_NUMBER() OVER (
      ORDER BY ts_rank(n.search_vector, websearch_to_tsquery('english', query_text)) DESC
    ) AS rank
  FROM notes n
  WHERE n._status = 'published'
    AND n.search_vector @@ websearch_to_tsquery('english', query_text)
  ORDER BY ts_rank(n.search_vector, websearch_to_tsquery('english', query_text)) DESC
  LIMIT match_count * 2
),
fuzzy_search AS (
  SELECT
    n.id,
    ROW_NUMBER() OVER (ORDER BY similarity(n.title, query_text) DESC) AS rank
  FROM notes n
  WHERE n._status = 'published'
    AND n.title % query_text
  LIMIT match_count * 2
)
SELECT
  n.id,
  n.title,
  n.slug,
  NULL::VARCHAR AS description,
  NULL::INTEGER AS featured_image_id,
  n.created_at,
  n.updated_at,
  semantic_search.rank AS semantic_rank,
  fulltext_search.rank AS fts_rank,
  fuzzy_search.rank AS fuzzy_rank,
  COALESCE(1.0 / (rrf_k + semantic_search.rank), 0.0) * 0.4 +
  COALESCE(1.0 / (rrf_k + fulltext_search.rank), 0.0) * 0.4 +
  COALESCE(1.0 / (rrf_k + fuzzy_search.rank), 0.0) * 0.2 AS combined_score
FROM notes n
LEFT JOIN semantic_search ON n.id = semantic_search.id
LEFT JOIN fulltext_search ON n.id = fulltext_search.id
LEFT JOIN fuzzy_search ON n.id = fuzzy_search.id
WHERE n._status = 'published'
  AND (
    semantic_search.id IS NOT NULL
    OR fulltext_search.id IS NOT NULL
    OR fuzzy_search.id IS NOT NULL
  )
ORDER BY combined_score DESC
LIMIT match_count
$sql$;

-- =====================================================
-- Activities hybrid search (RRF)
-- =====================================================

CREATE OR REPLACE FUNCTION hybrid_search_activities(
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
LANGUAGE sql
AS $sql$
WITH semantic_search AS (
  SELECT
    a.id,
    ROW_NUMBER() OVER (ORDER BY a.embedding_vector::vector(1536) <=> query_embedding) AS rank
  FROM activities a
  WHERE a._status = 'published' AND a.embedding_vector IS NOT NULL
  ORDER BY a.embedding_vector::vector(1536) <=> query_embedding
  LIMIT match_count * 2
),
fulltext_search AS (
  SELECT
    a.id,
    ROW_NUMBER() OVER (
      ORDER BY ts_rank(a.search_vector, websearch_to_tsquery('english', query_text)) DESC
    ) AS rank
  FROM activities a
  WHERE a._status = 'published'
    AND a.search_vector @@ websearch_to_tsquery('english', query_text)
  ORDER BY ts_rank(a.search_vector, websearch_to_tsquery('english', query_text)) DESC
  LIMIT match_count * 2
),
fuzzy_search AS (
  SELECT
    a.id,
    ROW_NUMBER() OVER (
      ORDER BY similarity(COALESCE(a.content_text, ''), query_text) DESC
    ) AS rank
  FROM activities a
  WHERE a._status = 'published'
    AND COALESCE(a.content_text, '') % query_text
  LIMIT match_count * 2
)
SELECT
  a.id,
  COALESCE(a.content_text, '')::VARCHAR AS title,
  a.slug,
  NULL::VARCHAR AS description,
  NULL::INTEGER AS featured_image_id,
  a.created_at,
  a.updated_at,
  semantic_search.rank AS semantic_rank,
  fulltext_search.rank AS fts_rank,
  fuzzy_search.rank AS fuzzy_rank,
  COALESCE(1.0 / (rrf_k + semantic_search.rank), 0.0) * 0.4 +
  COALESCE(1.0 / (rrf_k + fulltext_search.rank), 0.0) * 0.4 +
  COALESCE(1.0 / (rrf_k + fuzzy_search.rank), 0.0) * 0.2 AS combined_score
FROM activities a
LEFT JOIN semantic_search ON a.id = semantic_search.id
LEFT JOIN fulltext_search ON a.id = fulltext_search.id
LEFT JOIN fuzzy_search ON a.id = fuzzy_search.id
WHERE a._status = 'published'
  AND (
    semantic_search.id IS NOT NULL
    OR fulltext_search.id IS NOT NULL
    OR fuzzy_search.id IS NOT NULL
  )
ORDER BY combined_score DESC
LIMIT match_count
$sql$;

-- =====================================================
-- Unified hybrid search (wrapper)
-- =====================================================

CREATE OR REPLACE FUNCTION hybrid_search_content(
  query_text TEXT,
  query_embedding vector(1536),
  match_count INT DEFAULT 10,
  rrf_k INT DEFAULT 60
)
RETURNS TABLE (
  collection VARCHAR,
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
LANGUAGE sql
AS $sql$
SELECT * FROM (
  SELECT
    'posts'::VARCHAR AS collection,
    p.id,
    p.title,
    p.slug,
    p.description,
    p.featured_image_id,
    p.created_at,
    p.updated_at,
    p.semantic_rank,
    p.fts_rank,
    p.fuzzy_rank,
    p.combined_score
  FROM hybrid_search_posts(query_text, query_embedding, match_count, rrf_k) p

  UNION ALL

  SELECT
    'notes'::VARCHAR AS collection,
    n.id,
    n.title,
    n.slug,
    n.description,
    n.featured_image_id,
    n.created_at,
    n.updated_at,
    n.semantic_rank,
    n.fts_rank,
    n.fuzzy_rank,
    n.combined_score
  FROM hybrid_search_notes(query_text, query_embedding, match_count, rrf_k) n

  UNION ALL

  SELECT
    'activities'::VARCHAR AS collection,
    a.id,
    a.title,
    a.slug,
    a.description,
    a.featured_image_id,
    a.created_at,
    a.updated_at,
    a.semantic_rank,
    a.fts_rank,
    a.fuzzy_rank,
    a.combined_score
  FROM hybrid_search_activities(query_text, query_embedding, match_count, rrf_k) a
) r
ORDER BY r.combined_score DESC
LIMIT match_count
$sql$;


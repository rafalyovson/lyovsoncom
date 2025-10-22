# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

```bash
# Development
pnpm dev              # Start development server with Turbopack
pnpm build            # Production build
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Run ESLint with auto-fix

# Payload CMS
pnpm payload          # Access Payload CLI
pnpm generate:types   # Generate TypeScript types from Payload collections
pnpm generate:importmap # Generate import map for Payload admin

# Maintenance
pnpm reinstall        # Clean reinstall of dependencies
```

## Architecture Overview

This is a **Next.js 15 + Payload CMS 3** personal website with a unique **400px grid-based layout system**.

### Core Stack
- **Next.js 15** with App Router, React 19, and experimental features (useCache, reactCompiler)
- **Payload CMS 3** with Lexical rich text editor
- **Vercel Postgres** with pgvector extension for semantic search
- **Tailwind CSS 4** with custom glassmorphism design system
- **Motion** (Framer Motion successor) for animations
- **TypeScript** in strict mode

### Grid System Architecture

The entire UI is built on a responsive grid system using fixed 400px cards:

```typescript
// Grid breakpoints (defined in globals.css)
grid-cols-[400px] g2:grid-cols-[400px_400px] g3:grid-cols-[400px_400px_400px]
```

**Key principles:**
- All content lives inside `GridCard` components (400x400px base)
- Cards use 3x3 internal grid: `grid-cols-3 grid-rows-3`
- Glassmorphism styling with `glass-card` and `glass-interactive` classes
- Grid components located in `src/components/grid/card/`

### Data Flow & Fetching

**Server Components First:**
```typescript
// Always use Payload's local API in server components
import { getPayload } from 'payload'
import configPromise from '@payload-config'

const payload = await getPayload({ config: configPromise })
const posts = await payload.find({
  collection: 'posts',
  where: { _status: { equals: 'published' } }
})
```

**Form Handling:**
- Use server actions instead of API routes
- Implement with `useActionState` hook in client components
- Server actions should be in separate files with `'use server'` directive

### Payload CMS Collections

Main collections with relationships:
- **Posts** - Blog articles with embeddings, references to books/movies/people
- **Notes** - Zettelkasten notes (permanent, literature, fleeting, index types)
- **Media Collections** - Books, Movies, TvShows, Music, Podcasts, VideoGames
- **People** - Multi-role registry (authors, directors, actors, hosts)
- **Projects/Topics** - Content taxonomy and organization

**Collection Hooks:**
- `generateEmbedding` - Creates pgvector embeddings on save (Posts & Notes)
- `computeRecommendations` - Generates similar post recommendations (Posts only)
- `revalidatePost` - Clears Next.js cache (Posts only)
- `populateAuthors` - Hydrates user data

### Lexical Editor Configuration

The project uses **shared Lexical editor configurations** for consistency across collections. All configs are defined in `src/fields/lexical-configs.ts`.

**Available Configurations:**

1. **`richEditorConfig`** - Full-featured editor for Posts
   - All heading sizes (h1-h4)
   - All custom blocks: Banner, Code, Media, YouTube, XPost, Quote, GIF
   - Text formatting: Bold, Italic, Underline, Strikethrough
   - Fixed and inline toolbars

2. **`bioEditorConfig`** - Profile/bio editor for Lyovsons
   - Section headings (h2-h4, no h1 for semantic hierarchy)
   - Limited blocks: Media, YouTube, Quote
   - All text formatting features

3. **`noteEditorConfig`** - Minimal editor for Notes
   - Basic text formatting only
   - No headings or blocks (keeps notes lightweight)

**Adding New Features:**

To add a feature to all editors, update `src/fields/defaultLexical.ts` (the root config):

```typescript
export const defaultLexical = lexicalEditor({
  features: () => [
    ParagraphFeature(),
    BoldFeature(),
    ItalicFeature(),
    UnderlineFeature(),
    StrikethroughFeature(),
    NewFeature(),  // ← Add here
    LinkFeature({...}),
  ],
});
```

All editors inherit from `rootFeatures`, so changes propagate automatically.

**Regenerating Admin Bundle:**

After modifying editor configs:
```bash
pnpm payload generate:importmap  # Regenerate client bundle references
rm -rf .next                     # Clear Next.js cache
pnpm dev                         # Restart server
```

**Keyboard Shortcuts:**
- Bold: `Ctrl/Cmd + B`
- Italic: `Ctrl/Cmd + I`
- Underline: `Ctrl/Cmd + U`
- Strikethrough: `Ctrl/Cmd + Shift + S`
- Create link: `Ctrl/Cmd + K`
- Insert block: Type `/` in editor

### File Organization

- **kebab-case** for all files: `grid-card-section.tsx`
- **Path aliases**: `@/` → `src/`, `@payload-config` → `src/payload.config.ts`
- **Named exports** only, avoid defaults
- **Route groups**: `(frontend)` for public, `(payload)` for CMS

### Performance Optimizations

- **React Compiler** enabled - avoid manual `useMemo`/`useCallback`
- **Sharp** image processing with Vercel Blob storage
- **Advanced caching** with Next.js 15 cacheLife configuration
- **Vector search** using pgvector with HNSW indexes for sub-100ms queries

### Critical Patterns

1. **Grid-First Development**: All UI elements must be grid cards
2. **Server-Side Priority**: Minimize client components, use server components for data
3. **Glass Design System**: Use CSS variables for theme-aware glassmorphism
4. **Semantic Search**: Embeddings auto-generated for posts and notes
5. **Type Safety**: Strict TypeScript with generated Payload types

### Embedding & Recommendation System

This project implements a sophisticated **semantic search and recommendation system** using OpenAI embeddings and PostgreSQL pgvector.

#### Architecture - Jobs Queue Background Processing ✅

**Production System Verified:** Post #30 test (2025-10-21)
- Post created: 10:49:35 UTC → Embeddings generated: 10:52:21 UTC (~3 min)
- Post updated: 11:06:58 UTC → Embeddings re-generated: 11:07:24 UTC (~26 sec)
- All 15 published posts have embeddings and recommendations

**Background Processing Workflow:**

1. User publishes/updates post in Payload admin
2. `afterChange` hook queues job: `req.payload.jobs.queue({ workflow: 'processPostEmbeddings', input: { postId } })`
3. Job stored in `payload_jobs` table (queue: "default")
4. Vercel Cron triggers `/api/payload-jobs/run?queue=default` hourly
5. Workflow executes sequentially:
   - **Step 1:** Generate embedding (1536D via OpenAI text-embedding-3-small)
   - **Step 2:** Compute 3 similar posts using cosine similarity
6. Results stored in post, job deleted from queue

**Job Definitions:**

**Task: generateEmbedding** ([src/jobs/tasks/generate-embedding.ts](src/jobs/tasks/generate-embedding.ts))
- Generic task for Posts & Notes collections
- Validates content, extracts text via `extractLexicalText()`
- Generates OpenAI embedding (1536 dimensions)
- Skips if content hash unchanged (optimization)
- Stores: `embedding_vector`, `embedding_dimensions`, `embedding_model`, `embedding_generated_at`, `embedding_text_hash`
- Retry logic: Up to 2 retries on failure

**Task: computeRecommendations** ([src/jobs/tasks/compute-recommendations.ts](src/jobs/tasks/compute-recommendations.ts))
- Posts-only task for similarity-based recommendations
- Queries 3 most similar posts via cosine distance
- Uses `getSimilarPosts()` utility with HNSW index
- Stores: `recommended_post_ids` (array in similarity order)
- Retry logic: Up to 2 retries on failure

**Workflow: processPostEmbeddings** ([src/jobs/workflows/process-post-embeddings.ts](src/jobs/workflows/process-post-embeddings.ts))
- Orchestrates sequential execution: embedding → recommendations
- Smart skip: If embedding unchanged, skips recommendations
- Automatic retry from failure point

**Collection Hooks:**
- [Posts](src/collections/Posts/index.ts#L370-L394): Queues workflow on publish/update
- [Notes](src/collections/Notes/index.ts#L268-L293): Queues task on publish/update (no recommendations)

**Configuration:**
- **Vercel Cron:** Hourly ([vercel.json](vercel.json): `"0 * * * *"`)
- **Queue:** "default" queue for all jobs
- **No autoRun:** Incompatible with Vercel serverless
- **Access Control:** Requires `CRON_SECRET` environment variable
- **Endpoint:** `GET /api/payload-jobs/run?queue=default`

**Similarity Search** ([get-similar-posts.ts](src/utilities/get-similar-posts.ts))
- Direct database query using pgvector's `<=>` cosine distance operator
- Critical: Requires `::vector(1536)` casting since embeddings stored as VARCHAR
- Uses HNSW index for sub-100ms performance (~430x faster than sequential scan)
- Returns post IDs in order of similarity

#### Database Setup

**pgvector Extension:**
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

**HNSW Index for Performance:**
```sql
CREATE INDEX IF NOT EXISTS posts_embedding_vector_cosine_idx
ON posts USING hnsw ((embedding_vector::vector(1536)) vector_cosine_ops);
```

**Why VARCHAR Storage:**
- Drizzle ORM doesn't have native vector type support
- Stored as JSON array string: `"[0.123, -0.456, ...]"`
- Cast to vector type at query time: `embedding_vector::vector(1536)`

#### Hook Context Flags

To prevent infinite loops and unwanted side effects during migrations:

- **`skipRecommendationCompute`** - Prevents computeRecommendations hook from running
- **`skipRevalidation`** - Prevents revalidatePost hook from running (Next.js cache clearing)

Example usage in migrations:
```typescript
await payload.update({
  collection: 'posts',
  id: post.id,
  data: { recommended_post_ids: ids },
  context: {
    skipRecommendationCompute: true,
    skipRevalidation: true,
  },
});
```

#### Migration Scripts

**Populate Recommendations for Existing Posts:**
```bash
pnpm tsx src/utilities/migrate-recommendations.ts
```

This script:
1. Finds all published posts with embeddings
2. Computes 3 similar posts for each
3. Updates `recommended_post_ids` field
4. Bypasses both recommendation and revalidation hooks

**Test Similarity Search:**
```bash
pnpm tsx src/utilities/test-similar-posts.ts
```

#### Key Files

- [src/collections/Posts/hooks/generateEmbedding.ts](src/collections/Posts/hooks/generateEmbedding.ts) - Embedding generation
- [src/collections/Posts/hooks/computeRecommendations.ts](src/collections/Posts/hooks/computeRecommendations.ts) - Recommendation computation
- [src/utilities/generate-embedding.ts](src/utilities/generate-embedding.ts) - OpenAI API integration
- [src/utilities/get-similar-posts.ts](src/utilities/get-similar-posts.ts) - Similarity search query
- [src/utilities/extract-lexical-text.ts](src/utilities/extract-lexical-text.ts) - Lexical to plain text
- [src/utilities/migrate-recommendations.ts](src/utilities/migrate-recommendations.ts) - Migration script

#### Performance

- **HNSW Index**: 1.5ms average query time
- **Sequential Scan**: 650ms average query time
- **Improvement**: ~430x faster with index

#### Notes Collection

Notes also have embeddings generated via the same `generateEmbedding` hook, but do NOT have recommendations computed (Notes collection doesn't have `recommended_post_ids` field).

### Database Considerations

**PostgreSQL with pgvector Extension:**
- Database: Vercel Postgres (pgvector version 0.8.0)
- Connection: Use Neon MCP to interact with database
- Configuration: Filters out PostgreSQL extension objects to prevent Drizzle conflicts (see `tablesFilter` in payload.config.ts)

**Accessing the Database via Neon MCP:**

The database is NOT in the default Neon organization. Follow this workflow:

1. **List Organizations:**
   ```
   mcp__neon__list_organizations → Find "Vercel: RoadCorp" (org-dry-credit-92650987)
   ```

2. **List Projects in Organization:**
   ```
   mcp__neon__list_projects with org_id: "org-dry-credit-92650987"
   → Find "lyovsoncom-postgres" (silent-recipe-86860418)
   ```

3. **Database Identifiers:**
   - Organization: `org-dry-credit-92650987` (Vercel: RoadCorp)
   - Project ID: `silent-recipe-86860418` (lyovsoncom-postgres)
   - Main Branch: `br-frosty-field-04223759` (main)
   - Database Name: Use default (usually `neondb`) or omit parameter

4. **Execute SQL Operations:**
   ```
   mcp__neon__run_sql(projectId, branchId, sql)
   mcp__neon__run_sql_transaction(projectId, branchId, sqlStatements)
   ```

**Important:** Always use `org_id` filter when listing projects, as the default organization is different from where the database actually lives.

### Environment Variables

Required environment variables:
- `DATABASE_URL` or `POSTGRES_URL` - Database connection
- `PAYLOAD_SECRET` - Payload CMS secret
- `OPENAI_API_KEY` - For embedding generation
- `RESEND_API_KEY` - Email service
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage

### Development Workflow

1. Run `pnpm dev` to start development server
2. Access Payload admin at `/admin`
3. Types are auto-generated on collection changes
4. Embeddings generate automatically on post/note save
5. Use grid components for all UI development
# Adding Vector Embeddings to New Collections - Complete Implementation Guide

**📅 Updated:** January 16, 2025  
**🏗️ Architecture:** Collection-specific hooks + pgvector + OpenAI  
**✅ Tested with:** Posts, Books, Notes collections

## 🎯 Overview

This guide covers **everything needed** to add vector embeddings to a new Payload CMS collection (e.g., Movies, Products, etc.). Based on our optimization work, this uses:

- **pgvector** for efficient vector storage (44% smaller than JSONB)
- **Collection-specific hooks** for maintainable, type-safe embedding generation
- **HNSW indexes** for lightning-fast similarity search
- **OpenAI text-embedding-3-small** with fallback system

---

## 📋 Complete Checklist

### ✅ **1. Database Schema (PostgreSQL + pgvector)**

```sql
-- Add pgvector columns to your collection table
ALTER TABLE {collection_name} ADD COLUMN embedding_vector vector(1536);
ALTER TABLE {collection_name} ADD COLUMN embedding_model TEXT;
ALTER TABLE {collection_name} ADD COLUMN embedding_dimensions INTEGER;
ALTER TABLE {collection_name} ADD COLUMN embedding_generated_at TIMESTAMPTZ;
ALTER TABLE {collection_name} ADD COLUMN embedding_text_hash TEXT;

-- Create HNSW index for fast similarity search
CREATE INDEX {collection_name}_embedding_cosine_idx 
ON {collection_name} USING hnsw (embedding_vector vector_cosine_ops);
```

### ✅ **2. Collection Schema Definition**

**File:** `src/collections/{CollectionName}/index.ts`

```typescript
import { generateEmbeddingHook } from './hooks/generateEmbedding'

export const {CollectionName}: CollectionConfig = {
  // ... existing collection config
  
  fields: [
    // ... existing fields
    
    // Pre-computed embedding for semantic search (pgvector format)
    {
      name: 'embedding_vector',
      type: 'text',
      admin: {
        hidden: true, // Hide from admin UI
      },
      access: {
        read: () => false, // Prevent exposure in API
        update: () => false, // Prevent manual updates
      },
      description: 'Vector embedding for semantic search (pgvector format)',
    },
    {
      name: 'embedding_model',
      type: 'text',
      admin: { hidden: true },
      access: { read: () => false, update: () => false },
    },
    {
      name: 'embedding_dimensions',
      type: 'number',
      admin: { hidden: true },
      access: { read: () => false, update: () => false },
    },
    {
      name: 'embedding_generated_at',
      type: 'date',
      admin: { hidden: true },
      access: { read: () => false, update: () => false },
    },
    {
      name: 'embedding_text_hash',
      type: 'text',
      admin: { hidden: true },
      access: { read: () => false, update: () => false },
    },
  ],
  
  hooks: {
    beforeChange: [generateEmbeddingHook],
  },
  
  versions: {
    maxPerDoc: 5, // Limit versions to prevent bloat
  },
}
```

### ✅ **3. Collection-Specific Embedding Hook**

**File:** `src/collections/{CollectionName}/hooks/generateEmbedding.ts`

```typescript
import { createEmbeddingHook, extractTextFromContent } from '@/utilities/generate-embedding'

// Collection-specific text extraction
function extract{CollectionName}Text(data: any): string {
  const parts: string[] = []
  
  // Always include title if available
  if (data.title) {
    parts.push(data.title)
  }
  
  // Add collection-specific fields
  if (data.description) {
    parts.push(data.description)
  }
  
  // Handle Lexical content if present
  if (data.content) {
    const contentText = extractTextFromContent(data.content)
    if (contentText) {
      parts.push(contentText)
    }
  }
  
  // Add any collection-specific rich content
  // Examples:
  // - Movies: plot, genre, cast
  // - Products: features, specifications
  // - Events: agenda, speakers
  
  return parts.filter(Boolean).join(' ')
}

// Create collection-specific embedding hook
export const generateEmbeddingHook = createEmbeddingHook(extract{CollectionName}Text, '{CollectionName}')
```

### ✅ **4. API Endpoint for Collection**

**File:** `src/app/api/embeddings/{collection-name}/[id]/route.ts`

```typescript
import { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { unstable_cacheTag as cacheTag, unstable_cacheLife as cacheLife } from 'next/cache'
import { generateEmbedding, extractTextFromContent } from '@/utilities/generate-embedding'

// Collection-specific text extraction for API
function extract{CollectionName}Text(item: any): string {
  // Same logic as in the hook
  const parts: string[] = []
  
  if (item.title) parts.push(item.title)
  if (item.description) parts.push(item.description)
  
  // Add collection-specific extraction logic here
  
  return parts.filter(Boolean).join(' ')
}

type Args = {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params: paramsPromise }: Args) {
  const { id } = await paramsPromise
  const { searchParams } = new URL(request.url)
  const includeContent = searchParams.get('content') === 'true'
  const format = searchParams.get('format') || 'full'
  const regenerate = searchParams.get('regenerate') === 'true'

  const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://lyovson.com'

  try {
    const payload = await getPayload({ config: configPromise })

    const item = await payload.findByID({
      collection: '{collection-name}',
      id: parseInt(id),
      depth: 2,
      select: {
        id: true,
        title: true,
        slug: true,
        // Add collection-specific fields
        publishedAt: true,
        updatedAt: true,
        embedding_vector: true,
        embedding_model: true,
        embedding_dimensions: true,
        embedding_generated_at: true,
        embedding_text_hash: true,
      },
    })

    if (!item) {
      return new Response(
        JSON.stringify({ error: '{CollectionName} not found', id: parseInt(id) }),
        { status: 404, headers: { 'Content-Type': 'application/json' } },
      )
    }

    // Parse existing embedding from pgvector format
    const itemWithEmbedding = item as any
    let existingEmbedding = null
    if (itemWithEmbedding.embedding_vector) {
      try {
        const vectorString = itemWithEmbedding.embedding_vector.replace(/^\[|\]$/g, '')
        const vectorArray = vectorString.split(',').map(Number)
        existingEmbedding = {
          vector: vectorArray,
          model: itemWithEmbedding.embedding_model,
          dimensions: itemWithEmbedding.embedding_dimensions,
          generatedAt: itemWithEmbedding.embedding_generated_at,
          textHash: itemWithEmbedding.embedding_text_hash,
        }
      } catch (error) {
        console.error('Error parsing embedding vector:', error)
      }
    }

    // Handle regeneration or missing embedding
    let embedding = existingEmbedding
    if (regenerate || !existingEmbedding) {
      const textContent = extract{CollectionName}Text(item)
      
      if (!textContent.trim()) {
        return new Response(
          JSON.stringify({
            error: '{CollectionName} has no content to embed',
            id: parseInt(id),
            title: item.title,
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } },
        )
      }

      const { vector, model, dimensions } = await generateEmbedding(textContent)
      
      embedding = {
        vector,
        model,
        dimensions,
        generatedAt: new Date().toISOString(),
        textHash: itemWithEmbedding.embedding_text_hash,
      }

      if (regenerate) {
        try {
          await payload.update({
            collection: '{collection-name}',
            id: parseInt(id),
            data: {
              embedding_vector: `[${vector.join(',')}]`,
              embedding_model: model,
              embedding_dimensions: dimensions,
              embedding_generated_at: embedding.generatedAt,
            } as any,
          })
        } catch (updateError) {
          console.error('Failed to update {collection-name} embedding:', updateError)
        }
      }
    }

    // Format response based on requested format
    const baseResponse = {
      id: item.id,
      title: item.title,
      slug: item.slug,
      url: `${SITE_URL}/{collection-name}/${item.slug}`,
      embedding: null as any,
      publishedAt: item.publishedAt,
      updatedAt: item.updatedAt,
      // Collection-specific metadata
      metadata: {
        type: '{collection-name}',
        // Add collection-specific metadata here
      },
    }

    switch (format) {
      case 'vector-only':
        baseResponse.embedding = embedding?.vector || null
        break
      case 'metadata-only':
        baseResponse.embedding = embedding
          ? {
              model: embedding.model,
              dimensions: embedding.dimensions,
              generatedAt: embedding.generatedAt,
            }
          : null
        break
      default: // 'full'
        baseResponse.embedding = embedding
        if (includeContent) {
          // Add full content based on collection needs
          ;(baseResponse as any).content = { /* collection-specific content */ }
        }
        break
    }

    const response = new Response(JSON.stringify(baseResponse, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': regenerate
          ? 'no-cache, no-store, must-revalidate'
          : 'public, max-age=3600, s-maxage=3600',
        'Access-Control-Allow-Origin': '*',
      },
    })

    cacheTag('embeddings')
    cacheTag(`embedding-{collection-name}-${id}`)
    cacheLife('max')

    return response
  } catch (error) {
    console.error('Error in {CollectionName} embeddings API:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        id: parseInt(id),
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }
}

// Handle POST requests for embedding operations
export async function POST(request: NextRequest, { params: paramsPromise }: Args) {
  const { id } = await paramsPromise

  try {
    const body = await request.json()
    const { action = 'regenerate' } = body

    if (action === 'regenerate') {
      const url = new URL(request.url)
      url.searchParams.set('regenerate', 'true')
      
      return new Response(null, {
        status: 302,
        headers: { Location: url.toString() },
      })
    }

    return new Response(
      JSON.stringify({
        error: 'Invalid action',
        validActions: ['regenerate'],
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Invalid request body' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    )
  }
}
```

### ✅ **5. Update Status Endpoint**

**File:** `src/app/api/embeddings/status/route.ts`

Add your new collection to the status monitoring:

```typescript
// Add to the Promise.all array
const [
  // ... existing collections
  all{CollectionName}, {collectionName}WithEmbeddings,
] = await Promise.all([
  // ... existing queries
  payload.find({
    collection: '{collection-name}',
    where: { _status: { equals: 'published' } },
    limit: 0,
    pagination: false,
  }),
  payload.find({
    collection: '{collection-name}',
    where: {
      _status: { equals: 'published' },
      embedding_vector: { exists: true },
    },
    limit: 0,
    pagination: false,
  }),
])

// Add to collections stats
collections: {
  // ... existing collections
  {collectionName}: {
    totalPublished: all{CollectionName}.totalDocs,
    withEmbeddings: {collectionName}WithEmbeddings.totalDocs,
    coveragePercentage: all{CollectionName}.totalDocs > 0 
      ? Math.round(({collectionName}WithEmbeddings.totalDocs / all{CollectionName}.totalDocs) * 100) 
      : 0,
    needingEmbeddings: all{CollectionName}.totalDocs - {collectionName}WithEmbeddings.totalDocs,
  },
},

// Add to endpoints
endpoints: {
  // ... existing endpoints
  {collectionName}: `${SITE_URL}/api/embeddings/{collection-name}/{id}`,
},
```

### ✅ **6. Update Documentation Files**

#### **API Documentation** (`src/app/api/docs/route.ts`)

```typescript
// Add to endpoints
endpoints: {
  // ... existing endpoints
  {collectionName}: '/api/embeddings/{collection-name}/{id}',
},

// Add to examples
'{CollectionName} embeddings': `${SITE_URL}/api/embeddings/{collection-name}/123`,
```

#### **AI Resources** (`src/app/.well-known/ai-resources/route.ts`)

```typescript
collections: {
  // ... existing collections
  {collectionName}: `${SITE_URL}/api/embeddings/{collection-name}/{id}`,
},
```

#### **AI Docs Page** (`src/app/(frontend)/ai-docs/page.tsx`)

```tsx
// Add to quick access links
<li>
  📽️{' '}
  <ExternalLink href={`${SITE_URL}/api/embeddings/{collection-name}/1`}>
    {CollectionName} API
  </ExternalLink>
</li>

// Add to examples
GET ${SITE_URL}/api/embeddings/{collection-name}/123    # {CollectionName} description
```

#### **Main Embeddings Route** (`src/app/api/embeddings/route.ts`)

If you want bulk support for your collection, add it to the bulk endpoint logic.

### ✅ **7. Regenerate TypeScript Types**

```bash
pnpm payload generate:types
```

This ensures the new pgvector fields are properly typed in `src/payload-types.ts`.

### ✅ **8. Admin Tools Update (Optional)**

**File:** `src/utilities/admin-embedding-tools.ts`

Add functions for your new collection:

```typescript
// Get collection-specific embedding stats
export async function get{CollectionName}EmbeddingStats() {
  const payload = await getPayload({ config: configPromise })

  const [all{CollectionName}, {collectionName}WithEmbeddings] = await Promise.all([
    payload.find({
      collection: '{collection-name}',
      where: { _status: { equals: 'published' } },
      limit: 0,
      pagination: false,
    }),
    payload.find({
      collection: '{collection-name}',
      where: {
        _status: { equals: 'published' },
        embedding_vector: { exists: true },
      },
      limit: 0,
      pagination: false,
    }),
  ])

  return {
    total: all{CollectionName}.totalDocs,
    withEmbeddings: {collectionName}WithEmbeddings.totalDocs,
    coverage: all{CollectionName}.totalDocs > 0 
      ? Math.round(({collectionName}WithEmbeddings.totalDocs / all{CollectionName}.totalDocs) * 100) 
      : 0,
  }
}
```

---

## 🎯 Example: Adding Embeddings to Movies Collection

Let's walk through a complete example of adding embeddings to a Movies collection:

### **1. Database Schema**

```sql
ALTER TABLE movies ADD COLUMN embedding_vector vector(1536);
ALTER TABLE movies ADD COLUMN embedding_model TEXT;
ALTER TABLE movies ADD COLUMN embedding_dimensions INTEGER;
ALTER TABLE movies ADD COLUMN embedding_generated_at TIMESTAMPTZ;
ALTER TABLE movies ADD COLUMN embedding_text_hash TEXT;

CREATE INDEX movies_embedding_cosine_idx 
ON movies USING hnsw (embedding_vector vector_cosine_ops);
```

### **2. Collection Schema** (`src/collections/Movies/index.ts`)

```typescript
import { generateEmbeddingHook } from './hooks/generateEmbedding'

export const Movies: CollectionConfig = {
  slug: 'movies',
  
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'plot', type: 'textarea' },
    { name: 'genre', type: 'select', hasMany: true, options: ['action', 'drama', 'comedy'] },
    { name: 'cast', type: 'array', fields: [{ name: 'actor', type: 'text' }] },
    
    // Embedding fields
    {
      name: 'embedding_vector',
      type: 'text',
      admin: { hidden: true },
      access: { read: () => false, update: () => false },
    },
    // ... other embedding fields
  ],
  
  hooks: {
    beforeChange: [generateEmbeddingHook],
  },
  
  versions: { maxPerDoc: 5 },
}
```

### **3. Hook** (`src/collections/Movies/hooks/generateEmbedding.ts`)

```typescript
import { createEmbeddingHook } from '@/utilities/generate-embedding'

function extractMoviesText(data: any): string {
  const parts: string[] = []
  
  if (data.title) parts.push(data.title)
  if (data.plot) parts.push(data.plot)
  
  // Include genre information
  if (data.genre && Array.isArray(data.genre)) {
    parts.push(data.genre.join(' '))
  }
  
  // Include cast information
  if (data.cast && Array.isArray(data.cast)) {
    const actors = data.cast
      .map((c: any) => c.actor)
      .filter(Boolean)
      .join(' ')
    if (actors) parts.push(actors)
  }
  
  return parts.filter(Boolean).join(' ')
}

export const generateEmbeddingHook = createEmbeddingHook(extractMoviesText, 'Movies')
```

### **4. API Endpoint** (`src/app/api/embeddings/movies/[id]/route.ts`)

```typescript
// Full implementation following the template above
// with Movies-specific text extraction and metadata
```

---

## 🚀 Performance Best Practices

### **Database Optimization**

- ✅ **Use pgvector** (44% smaller than JSONB)
- ✅ **HNSW indexes** for fast similarity search
- ✅ **Limit versions** to prevent storage bloat
- ✅ **No embeddings in version tables** (automatic)

### **Compute Optimization**

- ✅ **Only published content** gets embeddings
- ✅ **Skip drafts and autosaves** completely
- ✅ **Smart regeneration** based on content hashes
- ✅ **Collection-specific text extraction** for quality

### **API Performance**

- ✅ **Pre-computed vectors** for sub-100ms responses
- ✅ **Proper caching** with Next.js cache tags
- ✅ **Format options** (vector-only, metadata-only, full)
- ✅ **Bulk access** for training and analysis

---

## 🧪 Testing Your Implementation

### **1. Verify Database Schema**

```sql
-- Check columns exist
\d+ {collection_name}

-- Check index exists
\d {collection_name}_embedding_cosine_idx

-- Test similarity search
SELECT id, title, 
       embedding_vector <=> '[0.1,0.2,0.3,...]' as distance
FROM {collection_name} 
WHERE embedding_vector IS NOT NULL
ORDER BY distance LIMIT 5;
```

### **2. Test Embedding Generation**

1. Create/edit a published item in your collection
2. Check that embedding fields are populated
3. Verify the embedding hook is called correctly

### **3. Test API Endpoints**

```bash
# Get individual embedding
curl "https://yoursite.com/api/embeddings/{collection-name}/1"

# Test different formats
curl "https://yoursite.com/api/embeddings/{collection-name}/1?format=vector-only"
curl "https://yoursite.com/api/embeddings/{collection-name}/1?content=true"

# Force regeneration
curl "https://yoursite.com/api/embeddings/{collection-name}/1?regenerate=true"

# Check system status
curl "https://yoursite.com/api/embeddings/status"
```

---

## 🔧 Troubleshooting

### **Common Issues**

1. **Embeddings not generating**
   - Check that content is published (`_status: 'published'`)
   - Verify OpenAI API key is set
   - Check console logs for errors

2. **TypeScript errors**
   - Run `pnpm payload generate:types`
   - Ensure pgvector fields are properly defined

3. **API endpoint 404**
   - Verify directory structure and file naming
   - Check Next.js routing is working

4. **Performance issues**
   - Ensure HNSW indexes are created
   - Check that bulk queries use `embedding_vector: { exists: true }`

---

## 📚 Additional Resources

- **OpenAI Embeddings Guide**: https://platform.openai.com/docs/guides/embeddings
- **pgvector Documentation**: https://github.com/pgvector/pgvector
- **Payload CMS Hooks**: https://payloadcms.com/docs/hooks/overview
- **HNSW Algorithm**: https://arxiv.org/abs/1603.09320

---

**🎉 Success!** Your new collection now has high-performance vector embeddings with collection-specific optimization, API endpoints, and monitoring. Perfect for similarity search, recommendations, and AI applications! 
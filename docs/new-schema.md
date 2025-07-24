# Lyovson.com Knowledge Base Schema

This document outlines the evolution of Lyovson.com from a simple blog into a **family knowledge hub and public Zettelkasten** with interconnected content types supporting reviews, references, and networked thoughts.

## Recent Schema Updates ✅

**December 2024**: Posts collection simplified for better SEO and editing experience:

- ✅ **Moved `meta.image` → `featuredImage`** (root-level relationship to media)
- ✅ **Moved `meta.description` → `description`** (root-level textarea)  
- ✅ **Use `title` directly** (removed `meta.title`)
- ✅ **Removed `meta` tab** and SEO plugin complexity from Payload admin
- ✅ **Updated all components** to use new root-level fields
- ✅ **SEO metadata** now automatically generated from root-level fields

**Result**: Cleaner schema, better editing experience, maintained SEO functionality.

## Upcoming Architecture Change 🔄

### **Posts Collection Type Field Evolution**

**Current Issue**: The `Posts` collection has a `type` field that is a **relationship to a `Types` collection**. This needs to change because:

- Post types are **finite and structural** (Article, Review, Video, Podcast Episode, Photo Essay)
- Editors do **not need to add or remove types dynamically**, so a collection is unnecessary
- It simplifies the schema and unlocks **Payload's conditional field** features for post-type-specific fields

**Solution**: Replace `type` relationship with a **`select` (enum)** field:

```typescript
{
  name: 'type',
  type: 'select',
  options: [
    { label: 'Article', value: 'article' },
    { label: 'Review', value: 'review' },
    { label: 'Video', value: 'video' },
    { label: 'Podcast Episode', value: 'podcast' },
    { label: 'Photo Essay', value: 'photo' },
  ],
  required: true,
}
```

**Migration Notes**:
- **All existing posts** are currently type "Article"
- **Types collection** will be removed entirely
- **Conditional fields** will be enabled for Review posts (rating, reference)

---

## Core Collections

### 1. Posts ✅ **IMPLEMENTED**

**Purpose**: Primary content layer (articles, reviews, videos, podcasts, photo essays).

**Core Fields**:
- `title` (text) - Main title, used directly for SEO
- `slug` (text) - Auto-generated URL slug
- `type` (relationship → types) - Currently: Article, future: Review, Video, Podcast, Photo
- `content` (richText) - Main content using Lexical editor
- `description` (textarea) - Brief description for previews and SEO meta
- `featuredImage` (relationship → media) - Main image for cards and social sharing
- `publishedAt` (date) - Publication timestamp
- `authors` (relationship → users, hasMany) - Post authors

**Conditional Fields** *(enabled by select-based type field)*:
- `rating` (number 1–10) when **type = 'review'**
- `reference` (relationship → [books, movies, tvShows, videoGames]) when **type = 'review'**  
- `videoEmbedUrl` (text) when **type = 'video'**
- `podcastEmbedUrl` (text) when **type = 'podcast'**

**Implementation**:
```typescript
{
  name: 'rating',
  type: 'number',
  min: 1,
  max: 10,
  condition: (data) => data.type === 'review',
},
{
  name: 'reference',
  type: 'relationship',
  relationTo: ['books', 'movies', 'tvShows', 'videoGames'],
  condition: (data) => data.type === 'review',
}
```

**Relationships**:
- `topics` (relationship → topics, hasMany) - Editorial tags
- `project` (relationship → projects) - Grouping (e.g., podcast season)
- `relatedPosts` (relationship → posts, hasMany) - Manual connections
- *Future*: `notesReferenced`, `references`, `personsMentioned`

**Technical Features**:
- Pre-computed embedding vectors for semantic search
- Automatic slug generation from title
- Draft/publish workflow with versioning
- SEO metadata auto-generated from `title`, `description`, `featuredImage`

---

### 2. Projects ✅ **IMPLEMENTED**

**Purpose**: Grouping posts into series, seasons, or thematic collections.

**Fields**:
- `name` (text) - Project title
- `slug` (text) - URL slug
- `description` (textarea) - Project description
- `posts` (relationship → posts, hasMany) - Associated posts

**Examples**: "X-Files" (tech commentary), "Media Musings" (entertainment takes)

---

### 3. Topics ✅ **IMPLEMENTED**

**Purpose**: Editorial taxonomy for categorizing and filtering content.

**Fields**:
- `name` (text) - Topic name
- `slug` (text) - URL slug  
- `description` (textarea) - Topic description

**Examples**: "Tech", "Media", "Armenia", "Video Games"

---

### 4. Types ✅ **IMPLEMENTED**

**Purpose**: Post format categorization.

**Current Types**: Article (all existing posts)
**Planned Types**: Review, Video, Podcast Episode, Photo Essay

---

### 5. Users ✅ **IMPLEMENTED**

**Purpose**: Site authors and authentication.

**Fields**:
- `firstName`, `lastName` (text) - Author names
- `email` (email) - Authentication email  
- `avatar` (relationship → media) - Author photo
- `bio` (textarea) - Author biography

**Current**: Rafa & Jess Lyovson

---

### 6. Media ✅ **IMPLEMENTED**

**Purpose**: File storage and management.

**Features**:
- Automatic image optimization (Sharp integration)
- WebP conversion for performance
- Alt text and metadata support
- CDN integration via Vercel

---

### 7. Contacts ✅ **IMPLEMENTED**

**Purpose**: Newsletter subscribers and contact form submissions.

**Fields**:
- `email` (email) - Contact email
- `name` (text) - Contact name
- `subscribedAt` (date) - Subscription timestamp

**Integration**: Resend email service

---

## Planned Collections (Knowledge Base Expansion)

### 8. Books, Movies, TV Shows, Video Games (References) 📋 **PLANNED**

**Purpose**: Structured source materials for reviews and citations.

**Shared Fields**:
- `title` (text) - Reference title
- `slug` (text) - URL slug
- `coverImage` (relationship → media) - Cover art
- `description` (textarea) - Brief description
- `releaseDate` (date) - When it was published/released
- *Note: External API sync (Google Books, OMDb, IGDB) removed for initial simplicity*

**Quote Fields**:
- `rafasQuotes` (array of text) - Rafa's highlighted quotes
- `jesssQuotes` (array of text) - Jess's highlighted quotes

**Relationships**:
- `creators` (relationship → persons, hasMany) - Authors, directors, developers

**Manual Entry**: References will be manually created (no external API dependency)

**Simplified Fields for Initial Implementation**:
```typescript
// Books Collection Example
{
  name: 'title',
  type: 'text',
  required: true,
},
{
  name: 'description', 
  type: 'textarea',
},
{
  name: 'coverImage',
  type: 'upload',
  relationTo: 'media',
},
{
  name: 'releaseDate',
  type: 'date',
  admin: {
    date: { pickerAppearance: 'dayOnly' }
  }
},
{
  name: 'rafasQuotes',
  type: 'array',
  fields: [{ name: 'quote', type: 'textarea' }]
},
{
  name: 'jesssQuotes', 
  type: 'array',
  fields: [{ name: 'quote', type: 'textarea' }]
}
```

**Future Enhancement**: External API sync can be added later without breaking existing data

---

### 9. Persons 📋 **PLANNED**

**Purpose**: People in the knowledge graph (authors, directors, public figures).

**Fields**:
- `name` (text) - Person's name
- `slug` (text) - URL slug
- `photo` (relationship → media) - Person's photo
- `bio` (textarea) - Biography
- `roles` (select, hasMany) - author, director, actor, musician, developer, publicFigure

**Graph Connections**:
- Referenced by `creators` in References
- Referenced by `personsMentioned` in Posts  
- Linked by `connections` in Notes

---

### 10. Notes 📋 **PLANNED**

**Purpose**: Zettelkasten-style atomic thoughts and annotations.

**Fields**:
- `title` (text) - Note title
- `content` (richText) - Note content
- `author` (select: rafa, jess) - Note author
- `visibility` (select: public) - Visibility setting
- `connections` (relationship → [posts, books, movies, tvShows, videoGames, persons, notes], hasMany) - Network links

**Vision**: Public digital garden mirroring private Obsidian vault.

---

### 11. Links 📋 **PLANNED**

**Purpose**: Attach arbitrary URLs to any content entity.

**Fields**:
- `label` (text) - Link description
- `url` (text) - Target URL
- `referenceType` (select) - Type of linked entity
- `reference` (polymorphic relationship) - Linked entity

**Use Cases**: Attach sources, related articles, social media posts to any content.

---

## Network Effect Vision

The complete system will create a **living, interconnected knowledge graph**:

- **Posts** link to source materials, people mentioned, and supporting notes
- **Reviews** connect to detailed reference information and creator profiles  
- **References** preserve important quotes and link to their creators
- **Persons** show their complete presence across posts, notes, and created works
- **Notes** form bridges between disparate ideas and content
- **Links** attach external context to any node in the graph

This transforms Lyovson.com from a blog into a **navigable family knowledge base** where readers can explore not just what you think, but the sources, people, and ideas that inform your thinking.

---

## Implementation Status

| Collection | Status | Notes |
|------------|--------|-------|
| Posts | 🔄 **Needs Migration** | Change type from relationship → select, add conditional fields |
| Projects | ✅ Complete | Grouping working well |
| Topics | ✅ Complete | Editorial taxonomy functional |
| Types | 🗑️ **Remove** | Will be replaced by Posts.type select field |
| Users | ✅ Complete | Auth and author profiles |
| Media | ✅ Complete | Optimized file handling |
| Contacts | ✅ Complete | Newsletter integration |
| References | 📋 Planned | Books, movies, games, TV (manual entry, no external APIs) |
| Persons | 📋 Planned | People in knowledge graph |
| Notes | 📋 Planned | Zettelkasten layer |
| Links | 📋 Planned | External URL attachments |

**Next Phase**: 
1. **Migrate Posts collection** (type field + conditional fields)
2. **Remove Types collection**
3. **Implement Books collection** for review functionality

---

## Migration Plan 🚚

### Step 1: Posts Collection Type Field Migration

**Current Schema**:
```typescript
{
  name: 'type',
  type: 'relationship',
  relationTo: 'types',
  required: true,
}
```

**New Schema**:
```typescript
{
  name: 'type',
  type: 'select',
  options: [
    { label: 'Article', value: 'article' },
    { label: 'Review', value: 'review' },
    { label: 'Video', value: 'video' },
    { label: 'Podcast Episode', value: 'podcast' },
    { label: 'Photo Essay', value: 'photo' },
  ],
  required: true,
  defaultValue: 'article',
}
```

**Data Migration**: 
- All existing posts currently reference a Types record (likely "Article")
- Migration will convert all existing posts to `type: 'article'` 
- **Zero downtime**: New select field will be backward compatible

### Step 2: Add Conditional Fields

```typescript
{
  name: 'rating',
  type: 'number',
  min: 1,
  max: 10,
  admin: {
    description: '10-star rating system',
    condition: (data) => data.type === 'review',
  },
},
{
  name: 'reference',
  type: 'relationship',
  relationTo: ['books', 'movies', 'tvShows', 'videoGames'],
  admin: {
    description: 'What is being reviewed',
    condition: (data) => data.type === 'review',
  },
},
{
  name: 'videoEmbedUrl',
  type: 'text',
  admin: {
    description: 'YouTube, Vimeo, or other video embed URL',
    condition: (data) => data.type === 'video',
  },
},
{
  name: 'podcastEmbedUrl', 
  type: 'text',
  admin: {
    description: 'Spotify, Apple Podcasts, or other podcast embed URL',
    condition: (data) => data.type === 'podcast',
  },
}
```

### Step 3: Safe Database Migration Strategy

**Current Database State**:
- All existing posts have `type` as relationship to Types collection
- Likely one "Article" type record that all posts reference
- Posts are live on production site

**Migration Order** (to prevent data loss):

1. **Add new `typeSelect` field** to Posts collection (alongside existing `type` relationship)
   ```typescript
   {
     name: 'typeSelect',
     type: 'select',
     options: [
       { label: 'Article', value: 'article' },
       { label: 'Review', value: 'review' },
       { label: 'Video', value: 'video' },
       { label: 'Podcast Episode', value: 'podcast' },
       { label: 'Photo Essay', value: 'photo' },
     ],
     defaultValue: 'article',
     admin: {
       position: 'sidebar',
       description: 'New type field - will replace relationship'
     }
   }
   ```

2. **Run data migration script** to populate `typeSelect` with 'article' for all existing posts
3. **Update all frontend components** to use `post.typeSelect` instead of `post.type`
4. **Test thoroughly** in production to ensure no breaking changes
5. **Remove old `type` relationship field** from Posts collection  
6. **Rename `typeSelect` → `type`** for clean final schema
7. **Delete Types collection** and remove from config

**Benefits**:
- ✅ **Zero downtime**: Site continues working during migration
- ✅ **Data safety**: Old data preserved until migration confirmed  
- ✅ **Rollback ready**: Can revert if issues arise
- ✅ **Testing friendly**: Can test new field before switching
- ✅ **Production safe**: No risk to live posts

### Step 4: Remove Types Collection

- Delete `src/collections/Types/index.ts`  
- Remove Types import from `payload.config.ts`
- Update any remaining components that reference Types collection
# AI-Friendly Features Setup Guide

## Overview
Your site now includes comprehensive AI-friendly features including meta tags, embeddings API, and enhanced content access methods.

## Environment Variables

Add these to your `.env.local` file:

```bash
# Required - Your site URL
NEXT_PUBLIC_SERVER_URL=https://lyovson.com

# Optional - OpenAI API for embeddings (recommended for production)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Optional - Site verification for search engines
GOOGLE_SITE_VERIFICATION=your-google-verification-code
BING_SITE_VERIFICATION=your-bing-verification-code
FACEBOOK_DOMAIN_VERIFICATION=your-facebook-verification-code
```

## Features Added

### 1. AI-Specific Meta Tags
- **Site-wide tags**: Added to `src/app/(frontend)/layout.tsx`
- **Article-specific tags**: Added to `src/app/(frontend)/[project]/[slug]/page.tsx`
- **Purpose**: Help AI systems understand content structure and licensing

### 2. Vector Embeddings API
- **Bulk embeddings**: `GET /api/embeddings?type=posts&limit=50`
- **Individual post**: `GET /api/embeddings/posts/{id}`
- **Query embedding**: `GET /api/embeddings?q=search-term`
- **Purpose**: Enable semantic search and content similarity analysis

### 3. Enhanced Content Feeds
- **Full content**: RSS, JSON, and Atom feeds now include complete article text
- **AI metadata**: Word count, reading time, topics, and API URLs
- **Purpose**: Better bulk content consumption for AI training

### 4. API Documentation
- **Machine-readable**: `GET /api/docs` (JSON format)
- **Human-readable**: `/ai-docs` page
- **Well-known URI**: `/.well-known/ai-resources`
- **Purpose**: Help AI systems discover and understand available endpoints

### 5. Enhanced robots.txt
- **AI bot support**: Explicit rules for GPTBot, Claude-Web, PerplexityBot, etc.
- **Granular permissions**: Different access levels for different bot types
- **Purpose**: Guide AI crawlers to the right content

## Usage Examples

### For AI Systems

1. **Discover available resources**:
   ```bash
   curl https://lyovson.com/.well-known/ai-resources
   ```

2. **Get API documentation**:
   ```bash
   curl https://lyovson.com/api/docs
   ```

3. **Access content feeds**:
   ```bash
   # JSON Feed with full content and metadata
   curl https://lyovson.com/feed.json
   
   # RSS Feed
   curl https://lyovson.com/feed.xml
   ```

4. **Get embeddings for semantic search**:
   ```bash
   # Get embedding for a query
   curl "https://lyovson.com/api/embeddings?q=programming tutorials"
   
   # Get embedding for a specific post
   curl https://lyovson.com/api/embeddings/posts/123
   
   # Get all post embeddings
   curl "https://lyovson.com/api/embeddings?type=posts&limit=10"
   ```

### For Research and Academic Use

1. **Bulk content access**:
   ```bash
   # Get all posts via GraphQL
   curl -X POST https://lyovson.com/api/graphql \
     -H "Content-Type: application/json" \
     -d '{"query": "{ Posts(limit: 100) { docs { title content } } }"}'
   ```

2. **Structured data access**:
   ```bash
   # Get posts with full metadata
   curl "https://lyovson.com/api/posts?depth=2&limit=50"
   ```

## OpenAI Embeddings Setup (Optional)

If you want to use OpenAI's high-quality embeddings instead of the fallback hash-based vectors:

1. **Get an OpenAI API key** from https://platform.openai.com/
2. **Add to environment variables**:
   ```bash
   OPENAI_API_KEY=sk-your-key-here
   ```
3. **Benefits**:
   - Much higher quality semantic embeddings
   - 1536-dimensional vectors (vs 384 for fallback)
   - Better similarity calculations
   - Industry-standard embedding model

## Without OpenAI API Key

The system will automatically fall back to:
- **Hash-based vectors**: Simple but functional similarity calculations
- **384-dimensional vectors**: Smaller but still useful for basic similarity
- **No external dependencies**: Everything works offline

## Rate Limits

- **Feeds**: 1000 requests/hour (recommended for bulk access)
- **API endpoints**: 100 requests/hour
- **Embeddings**: Same as API (cached for 2 hours)

## Content Licensing

- **Attribution required**: "Lyovson.com - https://lyovson.com"
- **Contact for licensing**: hello@lyovson.com
- **Academic use**: Generally permitted with attribution

## Testing the Setup

1. **Check meta tags**:
   ```bash
   curl -s https://lyovson.com | grep -i "ai-"
   ```

2. **Test embeddings endpoint**:
   ```bash
   curl "https://lyovson.com/api/embeddings?q=test"
   ```

3. **Verify robots.txt**:
   ```bash
   curl https://lyovson.com/robots.txt
   ```

4. **Check AI documentation**:
   ```bash
   curl https://lyovson.com/api/docs | jq .
   ```

## Support

For questions about using these AI-friendly features:
- **Email**: hello@lyovson.com
- **Documentation**: https://lyovson.com/ai-docs
- **API Docs**: https://lyovson.com/api/docs

---

*This setup makes your site maximally friendly for AI systems, research bots, and automated content consumption while maintaining proper attribution and rate limiting.* 
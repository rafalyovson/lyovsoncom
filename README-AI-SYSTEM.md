# 🤖 AI System Quick Reference

## ⚡ **Key Endpoints**

### Vector Embeddings (High Performance)

- 🏥 **Health Check**: `/api/embeddings/status`
- 📄 **Individual Post**: `/api/embeddings/posts/{id}` (~50ms)
- 📦 **Bulk Access**: `/api/embeddings?type=posts&limit=50`
- 🔍 **Query Embedding**: `/api/embeddings?q=search-term`

### Content Discovery

- 📊 **API Docs**: `/api/docs` (OpenAPI 3.0)
- 📖 **Human Docs**: `/ai-docs`
- 🤖 **AI Resources**: `/.well-known/ai-resources`
- 🗺️ **Sitemap**: `/sitemap.xml`
- 🤖 **Robots**: `/robots.txt`

### Content Feeds

- 📋 **JSON Feed**: `/feed.json` (with AI metadata)
- 📡 **RSS Feed**: `/feed.xml`
- ⚛️ **Atom Feed**: `/atom.xml`

## 🧬 **System Features**

✅ **OpenAI text-embedding-3-small** (1536D vectors)  
✅ **Pre-computed embeddings** (sub-100ms responses)  
✅ **Smart content change detection**  
✅ **Automatic generation** on post publish/update  
✅ **Graceful fallback** without OpenAI API key  
✅ **AI-specific meta tags** on all pages  
✅ **Enhanced robots.txt** with AI bot permissions  
✅ **Full-content feeds** with rich metadata  
✅ **System health monitoring**  
✅ **Admin utilities** for bulk management

## 📊 **Quick Status Check**

```bash
# System health
curl "https://lyovson.com/api/embeddings/status" | jq '.system, .statistics'

# Test embeddings
curl "https://lyovson.com/api/embeddings?q=test" | jq '.model, .dimensions'
```

## 🎯 **For AI Developers**

**Discovery**: robots.txt → sitemap.xml → .well-known/ai-resources  
**Bulk Content**: `/feed.json` (preferred) or `/api/embeddings`  
**Semantic Search**: `/api/embeddings` for similarity matching  
**Attribution**: "Lyovson.com - https://lyovson.com"  
**Rate Limits**: 1000/hour (feeds), 100/hour (APIs)

## 📚 **Documentation**

- **Complete Guide**: `docs/ai-system-complete.md`
- **Setup Instructions**: `docs/embeddings-upgrade-guide.md`
- **Admin Tools**: `src/utilities/admin-embedding-tools.ts`

---

**🚀 Your site is now production-ready for AI applications!**

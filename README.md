# Lyóvson.com

**The official website of Rafa and Jess Lyóvson**

A personal family blog combined with a public zettelkasten (digital knowledge garden) where we share our thoughts, ideas, and intellectual journey as a family.

---

## 🎯 Purpose

This site serves as both:

- **Family Blog**: Articles, reviews, and project updates from Rafa and Jess
- **Public Zettelkasten**: A connected web of notes, ideas, and thoughts that evolve over time
- **Knowledge Base**: References to books, movies, and other media with our family's thoughts and quotes
- **Dynasty Archive**: A growing collection of family wisdom that will expand as our family grows

## 🏗️ Architecture

### **Core Technologies**

- **Frontend**: Next.js 15+ (App Router) with React 19+ Server Components
- **CMS**: Payload CMS v3 (Headless CMS)
- **Database**: Neon Postgres with pgvector for semantic search
- **Styling**: Tailwind CSS + Shadcn UI components
- **Animations**: Motion for React
- **Rich Text**: Lexical Editor
- **Email**: Resend
- **Hosting**: Vercel

### **AI & Search**

- **Vector Embeddings**: pgvector 0.8.0 (VARCHAR storage with runtime casts)
- **Semantic Search**: Powered by text-embedding models
- **Content Discovery**: AI-driven connections between posts and notes

## 📚 Content Structure

### **Posts Collection**

Articles, reviews, and project updates written by family members

- **Types**: Articles, Reviews, Project Updates
- **Features**: Rich text content, semantic search, cross-references

### **Notes Collection**

Zettelkasten-style notes with different types and purposes

- **Permanent Notes**: Developed concepts and ideas
- **Literature Notes**: Quotes and thoughts from books/media
- **Fleeting Notes**: Quick captures and temporary thoughts
- **Index Notes**: Navigation and organization

### **Reference Collections**

Curated collections of external content with API integrations and family curation

- **Books**: Google Books API integration with authors, genres, publication data
- **Movies**: OMDB API integration with directors, actors, cast information
- **TV Shows**: Episode tracking, creators, cast, and seasonal organization
- **Music**: Albums and songs with artists, genres, and streaming platform links
- **Podcasts**: Episodes with hosts, guests, and platform availability
- **Video Games**: Gaming collection with developers, platforms, and genres
- **People**: Central registry of creators, authors, directors, and other contributors
- **Links**: Curated web content, articles, and casual video references

#### **People Collection - Multi-Role System**

The People collection serves as a central registry for all creators and contributors:

- **Multiple Roles**: Authors, directors, actors, hosts, musicians, developers
- **Cross-Media Relationships**: One person can be linked to books, movies, podcasts, etc.
- **Bidirectional Connections**: People → Media and Media → People relationships
- **Literature Notes**: Can reference people directly for quotes and thoughts

#### **Family Curation Features**

- **Reading/Watching/Listening Status**: Track progress across all media types
- **Family Ratings**: Shared scores and opinions on content
- **Quote Collections**: Meaningful passages with family commentary and analysis
- **Cross-References**: Connect media to posts, notes, and other references

## 🔍 Key Features

### **Semantic Discovery**

- **Related Content**: AI-powered suggestions while writing
- **Cross-Author Insights**: Find where family members wrote about similar themes
- **Unexpected Connections**: Discover links between seemingly unrelated ideas
- **Literature Integration**: Connect quotes to original thoughts

### **Family-Specific Workflows**

- **Multi-Author System**: Content from both Rafa and Jess
- **Family Ratings**: Shared opinions on books, movies, and shows
- **Cross-References**: Manual and automatic connections between content
- **Knowledge Evolution**: Track how ideas develop over time

### **Content Organization**

- **Flexible Relationships**: Notes can connect to posts, other notes, and references
- **Status Tracking**: Reading/watching progress for media
- **Automatic Metadata**: Generated embeddings, timestamps, and hashes
- **Version Control**: Draft and published states with version history

## 🎨 Design Philosophy

### **Content-First Approach**

- **Server-Side Rendering**: Fast initial page loads
- **Minimal JavaScript**: Progressive enhancement for interactivity
- **Responsive Design**: Mobile-first with elegant desktop experience
- **Accessibility**: WCAG compliance and semantic HTML

### **Zettelkasten Principles**

- **Atomic Notes**: Each note represents a single idea
- **Linking**: Extensive cross-referencing between concepts
- **Emergence**: Ideas develop through connections over time
- **No Hierarchy**: Organic organization rather than rigid structure

## 🚀 Getting Started

### **Development Setup**

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Start development server
pnpm dev
```

### **Database Setup**

- Configure Neon Postgres connection
- Run Payload CMS migrations
- Set up pgvector extension
- Embeddings auto-generate on publish (no manual setup needed)

### **Content Management**

- Access Payload CMS admin at `/admin`
- Create posts and notes through the CMS
- Embeddings are generated automatically
- Semantic search works immediately

## 📈 Scaling Strategy

### **Current Capacity**

- **Content**: Optimized for thousands of posts and notes
- **Performance**: Fast semantic search queries (~2.7ms at current scale)
- **Storage**: Efficient vector storage with Neon Postgres
- **Costs**: Minimal overhead with serverless architecture

### **Future Growth**

- **Multi-generational**: Designed to grow with the family
- **Knowledge Accumulation**: Years of connected thoughts and ideas
- **Cross-generational Discovery**: Find connections across time periods
- **Archive Stability**: Built for long-term preservation

## 🔧 Configuration

### **Key Environment Variables**

```env
# Database
DATABASE_URL=postgresql://...

# Payload CMS
PAYLOAD_SECRET=...

# OpenAI (for embeddings)
OPENAI_API_KEY=...

# Email
RESEND_API_KEY=...
```

### **Payload CMS Collections**

- `posts` - Family blog articles and reviews
- `notes` - Zettelkasten notes with types and literature notes
- `books` - Book references with Google Books API integration
- `movies` - Movie references with OMDB API integration
- `tvShows` - TV show references with episode and season tracking
- `music` - Albums and songs with streaming platform integration
- `podcasts` - Podcast episodes with hosts and platform links
- `videoGames` - Gaming collection with platforms and developers
- `people` - Multi-role creator registry (authors, directors, artists, etc.)
- `links` - Curated web content and casual references

## 🤝 Family Collaboration

### **Writing Workflow**

1. Create content in Payload CMS
2. AI suggests related existing content
3. Add manual connections between ideas
4. Publish to generate embeddings
5. Discover unexpected connections over time

### **Knowledge Building**

- **Literature Notes**: Save meaningful quotes with commentary
- **Idea Development**: Grow fleeting notes into permanent concepts
- **Cross-Pollination**: Find connections between family members' thoughts
- **Wisdom Accumulation**: Build a searchable family knowledge base

## 📖 Documentation

- **Architecture Details**: See `/docs/architecture.md`
- **Embedding Strategy**: See `/docs/new-schema-2.md`
- **Design System**: See `/docs/design-system.md`
- **Implementation Guide**: See `/docs/implementation-guide.md`

## 🎯 Future Vision

This site is designed to be a **multi-generational family knowledge base** - a place where ideas, thoughts, and wisdom accumulate over time. As our family grows, so will the connections between concepts, creating an ever-richer web of family intellectual history.

The combination of modern web technology with timeless zettelkasten principles creates a platform for long-term knowledge building that will serve the Lyóvson family for decades to come.

---

**Built with ❤️ by the Lyóvson family**

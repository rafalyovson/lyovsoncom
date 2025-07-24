### **1. Posts Collection Evolution**

- The `Posts` collection previously had a `type` field that was a **relationship to a `Types` collection**.
- This field will now be replaced with a **`select` (enum)** field because:
    - Post types are **finite and structural** (Article, Review, Video, Podcast Episode, Photo Essay).
    - Editors do **not need to add or remove types dynamically**, so a collection is unnecessary.
    - It simplifies the schema and unlocks **Payload’s conditional field** features for post‑type‑specific fields.

### **2. Current & New Post Types**

- **All existing posts** are of type **Article**.
- A new **Review** type is being added.
- Other types (Video, Podcast Episode, Photo Essay, etc.) can be added easily over time.

### **3. Review‑Specific Fields**

When a Post is of type **Review**, two additional fields will be conditionally shown:

- **`rating`**: A number between **1–10**, representing a 10‑star rating system.
- **`reference`**: A **relationship field** pointing to the entity being reviewed (Book, Movie, TV Show, Video Game, etc.).

---

### **4. Expanding Beyond Posts: The Knowledge Base**

To support reviews and evolve Lyovson.com into a **family knowledge hub + public Zettelkasten**, the following collections will be added:

### **4.1. References**

Five separate collections: **Books**, **Movies**, **TV Shows**, **Video Games**, and **Links**

- **Shared fields**: title (text), slug (text), coverImage (media), externalId (text for API sync), metadata group (creator names or persons, releaseDate, etc.)
- **Quote fields** on each reference (excluding Links):
    - `rafasQuotes` (array of text)
    - `jesssQuotes` (array of text)
- **Relationships**:
    - `creators` (relationship → persons)

### Links

A special reference collection for arbitrary URLs:

- **Fields**: label (text), url (text)
- **Relationships**:
    - `referenceType` (select: books, movies, tvShows, videoGames, posts, persons, notes, projects)
    - `reference` (relationship → ["books","movies","tvShows","videoGames","posts","persons","notes","projects"])

### **4.2. Persons** Persons**

A `Persons` collection for individuals (authors, directors, actors, public figures)

- **Fields**: name (text), slug (text), photo (media), bio (textarea), roles (select: author, director, actor, musician, developer, publicFigure)
- **Relationships**:
    - Linked from References (`creators`)
    - Referenced by Posts (`personsMentioned`)
    - Linked in Notes (`connections`)

### **4.3. Notes**

Merged Zettelkasten-style “atomic thoughts” and annotations:

- **Fields**: title (text), content (richText), author (select: rafa, jess), visibility (select: public)
- **Relationships**: `connections` → posts, books, movies, tvShows, videoGames, persons, notes (hasMany)

### **4.4. Links**

A central `Links` collection to attach arbitrary URLs to any entity:

- **Fields**: label (text), url (text)
- **Polymorphic**:
    - `referenceType` (select: books, movies, tvShows, videoGames, posts, persons, notes, projects)
    - `reference` (relationship → ["books","movies","tvShows","videoGames","posts","persons","notes","projects"])

---

### **5. How It All Connects**

- **Posts** → link to `notesReferenced`, `references` (Books/Movies/TVShows/Games), `personsMentioned`, `topics`, `project`, `relatedPosts`.
- **Reviews** → use `rating` + `reference`.
- **References** → have source quotes and link to `persons` (creators).
- **Persons** → show where they appear in Posts, Notes, and References.
- **Notes** → networked across everything (Posts, References, Persons, other Notes).
- **Links** → attach additional URLs to any content node.

---

### **6. Why This Matters**

- Transforms Lyovson.com into a **living, interlinked family knowledge base**.
- **Public by default**: only site-ready info lives here.
- Mirrors your private Obsidian vault but **turns it into a navigable, publishable digital garden**.
- Readers (and future family members) can explore posts, source materials, people, ideas, and external resources in one cohesive graph.

---

### 1. Posts

**Purpose**: Narrative layer (articles, reviews, videos, podcasts, photo essays).
**Key Fields**:

- `title` (text)
- `slug` (text)
- `type` (select: article, review, video, podcast, photo)
- `content` (richText)
- `excerpt` (text) *(optional custom excerpt)*
- `coverImage` (relationship → media) *(optional)*
- `publishedAt` (date)
- `authors` (relationship → users, hasMany)

**Conditional Fields**:

- `rating` (number 1–10) when **type = review**
- `reference` (relationship → [books, movies, tvShows, videoGames]) when **type = review**
- `videoEmbedUrl` (text) when **type = video**
- `podcastEmbedUrl` (text) when **type = podcast**

**Graph Relationships**:

- `notesReferenced` (relationship → notes, hasMany)
- `references` (relationship → [books, movies, tvShows, videoGames], hasMany)
- `personsMentioned` (relationship → persons, hasMany)
- `topics` (relationship → topics, hasMany)
- `project` (relationship → projects)
- `relatedPosts` (relationship → posts, hasMany)

**Utilities**:

- SEO meta fields (title, description, image)
- Embedding vector group
- Slug field
- Versioning/drafts

---

### 2. Books, Movies, TVShows, Games (References)

**Purpose**: Structured source materials for reviews and citations.

**Shared Fields**:

- `title` (text)
- `slug` (text)
- `coverImage` (relationship → media)
- `externalId` (text) *(ID from Google Books / OMDb / IGDB)*
- `metadata` (group):
    - `creatorNames` (text or relationship to persons)
    - `releaseDate` (date)
    - other type-specific metadata

**Quote Fields**:

- `rafasQuotes` (array of text)
- `jesssQuotes` (array of text)

**Graph Relationships**:

- `creators` (relationship → persons, hasMany)
:
- `creators` (relationship → persons, hasMany)

---

### 3. Persons

**Purpose**: Individuals (authors, directors, actors, etc.) in your knowledge graph.

**Fields**:

- `name` (text)
- `slug` (text)
- `photo` (relationship → media)
- `bio` (textarea)
- `roles` (select, hasMany: author, director, actor, musician, developer, publicFigure)

**Quote Fields**: *(none — quotes live on References)*

**Graph Relationships**:

- Linked by `creators` in References
- Referenced by `personsMentioned` in Posts
- Linked by `connections` in Notes

---

### 4. Notes

**Purpose**: Zettelkasten-style atomic thoughts and annotations (standalone or linked to other entities).

**Fields**:

- `title` (text)
- `content` (richText)
- `author` (select: rafa, jess)
- `connections` (relationship → [posts, books, movies, tvShows, videoGames, persons, notes], hasMany)
- `tags` (optional relationship → topics or tags)
- `visibility` (select: public) *(future private option)*

---

### 5. Projects

**Purpose**: Grouping of Posts into series or seasons (e.g., podcast seasons, video series).

**Fields**:

- `title` (text)
- `slug` (text)
- `description` (textarea)
- `posts` (relationship → posts, hasMany)

---

### 6. Topics

**Purpose**: Editorial taxonomy (tags/categories) for Posts and Notes.

**Fields**:

- `name` (text)
- `slug` (text)
- `description` (textarea)
- `color` (text) *(optional UI accent)*

---

### 7. Users

**Purpose**: Authors (currently you & Jess).

**Fields**:

- `firstName` (text)
- `lastName` (text)
- `email` (email)
- `avatar` (relationship → media)
- `bio` (textarea)

---

### 8. Media

**Purpose**: File storage (images, video thumbnails, audio files).

**Fields**:

- Managed by Payload’s Upload type.

---

### 9. Contacts

**Purpose**: Newsletter signups and messaging (Resend integration).

**Fields**:

- `email` (email)
- `name` (text)
- `subscribedAt` (date)
- other contact metadata

---

### 10. Links

**Purpose**: Central URL entries that attach to any entity (References, Posts, Persons, Notes, Projects).

**Fields**:

- `label` (text)
- `url` (text)
- `referenceType` (select: books, movies, tvShows, videoGames, posts, persons, notes, projects)
- `reference` (relationship → ["books","movies","tvShows","videoGames","posts","persons","notes","projects"])

---

### 1. Posts

**Purpose**: Narrative layer (articles, reviews, videos, podcasts, photo essays).
**Key Fields**:

- `title` (text)
- `slug` (text)
- `type` (select: article, review, video, podcast, photo)
- `content` (richText)
- `excerpt` (text) *(optional custom excerpt)*
- `coverImage` (relationship → media) *(optional)*
- `publishedAt` (date)
- `authors` (relationship → users, hasMany)

**Conditional Fields**:

- `rating` (number 1–10) when **type = review**
- `reference` (relationship → [books, movies, tvShows, videoGames]) when **type = review**
- `videoEmbedUrl` (text) when **type = video**
- `podcastEmbedUrl` (text) when **type = podcast**

**Graph Relationships**:

- `notesReferenced` (relationship → notes, hasMany)
- `references` (relationship → [books, movies, tvShows, videoGames], hasMany)
- `personsMentioned` (relationship → persons, hasMany)
- `topics` (relationship → topics, hasMany)
- `project` (relationship → projects)
- `relatedPosts` (relationship → posts, hasMany)

**Utilities**:

- SEO meta fields (title, description, image)
- Embedding vector group
- Slug field
- Versioning/drafts

---

### 2. Books, Movies, TVShows, Games (References)

**Purpose**: Structured source materials for reviews and citations.

**Shared Fields**:

- `title` (text)
- `slug` (text)
- `coverImage` (relationship → media)
- `externalId` (text) *(ID from Google Books / OMDb / IGDB)*
- `metadata` (group):
    - `creatorNames` (text or relationship to persons)
    - `releaseDate` (date)
    - other type-specific metadata

**Quote Fields**:

- `rafasQuotes` (array of text)
- `jesssQuotes` (array of text)

**Graph Relationships**:

- `creators` (relationship → persons, hasMany)
:
- `creators` (relationship → persons, hasMany)

---

### 3. Persons

**Purpose**: Individuals (authors, directors, actors, etc.) in your knowledge graph.

**Fields**:

- `name` (text)
- `slug` (text)
- `photo` (relationship → media)
- `bio` (textarea)
- `roles` (select, hasMany: author, director, actor, musician, developer, publicFigure)

**Quote Fields**: *(none — quotes live on References)*

**Graph Relationships**:

- Linked by `creators` in References
- Referenced by `personsMentioned` in Posts
- Linked by `connections` in Notes

---

### 4. Notes

**Purpose**: Zettelkasten-style atomic thoughts and annotations (standalone or linked to other entities).

**Fields**:

- `title` (text)
- `content` (richText)
- `author` (select: rafa, jess)
- `connections` (relationship → [posts, books, movies, tvShows, videoGames, persons, notes], hasMany)
- `tags` (optional relationship → topics or tags)
- `visibility` (select: public) *(future private option)*

---

### 5. Projects

**Purpose**: Grouping of Posts into series or seasons (e.g., podcast seasons, video series).

**Fields**:

- `title` (text)
- `slug` (text)
- `description` (textarea)
- `posts` (relationship → posts, hasMany)

---

### 6. Topics

**Purpose**: Editorial taxonomy (tags/categories) for Posts and Notes.

**Fields**:

- `name` (text)
- `slug` (text)
- `description` (textarea)
- `color` (text) *(optional UI accent)*

---

### 7. Users

**Purpose**: Authors (currently you & Jess).

**Fields**:

- `firstName` (text)
- `lastName` (text)
- `email` (email)
- `avatar` (relationship → media)
- `bio` (textarea)

---

### 8. Media

**Purpose**: File storage (images, video thumbnails, audio files).

**Fields**:

- Managed by Payload’s Upload type.

---

### 9. Contacts

**Purpose**: Newsletter signups and messaging (Resend integration).

**Fields**:

- `email` (email)
- `name` (text)
- `subscribedAt` (date)
- other contact metadata

---

### 10. Links

**Purpose**: Central URL entries that attach to any entity (References, Posts, Persons, Notes, Projects).

**Fields**:

- `label` (text)
- `url` (text)
- `referenceType` (select: books, movies, tvShows, videoGames, posts, persons, notes, projects)
- `reference` (relationship → ["books","movies","tvShows","videoGames","posts","persons","notes","projects"])
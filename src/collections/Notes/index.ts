import type { CollectionConfig } from 'payload'
import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { slugField } from '@/fields/slug'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { getServerSideURL } from '@/utilities/getURL'
import { generateEmbeddingHook } from './hooks/generateEmbedding'

export const Notes: CollectionConfig = {
  slug: 'notes',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    author: true,
    visibility: true,
    connections: true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'visibility', 'updatedAt'],
    livePreview: {
      url: ({ data }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'notes',
        })

        return `${getServerSideURL()}${path}`
      },
    },
    preview: (data) => {
      const path = generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'notes',
      })

      return `${getServerSideURL()}${path}`
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'The main title of your note',
      },
    },
    {
      name: 'author',
      type: 'select',
      options: [
        { label: 'Rafa', value: 'rafa' },
        { label: 'Jess', value: 'jess' },
      ],
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Who wrote this note?',
      },
    },
    {
      name: 'visibility',
      type: 'select',
      options: [
        { label: 'Public', value: 'public' },
        // Future: private, draft, etc.
      ],
      defaultValue: 'public',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Who can see this note?',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'content',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
                },
              }),
              label: false,
              required: true,
            },
          ],
          label: 'Content',
          description: 'Write your note content here',
        },
        {
          fields: [
            {
              name: 'connections',
              type: 'relationship',
              relationTo: ['posts', 'books', 'movies', 'tvShows', 'videoGames', 'people', 'notes'],
              hasMany: true,
              admin: {
                description: 'Connect this note to other content in your knowledge base',
              },
            },
          ],
          label: 'Connections',
          description: 'Link this note to related posts, books, people, and other notes',
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
        description: 'When this note should be published',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    // Pre-computed embedding for semantic search (pgvector format)
    {
      name: 'embedding_vector',
      type: 'text', // Maps to vector(1536) in database
      access: {
        update: () => false, // Only updated via hooks
      },
      admin: {
        hidden: true,
        description: 'Vector embedding for semantic search (pgvector format)',
      },
    },
    {
      name: 'embedding_model',
      type: 'text',
      access: {
        update: () => false,
      },
      admin: {
        hidden: true,
      },
    },
    {
      name: 'embedding_dimensions',
      type: 'number',
      access: {
        update: () => false,
      },
      admin: {
        hidden: true,
      },
    },
    {
      name: 'embedding_generated_at',
      type: 'date',
      access: {
        update: () => false,
      },
      admin: {
        hidden: true,
      },
    },
    {
      name: 'embedding_text_hash',
      type: 'text',
      access: {
        update: () => false,
      },
      admin: {
        hidden: true,
      },
    },
    ...slugField(),
  ],
  hooks: {
    beforeChange: [generateEmbeddingHook],
    afterChange: [
      async ({ doc, req }) => {
        req.payload.logger.info(`Revalidating note: ${doc.slug}`)

        // TODO: Add revalidation logic for notes when we have note pages
        // revalidateTag('notes')
        // revalidateTag(`note-${doc.slug}`)
      },
    ],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 30000, // 30 seconds - prevents excessive autosave compute
      },
    },
    maxPerDoc: 5, // Keep only 5 versions per note - prevents database bloat
  },
}

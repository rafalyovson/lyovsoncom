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
    type: true,
    connections: true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'author', 'visibility', 'updatedAt'],
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
      name: 'type',
      type: 'select',
      options: [
        { label: 'Literature Note', value: 'literature' },
        { label: 'Permanent Note', value: 'permanent' },
        { label: 'Fleeting Note', value: 'fleeting' },
        { label: 'Index Note', value: 'index' },
      ],
      defaultValue: 'fleeting',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'What type of note is this?',
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
        { label: 'Private', value: 'private' },
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
              name: 'sourceReference',
              type: 'relationship',
              relationTo: ['books', 'movies', 'tvShows', 'videoGames', 'music', 'podcasts'],
              admin: {
                description: 'What book, movie, show, game, music, or podcast is this note about?',
                condition: (data) => data.type === 'literature',
              },
            },
            {
              name: 'quoteText',
              type: 'textarea',
              admin: {
                description: 'The actual quote or passage from the source',
                condition: (data) => data.type === 'literature',
                placeholder: 'Enter the quote...',
              },
            },
            {
              name: 'pageNumber',
              type: 'text',
              admin: {
                description: 'Page number, timestamp, or location reference',
                condition: (data) => data.type === 'literature',
                placeholder: 'Page 42, 1:23:45, etc.',
              },
            },
          ],
          label: 'Literature Note Details',
          description: 'Specific fields for literature notes (quotes and references)',
        },
        {
          fields: [
            {
              name: 'connections',
              type: 'relationship',
              relationTo: [
                'posts',
                'books',
                'movies',
                'tvShows',
                'videoGames',
                'music',
                'podcasts',
                'persons',
                'notes',
              ],
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
      },
    ],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 30000,
      },
    },
    maxPerDoc: 5,
  },
}

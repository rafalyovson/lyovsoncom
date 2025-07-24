import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { slugField } from '@/fields/slug'
import { generateEmbeddingHook } from '@/collections/Posts/hooks/generateEmbedding'

export const Books: CollectionConfig = {
  slug: 'books',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    coverImage: true,
    description: true,
    creators: true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'releaseDate', 'updatedAt'],
    description: 'Manage books for reviews and references',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'The title of the book',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brief description or summary of the book',
        placeholder: 'What is this book about?',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
        description: 'Book cover image',
      },
    },
    {
      name: 'releaseDate',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayOnly',
        },
        description: 'Publication date',
      },
    },
    {
      name: 'creators',
      type: 'relationship',
      relationTo: 'people',
      hasMany: true,
      admin: {
        position: 'sidebar',
        description: 'Authors of this book',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'rafasQuotes',
              type: 'array',
              admin: {
                description: "Save Rafa's highlighted quotes from this book",
              },
              fields: [
                {
                  name: 'quote',
                  type: 'textarea',
                  required: true,
                  admin: {
                    placeholder: 'Enter a memorable quote...',
                  },
                },
              ],
            },
          ],
          label: "Rafa's Quotes",
          description: "Rafa's highlighted passages from this book",
        },
        {
          fields: [
            {
              name: 'jesssQuotes',
              type: 'array',
              admin: {
                description: "Save Jess's highlighted quotes from this book",
              },
              fields: [
                {
                  name: 'quote',
                  type: 'textarea',
                  required: true,
                  admin: {
                    placeholder: 'Enter a memorable quote...',
                  },
                },
              ],
            },
          ],
          label: "Jess's Quotes",
          description: "Jess's highlighted passages from this book",
        },
      ],
    },
    // Pre-computed embedding for semantic search
    {
      name: 'embedding',
      type: 'group',
      access: {
        update: () => false, // Only updated via hooks
      },
      admin: {
        disabled: true,
        readOnly: true,
        description: 'Pre-computed vector embedding for semantic search (auto-generated)',
      },
      fields: [
        {
          name: 'vector',
          type: 'json',
          admin: {
            hidden: true,
          },
        },
        {
          name: 'model',
          type: 'text',
          admin: {
            hidden: true,
          },
        },
        {
          name: 'dimensions',
          type: 'number',
          admin: {
            hidden: true,
          },
        },
        {
          name: 'generatedAt',
          type: 'date',
          admin: {
            hidden: true,
          },
        },
        {
          name: 'textHash',
          type: 'text',
          admin: {
            hidden: true,
          },
        },
      ],
    },
    ...slugField(),
  ],
  hooks: {
    beforeChange: [generateEmbeddingHook],
    afterChange: [
      async ({ doc, req }) => {
        req.payload.logger.info(`Revalidating book: ${doc.slug}`)

        // TODO: Add revalidation logic for books when we have book pages
        // revalidateTag('books')
        // revalidateTag(`book-${doc.slug}`)
      },
    ],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 30000, // 30 seconds
      },
    },
    maxPerDoc: 25,
  },
}

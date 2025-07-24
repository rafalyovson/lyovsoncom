import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { slugField } from '@/fields/slug'

export const TvShows: CollectionConfig = {
  slug: 'tvShows',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'releaseDate'],
  },
  fields: [
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
      admin: {
        description: 'TV show poster image',
      },
    },
    {
      name: 'releaseDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
        description: 'First air date',
      },
    },
    {
      name: 'rafasQuotes',
      type: 'array',
      admin: {
        description: "Rafa's highlighted quotes from this TV show",
      },
      fields: [
        {
          name: 'quote',
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      name: 'jesssQuotes',
      type: 'array',
      admin: {
        description: "Jess's highlighted quotes from this TV show",
      },
      fields: [
        {
          name: 'quote',
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      name: 'creators',
      type: 'relationship',
      relationTo: 'people',
      hasMany: true,
      admin: {
        description: 'Creators, showrunners, etc.',
      },
    },
    ...slugField(),
  ],
}

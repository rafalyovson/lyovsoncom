import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

export const Links: CollectionConfig = {
  slug: 'links',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'url', 'referenceType'],
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      admin: {
        description: 'Description of what this link is',
      },
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: {
        description: 'The URL this link points to',
      },
    },
    {
      name: 'referenceType',
      type: 'select',
      options: [
        { label: 'Book', value: 'books' },
        { label: 'Movie', value: 'movies' },
        { label: 'TV Show', value: 'tvShows' },
        { label: 'Video Game', value: 'videoGames' },
        { label: 'Post', value: 'posts' },
        { label: 'Person', value: 'people' },
        { label: 'Note', value: 'notes' },
        { label: 'Project', value: 'projects' },
      ],
      required: true,
      admin: {
        description: 'What type of content is this link attached to?',
      },
    },
    {
      name: 'reference',
      type: 'relationship',
      relationTo: [
        'books',
        'movies',
        'tvShows',
        'videoGames',
        'posts',
        'people',
        'notes',
        'projects',
      ],
      required: true,
      admin: {
        description: 'The specific item this link is attached to',
      },
    },
  ],
}

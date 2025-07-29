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
    defaultColumns: ['title', 'type', 'releaseDate', 'updatedAt'],
    description: 'Manage TV shows, seasons, and episodes',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'The title of the TV show, season, or episode',
      },
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Show', value: 'show' },
        { label: 'Season', value: 'season' },
        { label: 'Episode', value: 'episode' },
      ],
      defaultValue: 'show',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'What type of TV content is this?',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Show summary or description',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
        description: 'TV show poster image',
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
        description: 'First air date or episode air date',
      },
    },
    {
      name: 'seasonNumber',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Season number',
        condition: (data) => data.type === 'season' || data.type === 'episode',
      },
    },
    {
      name: 'episodeNumber',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Episode number within season',
        condition: (data) => data.type === 'episode',
      },
    },
    {
      name: 'duration',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Duration in minutes',
        condition: (data) => data.type === 'episode',
      },
    },
    {
      name: 'creators',
      type: 'relationship',
      relationTo: 'persons',
      hasMany: true,
      admin: {
        position: 'sidebar',
        description: 'Creators, showrunners, actors, etc.',
      },
    },
    {
      name: 'genre',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Action', value: 'action' },
        { label: 'Comedy', value: 'comedy' },
        { label: 'Drama', value: 'drama' },
        { label: 'Horror', value: 'horror' },
        { label: 'Sci-Fi', value: 'sci-fi' },
        { label: 'Romance', value: 'romance' },
        { label: 'Thriller', value: 'thriller' },
        { label: 'Documentary', value: 'documentary' },
        { label: 'Animation', value: 'animation' },
        { label: 'Family', value: 'family' },
        { label: 'Reality', value: 'reality' },
      ],
      admin: {
        position: 'sidebar',
        description: 'TV show genres',
      },
    },
    {
      name: 'familyRating',
      type: 'number',
      min: 1,
      max: 10,
      admin: {
        position: 'sidebar',
        description: 'Family rating (1-10)',
      },
    },
    {
      name: 'watchStatus',
      type: 'select',
      options: [
        { label: 'Want to Watch', value: 'want_to_watch' },
        { label: 'Watching', value: 'watching' },
        { label: 'Watched', value: 'watched' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Watch status',
      },
    },
    {
      name: 'apiData',
      type: 'json',
      admin: {
        position: 'sidebar',
        description: 'Full API response data',
      },
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        req.payload.logger.info(`Revalidating TV show: ${doc.slug}`)
        // TODO: Add revalidation logic for TV shows when we have show pages
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

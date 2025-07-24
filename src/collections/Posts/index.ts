import type { CollectionConfig } from 'payload'
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { populateAuthors } from './hooks/populateAuthors'
import { revalidatePost, revalidateDelete } from './hooks/revalidatePost'
import { generateEmbeddingHook } from './hooks/generateEmbedding'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { Banner } from '@/blocks/Banner/config'
import { Code } from '@/blocks/Code/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { YouTube } from '@/blocks/YouTube/config'
import { XPost } from '@/blocks/XPost/config'
import { Quote } from '@/blocks/Quote/config'
import { GIF } from '@/blocks/GIF/config'
import { slugField } from '@/fields/slug'
import { getServerSideURL } from '@/utilities/getURL'

export const Posts: CollectionConfig<'posts'> = {
  slug: 'posts',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // Clean structure: title, featuredImage, and description at root level
  // SEO metadata is automatically generated from these main fields
  defaultPopulate: {
    title: true,
    slug: true,
    featuredImage: true,
    description: true,
    topics: true,
    project: true,
    type: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'posts',
        })

        return `${getServerSideURL()}${path}`
      },
    },
    preview: (data) => {
      const path = generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'posts',
        project: data?.project,
      })

      return `${getServerSideURL()}${path}`
    },
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'The main title of your post',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
        description: 'Main image used in cards and social sharing',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        position: 'sidebar',
        description: 'Brief description for previews and SEO',
        placeholder: 'Write a compelling description...',
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
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    BlocksFeature({
                      blocks: [Banner, Code, MediaBlock, YouTube, XPost, Quote, GIF],
                    }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                  ]
                },
              }),
              label: false,
              required: true,
            },
          ],
          label: 'Content',
          description: 'Write your post content here',
        },
        {
          fields: [
            {
              name: 'type',
              type: 'relationship',
              relationTo: 'types',
              required: true,
              admin: {
                description: 'Legacy type field (will be removed after migration)',
                position: 'sidebar',
              },
            },
            {
              name: 'typeSelect',
              type: 'select',
              options: [
                { label: 'Article', value: 'article' },
                { label: 'Review', value: 'review' },
                { label: 'Video', value: 'video' },
                { label: 'Podcast Episode', value: 'podcast' },
                { label: 'Photo Essay', value: 'photo' },
              ],
              defaultValue: 'article',
              required: true,
              admin: {
                description: 'What type of content is this?',
              },
            },
            {
              name: 'rating',
              type: 'number',
              min: 1,
              max: 10,
              admin: {
                description: 'Rate from 1-10 stars',
                condition: (data) => data.typeSelect === 'review',
              },
            },
            {
              name: 'reference',
              type: 'relationship',
              relationTo: ['books', 'movies', 'tvShows', 'videoGames'],
              hasMany: true,
              admin: {
                description: 'What are you reviewing? (can select multiple)',
                condition: (data) => data.typeSelect === 'review',
              },
            },
            {
              name: 'videoEmbedUrl',
              type: 'text',
              admin: {
                description: 'YouTube, Vimeo, or other video embed URL',
                condition: (data) => data.typeSelect === 'video',
                placeholder: 'https://www.youtube.com/watch?v=...',
              },
            },
            {
              name: 'podcastEmbedUrl',
              type: 'text',
              admin: {
                description: 'Spotify, Apple Podcasts, or other podcast embed URL',
                condition: (data) => data.typeSelect === 'podcast',
                placeholder: 'https://open.spotify.com/episode/...',
              },
            },
          ],
          label: 'Type & Reviews',
          description: 'Set the content type and review details',
        },
        {
          fields: [
            {
              name: 'topics',
              type: 'relationship',
              relationTo: 'topics',
              hasMany: true,
              admin: {
                description: 'Tag this post with relevant topics',
              },
            },
            {
              name: 'project',
              type: 'relationship',
              relationTo: 'projects',
              admin: {
                description: 'Group this post into a series or project',
              },
            },
            {
              name: 'references',
              type: 'relationship',
              relationTo: ['books', 'movies', 'tvShows', 'videoGames'],
              hasMany: true,
              admin: {
                description: 'Books, movies, shows, games referenced in this post',
              },
            },
            {
              name: 'personsMentioned',
              type: 'relationship',
              relationTo: 'people',
              hasMany: true,
              admin: {
                description: 'People mentioned or discussed in this post',
              },
            },
            {
              name: 'notesReferenced',
              type: 'relationship',
              relationTo: 'notes',
              hasMany: true,
              admin: {
                description: 'Notes that connect to this post',
              },
            },
            {
              name: 'relatedPosts',
              type: 'relationship',
              admin: {
                description: 'Other posts that are related to this one',
              },
              filterOptions: ({ id }) => {
                return {
                  id: {
                    not_in: [id],
                  },
                }
              },
              hasMany: true,
              relationTo: 'posts',
            },
          ],
          label: 'Connections',
          description: 'Connect this post to other content in your knowledge base',
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
        description: 'When this post should be published',
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
    {
      name: 'authors',
      type: 'relationship',
      admin: {
        position: 'sidebar',
        description: 'Who authored this post',
      },
      hasMany: true,
      relationTo: 'users',
    },
    // This field is only used to populate the user data via the `populateAuthors` hook
    // This is because the `user` collection has access control locked to protect user privacy
    // GraphQL will also not return mutated user data that differs from the underlying schema
    {
      name: 'populatedAuthors',
      type: 'array',
      access: {
        update: () => false,
      },
      admin: {
        disabled: true,
        readOnly: true,
      },
      fields: [
        {
          name: 'id',
          type: 'text',
        },
        {
          name: 'name',
          type: 'text',
        },
        {
          name: 'username',
          type: 'text',
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
    afterChange: [revalidatePost],
    afterRead: [populateAuthors],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 30000, // 30 seconds (was 100ms - 10 times per second!)
      },
    },
    maxPerDoc: 50,
  },
}

// NOTE: In [DATE] we migrated from categories/tags to types/topics/projects
// Backup of the old structure can be found in ./taxonomy-backup.json
// Migration script: ./src/migrations/taxonomyMigration.ts

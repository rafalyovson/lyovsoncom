import type { CollectionConfig } from 'payload'
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

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
  // This config controls what's populated by default when a post is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'posts'>
  defaultPopulate: {
    title: true,
    slug: true,
    topics: true,
    project: true,
    type: true,
    meta: {
      image: true,
      description: true,
    },
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
        },
        {
          fields: [
            {
              name: 'type',
              type: 'relationship',
              relationTo: 'types',
              required: true,
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'topics',
              type: 'relationship',
              relationTo: 'topics',
              hasMany: true,
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'project',
              type: 'relationship',
              relationTo: 'projects',
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'relatedPosts',
              type: 'relationship',
              admin: {
                position: 'sidebar',
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
          label: 'Meta',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
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

import type { CollectionConfig } from 'payload'
import { revalidateTag } from 'next/cache'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { slugField } from '@/fields/slug'

export const Projects: CollectionConfig = {
  slug: 'projects',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'resendAudienceId'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'resendAudienceId',
      type: 'text',
      label: 'Resend Audience ID',
      defaultValue: process.env.RESEND_AUDIENCE_ID,
      admin: {
        description: 'The Audience ID from Resend for managing newsletter subscriptions.',
      },
    },
    {
      name: 'contacts',
      type: 'relationship',
      relationTo: 'contacts',
      hasMany: true,
      admin: {
        description: 'List of contacts associated with this project.',
      },
    },
    ...slugField('name'),
  ],
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        req.payload.logger.info(`Revalidating project: ${doc.slug}`)

        // Revalidate project-related cache tags
        revalidateTag('projects')
        revalidateTag(`project-${doc.slug}`)
        revalidateTag('posts') // Posts may reference this project
        revalidateTag('sitemap')
        revalidateTag('playground') // Playground uses project data
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        req.payload.logger.info(`Revalidating after project deletion: ${doc?.slug}`)

        // Revalidate project-related cache tags
        revalidateTag('projects')
        revalidateTag(`project-${doc?.slug}`)
        revalidateTag('posts') // Posts may reference this project
        revalidateTag('sitemap')
        revalidateTag('playground') // Playground uses project data
      },
    ],
  },
}

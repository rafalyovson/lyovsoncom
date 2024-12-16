import type { CollectionConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { slugField } from '@/fields/slug'
import { revalidateTag } from 'next/cache'

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
      async () => {
        revalidateTag('sitemap')
      },
    ],
    afterDelete: [
      async () => {
        revalidateTag('sitemap')
      },
    ],
  },
}

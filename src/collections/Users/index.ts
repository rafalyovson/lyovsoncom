import type { CollectionConfig } from 'payload'
import { revalidateTag } from 'next/cache'

import { authenticated } from '@/access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'username',
      type: 'text',
      unique: true,
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        if (doc.username) {
          req.payload.logger.info(`Revalidating author: ${doc.username}`)

          // Revalidate user-related cache tags
          revalidateTag('users')
          revalidateTag(`author-${doc.username}`)
          revalidateTag('posts') // Posts may reference this author
        }
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        if (doc?.username) {
          req.payload.logger.info(`Revalidating after user deletion: ${doc.username}`)

          // Revalidate user-related cache tags
          revalidateTag('users')
          revalidateTag(`author-${doc.username}`)
          revalidateTag('posts') // Posts may reference this author
        }
      },
    ],
  },
  timestamps: true,
}

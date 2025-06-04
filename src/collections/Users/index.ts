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
  auth: {
    loginWithUsername: {
      allowEmailLogin: true, // default: false
      requireEmail: false, // default: false
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      saveToJWT: true,
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

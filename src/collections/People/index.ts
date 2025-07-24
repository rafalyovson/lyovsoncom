import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { slugField } from '@/fields/slug'

export const People: CollectionConfig = {
  slug: 'people',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'roles'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: "Person's photo",
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      admin: {
        description: 'Biography',
      },
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Author', value: 'author' },
        { label: 'Director', value: 'director' },
        { label: 'Actor', value: 'actor' },
        { label: 'Musician', value: 'musician' },
        { label: 'Developer', value: 'developer' },
        { label: 'Public Figure', value: 'publicFigure' },
      ],
      admin: {
        description: 'What roles does this person have?',
      },
    },
    ...slugField(),
  ],
}

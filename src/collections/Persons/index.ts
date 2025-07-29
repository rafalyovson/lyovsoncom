import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { slugField } from '@/fields/slug'

export const Persons: CollectionConfig = {
  slug: 'persons',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'roles'],
    description: 'Central registry for all creators and contributors',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Full name of the person',
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      admin: {
        description: 'Biography or description',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
        description: "Person's photo",
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
        { label: 'Host', value: 'host' },
        { label: 'Public Figure', value: 'publicFigure' },
      ],
      admin: {
        description: 'What roles does this person have?',
      },
    },
    {
      name: 'website',
      type: 'text',
      admin: {
        description: 'Personal or professional website',
        placeholder: 'https://example.com',
      },
    },
    {
      name: 'socialLinks',
      type: 'json',
      admin: {
        description: 'Social media links and profiles',
      },
    },
    ...slugField(),
  ],
}

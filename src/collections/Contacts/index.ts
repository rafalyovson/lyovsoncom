import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'

export const Contacts: CollectionConfig = {
  slug: 'contacts',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'firstName', 'lastName', 'status', 'project'],
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'firstName',
      type: 'text',
      admin: {
        placeholder: 'Enter first name',
      },
    },
    {
      name: 'lastName',
      type: 'text',
      admin: {
        placeholder: 'Enter last name',
      },
    },
    {
      name: 'confirmationToken',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Token used for email confirmation',
      },
      access: {
        read: () => false,
      },
      hidden: true,
    },
    {
      name: 'confirmationExpiry',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'When the confirmation token expires',
      },
      access: {
        read: () => false,
      },
      hidden: true,
    },
    {
      name: 'unsubscribed',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Indicates if the contact has unsubscribed.',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Active', value: 'active' },
        { label: 'Unsubscribed', value: 'unsubscribed' },
      ],
      defaultValue: 'pending',
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      required: true,
      admin: {
        description: 'The project this contact is associated with.',
      },
    },
    {
      name: 'resendContactId',
      type: 'text',
      admin: {
        description: 'The unique Contact ID from Resend.',
      },
    },
    {
      name: 'subscribedAt',
      type: 'date',
      defaultValue: () => new Date(),
      admin: {
        description: 'The date and time the contact subscribed.',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Optional notes about the contact.',
        placeholder: 'Add any additional information or notes.',
      },
    },
  ],
}

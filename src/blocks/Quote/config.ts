import type { Block } from 'payload'
import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const Quote: Block = {
  slug: 'quote',
  interfaceName: 'QuoteBlock',
  fields: [
    {
      name: 'quote',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
      required: true,
      label: 'Quote Text',
    },
    {
      name: 'attribution',
      type: 'text',
      label: 'Attribution',
    },
  ],
}

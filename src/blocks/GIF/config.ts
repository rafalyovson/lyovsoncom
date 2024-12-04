import type { Block } from 'payload'
import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

// Validate and extract Tenor embed info
const extractTenorInfo = (embedCode: string): { postId: string; aspectRatio: string } | null => {
  try {
    const postIdMatch = embedCode.match(/data-postid="(\d+)"/)
    const aspectRatioMatch = embedCode.match(/data-aspect-ratio="([^"]+)"/)

    if (!postIdMatch) return null

    return {
      postId: postIdMatch[1],
      aspectRatio: aspectRatioMatch?.[1] || '1',
    }
  } catch (e) {
    return null
  }
}

export const GIF: Block = {
  slug: 'gif',
  interfaceName: 'GIFBlock',
  fields: [
    {
      name: 'embedCode',
      type: 'group',
      fields: [
        {
          name: 'raw',
          type: 'textarea',
          required: true,
          label: 'Tenor GIF Embed Code',
          admin: {
            description: 'Paste the full embed code from Tenor (click Share > Embed)',
          },
          hooks: {
            beforeValidate: [
              ({ value, data }) => {
                if (!value) return value
                const info = extractTenorInfo(value)
                if (!info) {
                  throw new Error('Please enter a valid Tenor embed code')
                }
                // Store both the raw embed code and the extracted info
                return value
              },
            ],
          },
        },
        {
          name: 'postId',
          type: 'text',
          admin: {
            hidden: true,
          },
        },
        {
          name: 'aspectRatio',
          type: 'text',
          admin: {
            hidden: true,
          },
        },
      ],
      hooks: {
        beforeChange: [
          ({ value, originalDoc, data }) => {
            if (!value?.raw) return value
            const info = extractTenorInfo(value.raw)
            if (!info) return value
            return {
              raw: value.raw,
              ...info,
            }
          },
        ],
      },
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
      label: 'Caption',
    },
  ],
}

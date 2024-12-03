import type { Block } from 'payload'
import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

// Improved X post ID/URL extraction function
const extractXPostID = (url: string): string => {
  if (!url) return ''

  try {
    const urlObj = new URL(url)

    // Normalize hostname
    const hostname = urlObj.hostname.replace('www.', '')

    // Handle x.com and twitter.com domains
    if (hostname === 'x.com' || hostname === 'twitter.com') {
      // Extract ID from path format: /username/status/123456789
      const matches = urlObj.pathname.match(/\/status\/(\d+)/)
      if (matches && matches[1]) {
        return matches[1]
      }
    }
  } catch (e) {
    // Invalid URL, return empty string
    return ''
  }

  return ''
}

export const XPost: Block = {
  slug: 'xpost',
  interfaceName: 'XPostBlock',
  fields: [
    {
      name: 'postId',
      type: 'text',
      required: true,
      label: 'X Post URL',
      admin: {
        description:
          'Enter an X (Twitter) post URL (e.g., https://x.com/username/status/123456789)',
      },
      hooks: {
        beforeChange: [
          ({ value }) => {
            if (!value) return value
            const postId = extractXPostID(value)
            if (!postId) {
              throw new Error('Invalid X post URL. Please enter a valid X (Twitter) post URL.')
            }
            return postId
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

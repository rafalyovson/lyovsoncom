import type { Metadata } from 'next'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

import type { Post } from '@/payload-types'

export const generateMeta = async (args: { doc: Partial<Post> }): Promise<Metadata> => {
  const { doc } = args || {}

  // Use main fields directly
  const postImage = doc?.featuredImage
  const ogImage =
    typeof postImage === 'object' &&
    postImage !== null &&
    'url' in postImage &&
    `${getServerSideURL()}`

  const title = doc?.title ? doc?.title + ' | Lyovson.com' : 'Lyovson.com'
  const description = doc?.description

  return {
    description,
    openGraph: mergeOpenGraph({
      description: description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    title,
  }
}

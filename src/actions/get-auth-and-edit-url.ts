'use server'

import { headers } from 'next/headers'
import { getPayload } from 'payload'
import type { User } from '@/payload-types'

// Importing config this way to avoid pulling in collection hooks
async function getPayloadInstance() {
  const configPromise = import('@payload-config')
  const config = await configPromise
  return getPayload({ config: config.default })
}

export async function getAuthAndEditUrl(slug?: string, pathname?: string) {
  try {
    const nextHeaders = await headers()
    const payload = await getPayloadInstance()
    const authResult = await payload.auth({ headers: nextHeaders })

    if (!authResult.user) {
      return { user: null, editUrl: null }
    }

    let editUrl: string | null = null

    if (slug && pathname) {
      // Determine if we're on a post page
      const isPostPage =
        pathname.includes('/posts/') ||
        (slug && !pathname.includes('/projects/') && !pathname.includes('/topics/'))

      if (isPostPage) {
        editUrl = `/admin/collections/posts?where[slug][equals]=${slug}`
      }
    }

    return {
      user: authResult.user as User,
      editUrl,
    }
  } catch (error) {
    console.error('Error in getAuthAndEditUrl:', error)
    return { user: null, editUrl: null }
  }
}

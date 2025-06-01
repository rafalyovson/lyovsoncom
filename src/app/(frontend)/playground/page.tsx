import { Metadata } from 'next'
import { createContactAction } from '@/actions/create-contact-action'
import {
  GridCardSubscribe,
  GridCardNav,
  GridCardUserSocial,
  GridCardRafa,
  GridCardJess,
} from '@/components/grid'
import { getCachedProjectBySlug } from '@/utilities/get-project'
import { unstable_cacheTag as cacheTag, unstable_cacheLife as cacheLife } from 'next/cache'

export default async function Playground() {
  'use cache'
  cacheTag('playground')
  cacheTag('projects')
  cacheLife('static') // Playground page doesn't change often

  const project = await getCachedProjectBySlug('media-musings')

  if (!project) {
    throw new Error('Media Musings project not found')
  }

  return (
    <>
      <GridCardNav />
      <GridCardSubscribe
        title="Media Musings"
        description="Join our journney through all kinds of media and ideas."
        emoji="👩"
        handleSubmit={createContactAction}
        projectId={project.id}
      />
      <GridCardJess />
      <GridCardRafa />
      <GridCardUserSocial />
    </>
  )
}

export const metadata: Metadata = {
  title: `Playground | Lyovson.com`,
  description: 'Test and explore features on Lyovson.com playground',
  alternates: {
    canonical: '/playground',
  },
}

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
  title: `Playground - Interactive Demos | Lyovson.com`,
  description:
    'Explore interactive demos, experiments, and test features on the Lyovson.com playground. Try out new components and functionality.',
  keywords: ['playground', 'interactive demos', 'experiments', 'test features', 'web development'],
  alternates: {
    canonical: '/playground',
  },
  openGraph: {
    title: 'Playground - Interactive Demos',
    description:
      'Explore interactive demos, experiments, and test features on the Lyovson.com playground.',
    type: 'website',
    url: '/playground',
  },
  twitter: {
    card: 'summary',
    title: 'Playground - Interactive Demos',
    description: 'Explore interactive demos and experiments on Lyovson.com.',
    creator: '@lyovson',
    site: '@lyovson',
  },
  robots: {
    index: true,
    follow: true,
  },
}

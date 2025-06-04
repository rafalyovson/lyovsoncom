import { Metadata } from 'next'
import { createContactAction } from '@/actions/create-contact-action'
import {
  GridCardSubscribe,
  GridCardNav,
  GridCardUserSocial,
  GridCardRafa,
  GridCardJess,
  GridCard,
  GridCardSection,
} from '@/components/grid'
import { getCachedProjectBySlug } from '@/utilities/get-project'
import { unstable_cacheTag as cacheTag, unstable_cacheLife as cacheLife } from 'next/cache'
import { cookies } from 'next/headers'
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { headers as nextHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SkeletonCard } from '@/components/grid'

export default async function SuspensePlayground() {
  return (
    <Suspense fallback={<SkeletonCard />}>
      <Playground />
    </Suspense>
  )
}

export async function Playground() {
  const headers = await nextHeaders()
  const payload = await getPayload({ config })
  const user = await payload.auth({ headers: headers })

  if (!user || !user.user) {
    redirect('/admin')
  }

  const project = await getCachedProjectBySlug('media-musings')

  if (!project) {
    throw new Error('Media Musings project not found')
  }

  return (
    <>
      <GridCard>
        <GridCardSection className="col-start-1 col-end-4 row-start-1 row-end-4 grid place-items-center">
          {`Welcome, ${user.user?.name} `}
        </GridCardSection>
      </GridCard>
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

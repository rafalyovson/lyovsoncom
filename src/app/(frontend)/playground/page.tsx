import { GridCardSubscribe, GridCardNav } from '@/components/grid'
import { createContactAction } from '@/actions/create-contact-action'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Metadata } from 'next'
export default async function Playground() {
  const payload = await getPayload({ config: configPromise })
  const project = await payload.find({
    collection: 'projects',
    where: {
      slug: {
        equals: 'media-musings',
      },
    },
  })

  const projectId = project.docs[0].id
  return (
    <>
      <GridCardNav />
      <GridCardSubscribe
        title="Media Musings"
        description="Join our journney through all kinds of media and ideas."
        emoji="👩"
        handleSubmit={createContactAction}
        projectId={projectId}
      />
    </>
  )
}

export const metadata: Metadata = {
  title: `Playground | Lyovson.com`,
}

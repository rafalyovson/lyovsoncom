import { GridCardEmailSubscribe, GridCardNav } from '@/components/grid'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export default async function Playground() {
  const payload = await getPayload({ config: configPromise })
  const form = await payload.findByID({
    collection: 'forms',
    id: '2',
  })

  console.log(form)
  return (
    <>
      <GridCardNav />
      <GridCardEmailSubscribe
        title="Media Musings"
        description="Join our journney through all kinds of media and ideas."
        emoji="👩"
      />
    </>
  )
}

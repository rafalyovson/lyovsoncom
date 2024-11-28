import { PayloadRedirects } from '@/components/PayloadRedirects'
import RichText from '@/components/RichText'
import { GridCardHeader, GridCardHero, GridCardRelatedPosts } from '@/components/grid'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
  })

  const params = posts.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const url = '/posts/' + slug
  const post = await queryPostBySlug({ slug })

  if (!post) return <PayloadRedirects url={url} />

  return (
    <>
      <GridCardHeader
        className={`g2:col-start-1 g2:col-end-2 g2:row-start-1 g2:row-end-2 max-w-[400px] g4:h-[400px] g4:self-start`}
      />
      <GridCardHero
        post={post}
        className={`g2:col-start-2 g2:col-end-3 g2:row-start-1 g2:row-end-2 max-w-[400px] border g4:self-start  g3:col-start-2 g3:col-end-4 g3:max-w-[800px] g3:h-[400px] overflow-hidden g3:grid-cols-6`}
      />

      <div className=" g2:col-start-2 g2:col-end-4 g2:row-start-2 g2:row-auto">
        <RichText className="h-full" content={post.content} enableGutter={true} />
      </div>
      <div
        className={` g2:col-start-1 g2:col-end-2 g2:row-start-2 g2:row-end-3 g2:self-start g4:col-start-4 g4:col-end-5 g4:row-start-1 g4:row-end-2`}
      >
        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <GridCardRelatedPosts posts={post.relatedPosts} />
        )}
      </div>
    </>
  )
}

const queryPostBySlug = async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
}

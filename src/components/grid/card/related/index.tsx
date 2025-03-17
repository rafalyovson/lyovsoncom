import Link from 'next/link'

import { GridCardSection, GridCard } from '@/components/grid'
import { Post } from '@/payload-types'
import { Media } from '@/components/Media'


export const GridCardRelatedPosts = ({
  posts,
  className,
}: {
  posts: (number | Post)[]
  className?: string
}) => {
  return (
    <GridCard className={`${className} max-w-[400px]`}>
      {posts.map((post, index) => {
        if (typeof post === 'number') {
          return null
        }
        const metaImage = post.meta?.image
        return (
          <Link
            key={post.id}
            href={`/posts/${post.slug}`}
            className={`col-start-1 col-end-4 row-start-${index + 1} row-end-${index + 2} `}
          >
            <GridCardSection className={`grid grid-cols-3 grid-rows-1 gap-2 h-full`}>
              {metaImage && (
                <Media
                  imgClassName="-z-10 object-cover h-full rounded-lg"
                  resource={metaImage}
                  className={` overflow-hidden h-full`}
                  pictureClassName=" row-start-1 row-end-2 col-start-1 col-end-2 h-full "
                />
              )}
              <section
                key={post.id}
                className={`row-start-1 row-end-2 col-start-2 col-end-4 grid items-center`}
              >
                <h1>{post.title}</h1>
              </section>
            </GridCardSection>
          </Link>
        )
      })}
    </GridCard>
  )
}

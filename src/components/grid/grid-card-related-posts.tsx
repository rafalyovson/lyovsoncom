import { GridCard } from '@/components/grid'
import { Post } from '@/payload-types'
import { Media } from '../Media'

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
          <article
            key={post.id}
            className={`col-start-1 col-end-4 row-start-${index + 1} row-end-${index + 2} grid grid-cols-1 grid-rows-1`}
          >
            {metaImage && typeof metaImage !== 'string' && (
              <Media
                imgClassName="-z-10 object-cover"
                resource={metaImage}
                className={`row-start-1 row-end-2 col-start-1 col-end-2 overflow-hidden`}
              />
            )}
            <article
              key={post.id}
              className={`row-start-1 row-end-2 col-start-1 col-end-2 border p-4 grid justify-center items-center bg-black/50`}
            >
              <h1>{post.title}</h1>
            </article>
          </article>
        )
      })}
    </GridCard>
  )
}

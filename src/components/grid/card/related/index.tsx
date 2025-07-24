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
        return (
          <Link
            key={post.id}
            href={`/posts/${post.slug}`}
            className={`col-start-1 col-end-4 row-start-${index + 1} row-end-${index + 2} group glass-interactive glass-stagger-${Math.min(index + 1, 6)}`}
            aria-label={`Read related post: ${post.title}`}
          >
            <GridCardSection className={`grid grid-cols-3 grid-rows-1 gap-2 h-full`}>
              {post.featuredImage && (
                <Media
                  imgClassName="object-cover h-full"
                  resource={post.featuredImage}
                  className="glass-media h-full flex justify-center items-center"
                  pictureClassName="row-start-1 row-end-2 col-start-1 col-end-2 h-full"
                />
              )}
              <div
                key={post.id}
                className={`row-start-1 row-end-2 col-start-2 col-end-4 grid items-center`}
              >
                <h2 className="glass-text group-hover:text-[var(--glass-text-secondary)] transition-colors duration-300 font-medium">
                  {post.title}
                </h2>
              </div>
            </GridCardSection>
          </Link>
        )
      })}
    </GridCard>
  )
}

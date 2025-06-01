import Link from 'next/link'

import { GridCard, GridCardSection } from '@/components/grid'
import { Media } from '@/components/Media'
import { Post } from '@/payload-types'

export type GridCardPostProps = {
  post: Post
  className?: string
  loading?: 'lazy' | 'eager'
  fetchPriority?: 'high' | 'low' | 'auto'
  priority?: boolean
}

export const GridCardPostSearch = ({
  post,
  className,
  loading,
  fetchPriority,
  priority,
}: GridCardPostProps) => {
  const { project, meta: { image: metaImage } = {}, title, slug } = post

  return (
    <GridCard className={className}>
      {metaImage && typeof metaImage !== 'string' && (
        <GridCardSection className={`row-start-1 row-end-3 col-start-1 col-end-4`}>
          <Media
            imgClassName="-z-10 object-cover h-full"
            resource={metaImage}
            pictureClassName="h-full"
            className="h-full"
            {...(loading ? { loading } : {})}
            {...(fetchPriority ? { fetchPriority } : {})}
            {...(priority ? { priority } : {})}
          />
        </GridCardSection>
      )}
      <GridCardSection
        className={`row-start-3 row-end-4 col-start-1 col-end-4 h-full flex flex-col justify-center`}
      >
        <Link
          href={{
            pathname:
              project && typeof project === 'object'
                ? `/${project.slug}/${slug}`
                : `/posts/${slug}`,
          }}
        >
          <h1 className={`text-xl text-bold text-center`}>{title}</h1>
        </Link>
      </GridCardSection>
    </GridCard>
  )
}

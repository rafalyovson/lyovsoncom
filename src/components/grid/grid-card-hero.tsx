import { GridCard } from '@/components/grid/grid-card'
import { Post } from '@/payload-types'
import Link from 'next/link'

import { Media } from '@/components/Media'

export const GridCardHero = async ({ className, post }: { className?: string; post: Post }) => {
  const metaImage = post.meta?.image
  return (
    <GridCard className={`${className}`}>
      {metaImage && typeof metaImage !== 'string' && (
        <Media
          imgClassName="-z-10 object-cover"
          resource={metaImage}
          className=" row-start-1 row-end-4 col-start-1 col-end-4"
        />
      )}
      <Link
        className="row-start-3 row-end-4 col-start-1 col-end-4 flex flex-col justify-center items-center p-2 bg-black bg-opacity-70 rounded-lg shadow-md hover:shadow-lg"
        href="/"
      >
        <h1 className={`text-xl text-center p-2`}>{post.title}</h1>
      </Link>
    </GridCard>
  )
}

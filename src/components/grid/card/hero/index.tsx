import Link from 'next/link'

import { GridCardSection } from '../section'

import { GridCard } from '@/components/grid'
import { Post } from '@/payload-types'
import { Media } from '@/components/Media'


export const GridCardHero = async ({ className, post }: { className?: string; post: Post }) => {
  const metaImage = post.meta?.image
  return (
    <GridCard
      className={`g3:w-[800px] g3:h-[400px] overflow-hidden g3:grid-cols-6 border ${className}`}
    >
      {metaImage && typeof metaImage !== 'string' && (
        <GridCardSection className={`row-start-1 row-end-3 col-start-1 col-end-4 g3:row-end-4`}>
          <Media
            imgClassName="-z-10 object-cover h-full"
            resource={metaImage}
            className="h-full flex justify-center items-center overflow-hidden"
            pictureClassName="h-full"
          />
        </GridCardSection>
      )}
      <GridCardSection
        className={`row-start-3 row-end-4 col-start-1 col-end-4 g3:row-start-1 g3:row-end-4 g3:col-start-4 g3:col-end-8`}
      >
        <Link className=" flex flex-col justify-center items-center h-full" href="/">
          <h1 className={`text-xl text-center`}>{post.title}</h1>
        </Link>
      </GridCardSection>
    </GridCard>
  )
}

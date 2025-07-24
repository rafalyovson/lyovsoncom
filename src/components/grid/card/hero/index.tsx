import Link from 'next/link'

import { GridCardSection } from '../section'

import { GridCard } from '@/components/grid'
import { Post } from '@/payload-types'
import { Media } from '@/components/Media'

export const GridCardHero = async ({ className, post }: { className?: string; post: Post }) => {
  return (
    <GridCard className={`g3:w-[816px] g3:h-[400px] overflow-hidden g3:grid-cols-6 ${className}`}>
      {post.featuredImage && typeof post.featuredImage !== 'string' && (
        <GridCardSection className={`row-start-1 row-end-3 col-start-1 col-end-4 g3:row-end-4`}>
          <Media
            imgClassName="object-cover h-full"
            resource={post.featuredImage}
            className="glass-media h-full flex justify-center items-center"
            pictureClassName="h-full"
          />
        </GridCardSection>
      )}
      <GridCardSection
        className={`row-start-3 row-end-4 col-start-1 col-end-4 g3:row-start-1 g3:row-end-4 g3:col-start-4 g3:col-end-8 glass-interactive`}
      >
        <Link
          className="flex flex-col justify-center items-center h-full group"
          href="/"
          aria-label={`Featured post: ${post.title}`}
        >
          <h1
            className={`text-xl text-center glass-text group-hover:text-[var(--glass-text-secondary)] transition-colors duration-300 font-bold`}
          >
            {post.title}
          </h1>
        </Link>
      </GridCardSection>
    </GridCard>
  )
}

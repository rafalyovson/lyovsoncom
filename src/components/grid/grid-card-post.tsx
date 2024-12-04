import { GridCard } from '@/components/grid'
import { Media } from '@/components/Media'
import { Badge } from '@/components/ui/badge'
import { Post } from '@/payload-types'
import { Boxes, Calendar, User as UserIcon } from 'lucide-react'
import Link from 'next/link'
import { GridCardSection } from './grid-card-section'

export const GridCardPost = ({ post, className }: { post: Post; className?: string }) => {
  const {
    categories,
    tags,
    populatedAuthors,
    meta: { image: metaImage } = {},
    publishedAt,
    title,
    slug,
  } = post

  return (
    <GridCard className={className}>
      {metaImage && typeof metaImage !== 'string' && (
        <GridCardSection className={`row-start-1 row-end-3 col-start-1 col-end-3`}>
          <Media imgClassName="-z-10 object-cover" resource={metaImage} className="  " />
        </GridCardSection>
      )}
      <GridCardSection
        className={`row-start-3 row-end-4 col-start-1 col-end-4   h-full flex flex-col justify-center   `}
      >
        <Link href={{ pathname: `/posts/${slug}` }}>
          <h1 className={`text-xl text-bold text-center `}>{title}</h1>
        </Link>
      </GridCardSection>

      <GridCardSection
        className={`row-start-1 row-end-2 col-start-3 col-end-4   flex flex-col gap-2 justify-center `}
      >
        {tags &&
          tags.map((tag) => {
            if (typeof tag !== 'object') return null
            return (
              <Link
                className={` text-xs font-semibold  `}
                key={tag.id}
                href={{ pathname: `/tags/${tag.slug}` }}
              >
                <Badge variant={'default'}>{`#${tag.name}`}</Badge>
              </Link>
            )
          })}
      </GridCardSection>

      <GridCardSection
        className={`row-start-2 row-end-3 col-start-3 col-end-4 flex flex-col gap-2 justify-evenly   `}
      >
        {populatedAuthors &&
          populatedAuthors.map((author) => {
            if (typeof author !== 'object') return null
            return (
              <Link
                href={{ pathname: `/${author.username}` }}
                className="flex items-center gap-2  "
                key={author.id}
              >
                <UserIcon className=" w-5 h-5" />
                <span className="font-medium text-xs ">{author.name}</span>
              </Link>
            )
          })}

        <p className="text-xs flex items-center gap-2 ">
          <Calendar className="w-5 h-5" />
          <span className="">
            {publishedAt &&
              new Date(publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
          </span>
        </p>

        {categories &&
          categories.map((category) => {
            if (typeof category !== 'object') return null
            return (
              <Link
                key={category.id}
                className="flex items-center gap-2  "
                href={{ pathname: `/categories/${category.slug}` }}
              >
                <Boxes className=" w-5 h-5" />
                <span className="font-medium text-xs ">{category.name}</span>
              </Link>
            )
          })}
      </GridCardSection>
    </GridCard>
  )
}

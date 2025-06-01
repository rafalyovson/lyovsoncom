import { BriefcaseBusiness, Calendar, User as UserIcon } from 'lucide-react'
import Link from 'next/link'

import { GridCard, GridCardSection } from '@/components/grid'
import { Media } from '@/components/Media'
import { Badge } from '@/components/ui/badge'
import { Post } from '@/payload-types'

export type GridCardPostProps = {
  post: Post
  className?: string
  loading?: 'lazy' | 'eager'
  fetchPriority?: 'high' | 'low' | 'auto'
  priority?: boolean
}

export const GridCardPostFull = ({
  post,
  className,
  loading,
  fetchPriority,
  priority,
}: GridCardPostProps) => {
  const {
    type,
    topics,
    project,
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

      <GridCardSection
        className={`row-start-1 row-end-2 col-start-3 col-end-4 flex flex-col gap-2 justify-end items-center`}
      >
        {/* {type && typeof type === 'object' && (
          <Link className={`text-xs font-semibold`} href={{ pathname: `/types/${type.slug}` }}>
            <Badge variant="outline">{type.name}</Badge>
          </Link>
        )} */}

        {/* {project && typeof project === 'object' && (
          <Link className={`text-xs font-semibold`} href={{ pathname: `/${project.slug}` }}>
            <Badge variant="secondary">{project.name}</Badge>
          </Link>
        )} */}

        {topics &&
          topics.map((topic) => {
            if (typeof topic !== 'object') return null
            const style = topic.color ? { backgroundColor: topic.color } : {}
            return (
              <Link
                className={`text-xs font-semibold w-full`}
                key={topic.id}
                href={{ pathname: `/topics/${topic.slug}` }}
              >
                <Badge variant="default" style={style} className="w-full">{`${topic.name}`}</Badge>
              </Link>
            )
          })}
      </GridCardSection>

      <GridCardSection
        className={`row-start-2 row-end-3 col-start-3 col-end-4 flex flex-col gap-2 justify-evenly`}
      >
        {populatedAuthors &&
          populatedAuthors.map((author) => {
            if (typeof author !== 'object') return null
            return (
              <Link
                href={{ pathname: `/${author.username}` }}
                className="flex items-center gap-2"
                key={author.id}
              >
                <UserIcon className="w-5 h-5" />
                <span className="font-medium text-xs">{author.name?.replace(' Lyovson', '')}</span>
              </Link>
            )
          })}

        <p className="text-xs flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          <span>
            {publishedAt &&
              new Date(publishedAt).toLocaleDateString('en-GB', {
                year: '2-digit',
                month: 'short',
                day: '2-digit',
              })}
          </span>
        </p>
        {project && typeof project === 'object' && (
          // <Link className={`text-xs font-semibold`} href={{ pathname: `/${project.slug}` }}>
          //   <Badge variant="secondary">{project.name}</Badge>
          // </Link>
          <Link
            href={{ pathname: `/${project.slug}` }}
            className="flex items-center gap-2"
            key={project.id}
          >
            <BriefcaseBusiness className="w-5 h-5" />
            <span className="font-medium text-xs">{project.name}</span>
          </Link>
        )}
      </GridCardSection>
    </GridCard>
  )
}

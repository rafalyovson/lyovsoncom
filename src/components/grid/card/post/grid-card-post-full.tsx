import { Atom, BriefcaseBusiness, Calendar, Flower, PenTool, User as UserIcon } from 'lucide-react'
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
  const { type, topics, project, populatedAuthors, featuredImage, publishedAt, title, slug } = post

  const postUrl =
    project && typeof project === 'object' ? `/${project.slug}/${slug}` : `/posts/${slug}`

  return (
    <GridCard className={className}>
      {featuredImage && typeof featuredImage !== 'string' && (
        <GridCardSection className={`row-start-1 row-end-3 col-start-1 col-end-3`}>
          <Link
            href={postUrl}
            className="block h-full group overflow-hidden rounded-lg"
            aria-label={`Read "${title}"`}
          >
            <Media
              imgClassName="object-cover h-full"
              resource={featuredImage}
              pictureClassName="h-full"
              className="glass-media h-full flex justify-center items-center"
              {...(loading ? { loading } : {})}
              {...(fetchPriority ? { fetchPriority } : {})}
              {...(priority ? { priority } : {})}
            />
          </Link>
        </GridCardSection>
      )}

      <GridCardSection
        className={`row-start-3 row-end-4 col-start-1 col-end-4 h-full flex flex-col justify-center glass-interactive`}
      >
        <Link href={postUrl} className="block group">
          <h2
            className={`text-xl font-bold text-center glass-text group-hover:text-[var(--glass-text-secondary)] transition-colors duration-300`}
          >
            {title}
          </h2>
        </Link>
      </GridCardSection>

      <GridCardSection
        className={`row-start-1 row-end-2 col-start-3 col-end-4 flex flex-col gap-2 justify-end items-center`}
      >
        {topics &&
          topics.map((topic, index) => {
            if (typeof topic !== 'object') return null
            return (
              <Link
                className={`text-xs font-semibold w-full glass-stagger-${Math.min(index + 1, 6)}`}
                key={topic.id}
                href={{ pathname: `/topics/${topic.slug}` }}
                aria-label={`View posts about ${topic.name}`}
              >
                <Badge
                  variant="default"
                  style={{
                    backgroundColor: topic.color || 'var(--glass-bg)',
                    color: 'var(--glass-text)',
                  }}
                  className="w-full glass-badge glass-text shadow-md"
                >
                  {topic.name}
                </Badge>
              </Link>
            )
          })}
      </GridCardSection>

      <GridCardSection
        className={`row-start-2 row-end-3 col-start-3 col-end-4 flex flex-col gap-2 justify-evenly`}
      >
        {populatedAuthors &&
          populatedAuthors.map((author, index) => {
            if (typeof author !== 'object') return null
            return (
              <Link
                href={{ pathname: `/${author.username}` }}
                className={`flex items-center gap-2 glass-text hover:text-[var(--glass-text-secondary)] transition-colors duration-300 glass-interactive glass-stagger-${Math.min(index + 1, 6)}`}
                key={author.id}
                aria-label={`View ${author.name}'s profile`}
              >
                <PenTool className="w-5 h-5" aria-hidden="true" />
                <span className="font-medium text-xs">{author.name?.replace(' Lyovson', '')}</span>
              </Link>
            )
          })}

        <div className="text-xs flex items-center gap-2 glass-text-secondary">
          <Calendar className="w-5 h-5" aria-hidden="true" />
          <time dateTime={publishedAt || undefined}>
            {publishedAt &&
              new Date(publishedAt).toLocaleDateString('en-GB', {
                year: '2-digit',
                month: 'short',
                day: '2-digit',
              })}
          </time>
        </div>

        {project && typeof project === 'object' && (
          <Link
            href={{ pathname: `/${project.slug}` }}
            className="flex items-center gap-2 glass-text hover:text-[var(--glass-text-secondary)] transition-colors duration-300 glass-interactive"
            key={project.id}
            aria-label={`View ${project.name} project`}
          >
            <BriefcaseBusiness className="w-5 h-5" aria-hidden="true" />
            <span className="font-medium text-xs">{project.name}</span>
          </Link>
        )}
      </GridCardSection>
    </GridCard>
  )
}

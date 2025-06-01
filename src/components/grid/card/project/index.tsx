import Link from 'next/link'

import { GridCard, GridCardSection } from '@/components/grid'
import { Media } from '@/components/Media'
import { Project } from '@/payload-types'

export type GridCardProjectProps = {
  project: Project
  className?: string
  loading?: 'lazy' | 'eager'
  fetchPriority?: 'high' | 'low' | 'auto'
  priority?: boolean
}

export const GridCardProject = ({
  project,
  className,
  loading,
  fetchPriority,
  priority,
}: GridCardProjectProps) => {
  const { name, slug } = project

  return (
    <Link href={`/${slug}`}>
      <GridCard className={className}>
        {project.image && typeof project.image !== 'string' && (
          <GridCardSection className={`row-start-1 row-end-3 col-start-1 col-end-4`}>
            <Media
              imgClassName="-z-10 object-cover h-full"
              resource={project.image}
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
          <h1 className={`text-xl text-bold text-center`}>{name}</h1>
        </GridCardSection>
      </GridCard>
    </Link>
  )
}

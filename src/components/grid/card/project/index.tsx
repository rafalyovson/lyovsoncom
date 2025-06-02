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
    <Link href={`/${slug}`} className="group glass-interactive" aria-label={`View ${name} project`}>
      <GridCard className={`${className}`}>
        {project.image && typeof project.image !== 'string' && (
          <GridCardSection className={`row-start-1 row-end-3 col-start-1 col-end-4`}>
            <Media
              imgClassName="object-cover h-full"
              resource={project.image}
              pictureClassName="h-full"
              className="glass-media h-full flex justify-center items-center"
              {...(loading ? { loading } : {})}
              {...(fetchPriority ? { fetchPriority } : {})}
              {...(priority ? { priority } : {})}
            />
          </GridCardSection>
        )}
        <GridCardSection
          className={`row-start-3 row-end-4 col-start-1 col-end-4 h-full flex flex-col justify-center glass-interactive`}
        >
          <h1
            className={`text-xl font-bold text-center glass-text group-hover:text-[var(--glass-text-secondary)] transition-colors duration-300`}
          >
            {name}
          </h1>
        </GridCardSection>
      </GridCard>
    </Link>
  )
}

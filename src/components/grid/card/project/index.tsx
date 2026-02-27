import Link from "next/link";
import { GridCard, GridCardSection } from "@/components/grid";
import { Media } from "@/components/Media";
import type { Project } from "@/payload-types";

export interface GridCardProjectProps {
  className?: string;
  fetchPriority?: "high" | "low" | "auto";
  loading?: "lazy" | "eager";
  priority?: boolean;
  project: Project;
}

export const GridCardProject = ({
  project,
  className,
  loading,
  fetchPriority,
  priority,
}: GridCardProjectProps) => {
  const { name, slug } = project;
  const projectHref = slug ? `/projects/${slug}` : "/projects";

  return (
    <Link
      aria-label={`View ${name} project`}
      className="group glass-interactive"
      href={projectHref}
    >
      <GridCard className={className}>
        {project.image && typeof project.image !== "string" && (
          <GridCardSection
            className="col-start-1 col-end-4 row-start-1 row-end-3"
            flush={true}
          >
            <Media
              className="glass-media flex h-full items-center justify-center"
              imgClassName="object-cover h-full"
              pictureClassName="h-full"
              resource={project.image}
              {...(loading ? { loading } : {})}
              {...(fetchPriority ? { fetchPriority } : {})}
              {...(priority ? { priority } : {})}
            />
          </GridCardSection>
        )}
        <GridCardSection className="col-start-1 col-end-4 row-start-3 row-end-4 flex h-full flex-col justify-center">
          <h2
            className={
              "glass-text text-center font-bold text-xl transition-colors duration-300 group-hover:text-[var(--glass-text-secondary)]"
            }
          >
            {name}
          </h2>
        </GridCardSection>
      </GridCard>
    </Link>
  );
};

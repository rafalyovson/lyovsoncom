import { BriefcaseBusiness, Calendar, PenTool } from "lucide-react";
import Link from "next/link";

import { GridCard, GridCardSection } from "@/components/grid";
import { Media } from "@/components/Media";
import { Badge } from "@/components/ui/badge";
import type { Post } from "@/payload-types";

export type GridCardPostProps = {
  post: Post;
  className?: string;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
  priority?: boolean;
};

export const GridCardPostFull = ({
  post,
  className,
  loading,
  fetchPriority,
  priority,
}: GridCardPostProps) => {
  const {
    topics,
    project,
    populatedAuthors,
    featuredImage,
    publishedAt,
    title,
    slug,
  } = post;

  const postUrl = `/posts/${slug}`;

  return (
    <GridCard className={className}>
      {featuredImage && typeof featuredImage !== "string" && (
        <GridCardSection
          className={"col-start-1 col-end-3 row-start-1 row-end-3"}
        >
          <Link
            aria-label={`Read "${title}"`}
            className="group block h-full overflow-hidden rounded-lg"
            href={postUrl}
          >
            <Media
              className="glass-media flex h-full items-center justify-center"
              imgClassName="object-cover h-full"
              pictureClassName="h-full"
              resource={featuredImage}
              {...(loading ? { loading } : {})}
              {...(fetchPriority ? { fetchPriority } : {})}
              {...(priority ? { priority } : {})}
            />
          </Link>
        </GridCardSection>
      )}

      <GridCardSection
        className={
          "col-start-1 col-end-4 row-start-3 row-end-4 flex h-full flex-col justify-center"
        }
      >
        <Link className="group block" href={postUrl}>
          <h2
            className={
              "glass-text text-center font-bold text-xl transition-colors duration-300 group-hover:text-[var(--glass-text-secondary)]"
            }
          >
            {title}
          </h2>
        </Link>
      </GridCardSection>

      <GridCardSection
        className={
          "col-start-3 col-end-4 row-start-1 row-end-2 flex flex-col items-center justify-end gap-2"
        }
      >
        {topics?.map((topic, index) => {
          if (typeof topic !== "object" || !topic.slug) {
            return null;
          }
          return (
            <Link
              aria-label={`View posts about ${topic.name}`}
              className={`w-full font-semibold text-xs glass-stagger-${Math.min(index + 1, 6)}`}
              href={{ pathname: `/topics/${topic.slug}` }}
              key={topic.id}
            >
              <Badge
                className="glass-badge glass-text w-full shadow-md"
                style={{
                  backgroundColor: topic.color || "var(--glass-bg)",
                  color: "var(--glass-text)",
                }}
                variant="default"
              >
                {topic.name}
              </Badge>
            </Link>
          );
        })}
      </GridCardSection>

      <GridCardSection
        className={
          "col-start-3 col-end-4 row-start-2 row-end-3 flex flex-col justify-evenly gap-2"
        }
      >
        {populatedAuthors?.map((author, index) => {
          if (typeof author !== "object") {
            return null;
          }
          return (
            <Link
              aria-label={`View ${author.name}'s profile`}
              className={`glass-text glass-interactive flex items-center gap-2 transition-colors duration-300 hover:text-[var(--glass-text-secondary)] glass-stagger-${Math.min(index + 1, 6)}`}
              href={{ pathname: `/${author.username}` }}
              key={author.id}
            >
              <PenTool aria-hidden="true" className="h-5 w-5" />
              <span className="font-medium text-xs">
                {author.name?.replace(" Lyovson", "")}
              </span>
            </Link>
          );
        })}

        <div className="glass-text-secondary flex items-center gap-2 text-xs">
          <Calendar aria-hidden="true" className="h-5 w-5" />
          <time dateTime={publishedAt || undefined}>
            {publishedAt &&
              new Date(publishedAt).toLocaleDateString("en-GB", {
                year: "2-digit",
                month: "short",
                day: "2-digit",
              })}
          </time>
        </div>

        {project && typeof project === "object" && (
          <Link
            aria-label={`View ${project.name} project`}
            className="glass-text glass-interactive flex items-center gap-2 transition-colors duration-300 hover:text-[var(--glass-text-secondary)]"
            href={{ pathname: `/projects/${project.slug}` }}
            key={project.id}
          >
            <BriefcaseBusiness aria-hidden="true" className="h-5 w-5" />
            <span className="font-medium text-xs">{project.name}</span>
          </Link>
        )}
      </GridCardSection>
    </GridCard>
  );
};

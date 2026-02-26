import {
  BriefcaseBusiness,
  Calendar,
  Camera,
  FileText,
  Mic,
  PenTool,
  Star,
  Video,
} from "lucide-react";
import Link from "next/link";

import { GridCard, GridCardSection } from "@/components/grid";
import { Media } from "@/components/Media";
import { Badge } from "@/components/ui/badge";
import type { Post } from "@/payload-types";
import { getTopicBadgeStyle } from "@/utilities/topicBadgeStyle";

const MAX_STAGGER_INDEX = 6;

export interface GridCardPostProps {
  className?: string;
  loading?: "lazy" | "eager";
  post: Post;
  priority?: boolean;
}

interface ProjectLinkData {
  href: string;
  key: number | string;
  label: string;
}

function getStaggerClass(index: number): string {
  return `glass-stagger-${Math.min(index + 1, MAX_STAGGER_INDEX)}`;
}

function getProjectLinkData(project: Post["project"]): ProjectLinkData | null {
  if (!project) {
    return null;
  }

  if (typeof project === "number" || typeof project === "string") {
    return {
      href: "/projects",
      key: project,
      label: "Project",
    };
  }

  const projectName =
    typeof project.name === "string" && project.name.trim().length > 0
      ? project.name
      : "Project";
  const projectSlug =
    typeof project.slug === "string" && project.slug.trim().length > 0
      ? project.slug
      : null;

  return {
    href: projectSlug ? `/projects/${projectSlug}` : "/projects",
    key: project.id ?? projectName,
    label: projectName,
  };
}

export const GridCardPostFull = ({
  post,
  className,
  loading,
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
    type,
  } = post;

  const postUrl = `/posts/${slug}`;
  const postType = type || "article";
  const projectLink = getProjectLinkData(project);
  const iconClassName =
    "glass-text h-5 w-5 transition-colors duration-300 group-hover:text-[var(--glass-text-secondary)]";

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
              {...(priority ? { priority } : {})}
            />
          </Link>
        </GridCardSection>
      )}

      <GridCardSection
        className={
          "col-start-1 col-end-3 row-start-3 row-end-4 flex h-full flex-col justify-center"
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
          "col-start-3 col-end-4 row-start-3 row-end-4 flex h-full flex-col items-center justify-center gap-1"
        }
      >
        <Link
          className="group block flex flex-col items-center gap-1"
          href={postUrl}
        >
          {postType === "article" && (
            <FileText aria-hidden="true" className={iconClassName} />
          )}
          {postType === "review" && (
            <Star aria-hidden="true" className={iconClassName} />
          )}
          {postType === "video" && (
            <Video aria-hidden="true" className={iconClassName} />
          )}
          {postType === "podcast" && (
            <Mic aria-hidden="true" className={iconClassName} />
          )}
          {postType === "photo" && (
            <Camera aria-hidden="true" className={iconClassName} />
          )}
          {!["article", "review", "video", "podcast", "photo"].includes(
            postType
          ) && <FileText aria-hidden="true" className={iconClassName} />}
          <span className="glass-text-secondary text-xs capitalize transition-colors duration-300 group-hover:text-[var(--glass-text-secondary)]">
            {postType}
          </span>
        </Link>
      </GridCardSection>

      <GridCardSection
        className={
          "col-start-3 col-end-4 row-start-1 row-end-2 flex flex-col items-center justify-end gap-2"
        }
      >
        {topics
          ?.filter((topic, index, self) => {
            // Deduplicate topics by ID
            if (typeof topic !== "object" || !topic?.id) {
              return false;
            }
            return (
              index ===
              self.findIndex((t) => typeof t === "object" && t?.id === topic.id)
            );
          })
          .map((topic, index) => {
            if (typeof topic !== "object" || !topic?.slug || !topic?.id) {
              return null;
            }
            return (
              <Link
                aria-label={`View posts about ${topic.name}`}
                className={`w-full font-semibold text-xs ${getStaggerClass(index)}`}
                href={{ pathname: `/topics/${topic.slug}` }}
                key={topic.id}
              >
                <Badge
                  className="glass-badge glass-text w-full shadow-md"
                  style={getTopicBadgeStyle(topic.color)}
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
        {populatedAuthors
          ?.filter((author, index, self) => {
            // Deduplicate authors by ID
            if (typeof author !== "object" || !author?.id) {
              return false;
            }
            return (
              index ===
              self.findIndex(
                (a) => typeof a === "object" && a?.id === author.id
              )
            );
          })
          .map((author, index) => {
            if (typeof author !== "object") {
              return null;
            }
            return (
              <Link
                aria-label={`View ${author.name}'s profile`}
                className={`glass-text glass-interactive flex items-center gap-2 transition-colors duration-300 hover:text-[var(--glass-text-secondary)] ${getStaggerClass(index)}`}
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

        {projectLink && (
          <Link
            aria-label={`View ${projectLink.label} project`}
            className="glass-text glass-interactive flex items-center gap-2 transition-colors duration-300 hover:text-[var(--glass-text-secondary)]"
            href={{ pathname: projectLink.href }}
            key={projectLink.key}
          >
            <BriefcaseBusiness aria-hidden="true" className="h-5 w-5" />
            <span className="font-medium text-xs">{projectLink.label}</span>
          </Link>
        )}
      </GridCardSection>
    </GridCard>
  );
};

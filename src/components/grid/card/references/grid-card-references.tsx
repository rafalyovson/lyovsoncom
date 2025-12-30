import {
  Book,
  Building2,
  ExternalLink,
  Film,
  Gamepad2,
  Headphones,
  Link as LinkIcon,
  Mic,
  Music,
  User,
  Video,
} from "lucide-react";
import Link from "next/link";

import { GridCard, GridCardSection } from "@/components/grid";
import { Media } from "@/components/Media";
import { cn } from "@/lib/utils";
import type { Reference } from "@/payload-types";

export type GridCardReferencesProps = {
  references: Array<number | Reference>;
  className?: string;
};

const referenceTypeIcons: Record<string, typeof Book> = {
  book: Book,
  movie: Film,
  tvShow: Film,
  videoGame: Gamepad2,
  music: Music,
  podcast: Mic,
  series: Book,
  person: User,
  company: Building2,
  website: LinkIcon,
  article: LinkIcon,
  video: Video,
  repository: LinkIcon,
  tool: LinkIcon,
  social: LinkIcon,
  other: LinkIcon,
};

const referenceTypeLabels: Record<string, string> = {
  book: "Book",
  movie: "Movie",
  tvShow: "TV Show",
  videoGame: "Game",
  music: "Music",
  podcast: "Podcast",
  series: "Series",
  person: "Person",
  company: "Company",
  website: "Website",
  article: "Article",
  video: "Video",
  repository: "Repository",
  tool: "Tool",
  social: "Social",
  other: "Other",
};

const webMediaTypes = [
  "website",
  "article",
  "video",
  "repository",
  "tool",
  "social",
];

export const GridCardReferences = ({
  references,
  className,
}: GridCardReferencesProps) => {
  if (!references || references.length === 0) {
    return null;
  }

  const validReferences = references.filter(
    (ref): ref is Reference =>
      typeof ref === "object" && ref !== null && "title" in ref
  );

  if (validReferences.length === 0) {
    return null;
  }

  return (
    <GridCard className={cn("col-span-1", className)}>
      <GridCardSection className="col-start-1 col-end-4 row-start-1 row-end-2 flex items-center justify-center">
        <h3 className="glass-text font-bold text-lg">References</h3>
      </GridCardSection>

      <GridCardSection className="col-start-1 col-end-4 row-start-2 row-end-4 flex flex-col gap-2 overflow-y-auto">
        {validReferences.map((reference, index) => {
          const IconComponent =
            referenceTypeIcons[reference.type] || referenceTypeIcons.other;
          const typeLabel =
            referenceTypeLabels[reference.type] || reference.type;
          const hasUrl =
            webMediaTypes.includes(reference.type) && reference.url;

          const imageObj =
            typeof reference.image === "object" && reference.image !== null
              ? reference.image
              : null;

          const content = (
            <div
              className={cn(
                "glass-interactive flex items-center gap-3 rounded-lg p-2 transition-colors duration-300",
                hasUrl && "hover:bg-[var(--glass-bg-hover)]"
              )}
            >
              {imageObj && (
                <div className="flex-shrink-0">
                  <Media
                    className="glass-media h-12 w-12 rounded"
                    imgClassName="object-cover h-full w-full"
                    pictureClassName="h-12 w-12"
                    resource={imageObj}
                  />
                </div>
              )}
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="glass-text flex items-center gap-2 font-medium text-sm">
                  <IconComponent
                    aria-hidden="true"
                    className="h-4 w-4 flex-shrink-0"
                  />
                  <span className="truncate">{reference.title}</span>
                </div>
                <div className="glass-text-secondary text-xs">{typeLabel}</div>
                {reference.description && (
                  <p className="glass-text-secondary line-clamp-2 text-xs">
                    {reference.description}
                  </p>
                )}
              </div>
              {hasUrl && (
                <ExternalLink
                  aria-hidden="true"
                  className="h-4 w-4 flex-shrink-0 text-[var(--glass-text-secondary)]"
                />
              )}
            </div>
          );

          if (hasUrl) {
            return (
              <a
                href={reference.url || undefined}
                key={reference.id}
                rel="noopener"
                target="_blank"
              >
                {content}
              </a>
            );
          }

          return <div key={reference.id}>{content}</div>;
        })}
      </GridCardSection>
    </GridCard>
  );
};

import { Brain, Calendar, PenTool, Quote } from "lucide-react";
import Link from "next/link";
import { GridCard } from "@/components/grid";
import { Media } from "@/components/Media";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Activity, Note, Post, Reference } from "@/payload-types";
import { GridCardSection } from "../section";

export const GridCardHero = ({
  className,
  post,
}: {
  className?: string;
  post: Post;
}) => {
  return (
    <GridCard
      className={cn(
        "col-start-1 col-end-2 row-start-2 row-end-4 h-[816px] w-[400px] grid-rows-6",
        "g2:col-start-2 g2:col-end-3 g2:row-start-1 g2:row-end-3",
        "g3:col-start-2 g3:col-end-4 g3:row-start-1 g3:row-end-2 g3:h-[400px] g3:w-[816px] g3:grid-cols-6 g3:grid-rows-3",
        "g4:self-start",
        className
      )}
    >
      {post.featuredImage && typeof post.featuredImage !== "string" && (
        <GridCardSection
          className={cn(
            "col-start-1 col-end-4 row-start-1 row-end-4",
            "g3:col-start-1 g3:col-end-4 g3:row-start-1 g3:row-end-4"
          )}
        >
          <Media
            className="glass-media flex h-full items-center justify-center"
            imgClassName="object-cover h-full"
            pictureClassName="h-full"
            priority={true}
            resource={post.featuredImage}
          />
        </GridCardSection>
      )}
      <GridCardSection
        className={
          "col-start-1 g3:col-start-4 col-end-4 g3:col-end-8 g3:row-start-1 row-start-4 g3:row-end-4 row-end-8"
        }
      >
        <Link
          aria-label={`Featured post: ${post.title}`}
          className="group flex h-full flex-col items-center justify-center px-4 md:px-8"
          href="/"
        >
          <div className="mx-auto w-full max-w-3xl space-y-4">
            <h1
              className={
                "glass-text text-center font-bold text-2xl transition-colors duration-300 group-hover:text-[var(--glass-text-secondary)] md:text-3xl lg:text-4xl"
              }
            >
              {post.title}
            </h1>
            {post.description && (
              <p
                className={
                  "glass-text-secondary text-left text-base leading-relaxed"
                }
              >
                {post.description}
              </p>
            )}
          </div>
        </Link>
      </GridCardSection>
    </GridCard>
  );
};

export const GridCardHeroNote = ({
  className,
  note,
  references,
}: {
  className?: string;
  note: Note;
  references?: Array<number | Reference>;
}) => {
  const isQuoteType = note.type === "quote";
  const typeLabel = isQuoteType ? "quote" : "thought";

  // Limit references to 3
  const validReferences = (references || [])
    .filter(
      (ref): ref is Reference =>
        typeof ref === "object" && ref !== null && "title" in ref
    )
    .slice(0, 3);

  return (
    <GridCard
      className={cn(
        "col-start-1 col-end-2 row-start-2 row-end-4 h-[816px] w-[400px] grid-rows-6",
        "g2:col-start-2 g2:col-end-3 g2:row-start-1 g2:row-end-3",
        "g3:col-start-2 g3:col-end-4 g3:row-start-1 g3:row-end-2 g3:h-[400px] g3:w-[816px] g3:grid-cols-6 g3:grid-rows-3",
        "g4:self-start",
        className
      )}
    >
      {/* Top section (2 rows, 3 columns) - Note Title */}
      <GridCardSection
        className={cn(
          "col-start-1 col-end-4 row-start-1 row-end-3 flex h-full flex-col items-center justify-center px-6 py-6",
          "g3:col-start-1 g3:col-end-4 g3:row-start-1 g3:row-end-3"
        )}
      >
        <h1 className="glass-text g3:text-left text-center font-bold text-2xl transition-colors duration-300">
          {note.title}
        </h1>
      </GridCardSection>

      {/* Bottom row - Type, Author+Date, Topics */}
      <GridCardSection
        className={cn(
          "col-start-1 col-end-2 row-start-3 row-end-4 flex h-full flex-col items-center justify-center gap-1",
          "g3:col-start-1 g3:col-end-2 g3:row-start-3 g3:row-end-4"
        )}
      >
        {isQuoteType ? (
          <Quote
            aria-hidden="true"
            className="glass-text h-5 w-5 transition-colors duration-300"
          />
        ) : (
          <Brain
            aria-hidden="true"
            className="glass-text h-5 w-5 transition-colors duration-300"
          />
        )}
        <span className="glass-text-secondary text-xs capitalize">
          {typeLabel}
        </span>
      </GridCardSection>

      <GridCardSection
        className={cn(
          "col-start-2 col-end-3 row-start-3 row-end-4 flex flex-col justify-evenly gap-2",
          "g3:col-start-2 g3:col-end-3 g3:row-start-3 g3:row-end-4"
        )}
      >
        {note.author && (
          <div className="glass-text-secondary flex items-center gap-2 text-xs capitalize">
            <PenTool aria-hidden="true" className="h-5 w-5" />
            <span className="font-medium">{note.author}</span>
          </div>
        )}

        {note.publishedAt && (
          <div className="glass-text-secondary flex items-center gap-2 text-xs">
            <Calendar aria-hidden="true" className="h-5 w-5" />
            <time dateTime={note.publishedAt}>
              {new Date(note.publishedAt).toLocaleDateString("en-GB", {
                year: "2-digit",
                month: "short",
                day: "2-digit",
              })}
            </time>
          </div>
        )}
      </GridCardSection>

      <GridCardSection
        className={cn(
          "col-start-3 col-end-4 row-start-3 row-end-4 flex flex-col items-center justify-end gap-2",
          "g3:col-start-3 g3:col-end-4 g3:row-start-3 g3:row-end-4"
        )}
      >
        {note.topics
          ?.filter((topic, index, self) => {
            if (typeof topic !== "object" || !topic?.id) {
              return false;
            }
            return (
              index ===
              self.findIndex((t) => typeof t === "object" && t?.id === topic.id)
            );
          })
          .map((topic) => {
            if (typeof topic !== "object" || !topic?.slug || !topic?.id) {
              return null;
            }
            return (
              <Link
                aria-label={`View notes about ${topic.name}`}
                className="w-full font-semibold text-xs"
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

      {/* References section - Bottom on mobile (rows 4-6), Right on desktop (cols 4-6, rows 1-3) */}
      {validReferences.map((reference, index) => {
        const imageObj =
          typeof reference.image === "object" && reference.image !== null
            ? reference.image
            : null;

        // Mobile: rows 4, 5, 6 (one per row)
        // Desktop: columns 4-6, rows 1, 2, 3 (one per row)
        const mobileRowClasses = [
          index === 0 && "row-start-4 row-end-5",
          index === 1 && "row-start-5 row-end-6",
          index === 2 && "row-start-6 row-end-7",
        ].filter(Boolean);

        const desktopRowClasses = [
          index === 0 && "g3:row-start-1 g3:row-end-2",
          index === 1 && "g3:row-start-2 g3:row-end-3",
          index === 2 && "g3:row-start-3 g3:row-end-4",
        ].filter(Boolean);

        return (
          <GridCardSection
            className={cn(
              "col-start-1 col-end-4 flex items-center gap-2",
              "g3:col-start-4 g3:col-end-7",
              ...mobileRowClasses,
              ...desktopRowClasses
            )}
            key={reference.id}
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
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="glass-text truncate font-medium text-sm">
                {reference.title}
              </span>
            </div>
          </GridCardSection>
        );
      })}
    </GridCard>
  );
};

export const GridCardHeroActivity = ({
  className,
  activity,
  title,
}: {
  className?: string;
  activity: Activity;
  title: string;
}) => {
  const referenceObj =
    typeof activity.reference === "object" && activity.reference !== null
      ? activity.reference
      : null;

  const referenceImage =
    referenceObj?.image && typeof referenceObj.image === "object"
      ? referenceObj.image
      : null;

  return (
    <GridCard
      className={cn(
        "col-start-1 col-end-2 row-start-2 row-end-4 h-[816px] w-[400px] grid-rows-6",
        "g2:col-start-2 g2:col-end-3 g2:row-start-1 g2:row-end-3",
        "g3:col-start-2 g3:col-end-4 g3:row-start-1 g3:row-end-2 g3:h-[400px] g3:w-[816px] g3:grid-cols-6 g3:grid-rows-3",
        "g4:self-start",
        className
      )}
    >
      {referenceImage && (
        <GridCardSection
          className={cn(
            "col-start-1 col-end-4 row-start-1 row-end-4",
            "g3:col-start-1 g3:col-end-4 g3:row-start-1 g3:row-end-4"
          )}
        >
          <Media
            className="glass-media flex h-full items-center justify-center"
            imgClassName="object-cover h-full"
            pictureClassName="h-full"
            priority={true}
            resource={referenceImage}
          />
        </GridCardSection>
      )}
      <GridCardSection
        className={
          "col-start-1 g3:col-start-4 col-end-4 g3:col-end-8 g3:row-start-1 row-start-4 g3:row-end-4 row-end-8"
        }
      >
        <div className="flex h-full flex-col items-center justify-center px-4 md:px-8">
          <div className="mx-auto w-full max-w-3xl space-y-4">
            <h1
              className={
                "glass-text text-center font-bold text-2xl transition-colors duration-300 md:text-3xl lg:text-4xl"
              }
            >
              {title}
            </h1>
          </div>
        </div>
      </GridCardSection>
    </GridCard>
  );
};

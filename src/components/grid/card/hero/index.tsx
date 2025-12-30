import Link from "next/link";
import { GridCard } from "@/components/grid";
import { Media } from "@/components/Media";
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
}: {
  className?: string;
  note: Note;
}) => {
  const referenceObj =
    note.type === "quote" &&
    note.sourceReference &&
    typeof note.sourceReference === "object"
      ? (note.sourceReference as Reference)
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
              {note.title}
            </h1>
            {note.type === "quote" && note.quotedPerson && (
              <p className="glass-text-secondary text-center text-base leading-relaxed before:content-['—'] before:mr-2">
                {note.quotedPerson}
              </p>
            )}
          </div>
        </div>
      </GridCardSection>
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

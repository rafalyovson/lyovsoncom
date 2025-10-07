import Link from "next/link";
import { GridCard } from "@/components/grid";
import { Media } from "@/components/Media";
import type { Post } from "@/payload-types";
import { GridCardSection } from "../section";

export const GridCardHero = async ({
  className,
  post,
}: {
  className?: string;
  post: Post;
}) => {
  return (
    <GridCard
      className={`g3:h-[400px] g3:w-[816px] g3:grid-cols-6 overflow-hidden ${className}`}
    >
      {post.featuredImage && typeof post.featuredImage !== "string" && (
        <GridCardSection
          className={"col-start-1 col-end-4 row-start-1 g3:row-end-4 row-end-3"}
        >
          <Media
            className="glass-media flex h-full items-center justify-center"
            imgClassName="object-cover h-full"
            pictureClassName="h-full"
            resource={post.featuredImage}
          />
        </GridCardSection>
      )}
      <GridCardSection
        className={
          "glass-interactive col-start-1 g3:col-start-4 col-end-4 g3:col-end-8 g3:row-start-1 row-start-3 g3:row-end-4 row-end-4"
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
                "glass-text text-center font-bold text-2xl transition-colors duration-300 md:text-3xl lg:text-4xl group-hover:text-[var(--glass-text-secondary)]"
              }
            >
              {post.title}
            </h1>
            {post.description && (
              <p className={"glass-text-secondary text-left text-base leading-relaxed"}>
                {post.description}
              </p>
            )}
          </div>
        </Link>
      </GridCardSection>
    </GridCard>
  );
};

import Link from "next/link";
import { GridCard, GridCardSection } from "@/components/grid";
import { Media } from "@/components/Media";
import { cn } from "@/lib/utils";
import type { Post } from "@/payload-types";

export { GridCardRelatedNotes } from "./grid-card-related-notes";

export const GridCardRelatedPosts = ({
  posts,
  className,
}: {
  posts: (number | Post)[];
  className?: string;
}) => {
  return (
    <GridCard className={cn(className)}>
      {posts.map((post, index) => {
        if (typeof post === "number") {
          return null;
        }
        const rowClass = `row-start-${index + 1} row-end-${index + 2}`;
        const staggerClass = `glass-stagger-${Math.min(index + 1, 6)}`;
        return (
          <Link
            aria-label={`Read related post: ${post.title}`}
            className={cn(
              "group glass-interactive col-start-1 col-end-4",
              rowClass,
              staggerClass
            )}
            href={`/posts/${post.slug}`}
            key={post.id}
          >
            <GridCardSection
              className={"grid h-full grid-cols-3 grid-rows-1 gap-2"}
            >
              {post.featuredImage && (
                <Media
                  className="glass-media flex h-full items-center justify-center"
                  imgClassName="object-cover h-full"
                  pictureClassName="row-start-1 row-end-2 col-start-1 col-end-2 h-full"
                  resource={post.featuredImage}
                />
              )}
              <div className="col-start-2 col-end-4 row-start-1 row-end-2 grid items-center">
                <h2 className="glass-text font-medium transition-colors duration-300 group-hover:text-[var(--glass-text-secondary)]">
                  {post.title}
                </h2>
              </div>
            </GridCardSection>
          </Link>
        );
      })}
    </GridCard>
  );
};
